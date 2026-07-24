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

/**
 * Return a safe `https://` href, or null for legacy/unsafe values
 * (`javascript:`, `http:`, relative junk, malformed).
 */
export function safeHttpsHref(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") return null;
    return parsed.href;
  } catch {
    return null;
  }
}
