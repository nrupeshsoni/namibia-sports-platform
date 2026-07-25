/**
 * DB-first federation tenancy paths (gap T4).
 *
 * media.create/delete, coaches.update/delete, and hpPrograms.update/delete
 * load ownership from the database before assertSameFederation. Without a DB
 * mock, those mutations fail with "Database not available" before the guard —
 * so they cannot appear in the no-DB crossTenantCalls matrix.
 *
 * upload.image ownership (A1) also needs a row resolve after the input
 * federationId assert.
 */

import { beforeEach, describe, expect, it, vi } from "vitest";
import { NOT_FEDERATION_ADMIN_ERR_MSG } from "../shared/const";
import type { TrpcContext } from "./_core/context";
import type { Env } from "./_core/env";

const { getDbMock, uploadImageMock } = vi.hoisted(() => ({
  getDbMock: vi.fn(),
  uploadImageMock: vi.fn(),
}));

vi.mock("./db", () => ({
  getDb: getDbMock,
  runWithDb: (_env: unknown, fn: () => Promise<unknown>) => fn(),
  ensureUser: vi.fn(),
}));

vi.mock("./services/supabaseStorage", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./services/supabaseStorage")>();
  return {
    ...actual,
    uploadImage: uploadImageMock,
  };
});

const { appRouter } = await import("./routers");

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

const OWN_FEDERATION = 1;
const OTHER_FEDERATION = 2;

/** Queue of rows returned by successive `.select()…limit()` calls. */
let selectQueue: unknown[][] = [];

function createDbMock() {
  const limit = vi.fn(async () => {
    const next = selectQueue.shift();
    return next ?? [];
  });
  const where = vi.fn(() => ({ limit, where }));
  const from = vi.fn(() => ({ where, limit }));
  const select = vi.fn(() => ({ from }));

  const returning = vi.fn(async () => [{ id: 99 }]);
  const values = vi.fn(() => ({ returning }));
  const insert = vi.fn(() => ({ values }));

  const setWhere = vi.fn(async () => undefined);
  const set = vi.fn(() => ({ where: setWhere }));
  const update = vi.fn(() => ({ set }));

  const deleteWhere = vi.fn(async () => undefined);
  const del = vi.fn(() => ({ where: deleteWhere }));

  return {
    select,
    insert,
    update,
    delete: del,
    _spies: { insert, update, del, returning, setWhere, deleteWhere },
  };
}

let dbMock: ReturnType<typeof createDbMock>;

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

beforeEach(() => {
  selectQueue = [];
  dbMock = createDbMock();
  getDbMock.mockReset();
  getDbMock.mockResolvedValue(dbMock);
  uploadImageMock.mockReset();
  uploadImageMock.mockResolvedValue({
    url: "https://cdn.example/sports/club/1.jpg",
    path: "club/1.jpg",
  });
});

describe("media tenancy (DB-first)", () => {
  it("rejects media.create when entity federation is foreign", async () => {
    // entityType federation → resolve returns entityId (OTHER) with no select
    const caller = callerFor(federationAdmin(OWN_FEDERATION));
    await expect(
      caller.media.create({
        fileUrl: "https://cdn.example/x.jpg",
        type: "image",
        entityType: "federation",
        entityId: OTHER_FEDERATION,
      })
    ).rejects.toThrow(NOT_FEDERATION_ADMIN_ERR_MSG);
    expect(dbMock._spies.insert).not.toHaveBeenCalled();
  });

  it("allows media.create for own federation entity then writes", async () => {
    const caller = callerFor(federationAdmin(OWN_FEDERATION));
    const result = await caller.media.create({
      fileUrl: "https://cdn.example/x.jpg",
      type: "image",
      entityType: "federation",
      entityId: OWN_FEDERATION,
    });
    expect(result).toEqual({ success: true, id: 99 });
    expect(dbMock._spies.insert).toHaveBeenCalled();
  });

  it("rejects media.delete when resolved owning federation is foreign", async () => {
    selectQueue = [
      [
        {
          id: 7,
          entityType: "federation",
          entityId: OTHER_FEDERATION,
          fileUrl: "https://cdn.example/x.jpg",
          type: "image",
        },
      ],
    ];
    const caller = callerFor(federationAdmin(OWN_FEDERATION));
    await expect(caller.media.delete({ id: 7 })).rejects.toThrow(
      NOT_FEDERATION_ADMIN_ERR_MSG
    );
    expect(dbMock._spies.del).not.toHaveBeenCalled();
  });

  it("allows media.delete for own federation media", async () => {
    selectQueue = [
      [
        {
          id: 7,
          entityType: "federation",
          entityId: OWN_FEDERATION,
          fileUrl: "https://cdn.example/x.jpg",
          type: "image",
        },
      ],
    ];
    const caller = callerFor(federationAdmin(OWN_FEDERATION));
    await expect(caller.media.delete({ id: 7 })).resolves.toEqual({
      success: true,
    });
    expect(dbMock._spies.del).toHaveBeenCalled();
  });

  it("rejects media.update when resolved owning federation is foreign", async () => {
    selectQueue = [
      [
        {
          id: 7,
          entityType: "federation",
          entityId: OTHER_FEDERATION,
          fileUrl: "https://cdn.example/x.jpg",
          type: "image",
        },
      ],
    ];
    const caller = callerFor(federationAdmin(OWN_FEDERATION));
    await expect(
      caller.media.update({ id: 7, title: "Nope" })
    ).rejects.toThrow(NOT_FEDERATION_ADMIN_ERR_MSG);
    expect(dbMock._spies.update).not.toHaveBeenCalled();
  });

  it("allows media.update for own federation media", async () => {
    selectQueue = [
      [
        {
          id: 7,
          entityType: "federation",
          entityId: OWN_FEDERATION,
          fileUrl: "https://cdn.example/x.jpg",
          type: "image",
        },
      ],
    ];
    const caller = callerFor(federationAdmin(OWN_FEDERATION));
    await expect(
      caller.media.update({ id: 7, title: "Caption" })
    ).resolves.toEqual({ success: true });
    expect(dbMock._spies.update).toHaveBeenCalled();
  });

  it("rejects media.create when club entity belongs to another federation", async () => {
    selectQueue = [[{ federationId: OTHER_FEDERATION }]];
    const caller = callerFor(federationAdmin(OWN_FEDERATION));
    await expect(
      caller.media.create({
        fileUrl: "https://cdn.example/x.jpg",
        type: "image",
        entityType: "club",
        entityId: 55,
      })
    ).rejects.toThrow(NOT_FEDERATION_ADMIN_ERR_MSG);
    expect(dbMock._spies.insert).not.toHaveBeenCalled();
  });
});

describe("coaches.update/delete tenancy (DB-first)", () => {
  it("rejects coaches.update when stored federationId is foreign", async () => {
    selectQueue = [[{ federationId: OTHER_FEDERATION }]];
    const caller = callerFor(federationAdmin(OWN_FEDERATION));
    await expect(
      caller.coaches.update({ id: 3, firstName: "X" })
    ).rejects.toThrow(NOT_FEDERATION_ADMIN_ERR_MSG);
    expect(dbMock._spies.update).not.toHaveBeenCalled();
  });

  it("allows coaches.update for own federation row", async () => {
    selectQueue = [[{ federationId: OWN_FEDERATION }]];
    const caller = callerFor(federationAdmin(OWN_FEDERATION));
    await expect(
      caller.coaches.update({ id: 3, firstName: "X" })
    ).resolves.toEqual({ success: true });
    expect(dbMock._spies.update).toHaveBeenCalled();
  });

  it("rejects coaches.delete when stored federationId is foreign", async () => {
    selectQueue = [[{ federationId: OTHER_FEDERATION }]];
    const caller = callerFor(federationAdmin(OWN_FEDERATION));
    await expect(caller.coaches.delete({ id: 3 })).rejects.toThrow(
      NOT_FEDERATION_ADMIN_ERR_MSG
    );
    expect(dbMock._spies.del).not.toHaveBeenCalled();
  });

  it("allows coaches.delete for own federation row", async () => {
    selectQueue = [[{ federationId: OWN_FEDERATION }]];
    const caller = callerFor(federationAdmin(OWN_FEDERATION));
    await expect(caller.coaches.delete({ id: 3 })).resolves.toEqual({
      success: true,
    });
    expect(dbMock._spies.del).toHaveBeenCalled();
  });
});

describe("hpPrograms.update/delete tenancy (DB-first)", () => {
  it("rejects hpPrograms.update when stored federationId is foreign", async () => {
    selectQueue = [[{ federationId: OTHER_FEDERATION }]];
    const caller = callerFor(federationAdmin(OWN_FEDERATION));
    await expect(
      caller.hpPrograms.update({ id: 4, name: "X" })
    ).rejects.toThrow(NOT_FEDERATION_ADMIN_ERR_MSG);
    expect(dbMock._spies.update).not.toHaveBeenCalled();
  });

  it("allows hpPrograms.update for own federation row", async () => {
    selectQueue = [[{ federationId: OWN_FEDERATION }]];
    const caller = callerFor(federationAdmin(OWN_FEDERATION));
    await expect(
      caller.hpPrograms.update({ id: 4, name: "X" })
    ).resolves.toEqual({ success: true });
    expect(dbMock._spies.update).toHaveBeenCalled();
  });

  it("rejects hpPrograms.delete when stored federationId is foreign", async () => {
    selectQueue = [[{ federationId: OTHER_FEDERATION }]];
    const caller = callerFor(federationAdmin(OWN_FEDERATION));
    await expect(caller.hpPrograms.delete({ id: 4 })).rejects.toThrow(
      NOT_FEDERATION_ADMIN_ERR_MSG
    );
    expect(dbMock._spies.del).not.toHaveBeenCalled();
  });

  it("allows hpPrograms.delete for own federation row", async () => {
    selectQueue = [[{ federationId: OWN_FEDERATION }]];
    const caller = callerFor(federationAdmin(OWN_FEDERATION));
    await expect(caller.hpPrograms.delete({ id: 4 })).resolves.toEqual({
      success: true,
    });
    expect(dbMock._spies.del).toHaveBeenCalled();
  });
});

describe("upload.image ownership (A1, DB-resolved)", () => {
  it("rejects own federationId claim + foreign club entityId", async () => {
    selectQueue = [[{ federationId: OTHER_FEDERATION }]];
    const caller = callerFor(federationAdmin(OWN_FEDERATION));
    await expect(
      caller.upload.image({
        federationId: OWN_FEDERATION,
        entity: "club",
        entityId: 99,
        base64: "aGk=",
      })
    ).rejects.toThrow(NOT_FEDERATION_ADMIN_ERR_MSG);
    expect(uploadImageMock).not.toHaveBeenCalled();
  });

  it("rejects venue uploads for federation_admin (platform-scoped)", async () => {
    const caller = callerFor(federationAdmin(OWN_FEDERATION));
    await expect(
      caller.upload.image({
        federationId: OWN_FEDERATION,
        entity: "venue",
        entityId: 1,
        base64: "aGk=",
      })
    ).rejects.toThrow(NOT_FEDERATION_ADMIN_ERR_MSG);
    expect(uploadImageMock).not.toHaveBeenCalled();
  });

  it("rejects missing entity row", async () => {
    selectQueue = [[]];
    const caller = callerFor(federationAdmin(OWN_FEDERATION));
    await expect(
      caller.upload.image({
        federationId: OWN_FEDERATION,
        entity: "club",
        entityId: 404,
        base64: "aGk=",
      })
    ).rejects.toThrow(/Entity not found|NOT_FOUND/i);
    expect(uploadImageMock).not.toHaveBeenCalled();
  });

  it("uploads when claim matches club ownership", async () => {
    selectQueue = [[{ federationId: OWN_FEDERATION }]];
    const caller = callerFor(federationAdmin(OWN_FEDERATION));
    await expect(
      caller.upload.image({
        federationId: OWN_FEDERATION,
        entity: "club",
        entityId: 12,
        base64: "aGk=",
      })
    ).resolves.toEqual({
      url: "https://cdn.example/sports/club/1.jpg",
      path: "club/1.jpg",
    });
    expect(uploadImageMock).toHaveBeenCalledOnce();
  });

  it("rejects draft string entityId for federation_admin", async () => {
    const caller = callerFor(federationAdmin(OWN_FEDERATION));
    await expect(
      caller.upload.image({
        federationId: OWN_FEDERATION,
        entity: "club",
        entityId: "new_draft",
        base64: "aGk=",
      })
    ).rejects.toThrow(/entityId must be a numeric row id/);
    expect(uploadImageMock).not.toHaveBeenCalled();
  });
});
