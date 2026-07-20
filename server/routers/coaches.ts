import { z } from "zod";
import { getDb } from "../db";
import { coaches } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { publicProcedure, federationAdminProcedure, router } from "../_core/trpc";

export const coachesRouter = router({
  /** Public directory — active coaches only. Staff may pass `includeInactive`. */
  list: publicProcedure
    .input(
      z
        .object({
          federationId: z.number().optional(),
          clubId: z.number().optional(),
          /** Ignored unless caller is admin or federation_admin. */
          includeInactive: z.boolean().optional(),
        })
        .optional()
    )
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) return [];

      const staff =
        ctx.user?.role === "admin" || ctx.user?.role === "federation_admin";
      const conditions = [];
      if (!(input?.includeInactive === true && staff)) {
        conditions.push(eq(coaches.isActive, true));
      }
      if (input?.federationId) {
        conditions.push(eq(coaches.federationId, input.federationId));
      }
      if (input?.clubId) {
        conditions.push(eq(coaches.clubId, input.clubId));
      }

      const result = await db
        .select()
        .from(coaches)
        .where(and(...conditions))
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

  create: federationAdminProcedure
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

  update: federationAdminProcedure
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

  delete: federationAdminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.delete(coaches).where(eq(coaches.id, input.id));
      return { success: true };
    }),
});
