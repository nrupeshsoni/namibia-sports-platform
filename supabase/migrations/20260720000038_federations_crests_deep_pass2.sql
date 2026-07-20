-- Federation crests deep pass 2 (logo column only). 2026-07-20.
-- Sources: official Icestocksport Association banner (detlef.iway.na/ean),
-- Facebook Graph NamibiaBoxingFederation (NABF crest).
-- WHY: Continue null/sport-photo logo gaps after 000033 deep pass.
-- Timestamp 000038 — 000033–000037 taken (crests_deep, RLS, events, sport photos).
-- Guard: null-only for new crests; boxing allows replacing interim /sports/* photo.
--
-- Rejected this pass: Karate (Wayback nakulogo = NSC flag-wave), Golf (FB silhouette /
-- no crest asset), Handball (flag/silhouette only), Dance Sport / Horse Racing /
-- Badminton / Taekwondo / PWFN (no verified crest), Muaythai/Footgolf silhouettes,
-- NAKU style badges (Shotokan/Goju — not national federation crest).

-- Ice Stock — crest cropped from official association header banner
UPDATE sportsplatform_federations SET
  logo = '/logos/Namibia_Ice_Stock_Association_logo.jpg',
  updated_at = now()
WHERE slug = 'ice-stock-namibia'
  AND (logo IS NULL OR logo = '');

-- Boxing — NABF crest replaces interim sport-action photo on sole boxing row
-- Note: crest text = Namibian Boxing Federation (Est 1991); row name remains
-- Namibia Boxing Control Commission (only boxing entity in directory).
UPDATE sportsplatform_federations SET
  logo = '/logos/Namibian_Boxing_Federation_logo.jpg',
  updated_at = now()
WHERE slug = 'namibia-boxing'
  AND (logo IS NULL OR logo = '' OR logo LIKE '/sports/%');
