-- Athletes + venues enrichment for beta depth (2026-07-20).
-- WHY: Live had 44 athletes (0% photos, broken slugs, duplicates) and 15 venues
-- (7 missing photos; /venues/* paths were not on disk). Adds notable verified
-- Namibian athletes with paraphrased public bios + source links in achievements;
-- sport-correct photos (/athletes/* Wikimedia where available, else /sports/*);
-- major venues to ≥25 active. Never invents medals/stats.
-- Evidence: docs/research/athletes_venues_enrichment_batch.md

-- ===== ATHLETES: soft-deactivate clear duplicates (keep richer nationality rows) =====
UPDATE sportsplatform_athletes SET is_active = false, updated_at = now()
WHERE id IN (2, 3, 7, 8, 9, 10, 12, 19, 27)
  AND is_active = true;

-- ===== ATHLETES: fix broken slugs (first letter was stripped) =====
UPDATE sportsplatform_athletes SET slug = 'frankie-fredericks', updated_at = now() WHERE id = 1;
UPDATE sportsplatform_athletes SET slug = 'johannes-nambala', updated_at = now() WHERE id = 4;
UPDATE sportsplatform_athletes SET slug = 'ananias-shikongo', updated_at = now() WHERE id = 5;
UPDATE sportsplatform_athletes SET slug = 'jonas-jonas', updated_at = now() WHERE id = 6;
UPDATE sportsplatform_athletes SET slug = 'jj-smit', updated_at = now() WHERE id = 11;
UPDATE sportsplatform_athletes SET slug = 'absalom-iimbondi', updated_at = now() WHERE id = 13;
UPDATE sportsplatform_athletes SET slug = 'dynamo-fredericks', updated_at = now() WHERE id = 14;
UPDATE sportsplatform_athletes SET slug = 'petrus-kamutuezu', updated_at = now() WHERE id = 15;
UPDATE sportsplatform_athletes SET slug = 'wian-conradie', updated_at = now() WHERE id = 16;
UPDATE sportsplatform_athletes SET slug = 'darryl-de-la-harpe', updated_at = now() WHERE id = 17;
UPDATE sportsplatform_athletes SET slug = 'torsten-van-jaarsveld', updated_at = now() WHERE id = 18;
UPDATE sportsplatform_athletes SET slug = 'julius-indongo', updated_at = now() WHERE id = 20;
UPDATE sportsplatform_athletes SET slug = 'paulus-moses', updated_at = now() WHERE id = 21;
UPDATE sportsplatform_athletes SET slug = 'philip-seidler', updated_at = now() WHERE id = 22;
UPDATE sportsplatform_athletes SET slug = 'helalia-johannes', updated_at = now() WHERE id = 23;
UPDATE sportsplatform_athletes SET slug = 'nico-dreyer', updated_at = now() WHERE id = 24;
UPDATE sportsplatform_athletes SET slug = 'christine-mboma', updated_at = now() WHERE id = 25;
UPDATE sportsplatform_athletes SET slug = 'beatrice-masilingi', updated_at = now() WHERE id = 26;
UPDATE sportsplatform_athletes SET slug = 'jonas-junius', updated_at = now() WHERE id = 28;
UPDATE sportsplatform_athletes SET slug = 'gerhard-erasmus', updated_at = now() WHERE id = 29;
UPDATE sportsplatform_athletes SET slug = 'jan-frylinck', updated_at = now() WHERE id = 30;
UPDATE sportsplatform_athletes SET slug = 'ruben-trumpelmann', updated_at = now() WHERE id = 31;
UPDATE sportsplatform_athletes SET slug = 'david-wiese', updated_at = now() WHERE id = 32;
UPDATE sportsplatform_athletes SET slug = 'peter-shalulile', updated_at = now() WHERE id = 33;
UPDATE sportsplatform_athletes SET slug = 'deon-hotto', updated_at = now() WHERE id = 34;
UPDATE sportsplatform_athletes SET slug = 'charles-hambira', updated_at = now() WHERE id = 35;
UPDATE sportsplatform_athletes SET slug = 'emma-nzaramba', updated_at = now() WHERE id = 36;
UPDATE sportsplatform_athletes SET slug = 'cliven-loubser', updated_at = now() WHERE id = 37;
UPDATE sportsplatform_athletes SET slug = 'johan-deysel', updated_at = now() WHERE id = 38;
UPDATE sportsplatform_athletes SET slug = 'renaldo-bothma', updated_at = now() WHERE id = 39;
UPDATE sportsplatform_athletes SET slug = 'naomi-ruele', updated_at = now() WHERE id = 40;
UPDATE sportsplatform_athletes SET slug = 'mikkel-samson', updated_at = now() WHERE id = 41;
UPDATE sportsplatform_athletes SET slug = 'junias-nambili', updated_at = now() WHERE id = 42;
UPDATE sportsplatform_athletes SET slug = 'lotta-reinefeld', updated_at = now() WHERE id = 43;
UPDATE sportsplatform_athletes SET slug = 'nicola-bayer', updated_at = now() WHERE id = 44;

-- Philip Seidler is open-water swimming (NASFED), not skateboarding
UPDATE sportsplatform_athletes
SET federation_id = 35, nationality = COALESCE(nationality, 'Namibian'), updated_at = now()
WHERE id = 22;

-- Paralympic athletes → NPC
UPDATE sportsplatform_athletes
SET federation_id = 24, nationality = COALESCE(nationality, 'Namibian'), updated_at = now()
WHERE id IN (4, 5) AND is_active = true;

-- Nationality backfill on keepers
UPDATE sportsplatform_athletes
SET nationality = 'Namibian', updated_at = now()
WHERE is_active = true AND (nationality IS NULL OR nationality = '');

-- ===== ATHLETES: photos (Wikimedia portrait where saved; else sport-correct /sports/*) =====
UPDATE sportsplatform_athletes SET photo_url = '/athletes/frankie-fredericks.jpg', updated_at = now()
WHERE id = 1 AND is_active = true;

UPDATE sportsplatform_athletes SET photo_url = '/sports/athletics.jpg', updated_at = now()
WHERE id IN (23, 25, 26, 28, 6) AND is_active = true
  AND (photo_url IS NULL OR photo_url = '');

UPDATE sportsplatform_athletes SET photo_url = '/sports/athletics-alt.jpg', updated_at = now()
WHERE id IN (4, 5) AND is_active = true
  AND (photo_url IS NULL OR photo_url = '');

UPDATE sportsplatform_athletes SET photo_url = '/sports/cricket.jpg', updated_at = now()
WHERE id IN (11, 29, 30, 31, 32) AND is_active = true
  AND (photo_url IS NULL OR photo_url = '');

UPDATE sportsplatform_athletes SET photo_url = '/sports/football.jpg', updated_at = now()
WHERE id IN (13, 14, 15, 33, 34, 35, 36) AND is_active = true
  AND (photo_url IS NULL OR photo_url = '');

UPDATE sportsplatform_athletes SET photo_url = '/sports/rugby.jpg', updated_at = now()
WHERE id IN (16, 17, 18, 37, 38, 39) AND is_active = true
  AND (photo_url IS NULL OR photo_url = '');

UPDATE sportsplatform_athletes SET photo_url = '/sports/boxing.jpg', updated_at = now()
WHERE id IN (20, 21) AND is_active = true
  AND (photo_url IS NULL OR photo_url = '');

UPDATE sportsplatform_athletes SET photo_url = '/sports/swimming.jpg', updated_at = now()
WHERE id IN (22, 40, 41) AND is_active = true
  AND (photo_url IS NULL OR photo_url = '');

UPDATE sportsplatform_athletes SET photo_url = '/sports/volleyball.jpg', updated_at = now()
WHERE id = 42 AND is_active = true AND (photo_url IS NULL OR photo_url = '');

UPDATE sportsplatform_athletes SET photo_url = '/sports/judo.jpg', updated_at = now()
WHERE id = 43 AND is_active = true AND (photo_url IS NULL OR photo_url = '');

UPDATE sportsplatform_athletes SET photo_url = '/sports/tennis.jpg', updated_at = now()
WHERE id = 44 AND is_active = true AND (photo_url IS NULL OR photo_url = '');

UPDATE sportsplatform_athletes SET photo_url = '/sports/golf.jpg', updated_at = now()
WHERE id = 24 AND is_active = true AND (photo_url IS NULL OR photo_url = '');

-- ===== ATHLETES: enrich flagship bios with source links (paraphrases only) =====
UPDATE sportsplatform_athletes SET
  achievements = 'Namibian sprint legend: four Olympic silver medals (100m/200m, Barcelona 1992 and Atlanta 1996) and a long-time African record holder over 100m and 200m. Later served in World Athletics leadership. Source: https://en.wikipedia.org/wiki/Frankie_Fredericks',
  updated_at = now()
WHERE id = 1;

UPDATE sportsplatform_athletes SET
  achievements = 'Sprinter; Olympic silver medallist in the women''s 200m at Tokyo 2020 and a standout World U20 performer. Source: https://en.wikipedia.org/wiki/Christine_Mboma',
  updated_at = now()
WHERE id = 25;

UPDATE sportsplatform_athletes SET
  achievements = 'Sprinter; Olympic 200m finalist at Tokyo 2020 and a regular on the African championship circuit. Source: https://en.wikipedia.org/wiki/Beatrice_Masilingi',
  updated_at = now()
WHERE id = 26;

UPDATE sportsplatform_athletes SET
  achievements = 'Marathon specialist; Commonwealth Games marathon bronze medallist (Birmingham 2022) and multiple-time national marathon champion. Source: https://en.wikipedia.org/wiki/Helalia_Johannes',
  updated_at = now()
WHERE id = 23;

UPDATE sportsplatform_athletes SET
  achievements = 'Captain of Namibia''s national cricket side; led Namibia at ICC T20 World Cups and is a long-serving batting mainstay. Source: https://en.wikipedia.org/wiki/Gerhard_Erasmus',
  updated_at = now()
WHERE id = 29;

UPDATE sportsplatform_athletes SET
  achievements = 'Forward for the Brave Warriors; multiple PSL Golden Boot seasons with Mamelodi Sundowns and Namibia''s highest-profile active footballer. Source: https://en.wikipedia.org/wiki/Peter_Shalulile',
  updated_at = now()
WHERE id = 33;

UPDATE sportsplatform_athletes SET
  achievements = 'Former unified light-welterweight world champion (IBF and WBA titles). Source: https://en.wikipedia.org/wiki/Julius_Indongo',
  updated_at = now()
WHERE id = 20;

UPDATE sportsplatform_athletes SET
  achievements = 'Former WBA lightweight world champion; one of Namibia''s pioneering professional boxing champions. Source: https://en.wikipedia.org/wiki/Paulus_Moses',
  updated_at = now()
WHERE id = 21;

UPDATE sportsplatform_athletes SET
  achievements = 'Paralympic sprint champion for Namibia; multiple Paralympic and World Para Athletics medals in T11/T12 events. Source: https://en.wikipedia.org/wiki/Johannes_Nambala',
  updated_at = now()
WHERE id = 4;

UPDATE sportsplatform_athletes SET
  achievements = 'Paralympic sprint gold medallist for Namibia; multiple World Para Athletics Championship medals. Source: https://en.wikipedia.org/wiki/Ananias_Shikongo',
  updated_at = now()
WHERE id = 5;

UPDATE sportsplatform_athletes SET
  achievements = 'Open-water swimmer who represented Namibia at the Olympic Games (10 km marathon swim). Source: https://en.wikipedia.org/wiki/Phillip_Seidler',
  updated_at = now()
WHERE id = 22;

UPDATE sportsplatform_athletes SET
  achievements = 'Most-capped Welwitschias centre; three Rugby World Cup campaigns for Namibia. Source: https://en.wikipedia.org/wiki/Johan_Deysel',
  updated_at = now()
WHERE id = 38;

-- ===== ATHLETES: insert notable verified names (skip if slug exists) =====
INSERT INTO sportsplatform_athletes (first_name, last_name, slug, gender, photo_url, federation_id, nationality, achievements, is_active)
SELECT * FROM (VALUES
  ('Harry', 'Simon', 'harry-simon', 'male'::gender, '/sports/boxing.jpg', 87, 'Namibian',
   'Former professional boxer; held the WBO super-middleweight world title in the late 1990s. Source: https://en.wikipedia.org/wiki/Harry_Simon_(boxer)', true),
  ('Paulus', 'Ambunda', 'paulus-ambunda', 'male'::gender, '/sports/boxing.jpg', 87, 'Namibian',
   'Professional boxer; former WBO bantamweight world champion. Source: https://en.wikipedia.org/wiki/Paulus_Ambunda', true),
  ('Agnes', 'Samaria', 'agnes-samaria', 'female'::gender, '/sports/athletics.jpg', 33, 'Namibian',
   'Middle-distance runner; Olympic 800m finalist (Athens 2004) and African championship medallist. Source: https://en.wikipedia.org/wiki/Agnes_Samaria', true),
  ('Johanna', 'Benson', 'johanna-benson', 'female'::gender, '/sports/athletics-alt.jpg', 24, 'Namibian',
   'Paralympic sprinter; T37 200m gold medallist at London 2012 and Namibia''s first female Paralympic champion. Source: https://en.wikipedia.org/wiki/Johanna_Benson', true),
  ('Lahja', 'Ishitile', 'lahja-ishitile', 'female'::gender, '/sports/athletics-alt.jpg', 24, 'Namibian',
   'Paralympic sprinter (T11/T12) who has represented Namibia at the Paralympic Games and World Para Athletics Championships. Source: https://en.wikipedia.org/wiki/Lahja_Ishitile', true),
  ('Bernard', 'Scholtz', 'bernard-scholtz', 'male'::gender, '/sports/cricket.jpg', 85, 'Namibian',
   'Left-arm spin bowler and long-serving Namibia national-team regular across ODIs and T20Is. Source: https://www.espncricinfo.com/cricketers/bernard-scholtz-308663', true),
  ('Zane', 'Green', 'zane-green', 'male'::gender, '/sports/cricket.jpg', 85, 'Namibian',
   'Wicketkeeper-batter for Namibia; ICC T20 World Cup squad member. Source: https://www.espncricinfo.com/cricketers/zane-green-596402', true),
  ('Niko', 'Davin', 'niko-davin', 'male'::gender, '/sports/cricket.jpg', 85, 'Namibian',
   'Opening batter for Namibia in limited-overs internationals. Source: https://www.espncricinfo.com/cricketers/niko-davin-596404', true),
  ('Michael', 'van Lingen', 'michael-van-lingen', 'male'::gender, '/sports/cricket.jpg', 85, 'Namibian',
   'Left-handed batter for Namibia; featured in ICC World Cup League 2 and T20 World Cup campaigns. Source: https://www.espncricinfo.com/cricketers/michael-van-lingen-596412', true),
  ('Ben', 'Shikongo', 'ben-shikongo', 'male'::gender, '/sports/cricket.jpg', 85, 'Namibian',
   'Pace bowler for Namibia; ICC event squad regular. Source: https://www.espncricinfo.com/cricketers/ben-shikongo-1071713', true),
  ('JP', 'Kotze', 'jp-kotze', 'male'::gender, '/sports/cricket.jpg', 85, 'Namibian',
   'Wicketkeeper-batter for Namibia in ODIs and T20Is. Source: https://www.espncricinfo.com/cricketers/jp-kotze-308661', true),
  ('JC', 'Greyling', 'jc-greyling', 'male'::gender, '/sports/rugby.jpg', 84, 'Namibian',
   'Welwitschias centre; Rugby World Cup squad member for Namibia. Source: https://en.wikipedia.org/wiki/JC_Greyling', true),
  ('Johan', 'Retief', 'johan-retief', 'male'::gender, '/sports/rugby.jpg', 84, 'Namibian',
   'Welwitschias lock; represented Namibia at the Rugby World Cup. Source: https://en.wikipedia.org/wiki/Johan_Retief', true),
  ('Rohan', 'Kitshoff', 'rohan-kitshoff', 'male'::gender, '/sports/rugby.jpg', 84, 'Namibian',
   'Welwitschias flanker; multiple Rugby World Cup campaigns for Namibia. Source: https://en.wikipedia.org/wiki/Rohan_Kitshoff', true),
  ('Tjiuee', 'Uanivi', 'tjiuee-uanivi', 'male'::gender, '/sports/rugby.jpg', 84, 'Namibian',
   'Welwitschias lock; also played professional club rugby abroad. Source: https://en.wikipedia.org/wiki/Tjiuee_Uanivi', true),
  ('Chrysander', 'Botha', 'chrysander-botha', 'male'::gender, '/sports/rugby.jpg', 84, 'Namibian',
   'Welwitschias fullback/wing; Rugby World Cup representative for Namibia. Source: https://en.wikipedia.org/wiki/Chrysander_Botha', true),
  ('PJ', 'van Lill', 'pj-van-lill', 'male'::gender, '/sports/rugby.jpg', 84, 'Namibian',
   'Welwitschias hooker; long-serving Namibia international. Source: https://en.wikipedia.org/wiki/PJ_van_Lill', true),
  ('Manfred', 'Starke', 'manfred-starke', 'male'::gender, '/sports/football.jpg', 67, 'Namibian',
   'Midfielder for the Brave Warriors; professional career in German club football. Source: https://en.wikipedia.org/wiki/Manfred_Starke', true),
  ('Willy', 'Stephanus', 'willy-stephanus', 'male'::gender, '/sports/football.jpg', 67, 'Namibian',
   'Brave Warriors midfielder; Namibia Premier League and international regular. Source: https://en.wikipedia.org/wiki/Willy_Stephanus', true),
  ('Benson', 'Shilongo', 'benson-shilongo', 'male'::gender, '/sports/football.jpg', 67, 'Namibian',
   'Brave Warriors forward; club career in Namibia and elsewhere in Africa. Source: https://en.wikipedia.org/wiki/Benson_Shilongo', true),
  ('Riaan', 'Hanamub', 'riaan-hanamub', 'male'::gender, '/sports/football.jpg', 67, 'Namibian',
   'Brave Warriors defender; played in South Africa''s PSL including Orlando Pirates. Source: https://en.wikipedia.org/wiki/Riaan_Hanamub', true),
  ('Joslin', 'Kamatuka', 'joslin-kamatuka', 'male'::gender, '/sports/football.jpg', 67, 'Namibian',
   'Brave Warriors midfielder/attacker; Namibia international. Source: https://en.wikipedia.org/wiki/Joslin_Kamatuka', true),
  ('Alexander', 'Miller', 'alexander-miller', 'male'::gender, '/sports/canoeing.jpg', 74, 'Namibian',
   'Sprint canoeist who represented Namibia at the Paris 2024 Olympic Games. Source: https://www.olympics.com/en/athletes/alexander-miller', true),
  ('Reginald', 'Benade', 'reginald-benade', 'male'::gender, '/sports/athletics-alt.jpg', 24, 'Namibian',
   'Paralympic field athlete (F37 throws) who has represented Namibia at the Paralympic Games. Source: https://en.wikipedia.org/wiki/Reginald_Benade', true),
  ('Stephan', 'Baard', 'stephan-baard', 'male'::gender, '/sports/cricket.jpg', 85, 'Namibian',
   'Opening batter for Namibia; ICC World Cup and T20 World Cup campaign regular. Source: https://www.espncricinfo.com/cricketers/stephan-baard-308543', true),
  ('Craig', 'Williams', 'craig-williams', 'male'::gender, '/sports/cricket.jpg', 85, 'Namibian',
   'Former Namibia captain and all-rounder; long-serving ODI/T20I international. Source: https://www.espncricinfo.com/cricketers/craig-williams-233569', true),
  ('Tangeni', 'Lungameni', 'tangeni-lungameni', 'male'::gender, '/sports/cricket.jpg', 85, 'Namibian',
   'Left-arm pace bowler for Namibia in limited-overs internationals. Source: https://www.espncricinfo.com/cricketers/tangeni-lungameni-596408', true),
  ('Virgil', 'Vries', 'virgil-vries', 'male'::gender, '/sports/football.jpg', 67, 'Namibian',
   'Brave Warriors goalkeeper; Namibia international with club experience in South Africa. Source: https://en.wikipedia.org/wiki/Virgil_Vries', true),
  ('Ananias', 'Gebhardt', 'ananias-gebhardt', 'male'::gender, '/sports/football.jpg', 67, 'Namibian',
   'Brave Warriors defender; Namibia Premier League and international regular. Source: https://en.wikipedia.org/wiki/Ananias_Gebhardt', true),
  ('Larry', 'Horaeb', 'larry-horaeb', 'male'::gender, '/sports/football.jpg', 67, 'Namibian',
   'Brave Warriors defender/midfielder; Namibia international. Source: https://en.wikipedia.org/wiki/Larry_Horaeb', true),
  ('Wendell', 'Rudath', 'wendell-rudath', 'male'::gender, '/sports/football.jpg', 67, 'Namibian',
   'Brave Warriors forward; Namibia international. Source: https://en.wikipedia.org/wiki/Wendell_Rudath', true),
  ('Aranos', 'Coetzee', 'aranos-coetzee', 'male'::gender, '/sports/rugby.jpg', 84, 'Namibian',
   'Welwitschias prop; Rugby World Cup squad member for Namibia. Source: https://en.wikipedia.org/wiki/Aranos_Coetzee', true),
  ('Johan', 'Tromp', 'johan-tromp', 'male'::gender, '/sports/rugby.jpg', 84, 'Namibian',
   'Welwitschias fullback/utility back; Rugby World Cup representative. Source: https://en.wikipedia.org/wiki/Johan_Tromp', true),
  ('Louis', 'van der Westhuizen', 'louis-van-der-westhuizen', 'male'::gender, '/sports/rugby.jpg', 84, 'Namibian',
   'Welwitschias scrum-half; long-serving Namibia international. Source: https://en.wikipedia.org/wiki/Louis_van_der_Westhuizen', true),
  ('Prince', 'Gaoseb', 'prince-gaoseb', 'male'::gender, '/sports/rugby.jpg', 84, 'Namibian',
   'Welwitschias flanker; Rugby World Cup squad member for Namibia. Source: https://en.wikipedia.org/wiki/Prince_!Gaoseb', true),
  ('Tjipekapora', 'Herunga', 'tjipekapora-herunga', 'female'::gender, '/sports/athletics.jpg', 33, 'Namibian',
   'Sprinter who has represented Namibia at African championships and international meets. Source: https://worldathletics.org/', true)
) AS v(first_name, last_name, slug, gender, photo_url, federation_id, nationality, achievements, is_active)
WHERE NOT EXISTS (
  SELECT 1 FROM sportsplatform_athletes a WHERE a.slug = v.slug
);

-- ===== VENUES: restore photo paths (local assets under client/public/venues/) =====
UPDATE sportsplatform_venues SET photo_url = '/venues/independence-stadium.jpg', updated_at = now()
WHERE slug = 'independence-stadium';
UPDATE sportsplatform_venues SET photo_url = '/venues/hage-geingob-stadium.jpg', updated_at = now()
WHERE slug = 'hage-geingob-stadium';
UPDATE sportsplatform_venues SET photo_url = '/venues/sam-nujoma-stadium.jpg', updated_at = now()
WHERE slug = 'sam-nujoma-stadium';
UPDATE sportsplatform_venues SET photo_url = '/venues/cricket-ground.jpg', updated_at = now()
WHERE slug = 'namibia-cricket-ground';
UPDATE sportsplatform_venues SET photo_url = '/venues/dome-swakopmund.jpg', updated_at = now()
WHERE slug = 'the-dome-swakopmund';
UPDATE sportsplatform_venues SET photo_url = '/venues/rossmund-golf.jpg', updated_at = now()
WHERE slug = 'rossmund-golf-course';
UPDATE sportsplatform_venues SET photo_url = '/venues/windhoek-country-club.jpg', updated_at = now()
WHERE slug = 'windhoek-country-club';
UPDATE sportsplatform_venues SET photo_url = '/venues/skw-sports-complex.jpg', updated_at = now()
WHERE slug = 'skw-sports-complex';
UPDATE sportsplatform_venues SET photo_url = '/venues/vegkop-athletics.jpg', updated_at = now()
WHERE slug = 'vegkop-athletics-windhoek';
UPDATE sportsplatform_venues SET photo_url = '/venues/high-performance-oval.jpg', updated_at = now()
WHERE slug = 'high-performance-oval-windhoek';
UPDATE sportsplatform_venues SET photo_url = '/venues/walvis-bay-rugby.jpg', updated_at = now()
WHERE slug = 'walvis-bay-hs-rugby';
UPDATE sportsplatform_venues SET photo_url = '/venues/ongwediva-multi-sport.jpg', updated_at = now()
WHERE slug = 'ongwediva-multi-sport';
UPDATE sportsplatform_venues SET photo_url = '/venues/tsumeb-sports.jpg', updated_at = now()
WHERE slug = 'tsumeb-sports-complex';
UPDATE sportsplatform_venues SET photo_url = '/venues/mariental-sports.jpg', updated_at = now()
WHERE slug = 'mariental-sports-grounds';
UPDATE sportsplatform_venues SET photo_url = '/venues/swakopmund-beach-courts.jpg', updated_at = now()
WHERE slug = 'swakopmund-beach-courts';

-- ===== VENUES: major Namibian sports venues (capacity only when publicly cited) =====
INSERT INTO sportsplatform_venues (name, slug, description, photo_url, address, city, region, capacity, facilities, is_active)
SELECT * FROM (VALUES
  (
    'Wanderers Sports Club',
    'wanderers-sports-club',
    'Historic multi-sport club in Windhoek hosting cricket, rugby, hockey and social sport. Home ground for Wanderers club sides across several federations. Source: https://www.wanderers.com.na/',
    '/venues/wanderers-sports-club.jpg',
    'Mandume Ndemufayo Ave / Gobabis Rd area, Windhoek',
    'Windhoek', 'Khomas', NULL::integer,
    ARRAY['cricket','rugby','hockey','clubhouse'],
    true
  ),
  (
    'Ramblers Club',
    'ramblers-club-windhoek',
    'Long-standing Windhoek sports club with football and multi-sport fields used for club and school fixtures.',
    '/venues/ramblers-club.jpg',
    'Windhoek',
    'Windhoek', 'Khomas', NULL::integer,
    ARRAY['football','multi-sport'],
    true
  ),
  (
    'UNAM Sports Grounds',
    'unam-sports-grounds',
    'University of Namibia main campus sports fields — football, athletics and campus competitions in Windhoek.',
    '/venues/unam-sports-grounds.jpg',
    'UNAM Main Campus, Windhoek',
    'Windhoek', 'Khomas', NULL::integer,
    ARRAY['football','athletics'],
    true
  ),
  (
    'NUST Sports Grounds',
    'nust-sports-grounds',
    'Namibia University of Science and Technology sports fields used for campus leagues and community events.',
    '/venues/nust-sports-grounds.jpg',
    'NUST Campus, Windhoek',
    'Windhoek', 'Khomas', NULL::integer,
    ARRAY['football','athletics','multi-sport'],
    true
  ),
  (
    'Vineta Sports Grounds',
    'vineta-sports-grounds',
    'Coastal multi-sport fields in Swakopmund''s Vineta suburb; football and community sport hub for Erongo.',
    '/venues/vineta-sports-grounds.jpg',
    'Vineta, Swakopmund',
    'Swakopmund', 'Erongo', NULL::integer,
    ARRAY['football','multi-sport'],
    true
  ),
  (
    'Kuisebmond Stadium',
    'kuisebmond-stadium',
    'Walvis Bay football stadium serving coastal Premier League and First Division clubs.',
    '/venues/kuisebmond-stadium.jpg',
    'Kuisebmond, Walvis Bay',
    'Walvis Bay', 'Erongo', NULL::integer,
    ARRAY['football'],
    true
  ),
  (
    'Oshakati Independence Stadium',
    'oshakati-independence-stadium',
    'Northern Namibia multi-purpose stadium used for football and large community sports events in Oshana.',
    '/venues/oshakati-stadium.jpg',
    'Oshakati',
    'Oshakati', 'Oshana', NULL::integer,
    ARRAY['football','athletics'],
    true
  ),
  (
    'Rundu Sports Stadium',
    'rundu-sports-stadium',
    'Kavango East regional stadium hosting football and multi-sport events for Rundu and surrounding towns.',
    '/venues/rundu-sports-stadium.jpg',
    'Rundu',
    'Rundu', 'Kavango East', NULL::integer,
    ARRAY['football','multi-sport'],
    true
  ),
  (
    'Gobabis Sports Grounds',
    'gobabis-sports-grounds',
    'Omaheke regional sports grounds for football and community competitions in eastern Namibia.',
    '/venues/gobabis-sports-grounds.jpg',
    'Gobabis',
    'Gobabis', 'Omaheke', NULL::integer,
    ARRAY['football','multi-sport'],
    true
  ),
  (
    'Keetmanshoop Sports Complex',
    'keetmanshoop-sports-complex',
    'ǁKaras regional multi-sport complex serving southern Namibia football and athletics.',
    '/venues/keetmanshoop-sports.jpg',
    'Keetmanshoop',
    'Keetmanshoop', 'ǁKaras', NULL::integer,
    ARRAY['football','athletics'],
    true
  ),
  (
    'Khomasdal Stadium',
    'khomasdal-stadium',
    'Community football stadium in Windhoek''s Khomasdal suburb; host for local league fixtures.',
    '/venues/khomasdal-stadium.jpg',
    'Khomasdal, Windhoek',
    'Windhoek', 'Khomas', NULL::integer,
    ARRAY['football'],
    true
  ),
  (
    'DTS Sports Grounds',
    'dts-sports-grounds',
    'Deutsche Turn- und Sportverein grounds in Windhoek — hockey, football and multi-sport club facilities.',
    '/venues/dts-sports-grounds.jpg',
    'Windhoek',
    'Windhoek', 'Khomas', NULL::integer,
    ARRAY['hockey','football','clubhouse'],
    true
  ),
  (
    'Olympia Aquatic Centre',
    'olympia-aquatic-centre',
    'Windhoek aquatic facility used for NASFED swimming training and national meets (Olympia suburb).',
    '/venues/olympia-aquatic-centre.jpg',
    'Olympia, Windhoek',
    'Windhoek', 'Khomas', NULL::integer,
    ARRAY['swimming','aquatic'],
    true
  )
) AS v(name, slug, description, photo_url, address, city, region, capacity, facilities, is_active)
WHERE NOT EXISTS (
  SELECT 1 FROM sportsplatform_venues x WHERE x.slug = v.slug
);
