/**
 * CORS allowlist for the Worker API.
 *
 * Same-origin browser traffic (sports.com.na SPA → /api/trpc) does not need
 * CORS; this exists for staging.workers.dev, local Vite, and any future
 * first-party subdomain that must call the API cross-origin.
 */

const ALLOWED_ORIGINS = new Set([
  "https://sports.com.na",
  "https://www.sports.com.na",
  "https://namibia-sports-platform-staging.facilit8.workers.dev",
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:8787",
  "http://127.0.0.1:8787",
]);

/**
 * Returns CORS headers when `Origin` is on the allowlist; otherwise null
 * (omit CORS headers — do not reflect arbitrary origins).
 */
export function corsHeadersForOrigin(origin: string | null): Record<string, string> | null {
  if (!origin || !ALLOWED_ORIGINS.has(origin)) return null;
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

/** True when the request is a CORS preflight we should answer without routing. */
export function isCorsPreflight(request: Request): boolean {
  return request.method === "OPTIONS" && request.headers.has("Origin");
}
