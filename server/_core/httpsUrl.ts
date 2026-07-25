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
 * Media asset URL — https outbound **or** site-relative path (`/sports/…`).
 * Rejects `javascript:`, `data:`, `http:`, protocol-relative `//`, and `..`.
 */
export const mediaAssetUrlSchema = z
  .string()
  .min(1)
  .max(2048)
  .refine(
    (u) => {
      if (u.startsWith("https://")) {
        try {
          new URL(u);
          return true;
        } catch {
          return false;
        }
      }
      if (u.startsWith("/") && !u.startsWith("//") && !u.includes("..")) {
        return /^\/[a-zA-Z0-9._\-\/%]+$/.test(u);
      }
      return false;
    },
    { message: "Must be https URL or site-relative asset path" }
  );

export const optionalMediaAssetUrlSchema = z.union([
  z.literal(""),
  mediaAssetUrlSchema,
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
