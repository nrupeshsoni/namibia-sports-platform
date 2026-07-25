import { describe, expect, it } from "vitest";
import {
  ALL_REGIONS,
  asList,
  normalizeRegionName,
  parseRegionParam,
  regionFromSearch,
} from "./mapRegions";

describe("mapRegions", () => {
  it("lists all 14 regions", () => {
    expect(ALL_REGIONS).toHaveLength(14);
    expect(ALL_REGIONS).toContain("Khomas");
    expect(ALL_REGIONS).toContain("Kavango East");
  });

  it("parseRegionParam accepts known regions and rejects junk", () => {
    expect(parseRegionParam("Khomas")).toBe("Khomas");
    expect(parseRegionParam("  Erongo  ")).toBe("Erongo");
    expect(parseRegionParam("Kavango%20East")).toBe("Kavango East");
    expect(parseRegionParam("NotARegion")).toBeNull();
    expect(parseRegionParam(null)).toBeNull();
    expect(parseRegionParam("")).toBeNull();
    expect(parseRegionParam("   ")).toBeNull();
  });

  it("normalizeRegionName maps Kharas to Karas", () => {
    expect(normalizeRegionName("Kharas")).toBe("Karas");
    expect(parseRegionParam("Kharas")).toBe("Karas");
  });

  it("normalizeRegionName maps ǁKaras aliases", () => {
    expect(normalizeRegionName("ǁKaras")).toBe("Karas");
    expect(normalizeRegionName("!Karas")).toBe("Karas");
    expect(normalizeRegionName("karas")).toBe("Karas");
  });

  it("regionFromSearch reads query strings safely", () => {
    expect(regionFromSearch("?region=Khomas")).toBe("Khomas");
    expect(regionFromSearch("region=Oshana&x=1")).toBe("Oshana");
    expect(regionFromSearch("")).toBeNull();
    expect(regionFromSearch("?region=%E0%A4%A")).toBeNull();
  });

  it("asList guards empty / non-array data", () => {
    expect(asList(undefined)).toEqual([]);
    expect(asList(null)).toEqual([]);
    expect(asList([{ id: 1 }])).toEqual([{ id: 1 }]);
  });
});
