import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import {
  athletes,
  clubs,
  coaches,
  events,
  liveStreams,
  newsArticles,
} from "../../drizzle/schema";
import { getDb } from "../db";
import { assertSameFederation } from "./federationScope";

/** Entity types that can own a federation-scoped storage/media path. */
export type ScopedEntityType =
  | "federation"
  | "club"
  | "event"
  | "athlete"
  | "coach"
  | "news"
  | "stream"
  | "venue";

type ScopedUser = {
  role: string;
  federationId: number | null;
};

/**
 * Resolve owning federation for an entity row.
 * - `undefined` — row missing (or DB unavailable)
 * - `null` — platform-scoped (venue); federation_admin must not write
 * - `number` — owning federation id
 */
export async function resolveEntityFederationId(
  entityType: ScopedEntityType,
  entityId: number
): Promise<number | null | undefined> {
  const db = await getDb();
  if (!db) return undefined;

  if (entityType === "federation") return entityId;
  if (entityType === "venue") return null;

  if (entityType === "club") {
    const [row] = await db
      .select({ federationId: clubs.federationId })
      .from(clubs)
      .where(eq(clubs.id, entityId))
      .limit(1);
    return row?.federationId;
  }
  if (entityType === "event") {
    const [row] = await db
      .select({ federationId: events.federationId })
      .from(events)
      .where(eq(events.id, entityId))
      .limit(1);
    return row?.federationId;
  }
  if (entityType === "athlete") {
    const [row] = await db
      .select({ federationId: athletes.federationId })
      .from(athletes)
      .where(eq(athletes.id, entityId))
      .limit(1);
    return row?.federationId;
  }
  if (entityType === "coach") {
    const [row] = await db
      .select({ federationId: coaches.federationId })
      .from(coaches)
      .where(eq(coaches.id, entityId))
      .limit(1);
    return row?.federationId;
  }
  if (entityType === "news") {
    const [row] = await db
      .select({ federationId: newsArticles.federationId })
      .from(newsArticles)
      .where(eq(newsArticles.id, entityId))
      .limit(1);
    return row?.federationId;
  }
  const [row] = await db
    .select({ federationId: liveStreams.federationId })
    .from(liveStreams)
    .where(eq(liveStreams.id, entityId))
    .limit(1);
  return row?.federationId;
}

/**
 * After resolving entity ownership: reject missing rows, platform-only venues
 * for fed admins, and claimed federationId that does not match the row
 * (closes upload IDOR where input.federationId is self but entityId is foreign).
 */
export function assertEntityBelongsToClaimedFederation(
  user: ScopedUser,
  claimedFederationId: number,
  ownedFederationId: number | null | undefined,
  notFoundMessage = "Entity not found"
): void {
  if (ownedFederationId === undefined) {
    throw new TRPCError({ code: "NOT_FOUND", message: notFoundMessage });
  }
  assertSameFederation(user, ownedFederationId);
  if (ownedFederationId !== null && ownedFederationId !== claimedFederationId) {
    throw new TRPCError({ code: "NOT_FOUND", message: notFoundMessage });
  }
}

/** Coerce upload entityId to a numeric row id, or null for draft string keys. */
export function numericEntityId(entityId: number | string): number | null {
  if (typeof entityId === "number") {
    return Number.isInteger(entityId) && entityId >= 0 ? entityId : null;
  }
  if (/^\d+$/.test(entityId)) return Number(entityId);
  return null;
}
