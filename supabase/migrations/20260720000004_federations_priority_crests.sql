-- Priority crest restore (2026-07-20 session 3).
-- Sources documented in docs/research/federation_data_gap_list.md
-- WHY: Close P0 logo gaps for Ministry, Paralympic, NRU crest.

-- Ministry of Sport, Youth and National Service
-- Source: https://namparalympics.org.na/wp-content/uploads/2020/03/MSYNS-logo.jpg
-- (official MSYNS government logo hosted on NNPC site)
UPDATE sportsplatform_federations SET
  logo = '/logos/Ministry_of_Sport_Youth_and_National_Service_logo.jpg',
  updated_at = now()
WHERE slug = 'ministry-sport';

-- Namibia Paralympic Committee
-- Source: https://namparalympics.org.na/wp-content/uploads/2020/02/logo-main.jpg
UPDATE sportsplatform_federations SET
  logo = '/logos/Namibia_Paralympic_Committee_logo.jpg',
  updated_at = now()
WHERE slug = 'namibia-paralympic';

-- Namibia Rugby Union — brand crest (prefer over sport photo)
-- Source: Logopedia / NRU brand mark (https://logos.fandom.com/wiki/Namibia_national_rugby_union_team)
-- Official nru.com.na asset blocked by TLS from this environment; Logopedia hosts the same "Namibia Rugby" crest.
UPDATE sportsplatform_federations SET
  logo = '/logos/Namibia_Rugby_Union_logo.png',
  updated_at = now()
WHERE slug = 'nru';

-- Bowls Namibia / Namibia Bowling Association
-- Source: Wikimedia Commons File:Logo_Namibia_Bowling_Association.png (CC BY-SA 4.0)
UPDATE sportsplatform_federations SET
  logo = '/logos/Namibia_Bowling_Association_logo.png',
  updated_at = now()
WHERE slug = 'bowls-namibia';
