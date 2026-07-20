-- More federation crests (logo column only). 2026-07-20.
-- Sources: Wayback Machine archives, Facebook Graph page pictures (verified),
-- official federation hosts. Documented in docs/research/federation_data_gap_list.md
-- WHY: Close P0 leftovers (NSC, Volleyball, Chess, Judo) + batch null-logo rows.
-- Timestamp 000010+ to avoid sibling contact/website migrations 000004–000006.

-- ===== P0 leftovers =====

-- Namibia Sports Commission — FB page picture (NamSportComm); crest "Wings of Power"
UPDATE sportsplatform_federations SET
  logo = '/logos/Namibia_Sports_Commission_logo.jpg',
  updated_at = now()
WHERE slug = 'namibia-sports-commission';

-- Volleyball — archived official NVF.jpg from namibiavolleyball.org
UPDATE sportsplatform_federations SET
  logo = '/logos/Namibia_Volleyball_Federation_logo.jpg',
  updated_at = now()
WHERE slug = 'namibia-volleyball';

-- Chess — archived logo from namibiachessfederation.com
UPDATE sportsplatform_federations SET
  logo = '/logos/Namibia_Chess_Federation_logo.png',
  updated_at = now()
WHERE slug = 'chess-namibia';

-- Judo — archived logo-wide.png from njf.com.na
UPDATE sportsplatform_federations SET
  logo = '/logos/Namibian_Judo_Federation_logo.png',
  updated_at = now()
WHERE slug = 'judo-namibia';

-- ===== Batch =====

-- Tennis — SportyHQ/Filepicker club logo used by Namibia Tennis Association
UPDATE sportsplatform_federations SET
  logo = '/logos/Namibia_Tennis_Association_logo.png',
  updated_at = now()
WHERE slug = 'tennis-namibia';

-- Hunting rifle shooting (NHRSA) — official nhrsa.com/images/logo.png
UPDATE sportsplatform_federations SET
  logo = '/logos/Namibian_Hunting_Rifle_Shooting_Association_logo.png',
  updated_at = now()
WHERE slug = 'shooting-namibia';

-- Basketball — FB page crest (replaces sport photo)
UPDATE sportsplatform_federations SET
  logo = '/logos/Namibian_Basketball_Federation_logo.jpg',
  updated_at = now()
WHERE slug = 'namibia-basketball';

-- Table Tennis — FB page crest (NamibiaTT)
UPDATE sportsplatform_federations SET
  logo = '/logos/Namibia_Table_Tennis_Association_logo.jpg',
  updated_at = now()
WHERE slug = 'table-tennis-namibia';

-- Beach volleyball governed by NVF — share NVF crest
UPDATE sportsplatform_federations SET
  logo = '/logos/Namibia_Volleyball_Federation_logo.jpg',
  updated_at = now()
WHERE slug = 'namibia-beach-volleyball';

-- Roller sports / skateboarding under NIIHA (World Skate) — share NIIHA crest
UPDATE sportsplatform_federations SET
  logo = '/logos/Namibia_Ice_and_Inline_Hockey_Association_logo.jpg',
  updated_at = now()
WHERE slug IN ('roller-sports-namibia', 'skateboarding-namibia');

-- Futsal administered under NFA — share NFA crest
UPDATE sportsplatform_federations SET
  logo = '/logos/Namibia_Football_Association_logo.png',
  updated_at = now()
WHERE slug = 'namibia-futsal';
