-- Resolve Aquatics/Swimming + Powerlifting/Weightlifting duplicates (soft-deprecate),
-- and set verified primary/secondary brand colors from crest assets.
-- WHY: Live DB listed two rows for one NASFED body and two rows for one PWFN body,
-- confusing the directory. Federations have no is_active column yet — use (merged)
-- name + [MERGED] description; keep slugs for URL compatibility. Colors only when
-- clearly brand-like from client/public/logos/* (not sport photos).
-- Sources: docs/research/naming_duplicates_resolution.md,
--          NSC Feb 2025 extract, swimmingnamibia.com, research PWFN notes.
-- Does NOT touch logo/email/phone/website/social columns.
-- Applied remotely 2026-07-20 to rbibqjgsnrueubrvyqps.
-- Filename 000013 (000012 reserved for websites_socials sibling agent).

-- ===== 1. Aquatics → Swimming / NASFED (canonical: swimming-namibia) =====

UPDATE sportsplatform_events
SET federation_id = 35, updated_at = now()
WHERE federation_id = 61;

UPDATE sportsplatform_federations SET
  name = 'Namibia Aquatic Sports Federation',
  abbreviation = 'NASFED',
  description = 'Namibia Aquatic Sports Federation (NASFED) — national governing body for swimming and aquatic sports (World Aquatics). Also known as the Namibia Swimming Union. Official site: swimmingnamibia.com.',
  updated_at = now()
WHERE slug = 'swimming-namibia';

UPDATE sportsplatform_federations SET
  name = 'Namibia Aquatics (merged)',
  abbreviation = 'NASFED-DUP',
  description = '[MERGED] Duplicate of Namibia Aquatic Sports Federation (canonical slug: swimming-namibia). Same NASFED body, website, and contacts. Retained for URL compatibility until is_active/merged_into_slug columns ship. Do not attach new clubs, events, or athletes here.',
  updated_at = now()
WHERE slug = 'namibia-aquatics';

-- ===== 2. Weightlifting → Power & Weight Lifting (canonical: powerlifting-namibia) =====

UPDATE sportsplatform_federations SET
  name = 'Namibia Power & Weight Lifting Association',
  abbreviation = 'PWFN',
  description = 'Namibia Power & Weight Lifting Association (PWFN / Namibian Powerlifting & Weightlifting Federation, est. 2016). Single NSC-recognised body governing both powerlifting and Olympic weightlifting pathways in Namibia.',
  updated_at = now()
WHERE slug = 'powerlifting-namibia';

UPDATE sportsplatform_federations SET
  name = 'Weightlifting Namibia (merged)',
  abbreviation = 'NWL-DUP',
  description = '[MERGED] Duplicate of Namibia Power & Weight Lifting Association (canonical slug: powerlifting-namibia). NSC lists one combined Power & Weight Lifting Association. Retained for URL compatibility until is_active/merged_into_slug columns ship. Do not attach new content here.',
  updated_at = now()
WHERE slug = 'weightlifting-namibia';

-- ===== 3. Verified brand colors (hex from crest assets / SVG fills) =====
-- Format: #RRGGBB uppercase. Leave null when uncertain.

UPDATE sportsplatform_federations SET primary_color = '#FFD700', secondary_color = '#000000', updated_at = now()
WHERE slug = 'nfa'; -- NFA crest: gold sun + black text

UPDATE sportsplatform_federations SET primary_color = '#2D8C3C', secondary_color = '#FFDE00', updated_at = now()
WHERE slug = 'nru'; -- NRU Welwitschia green + yellow accent

UPDATE sportsplatform_federations SET primary_color = '#0047AB', secondary_color = '#00AEEF', updated_at = now()
WHERE slug = 'cricket-namibia'; -- Cricket Namibia blue swooshes

UPDATE sportsplatform_federations SET primary_color = '#668BE5', secondary_color = '#4464AD', updated_at = now()
WHERE slug = 'swimming-namibia'; -- NASFED cornflower / navy blues

UPDATE sportsplatform_federations SET primary_color = '#2E3192', secondary_color = '#ED1C24', updated_at = now()
WHERE slug = 'namibia-netball'; -- Netball Namibia wordmark blue + ribbon red

UPDATE sportsplatform_federations SET primary_color = '#1B418C', secondary_color = '#D71920', updated_at = now()
WHERE slug = 'nhu'; -- Hockey Union navy + flag red

UPDATE sportsplatform_federations SET primary_color = '#003580', secondary_color = '#D21034', updated_at = now()
WHERE slug = 'nnoc'; -- NNOC flag blue + red

UPDATE sportsplatform_federations SET primary_color = '#003580', secondary_color = '#D21034', updated_at = now()
WHERE slug = 'namibia-paralympic'; -- NPC navy text + Agitos/flag red

UPDATE sportsplatform_federations SET primary_color = '#2B3086', secondary_color = '#C42038', updated_at = now()
WHERE slug = 'namibia-cycling'; -- Exact SVG fills #2B3086 / #C42038

UPDATE sportsplatform_federations SET primary_color = '#003399', secondary_color = '#E31B23', updated_at = now()
WHERE slug = 'triathlon-namibia'; -- Triathlon icons blue swim / red cycle

UPDATE sportsplatform_federations SET primary_color = '#1A237E', secondary_color = '#B39DDB', updated_at = now()
WHERE slug = 'namibia-gymnastics'; -- NGF navy + lavender accents

UPDATE sportsplatform_federations SET primary_color = '#003580', secondary_color = '#D21034', updated_at = now()
WHERE slug = 'squash-namibia'; -- NSA flag-fill letters

UPDATE sportsplatform_federations SET primary_color = '#1B3664', secondary_color = '#E31E24', updated_at = now()
WHERE slug = 'namibia-sports-commission'; -- NSC eagle navy + swoosh red

UPDATE sportsplatform_federations SET primary_color = '#003580', secondary_color = '#D21034', updated_at = now()
WHERE slug = 'ministry-sport'; -- Coat of arms / flag blue + red

UPDATE sportsplatform_federations SET primary_color = '#003580', secondary_color = '#000000', updated_at = now()
WHERE slug = 'bowls-namibia'; -- Flag blue in shield + black ring/text
