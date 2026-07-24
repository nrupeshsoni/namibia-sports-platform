/**
 * RSS parse, image extract, HTML sanitize for news-aggregator.
 */

export interface RssItem {
  title: string;
  link: string;
  description: string;
  /** Plain or lightly sanitized body from description / content:encoded */
  bodyHtml: string;
  imageUrl: string | null;
  pubDate?: string;
}

export function decodeEntities(s: string): string {
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

/** Strip scripts/styles/handlers; keep simple markup for snippets. */
export function sanitizeHtml(html: string): string {
  return decodeEntities(html)
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/<\/?(?:iframe|object|embed|form|input|button)[^>]*>/gi, "")
    .trim();
}

function stripTags(html: string): string {
  return sanitizeHtml(html).replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function extractRssImage(block: string): string | null {
  const media =
    block.match(/<media:content[^>]+url=["']([^"']+)["']/i)?.[1] ??
    block.match(/<media:thumbnail[^>]+url=["']([^"']+)["']/i)?.[1];
  if (media && /^https?:\/\//i.test(media)) return media;

  const enc = block.match(
    /<enclosure[^>]+url=["']([^"']+)["'][^>]*(?:type=["']image\/[^"']*["'])?/i
  );
  if (enc?.[1] && /^https?:\/\//i.test(enc[1])) {
    const type = block.match(/<enclosure[^>]+type=["']([^"']+)["']/i)?.[1] ?? "";
    if (!type || type.startsWith("image/")) return enc[1];
  }
  return null;
}

export function parseRssItems(xml: string): RssItem[] {
  const items: RssItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/gi;
  let m: RegExpExecArray | null;
  while ((m = itemRegex.exec(xml)) !== null) {
    const block = m[1];
    const title = decodeEntities(block.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "");
    const link = (block.match(/<link[^>]*>([\s\S]*?)<\/link>/i)?.[1] ?? "").trim();
    const encoded = block.match(
      /<content:encoded[^>]*>([\s\S]*?)<\/content:encoded>/i
    )?.[1];
    const rawDesc = block.match(/<description[^>]*>([\s\S]*?)<\/description>/i)?.[1] ?? "";
    const bodyHtml = sanitizeHtml(encoded ?? rawDesc).slice(0, 4000);
    const description = stripTags(rawDesc || encoded || "").slice(0, 2000);
    const pubDate = block.match(/<pubDate[^>]*>([\s\S]*?)<\/pubDate>/i)?.[1]?.trim();
    const imageUrl = extractRssImage(block);
    if (title && link) {
      items.push({ title, link, description, bodyHtml, imageUrl, pubDate });
    }
  }
  if (items.length > 0) return items;

  const entryRegex = /<entry>([\s\S]*?)<\/entry>/gi;
  while ((m = entryRegex.exec(xml)) !== null) {
    const block = m[1];
    const title = decodeEntities(block.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? "");
    const link =
      block.match(/<link[^>]*href="([^"]+)"/i)?.[1] ??
      (block.match(/<link[^>]*>([\s\S]*?)<\/link>/i)?.[1] ?? "").trim();
    const raw = block.match(/<summary[^>]*>([\s\S]*?)<\/summary>/i)?.[1] ??
      block.match(/<content[^>]*>([\s\S]*?)<\/content>/i)?.[1] ??
      "";
    const bodyHtml = sanitizeHtml(raw).slice(0, 4000);
    const description = stripTags(raw).slice(0, 2000);
    const pubDate = block.match(/<published[^>]*>([\s\S]*?)<\/published>/i)?.[1]?.trim();
    if (title && link) {
      items.push({
        title,
        link,
        description,
        bodyHtml,
        imageUrl: extractRssImage(block),
        pubDate,
      });
    }
  }
  return items;
}

const FETCH_MS = 20_000;
const OG_MS = 8_000;

export async function fetchFeed(
  url: string
): Promise<{ ok: boolean; status?: number; xml?: string; error?: string }> {
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

/** Timeout-safe og:image from article page when RSS has no media. */
export async function fetchOgImage(articleUrl: string): Promise<string | null> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), OG_MS);
  try {
    const res = await fetch(articleUrl, {
      headers: { "User-Agent": "NamibiaSportsPlatform/1.0 (+https://sports.com.na)" },
      signal: ctrl.signal,
      redirect: "follow",
    });
    if (!res.ok) return null;
    const html = (await res.text()).slice(0, 80_000);
    const og =
      html.match(
        /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i
      )?.[1] ??
      html.match(
        /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i
      )?.[1];
    if (og && /^https?:\/\//i.test(og)) return og;
    return null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

export async function resolveImage(item: RssItem): Promise<string | null> {
  if (item.imageUrl) return item.imageUrl;
  return fetchOgImage(item.link);
}
