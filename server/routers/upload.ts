import { z } from "zod";
import { uploadImage, type UploadEntity } from "../services/supabaseStorage";
import { federationAdminProcedure, router } from "../_core/trpc";
import { assertSameFederation } from "../_core/federationScope";
import { clientKey, enforceRateLimit, RATE_LIMITS } from "../_core/rateLimit";

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

export const uploadRouter = router({
  image: federationAdminProcedure
    .input(
      z.object({
        /** Tenant scope — asserted below; admin bypasses */
        federationId: z.number(),
        entity: entitySchema,
        entityId: z.union([z.number(), z.string()]),
        base64: z.string(), // data URL or raw base64
        contentType: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      enforceRateLimit(`upload.image:${ctx.user.id ?? clientKey(ctx.req)}`, {
        ...RATE_LIMITS.upload,
        message: "Too many uploads. Please try again shortly.",
      });
      assertSameFederation(ctx.user, input.federationId);

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
