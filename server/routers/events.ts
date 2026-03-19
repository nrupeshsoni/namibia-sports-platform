import { z } from "zod";
import { getDb } from "../db";
import { events } from "../../drizzle/schema";
import { eq, desc, asc, like, and, gte } from "drizzle-orm";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";

export const eventsRouter = router({
  list: publicProcedure
    .input(
      z
        .object({
          federationId: z.number().optional(),
          upcoming: z.boolean().optional(),
          search: z.string().optional(),
          limit: z.number().optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      const conditions = [];
      if (input?.federationId) {
        conditions.push(eq(events.federationId, input.federationId));
      }
      if (input?.search) {
        conditions.push(like(events.name, `%${input.search}%`));
      }
      if (input?.upcoming) {
        conditions.push(gte(events.startDate, new Date()));
      }

      const orderBy = input?.upcoming ? asc(events.startDate) : desc(events.startDate);
      const limit = input?.limit;

      let query = db
        .select()
        .from(events)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
        .orderBy(orderBy);

      if (limit) {
        query = query.limit(limit) as typeof query;
      }

      return query;
    }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;

      const result = await db
        .select()
        .from(events)
        .where(eq(events.id, input.id))
        .limit(1);

      return result[0] || null;
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        slug: z.string(),
        federationId: z.number(),
        description: z.string().optional(),
        posterUrl: z.string().optional(),
        eventType: z.enum(["competition", "tournament", "training", "workshop", "meeting", "other"]).default("competition"),
        startDate: z.date(),
        endDate: z.date().optional(),
        registrationDeadline: z.date().optional(),
        location: z.string().optional(),
        region: z.string().optional(),
        venueId: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const { eventType, ...rest } = input;
      const values = { ...rest, type: eventType };

      const [result] = await db.insert(events).values(values).returning({ id: events.id });
      return { success: true, id: result.id };
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z.string().optional(),
        description: z.string().optional(),
        posterUrl: z.string().optional(),
        eventType: z.enum(["competition", "tournament", "training", "workshop", "meeting", "other"]).optional(),
        startDate: z.date().optional(),
        endDate: z.date().optional(),
        registrationDeadline: z.date().optional(),
        location: z.string().optional(),
        region: z.string().optional(),
        venueId: z.number().optional(),
        isPublished: z.boolean().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const { id, eventType, ...rest } = input;
      const data = eventType !== undefined ? { ...rest, type: eventType } : rest;
      await db.update(events).set(data).where(eq(events.id, id));
      return { success: true };
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db.delete(events).where(eq(events.id, input.id));
      return { success: true };
    }),
});
