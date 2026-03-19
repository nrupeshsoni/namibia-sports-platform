import { z } from "zod";
import { uploadImage, type UploadEntity } from "../services/supabaseStorage";
import { protectedProcedure, router } from "../_core/trpc";

const entitySchema = z.enum(["federation", "club", "event", "athlete", "news", "venue"]);

export const uploadRouter = router({
  image: protectedProcedure
    .input(
      z.object({
        entity: entitySchema,
        entityId: z.union([z.number(), z.string()]),
        base64: z.string(), // data URL or raw base64
        contentType: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
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
