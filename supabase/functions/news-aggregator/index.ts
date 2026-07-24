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
  /** When true, skip keyword prefilter (feed is already sports-scoped). */
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
  { url: "https://informante.web.na/?feed=rss2", name: "Informanté", sportsOnly: false },
  { url: "https://confidentenamibia.com/category/sport/feed/", name: "Confidente", sportsOnly: true },
];

const MODEL = "claude-sonnet-4-20250514";
const SPORT_RE =
  /\b(sport|sports|football|soccer|rugby|cricket|athletics|netball|hockey|boxing|tennis|olympic|paralympic|nfa|nru|gladiators|brave warriors|commonwealth|cosafa|fifa|ioc|nsc|tournament|championship|league|cup|match|athlete|coach|stadium)\b/i;

interface RssItem {
  title: string;
  link: string;
  description: string;
  pubDate?: string;
}

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

async function processWithClaude(item: RssItem, anthropic: Anthropic): Promise<ClaudeResult> {
  const content = `${item.title}\n\n${item.description}`.slice(0, 3000);
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
  try {
    const parsed = JSON.parse(text.trim()) as Partial<ClaudeResult>;
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
    return {
      isSports: SPORT_RE.test(`${item.title} ${item.description}`),
      summary: item.description.slice(0, 200),
      category: "sports",
      tags: [],
      federationHint: null,
    };
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

  for (const source of RSS_SOURCES) {
    try {
      const res = await fetch(source.url, {
        headers: { "User-Agent": "NamibiaSportsPlatform/1.0 (+https://sports.com.na)" },
      });
      if (!res.ok) {
        console.warn(`[news-aggregator] Failed to fetch ${source.url}: ${res.status}`);
        continue;
      }
      const xml = await res.text();
      if (!/<rss[\s>]|<feed[\s>]/i.test(xml)) {
        console.warn(`[news-aggregator] Not RSS/Atom: ${source.url}`);
        continue;
      }
      const items = parseRssItems(xml);

      for (const item of items.slice(0, 10)) {
        try {
          if (!source.sportsOnly && !SPORT_RE.test(`${item.title} ${item.description}`)) {
            skippedNonSports++;
            continue;
          }

          const slug = `agg-${await hashUrl(item.link)}`;
          const { data: existing } = await supabase
            .from("sportsplatform_news_articles")
            .select("id")
            .eq("slug", slug)
            .maybeSingle();
          if (existing) continue;

          const classified = await processWithClaude(item, anthropic);
          if (!classified.isSports) {
            skippedNonSports++;
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
            category: classified.category.slice(0, 100) || null,
            tags: tags.length > 0 ? tags : null,
            featured_image: null,
            is_published: false,
            published_at: null,
          });

          if (!error) inserted++;
          else console.warn(`[news-aggregator] Insert error for ${item.link}:`, error.message);
        } catch (e) {
          console.warn(`[news-aggregator] Error processing ${item.link}:`, e);
        }
      }
    } catch (e) {
      console.error(`[news-aggregator] Error fetching ${source.url}:`, e);
    }
  }

  console.log(`[news-aggregator] Inserted ${inserted} drafts; skippedNonSports=${skippedNonSports}`);
  return new Response(JSON.stringify({ success: true, inserted, skippedNonSports }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
