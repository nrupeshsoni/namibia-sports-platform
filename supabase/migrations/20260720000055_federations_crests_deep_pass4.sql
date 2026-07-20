-- Federation crests deep pass 4 (logo column only). 2026-07-21.
-- Sources: Hybrid Fitness MMAN crest (IMMAF national body); Fistball Association
-- of Namibia official WordPress header logo_fan.jpg (matches FB Graph crest).
-- WHY: Continue P0 null-logo gaps after 000043 deep pass 3.
-- Timestamp 000055 - reserved for LOGOS Agent 1/10 (siblings use 000050-000054/000056+).
-- Guard: null-only (do not overwrite existing crests).
--
-- Rejected this pass: Golf (FB silhouette; Webnode favicon = "we" platform mark),
-- Karate (Wayback/FB nakulogo = NSC/NNOC wave crest; NKKO/JKA = style branches),
-- Badminton/PWFN/Surfing/Taekwondo/Horse Racing (IF pages text-only; no crest asset),
-- Muaythai/Footgolf FB silhouettes, Dance Sport (WDSF member page text-only; FB 400),
-- Cue Sports NCSF (media photos only; Graph page 400), NUFS/TISAN Traditional (none),
-- NNSSU/FISU (flag download only; NSSU Schools eagle = wrong org), Ultimate WFDF (flag only).

-- Mixed Martial Arts Namibia (MMAN) — Hybrid Fitness official MMAN wordmark crest
UPDATE sportsplatform_federations SET
  logo = '/logos/Mixed_Martial_Arts_Namibia_logo.png',
  updated_at = now()
WHERE slug = 'mixed-martial-arts-namibia'
  AND (logo IS NULL OR logo = '');

-- Fistball Namibia — official site header crest (fistballnamibia.wordpress.com)
UPDATE sportsplatform_federations SET
  logo = '/logos/Fistball_Association_of_Namibia_logo.jpg',
  updated_at = now()
WHERE slug = 'fistball-namibia'
  AND (logo IS NULL OR logo = '');
