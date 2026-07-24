import { describe, expect, it } from "vitest";
import { parseSuggestions } from "./services/contentSyncAi";
import { matchFederation, parseOptionalDate, toSlug } from "./services/contentSyncScope";
import { isContentSyncEnabled, initEnv, type Env } from "./_core/env";

describe("contentSyncAi.parseSuggestions", () => {
  it("parses a bare JSON array", () => {
    const raw = JSON.stringify([
      {
        title: "NFA cup preview",
        summary: "Editor angle on cup weekend.",
        date: "2026-08-01",
        sourceUrl: null,
        confidence: 0.4,
        federationHint: "Namibia Football Association",
      },
    ]);
    const rows = parseSuggestions(raw);
    expect(rows).toHaveLength(1);
    expect(rows[0].title).toBe("NFA cup preview");
    expect(rows[0].confidence).toBe(0.4);
  });

  it("extracts JSON from a fenced code block", () => {
    const raw = `Here you go:\n\`\`\`json\n[{"title":"A","summary":"B","confidence":0.5}]\n\`\`\``;
    const rows = parseSuggestions(raw);
    expect(rows[0].title).toBe("A");
  });

  it("rejects invalid confidence", () => {
    expect(() =>
      parseSuggestions(JSON.stringify([{ title: "A", summary: "B", confidence: 2 }]))
    ).toThrow();
  });
});

describe("contentSyncScope helpers", () => {
  const feds = [
    { id: 1, name: "Namibia Football Association", slug: "namibia-football", website: null },
    { id: 2, name: "Namibia Rugby Union", slug: "namibia-rugby", website: null },
  ];

  it("prefers explicit federationId over hint", () => {
    expect(matchFederation(feds, 2, "Namibia Football Association")).toBe(2);
  });

  it("matches hint by name", () => {
    expect(matchFederation(feds, null, "Namibia Rugby Union")).toBe(2);
  });

  it("slugifies titles", () => {
    expect(toSlug("Hello World!")).toBe("hello-world");
  });

  it("parses optional dates", () => {
    expect(parseOptionalDate("2026-07-24")?.toISOString().startsWith("2026-07-24")).toBe(true);
    expect(parseOptionalDate("not-a-date")).toBeNull();
  });
});

describe("ENABLE_CONTENT_SYNC default ON", () => {
  it("is enabled when unset", () => {
    initEnv({ ENABLE_CONTENT_SYNC: undefined } as Env);
    expect(isContentSyncEnabled()).toBe(true);
  });

  it("is disabled only when explicitly false", () => {
    initEnv({ ENABLE_CONTENT_SYNC: "false" } as Env);
    expect(isContentSyncEnabled()).toBe(false);
    initEnv({ ENABLE_CONTENT_SYNC: "" } as Env);
    expect(isContentSyncEnabled()).toBe(true);
  });
});
