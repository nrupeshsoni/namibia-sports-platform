import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { eq } from "drizzle-orm";
import { getDb } from "../db";
import { federations, users } from "../../drizzle/schema";
import { adminProcedure, router } from "../_core/trpc";

/**
 * Assignable roles in Admin UI / API.
 * `club_manager` remains in the DB enum for forward-compat but is not grantable
 * until club-scoped procedures ship (no write capabilities today).
 */
const assignableRoleSchema = z.enum(["user", "admin", "federation_admin"]);

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
      z
        .object({
          id: z.number(),
          role: assignableRoleSchema,
          federationId: z.number().nullable().optional(),
          /** Reserved — rejected until club_manager capabilities exist */
          clubId: z.number().nullable().optional(),
        })
        .superRefine((val, ctx) => {
          if (val.role === "federation_admin" && val.federationId == null) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "federationId is required for federation_admin",
              path: ["federationId"],
            });
          }
          if (val.clubId != null) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: "club_manager role is not assignable yet",
              path: ["clubId"],
            });
          }
        })
    )
    .mutation(async ({ ctx, input }) => {
      if (input.id === ctx.user.id && input.role !== "admin") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You cannot remove your own admin role",
        });
      }

      const db = await getDb();
      if (!db) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
      }

      const [target] = await db
        .select({ id: users.id })
        .from(users)
        .where(eq(users.id, input.id))
        .limit(1);
      if (!target) {
        throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
      }

      if (input.role === "federation_admin" && input.federationId != null) {
        const [fed] = await db
          .select({ id: federations.id })
          .from(federations)
          .where(eq(federations.id, input.federationId))
          .limit(1);
        if (!fed) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "federationId does not exist" });
        }
      }

      const federationId =
        input.role === "federation_admin" ? (input.federationId ?? null) : null;

      await db
        .update(users)
        .set({
          role: input.role,
          federationId,
          clubId: null,
          updatedAt: new Date(),
        })
        .where(eq(users.id, input.id));

      return { success: true as const };
    }),
});
