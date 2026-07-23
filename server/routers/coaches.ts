import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { coaches } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { publicProcedure, federationAdminProcedure, router } from "../_core/trpc";
import {
  assertSameFederation,
  canIncludeInactive,
  canViewNonPublic,
} from "../_core/federationScope";
import { listLimitSchema, resolveListLimit } from "../_core/listLimits";

function isStaff(role: string | null | undefined): boolean {
  return role === "admin" || role === "federation_admin";
}

/** Public responses never expose contact PII. */
function stripCoachPii<T extends { email: unknown; phone: unknown }>(
  row: T
): Omit<T, "email" | "phone"> & { email: null; phone: null } {
  return { ...row, email: null, phone: null };
}

export const coachesRouter = router({
  /**
   * Public directory — active coaches only; PII stripped.
   * Staff may pass `includeInactive` / `includePii`.
   */
  list: publicProcedure
    .input(
      z
        .object({
          federationId: z.number().optional(),
          clubId: z.number().optional(),
          limit: listLimitSchema,
          /** Staff-only; federation_admin must pass matching federationId */
          includeInactive: z.boolean().optional(),
          /** Ignored unless caller is admin or federation_admin. */
          includePii: z.boolean().optional(),
        })
        .optional()
    )
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) return [];

      const staff = isStaff(ctx.user?.role);
      const allowInactive =
        input?.includeInactive === true &&
        canIncludeInactive(ctx.user, input.federationId);
      const conditions = [];
      if (!allowInactive) {
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
        .orderBy(coaches.firstName)
        .limit(resolveListLimit(input?.limit));

      if (input?.includePii === true && staff) return result;
      return result.map(stripCoachPii);
    }),

  /** Public profile by id — active only (staff may see inactive); PII stripped unless staff + includePii. */
  getById: publicProcedure
    .input(
      z.object({
        id: z.number(),
        /** Ignored unless caller is admin or federation_admin. */
        includePii: z.boolean().optional(),
      })
    )
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) return null;

      const result = await db
        .select()
        .from(coaches)
        .where(eq(coaches.id, input.id))
        .limit(1);

      const row = result[0];
      if (!row) return null;
      if (!row.isActive && !canViewNonPublic(ctx.user, row.federationId)) {
        return null;
      }
      if (input.includePii === true && isStaff(ctx.user?.role)) return row;
      return stripCoachPii(row);
    }),

  create: federationAdminProcedure
    .input(
      z.object({
        firstName: z.string(),
        lastName: z.string(),
        federationId: z.number(),
        clubId: z.number().optional(),
        photoUrl: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
        certifications: z.string().optional(),
        specialization: z.string().optional(),
        yearsExperience: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      assertSameFederation(ctx.user, input.federationId);

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
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const [existing] = await db
        .select({ federationId: coaches.federationId })
        .from(coaches)
        .where(eq(coaches.id, input.id))
        .limit(1);
      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Coach not found" });
      }
      assertSameFederation(ctx.user, existing.federationId);

      const { id, federationId: nextFederationId, ...data } = input;
      if (nextFederationId !== undefined) {
        assertSameFederation(ctx.user, nextFederationId);
      }

      await db
        .update(coaches)
        .set(nextFederationId !== undefined ? { ...data, federationId: nextFederationId } : data)
        .where(eq(coaches.id, id));
      return { success: true };
    }),

  delete: federationAdminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const [existing] = await db
        .select({ federationId: coaches.federationId })
        .from(coaches)
        .where(eq(coaches.id, input.id))
        .limit(1);
      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Coach not found" });
      }
      assertSameFederation(ctx.user, existing.federationId);

      await db.delete(coaches).where(eq(coaches.id, input.id));
      return { success: true };
    }),
});
