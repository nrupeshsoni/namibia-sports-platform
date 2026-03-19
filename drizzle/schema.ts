import { pgTable, serial, text, timestamp, varchar, boolean, json, integer, pgEnum } from "drizzle-orm/pg-core";

/**
 * Namibia Sports Management Platform - Database Schema
 * Table prefix: sportsplatform_
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
export const platformTypeEnum = pgEnum("platform_type", ["youtube", "facebook", "twitch", "other"]);

// ===== USERS & AUTHENTICATION =====
export const users = pgTable("sportsplatform_users", {
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
export const federations = pgTable("sportsplatform_federations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  abbreviation: varchar("abbreviation", { length: 50 }),
  type: federationCategoryEnum("type").default("federation").notNull(),
  description: text("description"),
  
  // Leadership
  president: text("president"),
  secretaryGeneral: text("secretary_general"),
  
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
  backgroundImage: text("background_image"),
  
  // Branding
  slug: varchar("slug", { length: 255 }).unique(),
  primaryColor: varchar("primary_color", { length: 50 }),
  secondaryColor: varchar("secondary_color", { length: 50 }),
  
  // Timestamps (snake_case to match sportsplatform_ DB)
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ===== CLUBS/TEAMS =====
export const clubs = pgTable("sportsplatform_clubs", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  logoUrl: text("logo_url"),
  federationId: integer("federation_id").notNull(),
  
  // Contact
  contactEmail: varchar("contact_email", { length: 320 }),
  contactPhone: varchar("contact_phone", { length: 50 }),
  website: text("website"),
  address: text("address"),
  
  // Location
  region: varchar("region", { length: 100 }), // One of 14 Namibian regions
  city: varchar("city", { length: 100 }),
  
  // Leadership
  presidentName: varchar("president_name", { length: 255 }),
  coachName: varchar("coach_name", { length: 255 }),
  
  // Metadata
  establishedYear: integer("established_year"),
  memberCount: integer("member_count"),
  isActive: boolean("is_active").default(true).notNull(),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ===== SCHOOLS =====
export const schools = pgTable("sportsplatform_schools", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  region: varchar("region", { length: 100 }),
  city: varchar("city", { length: 100 }),
  
  contactEmail: varchar("contact_email", { length: 320 }),
  contactPhone: varchar("contact_phone", { length: 50 }),
  
  // Sports offered as text array
  sportsOffered: text("sports_offered").array(),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ===== ATHLETES =====
export const athletes = pgTable("sportsplatform_athletes", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).unique(),
  dateOfBirth: timestamp("date_of_birth"),
  gender: genderEnum("gender"),

  photoUrl: text("photo_url"),
  
  federationId: integer("federation_id"),
  clubId: integer("club_id"),
  
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 50 }),
  
  nationality: varchar("nationality", { length: 100 }),
  achievements: text("achievements"),
  currentRanking: integer("current_ranking"),
  
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ===== COACHES =====
export const coaches = pgTable("sportsplatform_coaches", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name", { length: 255 }).notNull(),
  lastName: varchar("last_name", { length: 255 }).notNull(),
  photoUrl: text("photo_url"),
  
  federationId: integer("federation_id"),
  clubId: integer("club_id"),
  
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 50 }),
  
  certifications: text("certifications"),
  specialization: varchar("specialization", { length: 255 }),
  yearsExperience: integer("years_experience"),
  
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ===== EVENTS/COMPETITIONS =====
export const events = pgTable("sportsplatform_events", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  posterUrl: text("poster_url"),
  
  federationId: integer("federation_id"),
  venueId: integer("venue_id"),
  
  type: eventTypeEnum("type").default("competition").notNull(),
  
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date"),
  registrationDeadline: timestamp("registration_deadline"),
  
  location: varchar("location", { length: 255 }),
  region: varchar("region", { length: 100 }),
  
  maxParticipants: integer("max_participants"),
  currentParticipants: integer("current_participants").default(0),
  
  isPublished: boolean("is_published").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ===== VENUES/FACILITIES =====
export const venues = pgTable("sportsplatform_venues", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  description: text("description"),
  photoUrl: text("photo_url"),
  
  address: text("address"),
  city: varchar("city", { length: 100 }),
  region: varchar("region", { length: 100 }),
  
  contactEmail: varchar("contact_email", { length: 320 }),
  contactPhone: varchar("contact_phone", { length: 50 }),
  
  capacity: integer("capacity"),
  facilities: text("facilities").array(),
  
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ===== MEDIA =====
export const media = pgTable("sportsplatform_media", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }),
  fileUrl: text("file_url").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  
  type: mediaTypeEnum("type").default("image").notNull(),
  
  // Polymorphic relationship
  entityType: entityTypeEnum("entity_type").notNull(),
  entityId: integer("entity_id").notNull(),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ===== NEWS ARTICLES =====
export const newsArticles = pgTable("sportsplatform_news_articles", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  content: text("content"),
  summary: text("summary"),
  federationId: integer("federation_id"),
  authorId: integer("author_id"),
  category: varchar("category", { length: 100 }),
  tags: text("tags").array(),
  featuredImage: text("featured_image"),
  isPublished: boolean("is_published").default(false).notNull(),
  publishedAt: timestamp("published_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ===== LIVE STREAMS =====
export const liveStreams = pgTable("sportsplatform_live_streams", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  federationId: integer("federation_id"),
  platformType: platformTypeEnum("platform_type").default("youtube").notNull(),
  streamUrl: text("stream_url"),
  embedUrl: text("embed_url"),
  thumbnailUrl: text("thumbnail_url"),
  scheduledStart: timestamp("scheduled_start"),
  scheduledEnd: timestamp("scheduled_end"),
  isLive: boolean("is_live").default(false).notNull(),
  viewerCount: integer("viewer_count"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ===== WHATSAPP SUBSCRIPTIONS =====
export const whatsappSubscriptions = pgTable("sportsplatform_whatsapp_subscriptions", {
  id: serial("id").primaryKey(),
  phone: varchar("phone", { length: 50 }).notNull(),
  userId: integer("user_id"),
  federationId: integer("federation_id"),
  subscriptionTypes: text("subscription_types").array(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ===== HIGH PERFORMANCE SYSTEM =====
export const highPerformancePrograms = pgTable("sportsplatform_hp_programs", {
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

export type NewsArticle = typeof newsArticles.$inferSelect;
export type InsertNewsArticle = typeof newsArticles.$inferInsert;

export type LiveStream = typeof liveStreams.$inferSelect;
export type InsertLiveStream = typeof liveStreams.$inferInsert;

export type WhatsappSubscription = typeof whatsappSubscriptions.$inferSelect;
export type InsertWhatsappSubscription = typeof whatsappSubscriptions.$inferInsert;
