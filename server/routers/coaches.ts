import { z } from "zod";
import { getDb } from "../db";
import { coaches } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";

export const coachesRouter = router({
  list: publicProcedure
    .input(
      z
        .object({
          federationId: z.number().optional(),
          clubId: z.number().optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      const conditions = [];
      if (input?.federationId) {
        conditions.push(eq(coaches.federationId, input.federationId));
      }
      if (input?.clubId) {
        conditions.push(eq(coaches.clubId, input.clubId));
      }

      const result = await db
        .select()
        .from(coaches)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(coaches.firstName);

      return result;
    }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;

      const result = await db
        .select()
        .from(coaches)
        .where(eq(coaches.id, input.id))
        .limit(1);

      return result[0] || null;
    }),

  create: protectedProcedure
    .input(
      z.object({
        firstName: z.string(),
        lastName: z.string(),
        federationId: z.number().optional(),
        clubId: z.number().optional(),
        photoUrl: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
        certifications: z.string().optional(),
        specialization: z.string().optional(),
        yearsExperience: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const [result] = await db.insert(coaches).values(input).returning({ id: coaches.id });
      return { success: true, id: result.id };
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        federationId: z.number().optional(),
        clubId: z.number().optional(),
        photoUrl: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
        certifications: z.string().optional(),
        specialization: z.string().optional(),
        yearsExperience: z.number().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const { id, ...data } = input;
      await db.update(coaches).set(data).where(eq(coaches.id, id));
      return { success: true };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.delete(coaches).where(eq(coaches.id, input.id));
      return { success: true };
    }),
});
