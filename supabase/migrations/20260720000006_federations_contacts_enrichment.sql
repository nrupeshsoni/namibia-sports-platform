-- Contacts enrichment (Agent CONTACTS) — email / phone / leadership only.
-- WHY: Fill verified gaps for Footgolf, Handball, Bodybuilding from New Era /
-- CAHB / WFF coverage. Do NOT touch logo columns. Never invent contacts.
-- Sources: docs/research/contacts_enrichment_batch.md

-- Footgolf — New Era + The Villager launch coverage (leadership only)
UPDATE sportsplatform_federations SET
  president = 'Chalo Chainda',
  secretary_general = 'Allan Kake',
  description = 'National federation for footgolf in Namibia — a hybrid of football and golf recognised by the Namibia Sports Commission. Affiliated with the African FootGolf Association and the Federation for International FootGolf (FIFG).',
  updated_at = now()
WHERE slug = 'namibia-footgolf';

-- Handball — CAHB Zone 6 federation directory (email + mobile)
-- https://www.cahbonline.info/feds/?zn=6
-- Leadership left null: IHF lists Sokaria Shakumu; LinkedIn claims Issy Nakamwe.
UPDATE sportsplatform_federations SET
  email = 'namibiahandballassociation@gmail.com',
  phone = '+264 81 280 1709',
  updated_at = now()
WHERE slug = 'namibia-handball';

-- Bodybuilding — WFF Namibia president (New Era); no public email/phone found
UPDATE sportsplatform_federations SET
  president = 'Evaristor Gylgrister',
  description = 'World Fitness Federation (WFF) Namibia — national bodybuilding and fitness affiliation competing in African and world WFF events.',
  updated_at = now()
WHERE slug = 'bodybuilding-namibia';

-- Padel / Western Mounted Games / soft-baseball / lacrosse / petanque /
-- korfball / orienteering / surfing: no verified email or phone found 2026-07-20.
-- Leave null. See docs/research/contacts_enrichment_batch.md.
