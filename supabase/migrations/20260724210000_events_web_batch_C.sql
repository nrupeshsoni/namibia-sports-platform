-- WHY: Events web Batch C (2026-07-24) — verified public-web fixtures for
-- niche / umbrella / para / chess / archery / bowls / equestrian / handball /
-- fistball date correction. Quality over invention; day-level dates only.
-- Idempotent inserts via ON CONFLICT (slug) DO NOTHING.
-- Evidence: docs/research/events_web_batch_C_20260724.md
-- Applied live to rbibqjgsnrueubrvyqps via Supabase MCP.

-- Fistball: Cohen International 2026 was previewed as "this weekend" on
-- Mon 4 May 2026 → Sat 9 May (not 11 Apr seed).
UPDATE sportsplatform_events
SET
  start_date = '2026-05-09',
  end_date = '2026-05-09',
  description = 'International Cohen Fistball Tournament 2026 — 60th anniversary of Cohen Fistball Club, Windhoek. 20 teams / 46 matches; German Bundesliga sides NLV Stuttgart-Vaihingen (winners) and TSV Calw in Category A final. Source: https://www.namibiansun.com/fistball-sw/top-teams-set-for-action-at-international-cohen-tournament-nmh009082-11-10441 ; https://www.republikein.com.na/fistball-sw/fistball-tourney-thrills-nmh009450-11-10966',
  updated_at = NOW()
WHERE slug = 'cohen-fistball-tournament-2026';

INSERT INTO sportsplatform_events
  (name, slug, description, type, start_date, end_date, location, region, poster_url, is_published, federation_id)
VALUES

-- ===== Chess Namibia =====
(
  'Bank Windhoek Namibian Open Chess Championship 2025',
  'bank-windhoek-namibian-open-chess-2025',
  'Bank Windhoek 2025 Namibian Open — classical (Open / Women / Junior), Rapid and Blitz sections; 9-round Swiss, 90+30. IM Dante Beukes and WCM Jolly-Joice Nepando crowned Open/Women champions. Source: https://www.chessdom.com/bank-windhoek-2025-namibian-open-live/ ; https://chess-results.com/tnr1234006.aspx?lan=1 ; https://economist.com.na/100922/sport/bank-windhoek-namibian-open-chess-championship-concludes/',
  'tournament',
  '2025-09-10', '2025-09-14',
  'Windhoek', 'Khomas',
  '/sports/chess-tournament.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'chess-namibia')
),
(
  '46th FIDE Chess Olympiad 2026 (Namibia team)',
  'fide-chess-olympiad-2026-namibia',
  '46th FIDE Chess Olympiad, Samarkand, Uzbekistan (15–27 Sep 2026). Namibia’s five-player Open/Women squad selected via the Bank Windhoek 2026 National Closed Championships. Source: https://www.fide.com/invitation-46th-chess-olympiad-3rd-fide-chess-olympiad-for-people-with-disabilities-fide-congress-2026/ ; https://neweralive.na/chess-players-battle-for-national-champ-title/ ; https://ratings.fide.com/tournament_information.phtml?event=467390',
  'competition',
  '2026-09-15', '2026-09-27',
  'Samarkand, Uzbekistan', 'International',
  '/sports/chess.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'chess-namibia')
),

-- ===== Archery Namibia (AGA) =====
(
  'AGA World Tournament Walvis Bay 2025',
  'aga-world-tournament-walvis-bay-2025',
  'African Genesis Archery World Tournament hosted at Jan Wilken Indoor Sports Complex, Walvis Bay — 250+ archers from Namibia, South Africa, Botswana, Zimbabwe, Zambia and Canada (Bullseye + 3D). Namibia National and Development teams swept gold in all three categories. Source: https://www.rootsgymnasium.org/post/making-history-on-target-rooties-shine-at-the-aga-world-tournament ; https://economist.com.na/99924/sport/namibia-successfully-hosts-african-genesis-archery-tournament-at-walvis-bay/ ; https://www.namibiansun.com/sport-wrap-main/namibia-makes-history-at-world-tournament2025-07-29165034',
  'tournament',
  '2025-07-24', '2025-07-26',
  'Jan Wilken Indoor Sports Complex, Walvis Bay', 'Erongo',
  '/sports/archery.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'archery-namibia')
),
(
  'AGA African Federation Tournament Botswana 2026',
  'aga-african-federation-botswana-2026',
  'AGA African Federation Tournament, Botswana (12–15 Aug 2026) — Namibia defending AGA World Champions under coach Hilma Kambonde; field expected to include Namibia, South Africa, Botswana, Zambia and Zimbabwe. Source: https://neweralive.na/kambonde-takes-charge-namibia-targets-african-archery-glory/ ; https://economist.com.na/99924/sport/namibia-successfully-hosts-african-genesis-archery-tournament-at-walvis-bay/',
  'competition',
  '2026-08-12', '2026-08-15',
  'Botswana', 'International',
  '/sports/archery.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'archery-namibia')
),

-- ===== Namibia Sports Commission (umbrella) =====
(
  'AUSC Region 5 Youth Games Namibia 2025',
  'ausc-region5-youth-games-namibia-2025',
  '11th AUSC Region 5 Youth Games hosted by Namibia after Mozambique withdrew — Windhoek & Swakopmund, 4–13 Jul 2025. Opening ceremony Independence Stadium (President Nandi-Ndaitwah); 10 nations / 12+ codes / 2,000+ athletes. Namibia finished 3rd overall. Source: https://neweralive.na/2025-region-5-youth-games-rescheduled/ ; https://www.republikein.com.na/sport-wrap-main/nandi-ndaitwah-to-officially-open-youth-games-today2025-07-04162291 ; https://www.namibiansun.com/my-zone/land-of-the-brave-hosts-region-52025-09-16169706',
  'tournament',
  '2025-07-04', '2025-07-13',
  'Windhoek & Swakopmund', 'Khomas / Erongo',
  '/sports/athletics.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-sports-commission')
),
(
  'Namibia National Youth Games 2026 Phase 1 (Basketball & Volleyball)',
  'national-youth-games-2026-phase1-ondangwa',
  'National Youth Games 2026 Phase 1 — basketball and volleyball selection hub, Ondangwa (Oshana), 9–12 May 2026, under NSC clustered model for AUSC Region 5 Team Namibia pathways. Phase 2 football/boxing/netball trials (14–17 May) were later cancelled. Source: https://www.linkedin.com/posts/namibia-sports-commission_namibia-national-youth-games-2026-phase-activity-7459196743960649728-Prdr ; https://www.nbcnews.na/node/115935 ; https://www.namibian.com.na/youth-games-trials-cancelled/',
  'tournament',
  '2026-05-09', '2026-05-12',
  'Ondangwa, Oshana Region', 'Oshana',
  '/sports/basketball.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-sports-commission')
),

-- ===== Bowls Namibia =====
(
  'World Bowls Indoor Championship 2026 (Namibia)',
  'world-bowls-indoor-championship-2026-namibia',
  '2026 World Bowls Indoor Championship at Ocean Grove Bowling Club, Victoria, Australia (11–16 May). Namibia represented by Waylon Wentzel (men’s singles) and Huipie van Wyk (women’s singles); both exited after group stages. Source: https://www.worldbowls.com/2026-world-bowls-indoor-championship/ ; https://www.namibian.com.na/namibians-bow-out-of-world-bowls-indoor-champs/ ; https://bowlsinternational.com/wp-content/uploads/2026/05/2026-WIBC-Competitor-List-10052026.pdf',
  'competition',
  '2026-05-11', '2026-05-16',
  'Ocean Grove Bowling Club, Victoria, Australia', 'International',
  '/sports/bowls.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'bowls-namibia')
),

-- ===== Namibia Paralympic Committee =====
(
  'Commonwealth Games Glasgow 2026 (Para-Athletics — Namibia)',
  'commonwealth-games-2026-para-athletics-namibia',
  'Glasgow 2026 Commonwealth Games para-athletics — Ananias Shikongo with competition guide Even Tjiviju; coach Letu Hamhola (named Team Namibia / NNOC squad). Games window 23 Jul–2 Aug 2026. Source: https://economist.com.na/107239/sport/23-athletes-to-participate-in-the-upcoming-2026-glasgow-commonwealth-games/ ; https://neweralive.na/namibia-announces-glasgow-squad/ ; https://www.namibian.com.na/tough-act-to-follow-for-commonwealth-games-team/',
  'competition',
  '2026-07-23', '2026-08-02',
  'Glasgow, Scotland', 'International',
  '/sports/athletics.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-paralympic')
),

-- ===== Equestrian Namibia (NAMEF calendar) =====
(
  'NAMEF RVS Beach Tournament 2026',
  'namef-rvs-beach-tournament-2026',
  'Reiter Verein Swakopmund (RVS) Beach Tournament on the official NAMEF 2026 Olympic-disciplines calendar (Jumping / Dressage / Eventing block). Source: https://www.namef.org.na/images/NAMEF_Calendar_2026_Final.pdf ; https://www.namef.org.na/events',
  'competition',
  '2026-02-27', '2026-03-01',
  'Reiter Verein Swakopmund, Swakopmund', 'Erongo',
  '/sports/equestrian.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'equestrian-namibia')
),
(
  'NAMEF Easter Festival 2026',
  'namef-easter-festival-2026',
  'NAMEF Easter Festival (Jumping & Dressage) — Easter weekend on the official 2026 calendar. Source: https://www.namef.org.na/images/NAMEF_Calendar_2026_Final.pdf',
  'competition',
  '2026-04-03', '2026-04-05',
  'Namibia (NAMEF club circuit)', 'Khomas / Erongo',
  '/sports/equestrian.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'equestrian-namibia')
),
(
  'NAMEF RCO Annual Show 2026',
  'namef-rco-annual-2026',
  'Riding Club Outjo (RCO) Annual — Jumping & Dressage on the official NAMEF 2026 calendar (4–6 Sep), ahead of GCW Nam Champs. Source: https://www.namef.org.na/images/NAMEF_Calendar_2026_Final.pdf',
  'competition',
  '2026-09-04', '2026-09-06',
  'Riding Club Outjo', 'Kunene / Otjozondjupa',
  '/sports/equestrian.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'equestrian-namibia')
),

-- ===== Namibia Handball Federation =====
(
  'IHF Trophy Africa Zone VI 2026 (Lusaka)',
  'ihf-trophy-zone6-lusaka-2026',
  'IHF Trophy Africa Zone VI men’s youth and junior tournaments, Lusaka, Zambia (28 Apr–2 May 2026). Namibia finished 4th (youth) and 6th (junior) among eight Zone VI nations. Source: https://www.ihf.info/continent-federations/african-handball-confederation/109/events/275207',
  'competition',
  '2026-04-28', '2026-05-02',
  'Lusaka, Zambia', 'International',
  '/sports/handball.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-handball')
),
(
  'Redzone Handball Clash 2025',
  'redzone-handball-clash-2025',
  'Redzone Handball Clash at UN Plaza, Windhoek — Titans beat City Pillars 12–8 in the final; Bank Windhoek supported venue costs. Source: https://www.namibian.com.na/titans-win-redzone-handball-clash/',
  'tournament',
  '2025-11-22', '2025-11-22',
  'UN Plaza, Windhoek', 'Khomas',
  '/sports/handball.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-handball')
)

ON CONFLICT (slug) DO NOTHING;
