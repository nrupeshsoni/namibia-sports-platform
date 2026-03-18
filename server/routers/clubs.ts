import { z } from "zod";
import { getDb } from "../db";
import { clubs } from "../../drizzle/schema";
import { eq, like, and } from "drizzle-orm";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";

export const clubsRouter = router({
  list: publicProcedure
    .input(
      z
        .object({
          federationId: z.number().optional(),
          region: z.string().optional(),
          search: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      const conditions = [];
      if (input?.federationId) {
        conditions.push(eq(clubs.federationId, input.federationId));
      }
      if (input?.region) {
        conditions.push(eq(clubs.region, input.region));
      }
      if (input?.search) {
        conditions.push(like(clubs.name, `%${input.search}%`));
      }

      const result = await db
        .select()
        .from(clubs)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(clubs.name);

      return result;
    }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;

      const result = await db
        .select()
        .from(clubs)
        .where(eq(clubs.id, input.id))
        .limit(1);

      return result[0] || null;
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        slug: z.string(),
        federationId: z.number(),
        description: z.string().optional(),
        logoUrl: z.string().optional(),
        contactEmail: z.string().optional(),
        contactPhone: z.string().optional(),
        website: z.string().optional(),
        address: z.string().optional(),
        region: z.string().optional(),
        city: z.string().optional(),
        presidentName: z.string().optional(),
        coachName: z.string().optional(),
        establishedYear: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const [result] = await db.insert(clubs).values(input).returning({ id: clubs.id });
      return { success: true, id: result.id };
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        logoUrl: z.string().optional(),
        contactEmail: z.string().optional(),
        contactPhone: z.string().optional(),
        website: z.string().optional(),
        address: z.string().optional(),
        region: z.string().optional(),
        city: z.string().optional(),
        presidentName: z.string().optional(),
        coachName: z.string().optional(),
        establishedYear: z.number().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const { id, ...data } = input;
      await db.update(clubs).set(data).where(eq(clubs.id, id));
      return { success: true };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.delete(clubs).where(eq(clubs.id, input.id));
      return { success: true };
    }),
});
