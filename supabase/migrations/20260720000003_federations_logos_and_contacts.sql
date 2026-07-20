-- Restore federation logo paths to files now in client/public/logos/
-- (downloaded from official federation website URLs, 2026-07-20).
-- Null broken /logos/* and missing /sports/* paths so UI shows initials.
-- Add verified contacts only (NSC extract, research CSV, New Era for padel).
-- WHY: Git never contained client/public/logos/; Storage bucket empty;
-- several interim /sports/* paths also 404.

-- ===== Logo restores (files present in client/public/logos/) =====

UPDATE sportsplatform_federations SET logo = '/logos/Namibia_National_Olympic_Committee_logo.png', updated_at = now()
WHERE slug = 'nnoc';

UPDATE sportsplatform_federations SET logo = '/logos/Namibia_Football_Association_logo.png', updated_at = now()
WHERE slug = 'nfa';

UPDATE sportsplatform_federations SET logo = '/logos/Netball_Namibia_logo.png', updated_at = now()
WHERE slug = 'namibia-netball';

UPDATE sportsplatform_federations SET logo = '/logos/cricket-logo.png', updated_at = now()
WHERE slug = 'cricket-namibia';

UPDATE sportsplatform_federations SET logo = '/logos/Namibia_Hockey_Union_logo.png', updated_at = now()
WHERE slug = 'nhu';

UPDATE sportsplatform_federations SET logo = '/logos/Namibia_Aquatic_Sports_Federation_logo.webp', updated_at = now()
WHERE slug IN ('swimming-namibia', 'namibia-aquatics');

UPDATE sportsplatform_federations SET logo = '/logos/Namibia_Cycling_Federation_logo.svg', updated_at = now()
WHERE slug = 'namibia-cycling';

UPDATE sportsplatform_federations SET logo = '/logos/Namibian_Squash_Association_logo.png', updated_at = now()
WHERE slug = 'squash-namibia';

UPDATE sportsplatform_federations SET logo = '/logos/Namibia_Gymnastics_Federation_logo.png', updated_at = now()
WHERE slug = 'namibia-gymnastics';

UPDATE sportsplatform_federations SET logo = '/logos/Namibia_Triathlon_Federation_logo.png', updated_at = now()
WHERE slug = 'triathlon-namibia';

UPDATE sportsplatform_federations SET logo = '/logos/Namibian_Equestrian_Federation_logo.png', updated_at = now()
WHERE slug = 'equestrian-namibia';

UPDATE sportsplatform_federations SET logo = '/logos/Namibia_Motor_Sport_Federation_logo.jpg', updated_at = now()
WHERE slug = 'motorsport-namibia';

UPDATE sportsplatform_federations SET logo = '/logos/Namibia_Darts_Federation_logo.png', updated_at = now()
WHERE slug = 'namibia-darts';

UPDATE sportsplatform_federations SET logo = '/logos/NFFA_logo.png', updated_at = now()
WHERE slug = 'angling-namibia';

UPDATE sportsplatform_federations SET logo = '/logos/Namibia_Ice_and_Inline_Hockey_Association_logo.jpg', updated_at = now()
WHERE slug = 'namibia-ice-inline-hockey';

UPDATE sportsplatform_federations SET logo = '/logos/Martial_Arts_Namibia_logo.png', updated_at = now()
WHERE slug IN ('namibia-martial-arts', 'namibia-full-contact-martial-arts');

UPDATE sportsplatform_federations SET logo = '/logos/Namibia_Women_In_Sports_Association_logo.png', updated_at = now()
WHERE slug = 'nawisa';

-- Mountain Club Namibia logo from mcnam.org (shared climbing/mountaineering body)
UPDATE sportsplatform_federations SET logo = '/logos/Namibia_Climbing_Federation_logo.png', updated_at = now()
WHERE slug IN ('namibia-climbing', 'namibia-mountaineering');

UPDATE sportsplatform_federations SET logo = '/logos/athletics-logo.png', updated_at = now()
WHERE slug = 'athletics-namibia';

-- Keep working sport photos only where file exists under client/public/sports/
UPDATE sportsplatform_federations SET logo = '/sports/namibia-rugby.jpg', updated_at = now()
WHERE slug = 'nru';

UPDATE sportsplatform_federations SET logo = '/sports/namibia-basketball.jpg', updated_at = now()
WHERE slug = 'namibia-basketball';

UPDATE sportsplatform_federations SET logo = '/sports/namibia-boxing.jpg', updated_at = now()
WHERE slug = 'namibia-boxing';

-- ===== Null broken paths (404) =====

UPDATE sportsplatform_federations SET logo = NULL, updated_at = now()
WHERE logo LIKE '/logos/%'
  AND logo NOT IN (
    '/logos/Namibia_National_Olympic_Committee_logo.png',
    '/logos/Namibia_Football_Association_logo.png',
    '/logos/Netball_Namibia_logo.png',
    '/logos/cricket-logo.png',
    '/logos/Namibia_Hockey_Union_logo.png',
    '/logos/Namibia_Aquatic_Sports_Federation_logo.webp',
    '/logos/Namibia_Cycling_Federation_logo.svg',
    '/logos/Namibian_Squash_Association_logo.png',
    '/logos/Namibia_Gymnastics_Federation_logo.png',
    '/logos/Namibia_Triathlon_Federation_logo.png',
    '/logos/Namibian_Equestrian_Federation_logo.png',
    '/logos/Namibia_Motor_Sport_Federation_logo.jpg',
    '/logos/Namibia_Darts_Federation_logo.png',
    '/logos/NFFA_logo.png',
    '/logos/Namibia_Ice_and_Inline_Hockey_Association_logo.jpg',
    '/logos/Martial_Arts_Namibia_logo.png',
    '/logos/Namibia_Women_In_Sports_Association_logo.png',
    '/logos/Namibia_Climbing_Federation_logo.png',
    '/logos/athletics-logo.png'
  );

-- Missing sport stock images (files not in client/public/sports/)
UPDATE sportsplatform_federations SET logo = NULL, updated_at = now()
WHERE logo IN (
  '/sports/local-authority.jpg',
  '/sports/martial-arts.jpg',
  '/sports/students-sports.jpg',
  '/sports/traditional-sports.jpg',
  '/sports/uniformed-forces.jpg',
  '/sports/women-sports.jpg'
);

-- Volleyball logo URL 404 — clear broken path
UPDATE sportsplatform_federations SET logo = NULL, updated_at = now()
WHERE slug = 'namibia-volleyball' AND (logo LIKE '/logos/%' OR logo IS NULL);

-- ===== Verified contacts (P1) =====

-- Ultimate Frisbee — docs/research/research_namibia_federations.csv (WFDF member NFDF)
UPDATE sportsplatform_federations SET
  email = 'ultimatefrisbeewhk@gmail.com',
  phone = '+264 81 303 0387',
  president = 'Oskar Heita Oskar',
  secretary_general = 'Tawana Mutapati',
  facebook = 'https://www.facebook.com/groups/232710346824509/',
  description = COALESCE(NULLIF(description, ''), 'Namibia Flying Disc Federation (NFDF) — WFDF member governing ultimate frisbee in Namibia.'),
  updated_at = now()
WHERE slug = 'ultimate-frisbee-namibia';

-- Billiards & Snooker — NSC Feb 2025 (Namibia Pool and Billiard Federation contacts)
UPDATE sportsplatform_federations SET
  email = 'louwls@gmail.com',
  phone = '+264 81 333 5422',
  president = 'Cyril Moller',
  secretary_general = 'Mr. Louw',
  updated_at = now()
WHERE slug = 'billiards-snooker-namibia';

-- Handball — Facebook only (docs/research/7_federations_contact_research.md)
UPDATE sportsplatform_federations SET
  facebook = 'https://www.facebook.com/profile.php?id=100066592937124',
  updated_at = now()
WHERE slug = 'namibia-handball';

-- Padel — New Era launch article (leadership only; no public federation email verified)
-- https://neweralive.na/namibia-padel-federation-launched/
UPDATE sportsplatform_federations SET
  president = 'Thomas Nangombe',
  secretary_general = 'Lilly Mwiya',
  description = 'Namibia Padel Federation (NPF) — national governing body for padel tennis in Namibia. Board also includes VP Finance Setson Nghishindimbwa; CEO Dickson Vambe.',
  updated_at = now()
WHERE slug = 'namibia-padel-tennis';

-- Footgolf / Western Mounted Games: no verified public contacts found (2026-07-20).
-- Leave email/phone null. Descriptions already set in prior migration.

-- Clear placeholder leadership values
UPDATE sportsplatform_federations SET president = NULL, updated_at = now() WHERE president = 'TBA';
UPDATE sportsplatform_federations SET secretary_general = NULL, updated_at = now() WHERE secretary_general = 'TBA';
