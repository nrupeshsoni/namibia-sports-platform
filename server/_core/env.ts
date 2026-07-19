/**
 * Cloudflare Worker bindings and runtime configuration.
 *
 * Workers have no `process.env` at module scope: bindings and secrets arrive on
 * the `env` argument of the fetch handler. `initEnv` is called at the top of
 * every invocation (see server/worker.ts) to seed the module-level `ENV` object
 * that the _core services read. Every request served by an isolate receives the
 * same binding values, so seeding a module-level object carries no cross-request
 * leakage risk.
 *
 * Minimal structural types are declared locally rather than pulling in
 * @cloudflare/workers-types, which would otherwise be a new dependency.
 */

/** Hyperdrive binding. Exposes a pooled connection string for the origin database. */
export interface HyperdriveBinding {
  connectionString: string;
}

/** Static assets binding. Serves the built client for everything outside /api/. */
export interface AssetsBinding {
  fetch(request: Request): Promise<Response>;
}

/** Subset of the Workers ExecutionContext that this Worker uses. */
export interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

export interface Env {
  /** Hyperdrive pool fronting the Supabase Postgres database. */
  HYPERDRIVE: HyperdriveBinding;
  /** Built client assets. */
  ASSETS: AssetsBinding;
  /** Supabase project URL. Used to verify the caller's bearer token. */
  SUPABASE_URL: string;
  /** Supabase anon key. The per-request client uses it so Postgres RLS applies to the caller. */
  SUPABASE_ANON_KEY: string;
  /** Service-role key. Storage uploads only — never used to build the request context. */
  SUPABASE_SERVICE_ROLE_KEY?: string;
  /** Anthropic key for the AI router. */
  ANTHROPIC_API_KEY?: string;
  BUILT_IN_FORGE_API_URL?: string;
  BUILT_IN_FORGE_API_KEY?: string;
}

/** Runtime configuration read by the _core services. Populated by `initEnv`. */
export const ENV = {
  supabaseUrl: "",
  supabaseAnonKey: "",
  supabaseServiceRoleKey: "",
  anthropicApiKey: "",
  forgeApiUrl: "",
  forgeApiKey: "",
};

/** Seed `ENV` from the Worker bindings. Called once per invocation. */
export function initEnv(env: Env): void {
  ENV.supabaseUrl = env.SUPABASE_URL ?? "";
  ENV.supabaseAnonKey = env.SUPABASE_ANON_KEY ?? "";
  ENV.supabaseServiceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY ?? "";
  ENV.anthropicApiKey = env.ANTHROPIC_API_KEY ?? "";
  ENV.forgeApiUrl = env.BUILT_IN_FORGE_API_URL ?? "";
  ENV.forgeApiKey = env.BUILT_IN_FORGE_API_KEY ?? "";
}
