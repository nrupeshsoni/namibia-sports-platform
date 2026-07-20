-- WHY: Beta readiness — sportsplatform_media still only 24 flagship rows.
-- Expand to ≥50 using verified local assets under /sports/, /logos/, /venues/,
-- /athletes/ for additional federations (netball, hockey, basketball, boxing,
-- volleyball, tennis, aquatics, judo, handball, beach volleyball) plus a few
-- venue/athlete gallery rows. Idempotent via (file_url, entity_type, entity_id).
-- Schools: no per-school verified sport notes found in repo research beyond
-- existing sports_offered arrays — left unchanged (do not invent).
-- Evidence: docs/research/media_enrichment_batch.md (Pass 2)
-- Applied 2026-07-20. Does NOT modify RLS.

-- ===== Namibia Netball (slug: namibia-netball) — 3 =====
INSERT INTO sportsplatform_media (title, file_url, thumbnail_url, type, entity_type, entity_id)
SELECT 'Netball Namibia crest', '/logos/Netball_Namibia_logo.png',
       '/logos/Netball_Namibia_logo.png', 'image', 'federation',
       (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-netball')
WHERE NOT EXISTS (
  SELECT 1 FROM sportsplatform_media
  WHERE file_url = '/logos/Netball_Namibia_logo.png'
    AND entity_type = 'federation'
    AND entity_id = (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-netball')
);

INSERT INTO sportsplatform_media (title, file_url, thumbnail_url, type, entity_type, entity_id)
SELECT 'Netball — court action', '/sports/netball.jpg', '/sports/netball.jpg',
       'image', 'federation',
       (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-netball')
WHERE NOT EXISTS (
  SELECT 1 FROM sportsplatform_media
  WHERE file_url = '/sports/netball.jpg'
    AND entity_type = 'federation'
    AND entity_id = (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-netball')
);

INSERT INTO sportsplatform_media (title, file_url, thumbnail_url, type, entity_type, entity_id)
SELECT 'Netball — athlete portrait stock', '/athletes/netball.jpg', '/athletes/netball.jpg',
       'image', 'federation',
       (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-netball')
WHERE NOT EXISTS (
  SELECT 1 FROM sportsplatform_media
  WHERE file_url = '/athletes/netball.jpg'
    AND entity_type = 'federation'
    AND entity_id = (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-netball')
);

-- ===== Namibia Hockey Union (slug: nhu) — 4 =====
INSERT INTO sportsplatform_media (title, file_url, thumbnail_url, type, entity_type, entity_id)
SELECT 'Namibia Hockey Union crest', '/logos/Namibia_Hockey_Union_logo.png',
       '/logos/Namibia_Hockey_Union_logo.png', 'image', 'federation',
       (SELECT id FROM sportsplatform_federations WHERE slug = 'nhu')
WHERE NOT EXISTS (
  SELECT 1 FROM sportsplatform_media
  WHERE file_url = '/logos/Namibia_Hockey_Union_logo.png'
    AND entity_type = 'federation'
    AND entity_id = (SELECT id FROM sportsplatform_federations WHERE slug = 'nhu')
);

INSERT INTO sportsplatform_media (title, file_url, thumbnail_url, type, entity_type, entity_id)
SELECT 'Field hockey — match play', '/sports/hockey.jpg', '/sports/hockey.jpg',
       'image', 'federation',
       (SELECT id FROM sportsplatform_federations WHERE slug = 'nhu')
WHERE NOT EXISTS (
  SELECT 1 FROM sportsplatform_media
  WHERE file_url = '/sports/hockey.jpg'
    AND entity_type = 'federation'
    AND entity_id = (SELECT id FROM sportsplatform_federations WHERE slug = 'nhu')
);

INSERT INTO sportsplatform_media (title, file_url, thumbnail_url, type, entity_type, entity_id)
SELECT 'Namibia hockey — national colours', '/sports/namibia-hockey.jpg', '/sports/namibia-hockey.jpg',
       'image', 'federation',
       (SELECT id FROM sportsplatform_federations WHERE slug = 'nhu')
WHERE NOT EXISTS (
  SELECT 1 FROM sportsplatform_media
  WHERE file_url = '/sports/namibia-hockey.jpg'
    AND entity_type = 'federation'
    AND entity_id = (SELECT id FROM sportsplatform_federations WHERE slug = 'nhu')
);

INSERT INTO sportsplatform_media (title, file_url, thumbnail_url, type, entity_type, entity_id)
SELECT 'Hockey — athlete portrait stock', '/athletes/hockey.jpg', '/athletes/hockey.jpg',
       'image', 'federation',
       (SELECT id FROM sportsplatform_federations WHERE slug = 'nhu')
WHERE NOT EXISTS (
  SELECT 1 FROM sportsplatform_media
  WHERE file_url = '/athletes/hockey.jpg'
    AND entity_type = 'federation'
    AND entity_id = (SELECT id FROM sportsplatform_federations WHERE slug = 'nhu')
);

-- ===== Namibia Basketball (slug: namibia-basketball) — 4 =====
INSERT INTO sportsplatform_media (title, file_url, thumbnail_url, type, entity_type, entity_id)
SELECT 'Namibia Basketball Federation crest', '/logos/Namibian_Basketball_Federation_logo.jpg',
       '/logos/Namibian_Basketball_Federation_logo.jpg', 'image', 'federation',
       (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-basketball')
WHERE NOT EXISTS (
  SELECT 1 FROM sportsplatform_media
  WHERE file_url = '/logos/Namibian_Basketball_Federation_logo.jpg'
    AND entity_type = 'federation'
    AND entity_id = (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-basketball')
);

INSERT INTO sportsplatform_media (title, file_url, thumbnail_url, type, entity_type, entity_id)
SELECT 'Basketball — court action', '/sports/basketball.jpg', '/sports/basketball.jpg',
       'image', 'federation',
       (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-basketball')
WHERE NOT EXISTS (
  SELECT 1 FROM sportsplatform_media
  WHERE file_url = '/sports/basketball.jpg'
    AND entity_type = 'federation'
    AND entity_id = (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-basketball')
);

INSERT INTO sportsplatform_media (title, file_url, thumbnail_url, type, entity_type, entity_id)
SELECT 'Basketball — game atmosphere', '/sports/basketball-action.jpg', '/sports/basketball-action.jpg',
       'image', 'federation',
       (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-basketball')
WHERE NOT EXISTS (
  SELECT 1 FROM sportsplatform_media
  WHERE file_url = '/sports/basketball-action.jpg'
    AND entity_type = 'federation'
    AND entity_id = (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-basketball')
);

INSERT INTO sportsplatform_media (title, file_url, thumbnail_url, type, entity_type, entity_id)
SELECT 'Namibia basketball — national colours', '/sports/namibia-basketball.jpg', '/sports/namibia-basketball.jpg',
       'image', 'federation',
       (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-basketball')
WHERE NOT EXISTS (
  SELECT 1 FROM sportsplatform_media
  WHERE file_url = '/sports/namibia-basketball.jpg'
    AND entity_type = 'federation'
    AND entity_id = (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-basketball')
);

-- ===== Namibia Boxing (slug: namibia-boxing) — 4 =====
INSERT INTO sportsplatform_media (title, file_url, thumbnail_url, type, entity_type, entity_id)
SELECT 'Namibian Boxing Federation crest', '/logos/Namibian_Boxing_Federation_logo.jpg',
       '/logos/Namibian_Boxing_Federation_logo.jpg', 'image', 'federation',
       (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-boxing')
WHERE NOT EXISTS (
  SELECT 1 FROM sportsplatform_media
  WHERE file_url = '/logos/Namibian_Boxing_Federation_logo.jpg'
    AND entity_type = 'federation'
    AND entity_id = (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-boxing')
);

INSERT INTO sportsplatform_media (title, file_url, thumbnail_url, type, entity_type, entity_id)
SELECT 'Boxing — ring action', '/sports/boxing-action.jpg', '/sports/boxing-action.jpg',
       'image', 'federation',
       (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-boxing')
WHERE NOT EXISTS (
  SELECT 1 FROM sportsplatform_media
  WHERE file_url = '/sports/boxing-action.jpg'
    AND entity_type = 'federation'
    AND entity_id = (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-boxing')
);

INSERT INTO sportsplatform_media (title, file_url, thumbnail_url, type, entity_type, entity_id)
SELECT 'Namibia boxing — national colours', '/sports/namibia-boxing.jpg', '/sports/namibia-boxing.jpg',
       'image', 'federation',
       (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-boxing')
WHERE NOT EXISTS (
  SELECT 1 FROM sportsplatform_media
  WHERE file_url = '/sports/namibia-boxing.jpg'
    AND entity_type = 'federation'
    AND entity_id = (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-boxing')
);

INSERT INTO sportsplatform_media (title, file_url, thumbnail_url, type, entity_type, entity_id)
SELECT 'Boxing — athlete portrait stock', '/athletes/boxing.jpg', '/athletes/boxing.jpg',
       'image', 'federation',
       (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-boxing')
WHERE NOT EXISTS (
  SELECT 1 FROM sportsplatform_media
  WHERE file_url = '/athletes/boxing.jpg'
    AND entity_type = 'federation'
    AND entity_id = (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-boxing')
);

-- ===== Namibia Volleyball (slug: namibia-volleyball) — 3 =====
INSERT INTO sportsplatform_media (title, file_url, thumbnail_url, type, entity_type, entity_id)
SELECT 'Namibia Volleyball Federation crest', '/logos/Namibia_Volleyball_Federation_logo.jpg',
       '/logos/Namibia_Volleyball_Federation_logo.jpg', 'image', 'federation',
       (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-volleyball')
WHERE NOT EXISTS (
  SELECT 1 FROM sportsplatform_media
  WHERE file_url = '/logos/Namibia_Volleyball_Federation_logo.jpg'
    AND entity_type = 'federation'
    AND entity_id = (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-volleyball')
);

INSERT INTO sportsplatform_media (title, file_url, thumbnail_url, type, entity_type, entity_id)
SELECT 'Volleyball — indoor action', '/sports/volleyball.jpg', '/sports/volleyball.jpg',
       'image', 'federation',
       (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-volleyball')
WHERE NOT EXISTS (
  SELECT 1 FROM sportsplatform_media
  WHERE file_url = '/sports/volleyball.jpg'
    AND entity_type = 'federation'
    AND entity_id = (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-volleyball')
);

INSERT INTO sportsplatform_media (title, file_url, thumbnail_url, type, entity_type, entity_id)
SELECT 'Volleyball — athlete portrait stock', '/athletes/volleyball.jpg', '/athletes/volleyball.jpg',
       'image', 'federation',
       (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-volleyball')
WHERE NOT EXISTS (
  SELECT 1 FROM sportsplatform_media
  WHERE file_url = '/athletes/volleyball.jpg'
    AND entity_type = 'federation'
    AND entity_id = (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-volleyball')
);

-- ===== Tennis Namibia (slug: tennis-namibia) — 3 =====
INSERT INTO sportsplatform_media (title, file_url, thumbnail_url, type, entity_type, entity_id)
SELECT 'Namibia Tennis Association crest', '/logos/Namibia_Tennis_Association_logo.png',
       '/logos/Namibia_Tennis_Association_logo.png', 'image', 'federation',
       (SELECT id FROM sportsplatform_federations WHERE slug = 'tennis-namibia')
WHERE NOT EXISTS (
  SELECT 1 FROM sportsplatform_media
  WHERE file_url = '/logos/Namibia_Tennis_Association_logo.png'
    AND entity_type = 'federation'
    AND entity_id = (SELECT id FROM sportsplatform_federations WHERE slug = 'tennis-namibia')
);

INSERT INTO sportsplatform_media (title, file_url, thumbnail_url, type, entity_type, entity_id)
SELECT 'Tennis — baseline play', '/sports/tennis.jpg', '/sports/tennis.jpg',
       'image', 'federation',
       (SELECT id FROM sportsplatform_federations WHERE slug = 'tennis-namibia')
WHERE NOT EXISTS (
  SELECT 1 FROM sportsplatform_media
  WHERE file_url = '/sports/tennis.jpg'
    AND entity_type = 'federation'
    AND entity_id = (SELECT id FROM sportsplatform_federations WHERE slug = 'tennis-namibia')
);

INSERT INTO sportsplatform_media (title, file_url, thumbnail_url, type, entity_type, entity_id)
SELECT 'Tennis — athlete portrait stock', '/athletes/tennis.jpg', '/athletes/tennis.jpg',
       'image', 'federation',
       (SELECT id FROM sportsplatform_federations WHERE slug = 'tennis-namibia')
WHERE NOT EXISTS (
  SELECT 1 FROM sportsplatform_media
  WHERE file_url = '/athletes/tennis.jpg'
    AND entity_type = 'federation'
    AND entity_id = (SELECT id FROM sportsplatform_federations WHERE slug = 'tennis-namibia')
);

-- ===== NASFED / Aquatics (slug: swimming-namibia) — 4 =====
INSERT INTO sportsplatform_media (title, file_url, thumbnail_url, type, entity_type, entity_id)
SELECT 'Namibia Aquatic Sports Federation crest', '/logos/Namibia_Aquatic_Sports_Federation_logo.webp',
       '/logos/Namibia_Aquatic_Sports_Federation_logo.webp', 'image', 'federation',
       (SELECT id FROM sportsplatform_federations WHERE slug = 'swimming-namibia')
WHERE NOT EXISTS (
  SELECT 1 FROM sportsplatform_media
  WHERE file_url = '/logos/Namibia_Aquatic_Sports_Federation_logo.webp'
    AND entity_type = 'federation'
    AND entity_id = (SELECT id FROM sportsplatform_federations WHERE slug = 'swimming-namibia')
);

INSERT INTO sportsplatform_media (title, file_url, thumbnail_url, type, entity_type, entity_id)
SELECT 'Swimming — pool action', '/sports/swimming-action.jpg', '/sports/swimming-action.jpg',
       'image', 'federation',
       (SELECT id FROM sportsplatform_federations WHERE slug = 'swimming-namibia')
WHERE NOT EXISTS (
  SELECT 1 FROM sportsplatform_media
  WHERE file_url = '/sports/swimming-action.jpg'
    AND entity_type = 'federation'
    AND entity_id = (SELECT id FROM sportsplatform_federations WHERE slug = 'swimming-namibia')
);

INSERT INTO sportsplatform_media (title, file_url, thumbnail_url, type, entity_type, entity_id)
SELECT 'Namibia swimming — national colours', '/sports/namibia-swimming.jpg', '/sports/namibia-swimming.jpg',
       'image', 'federation',
       (SELECT id FROM sportsplatform_federations WHERE slug = 'swimming-namibia')
WHERE NOT EXISTS (
  SELECT 1 FROM sportsplatform_media
  WHERE file_url = '/sports/namibia-swimming.jpg'
    AND entity_type = 'federation'
    AND entity_id = (SELECT id FROM sportsplatform_federations WHERE slug = 'swimming-namibia')
);

INSERT INTO sportsplatform_media (title, file_url, thumbnail_url, type, entity_type, entity_id)
SELECT 'Swimming — athlete portrait stock', '/athletes/swimming.jpg', '/athletes/swimming.jpg',
       'image', 'federation',
       (SELECT id FROM sportsplatform_federations WHERE slug = 'swimming-namibia')
WHERE NOT EXISTS (
  SELECT 1 FROM sportsplatform_media
  WHERE file_url = '/athletes/swimming.jpg'
    AND entity_type = 'federation'
    AND entity_id = (SELECT id FROM sportsplatform_federations WHERE slug = 'swimming-namibia')
);

-- ===== Beach Volleyball (slug: namibia-beach-volleyball) — 2 =====
INSERT INTO sportsplatform_media (title, file_url, thumbnail_url, type, entity_type, entity_id)
SELECT 'Beach volleyball — sand court', '/sports/beach-volleyball.jpg', '/sports/beach-volleyball.jpg',
       'image', 'federation',
       (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-beach-volleyball')
WHERE NOT EXISTS (
  SELECT 1 FROM sportsplatform_media
  WHERE file_url = '/sports/beach-volleyball.jpg'
    AND entity_type = 'federation'
    AND entity_id = (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-beach-volleyball')
);

INSERT INTO sportsplatform_media (title, file_url, thumbnail_url, type, entity_type, entity_id)
SELECT 'Swakopmund beach courts', '/venues/swakopmund-beach-courts.jpg',
       '/venues/swakopmund-beach-courts.jpg', 'image', 'federation',
       (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-beach-volleyball')
WHERE NOT EXISTS (
  SELECT 1 FROM sportsplatform_media
  WHERE file_url = '/venues/swakopmund-beach-courts.jpg'
    AND entity_type = 'federation'
    AND entity_id = (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-beach-volleyball')
);

-- ===== Judo Namibia (slug: judo-namibia) — 3 =====
INSERT INTO sportsplatform_media (title, file_url, thumbnail_url, type, entity_type, entity_id)
SELECT 'Namibian Judo Federation crest', '/logos/Namibian_Judo_Federation_logo.png',
       '/logos/Namibian_Judo_Federation_logo.png', 'image', 'federation',
       (SELECT id FROM sportsplatform_federations WHERE slug = 'judo-namibia')
WHERE NOT EXISTS (
  SELECT 1 FROM sportsplatform_media
  WHERE file_url = '/logos/Namibian_Judo_Federation_logo.png'
    AND entity_type = 'federation'
    AND entity_id = (SELECT id FROM sportsplatform_federations WHERE slug = 'judo-namibia')
);

INSERT INTO sportsplatform_media (title, file_url, thumbnail_url, type, entity_type, entity_id)
SELECT 'Judo — tatami action', '/sports/judo.jpg', '/sports/judo.jpg',
       'image', 'federation',
       (SELECT id FROM sportsplatform_federations WHERE slug = 'judo-namibia')
WHERE NOT EXISTS (
  SELECT 1 FROM sportsplatform_media
  WHERE file_url = '/sports/judo.jpg'
    AND entity_type = 'federation'
    AND entity_id = (SELECT id FROM sportsplatform_federations WHERE slug = 'judo-namibia')
);

INSERT INTO sportsplatform_media (title, file_url, thumbnail_url, type, entity_type, entity_id)
SELECT 'Judo — athlete portrait stock', '/athletes/judo.jpg', '/athletes/judo.jpg',
       'image', 'federation',
       (SELECT id FROM sportsplatform_federations WHERE slug = 'judo-namibia')
WHERE NOT EXISTS (
  SELECT 1 FROM sportsplatform_media
  WHERE file_url = '/athletes/judo.jpg'
    AND entity_type = 'federation'
    AND entity_id = (SELECT id FROM sportsplatform_federations WHERE slug = 'judo-namibia')
);

-- ===== Handball (slug: namibia-handball) — 2 =====
INSERT INTO sportsplatform_media (title, file_url, thumbnail_url, type, entity_type, entity_id)
SELECT 'Namibia Handball Federation crest', '/logos/Namibia_Handball_Federation_logo.png',
       '/logos/Namibia_Handball_Federation_logo.png', 'image', 'federation',
       (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-handball')
WHERE NOT EXISTS (
  SELECT 1 FROM sportsplatform_media
  WHERE file_url = '/logos/Namibia_Handball_Federation_logo.png'
    AND entity_type = 'federation'
    AND entity_id = (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-handball')
);

INSERT INTO sportsplatform_media (title, file_url, thumbnail_url, type, entity_type, entity_id)
SELECT 'Handball — court action', '/sports/handball.jpg', '/sports/handball.jpg',
       'image', 'federation',
       (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-handball')
WHERE NOT EXISTS (
  SELECT 1 FROM sportsplatform_media
  WHERE file_url = '/sports/handball.jpg'
    AND entity_type = 'federation'
    AND entity_id = (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-handball')
);

-- ===== Venues — 4 =====
INSERT INTO sportsplatform_media (title, file_url, thumbnail_url, type, entity_type, entity_id)
SELECT 'The Dome Swakopmund', '/venues/dome-swakopmund.jpg', '/venues/dome-swakopmund.jpg',
       'image', 'venue',
       (SELECT id FROM sportsplatform_venues WHERE slug = 'the-dome-swakopmund')
WHERE NOT EXISTS (
  SELECT 1 FROM sportsplatform_media
  WHERE file_url = '/venues/dome-swakopmund.jpg'
    AND entity_type = 'venue'
    AND entity_id = (SELECT id FROM sportsplatform_venues WHERE slug = 'the-dome-swakopmund')
);

INSERT INTO sportsplatform_media (title, file_url, thumbnail_url, type, entity_type, entity_id)
SELECT 'Independence Stadium Windhoek', '/venues/independence-stadium.jpg',
       '/venues/independence-stadium.jpg', 'image', 'venue',
       (SELECT id FROM sportsplatform_venues WHERE slug = 'independence-stadium')
WHERE NOT EXISTS (
  SELECT 1 FROM sportsplatform_media
  WHERE file_url = '/venues/independence-stadium.jpg'
    AND entity_type = 'venue'
    AND entity_id = (SELECT id FROM sportsplatform_venues WHERE slug = 'independence-stadium')
);

INSERT INTO sportsplatform_media (title, file_url, thumbnail_url, type, entity_type, entity_id)
SELECT 'Olympia Aquatic Centre', '/venues/olympia-aquatic-centre.jpg',
       '/venues/olympia-aquatic-centre.jpg', 'image', 'venue',
       (SELECT id FROM sportsplatform_venues WHERE slug = 'olympia-aquatic-centre')
WHERE NOT EXISTS (
  SELECT 1 FROM sportsplatform_media
  WHERE file_url = '/venues/olympia-aquatic-centre.jpg'
    AND entity_type = 'venue'
    AND entity_id = (SELECT id FROM sportsplatform_venues WHERE slug = 'olympia-aquatic-centre')
);

INSERT INTO sportsplatform_media (title, file_url, thumbnail_url, type, entity_type, entity_id)
SELECT 'Wanderers Sports Club', '/venues/wanderers-sports-club.jpg',
       '/venues/wanderers-sports-club.jpg', 'image', 'venue',
       (SELECT id FROM sportsplatform_venues WHERE slug = 'wanderers-sports-club')
WHERE NOT EXISTS (
  SELECT 1 FROM sportsplatform_media
  WHERE file_url = '/venues/wanderers-sports-club.jpg'
    AND entity_type = 'venue'
    AND entity_id = (SELECT id FROM sportsplatform_venues WHERE slug = 'wanderers-sports-club')
);

-- ===== Athlete — Frankie Fredericks — 1 =====
INSERT INTO sportsplatform_media (title, file_url, thumbnail_url, type, entity_type, entity_id)
SELECT 'Frankie Fredericks portrait', '/athletes/frankie-fredericks.jpg',
       '/athletes/frankie-fredericks.jpg', 'image', 'athlete',
       (SELECT id FROM sportsplatform_athletes WHERE slug = 'frankie-fredericks')
WHERE NOT EXISTS (
  SELECT 1 FROM sportsplatform_media
  WHERE file_url = '/athletes/frankie-fredericks.jpg'
    AND entity_type = 'athlete'
    AND entity_id = (SELECT id FROM sportsplatform_athletes WHERE slug = 'frankie-fredericks')
);
