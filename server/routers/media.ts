import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { media, clubs, events, athletes, coaches } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { publicProcedure, federationAdminProcedure, router } from "../_core/trpc";
import { assertSameFederation } from "../_core/federationScope";

const entityTypeSchema = z.enum(["federation", "club", "event", "athlete", "venue", "coach"]);

type EntityType = z.infer<typeof entityTypeSchema>;

/** Resolve owning federation for a media entity. Venues are platform-scoped (admin only). */
async function resolveMediaFederationId(
  entityType: EntityType,
  entityId: number
): Promise<number | null | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  if (entityType === "federation") return entityId;
  if (entityType === "venue") return null;

  if (entityType === "club") {
    const [row] = await db
      .select({ federationId: clubs.federationId })
      .from(clubs)
      .where(eq(clubs.id, entityId))
      .limit(1);
    return row?.federationId;
  }
  if (entityType === "event") {
    const [row] = await db
      .select({ federationId: events.federationId })
      .from(events)
      .where(eq(events.id, entityId))
      .limit(1);
    return row?.federationId;
  }
  if (entityType === "athlete") {
    const [row] = await db
      .select({ federationId: athletes.federationId })
      .from(athletes)
      .where(eq(athletes.id, entityId))
      .limit(1);
    return row?.federationId;
  }
  const [row] = await db
    .select({ federationId: coaches.federationId })
    .from(coaches)
    .where(eq(coaches.id, entityId))
    .limit(1);
  return row?.federationId;
}

export const mediaRouter = router({
  list: publicProcedure
    .input(
      z
        .object({
          entityType: entityTypeSchema.optional(),
          entityId: z.number().optional(),
          type: z.enum(["image", "video", "document"]).optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return [];

      const conditions = [];
      if (input?.entityType) {
        conditions.push(eq(media.entityType, input.entityType));
      }
      if (input?.entityId !== undefined) {
        conditions.push(eq(media.entityId, input.entityId));
      }
      if (input?.type) {
        conditions.push(eq(media.type, input.type));
      }

      const result = await db
        .select()
        .from(media)
        .where(conditions.length > 0 ? and(...conditions) : undefined)
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
        .from(media)
        .where(eq(media.id, input.id))
        .limit(1);

      return result[0] || null;
    }),

  create: federationAdminProcedure
    .input(
      z.object({
        title: z.string().optional(),
        fileUrl: z.string().url(),
        thumbnailUrl: z.string().url().optional(),
        type: z.enum(["image", "video", "document"]).default("image"),
        entityType: entityTypeSchema,
        entityId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const federationId = await resolveMediaFederationId(input.entityType, input.entityId);
      assertSameFederation(ctx.user, federationId);

      const [result] = await db.insert(media).values(input).returning({ id: media.id });
      return { success: true, id: result.id };
    }),

  delete: federationAdminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const [existing] = await db
        .select()
        .from(media)
        .where(eq(media.id, input.id))
        .limit(1);
      if (!existing) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Media not found" });
      }

      const federationId = await resolveMediaFederationId(
        existing.entityType,
        existing.entityId
      );
      assertSameFederation(ctx.user, federationId);

      await db.delete(media).where(eq(media.id, input.id));
      return { success: true };
    }),
});
