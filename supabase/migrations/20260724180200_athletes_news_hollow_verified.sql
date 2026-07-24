-- Hollow Athletes + News fill (2026-07-24).
-- WHY: NESA/NIIHA/cue/darts/TKD/fistball tabs empty despite named public sources.
-- Photos: sport-matched /sports/* only. Idempotent by athlete/news slug.
-- Evidence: docs/research/crests_hollow_fill_batch_20260724.md

INSERT INTO sportsplatform_athletes (
  first_name, last_name, slug, gender, photo_url, federation_id, nationality, achievements, is_active
)
SELECT v.first_name, v.last_name, v.slug, v.gender::gender, v.photo_url, f.id, v.nationality, v.achievements, true
FROM (
  VALUES
    -- NESA Dota 2 national roster — official NESA announcement
    ('Corne', 'Agenbag', 'corne-agenbag', 'male', '/sports/esports.jpg', 'namibia-esports', 'Namibian',
     'Team Namibia Dota 2 Position 1 (BlitZ) for IESF African Regional Qualifiers. Source: https://esportsnamibia.org/team-namibia-dota-2-ready-to-defend-the-ancient/'),
    ('Nathan', 'Duarte', 'nathan-duarte', 'male', '/sports/esports.jpg', 'namibia-esports', 'Namibian',
     'Team Namibia Dota 2 Position 2 mid (Dr.OG) for IESF African Regional Qualifiers. Source: https://esportsnamibia.org/team-namibia-dota-2-ready-to-defend-the-ancient/'),
    ('Mauro', 'Teles', 'mauro-teles', 'male', '/sports/esports.jpg', 'namibia-esports', 'Namibian',
     'Team Namibia Dota 2 Position 3 offlaner (PoRRa07) for IESF African Regional Qualifiers. Source: https://esportsnamibia.org/team-namibia-dota-2-ready-to-defend-the-ancient/'),
    ('Jurgen', 'Teichert', 'jurgen-teichert', 'male', '/sports/esports.jpg', 'namibia-esports', 'Namibian',
     'Team Namibia Dota 2 Position 4 soft support (Phycodamage) for IESF African Regional Qualifiers. Source: https://esportsnamibia.org/team-namibia-dota-2-ready-to-defend-the-ancient/'),
    ('Jonathan', 'Calitz', 'jonathan-calitz', 'male', '/sports/esports.jpg', 'namibia-esports', 'Namibian',
     'Team Namibia Dota 2 Position 5 hard support (de_fy) for IESF African Regional Qualifiers. Source: https://esportsnamibia.org/team-namibia-dota-2-ready-to-defend-the-ancient/'),

    -- Taekwondo — New Era (World Championships debut)
    ('Owen', 'Samunzala', 'owen-samunzala', 'male', '/sports/taekwondo.jpg', 'taekwondo-namibia', 'Namibian',
     'Namibia''s first World Taekwondo Championships representative (Wuxi 2025). Source: https://neweralive.na/namibias-taekwondo-federation-eyes-global-stage/'),

    -- Darts — The Namibian national-team selection (named best players + squad)
    ('Gavin', 'van der Hoven', 'gavin-van-der-hoven', 'male', '/sports/darts-action.jpg', 'namibia-darts', 'Namibian',
     'Best male player at Namibia Darts Federation national championships; selected for Zone Six Darts Championships. Source: https://www.namibian.com.na/namibia-assembles-darts-team/'),
    ('Annalize', 'van Brakel', 'annalize-van-brakel', 'female', '/sports/darts-action.jpg', 'namibia-darts', 'Namibian',
     'Best female player at Namibia Darts Federation national championships; selected for Zone Six women''s team. Source: https://www.namibian.com.na/namibia-assembles-darts-team/'),
    ('Berni', 'Fest', 'berni-fest', 'male', '/sports/darts-action.jpg', 'namibia-darts', 'Namibian',
     'Selected to Namibia men''s national darts team (Zone Six Championships). Source: https://www.namibian.com.na/namibia-assembles-darts-team/'),
    ('Desiree', 'Gomases', 'desiree-gomases', 'female', '/sports/darts-action.jpg', 'namibia-darts', 'Namibian',
     'Selected to Namibia women''s national darts team (Zone Six Championships). Source: https://www.namibian.com.na/namibia-assembles-darts-team/'),

    -- Cue sports — Namibian Sun Champ of Champs / Black Ball League awards
    ('Likeus', 'Naujoma', 'likeus-naujoma', 'male', '/sports/billiards-action.jpg', 'billiards-snooker-namibia', 'Namibian',
     'Men''s Player of the Tournament, NCSF Champ of Champs (Coastal Warriors, Swakopmund). Source: https://www.namibiansun.com/sport-wrap-main/top-cueists-crowned-at-ncsf-champ-of-champs2025-12-05179141'),
    ('Jeanine', 'Kloppers', 'jeanine-kloppers', 'female', '/sports/billiards-action.jpg', 'billiards-snooker-namibia', 'Namibian',
     'Women''s Player of the Tournament, NCSF Champ of Champs (Queen Cues). Source: https://www.namibiansun.com/sport-wrap-main/top-cueists-crowned-at-ncsf-champ-of-champs2025-12-05179141'),
    ('Steven', 'Sakaria', 'steven-sakaria', 'male', '/sports/billiards-action.jpg', 'billiards-snooker-namibia', 'Namibian',
     'President''s Cup winner, NCSF Champ of Champs (Tura Boys, Windhoek). Source: https://www.namibiansun.com/sport-wrap-main/top-cueists-crowned-at-ncsf-champ-of-champs2025-12-05179141'),
    ('Anel', 'Brink', 'anel-brink', 'female', '/sports/billiards-action.jpg', 'billiards-snooker-namibia', 'Namibian',
     'Third-best player award, NCSF Champ of Champs (Queen Cues). Source: https://www.namibiansun.com/sport-wrap-main/top-cueists-crowned-at-ncsf-champ-of-champs2025-12-05179141'),
    ('Jurgen', 'Uirab', 'jurgen-uirab', 'male', '/sports/billiards-action.jpg', 'billiards-snooker-namibia', 'Namibian',
     'Outstanding National Black Ball League player (King Cues). Source: https://www.namibiansun.com/sport-wrap-main/top-cueists-crowned-at-ncsf-champ-of-champs2025-12-05179141')
) AS v(first_name, last_name, slug, gender, photo_url, fed_slug, nationality, achievements)
JOIN sportsplatform_federations f ON f.slug = v.fed_slug AND f.is_active = true
WHERE NOT EXISTS (
  SELECT 1 FROM sportsplatform_athletes a WHERE a.slug = v.slug
);

-- Link cue athletes to named clubs where press named the club
UPDATE sportsplatform_athletes a
SET club_id = c.id, updated_at = now()
FROM sportsplatform_clubs c
WHERE a.club_id IS NULL AND (
  (a.slug = 'likeus-naujoma' AND c.slug = 'coastal-warriors-cue')
  OR (a.slug IN ('jeanine-kloppers', 'anel-brink') AND c.slug = 'queen-cues')
  OR (a.slug = 'steven-sakaria' AND c.slug = 'tura-boys-cue')
  OR (a.slug = 'jurgen-uirab' AND c.slug = 'king-cues')
);

INSERT INTO sportsplatform_news_articles
  (title, slug, summary, content, federation_id, category, tags, featured_image, is_published, published_at)
VALUES
(
  'Team Namibia Dota 2 Named for IESF African Qualifiers',
  'nesa-team-namibia-dota-2-iesf-african-qualifiers',
  'NESA unveiled a five-player Dota 2 roster for the IESF African Regional Qualifiers, backed by MTC.',
  E'The Namibian Electronic Sports Association (NESA) announced Team Namibia''s Dota 2 roster for the IESF African Regional Qualifiers: Corne \"BlitZ\" Agenbag, Nathan \"Dr.OG\" Duarte, Mauro \"PoRRa07\" Teles, Jurgen \"Phycodamage\" Teichert and Jonathan \"de_fy\" Calitz.

NESA thanked MTC for supporting the squad''s continental campaign toward the IESF World Championships pathway.

Original summary for sports.com.na. Source: https://esportsnamibia.org/team-namibia-dota-2-ready-to-defend-the-ancient/',
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-esports'),
  'esports',
  ARRAY['NESA','Dota 2','IESF','MTC'],
  '/sports/esports.jpg',
  true,
  '2025-06-20 10:00:00'
),
(
  'Owen Samunzala to Carry Namibia Flag at World Taekwondo Championships',
  'tkd-owen-samunzala-wuxi-world-championships-2025',
  'Namibia Taekwondo Federation sends Owen Samunzala to Wuxi 2025 after Seth Mabuza''s historic Zone 6 bronze.',
  E'Building on Seth Mabuza''s first international taekwondo medal for Namibia at the African Open Series in Maputo, the Namibia Taekwondo Federation confirmed Owen Samunzala as the country''s first World Taekwondo Championships representative in Wuxi, China (24–30 October 2025).

Federation president Siegfried Veii-Mujoro said the debut on the global stage matters for a young federation established in 2022.

Original summary for sports.com.na. Source: https://neweralive.na/namibias-taekwondo-federation-eyes-global-stage/',
  (SELECT id FROM sportsplatform_federations WHERE slug = 'taekwondo-namibia'),
  'taekwondo',
  ARRAY['TKD','Owen Samunzala','World Championships','Wuxi'],
  '/sports/taekwondo.jpg',
  true,
  '2025-10-15 09:00:00'
),
(
  'Namshooters Crown NCSF Champ of Champs Season',
  'ncsf-champ-of-champs-namshooters-2025',
  'Namshooters won the Champ of Champs team event and the National Black Ball League as cue sports closed its season in Windhoek.',
  E'The Namibia Cue Sports Federation crowned season winners at the Champ of Champs, with Namshooters (Windhoek) taking the team title ahead of Coastal Waves (Swakopmund) and Young Ones. Tura Boys finished fourth.

Individual awards included Likeus Naujoma (Men''s Player of the Tournament), Jeanine Kloppers (Women''s Player of the Tournament) and Steven Sakaria (President''s Cup). The Black Ball League also saw Namshooters finish first, with Rehoboth Pool Club second.

Original summary for sports.com.na. Source: https://www.namibiansun.com/sport-wrap-main/top-cueists-crowned-at-ncsf-champ-of-champs2025-12-05179141',
  (SELECT id FROM sportsplatform_federations WHERE slug = 'billiards-snooker-namibia'),
  'cue-sports',
  ARRAY['NCSF','Namshooters','Champ of Champs'],
  '/sports/billiards-action.jpg',
  true,
  '2025-12-05 12:00:00'
),
(
  'Dance Sport Namibia Crowns 2025 National Champions',
  'dsn-national-champions-crowned-2025',
  'Dance Sport Namibia selected national Hip-Hop and Latin representatives at the 2025 nationals covered by Republikein.',
  E'Dance Sport Namibia crowned national champions and named pathway athletes across Hip-Hop and Latin divisions at the 2025 nationals, with Codesync among the Windhoek clubs featured in coverage.

Named national Hip-Hop soloists included Yana Oosthuizen and Nicole Langerman; Latin selections included Edmund van Neel, Leona Oosthuizen, Nicolas Garrels and Odile Gertze.

Original summary for sports.com.na. Source: https://www.republikein.com.na/sport-wrap-main/dance-national-champions-crowned2025-11-25178128',
  (SELECT id FROM sportsplatform_federations WHERE slug = 'dance-sport-namibia'),
  'dance-sport',
  ARRAY['DSN','nationals','Codesync'],
  '/sports/dance-sport.jpg',
  true,
  '2025-11-25 12:00:00'
),
(
  'NIIHA Clubs Anchor Namibia Inline Hockey Pathway',
  'niiha-clubs-badgers-kamikaze-pirates-scorpions',
  'Four NIIHA clubs — Badgers, Kamikaze, Coastal Pirates and Scorpions — form the national inline hockey club structure.',
  E'The Namibia Ice and Inline Hockey Association lists four active clubs as the backbone of the sport: Badgers and Kamikaze in Windhoek, Coastal Pirates in Swakopmund (MTC Dome), and Scorpions in Otjiwarongo.

Badgers (founded 1999) specialises in junior development; Kamikaze (since 1995) marks three decades affiliated with DTS; Coastal Pirates celebrated 30 years in 2025; Scorpions continue a community-built rink pathway in Otjiwarongo. NIIHA is recognised by the Namibia Sports Commission and World Skate.

Original summary for sports.com.na. Source: https://niiha.com/the-clubs/',
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-ice-inline-hockey'),
  'inline-hockey',
  ARRAY['NIIHA','Badgers','Kamikaze','Coastal Pirates','Scorpions'],
  '/sports/ice-hockey.jpg',
  true,
  '2025-06-01 10:00:00'
)
ON CONFLICT (slug) DO NOTHING;
