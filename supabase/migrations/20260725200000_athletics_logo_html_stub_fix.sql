-- Replace Athletics Namibia logo: athletics-logo.png was an HTML stub
-- (World Athletics CIS page saved as .png). No verified Athletics Namibia
-- crest in repo — use generic sport mark until a real crest is sourced.
-- Evidence: docs/research/gap_wave_20260725/10_federations_brands.md

UPDATE sportsplatform_federations
SET logo = '/logos/marks/athletics.svg',
    updated_at = now()
WHERE slug = 'athletics-namibia'
  AND (logo IS NULL OR logo = '' OR logo = '/logos/athletics-logo.png');

UPDATE sportsplatform_media
SET file_url = '/logos/marks/athletics.svg',
    thumbnail_url = '/logos/marks/athletics.svg',
    title = 'Athletics Namibia sport mark'
WHERE file_url = '/logos/athletics-logo.png'
   OR thumbnail_url = '/logos/athletics-logo.png';
