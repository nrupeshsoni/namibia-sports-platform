-- Add slug column to sportsplatform_athletes for public profile URLs
-- Derivation: firstname-lastname-id (e.g. "christine-mboma-1")
-- Run via Supabase SQL Editor or: supabase db push

ALTER TABLE sportsplatform_athletes
ADD COLUMN IF NOT EXISTS slug VARCHAR(255);

-- Backfill: generate slug from first_name, last_name, id
UPDATE sportsplatform_athletes
SET slug = LOWER(
  REGEXP_REPLACE(
    REGEXP_REPLACE(
      TRIM(CONCAT(first_name, '-', last_name, '-', id)),
      '\s+', '-', 'g'
    ),
    '[^a-z0-9\-]', '', 'g'
  )
)
WHERE slug IS NULL OR slug = '';

-- Add unique constraint if not exists (handles potential duplicates by appending id)
CREATE UNIQUE INDEX IF NOT EXISTS sportsplatform_athletes_slug_key ON sportsplatform_athletes(slug);
