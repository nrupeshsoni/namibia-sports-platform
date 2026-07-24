-- WHY: Batch A web research — verified upcoming/past events for big Namibian
-- sports (football, rugby, cricket, athletics, boxing, basketball, netball,
-- hockey, tennis, swimming/aquatics merged). Sources only from official
-- federation calendars, NFA, ESPNcricinfo, The Namibian, New Era, NASFED PDF,
-- Athletics Namibia calendar, SportyHQ, NBC. No fabricated dates/venues.
-- Idempotent: ON CONFLICT (slug) DO NOTHING for inserts; targeted UPDATEs for
-- date corrections. Evidence: docs/research/events_web_batch_A_20260724.md

-- ===== Corrections (verified date fixes) =====
UPDATE sportsplatform_events
SET
  name = 'Davis Cup World Group II Playoff Namibia vs Estonia',
  description = 'Davis Cup World Group II play-off: Namibia hosted Estonia at Central Tennis Club (Olympia), Windhoek. Namibia lost 0–4 and remain in Africa Group III. Source: https://neweralive.na/namibia-readies-for-davis-cup/ ; https://www.namibian.com.na/weakened-namibia-lose-to-estonia/ ; https://en.wikipedia.org/wiki/2026_Davis_Cup',
  start_date = '2026-02-07',
  end_date = '2026-02-08',
  location = 'Central Tennis Club Olympia, Windhoek',
  region = 'Khomas',
  poster_url = COALESCE(poster_url, '/sports/tennis.jpg'),
  is_published = true,
  updated_at = NOW()
WHERE slug = 'davis-cup-namibia-estonia-2026';

UPDATE sportsplatform_events
SET
  name = 'ICC CWC League 2 Tri-Series Windhoek 2026 (NAM/OMA/SCO)',
  description = 'ICC Men''s Cricket World Cup League 2 Round 16 tri-series: Namibia hosted Oman and Scotland at Namibia Cricket Ground, Windhoek (2–12 Apr 2026). Six ODIs (some rain-affected). Followed by a separate Namibia–Scotland T20I series. Source: https://en.wikipedia.org/wiki/2026_Namibia_Tri-Nation_Series ; https://www.espncricinfo.com/series/scotland-in-namibia-2026-1529136/match-schedule-fixtures-and-results ; https://www.icc-cricket.com/',
  start_date = '2026-04-02',
  end_date = '2026-04-12',
  location = 'Namibia Cricket Ground, Windhoek',
  region = 'Khomas',
  poster_url = COALESCE(poster_url, '/sports/cricket-action.jpg'),
  is_published = true,
  updated_at = NOW()
WHERE slug = 'namibia-tri-nation-odi-2026';

UPDATE sportsplatform_events
SET
  description = 'NHU Indoor Men''s Premier League final — Windhoek Old Boys retained the title 7–3 vs School of Excellence; Saints won the Women''s Premier League on log points. Season ran 28 Feb–7 May 2026. Source: https://www.namibian.com.na/old-boys-are-indoor-hockey-champions/ ; https://www.republikein.com.na/sport-wrap-main/nhu-indoor-titles-to-whk-old-boys-and-saints-NMH011084-11-13222 ; https://neweralive.na/indoor-hockey-league-to-resume/',
  poster_url = COALESCE(poster_url, '/sports/hockey.jpg'),
  is_published = true,
  updated_at = NOW()
WHERE slug = 'nhu-indoor-hockey-finals-2026';

UPDATE sportsplatform_events
SET
  description = 'MTC Nestor Sunshine Tobias Boxing & Fitness Academy tribute bonanza honouring Dr Sam Nujoma. Headline: Mateus Heita retained WBO Africa featherweight vs Zolisa Batyi; Fillipus Nghitumbwa won WBO Global super bantamweight vs Leonardo Carrillo (12-bout card). Source: https://neweralive.na/heita-nghitumbwa-triumph-at-tribute-bonanza/',
  poster_url = COALESCE(poster_url, '/sports/boxing-action.jpg'),
  is_published = true,
  updated_at = NOW()
WHERE slug = 'nujoma-boxing-bonanza-2026';

-- ===== Inserts (skip if slug already present) =====
INSERT INTO sportsplatform_events
  (name, slug, description, type, start_date, end_date, location, region, poster_url, is_published, federation_id)
VALUES
-- NFA / Football
(
  'NPFL 2025/26 Final Matchday — African Stars Clinch Title',
  'npfl-final-matchday-2026-04-19',
  'Final round of the Namibia Premier Football League 2025/26: African Stars beat FC Ongos 2–0 at Independence Stadium to seal a fourth consecutive title (58 pts). Source: https://neweralive.na/starlile-makes-it-4-in-a-row-young-brazilians-return-to-the-premier-league/ ; https://en.wikipedia.org/wiki/2025%E2%80%9326_Namibia_Premiership',
  'competition', '2026-04-19', '2026-04-19',
  'Independence Stadium, Windhoek', 'Khomas',
  '/sports/football-action.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'nfa')
),
(
  'Standard Bank Top 8 Cup Final 2026',
  'standard-bank-top-8-final-2026',
  'Mighty Gunners defeated UNAM FC 2–1 at Independence Stadium to win their first Standard Bank Top 8 Cup (N$600 000). Source: https://www.namibian.com.na/gunners-crowned-standard-bank-top-8-champions/ ; https://nfa.org.na/standard-bank-top-8-draw-sets-stage-for-exciting-knockout-action/ ; https://www.nbcnews.na/node/116771',
  'competition', '2026-05-23', '2026-05-23',
  'Independence Stadium, Windhoek', 'Khomas',
  '/sports/football-action.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'nfa')
),
(
  'NFA Cup Finals Day 2026',
  'nfa-cup-finals-2026',
  'NFA Cup finals at Independence Stadium: UNAM FC beat KK Palace 2–1 (men); Mighty Gunners Ladies beat Khomas NAMPOL Ladies 4–0 (women). Source: https://nfa.org.na/nfa-cup-finals-set-after-thrilling-semi-final-action/ ; https://nfa.org.na/unam-fc-and-mighty-gunners-ladies-fc-crowned-fa-cup-champions/ ; https://neweralive.na/unam-fc-ndf-mighty-gunners-ladies-crowned-nfa-cup-champs/',
  'competition', '2026-06-27', '2026-06-27',
  'Independence Stadium, Windhoek', 'Khomas',
  '/sports/football-action.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'nfa')
),
(
  'Nedbank Newspaper Cup Final 2026 (Football)',
  'nedbank-newspaper-cup-final-2026',
  'U20 regional football final of the Nedbank Namibian Newspaper Cup in Keetmanshoop: Erongo defeated Kunene. Tournament 3–6 Apr 2026. Source: https://nfa.org.na/erongo-set-to-face-defending-champions-in-final-of-the-nedbank-namibian-newspaper-cup/ ; https://www.rsssf.org/tablesn/nami2026.html',
  'competition', '2026-04-06', '2026-04-06',
  'Keetmanshoop', '//Kharas',
  '/sports/football-action.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'nfa')
),

-- NRU / Rugby
(
  'Welwitschias Invitational XV vs Zambia 2026',
  'welwitschias-zambia-2026',
  'International friendly: Welwitschia Invitational XV beat Zambia 71–12 at Hage Geingob Rugby Stadium (15:00). Confirmed by NRU/NBC; reported by The Namibian and New Era. Source: https://nbcnews.na/node/117336 ; https://www.namibian.com.na/welwitschias-overpower-zambia/ ; https://neweralive.na/welwitschia-invitational-xv-teach-zambia-a-lesson/',
  'competition', '2026-06-28', '2026-06-28',
  'Hage Geingob Rugby Stadium, Windhoek', 'Khomas',
  '/sports/namibia-rugby-action.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'nru')
),

-- Cricket Namibia
(
  'Scotland T20I Series vs Namibia 2026',
  'scotland-t20i-series-namibia-2026',
  'Three-match T20I series after CWC League 2: Namibia vs Scotland at Namibia Cricket Ground, Windhoek. Scotland won the series 2–1. Source: https://www.espncricinfo.com/series/scotland-in-namibia-2026-1529136/match-schedule-fixtures-and-results ; https://en.wikipedia.org/wiki/2026_Namibia_Tri-Nation_Series',
  'tournament', '2026-04-15', '2026-04-18',
  'Namibia Cricket Ground, Windhoek', 'Khomas',
  '/sports/cricket-action.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'cricket-namibia')
),
(
  'T20I: Namibia vs Scotland (1st)',
  't20i-namibia-scotland-2026-04-15',
  '1st T20I — Scotland won by 7 wickets. Source: https://www.espncricinfo.com/series/scotland-in-namibia-2026-1529136/match-schedule-fixtures-and-results',
  'competition', '2026-04-15', '2026-04-15',
  'Namibia Cricket Ground, Windhoek', 'Khomas',
  '/sports/cricket-action.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'cricket-namibia')
),
(
  'T20I: Namibia vs Scotland (3rd)',
  't20i-namibia-scotland-2026-04-18',
  '3rd T20I — Namibia won by 4 wickets (series finale). Source: https://www.espncricinfo.com/series/scotland-in-namibia-2026-1529136/match-schedule-fixtures-and-results',
  'competition', '2026-04-18', '2026-04-18',
  'Namibia Cricket Ground, Windhoek', 'Khomas',
  '/sports/cricket-action.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'cricket-namibia')
),
(
  'CWC League 2: Namibia vs Oman (Windhoek)',
  'cwcl2-namibia-oman-2026-04-04',
  'ICC CWC League 2 — Oman beat Namibia by 3 wickets (Hammad Mirza century). Source: https://en.wikipedia.org/wiki/2026_Namibia_Tri-Nation_Series ; https://www.espncricinfo.com/series/scotland-in-namibia-2026-1529136/match-schedule-fixtures-and-results',
  'competition', '2026-04-04', '2026-04-04',
  'Namibia Cricket Ground, Windhoek', 'Khomas',
  '/sports/cricket-action.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'cricket-namibia')
),
(
  'CWC League 2: Namibia vs Scotland (Windhoek)',
  'cwcl2-namibia-scotland-2026-04-12',
  'ICC CWC League 2 — Scotland won by 7 wickets (McMullen century). Source: https://en.wikipedia.org/wiki/2026_Namibia_Tri-Nation_Series ; https://www.espncricinfo.com/series/scotland-in-namibia-2026-1529136/match-schedule-fixtures-and-results',
  'competition', '2026-04-12', '2026-04-12',
  'Namibia Cricket Ground, Windhoek', 'Khomas',
  '/sports/cricket-action.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'cricket-namibia')
),
(
  'Namibia T20I Tri-Series 2026 (NAM/HKG/NGA)',
  'namibia-t20-tri-series-2026',
  'Home T20I tri-series: Namibia, Hong Kong and Nigeria at Namibia Cricket Ground, Windhoek. Namibia finished unbeaten atop the table. Source: https://www.espncricinfo.com/series/namibia-t20-tri-series-2026-1539726/match-schedule-fixtures-and-results ; https://www.namibian.com.na/eagles-sweep-to-series-win/',
  'tournament', '2026-06-18', '2026-06-23',
  'Namibia Cricket Ground, Windhoek', 'Khomas',
  '/sports/cricket-action.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'cricket-namibia')
),
(
  'Nigeria OD Series tour of Namibia 2026',
  'nigeria-od-series-namibia-2026',
  'Three-match 50-over series after the T20I tri-series: Namibia vs Nigeria at High Performance Oval / Windhoek (25–29 Jun). Namibia swept the series. Source: https://www.namibian.com.na/eagles-sweep-to-series-win/ ; https://czarsportzauto.com/namibia-nigeria-hong-kong-t20i-tri-series-2026/',
  'tournament', '2026-06-25', '2026-06-29',
  'High Performance Oval, Windhoek', 'Khomas',
  '/sports/cricket-action.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'cricket-namibia')
),

-- Athletics Namibia
(
  'UNAC Open Track & Field 2026',
  'unac-open-track-field-2026',
  'UNAM Athletics Club open track & field meeting, Windhoek. Listed on Athletics Namibia 2026 calendar. Source: https://athletics-namibia.com.na/wp-content/uploads/2026/04/AN-Calendar-Mar-26.pdf',
  'competition', '2026-03-18', '2026-03-18',
  'Windhoek', 'Khomas',
  '/sports/athletics.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'athletics-namibia')
),
(
  'RunOMD 2026',
  'runomd-2026',
  'Road running event in Oranjemund on the Athletics Namibia 2026 calendar (contact Sharlene Isaacs). Source: https://athletics-namibia.com.na/wp-content/uploads/2026/04/AN-Calendar-Mar-26.pdf',
  'competition', '2026-03-28', '2026-03-28',
  'Oranjemund', '//Kharas',
  '/sports/athletics.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'athletics-namibia')
),
(
  'Katutura City Run 2026',
  'katutura-city-run-2026',
  'Inaugural Katutura City Run (10 km + fun run) at Moses van der Byl Primary School / Sam Nujoma Stadium area. Source: https://www.namibian.com.na/successful-debut-for-katutura-city-run/ ; https://athletics-namibia.com.na/wp-content/uploads/2026/04/AN-Calendar-Mar-26.pdf',
  'competition', '2026-04-18', '2026-04-18',
  'Moses van der Byl Primary School, Katutura', 'Khomas',
  '/sports/athletics.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'athletics-namibia')
),
(
  'Athletics Namibia Track & Field Meeting 16 May 2026',
  'athletics-namibia-tf-meeting-2026-05-16',
  'Athletics Namibia track & field meeting, Windhoek — listed on the official 2026 calendar. Source: https://athletics-namibia.com.na/wp-content/uploads/2026/04/AN-Calendar-Mar-26.pdf',
  'competition', '2026-05-16', '2026-05-16',
  'Windhoek', 'Khomas',
  '/sports/athletics.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'athletics-namibia')
),
(
  'Bachmus Marathon 2026',
  'bachmus-marathon-2026',
  'SAT Bachmus Marathon, Swakopmund — Athletics Namibia calendar (Swakop Striders / WVB Road Runners). Source: https://athletics-namibia.com.na/wp-content/uploads/2026/04/AN-Calendar-Mar-26.pdf',
  'competition', '2026-10-03', '2026-10-03',
  'Swakopmund', 'Erongo',
  '/sports/athletics.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'athletics-namibia')
),
(
  'SAT Khomas Regional Championships 2026',
  'sat-khomas-regional-champs-2026',
  'Khomas regional athletics championships, Windhoek — Athletics Namibia 2026 calendar. Source: https://athletics-namibia.com.na/wp-content/uploads/2026/04/AN-Calendar-Mar-26.pdf',
  'competition', '2026-02-14', '2026-02-14',
  'Windhoek', 'Khomas',
  '/sports/athletics.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'athletics-namibia')
),

-- Netball Namibia
(
  'MTC Netball Namibia Premier League 2026 Season',
  'mtc-nnpl-2026-season',
  'MTC NNPL 2026 regular season opened 2–4 May at Khomasdal Stadium (12 clubs incl. Smart Girls, Mighty Gunners, Wanderers). Late rounds include Otjiwarongo (Paresis Sport Field); finals date not yet published at research time. Source: https://www.namibian.com.na/new-challengers-as-mtc-netball-premier-league-returns/ ; https://neweralive.na/defending-champions-ncs-confident-mtc-nnpl-season-looms/ ; https://neweralive.na/netball-race-down-to-the-wire-season-enters-decisive-stage/',
  'tournament', '2026-05-02', NULL,
  'Khomasdal Stadium / rotating venues', 'National',
  '/sports/netball.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-netball')
),

-- NHU / Hockey
(
  'NHU Indoor Hockey League 2026',
  'nhu-indoor-hockey-league-2026',
  'Namibia Hockey Union indoor season: 28 February–7 May 2026 (pathway to national teams). Men''s title retained by Windhoek Old Boys; Saints won women''s Premier. Source: https://neweralive.na/indoor-hockey-league-to-resume/ ; https://www.namibian.com.na/old-boys-are-indoor-hockey-champions/',
  'tournament', '2026-02-28', '2026-05-07',
  'Wanderers Sports Grounds / MTC Dome, Windhoek', 'Khomas',
  '/sports/hockey.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'nhu')
),

-- Tennis Namibia
(
  'HMKV Windhoek Autumn Open 2026',
  'hmkv-windhoek-autumn-open-2026',
  'NTA-sanctioned HMKV (HMVK) Windhoek Autumn Open at Central Tennis Club — 7–12 April 2026 (SportyHQ S326). Covered by New Era / RMB Namibia. Source: https://sportyhq.com/tournament/view/NTA-Senior-Tournament-S326 ; https://neweralive.na/nta-hosts-hmvk-autumn-open/',
  'tournament', '2026-04-07', '2026-04-12',
  'Central Tennis Club, Windhoek', 'Khomas',
  '/sports/tennis.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'tennis-namibia')
),
(
  'NTA Senior Tournament June 2026',
  'nta-senior-tournament-june-2026',
  'Namibia Tennis Association senior tournament (SportyHQ S426) at Central Tennis Club, 5–7 June 2026. Source: https://www.sportyhq.com/tournament/view/NTA-Senior-Tournament-S426',
  'tournament', '2026-06-05', '2026-06-07',
  'Central Tennis Club, Windhoek', 'Khomas',
  '/sports/tennis.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'tennis-namibia')
),
(
  'Billie Jean King Cup Africa Group III 2026',
  'bjk-cup-africa-group3-2026-gaborone',
  'ITF Billie Jean King Cup Africa Group III at National Tennis Centre, Gaborone (13–18 Jul). Namibia finished 7th and retained Group III status. Source: https://neweralive.na/team-namibia-ready-for-billie-jean-king-cup-challenge/ ; https://www.namibian.com.na/namibia-remain-in-africa-group-iii-3/ ; https://www.thegazette.news/sport/bta-eyes-women-tennis-legacy/',
  'tournament', '2026-07-13', '2026-07-18',
  'National Tennis Centre, Gaborone, Botswana', 'International',
  '/sports/tennis.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'tennis-namibia')
),

-- Namibia Aquatics (merged) — swimming/OWS/water polo
(
  'NASFED Water Polo — Katutura 2026',
  'nasfed-water-polo-katutura-2026',
  'NASFED water polo fixture day, Katutura — listed on NASFED Event Calendar 2025–2026. Source: https://swimmingnamibia.com/wp-content/uploads/2025/08/NASFED-EVENT-CALENDAR-2025-2026.pdf',
  'competition', '2026-02-08', '2026-02-08',
  'Katutura, Windhoek', 'Khomas',
  '/sports/swimming-action.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-aquatics')
),
(
  'Point Break Open Water Swim 2026',
  'point-break-ows-2026',
  'Point Break OWS event at Lake Oanob (OTB Sport) — NASFED calendar 7–8 March 2026. Source: https://swimmingnamibia.com/wp-content/uploads/2025/08/NASFED-EVENT-CALENDAR-2025-2026.pdf ; https://swimmingnamibia.com/events/',
  'competition', '2026-03-07', '2026-03-08',
  'Lake Oanob Resort, Rehoboth', 'Hardap',
  '/sports/swimming-action.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-aquatics')
),
(
  'NASFED Open Water Event 4 — Swakopmund 2026',
  'nasfed-ows-event-4-2026',
  'NASFED open water series Event 4, Swakopmund — official 2025–2026 calendar. Source: https://swimmingnamibia.com/wp-content/uploads/2025/08/NASFED-EVENT-CALENDAR-2025-2026.pdf',
  'competition', '2026-04-04', '2026-04-04',
  'Swakopmund', 'Erongo',
  '/sports/swimming-action.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-aquatics')
),

-- Basketball — season window from verified TeamLinkt / opener (no invented finals date)
(
  'KBA 2026 Season (Premier / WKBA / Divisions)',
  'kba-2026-season',
  'Khomas Basketball Association 2026 multi-division season. Verified mid-season weekend 24–26 Jul 2026 at UNAM Gym Hall / BAS courts (TeamLinkt schedule). Season opener previously logged 4–5 Jul. Finals date not published at research time. Source: https://leagues.teamlinkt.com/kba',
  'tournament', '2026-07-04', NULL,
  'UNAM Gym Hall / BAS courts, Windhoek', 'Khomas',
  '/sports/basketball-action.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-basketball')
)
ON CONFLICT (slug) DO NOTHING;
