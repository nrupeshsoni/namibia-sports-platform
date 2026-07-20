-- Clubs expansion — verified real clubs only (2026-07-20).
-- WHY: Only 16/83 federations had clubs; seed +15–30 named clubs from public
-- sources across ≥5 previously empty federations (boxing, squash, bowls,
-- wrestling, gymnastics) plus expansions for hockey/basketball/tennis/
-- volleyball/netball/athletics. Never fabricate contacts.
-- Evidence: docs/research/clubs_enrichment_batch.md (Pass 3 — expansion)

-- ===== NEW FED: namibia-boxing =====

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url,
  website, contact_email, contact_phone, address, is_active
)
SELECT
  'Salute Boxing Academy', 'salute-boxing-academy', f.id,
  'Windhoek', 'Khomas', '/sports/boxing.jpg',
  'https://saluteboxingacademy.com/',
  'boxing@salutetradingnam.com', '+264 81 140 2175',
  '15 Allan Street, Windhoek', true
FROM sportsplatform_federations f
WHERE f.slug = 'namibia-boxing'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'salute-boxing-academy');

-- African Connection (AC) Boxing Gym — Namibia Daily News launch coverage; no stable public site
INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url, is_active
)
SELECT
  'AC Boxing Gym', 'ac-boxing-gym', f.id,
  'Windhoek', 'Khomas', '/sports/boxing.jpg', true
FROM sportsplatform_federations f
WHERE f.slug = 'namibia-boxing'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'ac-boxing-gym');

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url, is_active
)
SELECT
  'Chiappini Boxing Club', 'chiappini-boxing-club', f.id,
  'Windhoek', 'Khomas', '/sports/boxing.jpg', true
FROM sportsplatform_federations f
WHERE f.slug = 'namibia-boxing'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'chiappini-boxing-club');

-- ===== NEW FED: squash-namibia =====

-- Wanderers Squash section — NSA-affiliated; dedicated squash site suspended → main club site
INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url,
  website, contact_phone, address, is_active
)
SELECT
  'Wanderers Squash Club', 'wanderers-squash', f.id,
  'Windhoek', 'Khomas', '/logos/clubs/wanderers-sports-club.png',
  'https://www.wanderers.org.na/', '+264 61 242069',
  'Tunchel Street, Pionierspark, Windhoek', true
FROM sportsplatform_federations f
WHERE f.slug = 'squash-namibia'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'wanderers-squash');

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url,
  website, contact_email, contact_phone, address, is_active
)
SELECT
  'Klein Windhoek Squash Club', 'klein-windhoek-squash', f.id,
  'Windhoek', 'Khomas', '/sports/squash.jpg',
  'https://www.kwsquash.com.na/', 'kwsquash@gmail.com', '+264 81 729 7692',
  'Corner of Kuiseb and Omatako Street, Klein Windhoek', true
FROM sportsplatform_federations f
WHERE f.slug = 'squash-namibia'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'klein-windhoek-squash');

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url, website, is_active
)
SELECT
  'Swakopmund Sport Club Squash', 'sfc-squash', f.id,
  'Swakopmund', 'Erongo', '/sports/squash.jpg',
  'https://www.sfc1929.com/squash', true
FROM sportsplatform_federations f
WHERE f.slug = 'squash-namibia'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'sfc-squash');

-- ===== NEW FED: bowls-namibia (NBA National Bowls Week venues — The Namibian / NBC) =====

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url, is_active
)
SELECT
  'Windhoek Bowling Club', 'windhoek-bowling-club', f.id,
  'Windhoek', 'Khomas', '/sports/bowls.jpg', true
FROM sportsplatform_federations f
WHERE f.slug = 'bowls-namibia'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'windhoek-bowling-club');

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url, is_active
)
SELECT
  'Eros Bowling Club', 'eros-bowling-club', f.id,
  'Windhoek', 'Khomas', '/sports/bowls.jpg', true
FROM sportsplatform_federations f
WHERE f.slug = 'bowls-namibia'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'eros-bowling-club');

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url, is_active
)
SELECT
  'Trustco United Bowling Club', 'trustco-united-bowling-club', f.id,
  'Windhoek', 'Khomas', '/sports/bowls.jpg', true
FROM sportsplatform_federations f
WHERE f.slug = 'bowls-namibia'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'trustco-united-bowling-club');

-- ===== NEW FED: wrestling-namibia =====

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url, is_active
)
SELECT
  'Windhoek Wrestling Club', 'windhoek-wrestling-club', f.id,
  'Windhoek', 'Khomas', '/sports/wrestling.jpg', true
FROM sportsplatform_federations f
WHERE f.slug = 'wrestling-namibia'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'windhoek-wrestling-club');

-- ===== NEW FED: namibia-gymnastics =====

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url, is_active
)
SELECT
  'Windhoek Rhythmic Club', 'windhoek-rhythmic-club', f.id,
  'Windhoek', 'Khomas', '/sports/gymnastics.jpg', true
FROM sportsplatform_federations f
WHERE f.slug = 'namibia-gymnastics'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'windhoek-rhythmic-club');

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url, website, is_active
)
SELECT
  'SKW Gymnastics Academy', 'skw-gymnastics-academy', f.id,
  'Windhoek', 'Khomas', '/sports/gymnastics.jpg',
  'http://www.skw.com.na/', true
FROM sportsplatform_federations f
WHERE f.slug = 'namibia-gymnastics'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'skw-gymnastics-academy');

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url, is_active
)
SELECT
  'Elite Rhythmic Gymnastics', 'elite-rhythmic-gymnastics', f.id,
  'Windhoek', 'Khomas', '/sports/gymnastics.jpg', true
FROM sportsplatform_federations f
WHERE f.slug = 'namibia-gymnastics'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'elite-rhythmic-gymnastics');

-- ===== EXPAND: nhu (NHU find-a-club + league coverage) =====

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url,
  website, contact_email, contact_phone, is_active
)
SELECT
  'Saints Hockey Club', 'saints-hockey', f.id,
  'Windhoek', 'Khomas', '/sports/hockey.jpg',
  'https://namibiahockey.org/club-saints/',
  'saintshockeynam@gmail.com', '+264 81 124 6808', true
FROM sportsplatform_federations f
WHERE f.slug = 'nhu'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'saints-hockey');

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url,
  website, is_active
)
SELECT
  'School of Excellence Hockey Club', 'school-of-excellence-hockey', f.id,
  'Windhoek', 'Khomas', '/sports/hockey.jpg',
  'https://namibiahockey.org/club-school-of-excellence/', true
FROM sportsplatform_federations f
WHERE f.slug = 'nhu'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'school-of-excellence-hockey');

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url,
  website, is_active
)
SELECT
  'UNAM Hockey Club', 'unam-hockey', f.id,
  'Windhoek', 'Khomas', '/sports/hockey.jpg',
  'https://namibiahockey.org/club-unam-hockey/', true
FROM sportsplatform_federations f
WHERE f.slug = 'nhu'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'unam-hockey');

-- ===== EXPAND: namibia-basketball (KBA Premier League — Namibian Sun / Republikein) =====

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url, is_active
)
SELECT
  'Quality Basketball Club', 'qbc-basketball', f.id,
  'Windhoek', 'Khomas', '/sports/basketball.jpg', true
FROM sportsplatform_federations f
WHERE f.slug = 'namibia-basketball'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'qbc-basketball');

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url, is_active
)
SELECT
  'UNAM Wolves Basketball', 'unam-wolves-basketball', f.id,
  'Windhoek', 'Khomas', '/sports/basketball.jpg', true
FROM sportsplatform_federations f
WHERE f.slug = 'namibia-basketball'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'unam-wolves-basketball');

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url, is_active
)
SELECT
  'Afro Stars Basketball Club', 'afro-stars-basketball', f.id,
  'Windhoek', 'Khomas', '/sports/basketball.jpg', true
FROM sportsplatform_federations f
WHERE f.slug = 'namibia-basketball'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'afro-stars-basketball');

-- ===== EXPAND: tennis-namibia =====

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url,
  website, address, is_active
)
SELECT
  'Central Tennis Club', 'central-tennis-club', f.id,
  'Windhoek', 'Khomas', '/sports/tennis.jpg',
  'https://www.facebook.com/CentralTennisClub',
  'Corner of Frankie Frederik Drive & Jason Hamutenya Ndadi Street, Olympia, Windhoek',
  true
FROM sportsplatform_federations f
WHERE f.slug = 'tennis-namibia'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'central-tennis-club');

-- ===== EXPAND: namibia-volleyball (NVF CVA / MTC VNL — NVF + press) =====

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url, is_active
)
SELECT
  'NDF Volleyball Club', 'ndf-volleyball-club', f.id,
  'Windhoek', 'Khomas', '/sports/volleyball.jpg', true
FROM sportsplatform_federations f
WHERE f.slug = 'namibia-volleyball'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'ndf-volleyball-club');

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url, is_active
)
SELECT
  'Khomas NamPol Volleyball Club', 'khomas-nampol-volleyball', f.id,
  'Windhoek', 'Khomas', '/sports/volleyball.jpg', true
FROM sportsplatform_federations f
WHERE f.slug = 'namibia-volleyball'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'khomas-nampol-volleyball');

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url, is_active
)
SELECT
  'Afrocat Volleyball Club', 'afrocat-volleyball-club', f.id,
  'Windhoek', 'Khomas', '/sports/volleyball.jpg', true
FROM sportsplatform_federations f
WHERE f.slug = 'namibia-volleyball'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'afrocat-volleyball-club');

-- ===== EXPAND: namibia-netball (MTC Netball Namibia Premier League — The Namibian / NBC) =====

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url, is_active
)
SELECT
  'NCS Netball Club', 'ncs-netball', f.id,
  'Windhoek', 'Khomas', '/sports/netball.jpg', true
FROM sportsplatform_federations f
WHERE f.slug = 'namibia-netball'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'ncs-netball');

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url, is_active
)
SELECT
  'Otjozondjupa NamPol Netball', 'otjozondjupa-nampol-netball', f.id,
  'Otjiwarongo', 'Otjozondjupa', '/sports/netball.jpg', true
FROM sportsplatform_federations f
WHERE f.slug = 'namibia-netball'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'otjozondjupa-nampol-netball');

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url, is_active
)
SELECT
  'UNAM Ogongo Netball Club', 'unam-ogongo-netball', f.id,
  'Ogongo', 'Omusati', '/sports/netball.jpg', true
FROM sportsplatform_federations f
WHERE f.slug = 'namibia-netball'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'unam-ogongo-netball');

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url, is_active
)
SELECT
  'Afrocat Lions Netball Club', 'afrocat-lions-netball', f.id,
  'Windhoek', 'Khomas', '/sports/netball.jpg', true
FROM sportsplatform_federations f
WHERE f.slug = 'namibia-netball'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'afrocat-lions-netball');

-- ===== EXPAND: athletics-namibia (Athletics Namibia Grand Prix club list — Namibia Economist) =====

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url, is_active
)
SELECT
  'NUST Welwitschia Athletics Club', 'nust-welwitschia-athletics', f.id,
  'Windhoek', 'Khomas', '/sports/athletics.jpg', true
FROM sportsplatform_federations f
WHERE f.slug = 'athletics-namibia'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'nust-welwitschia-athletics');

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url, is_active
)
SELECT
  'Windhoek Gymnasium Athletics Club', 'windhoek-gymnasium-athletics', f.id,
  'Windhoek', 'Khomas', '/sports/athletics.jpg', true
FROM sportsplatform_federations f
WHERE f.slug = 'athletics-namibia'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'windhoek-gymnasium-athletics');

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url, is_active
)
SELECT
  'Dome Athletics Academy', 'dome-athletics-academy', f.id,
  'Swakopmund', 'Erongo', '/sports/athletics.jpg', true
FROM sportsplatform_federations f
WHERE f.slug = 'athletics-namibia'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'dome-athletics-academy');
