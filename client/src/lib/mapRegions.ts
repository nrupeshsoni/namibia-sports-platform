/**
 * Namibia administrative regions for the interactive map.
 * Keys must match Home region cards and common DB `region` values.
 */

/** Approximate center coordinates for Namibia's 14 regions */
export const NAMIBIA_REGION_COORDS: Record<string, [number, number]> = {
  Khomas: [-22.56, 17.07],
  Erongo: [-22.68, 14.53],
  Oshana: [-17.78, 15.7],
  Omusati: [-18.11, 14.84],
  Ohangwena: [-17.43, 16.84],
  Oshikoto: [-18.62, 16.93],
  "Kavango East": [-17.91, 19.72],
  "Kavango West": [-17.9, 18.43],
  Zambezi: [-17.5, 24.3],
  Kunene: [-19.38, 13.85],
  Otjozondjupa: [-20.44, 17.08],
  Omaheke: [-21.85, 19.4],
  Hardap: [-24.02, 17.92],
  Karas: [-26.58, 18.14],
};

export const NAMIBIA_CENTER: [number, number] = [-22.0, 17.5];

export const ALL_REGIONS: readonly string[] = Object.keys(NAMIBIA_REGION_COORDS);

/**
 * Normalize DB / URL region labels (e.g. `ǁKaras` / `!Karas` → `Karas`).
 */
export function normalizeRegionName(raw: string): string {
  const cleaned = raw.replace(/^[ǁ!]+/, "").trim();
  const hit = ALL_REGIONS.find((r) => r.toLowerCase() === cleaned.toLowerCase());
  return hit ?? cleaned;
}

/**
 * Parse a `?region=` query value into a known region, or null if missing/invalid.
 */
export function parseRegionParam(raw: string | null | undefined): string | null {
  if (raw == null) return null;
  let value = raw.trim();
  if (!value) return null;
  try {
    value = decodeURIComponent(value).trim();
  } catch {
    // keep trimmed raw — malformed % sequences must not crash the page
  }
  if (!value) return null;
  const normalized = normalizeRegionName(value);
  return ALL_REGIONS.includes(normalized) ? normalized : null;
}

/** Read `?region=` from a query string (with or without leading `?`). */
export function regionFromSearch(search: string = ""): string | null {
  const q = search.startsWith("?") ? search.slice(1) : search;
  return parseRegionParam(new URLSearchParams(q).get("region"));
}

/** Coerce tRPC list results to an array (guards undefined / unexpected shapes). */
export function asList<T>(data: T[] | null | undefined): T[] {
  return Array.isArray(data) ? data : [];
}
