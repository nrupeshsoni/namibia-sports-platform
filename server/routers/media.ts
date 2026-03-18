import { z } from "zod";
import { getDb } from "../db";
import { media } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";

const entityTypeSchema = z.enum(["federation", "club", "event", "athlete", "venue", "coach"]);

export const mediaRouter = router({
  list: publicProcedure
    .input(
      z
        .object({
          entityType: entityTypeSchema.optional(),
          entityId: z.number().optional(),
          type: z.enum(["image", "video", "document"]).optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      const conditions = [];
      if (input?.entityType) {
        conditions.push(eq(media.entityType, input.entityType));
      }
      if (input?.entityId !== undefined) {
        conditions.push(eq(media.entityId, input.entityId));
      }
      if (input?.type) {
        conditions.push(eq(media.type, input.type));
      }

      const result = await db
        .select()
        .from(media)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .limit(100);

      return result;
    }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;

      const result = await db
        .select()
        .from(media)
        .where(eq(media.id, input.id))
        .limit(1);

      return result[0] || null;
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().optional(),
        fileUrl: z.string().url(),
        thumbnailUrl: z.string().url().optional(),
        type: z.enum(["image", "video", "document"]).default("image"),
        entityType: entityTypeSchema,
        entityId: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const [result] = await db.insert(media).values(input).returning({ id: media.id });
      return { success: true, id: result.id };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.delete(media).where(eq(media.id, input.id));
      return { success: true };
    }),
});
