-- Contacts enrichment pass 2 (Agent CONTACTS) — email / phone / leadership only.
-- WHY: ISA member directory lists verified Namibia Surfing Association contacts.
-- Do NOT touch logo / website / facebook columns. Never invent contacts.
-- Sources: docs/research/contacts_enrichment_batch.md (Pass 2)

-- Surfing — ISA Member Directory (primary contact + email + phone)
-- https://isasurf.org/become-a-member/member-directory/
UPDATE sportsplatform_federations SET
  email = 'rainer.eimbeck@gmail.com',
  phone = '+264 64 403 905',
  secretary_general = 'Rainer Eimbeck',
  description = 'Namibia Surfing Association (NSA) — ISA member since 1997. Primary contact listed with the International Surfing Association. Postal: P.O. Box 656, Swakopmund.',
  updated_at = now()
WHERE slug = 'surfing-namibia';

-- Pass 2: no verified email/phone for baseball, bodybuilding, lacrosse, footgolf,
-- korfball, orienteering, padel, western-mounted-games, petanque, softball.
-- See contacts_enrichment_batch.md Pass 2 notes.
