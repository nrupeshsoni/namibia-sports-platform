/**
 * Namibia administrative regions - shared client + server.
 * Canonical southern region: Karas (aliases Kharas / click-consonant forms).
 */

export const NAMIBIA_REGIONS = [
  "Khomas", "Erongo", "Oshana", "Omusati", "Ohangwena", "Oshikoto",
  "Kavango East", "Kavango West", "Zambezi", "Kunene", "Otjozondjupa",
  "Omaheke", "Hardap", "Karas",
] as const;

export type NamibiaRegion = (typeof NAMIBIA_REGIONS)[number];
export const ALL_REGIONS: readonly string[] = NAMIBIA_REGIONS;

const REGION_FILTER_ALIASES: Record<string, readonly string[]> = {
  Karas: ["Karas", "Kharas", "ǁKaras", "!Karas", "//Karas", "//Kharas", "ǀǀKaras"],
};

export function normalizeRegionName(raw: string): string {
  let cleaned = raw.trim().replace(/^[!\/]+/, "").trim();
  while (cleaned.length > 0 && (cleaned.charCodeAt(0) === 0x01c1 || cleaned.charCodeAt(0) === 0x01c0)) {
    cleaned = cleaned.slice(1).trim();
  }
  if (/^kharas$/i.test(cleaned) || /^karas$/i.test(cleaned)) return "Karas";
  const hit = ALL_REGIONS.find((r) => r.toLowerCase() === cleaned.toLowerCase());
  return hit ?? cleaned;
}

export function regionFilterValues(raw: string): string[] {
  const canonical = normalizeRegionName(raw);
  const aliases = REGION_FILTER_ALIASES[canonical];
  if (aliases) return [...aliases];
  return [canonical];
}

export function parseRegionParam(raw: string | null | undefined): string | null {
  if (raw == null) return null;
  let value = raw.trim();
  if (!value) return null;
  try { value = decodeURIComponent(value).trim(); } catch { /* keep */ }
  if (!value) return null;
  const normalized = normalizeRegionName(value);
  return ALL_REGIONS.includes(normalized) ? normalized : null;
}
