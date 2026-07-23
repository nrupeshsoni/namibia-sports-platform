-- Hollow federation polish fill — verified athletes/clubs only (2026-07-23).
-- WHY: Karate/Dance/Triathlon/Taekwondo still show empty Athletes tabs despite
-- public national-team / World Triathlon / UFAK / DSN nationals coverage.
-- Crest re-hunt (Golf/Karate/Badminton/PWFN): no new verified crest promoted —
-- FB NKF = flag-wave graphic; FB NamibiaKarate = JKA branch; Golf silhouette;
-- Badminton/PWFN — no federation crest file found.
-- Photos: sport-matched /sports/* only. Idempotent by slug.
-- Evidence: docs/research/hollow_federations_content_fill.md (polish pass).

-- ===== Clubs =====

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url, website, is_active
)
SELECT
  'Okinawa Goju-Ryu Karate Namibia', 'okinawa-goju-ryu-karate-namibia', f.id,
  'Windhoek', 'Khomas', '/sports/karate.jpg',
  'https://www.goju-ryu-karate-namibia.com/', true
FROM sportsplatform_federations f
WHERE f.slug = 'karate-namibia'
  AND NOT EXISTS (
    SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'okinawa-goju-ryu-karate-namibia'
  );

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url, is_active
)
SELECT
  'Codesync', 'codesync-dance', f.id,
  'Windhoek', 'Khomas', '/sports/dance-sport.jpg', true
FROM sportsplatform_federations f
WHERE f.slug = 'dance-sport-namibia'
  AND NOT EXISTS (
    SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = 'codesync-dance'
  );

-- ===== Athletes =====

INSERT INTO sportsplatform_athletes (
  first_name, last_name, slug, gender, photo_url, federation_id, nationality, achievements, is_active
)
SELECT v.first_name, v.last_name, v.slug, v.gender::gender, v.photo_url, f.id, v.nationality, v.achievements, true
FROM (
  VALUES
    -- Karate Namibia — OGKN / UFAK Region South 2026 bronze medallists
    ('Pewee Garth', 'Kavekatora', 'pewee-garth-kavekatora', 'male', '/sports/karate.jpg', 'karate-namibia', 'Namibian',
     'UFAK Region South 2026 bronze (Senior Male Kumite -84kg) + Senior Male Team Kumite bronze for Namibia. Source: https://www.goju-ryu-karate-namibia.com/ogkn-ufak-region-south-2026/'),
    ('Thomas', 'Ndara', 'thomas-ndara', 'male', '/sports/karate.jpg', 'karate-namibia', 'Namibian',
     'UFAK Region South 2026 bronze (Under 21 Male Kumite +84kg). Source: https://www.goju-ryu-karate-namibia.com/ogkn-ufak-region-south-2026/'),
    ('Carli', 'Du Plessis', 'carli-du-plessis', 'female', '/sports/karate.jpg', 'karate-namibia', 'Namibian',
     'UFAK Region South 2026 bronze (Juniors Female Kumite 16–17 Years -48kg). Source: https://www.goju-ryu-karate-namibia.com/ogkn-ufak-region-south-2026/'),
    ('Penda Given', 'Atshipara', 'penda-given-atshipara', 'male', '/sports/karate.jpg', 'karate-namibia', 'Namibian',
     'UFAK Region South 2026 bronze (Cadets Male Kumite 14–15 Years -52kg). Source: https://www.goju-ryu-karate-namibia.com/ogkn-ufak-region-south-2026/'),
    ('Lume', 'Karsten', 'lume-karsten', 'female', '/sports/karate.jpg', 'karate-namibia', 'Namibian',
     'UFAK Region South 2026 bronze (Cadets Female Kumite 14–15 Years -61kg). Source: https://www.goju-ryu-karate-namibia.com/ogkn-ufak-region-south-2026/'),

    -- Dance Sport Namibia — 2025 nationals national-team selections (Republikein)
    ('Yana', 'Oosthuizen', 'yana-oosthuizen', 'female', '/sports/dance-sport.jpg', 'dance-sport-namibia', 'Namibian',
     'DSN national Hip-Hop soloist (2025 nationals). Source: https://www.republikein.com.na/sport-wrap-main/dance-national-champions-crowned2025-11-25178128'),
    ('Nicole', 'Langerman', 'nicole-langerman', 'female', '/sports/dance-sport.jpg', 'dance-sport-namibia', 'Namibian',
     'DSN national Hip-Hop soloist (2025 nationals). Source: https://www.republikein.com.na/sport-wrap-main/dance-national-champions-crowned2025-11-25178128'),
    ('Edmund', 'van Neel', 'edmund-van-neel', 'male', '/sports/dance-sport.jpg', 'dance-sport-namibia', 'Namibian',
     'DSN national Latin selection (2025 nationals); long-time Dance Sport Namibia community figure. Source: https://www.republikein.com.na/sport-wrap-main/dance-national-champions-crowned2025-11-25178128'),
    ('Leona', 'Oosthuizen', 'leona-oosthuizen', 'female', '/sports/dance-sport.jpg', 'dance-sport-namibia', 'Namibian',
     'DSN national Latin selection (2025 nationals). Source: https://www.republikein.com.na/sport-wrap-main/dance-national-champions-crowned2025-11-25178128'),
    ('Nicolas', 'Garrels', 'nicolas-garrels', 'male', '/sports/dance-sport.jpg', 'dance-sport-namibia', 'Namibian',
     'DSN national Latin selection (2025 nationals). Source: https://www.republikein.com.na/sport-wrap-main/dance-national-champions-crowned2025-11-25178128'),
    ('Odile', 'Gertze', 'odile-gertze', 'female', '/sports/dance-sport.jpg', 'dance-sport-namibia', 'Namibian',
     'DSN national Latin selection (2025 nationals). Source: https://www.republikein.com.na/sport-wrap-main/dance-national-champions-crowned2025-11-25178128'),

    -- Triathlon Namibia — World Triathlon NF elite rankings + Africa Junior champs
    ('Nathan Max Centlivres', 'Chase', 'nathan-chase', 'male', '/sports/triathlon.jpg', 'triathlon-namibia', 'Namibian',
     'Africa Junior Triathlon Championships gold (Cairo, 2026); World Triathlon Namibia elite ranking. Source: https://www.namibian.com.na/a-great-day-for-namibian-sport/'),
    ('Maja Jeanne', 'Brinkmann', 'maja-brinkmann', 'female', '/sports/triathlon.jpg', 'triathlon-namibia', 'Namibian',
     'Africa Junior Triathlon Championships gold (Cairo, 2026); World Triathlon Namibia elite #1 women. Source: https://www.namibian.com.na/a-great-day-for-namibian-sport/'),
    ('Maximilian', 'Betts', 'maximilian-betts', 'male', '/sports/triathlon.jpg', 'triathlon-namibia', 'Namibian',
     'World Triathlon Namibia elite men #1 (NF ranked athlete). Source: https://triathlon.org/federations/namibian-triathlon-association'),
    ('Anri', 'Krugel', 'anri-krugel', 'female', '/sports/triathlon.jpg', 'triathlon-namibia', 'Namibian',
     'World Triathlon Namibia elite women ranking. Source: https://triathlon.org/federations/namibian-triathlon-association'),

    -- Taekwondo Namibia — African Open Series Zone 6 bronze
    ('Seth', 'Mabuza', 'seth-mabuza', 'male', '/sports/taekwondo.jpg', 'taekwondo-namibia', 'Namibian',
     'First Namibian podium at African Taekwondo Union Open Series Zone 6 (Maputo, 2025) — bronze. Source: https://neweralive.na/namibia-celebrates-historic-taekwondo-achievement/')
) AS v(first_name, last_name, slug, gender, photo_url, fed_slug, nationality, achievements)
JOIN sportsplatform_federations f ON f.slug = v.fed_slug
WHERE NOT EXISTS (
  SELECT 1 FROM sportsplatform_athletes a WHERE a.slug = v.slug
);

-- Link OGKN UFAK athletes → OGKN club
UPDATE sportsplatform_athletes a
SET club_id = c.id, updated_at = now()
FROM sportsplatform_clubs c
WHERE c.slug = 'okinawa-goju-ryu-karate-namibia'
  AND a.slug IN (
    'pewee-garth-kavekatora', 'thomas-ndara', 'carli-du-plessis',
    'penda-given-atshipara', 'lume-karsten'
  )
  AND a.club_id IS NULL;
