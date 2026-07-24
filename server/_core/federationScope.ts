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
 * After loading a row by id: assert the caller owns the stored federationId and
 * that the claimed input federationId matches (avoids silent no-op on mismatch).
 * Call {@link assertSameFederation} on the input first for early cross-tenant reject.
 */
export function assertClaimMatchesOwnedRow(
  user: ScopedUser,
  claimedFederationId: number,
  existingFederationId: number | null | undefined,
  notFoundMessage: string
): void {
  assertSameFederation(user, existingFederationId);
  if (existingFederationId !== claimedFederationId) {
    throw new TRPCError({ code: "NOT_FOUND", message: notFoundMessage });
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

/**
 * Whether the caller may receive contact/DOB PII for a resource.
 * Same tenant gate as {@link canViewNonPublic} — federation_admin cannot
 * pull another federation's athlete/coach emails via `includePii`.
 */
export function canIncludePii(
  user: ScopedUser | null | undefined,
  resourceFederationId: number | null | undefined
): boolean {
  return canViewNonPublic(user, resourceFederationId);
}

/**
 * Whether a list query may return PII rows.
 * Admin: always. Federation admin: only when `federationId` matches their tenant.
 */
export function canIncludePiiInList(
  user: ScopedUser | null | undefined,
  federationId: number | undefined
): boolean {
  return canIncludeUnpublished(user, federationId);
}
