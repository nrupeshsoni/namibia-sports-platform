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
import { initEnv, type Env, type ExecutionContext } from "./_core/env";
import { runWithDb } from "./db";
import { appRouter } from "./routers";

const TRPC_ENDPOINT = "/api/trpc";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export default {
  async fetch(
    request: Request,
    env: Env,
    _ctx: ExecutionContext
  ): Promise<Response> {
    initEnv(env);

    const url = new URL(request.url);

    if (url.pathname === "/api/health") {
      return jsonResponse({ status: "ok", timestamp: new Date().toISOString() });
    }

    if (url.pathname.startsWith(TRPC_ENDPOINT)) {
      // runWithDb scopes one Hyperdrive-backed client to this invocation. The
      // client is never closed here — see the note in db.ts.
      return runWithDb(env, () =>
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
    }

    if (url.pathname.startsWith("/api/")) {
      return jsonResponse({ error: "Not found" }, 404);
    }

    return env.ASSETS.fetch(request);
  },
};
