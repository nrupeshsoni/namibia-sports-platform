import { z } from "zod";
import { getDb } from "../db";
import { venues } from "../../drizzle/schema";
import { eq, like, and } from "drizzle-orm";
import { publicProcedure, adminProcedure, router } from "../_core/trpc";
import { listLimitSchema, resolveListLimit } from "../_core/listLimits";

/**
 * A34: directory reads run over Hyperdrive/postgres (RLS never applies), so the
 * router is the only gate. Null contact columns for non-staff — venues are
 * managed by platform admins only, so only an admin sees contact details.
 */
function stripVenueContact<T extends { contactEmail: unknown; contactPhone: unknown }>(
  row: T
): Omit<T, "contactEmail" | "contactPhone"> & { contactEmail: null; contactPhone: null } {
  return { ...row, contactEmail: null, contactPhone: null };
}

export const venuesRouter = router({
  list: publicProcedure
    .input(
      z
        .object({
          region: z.string().optional(),
          search: z.string().optional(),
          /** Platform admin only — public always sees active venues. */
          includeInactive: z.boolean().optional(),
          limit: listLimitSchema,
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return [];

      const allowInactive =
        input?.includeInactive === true && ctx.user?.role === "admin";

      const conditions = [];
      if (!allowInactive) {
        conditions.push(eq(venues.isActive, true));
      }
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
        .orderBy(venues.name)
        .limit(resolveListLimit(input?.limit));

      if (ctx.user?.role === "admin") return result;
      return result.map(stripVenueContact);
    }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return null;

      const result = await db
        .select()
        .from(venues)
        .where(eq(venues.id, input.id))
        .limit(1);

      const row = result[0];
      if (!row) return null;
      if (!row.isActive && ctx.user?.role !== "admin") return null;
      if (ctx.user?.role === "admin") return row;
      return stripVenueContact(row);
    }),

  create: adminProcedure
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

  update: adminProcedure
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

  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.delete(venues).where(eq(venues.id, input.id));
      return { success: true };
    }),
});
