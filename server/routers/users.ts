import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { getDb } from "../db";
import { users } from "../../drizzle/schema";
import { adminProcedure, router } from "../_core/trpc";

const roleSchema = z.enum(["user", "admin", "federation_admin", "club_manager"]);

/**
 * Platform-admin user directory and role assignment.
 * Critical for granting federation_admin editors access to FedAdmin.
 */
export const usersRouter = router({
  list: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) return [];

    return db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        federationId: users.federationId,
        clubId: users.clubId,
        createdAt: users.createdAt,
        lastSignedIn: users.lastSignedIn,
      })
      .from(users)
      .orderBy(users.email);
  }),

  setRole: adminProcedure
    .input(
      z.object({
        id: z.number(),
        role: roleSchema,
        federationId: z.number().nullable().optional(),
        clubId: z.number().nullable().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.id === ctx.user.id && input.role !== "admin") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You cannot remove your own admin role",
        });
      }

      if (input.role === "federation_admin" && input.federationId == null) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "federationId is required for federation_admin",
        });
      }

      if (input.role === "club_manager" && input.clubId == null) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "clubId is required for club_manager",
        });
      }

      const db = await getDb();
      if (!db) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      }

      const federationId =
        input.role === "federation_admin" || input.role === "club_manager"
          ? (input.federationId ?? null)
          : null;
      const clubId = input.role === "club_manager" ? (input.clubId ?? null) : null;

      await db
        .update(users)
        .set({
          role: input.role,
          federationId,
          clubId,
          updatedAt: new Date(),
        })
        .where(eq(users.id, input.id));

      return { success: true as const };
    }),
});
