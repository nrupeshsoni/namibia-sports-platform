/**
 * Unwrap post-2024 Google News `articles/CBMi…` redirects to publisher URLs
 * (signature + batchexecute Fbv4je). Used only for og:image enrichment.
 */

const UA = "NamibiaSportsPlatform/1.0 (+https://sports.com.na)";
const BATCH = "https://news.google.com/_/DotsSplashUi/data/batchexecute";
const UNWRAP_MS = 8_000;

function articleIdFromUrl(url: string): string | null {
  try {
    const path = new URL(url).pathname;
    const m = path.match(/\/articles\/([^/?#]+)/i);
    return m?.[1] ?? null;
  } catch {
    return null;
  }
}

/**
 * Resolve a Google News article wrapper to the outlet article URL.
 * Returns null when the page has no signature or batchexecute fails.
 */
export async function unwrapGoogleNewsUrl(articleUrl: string): Promise<string | null> {
  if (!/news\.google\.com\/.*\/articles\//i.test(articleUrl)) return null;
  const articleId = articleIdFromUrl(articleUrl);
  if (!articleId) return null;

  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), UNWRAP_MS);
  try {
    const pageRes = await fetch(articleUrl, {
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

    let body = await postRes.text();
    if (body.startsWith(")]}'")) body = body.split("\n", 2)[1] ?? body;
    body = body.trimStart();
    const nl = body.indexOf("\n");
    if (nl > 0 && /^\d+$/.test(body.slice(0, nl).trim())) {
      body = body.slice(nl + 1);
    }

    const envelopes = JSON.parse(body) as unknown;
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
