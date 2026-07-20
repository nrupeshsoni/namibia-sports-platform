-- Federation crests deep pass (logo column only). 2026-07-20.
-- Sources: Facebook Graph page pictures (visually verified), official jukskei-nam.com.
-- WHY: Fill remaining null-logo priority rows after sibling batch19.
-- Timestamp 000033 — avoid collisions with 000019 crests + 000020–000032 sibling work.
-- Guard: only UPDATE rows where logo is still null (skip sibling-filled crests).
--
-- Sibling already applied (SKIP): fencing, archery, wrestling, esports, padel.
-- Rejected this pass: Karate (FB = Namibian flag-wave / not karate crest; JKA branch),
-- Golf/Handball/Muaythai/Footgolf (FB silhouettes), Boxing (no crest), Dance Sport /
-- Horse Racing / Badminton / Taekwondo / PWFN (no verified crest found).

-- Kickboxing — Facebook Graph kickfederation page picture (fist + Namibian flag shield)
UPDATE sportsplatform_federations SET
  logo = '/logos/Namibia_Kickboxing_Federation_logo.jpg',
  updated_at = now()
WHERE slug = 'namibia-kickboxing'
  AND (logo IS NULL OR logo = '');

-- Sailing — Facebook Graph windynamib page picture (NSA sail + laurel crest)
UPDATE sportsplatform_federations SET
  logo = '/logos/Namibia_Sailing_Association_logo.jpg',
  updated_at = now()
WHERE slug = 'sailing-namibia'
  AND (logo IS NULL OR logo = '');

-- Canoeing — Facebook Graph namibiacanoerowing (N.C.R.F. crest)
UPDATE sportsplatform_federations SET
  logo = '/logos/Namibia_Canoe_Rowing_Federation_logo.jpg',
  updated_at = now()
WHERE slug = 'namibia-canoeing'
  AND (logo IS NULL OR logo = '');

-- Rowing — same NCRF national body crest
UPDATE sportsplatform_federations SET
  logo = '/logos/Namibia_Canoe_Rowing_Federation_logo.jpg',
  updated_at = now()
WHERE slug = 'rowing-namibia'
  AND (logo IS NULL OR logo = '');

-- Jukskei — official logo_NamibiaJukskeiNew.png from jukskei-nam.com
UPDATE sportsplatform_federations SET
  logo = '/logos/Namibia_Jukskei_logo.png',
  updated_at = now()
WHERE slug = 'namibia-jukskei'
  AND (logo IS NULL OR logo = '');
