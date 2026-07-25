/**
 * Unwrap post-2024 Google News `articles/CBMi…` redirects to publisher URLs
 * (signature + batchexecute Fbv4je). Used for og:image enrichment and source_url.
 */

/** Browser-like UA — Google News omits data-n-a-sg for bot UAs. */
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";
const BATCH = "https://news.google.com/_/DotsSplashUi/data/batchexecute";
const UNWRAP_MS = 15_000;

function articleIdFromUrl(url: string): string | null {
  try {
    const path = new URL(url).pathname;
    const m = path.match(/\/articles\/([^/?#]+)/i);
    return m?.[1] ?? null;
  } catch {
    return null;
  }
}

/** Normalize RSS wrapper paths to the HTML article route before fetch. */
function normalizeGoogleNewsArticleUrl(url: string): string {
  return url.replace(/\/rss\/articles\//i, "/articles/");
}

/**
 * Parse `"Headline - Publisher"` titles from Google News RSS items.
 * Returns null when no trailing outlet segment is present.
 */
export function publisherFromGoogleTitle(title: string): string | null {
  const trimmed = title.trim();
  const idx = trimmed.lastIndexOf(" - ");
  if (idx <= 0 || idx >= trimmed.length - 3) return null;
  const publisher = trimmed.slice(idx + 3).trim();
  return publisher.length > 0 ? publisher.slice(0, 200) : null;
}

/**
 * Resolve a Google News article wrapper to the outlet article URL.
 * Returns null when the page has no signature or batchexecute fails.
 */
export async function unwrapGoogleNewsUrl(articleUrl: string): Promise<string | null> {
  const normalized = normalizeGoogleNewsArticleUrl(articleUrl);
  if (!/news\.google\.com\/.*\/articles\//i.test(normalized)) return null;
  const articleId = articleIdFromUrl(normalized);
  if (!articleId) return null;

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), UNWRAP_MS);
  try {
    const pageRes = await fetch(normalized, {
      headers: { "User-Agent": UA, Accept: "text/html" },
      signal: ctrl.signal,
      redirect: "follow",
    });
    if (!pageRes.ok) return null;
    const html = (await pageRes.text()).slice(0, 200_000);
    const signature = html.match(/data-n-a-sg="([^"]+)"/)?.[1];
    const timestamp = html.match(/data-n-a-ts="([^"]+)"/)?.[1];
    if (!signature || !timestamp || !/^\d+$/.test(timestamp)) return null;

    const rpcInner = JSON.stringify([
      "garturlreq",
      [
        ["X", "X", ["X", "X"], null, null, 1, 1, "US:en", null, 1, null, null, null, null, null, 0, 1],
        "X",
        "X",
        1,
        [1, 1, 1],
        1,
        1,
        null,
        0,
        0,
        null,
        0,
      ],
      articleId,
      Number(timestamp),
      signature,
    ]);
    const fReq = JSON.stringify([[["Fbv4je", rpcInner, null, "generic"]]]);

    const postRes = await fetch(BATCH, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
        Referer: "https://news.google.com/",
        "User-Agent": UA,
      },
      body: `f.req=${encodeURIComponent(fReq)}`,
      signal: ctrl.signal,
    });
    if (!postRes.ok) return null;

    const body = await postRes.text();
    // batchexecute embeds JSON as an escaped string: \"garturlres\",\"https://...\"
    const embedded = body.match(/\\"garturlres\\",\\"(https?:[^\\"]+)/);
    if (embedded?.[1]) return embedded[1].replace(/\\\//g, "/");
    const plain = body.match(/"garturlres","(https?:\/\/[^"]+)"/);
    if (plain?.[1]) return plain[1];

    let jsonText = body;
    if (jsonText.startsWith(")]}'")) jsonText = jsonText.split("\n", 2)[1] ?? jsonText;
    jsonText = jsonText.trimStart();
    const nl = jsonText.indexOf("\n");
    if (nl > 0 && /^\d+$/.test(jsonText.slice(0, nl).trim())) {
      jsonText = jsonText.slice(nl + 1);
    }
    const envelopes = JSON.parse(jsonText) as unknown;
    if (!Array.isArray(envelopes)) return null;
    for (const env of envelopes) {
      if (!Array.isArray(env) || env[0] !== "wrb.fr" || env[1] !== "Fbv4je") continue;
      if (typeof env[2] !== "string") continue;
      const payload = JSON.parse(env[2]) as unknown;
      if (
        Array.isArray(payload) &&
        payload[0] === "garturlres" &&
        typeof payload[1] === "string" &&
        /^https?:\/\//i.test(payload[1])
      ) {
        return payload[1];
      }
    }
    return null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}
