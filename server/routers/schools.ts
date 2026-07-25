import { z } from "zod";
import { regionMatches } from "../_core/regionFilter";
import { getDb } from "../db";
import { schools } from "../../drizzle/schema";
import { eq, like, and } from "drizzle-orm";
import { publicProcedure, adminProcedure, router } from "../_core/trpc";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/**
 * A34: the public directory reads run over Hyperdrive/postgres, so Supabase RLS
 * never applies — the router itself is the only gate. Mirror the athletes/coaches
 * `stripAthletePii` pattern and null contact columns for non-staff callers.
 * Schools are managed by platform admins only (`adminProcedure`), so only an
 * admin may see contact details.
 */
function stripSchoolContact<T extends { contactEmail: unknown; contactPhone: unknown }>(
  row: T
): Omit<T, "contactEmail" | "contactPhone"> & { contactEmail: null; contactPhone: null } {
  return { ...row, contactEmail: null, contactPhone: null };
}

export const schoolsRouter = router({
  list: publicProcedure
    .input(
      z
        .object({
          region: z.string().optional(),
          search: z.string().optional(),
          /** Platform admin only — public always sees active schools. */
          includeInactive: z.boolean().optional(),
        })
        .optional()
    )
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) return [];

      const allowInactive =
        input?.includeInactive === true && ctx.user?.role === "admin";

      const conditions = [];
      if (!allowInactive) {
        conditions.push(eq(schools.isActive, true));
      }
      if (input?.region) {
        const rm = regionMatches(schools.region, input.region);
        if (rm) conditions.push(rm);
      }
      if (input?.search) {
        conditions.push(like(schools.name, `%${input.search}%`));
      }

      const result = await db
        .select()
        .from(schools)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(schools.name)
        .limit(100);

      if (ctx.user?.role === "admin") return result;
      return result.map(stripSchoolContact);
    }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) return null;

      const result = await db
        .select()
        .from(schools)
        .where(eq(schools.id, input.id))
        .limit(1);

      const row = result[0];
      if (!row) return null;
      if (!row.isActive && ctx.user?.role !== "admin") return null;
      if (ctx.user?.role === "admin") return row;
      return stripSchoolContact(row);
    }),

  create: adminProcedure
    .input(
      z.object({
        name: z.string(),
        region: z.string().optional(),
        city: z.string().optional(),
        contactEmail: z.string().optional(),
        contactPhone: z.string().optional(),
        sportsOffered: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const [result] = await db.insert(schools).values(input).returning({ id: schools.id });
      return { success: true, id: result.id };
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        region: z.string().optional(),
        city: z.string().optional(),
        contactEmail: z.string().optional(),
        contactPhone: z.string().optional(),
        sportsOffered: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const { id, ...updates } = input;
      await db.update(schools).set(updates).where(eq(schools.id, id));
      return { success: true };
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.update(schools).set({ isActive: false }).where(eq(schools.id, input.id));
      return { success: true };
    }),
});

