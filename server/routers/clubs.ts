import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { clubs } from "../../drizzle/schema";
import { eq, like, and } from "drizzle-orm";
import { federationAdminProcedure, publicProcedure, router } from "../_core/trpc";
import {
  assertSameFederation,
  canIncludeInactive,
  canViewNonPublic,
} from "../_core/federationScope";
import { listLimitSchema, resolveListLimit } from "../_core/listLimits";
import { optionalHttpsUrlSchema } from "../_core/httpsUrl";

/**
 * A34: directory reads run over Hyperdrive/postgres (RLS never applies), so the
 * router is the only gate. Null contact columns for non-staff. Unlike
 * schools/venues, clubs are federation-scoped, so the owning federation_admin
 * (not just a platform admin) may see their own clubs' contacts — gated via
 * {@link canViewNonPublic}.
 */
function stripClubContact<T extends { contactEmail: unknown; contactPhone: unknown }>(
  row: T
): Omit<T, "contactEmail" | "contactPhone"> & { contactEmail: null; contactPhone: null } {
  return { ...row, contactEmail: null, contactPhone: null };
}

export const clubsRouter = router({
  /** Public directory — active clubs only. Staff may pass `includeInactive`. */
  list: publicProcedure
    .input(
      z
        .object({
          federationId: z.number().optional(),
          region: z.string().optional(),
          search: z.string().optional(),
          limit: listLimitSchema,
          /** Staff-only; federation_admin must pass matching federationId */
          includeInactive: z.boolean().optional(),
        })
        .optional()
    )
    .query(async ({ input, ctx }) => {
      try {
        const db = await getDb();
        if (!db) return [];

        const allowInactive =
          input?.includeInactive === true &&
          canIncludeInactive(ctx.user, input.federationId);
        // Staff for the queried federation (admin, or the owning federation_admin)
        // may receive contact PII; everyone else gets a contact-free directory.
        const allowContact = canViewNonPublic(ctx.user, input?.federationId ?? null);
        const conditions = [];
        if (!allowInactive) {
          conditions.push(eq(clubs.isActive, true));
        }
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
          .where(and(...conditions))
          .orderBy(clubs.name)
          .limit(resolveListLimit(input?.limit));

        if (allowContact) return result;
        return result.map(stripClubContact);
      } catch (e) {
        console.error("[clubs.list]", e);
        return [];
      }
    }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return null;

      const result = await db
        .select()
        .from(clubs)
        .where(eq(clubs.id, input.id))
        .limit(1);

      const row = result[0];
      if (!row) return null;
      if (!row.isActive && !canViewNonPublic(ctx.user, row.federationId)) {
        return null;
      }
      if (canViewNonPublic(ctx.user, row.federationId)) return row;
      return stripClubContact(row);
    }),

  create: federationAdminProcedure
    .input(
      z.object({
        name: z.string(),
        slug: z.string(),
        federationId: z.number(),
        description: z.string().optional(),
        logoUrl: z.string().optional(),
        contactEmail: z.string().optional(),
        contactPhone: z.string().optional(),
        website: optionalHttpsUrlSchema,
        address: z.string().optional(),
        region: z.string().optional(),
        city: z.string().optional(),
        presidentName: z.string().optional(),
        coachName: z.string().optional(),
        establishedYear: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      assertSameFederation(ctx.user, input.federationId);

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const website = input.website === "" ? null : input.website;
      const [result] = await db
        .insert(clubs)
        .values({ ...input, website })
        .returning({ id: clubs.id });
      return { success: true, id: result.id };
    }),

  update: federationAdminProcedure
    .input(
      z.object({
        id: z.number(),
        federationId: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        logoUrl: z.string().optional(),
        contactEmail: z.string().optional(),
        contactPhone: z.string().optional(),
        website: optionalHttpsUrlSchema,
        address: z.string().optional(),
        region: z.string().optional(),
        city: z.string().optional(),
        presidentName: z.string().optional(),
        coachName: z.string().optional(),
        establishedYear: z.number().optional(),
        isActive: z.boolean().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      assertSameFederation(ctx.user, input.federationId);

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const [existing] = await db
        .select({ federationId: clubs.federationId })
        .from(clubs)
        .where(eq(clubs.id, input.id))
        .limit(1);
      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Club not found" });
      }
      assertSameFederation(ctx.user, existing.federationId);
      if (existing.federationId !== input.federationId) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Club not found" });
      }

      const { id, federationId, website, ...rest } = input;
      const data = {
        ...rest,
        ...(website !== undefined ? { website: website === "" ? null : website } : {}),
      };
      await db
        .update(clubs)
        .set(data)
        .where(and(eq(clubs.id, id), eq(clubs.federationId, federationId)));
      return { success: true };
    }),

  delete: federationAdminProcedure
    .input(z.object({ id: z.number(), federationId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      assertSameFederation(ctx.user, input.federationId);

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const [existing] = await db
        .select({ federationId: clubs.federationId })
        .from(clubs)
        .where(eq(clubs.id, input.id))
        .limit(1);
      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Club not found" });
      }
      assertSameFederation(ctx.user, existing.federationId);
      if (existing.federationId !== input.federationId) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Club not found" });
      }

      await db
        .delete(clubs)
        .where(and(eq(clubs.id, input.id), eq(clubs.federationId, input.federationId)));
      return { success: true };
    }),
});
