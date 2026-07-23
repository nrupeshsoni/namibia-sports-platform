import { z } from "zod";

/**
 * Outbound https URL — blocks `javascript:` / `data:` open-redirect vectors.
 */
export const httpsUrlSchema = z
  .string()
  .url()
  .refine((u) => u.startsWith("https://"), { message: "URL must use https" });

/**
 * Optional https URL for admin forms (omit, empty string, or https URL).
 */
export const optionalHttpsUrlSchema = z.union([
  z.literal(""),
  httpsUrlSchema,
]).optional();
