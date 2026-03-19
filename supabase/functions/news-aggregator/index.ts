/**
 * News Aggregator Edge Function (cron: every 6h).
 * Fetches RSS from Namibian sources, categorizes via Claude, inserts into news_articles.
 */

import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import Anthropic from "npm:@anthropic-ai/sdk@0.32.1";

const RSS_SOURCES = [
  { url: "https://www.namibian.com.na/feed/", name: "The Namibian" },
  { url: "https://www.namibiansun.com/rss", name: "Namibian Sun" },
];

const MODEL = "claude-sonnet-4-20250514";

interface RssItem {
  title: string;
  link: string;
  description: string;
  pubDate?: string;
}

function parseRssItems(xml: string): RssItem[] {
  const items: RssItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let m: RegExpExecArray | null;
  while ((m = itemRegex.exec(xml)) !== null) {
    const block = m[1];
    const title = block.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").trim() ?? "";
    const link = block.match(/<link[^>]*>([\s\S]*?)<\/link>/i)?.[1]?.trim() ?? "";
    const desc = block.match(/<description[^>]*>([\s\S]*?)<\/description>/i)?.[1]?.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").replace(/<[^>]+>/g, "").trim() ?? "";
    const pubDate = block.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i)?.[1]?.trim();
    if (title && link) {
      items.push({ title, link, description: desc, pubDate });
    }
  }
  if (items.length === 0) {
    const entryRegex = /<entry>([\s\S]*?)<\/entry>/gi;
    while ((m = entryRegex.exec(xml)) !== null) {
      const block = m[1];
      const title = block.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").trim() ?? "";
      const link = block.match(/<link[^>]*href="([^"]+)"/i)?.[1] ?? block.match(/<link[^>]*>([\s\S]*?)<\/link>/i)?.[1]?.trim() ?? "";
      const desc = block.match(/<summary[^>]*>([\s\S]*?)<\/summary>/i)?.[1]?.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").replace(/<[^>]+>/g, "").trim() ?? "";
      const pubDate = block.match(/<published[^>]*>([\s\S]*?)<\/published>/i)?.[1]?.trim();
      if (title && link) {
        items.push({ title, link, description: desc, pubDate });
      }
    }
  }
  return items;
}

async function hashUrl(url: string): Promise<string> {
  const data = new TextEncoder().encode(url);
  const buf = await crypto.subtle.digest("SHA-256", data);
  const arr = Array.from(new Uint8Array(buf));
  return arr.map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 16);
}

async function processWithClaude(item: RssItem, anthropic: Anthropic): Promise<{ summary: string; category: string; tags: string[] }> {
  const content = `${item.title}\n\n${item.description}`.slice(0, 3000);
  const response = await anthropic.messages.create({
    model: MODEL,
    max_tokens: 256,
    messages: [
      {
        role: "user",
        content: `Given this Namibian sports/news article snippet, respond with JSON only: {"summary":"2-3 sentence summary for a news teaser","category":"sports category e.g. football, rugby, athletics","tags":["tag1","tag2","tag3"]}. Output only valid JSON.\n\n${content}`,
      },
    ],
  });

  const block = response.content.find((b) => b.type === "text");
  const text = block && "text" in block ? (block as { text: string }).text : "";
  try {
    const parsed = JSON.parse(text.trim()) as { summary?: string; category?: string; tags?: string[] };
    return {
      summary: typeof parsed.summary === "string" ? parsed.summary : "",
      category: typeof parsed.category === "string" ? parsed.category : "sports",
      tags: Array.isArray(parsed.tags) ? parsed.tags.filter((t): t is string => typeof t === "string").slice(0, 5) : [],
    };
  } catch {
    return { summary: item.description.slice(0, 200), category: "sports", tags: [] };
  }
}

Deno.serve(async () => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY");

  if (!supabaseUrl || !supabaseKey || !anthropicKey) {
    return new Response(
      JSON.stringify({ error: "Missing SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, or ANTHROPIC_API_KEY" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  const supabase = createClient(supabaseUrl, supabaseKey);
  const anthropic = new Anthropic({ apiKey: anthropicKey });

  let inserted = 0;

  for (const source of RSS_SOURCES) {
    try {
      const res = await fetch(source.url, { headers: { "User-Agent": "NamibiaSportsPlatform/1.0" } });
      if (!res.ok) {
        console.warn(`[news-aggregator] Failed to fetch ${source.url}: ${res.status}`);
        continue;
      }
      const xml = await res.text();
      const items = parseRssItems(xml);

      for (const item of items.slice(0, 10)) {
        try {
          const slug = `agg-${await hashUrl(item.link)}`;
          const { data: existing } = await supabase
            .from("sportsplatform_news_articles")
            .select("id")
            .eq("slug", slug)
            .maybeSingle();

          if (existing) continue;

          const { summary, category, tags } = await processWithClaude(item, anthropic);

          const { error } = await supabase.from("sportsplatform_news_articles").insert({
            title: item.title.slice(0, 255),
            slug,
            content: item.description || null,
            summary: summary.slice(0, 500) || null,
            federation_id: null,
            author_id: null,
            category: category.slice(0, 100) || null,
            tags: tags.length > 0 ? tags : null,
            featured_image: null,
            is_published: false,
            published_at: null,
          });

          if (!error) inserted++;
        } catch (e) {
          console.warn(`[news-aggregator] Error processing ${item.link}:`, e);
        }
      }
    } catch (e) {
      console.error(`[news-aggregator] Error fetching ${source.url}:`, e);
    }
  }

  console.log(`[news-aggregator] Inserted ${inserted} new articles`);
  return new Response(JSON.stringify({ success: true, inserted }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
});
