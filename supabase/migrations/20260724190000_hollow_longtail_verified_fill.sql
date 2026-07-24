-- Hollow long-tail fill (2026-07-24 evening).
-- WHY: Cut hollow core-5 for federations with named public sources; no fabricated contacts.
-- Idempotent by club/athlete/news slug.
-- Evidence: docs/research/hollow_longtail_ux_fill_20260724.md

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url, website, contact_phone, contact_email, is_active
)
SELECT v.name, v.slug, f.id, v.city, v.region, v.logo_url, v.website, NULL, NULL, true
FROM (
  VALUES
    -- Skateboarding — Namibian Sun Oniipa skatepark / Deluded Bros Arthouse
    ('Deluded Bros Arthouse', 'deluded-bros-arthouse', 'skateboarding-namibia',
     'Oniipa', 'Oshikoto', '/sports/skateboarding-action.jpg', NULL),
    -- Speed hiking — Let's Go Hiking Namibia (registered hiking club)
    ('Let''s Go Hiking Namibia', 'lets-go-hiking-namibia', 'namibia-speed-hiking',
     'Windhoek', 'Khomas', '/sports/speed-hiking.jpg', 'https://www.letsgohikingnamibia.com.na/')
) AS v(name, slug, fed_slug, city, region, logo_url, website)
JOIN sportsplatform_federations f ON f.slug = v.fed_slug AND f.is_active = true
WHERE NOT EXISTS (
  SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = v.slug
);

INSERT INTO sportsplatform_athletes (
  first_name, last_name, slug, gender, photo_url, federation_id, nationality, achievements, is_active
)
SELECT v.first_name, v.last_name, v.slug, v.gender::gender, v.photo_url, f.id, v.nationality, v.achievements, true
FROM (
  VALUES
    -- NIIHA World Games 2025 bronze — Republikein / The Namibian / World Skate
    ('Christiaan', 'Coetzee', 'christiaan-coetzee-niiha', 'male', '/sports/ice-hockey.jpg',
     'namibia-ice-inline-hockey', 'Namibian',
     'Captain; scored to seal Namibia''s 3–2 bronze win over France at World Games 2025 (Chengdu). Source: https://www.republikein.com.na/sport-wrap-main/small-nation-big-heart-joy-over-bronze-at-world-games2025-08-12166754'),
    ('JW', 'Coetzee', 'jw-coetzee-niiha', 'male', '/sports/ice-hockey.jpg',
     'namibia-ice-inline-hockey', 'Namibian',
     'Opened scoring in Namibia''s World Games 2025 bronze final vs France. Source: https://www.republikein.com.na/sport-wrap-main/small-nation-big-heart-joy-over-bronze-at-world-games2025-08-12166754'),
    ('Keanan', 'Simpson', 'keanan-simpson-niiha', 'male', '/sports/ice-hockey.jpg',
     'namibia-ice-inline-hockey', 'Namibian',
     'Extended Namibia''s lead in World Games 2025 bronze final vs France. Source: https://www.republikein.com.na/sport-wrap-main/small-nation-big-heart-joy-over-bronze-at-world-games2025-08-12166754'),
    ('Armandus', 'Röttcher', 'armandus-rottcher-niiha', 'male', '/sports/ice-hockey.jpg',
     'namibia-ice-inline-hockey', 'Namibian',
     'Assisted captain Christiaan Coetzee''s bronze-clinching goal at World Games 2025. Source: https://www.republikein.com.na/sport-wrap-main/small-nation-big-heart-joy-over-bronze-at-world-games2025-08-12166754'),
    ('Arian', 'van der Plas', 'arian-van-der-plas-niiha', 'male', '/sports/ice-hockey.jpg',
     'namibia-ice-inline-hockey', 'Namibian',
     'Goalkeeper; ~94% save rate (31/33) in World Games 2025 bronze final vs France. Source: https://www.republikein.com.na/sport-wrap-main/small-nation-big-heart-joy-over-bronze-at-world-games2025-08-12166754')
) AS v(first_name, last_name, slug, gender, photo_url, fed_slug, nationality, achievements)
JOIN sportsplatform_federations f ON f.slug = v.fed_slug AND f.is_active = true
WHERE NOT EXISTS (
  SELECT 1 FROM sportsplatform_athletes a WHERE a.slug = v.slug
);

INSERT INTO sportsplatform_news_articles
  (title, slug, summary, content, federation_id, category, tags, featured_image, is_published, published_at)
VALUES
(
  'Oniipa Skatepark Expands Youth Skateboarding Hub',
  'skn-oniipa-skatepark-deluded-bros-2025',
  'Deluded Bros Arthouse''s Oniipa skatepark continues to grow as a free community hub for Namibian skaters.',
  E'Kondja Shaimemanya and Deluded Bros Arthouse built the Oniipa skatepark in 2021 to give local kids a place to skate, connect and find hope through skateboarding. The free park near a floodplain play area has drawn hundreds of visitors and support from Rollbrett Mission, SkateAid (Germany) and Blue Tomato (Austria), while still needing more decks and safety gear as numbers grow.

Original summary for sports.com.na. Source: https://www.namibiansun.com/sports/oniipa-skatepark-expands-its-reach2025-01-10144944',
  (SELECT id FROM sportsplatform_federations WHERE slug = 'skateboarding-namibia'),
  'skateboarding',
  ARRAY['SKN','Oniipa','Deluded Bros','skatepark'],
  '/sports/skateboarding-action.jpg',
  true,
  '2025-01-10 12:00:00'
),
(
  'FootGolf Namibia Launches as NSC-Recognised Code',
  'nfgf-footgolf-namibia-launch-2025',
  'FootGolf Namibia launched at Windhoek Golf Club with Deputy Minister Dino Ballotti and continental partners present.',
  E'FootGolf Namibia — chaired by Chalo Chainda — was officially launched as the country''s newest hybrid golf/football code, becoming the 57th federation recognised under the Namibia Sports Commission. Deputy Minister Dino Ballotti and FootGolf South Africa / African FootGolf Association president Norman Mphake highlighted inclusivity and the need to adapt golf courses for the sport.

Original summary for sports.com.na. Source: https://neweralive.na/footgolf-new-sport-on-the-block/',
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-footgolf'),
  'footgolf',
  ARRAY['NFGF','FootGolf','NSC','Windhoek Golf Club'],
  '/sports/golf.jpg',
  true,
  '2025-07-08 12:00:00'
),
(
  'Combat Club Windhoek Fuels Muay Thai Growth',
  'nmtf-combat-club-windhoek-muay-thai',
  'Combat Club Windhoek, founded by Pedro Costa, brings open-air Muay Thai training to more than 100 members.',
  E'Combat Club Windhoek trains Muay Thai with music-backed open-air sessions in Pionierspark, founded in 2016 by Pedro Costa and Sheila Martins. The club has grown past 100 members and affiliates with national combat-sport structures as Muay Thai develops under Namibia''s IFMA-pathway federation.

Original summary for sports.com.na. Source: https://www.namibian.com.na/get-your-muay-thai-on/',
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-muaythai'),
  'muaythai',
  ARRAY['NMTF','Combat Club','Muay Thai','Windhoek'],
  '/sports/muaythai.jpg',
  true,
  '2018-06-01 12:00:00'
),
(
  'Mountain Club of Namibia Anchors Climbing and Hiking Access',
  'nm-mountain-club-namibia-mcsa-section',
  'The Mountain Club of Namibia (MCSA Namibia section) maintains climbing and hiking access and facilitates outdoor meets.',
  E'The Mountain Club of Namibia operates as the MCSA Namibia section — a community for rock climbing, bouldering and hiking that works to keep access open and run outdoor meets for members and guests. MCSA is affiliated with the UIAA; Namibia participates as a direct MCSA section.

Original summary for sports.com.na. Source: https://www.mcnam.org/',
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-mountaineering'),
  'mountaineering',
  ARRAY['NM','Mountain Club','MCSA','UIAA'],
  '/sports/mountaineering.jpg',
  true,
  '2025-01-15 10:00:00'
),
(
  'Softball Namibia Returns to Zone 6 Competition',
  'nsb-softball-namibia-zone-6-return',
  'After a seven-year international absence, Namibia''s men''s softball side returned at Zone 6 in Lesotho.',
  E'Namibia finished last at Zone 6 fast-pitch softball in Maseru after a long absence, but association leadership (Beukes) called the youthful squad''s effort a stepping stone, noting praise from Botswana, South Africa and Lesotho opponents and Sanlam Namibia''s support for the tour.

Original summary for sports.com.na. Source: https://www.namibian.com.na/learning-curve-for-namibian-softball/',
  (SELECT id FROM sportsplatform_federations WHERE slug = 'softball-namibia'),
  'softball',
  ARRAY['NSB','Zone 6','softball'],
  '/sports/softball.jpg',
  true,
  '2012-06-15 12:00:00'
),
(
  'Namibia Inline Hockey Takes World Games Bronze in Chengdu',
  'niiha-world-games-bronze-chengdu-2025',
  'Namibia defeated France 3–2 to claim historic inline hockey bronze at the 2025 World Games.',
  E'Namibia''s young senior men''s inline hockey team beat France 3–2 in Chengdu for World Games bronze after earlier wins over Chinese Taipei and host China. JW Coetzee, Keanan Simpson and captain Christiaan Coetzee scored in the bronze final; goalkeeper Arian van der Plas made 31 saves. NIIHA and World Skate coverage called it a landmark for Namibian hockey.

Original summary for sports.com.na. Source: https://www.republikein.com.na/sport-wrap-main/small-nation-big-heart-joy-over-bronze-at-world-games2025-08-12166754',
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-ice-inline-hockey'),
  'inline-hockey',
  ARRAY['NIIHA','World Games','Chengdu','bronze'],
  '/sports/ice-hockey.jpg',
  true,
  '2025-08-12 12:00:00'
)
ON CONFLICT (slug) DO NOTHING;
