import { TRPCError, type TRPC_ERROR_CODE_KEY } from "@trpc/server";

/**
 * Whether the Worker/runtime should expose internal error detail to clients.
 * Production always hides; tests/dev may surface the message for debugging.
 */
export function exposeInternalErrors(): boolean {
  return process.env.NODE_ENV !== "production";
}

/**
 * Log the real error server-side and return a TRPCError safe for clients.
 * In production the client always gets `publicMessage`.
 */
export function toClientSafeTrpcError(
  logLabel: string,
  e: unknown,
  publicMessage: string,
  code: TRPC_ERROR_CODE_KEY = "INTERNAL_SERVER_ERROR"
): TRPCError {
  const detail = e instanceof Error ? e.message : publicMessage;
  console.error(`[${logLabel}]`, detail);
  return new TRPCError({
    code,
    message: exposeInternalErrors() ? detail : publicMessage,
  });
}
