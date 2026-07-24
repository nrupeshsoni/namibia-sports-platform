/**
 * Federation scoping + prompt builders for Content Sync (keeps router lean).
 */

import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { federations } from "../../drizzle/schema";
import type { ContentSuggestion } from "./contentSyncAi";

export type FedRow = {
  id: number;
  name: string;
  slug: string | null;
  website: string | null;
};

export async function loadActiveFederations(): Promise<FedRow[]> {
  const db = await getDb();
  if (!db) {
    throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });
  }
  return db
    .select({
      id: federations.id,
      name: federations.name,
      slug: federations.slug,
      website: federations.website,
    })
    .from(federations)
    .where(eq(federations.isActive, true));
}

export function matchFederation(
  feds: FedRow[],
  federationId: number | null,
  hint: string | null | undefined
): number | null {
  if (federationId != null) return federationId;
  if (!hint) return null;
  const h = hint.toLowerCase().trim();
  const exact = feds.find(
    (f) => f.name.toLowerCase() === h || (f.slug ?? "").toLowerCase() === h
  );
  if (exact) return exact.id;
  const partial = feds.find(
    (f) => f.name.toLowerCase().includes(h) || h.includes(f.name.toLowerCase().slice(0, 12))
  );
  return partial?.id ?? null;
}

export function attachFederationIds(
  suggestions: ContentSuggestion[],
  feds: FedRow[],
  federationId: number | null
) {
  return suggestions.map((s) => ({
    ...s,
    federationId: matchFederation(feds, federationId, s.federationHint),
  }));
}

export function buildScopePrompt(
  kind: "news" | "events",
  feds: FedRow[],
  federationId: number | null
): string {
  const year = new Date().getFullYear();
  if (federationId != null) {
    const fed = feds.find((f) => f.id === federationId);
    const name = fed?.name ?? `federation #${federationId}`;
    const site = fed?.website ? ` Official site: ${fed.website}.` : "";
    if (kind === "news") {
      return `Suggest up to 6 news TOPIC leads for ${name} (Namibia).${site}
Focus on angles an editor could verify (fixtures, appointments, camps, policy).
Today's year context: ${year}. federationHint should be "${name}".`;
    }
    return `Suggest up to 6 EVENT / schedule CANDIDATES for ${name} (Namibia).${site}
Include tentative dates as ISO YYYY-MM-DD when plausible, else null.
These are research leads only — not confirmed fixtures. Year context: ${year}.
federationHint should be "${name}".`;
  }

  const sample = feds
    .slice(0, 40)
    .map((f) => f.name)
    .join("; ");
  if (kind === "news") {
    return `Suggest up to 8 news TOPIC leads across Namibian sports federations.
Prefer covering different federations. Set federationHint to the closest name from:
${sample}
Year context: ${year}.`;
  }
  return `Suggest up to 8 EVENT / schedule CANDIDATES across Namibian sports federations.
Prefer covering different federations. Set federationHint to the closest name from:
${sample}
Dates as ISO YYYY-MM-DD when plausible, else null. Year context: ${year}.`;
}

export function toSlug(s: string): string {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 180);
}

export function uniqueSlug(base: string): string {
  const suffix = Date.now().toString(36);
  return `${toSlug(base) || "draft"}-${suffix}`;
}

export function parseOptionalDate(value: string | null | undefined): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}
