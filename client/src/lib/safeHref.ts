/**
 * Return a safe external `https://` href, or null.
 * Blocks `javascript:`, `data:`, and legacy `http:` values from DB rows.
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
