-- Federation crests batch 19 (logo column only). 2026-07-20.
-- Sources: official hosts, Wayback Machine, Facebook Graph (visually verified).
-- WHY: Priority null-logo federations (Fencing, Archery, Wrestling) + Esports/Padel.
-- Timestamp 000019 — 000013–000018 taken by sibling migrations.
-- Rejected this pass: Karate (NSC crest / JKA branch), Golf (favicon initials only),
-- Handball (IHF flag placeholder + FB silhouette), Boxing (no crest), Sailing/Dance/Horse
-- Racing/Badminton/Weightlifting (no verified crest), World Archery generic MA badge.

-- Fencing — official NFF crest from namibianfencing.com
UPDATE sportsplatform_federations SET
  logo = '/logos/Namibia_Fencing_Federation_logo.png',
  updated_at = now()
WHERE slug = 'fencing-namibia';

-- Archery — Wayback archerynamibia.org AAN logo
UPDATE sportsplatform_federations SET
  logo = '/logos/Archery_Association_of_Namibia_logo.png',
  updated_at = now()
WHERE slug = 'archery-namibia';

-- Wrestling — Facebook Graph NamibiaWrestlingFederation page picture (NWF crest)
UPDATE sportsplatform_federations SET
  logo = '/logos/Namibian_Wrestling_Federation_logo.jpg',
  updated_at = now()
WHERE slug = 'wrestling-namibia';

-- Esports — official nesa_logo.png from esportsnamibia.org (compressed <50KB)
UPDATE sportsplatform_federations SET
  logo = '/logos/Namibia_Electronic_Sport_Association_logo.png',
  updated_at = now()
WHERE slug = 'namibia-esports';

-- Padel — Facebook Graph NamibiaPadel page picture (verified crest)
UPDATE sportsplatform_federations SET
  logo = '/logos/Namibia_Padel_Tennis_Federation_logo.jpg',
  updated_at = now()
WHERE slug = 'namibia-padel-tennis';
