import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { newsArticles } from "../../drizzle/schema";
import { eq, desc, and } from "drizzle-orm";
import {
  publicProcedure,
  adminProcedure,
  federationAdminProcedure,
  router,
} from "../_core/trpc";

export const newsRouter = router({
  list: publicProcedure
    .input(
      z
        .object({
          federationId: z.number().optional(),
          category: z.string().optional(),
          limit: z.number().optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      const conditions = [eq(newsArticles.isPublished, true)];
      if (input?.federationId) {
        conditions.push(eq(newsArticles.federationId, input.federationId));
      }
      if (input?.category) {
        conditions.push(eq(newsArticles.category, input.category));
      }

      const result = await db
        .select()
        .from(newsArticles)
        .where(and(...conditions))
        .orderBy(desc(newsArticles.publishedAt))
        .limit(input?.limit ?? 50);

      return result;
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
        featuredImage: z.string().optional(),
        authorId: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const [result] = await db
        .insert(newsArticles)
        .values({
          ...input,
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
        featuredImage: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const { id, federationId, ...data } = input;
      await db
        .update(newsArticles)
        .set({ ...data, updatedAt: new Date() })
        .where(and(eq(newsArticles.id, id), eq(newsArticles.federationId, federationId)));
      return { success: true };
    }),

  publish: federationAdminProcedure
    .input(z.object({ id: z.number(), federationId: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      await db
        .update(newsArticles)
        .set({ isPublished: true, publishedAt: new Date(), updatedAt: new Date() })
        .where(and(eq(newsArticles.id, input.id), eq(newsArticles.federationId, input.federationId)));
      return { success: true };
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      await db.delete(newsArticles).where(eq(newsArticles.id, input.id));
      return { success: true };
    }),
});
