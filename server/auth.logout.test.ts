import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import { NOT_ADMIN_ERR_MSG, UNAUTHED_ERR_MSG } from "../shared/const";
import type { TrpcContext } from "./_core/context";
import type { Env } from "./_core/env";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createUser(overrides: Partial<AuthenticatedUser> = {}): AuthenticatedUser {
  return {
    id: 1,
    openId: "00000000-0000-4000-8000-000000000000",
    email: "sample@example.com",
    name: "Sample User",
    loginMethod: "email",
    role: "user",
    federationId: null,
    clubId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
    ...overrides,
  };
}

function createContext(user: AuthenticatedUser | null): TrpcContext {
  return {
    user,
    req: new Request("https://example.test/api/trpc/auth.logout"),
    env: {} as Env,
    supabase: {} as TrpcContext["supabase"],
  };
}

describe("auth.logout", () => {
  it("reports success without touching server-side session state", async () => {
    const caller = appRouter.createCaller(createContext(createUser()));

    const result = await caller.auth.logout();

    expect(result).toEqual({ success: true });
  });
});

describe("auth.me", () => {
  it("returns the caller's user row", async () => {
    const user = createUser();
    const caller = appRouter.createCaller(createContext(user));

    await expect(caller.auth.me()).resolves.toEqual(user);
  });

  it("returns null when the request is unauthenticated", async () => {
    const caller = appRouter.createCaller(createContext(null));

    await expect(caller.auth.me()).resolves.toBeNull();
  });
});

describe("procedure authorization", () => {
  it("rejects admin procedures for unauthenticated callers", async () => {
    const caller = appRouter.createCaller(createContext(null));

    await expect(caller.federations.delete({ id: 1 })).rejects.toThrow(NOT_ADMIN_ERR_MSG);
  });

  it("rejects admin procedures for a default self-signed-up user", async () => {
    const caller = appRouter.createCaller(createContext(createUser({ role: "user" })));

    await expect(caller.federations.delete({ id: 1 })).rejects.toThrow(NOT_ADMIN_ERR_MSG);
  });

  it("rejects protected procedures for unauthenticated callers", async () => {
    const caller = appRouter.createCaller(createContext(null));

    await expect(caller.ai.suggestTags({ content: "sample" })).rejects.toThrow(
      UNAUTHED_ERR_MSG
    );
  });
});
