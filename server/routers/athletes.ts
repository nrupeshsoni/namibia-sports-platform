import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { athletes, federations, clubs } from "../../drizzle/schema";
import { eq, and, like, or } from "drizzle-orm";
import { publicProcedure, federationAdminProcedure, router } from "../_core/trpc";
import { assertSameFederation } from "../_core/federationScope";

/** Derives URL slug: "Christine Mboma" + id 1 → "christine-mboma-1" */
function athleteSlug(firstName: string, lastName: string, id: number): string {
  const base = `${firstName}-${lastName}-${id}`
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
  return base;
}

export const athletesRouter = router({
  /** Public directory — active athletes only. Staff may pass `includeInactive`. */
  list: publicProcedure
    .input(
      z
        .object({
          federationId: z.number().optional(),
          clubId: z.number().optional(),
          nationality: z.string().optional(),
          search: z.string().optional(),
          /** Ignored unless caller is admin or federation_admin. */
          includeInactive: z.boolean().optional(),
        })
        .optional()
    )
    .query(async ({ input, ctx }) => {
      try {
        const db = await getDb();
        if (!db) return [];

        const staff =
          ctx.user?.role === "admin" || ctx.user?.role === "federation_admin";
        const conditions = [];
        if (!(input?.includeInactive === true && staff)) {
          conditions.push(eq(athletes.isActive, true));
        }
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
          .where(and(...conditions))
          .orderBy(athletes.firstName);

        return result;
      } catch (e) {
        console.error("[athletes.list]", e);
        return [];
      }
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

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;

      const rows = await db
        .select({
          athlete: athletes,
          federationName: federations.name,
          federationSlug: federations.slug,
          clubName: clubs.name,
          clubSlug: clubs.slug,
        })
        .from(athletes)
        .leftJoin(federations, eq(athletes.federationId, federations.id))
        .leftJoin(clubs, eq(athletes.clubId, clubs.id))
        .where(eq(athletes.slug, input.slug))
        .limit(1);

      const row = rows[0];
      if (!row) return null;

      return {
        ...row.athlete,
        federationName: row.federationName ?? null,
        federationSlug: row.federationSlug ?? null,
        clubName: row.clubName ?? null,
        clubSlug: row.clubSlug ?? null,
      };
    }),

  create: federationAdminProcedure
    .input(
      z.object({
        firstName: z.string(),
        lastName: z.string(),
        federationId: z.number(),
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

      const [inserted] = await db.insert(athletes).values(input).returning({ id: athletes.id });
      const slug = athleteSlug(input.firstName, input.lastName, inserted.id);
      await db.update(athletes).set({ slug }).where(eq(athletes.id, inserted.id));
      return { success: true, id: inserted.id };
    }),

  update: federationAdminProcedure
    .input(
      z.object({
        id: z.number(),
        federationId: z.number(),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
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

      const { id, federationId, ...data } = input;
      if (data.firstName != null || data.lastName != null) {
        const [current] = await db
          .select()
          .from(athletes)
          .where(and(eq(athletes.id, id), eq(athletes.federationId, federationId)))
          .limit(1);
        if (current) {
          const firstName = data.firstName ?? current.firstName;
          const lastName = data.lastName ?? current.lastName;
          (data as Record<string, unknown>).slug = athleteSlug(firstName, lastName, id);
        }
      }
      await db
        .update(athletes)
        .set(data)
        .where(and(eq(athletes.id, id), eq(athletes.federationId, federationId)));
      return { success: true };
    }),

  delete: federationAdminProcedure
    .input(z.object({ id: z.number(), federationId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const [existing] = await db
        .select({ federationId: athletes.federationId })
        .from(athletes)
        .where(eq(athletes.id, input.id))
        .limit(1);
      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Athlete not found" });
      }
      assertSameFederation(ctx.user, existing.federationId);
      assertSameFederation(ctx.user, input.federationId);

      await db
        .delete(athletes)
        .where(and(eq(athletes.id, input.id), eq(athletes.federationId, input.federationId)));
      return { success: true };
    }),
});
