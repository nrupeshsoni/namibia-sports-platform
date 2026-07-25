/**
 * News Aggregator Edge Function (cron: every 6h).
 * Fetches RSS from verified Namibian sports sources, classifies via Claude,
 * inserts into sportsplatform_news_articles.
 *
 * Auto-publish: trusted sportsOnly feeds that pass Namibia+sports heuristics.
 * Informante: draft only when both sports + Namibia keyword filters pass.
 *
 * Kill-switch: ENABLE_NEWS_AGGREGATOR=true required.
 * See docs/research/NAMIBIAN_SPORTS_NEWS_SOURCES.md
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import Anthropic from "npm:@anthropic-ai/sdk@0.32.1";
import { fetchFeed, fetchOgImage, parseRssItems, resolveImage, type RssItem } from "./rss.ts";
import { safeHttpsSourceUrl } from "./safeUrl.ts";

type RssSource = {
  url: string;
  name: string;
  sportsOnly: boolean;
  /** Google News / mixed — require Namibia signals before auto-publish. */
  requireNamibia: boolean;
};

const RSS_SOURCES: RssSource[] = [
  { url: "https://neweralive.na/category/sports/feed/", name: "New Era", sportsOnly: true, requireNamibia: false },
  {
    url: "https://news.google.com/rss/search?q=Namibia+sports&hl=en-NA&gl=NA&ceid=NA:en",
    name: "Google News (Namibia sports)",
    sportsOnly: true,
    requireNamibia: true,
  },
  {
    url: "https://news.google.com/rss/search?q=site:namibian.com.na+sport&hl=en&gl=NA&ceid=NA:en",
    name: "The Namibian (via Google News)",
    sportsOnly: true,
    requireNamibia: true,
  },
  { url: "https://economist.com.na/category/sport/feed/", name: "Namibia Economist", sportsOnly: true, requireNamibia: false },
  { url: "https://eaglefm.com.na/category/sport/feed/", name: "Eagle FM", sportsOnly: true, requireNamibia: false },
  { url: "https://informante.web.na/?feed=rss2", name: "Informante", sportsOnly: false, requireNamibia: true },
  { url: "https://confidentenamibia.com/category/sport/feed/", name: "Confidente", sportsOnly: true, requireNamibia: false },
];

const MODEL = "claude-sonnet-4-6";
const SPORT_RE =
  /\b(sport|sports|football|soccer|rugby|cricket|athletics|netball|hockey|boxing|tennis|olympic|paralympic|nfa|nru|gladiators|brave warriors|commonwealth|cosafa|fifa|ioc|nsc|tournament|championship|league|cup|match|athlete|coach|stadium|afrobasket|cycling|swimming|golf)\b/i;
const NAMIBIA_RE =
  /\b(namibia|namibian|windhoek|swakopmund|walvis|oshakati|rundu|keetmanshoop|ondangwa|okahandja|otjiwarongo|gobabis|brave\s*warriors|gladiators|baby\s*gladiators|\bnfa\b|\bnru\b|welwitschia|debmarine)\b|\.na\//i;

type ClaudeResult = {
  isSports: boolean;
  summary: string;
  category: string;
  tags: string[];
  federationHint: string | null;
};

type SourceStats = {
  name: string;
  fetchOk: boolean;
  status?: number;
  items: number;
  inserted: number;
  published: number;
  enriched: number;
  skippedNonSports: number;
  skippedNonNamibia: number;
  skippedExisting: number;
  errors: number;
  note?: string;
  lastError?: string;
};

async function hashUrl(url: string): Promise<string> {
  const data = new TextEncoder().encode(url);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 16);
}

function extractJsonObject(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = (fenced?.[1] ?? text).trim();
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start >= 0 && end > start) return raw.slice(start, end + 1);
  return raw;
}

function keywordFallback(item: RssItem): ClaudeResult {
  return {
    isSports: SPORT_RE.test(`${item.title} ${item.description}`),
    summary: item.description.slice(0, 200),
    category: "sports",
    tags: [],
    federationHint: null,
  };
}

async function processWithClaude(item: RssItem, anthropic: Anthropic): Promise<ClaudeResult> {
  const content = `${item.title}\n\n${item.description}`.slice(0, 3000);
  try {
    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 320,
      messages: [
        {
          role: "user",
          content: `Given this Namibian news RSS snippet, respond with JSON only:
{"isSports":boolean,"summary":"2-3 sentence teaser from the snippet only — do not invent facts","category":"sport e.g. football, rugby, athletics, multi-sport, or other","tags":["tag1","tag2"],"federationHint":"Namibian federation or body name if clearly implied, else null"}
Set isSports false for politics, crime, business, entertainment without a sports angle.
Output only valid JSON.

${content}`,
        },
      ],
    });

    const block = response.content.find((b) => b.type === "text");
    const text = block && "text" in block ? (block as { text: string }).text : "";
    const parsed = JSON.parse(extractJsonObject(text)) as Partial<ClaudeResult>;
    return {
      isSports: parsed.isSports === true,
      summary: typeof parsed.summary === "string" ? parsed.summary : "",
      category: typeof parsed.category === "string" ? parsed.category : "sports",
      tags: Array.isArray(parsed.tags)
        ? parsed.tags.filter((t): t is string => typeof t === "string").slice(0, 5)
        : [],
      federationHint: typeof parsed.federationHint === "string" ? parsed.federationHint : null,
    };
  } catch {
    return keywordFallback(item);
  }
}

type FedRow = { id: number; name: string; slug: string | null };

function matchFederation(feds: FedRow[], hint: string | null): number | null {
  if (!hint) return null;
  const h = hint.toLowerCase().trim();
  const exact = feds.find(
    (f) => f.name.toLowerCase() === h || (f.slug ?? "").toLowerCase() === h
  );
  if (exact) return exact.id;
  const partial = feds.find(
    (f) => f.name.toLowerCase().includes(h) || h.includes(f.name.toLowerCase().slice(0, 12))
  );
  return partial?.id ?? null;
}

function hasNamibiaSignal(item: RssItem): boolean {
  return NAMIBIA_RE.test(`${item.title} ${item.description} ${item.link}`);
}

/** Snippet + attribution footer — not full paywalled republication. */
function buildAttributedContent(item: RssItem, sourceName: string): string {
  const body = item.description || item.title;
  return `${body}\n\n---\nSource: ${sourceName}\n${item.link}\n\nRead the original article at the source link above.`;
}

function publishedAtFromItem(item: RssItem): string {
  if (item.pubDate) {
    const d = new Date(item.pubDate);
    if (!Number.isNaN(d.getTime())) return d.toISOString();
  }
  return new Date().toISOString();
}

Deno.serve(async () => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY");
  const enabled = Deno.env.get("ENABLE_NEWS_AGGREGATOR") === "true";

  if (!enabled) {
    return new Response(
      JSON.stringify({
        success: true,
        inserted: 0,
        published: 0,
        skipped: true,
        reason: "ENABLE_NEWS_AGGREGATOR is not true",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  }

  if (!supabaseUrl || !supabaseKey || !anthropicKey) {
    return new Response(
      JSON.stringify({
        error: "Missing SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, or ANTHROPIC_API_KEY",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const anthropic = new Anthropic({ apiKey: anthropicKey });

  const { data: fedRows } = await supabase
    .from("sportsplatform_federations")
    .select("id, name, slug")
    .eq("is_active", true)
    .limit(200);
  const feds = (fedRows ?? []) as FedRow[];

  let inserted = 0;
  let published = 0;
  let enriched = 0;
  let skippedNonSports = 0;
  let skippedNonNamibia = 0;
  let skippedExisting = 0;
  const sources: SourceStats[] = [];

  for (const source of RSS_SOURCES) {
    const stats: SourceStats = {
      name: source.name,
      fetchOk: false,
      items: 0,
      inserted: 0,
      published: 0,
      enriched: 0,
      skippedNonSports: 0,
      skippedNonNamibia: 0,
      skippedExisting: 0,
      errors: 0,
    };
    sources.push(stats);

    const feed = await fetchFeed(source.url);
    stats.status = feed.status;
    if (!feed.ok || !feed.xml) {
      stats.note = feed.error ?? "fetch failed";
      console.warn(`[news-aggregator] Failed ${source.url}: ${stats.note}`);
      continue;
    }
    stats.fetchOk = true;
    const items = parseRssItems(feed.xml, source.url);
    stats.items = items.length;

    for (const item of items.slice(0, 3)) {
      try {
        if (!source.sportsOnly && !SPORT_RE.test(`${item.title} ${item.description}`)) {
          skippedNonSports++;
          stats.skippedNonSports++;
          continue;
        }

        const namibiaOk = hasNamibiaSignal(item);
        if (source.requireNamibia && !namibiaOk) {
          skippedNonNamibia++;
          stats.skippedNonNamibia++;
          continue;
        }

        const slug = `agg-${await hashUrl(item.link)}`;
        const { data: existing } = await supabase
          .from("sportsplatform_news_articles")
          .select("id, featured_image, is_published, source_url")
          .eq("slug", slug)
          .maybeSingle();

        if (existing) {
          skippedExisting++;
          stats.skippedExisting++;
          const patch: Record<string, unknown> = {};
          if (!existing.featured_image) {
            const img = safeHttpsSourceUrl(await resolveImage(item));
            if (img) {
              patch.featured_image = img;
              enriched++;
              stats.enriched++;
            }
          }
          if (!existing.source_url) {
            const src = safeHttpsSourceUrl(item.link);
            if (src) {
              patch.source_url = src;
              patch.source_name = source.name;
            }
          }
          if (Object.keys(patch).length > 0) {
            await supabase
              .from("sportsplatform_news_articles")
              .update(patch)
              .eq("id", existing.id);
          }
          continue;
        }

        const classified = await processWithClaude(item, anthropic);
        const isSports = source.sportsOnly ? true : classified.isSports;
        if (!isSports) {
          skippedNonSports++;
          stats.skippedNonSports++;
          continue;
        }

        // Trusted sports desks auto-publish; Informante stays draft.
        const autoPublish = source.sportsOnly && (!source.requireNamibia || namibiaOk);
        const federationId = matchFederation(feds, classified.federationHint);
        const tags = [...classified.tags, `source:${source.name}`].slice(0, 8);
        const featuredImage = safeHttpsSourceUrl(await resolveImage(item));
        const sourceUrl = safeHttpsSourceUrl(item.link);
        const publishedAt = autoPublish ? publishedAtFromItem(item) : null;

        const { error } = await supabase.from("sportsplatform_news_articles").insert({
          title: item.title.slice(0, 255),
          slug,
          content: buildAttributedContent(item, source.name),
          summary: classified.summary.slice(0, 500) || null,
          federation_id: federationId,
          author_id: null,
          category: (classified.category || "sports").slice(0, 100),
          tags: tags.length > 0 ? tags : null,
          featured_image: featuredImage,
          source_url: sourceUrl,
          source_name: source.name,
          is_published: autoPublish,
          published_at: publishedAt,
        });

        if (!error) {
          inserted++;
          stats.inserted++;
          if (autoPublish) {
            published++;
            stats.published++;
          }
        } else {
          stats.errors++;
          stats.lastError = `insert: ${error.message}`;
          console.warn(`[news-aggregator] Insert error for ${item.link}:`, error.message);
        }
      } catch (e) {
        stats.errors++;
        const msg = e instanceof Error ? e.message : String(e);
        stats.lastError = msg.slice(0, 300);
        console.warn(`[news-aggregator] Error processing ${item.link}:`, e);
      }
    }
  }

  // Second pass: enrich featured_image for recent feed items already in DB (no Claude).
  for (const source of RSS_SOURCES.filter((s) => s.sportsOnly)) {
    const feed = await fetchFeed(source.url);
    if (!feed.ok || !feed.xml) continue;
    for (const item of parseRssItems(feed.xml, source.url).slice(0, 12)) {
      try {
        const slug = `agg-${await hashUrl(item.link)}`;
        const { data: row } = await supabase
          .from("sportsplatform_news_articles")
          .select("id, featured_image")
          .eq("slug", slug)
          .maybeSingle();
        if (!row || row.featured_image) continue;
        const img = safeHttpsSourceUrl(await resolveImage(item));
        if (!img) continue;
        const { error } = await supabase
          .from("sportsplatform_news_articles")
          .update({ featured_image: img })
          .eq("id", row.id);
        if (!error) enriched++;
      } catch {
        /* timeout-safe: skip */
      }
    }
  }

  // Third pass: backfill published rows missing featured_image via source_url og/twitter.
  let backfilled = 0;
  const { data: missingRows } = await supabase
    .from("sportsplatform_news_articles")
    .select("id, source_url")
    .eq("is_published", true)
    .is("featured_image", null)
    .not("source_url", "is", null)
    .order("published_at", { ascending: false })
    .limit(30);

  for (const row of missingRows ?? []) {
    const url = safeHttpsSourceUrl(
      typeof row.source_url === "string" ? row.source_url : ""
    );
    if (!url) continue;
    try {
      const img = safeHttpsSourceUrl(await fetchOgImage(url));
      if (!img) continue;
      const { error } = await supabase
        .from("sportsplatform_news_articles")
        .update({ featured_image: img })
        .eq("id", row.id)
        .is("featured_image", null);
      if (!error) {
        enriched++;
        backfilled++;
      }
    } catch {
      /* timeout-safe: skip */
    }
  }

  console.log(
    `[news-aggregator] inserted=${inserted} published=${published} enriched=${enriched} ` +
      `backfilled=${backfilled} skippedNonSports=${skippedNonSports} ` +
      `skippedNonNamibia=${skippedNonNamibia} skippedExisting=${skippedExisting}`
  );
  return new Response(
    JSON.stringify({
      success: true,
      inserted,
      published,
      enriched,
      backfilled,
      skippedNonSports,
      skippedNonNamibia,
      skippedExisting,
      sources,
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
});
