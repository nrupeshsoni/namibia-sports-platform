/**
 * Medium go-live guards: setRole Zod coupling, storage path sanitization,
 * https href filtering, CORS allowlist.
 */

import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import { sanitizeStorageEntityId } from "./services/supabaseStorage";
import { corsHeadersForOrigin } from "./_core/cors";
import { safeHttpsHref, httpsUrlSchema, mediaAssetUrlSchema } from "./_core/httpsUrl";
import { exposeInternalErrors, toClientSafeTrpcError } from "./_core/clientSafeError";
import { MAX_UPLOAD_BASE64_CHARS } from "./routers/upload";
import type { TrpcContext } from "./_core/context";
import type { Env } from "./_core/env";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function platformAdmin(): AuthenticatedUser {
  return {
    id: 1,
    openId: "00000000-0000-4000-8000-000000000001",
    email: "admin@example.com",
    name: "Platform Admin",
    loginMethod: "email",
    role: "admin",
    federationId: null,
    clubId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
}

function callerFor(user: AuthenticatedUser) {
  return appRouter.createCaller({
    user,
    req: new Request("https://example.test/api/trpc"),
    env: {} as Env,
    supabase: {} as TrpcContext["supabase"],
  });
}

describe("users.setRole Zod coupling", () => {
  const caller = callerFor(platformAdmin());

  it("rejects federation_admin without federationId at input validation", async () => {
    await expect(
      caller.users.setRole({ id: 99, role: "federation_admin" })
    ).rejects.toThrow(/federationId is required for federation_admin/);
  });

  it("rejects clubId until club_manager is assignable", async () => {
    await expect(
      caller.users.setRole({
        id: 99,
        role: "federation_admin",
        federationId: 1,
        clubId: 5,
      })
    ).rejects.toThrow(/club_manager role is not assignable yet/);
  });

  it("lets a well-formed federation_admin assignment past Zod (DB unavailable)", async () => {
    await expect(
      caller.users.setRole({ id: 99, role: "federation_admin", federationId: 1 })
    ).rejects.toThrow("Database not available");
  });
});

describe("sanitizeStorageEntityId", () => {
  it("accepts non-negative integers and safe string segments", () => {
    expect(sanitizeStorageEntityId(0)).toBe("0");
    expect(sanitizeStorageEntityId(42)).toBe("42");
    expect(sanitizeStorageEntityId("club-12")).toBe("club-12");
    expect(sanitizeStorageEntityId("new_draft")).toBe("new_draft");
  });

  it("rejects path traversal and separators", () => {
    expect(() => sanitizeStorageEntityId("../etc")).toThrow(/Invalid entity id/);
    expect(() => sanitizeStorageEntityId("a/b")).toThrow(/Invalid entity id/);
    expect(() => sanitizeStorageEntityId("a\\b")).toThrow(/Invalid entity id/);
    expect(() => sanitizeStorageEntityId(-1)).toThrow(/Invalid entity id/);
    expect(() => sanitizeStorageEntityId(1.5)).toThrow(/Invalid entity id/);
  });

  it("rejects unsafe entityId on upload.image via Zod before tenancy", async () => {
    const caller = callerFor({
      ...platformAdmin(),
      role: "federation_admin",
      federationId: 1,
    });
    await expect(
      caller.upload.image({
        federationId: 1,
        entity: "club",
        entityId: "../evil",
        base64: "aGk=",
      })
    ).rejects.toThrow(/Invalid entityId for storage path/);
  });
});

describe("safeHttpsHref / httpsUrlSchema", () => {
  it("allows https and rejects javascript/http/malformed", () => {
    expect(safeHttpsHref("https://example.com/a")).toBe("https://example.com/a");
    expect(safeHttpsHref("javascript:alert(1)")).toBeNull();
    expect(safeHttpsHref("http://example.com")).toBeNull();
    expect(safeHttpsHref("not a url")).toBeNull();
    expect(safeHttpsHref(null)).toBeNull();
  });

  it("nulls news sourceUrl attack vectors (A2)", () => {
    // Values that can appear in aggregator/DB rows or legacy footers.
    expect(safeHttpsHref("javascript:alert(document.cookie)")).toBeNull();
    expect(safeHttpsHref("data:text/html,<script>alert(1)</script>")).toBeNull();
    expect(safeHttpsHref("vbscript:msgbox(1)")).toBeNull();
    expect(safeHttpsHref("//evil.example/phish")).toBeNull();
    expect(safeHttpsHref("/relative/path")).toBeNull();
    expect(safeHttpsHref("")).toBeNull();
    expect(safeHttpsHref(undefined)).toBeNull();
    expect(safeHttpsHref("https://neweralive.na/sport/story")).toBe(
      "https://neweralive.na/sport/story"
    );
  });

  it("httpsUrlSchema requires https", () => {
    expect(httpsUrlSchema.safeParse("https://sports.com.na").success).toBe(true);
    expect(httpsUrlSchema.safeParse("http://sports.com.na").success).toBe(false);
    expect(httpsUrlSchema.safeParse("javascript:void(0)").success).toBe(false);
  });

  it("mediaAssetUrlSchema allows https and site-relative paths", () => {
    expect(mediaAssetUrlSchema.safeParse("https://cdn.example/a.jpg").success).toBe(true);
    expect(mediaAssetUrlSchema.safeParse("/sports/football.jpg").success).toBe(true);
    expect(mediaAssetUrlSchema.safeParse("/logos/marks/athletics.svg").success).toBe(true);
    expect(mediaAssetUrlSchema.safeParse("javascript:alert(1)").success).toBe(false);
    expect(mediaAssetUrlSchema.safeParse("http://evil.example/a").success).toBe(false);
    expect(mediaAssetUrlSchema.safeParse("//evil.example/a").success).toBe(false);
    expect(mediaAssetUrlSchema.safeParse("/../etc/passwd").success).toBe(false);
  });

  it("rejects non-https featuredImage on news.create (A2 write path)", async () => {
    const caller = callerFor({
      ...platformAdmin(),
      role: "federation_admin",
      federationId: 1,
    });
    await expect(
      caller.news.create({
        federationId: 1,
        title: "T",
        slug: "t",
        featuredImage: "javascript:alert(1)",
      })
    ).rejects.toThrow();
    await expect(
      caller.news.create({
        federationId: 1,
        title: "T",
        slug: "t-http",
        featuredImage: "http://cdn.example/x.jpg",
      })
    ).rejects.toThrow();
  });
});

describe("CORS allowlist", () => {
  it("returns ACAO for allowlisted origins only", () => {
    expect(corsHeadersForOrigin("https://sports.com.na")?.["Access-Control-Allow-Origin"]).toBe(
      "https://sports.com.na"
    );
    expect(corsHeadersForOrigin("http://localhost:5173")).not.toBeNull();
    expect(corsHeadersForOrigin("https://evil.example")).toBeNull();
    expect(corsHeadersForOrigin(null)).toBeNull();
  });
});

describe("P0 security mediums", () => {
  it("rejects unsafe fileUrl on media.create via Zod (SEC-M1)", async () => {
    const caller = callerFor({
      ...platformAdmin(),
      role: "federation_admin",
      federationId: 1,
    });
    await expect(
      caller.media.create({
        fileUrl: "javascript:alert(1)",
        entityType: "federation",
        entityId: 1,
      })
    ).rejects.toThrow();
    await expect(
      caller.media.create({
        fileUrl: "http://cdn.example/a.jpg",
        entityType: "federation",
        entityId: 1,
      })
    ).rejects.toThrow();
  });

  it("rejects oversized base64 on upload.image before decode (SEC-M2)", async () => {
    const caller = callerFor({
      ...platformAdmin(),
      role: "federation_admin",
      federationId: 1,
    });
    const huge = "A".repeat(MAX_UPLOAD_BASE64_CHARS + 1);
    await expect(
      caller.upload.image({
        federationId: 1,
        entity: "federation",
        entityId: 1,
        base64: huge,
      })
    ).rejects.toThrow();
  });

  it("hides upstream AI errors from clients in production (SEC-M6)", () => {
    const prev = process.env.NODE_ENV;
    try {
      process.env.NODE_ENV = "production";
      expect(exposeInternalErrors()).toBe(false);
      const err = toClientSafeTrpcError(
        "ai.test",
        new Error("Anthropic 401 sk-secret-xyz"),
        "AI request failed. Please try again later."
      );
      expect(err.message).toBe("AI request failed. Please try again later.");
      expect(err.message).not.toMatch(/sk-secret|Anthropic 401/);

      process.env.NODE_ENV = "development";
      expect(exposeInternalErrors()).toBe(true);
      const devErr = toClientSafeTrpcError(
        "ai.test",
        new Error("Anthropic 401 detail"),
        "AI request failed. Please try again later."
      );
      expect(devErr.message).toBe("Anthropic 401 detail");
    } finally {
      process.env.NODE_ENV = prev;
    }
  });
});
