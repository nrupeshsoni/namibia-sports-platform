import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { uploadImage, type UploadEntity } from "../services/supabaseStorage";
import { federationAdminProcedure, router } from "../_core/trpc";
import { assertSameFederation } from "../_core/federationScope";
import {
  assertEntityBelongsToClaimedFederation,
  numericEntityId,
  resolveEntityFederationId,
  type ScopedEntityType,
} from "../_core/resolveEntityFederation";
import { clientKey, enforceRateLimit, RATE_LIMITS } from "../_core/rateLimit";
import { getDb } from "../db";

const entitySchema = z.enum([
  "federation",
  "club",
  "event",
  "athlete",
  "coach",
  "news",
  "venue",
  "stream",
]);

/** Positive int or filesystem-safe string segment (no `/`, `..`, etc.). */
const entityIdSchema = z.union([
  z.number().int().nonnegative(),
  z.string().regex(/^[a-zA-Z0-9_-]{1,64}$/, "Invalid entityId for storage path"),
]);

const contentTypeSchema = z.enum(["image/jpeg", "image/png", "image/webp", "image/gif"]);

/** ~5MB binary ≈ 6.7MB base64; + data-URL prefix margin — reject before decode. */
export const MAX_UPLOAD_BASE64_CHARS = 7_500_000;

export const uploadRouter = router({
  image: federationAdminProcedure
    .input(
      z.object({
        /** Tenant scope — asserted below; admin bypasses */
        federationId: z.number(),
        entity: entitySchema,
        entityId: entityIdSchema,
        base64: z.string().min(1).max(MAX_UPLOAD_BASE64_CHARS),
        contentType: contentTypeSchema.optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      enforceRateLimit(`upload.image:${ctx.user.id ?? clientKey(ctx.req)}`, {
        ...RATE_LIMITS.upload,
        message: "Too many uploads. Please try again shortly.",
      });
      assertSameFederation(ctx.user, input.federationId);

      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      const rowId = numericEntityId(input.entityId);
      if (rowId == null) {
        // Draft string keys are platform-admin only — no row to own.
        if (ctx.user.role !== "admin") {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "entityId must be a numeric row id",
          });
        }
      } else {
        const owned = await resolveEntityFederationId(
          input.entity as ScopedEntityType,
          rowId
        );
        assertEntityBelongsToClaimedFederation(
          ctx.user,
          input.federationId,
          owned
        );
      }

      let buffer: Buffer;
      let contentType = input.contentType || "image/jpeg";

      const base64Data = input.base64.replace(/^data:image\/\w+;base64,/, "");
      buffer = Buffer.from(base64Data, "base64");

      if (!buffer.length) {
        throw new Error("Invalid base64 image data");
      }

      const result = await uploadImage(
        input.entity as UploadEntity,
        input.entityId,
        buffer,
        contentType
      );
      return result;
    }),
});
