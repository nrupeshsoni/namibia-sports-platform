-- Crest-verified primary/secondary brand colors for federations with logo assets.
-- WHY: Directory / federation chrome needs #RRGGBB pairs; only fill when colors are
-- clearly brand-like from client/public/logos/* crests (not sport photos / collages).
-- Method: visual crest review + saturated-pixel sampling (near-white/black skipped).
-- Skipped (logo present but not a crest palette): athletics (HTML stub file),
-- climbing/mountaineering (landscape photo), nawisa (promo collage).
-- Also: angling abbreviation NFAA → NFFAA to match crest lettering N.F.F.A.A.
-- Does NOT touch logo/email/phone/website/social columns.
-- Target: ≥40/83 active federations with both colors.
-- Applied remotely 2026-07-21 to rbibqjgsnrueubrvyqps.

-- ===== 0. Safe abbreviation polish (crest lettering) =====

UPDATE sportsplatform_federations
SET abbreviation = 'NFFAA', updated_at = now()
WHERE slug = 'angling-namibia' AND abbreviation = 'NFAA';

-- ===== 1. New crest-verified brand colors =====
-- Format: #RRGGBB uppercase. Shared crest files reuse the same pair.

UPDATE sportsplatform_federations SET primary_color = '#17539A', secondary_color = '#B0B0B4', updated_at = now()
WHERE slug = 'angling-namibia'; -- NFFAA hex blue field + silver map/text

UPDATE sportsplatform_federations SET primary_color = '#3B529F', secondary_color = '#D82328', updated_at = now()
WHERE slug = 'archery-namibia'; -- Flag-fill map blue + red stripe

UPDATE sportsplatform_federations SET primary_color = '#1975B8', secondary_color = '#FFFFFF', updated_at = now()
WHERE slug = 'chess-namibia'; -- Solid crest blue + white knight circle/text

UPDATE sportsplatform_federations SET primary_color = '#28235D', secondary_color = '#FFFFFF', updated_at = now()
WHERE slug = 'equestrian-namibia'; -- Navy shield + white horse/text

UPDATE sportsplatform_federations SET primary_color = '#1022AB', secondary_color = '#DA0202', updated_at = now()
WHERE slug = 'fencing-namibia'; -- Map blue + red band (flag palette)

UPDATE sportsplatform_federations SET primary_color = '#D9DC32', secondary_color = '#456DA9', updated_at = now()
WHERE slug = 'ice-stock-namibia'; -- Sun yellow + stone handle blue

UPDATE sportsplatform_federations SET primary_color = '#F00101', secondary_color = '#000000', updated_at = now()
WHERE slug = 'judo-namibia'; -- Red judoka marks + black wordmark

UPDATE sportsplatform_federations SET primary_color = '#CD0E31', secondary_color = '#0B9046', updated_at = now()
WHERE slug = 'motorsport-namibia'; -- Helmet red + wreath base green

UPDATE sportsplatform_federations SET primary_color = '#214A8A', secondary_color = '#CAC23F', updated_at = now()
WHERE slug = 'namibia-basketball'; -- Flag swoosh blue + gold basketball

UPDATE sportsplatform_federations SET primary_color = '#D7242D', secondary_color = '#A7A9AC', updated_at = now()
WHERE slug IN ('namibia-volleyball', 'namibia-beach-volleyball'); -- NVF red icon/letters + silver bevel

UPDATE sportsplatform_federations SET primary_color = '#032D8C', secondary_color = '#CF0621', updated_at = now()
WHERE slug = 'namibia-boxing'; -- NABF ring blue + glove/stripe red

UPDATE sportsplatform_federations SET primary_color = '#21397F', secondary_color = '#B51A39', updated_at = now()
WHERE slug IN ('namibia-canoeing', 'rowing-namibia'); -- NCRF flag-map blue + red stripe

UPDATE sportsplatform_federations SET primary_color = '#013179', secondary_color = '#D21034', updated_at = now()
WHERE slug = 'namibia-darts'; -- Flag-map blue + red stripe

UPDATE sportsplatform_federations SET primary_color = '#224092', secondary_color = '#CE3728', updated_at = now()
WHERE slug = 'namibia-esports'; -- NESA flag blue + red band

UPDATE sportsplatform_federations SET primary_color = '#020C92', secondary_color = '#E70909', updated_at = now()
WHERE slug IN ('namibia-martial-arts', 'namibia-full-contact-martial-arts'); -- Ring blue + red brush

UPDATE sportsplatform_federations SET primary_color = '#FFD700', secondary_color = '#000000', updated_at = now()
WHERE slug = 'namibia-futsal'; -- Shares NFA crest (gold sun + black)

UPDATE sportsplatform_federations SET primary_color = '#0149AC', secondary_color = '#FF1818', updated_at = now()
WHERE slug = 'namibia-handball'; -- Banner/arc blue + outer arc red

UPDATE sportsplatform_federations SET primary_color = '#30478D', secondary_color = '#EE1A24', updated_at = now()
WHERE slug IN ('namibia-ice-inline-hockey', 'roller-sports-namibia', 'skateboarding-namibia'); -- Africa map blue + red ribbon

UPDATE sportsplatform_federations SET primary_color = '#057899', secondary_color = '#E40203', updated_at = now()
WHERE slug = 'namibia-jukskei'; -- Teal ribbon + red wordmark

UPDATE sportsplatform_federations SET primary_color = '#253C7C', secondary_color = '#D62037', updated_at = now()
WHERE slug = 'namibia-kickboxing'; -- Fist flag blue + red stripe

UPDATE sportsplatform_federations SET primary_color = '#FE6200', secondary_color = '#003580', updated_at = now()
WHERE slug = 'nlas'; -- NALASRA orange athlete + blue head/globe

UPDATE sportsplatform_federations SET primary_color = '#D6223A', secondary_color = '#243B78', updated_at = now()
WHERE slug = 'namibia-padel-tennis'; -- Racket face red + frame/text navy

UPDATE sportsplatform_federations SET primary_color = '#9EDBEC', secondary_color = '#EBAB41', updated_at = now()
WHERE slug = 'sailing-namibia'; -- NSA wordmark sky blue + gold wreath

UPDATE sportsplatform_federations SET primary_color = '#FE9C00', secondary_color = '#681012', updated_at = now()
WHERE slug = 'shooting-namibia'; -- NHRSA orange letters + maroon panel

UPDATE sportsplatform_federations SET primary_color = '#0119BC', secondary_color = '#BE0713', updated_at = now()
WHERE slug = 'table-tennis-namibia'; -- NTTA blue paddle/acronym + red paddle

UPDATE sportsplatform_federations SET primary_color = '#C3D550', secondary_color = '#000000', updated_at = now()
WHERE slug = 'tennis-namibia'; -- Optic-yellow ball + black N.T.A. text

UPDATE sportsplatform_federations SET primary_color = '#912A34', secondary_color = '#2E208D', updated_at = now()
WHERE slug = 'wrestling-namibia'; -- Red + blue singlets in NWF crest
