import { describe, expect, it } from "vitest";
import { ALL_REGIONS, normalizeRegionName, parseRegionParam, regionFilterValues } from "./regions";

describe("shared/regions", () => {
  it("lists 14 canonical regions", () => {
    expect(ALL_REGIONS).toHaveLength(14);
  });
  it("normalizeRegionName maps Karas / Kharas aliases", () => {
    expect(normalizeRegionName("ǁKaras")).toBe("Karas");
    expect(normalizeRegionName("!Karas")).toBe("Karas");
    expect(normalizeRegionName("Kharas")).toBe("Karas");
    expect(normalizeRegionName("//Kharas")).toBe("Karas");
    expect(normalizeRegionName("karas")).toBe("Karas");
  });
  it("regionFilterValues expands Karas aliases", () => {
    expect(regionFilterValues("Karas")).toEqual(expect.arrayContaining(["Karas", "Kharas", "//Kharas"]));
    expect(regionFilterValues("Khomas")).toEqual(["Khomas"]);
  });
  it("parseRegionParam accepts Kharas as Karas", () => {
    expect(parseRegionParam("Kharas")).toBe("Karas");
    expect(parseRegionParam("NotARegion")).toBeNull();
  });
});
