import { describe, expect, it } from "vitest";

/** Parse SearchAction `q` the same way SearchCommandPalette seeds the palette. */
function searchQueryFromSearch(search: string): string {
  return (new URLSearchParams(search).get("q") ?? "").trim();
}

describe("SearchAction ?q=", () => {
  it("reads and trims q from the query string", () => {
    expect(searchQueryFromSearch("?q=football")).toBe("football");
    expect(searchQueryFromSearch("?q=%20netball%20")).toBe("netball");
    expect(searchQueryFromSearch("")).toBe("");
    expect(searchQueryFromSearch("?region=Khomas")).toBe("");
  });
});
