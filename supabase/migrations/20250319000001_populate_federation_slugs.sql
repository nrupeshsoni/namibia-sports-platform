-- Populate federation slugs where NULL
-- Derivation: "Karate Namibia" → "karate-namibia" (lowercase, spaces to hyphens, alphanumeric + hyphen only)
-- Run via Supabase SQL Editor or: supabase db push
-- Note: If duplicate slugs occur, the last one wins; manual resolution may be needed for edge cases.

UPDATE sportsplatform_federations
SET slug = LOWER(REGEXP_REPLACE(REGEXP_REPLACE(name, '\s+', '-', 'g'), '[^a-zA-Z0-9\-]', '', 'g'))
WHERE slug IS NULL OR slug = '';
