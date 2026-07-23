import { z } from "zod";
import { getDb } from "../db";
import { federations, type Federation } from "../../drizzle/schema";
import { eq, like, and, ilike } from "drizzle-orm";
import { publicProcedure, adminProcedure, router } from "../_core/trpc";
import { optionalHttpsUrlSchema } from "../_core/httpsUrl";
import { listLimitSchema, resolveListLimit } from "../_core/listLimits";

/** Derives URL slug from federation name: "Karate Namibia" → "karate-namibia" */
function nameToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

type Db = NonNullable<Awaited<ReturnType<typeof getDb>>>;

/**
 * If the row is inactive and has merged_into_slug, return the canonical federation.
 * Preserves old public URLs after soft-merges.
 */
async function resolveCanonical(db: Db, row: Federation | undefined): Promise<Federation | null> {
  if (!row) return null;
  if (row.isActive) return row;
  if (!row.mergedIntoSlug) return null;

  const [canonical] = await db
    .select()
    .from(federations)
    .where(eq(federations.slug, row.mergedIntoSlug))
    .limit(1);

  return canonical ?? null;
}

export const federationsRouter = router({
  /** Public directory — active federations only (hides soft-merged duplicates). */
  list: publicProcedure
    .input(
      z
        .object({
          search: z.string().optional(),
          type: z.enum(["federation", "umbrella", "ministry", "commission"]).optional(),
          limit: listLimitSchema,
        })
        .optional()
    )
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) return [];

        const conditions = [eq(federations.isActive, true)];
        if (input?.search) {
          conditions.push(like(federations.name, `%${input.search}%`));
        }
        if (input?.type) {
          conditions.push(eq(federations.type, input.type));
        }

        return await db
          .select()
          .from(federations)
          .where(and(...conditions))
          .orderBy(federations.id)
          .limit(resolveListLimit(input?.limit));
      } catch (e) {
        console.error("[federations.list]", e);
        return [];
      }
    }),

  /**
   * Admin-only full list including inactive/merged rows.
   * Public `list` never returns inactive federations.
   */
  listAll: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];
    return await db.select().from(federations).orderBy(federations.id);
  }),

  /**
   * Public: active row, or canonical successor when soft-merged.
   * Inactive rows without merge are hidden (use `listAll` for admin CRUD).
   */
  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;

      const [row] = await db
        .select()
        .from(federations)
        .where(eq(federations.id, input.id))
        .limit(1);

      return resolveCanonical(db, row);
    }),

  getByAbbreviation: publicProcedure
    .input(z.object({ abbreviation: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;

      const [row] = await db
        .select()
        .from(federations)
        .where(eq(federations.abbreviation, input.abbreviation))
        .limit(1);

      return resolveCanonical(db, row);
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) return null;

        const slugLower = input.slug.toLowerCase();

        // 1. Exact slug match
        let result = await db
          .select()
          .from(federations)
          .where(eq(federations.slug, input.slug))
          .limit(1);

        if (result[0]) return resolveCanonical(db, result[0]);

        // 2. Case-insensitive slug match (handles "Karate" vs "karate")
        result = await db
          .select()
          .from(federations)
          .where(ilike(federations.slug, input.slug))
          .limit(1);

        if (result[0]) return resolveCanonical(db, result[0]);

        // 3. Abbreviation match (e.g. "kna" for Karate Namibia)
        result = await db
          .select()
          .from(federations)
          .where(ilike(federations.abbreviation, input.slug))
          .limit(1);

        if (result[0]) return resolveCanonical(db, result[0]);

        // 4. fed-{id} fallback
        const fedIdMatch = input.slug.match(/^fed-(\d+)$/);
        if (fedIdMatch) {
          result = await db
            .select()
            .from(federations)
            .where(eq(federations.id, parseInt(fedIdMatch[1], 10)))
            .limit(1);
          if (result[0]) return resolveCanonical(db, result[0]);
        }

        // 5. Name-derived slug: "Karate Namibia" → "karate-namibia"
        const all = await db.select().from(federations);
        const found = all.find((f) => nameToSlug(f.name) === slugLower);
        return resolveCanonical(db, found);
      } catch (e) {
        console.error("[federations.getBySlug]", e);
        return null;
      }
    }),

  create: adminProcedure
    .input(
      z.object({
        name: z.string(),
        abbreviation: z.string().optional(),
        description: z.string().optional(),
        logo: z.string().optional(),
        backgroundImage: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
        website: optionalHttpsUrlSchema,
        president: z.string().optional(),
        secretaryGeneral: z.string().optional(),
        facebook: optionalHttpsUrlSchema,
        instagram: optionalHttpsUrlSchema,
        twitter: optionalHttpsUrlSchema,
        youtube: optionalHttpsUrlSchema,
        type: z.enum(["federation", "umbrella", "ministry", "commission"]).default("federation"),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const [result] = await db.insert(federations).values(input).returning({ id: federations.id });
      return { success: true, id: result.id };
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        abbreviation: z.string().optional(),
        description: z.string().optional(),
        logo: z.string().optional(),
        backgroundImage: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
        website: optionalHttpsUrlSchema,
        president: z.string().optional(),
        secretaryGeneral: z.string().optional(),
        facebook: optionalHttpsUrlSchema,
        instagram: optionalHttpsUrlSchema,
        twitter: optionalHttpsUrlSchema,
        youtube: optionalHttpsUrlSchema,
        isActive: z.boolean().optional(),
        mergedIntoSlug: z.string().nullable().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const { id, ...data } = input;
      await db.update(federations).set(data).where(eq(federations.id, id));
      return { success: true };
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.delete(federations).where(eq(federations.id, input.id));
      return { success: true };
    }),
});
