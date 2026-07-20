-- WHY: Events pass 4 - verified 2024-2027 events for remaining zero-event federations
-- (fistball, horse racing, fencing, bodybuilding, canoe/rowing, waterski, WMG,
-- MMA, kickboxing, darts, indigenous/traditional, skateboarding).
-- Sources in docs/research/events_enrichment_batch.md. Never invents dates.
-- Applied 2026-07-20.

INSERT INTO sportsplatform_events
  (name, slug, description, type, start_date, end_date, location, region, poster_url, is_published, federation_id)
VALUES
-- ===== Fistball =====
(
  'Cohen Cup Fistball Tournament 2025',
  'cohen-cup-fistball-2025',
  'Annual Cohen Cup at Cohen Fistball Club; hosts CFC 1 won first title since 2018. Source: https://www.namibiansun.com/sport-wrap-main/exciting-victories-at-the-cohen-cup-20252025-10-14173659',
  'tournament', '2025-10-11', '2025-10-11',
  'Cohen Fistball Club, Windhoek', 'Khomas',
  NULL, true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'fistball-namibia')
),
(
  'African Marketing Fistball National Cup 2025',
  'fistball-national-cup-2025',
  'National Cup in Swakopmund; Cohen FC 1 defended Category A title vs SFC 1. Source: https://www.namibiansun.com/sport-wrap-main/cohen-fc-and-skw3-win-tourney2025-11-11176508',
  'tournament', '2025-11-08', '2025-11-08',
  'Swakopmund', 'Erongo',
  NULL, true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'fistball-namibia')
),
(
  'Ball-Balla Fistball Tournament 2025',
  'ball-balla-fistball-2025',
  'Ball-Balla fistball tournament (announced after National Cup). Source: https://www.namibiansun.com/sport-wrap-main/cohen-fc-and-skw3-win-tourney2025-11-11176508',
  'tournament', '2025-12-20', '2025-12-20',
  'Namibia', 'National',
  NULL, true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'fistball-namibia')
),
(
  'International Cohen Fistball Tournament 2026',
  'cohen-fistball-tournament-2026',
  'Cohen Fistball Club 60th anniversary international tournament; NLV Stuttgart-Vaihingen beat TSV Calw in final. Source: https://www.namibian.com.na/nlv-stuttgart-vaihingen-taste-victory-at-fistball-feast/ ; https://www.republikein.com.na/fistball-sw/fistball-tourney-thrills-nmh009450-11-10966',
  'tournament', '2026-04-11', '2026-04-11',
  'Cohen Fistball Club, Windhoek', 'Khomas',
  NULL, true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'fistball-namibia')
),

-- ===== Horse racing (NHRA) =====
(
  'NHRA Independence Cup 2026',
  'nhra-independence-cup-2026',
  'Namibia Horse Racing Association 2026 season opener (17 races) on Independence Day. Source: https://www.namibian.com.na/woodland-ridge-katiti-komambo-gallop-to-victory/ ; https://www.republikein.com.na/horse-racing-sw/top-performances-headline-independence-cup-in-gobabis-nmh008362-11-9438',
  'competition', '2026-03-21', '2026-03-21',
  'Gobabis', 'Omaheke',
  '/sports/horse-racing.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-horse-racing')
),
(
  'Castlebet July Cup 2026',
  'castlebet-july-cup-2026',
  'Premier NHRA race day (19 races; Castlebet Cup 2200m feature). Source: https://www.republikein.com.na/sport-wrap-main/castlebet-july-cup-promises-thrilling-race-day-in-rehoboth-NMH013084-11-16084 ; Sport Wrap Facebook 4 Jul 2026',
  'competition', '2026-07-04', '2026-07-04',
  'Rehoboth race track', 'Hardap',
  '/sports/horse-racing.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-horse-racing')
),

-- ===== Fencing =====
(
  'Easter Club Challenge Gaborone 2026 (Namibia)',
  'fencing-easter-club-challenge-2026',
  'Namibian fencers won three bronzes at Thobega Fencing Academy Easter Club Challenge. Source: https://neweralive.na/namibia-secures-bronze-in-gaborone/',
  'competition', '2026-03-28', '2026-03-28',
  'Gaborone, Botswana', 'International',
  '/sports/fencing.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'fencing-namibia')
),

-- ===== Bodybuilding (WFF Namibia) =====
(
  'WFF Africa Continental Pro Qualifier Lusaka 2025 (Namibia)',
  'wff-africa-qualifier-lusaka-2025',
  'WFF Africa Continental Bodybuilding Pro Qualifier; Mututo gold, Mbuyi silver for Namibia. Source: https://diggers.news/goal-diggers/2025/09/20/zambia-ready-to-host-africas-premier-bodybuilding-championship-wff/ ; https://www.namibiansun.com/sport-wrap-main/mututo-mbuyi-win-gold-and-silver-medals-in-lusaka2025-11-19177593',
  'competition', '2025-11-15', '2025-11-15',
  'Mulungushi International Conference Centre, Lusaka', 'International',
  '/sports/bodybuilding.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'bodybuilding-namibia')
),

-- ===== Canoeing / Rowing =====
(
  'Coastal Rowing Sprints Championship Cape Town 2026 (Namibia)',
  'coastal-rowing-sprints-cape-town-2026',
  'Namibia national rowing team historic debut at Coastal Rowing Sprints (NNOC/NSC send-off). Source: https://informante.web.na/?p=396782',
  'competition', '2026-06-27', '2026-06-28',
  'Cape Town, South Africa', 'International',
  '/sports/rowing.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-canoeing')
),

-- ===== Western Mounted Games =====
(
  'Western Mounted Games Gobabis Debut 2026',
  'western-mounted-games-gobabis-2026',
  'First Western Mounted Games event in Gobabis (precision riding / agility). Source: https://www.whatsonnamibia.com/events/event/western-mounted-games-gobabis/2026-06-20',
  'competition', '2026-06-20', '2026-06-20',
  'Gobabis', 'Omaheke',
  '/sports/equestrian.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-western-mounted-games')
),

-- ===== Waterski =====
(
  'Namibia Waterski Nationals 2026',
  'namibia-waterski-nationals-2026',
  'IWWF-listed Namibia Nationals at Von Bach (26NAM006). Source: https://www.iwwfed-ea.org/classic/competitions/2026 ; https://ems.iwwf.sport/Site/Details?Id=330',
  'competition', '2026-02-28', '2026-02-28',
  'Von Bach Dam, Okahandja', 'Otjozondjupa',
  '/sports/waterski.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-waterski')
),
(
  'IWWF All Africa Water Ski Championships 2026',
  'iwwf-all-africa-waterski-2026',
  'Biennial All Africa Championships hosted at Von Bach; Namibia Best Team overall. Source: https://ems.iwwf.sport/Competitions/Details/b9beb616-8bfe-4e4d-a35b-8b3f86ce0174 ; https://www.republikein.com.na/other-sw/namibia-crowned-all-africa-water-ski-champions-nmh009166-11-10558',
  'tournament', '2026-04-02', '2026-04-06',
  'Von Bach Dam, Okahandja', 'Otjozondjupa',
  '/sports/waterski.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-waterski')
),

-- ===== MMA =====
(
  'IMMAF African Championships 2024 Windhoek',
  'immaf-african-champs-windhoek-2024',
  'IMMAF African Championships hosted by MMA Namibia (Youth + Senior). Source: https://immaf.org/championship/2024-immaf-african-championships/',
  'tournament', '2024-05-27', '2024-06-01',
  'Windhoek', 'Khomas',
  '/sports/martial-arts-mma.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'mixed-martial-arts-namibia')
),
(
  'IMMAF African Championships 2025 Luanda (Namibia)',
  'immaf-african-champs-luanda-2025',
  'Namibia youth/senior contingent at IMMAF Africa Championships Angola. Source: https://immaf.org/championship/2025-immaf-african-championships/ ; https://www.namibian.com.na/namibia-sends-emerging-mma-talent-to-angola/',
  'tournament', '2025-05-04', '2025-05-10',
  'Pavilhao Multiusos do Kilamba, Luanda', 'International',
  '/sports/martial-arts-mma.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'mixed-martial-arts-namibia')
),

-- ===== Kickboxing =====
(
  'Desert Storm 5 International 2024',
  'desert-storm-5-kickboxing-2024',
  'NKF Desert Storm 5 International (kickboxing, jiu-jitsu) at Jan Wilken. Source: https://www.namibiansun.com/sport-wrap-main/hard-knocks-and-strikes-this-weekend2024-06-27121771 ; Namib Times / NSC coverage 28-29 Jun',
  'tournament', '2024-06-28', '2024-06-29',
  'Jan Wilken Indoor Sports Complex, Walvis Bay', 'Erongo',
  '/sports/kickboxing.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-kickboxing')
),
(
  'Desert Storm 6 International Kickboxing 2025',
  'desert-storm-6-kickboxing-2025',
  'NKF Desert Storm 6 at Jan Wilken; Muller brothers defended Sub-Saharan titles (70+ competitors, 7 nations). Source: Sport Wrap 14 Jul 2025 (https://fliphtml5.com/jxto/ueor/SPORT_WRAP_20250714/) ; https://www.namibiansun.com/sport-wrap-main/muller-brothers-kick-up-a-storm2025-07-14163333',
  'tournament', '2025-07-12', '2025-07-12',
  'Jan Wilken Indoor Sports Complex, Walvis Bay', 'Erongo',
  '/sports/kickboxing.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-kickboxing')
),

-- ===== Darts =====
(
  'AUSC Region 5 Darts Championships 2025 (Namibia)',
  'ausc-region5-darts-2025',
  'AUSC Region 5 Darts Tournament Mazowe; Namibia team aimed for gold. Source: https://neweralive.na/namibia-aims-for-gold-at-darts-championship/ ; https://namibiadarts.com/calendar',
  'tournament', '2025-08-26', '2025-08-29',
  'Mazowe, Zimbabwe', 'International',
  '/sports/darts-action.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-darts')
),

-- ===== Indigenous / traditional sports =====
(
  'Nama Cultural Festival Traditional Sports Showcase 2025',
  'nama-festival-traditional-sports-2025',
  'NTSGF traditional sports showcase at Nama Cultural Festival (Amagoes, Owela, Skululu, Uma, etc.). Source: https://www.confidentenamibia.com/nama-festival-showcase-traditional-sports',
  'other', '2025-05-29', '2025-06-01',
  'Keetmanshoop', 'Karas',
  NULL, true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'indigenous-combat-sport')
),

-- ===== Skateboarding =====
(
  'Swatch ULT.X Skateboarding Qualifiers 2025 (Namibia)',
  'swatch-ultx-skate-qualifiers-2025',
  'Namibian skaters (e.g. Gordon Scheepers, Hanro Esterhuizen) at Swatch ULT.X Cape Town. Source: https://ultimatex.co.za/swatch-ult-x-2025-were-back/ ; https://www.theboardr.com/results/14250/Swatch-Ultimate-X-Skateboarding-Qualifiers',
  'competition', '2025-11-21', '2025-11-22',
  'Battery Park, V&A Waterfront, Cape Town', 'International',
  '/sports/skateboarding-action.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'skateboarding-namibia')
)
ON CONFLICT (slug) DO NOTHING;
