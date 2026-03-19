/**
 * AI router: generateSummary, suggestTags, chatAssistant per SKILLS.md.
 */

import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { generateSummary, suggestTags, chatAssistant } from "../services/anthropic";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string(),
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

  chatAssistant: publicProcedure
    .input(z.object({
      message: z.string().min(1).max(2000),
      history: z.array(messageSchema).optional().default([]),
    }))
    .mutation(async ({ input }) => {
      try {
        return await chatAssistant(input.message, input.history);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "AI request failed";
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: msg });
      }
    }),
});
