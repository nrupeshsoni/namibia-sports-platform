-- WHY: Beta `/live` had 0 rows (empty-state as primary nav). Seed verified YouTube
-- watch/embed URLs for Namibian sports VODs (NBC Sport, SuperSport). Thumbnails from
-- local `/sports/*`. Idempotent via stream_url NOT EXISTS. federation_id by slug.
-- Applied 2026-07-20. Sources verified via YouTube oEmbed 2026-07-20.

-- 1) NFA — Independence Day sport message (nbcSPORTNA)
INSERT INTO sportsplatform_live_streams
  (title, federation_id, platform_type, stream_url, embed_url, thumbnail_url,
   scheduled_start, scheduled_end, is_live, viewer_count)
SELECT
  'NFA President on Sport & Namibia''s Independence',
  (SELECT id FROM sportsplatform_federations WHERE slug = 'nfa'),
  'youtube',
  'https://www.youtube.com/watch?v=TiAa4dTFnSM',
  'https://www.youtube.com/embed/TiAa4dTFnSM',
  '/sports/football.jpg',
  '2026-03-21 10:00:00+00',
  '2026-03-21 10:30:00+00',
  false,
  NULL
WHERE NOT EXISTS (
  SELECT 1 FROM sportsplatform_live_streams
  WHERE stream_url = 'https://www.youtube.com/watch?v=TiAa4dTFnSM'
);

-- 2) NRU — Namibia Rugby Premier League return (NBC Digital News)
INSERT INTO sportsplatform_live_streams
  (title, federation_id, platform_type, stream_url, embed_url, thumbnail_url,
   scheduled_start, scheduled_end, is_live, viewer_count)
SELECT
  'Return of the Namibia Rugby Premier League',
  (SELECT id FROM sportsplatform_federations WHERE slug = 'nru'),
  'youtube',
  'https://www.youtube.com/watch?v=B7R2BE6-p9M',
  'https://www.youtube.com/embed/B7R2BE6-p9M',
  '/sports/namibia-rugby-action.jpg',
  '2025-11-15 14:00:00+00',
  '2025-11-15 14:45:00+00',
  false,
  NULL
WHERE NOT EXISTS (
  SELECT 1 FROM sportsplatform_live_streams
  WHERE stream_url = 'https://www.youtube.com/watch?v=B7R2BE6-p9M'
);

-- 3) Cricket Namibia — T20WC 2024 Namibia v Oman highlights (SuperSport / ICC)
INSERT INTO sportsplatform_live_streams
  (title, federation_id, platform_type, stream_url, embed_url, thumbnail_url,
   scheduled_start, scheduled_end, is_live, viewer_count)
SELECT
  'Namibia v Oman | T20 World Cup 2024 Highlights',
  (SELECT id FROM sportsplatform_federations WHERE slug = 'cricket-namibia'),
  'youtube',
  'https://www.youtube.com/watch?v=ewGtor9S4y0',
  'https://www.youtube.com/embed/ewGtor9S4y0',
  '/sports/cricket-action.jpg',
  '2024-06-02 19:00:00+00',
  '2024-06-02 22:00:00+00',
  false,
  NULL
WHERE NOT EXISTS (
  SELECT 1 FROM sportsplatform_live_streams
  WHERE stream_url = 'https://www.youtube.com/watch?v=ewGtor9S4y0'
);

-- 4) NASFED — Long course gala coverage (nbcSPORTNA)
INSERT INTO sportsplatform_live_streams
  (title, federation_id, platform_type, stream_url, embed_url, thumbnail_url,
   scheduled_start, scheduled_end, is_live, viewer_count)
SELECT
  'NASFED Long Course Gala Across Three Towns',
  (SELECT id FROM sportsplatform_federations WHERE slug = 'swimming-namibia'),
  'youtube',
  'https://www.youtube.com/watch?v=TlYCCpbyGu4',
  'https://www.youtube.com/embed/TlYCCpbyGu4',
  '/sports/swimming.jpg',
  '2025-09-20 09:00:00+00',
  '2025-09-22 17:00:00+00',
  false,
  NULL
WHERE NOT EXISTS (
  SELECT 1 FROM sportsplatform_live_streams
  WHERE stream_url = 'https://www.youtube.com/watch?v=TlYCCpbyGu4'
);
