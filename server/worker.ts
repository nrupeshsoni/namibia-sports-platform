/**
 * Cloudflare Worker entry point.
 *
 * Replaces the Express-on-Netlify handler: Express and serverless-http are
 * Node-only, so the tRPC fetch adapter drives the router directly. The
 * superjson transformer stays configured on the router in _core/trpc.ts, which
 * is what the client's httpBatchLink expects.
 */

import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { createContext } from "./_core/context";
import { corsHeadersForOrigin, isCorsPreflight } from "./_core/cors";
import { initEnv, type Env, type ExecutionContext } from "./_core/env";
import { runWithDb } from "./db";
import { appRouter } from "./routers";

const TRPC_ENDPOINT = "/api/trpc";

/**
 * Static asset trees under `client/public/`. Paths with a file extension are
 * served as assets (missing → real 404). Paths without an extension are SPA
 * routes (e.g. `/athletes/:slug`, `/news/:slug`, `/events/:slug`, `/clubs/:slug`) and must get index.html.
 * `/sports/`, `/logos/`, `/venues/` have no SPA detail routes today — extension
 * gating still keeps image serving intact and avoids false 404s if routes land later.
 */
const STATIC_ASSET_PREFIXES = [
  "/sports/",
  "/logos/",
  "/athletes/",
  "/venues/",
  "/news/",
] as const;

const STATIC_FILE_EXT =
  /\.(?:avif|css|gif|ico|jpe?g|js|json|map|mp4|png|svg|txt|webm|webp|woff2?)$/i;

/**
 * CSP tuned for the Vite SPA + Supabase Auth/Storage + YouTube embeds +
 * optional Maps (forge proxy). Inline styles are required (glassmorphism).
 */
const CONTENT_SECURITY_POLICY = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' https://forge.butterfly-effect.dev https://maps.googleapis.com https://maps.gstatic.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data: https://fonts.gstatic.com",
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://forge.butterfly-effect.dev https://maps.googleapis.com",
  "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://youtube.com",
  "media-src 'self' https: blob:",
  "worker-src 'self' blob:",
  "manifest-src 'self'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");


function cacheControlForRequest(request: Request | undefined, response: Response): string | null {
  if (!request) return null;
  const path = new URL(request.url).pathname.toLowerCase();
  if (path.startsWith("/api/")) return "private, no-store";
  if (path.startsWith("/assets/")) return "public, max-age=31536000, immutable";
  if (
    (path.startsWith("/logos/") || path.startsWith("/sports/")) &&
    STATIC_FILE_EXT.test(path)
  ) {
    return "public, max-age=604800, stale-while-revalidate=86400";
  }
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("text/html") || !STATIC_FILE_EXT.test(path)) {
    return "no-cache";
  }
  return null;
}

const SECURITY_HEADERS: Record<string, string> = {
  "Content-Security-Policy": CONTENT_SECURITY_POLICY,
  "X-Frame-Options": "DENY",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  // Leave accelerometer/gyroscope unrestricted so YouTube embeds can use them.
  "Permissions-Policy": "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
};

function withSecurityHeaders(response: Response, request?: Request): Response {
  const headers = new Headers(response.headers);
  for (const [key, value] of Object.entries(SECURITY_HEADERS)) {
    headers.set(key, value);
  }
  const cacheControl = cacheControlForRequest(request, response);
  if (cacheControl) {
    headers.set("Cache-Control", cacheControl);
  }
  const cors = corsHeadersForOrigin(request?.headers.get("Origin") ?? null);
  if (cors) {
    for (const [key, value] of Object.entries(cors)) {
      headers.set(key, value);
    }
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function jsonResponse(body: unknown, status = 200): Response {
  return withSecurityHeaders(
    new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json" },
    })
  );
}

function notFoundResponse(): Response {
  return withSecurityHeaders(
    new Response("Not Found", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    })
  );
}

/** True when the path is a static asset that must not fall back to the SPA. */
function isStaticAssetPath(pathname: string): boolean {
  const path = pathname.toLowerCase();
  if (!STATIC_ASSET_PREFIXES.some((prefix) => path.startsWith(prefix))) {
    return false;
  }
  return STATIC_FILE_EXT.test(path);
}

/**
 * Fetch a static asset; convert the SPA HTML fallback into a real 404.
 * Cloudflare Assets with `not_found_handling: single-page-application` returns
 * index.html (200 + text/html) for missing files — detect that here.
 */
async function fetchStaticAsset(request: Request, env: Env): Promise<Response> {
  const assetResponse = await env.ASSETS.fetch(request);
  const contentType = assetResponse.headers.get("content-type") ?? "";
  if (assetResponse.status === 404 || contentType.includes("text/html")) {
    return withSecurityHeaders(
      new Response("Not Found", {
        status: 404,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      }),
      request
    );
  }
  return withSecurityHeaders(assetResponse, request);
}

export default {
  async fetch(
    request: Request,
    env: Env,
    _ctx: ExecutionContext
  ): Promise<Response> {
    initEnv(env);

    const url = new URL(request.url);

    // CORS preflight for allowlisted origins only (never reflect *).
    if (isCorsPreflight(request) && url.pathname.startsWith("/api/")) {
      const cors = corsHeadersForOrigin(request.headers.get("Origin"));
      if (!cors) {
        return new Response(null, { status: 403 });
      }
      return new Response(null, { status: 204, headers: cors });
    }

    if (url.pathname === "/api/health") {
      return withSecurityHeaders(
        new Response(JSON.stringify({ status: "ok", timestamp: new Date().toISOString() }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }),
        request
      );
    }

    if (url.pathname.startsWith(TRPC_ENDPOINT)) {
      // runWithDb scopes one Hyperdrive-backed client to this invocation. The
      // client is never closed here — see the note in db.ts.
      const trpcResponse = await runWithDb(env, () =>
        fetchRequestHandler({
          endpoint: TRPC_ENDPOINT,
          req: request,
          router: appRouter,
          createContext: () => createContext({ req: request, env }),
          onError({ error, path }) {
            console.error(`[tRPC] ${path ?? "<no-path>"}:`, error.message);
          },
        })
      );
      return withSecurityHeaders(trpcResponse, request);
    }

    if (url.pathname.startsWith("/api/")) {
      return withSecurityHeaders(
        new Response(JSON.stringify({ error: "Not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }),
        request
      );
    }

    if (isStaticAssetPath(url.pathname)) {
      return fetchStaticAsset(request, env);
    }

    // App routes: SPA fallback via Assets binding.
    return withSecurityHeaders(await env.ASSETS.fetch(request), request);
  },
};
