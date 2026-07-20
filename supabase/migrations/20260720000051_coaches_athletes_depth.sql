-- Coaches + athletes depth pass (2026-07-20).
-- WHY: Live had 16 coaches (0% photos) and thin coverage in netball/hockey/cycling/
-- judo/swimming/para. Expands coaches to ≥35 verified national/club figures with
-- paraphrased role bios (no invented licences). Adds 18 verified athletes for
-- underrepresented federations; all photos set (/coaches/*, /athletes/*, /sports/*).
-- Evidence: docs/research/coaches_athletes_depth_batch.md

-- ===== COACHES: role corrections for known transitions (verified public reports) =====
UPDATE sportsplatform_coaches SET
  specialization = 'Former Head Coach',
  certifications = 'Former Welwitschias director of rugby / head coach (2021–2024); previously coached South Africa. Source: https://en.wikipedia.org/wiki/Allister_Coetzee',
  photo_url = '/sports/rugby.jpg',
  updated_at = now()
WHERE id = 4 AND first_name = 'Allister' AND last_name = 'Coetzee';

UPDATE sportsplatform_coaches SET
  specialization = 'Former Head Coach',
  certifications = 'Former Namibia men''s cricket head coach (2019–2025); guided ODI status and three T20 World Cups. Source: https://en.wikipedia.org/wiki/Pierre_de_Bruyn',
  photo_url = '/sports/cricket.jpg',
  updated_at = now()
WHERE id = 6 AND first_name = 'Pierre' AND last_name = 'de Bruyn';

UPDATE sportsplatform_coaches SET
  specialization = 'Head Coach',
  certifications = 'Brave Warriors head coach since 2022; former Namibia international and long-time Bundesliga defender (Hamburger SV). Source: https://en.wikipedia.org/wiki/Collin_Benjamin',
  photo_url = '/sports/football.jpg',
  updated_at = now()
WHERE id = 1 AND first_name = 'Collin' AND last_name = 'Benjamin';

-- Carla van der Merwe was mislinked to skateboarding; NASFED/swimming
UPDATE sportsplatform_coaches SET
  federation_id = 35,
  photo_url = COALESCE(NULLIF(photo_url, ''), '/sports/swimming.jpg'),
  updated_at = now()
WHERE id = 14 AND first_name = 'Carla' AND last_name = 'van der Merwe';

-- Soft-deactivate unverified netball name (verified head coach is Julene Meyer)
UPDATE sportsplatform_coaches SET is_active = false, updated_at = now()
WHERE id = 16 AND first_name = 'Juliana' AND last_name = 'Doweses' AND is_active = true;

-- Sport-correct photos for remaining active coaches (no invented portraits)
UPDATE sportsplatform_coaches SET photo_url = '/sports/football.jpg', updated_at = now()
WHERE id IN (2, 3) AND is_active = true AND COALESCE(photo_url, '') = '';

UPDATE sportsplatform_coaches SET photo_url = '/sports/rugby.jpg', updated_at = now()
WHERE id = 5 AND is_active = true AND COALESCE(photo_url, '') = '';

UPDATE sportsplatform_coaches SET photo_url = '/sports/cricket.jpg', updated_at = now()
WHERE id = 7 AND is_active = true AND COALESCE(photo_url, '') = '';

UPDATE sportsplatform_coaches SET photo_url = '/sports/athletics.jpg', updated_at = now()
WHERE id IN (8, 9, 10) AND is_active = true AND COALESCE(photo_url, '') = '';

UPDATE sportsplatform_coaches SET photo_url = '/sports/basketball.jpg', updated_at = now()
WHERE id IN (11, 12) AND is_active = true AND COALESCE(photo_url, '') = '';

UPDATE sportsplatform_coaches SET photo_url = '/sports/boxing.jpg', updated_at = now()
WHERE id = 13 AND is_active = true AND COALESCE(photo_url, '') = '';

UPDATE sportsplatform_coaches SET photo_url = '/sports/tennis.jpg', updated_at = now()
WHERE id = 15 AND is_active = true AND COALESCE(photo_url, '') = '';

-- ===== COACHES: insert verified national / known figures (dedupe by name) =====
INSERT INTO sportsplatform_coaches (
  first_name, last_name, photo_url, federation_id, certifications, specialization, years_experience, is_active
)
SELECT * FROM (VALUES
  -- Football
  ('Bobby', 'Samaria', '/sports/football.jpg', 67,
   'Former Brave Warriors head coach and long-serving Namibia Premier League club manager (African Stars, Tigers). Source: https://en.wikipedia.org/wiki/Bobby_Samaria',
   'Former Head Coach', NULL::integer, true),
  ('Ricardo', 'Mannetti', '/sports/football.jpg', 67,
   'Former Brave Warriors head coach; led Namibia to the 2015 COSAFA Cup title and AFCON 2019. Source: https://en.wikipedia.org/wiki/Ricardo_Mannetti',
   'Former Head Coach', NULL::integer, true),

  -- Rugby
  ('Jacques', 'Burger', '/coaches/jacques-burger.jpg', 84,
   'Namibia Director of Rugby; former Welwitschias captain and three-time Rugby World Cup flanker (Saracens). Source: https://en.wikipedia.org/wiki/Jacques_Burger',
   'Director of Rugby', NULL::integer, true),
  ('Pieter', 'Rossouw', '/sports/rugby.jpg', 84,
   'Welwitschias head coach (appointed 2025); former Springbok wing and previous Namibia backs coach. Source: https://en.wikipedia.org/wiki/Pieter_Rossouw_(rugby_union)',
   'Head Coach', NULL::integer, true),
  ('Chrysander', 'Botha', '/sports/rugby.jpg', 84,
   'Former Welwitschias head coach (2024–2025) and Namibia''s all-time top try scorer; earlier assistant under Allister Coetzee. Source: https://en.wikipedia.org/wiki/Chrysander_Botha',
   'Former Head Coach', NULL::integer, true),
  ('Rohan', 'Kitshoff', '/sports/rugby.jpg', 84,
   'Welwitschias forward coach / assistant; former Namibia international flanker and Rugby World Cup squad member. Source: https://en.wikipedia.org/wiki/Rohan_Kitshoff',
   'Forward Coach', NULL::integer, true),
  ('Jaco', 'Engels', '/sports/rugby.jpg', 84,
   'Welwitschias scrum coach in the national coaching group announced with Burger/Botha. Source: https://www.namibian.com.na/burger-back-with-namibian-rugby/',
   'Scrum Coach', NULL::integer, true),
  ('David', 'Philander', '/sports/rugby.jpg', 84,
   'Welwitschias backs coach in the national coaching set-up. Source: https://www.americasrugbynews.com/2025/10/28/free-jacks-star-malan-ruled-out-of-namibia-squad-for-repechage/',
   'Backs Coach', NULL::integer, true),

  -- Cricket
  ('Craig', 'Williams', '/sports/cricket.jpg', 85,
   'Namibia men''s head coach (appointed 2025); former Eagles captain and long-serving international batter. Source: https://cricketnamibia.com/the-legend-returns-craig-williams-appointed-head-coach-of-the-fnb-eagles/',
   'Head Coach', NULL::integer, true),

  -- Netball
  ('Julene', 'Meyer', '/sports/netball.jpg', 86,
   'Desert Jewels (Namibia) senior national head coach; led the side in Africa Netball Cup and World Cup qualifier campaigns. Source: https://en.wikipedia.org/wiki/Namibia_national_netball_team',
   'Head Coach', NULL::integer, true),
  ('Sunette', 'Burden', '/sports/netball.jpg', 86,
   'Desert Jewels assistant coach (defence/attack staff under Julene Meyer). Source: https://en.wikipedia.org/wiki/Namibia_national_netball_team',
   'Assistant Coach', NULL::integer, true),
  ('Antoinette', 'Wentworth', '/sports/netball.jpg', 86,
   'Desert Jewels assistant coach appointed with the Meyer national coaching group. Source: https://www.namibian.com.na/desert-jewels-get-new-coach/',
   'Assistant Coach', NULL::integer, true),

  -- Hockey (NHU)
  ('Shayne', 'Cormack', '/sports/hockey.jpg', 88,
   'Namibia senior women''s hockey head coach (FIH indoor/outdoor squads). Source: https://fih.altiusrt.com/index.php/teams/7843',
   'Women''s Head Coach', NULL::integer, true),
  ('Trevor', 'Cormack', '/sports/hockey.jpg', 88,
   'Namibia senior men''s indoor hockey head coach; also involved in inline hockey support staff. Source: https://fih.altiusrt.com/index.php/teams/7846',
   'Men''s Indoor Head Coach', NULL::integer, true),
  ('Calvin', 'Price', '/sports/hockey.jpg', 88,
   'Namibia senior women''s hockey assistant coach (FIH team staff lists). Source: https://fih.altiusrt.com/index.php/teams/7843',
   'Assistant Coach', NULL::integer, true),

  -- Boxing
  ('Nestor', 'Tobias', '/sports/boxing.jpg', 87,
   'Leading Namibian boxing trainer and promoter (Nestor Sunshine Tobias Boxing Academy); guided multiple Namibian world champions. Source: https://www.namibian.com.na/nestor-tobias-top-10-namibian-boxers-of-all-time/',
   'Trainer / Promoter', NULL::integer, true),

  -- Swimming
  ('John', 'Leitner', '/sports/swimming.jpg', 35,
   'Namibia swimming head coach for Commonwealth Games squad preparations (NASFED national programme). Source: https://neweralive.na/namibian-swimmers-ready-for-commonwealth-games/',
   'Head Coach', NULL::integer, true),

  -- Judo
  ('Keith', 'Bock', '/sports/judo.jpg', 75,
   'Namibia Judo Federation coach / sports director; IJF-accredited coach and Namibia''s first World Championships judoka (2007). Source: https://www.ijf.org/news/show/namibia-believes-in-judo',
   'National Coach', NULL::integer, true),
  ('Cornelius', 'Matthyser', '/sports/judo.jpg', 75,
   'IJF Judo in Schools coach in Namibia; develops school-age judoka for regional opens. Source: https://www.ijf.org/news/show/school-judo-in-namibia-crosses-borders',
   'Development Coach', NULL::integer, true),

  -- Athletics (verified public figure — mentoring/admin, not invented licence)
  ('Frankie', 'Fredericks', '/athletes/frankie-fredericks.jpg', 33,
   'Sprint legend who supports Namibian athlete development via the Frank Fredericks Foundation and international athletics leadership roles. Source: https://en.wikipedia.org/wiki/Frankie_Fredericks',
   'Athlete Development Mentor', NULL::integer, true)
) AS v(first_name, last_name, photo_url, federation_id, certifications, specialization, years_experience, is_active)
WHERE NOT EXISTS (
  SELECT 1 FROM sportsplatform_coaches c
  WHERE lower(c.first_name) = lower(v.first_name)
    AND lower(c.last_name) = lower(v.last_name)
);

-- ===== ATHLETES: underrepresented federations (photos required) =====
INSERT INTO sportsplatform_athletes (
  first_name, last_name, slug, gender, photo_url, federation_id, nationality, achievements, is_active
)
SELECT * FROM (VALUES
  -- Netball
  ('Anna', 'Kaspar', 'anna-kaspar', 'female'::gender, '/athletes/netball.jpg', 86, 'Namibian',
   'Desert Jewels shooter and long-time national-team regular; club star for Namibian Navy. Source: https://www.namibian.com.na/netball-star-kaspar-swaps-court-for-cradle/', true),
  ('Louise', 'Kauhesua', 'louise-kauhesua', 'female'::gender, '/athletes/netball.jpg', 86, 'Namibian',
   'Desert Jewels goal shooter (''Dreamy''); senior national squad regular from Extreme Eagles. Source: https://en.wikipedia.org/wiki/Namibia_national_netball_team', true),
  ('Monica', 'Gomases', 'monica-gomases', 'female'::gender, '/athletes/netball.jpg', 86, 'Namibian',
   'Desert Jewels midcourt player; Namibia Correctional Service and national-team regular. Source: https://www.namibian.com.na/namibia-prepares-for-netball-world-cup-qualifier/', true),
  ('Loide', 'Hanyanya', 'loide-hanyanya', 'female'::gender, '/athletes/netball.jpg', 86, 'Namibian',
   'Desert Jewels midcourt international; club footballer-turned-netballer for Tigers/national side. Source: https://en.wikipedia.org/wiki/Namibia_national_netball_team', true),
  ('Cornelia', 'Mupenda', 'cornelia-mupenda', 'female'::gender, '/athletes/netball.jpg', 86, 'Namibian',
   'Desert Jewels defender; senior Namibia international. Source: https://en.wikipedia.org/wiki/Namibia_national_netball_team', true),

  -- Hockey
  ('Sunelle', 'Ludwig', 'sunelle-ludwig', 'female'::gender, '/athletes/hockey.jpg', 88, 'Namibian',
   'Namibia women''s hockey captain; long-serving FIH indoor/outdoor international. Source: https://fih.altiusrt.com/index.php/teams/7843', true),
  ('Petro', 'Stoffberg', 'petro-stoffberg', 'female'::gender, '/athletes/hockey.jpg', 88, 'Namibian',
   'Namibia women''s hockey goalkeeper; high-cap FIH indoor international. Source: https://fih.altiusrt.com/index.php/teams/7843', true),
  ('Azaylee', 'Philander', 'azaylee-philander', 'female'::gender, '/athletes/hockey.jpg', 88, 'Namibian',
   'Namibia women''s hockey attacker; FIH indoor tournament goalscorer. Source: https://fih.altiusrt.com/index.php/teams/7843', true),
  ('Jerrica', 'Bartlett', 'jerrica-bartlett', 'female'::gender, '/athletes/hockey.jpg', 88, 'Namibian',
   'Namibia women''s hockey international with extensive FIH indoor caps. Source: https://fih.altiusrt.com/index.php/teams/7843', true),
  ('Kiana-Ché', 'Cormack', 'kiana-che-cormack', 'female'::gender, '/athletes/hockey.jpg', 88, 'Namibian',
   'Namibia women''s hockey midfielder/attacker; FIH indoor international. Source: https://fih.altiusrt.com/index.php/teams/7843', true),
  ('Pieter', 'Jacobs', 'pieter-jacobs-hockey', 'male'::gender, '/athletes/hockey.jpg', 88, 'Namibian',
   'Namibia men''s indoor hockey captain/leader; FIH indoor international. Source: https://fih.altiusrt.com/index.php/teams/7846', true),
  ('Brynn', 'Cleak', 'brynn-cleak', 'male'::gender, '/athletes/hockey.jpg', 88, 'Namibian',
   'Namibia men''s indoor hockey international and co-captain in recent FIH events. Source: https://fih.altiusrt.com/index.php/teams/7846', true),

  -- Cycling
  ('Vera', 'Looser', 'vera-looser', 'female'::gender, '/athletes/vera-looser.jpg', 62, 'Namibian',
   'Road cyclist and mountain biker; multiple Namibian national champion and Olympic road-race competitor (incl. Paris 2024 flagbearer). Source: https://en.wikipedia.org/wiki/Vera_Looser', true),
  ('Tristan', 'de Lange', 'tristan-de-lange', 'male'::gender, '/sports/cycling.jpg', 62, 'Namibian',
   'Road and mountain-bike rider; Tokyo 2020 Olympian (road) and African Games MTB gold medallist. Source: https://en.wikipedia.org/wiki/Tristan_de_Lange', true),
  ('Dan', 'Craven', 'dan-craven', 'male'::gender, '/sports/cycling.jpg', 62, 'Namibian',
   'Professional road cyclist; represented Namibia at the 2012 and 2016 Olympic Games. Source: https://www.olympedia.org/athletes/121574', true),
  ('Alex', 'Miller', 'alex-miller-cycling', 'male'::gender, '/sports/cycling.jpg', 62, 'Namibian',
   'Road and MTB rider; Commonwealth Games XC bronze (2022) and Paris 2024 Olympic MTB competitor / flagbearer. Source: https://en.wikipedia.org/wiki/Alex_Miller_(cyclist)', true),

  -- Swimming depth
  ('Ronan', 'Wantenaar', 'ronan-wantenaar', 'male'::gender, '/athletes/swimming.jpg', 35, 'Namibian',
   'Breaststroke specialist; African Games gold (100 m breaststroke, Accra 2023) and World Aquatics Championships semi-finalist. Source: https://en.wikipedia.org/wiki/Ronan_Wantenaar', true),

  -- Judo (athlete who also coaches — World Championships competitor)
  ('Keith', 'Bock', 'keith-bock', 'male'::gender, '/athletes/judo.jpg', 75, 'Namibian',
   'Judoka; first Namibian to compete at the IJF World Championships (Rio 2007); later national coach. Source: https://www.ijf.org/news/show/namibia-believes-in-judo', true),

  -- Paralympic / wheelchair & para athletics depth
  ('Chris', 'Kinda', 'chris-kinda', 'male'::gender, '/sports/athletics-alt.jpg', 24, 'Namibian',
   'T11 para sprinter; 400 m gold at the 2024 World Para Athletics Championships (Kobe). Source: https://en.wikipedia.org/wiki/Chris_Kinda', true),
  ('Bradley', 'Murere', 'bradley-murere', 'male'::gender, '/sports/athletics-alt.jpg', 24, 'Namibian',
   'T46 para sprinter (upper-limb impairment) on the Namibia Paralympic Committee national team. Source: https://namparalympics.org.na/team-member/bradley-murere/', true),
  ('Petrus', 'Karuli', 'petrus-karuli', 'male'::gender, '/sports/athletics-alt.jpg', 24, 'Namibian',
   'T37 para athlete representing Namibia under the NPC programme. Source: https://namparalympics.org.na/athletes/', true)
) AS v(first_name, last_name, slug, gender, photo_url, federation_id, nationality, achievements, is_active)
WHERE NOT EXISTS (
  SELECT 1 FROM sportsplatform_athletes a WHERE a.slug = v.slug
);
