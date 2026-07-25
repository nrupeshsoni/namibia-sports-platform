import { inArray, type Column, type SQL } from "drizzle-orm";
import { regionFilterValues } from "@shared/regions";

export function regionMatches(column: Column, region: string | undefined): SQL | undefined {
  if (!region) return undefined;
  return inArray(column, regionFilterValues(region));
}
