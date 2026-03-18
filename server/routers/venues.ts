import { z } from "zod";
import { getDb } from "../db";
import { venues } from "../../drizzle/schema";
import { eq, like, and } from "drizzle-orm";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";

export const venuesRouter = router({
  list: publicProcedure
    .input(
      z
        .object({
          region: z.string().optional(),
          search: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      const conditions = [];
      if (input?.region) {
        conditions.push(eq(venues.region, input.region));
      }
      if (input?.search) {
        conditions.push(like(venues.name, `%${input.search}%`));
      }

      const result = await db
        .select()
        .from(venues)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(venues.name);

      return result;
    }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;

      const result = await db
        .select()
        .from(venues)
        .where(eq(venues.id, input.id))
        .limit(1);

      return result[0] || null;
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        slug: z.string(),
        description: z.string().optional(),
        photoUrl: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        region: z.string().optional(),
        contactEmail: z.string().optional(),
        contactPhone: z.string().optional(),
        capacity: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const [result] = await db.insert(venues).values(input).returning({ id: venues.id });
      return { success: true, id: result.id };
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        photoUrl: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        region: z.string().optional(),
        contactEmail: z.string().optional(),
        contactPhone: z.string().optional(),
        capacity: z.number().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const { id, ...data } = input;
      await db.update(venues).set(data).where(eq(venues.id, id));
      return { success: true };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.delete(venues).where(eq(venues.id, input.id));
      return { success: true };
    }),
});
