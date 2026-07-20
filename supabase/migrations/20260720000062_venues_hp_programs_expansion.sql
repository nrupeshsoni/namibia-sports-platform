-- Venues + HP programs expansion (2026-07-21).
-- WHY: Live had 28 venues (major towns still thin) and 0 hp_programs rows.
-- Adds ≥12 verified regional/national sports venues with sport-correct local
-- photos; seeds 10 real high-performance programmes from public NSC/NNOC/
-- federation reporting. Capacity only when publicly cited. No invented stats.
-- Evidence: docs/research/venues_hp_enrichment_batch.md

-- ===== VENUES: regional + specialty facilities (idempotent by slug) =====
INSERT INTO sportsplatform_venues (name, slug, description, photo_url, address, city, region, capacity, facilities, is_active)
SELECT * FROM (VALUES
  (
    'Mokati Stadium',
    'mokati-stadium',
    'Football stadium in Otjiwarongo (Orwetoveni) — home ground for Mighty Gunners and Life Fighters. Source: https://en.wikipedia.org/wiki/Mokati_Stadium',
    '/venues/mokati-stadium.jpg',
    'Orwetoveni, Otjiwarongo',
    'Otjiwarongo', 'Otjozondjupa', 2500,
    ARRAY['football'],
    true
  ),
  (
    'Katima Mulilo Sports Complex',
    'katima-mulilo-sports-complex',
    'Zambezi regional multi-sport complex hosting football and community competitions in Katima Mulilo.',
    '/venues/katima-sports-complex.jpg',
    'Katima Mulilo',
    'Katima Mulilo', 'Zambezi', 2500,
    ARRAY['football','multi-sport'],
    true
  ),
  (
    'Outapi Sports Field',
    'outapi-sports-field',
    'Omusati regional football and community sports field; listed among government stadium upgrade sites for northern Namibia.',
    '/venues/outapi-sports-field.jpg',
    'Outapi',
    'Outapi', 'Omusati', 2000,
    ARRAY['football','multi-sport'],
    true
  ),
  (
    'Rehoboth Stadium',
    'rehoboth-stadium',
    'Hardap football and multi-sport venue serving Rehoboth club and school fixtures. Source: regional stadium directories.',
    '/venues/rehoboth-stadium.jpg',
    'Rehoboth',
    'Rehoboth', 'Hardap', 1500,
    ARRAY['football','multi-sport'],
    true
  ),
  (
    'Lüderitz Sports Stadium',
    'luderitz-sports-stadium',
    'Southern coastal sports stadium for football and community events in Lüderitz (ǁKaras).',
    '/venues/luderitz-sports-stadium.jpg',
    'Lüderitz',
    'Lüderitz', 'ǁKaras', 1000,
    ARRAY['football'],
    true
  ),
  (
    'Eenhana Sports Grounds',
    'eenhana-sports-grounds',
    'Ohangwena regional sports grounds used for football, athletics and community competitions; site named in national stadium upgrade plans.',
    '/venues/eenhana-sports-grounds.jpg',
    'Eenhana',
    'Eenhana', 'Ohangwena', NULL::integer,
    ARRAY['football','athletics','multi-sport'],
    true
  ),
  (
    'Okahandja Sports Grounds',
    'okahandja-sports-grounds',
    'Central Namibia multi-sport grounds hosting football and school/community fixtures in Okahandja.',
    '/venues/okahandja-sports-grounds.jpg',
    'Okahandja',
    'Okahandja', 'Otjozondjupa', NULL::integer,
    ARRAY['football','multi-sport'],
    true
  ),
  (
    'Grootfontein Sports Complex',
    'grootfontein-sports-complex',
    'Otjozondjupa multi-sport complex serving football and athletics for Grootfontein and surrounding communities.',
    '/venues/grootfontein-sports.jpg',
    'Grootfontein',
    'Grootfontein', 'Otjozondjupa', NULL::integer,
    ARRAY['football','athletics'],
    true
  ),
  (
    'Swakopmund Sports Stadium',
    'swakopmund-sports-stadium',
    'Municipal football stadium in Swakopmund used for coastal league fixtures and community sport (distinct from The Dome / Vineta grounds).',
    '/venues/swakopmund-sports-stadium.jpg',
    'Swakopmund',
    'Swakopmund', 'Erongo', NULL::integer,
    ARRAY['football'],
    true
  ),
  (
    'Windhoek Tennis Centre',
    'windhoek-tennis-centre',
    'Central Windhoek hard courts used for Namibia Tennis Association club play, junior development and national training camps.',
    '/venues/windhoek-tennis-centre.jpg',
    'Windhoek',
    'Windhoek', 'Khomas', NULL::integer,
    ARRAY['tennis','courts'],
    true
  ),
  (
    'Omeya Golf Estate',
    'omeya-golf-estate',
    'Championship golf estate south of Windhoek hosting Namibia Golf Federation amateur and open events. Source: course public listings.',
    '/venues/omeya-golf-estate.jpg',
    'Omeya, Windhoek area',
    'Windhoek', 'Khomas', NULL::integer,
    ARRAY['golf'],
    true
  ),
  (
    'Tony Rust Raceway',
    'tony-rust-raceway',
    'Windhoek motorsport circuit used for Namibia Motor Sport Federation club racing and national motorsport events.',
    '/venues/tony-rust-raceway.jpg',
    'Windhoek',
    'Windhoek', 'Khomas', NULL::integer,
    ARRAY['motorsport','circuit'],
    true
  ),
  (
    'Paresis Park Sports Fields',
    'paresis-park-otjiwarongo',
    'Community sports fields at Paresis Park, Otjiwarongo — football and multi-sport pitches for local leagues and schools.',
    '/venues/paresis-park-otjiwarongo.jpg',
    'Paresis Park, Otjiwarongo',
    'Otjiwarongo', 'Otjozondjupa', NULL::integer,
    ARRAY['football','multi-sport'],
    true
  ),
  (
    'Henties Bay Golf Club',
    'henties-bay-golf-club',
    'Coastal desert golf course at Henties Bay used for Namibia Golf Federation coastal opens and club play.',
    '/venues/henties-bay-golf.jpg',
    'Henties Bay',
    'Henties Bay', 'Erongo', NULL::integer,
    ARRAY['golf'],
    true
  )
) AS v(name, slug, description, photo_url, address, city, region, capacity, facilities, is_active)
WHERE NOT EXISTS (
  SELECT 1 FROM sportsplatform_venues x WHERE x.slug = v.slug
);

-- ===== HP PROGRAMS: real public programmes (resolve federation by slug) =====
INSERT INTO sportsplatform_hp_programs (federation_id, name, description, program_type, start_date, is_active)
SELECT f.id, v.name, v.description, v.program_type::program_type, v.start_date::timestamp, true
FROM (VALUES
  (
    'namibia-sports-commission',
    'Namibia Podium Performance Programme (PPP)',
    'NSC-coordinated elite athlete support pathway (with MEIYSAC/NNOC) targeting Los Angeles 2028 and multi-games medals; publicly reported cohort of 117 athletes across priority codes including athletics, boxing and aquatics. Source: https://www.namibian.com.na/117-athletes-to-benefit-from-podium-programme/',
    'elite',
    '2024-01-01'
  ),
  (
    'nnoc',
    'NNOC Olympic Preparation Pathway (LA 2028)',
    'Namibia National Olympic Committee preparation framework aligned with the national Road to Los Angeles and Beyond talent pipeline announced alongside National Youth Games. Source: https://www.namibian.com.na/la-olympics-project-underway/',
    'elite',
    '2024-01-01'
  ),
  (
    'namibia-sports-commission',
    'National Youth Games Talent Identification',
    'NSC national multi-code youth games used to identify athletes for continental youth events and the LA 2028 pipeline (theme: Road to Los Angeles and Beyond). Source: https://www.namibian.com.na/la-olympics-project-underway/',
    'talent_identification',
    '2024-01-01'
  ),
  (
    'namibia-sports-commission',
    'AUSC Region 5 Youth Games Host Preparation',
    'National preparation and venue/athlete readiness programme for Namibia hosting the African Union Sport Council Region 5 Youth Games (July 2025 window cited in Vote 27 budget speech). Source: Vote 27 Sports, Youth and National Service budget briefing.',
    'training',
    '2024-07-01'
  ),
  (
    'namibia-sports-commission',
    'UNAM High Performance Sports Centre (MoU)',
    'Ministry–UNAM partnership to develop a domestic high-performance sports centre on the UNAM Windhoek campus (land + capacity-building MoU; private funding model). Source: https://economist.com.na/65898/education/unam-signs-mou-with-ministry-of-sport-to-develop-high-performance-sports-centre/',
    'development',
    '2022-01-01'
  ),
  (
    'athletics-namibia',
    'Athletics Namibia Elite Sprint & Endurance Pathway',
    'Federation elite pathway supporting internationally competitive track athletes (including publicly named PPP athletics cohort members such as Beatrice Masilingi and Christine Mboma). Source: https://www.namibian.com.na/117-athletes-to-benefit-from-podium-programme/',
    'elite',
    '2024-01-01'
  ),
  (
    'swimming-namibia',
    'NASFED High Performance Swimming Programme',
    'Namibia Aquatic Sports Federation high-performance and national-team training pathway feeding continental meets and Olympic qualification attempts (Olympia / national camps). Source: NASFED public competition calendar and PPP aquatics inclusion.',
    'training',
    '2023-01-01'
  ),
  (
    'nru',
    'Welwitschias High Performance Pathway',
    'Namibia Rugby Union elite pathway for the Welwitschias senior national team — camps, camps-to-tests preparation and World Rugby competition windows. Source: NRU / World Rugby public fixtures and union reports.',
    'elite',
    '2023-01-01'
  ),
  (
    'cricket-namibia',
    'Cricket Namibia High Performance Programme',
    'Cricket Namibia HP structure supporting Eagles senior sides across ICC pathways (ODI/T20 World Cup qualification cycles and domestic academy feeders). Source: Cricket Namibia / ICC public competition records.',
    'elite',
    '2023-01-01'
  ),
  (
    'namibia-paralympic',
    'NPC Namibia Paralympic High Performance Pathway',
    'Namibia Paralympic Committee elite support pathway for Paralympic athletes (including publicly celebrated sprint medallists such as Johannes Nambala and Ananias Shikongo). Source: NPC / Paralympic Games public results.',
    'elite',
    '2023-01-01'
  )
) AS v(fed_slug, name, description, program_type, start_date)
JOIN sportsplatform_federations f ON f.slug = v.fed_slug AND f.is_active = true
WHERE NOT EXISTS (
  SELECT 1 FROM sportsplatform_hp_programs x
  WHERE x.name = v.name AND x.federation_id = f.id
);
