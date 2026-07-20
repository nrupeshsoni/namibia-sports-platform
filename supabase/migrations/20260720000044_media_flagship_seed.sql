-- WHY: Beta readiness — sportsplatform_media had 0 rows (no federation galleries).
-- Seed ≥20 image rows for flagship orgs (NFA, NRU, Cricket, Athletics, NNOC, NSC)
-- using existing local /sports/* and /logos/* assets verified on disk 2026-07-20.
-- Idempotent via (file_url, entity_type, entity_id) NOT EXISTS.
-- Streams: no real upcoming YouTube/Facebook live URLs found for Namibian sports
-- (Gravity Live / NBC / federation pages lack concrete future watch URLs); leave
-- sportsplatform_live_streams unchanged (4 VOD rows from 20260720000032).
-- Evidence: docs/research/media_enrichment_batch.md
-- Applied 2026-07-20. Does NOT modify RLS.

-- ===== NFA (slug: nfa) — 4 =====
INSERT INTO sportsplatform_media (title, file_url, thumbnail_url, type, entity_type, entity_id)
SELECT 'Namibia Football Association crest', '/logos/Namibia_Football_Association_logo.png',
       '/logos/Namibia_Football_Association_logo.png', 'image', 'federation',
       (SELECT id FROM sportsplatform_federations WHERE slug = 'nfa')
WHERE NOT EXISTS (
  SELECT 1 FROM sportsplatform_media
  WHERE file_url = '/logos/Namibia_Football_Association_logo.png'
    AND entity_type = 'federation'
    AND entity_id = (SELECT id FROM sportsplatform_federations WHERE slug = 'nfa')
);

INSERT INTO sportsplatform_media (title, file_url, thumbnail_url, type, entity_type, entity_id)
SELECT 'Football — match action', '/sports/football.jpg', '/sports/football.jpg',
       'image', 'federation',
       (SELECT id FROM sportsplatform_federations WHERE slug = 'nfa')
WHERE NOT EXISTS (
  SELECT 1 FROM sportsplatform_media
  WHERE file_url = '/sports/football.jpg'
    AND entity_type = 'federation'
    AND entity_id = (SELECT id FROM sportsplatform_federations WHERE slug = 'nfa')
);

INSERT INTO sportsplatform_media (title, file_url, thumbnail_url, type, entity_type, entity_id)
SELECT 'Football — stadium atmosphere', '/sports/football-action.jpg', '/sports/football-action.jpg',
       'image', 'federation',
       (SELECT id FROM sportsplatform_federations WHERE slug = 'nfa')
WHERE NOT EXISTS (
  SELECT 1 FROM sportsplatform_media
  WHERE file_url = '/sports/football-action.jpg'
    AND entity_type = 'federation'
    AND entity_id = (SELECT id FROM sportsplatform_federations WHERE slug = 'nfa')
);

INSERT INTO sportsplatform_media (title, file_url, thumbnail_url, type, entity_type, entity_id)
SELECT 'Namibia football — national colours', '/sports/namibia-football.jpg', '/sports/namibia-football.jpg',
       'image', 'federation',
       (SELECT id FROM sportsplatform_federations WHERE slug = 'nfa')
WHERE NOT EXISTS (
  SELECT 1 FROM sportsplatform_media
  WHERE file_url = '/sports/namibia-football.jpg'
    AND entity_type = 'federation'
    AND entity_id = (SELECT id FROM sportsplatform_federations WHERE slug = 'nfa')
);

-- ===== NRU (slug: nru) — 4 =====
INSERT INTO sportsplatform_media (title, file_url, thumbnail_url, type, entity_type, entity_id)
SELECT 'Namibia Rugby Union crest', '/logos/Namibia_Rugby_Union_logo.png',
       '/logos/Namibia_Rugby_Union_logo.png', 'image', 'federation',
       (SELECT id FROM sportsplatform_federations WHERE slug = 'nru')
WHERE NOT EXISTS (
  SELECT 1 FROM sportsplatform_media
  WHERE file_url = '/logos/Namibia_Rugby_Union_logo.png'
    AND entity_type = 'federation'
    AND entity_id = (SELECT id FROM sportsplatform_federations WHERE slug = 'nru')
);

INSERT INTO sportsplatform_media (title, file_url, thumbnail_url, type, entity_type, entity_id)
SELECT 'Rugby — set piece', '/sports/rugby.jpg', '/sports/rugby.jpg',
       'image', 'federation',
       (SELECT id FROM sportsplatform_federations WHERE slug = 'nru')
WHERE NOT EXISTS (
  SELECT 1 FROM sportsplatform_media
  WHERE file_url = '/sports/rugby.jpg'
    AND entity_type = 'federation'
    AND entity_id = (SELECT id FROM sportsplatform_federations WHERE slug = 'nru')
);

INSERT INTO sportsplatform_media (title, file_url, thumbnail_url, type, entity_type, entity_id)
SELECT 'Namibia rugby — Welwitschias', '/sports/namibia-rugby.jpg', '/sports/namibia-rugby.jpg',
       'image', 'federation',
       (SELECT id FROM sportsplatform_federations WHERE slug = 'nru')
WHERE NOT EXISTS (
  SELECT 1 FROM sportsplatform_media
  WHERE file_url = '/sports/namibia-rugby.jpg'
    AND entity_type = 'federation'
    AND entity_id = (SELECT id FROM sportsplatform_federations WHERE slug = 'nru')
);

INSERT INTO sportsplatform_media (title, file_url, thumbnail_url, type, entity_type, entity_id)
SELECT 'Namibia rugby — match action', '/sports/namibia-rugby-action.jpg', '/sports/namibia-rugby-action.jpg',
       'image', 'federation',
       (SELECT id FROM sportsplatform_federations WHERE slug = 'nru')
WHERE NOT EXISTS (
  SELECT 1 FROM sportsplatform_media
  WHERE file_url = '/sports/namibia-rugby-action.jpg'
    AND entity_type = 'federation'
    AND entity_id = (SELECT id FROM sportsplatform_federations WHERE slug = 'nru')
);

-- ===== Cricket Namibia (slug: cricket-namibia) — 4 =====
INSERT INTO sportsplatform_media (title, file_url, thumbnail_url, type, entity_type, entity_id)
SELECT 'Cricket Namibia crest', '/logos/cricket-logo.png',
       '/logos/cricket-logo.png', 'image', 'federation',
       (SELECT id FROM sportsplatform_federations WHERE slug = 'cricket-namibia')
WHERE NOT EXISTS (
  SELECT 1 FROM sportsplatform_media
  WHERE file_url = '/logos/cricket-logo.png'
    AND entity_type = 'federation'
    AND entity_id = (SELECT id FROM sportsplatform_federations WHERE slug = 'cricket-namibia')
);

INSERT INTO sportsplatform_media (title, file_url, thumbnail_url, type, entity_type, entity_id)
SELECT 'Cricket — batting', '/sports/cricket.jpg', '/sports/cricket.jpg',
       'image', 'federation',
       (SELECT id FROM sportsplatform_federations WHERE slug = 'cricket-namibia')
WHERE NOT EXISTS (
  SELECT 1 FROM sportsplatform_media
  WHERE file_url = '/sports/cricket.jpg'
    AND entity_type = 'federation'
    AND entity_id = (SELECT id FROM sportsplatform_federations WHERE slug = 'cricket-namibia')
);

INSERT INTO sportsplatform_media (title, file_url, thumbnail_url, type, entity_type, entity_id)
SELECT 'Cricket — fielding action', '/sports/cricket-action.jpg', '/sports/cricket-action.jpg',
       'image', 'federation',
       (SELECT id FROM sportsplatform_federations WHERE slug = 'cricket-namibia')
WHERE NOT EXISTS (
  SELECT 1 FROM sportsplatform_media
  WHERE file_url = '/sports/cricket-action.jpg'
    AND entity_type = 'federation'
    AND entity_id = (SELECT id FROM sportsplatform_federations WHERE slug = 'cricket-namibia')
);

INSERT INTO sportsplatform_media (title, file_url, thumbnail_url, type, entity_type, entity_id)
SELECT 'Namibia cricket — Eagles', '/sports/namibia-cricket.jpg', '/sports/namibia-cricket.jpg',
       'image', 'federation',
       (SELECT id FROM sportsplatform_federations WHERE slug = 'cricket-namibia')
WHERE NOT EXISTS (
  SELECT 1 FROM sportsplatform_media
  WHERE file_url = '/sports/namibia-cricket.jpg'
    AND entity_type = 'federation'
    AND entity_id = (SELECT id FROM sportsplatform_federations WHERE slug = 'cricket-namibia')
);

-- ===== Athletics Namibia (slug: athletics-namibia) — 3 =====
INSERT INTO sportsplatform_media (title, file_url, thumbnail_url, type, entity_type, entity_id)
SELECT 'Athletics Namibia crest', '/logos/athletics-logo.png',
       '/logos/athletics-logo.png', 'image', 'federation',
       (SELECT id FROM sportsplatform_federations WHERE slug = 'athletics-namibia')
WHERE NOT EXISTS (
  SELECT 1 FROM sportsplatform_media
  WHERE file_url = '/logos/athletics-logo.png'
    AND entity_type = 'federation'
    AND entity_id = (SELECT id FROM sportsplatform_federations WHERE slug = 'athletics-namibia')
);

INSERT INTO sportsplatform_media (title, file_url, thumbnail_url, type, entity_type, entity_id)
SELECT 'Athletics — track sprint', '/sports/athletics.jpg', '/sports/athletics.jpg',
       'image', 'federation',
       (SELECT id FROM sportsplatform_federations WHERE slug = 'athletics-namibia')
WHERE NOT EXISTS (
  SELECT 1 FROM sportsplatform_media
  WHERE file_url = '/sports/athletics.jpg'
    AND entity_type = 'federation'
    AND entity_id = (SELECT id FROM sportsplatform_federations WHERE slug = 'athletics-namibia')
);

INSERT INTO sportsplatform_media (title, file_url, thumbnail_url, type, entity_type, entity_id)
SELECT 'Athletics — field events', '/sports/athletics-alt.jpg', '/sports/athletics-alt.jpg',
       'image', 'federation',
       (SELECT id FROM sportsplatform_federations WHERE slug = 'athletics-namibia')
WHERE NOT EXISTS (
  SELECT 1 FROM sportsplatform_media
  WHERE file_url = '/sports/athletics-alt.jpg'
    AND entity_type = 'federation'
    AND entity_id = (SELECT id FROM sportsplatform_federations WHERE slug = 'athletics-namibia')
);

-- ===== NNOC (slug: nnoc) — 5 =====
INSERT INTO sportsplatform_media (title, file_url, thumbnail_url, type, entity_type, entity_id)
SELECT 'Namibia National Olympic Committee crest', '/logos/Namibia_National_Olympic_Committee_logo.png',
       '/logos/Namibia_National_Olympic_Committee_logo.png', 'image', 'federation',
       (SELECT id FROM sportsplatform_federations WHERE slug = 'nnoc')
WHERE NOT EXISTS (
  SELECT 1 FROM sportsplatform_media
  WHERE file_url = '/logos/Namibia_National_Olympic_Committee_logo.png'
    AND entity_type = 'federation'
    AND entity_id = (SELECT id FROM sportsplatform_federations WHERE slug = 'nnoc')
);

INSERT INTO sportsplatform_media (title, file_url, thumbnail_url, type, entity_type, entity_id)
SELECT 'Olympic pathway — athletics', '/sports/athletics-alt.jpg', '/sports/athletics-alt.jpg',
       'image', 'federation',
       (SELECT id FROM sportsplatform_federations WHERE slug = 'nnoc')
WHERE NOT EXISTS (
  SELECT 1 FROM sportsplatform_media
  WHERE file_url = '/sports/athletics-alt.jpg'
    AND entity_type = 'federation'
    AND entity_id = (SELECT id FROM sportsplatform_federations WHERE slug = 'nnoc')
);

INSERT INTO sportsplatform_media (title, file_url, thumbnail_url, type, entity_type, entity_id)
SELECT 'Olympic pathway — swimming', '/sports/swimming.jpg', '/sports/swimming.jpg',
       'image', 'federation',
       (SELECT id FROM sportsplatform_federations WHERE slug = 'nnoc')
WHERE NOT EXISTS (
  SELECT 1 FROM sportsplatform_media
  WHERE file_url = '/sports/swimming.jpg'
    AND entity_type = 'federation'
    AND entity_id = (SELECT id FROM sportsplatform_federations WHERE slug = 'nnoc')
);

INSERT INTO sportsplatform_media (title, file_url, thumbnail_url, type, entity_type, entity_id)
SELECT 'Olympic pathway — boxing', '/sports/boxing.jpg', '/sports/boxing.jpg',
       'image', 'federation',
       (SELECT id FROM sportsplatform_federations WHERE slug = 'nnoc')
WHERE NOT EXISTS (
  SELECT 1 FROM sportsplatform_media
  WHERE file_url = '/sports/boxing.jpg'
    AND entity_type = 'federation'
    AND entity_id = (SELECT id FROM sportsplatform_federations WHERE slug = 'nnoc')
);

INSERT INTO sportsplatform_media (title, file_url, thumbnail_url, type, entity_type, entity_id)
SELECT 'Olympic pathway — triathlon', '/sports/triathlon.jpg', '/sports/triathlon.jpg',
       'image', 'federation',
       (SELECT id FROM sportsplatform_federations WHERE slug = 'nnoc')
WHERE NOT EXISTS (
  SELECT 1 FROM sportsplatform_media
  WHERE file_url = '/sports/triathlon.jpg'
    AND entity_type = 'federation'
    AND entity_id = (SELECT id FROM sportsplatform_federations WHERE slug = 'nnoc')
);

-- ===== NSC (slug: namibia-sports-commission) — 4 =====
INSERT INTO sportsplatform_media (title, file_url, thumbnail_url, type, entity_type, entity_id)
SELECT 'Namibia Sports Commission crest', '/logos/Namibia_Sports_Commission_logo.jpg',
       '/logos/Namibia_Sports_Commission_logo.jpg', 'image', 'federation',
       (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-sports-commission')
WHERE NOT EXISTS (
  SELECT 1 FROM sportsplatform_media
  WHERE file_url = '/logos/Namibia_Sports_Commission_logo.jpg'
    AND entity_type = 'federation'
    AND entity_id = (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-sports-commission')
);

INSERT INTO sportsplatform_media (title, file_url, thumbnail_url, type, entity_type, entity_id)
SELECT 'NSC recognised sport — volleyball', '/sports/volleyball.jpg', '/sports/volleyball.jpg',
       'image', 'federation',
       (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-sports-commission')
WHERE NOT EXISTS (
  SELECT 1 FROM sportsplatform_media
  WHERE file_url = '/sports/volleyball.jpg'
    AND entity_type = 'federation'
    AND entity_id = (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-sports-commission')
);

INSERT INTO sportsplatform_media (title, file_url, thumbnail_url, type, entity_type, entity_id)
SELECT 'NSC recognised sport — netball', '/sports/netball.jpg', '/sports/netball.jpg',
       'image', 'federation',
       (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-sports-commission')
WHERE NOT EXISTS (
  SELECT 1 FROM sportsplatform_media
  WHERE file_url = '/sports/netball.jpg'
    AND entity_type = 'federation'
    AND entity_id = (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-sports-commission')
);

INSERT INTO sportsplatform_media (title, file_url, thumbnail_url, type, entity_type, entity_id)
SELECT 'NSC recognised sport — field hockey', '/sports/hockey-field.jpg', '/sports/hockey-field.jpg',
       'image', 'federation',
       (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-sports-commission')
WHERE NOT EXISTS (
  SELECT 1 FROM sportsplatform_media
  WHERE file_url = '/sports/hockey-field.jpg'
    AND entity_type = 'federation'
    AND entity_id = (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-sports-commission')
);
