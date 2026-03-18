import { z } from "zod";
import { getDb } from "../db";
import { highPerformancePrograms } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";

const programTypeSchema = z.enum([
  "talent_identification",
  "training",
  "development",
  "elite",
]);

export const hpProgramsRouter = router({
  list: publicProcedure
    .input(
      z
        .object({
          federationId: z.number().optional(),
          programType: programTypeSchema.optional(),
          isActive: z.boolean().optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      const conditions = [];
      if (input?.federationId) {
        conditions.push(eq(highPerformancePrograms.federationId, input.federationId));
      }
      if (input?.programType) {
        conditions.push(eq(highPerformancePrograms.programType, input.programType));
      }
      if (input?.isActive !== undefined) {
        conditions.push(eq(highPerformancePrograms.isActive, input.isActive));
      }

      const result = await db
        .select()
        .from(highPerformancePrograms)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(highPerformancePrograms.startDate);

      return result;
    }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;

      const result = await db
        .select()
        .from(highPerformancePrograms)
        .where(eq(highPerformancePrograms.id, input.id))
        .limit(1);

      return result[0] || null;
    }),

  create: protectedProcedure
    .input(
      z.object({
        federationId: z.number(),
        name: z.string(),
        description: z.string().optional(),
        programType: programTypeSchema,
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        participants: z.array(z.number()).optional(),
        coaches: z.array(z.number()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const [result] = await db
        .insert(highPerformancePrograms)
        .values(input)
        .returning({ id: highPerformancePrograms.id });
      return { success: true, id: result.id };
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        programType: programTypeSchema.optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        participants: z.array(z.number()).optional(),
        coaches: z.array(z.number()).optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const { id, ...updates } = input;
      await db
        .update(highPerformancePrograms)
        .set(updates)
        .where(eq(highPerformancePrograms.id, id));
      return { success: true };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db
        .delete(highPerformancePrograms)
        .where(eq(highPerformancePrograms.id, input.id));
      return { success: true };
    }),
});
