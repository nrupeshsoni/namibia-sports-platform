/**
 * clubs.list offset/limit + clubs.count + contact PII stripping (A34).
 */

import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";
import type { Env } from "./_core/env";

const { getDbMock } = vi.hoisted(() => ({
  getDbMock: vi.fn(),
}));

vi.mock("./db", () => ({
  getDb: getDbMock,
  runWithDb: (_env: unknown, fn: () => Promise<unknown>) => fn(),
  ensureUser: vi.fn(),
}));

const { appRouter } = await import("./routers");
const { resolveListLimit, resolveListOffset, MAX_LIST_LIMIT } = await import(
  "./_core/listLimits"
);

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

type ClubRow = {
  id: number;
  name: string;
  federationId: number;
  isActive: boolean;
  contactEmail: string | null;
  contactPhone: string | null;
};

let listRows: ClubRow[] = [];
let countValue = 0;
let lastLimit: number | undefined;
let lastOffset: number | undefined;

function createDbMock() {
  const offset = vi.fn(async (value: number) => {
    lastOffset = value;
    return listRows;
  });
  const limit = vi.fn((value: number) => {
    lastLimit = value;
    return { offset };
  });
  const orderBy = vi.fn(() => ({ limit }));
  const where = vi.fn(() => ({ orderBy, limit }));
  const from = vi.fn(() => ({ where }));
  const select = vi.fn((projection?: { value?: unknown }) => {
    if (projection && "value" in projection) {
      return {
        from: vi.fn(() => ({
          where: vi.fn(async () => [{ value: countValue }]),
        })),
      };
    }
    return { from };
  });

  return { select, _spies: { limit, offset, orderBy, where } };
}

let dbMock: ReturnType<typeof createDbMock>;

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

function anonymousCaller() {
  return appRouter.createCaller({
    user: null,
    req: new Request("https://example.test/api/trpc"),
    env: {} as Env,
    supabase: {} as TrpcContext["supabase"],
  });
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
  listRows = [];
  countValue = 0;
  lastLimit = undefined;
  lastOffset = undefined;
  dbMock = createDbMock();
  getDbMock.mockReset();
  getDbMock.mockResolvedValue(dbMock);
});

describe("listLimits offset/limit helpers", () => {
  it("defaults offset to 0 and limit to 50", () => {
    expect(resolveListOffset(undefined)).toBe(0);
    expect(resolveListLimit(undefined)).toBe(50);
  });

  it("caps limit at MAX_LIST_LIMIT", () => {
    expect(resolveListLimit(MAX_LIST_LIMIT)).toBe(MAX_LIST_LIMIT);
    expect(resolveListLimit(999)).toBe(MAX_LIST_LIMIT);
  });
});

describe("clubs.list offset + limit", () => {
  it("applies default limit and offset 0 when input omitted", async () => {
    listRows = [
      {
        id: 1,
        name: "A",
        federationId: 1,
        isActive: true,
        contactEmail: "a@example.com",
        contactPhone: "123",
      },
    ];
    const rows = await anonymousCaller().clubs.list();
    expect(lastLimit).toBe(50);
    expect(lastOffset).toBe(0);
    expect(rows).toHaveLength(1);
  });

  it("passes explicit limit and offset to the query", async () => {
    await anonymousCaller().clubs.list({ limit: 200, offset: 200 });
    expect(lastLimit).toBe(200);
    expect(lastOffset).toBe(200);
  });

  it("rejects negative offset at input validation", async () => {
    await expect(
      anonymousCaller().clubs.list({ offset: -1 })
    ).rejects.toThrow();
  });
});

describe("clubs.count", () => {
  it("returns the filtered total", async () => {
    countValue = 417;
    const total = await anonymousCaller().clubs.count();
    expect(total).toBe(417);
  });

  it("returns 0 when DB unavailable", async () => {
    getDbMock.mockResolvedValue(null);
    await expect(anonymousCaller().clubs.count()).resolves.toBe(0);
  });
});

describe("clubs.list contact PII", () => {
  it("strips contactEmail/contactPhone for anonymous callers", async () => {
    listRows = [
      {
        id: 1,
        name: "Public FC",
        federationId: 1,
        isActive: true,
        contactEmail: "secret@example.com",
        contactPhone: "+264811234567",
      },
    ];
    const rows = await anonymousCaller().clubs.list({ federationId: 1 });
    expect(rows[0]?.contactEmail).toBeNull();
    expect(rows[0]?.contactPhone).toBeNull();
    expect(rows[0]?.name).toBe("Public FC");
  });

  it("keeps contact PII for platform admin", async () => {
    listRows = [
      {
        id: 1,
        name: "Admin FC",
        federationId: 1,
        isActive: true,
        contactEmail: "staff@example.com",
        contactPhone: "+264811111111",
      },
    ];
    const rows = await callerFor(platformAdmin()).clubs.list({ federationId: 1 });
    expect(rows[0]?.contactEmail).toBe("staff@example.com");
    expect(rows[0]?.contactPhone).toBe("+264811111111");
  });
});
