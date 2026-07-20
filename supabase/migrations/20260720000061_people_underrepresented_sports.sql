-- People pass 3 — underrepresented sports (2026-07-21).
-- WHY: Live had ~92 active athletes / ~35 active coaches with thin or zero
-- coverage in volleyball, tennis, table tennis, boxing depth, gymnastics,
-- wrestling, and chess. Adds verified national/league figures with paraphrased
-- bios + Source links (no invented medals/licences). All photos set
-- (/athletes/*, /sports/*). Evidence: docs/research/people_underrepresented_batch.md

-- ===== COACHES: verified national / technical staff =====
INSERT INTO sportsplatform_coaches (
  first_name, last_name, photo_url, federation_id, certifications, specialization, years_experience, is_active
)
SELECT * FROM (VALUES
  -- Volleyball (NVF)
  ('Joel', 'Matheus', '/sports/volleyball.jpg', 37,
   'FIVB-certified instructor; NVF national programme head coach who named senior men''s and women''s squads after a long international hiatus. Source: https://www.namibiansun.com/sport-wrap-main/matheus-names-nvfs-first-national-teams-in-14-years2025-11-07176203',
   'National Programme Head Coach', NULL::integer, true),
  ('Mwita', 'Sikopo', '/sports/volleyball.jpg', 37,
   'Senior men''s national head coach in the NVF technical team under Joel Matheus. Source: https://www.namibiansun.com/sport-wrap-main/namibia%E2%80%99s-new-national-teams-unveiled2025-11-21177840',
   'Men''s Head Coach', NULL::integer, true),
  ('Mutasa', 'Kudakwashe', '/sports/volleyball.jpg', 37,
   'Senior women''s national head coach in the NVF technical team. Source: https://www.namibiansun.com/sport-wrap-main/namibia%E2%80%99s-new-national-teams-unveiled2025-11-21177840',
   'Women''s Head Coach', NULL::integer, true),

  -- Tennis (NTA)
  ('Gerrie', 'Dippenaar', '/sports/tennis.jpg', 89,
   'Namibia Davis Cup captain/coach; led the side in World Group II play-offs on home soil. Source: https://en.wikipedia.org/wiki/Namibia_Davis_Cup_team',
   'Davis Cup Captain / Coach', NULL::integer, true),

  -- Table tennis (NTTA)
  ('Simon', 'Gologolo', '/sports/table-tennis.jpg', 80,
   'NTTA national coach (ITTF Level 2); prepared Namibia for AUSC Region 5 Youth Games. Source: https://www.namibiansun.com/sport-wrap-main/ntta-youth-games-preparations-included-hp-centre2025-07-04162321',
   'National Coach', NULL::integer, true),
  ('Wayne', 'Green', '/sports/table-tennis.jpg', 80,
   'NTTA assistant coach supporting national/youth preparations under Simon Gologolo. Source: https://www.namibiansun.com/sport-wrap-main/ntta-youth-games-preparations-included-hp-centre2025-07-04162321',
   'Assistant Coach', NULL::integer, true),

  -- Gymnastics (NGF)
  ('Vesselin', 'Kostin', '/sports/gymnastics.jpg', 34,
   'Namibian Gymnastics Federation national technical director; trampoline/tumbling national coach. Source: https://gymnasticsnamibia.org/about-us/',
   'National Technical Director', NULL::integer, true),
  ('Petra', 'Thorburn', '/sports/gymnastics.jpg', 34,
   'Women''s artistic gymnastics national coach (All-Africa / World Championships programmes). Source: https://www.republikein.com.na/sport-rep/all-african-championships-here-we-come2024-04-10',
   'Women''s Artistic Coach', NULL::integer, true),
  ('Morihei', 'Anderson', '/sports/gymnastics.jpg', 34,
   'Men''s artistic gymnastics coach for Namibia World Championships / African Championships squads. Source: https://www.namibiansun.com/sport-wrap-main/kooper-thorburn-eye-glory-at-world-champs2025-10-16173941',
   'Men''s Artistic Coach', NULL::integer, true),

  -- Wrestling (NWF)
  ('Luis', 'Forcelledo Paz', '/sports/wrestling.jpg', 77,
   'Namibia Wrestling Federation national head coach; Spain Grand Prix and African Championships staff. Source: https://www.namibian.com.na/top-wrestlers-off-to-spain/',
   'National Head Coach', NULL::integer, true),
  ('Kevin', 'Vleermuis', '/sports/wrestling.jpg', 77,
   'NWF assistant coach with the national team for African Continental Championships. Source: https://www.az.com.na/wrestling-federation-sw/namibia-announces-strong-national-wrestling-team-for-african-continental-championships-nmh009680-11-11284',
   'Assistant Coach', NULL::integer, true),

  -- Chess (Chess Namibia)
  ('Charles', 'Eichab', '/sports/chess.jpg', 28,
   'FIDE Instructor / Candidate Master; multi-time national champion and Royal Minds Chess Academy coach. Source: http://rcc.fide.com/members/',
   'National Coach / FIDE Instructor', NULL::integer, true)
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
  -- Volleyball
  ('Stefanus', 'Kangandjera', 'stefanus-kangandjera', 'male'::gender, '/athletes/volleyball.jpg', 37, 'Namibian',
   'Namibia senior men''s volleyball international (NCS); named in NVF national squads after the federation''s return to international competition. Source: https://www.namibiansun.com/sport-wrap-main/namibia%E2%80%99s-new-national-teams-unveiled2025-11-21177840', true),
  ('Simon', 'Ekandjo', 'simon-ekandjo', 'male'::gender, '/athletes/volleyball.jpg', 37, 'Namibian',
   'Namibia senior men''s volleyball international (NCS); experienced campaigner in NVF national call-ups. Source: https://www.namibian.com.na/namibia-returns-to-international-volleyball/', true),
  ('Teofilus', 'Ndafenongo', 'teofilus-ndafenongo', 'male'::gender, '/athletes/volleyball.jpg', 37, 'Namibian',
   'Namibia senior men''s volleyball international (NDF Raptors); NVF national squad regular. Source: https://www.namibiansun.com/sport-wrap-main/namibia%E2%80%99s-new-national-teams-unveiled2025-11-21177840', true),
  ('Simonia', 'Kanyumara', 'simonia-kanyumara', 'female'::gender, '/athletes/volleyball.jpg', 37, 'Namibian',
   'Namibia senior women''s volleyball international (Kudos); named in NVF national squads. Source: https://www.namibiansun.com/sport-wrap-main/namibia%E2%80%99s-new-national-teams-unveiled2025-11-21177840', true),
  ('Naemi', 'Amunyela', 'naemi-amunyela', 'female'::gender, '/athletes/volleyball.jpg', 37, 'Namibian',
   'Namibia senior women''s volleyball international (Nampol); NVF national squad regular. Source: https://www.namibian.com.na/namibia-returns-to-international-volleyball/', true),
  ('Frieda', 'Iindongo', 'frieda-iindongo', 'female'::gender, '/athletes/volleyball.jpg', 37, 'Namibian',
   'Namibia senior women''s volleyball international (Revivals); NVF national squad regular. Source: https://www.namibiansun.com/sport-wrap-main/namibia%E2%80%99s-new-national-teams-unveiled2025-11-21177840', true),

  -- Tennis
  ('Connor', 'van Schalkwyk', 'connor-van-schalkwyk', 'male'::gender, '/athletes/tennis.jpg', 89, 'Namibian',
   'Namibia''s top-ranked Davis Cup player; college tennis at Baylor University; multiple Davis Cup singles wins. Source: https://en.wikipedia.org/wiki/Namibia_Davis_Cup_team', true),
  ('Codie', 'van Schalkwyk', 'codie-van-schalkwyk', 'male'::gender, '/athletes/tennis.jpg', 89, 'Namibian',
   'Davis Cup singles/doubles player and stand-in captain when Connor is unavailable. Source: https://www.namibian.com.na/namibia-face-huge-task-against-estonia/', true),
  ('Jean', 'Erasmus', 'jean-erasmus', 'male'::gender, '/athletes/tennis.jpg', 89, 'Namibian',
   'Long-serving Davis Cup regular; among Namibia''s most capped doubles winners. Source: https://en.wikipedia.org/wiki/Namibia_Davis_Cup_team', true),
  ('Steyn', 'Dippenaar', 'steyn-dippenaar', 'male'::gender, '/athletes/tennis.jpg', 89, 'Namibian',
   'Davis Cup singles player in World Group II play-offs for Namibia. Source: https://www.namibiansun.com/tennis-sw/namibia-aims-for-third-time-lucky-at-davis-cup-nmh004970-11-5178', true),
  ('Ruben', 'Yssel', 'ruben-yssel', 'male'::gender, '/athletes/tennis.jpg', 89, 'Namibian',
   'Rising Davis Cup junior/senior debutant for Namibia in World Group II ties. Source: https://www.namibiansun.com/tennis-sw/namibia-aims-for-third-time-lucky-at-davis-cup-nmh004970-11-5178', true),

  -- Table tennis
  ('Kamrouz', 'Ghayouri', 'kamrouz-ghayouri', 'male'::gender, '/athletes/table-tennis.jpg', 80, 'Namibian',
   'Top junior prospect; trained at China''s Hebei Zhengding Table Tennis Training Base with NTTA support. Source: https://www.republikein.com.na/sport-wrap-main/ghayouri-gebauer-train-with-the-best-in-china-NMH010443-11-12365', true),
  ('Lian', 'Gebauer', 'lian-gebauer', 'male'::gender, '/athletes/table-tennis.jpg', 80, 'Namibian',
   'Junior national prospect; China closed training-camp participant with Kamrouz Ghayouri. Source: https://www.republikein.com.na/sport-wrap-main/ghayouri-gebauer-train-with-the-best-in-china-NMH010443-11-12365', true),

  -- Boxing depth
  ('Jeremia', 'Nakathila', 'jeremia-nakathila', 'male'::gender, '/athletes/boxing.jpg', 87, 'Namibian',
   'Professional lightweight/super-featherweight; fought Shakur Stevenson and defeated Miguel Berchelt; Sunshine Academy product. Source: https://en.wikipedia.org/wiki/Shakur_Stevenson', true),
  ('Walter', 'Kautondokwa', 'walter-kautondokwa', 'male'::gender, '/athletes/boxing.jpg', 87, 'Namibian',
   'Namibian professional middleweight known for knockout power; ranked among Nestor Tobias'' top Namibian boxers. Source: https://www.namibian.com.na/nestor-tobias-top-10-namibian-boxers-of-all-time/', true),
  ('Fillipus', 'Nghitumbwa', 'fillipus-nghitumbwa', 'male'::gender, '/athletes/boxing.jpg', 87, 'Namibian',
   'Super-bantamweight contender (WBO Africa/Global titles); leading Sunshine Academy prospect. Source: https://neweralive.na/tobias-hails-boxing-as-namibias-defining-sport-eyes-world-title-glory-for-nghitumbwa/', true),
  ('Bethuel', 'Uushona', 'bethuel-uushona', 'male'::gender, '/athletes/boxing.jpg', 87, 'Namibian',
   'Professional boxer (''Tyson'') developed through the Sunshine Academy championship pipeline. Source: https://neweralive.na/tobias-champion-of-namibian-boxing/', true),

  -- Gymnastics
  ('Anne-Leen', 'Thorburn', 'anne-leen-thorburn', 'female'::gender, '/athletes/gymnastics.jpg', 34, 'Namibian',
   'Women''s artistic gymnast; represented Namibia at FIG World Championships (Jakarta 2025) and African Championships. Source: https://thegymter.net/anne-leen-thorburn/', true),
  ('Immanuel', 'Kooper', 'immanuel-kooper', 'male'::gender, '/athletes/gymnastics.jpg', 34, 'Namibian',
   'Men''s artistic gymnast; Namibia senior national champion and FIG World Championships competitor (Jakarta 2025). Source: https://neweralive.na/namibian-gymnasts-aim-high-in-indonesia/', true),
  ('Annelise', 'Koster', 'annelise-koster', 'female'::gender, '/athletes/gymnastics.jpg', 34, 'Namibian',
   'Women''s artistic gymnast; FIG-licensed athlete and World Championships competitor for Namibia. Source: https://www.gymnastics.sport/site/athletes/bio_detail.php?id=29174&type=licence', true),
  ('Robert', 'Honiball', 'robert-honiball', 'male'::gender, '/athletes/gymnastics.jpg', 34, 'Namibian',
   'Men''s artistic gymnast; FIG World Championships competitor for Namibia (Tokyo 2011). Source: https://www.gymnastics.sport/site/athletes/bio_detail.php?id=31969', true),

  -- Wrestling
  ('Lazarus', 'Haimbodi', 'lazarus-haimbodi', 'male'::gender, '/athletes/wrestling.jpg', 77, 'Namibian',
   'Greco-Roman wrestler (63 kg); Spain Grand Prix / UWW camp and African Championships squad member. Source: https://www.namibian.com.na/top-wrestlers-off-to-spain/', true),
  ('Virinao', 'Nguatjiti', 'virinao-nguatjiti', 'male'::gender, '/athletes/wrestling.jpg', 77, 'Namibian',
   'Greco-Roman wrestler (60 kg); Spain Grand Prix and African Championships national-team regular. Source: https://www.namibian.com.na/top-wrestlers-off-to-spain/', true),
  ('Lafras', 'Uys', 'lafras-uys', 'male'::gender, '/athletes/wrestling.jpg', 77, 'Namibian',
   'Heavyweight freestyle/Greco-Roman wrestler; Spain Grand Prix national-team selection. Source: https://neweralive.na/nam-wrestlers-set-for-spanish-grand-prix-test/', true),
  ('Calvin', 'Dreyer', 'calvin-dreyer', 'male'::gender, '/athletes/wrestling.jpg', 77, 'Namibian',
   '2023 African champion Greco-Roman wrestler; African Continental Championships squad leader. Source: https://www.az.com.na/wrestling-federation-sw/namibia-announces-strong-national-wrestling-team-for-african-continental-championships-nmh009680-11-11284', true),
  ('Ester', 'Abraham', 'ester-abraham', 'female'::gender, '/athletes/wrestling.jpg', 77, 'Namibian',
   'Women''s freestyle / beach wrestling national-team athlete for African Championships. Source: https://www.az.com.na/wrestling-federation-sw/namibia-announces-strong-national-wrestling-team-for-african-continental-championships-nmh009680-11-11284', true),

  -- Chess
  ('Dante', 'Beukes', 'dante-beukes', 'male'::gender, '/athletes/chess.jpg', 28, 'Namibian',
   'Namibia''s first International Master; multiple national champion and FIDE World Cup participant. Source: https://en.wikipedia.org/wiki/Dante_Beukes', true),
  ('Heskiel', 'Ndahangwapo', 'heskiel-ndahangwapo', 'male'::gender, '/athletes/chess.jpg', 28, 'Namibian',
   'FIDE Master / Candidate Master; three-time Namibian national champion and Olympiad top-board player. Source: https://neweralive.na/personality-of-the-week-from-oshakati-to-the-chessboard/', true),
  ('Charles', 'Eichab', 'charles-eichab', 'male'::gender, '/athletes/chess.jpg', 28, 'Namibian',
   'Candidate Master and multi-time national champion; Olympiad regular and FIDE Instructor. Source: https://africachessmedia.com/4388/', true),
  ('Jamie-Nicole', 'Beukes', 'jamie-nicole-beukes', 'female'::gender, '/athletes/chess.jpg', 28, 'Namibian',
   'Woman Candidate Master; Namibian women''s national champion. Source: https://www.republikein.com.na/sport-wrap-main/ndahangwapo-completes-historic-national-treble2025-07-16163628', true),
  ('Lishen', 'Mentile', 'lishen-mentile', 'female'::gender, '/athletes/chess.jpg', 28, 'Namibian',
   'Woman FIDE Master / multi-time women''s national champion; Olympiad representative. Source: https://www.fide.com/dante-beukes-and-lishen-mentile-win-namibia-championship-2021/', true),
  ('Otto', 'Nakapunda', 'otto-nakapunda', 'male'::gender, '/athletes/chess.jpg', 28, 'Namibian',
   'Veteran national champion and Olympiad player; influential figure in Namibian chess development. Source: https://commons.wikimedia.org/wiki/Category:Chess_players_from_Namibia', true)
) AS v(first_name, last_name, slug, gender, photo_url, federation_id, nationality, achievements, is_active)
WHERE NOT EXISTS (
  SELECT 1 FROM sportsplatform_athletes a
  WHERE a.slug = v.slug
     OR (lower(a.first_name) = lower(v.first_name) AND lower(a.last_name) = lower(v.last_name))
);
