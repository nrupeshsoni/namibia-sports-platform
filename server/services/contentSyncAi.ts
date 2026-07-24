/**
 * Content Sync AI provider — research-assist suggestions for Platform Admin.
 *
 * Phase 1: Cloudflare Workers AI (`env.AI`)
 * Phase 2: Anthropic when `ANTHROPIC_API_KEY` is set and Workers AI is unavailable
 *
 * NEVER treat model output as verified fact. Callers must create drafts only;
 * humans publish after source checks.
 */

import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import type { AiBinding, Env } from "../_core/env";
import { ENV } from "../_core/env";

/** Preferred Workers AI instruct model for structured JSON suggestions. */
export const WORKERS_AI_MODEL = "@cf/meta/llama-3.1-8b-instruct";
const ANTHROPIC_MODEL = "claude-sonnet-4-6";

export type ContentSyncProvider = "workers-ai" | "anthropic";

export const suggestionSchema = z.object({
  title: z.string().min(1).max(255),
  summary: z.string().min(1).max(2_000),
  date: z.string().max(64).optional().nullable(),
  sourceUrl: z.string().max(2_000).optional().nullable(),
  confidence: z.number().min(0).max(1),
  federationHint: z.string().max(255).optional().nullable(),
});

export type ContentSuggestion = z.infer<typeof suggestionSchema>;

const suggestionsArraySchema = z.array(suggestionSchema).max(12);

/**
 * Resolve which provider can serve Content Sync for this request.
 * Prefers Workers AI binding; falls back to Anthropic secret.
 */
export function resolveContentSyncProvider(env: Env): ContentSyncProvider | null {
  if (env.AI && typeof env.AI.run === "function") return "workers-ai";
  if (ENV.anthropicApiKey || env.ANTHROPIC_API_KEY) return "anthropic";
  return null;
}

function extractJsonArray(text: string): unknown {
  const trimmed = text.trim();
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenced?.[1]?.trim() ?? trimmed;
  const start = candidate.indexOf("[");
  const end = candidate.lastIndexOf("]");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("AI response did not contain a JSON array");
  }
  return JSON.parse(candidate.slice(start, end + 1)) as unknown;
}

/**
 * Parse and validate model JSON into suggestion rows.
 * Exported for unit tests.
 */
export function parseSuggestions(raw: string): ContentSuggestion[] {
  const parsed = extractJsonArray(raw);
  return suggestionsArraySchema.parse(parsed);
}

function workersAiText(result: unknown): string {
  if (typeof result === "string") return result;
  if (result && typeof result === "object") {
    const obj = result as Record<string, unknown>;
    if (typeof obj.response === "string") return obj.response;
    if (typeof obj.result === "string") return obj.result;
    if (typeof obj.text === "string") return obj.text;
  }
  return JSON.stringify(result);
}

async function runWorkersAi(ai: AiBinding, system: string, user: string): Promise<string> {
  const result = await ai.run(WORKERS_AI_MODEL, {
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
    max_tokens: 1_024,
  });
  return workersAiText(result);
}

async function runAnthropic(system: string, user: string): Promise<string> {
  const key = ENV.anthropicApiKey;
  if (!key) throw new Error("ANTHROPIC_API_KEY is not configured");
  const client = new Anthropic({ apiKey: key, timeout: 30_000 });
  const response = await client.messages.create({
    model: ANTHROPIC_MODEL,
    max_tokens: 1_024,
    system,
    messages: [{ role: "user", content: user }],
  });
  const block = response.content.find((b) => b.type === "text");
  return block && "text" in block ? (block as { text: string }).text : "";
}

const SYSTEM_PROMPT = `You assist Platform Admins of sports.com.na (Namibia Sports Platform).
Return ONLY a JSON array (no markdown prose) of research suggestions.
Each item: {"title":string,"summary":string,"date":string|null,"sourceUrl":string|null,"confidence":number,"federationHint":string|null}
Rules:
- Suggestions are DRAFT research leads, not verified facts. Prefer lower confidence when unsure.
- Never invent specific scores, medal counts, or quotes as fact.
- Prefer Namibia-relevant sports federation topics, schedules, and event candidates.
- sourceUrl may be an official site/social if known; otherwise null.
- confidence is 0..1.
- Maximum 8 items.`;

/**
 * Ask the configured provider for structured content suggestions.
 */
export async function generateContentSuggestions(
  env: Env,
  userPrompt: string
): Promise<{ provider: ContentSyncProvider; suggestions: ContentSuggestion[] }> {
  const provider = resolveContentSyncProvider(env);
  if (!provider) {
    throw new Error(
      "No AI provider available. Bind Workers AI (wrangler ai.binding) or set ANTHROPIC_API_KEY."
    );
  }

  const text =
    provider === "workers-ai" && env.AI
      ? await runWorkersAi(env.AI, SYSTEM_PROMPT, userPrompt)
      : await runAnthropic(SYSTEM_PROMPT, userPrompt);

  return { provider, suggestions: parseSuggestions(text) };
}
