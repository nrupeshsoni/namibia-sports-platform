import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { User } from "../../drizzle/schema";
import { ensureUser } from "../db";
import type { Env } from "./env";

export type TrpcContext = {
  req: Request;
  env: Env;
  /**
   * Per-request Supabase client built from the anon key with the caller's
   * Authorization header forwarded, so Postgres RLS is evaluated as that user.
   */
  supabase: SupabaseClient;
  /** The `sportsplatform_users` row backing the role checks in trpc.ts. */
  user: User | null;
};

export type CreateContextOptions = {
  req: Request;
  env: Env;
};

export async function createContext(
  opts: CreateContextOptions
): Promise<TrpcContext> {
  const { req, env } = opts;
  const authHeader = req.headers.get("authorization");

  const supabase = createClient(env.SUPABASE_URL ?? "", env.SUPABASE_ANON_KEY ?? "", {
    global: {
      headers: authHeader ? { Authorization: authHeader } : {},
    },
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  let user: User | null = null;

  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);

    try {
      const {
        data: { user: authUser },
        error,
      } = await supabase.auth.getUser(token);

      if (error) {
        // Authentication is optional for public procedures.
        console.warn("[Auth] Token verification failed:", error.message);
      } else if (authUser) {
        const metadata = authUser.user_metadata as
          | { full_name?: string; name?: string }
          | undefined;

        user = await ensureUser({
          openId: authUser.id,
          name: metadata?.full_name ?? metadata?.name ?? authUser.email ?? null,
          email: authUser.email ?? null,
          loginMethod: authUser.app_metadata?.provider ?? null,
        });
      }
    } catch (error) {
      console.error("[Auth] Failed to resolve user:", error);
      user = null;
    }
  }

  return {
    req,
    env,
    supabase,
    user,
  };
}
