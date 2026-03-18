import { z } from "zod";
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

export const schoolsRouter = router({
  list: publicProcedure
    .input(
      z
        .object({
          region: z.string().optional(),
          search: z.string().optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      const conditions = [];
      if (input?.region) {
        conditions.push(eq(schools.region, input.region));
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

      return result;
    }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;

      const result = await db
        .select()
        .from(schools)
        .where(eq(schools.id, input.id))
        .limit(1);

      return result[0] || null;
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

      await db.delete(schools).where(eq(schools.id, input.id));
      return { success: true };
    }),
});
