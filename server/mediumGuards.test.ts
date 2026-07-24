/**
 * Medium go-live guards: setRole Zod coupling, storage path sanitization,
 * https href filtering, CORS allowlist.
 */

import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import { sanitizeStorageEntityId } from "./services/supabaseStorage";
import { corsHeadersForOrigin } from "./_core/cors";
import { safeHttpsHref, httpsUrlSchema } from "./_core/httpsUrl";
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

  it("httpsUrlSchema requires https", () => {
    expect(httpsUrlSchema.safeParse("https://sports.com.na").success).toBe(true);
    expect(httpsUrlSchema.safeParse("http://sports.com.na").success).toBe(false);
    expect(httpsUrlSchema.safeParse("javascript:void(0)").success).toBe(false);
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
