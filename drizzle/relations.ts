import { relations } from "drizzle-orm";
import {
  users,
  federations,
  clubs,
  athletes,
  coaches,
  events,
  venues,
  highPerformancePrograms,
  newsArticles,
  liveStreams,
  whatsappSubscriptions,
} from "./schema";

// Federations: has many clubs, events, athletes, coaches, news, streams, hp_programs, whatsapp
// Note: venues are shared across federations via events.venueId
export const federationsRelations = relations(federations, ({ many }) => ({
  clubs: many(clubs),
  events: many(events),
  athletes: many(athletes),
  coaches: many(coaches),
  newsArticles: many(newsArticles),
  liveStreams: many(liveStreams),
  highPerformancePrograms: many(highPerformancePrograms),
  whatsappSubscriptions: many(whatsappSubscriptions),
}));

// Clubs: belongs to federation, has many athletes
export const clubsRelations = relations(clubs, ({ one, many }) => ({
  federation: one(federations, {
    fields: [clubs.federationId],
    references: [federations.id],
  }),
  athletes: many(athletes),
}));

// Athletes: belongs to federation, belongs to club
export const athletesRelations = relations(athletes, ({ one }) => ({
  federation: one(federations, {
    fields: [athletes.federationId],
    references: [federations.id],
  }),
  club: one(clubs, {
    fields: [athletes.clubId],
    references: [clubs.id],
  }),
}));

// Coaches: belongs to federation, belongs to club
export const coachesRelations = relations(coaches, ({ one }) => ({
  federation: one(federations, {
    fields: [coaches.federationId],
    references: [federations.id],
  }),
  club: one(clubs, {
    fields: [coaches.clubId],
    references: [clubs.id],
  }),
}));

// Events: belongs to federation, belongs to venue
export const eventsRelations = relations(events, ({ one }) => ({
  federation: one(federations, {
    fields: [events.federationId],
    references: [federations.id],
  }),
  venue: one(venues, {
    fields: [events.venueId],
    references: [venues.id],
  }),
}));

// Venues: has many events (reverse of events.venue)
export const venuesRelations = relations(venues, ({ many }) => ({
  events: many(events),
}));

// Users: belongs to federation (via federationId)
export const usersRelations = relations(users, ({ one, many }) => ({
  federation: one(federations, {
    fields: [users.federationId],
    references: [federations.id],
  }),
  club: one(clubs, {
    fields: [users.clubId],
    references: [clubs.id],
  }),
  newsArticles: many(newsArticles),
  whatsappSubscriptions: many(whatsappSubscriptions),
}));

// NewsArticles: belongs to federation, belongs to author (user)
export const newsArticlesRelations = relations(newsArticles, ({ one }) => ({
  federation: one(federations, {
    fields: [newsArticles.federationId],
    references: [federations.id],
  }),
  author: one(users, {
    fields: [newsArticles.authorId],
    references: [users.id],
  }),
}));

// LiveStreams: belongs to federation
export const liveStreamsRelations = relations(liveStreams, ({ one }) => ({
  federation: one(federations, {
    fields: [liveStreams.federationId],
    references: [federations.id],
  }),
}));

// WhatsappSubscriptions: belongs to user, belongs to federation
export const whatsappSubscriptionsRelations = relations(
  whatsappSubscriptions,
  ({ one }) => ({
    user: one(users, {
      fields: [whatsappSubscriptions.userId],
      references: [users.id],
    }),
    federation: one(federations, {
      fields: [whatsappSubscriptions.federationId],
      references: [federations.id],
    }),
  })
);

// HighPerformancePrograms: belongs to federation
export const highPerformanceProgramsRelations = relations(
  highPerformancePrograms,
  ({ one }) => ({
    federation: one(federations, {
      fields: [highPerformancePrograms.federationId],
      references: [federations.id],
    }),
  })
);
