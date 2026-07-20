-- Populate the 20 federations added in 20260720000001 + enrich websites/logos.
-- Sources: NSC UPDATEDFEDERATIONCONTACTDETAILS25FEBRUARY2025.pdf
--          (docs/research/federation-contacts-extracted.md),
--          docs/research/federations_with_websites.txt,
--          docs/research/namibia-federation-contacts.json
-- WHY: After reconcile, ids 90–109 had name/slug/abbr only. Production needs
-- descriptions + verified contacts. Do not invent contacts — Footgolf,
-- Western Mounted Games, and Padel have descriptions only (not on Feb 2025 NSC list).
-- Applied 2026-07-20.

-- ===== Batch A: 20 newly added federations (ids matched by slug) =====

UPDATE sportsplatform_federations SET
  description = 'National governing body for DanceSport in Namibia, affiliated with the Namibia Sports Commission. Oversees competitive ballroom and Latin dance sport.',
  email = 'dancesportnam@gmail.com',
  phone = '+264 81 668 6881',
  president = 'Edmund Van Neel',
  secretary_general = 'Alta Hill',
  updated_at = now()
WHERE slug = 'dance-sport-namibia';

UPDATE sportsplatform_federations SET
  description = 'National governing body for fistball in Namibia. Promotes the sport and represents Namibia in international fistball competition.',
  email = 'secretary@fistballnamibia.com',
  updated_at = now()
WHERE slug = 'fistball-namibia';

UPDATE sportsplatform_federations SET
  description = 'National association for electronic sports (esports) in Namibia. Develops competitive gaming, tournaments, and athlete pathways under the Namibia Sports Commission.',
  email = 'salome@esportsnamibia.org',
  phone = '+264 81 808 5332',
  president = 'Flip de Bryun',
  secretary_general = 'Salome De Bryun',
  updated_at = now()
WHERE slug = 'namibia-esports';

UPDATE sportsplatform_federations SET
  description = 'National association governing horse racing in Namibia. Coordinates race meetings, licensing, and development of the racing industry.',
  email = 'namibiahorseraicingassociation@gmail.com',
  phone = '+264 71 483 0003',
  president = 'Gottfried Mootu',
  secretary_general = 'John Wellmann',
  updated_at = now()
WHERE slug = 'namibia-horse-racing';

UPDATE sportsplatform_federations SET
  description = 'National association for ice stock sport (Eisstock) in Namibia. Promotes the Bavarian curling-like sport and organises local competition.',
  email = 'detlef.pfeifer@goethe.de',
  president = 'Detlef Pfeifer',
  updated_at = now()
WHERE slug = 'ice-stock-namibia';

UPDATE sportsplatform_federations SET
  description = 'National governing body for ice and inline hockey in Namibia (World Skate member for roller sports). Also the recognised body for related roller disciplines.',
  email = 'secretary@niiha.com',
  phone = '+264 81 124 7603',
  secretary_general = 'Lucille Coetzee',
  website = 'https://niiha.com',
  facebook = 'https://www.facebook.com/NamibiaIceandInlineHockeyAssociation/',
  instagram = 'https://www.instagram.com/official_namibian_inlinehockey/',
  logo = NULL,
  updated_at = now()
WHERE slug = 'namibia-ice-inline-hockey';

UPDATE sportsplatform_federations SET
  description = 'National federation for jukskei, a traditional South African throwing sport popular in Namibia. Organises leagues and national championships.',
  email = 'pro@jukskei-nam.com',
  phone = '+264 81 122 2743',
  president = 'Erick Straus',
  updated_at = now()
WHERE slug = 'namibia-jukskei';

UPDATE sportsplatform_federations SET
  description = 'National association for kendo (Japanese fencing) in Namibia. Develops practitioners and represents Namibia in regional kendo events.',
  email = 'pineuest@africaonline.com.na',
  phone = '+264 81 127 8899',
  president = 'Andre Pienaar',
  updated_at = now()
WHERE slug = 'namibia-kendo';

UPDATE sportsplatform_federations SET
  description = 'National federation for kickboxing in Namibia. Sanctions competitions and athlete development under the martial arts umbrella.',
  email = 'ankia.rentzke26@gmail.com',
  phone = '+264 81 148 1322',
  president = 'Anita De Klerk',
  secretary_general = 'Ankia Rentzke',
  updated_at = now()
WHERE slug = 'namibia-kickboxing';

UPDATE sportsplatform_federations SET
  description = 'National association for IPSC practical shooting in Namibia. Governs competitive practical shooting and safety standards.',
  email = 'napsa.chairman@gmail.com',
  phone = '+264 81 272 3009',
  president = 'Gustaf Bauer',
  updated_at = now()
WHERE slug = 'namibia-practical-shooting';

UPDATE sportsplatform_federations SET
  description = 'National association promoting speed hiking and trail endurance events in Namibia. Coordinates competitive hiking calendars and athlete development.',
  email = 'namibianhikers@gmail.com',
  phone = '+264 81 714 7555',
  president = 'Eino J I Mbango',
  secretary_general = 'Mercia Diana Goliath',
  updated_at = now()
WHERE slug = 'namibia-speed-hiking';

UPDATE sportsplatform_federations SET
  description = 'National association for waterski and related tow-sports in Namibia. Organises competitions and coaching pathways.',
  email = 'namwaterski@gmail.com',
  phone = '+264 81 170 1644',
  secretary_general = 'Gesche Hannam',
  updated_at = now()
WHERE slug = 'namibia-waterski';

UPDATE sportsplatform_federations SET
  description = 'National federation for teqball in Namibia (FITEQ-aligned). Develops the football-table hybrid sport and national representation.',
  email = 'ramahmumba@yahoo.com',
  phone = '+264 81 128 4638',
  president = 'Ramah Mumba',
  updated_at = now()
WHERE slug = 'namibia-teqball';

UPDATE sportsplatform_federations SET
  description = 'Federation promoting indigenous combat sports and cultural martial traditions in Namibia under NSC recognition.',
  email = 'icsfnam@gmail.com',
  phone = '+264 85 127 9065',
  president = 'Hidipo Nangolo',
  updated_at = now()
WHERE slug = 'indigenous-combat-sport';

UPDATE sportsplatform_federations SET
  description = 'National body for full-contact martial arts disciplines in Namibia. Coordinates competitions and safety standards for contact arts.',
  email = 'getfitdivine@gmail.com',
  phone = '+264 81 706 8305',
  president = 'Simba Mangaba',
  website = 'https://namibia-martial-arts.com',
  updated_at = now()
WHERE slug = 'namibia-full-contact-martial-arts';

UPDATE sportsplatform_federations SET
  description = 'National federation for Muay Thai in Namibia. Develops athletes, coaches, and competitive pathways for Thai boxing.',
  email = 'namibianmuaythaifederation@gmail.com',
  president = 'Sheila Martins',
  updated_at = now()
WHERE slug = 'namibia-muaythai';

UPDATE sportsplatform_federations SET
  description = 'National body for mixed martial arts (MMA) in Namibia. Promotes amateur MMA development and sanctioned events.',
  email = 'mixedmartialartsnamibia@gmail.com',
  president = 'Natascha De Sousa',
  updated_at = now()
WHERE slug = 'mixed-martial-arts-namibia';

-- Footgolf / Western Mounted Games / Padel: on official 2026 NSC list but
-- not in Feb 2025 contact PDF — descriptions only, no fabricated contacts.
UPDATE sportsplatform_federations SET
  description = 'National federation for footgolf in Namibia — a hybrid of football and golf recognised by the Namibia Sports Commission.',
  updated_at = now()
WHERE slug = 'namibia-footgolf';

UPDATE sportsplatform_federations SET
  description = 'National federation for Western mounted games in Namibia. Governs Western riding games competition and development.',
  updated_at = now()
WHERE slug = 'namibia-western-mounted-games';

UPDATE sportsplatform_federations SET
  description = 'National federation for padel tennis in Namibia. Promotes padel courts, clubs, and competitive play nationwide.',
  updated_at = now()
WHERE slug = 'namibia-padel-tennis';

-- ===== Batch B: verified website enrichment (existing rows with null website) =====

UPDATE sportsplatform_federations SET website = 'https://nawisa.org/', updated_at = now()
WHERE slug = 'nawisa' AND (website IS NULL OR website = '');

UPDATE sportsplatform_federations SET website = 'https://namibia-martial-arts.com/', updated_at = now()
WHERE slug = 'namibia-martial-arts' AND (website IS NULL OR website = '');

UPDATE sportsplatform_federations SET website = 'https://www.namef.org.na/', updated_at = now()
WHERE slug = 'equestrian-namibia' AND (website IS NULL OR website = '');

UPDATE sportsplatform_federations SET website = 'https://www.motorsportnamibia.org/', updated_at = now()
WHERE slug = 'motorsport-namibia' AND (website IS NULL OR website = '');

UPDATE sportsplatform_federations SET website = 'https://namibiadarts.com/', updated_at = now()
WHERE slug = 'namibia-darts' AND (website IS NULL OR website = '');

UPDATE sportsplatform_federations SET website = 'https://sites.google.com/site/bowlsnamibia/', updated_at = now()
WHERE slug = 'bowls-namibia' AND (website IS NULL OR website = '');

UPDATE sportsplatform_federations SET website = 'https://swimmingnamibia.com/', updated_at = now()
WHERE slug = 'namibia-aquatics' AND (website IS NULL OR website = '');

UPDATE sportsplatform_federations SET
  website = 'https://www.futsal-namibia.com/',
  email = 'info@nfa.org.na',
  phone = '+264 61 265 691',
  facebook = 'https://www.facebook.com/futsalnamibia',
  description = COALESCE(NULLIF(description, ''), 'Futsal in Namibia is administered under the Namibia Football Association (NFA).'),
  updated_at = now()
WHERE slug = 'namibia-futsal';

UPDATE sportsplatform_federations SET
  website = 'https://www.namibiavolleyball.org/',
  email = 'ceo@namibiavolleyball.org',
  phone = '+264 81 607 0674',
  facebook = 'https://www.facebook.com/namibiavolleyballfederation',
  description = COALESCE(NULLIF(description, ''), 'Beach volleyball in Namibia is governed by the Namibia Volleyball Federation (NVF).'),
  updated_at = now()
WHERE slug = 'namibia-beach-volleyball';

-- ===== Batch C: clear clearly fabricated placeholder emails =====
-- Pattern info@{sport}namibia.org not present on NSC Feb 2025 contact list.

UPDATE sportsplatform_federations SET email = NULL, updated_at = now()
WHERE email IN (
  'info@softballnamibia.org',
  'info@baseballnamibia.org',
  'info@ultimatenamibia.org',
  'info@lacrossenamibia.org',
  'info@petanquenamibia.org',
  'info@korfballnamibia.org',
  'info@orienteeringnamibia.org',
  'info@futsalnamibia.org',
  'info@beachvolleyballnamibia.org',
  'info@surfingnamibia.org',
  'info@bodybuildingnamibia.org',
  'info@billiardsnamibia.org',
  'info@handballnamibia.org'
);

-- ===== Batch D: interim sport imagery where named /sports/* assets exist =====
-- NOTE: client/public/logos/ is missing from the repo (docs claim ~44 files);
-- sportsplatform_logos Storage bucket is empty (0 objects). Existing /logos/*
-- DB paths currently 404. Prefer working /sports/* interim images for majors.
-- Restore official logos to client/public/logos/ or upload to
-- sportsplatform_logos and update logo URLs accordingly.

UPDATE sportsplatform_federations SET logo = '/sports/namibia-football.jpg', updated_at = now()
WHERE slug = 'nfa';

UPDATE sportsplatform_federations SET logo = '/sports/namibia-rugby.jpg', updated_at = now()
WHERE slug = 'nru';

UPDATE sportsplatform_federations SET logo = '/sports/namibia-cricket.jpg', updated_at = now()
WHERE slug = 'cricket-namibia';

UPDATE sportsplatform_federations SET logo = '/sports/namibia-hockey.jpg', updated_at = now()
WHERE slug = 'nhu';

UPDATE sportsplatform_federations SET logo = '/sports/namibia-swimming.jpg', updated_at = now()
WHERE slug IN ('swimming-namibia', 'namibia-aquatics');

UPDATE sportsplatform_federations SET logo = '/sports/namibia-basketball.jpg', updated_at = now()
WHERE slug = 'namibia-basketball';

UPDATE sportsplatform_federations SET logo = '/sports/namibia-boxing.jpg', updated_at = now()
WHERE slug = 'namibia-boxing';
