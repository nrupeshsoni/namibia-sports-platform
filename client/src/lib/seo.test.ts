import { describe, expect, it } from "vitest";
import { SITE_ORIGIN, buildClubJsonLd, buildSportsEventDetailJsonLd, buildSportsEventJsonLd } from "./seo";

describe("buildSportsEventJsonLd ItemList", () => {
  it("uses per-event slug URLs when slug is present", () => {
    const graph = buildSportsEventJsonLd([{ name: "Windhoek Open", slug: "windhoek-open-2026", startDate: "2026-08-01", location: "Khomas" }]);
    const item = (graph!.itemListElement as { item: { url: string } }[])[0].item;
    expect(item.url).toBe(`${SITE_ORIGIN}/events/windhoek-open-2026`);
  });
});

describe("buildSportsEventDetailJsonLd", () => {
  it("emits SportsEvent with detail page URL", () => {
    const graph = buildSportsEventDetailJsonLd({ name: "National Championships", slug: "national-championships-2026", description: "Annual finals", startDate: "2026-09-01", location: "Walvis Bay", federationName: "Athletics Namibia" });
    expect(graph["@type"]).toBe("SportsEvent");
    expect(graph.url).toBe(`${SITE_ORIGIN}/events/national-championships-2026`);
  });
});

describe("buildClubJsonLd", () => {
  it("emits SportsClub with detail page URL", () => {
    const graph = buildClubJsonLd({ name: "City FC", slug: "city-fc", description: "Community club", region: "Khomas", federationName: "Football Namibia" });
    expect(graph["@type"]).toBe("SportsClub");
    expect(graph.url).toBe(`${SITE_ORIGIN}/clubs/city-fc`);
  });
});
