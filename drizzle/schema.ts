import { pgTable, serial, text, timestamp, varchar, boolean, json, integer, pgEnum } from "drizzle-orm/pg-core";

/**
 * Namibia Sports Management Platform - Database Schema
 * Table prefix: namibia_na_26_
 * Database: PostgreSQL (Supabase)
 */

// ===== ENUMS =====
export const userRoleEnum = pgEnum("user_role", ["user", "admin", "federation_admin", "club_manager"]);
// Match the actual database enum name and values
export const federationCategoryEnum = pgEnum("federation_category", ["ministry", "commission", "umbrella", "federation"]);
export const genderEnum = pgEnum("gender", ["male", "female", "other"]);
export const eventTypeEnum = pgEnum("event_type", ["competition", "tournament", "training", "workshop", "meeting", "other"]);
export const mediaTypeEnum = pgEnum("media_type", ["image", "video", "document"]);
export const entityTypeEnum = pgEnum("entity_type", ["federation", "club", "event", "athlete", "venue", "coach"]);
export const programTypeEnum = pgEnum("program_type", ["talent_identification", "training", "development", "elite"]);

// ===== USERS & AUTHENTICATION =====
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("open_id", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("login_method", { length: 64 }),
  role: userRoleEnum("role").default("user").notNull(),
  federationId: integer("federation_id"), // Link to federation for federation_admin
  clubId: integer("club_id"), // Link to club for club_manager
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  lastSignedIn: timestamp("last_signed_in").defaultNow().notNull(),
});

// ===== SPORTS FEDERATIONS =====
// Schema matches actual Supabase database structure
export const federations = pgTable("namibia_na_26_federations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  abbreviation: varchar("abbreviation", { length: 50 }),
  type: federationCategoryEnum("type").default("federation").notNull(),
  description: text("description"),
  
  // Leadership
  president: text("president"),
  secretaryGeneral: text("secretaryGeneral"),
  
  // Contact Information
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 50 }),
  website: text("website"),
  
  // Social Media
  facebook: text("facebook"),
  instagram: text("instagram"),
  twitter: text("twitter"),
  youtube: text("youtube"),
  
  // Images
  logo: text("logo"),
  backgroundImage: text("backgroundImage"),
  
  // Timestamps (camelCase to match DB)
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

// ===== CLUBS/TEAMS =====
export const clubs = pgTable("namibia_na_26_clubs", {
  id: serial("id").primaryKey(),
  federationId: integer("federation_id").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  logoUrl: text("logo_url"),
  
  // Location
  location: varchar("location", { length: 255 }),
  region: varchar("region", { length: 100 }), // One of 14 Namibian regions
  
  // Contact
  contactEmail: varchar("contact_email", { length: 320 }),
  contactPhone: varchar("contact_phone", { length: 50 }),
  website: text("website"),
  
  // Metadata
  establishedYear: integer("established_year"),
  memberCount: integer("member_count"),
  achievements: text("achievements"),
  facilities: text("facilities"),
  isActive: boolean("is_active").default(true).notNull(),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ===== SCHOOLS =====
export const schools = pgTable("namibia_na_26_schools", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  location: varchar("location", { length: 255 }),
  region: varchar("region", { length: 100 }),
  
  contactEmail: varchar("contact_email", { length: 320 }),
  contactPhone: varchar("contact_phone", { length: 50 }),
  
  // Sports offered (JSON array of federation IDs)
  sportsOffered: json("sports_offered").$type<number[]>(),
  
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ===== ATHLETES =====
export const athletes = pgTable("namibia_na_26_athletes", {
  id: serial("id").primaryKey(),
  federationId: integer("federation_id").notNull(),
  clubId: integer("club_id"),
  
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  biography: text("biography"),
  profilePhotoUrl: text("profile_photo_url"),
  
  dateOfBirth: timestamp("date_of_birth"),
  gender: genderEnum("gender"),
  nationality: varchar("nationality", { length: 100 }).default("Namibian"),
  
  achievements: text("achievements"),
  currentRanking: varchar("current_ranking", { length: 255 }),
  
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ===== COACHES =====
export const coaches = pgTable("namibia_na_26_coaches", {
  id: serial("id").primaryKey(),
  federationId: integer("federation_id").notNull(),
  clubId: integer("club_id"),
  
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  biography: text("biography"),
  profilePhotoUrl: text("profile_photo_url"),
  
  certifications: text("certifications"),
  specialization: varchar("specialization", { length: 255 }),
  yearsOfExperience: integer("years_of_experience"),
  
  contactEmail: varchar("contact_email", { length: 320 }),
  contactPhone: varchar("contact_phone", { length: 50 }),
  
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ===== EVENTS/COMPETITIONS =====
export const events = pgTable("namibia_na_26_events", {
  id: serial("id").primaryKey(),
  federationId: integer("federation_id").notNull(),
  
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  eventType: eventTypeEnum("event_type").default("competition").notNull(),
  
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
  
  venue: varchar("venue", { length: 255 }),
  location: varchar("location", { length: 255 }),
  region: varchar("region", { length: 100 }),
  
  registrationDeadline: timestamp("registration_deadline"),
  registrationUrl: text("registration_url"),
  resultsUrl: text("results_url"),
  
  posterUrl: text("poster_url"),
  
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ===== VENUES/FACILITIES =====
export const venues = pgTable("namibia_na_26_venues", {
  id: serial("id").primaryKey(),
  
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  
  location: varchar("location", { length: 255 }),
  region: varchar("region", { length: 100 }),
  address: text("address"),
  
  capacity: integer("capacity"),
  sportsSupported: json("sports_supported").$type<number[]>(), // Array of federation IDs
  facilities: text("facilities"), // Description of facilities
  
  contactEmail: varchar("contact_email", { length: 320 }),
  contactPhone: varchar("contact_phone", { length: 50 }),
  bookingUrl: text("booking_url"),
  
  imageUrl: text("image_url"),
  
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ===== MEDIA =====
export const media = pgTable("namibia_na_26_media", {
  id: serial("id").primaryKey(),
  
  url: text("url").notNull(),
  type: mediaTypeEnum("type").default("image").notNull(),
  altText: varchar("alt_text", { length: 255 }),
  caption: text("caption"),
  
  // Polymorphic relationship
  entityType: entityTypeEnum("entity_type").notNull(),
  entityId: integer("entity_id").notNull(),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ===== HIGH PERFORMANCE SYSTEM =====
export const highPerformancePrograms = pgTable("namibia_na_26_hp_programs", {
  id: serial("id").primaryKey(),
  federationId: integer("federation_id").notNull(),
  
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  
  programType: programTypeEnum("program_type").notNull(),
  
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  
  participants: json("participants").$type<number[]>(), // Array of athlete IDs
  coaches: json("coaches").$type<number[]>(), // Array of coach IDs
  
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ===== TYPE EXPORTS =====
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export type Federation = typeof federations.$inferSelect;
export type InsertFederation = typeof federations.$inferInsert;

export type Club = typeof clubs.$inferSelect;
export type InsertClub = typeof clubs.$inferInsert;

export type School = typeof schools.$inferSelect;
export type InsertSchool = typeof schools.$inferInsert;

export type Athlete = typeof athletes.$inferSelect;
export type InsertAthlete = typeof athletes.$inferInsert;

export type Coach = typeof coaches.$inferSelect;
export type InsertCoach = typeof coaches.$inferInsert;

export type Event = typeof events.$inferSelect;
export type InsertEvent = typeof events.$inferInsert;

export type Venue = typeof venues.$inferSelect;
export type InsertVenue = typeof venues.$inferInsert;

export type Media = typeof media.$inferSelect;
export type InsertMedia = typeof media.$inferInsert;

export type HighPerformanceProgram = typeof highPerformancePrograms.$inferSelect;
export type InsertHighPerformanceProgram = typeof highPerformancePrograms.$inferInsert;
