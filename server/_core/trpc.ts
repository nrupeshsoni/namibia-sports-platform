import { NOT_ADMIN_ERR_MSG, NOT_FEDERATION_ADMIN_ERR_MSG, UNAUTHED_ERR_MSG } from '@shared/const';
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import type { TrpcContext } from "./context";

const t = initTRPC.context<TrpcContext>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;

const requireUser = t.middleware(async opts => {
  const { ctx, next } = opts;

  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }

  return next({
    ctx: {
      ...ctx,
      user: ctx.user,
    },
  });
});

export const protectedProcedure = t.procedure.use(requireUser);

export const adminProcedure = t.procedure.use(
  t.middleware(async opts => {
    const { ctx, next } = opts;

    if (!ctx.user || ctx.user.role !== 'admin') {
      throw new TRPCError({ code: "FORBIDDEN", message: NOT_ADMIN_ERR_MSG });
    }

    return next({
      ctx: {
        ...ctx,
        user: ctx.user,
      },
    });
  }),
);

const federationAdminMiddleware = t.middleware(async opts => {
  const { ctx, next } = opts;

  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }

  if (ctx.user.role !== 'federation_admin' && ctx.user.role !== 'admin') {
    throw new TRPCError({ code: "FORBIDDEN", message: NOT_FEDERATION_ADMIN_ERR_MSG });
  }

  return next({
    ctx: { ...ctx, user: ctx.user },
  });
});

/**
 * Requires federation_admin or admin role — and NOTHING else.
 *
 * Tenant scoping is deliberately NOT done here. The middleware used to sniff a
 * `federationId` out of the raw input, which fails open in two ways: a shape it
 * cannot read (or an input without that field) silently skips the check, and
 * nothing forces a procedure author to name the field at all. Every
 * federation-scoped mutation therefore calls `assertSameFederation` explicitly
 * (server/_core/federationScope.ts) against the id it is actually about to
 * write — the assertion is visible at the point of use and fails closed.
 */
export const federationAdminProcedure = t.procedure.use(requireUser).use(federationAdminMiddleware);
