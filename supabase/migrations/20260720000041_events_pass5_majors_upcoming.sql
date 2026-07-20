-- WHY: Events pass 5 — verified upcoming fixtures for majors with empty
-- forward calendars (NFA AFCON 2027 qualifiers, Cricket Namibia CWC League 2
-- Utrecht, NASFED Commonwealth Games swimming, Athletics Namibia CG athletics,
-- KBA mid-season weekend). Also backfill poster_url on upcoming rows missing
-- sport-matched /sports/* assets. Sources in docs/research/events_enrichment_batch.md.
-- Never invents dates. Applied 2026-07-20.

-- ===== Inserts =====
INSERT INTO sportsplatform_events
  (name, slug, description, type, start_date, end_date, location, region, poster_url, is_published, federation_id)
VALUES
-- NFA — AFCON 2027 qualifiers (CAF windows; Group G: Cameroon, Comoros, Namibia, Congo)
(
  'AFCON 2027 Qualifiers MD1–2 (Group G)',
  'afcon-2027-qualifiers-md1-2-namibia',
  'Brave Warriors Group G matchdays 1–2 in the CAF international window: Namibia vs Congo (MD1) and Comoros vs Namibia (MD2). Exact kick-off days within the window are subject to CAF/NFA confirmation. Source: https://africasoccer.com/2027-afcon-qualifiers-caf-releases-full-fixtures/ ; https://nfa.org.na/namibia-gets-cameroon-comoros-and-congo-for-afcon-qualifiers/ ; https://en.wikipedia.org/wiki/2027_Africa_Cup_of_Nations_qualification',
  'competition', '2026-09-21', '2026-10-06',
  'TBC (home/away per CAF)', 'International',
  '/sports/football-action.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'nfa')
),
(
  'AFCON 2027 Qualifiers MD3–4 (Group G)',
  'afcon-2027-qualifiers-md3-4-namibia',
  'Brave Warriors Group G matchdays 3–4: Cameroon vs Namibia (MD3) and Namibia vs Cameroon (MD4) in the November CAF window. Source: https://africasoccer.com/2027-afcon-qualifiers-caf-releases-full-fixtures/ ; https://en.wikipedia.org/wiki/2027_Africa_Cup_of_Nations_qualification',
  'competition', '2026-11-09', '2026-11-17',
  'TBC (home/away per CAF)', 'International',
  '/sports/football-action.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'nfa')
),
(
  'AFCON 2027 Qualifiers MD5–6 (Group G)',
  'afcon-2027-qualifiers-md5-6-namibia',
  'Brave Warriors Group G matchdays 5–6: Congo vs Namibia (MD5) and Namibia vs Comoros (MD6) in the March 2027 CAF window. Source: https://africasoccer.com/2027-afcon-qualifiers-caf-releases-full-fixtures/ ; https://en.wikipedia.org/wiki/2027_Africa_Cup_of_Nations_qualification',
  'competition', '2027-03-22', '2027-03-30',
  'TBC (home/away per CAF)', 'International',
  '/sports/football-action.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'nfa')
),

-- Cricket Namibia — ICC Men's CWC League 2 (Netherlands host tri-series)
(
  'ICC CWC League 2 Tri-Series Utrecht 2026 (NED/NAM/NEP)',
  'cwcl2-utrecht-tri-series-2026',
  'ICC Men''s Cricket World Cup League 2 tri-series hosted by the Netherlands at Sportpark Maarschalkerweerd (Kampong), Utrecht. Namibia play Nepal (21 & 27 Jul) and Netherlands (25 & 31 Jul). Source: https://www.espncricinfo.com/team/namibia-28/match-schedule-fixtures-and-results ; https://kncb.nl/en/news-netherlands-takes-on-namibia-and-nepal-at-kampong-utrecht-21--31-july ; https://www.icc-cricket.com/news/netherlands-name-squad-for-cwcl2-home-tri-series',
  'tournament', '2026-07-21', '2026-07-31',
  'Sportpark Maarschalkerweerd, Utrecht, Netherlands', 'International',
  '/sports/cricket-action.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'cricket-namibia')
),
(
  'CWC League 2: Namibia vs Nepal (Utrecht)',
  'cwcl2-namibia-nepal-2026-07-21',
  'ICC Men''s Cricket World Cup League 2 — Namibia vs Nepal, Utrecht. Source: https://www.espncricinfo.com/team/namibia-28/match-schedule-fixtures-and-results ; https://kncb.nl/en/news-netherlands-takes-on-namibia-and-nepal-at-kampong-utrecht-21--31-july',
  'competition', '2026-07-21', '2026-07-21',
  'Sportpark Maarschalkerweerd, Utrecht', 'International',
  '/sports/cricket-action.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'cricket-namibia')
),
(
  'CWC League 2: Namibia vs Netherlands (Utrecht)',
  'cwcl2-namibia-netherlands-2026-07-25',
  'ICC Men''s Cricket World Cup League 2 — Namibia vs Netherlands, Utrecht. Source: https://www.espncricinfo.com/team/namibia-28/match-schedule-fixtures-and-results ; https://kncb.nl/en/news-netherlands-takes-on-namibia-and-nepal-at-kampong-utrecht-21--31-july',
  'competition', '2026-07-25', '2026-07-25',
  'Sportpark Maarschalkerweerd, Utrecht', 'International',
  '/sports/cricket-action.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'cricket-namibia')
),
(
  'CWC League 2: Namibia vs Nepal (Utrecht, 2nd)',
  'cwcl2-namibia-nepal-2026-07-27',
  'ICC Men''s Cricket World Cup League 2 — Namibia vs Nepal (second meeting), Utrecht. Source: https://www.espncricinfo.com/team/namibia-28/match-schedule-fixtures-and-results ; https://kncb.nl/en/news-netherlands-takes-on-namibia-and-nepal-at-kampong-utrecht-21--31-july',
  'competition', '2026-07-27', '2026-07-27',
  'Sportpark Maarschalkerweerd, Utrecht', 'International',
  '/sports/cricket-action.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'cricket-namibia')
),
(
  'CWC League 2: Netherlands vs Namibia (Utrecht)',
  'cwcl2-netherlands-namibia-2026-07-31',
  'ICC Men''s Cricket World Cup League 2 — Netherlands vs Namibia, Utrecht. Source: https://www.espncricinfo.com/team/namibia-28/match-schedule-fixtures-and-results ; https://kncb.nl/en/news-netherlands-takes-on-namibia-and-nepal-at-kampong-utrecht-21--31-july',
  'competition', '2026-07-31', '2026-07-31',
  'Sportpark Maarschalkerweerd, Utrecht', 'International',
  '/sports/cricket-action.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'cricket-namibia')
),

-- Swimming — Commonwealth Games Glasgow 2026 (named NASFED squad)
(
  'Commonwealth Games Glasgow 2026 (Swimming)',
  'commonwealth-games-2026-swimming-namibia',
  'Namibia Aquatic Sports Federation swimmers Jessica Humphrey, Luke Beukes, José Canjulo, Oliver Durand and Ronan Wantenaar selected for Team Namibia at Glasgow 2026 (23 Jul–2 Aug). Source: https://economist.com.na/107239/sport/23-athletes-to-participate-in-the-upcoming-2026-glasgow-commonwealth-games/ ; https://neweralive.na/namibian-swimmers-ready-for-commonwealth-games/',
  'competition', '2026-07-23', '2026-08-02',
  'Glasgow, Scotland', 'International',
  '/sports/swimming-action.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'swimming-namibia')
),

-- Athletics deepen — Commonwealth Games Glasgow 2026
(
  'Commonwealth Games Glasgow 2026 (Athletics)',
  'commonwealth-games-2026-athletics-namibia',
  'Athletics Namibia squad Chenoul Coetzee, Elvis Gaseb, Charley Matundu and Ryan Williams selected for Glasgow 2026; para-athletics Ananias Shikongo (guide Even Tjiviju). Source: https://economist.com.na/107239/sport/23-athletes-to-participate-in-the-upcoming-2026-glasgow-commonwealth-games/ ; https://neweralive.na/namibia-announces-glasgow-squad/',
  'competition', '2026-07-23', '2026-08-02',
  'Glasgow, Scotland', 'International',
  '/sports/athletics.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'athletics-namibia')
),

-- Basketball — KBA mid-season weekend (TeamLinkt schedule)
(
  'KBA Premier League Mid-Season Weekend 24–26 Jul 2026',
  'kba-midseason-weekend-2026-07',
  'Khomas Basketball Association mid-season fixtures at UNAM Gym Hall / BAS courts: Fri 24 Jul (Wolves vs NUST Gladiators; Rebels vs QBC), Sat 25 Jul and Sun 26 Jul multi-division slate (Premier, WKBA, Division 1). Source: https://leagues.teamlinkt.com/kba ; opener context https://www.namibiansun.com/basketball-sw/kba-league-tips-off-this-weekend-nmh006815-11-7612',
  'competition', '2026-07-24', '2026-07-26',
  'UNAM Gym Hall / BAS courts, Windhoek', 'Khomas',
  '/sports/basketball-action.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-basketball')
),
(
  'KBA Midweek: Cadets vs Afro Stars II',
  'kba-midweek-cadets-afrostars-2026-07-29',
  'KBA Division 1 midweek fixture UNAM Cadets vs Afro Stars II at UNAM Gym Hall. Source: https://leagues.teamlinkt.com/kba',
  'competition', '2026-07-29', '2026-07-29',
  'UNAM Gym Hall, Windhoek', 'Khomas',
  '/sports/basketball-action.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-basketball')
);

-- ===== Poster backfill (upcoming missing posters) =====
UPDATE sportsplatform_events SET poster_url = '/sports/archery.jpg', updated_at = NOW()
WHERE slug IN ('african-archery-champs-2026', 'world-games-archery-2026')
  AND (poster_url IS NULL OR poster_url = '');

UPDATE sportsplatform_events SET poster_url = '/sports/athletics.jpg', updated_at = NOW()
WHERE slug IN ('commonwealth-games-2026-namibia', 'top-score-nec-2026', 'youth-olympic-games-2026-namibia')
  AND (poster_url IS NULL OR poster_url = '');

UPDATE sportsplatform_events SET poster_url = '/sports/equestrian.jpg', updated_at = NOW()
WHERE slug IN (
  'fei-jumping-world-challenge-windhoek-2026',
  'namef-gcw-nam-champs-2026',
  'namef-rco-nam-jumping-champs-2026',
  'namef-eventing-nam-champs-2026'
) AND (poster_url IS NULL OR poster_url = '');

UPDATE sportsplatform_events SET poster_url = '/sports/boxing-action.jpg', updated_at = NOW()
WHERE slug = 'boxing-clinic-kavango-2026'
  AND (poster_url IS NULL OR poster_url = '');

UPDATE sportsplatform_events SET poster_url = '/sports/tennis.jpg', updated_at = NOW()
WHERE slug = 'davis-cup-africa-group3-2026'
  AND (poster_url IS NULL OR poster_url = '');

UPDATE sportsplatform_events SET poster_url = '/sports/padel.jpg', updated_at = NOW()
WHERE slug = 'nambru-rhino-rally-padel-2026'
  AND (poster_url IS NULL OR poster_url = '');

UPDATE sportsplatform_events SET poster_url = '/sports/handball.jpg', updated_at = NOW()
WHERE slug = 'regional-handball-swakopmund-2026'
  AND (poster_url IS NULL OR poster_url = '');

UPDATE sportsplatform_events SET poster_url = '/sports/beach-volleyball.jpg', updated_at = NOW()
WHERE slug = 'cavb-beach-volleyball-leg5-namibia-2026'
  AND (poster_url IS NULL OR poster_url = '');

UPDATE sportsplatform_events SET poster_url = '/sports/frisbee.jpg', updated_at = NOW()
WHERE slug = 'anuc-ultimate-frisbee-2026'
  AND (poster_url IS NULL OR poster_url = '');

UPDATE sportsplatform_events SET poster_url = '/sports/powerlifting.jpg', updated_at = NOW()
WHERE slug = 'african-classic-powerlifting-2026'
  AND (poster_url IS NULL OR poster_url = '');

UPDATE sportsplatform_events SET poster_url = '/sports/triathlon.jpg', updated_at = NOW()
WHERE slug = 'triathlon-yog-qualifier-2026'
  AND (poster_url IS NULL OR poster_url = '');

UPDATE sportsplatform_events SET poster_url = '/sports/cycling.jpg', updated_at = NOW()
WHERE slug = 'nedbank-desert-dash-2026'
  AND (poster_url IS NULL OR poster_url = '');

-- Past swimming rows still missing posters
UPDATE sportsplatform_events SET poster_url = '/sports/swimming-action.jpg', updated_at = NOW()
WHERE slug IN ('aquatics-nationals-2026', 'swimming-champs-2026')
  AND (poster_url IS NULL OR poster_url = '');
