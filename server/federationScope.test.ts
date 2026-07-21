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
import { appRouter } from "./routers";
import { NOT_FEDERATION_ADMIN_ERR_MSG } from "../shared/const";
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

describe("federation tenancy", () => {
  const calls = crossTenantCalls(callerFor(federationAdmin(OWN_FEDERATION)));

  for (const [name, call] of Object.entries(calls)) {
    it(`rejects ${name} against another federation`, async () => {
      await expect(call()).rejects.toThrow(NOT_FEDERATION_ADMIN_ERR_MSG);
    });
  }

  it("lets a matching federation through the guard", async () => {
    // Negative control: without this, every test above would still pass if the
    // guard rejected unconditionally. "Database not available" means the
    // mutation got past authorization and into its body.
    const caller = callerFor(federationAdmin(OWN_FEDERATION));

    await expect(
      caller.clubs.update({ id: 1, federationId: OWN_FEDERATION })
    ).rejects.toThrow("Database not available");
  });

  it("rejects a federation_admin with no federation assigned", async () => {
    const caller = callerFor(federationAdmin(null));

    await expect(
      caller.clubs.update({ id: 1, federationId: OWN_FEDERATION })
    ).rejects.toThrow(NOT_FEDERATION_ADMIN_ERR_MSG);
  });
});
