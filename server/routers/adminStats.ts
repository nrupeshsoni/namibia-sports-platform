import { count } from "drizzle-orm";
import {
  athletes,
  clubs,
  events,
  federations,
} from "../../drizzle/schema";
import { getDb } from "../db";
import { adminProcedure, router } from "../_core/trpc";

async function tableCount(
  db: NonNullable<Awaited<ReturnType<typeof getDb>>>,
  table: typeof federations | typeof events | typeof clubs | typeof athletes
): Promise<number> {
  const [row] = await db.select({ value: count() }).from(table);
  return Number(row?.value ?? 0);
}

/**
 * Platform-admin dashboard totals (uncapped — not derived from list limit 50/200).
 */
export const adminStatsRouter = router({
  counts: adminProcedure.query(async () => {
    const db = await getDb();
    if (!db) {
      return { federations: 0, events: 0, clubs: 0, athletes: 0 };
    }

    const [federationsCount, eventsCount, clubsCount, athletesCount] =
      await Promise.all([
        tableCount(db, federations),
        tableCount(db, events),
        tableCount(db, clubs),
        tableCount(db, athletes),
      ]);

    return {
      federations: federationsCount,
      events: eventsCount,
      clubs: clubsCount,
      athletes: athletesCount,
    };
  }),
});
