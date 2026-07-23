/**
 * Tenancy boundary for federation-scoped mutations.
 *
 * These used to be guarded by a middleware that read `federationId` out of the
 * raw tRPC input; a shape it could not read simply skipped the check. The guard
 * now lives in each mutation, so this suite exercises the real call path — a
 * federation_admin acting on someone else's federation must be rejected before
 * anything is written. No database is available in this environment, so a
 * mutation that gets past the guard fails with "Database not available";
 * asserting on the FORBIDDEN message therefore also proves the guard runs
 * first.
 */

import { describe, expect, it } from "vitest";
import { TRPCError } from "@trpc/server";
import { appRouter } from "./routers";
import { NOT_FEDERATION_ADMIN_ERR_MSG } from "../shared/const";
import {
  assertSameFederation,
  canIncludeInactive,
  canIncludeUnpublished,
  canViewNonPublic,
} from "./_core/federationScope";
import type { TrpcContext } from "./_core/context";
import type { Env } from "./_core/env";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

const OWN_FEDERATION = 1;
const OTHER_FEDERATION = 2;

function federationAdmin(federationId: number | null): AuthenticatedUser {
  return {
    id: 42,
    openId: "00000000-0000-4000-8000-000000000042",
    email: "fedadmin@example.com",
    name: "Federation Admin",
    loginMethod: "email",
    role: "federation_admin",
    federationId,
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

describe("assertSameFederation (unit)", () => {
  it("allows platform admin for any federation", () => {
    expect(() =>
      assertSameFederation({ role: "admin", federationId: null }, OTHER_FEDERATION)
    ).not.toThrow();
  });

  it("allows matching federation_admin", () => {
    expect(() =>
      assertSameFederation(
        { role: "federation_admin", federationId: OWN_FEDERATION },
        OWN_FEDERATION
      )
    ).not.toThrow();
  });

  it("rejects mismatched federation_admin", () => {
    expect(() =>
      assertSameFederation(
        { role: "federation_admin", federationId: OWN_FEDERATION },
        OTHER_FEDERATION
      )
    ).toThrow(TRPCError);
    try {
      assertSameFederation(
        { role: "federation_admin", federationId: OWN_FEDERATION },
        OTHER_FEDERATION
      );
    } catch (err) {
      expect(err).toBeInstanceOf(TRPCError);
      expect((err as TRPCError).code).toBe("FORBIDDEN");
      expect((err as TRPCError).message).toBe(NOT_FEDERATION_ADMIN_ERR_MSG);
    }
  });

  it("rejects null resource federationId", () => {
    expect(() =>
      assertSameFederation(
        { role: "federation_admin", federationId: OWN_FEDERATION },
        null
      )
    ).toThrow(NOT_FEDERATION_ADMIN_ERR_MSG);
  });

  it("rejects federation_admin with no assigned federation", () => {
    expect(() =>
      assertSameFederation(
        { role: "federation_admin", federationId: null },
        OWN_FEDERATION
      )
    ).toThrow(NOT_FEDERATION_ADMIN_ERR_MSG);
  });
});

describe("canIncludeUnpublished / canIncludeInactive / canViewNonPublic (unit)", () => {
  it("denies anonymous callers", () => {
    expect(canIncludeUnpublished(null, OWN_FEDERATION)).toBe(false);
    expect(canIncludeInactive(undefined, OWN_FEDERATION)).toBe(false);
    expect(canViewNonPublic(null, OWN_FEDERATION)).toBe(false);
  });

  it("allows platform admin", () => {
    const admin = { role: "admin", federationId: null };
    expect(canIncludeUnpublished(admin, OTHER_FEDERATION)).toBe(true);
    expect(canIncludeInactive(admin, undefined)).toBe(true);
    expect(canViewNonPublic(admin, OTHER_FEDERATION)).toBe(true);
  });

  it("allows matching federation_admin only", () => {
    const fed = { role: "federation_admin", federationId: OWN_FEDERATION };
    expect(canIncludeUnpublished(fed, OWN_FEDERATION)).toBe(true);
    expect(canIncludeInactive(fed, OWN_FEDERATION)).toBe(true);
    expect(canViewNonPublic(fed, OWN_FEDERATION)).toBe(true);
    expect(canIncludeUnpublished(fed, OTHER_FEDERATION)).toBe(false);
    expect(canViewNonPublic(fed, OTHER_FEDERATION)).toBe(false);
    expect(canIncludeUnpublished(fed, undefined)).toBe(false);
    expect(canViewNonPublic(fed, null)).toBe(false);
  });

  it("denies plain users", () => {
    const user = { role: "user", federationId: OWN_FEDERATION };
    expect(canIncludeUnpublished(user, OWN_FEDERATION)).toBe(false);
    expect(canViewNonPublic(user, OWN_FEDERATION)).toBe(false);
  });
});

/** One representative mutation per federation-scoped router. */
function crossTenantCalls(caller: ReturnType<typeof callerFor>) {
  return {
    "athletes.create": () =>
      caller.athletes.create({
        firstName: "A",
        lastName: "B",
        federationId: OTHER_FEDERATION,
      }),
    "athletes.update": () =>
      caller.athletes.update({ id: 1, federationId: OTHER_FEDERATION }),
    "athletes.delete": () =>
      caller.athletes.delete({ id: 1, federationId: OTHER_FEDERATION }),
    "clubs.create": () =>
      caller.clubs.create({ name: "C", slug: "c", federationId: OTHER_FEDERATION }),
    "clubs.update": () => caller.clubs.update({ id: 1, federationId: OTHER_FEDERATION }),
    "clubs.delete": () => caller.clubs.delete({ id: 1, federationId: OTHER_FEDERATION }),
    "coaches.create": () =>
      caller.coaches.create({
        firstName: "A",
        lastName: "B",
        federationId: OTHER_FEDERATION,
      }),
    "events.create": () =>
      caller.events.create({
        name: "E",
        slug: "e",
        federationId: OTHER_FEDERATION,
        startDate: new Date(),
      }),
    "events.update": () => caller.events.update({ id: 1, federationId: OTHER_FEDERATION }),
    "events.delete": () => caller.events.delete({ id: 1, federationId: OTHER_FEDERATION }),
    "hpPrograms.create": () =>
      caller.hpPrograms.create({
        federationId: OTHER_FEDERATION,
        name: "P",
        programType: "development",
      }),
    "news.create": () =>
      caller.news.create({ federationId: OTHER_FEDERATION, title: "T", slug: "t" }),
    "news.update": () => caller.news.update({ id: 1, federationId: OTHER_FEDERATION }),
    "news.publish": () => caller.news.publish({ id: 1, federationId: OTHER_FEDERATION }),
    "streams.create": () =>
      caller.streams.create({ federationId: OTHER_FEDERATION, title: "S" }),
    "streams.update": () =>
      caller.streams.update({ id: 1, federationId: OTHER_FEDERATION }),
    "streams.setLive": () =>
      caller.streams.setLive({ id: 1, federationId: OTHER_FEDERATION, isLive: true }),
    "upload.image": () =>
      caller.upload.image({
        federationId: OTHER_FEDERATION,
        entity: "club",
        entityId: 1,
        base64: "aGk=",
      }),
  };
}

describe("federation tenancy (cross-tenant FORBIDDEN)", () => {
  const calls = crossTenantCalls(callerFor(federationAdmin(OWN_FEDERATION)));

  for (const [name, call] of Object.entries(calls)) {
    it(`rejects ${name} against another federation`, async () => {
      await expect(call()).rejects.toThrow(NOT_FEDERATION_ADMIN_ERR_MSG);
    });
  }

  it("rejects a federation_admin with no federation assigned", async () => {
    const caller = callerFor(federationAdmin(null));

    await expect(
      caller.clubs.update({ id: 1, federationId: OWN_FEDERATION })
    ).rejects.toThrow(NOT_FEDERATION_ADMIN_ERR_MSG);
  });
});

describe("federation tenancy (same-tenant guard pass-through)", () => {
  // Negative control: without these, every FORBIDDEN test would still pass if
  // the guard rejected unconditionally. "Database not available" (or a later
  // storage error for upload) means the mutation got past authorization.
  const caller = callerFor(federationAdmin(OWN_FEDERATION));

  it("lets clubs.update through the guard", async () => {
    await expect(
      caller.clubs.update({ id: 1, federationId: OWN_FEDERATION })
    ).rejects.toThrow("Database not available");
  });

  it("lets events.create through the guard", async () => {
    await expect(
      caller.events.create({
        name: "E",
        slug: "e",
        federationId: OWN_FEDERATION,
        startDate: new Date(),
      })
    ).rejects.toThrow("Database not available");
  });

  it("lets news.create through the guard", async () => {
    await expect(
      caller.news.create({ federationId: OWN_FEDERATION, title: "T", slug: "t" })
    ).rejects.toThrow("Database not available");
  });

  it("lets streams.create through the guard", async () => {
    await expect(
      caller.streams.create({ federationId: OWN_FEDERATION, title: "S" })
    ).rejects.toThrow("Database not available");
  });

  it("lets upload.image through the guard", async () => {
    try {
      await caller.upload.image({
        federationId: OWN_FEDERATION,
        entity: "club",
        entityId: 1,
        base64: "aGk=",
      });
      expect.fail("expected upload.image to throw after the tenancy guard");
    } catch (err) {
      expect(err).toBeInstanceOf(Error);
      expect((err as Error).message).not.toBe(NOT_FEDERATION_ADMIN_ERR_MSG);
    }
  });
});
