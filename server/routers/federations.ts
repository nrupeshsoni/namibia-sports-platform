import { z } from "zod";
import { getDb } from "../db";
import { federations } from "../../drizzle/schema";
import { eq, like, and, ilike } from "drizzle-orm";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";

/** Derives URL slug from federation name: "Karate Namibia" → "karate-namibia" */
function nameToSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export const federationsRouter = router({
  list: publicProcedure
    .input(
      z
        .object({
          search: z.string().optional(),
          type: z.enum(["federation", "umbrella", "ministry", "commission"]).optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      const conditions = [];
      if (input?.search) {
        conditions.push(like(federations.name, `%${input.search}%`));
      }
      if (input?.type) {
        conditions.push(eq(federations.type, input.type));
      }

      const result = await db
        .select()
        .from(federations)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(federations.id);

      return result;
    }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;

      const result = await db
        .select()
        .from(federations)
        .where(eq(federations.id, input.id))
        .limit(1);

      return result[0] || null;
    }),

  getByAbbreviation: publicProcedure
    .input(z.object({ abbreviation: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;

      const result = await db
        .select()
        .from(federations)
        .where(eq(federations.abbreviation, input.abbreviation))
        .limit(1);

      return result[0] || null;
    }),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;

      const slugLower = input.slug.toLowerCase();

      // 1. Exact slug match
      let result = await db
        .select()
        .from(federations)
        .where(eq(federations.slug, input.slug))
        .limit(1);

      if (result[0]) return result[0];

      // 2. Case-insensitive slug match (handles "Karate" vs "karate")
      result = await db
        .select()
        .from(federations)
        .where(ilike(federations.slug, input.slug))
        .limit(1);

      if (result[0]) return result[0];

      // 3. Abbreviation match (e.g. "kna" for Karate Namibia)
      result = await db
        .select()
        .from(federations)
        .where(ilike(federations.abbreviation, input.slug))
        .limit(1);

      if (result[0]) return result[0];

      // 4. fed-{id} fallback
      const fedIdMatch = input.slug.match(/^fed-(\d+)$/);
      if (fedIdMatch) {
        result = await db
          .select()
          .from(federations)
          .where(eq(federations.id, parseInt(fedIdMatch[1], 10)))
          .limit(1);
        if (result[0]) return result[0];
      }

      // 5. Name-derived slug: "Karate Namibia" → "karate-namibia"
      const all = await db.select().from(federations);
      const found = all.find((f) => nameToSlug(f.name) === slugLower);
      return found ?? null;
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        abbreviation: z.string().optional(),
        description: z.string().optional(),
        logo: z.string().optional(),
        backgroundImage: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
        website: z.string().optional(),
        president: z.string().optional(),
        secretaryGeneral: z.string().optional(),
        facebook: z.string().optional(),
        instagram: z.string().optional(),
        twitter: z.string().optional(),
        youtube: z.string().optional(),
        type: z.enum(["federation", "umbrella", "ministry", "commission"]).default("federation"),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const [result] = await db.insert(federations).values(input).returning({ id: federations.id });
      return { success: true, id: result.id };
    }),

  update: protectedProcedure
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
        website: z.string().optional(),
        president: z.string().optional(),
        secretaryGeneral: z.string().optional(),
        facebook: z.string().optional(),
        instagram: z.string().optional(),
        twitter: z.string().optional(),
        youtube: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const { id, ...data } = input;
      await db.update(federations).set(data).where(eq(federations.id, id));
      return { success: true };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.delete(federations).where(eq(federations.id, input.id));
      return { success: true };
    }),
});
