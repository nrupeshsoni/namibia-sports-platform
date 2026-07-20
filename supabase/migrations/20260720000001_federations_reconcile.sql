-- Reconcile sportsplatform_federations against the official Namibia Sport
-- Commission list (2026). Additive: merge duplicates, add the official
-- federations that were missing, keep existing extras. Applied 2026-07-20.
--
-- Result: 67 -> 85 federations (−2 duplicates, +20 official additions).
-- Cue Sports (~ existing Billiards & Snooker) and Traditional Games (~ TISAN)
-- were intentionally NOT added to avoid near-duplicates.

-- Merge Triathlon duplicate: keep id 32 (Triathlon Namibia), repoint id 64's
-- events, delete id 64.
update sportsplatform_events set federation_id = 32 where federation_id = 64;
delete from sportsplatform_federations where id = 64;

-- Merge Squash duplicate: keep id 78 (Squash Namibia); id 63 has no linked rows.
delete from sportsplatform_federations where id = 63;

insert into sportsplatform_federations (name, abbreviation, type, slug) values
  ('Dance Sport Namibia',                     'DSN',   'federation', 'dance-sport-namibia'),
  ('Fistball Namibia',                        'FN',    'federation', 'fistball-namibia'),
  ('Namibia Electronic Sport Association',     'NESA',  'federation', 'namibia-esports'),
  ('Namibia Horse Racing Association',         'NHRA',  'federation', 'namibia-horse-racing'),
  ('Ice Stock Namibia',                       'ISN',   'federation', 'ice-stock-namibia'),
  ('Namibia Ice & Inline Hockey Association',  'NIIHA', 'federation', 'namibia-ice-inline-hockey'),
  ('Namibia Jukskei Federation',              'NJF',   'federation', 'namibia-jukskei'),
  ('Namibia Kendo Association',               'NKA',   'federation', 'namibia-kendo'),
  ('Namibia Kickboxing Federation',           'NKBF',  'federation', 'namibia-kickboxing'),
  ('Namibia Practical Shooting Association',   'NPSA',  'federation', 'namibia-practical-shooting'),
  ('Namibia Speed Hiking Association',         'NSHA',  'federation', 'namibia-speed-hiking'),
  ('Namibia Waterski Association',            'NWSA',  'federation', 'namibia-waterski'),
  ('Namibia Teqball Federation',              'NTBF',  'federation', 'namibia-teqball'),
  ('Indigenous Combat Sport Federation',       'ICSF',  'federation', 'indigenous-combat-sport'),
  ('Namibia Full-Contact Martial Arts',        'NFCMA', 'federation', 'namibia-full-contact-martial-arts'),
  ('Namibia Muaythai Federation',             'NMTF',  'federation', 'namibia-muaythai'),
  ('Mixed Martial Arts Namibia',              'MMAN',  'federation', 'mixed-martial-arts-namibia'),
  ('Namibia Footgolf Federation',             'NFGF',  'federation', 'namibia-footgolf'),
  ('Namibia Western Mounted Games Federation', 'NWMGF', 'federation', 'namibia-western-mounted-games'),
  ('Namibia Padel Tennis Federation',         'NPTF',  'federation', 'namibia-padel-tennis')
on conflict (slug) do nothing;
