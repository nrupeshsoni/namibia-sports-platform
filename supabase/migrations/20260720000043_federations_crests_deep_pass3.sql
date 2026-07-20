-- Federation crests deep pass 3 (logo column only). 2026-07-20.
-- Sources: CAHB/Sportaview NHF crest; Wayback nalasra.com/mobile_logo.png (NALASRA).
-- WHY: Continue P0 null-logo gaps after 000038 deep pass 2.
-- Timestamp 000043 — 000040–000042/000044–000045 taken (photos/events/clubs/media).
-- Guard: null-only (do not overwrite existing crests).
--
-- Rejected this pass: Golf (FB silhouette / Webnode "NG" favicon only),
-- Karate (FB NamibiaKarateFederation = NSC wave; NamibiaKarate = JKA Shotokan branch;
-- Wayback nakulogo = NSC crest), Badminton/PWFN (no crest on BWF/IF pages),
-- Handball IHF Namibia.png = flag only, Muaythai/Footgolf FB silhouettes,
-- FISU/WFDF Namibia assets = national flag only, NUFS/TISAN Traditional (no crest),
-- NSSU Schools eagle crest verified at nssu.com.na but wrong org for nnssu
-- (Students/FISU tertiary slot ≠ Schools learners body).

-- Namibia Handball Federation — CAHB Zone 6 / Sportaview federation crest
UPDATE sportsplatform_federations SET
  logo = '/logos/Namibia_Handball_Federation_logo.png',
  updated_at = now()
WHERE slug = 'namibia-handball'
  AND (logo IS NULL OR logo = '');

-- NLAS / NALASRA — official site crest (Wayback nalasra.com/mobile_logo.png)
UPDATE sportsplatform_federations SET
  logo = '/logos/NALASRA_logo.png',
  updated_at = now()
WHERE slug = 'nlas'
  AND (logo IS NULL OR logo = '');
