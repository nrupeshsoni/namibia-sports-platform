/**
 * Platform-admin user invite/promote + stats procedure guards.
 */

import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
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

function federationAdmin(): AuthenticatedUser {
  return {
    ...platformAdmin(),
    id: 2,
    openId: "00000000-0000-4000-8000-000000000002",
    email: "fed@example.com",
    role: "federation_admin",
    federationId: 1,
  };
}

function callerFor(user: AuthenticatedUser | null) {
  return appRouter.createCaller({
    user,
    req: new Request("https://example.test/api/trpc"),
    env: {} as Env,
    supabase: {} as TrpcContext["supabase"],
  });
}

describe("users.inviteOrPromote", () => {
  const caller = callerFor(platformAdmin());

  it("rejects federation_admin without federationId at input validation", async () => {
    await expect(
      caller.users.inviteOrPromote({
        email: "editor@example.com",
        role: "federation_admin",
      })
    ).rejects.toThrow(/federationId is required for federation_admin/);
  });

  it("rejects non-admin callers", async () => {
    const fed = callerFor(federationAdmin());
    await expect(
      fed.users.inviteOrPromote({
        email: "editor@example.com",
        role: "user",
      })
    ).rejects.toThrow();
  });

  it("fails open with clear register-first message when DB unavailable", async () => {
    await expect(
      caller.users.inviteOrPromote({
        email: "new@example.com",
        name: "New User",
        role: "user",
      })
    ).rejects.toThrow(/Database not available|register first|SERVICE_ROLE/);
  });
});

describe("adminStats.counts", () => {
  it("rejects federation_admin", async () => {
    const fed = callerFor(federationAdmin());
    await expect(fed.adminStats.counts()).rejects.toThrow();
  });

  it("allows platform admin (zeros when DB unavailable)", async () => {
    const admin = callerFor(platformAdmin());
    const counts = await admin.adminStats.counts();
    expect(counts).toEqual({
      federations: 0,
      events: 0,
      clubs: 0,
      athletes: 0,
    });
  });
});

describe("users.inviteCapabilities", () => {
  it("is admin-only", async () => {
    const fed = callerFor(federationAdmin());
    await expect(fed.users.inviteCapabilities()).rejects.toThrow();
  });

  it("returns boolean canCreateAuthUser for admin", async () => {
    const admin = callerFor(platformAdmin());
    const caps = await admin.users.inviteCapabilities();
    expect(typeof caps.canCreateAuthUser).toBe("boolean");
  });
});
