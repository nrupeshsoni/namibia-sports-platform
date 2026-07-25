import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { media } from "../../drizzle/schema";
import { eq, and } from "drizzle-orm";
import { publicProcedure, federationAdminProcedure, router } from "../_core/trpc";
import { assertSameFederation } from "../_core/federationScope";
import { resolveEntityFederationId } from "../_core/resolveEntityFederation";
import { mediaAssetUrlSchema, optionalMediaAssetUrlSchema } from "../_core/httpsUrl";

const entityTypeSchema = z.enum(["federation", "club", "event", "athlete", "venue", "coach"]);

type EntityType = z.infer<typeof entityTypeSchema>;

/** Resolve owning federation for a media entity. Venues are platform-scoped (admin only). */
async function resolveMediaFederationId(
  entityType: EntityType,
  entityId: number
): Promise<number | null | undefined> {
  return resolveEntityFederationId(entityType, entityId);
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
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) return [];

      // Unscoped dump is platform-admin only; public + federation_admin must filter.
      const scoped =
        input?.entityType != null && input.entityId !== undefined;
      if (!scoped && ctx.user?.role !== "admin") {
        return [];
      }

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
        fileUrl: mediaAssetUrlSchema,
        thumbnailUrl: optionalMediaAssetUrlSchema,
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

      const thumbnailUrl =
        input.thumbnailUrl === "" || input.thumbnailUrl == null
          ? undefined
          : input.thumbnailUrl;

      const [result] = await db
        .insert(media)
        .values({
          title: input.title,
          fileUrl: input.fileUrl,
          thumbnailUrl,
          type: input.type,
          entityType: input.entityType,
          entityId: input.entityId,
        })
        .returning({ id: media.id });
      return { success: true, id: result.id };
    }),

  /** Auth: federationAdmin. Update caption/URL/type; ownership from existing row. */
  update: federationAdminProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().max(255).optional().nullable(),
        fileUrl: mediaAssetUrlSchema.optional(),
        thumbnailUrl: optionalMediaAssetUrlSchema,
        type: z.enum(["image", "video", "document"]).optional(),
      })
    )
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

      const patch: {
        title?: string | null;
        fileUrl?: string;
        thumbnailUrl?: string | null;
        type?: "image" | "video" | "document";
      } = {};
      if (input.title !== undefined) patch.title = input.title;
      if (input.fileUrl !== undefined) patch.fileUrl = input.fileUrl;
      if (input.thumbnailUrl !== undefined) {
        patch.thumbnailUrl = input.thumbnailUrl === "" ? null : input.thumbnailUrl;
      }
      if (input.type !== undefined) patch.type = input.type;

      await db.update(media).set(patch).where(eq(media.id, input.id));
      return { success: true as const };
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
