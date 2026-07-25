/**
 * Outbound URL safety for news-aggregator SSRF hardening (A3).
 * Blocks private/link-local/metadata targets; https-only preferred for fetches.
 */

const BLOCKED_HOSTS = new Set([
  "localhost",
  "metadata.google.internal",
  "metadata.goog",
  "metadata",
]);

/** True when hostname is a blocked name or resolves as a private/reserved IP literal. */
export function isBlockedOutboundHost(hostname: string): boolean {
  const host = hostname.replace(/^\[|\]$/g, "").toLowerCase();
  if (BLOCKED_HOSTS.has(host)) return true;
  if (host.endsWith(".localhost") || host.endsWith(".local")) return true;
  if (host === "::1" || host === "0.0.0.0") return true;

  // IPv4 literal
  const v4 = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (v4) {
    const parts = v4.slice(1).map(Number);
    if (parts.some((n) => n > 255)) return true;
    const [a, b] = parts;
    if (a === 10) return true; // 10.0.0.0/8
    if (a === 127) return true; // loopback
    if (a === 0) return true;
    if (a === 169 && b === 254) return true; // link-local / cloud metadata
    if (a === 172 && b >= 16 && b <= 31) return true; // 172.16.0.0/12
    if (a === 192 && b === 168) return true; // 192.168.0.0/16
    if (a === 100 && b >= 64 && b <= 127) return true; // CGNAT 100.64.0.0/10
    if (a >= 224) return true; // multicast / reserved
    return false;
  }

  // IPv6 literals (compressed forms still contain these prefixes commonly)
  if (host.includes(":")) {
    if (host === "::" || host.startsWith("fe80:") || host.startsWith("fc") || host.startsWith("fd")) {
      return true;
    }
    // IPv4-mapped ::ffff:127.0.0.1 etc.
    const mapped = host.match(/::ffff:(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/i);
    if (mapped && isBlockedOutboundHost(mapped[1]!)) return true;
  }

  return false;
}

/**
 * Validate an outbound http(s) URL for server-side fetch.
 * @param httpsOnly - when true, reject `http:` (preferred for og/oEmbed).
 */
export function isSafeOutboundUrl(raw: string, httpsOnly = true): boolean {
  try {
    const u = new URL(raw);
    if (httpsOnly) {
      if (u.protocol !== "https:") return false;
    } else if (u.protocol !== "https:" && u.protocol !== "http:") {
      return false;
    }
    if (u.username || u.password) return false;
    if (isBlockedOutboundHost(u.hostname)) return false;
    return true;
  } catch {
    return false;
  }
}

/** Normalize stored article/source URLs to https href or null. */
export function safeHttpsSourceUrl(raw: string | null | undefined): string | null {
  if (!raw) return null;
  if (!isSafeOutboundUrl(raw, true)) return null;
  try {
    return new URL(raw).href;
  } catch {
    return null;
  }
}
