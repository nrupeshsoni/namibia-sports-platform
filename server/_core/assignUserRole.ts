import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { federations, users } from "../../drizzle/schema";
import { getDb } from "../db";

export type AssignableRole = "user" | "admin" | "federation_admin";

/**
 * Apply a platform-admin role change on an existing `sportsplatform_users` row.
 * Shared by `users.setRole` and `users.inviteOrPromote`.
 */
export async function assignUserRole(opts: {
  actorUserId: number;
  targetUserId: number;
  role: AssignableRole;
  federationId?: number | null;
}): Promise<{ success: true }> {
  if (opts.targetUserId === opts.actorUserId && opts.role !== "admin") {
    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "You cannot remove your own admin role",
    });
  }

  const db = await getDb();
  if (!db) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Database not available",
    });
  }

  const [target] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.id, opts.targetUserId))
    .limit(1);
  if (!target) {
    throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
  }

  if (opts.role === "federation_admin") {
    if (opts.federationId == null) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "federationId is required for federation_admin",
      });
    }
    const [fed] = await db
      .select({ id: federations.id })
      .from(federations)
      .where(eq(federations.id, opts.federationId))
      .limit(1);
    if (!fed) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "federationId does not exist",
      });
    }
  }

  const federationId =
    opts.role === "federation_admin" ? (opts.federationId ?? null) : null;

  await db
    .update(users)
    .set({
      role: opts.role,
      federationId,
      clubId: null,
      updatedAt: new Date(),
    })
    .where(eq(users.id, opts.targetUserId));

  return { success: true as const };
}
