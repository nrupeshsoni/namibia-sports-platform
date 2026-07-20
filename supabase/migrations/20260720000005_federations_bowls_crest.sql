-- Bowls Namibia crest (applied remotely as federations_bowls_crest).
-- Source: Wikimedia Commons File:Logo_Namibia_Bowling_Association.png (CC BY-SA 4.0)
-- Also included in 20260720000004 for fresh environments (idempotent).

UPDATE sportsplatform_federations SET
  logo = '/logos/Namibia_Bowling_Association_logo.png',
  updated_at = now()
WHERE slug = 'bowls-namibia';
