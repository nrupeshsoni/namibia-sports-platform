-- Clubs contacts pass 2 — verified websites / socials only (2026-07-20).
-- WHY: Raise contact coverage above pass-1 8/62; prioritize NFA / NRU / Cricket.
-- Rule: Never fabricate emails/phones. Transfermarkt domains rejected when dead
-- or wrong-country. Facebook/Instagram used only when Wikipedia or club-branded
-- pages corroborate. Logos untouched.
-- Evidence: docs/research/clubs_enrichment_batch.md (Pass 2)

-- ===== NFA — Wikipedia / NFA-corroborated official socials =====

UPDATE sportsplatform_clubs SET
  website = 'https://www.facebook.com/africanstarssoccerclub/',
  updated_at = now()
WHERE slug = 'african-stars-fc'
  AND (website IS NULL OR website = '');

UPDATE sportsplatform_clubs SET
  website = 'https://www.facebook.com/orlandopiratesnam',
  updated_at = now()
WHERE slug = 'orlando-pirates-windhoek'
  AND (website IS NULL OR website = '');

UPDATE sportsplatform_clubs SET
  website = 'https://www.facebook.com/FCYOUNGAFRICAN/',
  updated_at = now()
WHERE slug = 'young-african-fc'
  AND (website IS NULL OR website = '');

UPDATE sportsplatform_clubs SET
  website = 'https://www.facebook.com/ingweinyama',
  updated_at = now()
WHERE slug = 'tigers-fc'
  AND (website IS NULL OR website = '');

-- Wikipedia infobox Website field
UPDATE sportsplatform_clubs SET
  website = 'https://www.facebook.com/ChulaChulaFc/',
  updated_at = now()
WHERE slug = 'eeshoke-chula-chula-fc'
  AND (website IS NULL OR website = '');

-- Civics FC rebranded to Bucks Buccaneers (NFA + Wikipedia); same DB row
UPDATE sportsplatform_clubs SET
  website = 'https://www.facebook.com/p/Bucks-Buccaneers-61572201447185/',
  updated_at = now()
WHERE slug = 'civics-fc'
  AND (website IS NULL OR website = '');

UPDATE sportsplatform_clubs SET
  website = 'https://www.facebook.com/ElevenArrowsFc',
  updated_at = now()
WHERE slug = 'eleven-arrows-fc'
  AND (website IS NULL OR website = '');

UPDATE sportsplatform_clubs SET
  website = 'https://www.facebook.com/bluewatersfc',
  updated_at = now()
WHERE slug = 'blue-waters-fc'
  AND (website IS NULL OR website = '');

UPDATE sportsplatform_clubs SET
  website = 'https://www.facebook.com/mightygunnersfc',
  updated_at = now()
WHERE slug = 'mighty-gunners-fc'
  AND (website IS NULL OR website = '');

-- Ongos SC — active Instagram (club-branded #fcongos); no public email/phone
UPDATE sportsplatform_clubs SET
  website = 'https://www.instagram.com/f.c_ongos/',
  updated_at = now()
WHERE slug = 'fc-ongos'
  AND (website IS NULL OR website = '');

-- ===== NRU — United Sport Club + Western Suburbs =====

UPDATE sportsplatform_clubs SET
  website = 'https://www.facebook.com/p/Trustco-United-Rugby-Club-100057645872875/',
  updated_at = now()
WHERE slug = 'united-rugby'
  AND (website IS NULL OR website = '');

-- Same multi-code United Sport Club (cricket section listed by Cricket Namibia)
UPDATE sportsplatform_clubs SET
  website = 'https://www.facebook.com/p/Trustco-United-Rugby-Club-100057645872875/',
  updated_at = now()
WHERE slug = 'united-cricket'
  AND (website IS NULL OR website = '');

-- Facebook About references Windhoek, Namibia (NRU Premier League club)
UPDATE sportsplatform_clubs SET
  website = 'https://www.facebook.com/westernsuburbsrc',
  updated_at = now()
WHERE slug = 'western-suburbs-rugby'
  AND (website IS NULL OR website = '');

-- ===== Cricket Namibia — WHS Old Boys club page on CN site =====

UPDATE sportsplatform_clubs SET
  website = 'https://cricketnamibia.com/windhoek-high-school-old-boys/',
  updated_at = now()
WHERE slug = 'old-boys-cricket'
  AND (website IS NULL OR website = '');
