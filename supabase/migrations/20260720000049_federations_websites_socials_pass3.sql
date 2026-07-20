-- WHY: Easy verified website/social fills still missing on active thin federations.
-- Only null-guarded updates; no invented contacts. Evidence in
-- docs/research/websites_socials_enrichment_batch.md (Pass 3).
-- Applied 2026-07-20.

-- Jukskei: official site (HTTP 200; email domain pro@jukskei-nam.com already in DB; crest sourced from same host)
UPDATE sportsplatform_federations
SET
  website = 'https://jukskei-nam.com/',
  updated_at = NOW()
WHERE slug = 'namibia-jukskei'
  AND (website IS NULL OR website = '');

-- Judo: official Facebook (HTTP 200; matches NJF naming used in New Era coverage)
UPDATE sportsplatform_federations
SET
  facebook = 'https://www.facebook.com/NamibiaJudoFederation',
  updated_at = NOW()
WHERE slug = 'judo-namibia'
  AND (facebook IS NULL OR facebook = '');

-- Wrestling: official Facebook (HTTP 200; NWF crest already sourced from Graph; The Namibian cites NWF page)
UPDATE sportsplatform_federations
SET
  facebook = 'https://www.facebook.com/NamibiaWrestlingFederation',
  updated_at = NOW()
WHERE slug = 'wrestling-namibia'
  AND (facebook IS NULL OR facebook = '');

-- Darts: Facebook handle matching namibiadarts.com federation (HTTP 200)
UPDATE sportsplatform_federations
SET
  facebook = 'https://www.facebook.com/namibiadarts',
  updated_at = NOW()
WHERE slug = 'namibia-darts'
  AND (facebook IS NULL OR facebook = '');
