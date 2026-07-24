import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { liveStreams } from "../../drizzle/schema";
import { eq, desc, and } from "drizzle-orm";
import {
  publicProcedure,
  federationAdminProcedure,
  router,
} from "../_core/trpc";
import {
  assertClaimMatchesOwnedRow,
  assertSameFederation,
} from "../_core/federationScope";
import { httpsUrlSchema } from "../_core/httpsUrl";
import { listLimitSchema, resolveListLimit } from "../_core/listLimits";

const platformTypeEnum = z.enum(["youtube", "facebook", "twitch", "other"]);

export const streamsRouter = router({
  list: publicProcedure
    .input(
      z
        .object({
          federationId: z.number().optional(),
          isLive: z.boolean().optional(),
          limit: listLimitSchema,
        })
        .optional()
    )
    .query(async ({ input }) => {
      try {
        const db = await getDb();
        if (!db) return [];

        const conditions = [];
        if (input?.federationId) {
          conditions.push(eq(liveStreams.federationId, input.federationId));
        }
        if (input?.isLive !== undefined) {
          conditions.push(eq(liveStreams.isLive, input.isLive));
        }

        return await db
          .select()
          .from(liveStreams)
          .where(conditions.length > 0 ? and(...conditions) : undefined)
          .orderBy(desc(liveStreams.scheduledStart))
          .limit(resolveListLimit(input?.limit));
      } catch (e) {
        console.error("[streams.list]", e);
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
        .from(liveStreams)
        .where(eq(liveStreams.id, input.id))
        .limit(1);

      return result[0] || null;
    }),

  create: federationAdminProcedure
    .input(
      z.object({
        federationId: z.number(),
        title: z.string(),
        platformType: platformTypeEnum.default("youtube"),
        streamUrl: httpsUrlSchema.optional(),
        embedUrl: httpsUrlSchema.optional(),
        thumbnailUrl: httpsUrlSchema.optional(),
        scheduledStart: z.date().optional(),
        scheduledEnd: z.date().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      assertSameFederation(ctx.user, input.federationId);

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const [result] = await db
        .insert(liveStreams)
        .values(input)
        .returning({ id: liveStreams.id });
      return { success: true, id: result.id };
    }),

  update: federationAdminProcedure
    .input(
      z.object({
        id: z.number(),
        federationId: z.number(),
        title: z.string().optional(),
        platformType: platformTypeEnum.optional(),
        streamUrl: httpsUrlSchema.optional(),
        embedUrl: httpsUrlSchema.optional(),
        thumbnailUrl: httpsUrlSchema.optional(),
        scheduledStart: z.date().optional(),
        scheduledEnd: z.date().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      assertSameFederation(ctx.user, input.federationId);

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const [existing] = await db
        .select({ federationId: liveStreams.federationId })
        .from(liveStreams)
        .where(eq(liveStreams.id, input.id))
        .limit(1);
      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Stream not found" });
      }
      assertClaimMatchesOwnedRow(
        ctx.user,
        input.federationId,
        existing.federationId,
        "Stream not found"
      );

      const { id, federationId, ...data } = input;
      await db
        .update(liveStreams)
        .set({ ...data, updatedAt: new Date() })
        .where(and(eq(liveStreams.id, id), eq(liveStreams.federationId, federationId)));
      return { success: true };
    }),

  setLive: federationAdminProcedure
    .input(z.object({ id: z.number(), federationId: z.number(), isLive: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      assertSameFederation(ctx.user, input.federationId);

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const [existing] = await db
        .select({ federationId: liveStreams.federationId })
        .from(liveStreams)
        .where(eq(liveStreams.id, input.id))
        .limit(1);
      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Stream not found" });
      }
      assertClaimMatchesOwnedRow(
        ctx.user,
        input.federationId,
        existing.federationId,
        "Stream not found"
      );

      await db
        .update(liveStreams)
        .set({
          isLive: input.isLive,
          updatedAt: new Date(),
          ...(input.isLive ? { viewerCount: 0 } : {}),
        })
        .where(and(eq(liveStreams.id, input.id), eq(liveStreams.federationId, input.federationId)));
      return { success: true };
    }),

  /** Hard-delete a stream (no archive column on live_streams). */
  delete: federationAdminProcedure
    .input(z.object({ id: z.number(), federationId: z.number() }))
    .mutation(async ({ ctx, input }) => {
      assertSameFederation(ctx.user, input.federationId);

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const [existing] = await db
        .select({ federationId: liveStreams.federationId })
        .from(liveStreams)
        .where(eq(liveStreams.id, input.id))
        .limit(1);
      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Stream not found" });
      }
      assertClaimMatchesOwnedRow(
        ctx.user,
        input.federationId,
        existing.federationId,
        "Stream not found"
      );

      await db
        .delete(liveStreams)
        .where(and(eq(liveStreams.id, input.id), eq(liveStreams.federationId, input.federationId)));
      return { success: true };
    }),
});
