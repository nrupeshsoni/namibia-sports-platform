import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createClient } from "@supabase/supabase-js";
import { eq, sql } from "drizzle-orm";
import { getDb, ensureUser } from "../db";
import { users } from "../../drizzle/schema";
import { adminProcedure, router } from "../_core/trpc";
import { ENV } from "../_core/env";
import { assignUserRole } from "../_core/assignUserRole";

/**
 * Assignable roles in Admin UI / API.
 * `club_manager` remains in the DB enum for forward-compat but is not grantable
 * until club-scoped procedures ship (no write capabilities today).
 */
const assignableRoleSchema = z.enum(["user", "admin", "federation_admin"]);

const roleAssignInput = z
  .object({
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
  });

/**
 * Platform-admin user directory, role assignment, and invite/promote.
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

  /** Whether Auth Admin invite is available (service_role configured). */
  inviteCapabilities: adminProcedure.query(() => ({
    canCreateAuthUser: Boolean(ENV.supabaseUrl && ENV.supabaseServiceRoleKey),
  })),

  findByEmail: adminProcedure
    .input(z.object({ email: z.string().email().max(320) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;

      const normalized = input.email.trim().toLowerCase();
      const [row] = await db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          role: users.role,
          federationId: users.federationId,
        })
        .from(users)
        .where(sql`lower(${users.email}) = ${normalized}`)
        .limit(1);

      return row ?? null;
    }),

  setRole: adminProcedure
    .input(
      roleAssignInput.and(
        z.object({
          id: z.number(),
        })
      )
    )
    .mutation(async ({ ctx, input }) =>
      assignUserRole({
        actorUserId: ctx.user.id,
        targetUserId: input.id,
        role: input.role,
        federationId: input.federationId,
      })
    ),

  /**
   * Create (via Supabase Auth Admin when service_role is set) or promote an
   * existing platform user by email, then assign role + federationId.
   */
  inviteOrPromote: adminProcedure
    .input(
      roleAssignInput.and(
        z.object({
          email: z.string().email().max(320),
          name: z.string().trim().min(1).max(200).optional(),
        })
      )
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      const email = input.email.trim().toLowerCase();
      const [existing] = await db
        .select({ id: users.id })
        .from(users)
        .where(sql`lower(${users.email}) = ${email}`)
        .limit(1);

      let targetId = existing?.id;

      if (targetId == null) {
        targetId = await createAuthAndPlatformUser(email, input.name);
      } else if (input.name) {
        await db
          .update(users)
          .set({ name: input.name, updatedAt: new Date() })
          .where(eq(users.id, targetId));
      }

      await assignUserRole({
        actorUserId: ctx.user.id,
        targetUserId: targetId,
        role: input.role,
        federationId: input.federationId,
      });

      return {
        success: true as const,
        userId: targetId,
        created: existing == null,
      };
    }),
});

/**
 * Provision Supabase Auth + `sportsplatform_users` when service_role is available.
 * Otherwise instruct the admin to have the user register first.
 */
async function createAuthAndPlatformUser(
  email: string,
  name?: string
): Promise<number> {
  if (!ENV.supabaseUrl || !ENV.supabaseServiceRoleKey) {
    throw new TRPCError({
      code: "PRECONDITION_FAILED",
      message:
        "User must register first at /register, then promote by email search. Auth invite requires SUPABASE_SERVICE_ROLE_KEY.",
    });
  }

  const admin = createClient(ENV.supabaseUrl, ENV.supabaseServiceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data, error } = await admin.auth.admin.createUser({
    email,
    email_confirm: true,
    user_metadata: name ? { full_name: name, name } : undefined,
  });

  if (error || !data.user) {
    const msg = error?.message ?? "Failed to create auth user";
    if (/already|exists|registered/i.test(msg)) {
      throw new TRPCError({
        code: "CONFLICT",
        message:
          "Auth user exists but has no platform profile yet — ask them to sign in once, then promote by email.",
      });
    }
    throw new TRPCError({ code: "BAD_REQUEST", message: msg });
  }

  const provisioned = await ensureUser({
    openId: data.user.id,
    email,
    name: name ?? data.user.user_metadata?.full_name ?? null,
    loginMethod: "email",
  });

  if (!provisioned?.id) {
    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: "Auth user created but platform profile provisioning failed",
    });
  }

  return provisioned.id;
}
