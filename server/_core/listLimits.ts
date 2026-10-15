import { z } from "zod";

/** Default page size for public list procedures when callers omit `limit`. */
export const DEFAULT_LIST_LIMIT = 50;

/** Hard ceiling for public list procedures — rejects larger requests via Zod. */
export const MAX_LIST_LIMIT = 200;

/**
 * Optional `limit` for public list inputs: 1…MAX, omitted → caller uses default.
 */
export const listLimitSchema = z
  .number()
  .int()
  .min(1)
  .max(MAX_LIST_LIMIT)
  .optional();

/**
 * Optional `offset` for public list inputs: ≥0, omitted → 0.
 * Soft ceiling avoids absurd skip values without changing default list behaviour.
 */
export const MAX_LIST_OFFSET = 100_000;

export const listOffsetSchema = z
  .number()
  .int()
  .min(0)
  .max(MAX_LIST_OFFSET)
  .optional();

/**
 * Resolve the SQL `.limit()` value for a public list query.
 * @param limit - Validated optional input (already capped by Zod when present)
 * @param defaultLimit - Fallback when omitted (default 50)
 */
export function resolveListLimit(
  limit?: number,
  defaultLimit: number = DEFAULT_LIST_LIMIT
): number {
  if (limit == null) return defaultLimit;
  return Math.min(Math.max(1, limit), MAX_LIST_LIMIT);
}

/**
 * Resolve the SQL `.offset()` value for a public list query.
 * @param offset - Validated optional input (already capped by Zod when present)
 */
export function resolveListOffset(offset?: number): number {
  if (offset == null) return 0;
  return Math.min(Math.max(0, offset), MAX_LIST_OFFSET);
}
