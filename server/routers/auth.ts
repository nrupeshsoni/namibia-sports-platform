import { publicProcedure, router } from "../_core/trpc";

export const authRouter = router({
  /** The caller's `sportsplatform_users` row, or null when unauthenticated. */
  me: publicProcedure.query((opts) => opts.ctx.user),
  /**
   * Sessions are Supabase-issued bearer tokens rather than server-set cookies,
   * so the server holds nothing to clear. The client ends the session with
   * `supabase.auth.signOut()`; this stays so callers can reset local state.
   */
  logout: publicProcedure.mutation(() => {
    return { success: true } as const;
  }),
});
