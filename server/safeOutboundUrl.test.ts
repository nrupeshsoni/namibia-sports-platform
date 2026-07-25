/**
 * Mirrors supabase/functions/news-aggregator/safeUrl.ts SSRF rules (A3).
 * Keep assertions in sync when Edge helpers change.
 */
import { describe, expect, it } from "vitest";
import {
  isBlockedOutboundHost,
  isSafeOutboundUrl,
  safeHttpsSourceUrl,
} from "../supabase/functions/news-aggregator/safeUrl";

describe("isBlockedOutboundHost (SSRF A3)", () => {
  it("blocks localhost and metadata hosts", () => {
    expect(isBlockedOutboundHost("localhost")).toBe(true);
    expect(isBlockedOutboundHost("foo.localhost")).toBe(true);
    expect(isBlockedOutboundHost("metadata.google.internal")).toBe(true);
    expect(isBlockedOutboundHost("169.254.169.254")).toBe(true);
  });

  it("blocks RFC1918 and loopback literals", () => {
    expect(isBlockedOutboundHost("127.0.0.1")).toBe(true);
    expect(isBlockedOutboundHost("10.0.0.1")).toBe(true);
    expect(isBlockedOutboundHost("192.168.1.1")).toBe(true);
    expect(isBlockedOutboundHost("172.16.5.1")).toBe(true);
    expect(isBlockedOutboundHost("172.32.0.1")).toBe(false);
  });

  it("allows public hostnames", () => {
    expect(isBlockedOutboundHost("economist.com.na")).toBe(false);
    expect(isBlockedOutboundHost("news.google.com")).toBe(false);
  });
});

describe("isSafeOutboundUrl / safeHttpsSourceUrl", () => {
  it("requires https when httpsOnly", () => {
    expect(isSafeOutboundUrl("https://neweralive.na/a", true)).toBe(true);
    expect(isSafeOutboundUrl("http://neweralive.na/a", true)).toBe(false);
    expect(isSafeOutboundUrl("javascript:alert(1)", true)).toBe(false);
  });

  it("blocks private targets even over https", () => {
    expect(isSafeOutboundUrl("https://127.0.0.1/", true)).toBe(false);
    expect(isSafeOutboundUrl("https://169.254.169.254/latest/meta-data/", true)).toBe(
      false
    );
    expect(isSafeOutboundUrl("https://192.168.0.1/admin", true)).toBe(false);
  });

  it("safeHttpsSourceUrl normalizes or nulls", () => {
    expect(safeHttpsSourceUrl("https://sports.com.na/x")).toBe(
      "https://sports.com.na/x"
    );
    expect(safeHttpsSourceUrl("http://legacy.example/x")).toBeNull();
    expect(safeHttpsSourceUrl("javascript:void(0)")).toBeNull();
  });
});
