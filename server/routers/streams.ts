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

const platformTypeEnum = z.enum(["youtube", "facebook", "twitch", "other"]);

export const streamsRouter = router({
  list: publicProcedure
    .input(
      z
        .object({
          federationId: z.number().optional(),
          isLive: z.boolean().optional(),
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

        // #region agent log
        fetch('http://127.0.0.1:7382/ingest/44978b4f-6913-4991-b97f-acca559f9e7c',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'e82a61'},body:JSON.stringify({sessionId:'e82a61',location:'streams.ts:list',message:'before query',data:{},hypothesisId:'C',timestamp:Date.now()})}).catch(()=>{});
        // #endregion
        const result = await db
          .select()
          .from(liveStreams)
          .where(conditions.length > 0 ? and(...conditions) : undefined)
          .orderBy(desc(liveStreams.scheduledStart));

        // #region agent log
        fetch('http://127.0.0.1:7382/ingest/44978b4f-6913-4991-b97f-acca559f9e7c',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'e82a61'},body:JSON.stringify({sessionId:'e82a61',location:'streams.ts:list',message:'query ok',data:{count:result.length},hypothesisId:'C',timestamp:Date.now()})}).catch(()=>{});
        // #endregion
        return result;
      } catch (e) {
        // #region agent log
        fetch('http://127.0.0.1:7382/ingest/44978b4f-6913-4991-b97f-acca559f9e7c',{method:'POST',headers:{'Content-Type':'application/json','X-Debug-Session-Id':'e82a61'},body:JSON.stringify({sessionId:'e82a61',location:'streams.ts:list',message:'query error',data:{err:String(e)},hypothesisId:'C,D',timestamp:Date.now()})}).catch(()=>{});
        // #endregion
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
        streamUrl: z.string().optional(),
        embedUrl: z.string().optional(),
        thumbnailUrl: z.string().optional(),
        scheduledStart: z.date().optional(),
        scheduledEnd: z.date().optional(),
      })
    )
    .mutation(async ({ input }) => {
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
        streamUrl: z.string().optional(),
        embedUrl: z.string().optional(),
        thumbnailUrl: z.string().optional(),
        scheduledStart: z.date().optional(),
        scheduledEnd: z.date().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const { id, federationId, ...data } = input;
      await db
        .update(liveStreams)
        .set({ ...data, updatedAt: new Date() })
        .where(and(eq(liveStreams.id, id), eq(liveStreams.federationId, federationId)));
      return { success: true };
    }),

  setLive: federationAdminProcedure
    .input(z.object({ id: z.number(), federationId: z.number(), isLive: z.boolean() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

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
});
