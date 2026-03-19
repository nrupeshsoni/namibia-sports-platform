import { z } from "zod";
import { getDb } from "../db";
import {
  federations,
  events,
  newsArticles,
  clubs,
  athletes,
} from "../../drizzle/schema";
import { ilike, or, and, eq } from "drizzle-orm";
import { publicProcedure, router } from "../_core/trpc";

const LIMIT_PER_TYPE = 5;

/**
 * Global search across federations, events, news, clubs, and athletes.
 * Uses ilike for case-insensitive matching on name/title/slug.
 */
export const searchRouter = router({
  global: publicProcedure
    .input(z.object({ query: z.string().min(1).max(200) }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        return {
          federations: [],
          events: [],
          news: [],
          clubs: [],
          athletes: [],
        };
      }

      const pattern = `%${input.query}%`;

      const [fedRows, eventRows, newsRows, clubRows, athleteRows] =
        await Promise.all([
          db
            .select({
              id: federations.id,
              name: federations.name,
              slug: federations.slug,
            })
            .from(federations)
            .where(
              or(
                ilike(federations.name, pattern),
                ilike(federations.slug, pattern)
              )
            )
            .limit(LIMIT_PER_TYPE),

          db
            .select({ id: events.id, name: events.name, slug: events.slug })
            .from(events)
            .where(ilike(events.name, pattern))
            .limit(LIMIT_PER_TYPE),

          db
            .select({
              id: newsArticles.id,
              title: newsArticles.title,
              slug: newsArticles.slug,
            })
            .from(newsArticles)
            .where(
              and(eq(newsArticles.isPublished, true), ilike(newsArticles.title, pattern))
            )
            .limit(LIMIT_PER_TYPE),

          db
            .select({
              id: clubs.id,
              name: clubs.name,
              slug: clubs.slug,
              federationId: clubs.federationId,
              federationSlug: federations.slug,
            })
            .from(clubs)
            .innerJoin(federations, eq(clubs.federationId, federations.id))
            .where(ilike(clubs.name, pattern))
            .limit(LIMIT_PER_TYPE),

          db
            .select({
              id: athletes.id,
              firstName: athletes.firstName,
              lastName: athletes.lastName,
              federationId: athletes.federationId,
              federationSlug: federations.slug,
            })
            .from(athletes)
            .leftJoin(federations, eq(athletes.federationId, federations.id))
            .where(
              or(
                ilike(athletes.firstName, pattern),
                ilike(athletes.lastName, pattern)
              )
            )
            .limit(LIMIT_PER_TYPE),
        ]);

      return {
        federations: fedRows,
        events: eventRows,
        news: newsRows,
        clubs: clubRows.map((r) => ({
          id: r.id,
          name: r.name,
          slug: r.slug,
          federationSlug: r.federationSlug ?? null,
        })),
        athletes: athleteRows.map((r) => ({
          id: r.id,
          firstName: r.firstName,
          lastName: r.lastName,
          federationSlug: r.federationSlug ?? null,
        })),
      };
    }),
});
