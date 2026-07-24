-- Federation photo/logo coverage pass (2026-07-24)
-- WHY: Active federations already had 83/83 sport-relevant heroes, but 30 logos
-- were null (initials fallback). Policy allows tasteful sport-relevant marks when
-- no verified official crest exists — do NOT invent trademark-like crests.
-- Soft-merged inactive aquatics/weightlifting stubs are out of scope.
-- Applied live via Supabase SQL; this file is the ledger copy.

-- Sport-relevant generic marks for previously null logos
UPDATE sportsplatform_federations SET logo = '/logos/marks/badminton.svg', updated_at = now()
WHERE slug = 'badminton-namibia' AND (logo IS NULL OR TRIM(logo) = '');

UPDATE sportsplatform_federations SET logo = '/logos/marks/baseball.svg', updated_at = now()
WHERE slug = 'baseball-namibia' AND (logo IS NULL OR TRIM(logo) = '');

UPDATE sportsplatform_federations SET logo = '/logos/marks/billiards.svg', updated_at = now()
WHERE slug = 'billiards-snooker-namibia' AND (logo IS NULL OR TRIM(logo) = '');

UPDATE sportsplatform_federations SET logo = '/logos/marks/bodybuilding.svg', updated_at = now()
WHERE slug = 'bodybuilding-namibia' AND (logo IS NULL OR TRIM(logo) = '');

-- Verified crests (NNOC affiliated-members assets; also under client/public/logos/)
UPDATE sportsplatform_federations SET logo = '/logos/Dance_Sport_Namibia_logo.jpg', updated_at = now()
WHERE slug = 'dance-sport-namibia'
  AND (logo IS NULL OR TRIM(logo) = '' OR logo = '/logos/marks/dance-sport.svg');

UPDATE sportsplatform_federations SET logo = '/logos/Namibia_Golf_Federation_logo.jpg', updated_at = now()
WHERE slug = 'golf-namibia'
  AND (logo IS NULL OR TRIM(logo) = '' OR logo = '/logos/marks/golf.svg');

UPDATE sportsplatform_federations SET logo = '/logos/marks/indigenous-combat.svg', updated_at = now()
WHERE slug = 'indigenous-combat-sport' AND (logo IS NULL OR TRIM(logo) = '');

UPDATE sportsplatform_federations SET logo = '/logos/marks/karate.svg', updated_at = now()
WHERE slug = 'karate-namibia' AND (logo IS NULL OR TRIM(logo) = '');

UPDATE sportsplatform_federations SET logo = '/logos/marks/lacrosse.svg', updated_at = now()
WHERE slug = 'lacrosse-namibia' AND (logo IS NULL OR TRIM(logo) = '');

UPDATE sportsplatform_federations SET logo = '/logos/marks/footgolf.svg', updated_at = now()
WHERE slug = 'namibia-footgolf' AND (logo IS NULL OR TRIM(logo) = '');

UPDATE sportsplatform_federations SET logo = '/logos/marks/horse-racing.svg', updated_at = now()
WHERE slug = 'namibia-horse-racing' AND (logo IS NULL OR TRIM(logo) = '');

UPDATE sportsplatform_federations SET logo = '/logos/marks/kendo.svg', updated_at = now()
WHERE slug = 'namibia-kendo' AND (logo IS NULL OR TRIM(logo) = '');

UPDATE sportsplatform_federations SET logo = '/logos/marks/korfball.svg', updated_at = now()
WHERE slug = 'namibia-korfball' AND (logo IS NULL OR TRIM(logo) = '');

UPDATE sportsplatform_federations SET logo = '/logos/marks/modern-pentathlon.svg', updated_at = now()
WHERE slug = 'namibia-modern-pentathlon' AND (logo IS NULL OR TRIM(logo) = '');

UPDATE sportsplatform_federations SET logo = '/logos/marks/muaythai.svg', updated_at = now()
WHERE slug = 'namibia-muaythai' AND (logo IS NULL OR TRIM(logo) = '');

UPDATE sportsplatform_federations SET logo = '/logos/marks/nnssu.svg', updated_at = now()
WHERE slug = 'nnssu' AND (logo IS NULL OR TRIM(logo) = '');

UPDATE sportsplatform_federations SET logo = '/logos/marks/orienteering.svg', updated_at = now()
WHERE slug = 'namibia-orienteering' AND (logo IS NULL OR TRIM(logo) = '');

UPDATE sportsplatform_federations SET logo = '/logos/marks/powerlifting.svg', updated_at = now()
WHERE slug = 'powerlifting-namibia' AND (logo IS NULL OR TRIM(logo) = '');

UPDATE sportsplatform_federations SET logo = '/logos/marks/practical-shooting.svg', updated_at = now()
WHERE slug = 'namibia-practical-shooting' AND (logo IS NULL OR TRIM(logo) = '');

UPDATE sportsplatform_federations SET logo = '/logos/marks/speed-hiking.svg', updated_at = now()
WHERE slug = 'namibia-speed-hiking' AND (logo IS NULL OR TRIM(logo) = '');

UPDATE sportsplatform_federations SET logo = '/logos/marks/teqball.svg', updated_at = now()
WHERE slug = 'namibia-teqball' AND (logo IS NULL OR TRIM(logo) = '');

UPDATE sportsplatform_federations SET logo = '/logos/marks/nufs.svg', updated_at = now()
WHERE slug = 'nufs' AND (logo IS NULL OR TRIM(logo) = '');

UPDATE sportsplatform_federations SET logo = '/logos/marks/waterski.svg', updated_at = now()
WHERE slug = 'namibia-waterski' AND (logo IS NULL OR TRIM(logo) = '');

UPDATE sportsplatform_federations SET logo = '/logos/marks/western-mounted-games.svg', updated_at = now()
WHERE slug = 'namibia-western-mounted-games' AND (logo IS NULL OR TRIM(logo) = '');

UPDATE sportsplatform_federations SET logo = '/logos/marks/petanque.svg', updated_at = now()
WHERE slug = 'petanque-namibia' AND (logo IS NULL OR TRIM(logo) = '');

UPDATE sportsplatform_federations SET logo = '/logos/marks/softball.svg', updated_at = now()
WHERE slug = 'softball-namibia' AND (logo IS NULL OR TRIM(logo) = '');

UPDATE sportsplatform_federations SET logo = '/logos/marks/surfing.svg', updated_at = now()
WHERE slug = 'surfing-namibia' AND (logo IS NULL OR TRIM(logo) = '');

UPDATE sportsplatform_federations SET logo = '/logos/marks/taekwondo.svg', updated_at = now()
WHERE slug = 'taekwondo-namibia' AND (logo IS NULL OR TRIM(logo) = '');

UPDATE sportsplatform_federations SET logo = '/logos/marks/tisan.svg', updated_at = now()
WHERE slug = 'tisan' AND (logo IS NULL OR TRIM(logo) = '');

UPDATE sportsplatform_federations SET logo = '/logos/marks/ultimate-frisbee.svg', updated_at = now()
WHERE slug = 'ultimate-frisbee-namibia' AND (logo IS NULL OR TRIM(logo) = '');

-- Improve TISAN hero relevance (was generic fitness-aerobics)
UPDATE sportsplatform_federations
SET background_image = '/sports/african-traditional-wrestling.jpg', updated_at = now()
WHERE slug = 'tisan'
  AND (background_image IS NULL OR background_image = '/sports/fitness-aerobics.jpg');
