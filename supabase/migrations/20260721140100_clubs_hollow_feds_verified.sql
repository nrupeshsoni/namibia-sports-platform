-- Clubs for hollow / thin federations — verified names only (2026-07-21).
-- WHY: Cut hollow Clubs tabs where public sources name real clubs/gyms.
-- Contacts only when published on primary pages; otherwise name+city only.
-- Evidence: docs/research/hollow_federations_content_fill.md

-- Lions Basketball Club — KBA / Road to BAL (Wikipedia)
INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url, is_active
)
SELECT
  'Lions Basketball Club', 'lions-basketball-club', f.id,
  'Windhoek', 'Khomas', '/sports/basketball.jpg', true
FROM sportsplatform_federations f
WHERE f.slug = 'namibia-basketball'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'lions-basketball-club');

-- Hybrid Fitness Centre — MMAN / IMMAF national hub (hybridfitnesscentre.com)
INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url, website, is_active
)
SELECT
  'Hybrid Fitness Centre', 'hybrid-fitness-centre', f.id,
  'Windhoek', 'Khomas', '/sports/martial-arts-mma.jpg',
  'https://www.hybridfitnesscentre.com/', true
FROM sportsplatform_federations f
WHERE f.slug = 'mixed-martial-arts-namibia'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'hybrid-fitness-centre');

-- Combat Club Windhoek — Namibia Kickboxing Federation affiliate (The Namibian)
INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url, address, is_active
)
SELECT
  'Combat Club Windhoek', 'combat-club-windhoek', f.id,
  'Windhoek', 'Khomas', '/sports/kickboxing.jpg',
  'Behind Ferreira''s Nursery / Hyper Motor City, Windhoek', true
FROM sportsplatform_federations f
WHERE f.slug = 'namibia-kickboxing'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'combat-club-windhoek');

-- Karas Handball Club — IHF player profile club name
INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url, is_active
)
SELECT
  'Karas Handball Club', 'karas-handball-club', f.id,
  'Keetmanshoop', 'Karas', '/sports/handball.jpg', true
FROM sportsplatform_federations f
WHERE f.slug = 'namibia-handball'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'karas-handball-club');

-- Link Sakaria Shikongo → Karas when both exist
UPDATE sportsplatform_athletes a
SET club_id = c.id, updated_at = now()
FROM sportsplatform_clubs c
WHERE a.slug = 'sakaria-shikongo'
  AND c.slug = 'karas-handball-club'
  AND a.club_id IS NULL;

-- Link Lions BAL athletes → Lions club
UPDATE sportsplatform_athletes a
SET club_id = c.id, updated_at = now()
FROM sportsplatform_clubs c
WHERE c.slug = 'lions-basketball-club'
  AND a.federation_id = (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-basketball')
  AND a.club_id IS NULL
  AND a.slug IN ('petrus-iyambo', 'joe-banda', 'corbin-prinzonsky');

-- Link MMA athletes → Hybrid Fitness
UPDATE sportsplatform_athletes a
SET club_id = c.id, updated_at = now()
FROM sportsplatform_clubs c
WHERE c.slug = 'hybrid-fitness-centre'
  AND a.slug IN ('damian-muller', 'veja-hinda')
  AND a.club_id IS NULL;
