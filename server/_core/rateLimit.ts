/**
 * Fixed-window rate limiter for public procedures that cost money downstream.
 *
 * Counters live in isolate memory, so the ceiling is per-isolate rather than
 * global — Cloudflare may run several isolates for one Worker and recycles them
 * freely. That is deliberate: it needs no binding and no round trip, and it
 * still turns "one script drains the Anthropic budget" into a bounded trickle.
 * If a hard global guarantee is ever required, move this to a Rate Limiting
 * binding or a WAF rule rather than growing this module.
 */

import { TRPCError } from "@trpc/server";

type CounterWindow = { count: number; resetAt: number };

const windows = new Map<string, CounterWindow>();

/** Bound isolate memory against a caller that rotates its key on every request. */
const MAX_TRACKED_KEYS = 10_000;

function prune(now: number): void {
  // forEach rather than for…of: the build targets ES5 downlevel iteration.
  windows.forEach((window, key) => {
    if (window.resetAt <= now) windows.delete(key);
  });
}

/**
 * Identifies the caller for rate-limiting purposes. `cf-connecting-ip` is set by
 * Cloudflare and cannot be spoofed by the client; the other headers are only a
 * fallback for local dev, where no proxy sets it.
 */
export function clientKey(req: Request): string {
  return (
    req.headers.get("cf-connecting-ip") ??
    req.headers.get("x-real-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}

export type RateLimitOptions = {
  /** Requests allowed per window. */
  limit: number;
  windowMs: number;
  /** Shown to the caller when the limit trips. */
  message?: string;
};

/**
 * Shared ceilings for costly / abuse-prone procedures.
 * Keep in sync with docs/governance/SECURITY.md.
 */
export const RATE_LIMITS = {
  /** Anthropic-backed AI mutations (per user or IP). */
  ai: { limit: 10, windowMs: 60_000 } satisfies RateLimitOptions,
  /** Platform-admin contentSync suggest/create (Workers AI / Anthropic). */
  contentSync: { limit: 10, windowMs: 60_000 } satisfies RateLimitOptions,
  /** Platform-admin zero-news batch draft (costlier; fewer runs). */
  contentSyncBatch: { limit: 3, windowMs: 10 * 60_000 } satisfies RateLimitOptions,
  /** WhatsApp subscribe / unsubscribe / list. */
  whatsapp: { limit: 5, windowMs: 60_000 } satisfies RateLimitOptions,
  /** Federation-admin image uploads (storage + bandwidth). */
  upload: { limit: 20, windowMs: 60_000 } satisfies RateLimitOptions,
  /** Public global search (DB fan-out). */
  search: { limit: 30, windowMs: 60_000 } satisfies RateLimitOptions,
} as const;

/** Throws TOO_MANY_REQUESTS once `limit` is exceeded within the window. */
export function enforceRateLimit(key: string, opts: RateLimitOptions): void {
  const now = Date.now();

  if (windows.size > MAX_TRACKED_KEYS) prune(now);

  const existing = windows.get(key);
  if (!existing || existing.resetAt <= now) {
    windows.set(key, { count: 1, resetAt: now + opts.windowMs });
    return;
  }

  existing.count += 1;
  if (existing.count > opts.limit) {
    throw new TRPCError({
      code: "TOO_MANY_REQUESTS",
      message: opts.message ?? "Too many requests. Please try again shortly.",
    });
  }
}
