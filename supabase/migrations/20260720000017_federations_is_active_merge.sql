-- Soft-deactivate merged duplicate federations for public API/UI.
-- WHY: Aquatics/Swimming and Weightlifting/Powerlifting were soft-merged via
-- description notes but still appeared in federations.list. Add is_active +
-- merged_into_slug so public list hides them while getBySlug can resolve old URLs.
-- Does NOT hard-delete rows. Does NOT touch logo/contact/website/social columns.
-- Applied remotely 2026-07-20 to rbibqjgsnrueubrvyqps.

ALTER TABLE sportsplatform_federations
  ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS merged_into_slug varchar(255);

CREATE INDEX IF NOT EXISTS idx_sportsplatform_federations_active
  ON sportsplatform_federations (is_active)
  WHERE is_active = true;

UPDATE sportsplatform_federations SET
  is_active = false,
  merged_into_slug = 'swimming-namibia',
  updated_at = now()
WHERE slug = 'namibia-aquatics';

UPDATE sportsplatform_federations SET
  is_active = false,
  merged_into_slug = 'powerlifting-namibia',
  updated_at = now()
WHERE slug = 'weightlifting-namibia';
