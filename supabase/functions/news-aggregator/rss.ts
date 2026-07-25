/**
 * RSS parse, image extract, HTML sanitize for news-aggregator.
 */

import { unwrapGoogleNewsUrl } from "./googleNews.ts";
import { isSafeOutboundUrl } from "./safeUrl.ts";

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
  return !AD_IMG_RE.test(url) && !/\.(svg)(\?|$)/i.test(url);
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
const MAX_REDIRECTS = 3;

const UA = "NamibiaSportsPlatform/1.0 (+https://sports.com.na)";

/**
 * Fetch with redirect:manual, re-validating each Location against SSRF rules.
 * Only https (or http when httpsOnly=false) to public hosts; capped redirects + timeout.
 */
async function safeFetch(
  url: string,
  init: {
    headers?: Record<string, string>;
    signal: AbortSignal;
    httpsOnly?: boolean;
  }
): Promise<Response | null> {
  const httpsOnly = init.httpsOnly !== false;
  let current = url;
  for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
    if (!isSafeOutboundUrl(current, httpsOnly)) return null;
    const res = await fetch(current, {
      headers: init.headers,
      signal: init.signal,
      redirect: "manual",
    });
    if (res.status >= 300 && res.status < 400) {
      const loc = res.headers.get("Location");
      if (!loc) return null;
      try {
        current = new URL(loc, current).href;
      } catch {
        return null;
      }
      continue;
    }
    return res;
  }
  return null;
}

export async function fetchFeed(
  url: string
): Promise<{ ok: boolean; status?: number; xml?: string; error?: string }> {
  if (!isSafeOutboundUrl(url, true) && !isSafeOutboundUrl(url, false)) {
    return { ok: false, error: "Blocked or invalid feed URL" };
  }
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), FETCH_MS);
  try {
    // Trusted feed list is https; allow http only if a listed source still uses it.
    const res = await safeFetch(url, {
      headers: { "User-Agent": UA },
      signal: ctrl.signal,
      httpsOnly: url.startsWith("https://"),
    });
    if (!res) return { ok: false, error: "Blocked or invalid feed URL" };
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

function jsonLdImageRaw(img: unknown): string | null {
  if (typeof img === "string") return img;
  if (Array.isArray(img) && typeof img[0] === "string") return img[0];
  if (img && typeof img === "object" && typeof (img as { url?: unknown }).url === "string") {
    return (img as { url: string }).url;
  }
  return null;
}

function pickJsonLdImage(html: string, pageUrl: string): string | null {
  const blocks = html.matchAll(
    /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  );
  for (const m of blocks) {
    try {
      const data = JSON.parse(m[1]!) as unknown;
      for (const node of Array.isArray(data) ? data : [data]) {
        if (!node || typeof node !== "object") continue;
        const raw = jsonLdImageRaw((node as { image?: unknown }).image);
        if (!raw) continue;
        const abs = absolutizeUrl(raw, pageUrl);
        if (abs && isLikelyArticleImage(abs)) return abs;
      }
    } catch {
      /* ignore malformed JSON-LD */
    }
  }
  return null;
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
  return pickJsonLdImage(html, pageUrl) ?? extractImgFromHtml(html, pageUrl);
}

/** WordPress oEmbed thumbnail when pages omit og:image. */
async function fetchWpOembedThumbnail(articleUrl: string): Promise<string | null> {
  if (!isSafeOutboundUrl(articleUrl, true)) return null;
  let origin: string;
  try {
    origin = new URL(articleUrl).origin;
  } catch {
    return null;
  }
  const oembed = `${origin}/wp-json/oembed/1.0/embed?url=${encodeURIComponent(articleUrl)}`;
  if (!isSafeOutboundUrl(oembed, true)) return null;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), OG_MS);
  try {
    const res = await safeFetch(oembed, {
      headers: {
        "User-Agent": UA,
        Accept: "application/json",
      },
      signal: ctrl.signal,
      httpsOnly: true,
    });
    if (!res?.ok) return null;
    const data = (await res.json()) as { thumbnail_url?: unknown };
    if (typeof data.thumbnail_url !== "string") return null;
    const abs = absolutizeUrl(data.thumbnail_url, articleUrl);
    if (!abs || !isSafeOutboundUrl(abs, true) || !isLikelyArticleImage(abs)) return null;
    return abs;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/** Timeout-safe og/twitter/JSON-LD/oEmbed image; unwraps Google News first. */
export async function fetchOgImage(articleUrl: string): Promise<string | null> {
  if (!isSafeOutboundUrl(articleUrl, true) && !isSafeOutboundUrl(articleUrl, false)) {
    return null;
  }
  let lookupUrl = articleUrl;
  if (/news\.google\.com\//i.test(articleUrl)) {
    const unwrapped = await unwrapGoogleNewsUrl(articleUrl);
    if (!unwrapped || /news\.google\.com\//i.test(unwrapped)) return null;
    if (!isSafeOutboundUrl(unwrapped, true) && !isSafeOutboundUrl(unwrapped, false)) {
      return null;
    }
    lookupUrl = unwrapped;
  }
  // Prefer https for page fetch; allow http only when the article link is http.
  const httpsOnly = lookupUrl.startsWith("https://");
  if (!isSafeOutboundUrl(lookupUrl, httpsOnly)) return null;

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), OG_MS);
  try {
    const res = await safeFetch(lookupUrl, {
      headers: {
        "User-Agent": UA,
        Accept: "text/html,application/xhtml+xml",
      },
      signal: ctrl.signal,
      httpsOnly,
    });
    if (res?.ok) {
      const finalUrl = res.url || lookupUrl;
      const meta = pickMetaImage((await res.text()).slice(0, 100_000), finalUrl);
      if (
        meta &&
        isLikelyArticleImage(meta) &&
        (isSafeOutboundUrl(meta, true) || isSafeOutboundUrl(meta, false))
      ) {
        return meta;
      }
    }
  } catch {
    /* fall through to oEmbed */
  } finally {
    clearTimeout(timer);
  }
  // oEmbed only against https public origins
  const oembedTarget = lookupUrl.startsWith("https://")
    ? lookupUrl
    : lookupUrl.replace(/^http:\/\//i, "https://");
  return fetchWpOembedThumbnail(oembedTarget);
}

export async function resolveImage(item: RssItem): Promise<string | null> {
  if (item.imageUrl) return item.imageUrl;
  return extractImgFromHtml(item.bodyHtml, item.link) ?? fetchOgImage(item.link);
}
