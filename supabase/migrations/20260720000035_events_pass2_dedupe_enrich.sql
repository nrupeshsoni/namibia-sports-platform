-- WHY: Events pass 2 — soft-delete true duplicate slugs (no media FKs), insert
-- verified events for zero-coverage federations, assign sport-matched posters.
-- Sources: docs/research/events_enrichment_batch.md (Pass 2 section).
-- Never invents dates. Applied 2026-07-20.

-- =============================================================================
-- A) DEDUPE — delete inferior duplicate (same federation + same start day)
-- Keep the more descriptive / earlier slug. Zero sportsplatform_media FKs.
-- =============================================================================

DELETE FROM sportsplatform_events WHERE slug = 'wpp2-time-trial-2026';       -- keep nedbank-wpp2-2026
DELETE FROM sportsplatform_events WHERE slug = 'wpp4-matchless-2026';        -- keep nedbank-wpp4-2026
DELETE FROM sportsplatform_events WHERE slug = 'wpp-finals-2026';            -- keep nedbank-wpp-finals-2026
DELETE FROM sportsplatform_events WHERE slug = 'accc-hockey-harare-2026';    -- keep hockey-accc-2026
DELETE FROM sportsplatform_events WHERE slug = 'boxing-nationals-keetmanshoop-2026'; -- keep boxing-nationals-2026
DELETE FROM sportsplatform_events WHERE slug = 'nnpl-playoffs-2026';         -- keep netball-nnpl-playoffs-2026
DELETE FROM sportsplatform_events WHERE slug = 'annual-ace-golf-2026';       -- keep golf-annual-ace-2026
DELETE FROM sportsplatform_events WHERE slug = 'ntf-triathlon-premium-2026'; -- keep africa-triathlon-premium-cup-2026
DELETE FROM sportsplatform_events WHERE slug = 'cavb-zone6-bvb-leg1-2026';   -- keep cavb-zone6-volleyball-leg1-2026

-- Soft-deprecate thin/unverified rugby 2025 test (no corroborating fixture found in pass 2)
UPDATE sportsplatform_events
SET is_published = false,
    description = COALESCE(description, '') || E'\n[UNVERIFIED] Soft-deprecated in pass 2 — no confirmed Welwitschias international test fixture for 2025-07-15.',
    updated_at = now()
WHERE slug = 'welwitschias-test-2025';

-- =============================================================================
-- B) ENRICH existing season rows + posters
-- =============================================================================

UPDATE sportsplatform_events
SET
  name = 'MTC Volleyball National League 2026',
  description = 'NVF MTC VNL season 3: Round 1 Otjiwarongo 14–15 Mar; Ondangwa 25 Apr; Katima 23–24 May; Rundu 27 Jun; Gobabis 18 Jul; Swakopmund 29 Aug; Windhoek finale 24 Oct. Source: https://www.namibian.com.na/mtc-volleyball-national-league-to-start-in-otjiwarongo/ ; https://www.republikein.com.na/other-sw/otjiwarongo-to-host-mtc-vnl-season-opener-nmh006747-11-7524',
  start_date = '2026-03-14',
  end_date = '2026-10-24',
  location = 'Otjiwarongo / regional venues / Windhoek finale',
  region = 'National',
  poster_url = '/sports/volleyball.jpg',
  is_published = true,
  updated_at = now()
WHERE slug = 'mtc-volleyball-league-2026';

UPDATE sportsplatform_events SET poster_url = '/sports/namibia-rugby.jpg', updated_at = now()
WHERE slug = 'rugby-premiership-2025' AND (poster_url IS NULL OR poster_url = '');

UPDATE sportsplatform_events SET poster_url = '/sports/triathlon.jpg', updated_at = now()
WHERE slug IN ('africa-triathlon-premium-cup-2026', 'africa-triathlon-junior-cup-2026')
  AND (poster_url IS NULL OR poster_url = '');

UPDATE sportsplatform_events SET poster_url = '/sports/namibia-boxing.jpg', updated_at = now()
WHERE slug = 'boxing-nationals-2026' AND (poster_url IS NULL OR poster_url = '');

UPDATE sportsplatform_events SET poster_url = '/sports/cycling.jpg', updated_at = now()
WHERE slug LIKE 'nedbank-wpp%' AND (poster_url IS NULL OR poster_url = '');

UPDATE sportsplatform_events SET poster_url = '/sports/golf.jpg', updated_at = now()
WHERE federation_id = (SELECT id FROM sportsplatform_federations WHERE slug = 'golf-namibia')
  AND (poster_url IS NULL OR poster_url = '');

UPDATE sportsplatform_events SET poster_url = '/sports/netball.jpg', updated_at = now()
WHERE federation_id = (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-netball')
  AND (poster_url IS NULL OR poster_url = '');

UPDATE sportsplatform_events SET poster_url = '/sports/basketball-action.jpg', updated_at = now()
WHERE federation_id = (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-basketball')
  AND (poster_url IS NULL OR poster_url = '');

UPDATE sportsplatform_events SET poster_url = '/sports/judo.jpg', updated_at = now()
WHERE federation_id = (SELECT id FROM sportsplatform_federations WHERE slug = 'judo-namibia')
  AND (poster_url IS NULL OR poster_url = '');

UPDATE sportsplatform_events SET poster_url = '/sports/martial-arts.jpg', updated_at = now()
WHERE federation_id = (SELECT id FROM sportsplatform_federations WHERE slug = 'karate-namibia')
  AND (poster_url IS NULL OR poster_url = '');

UPDATE sportsplatform_events SET poster_url = '/sports/volleyball.jpg', updated_at = now()
WHERE federation_id = (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-volleyball')
  AND (poster_url IS NULL OR poster_url = '');

UPDATE sportsplatform_events SET poster_url = '/sports/athletics.jpg', updated_at = now()
WHERE federation_id = (SELECT id FROM sportsplatform_federations WHERE slug = 'athletics-namibia')
  AND (poster_url IS NULL OR poster_url = '');

UPDATE sportsplatform_events SET poster_url = '/sports/cricket-action.jpg', updated_at = now()
WHERE federation_id = (SELECT id FROM sportsplatform_federations WHERE slug = 'cricket-namibia')
  AND (poster_url IS NULL OR poster_url = '');

UPDATE sportsplatform_events SET poster_url = '/sports/football-action.jpg', updated_at = now()
WHERE federation_id = (SELECT id FROM sportsplatform_federations WHERE slug = 'nfa')
  AND (poster_url IS NULL OR poster_url = '');

UPDATE sportsplatform_events SET poster_url = '/sports/namibia-rugby-action.jpg', updated_at = now()
WHERE federation_id = (SELECT id FROM sportsplatform_federations WHERE slug = 'nru')
  AND (poster_url IS NULL OR poster_url = '');

UPDATE sportsplatform_events SET poster_url = '/sports/hockey-field.jpg', updated_at = now()
WHERE federation_id = (SELECT id FROM sportsplatform_federations WHERE slug = 'nhu')
  AND (poster_url IS NULL OR poster_url = '');

-- =============================================================================
-- C) INSERT verified events (gap federations + Big-8 upcoming)
-- =============================================================================

INSERT INTO sportsplatform_events
  (name, slug, description, type, start_date, end_date, location, region, poster_url, is_published, federation_id)
VALUES
-- Bowls
(
  'National Bowls Week 2025',
  'national-bowls-week-2025',
  'Namibia Bowls Association National Bowls Week (King Price) — pairs, singles, trips, fours across Eros, Windhoek and Trustco United clubs; finals 31 May at Windhoek Bowling Club. Source: https://www.republikein.com.na/sport-wrap-main/national-highlight-for-all-bowls-players2025-05-22158089',
  'tournament', '2025-05-24', '2025-05-31',
  'Eros / Windhoek / Trustco United Bowling Clubs', 'Khomas',
  '/sports/bowls.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'bowls-namibia')
),
(
  'National Bowls Week 2026',
  'national-bowls-week-2026',
  'National Bowls Week 23–30 May 2026 at Windhoek Bowling Club, Trustco United and Eros. Source: https://www.namibian.com.na/bowls-action-to-rock-windhoek-in-may/',
  'tournament', '2026-05-23', '2026-05-30',
  'Windhoek Bowling Club / Trustco United / Eros', 'Khomas',
  '/sports/bowls.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'bowls-namibia')
),

-- Squash
(
  'PSA BDO Namibian Open 2025',
  'psa-bdo-namibian-open-2025',
  'PSA Challenger Tour squash at Wanderers Squash Club, Windhoek. Source: https://www.psasquashtour.com/tournament/psa-bdo-namibian-open-2025/ ; https://www.squashinfo.com/events/11480-mens-namibian-open-2025',
  'tournament', '2025-11-25', '2025-11-29',
  'Wanderers Squash Club, Windhoek', 'Khomas',
  '/sports/squash.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'squash-namibia')
),
(
  'Namibian Closed Squash Championships 2026',
  'namibian-closed-squash-2026',
  'NSA-sanctioned Namibian Closed at Buccaneers Squash Club, Walvis Bay. Source: https://www.sportyhq.com/tournament/view/Namibian-Closed-2026',
  'tournament', '2026-03-27', '2026-03-28',
  'Buccaneers Squash Club, Walvis Bay', 'Erongo',
  '/sports/squash.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'squash-namibia')
),
(
  'PSA BDO Namibian Open 2026',
  'psa-bdo-namibian-open-2026',
  'PSA Tour BDO Namibian Open, Windhoek. Source: https://www.psasquashtour.com/tournaments/',
  'tournament', '2026-11-24', '2026-11-28',
  'Windhoek', 'Khomas',
  '/sports/squash.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'squash-namibia')
),

-- Motorsport
(
  'National Circuit Racing Championship Leg 1 2025',
  'nmsf-circuit-leg1-2025',
  'Windhoek Motor Club / NMSF national circuit championship opening leg at Tony Rust Race Track. Source: https://www.namibian.com.na/slow-start-for-motorsport-calendar/ (reported weekend before 9 Apr 2025).',
  'competition', '2025-04-05', '2025-04-05',
  'Tony Rust Race Track, Windhoek', 'Khomas',
  NULL, true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'motorsport-namibia')
),
(
  'National Circuit Racing Championship Leg 2 2025',
  'nmsf-circuit-leg2-2025',
  'National circuit championship Leg 2 at Tony Rust Race Track. Source: https://www.namibian.com.na/slow-start-for-motorsport-calendar/ ; https://allevents.in/windhoek/namibia-national-championship-circuit-racing-leg-2/200028153044231',
  'competition', '2025-05-17', '2025-05-17',
  'Tony Rust Race Track, Windhoek', 'Khomas',
  NULL, true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'motorsport-namibia')
),
(
  'National Circuit Racing Championship Leg 2 2026',
  'nmsf-circuit-leg2-2026',
  'Second leg of 2026 national circuit racing at Tony Rust (low entries, mechanical DNFs; Class A won by Eisenberg). Third leg scheduled end of June. Source: https://www.namibian.com.na/crashes-mechanical-failures-mark-circuit-racing-championship/',
  'competition', '2026-06-06', '2026-06-06',
  'Tony Rust Race Track, Windhoek', 'Khomas',
  NULL, true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'motorsport-namibia')
),

-- Equestrian (NAMEF calendar + FEI)
(
  'FEI Jumping World Challenge — Gymkhana Club Windhoek 2026',
  'fei-jumping-world-challenge-windhoek-2026',
  'FEI Jumping World Challenge Categories A/B/C at Gymkhana Club Windhoek. Source: https://worldchallenges.fei.org/pdf/events/2146',
  'competition', '2026-07-24', '2026-07-26',
  'Gymkhana Club, Windhoek', 'Khomas',
  NULL, true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'equestrian-namibia')
),
(
  'NAMEF GCW Namibian Championships (Jumping & Dressage) 2026',
  'namef-gcw-nam-champs-2026',
  'Gymkhana Club Windhoek Namibian Championships & club championships (jumping/dressage). Source: NAMEF Calendar 2026 Final https://www.namef.org.na/images/NAMEF_Calendar_2026_Final.pdf',
  'competition', '2026-09-25', '2026-09-27',
  'Gymkhana Club Windhoek', 'Khomas',
  NULL, true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'equestrian-namibia')
),
(
  'NAMEF RCO FEI / 7 Nations & Namibian Jumping Championships 2026',
  'namef-rco-nam-jumping-champs-2026',
  'RCO-hosted FEI, 7 Nations and Namibian Jumping Championships. Source: NAMEF Calendar 2026 Final PDF.',
  'competition', '2026-10-09', '2026-10-11',
  'RCO (Reit Club / affiliated)', 'Khomas',
  NULL, true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'equestrian-namibia')
),
(
  'NAMEF Eventing Namibian Championships 2026',
  'namef-eventing-nam-champs-2026',
  'RVS Eventing Namibian Championships. Source: NAMEF Calendar 2026 Final PDF.',
  'competition', '2026-11-06', '2026-11-08',
  'RVS', 'Erongo',
  NULL, true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'equestrian-namibia')
),

-- Gymnastics
(
  'AUSC Region 5 Gymnastics Championships 2025',
  'region5-gymnastics-windhoek-2025',
  'Region 5 gymnastics hosted in Windhoek (competition window 8–12 Dec; host window 7–14 Dec). Eight SADC nations. Source: https://gymnasticssa.co.za/news-article/team-sa-ready-to-shine-at-region-5-gymnastics-competition/ ; NGF roster announcement AZ/Namibian Sun.',
  'tournament', '2025-12-07', '2025-12-14',
  'Windhoek', 'Khomas',
  NULL, true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-gymnastics')
),

-- Surfing
(
  'Sound Garden Surf Contest 2026',
  'sound-garden-surf-contest-2026',
  'Sound Garden Surf Contest at Thick Lip, Swakopmund (reported weekend of 4 Jul 2026). Source: https://www.republikein.com.na/other-sw/branderryers-wys-hoe-dit-gedoen-word-nmh006504-11-7202',
  'competition', '2026-07-04', '2026-07-04',
  'Thick Lip, Swakopmund', 'Erongo',
  '/sports/surfing.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'surfing-namibia')
),

-- Karate (WUKF Open — verified)
(
  '3rd Southern Africa WUKF Open Championship 2026',
  'wukf-southern-africa-open-2026',
  'WUKF Open Championship hosted in Windhoek. Source: https://www.kihapp.com/tournaments/26028-3rd-southern-africa-wukf-open-championship',
  'tournament', '2026-09-25', '2026-09-26',
  'Windhoek', 'Khomas',
  '/sports/martial-arts.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'karate-namibia')
),

-- Basketball
(
  'KBA Premier League 2025 Finals',
  'kba-premier-finals-2025',
  'Khomas Basketball Association Premier League finals — Quality Basketball Club beat Unam Wolves to claim 2025 title. Source: https://www.namibiansun.com/sport-wrap-main/qbc-rise-above-wolves-for-kba-championship2025-10-14173671',
  'tournament', '2025-10-11', '2025-10-12',
  'Unam Gym Hall, Windhoek', 'Khomas',
  '/sports/basketball-action.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-basketball')
),
(
  'KBA League 2026 Season Opener',
  'kba-league-opener-2026',
  'Khomas Basketball League 2026 tip-off at Unam Gym Hall (premier / women / first division). Source: https://www.namibiansun.com/basketball-sw/kba-league-tips-off-this-weekend-nmh006815-11-7612',
  'competition', '2026-07-04', '2026-07-05',
  'Unam Gym Hall, Windhoek', 'Khomas',
  '/sports/basketball-action.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-basketball')
),

-- Rugby 2026 season (dedicated slug; do not rely on overwritten 2025 row)
(
  'NRU Premier League 2026',
  'nru-premier-league-2026',
  'NRU club Premier League season opened 11 Apr 2026. Source: https://www.namibian.com.na/club-rugby-season-kicks-off-in-style/ ; https://neweralive.na/dolphins-strong-start-in-nru-premier-league/',
  'competition', '2026-04-11', '2026-09-30',
  'Windhoek / coastal / regional grounds', 'National',
  '/sports/namibia-rugby-action.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'nru')
),

-- Hockey outdoor season start
(
  'NHU Outdoor Field Hockey League 2026',
  'nhu-outdoor-hockey-league-2026',
  'NHU field (outdoor) hockey league season following conclusion of indoor titles (league due to start in June 2026). Source: https://www.namibian.com.na/old-boys-are-indoor-hockey-champions/ ; https://namibiahockey.org/outdoor-hockey-league/',
  'competition', '2026-06-01', '2026-10-31',
  'Windhoek turfs (WHS / Gymnasium / clubs)', 'Khomas',
  '/sports/hockey-field.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'nhu')
),

-- Judo Region 5 (hosted Namibia)
(
  'AUSC Region 5 Judo Games 2025',
  'region5-judo-games-2025',
  'AUSC Region 5 judo hosted at Windhoek Showgrounds — 60 athletes from eight countries. Source: https://neweralive.na/judo-tournament-provides-exposure-to-young-athletes/',
  'tournament', '2025-07-08', '2025-07-10',
  'Windhoek Showgrounds', 'Khomas',
  '/sports/judo.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'judo-namibia')
),

-- Volleyball 2025 finale (verified)
(
  'MTC Volleyball National League 2025 Finals',
  'mtc-vnl-finals-2025',
  '2025 MTC VNL finale at MTC Dome Swakopmund — NCS retained men''s title; Revivals retained women''s. Source: https://www.namibiansun.com/sport-wrap-main/revivals-and-ncs-retain-mtc-national-league-titles2025-10-27174859',
  'tournament', '2025-10-25', '2025-10-25',
  'MTC Dome, Swakopmund', 'Erongo',
  '/sports/volleyball.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-volleyball')
),

-- Taekwondo international representation note (Namibia-hosted none verified) — skip

-- Esports / padel / badminton: no verified 2025–27 dates in pass 2 research

-- Paralympic: Para Taekwondo camp is Korea — skip Namibia-calendar insert
ON CONFLICT (slug) DO NOTHING;
