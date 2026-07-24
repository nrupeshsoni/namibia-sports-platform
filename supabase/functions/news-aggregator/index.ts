/**
 * News Aggregator Edge Function (cron: every 6h).
 * Fetches RSS from verified Namibian sports sources, classifies via Claude,
 * inserts draft rows into sportsplatform_news_articles (never auto-publishes).
 *
 * Ops: set ENABLE_NEWS_AGGREGATOR=true to insert. See
 * docs/research/NAMIBIAN_SPORTS_NEWS_SOURCES.md
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import Anthropic from "npm:@anthropic-ai/sdk@0.32.1";

type RssSource = {
  url: string;
  name: string;
  /** When true, feed is sports-scoped — skip keyword prefilter and trust isSports. */
  sportsOnly: boolean;
};

/** Verified working feeds only — see NAMIBIAN_SPORTS_NEWS_SOURCES.md */
const RSS_SOURCES: RssSource[] = [
  { url: "https://neweralive.na/category/sports/feed/", name: "New Era", sportsOnly: true },
  {
    url: "https://news.google.com/rss/search?q=Namibia+sports&hl=en-NA&gl=NA&ceid=NA:en",
    name: "Google News (Namibia sports)",
    sportsOnly: true,
  },
  {
    url: "https://news.google.com/rss/search?q=site:namibian.com.na+sport&hl=en&gl=NA&ceid=NA:en",
    name: "The Namibian (via Google News)",
    sportsOnly: true,
  },
  { url: "https://economist.com.na/category/sport/feed/", name: "Namibia Economist", sportsOnly: true },
  { url: "https://eaglefm.com.na/category/sport/feed/", name: "Eagle FM", sportsOnly: true },
  { url: "https://informante.web.na/?feed=rss2", name: "Informante", sportsOnly: false },
  { url: "https://confidentenamibia.com/category/sport/feed/", name: "Confidente", sportsOnly: true },
];

/** Sonnet 4 (`…20250514`) retired 2026-06-15 — use Sonnet 4.6. */
const MODEL = "claude-sonnet-4-6";
const FETCH_MS = 20_000;
const SPORT_RE =
  /\b(sport|sports|football|soccer|rugby|cricket|athletics|netball|hockey|boxing|tennis|olympic|paralympic|nfa|nru|gladiators|brave warriors|commonwealth|cosafa|fifa|ioc|nsc|tournament|championship|league|cup|match|athlete|coach|stadium|afrobasket|cycling|swimming|golf)\b/i;

interface RssItem {
  title: string;
  link: string;
  description: string;
  pubDate?: string;
}

type SourceStats = {
  name: string;
  fetchOk: boolean;
  status?: number;
  items: number;
  inserted: number;
  skippedNonSports: number;
  skippedExisting: number;
  errors: number;
  note?: string;
  lastError?: string;
};

function decodeEntities(s: string): string {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .trim();
}

function parseRssItems(xml: string): RssItem[] {
  const items: RssItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let m: RegExpExecArray | null;
  while ((m = itemRegex.exec(xml)) !== null) {
    const block = m[1];
    const title = decodeEntities(block.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "");
    const link = (block.match(/<link[^>]*>([\s\S]*?)<\/link>/i)?.[1] ?? "").trim();
    const desc = decodeEntities(
      (block.match(/<description[^>]*>([\s\S]*?)<\/description>/i)?.[1] ?? "").replace(/<[^>]+>/g, "")
    );
    const pubDate = block.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i)?.[1]?.trim();
    if (title && link) items.push({ title, link, description: desc, pubDate });
  }
  if (items.length > 0) return items;

  const entryRegex = /<entry>([\s\S]*?)<\/entry>/gi;
  while ((m = entryRegex.exec(xml)) !== null) {
    const block = m[1];
    const title = decodeEntities(block.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "");
    const link =
      block.match(/<link[^>]*href="([^"]+)"/i)?.[1] ??
      (block.match(/<link[^>]*>([\s\S]*?)<\/link>/i)?.[1] ?? "").trim();
    const desc = decodeEntities(
      (block.match(/<summary[^>]*>([\s\S]*?)<\/summary>/i)?.[1] ?? "").replace(/<[^>]+>/g, "")
    );
    const pubDate = block.match(/<published[^>]*>([\s\S]*?)<\/published>/i)?.[1]?.trim();
    if (title && link) items.push({ title, link, description: desc, pubDate });
  }
  return items;
}

async function hashUrl(url: string): Promise<string> {
  const data = new TextEncoder().encode(url);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 16);
}

type ClaudeResult = {
  isSports: boolean;
  summary: string;
  category: string;
  tags: string[];
  federationHint: string | null;
};

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

function buildAttributedContent(item: RssItem, sourceName: string): string {
  const body = item.description || item.title;
  return `${body}\n\n---\nSource: ${sourceName}\n${item.link}`;
}

async function fetchFeed(url: string): Promise<{ ok: boolean; status?: number; xml?: string; error?: string }> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), FETCH_MS);
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": "NamibiaSportsPlatform/1.0 (+https://sports.com.na)" },
      signal: ctrl.signal,
    });
    if (!res.ok) return { ok: false, status: res.status, error: `HTTP ${res.status}` };
    const xml = await res.text();
    if (!/<rss[\s>]|<feed[\s>]/i.test(xml)) {
      return { ok: false, status: res.status, error: "Not RSS/Atom" };
    }
    return { ok: true, status: res.status, xml };
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, error: msg };
  } finally {
    clearTimeout(timer);
  }
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
  let skippedNonSports = 0;
  let skippedExisting = 0;
  const sources: SourceStats[] = [];

  for (const source of RSS_SOURCES) {
    const stats: SourceStats = {
      name: source.name,
      fetchOk: false,
      items: 0,
      inserted: 0,
      skippedNonSports: 0,
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
    const items = parseRssItems(feed.xml);
    stats.items = items.length;

    // Cap per feed so 6h cron (150s) can finish with sequential Claude calls.
    for (const item of items.slice(0, 3)) {
      try {
        if (!source.sportsOnly && !SPORT_RE.test(`${item.title} ${item.description}`)) {
          skippedNonSports++;
          stats.skippedNonSports++;
          continue;
        }

        const slug = `agg-${await hashUrl(item.link)}`;
        const { data: existing } = await supabase
          .from("sportsplatform_news_articles")
          .select("id")
          .eq("slug", slug)
          .maybeSingle();
        if (existing) {
          skippedExisting++;
          stats.skippedExisting++;
          continue;
        }

        const classified = await processWithClaude(item, anthropic);
        // Category sports feeds are already scoped — do not let Claude veto them.
        const isSports = source.sportsOnly ? true : classified.isSports;
        if (!isSports) {
          skippedNonSports++;
          stats.skippedNonSports++;
          continue;
        }

        const federationId = matchFederation(feds, classified.federationHint);
        const tags = [...classified.tags, `source:${source.name}`].slice(0, 8);

        const { error } = await supabase.from("sportsplatform_news_articles").insert({
          title: item.title.slice(0, 255),
          slug,
          content: buildAttributedContent(item, source.name),
          summary: classified.summary.slice(0, 500) || null,
          federation_id: federationId,
          author_id: null,
          category: (classified.category || "sports").slice(0, 100),
          tags: tags.length > 0 ? tags : null,
          featured_image: null,
          is_published: false,
          published_at: null,
        });

        if (!error) {
          inserted++;
          stats.inserted++;
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

  console.log(
    `[news-aggregator] Inserted ${inserted}; skippedNonSports=${skippedNonSports}; skippedExisting=${skippedExisting}`
  );
  return new Response(
    JSON.stringify({
      success: true,
      inserted,
      skippedNonSports,
      skippedExisting,
      sources,
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
});
