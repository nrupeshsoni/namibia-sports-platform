-- WHY: Beta content hole — after Pass 3, ~46/83 active federations still had 0 news
-- (baseline 59 published / 37 feds). Seeds 14 original paraphrased pieces with /sports/*
-- featured images for previously zero-news federations (ministry + 13 codes).
-- Sources attributed in content (New Era / The Namibian / Namibian Sun / WE / Informanté).
-- Idempotent: ON CONFLICT (slug) DO NOTHING.
-- Evidence: docs/research/news_enrichment_batch.md (Pass 4)
-- Applied 2026-07-21.

INSERT INTO sportsplatform_news_articles
  (title, slug, summary, content, federation_id, category, tags, featured_image, is_published, published_at)
VALUES

-- 1. Ministry — Vote 27 sport/youth funding uplift
(
  'Government Lifts Sport and Youth Budget by 46 Percent',
  'ministry-sport-youth-budget-uplift-2025',
  'Vote 27 received about N$1.27 billion for 2025/26, a 46% increase focused on sports development and infrastructure.',
  E'The Ministry of Sport, Youth and National Service secured a 46% uplift for Vote 27 in the 2025/26 financial year, with a total allocation of about N$1.27 billion.

Sports development takes the largest share of the operational budget, while capital spending prioritises youth and sports infrastructure nationwide. Officials framed the increase as a signal that elite pathways, community facilities and youth programmes remain national priorities alongside creative industries support.

Original summary for sports.com.na. Source: https://www.namibian.com.na/government-boosts-youth-and-sport-funding-by-46-for-2025-26-financial-year/',
  (SELECT id FROM sportsplatform_federations WHERE slug = 'ministry-sport'),
  'ministry',
  ARRAY['MSYNS','budget','Vote 27','infrastructure'],
  '/sports/athletics.jpg',
  true,
  '2025-04-10 10:00:00'
),

-- 2. Padel — inaugural NPPL
(
  'Namibia Professional Padel League Launches Year-Round Competition',
  'namibia-padel-nppl-league-launch-2026',
  'Padel Addicts and LIV Padel Windhoek launched the NPPL as Namibia''s first unified professional padel league structure.',
  E'The Namibia Professional Padel League (NPPL) opened as a year-round competitive platform with weekly league blocks of 11 to 22 weeks plus three major weekend tournaments at LIV Padel Windhoek.

Organisers Padel Addicts and LIV Padel said the structure answers rising demand for consistent, professionally managed competition as padel expands nationwide. NPPL representative Harald Fuelle said players had been asking for a pathway that supports long-term development, with the league also progressing Namibia Sports Commission registration.

Original summary for sports.com.na. Source: https://neweralive.na/first-ever-padel-league-starts-today/',
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-padel-tennis'),
  'padel',
  ARRAY['NPTF','NPPL','LIV Padel','Windhoek'],
  '/sports/padel.jpg',
  true,
  '2026-03-15 11:00:00'
),

-- 3. Rowing — coastal sprints debut Cape Town
(
  'Namibia Rowers Make Historic Coastal Sprints Debut in Cape Town',
  'namibia-rowing-coastal-sprints-debut-2026',
  'A six-member national squad was sent off by NNOC and NSC ahead of Namibia''s first Coastal Rowing Sprints Championship.',
  E'Namibia''s national rowing team competed for the first time at the Coastal Rowing Sprints Championship in Cape Town from 27 to 28 June 2026, entering single, double and mixed events.

NNOC and the Namibia Sports Commission hosted a Windhoek send-off for the six athletes. Rowing Federation convener Commander Charles Mukua called the outing a development step toward later Olympic-pathway races, while NSC chief administrator Dr Freddy Mwiya urged the squad to treat the debut as the start of a longer international journey.

Original summary for sports.com.na. Source: https://informante.web.na/?p=396782',
  (SELECT id FROM sportsplatform_federations WHERE slug = 'rowing-namibia'),
  'rowing',
  ARRAY['Rowing Namibia','coastal rowing','Cape Town','NNOC'],
  '/sports/rowing.jpg',
  true,
  '2026-06-26 14:00:00'
),

-- 4. Esports — GEF Los Angeles qualifier pathway
(
  'NESA Opens National Qualifiers for Global Esports Games 2026',
  'nesa-global-esports-games-qualifiers-2026',
  'Namibia''s electronic sports body opened registrations across five titles for the road to Los Angeles in December 2026.',
  E'The Namibian Electronic Sports Association (NESA) opened national qualifier registrations for Team Namibia selection toward the Global Esports Games in Los Angeles from 1 to 7 December 2026.

Five titles are contested — eFootball, Counter-Strike 2, Mobile Legends: Bang Bang, Clash Royale and NBA 2K — with open and women''s pathways where applicable. Online and offline rounds feed a 25 July 2026 grand final, with category winners advancing to African regional qualifiers in August.

Original summary for sports.com.na. Source: https://www.we.com.na/local-news-we/nesa-opens-global-esports-qualifier-nmh012771-4-15638',
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-esports'),
  'esports',
  ARRAY['NESA','GEF','Los Angeles','qualifiers'],
  '/sports/esports.jpg',
  true,
  '2026-06-20 09:00:00'
),

-- 5. Futsal — inaugural NFA Futsal Cup
(
  'Quality FC Crowned Champions of Inaugural NFA Futsal Cup',
  'quality-fc-nfa-futsal-cup-champions-2026',
  'Quality FC beat Chile FC 4–2 in the final as the NFA staged its first national Futsal Cup showcase.',
  E'Quality FC wrote the opening chapter of Namibia''s national futsal cup history with a 4–2 final win over Chile FC in the inaugural NFA Futsal Cup.

NFA Futsal Officer Donawald Modise rated the tournament a strong foundation for club competition, coach and referee education, and youth pathways into national teams. Individual awards recognised top scorers and standout Quality FC performers as officials pledged to grow future editions beyond a one-off showcase.

Original summary for sports.com.na. Source: https://neweralive.na/quality-fc-crowned-nfa-futsal-cup-champions/',
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-futsal'),
  'futsal',
  ARRAY['NFA Futsal','Quality FC','Chile FC','cup'],
  '/sports/futsal.jpg',
  true,
  '2026-05-12 16:00:00'
),

-- 6. Sailing — Junior Nationals Walvis Bay
(
  'Emily Zander Leads Field at Junior National Sailing Championships',
  'junior-national-sailing-champions-walvis-bay-2026',
  'The Namibia Sailing Association crowned junior champions across Laser, Optimist and PICO classes in Walvis Bay.',
  E'The Namibia Sailing Association hosted Junior National Sailing Championships over Easter weekend in Walvis Bay, with sailors handling light delays and stronger afternoon winds across two race days.

Emily Zander took overall honours ahead of Mariel Thompson and Robert Zander, with class podiums spanning Laser, Optimist and PICO. Oliver Menges earned Most Improved Sailor after less than two months on the water. NSA thanked Catamaran Charters for continued junior sponsorship.

Original summary for sports.com.na. Source: https://www.namibiansun.com/local/junior-national-sailing-champions-crowned-nmh009153-11-10554',
  (SELECT id FROM sportsplatform_federations WHERE slug = 'sailing-namibia'),
  'sailing',
  ARRAY['NSA','Walvis Bay','Laser','junior nationals'],
  '/sports/sailing.jpg',
  true,
  '2026-04-22 12:00:00'
),

-- 7. Canoeing — African slalom / kayak cross medals
(
  'Boshoff Siblings Paddle Namibia onto African Canoe Podiums',
  'boshoff-brothers-african-canoe-slalom-medals-2026',
  'Marzel and Pieter Boshoff collected multiple medals at the African Canoe Slalom and Kayak Cross Championships.',
  E'Namibia announced itself on the continental paddle stage when Marzel and Pieter Boshoff returned with a medal haul from the African Canoe Slalom and Kayak Cross Championships.

Competing at their first continental championships under coach Herman Jacobie, Marzel took junior women''s K1 slalom silver plus several kayak-cross podiums, while Pieter earned junior men''s kayak-cross bronze. Federation officials said the event — Africa''s first continental slalom/kayak-cross championships since 2015 — is a vital exposure platform for canoeing at home.

Original summary for sports.com.na. Source: https://neweralive.na/boshoff-brothers-paddle-namibia-into-history/',
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-canoeing'),
  'canoeing',
  ARRAY['NCan','slalom','kayak cross','Boshoff'],
  '/sports/canoeing.jpg',
  true,
  '2026-02-10 10:00:00'
),

-- 8. Climbing — Spitzkoppe boom
(
  'Rock Climbing Boom Puts Spitzkoppe on Adventure Sport Map',
  'spitzkoppe-rock-climbing-boom-namibia',
  'Local operators report surging demand for guided climbs at Spitzkoppe as Namibia taps adventure tourism.',
  E'Rock climbing is emerging alongside Namibia''s better-known adventure sports, with Spitzkoppe drawing international climbers and a growing local guiding industry.

Operators such as Climbaway Adventures and Namib Adventure report rising bookings on the granite massif that rises roughly 700 m above the desert floor. Climbers and guides also flag Waterberg access talks and deep-water solo potential at Lake Guinas near Tsumeb as next frontiers for the Namibia Climbing community.

Original summary for sports.com.na. Source: https://www.namibian.com.na/rock-climbing-booming-at-spitzkoppe/',
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-climbing'),
  'climbing',
  ARRAY['Spitzkoppe','adventure sport','climbing','tourism'],
  '/sports/climbing.jpg',
  true,
  '2025-11-18 09:00:00'
),

-- 9. Ice & Inline Hockey — World Skate Games bronze
(
  'Inline Hockey Team Earns Heroes'' Welcome after World Skate Bronze',
  'namibia-inline-hockey-world-skate-bronze-2025',
  'Namibia beat France 3–2 for bronze on debut at the World Skate Games in China.',
  E'Namibia''s national inline hockey team received a heroes'' welcome at Hosea Kutako International Airport after claiming bronze at the World Skate Games in China.

The side defeated France 3–2 in the third-place playoff after earlier wins over Chinese Taipei, the Czech Republic and China. Coach Nadia Schmidt — the first woman to lead the men''s national team — praised the squad''s resilience, while NIIHA president Heiko Lucks called it the federation''s best-ever result from a young team averaging just 20.9 years of age.

Original summary for sports.com.na. Source: https://www.namibian.com.na/heroes-welcome-for-namibias-inline-hockey-team/',
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-ice-inline-hockey'),
  'ice-hockey',
  ARRAY['NIIHA','World Skate','bronze','inline hockey'],
  '/sports/ice-hockey.jpg',
  true,
  '2025-08-18 15:00:00'
),

-- 10. Surfing — national championships Walvis Bay
(
  'National Surfing Championships Ride Big Swell at Walvis Bay',
  'namibia-national-surfing-championships-walvis-bay',
  'The Maersk Radiowave Namibia national surfing championships went ahead at Walvis Bay after a small-wave postponement.',
  E'The Maersk Radiowave Namibia national surfing championships were contested at Walvis Bay after organisers postponed the previous weekend when waves were too small.

When conditions finally delivered, competitors rode a bigger swell that rewarded timing and ocean knowledge along the central coast. Surfing Namibia used the nationals to crown seasonal champions and keep competitive pathways active for a code that also draws global attention to Skeleton Bay.

Original summary for sports.com.na. Source: https://www.namibian.com.na/surfing-champs-in-big-waves/',
  (SELECT id FROM sportsplatform_federations WHERE slug = 'surfing-namibia'),
  'surfing',
  ARRAY['Surfing Namibia','Walvis Bay','nationals','Radiowave'],
  '/sports/surfing.jpg',
  true,
  '2025-07-28 13:00:00'
),

-- 11. Shooting — World Hunting Rifle titles at Otjiwa
(
  'Marais Duo Claim World Hunting Rifle Titles on Home Soil',
  'namibia-hunting-rifle-world-championships-otjiwa',
  'Francois Marais retained the overall world title and Carola Marais won women''s .222/.223 at Otjiwa Lodge.',
  E'Namibia hosted the World Hunting Rifle Shooting Championships at Otjiwa Lodge south of Otjiwarongo, where Francois Marais retained the overall world title and Carola Marais was crowned .222/.223 women''s champion.

Teams from Sweden, South Africa, the Czech Republic and Namibia contested windy, multi-range courses. Namibia also edged South Africa in a dramatic open-class team battle. The Namibian Hunting Rifle Shooting Association flagged Stampriet as the next national stop and South Africa for the following world championships.

Original summary for sports.com.na. Source: https://www.namibian.com.na/namibian-duo-shoots-to-top-of-the-world/',
  (SELECT id FROM sportsplatform_federations WHERE slug = 'shooting-namibia'),
  'shooting',
  ARRAY['NSSF','NHRSA','Otjiwa','world championships'],
  '/sports/shooting.jpg',
  true,
  '2025-07-08 11:00:00'
),

-- 12. Billiards & Snooker — NCSF Champ of Champs
(
  'Namshooters Sweep NCSF Champ of Champs and Black Ball Honours',
  'ncsf-champ-of-champs-namshooters-2025',
  'Namshooters won the team Champ of Champs and National Black Ball League titles as cue sports closed a strong season.',
  E'The Namibia Cue Sports Federation crowned season leaders at the Champ of Champs tournament at King Cues, with Namshooters of Windhoek taking the team title ahead of Coastal Waves and Young Ones.

Individual awards went to Likeus Naujoma and Jeanine Kloppers as players of the tournament, while Steven Sakaria lifted the President''s Cup. Namshooters also topped the National Black Ball League standings in a prize pool that topped N$62 000 across junior, senior and masters categories.

Original summary for sports.com.na. Source: https://www.namibiansun.com/sport-wrap-main/top-cueists-crowned-at-ncsf-champ-of-champs2025-12-05179141',
  (SELECT id FROM sportsplatform_federations WHERE slug = 'billiards-snooker-namibia'),
  'billiards',
  ARRAY['NCSF','Namshooters','blackball','Champ of Champs'],
  '/sports/billiards-action.jpg',
  true,
  '2025-12-05 17:00:00'
),

-- 13. Horse racing — Independence Cup Gobabis
(
  'Woodland Ridge and Katiti Komambo Headline Independence Cup',
  'nhra-independence-cup-gobabis-2026',
  'NHRA opened the 2026 season in Gobabis with 17 races and about 600 spectators for Independence celebrations.',
  E'The Namibia Horse Racing Association launched its 2026 calendar with the Independence Cup at Gobabis, carding 17 races as Namibia marked 36 years of independence.

Katiti Komambo claimed the Nambred Open 2000m while Woodland Ridge, ridden by Hans Swaartboi, won the Import Open 2000m feature. NHRA spokesperson Chantel Mouton said roughly 600 spectators and visitors boosted local business, positioning Gobabis as a capable host for national racing fixtures.

Original summary for sports.com.na. Source: https://www.namibian.com.na/woodland-ridge-katiti-komambo-gallop-to-victory/ ; https://neweralive.na/woodland-ridge-clinches-independence-cup/',
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-horse-racing'),
  'horse-racing',
  ARRAY['NHRA','Independence Cup','Gobabis','Woodland Ridge'],
  '/sports/horse-racing.jpg',
  true,
  '2026-03-23 18:00:00'
),

-- 14. Fistball — Cohen Cup 2025
(
  'CFC 1 Edges SFC in Thriller to Claim Cohen Cup 2025',
  'fistball-cohen-cup-cfc-victory-2025',
  'Host CFC 1 beat coastal rivals SFC 3–2 in sets after a deciding-set comeback at the Cohen Cup.',
  E'Fistball Namibia''s Cohen Cup produced a classic final as hosts CFC 1 defeated SFC 3–2 in sets after SFC had broken CFC''s long winning streak earlier in the group stage.

SKW A dominated the U13 junior category without a loss. Organisers pointed ahead to the National Cup in Swakopmund as the next showcase for a growing club circuit that continues to blend coastal and capital competition.

Original summary for sports.com.na. Source: https://www.namibiansun.com/sport-wrap-main/exciting-victories-at-the-cohen-cup-20252025-10-14173659',
  (SELECT id FROM sportsplatform_federations WHERE slug = 'fistball-namibia'),
  'fistball',
  ARRAY['Fistball','Cohen Cup','CFC','SFC'],
  '/sports/fistball.jpg',
  true,
  '2025-10-14 16:00:00'
)

ON CONFLICT (slug) DO NOTHING;
