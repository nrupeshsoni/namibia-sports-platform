import { TRPCError } from "@trpc/server";
import { NOT_FEDERATION_ADMIN_ERR_MSG } from "@shared/const";

type ScopedUser = {
  role: string;
  federationId: number | null;
};

/**
 * Platform admins bypass. Federation admins must own the resource's federationId.
 */
export function assertSameFederation(
  user: ScopedUser,
  resourceFederationId: number | null | undefined
): void {
  if (user.role === "admin") return;
  if (
    resourceFederationId == null ||
    user.federationId !== resourceFederationId
  ) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: NOT_FEDERATION_ADMIN_ERR_MSG,
    });
  }
}

/**
 * Whether the caller may request unpublished/draft rows for a list query.
 * Public and mismatched federation_admin callers always get published-only.
 */
export function canIncludeUnpublished(
  user: ScopedUser | null | undefined,
  federationId: number | undefined
): boolean {
  if (!user) return false;
  if (user.role === "admin") return true;
  if (
    user.role === "federation_admin" &&
    federationId != null &&
    user.federationId === federationId
  ) {
    return true;
  }
  return false;
}

/**
 * Whether the caller may request inactive rows for a list query.
 * Same staff gate as unpublished — federation_admin must pass matching federationId.
 */
export function canIncludeInactive(
  user: ScopedUser | null | undefined,
  federationId: number | undefined
): boolean {
  return canIncludeUnpublished(user, federationId);
}

/**
 * Whether staff may view a single unpublished/inactive row for a resource's federation.
 */
export function canViewNonPublic(
  user: ScopedUser | null | undefined,
  resourceFederationId: number | null | undefined
): boolean {
  if (!user) return false;
  if (user.role === "admin") return true;
  if (
    user.role === "federation_admin" &&
    resourceFederationId != null &&
    user.federationId === resourceFederationId
  ) {
    return true;
  }
  return false;
}
