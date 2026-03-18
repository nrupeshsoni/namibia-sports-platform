import { z } from "zod";
import { getDb } from "../db";
import { athletes } from "../../drizzle/schema";
import { eq, and, like, or } from "drizzle-orm";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";

export const athletesRouter = router({
  list: publicProcedure
    .input(
      z
        .object({
          federationId: z.number().optional(),
          clubId: z.number().optional(),
          nationality: z.string().optional(),
          search: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      const conditions = [];
      if (input?.federationId) {
        conditions.push(eq(athletes.federationId, input.federationId));
      }
      if (input?.clubId) {
        conditions.push(eq(athletes.clubId, input.clubId));
      }
      if (input?.nationality) {
        conditions.push(eq(athletes.nationality, input.nationality));
      }
      if (input?.search) {
        conditions.push(
          or(
            like(athletes.firstName, `%${input.search}%`),
            like(athletes.lastName, `%${input.search}%`)
          )
        );
      }

      const result = await db
        .select()
        .from(athletes)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(athletes.firstName);

      return result;
    }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;

      const result = await db
        .select()
        .from(athletes)
        .where(eq(athletes.id, input.id))
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
        dateOfBirth: z.date().optional(),
        gender: z.enum(["male", "female", "other"]).optional(),
        nationality: z.string().optional(),
        photoUrl: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
        achievements: z.string().optional(),
        currentRanking: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const [result] = await db.insert(athletes).values(input).returning({ id: athletes.id });
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
        dateOfBirth: z.date().optional(),
        gender: z.enum(["male", "female", "other"]).optional(),
        photoUrl: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
        achievements: z.string().optional(),
        currentRanking: z.number().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const { id, ...data } = input;
      await db.update(athletes).set(data).where(eq(athletes.id, id));
      return { success: true };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.delete(athletes).where(eq(athletes.id, input.id));
      return { success: true };
    }),
});
