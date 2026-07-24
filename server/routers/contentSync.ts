/**
 * Platform Admin Content Sync — AI research assist for news/event drafts.
 *
 * Auth: adminProcedure only.
 * Feature flag: ENABLE_CONTENT_SYNC (default ON; set "false" to disable).
 * Output path: drafts only (isPublished stays false). Humans publish via CMS.
 */

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { adminProcedure, router } from "../_core/trpc";
import { ENV, isContentSyncEnabled } from "../_core/env";
import { clientKey, enforceRateLimit, RATE_LIMITS } from "../_core/rateLimit";
import { getDb } from "../db";
import { events, federations, newsArticles } from "../../drizzle/schema";
import {
  generateContentSuggestions,
  resolveContentSyncProvider,
  suggestionSchema,
} from "../services/contentSyncAi";
import {
  attachFederationIds,
  buildScopePrompt,
  loadActiveFederations,
  parseOptionalDate,
  uniqueSlug,
} from "../services/contentSyncScope";

const MANUAL_CMS_HINT =
  "Use the News or Events tabs in Platform Admin to create drafts manually.";

function assertContentSyncEnabled(): void {
  if (!isContentSyncEnabled()) {
    throw new TRPCError({
      code: "PRECONDITION_FAILED",
      message: `Content Sync is disabled (ENABLE_CONTENT_SYNC=false). ${MANUAL_CMS_HINT}`,
    });
  }
}

function enforceContentSyncRateLimit(procedure: string, userId: number, req: Request): void {
  enforceRateLimit(`contentSync.${procedure}:${userId}`, {
    ...RATE_LIMITS.contentSync,
    message: "Too many Content Sync requests. Please wait a moment.",
  });
  enforceRateLimit(`contentSync.${procedure}:ip:${clientKey(req)}`, {
    ...RATE_LIMITS.contentSync,
    message: "Too many Content Sync requests. Please wait a moment.",
  });
}

async function runSuggest(
  kind: "news" | "events",
  env: Parameters<typeof generateContentSuggestions>[0],
  federationId: number | null
) {
  const feds = await loadActiveFederations();
  if (federationId != null && !feds.some((f) => f.id === federationId)) {
    throw new TRPCError({ code: "BAD_REQUEST", message: "Unknown federation" });
  }
  try {
    const { provider, suggestions } = await generateContentSuggestions(
      env,
      buildScopePrompt(kind, feds, federationId)
    );
    return {
      provider,
      kind,
      suggestions: attachFederationIds(suggestions, feds, federationId),
      disclaimer:
        kind === "news"
          ? "AI research leads only. Verify sources before publishing. Create Draft keeps isPublished=false."
          : "AI research leads only. Do not treat dates as confirmed fixtures. Create Draft keeps isPublished=false.",
    };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "AI request failed";
    if (msg.includes("No AI provider")) {
      throw new TRPCError({
        code: "PRECONDITION_FAILED",
        message: `${msg} ${MANUAL_CMS_HINT}`,
      });
    }
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: msg });
  }
}

export const contentSyncRouter = router({
  /** Auth: admin. Provider availability + manual CMS fallback. */
  status: adminProcedure.query(({ ctx }) => {
    const enabled = isContentSyncEnabled();
    const provider = resolveContentSyncProvider(ctx.env);
    return {
      enabled,
      provider,
      available: enabled && provider !== null,
      workersAiBound: Boolean(ctx.env.AI),
      anthropicConfigured: Boolean(ENV.anthropicApiKey || ctx.env.ANTHROPIC_API_KEY),
      manualCmsHint: MANUAL_CMS_HINT,
      message:
        !enabled
          ? `Content Sync is disabled. ${MANUAL_CMS_HINT}`
          : provider === null
            ? `AI unavailable (no Workers AI binding and no ANTHROPIC_API_KEY). ${MANUAL_CMS_HINT}`
            : `Ready via ${provider === "workers-ai" ? "Cloudflare Workers AI" : "Anthropic"}. Suggestions create drafts only — never auto-publish.`,
    };
  }),

  /** Auth: admin. AI news topic suggestions. Rate-limited. */
  suggestNews: adminProcedure
    .input(z.object({ federationId: z.number().int().positive().nullable().optional() }))
    .mutation(async ({ ctx, input }) => {
      assertContentSyncEnabled();
      enforceContentSyncRateLimit("suggestNews", ctx.user.id, ctx.req);
      return runSuggest("news", ctx.env, input.federationId ?? null);
    }),

  /** Auth: admin. AI event/schedule candidates. Rate-limited. */
  suggestEvents: adminProcedure
    .input(z.object({ federationId: z.number().int().positive().nullable().optional() }))
    .mutation(async ({ ctx, input }) => {
      assertContentSyncEnabled();
      enforceContentSyncRateLimit("suggestEvents", ctx.user.id, ctx.req);
      return runSuggest("events", ctx.env, input.federationId ?? null);
    }),

  /** Auth: admin. Persist news suggestion as unpublished draft. */
  createNewsDraft: adminProcedure
    .input(
      z.object({
        federationId: z.number().int().positive(),
        suggestion: suggestionSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      assertContentSyncEnabled();
      enforceContentSyncRateLimit("createNewsDraft", ctx.user.id, ctx.req);

      const db = await getDb();
      if (!db) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      }

      const [fed] = await db
        .select({ id: federations.id })
        .from(federations)
        .where(eq(federations.id, input.federationId))
        .limit(1);
      if (!fed) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Unknown federation" });
      }

      const { suggestion } = input;
      const sourceNote = suggestion.sourceUrl
        ? `\n\n---\nResearch source (unverified): ${suggestion.sourceUrl}`
        : "\n\n---\nResearch lead from Content Sync AI — verify before publish.";

      const [result] = await db
        .insert(newsArticles)
        .values({
          federationId: input.federationId,
          title: suggestion.title.slice(0, 255),
          slug: uniqueSlug(suggestion.title),
          summary: suggestion.summary.slice(0, 2_000),
          content: `${suggestion.summary}${sourceNote}`,
          category: "sports",
          tags: ["content-sync", "ai-draft"],
          authorId: ctx.user.id,
          isPublished: false,
          publishedAt: null,
        })
        .returning({ id: newsArticles.id });

      return { success: true as const, id: result.id, isPublished: false as const };
    }),

  /** Auth: admin. Persist event suggestion as unpublished draft. */
  createEventDraft: adminProcedure
    .input(
      z.object({
        federationId: z.number().int().positive(),
        suggestion: suggestionSchema,
        eventType: z
          .enum(["competition", "tournament", "training", "workshop", "meeting", "other"])
          .optional()
          .default("competition"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      assertContentSyncEnabled();
      enforceContentSyncRateLimit("createEventDraft", ctx.user.id, ctx.req);

      const db = await getDb();
      if (!db) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      }

      const [fed] = await db
        .select({ id: federations.id })
        .from(federations)
        .where(eq(federations.id, input.federationId))
        .limit(1);
      if (!fed) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Unknown federation" });
      }

      const { suggestion } = input;
      const parsed = parseOptionalDate(suggestion.date);
      const startDate = parsed ?? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      const sourceNote = suggestion.sourceUrl
        ? `\n\nResearch source (unverified): ${suggestion.sourceUrl}`
        : "\n\nResearch lead from Content Sync AI — verify date/venue before publish.";

      const [result] = await db
        .insert(events)
        .values({
          federationId: input.federationId,
          name: suggestion.title.slice(0, 255),
          slug: uniqueSlug(suggestion.title),
          description: `${suggestion.summary}${sourceNote}`,
          type: input.eventType,
          startDate,
          isPublished: false,
        })
        .returning({ id: events.id });

      return {
        success: true as const,
        id: result.id,
        isPublished: false as const,
        startDatePlaceholder: parsed == null,
      };
    }),
});
