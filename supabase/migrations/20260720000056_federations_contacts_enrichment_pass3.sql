-- Contacts enrichment pass 3 (Agent CONTACTS) — email / phone / leadership only.
-- WHY: Close easy verified leadership + contact-format wins; 10 null email+phone
-- emerging codes still lack public federation contacts (never fabricate).
-- Do NOT touch logo / website / facebook columns.
-- Sources: docs/research/contacts_enrichment_batch.md (Pass 3)

-- Athletics Namibia — president + phone E.164 (NNOC + athletics-namibia.com.na + New Era)
UPDATE sportsplatform_federations SET
  president = 'Leon Nienaber',
  phone = '+264 81 124 3550',
  updated_at = now()
WHERE slug = 'athletics-namibia';

-- Chess Namibia — president (New Era elective congress; Bank Windhoek sponsorship coverage)
UPDATE sportsplatform_federations SET
  president = 'Charles Eichab',
  updated_at = now()
WHERE slug = 'chess-namibia';

-- Darts — board + official contact email (namibiadarts.com/structure + /contact)
UPDATE sportsplatform_federations SET
  president = 'Jasper Blaauw',
  secretary_general = 'Ralph Ludwig',
  email = 'ralph@namibiadarts.com',
  phone = '+264 81 214 7484',
  updated_at = now()
WHERE slug = 'namibia-darts';

-- Handball — president from recent NHF press (Confidente); IHF still lists Sokaria Shakumu (stale)
UPDATE sportsplatform_federations SET
  president = 'Issy Nakamwe',
  updated_at = now()
WHERE slug = 'namibia-handball';

-- NIIHA — official board (niiha.com/contacts)
UPDATE sportsplatform_federations SET
  president = 'Matthew Jackman',
  secretary_general = 'Wiebke La Barrè',
  updated_at = now()
WHERE slug = 'namibia-ice-inline-hockey';

-- Roller / Skateboarding — share NIIHA president@niiha.com channel (same contact email already set)
UPDATE sportsplatform_federations SET
  president = 'Matthew Jackman',
  updated_at = now()
WHERE slug IN ('roller-sports-namibia', 'skateboarding-namibia');

-- Climbing + Mountaineering — MCSA Namibia Section Chairman 2026 (mcnam.org/contact)
UPDATE sportsplatform_federations SET
  president = 'Maarten Venter',
  updated_at = now()
WHERE slug IN ('namibia-climbing', 'namibia-mountaineering');

-- Triathlon — World Triathlon NF directory + phone E.164
UPDATE sportsplatform_federations SET
  president = 'Michiel Greeff',
  phone = '+264 81 246 2204',
  updated_at = now()
WHERE slug = 'triathlon-namibia';

-- Wrestling — UWW member federation + UWW news (NWF President Colin Steytler)
UPDATE sportsplatform_federations SET
  president = 'Colin Steytler',
  updated_at = now()
WHERE slug = 'wrestling-namibia';

-- Powerlifting — IPF Africa directory (president + SG both Marius Johannes)
UPDATE sportsplatform_federations SET
  president = 'Marius Johannes',
  secretary_general = 'Marius Johannes',
  updated_at = now()
WHERE slug = 'powerlifting-namibia';

-- Waterski — NWSA Chairman (Informanté / Radiowave 2025–2026)
UPDATE sportsplatform_federations SET
  president = 'Nikolai Heger',
  updated_at = now()
WHERE slug = 'namibia-waterski';

-- Beach Volleyball — governed by NVF; mirror current NVF leadership already on namibia-volleyball
UPDATE sportsplatform_federations SET
  president = 'Tobias Eden Mwatelulo',
  secretary_general = 'Festus Shituliipo Hamukwaya',
  updated_at = now()
WHERE slug = 'namibia-beach-volleyball';

-- Pass 3: still no verified email/phone for the 10 null-both emerging codes
-- (baseball, bodybuilding, lacrosse, footgolf, korfball, orienteering, padel,
--  western-mounted-games, petanque, softball). See contacts_enrichment_batch.md Pass 3.
