-- Namibia Sports Platform - Clean Migration Script
-- Safe to run multiple times (idempotent)
-- Run this in Supabase SQL Editor

-- Drop existing types if they exist
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS federation_category CASCADE;
DROP TYPE IF EXISTS event_category CASCADE;
DROP TYPE IF EXISTS athlete_level CASCADE;

-- Create enum types
CREATE TYPE user_role AS ENUM ('user', 'admin');
CREATE TYPE federation_category AS ENUM ('ministry', 'commission', 'umbrella', 'federation');
CREATE TYPE event_category AS ENUM ('tournament', 'league', 'training', 'meeting', 'other');
CREATE TYPE athlete_level AS ENUM ('national', 'regional', 'youth', 'club');

-- Create tables (with IF NOT EXISTS)
CREATE TABLE IF NOT EXISTS namibia_na_26_users (
  id SERIAL PRIMARY KEY,
  "openId" VARCHAR(64) NOT NULL UNIQUE,
  name TEXT,
  email VARCHAR(320),
  "loginMethod" VARCHAR(64),
  role user_role DEFAULT 'user' NOT NULL,
  "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL,
  "lastSignedIn" TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS namibia_na_26_federations (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  abbreviation VARCHAR(20),
  category federation_category DEFAULT 'federation' NOT NULL,
  description TEXT,
  president TEXT,
  "secretaryGeneral" TEXT,
  email VARCHAR(320),
  phone VARCHAR(50),
  website TEXT,
  facebook TEXT,
  instagram TEXT,
  twitter TEXT,
  youtube TEXT,
  logo TEXT,
  "backgroundImage" TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS namibia_na_26_clubs (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  "federationId" INTEGER NOT NULL REFERENCES namibia_na_26_federations(id) ON DELETE CASCADE,
  region TEXT,
  city TEXT,
  description TEXT,
  "contactPerson" TEXT,
  email VARCHAR(320),
  phone VARCHAR(50),
  "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS namibia_na_26_events (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  "federationId" INTEGER NOT NULL REFERENCES namibia_na_26_federations(id) ON DELETE CASCADE,
  category event_category DEFAULT 'other' NOT NULL,
  "startDate" TIMESTAMP NOT NULL,
  "endDate" TIMESTAMP,
  venue TEXT,
  location TEXT,
  "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS namibia_na_26_athletes (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  "federationId" INTEGER NOT NULL REFERENCES namibia_na_26_federations(id) ON DELETE CASCADE,
  "dateOfBirth" DATE,
  gender VARCHAR(20),
  level athlete_level DEFAULT 'club' NOT NULL,
  achievements TEXT,
  email VARCHAR(320),
  phone VARCHAR(50),
  "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS namibia_na_26_coaches (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  "federationId" INTEGER NOT NULL REFERENCES namibia_na_26_federations(id) ON DELETE CASCADE,
  specialization TEXT,
  certifications TEXT,
  email VARCHAR(320),
  phone VARCHAR(50),
  "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS namibia_na_26_venues (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT,
  address TEXT,
  city TEXT,
  capacity INTEGER,
  facilities TEXT,
  "contactPerson" TEXT,
  email VARCHAR(320),
  phone VARCHAR(50),
  "createdAt" TIMESTAMP DEFAULT NOW() NOT NULL,
  "updatedAt" TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_clubs_federation ON namibia_na_26_clubs("federationId");
CREATE INDEX IF NOT EXISTS idx_events_federation ON namibia_na_26_events("federationId");
CREATE INDEX IF NOT EXISTS idx_athletes_federation ON namibia_na_26_athletes("federationId");
CREATE INDEX IF NOT EXISTS idx_coaches_federation ON namibia_na_26_coaches("federationId");
CREATE INDEX IF NOT EXISTS idx_events_start_date ON namibia_na_26_events("startDate");

-- Success message
SELECT 'Database schema created successfully!' AS status;
