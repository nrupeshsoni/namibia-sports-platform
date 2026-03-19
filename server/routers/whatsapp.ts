/**
 * WhatsApp subscription router.
 * subscribe, unsubscribe, getSubscriptions per SKILLS.md.
 */

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { whatsappSubscriptions } from "../../drizzle/schema";
import { eq, and, isNull } from "drizzle-orm";
import { publicProcedure, router } from "../_core/trpc";

const SUBSCRIPTION_TYPES = ["events", "news", "streams", "all"] as const;
const subscriptionTypesSchema = z.array(z.enum(SUBSCRIPTION_TYPES)).min(1).max(4);

/** Normalize phone to E.164 (digits only). Namibia +264. */
function normalizePhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("264") && digits.length >= 10) return `+${digits}`;
  if (digits.startsWith("0") && digits.length >= 9) return `+264${digits.slice(1)}`;
  if (digits.length >= 9) return `+264${digits}`;
  return `+${digits}`;
}

export const whatsappRouter = router({
  subscribe: publicProcedure
    .input(
      z.object({
        phone: z.string().min(9).max(20),
        federationId: z.number().optional(),
        types: subscriptionTypesSchema,
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const phone = normalizePhone(input.phone);

      const existing = await db
        .select()
        .from(whatsappSubscriptions)
        .where(
          and(
            eq(whatsappSubscriptions.phone, phone),
            input.federationId != null
              ? eq(whatsappSubscriptions.federationId, input.federationId)
              : isNull(whatsappSubscriptions.federationId)
          )
        )
        .limit(1);

      if (existing.length > 0) {
        await db
          .update(whatsappSubscriptions)
          .set({
            subscriptionTypes: input.types,
            isActive: true,
            userId: ctx.user?.id ?? null,
          })
          .where(eq(whatsappSubscriptions.id, existing[0].id));
        return { success: true, updated: true };
      }

      await db.insert(whatsappSubscriptions).values({
        phone,
        federationId: input.federationId ?? null,
        subscriptionTypes: input.types,
        userId: ctx.user?.id ?? null,
        isActive: true,
      });
      return { success: true, updated: false };
    }),

  unsubscribe: publicProcedure
    .input(z.object({ phone: z.string().min(9).max(20) }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const phone = normalizePhone(input.phone);
      await db
        .update(whatsappSubscriptions)
        .set({ isActive: false })
        .where(eq(whatsappSubscriptions.phone, phone));
      return { success: true };
    }),

  getSubscriptions: publicProcedure
    .input(z.object({ phone: z.string().min(9).max(20).optional() }).optional())
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) return [];

      if (input?.phone) {
        const phone = normalizePhone(input.phone);
        const rows = await db
          .select()
          .from(whatsappSubscriptions)
          .where(eq(whatsappSubscriptions.phone, phone));
        return rows;
      }

      if (ctx.user?.id) {
        const rows = await db
          .select()
          .from(whatsappSubscriptions)
          .where(eq(whatsappSubscriptions.userId, ctx.user.id));
        return rows;
      }

      return [];
    }),
});
