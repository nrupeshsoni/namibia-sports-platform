-- WHY: FULL_GAP_ANALYSIS P0 — seed ≥1 upcoming (start_date >= now) for Big-8
-- holes (NASFED) and high-traffic mid-tier with 0 upcoming (golf, bowls,
-- gymnastics, motorsport, NPC). Verified public sources only; no fabricated
-- dates. NHU re-hunted after SA women’s Cape Town tests rolled past (20–24 Jul
-- 2026): no day-level outdoor/international fixtures published (site under
-- construction; press silent) — left at 0. Idempotent: ON CONFLICT (slug) DO NOTHING.
-- Evidence: docs/research/events_upcoming_big8_midtier_20260725.md
-- Applied live to rbibqjgsnrueubrvyqps via Supabase MCP.

INSERT INTO sportsplatform_events
  (name, slug, description, type, start_date, end_date, location, region, poster_url, is_published, federation_id)
VALUES

-- ===== NASFED / swimming-namibia =====
(
  'Commonwealth Games Glasgow 2026 — Swimming (remaining sessions)',
  'cwg-2026-swimming-namibia-remaining',
  'Team Namibia NASFED swimmers (Jessica Humphrey, Luke Beukes, José Canjulo, Oliver Durand, Ronan Wantenaar) compete in remaining Glasgow 2026 swimming sessions at Tollcross International Swimming Centre (26–29 Jul). Source: https://neweralive.na/namibian-swimmers-ready-for-commonwealth-games/ ; https://www.olympics.com/en/news/commonwealth-games-2026-adam-ramsay-peaty-duncan-scott-mollie-ocallaghan-swimming-glasgow-full-schedule-how-to-watch-live ; https://resources.cwg-qbr.pulselive.com/qbr-commonwealth-games/document/2026/06/04/52247f0c-07cc-4953-a07b-24f10055e3a4/CWG26-Event-ALL-SPORTS_V12.pdf',
  'competition', '2026-07-26', '2026-07-29',
  'Tollcross International Swimming Centre, Glasgow', 'International',
  '/sports/swimming-action.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'swimming-namibia')
),
(
  'Africa Aquatics Zone IV Championships 2026 (Botswana)',
  'africa-aquatics-zone-iv-champs-botswana-2026',
  'Africa Aquatics Zone IV (Southern Africa) Championships, Gaborone, Botswana, 2–5 Sep 2026. Namibia is a Zone IV member and three-time defending Zone IV champions (retained title at prior edition). Source: https://allafrica.com/stories/202606100221.html ; https://www.mmegi.bw/sports/botswana-to-host-2026-zone-iv-aquatic-championships/news ; https://economist.com.na/101084/sport/records-shatter-at-nasfed-national-short-course-championship/',
  'tournament', '2026-09-02', '2026-09-05',
  'Gaborone, Botswana', 'International',
  '/sports/swimming.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'swimming-namibia')
),

-- ===== Bowls Namibia =====
(
  'Commonwealth Games Glasgow 2026 — Bowls (remaining sessions)',
  'cwg-2026-bowls-namibia-remaining',
  'Team Namibia bowls (Amanda Steenkamp, Diana Viljoen, Ronald Steenkamp, Waylon Wentzel) continue sectional and knockout play at Glasgow 2026 (26 Jul–2 Aug) at the Scottish Event Campus. Source: https://www.namibiansun.com/sport-wrap-main/namibia-unveils-23-for-commonwealth-games-NMH011757-11-14188 ; https://www.namibian.com.na/experienced-namibian-bowlers-eye-podium-finish/ ; https://www.glasgow2026.com/sports/bowls',
  'competition', '2026-07-26', '2026-08-02',
  'Scottish Event Campus (SEC), Glasgow', 'International',
  '/sports/bowls.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'bowls-namibia')
),

-- ===== Gymnastics =====
(
  'Commonwealth Games Glasgow 2026 — Artistic Gymnastics (remaining)',
  'cwg-2026-gymnastics-namibia-remaining',
  'Team Namibia gymnasts (Sureshni Andrew, Anne-Leen Thorburn, Jonie Thorburn, Tyesha Humphries) contest women''s all-around (26 Jul) and apparatus finals (27–28 Jul) at The Arena, Glasgow 2026. Source: https://www.namibian.com.na/gymnasts-gearing-up-for-commonwealth-debut/ ; https://www.namibiansun.com/sport-wrap-main/namibia-unveils-23-for-commonwealth-games-NMH011757-11-14188 ; https://resources.cwg-qbr.pulselive.com/qbr-commonwealth-games/document/2026/06/04/52247f0c-07cc-4953-a07b-24f10055e3a4/CWG26-Event-ALL-SPORTS_V12.pdf',
  'competition', '2026-07-26', '2026-07-28',
  'The Arena, Glasgow', 'International',
  '/sports/gymnastics.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-gymnastics')
),

-- ===== NPC / Para =====
(
  'Commonwealth Games Glasgow 2026 — Para-Athletics (remaining)',
  'cwg-2026-para-athletics-namibia-remaining',
  'Namibia Paralympic Committee athlete Ananias Shikongo (with competition partner Even Tjiuiu) contests para-athletics at Scotstoun Stadium, Glasgow 2026 (27 Jul–1 Aug). Source: https://www.namibtimes.net/team-namibia-set-for-commonwealth-games/ ; https://www.glasgow2026.com/venues/scotstoun ; https://www.scottishathletics.org.uk/glasgow26-athletics-schedule/',
  'competition', '2026-07-27', '2026-08-01',
  'Scotstoun Stadium, Glasgow', 'International',
  '/sports/athletics.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-paralympic')
),

-- ===== Golf / NAGU =====
(
  'Nedbank for Good Series 2026 — Mariental',
  'nedbank-for-good-mariental-2026',
  'Nedbank for Good Series 2026 round at Mariental Golf Club (1 Aug). Nationwide charity golf series supporting Agra ProVision agricultural training. Source: https://www.nedbank.com.na/group/news-insights/press/for-good-series-advances-agricultural-skills.html ; https://neweralive.na/nedbank-for-good-series-2026-heads-north/',
  'competition', '2026-08-01', '2026-08-01',
  'Mariental Golf Club', 'Hardap',
  '/sports/golf.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'golf-namibia')
),
(
  'Nedbank for Good Series 2026 — Rossmund (Swakopmund)',
  'nedbank-for-good-rossmund-2026',
  'Nedbank for Good Series 2026 coastal round at Rossmund Golf Course, Swakopmund (29 Aug). Source: https://www.nedbank.com.na/group/news-insights/press/for-good-series-advances-agricultural-skills.html ; https://neweralive.na/nedbank-for-good-series-2026-heads-north/',
  'competition', '2026-08-29', '2026-08-29',
  'Rossmund Golf Course, Swakopmund', 'Erongo',
  '/sports/golf.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'golf-namibia')
),
(
  'Nedbank for Good Series 2026 — Walvis Bay',
  'nedbank-for-good-walvis-bay-2026',
  'Nedbank for Good Series 2026 round at Walvis Bay Golf Club (5 Sep). Source: https://www.nedbank.com.na/group/news-insights/press/for-good-series-advances-agricultural-skills.html ; https://neweralive.na/nedbank-for-good-series-2026-heads-north/',
  'competition', '2026-09-05', '2026-09-05',
  'Walvis Bay Golf Club', 'Erongo',
  '/sports/golf.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'golf-namibia')
),
(
  'Nedbank for Good Series 2026 — Henties Bay',
  'nedbank-for-good-henties-bay-2026',
  'Nedbank for Good Series 2026 round at Henties Bay Golf and Lifestyle Estate (12 Sep). Source: https://www.nedbank.com.na/group/news-insights/press/for-good-series-advances-agricultural-skills.html ; https://neweralive.na/nedbank-for-good-series-2026-heads-north/',
  'competition', '2026-09-12', '2026-09-12',
  'Henties Bay Golf and Lifestyle Estate', 'Erongo',
  '/sports/golf.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'golf-namibia')
),
(
  'Nedbank for Good Series 2026 — Omeya',
  'nedbank-for-good-omeya-2026',
  'Nedbank for Good Series 2026 round at Omeya Golf Club (26 Sep). Source: https://www.nedbank.com.na/group/news-insights/press/for-good-series-advances-agricultural-skills.html ; https://neweralive.na/nedbank-for-good-series-2026-heads-north/',
  'competition', '2026-09-26', '2026-09-26',
  'Omeya Golf Club', 'Khomas',
  '/sports/golf.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'golf-namibia')
),
(
  'Nedbank for Good Series 2026 — Final (Windhoek)',
  'nedbank-for-good-final-windhoek-2026',
  'Nedbank for Good Series 2026 final at Windhoek Golf Club (13 Nov). Source: https://www.nedbank.com.na/group/news-insights/press/for-good-series-advances-agricultural-skills.html ; https://neweralive.na/nedbank-for-good-series-2026-heads-north/',
  'tournament', '2026-11-13', '2026-11-13',
  'Windhoek Golf Club', 'Khomas',
  '/sports/golf.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'golf-namibia')
),

-- ===== Motorsport / NMSF =====
(
  'FIM Africa MXOAN 2026 (Motocross of African Nations)',
  'fim-africa-mxoan-2026-namibia',
  'FIM Africa Motocross of African Nations (MXOAN) 2026 hosted by Namibia Motor Sport Federation at Gallina Motocross Park / Track, Windhoek, 28–30 Aug 2026. Source: https://fim-africa.com/mxoan/',
  'tournament', '2026-08-28', '2026-08-30',
  'Gallina Motocross Park, Windhoek', 'Khomas',
  '/sports/motorsport.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'motorsport-namibia')
)

ON CONFLICT (slug) DO NOTHING;
