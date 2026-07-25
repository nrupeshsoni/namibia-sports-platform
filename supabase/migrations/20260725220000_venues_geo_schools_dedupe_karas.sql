-- Venues geo columns, Karas region normalize, schools is_active + soft dedupe
-- WHY: map pins need lat/lng; DB stores legacy Kharas spellings; schools need soft-delete dedupe.

ALTER TABLE sportsplatform_venues
  ADD COLUMN IF NOT EXISTS latitude double precision,
  ADD COLUMN IF NOT EXISTS longitude double precision;

ALTER TABLE sportsplatform_schools
  ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true;

UPDATE sportsplatform_venues SET region = 'Karas'
WHERE region ILIKE 'kharas' OR region ILIKE '%karas' OR region ILIKE '!karas' OR region ILIKE '//%karas';

UPDATE sportsplatform_clubs SET region = 'Karas'
WHERE region ILIKE 'kharas' OR region ILIKE '!karas' OR region ILIKE '//%karas';

UPDATE sportsplatform_events SET region = 'Karas'
WHERE region ILIKE 'kharas' OR region ILIKE '!karas' OR region ILIKE '//%karas';

UPDATE sportsplatform_schools SET region = 'Karas'
WHERE region ILIKE 'kharas' OR region ILIKE '!karas' OR region ILIKE '//%karas';

WITH ranked AS (
  SELECT id,
    ROW_NUMBER() OVER (
      PARTITION BY lower(trim(name)), coalesce(lower(trim(region)), '')
      ORDER BY id
    ) AS rn
  FROM sportsplatform_schools
  WHERE is_active = true
)
UPDATE sportsplatform_schools s
SET is_active = false
FROM ranked r
WHERE s.id = r.id AND r.rn > 1;
