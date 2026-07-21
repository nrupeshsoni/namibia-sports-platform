/**
 * AI router: generateSummary, suggestTags, chatAssistant per SKILLS.md.
 */

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { generateSummary, suggestTags, chatAssistant } from "../services/anthropic";
import { protectedProcedure, router } from "../_core/trpc";
import { clientKey, enforceRateLimit } from "../_core/rateLimit";

/**
 * Every chat call spends real money at Anthropic, so the cost of a single
 * request is capped three ways: turns, per-message length, and total prompt
 * characters — a caller can otherwise stay under both other caps and still ship
 * a megabyte of history. The widget sends the last 10 turns.
 */
const MAX_HISTORY_MESSAGES = 10;
const MAX_MESSAGE_CHARS = 2_000;
const MAX_CONVERSATION_CHARS = 12_000;

/** Per-caller ceiling. Generous for a human, useless for a script. */
const CHAT_RATE_LIMIT = { limit: 10, windowMs: 60_000 };

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().max(MAX_MESSAGE_CHARS),
});

export const aiRouter = router({
  generateSummary: protectedProcedure
    .input(z.object({ text: z.string().min(1).max(50_000) }))
    .mutation(async ({ input }) => {
      try {
        return await generateSummary(input.text);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "AI request failed";
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: msg });
      }
    }),

  suggestTags: protectedProcedure
    .input(z.object({ content: z.string().min(1).max(50_000) }))
    .mutation(async ({ input }) => {
      try {
        return await suggestTags(input.content);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "AI request failed";
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: msg });
      }
    }),

  /** Auth required — prevents unauthenticated Anthropic spend. */
  chatAssistant: protectedProcedure
    .input(z.object({
      message: z.string().min(1).max(MAX_MESSAGE_CHARS),
      history: z.array(messageSchema).max(MAX_HISTORY_MESSAGES).optional().default([]),
    }))
    .mutation(async ({ ctx, input }) => {
      // Keyed on the account rather than the IP: one abusive user must not
      // consume the allowance of everyone else behind the same office NAT, and
      // cannot shed the counter by moving networks.
      enforceRateLimit(`ai.chat:${ctx.user?.id ?? clientKey(ctx.req)}`, {
        ...CHAT_RATE_LIMIT,
        message: "Too many messages. Please wait a moment before continuing.",
      });

      const totalChars =
        input.message.length +
        input.history.reduce((sum, m) => sum + m.content.length, 0);
      if (totalChars > MAX_CONVERSATION_CHARS) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Conversation is too long. Start a new chat to continue.",
        });
      }

      try {
        return await chatAssistant(input.message, input.history);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "AI request failed";
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: msg });
      }
    }),
});
