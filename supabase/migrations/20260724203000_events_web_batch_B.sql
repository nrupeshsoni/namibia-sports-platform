-- WHY: Public-web Batch B — verified dated events for golf, cycling, motorsport,
-- triathlon, karate, taekwondo, judo (none new), wrestling, powerlifting,
-- gymnastics, dance sport, badminton (none verified), table tennis, volleyball
-- (indoor already covered), beach volleyball. Sources in
-- docs/research/events_web_batch_B_20260724.md. Idempotent: ON CONFLICT (slug) DO NOTHING.
-- Applied 2026-07-24 via Supabase MCP.

INSERT INTO sportsplatform_events
  (name, slug, description, type, start_date, end_date, location, region, poster_url, is_published, federation_id)
VALUES

-- ===== Golf Namibia =====
(
  'Corner Butcher Gold Cup 2025',
  'corner-butcher-gold-cup-2025',
  'NAGU-sanctioned Gold Cup at Windhoek Golf Club (WAGR / national merit points); Corner Butcher title sponsor. Likius Nande overall gross champion (210). Source: https://neweralive.na/nande-shines-corner-butcher-elevates-gold-cup/',
  'tournament', '2025-11-22', '2025-11-23',
  'Windhoek Golf Club, Windhoek', 'Khomas',
  '/sports/golf.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'golf-namibia')
),
(
  'Battle of the Social Groups Competition 2025',
  'battle-social-groups-golf-2025',
  'Windhoek Golf Club social-groups competition announced as the next major club fixture after the Corner Butcher Gold Cup. Source: https://neweralive.na/nande-shines-corner-butcher-elevates-gold-cup/',
  'competition', '2025-11-29', '2025-11-29',
  'Windhoek Golf Club, Windhoek', 'Khomas',
  '/sports/golf.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'golf-namibia')
),
(
  'Team Stableford Multiplier (Windhoek Golf Club) 2026',
  'team-stableford-multiplier-2026',
  'Windhoek Golf Club Team Stableford Multiplier tournament (announced after the 2026 Gold Cup). Source: https://www.sportwrap.com.na/golf-sw/haseb-wins-gold-cup-nmh012353-11-15036',
  'competition', '2026-06-20', '2026-06-20',
  'Windhoek Golf Club, Windhoek', 'Khomas',
  '/sports/golf.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'golf-namibia')
),

-- ===== Namibia Cycling Federation =====
(
  'Nedbank Windhoek Pedal Power Series WPP 1 2026',
  'nedbank-wpp1-2026',
  'Opening leg of the 2026 Nedbank Windhoek Pedal Power road series — airport-road race; Dutch rider Daniel Abrahams won elite men; Anri Greeff edged Vera Looser in elite women. Source: https://www.namibian.com.na/cycling-season-in-full-swing/ ; https://www.nedbank.com.na/group/news-insights/press/nedbank-namibia-champions-cycling-excellence---nedbank-namibia.html',
  'competition', '2026-01-10', '2026-01-11',
  'Airport Road / Windhoek', 'Khomas',
  '/sports/cycling.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-cycling')
),
(
  'Nedbank Namibian National Road & Time Trial Championships 2026',
  'nedbank-national-road-tt-champs-2026',
  'UCI-sanctioned national ITT (6 Feb) and road race (8 Feb) on A1 Dr Hage Geingob Freeway. Elite ITT: Martin Freyer / Anri Greeff; road: Roger Surén (photo-finish vs Alex Miller) / Anri Greeff. Source: https://www.nedbank.com.na/group/news-insights/press/national-road-race-champions-crowned.html ; https://www.nedbank.com.na/group/news-insights/press/national-road-time-trial-championships.html ; https://www.thevillager.com.na/national/2026/suren-and-greeff-claim-2026-national-cycling-jerseys/',
  'competition', '2026-02-06', '2026-02-08',
  'A1 Dr Hage Geingob Freeway, Windhoek', 'Khomas',
  '/sports/cycling.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-cycling')
),

-- ===== Motorsport Namibia =====
(
  'National Circuit Racing Championship Leg 1 2026',
  'nmsf-circuit-leg1-2026',
  'Season opener of the National Circuit Racing Championship at Tony Rust Race Track — record nine entries; Class winners included Deon Friedenthal (B), Clive Strydom (C), Rassie Rietz (D), Ndapa Auala (X). Source: https://www.namibian.com.na/bittersweet-circuit-racing-opener-makes-history/ ; https://racingcalendar.net/championship/windhoek-motor-club-national-circuit-championship/2026',
  'competition', '2026-03-14', '2026-03-14',
  'Tony Rust Race Track, Windhoek', 'Khomas',
  '/sports/motorsport.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'motorsport-namibia')
),

-- ===== Triathlon Namibia =====
(
  'Namibian National Sprint Triathlon Championships 2026',
  'namibia-national-sprint-triathlon-2026',
  'National para, youth and age-group sprint triathlon championships contested the same day as the Africa Triathlon Premium Cup / Junior Cup at the Mole, Swakopmund. Elite national sprint: Tyrone Kotze. Source: https://www.namibiansun.com/local/international-talent-shines-at-africa-cup-in-swakopmund-nmh008358-11-9441 ; https://events.triathlon.org/2026-africa-triathlon-premium-cup-swakopmund',
  'competition', '2026-03-21', '2026-03-21',
  'The Mole, Swakopmund', 'Erongo',
  '/sports/triathlon.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'triathlon-namibia')
),

-- ===== Karate Namibia =====
(
  'FNB SKAI National Championship 2025',
  'fnb-skai-nationals-2025',
  'Shotokan Karate Academy International (SKAI) FNB National Championship at Windhoek Showgrounds Sports Plaza Hall. Source: https://www.kihapp.com/tournaments/16161-2024-fnb-skai-national-championship',
  'tournament', '2025-08-03', '2025-08-03',
  'Windhoek Showgrounds Sports Plaza Hall, Windhoek', 'Khomas',
  '/sports/karate.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'karate-namibia')
),
(
  '2nd Southern Africa WUKF Open Championship 2025',
  'wukf-southern-africa-open-2025',
  '2nd Southern Africa WUKF Open Championship hosted in Windhoek (entries closed 19 Sep 2025). Source: https://www.kihapp.com/tournaments/21832-2nd-southern-africa-wukf-open-championship ; https://www.kihapp.com/tournaments?country=Namibia',
  'tournament', '2025-10-11', '2025-10-11',
  'Windhoek Showgrounds Sports Plaza Hall, Windhoek', 'Khomas',
  '/sports/karate.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'karate-namibia')
),

-- ===== Taekwondo Namibia =====
(
  'Wuxi 2025 World Taekwondo Championships (Namibia debut)',
  'wt-worlds-wuxi-2025',
  'Namibia’s first World Taekwondo Championships appearance — Owen Samunzala selected; event at Wuxi Taihu International Expo Center, China. Source: https://neweralive.na/namibias-taekwondo-federation-eyes-global-stage/ ; https://www.worldtaekwondo.org/ (Wuxi 2025)',
  'competition', '2025-10-24', '2025-10-30',
  'Wuxi, China', 'International',
  '/sports/taekwondo.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'taekwondo-namibia')
),
(
  'Gangwon·Chuncheon 2026 World Para Taekwondo Open Challenge',
  'para-tkd-open-gangwon-2026',
  'World Para Taekwondo Open Challenge in Gangwon·Chuncheon, Korea — Namibia preparing via Muju development camp (only SADC nation at camp). Source: https://neweralive.na/namibia-shine-at-taekwondo-development-camp-in-south-korea/',
  'competition', '2026-07-08', '2026-07-09',
  'Gangwon·Chuncheon, South Korea', 'International',
  '/sports/taekwondo.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'taekwondo-namibia')
),

-- ===== Wrestling Namibia =====
(
  'Namib Storm Wrestling Week & SADC Open Championships 2025',
  'namib-storm-sadc-open-2025',
  'UWW / Olympic Solidarity Namib Storm week at Windhoek Showgrounds: REDT coaching & refereeing camp (30 Jun–3 Jul), SADC Open Championships (4 Jul — first UWW-rated event in Southern Africa), beach wrestling showcase (5 Jul). Source: https://uww.org/article/wrestling-enters-new-era-southern-africa-namib-storm-and-sadc-open-championships',
  'tournament', '2025-06-30', '2025-07-05',
  'Windhoek Showgrounds, Windhoek', 'Khomas',
  '/sports/wrestling.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'wrestling-namibia')
),
(
  'Namibia Beach Wrestling Debut (Swakopmund Mole) 2025',
  'beach-wrestling-swakopmund-2025',
  'First official beach wrestling competition on a Namibian ocean beach — ~50 wrestlers, hosted by Swakop Wrestling Academy at the Mole (Saturday 6 Dec 2025). Source: https://neweralive.na/swakop-hosts-first-beach-wrestling-competition/ ; https://www.namibiansun.com/sport-wrap-main/beach-wrestling-makes-its-debut2025-12-08179265',
  'competition', '2025-12-06', '2025-12-06',
  'The Mole, Swakopmund', 'Erongo',
  '/sports/wrestling.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'wrestling-namibia')
),

-- ===== Powerlifting (NPA) — weightlifting-namibia is soft-merged =====
(
  'NPA National Qualifier Championships 2025',
  'npa-national-qualifier-2025',
  'Namibia Powerlifting Association National Qualifier Championships at CrossFit Windhoek — squat/bench/deadlift; official qualifier for WPC African and World Championships. Source: https://neweralive.na/national-powerlifting-showdown-awaits/',
  'competition', '2025-07-25', '2025-07-25',
  'CrossFit Windhoek, Windhoek', 'Khomas',
  '/sports/weightlifting.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'powerlifting-namibia')
),
(
  'WPC World Powerlifting Championships Brazil 2025 (Namibia)',
  'wpc-worlds-brazil-2025',
  'World Powerlifting Congress World Championships, Santa Catarina, Brazil — Phillipus Shangadi podium (3rd overall raw; 2nd biceps curl). Source: https://neweralive.na/shangadi-gets-bronze-in-brazil/ ; https://www.republikein.com.na/sport-wrap-main/shangadi-secures-jsb-sponsorship-for-brazil-trip2025-10-15173768',
  'competition', '2025-10-22', '2025-10-26',
  'Santa Catarina, Brazil', 'International',
  '/sports/weightlifting.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'powerlifting-namibia')
),
(
  'AWPC Open Deadlift Competition Windhoek 2026',
  'awpc-deadlift-windhoek-2026',
  'Open-class deadlift competition in Windhoek — Melt Meyer’s open debut (1st, men’s open); qualifier pathway toward AWPC South African / African Championships. Source: https://www.namibian.com.na/meyer-qualifies-for-african-championships/',
  'competition', '2026-03-28', '2026-03-28',
  'Windhoek', 'Khomas',
  '/sports/weightlifting.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'powerlifting-namibia')
),
(
  'AWPC African Championships Durban 2026',
  'awpc-african-championships-durban-2026',
  'Amateur World Powerlifting Congress African Championships in Durban — Melt Meyer qualified via AWPC South African Championships (300 kg deadlift). Source: https://www.namibian.com.na/meyer-qualifies-for-african-championships/',
  'competition', '2026-09-24', '2026-09-24',
  'Durban, South Africa', 'International',
  '/sports/weightlifting.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'powerlifting-namibia')
),

-- ===== Namibia Gymnastics Federation =====
(
  'NGF Rhythmic Senior / Novice National Championships 2025',
  'ngf-rhythmic-nationals-senior-novice-2025',
  'Namibia Gymnastics Federation rhythmic senior/novice national competition in Windhoek (17–18 Oct 2025); selection pathway toward Happy Cup Belgium and Region 5. Source: https://www.namibiansun.com/my-zone/duneside-gymnasts-shine-at-national-championships2025-11-13176592',
  'competition', '2025-10-17', '2025-10-18',
  'Windhoek', 'Khomas',
  '/sports/gymnastics.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-gymnastics')
),

-- ===== Dance Sport Namibia =====
(
  'Global Dance Supreme World Dance Championship Bangkok 2026',
  'dancesport-world-bangkok-2026',
  'Global Dance Supreme World Dance Championship relocated from Dubai to Bangkok (15–17 Jul); Dance Sport Namibia / GDS Namibia crew divisions selected. Source: https://neweralive.na/namibian-dancers-ready-to-sizzle-dance-champs-move-to-bangkok/',
  'competition', '2026-07-15', '2026-07-17',
  'Bangkok, Thailand', 'International',
  '/sports/dance-sport.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'dance-sport-namibia')
),

-- ===== Table Tennis Namibia =====
(
  'NTTA Senior / Open Championship 2025',
  'ntta-senior-open-championship-2025',
  'Phoenix Namibia Assurance–sponsored NTTA Open / senior championship at Wanderers Sports Hall (21 Jun 2025) — final prep before Region 5 Youth Games and Senior Regional Championships. Source: https://www.namibiansun.com/sport-wrap-main/ntta-junior-champs-in-preparation-for-youth-games2025-06-12159859 ; https://www.namibiansun.com/sport-wrap-main/ntta-concludes-final-preps-for-region-5-youth-games2025-06-25161252',
  'tournament', '2025-06-21', '2025-06-21',
  'Wanderers Sports Hall, Windhoek', 'Khomas',
  '/sports/table-tennis.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'table-tennis-namibia')
),
(
  'AUSC Region 5 Youth Games Table Tennis 2025',
  'region5-youth-games-table-tennis-2025',
  'Table tennis competition at the AUSC Region 5 Youth Games hosted in Windhoek / Swakopmund (Games 4–13 Jul 2025); NTTA campaign at Windhoek Showgrounds from 4 Jul. Source: https://www.republikein.com.na/sport-wrap-main/ntta-youth-games-preparations-included-hp-centre2025-07-04162321',
  'tournament', '2025-07-04', '2025-07-11',
  'Windhoek Showgrounds, Windhoek', 'Khomas',
  '/sports/table-tennis.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'table-tennis-namibia')
),

-- ===== Namibia Beach Volleyball =====
(
  'DTS Liqui Fruit International Beach Volleyball Tournament 2025',
  'dts-liqui-fruit-beach-volleyball-2025',
  'International beach volleyball tournament at DTS Beach Volleyball Arena, Windhoek — 40 teams (men/women/U19) from Namibia, Germany, Botswana, Angola, South Africa; N$15,000 prize pool. Source: https://www.namibian.com.na/top-class-action-liqui-fruit-international-beach-volleyball-tourney/',
  'tournament', '2025-03-08', '2025-03-09',
  'DTS Beach Volleyball Arena, Windhoek', 'Khomas',
  '/sports/beach-volleyball.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-beach-volleyball')
),
(
  'Bank Windhoek Beach Volleyball Open (Swakopmund) 2025',
  'bank-windhoek-beach-volleyball-open-2025',
  'Second leg of Namibia’s national beach volleyball tour at The Mole, Swakopmund — 40 teams / 80 players; winners Theodor Thomas & Simeon Ndaxula (men), Pia Lück & Rosie Hennes (women). Source: https://www.namibiansun.com/sport-wrap-main/namibia%E2%80%99s-top-teams-dominate-at-swakop-beach-volleyball-open2025-05-07156129',
  'tournament', '2025-05-03', '2025-05-04',
  'The Mole, Swakopmund', 'Erongo',
  '/sports/beach-volleyball.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-beach-volleyball')
)

ON CONFLICT (slug) DO NOTHING;
