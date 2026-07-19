import { AsyncLocalStorage } from "node:async_hooks";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { InsertUser, users } from "../drizzle/schema";
import type { Env } from "./_core/env";

type Drizzle = ReturnType<typeof drizzle>;

type RequestDbStore = {
  env: Env;
  db: Drizzle | null;
  /** Set once the connection attempt has run, so a failure is not retried on every call. */
  resolved: boolean;
};

/**
 * Per-request database state. A Workers isolate serves many requests
 * concurrently, so the client cannot be a module-level singleton.
 * AsyncLocalStorage scopes it to a single invocation while leaving `getDb()`'s
 * call signature unchanged for the existing call sites.
 */
const requestDbStore = new AsyncLocalStorage<RequestDbStore>();

/** Run a request handler with a request-scoped database client available to `getDb()`. */
export function runWithDb<T>(env: Env, fn: () => Promise<T>): Promise<T> {
  return requestDbStore.run({ env, db: null, resolved: false }, fn);
}

/**
 * Resolve the request-scoped drizzle instance, connecting on first use.
 *
 * The client is deliberately never closed. Hyperdrive owns the underlying
 * connection pool, and scheduling `sql.end()` — for example via
 * `ctx.waitUntil(Promise.resolve().then(close))` — tears the socket down on the
 * next microtask, before the awaited procedures have run, so every query then
 * fails with CONNECTION_DESTROYED. The client is garbage collected when the
 * request finishes.
 */
export async function getDb() {
  const store = requestDbStore.getStore();
  if (!store) {
    console.warn("[Database] getDb() called outside of a request scope");
    return null;
  }

  if (store.resolved) {
    return store.db;
  }
  store.resolved = true;

  const connectionString = store.env.HYPERDRIVE?.connectionString;
  if (!connectionString) {
    console.warn("[Database] HYPERDRIVE binding is not configured");
    return null;
  }

  try {
    const client = postgres(connectionString, {
      // Workers limit the number of concurrent external connections.
      max: 5,
      // Skip the array-type round trip; nothing here needs custom type parsing.
      fetch_types: false,
      // Supabase's pooler runs in transaction mode and rejects prepared statements.
      prepare: false,
    });
    store.db = drizzle(client);
  } catch (error) {
    console.warn("[Database] Failed to connect:", error);
    store.db = null;
  }

  return store.db;
}

/** How stale a `lastSignedIn` value may get before it is refreshed. */
const SIGN_IN_REFRESH_MS = 60 * 60 * 1000;

/**
 * Resolve the `sportsplatform_users` row for an authenticated Supabase user,
 * creating it on first sight.
 *
 * Provisioning lives here rather than in a Postgres trigger on `auth.users`:
 * that Supabase project is shared with unrelated products, so a trigger there
 * would carry cross-product blast radius.
 *
 * New rows are always created at the lowest privilege in the `user_role` enum.
 * The insert is a no-op on conflict, so an existing role is never overwritten.
 */
export async function ensureUser(user: InsertUser) {
  if (!user.openId) {
    throw new Error("User openId is required for provisioning");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot provision user: database not available");
    return null;
  }

  const existing = await getUserByOpenId(user.openId);

  if (existing) {
    const lastSignedIn = existing.lastSignedIn?.getTime() ?? 0;
    if (Date.now() - lastSignedIn > SIGN_IN_REFRESH_MS) {
      await db
        .update(users)
        .set({ lastSignedIn: new Date() })
        .where(eq(users.openId, user.openId));
    }
    return existing;
  }

  await db
    .insert(users)
    .values({
      openId: user.openId,
      name: user.name ?? null,
      email: user.email ?? null,
      loginMethod: user.loginMethod ?? null,
      // Lowest privilege in the user_role enum. Elevation is a deliberate,
      // out-of-band action — self-signup never grants more than this.
      role: "user",
      lastSignedIn: new Date(),
    })
    .onConflictDoNothing({ target: users.openId });

  return (await getUserByOpenId(user.openId)) ?? null;
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// TODO: add feature queries here as your schema grows.
