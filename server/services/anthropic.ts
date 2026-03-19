/**
 * Anthropic Claude API service.
 * Uses claude-sonnet-4-20250514 per CLAUDE.md.
 */

import Anthropic from "@anthropic-ai/sdk";

const MODEL = "claude-sonnet-4-20250514";

let _client: Anthropic | null = null;

function getClient(): Anthropic {
  const key = process.env.ANTHROPIC_API_KEY;
  if (!key) {
    throw new Error("ANTHROPIC_API_KEY is required for AI features");
  }
  if (!_client) {
    _client = new Anthropic({ apiKey: key });
  }
  return _client;
}

export async function generateSummary(text: string): Promise<string> {
  const client = getClient();
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 256,
    messages: [
      {
        role: "user",
        content: `Summarize the following text in 1-3 concise sentences suitable for a news article teaser. Output only the summary, no preamble.\n\n${text}`,
      },
    ],
  });

  const block = response.content.find((b) => b.type === "text");
  const result = block && "text" in block ? (block as { text: string }).text : "";
  return result.trim();
}

export async function suggestTags(content: string): Promise<string[]> {
  const client = getClient();
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 128,
    messages: [
      {
        role: "user",
        content: `Given this sports/news content, suggest 3-6 relevant tags as a JSON array of lowercase strings (e.g. ["football","namibia","league"]). Output only the JSON array, nothing else.\n\n${content.slice(0, 2000)}`,
      },
    ],
  });

  const block = response.content.find((b) => b.type === "text");
  const text = block && "text" in block ? (block as { text: string }).text : "";
  if (!text) return [];

  try {
    const parsed = JSON.parse(text.trim()) as unknown;
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export async function chatAssistant(message: string, history: { role: "user" | "assistant"; content: string }[]): Promise<string> {
  const client = getClient();
  const systemPrompt = `You are a helpful assistant for the Namibia Sports Platform (sports.com.na). Answer questions about Namibian sports, federations, events, and athletes concisely. If you don't know something, say so. Keep responses brief and friendly.`;

  const messages: Anthropic.MessageParam[] = [
    ...history.map((m) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    })),
    { role: "user", content: message },
  ];

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 512,
    system: systemPrompt,
    messages,
  });

  const block = response.content.find((b) => b.type === "text");
  const result = block && "text" in block ? (block as { text: string }).text : "";
  return result.trim();
}
