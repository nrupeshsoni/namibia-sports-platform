-- Clubs expansion Pass 5 — verified real clubs only (2026-07-21).
-- WHY: Live baseline ~131 clubs / 26 feds; seed +25–40 named clubs for more
-- zero-club federations (archery, fencing, padel, jukskei, practical shooting,
-- angling, canoeing, dance sport) plus golf depth. Never fabricate contacts.
-- Evidence: docs/research/clubs_enrichment_batch.md (Pass 5)

-- ===== NEW FED: archery-namibia =====

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url, is_active
)
SELECT
  'Windhoek Archery Club', 'windhoek-archery-club', f.id,
  'Windhoek', 'Khomas', '/sports/archery.jpg', true
FROM sportsplatform_federations f
WHERE f.slug = 'archery-namibia'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'windhoek-archery-club');

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url,
  website, is_active
)
SELECT
  'Swakopmund Archery Club', 'swakopmund-archery-club', f.id,
  'Swakopmund', 'Erongo', '/sports/archery.jpg',
  'https://www.sfc1929.com/archery', true
FROM sportsplatform_federations f
WHERE f.slug = 'archery-namibia'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'swakopmund-archery-club');

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url,
  website, contact_phone, is_active
)
SELECT
  'SKW Archers', 'skw-archers', f.id,
  'Windhoek', 'Khomas', '/sports/archery.jpg',
  'http://www.skw.com.na/SKW%20Archers.html',
  '+264 81 745 4294', true
FROM sportsplatform_federations f
WHERE f.slug = 'archery-namibia'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'skw-archers');

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url, is_active
)
SELECT
  'Atlantis Archery Club', 'atlantis-archery-club', f.id,
  'Walvis Bay', 'Erongo', '/sports/archery.jpg', true
FROM sportsplatform_federations f
WHERE f.slug = 'archery-namibia'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'atlantis-archery-club');

-- ===== NEW FED: fencing-namibia =====

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url,
  website, is_active
)
SELECT
  'Windhoek Fencing Club', 'windhoek-fencing-club', f.id,
  'Windhoek', 'Khomas', '/sports/fencing.jpg',
  'https://namibianfencing.com/', true
FROM sportsplatform_federations f
WHERE f.slug = 'fencing-namibia'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'windhoek-fencing-club');

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url, is_active
)
SELECT
  'Highlanders Fencing Club', 'highlanders-fencing-club', f.id,
  'Windhoek', 'Khomas', '/sports/fencing.jpg', true
FROM sportsplatform_federations f
WHERE f.slug = 'fencing-namibia'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'highlanders-fencing-club');

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url, is_active
)
SELECT
  'Gobabis Fencing Club', 'gobabis-fencing-club', f.id,
  'Gobabis', 'Omaheke', '/sports/fencing.jpg', true
FROM sportsplatform_federations f
WHERE f.slug = 'fencing-namibia'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'gobabis-fencing-club');

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url, is_active
)
SELECT
  'Katima Mulilo Fencing Club', 'katima-mulilo-fencing-club', f.id,
  'Katima Mulilo', 'Zambezi', '/sports/fencing.jpg', true
FROM sportsplatform_federations f
WHERE f.slug = 'fencing-namibia'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'katima-mulilo-fencing-club');

-- ===== NEW FED: namibia-padel-tennis =====

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url,
  website, address, is_active
)
SELECT
  'Namibia Padel', 'namibia-padel', f.id,
  'Windhoek', 'Khomas', '/sports/padel.jpg',
  'https://namibiapadel.com/',
  'Corner Sean McBride & Tennis Street, Olympia, Windhoek', true
FROM sportsplatform_federations f
WHERE f.slug = 'namibia-padel-tennis'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'namibia-padel');

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url,
  website, contact_phone, address, is_active
)
SELECT
  'Wanderers Padel', 'wanderers-padel', f.id,
  'Windhoek', 'Khomas', '/sports/padel.jpg',
  'https://wandererspadel-na.matchpoint.com.es/',
  '+264 61 242 069',
  'Wanderers Sports Club, Windhoek', true
FROM sportsplatform_federations f
WHERE f.slug = 'namibia-padel-tennis'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'wanderers-padel');

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url,
  website, contact_email, contact_phone, address, is_active
)
SELECT
  'United Padel Namibia', 'united-padel-namibia', f.id,
  'Windhoek', 'Khomas', '/sports/padel.jpg',
  'https://unitedpadel-na.matchpoint.com.es/',
  'info@unitedpadelnam.com.na', '+264 81 709 0963',
  'Trustco United Fields, Frankie Fredericks Drive, Olympia, Windhoek', true
FROM sportsplatform_federations f
WHERE f.slug = 'namibia-padel-tennis'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'united-padel-namibia');

-- ===== NEW FED: namibia-jukskei (jukskei-nam.com Central + Western regions) =====

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url,
  website, is_active
)
SELECT
  'Auas Jukskei Club', 'auas-jukskei-club', f.id,
  'Windhoek', 'Khomas', '/sports/jukskei.jpg',
  'https://www.jukskei-nam.com/central_info.php', true
FROM sportsplatform_federations f
WHERE f.slug = 'namibia-jukskei'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'auas-jukskei-club');

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url,
  website, is_active
)
SELECT
  'Olympus Jukskei Club', 'olympus-jukskei-club', f.id,
  'Windhoek', 'Khomas', '/sports/jukskei.jpg',
  'https://www.jukskei-nam.com/central_info.php', true
FROM sportsplatform_federations f
WHERE f.slug = 'namibia-jukskei'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'olympus-jukskei-club');

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url,
  website, is_active
)
SELECT
  'Voorslag Jukskei Club', 'voorslag-jukskei-club', f.id,
  'Windhoek', 'Khomas', '/sports/jukskei.jpg',
  'https://www.jukskei-nam.com/central_info.php', true
FROM sportsplatform_federations f
WHERE f.slug = 'namibia-jukskei'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'voorslag-jukskei-club');

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url,
  website, is_active
)
SELECT
  'Weermag Jukskei Club', 'weermag-jukskei-club', f.id,
  'Windhoek', 'Khomas', '/sports/jukskei.jpg',
  'https://www.jukskei-nam.com/central_info.php', true
FROM sportsplatform_federations f
WHERE f.slug = 'namibia-jukskei'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'weermag-jukskei-club');

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url,
  website, is_active
)
SELECT
  'Vintage Jukskei Club', 'vintage-jukskei-club', f.id,
  'Windhoek', 'Khomas', '/sports/jukskei.jpg',
  'https://www.jukskei-nam.com/central_info.php', true
FROM sportsplatform_federations f
WHERE f.slug = 'namibia-jukskei'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'vintage-jukskei-club');

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url,
  website, is_active
)
SELECT
  'Gobabis Jukskei Club', 'gobabis-jukskei-club', f.id,
  'Gobabis', 'Omaheke', '/sports/jukskei.jpg',
  'https://www.jukskei-nam.com/central_info.php', true
FROM sportsplatform_federations f
WHERE f.slug = 'namibia-jukskei'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'gobabis-jukskei-club');

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url,
  website, is_active
)
SELECT
  'Swakopmund Jukskei Club', 'swakopmund-jukskei-club', f.id,
  'Swakopmund', 'Erongo', '/sports/jukskei.jpg',
  'https://www.jukskei-nam.com/', true
FROM sportsplatform_federations f
WHERE f.slug = 'namibia-jukskei'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'swakopmund-jukskei-club');

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url,
  website, is_active
)
SELECT
  'Walvis Bay Jukskei Club', 'walvis-bay-jukskei-club', f.id,
  'Walvis Bay', 'Erongo', '/sports/jukskei.jpg',
  'https://www.jukskei-nam.com/', true
FROM sportsplatform_federations f
WHERE f.slug = 'namibia-jukskei'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'walvis-bay-jukskei-club');

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url,
  website, is_active
)
SELECT
  'Henties Bay Jukskei Club', 'henties-bay-jukskei-club', f.id,
  'Henties Bay', 'Erongo', '/sports/jukskei.jpg',
  'https://www.jukskei-nam.com/', true
FROM sportsplatform_federations f
WHERE f.slug = 'namibia-jukskei'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'henties-bay-jukskei-club');

-- ===== NEW FED: namibia-practical-shooting (NAPSA affiliated clubs) =====

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url,
  website, is_active
)
SELECT
  'City of Windhoek Shooting Club', 'city-of-windhoek-shooting-club', f.id,
  'Windhoek', 'Khomas', '/sports/practical-shooting.jpg',
  'https://cwsc.online/', true
FROM sportsplatform_federations f
WHERE f.slug = 'namibia-practical-shooting'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'city-of-windhoek-shooting-club');

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url,
  website, is_active
)
SELECT
  'Swakopmund Practical Shooting Club', 'swakopmund-practical-shooting-club', f.id,
  'Swakopmund', 'Erongo', '/sports/practical-shooting.jpg',
  'https://napsa.info/', true
FROM sportsplatform_federations f
WHERE f.slug = 'namibia-practical-shooting'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'swakopmund-practical-shooting-club');

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url,
  website, is_active
)
SELECT
  'Luderitz Sport Shooting Club', 'luderitz-sport-shooting-club', f.id,
  'Luderitz', 'ǁKaras', '/sports/practical-shooting.jpg',
  'https://luderitzssc.org/', true
FROM sportsplatform_federations f
WHERE f.slug = 'namibia-practical-shooting'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'luderitz-sport-shooting-club');

-- ===== NEW FED: angling-namibia (NSAA clubs named in nationals coverage) =====

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url,
  website, is_active
)
SELECT
  'Mako Angling Club', 'mako-angling-club', f.id,
  'Swakopmund', 'Erongo', '/sports/fishing.jpg',
  'https://namshoreangling.com.na/', true
FROM sportsplatform_federations f
WHERE f.slug = 'angling-namibia'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'mako-angling-club');

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url,
  website, is_active
)
SELECT
  'Benguela Angling Club', 'benguela-angling-club', f.id,
  'Swakopmund', 'Erongo', '/sports/fishing.jpg',
  'https://namshoreangling.com.na/', true
FROM sportsplatform_federations f
WHERE f.slug = 'angling-namibia'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'benguela-angling-club');

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url,
  website, is_active
)
SELECT
  'Henties Bay Angling Club', 'henties-bay-angling-club', f.id,
  'Henties Bay', 'Erongo', '/sports/fishing.jpg',
  'https://namshoreangling.com.na/', true
FROM sportsplatform_federations f
WHERE f.slug = 'angling-namibia'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'henties-bay-angling-club');

-- ===== NEW FED: namibia-canoeing =====

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url, is_active
)
SELECT
  'Walvis Bay Canoe and Rowing Club', 'walvis-bay-canoe-rowing-club', f.id,
  'Walvis Bay', 'Erongo', '/sports/canoeing.jpg', true
FROM sportsplatform_federations f
WHERE f.slug = 'namibia-canoeing'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'walvis-bay-canoe-rowing-club');

-- ===== NEW FED: dance-sport-namibia =====

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url, is_active
)
SELECT
  'Dance Domain Namibia', 'dance-domain-namibia', f.id,
  'Windhoek', 'Khomas', '/sports/dance-sport.jpg', true
FROM sportsplatform_federations f
WHERE f.slug = 'dance-sport-namibia'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'dance-domain-namibia');

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url, is_active
)
SELECT
  'Equipped Dance Academy', 'equipped-dance-academy', f.id,
  'Windhoek', 'Khomas', '/sports/dance-sport.jpg', true
FROM sportsplatform_federations f
WHERE f.slug = 'dance-sport-namibia'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'equipped-dance-academy');

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url, is_active
)
SELECT
  'H2E Studio', 'h2e-studio', f.id,
  'Windhoek', 'Khomas', '/sports/dance-sport.jpg', true
FROM sportsplatform_federations f
WHERE f.slug = 'dance-sport-namibia'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'h2e-studio');

-- ===== EXPAND: golf-namibia =====

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url,
  website, contact_email, contact_phone, is_active
)
SELECT
  'Omeya Golf Club', 'omeya-golf-club', f.id,
  'Windhoek', 'Khomas', '/sports/golf.jpg',
  'https://www.omeyagolfclub.com/',
  'bookings@omeyagolf.com', '+264 81 144 9000', true
FROM sportsplatform_federations f
WHERE f.slug = 'golf-namibia'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'omeya-golf-club');

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url, is_active
)
SELECT
  'Okahandja Golf Club', 'okahandja-golf-club', f.id,
  'Okahandja', 'Otjozondjupa', '/sports/golf.jpg', true
FROM sportsplatform_federations f
WHERE f.slug = 'golf-namibia'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'okahandja-golf-club');

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url, is_active
)
SELECT
  'Walvis Bay Golf Club', 'walvis-bay-golf-club', f.id,
  'Walvis Bay', 'Erongo', '/sports/golf.jpg', true
FROM sportsplatform_federations f
WHERE f.slug = 'golf-namibia'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'walvis-bay-golf-club');

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url, is_active
)
SELECT
  'Henties Bay Golf Club', 'henties-bay-golf-club', f.id,
  'Henties Bay', 'Erongo', '/sports/golf.jpg', true
FROM sportsplatform_federations f
WHERE f.slug = 'golf-namibia'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'henties-bay-golf-club');
