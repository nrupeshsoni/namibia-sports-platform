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

function isHttpUrl(u: string): boolean {
  return /^https?:\/\//i.test(u);
}

/** Resolve relative image URLs against article/feed origin. */
export function absolutizeUrl(raw: string, baseUrl: string): string | null {
  const trimmed = decodeEntities(raw).trim();
  if (!trimmed || trimmed.startsWith("data:")) return null;
  try {
    const abs = new URL(trimmed, baseUrl).href;
    return isHttpUrl(abs) ? abs : null;
  } catch {
    return null;
  }
}

const AD_IMG_RE =
  /banner|advert|adservice|doubleclick|cash.?convert|placeholder|1x1|pixel|spacer|tracking/i;

function isLikelyArticleImage(url: string): boolean {
  if (AD_IMG_RE.test(url)) return false;
  // Prefer real photo assets over tiny icons/logos.
  if (/\.(svg)(\?|$)/i.test(url)) return false;
  return true;
}

function extractImgFromHtml(html: string, baseUrl: string): string | null {
  const imgTags = html.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi);
  for (const m of imgTags) {
    const abs = absolutizeUrl(m[1], baseUrl);
    if (abs && isLikelyArticleImage(abs)) return abs;
  }
  const srcset = html.match(/srcset=["']([^"'\s,]+)/i)?.[1];
  if (srcset) {
    const abs = absolutizeUrl(srcset, baseUrl);
    if (abs && isLikelyArticleImage(abs)) return abs;
  }
  return null;
}

function extractRssImage(block: string, baseUrl: string): string | null {
  const media =
    block.match(/<media:content[^>]+url=["']([^"']+)["']/i)?.[1] ??
    block.match(/<media:thumbnail[^>]+url=["']([^"']+)["']/i)?.[1] ??
    block.match(/<media:content[^>]+url=["']([^"']+)["'][^>]*medium=["']image["']/i)?.[1];
  if (media) {
    const abs = absolutizeUrl(media, baseUrl);
    if (abs) return abs;
  }

  const enc = block.match(/<enclosure[^>]+url=["']([^"']+)["']/i);
  if (enc?.[1]) {
    const type = block.match(/<enclosure[^>]+type=["']([^"']+)["']/i)?.[1] ?? "";
    if (!type || type.startsWith("image/")) {
      const abs = absolutizeUrl(enc[1], baseUrl);
      if (abs) return abs;
    }
  }

  const encoded = block.match(/<content:encoded[^>]*>([\s\S]*?)<\/content:encoded>/i)?.[1] ?? "";
  const desc = block.match(/<description[^>]*>([\s\S]*?)<\/description>/i)?.[1] ?? "";
  return extractImgFromHtml(decodeEntities(encoded || desc), baseUrl);
}

export function parseRssItems(xml: string, feedUrl = "https://sports.com.na"): RssItem[] {
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
    const base = isHttpUrl(link) ? link : feedUrl;
    const imageUrl = extractRssImage(block, base);
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
    const base = isHttpUrl(link) ? link : feedUrl;
    if (title && link) {
      items.push({
        title,
        link,
        description,
        bodyHtml,
        imageUrl: extractRssImage(block, base),
        pubDate,
      });
    }
  }
  return items;
}

const FETCH_MS = 12_000;
const OG_MS = 6_000;

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

function pickMetaImage(html: string, pageUrl: string): string | null {
  const candidates = [
    html.match(/<meta[^>]+property=["']og:image(?::secure_url)?["'][^>]+content=["']([^"']+)["']/i)?.[1],
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image(?::secure_url)?["']/i)?.[1],
    html.match(/<meta[^>]+name=["']twitter:image(?::src)?["'][^>]+content=["']([^"']+)["']/i)?.[1],
    html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image(?::src)?["']/i)?.[1],
    html.match(/<link[^>]+rel=["']image_src["'][^>]+href=["']([^"']+)["']/i)?.[1],
  ];
  for (const c of candidates) {
    if (!c) continue;
    const abs = absolutizeUrl(c, pageUrl);
    if (abs) return abs;
  }
  return extractImgFromHtml(html, pageUrl);
}

/** WordPress oEmbed thumbnail when pages omit og:image (e.g. Namibia Economist). */
async function fetchWpOembedThumbnail(articleUrl: string): Promise<string | null> {
  let origin: string;
  try {
    origin = new URL(articleUrl).origin;
  } catch {
    return null;
  }
  const oembed = `${origin}/wp-json/oembed/1.0/embed?url=${encodeURIComponent(articleUrl)}`;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), OG_MS);
  try {
    const res = await fetch(oembed, {
      headers: {
        "User-Agent": "NamibiaSportsPlatform/1.0 (+https://sports.com.na)",
        Accept: "application/json",
      },
      signal: ctrl.signal,
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { thumbnail_url?: unknown };
    if (typeof data.thumbnail_url !== "string") return null;
    const abs = absolutizeUrl(data.thumbnail_url, articleUrl);
    return abs && isLikelyArticleImage(abs) ? abs : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/** Timeout-safe og/twitter/oEmbed image from article page when RSS has no media. */
export async function fetchOgImage(articleUrl: string): Promise<string | null> {
  if (!isHttpUrl(articleUrl)) return null;
  // Google News article wrappers rarely expose outlet og:image.
  if (/news\.google\.com\//i.test(articleUrl)) return null;

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), OG_MS);
  try {
    const res = await fetch(articleUrl, {
      headers: {
        "User-Agent": "NamibiaSportsPlatform/1.0 (+https://sports.com.na)",
        Accept: "text/html,application/xhtml+xml",
      },
      signal: ctrl.signal,
      redirect: "follow",
    });
    if (res.ok) {
      const finalUrl = res.url || articleUrl;
      const html = (await res.text()).slice(0, 100_000);
      const meta = pickMetaImage(html, finalUrl);
      if (meta && isLikelyArticleImage(meta)) return meta;
    }
  } catch {
    /* fall through to oEmbed */
  } finally {
    clearTimeout(timer);
  }

  return fetchWpOembedThumbnail(articleUrl);
}

export async function resolveImage(item: RssItem): Promise<string | null> {
  if (item.imageUrl) return item.imageUrl;
  const fromBody = extractImgFromHtml(item.bodyHtml, item.link);
  if (fromBody) return fromBody;
  return fetchOgImage(item.link);
}
