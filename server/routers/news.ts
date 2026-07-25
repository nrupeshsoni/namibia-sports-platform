import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { newsArticles } from "../../drizzle/schema";
import { eq, desc, and, isNull } from "drizzle-orm";
import {
  publicProcedure,
  federationAdminProcedure,
  router,
} from "../_core/trpc";
import {
  assertClaimMatchesOwnedRow,
  assertSameFederation,
  canIncludeUnpublished,
} from "../_core/federationScope";
import { httpsUrlSchema, optionalHttpsUrlSchema } from "../_core/httpsUrl";
import { listLimitSchema, resolveListLimit } from "../_core/listLimits";

type ScopedUser = { role: string; federationId: number | null };

function normalizeSourceUrl(sourceUrl: string | undefined): string | null | undefined {
  if (sourceUrl === "") return null;
  return sourceUrl;
}

/**
 * Platform admin may assign federationId on orphan rows (null federationId).
 * Federation admins must own the stored row and match the claimed federationId.
 */
function assertNewsRowAccess(
  user: ScopedUser,
  claimedFederationId: number,
  existingFederationId: number | null | undefined,
  notFoundMessage: string
): { assignFederation: boolean } {
  if (user.role === "admin" && existingFederationId == null) {
    return { assignFederation: true };
  }
  assertClaimMatchesOwnedRow(
    user,
    claimedFederationId,
    existingFederationId,
    notFoundMessage
  );
  return { assignFederation: false };
}

export const newsRouter = router({
  list: publicProcedure
    .input(
      z
        .object({
          federationId: z.number().optional(),
          category: z.string().optional(),
          limit: listLimitSchema,
          /** Staff-only: ignored for public/anonymous; federation_admin limited to own federation */
          includeUnpublished: z.boolean().optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      try {
        const db = await getDb();
        if (!db) return [];

        const allowDrafts =
          input?.includeUnpublished === true &&
          canIncludeUnpublished(ctx.user, input.federationId);

        const conditions = [];
        if (!allowDrafts) {
          conditions.push(eq(newsArticles.isPublished, true));
        }
        if (input?.federationId) {
          conditions.push(eq(newsArticles.federationId, input.federationId));
        }
        if (input?.category) {
          conditions.push(eq(newsArticles.category, input.category));
        }

        const result = await db
          .select()
          .from(newsArticles)
          .where(conditions.length > 0 ? and(...conditions) : undefined)
          .orderBy(desc(newsArticles.publishedAt))
          .limit(resolveListLimit(input?.limit));

        return result;
      } catch (e) {
        console.error("[news.list]", e);
        return [];
      }
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;

      const result = await db
        .select()
        .from(newsArticles)
        .where(eq(newsArticles.slug, input.slug))
        .limit(1);

      const article = result[0];
      if (!article || !article.isPublished) return null;
      return article;
    }),

  create: federationAdminProcedure
    .input(
      z.object({
        federationId: z.number(),
        title: z.string(),
        slug: z.string(),
        content: z.string().optional(),
        summary: z.string().optional(),
        category: z.string().optional(),
        tags: z.array(z.string()).optional(),
        featuredImage: httpsUrlSchema.optional(),
        sourceUrl: optionalHttpsUrlSchema,
        sourceName: z.string().max(200).optional().nullable(),
        authorId: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      assertSameFederation(ctx.user, input.federationId);

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const sourceUrl = normalizeSourceUrl(input.sourceUrl);
      const { sourceUrl: _raw, ...rest } = input;

      const [result] = await db
        .insert(newsArticles)
        .values({
          ...rest,
          sourceUrl: sourceUrl ?? null,
          sourceName: input.sourceName ?? null,
          authorId: input.authorId ?? (ctx.user?.id ?? null),
        })
        .returning({ id: newsArticles.id });
      return { success: true, id: result.id };
    }),

  update: federationAdminProcedure
    .input(
      z.object({
        id: z.number(),
        federationId: z.number(),
        title: z.string().optional(),
        slug: z.string().optional(),
        content: z.string().optional(),
        summary: z.string().optional(),
        category: z.string().optional(),
        tags: z.array(z.string()).optional(),
        featuredImage: httpsUrlSchema.optional(),
        sourceUrl: optionalHttpsUrlSchema,
        sourceName: z.string().max(200).optional().nullable(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      assertSameFederation(ctx.user, input.federationId);

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const [existing] = await db
        .select({ federationId: newsArticles.federationId })
        .from(newsArticles)
        .where(eq(newsArticles.id, input.id))
        .limit(1);
      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Article not found" });
      }
      const { assignFederation } = assertNewsRowAccess(
        ctx.user,
        input.federationId,
        existing.federationId,
        "Article not found"
      );

      const sourceUrl =
        input.sourceUrl !== undefined
          ? normalizeSourceUrl(input.sourceUrl) ?? null
          : undefined;
      const { id, federationId, sourceUrl: _raw, ...data } = input;
      const patch = {
        ...data,
        ...(sourceUrl !== undefined ? { sourceUrl } : {}),
        updatedAt: new Date(),
        ...(assignFederation ? { federationId } : {}),
      };

      await db
        .update(newsArticles)
        .set(patch)
        .where(
          assignFederation
            ? and(eq(newsArticles.id, id), isNull(newsArticles.federationId))
            : and(eq(newsArticles.id, id), eq(newsArticles.federationId, federationId))
        );
      return { success: true };
    }),

  publish: federationAdminProcedure
    .input(z.object({ id: z.number(), federationId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      assertSameFederation(ctx.user, input.federationId);

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const [existing] = await db
        .select({ federationId: newsArticles.federationId })
        .from(newsArticles)
        .where(eq(newsArticles.id, input.id))
        .limit(1);
      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Article not found" });
      }
      const { assignFederation } = assertNewsRowAccess(
        ctx.user,
        input.federationId,
        existing.federationId,
        "Article not found"
      );

      await db
        .update(newsArticles)
        .set({
          isPublished: true,
          publishedAt: new Date(),
          updatedAt: new Date(),
          ...(assignFederation ? { federationId: input.federationId } : {}),
        })
        .where(
          assignFederation
            ? and(eq(newsArticles.id, input.id), isNull(newsArticles.federationId))
            : and(
                eq(newsArticles.id, input.id),
                eq(newsArticles.federationId, input.federationId)
              )
        );
      return { success: true };
    }),

  delete: federationAdminProcedure
    .input(z.object({ id: z.number(), federationId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      assertSameFederation(ctx.user, input.federationId);

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const [existing] = await db
        .select({ federationId: newsArticles.federationId })
        .from(newsArticles)
        .where(eq(newsArticles.id, input.id))
        .limit(1);
      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Article not found" });
      }
      const { assignFederation } = assertNewsRowAccess(
        ctx.user,
        input.federationId,
        existing.federationId,
        "Article not found"
      );

      await db
        .delete(newsArticles)
        .where(
          assignFederation
            ? and(eq(newsArticles.id, input.id), isNull(newsArticles.federationId))
            : and(
                eq(newsArticles.id, input.id),
                eq(newsArticles.federationId, input.federationId)
              )
        );
      return { success: true };
    }),
});
