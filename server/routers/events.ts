import { z } from "zod";
import { getDb } from "../db";
import { events } from "../../drizzle/schema";
import { eq, desc, asc, like, and, gte } from "drizzle-orm";
import { publicProcedure, federationAdminProcedure, router } from "../_core/trpc";
import {
  assertSameFederation,
  canIncludeUnpublished,
  canViewNonPublic,
} from "../_core/federationScope";
import { listLimitSchema, resolveListLimit } from "../_core/listLimits";

export const eventsRouter = router({
  list: publicProcedure
    .input(
      z
        .object({
          federationId: z.number().optional(),
          region: z.string().optional(),
          upcoming: z.boolean().optional(),
          search: z.string().optional(),
          limit: listLimitSchema,
          /** Staff-only: ignored for public/anonymous; federation_admin limited to own federation */
          includeUnpublished: z.boolean().optional(),
        })
        .optional()
    )
    .query(async ({ ctx, input }) => {
      try {
        const db = await getDb();
        if (!db) return [];

        const allowDrafts =
          input?.includeUnpublished === true &&
          canIncludeUnpublished(ctx.user, input.federationId);

        const conditions = [];
        if (!allowDrafts) {
          conditions.push(eq(events.isPublished, true));
        }
        if (input?.federationId) {
          conditions.push(eq(events.federationId, input.federationId));
        }
        if (input?.region) {
          conditions.push(eq(events.region, input.region));
        }
        if (input?.search) {
          conditions.push(like(events.name, `%${input.search}%`));
        }
        if (input?.upcoming) {
          conditions.push(gte(events.startDate, new Date()));
        }

        const orderBy = input?.upcoming ? asc(events.startDate) : desc(events.startDate);

        return db
          .select()
          .from(events)
          .where(conditions.length > 0 ? and(...conditions) : undefined)
          .orderBy(orderBy)
          .limit(resolveListLimit(input?.limit));
      } catch (e) {
        console.error("[events.list]", e);
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
        .from(events)
        .where(eq(events.id, input.id))
        .limit(1);

      const row = result[0];
      if (!row) return null;
      if (!row.isPublished && !canViewNonPublic(ctx.user, row.federationId)) {
        return null;
      }
      return row;
    }),

  create: federationAdminProcedure
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
    .mutation(async ({ ctx, input }) => {
      assertSameFederation(ctx.user, input.federationId);

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const { eventType, ...rest } = input;
      const values = { ...rest, type: eventType };

      const [result] = await db.insert(events).values(values).returning({ id: events.id });
      return { success: true, id: result.id };
    }),

  update: federationAdminProcedure
    .input(
      z.object({
        id: z.number(),
        federationId: z.number(),
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
    .mutation(async ({ ctx, input }) => {
      assertSameFederation(ctx.user, input.federationId);

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const { id, federationId, eventType, ...rest } = input;
      const data = eventType !== undefined ? { ...rest, type: eventType } : rest;
      await db
        .update(events)
        .set(data)
        .where(and(eq(events.id, id), eq(events.federationId, federationId)));
      return { success: true };
    }),

  delete: federationAdminProcedure
    .input(z.object({ id: z.number(), federationId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      assertSameFederation(ctx.user, input.federationId);

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db
        .delete(events)
        .where(and(eq(events.id, input.id), eq(events.federationId, input.federationId)));
      return { success: true };
    }),
});
