/**
 * Namibia map region helpers — coords stay client-side; names shared with server.
 */

export { ALL_REGIONS, normalizeRegionName, parseRegionParam } from "@shared/regions";
import { parseRegionParam } from "@shared/regions";

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

/** Read `?region=` from a query string (with or without leading `?`). */
export function regionFromSearch(search: string = ""): string | null {
  const q = search.startsWith("?") ? search.slice(1) : search;
  return parseRegionParam(new URLSearchParams(q).get("region"));
}

/** Coerce tRPC list results to an array (guards undefined / unexpected shapes). */
export function asList<T>(data: T[] | null | undefined): T[] {
  return Array.isArray(data) ? data : [];
}
