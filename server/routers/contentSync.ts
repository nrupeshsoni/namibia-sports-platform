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
  buildZeroNewsBatchPrompt,
  loadActiveFederations,
  loadZeroNewsFederations,
  matchFederation,
  parseOptionalDate,
  uniqueSlug,
} from "../services/contentSyncScope";
import { toClientSafeTrpcError } from "../_core/clientSafeError";
import type { ContentSuggestion } from "../services/contentSyncAi";

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
        message: `AI unavailable. ${MANUAL_CMS_HINT}`,
      });
    }
    throw toClientSafeTrpcError(
      `contentSync.suggest.${kind}`,
      e,
      `Content Sync failed. ${MANUAL_CMS_HINT}`
    );
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
      const rawSource = suggestion.sourceUrl?.trim() ?? "";
      const sourceUrl =
        rawSource.startsWith("https://") && rawSource.length <= 2_000
          ? rawSource
          : null;
      const sourceNote = sourceUrl
        ? `\n\n---\nResearch source (unverified): ${sourceUrl}`
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
          sourceUrl,
          sourceName: sourceUrl ? "Content Sync AI" : null,
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

  /**
   * Auth: admin. One AI call for up to N zero-news federations → unpublished news drafts.
   * Never auto-publishes. Rate-limited separately (3 / 10 min).
   */
  batchDraftZeroNews: adminProcedure
    .input(
      z
        .object({
          maxFederations: z.number().int().min(1).max(20).default(17),
        })
        .optional()
    )
    .mutation(async ({ ctx, input }) => {
      assertContentSyncEnabled();
      enforceRateLimit(`contentSync.batchDraftZeroNews:${ctx.user.id}`, {
        ...RATE_LIMITS.contentSyncBatch,
        message: "Zero-news batch already ran recently. Wait a few minutes.",
      });
      enforceRateLimit(`contentSync.batchDraftZeroNews:ip:${clientKey(ctx.req)}`, {
        ...RATE_LIMITS.contentSyncBatch,
        message: "Zero-news batch already ran recently. Wait a few minutes.",
      });

      const max = input?.maxFederations ?? 17;
      const zeroFeds = await loadZeroNewsFederations(max);
      if (zeroFeds.length === 0) {
        return {
          provider: resolveContentSyncProvider(ctx.env),
          created: [] as { federationId: number; federationName: string; id: number }[],
          skipped: [] as { federationName: string; reason: string }[],
          remainingZeroNews: 0,
          disclaimer:
            "No active federations with zero published news. Drafts only — never auto-publish.",
        };
      }

      const db = await getDb();
      if (!db) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      }

      let provider: "workers-ai" | "anthropic" | null = null;
      let suggestions: ContentSuggestion[] = [];
      try {
        const result = await generateContentSuggestions(
          ctx.env,
          buildZeroNewsBatchPrompt(zeroFeds)
        );
        provider = result.provider;
        suggestions = result.suggestions;
      } catch (e) {
        const msg = e instanceof Error ? e.message : "AI request failed";
        if (msg.includes("No AI provider")) {
          throw new TRPCError({
            code: "PRECONDITION_FAILED",
            message: `AI unavailable. ${MANUAL_CMS_HINT}`,
          });
        }
        throw toClientSafeTrpcError(
          "contentSync.batchDraftZeroNews",
          e,
          `Content Sync batch failed. ${MANUAL_CMS_HINT}`
        );
      }

      const created: { federationId: number; federationName: string; id: number }[] = [];
      const skipped: { federationName: string; reason: string }[] = [];
      const usedFedIds = new Set<number>();

      for (const suggestion of suggestions) {
        const federationId = matchFederation(zeroFeds, null, suggestion.federationHint);
        if (federationId == null) {
          skipped.push({
            federationName: suggestion.federationHint ?? "(unknown)",
            reason: "Could not match federationHint",
          });
          continue;
        }
        if (usedFedIds.has(federationId)) continue;
        usedFedIds.add(federationId);

        const fed = zeroFeds.find((f) => f.id === federationId);
        const rawSource = suggestion.sourceUrl?.trim() ?? "";
        const sourceUrl =
          rawSource.startsWith("https://") && rawSource.length <= 2_000
            ? rawSource
            : null;
        const sourceNote = sourceUrl
          ? `\n\n---\nResearch source (unverified): ${sourceUrl}`
          : "\n\n---\nResearch lead from Content Sync AI — verify before publish.";

        const [row] = await db
          .insert(newsArticles)
          .values({
            federationId,
            title: suggestion.title.slice(0, 255),
            slug: uniqueSlug(suggestion.title),
            summary: suggestion.summary.slice(0, 2_000),
            content: `${suggestion.summary}${sourceNote}`,
            category: "sports",
            tags: ["content-sync", "ai-draft", "zero-news-batch"],
            sourceUrl,
            sourceName: sourceUrl ? "Content Sync AI" : null,
            authorId: ctx.user.id,
            isPublished: false,
            publishedAt: null,
          })
          .returning({ id: newsArticles.id });

        created.push({
          federationId,
          federationName: fed?.name ?? `federation #${federationId}`,
          id: row.id,
        });
      }

      for (const fed of zeroFeds) {
        if (!usedFedIds.has(fed.id)) {
          skipped.push({
            federationName: fed.name,
            reason: "No AI suggestion matched this federation",
          });
        }
      }

      const stillZero = await loadZeroNewsFederations(100);

      return {
        provider,
        created,
        skipped,
        remainingZeroNews: stillZero.length,
        disclaimer:
          "AI research leads only. All rows are unpublished drafts (isPublished=false). Verify before publish.",
      };
    }),
});
