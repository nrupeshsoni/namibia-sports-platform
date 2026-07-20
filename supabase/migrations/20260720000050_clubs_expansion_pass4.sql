-- Clubs expansion Pass 4 — verified real clubs only (2026-07-20).
-- WHY: Live baseline ~92 clubs / 21 feds; seed +20–40 named clubs for zero-club
-- federations (chess, motorsport, equestrian, sailing, handball) plus depth for
-- swimming/NASFED, cycling, cricket, rugby, karate. Never fabricate contacts.
-- Evidence: docs/research/clubs_enrichment_batch.md (Pass 4)

-- ===== NEW FED: chess-namibia =====

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url, is_active
)
SELECT
  'Capablanca Chess Club', 'capablanca-chess-club', f.id,
  'Windhoek', 'Khomas', '/sports/chess-tournament.jpg', true
FROM sportsplatform_federations f
WHERE f.slug = 'chess-namibia'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'capablanca-chess-club');

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url,
  website, contact_email, contact_phone, address, is_active
)
SELECT
  'Rubinstein Chess Academy', 'rubinstein-chess-academy', f.id,
  'Windhoek', 'Khomas', '/sports/chess-tournament.jpg',
  'https://www.rubinstein.com.na/rubinstein-chess/chess-academy.html',
  'info@rubinstein.com.na', '+264 81 370 5880',
  '16 Pavlov Street, Windhoek', true
FROM sportsplatform_federations f
WHERE f.slug = 'chess-namibia'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'rubinstein-chess-academy');

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url,
  website, is_active
)
SELECT
  'NUST Chess Club', 'nust-chess-club', f.id,
  'Windhoek', 'Khomas', '/sports/chess-tournament.jpg',
  'https://www.nust.na/societies/chess-club', true
FROM sportsplatform_federations f
WHERE f.slug = 'chess-namibia'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'nust-chess-club');

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url, is_active
)
SELECT
  'Zandell Chess Academy', 'zandell-chess-academy', f.id,
  'Windhoek', 'Khomas', '/sports/chess-tournament.jpg', true
FROM sportsplatform_federations f
WHERE f.slug = 'chess-namibia'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'zandell-chess-academy');

-- ===== NEW FED: motorsport-namibia (NMSF affiliated clubs page) =====

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url,
  website, contact_email, contact_phone, is_active
)
SELECT
  'Windhoek Motor Club', 'windhoek-motor-club', f.id,
  'Windhoek', 'Khomas', '/sports/motorsport.jpg',
  'https://www.motorsportnamibia.org/affiliated-motorsport-clubs',
  'wmc@motorsportnamibia.org', '+264 81 124 9200', true
FROM sportsplatform_federations f
WHERE f.slug = 'motorsport-namibia'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'windhoek-motor-club');

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url,
  website, contact_email, contact_phone, is_active
)
SELECT
  'Swakopmund Karters', 'swakopmund-karters', f.id,
  'Swakopmund', 'Erongo', '/sports/motorsport.jpg',
  'https://www.motorsportnamibia.org/affiliated-motorsport-clubs',
  'service@kartstore-namibia.com', '+264 81 149 4088', true
FROM sportsplatform_federations f
WHERE f.slug = 'motorsport-namibia'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'swakopmund-karters');

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url,
  website, contact_email, contact_phone, is_active
)
SELECT
  'Walvis Bay Motor Club', 'walvis-bay-motor-club', f.id,
  'Walvis Bay', 'Erongo', '/sports/motorsport.jpg',
  'https://www.motorsportnamibia.org/affiliated-motorsport-clubs',
  'walvisbaymotorclub@gmail.com', '+264 81 128 9798', true
FROM sportsplatform_federations f
WHERE f.slug = 'motorsport-namibia'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'walvis-bay-motor-club');

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url,
  website, contact_email, contact_phone, is_active
)
SELECT
  'Namibian Enduro Club', 'namibian-enduro-club', f.id,
  'Windhoek', 'Khomas', '/sports/motorsport.jpg',
  'https://www.namibianenduro.com/',
  'chairman@namibiaenduro.com.na', '+264 81 127 1229', true
FROM sportsplatform_federations f
WHERE f.slug = 'motorsport-namibia'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'namibian-enduro-club');

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url,
  website, contact_email, contact_phone, is_active
)
SELECT
  'Swakopmund Motor Club', 'swakopmund-motor-club', f.id,
  'Swakopmund', 'Erongo', '/sports/motorsport.jpg',
  'https://www.motorsportnamibia.org/affiliated-motorsport-clubs',
  'steven@hmn.com.na', '+264 81 404 7930', true
FROM sportsplatform_federations f
WHERE f.slug = 'motorsport-namibia'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'swakopmund-motor-club');

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url,
  website, contact_email, contact_phone, is_active
)
SELECT
  'Tsumeb Motor Club', 'tsumeb-motor-club', f.id,
  'Tsumeb', 'Oshikoto', '/sports/motorsport.jpg',
  'https://www.motorsportnamibia.org/affiliated-motorsport-clubs',
  'frikkie@vdp.com.na', '+264 81 150 8601', true
FROM sportsplatform_federations f
WHERE f.slug = 'motorsport-namibia'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'tsumeb-motor-club');

-- ===== NEW FED: equestrian-namibia (NAMEF affiliate members) =====

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url,
  website, is_active
)
SELECT
  'Gymkhana Club Windhoek', 'gymkhana-club-windhoek', f.id,
  'Windhoek', 'Khomas', '/sports/equestrian.jpg',
  'https://www.namef.org.na/gymkhana-club-windhoek-gcw', true
FROM sportsplatform_federations f
WHERE f.slug = 'equestrian-namibia'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'gymkhana-club-windhoek');

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url,
  website, contact_email, contact_phone, is_active
)
SELECT
  'Reiter Verein Swakopmund', 'reiter-verein-swakopmund', f.id,
  'Swakopmund', 'Erongo', '/sports/equestrian.jpg',
  'https://www.namef.org.na/reiter-verein-swakopmund-rvs',
  'holger.kleyenstueber@gmail.com', '+264 81 127 0595', true
FROM sportsplatform_federations f
WHERE f.slug = 'equestrian-namibia'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'reiter-verein-swakopmund');

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url,
  website, contact_email, contact_phone, is_active
)
SELECT
  'Walvis Bay Equestrian Club', 'walvis-bay-equestrian-club', f.id,
  'Walvis Bay', 'Erongo', '/sports/equestrian.jpg',
  'https://www.namef.org.na/walvis-bay-equestrian-club-wbec',
  'wbequest@mweb.com.na', '+264 81 203 3330', true
FROM sportsplatform_federations f
WHERE f.slug = 'equestrian-namibia'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'walvis-bay-equestrian-club');

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url,
  website, is_active
)
SELECT
  'Reit Club Okahandja', 'reit-club-okahandja', f.id,
  'Okahandja', 'Otjozondjupa', '/sports/equestrian.jpg',
  'https://www.namef.org.na/reit-club-okahandja-rco', true
FROM sportsplatform_federations f
WHERE f.slug = 'equestrian-namibia'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'reit-club-okahandja');

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url,
  website, is_active
)
SELECT
  'Auas View Equestrian Club', 'auas-view-equestrian-club', f.id,
  'Windhoek', 'Khomas', '/sports/equestrian.jpg',
  'https://www.namef.org.na/namef/affiliation', true
FROM sportsplatform_federations f
WHERE f.slug = 'equestrian-namibia'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'auas-view-equestrian-club');

-- ===== NEW FED: sailing-namibia =====

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url,
  website, contact_email, contact_phone, address, is_active
)
SELECT
  'Walvis Bay Yacht Club', 'walvis-bay-yacht-club', f.id,
  'Walvis Bay', 'Erongo', '/sports/sailing.jpg',
  'https://www.wbyc.com.na/',
  'wbyc@iway.na', '+264 81 229 9300',
  'P.O. Box 851, Walvis Bay', true
FROM sportsplatform_federations f
WHERE f.slug = 'sailing-namibia'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'walvis-bay-yacht-club');

-- ===== NEW FED: namibia-handball (The Namibian tournament coverage) =====

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url, is_active
)
SELECT
  'Titans Handball Club', 'titans-handball-club', f.id,
  'Windhoek', 'Khomas', '/sports/handball.jpg', true
FROM sportsplatform_federations f
WHERE f.slug = 'namibia-handball'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'titans-handball-club');

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url, is_active
)
SELECT
  'City Pillars Handball Club', 'city-pillars-handball-club', f.id,
  'Windhoek', 'Khomas', '/sports/handball.jpg', true
FROM sportsplatform_federations f
WHERE f.slug = 'namibia-handball'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'city-pillars-handball-club');

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url, is_active
)
SELECT
  'Swallows Handball Club', 'swallows-handball-club', f.id,
  'Windhoek', 'Khomas', '/sports/handball.jpg', true
FROM sportsplatform_federations f
WHERE f.slug = 'namibia-handball'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'swallows-handball-club');

-- ===== EXPAND: swimming-namibia / NASFED AGM 2024 affiliated clubs =====

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url, is_active
)
SELECT
  'Marlins Aquatic Club', 'marlins-aquatic-club', f.id,
  'Windhoek', 'Khomas', '/sports/swimming.jpg', true
FROM sportsplatform_federations f
WHERE f.slug = 'swimming-namibia'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'marlins-aquatic-club');

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url,
  website, contact_email, contact_phone, is_active
)
SELECT
  'Infinity Aquatic Club', 'infinity-aquatic-club', f.id,
  'Windhoek', 'Khomas', '/sports/swimming.jpg',
  'https://infinity-aquatics.com/',
  'info@infinity-aquatics.com', '+264 81 127 0276', true
FROM sportsplatform_federations f
WHERE f.slug = 'swimming-namibia'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'infinity-aquatic-club');

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url,
  website, address, is_active
)
SELECT
  'Aqua Swimming and Fitness Club', 'aqua-swimming-fitness-club', f.id,
  'Windhoek', 'Khomas', '/sports/swimming.jpg',
  'https://www.aquaswimmingclub.com.na/',
  'School of Medicine, University of Namibia, Windhoek', true
FROM sportsplatform_federations f
WHERE f.slug = 'swimming-namibia'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'aqua-swimming-fitness-club');

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url, is_active
)
SELECT
  'Dolphins Swimming Club', 'dolphins-swimming-club', f.id,
  'Windhoek', 'Khomas', '/sports/swimming.jpg', true
FROM sportsplatform_federations f
WHERE f.slug = 'swimming-namibia'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'dolphins-swimming-club');

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url, is_active
)
SELECT
  'Phoenix Swimming Club', 'phoenix-swimming-club', f.id,
  'Windhoek', 'Khomas', '/sports/swimming.jpg', true
FROM sportsplatform_federations f
WHERE f.slug = 'swimming-namibia'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'phoenix-swimming-club');

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url, is_active
)
SELECT
  'Swakopmund Swimming Club', 'swakopmund-swimming-club', f.id,
  'Swakopmund', 'Erongo', '/sports/swimming.jpg', true
FROM sportsplatform_federations f
WHERE f.slug = 'swimming-namibia'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'swakopmund-swimming-club');

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url, is_active
)
SELECT
  'Flippers Swimming Club', 'flippers-swimming-club', f.id,
  'Windhoek', 'Khomas', '/sports/swimming.jpg', true
FROM sportsplatform_federations f
WHERE f.slug = 'swimming-namibia'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'flippers-swimming-club');

-- ===== EXPAND: namibia-cycling (NCF affiliated clubs) =====

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url,
  website, is_active
)
SELECT
  'Windhoek Pedal Power', 'windhoek-pedal-power', f.id,
  'Windhoek', 'Khomas', '/sports/cycling.jpg',
  'https://www.windhoekpedalpower.com/', true
FROM sportsplatform_federations f
WHERE f.slug = 'namibia-cycling'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'windhoek-pedal-power');

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url,
  website, is_active
)
SELECT
  'Rock & Rut', 'rock-and-rut', f.id,
  'Windhoek', 'Khomas', '/sports/cycling.jpg',
  'https://namibian-cycling-federation.org/links', true
FROM sportsplatform_federations f
WHERE f.slug = 'namibia-cycling'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'rock-and-rut');

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url,
  website, is_active
)
SELECT
  'Spoke Stars BMX Club', 'spoke-stars-bmx-club', f.id,
  'Windhoek', 'Khomas', '/sports/cycling.jpg',
  'https://namibian-cycling-federation.org/links', true
FROM sportsplatform_federations f
WHERE f.slug = 'namibia-cycling'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'spoke-stars-bmx-club');

-- ===== EXPAND: cricket-namibia (CN clubs directory) =====

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url,
  website, is_active
)
SELECT
  'Welwitschia Cricket Club', 'welwitschia-cricket-club', f.id,
  'Windhoek', 'Khomas', '/sports/cricket.jpg',
  'https://cricketnamibia.com/clubs/', true
FROM sportsplatform_federations f
WHERE f.slug = 'cricket-namibia'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'welwitschia-cricket-club');

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url,
  website, is_active
)
SELECT
  'Zebra Cricket Club', 'zebra-cricket-club', f.id,
  'Windhoek', 'Khomas', '/sports/cricket.jpg',
  'https://cricketnamibia.com/clubs/', true
FROM sportsplatform_federations f
WHERE f.slug = 'cricket-namibia'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'zebra-cricket-club');

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url,
  website, is_active
)
SELECT
  'CCD Cricket Club', 'ccd-cricket-club', f.id,
  'Windhoek', 'Khomas', '/sports/cricket.jpg',
  'https://cricketnamibia.com/clubs/', true
FROM sportsplatform_federations f
WHERE f.slug = 'cricket-namibia'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'ccd-cricket-club');

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url,
  website, is_active
)
SELECT
  'Blue Waters Cricket Club', 'blue-waters-cricket-club', f.id,
  'Walvis Bay', 'Erongo', '/sports/cricket.jpg',
  'https://cricketnamibia.com/clubs/general-club-information/', true
FROM sportsplatform_federations f
WHERE f.slug = 'cricket-namibia'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'blue-waters-cricket-club');

-- ===== EXPAND: nru (FNB Rugby Domestic Premier League) =====

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url,
  website, is_active
)
SELECT
  'Kudus Rugby Club', 'kudus-rugby-club', f.id,
  'Windhoek', 'Khomas', '/sports/rugby.jpg',
  'https://fnbrugby.leaguerepublic.com/', true
FROM sportsplatform_federations f
WHERE f.slug = 'nru'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'kudus-rugby-club');

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url,
  website, is_active
)
SELECT
  'UNAM Rugby Club', 'unam-rugby-club', f.id,
  'Windhoek', 'Khomas', '/sports/rugby.jpg',
  'https://fnbrugby.leaguerepublic.com/', true
FROM sportsplatform_federations f
WHERE f.slug = 'nru'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'unam-rugby-club');

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url,
  website, is_active
)
SELECT
  'Grootfontein Rugby Club', 'grootfontein-rugby-club', f.id,
  'Grootfontein', 'Otjozondjupa', '/sports/rugby.jpg',
  'https://fnbrugby.leaguerepublic.com/', true
FROM sportsplatform_federations f
WHERE f.slug = 'nru'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'grootfontein-rugby-club');

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url,
  website, is_active
)
SELECT
  'Dolphin Rugby Club', 'dolphin-rugby-club', f.id,
  'Walvis Bay', 'Erongo', '/sports/rugby.jpg',
  'https://fnbrugby.leaguerepublic.com/', true
FROM sportsplatform_federations f
WHERE f.slug = 'nru'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'dolphin-rugby-club');

-- ===== EXPAND: karate-namibia (named national dojos) =====

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url,
  website, contact_email, contact_phone, address, is_active
)
SELECT
  'Namibia Japan Karate Association', 'namibia-japan-karate-association', f.id,
  'Windhoek', 'Khomas', '/sports/karate.jpg',
  'https://www.namjkakarate.com/',
  'namjka@afol.com.na', '+264 81 257 0309',
  'Parsival Street No. 15, Max Industrial No. 8, Southern Industrial Area, Windhoek', true
FROM sportsplatform_federations f
WHERE f.slug = 'karate-namibia'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'namibia-japan-karate-association');

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url,
  website, contact_phone, address, is_active
)
SELECT
  'Shotokan Karate Swakopmund', 'shotokan-karate-swakopmund', f.id,
  'Swakopmund', 'Erongo', '/sports/karate.jpg',
  'http://swakopkarate.com.dedi823.jnb2.host-h.net/Home-of-Shotokan-Karate/',
  '+264 81 234 0134',
  'The MTC Dome, 5371 Welwitschia Street, Swakopmund', true
FROM sportsplatform_federations f
WHERE f.slug = 'karate-namibia'
  AND NOT EXISTS (SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'shotokan-karate-swakopmund');
