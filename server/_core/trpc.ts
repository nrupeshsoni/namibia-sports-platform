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

function readFederationIdFromInput(raw: unknown): number | undefined {
  if (raw == null || typeof raw !== "object") return undefined;
  const value = (raw as { federationId?: unknown }).federationId;
  return typeof value === "number" ? value : undefined;
}

const federationAdminMiddleware = t.middleware(async opts => {
  const { ctx, next } = opts;

  if (!ctx.user) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: UNAUTHED_ERR_MSG });
  }

  if (ctx.user.role !== 'federation_admin' && ctx.user.role !== 'admin') {
    throw new TRPCError({ code: "FORBIDDEN", message: NOT_FEDERATION_ADMIN_ERR_MSG });
  }

  // Platform admins bypass tenant scoping
  if (ctx.user.role === 'admin') {
    return next({
      ctx: { ...ctx, user: ctx.user },
    });
  }

  // tRPC v11: prefer getRawInput() over obsolete rawInput
  const rawInput = await opts.getRawInput();
  const federationId = readFederationIdFromInput(rawInput);
  if (
    federationId !== undefined &&
    ctx.user.federationId !== federationId
  ) {
    throw new TRPCError({ code: "FORBIDDEN", message: NOT_FEDERATION_ADMIN_ERR_MSG });
  }

  return next({
    ctx: { ...ctx, user: ctx.user },
  });
});

/** Requires federation_admin or admin role. Federation admins: input.federationId must match ctx.user.federationId */
export const federationAdminProcedure = t.procedure.use(requireUser).use(federationAdminMiddleware);
