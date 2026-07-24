-- Crest upgrade pass — Golf + Dance Sport (2026-07-24).
-- WHY: Sibling sport-mark SVGs filled SQL-null logos, but Golf/DSN have
-- verified federation brand marks on NNOC affiliated-member pages.
-- Karate NNOC/FB assets remain NSC flag-wave (rejected — leave mark).
-- Soft-merged aquatics/weightlifting stay inactive (out of scope).
-- Evidence: docs/research/crests_hollow_fill_batch_20260724.md

UPDATE sportsplatform_federations
SET logo = '/logos/Namibia_Golf_Federation_logo.jpg', updated_at = now()
WHERE slug = 'golf-namibia'
  AND (logo IS NULL OR logo = '' OR logo LIKE '/logos/marks/%');

UPDATE sportsplatform_federations
SET logo = '/logos/Dance_Sport_Namibia_logo.jpg', updated_at = now()
WHERE slug = 'dance-sport-namibia'
  AND (logo IS NULL OR logo = '' OR logo LIKE '/logos/marks/%');
