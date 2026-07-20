-- Clubs enrichment batch — logos + verified contacts (2026-07-20).
-- WHY: 62 clubs had 0% logos and 0% contacts; Clubs UX showed empty crests.
-- Crests: Transfermarkt wappen (NFA) + official club/venue sites (Wanderers,
-- DTS, Rossmund, WGCC, The Dome). Remaining clubs get sport-correct /sports/*
-- paths (never fabricated contacts). Evidence: docs/research/clubs_enrichment_batch.md

-- ===== NFA — club crests (Transfermarkt wappen, saved under /logos/clubs/) =====
UPDATE sportsplatform_clubs SET logo_url = '/logos/clubs/african-stars-fc.png', updated_at = now()
WHERE slug = 'african-stars-fc' AND (logo_url IS NULL OR logo_url = '');

UPDATE sportsplatform_clubs SET logo_url = '/logos/clubs/black-africa-fc.png', updated_at = now()
WHERE slug = 'black-africa-fc' AND (logo_url IS NULL OR logo_url = '');

UPDATE sportsplatform_clubs SET logo_url = '/logos/clubs/blue-waters-fc.png', updated_at = now()
WHERE slug = 'blue-waters-fc' AND (logo_url IS NULL OR logo_url = '');

UPDATE sportsplatform_clubs SET logo_url = '/logos/clubs/civics-fc.png', updated_at = now()
WHERE slug = 'civics-fc' AND (logo_url IS NULL OR logo_url = '');

UPDATE sportsplatform_clubs SET logo_url = '/logos/clubs/eeshoke-chula-chula-fc.png', updated_at = now()
WHERE slug = 'eeshoke-chula-chula-fc' AND (logo_url IS NULL OR logo_url = '');

UPDATE sportsplatform_clubs SET logo_url = '/logos/clubs/eleven-arrows-fc.png', updated_at = now()
WHERE slug = 'eleven-arrows-fc' AND (logo_url IS NULL OR logo_url = '');

UPDATE sportsplatform_clubs SET logo_url = '/logos/clubs/fc-ongos.png', updated_at = now()
WHERE slug = 'fc-ongos' AND (logo_url IS NULL OR logo_url = '');

UPDATE sportsplatform_clubs SET logo_url = '/logos/clubs/julinho-sporting-fc.png', updated_at = now()
WHERE slug = 'julinho-sporting-fc' AND (logo_url IS NULL OR logo_url = '');

UPDATE sportsplatform_clubs SET logo_url = '/logos/clubs/khomas-nampol-fc.png', updated_at = now()
WHERE slug = 'khomas-nampol-fc' AND (logo_url IS NULL OR logo_url = '');

UPDATE sportsplatform_clubs SET logo_url = '/logos/clubs/mighty-gunners-fc.png', updated_at = now()
WHERE slug = 'mighty-gunners-fc' AND (logo_url IS NULL OR logo_url = '');

UPDATE sportsplatform_clubs SET logo_url = '/logos/clubs/okahandja-united-fc.png', updated_at = now()
WHERE slug = 'okahandja-united-fc' AND (logo_url IS NULL OR logo_url = '');

UPDATE sportsplatform_clubs SET logo_url = '/logos/clubs/orlando-pirates-windhoek.png', updated_at = now()
WHERE slug = 'orlando-pirates-windhoek' AND (logo_url IS NULL OR logo_url = '');

UPDATE sportsplatform_clubs SET logo_url = '/logos/clubs/rundu-chiefs-fc.png', updated_at = now()
WHERE slug = 'rundu-chiefs-fc' AND (logo_url IS NULL OR logo_url = '');

UPDATE sportsplatform_clubs SET logo_url = '/logos/clubs/tigers-fc.png', updated_at = now()
WHERE slug = 'tigers-fc' AND (logo_url IS NULL OR logo_url = '');

UPDATE sportsplatform_clubs SET logo_url = '/logos/clubs/tura-magic-fc.png', updated_at = now()
WHERE slug = 'tura-magic-fc' AND (logo_url IS NULL OR logo_url = '');

UPDATE sportsplatform_clubs SET logo_url = '/logos/clubs/unam-fc.png', updated_at = now()
WHERE slug = 'unam-fc' AND (logo_url IS NULL OR logo_url = '');

UPDATE sportsplatform_clubs SET logo_url = '/logos/clubs/young-african-fc.png', updated_at = now()
WHERE slug = 'young-african-fc' AND (logo_url IS NULL OR logo_url = '');

-- No verified crest found — sport-correct fallback
UPDATE sportsplatform_clubs SET logo_url = '/sports/football.jpg', updated_at = now()
WHERE slug = 'king-kauluma-palace-fc' AND (logo_url IS NULL OR logo_url = '');

-- ===== NRU / Cricket / Hockey — Wanderers multi-sport crest =====
UPDATE sportsplatform_clubs SET logo_url = '/logos/clubs/wanderers-sports-club.png', updated_at = now()
WHERE slug IN ('wanderers-rugby', 'wanderers-cricket', 'wanderers-hockey')
  AND (logo_url IS NULL OR logo_url = '');

UPDATE sportsplatform_clubs SET logo_url = '/sports/rugby.jpg', updated_at = now()
WHERE slug IN (
  'united-rugby', 'reho-falcon-rugby', 'coastal-rugby',
  'western-suburbs-rugby', 'rehoboth-rugby-club', 'rundu-rugby-club'
) AND (logo_url IS NULL OR logo_url = '');

UPDATE sportsplatform_clubs SET logo_url = '/logos/clubs/dts-hockey.png', updated_at = now()
WHERE slug = 'dts-hockey' AND (logo_url IS NULL OR logo_url = '');

UPDATE sportsplatform_clubs SET logo_url = '/logos/cricket-logo.png', updated_at = now()
WHERE slug = 'namibia-cricket-academy' AND (logo_url IS NULL OR logo_url = '');

UPDATE sportsplatform_clubs SET logo_url = '/sports/cricket.jpg', updated_at = now()
WHERE slug IN ('united-cricket', 'swakopmund-cricket', 'old-boys-cricket', 'dolphins-cricket-club')
  AND (logo_url IS NULL OR logo_url = '');

-- ===== Golf / Dome basketball =====
UPDATE sportsplatform_clubs SET logo_url = '/logos/clubs/windhoek-golf.png', updated_at = now()
WHERE slug = 'windhoek-golf' AND (logo_url IS NULL OR logo_url = '');

UPDATE sportsplatform_clubs SET logo_url = '/logos/clubs/rossmund-golf.jpg', updated_at = now()
WHERE slug = 'rossmund-golf' AND (logo_url IS NULL OR logo_url = '');

UPDATE sportsplatform_clubs SET logo_url = '/logos/clubs/the-dome.jpg', updated_at = now()
WHERE slug = 'dome-basketball' AND (logo_url IS NULL OR logo_url = '');

UPDATE sportsplatform_clubs SET logo_url = '/sports/basketball.jpg', updated_at = now()
WHERE slug IN ('abc-basketball', 'cougars-basketball')
  AND (logo_url IS NULL OR logo_url = '');

-- ===== Remaining federations — sport-correct paths =====
UPDATE sportsplatform_clubs SET logo_url = '/sports/athletics.jpg', updated_at = now()
WHERE slug IN ('unam-athletics', 'windhoek-athletics', 'coastal-athletics')
  AND (logo_url IS NULL OR logo_url = '');

UPDATE sportsplatform_clubs SET logo_url = '/sports/netball.jpg', updated_at = now()
WHERE slug IN ('queens-netball', 'ndf-netball', 'uukumwe-netball-club', 'swakopmund-netball-club')
  AND (logo_url IS NULL OR logo_url = '');

UPDATE sportsplatform_clubs SET logo_url = '/sports/volleyball.jpg', updated_at = now()
WHERE slug IN (
  'windhoek-volleyball-club', 'coastal-volleyball-club',
  'unam-volleyball-club', 'swakopmund-volleyball-club'
) AND (logo_url IS NULL OR logo_url = '');

UPDATE sportsplatform_clubs SET logo_url = '/sports/swimming.jpg', updated_at = now()
WHERE slug IN ('windhoek-aquatic-club', 'coastal-aquatic-club', 'ndf-aquatic-club')
  AND (logo_url IS NULL OR logo_url = '');

UPDATE sportsplatform_clubs SET logo_url = '/sports/cycling.jpg', updated_at = now()
WHERE slug IN ('namibia-desert-riders', 'coastal-cyclists')
  AND (logo_url IS NULL OR logo_url = '');

UPDATE sportsplatform_clubs SET logo_url = '/sports/badminton.jpg', updated_at = now()
WHERE slug IN ('windhoek-badminton-club', 'swakopmund-badminton-club')
  AND (logo_url IS NULL OR logo_url = '');

UPDATE sportsplatform_clubs SET logo_url = '/sports/judo.jpg', updated_at = now()
WHERE slug IN ('windhoek-judo-club', 'swakopmund-judo-club')
  AND (logo_url IS NULL OR logo_url = '');

UPDATE sportsplatform_clubs SET logo_url = '/sports/karate.jpg', updated_at = now()
WHERE slug = 'windhoek-karate-club' AND (logo_url IS NULL OR logo_url = '');

UPDATE sportsplatform_clubs SET logo_url = '/sports/table-tennis.jpg', updated_at = now()
WHERE slug = 'windhoek-tt-club' AND (logo_url IS NULL OR logo_url = '');

UPDATE sportsplatform_clubs SET logo_url = '/sports/tennis.jpg', updated_at = now()
WHERE slug IN ('windhoek-tennis', 'swakopmund-tennis')
  AND (logo_url IS NULL OR logo_url = '');

-- ===== Verified contacts only (never fabricate) =====

-- Wanderers Sports Club (rugby / cricket / hockey sections)
-- Phone + address: cricket.wanderers.org.na/contact-us + whatsonnamibia / goafricaonline
UPDATE sportsplatform_clubs SET
  website = 'https://cricket.wanderers.org.na/',
  contact_phone = '+264 61 242069',
  address = 'Tunchel Street, Pionierspark, Windhoek',
  updated_at = now()
WHERE slug = 'wanderers-cricket'
  AND (website IS NULL OR website = '');

UPDATE sportsplatform_clubs SET
  website = 'https://www.wanderers.org.na/',
  contact_phone = '+264 61 242069',
  address = 'Tunchel Street, Pionierspark, Windhoek',
  updated_at = now()
WHERE slug IN ('wanderers-rugby', 'wanderers-hockey')
  AND (website IS NULL OR website = '');

-- DTS Hockey — https://www.dts.org.na/info-contact
UPDATE sportsplatform_clubs SET
  website = 'https://www.dts.org.na/',
  contact_email = 'dts@iway.na',
  contact_phone = '+264 61 251 699',
  address = 'Sean McBride & Tennis Street, Olympia, Windhoek',
  updated_at = now()
WHERE slug = 'dts-hockey'
  AND (website IS NULL OR website = '');

-- Rössmund Golf — https://www.rossmund.com/map
UPDATE sportsplatform_clubs SET
  website = 'https://www.rossmund.com/',
  contact_email = 'golf@rossmund.com',
  contact_phone = '+264 64 405644',
  address = 'B2 Road, Farm 160, Swakopmund',
  updated_at = now()
WHERE slug = 'rossmund-golf'
  AND (website IS NULL OR website = '');

-- Windhoek Golf & Country Club — https://wccgolf.com.na/ (pro shop line on maintenance page)
UPDATE sportsplatform_clubs SET
  website = 'https://wccgolf.com.na/',
  contact_phone = '+264 61 258 498',
  updated_at = now()
WHERE slug = 'windhoek-golf'
  AND (website IS NULL OR website = '');

-- The Dome Basketball Club — venue contacts https://www.thedomenamibia.com/dome-contact
UPDATE sportsplatform_clubs SET
  website = 'https://www.thedomenamibia.com/',
  contact_email = 'info@thedomenamibia.com',
  contact_phone = '+264 64 400 301',
  address = '5371 Welwitschia Street, Swakopmund',
  updated_at = now()
WHERE slug = 'dome-basketball'
  AND (website IS NULL OR website = '');

-- Namibia Cricket Academy — Cricket Namibia HQ (academy under CN)
-- https://cricketnamibia.com/contact-us/
UPDATE sportsplatform_clubs SET
  website = 'https://cricketnamibia.com/',
  contact_phone = '+264 83 707 1220',
  address = 'Namibia Cricket Ground, Cricket Street, Olympia, Windhoek',
  updated_at = now()
WHERE slug = 'namibia-cricket-academy'
  AND (website IS NULL OR website = '');
