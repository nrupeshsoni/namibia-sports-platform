-- Federations websites & socials enrichment Pass 2 (website/facebook/instagram/twitter/youtube ONLY).
-- WHY: Close more of the 37 null-website gaps via IF member directories, archive.org,
-- and verified national pages. Never invent URLs; null-only updates.
-- Evidence: docs/research/websites_socials_enrichment_batch.md (Pass 2)
-- Applied 2026-07-20. Does NOT touch logo/email/phone/leadership/abbr/description/colors.

-- ===== Websites (null only) =====

UPDATE sportsplatform_federations SET
  website = 'https://www.worldarchery.sport/member/nam/archery-association-namibia',
  updated_at = now()
WHERE slug = 'archery-namibia'
  AND (website IS NULL OR btrim(website) = '');

UPDATE sportsplatform_federations SET
  website = 'https://www.worlddancesport.org/Members/Dance-Sport-Namibia-1942',
  updated_at = now()
WHERE slug = 'dance-sport-namibia'
  AND (website IS NULL OR btrim(website) = '');

UPDATE sportsplatform_federations SET
  website = 'https://wfdf.sport/members/nam/',
  updated_at = now()
WHERE slug = 'ultimate-frisbee-namibia'
  AND (website IS NULL OR btrim(website) = '');

UPDATE sportsplatform_federations SET
  website = 'https://muaythai.sport/organisation/ifma-family/ifma-africa/',
  updated_at = now()
WHERE slug = 'namibia-muaythai'
  AND (website IS NULL OR btrim(website) = '');

UPDATE sportsplatform_federations SET
  website = 'https://detlef.iway.na/ean/',
  updated_at = now()
WHERE slug = 'ice-stock-namibia'
  AND (website IS NULL OR btrim(website) = '');

UPDATE sportsplatform_federations SET
  website = 'https://web.archive.org/web/20230501224200/https://corporate.bwfbadminton.com/about/membership/',
  updated_at = now()
WHERE slug = 'badminton-namibia'
  AND (website IS NULL OR btrim(website) = '');

UPDATE sportsplatform_federations SET
  website = 'https://isasurf.org/become-a-member/member-directory/',
  updated_at = now()
WHERE slug = 'surfing-namibia'
  AND (website IS NULL OR btrim(website) = '');

-- ===== Facebook (null only) =====

UPDATE sportsplatform_federations SET
  facebook = 'https://www.facebook.com/p/Footgolf-Namibia-61586569298111/',
  updated_at = now()
WHERE slug = 'namibia-footgolf'
  AND (facebook IS NULL OR btrim(facebook) = '');

UPDATE sportsplatform_federations SET
  facebook = 'https://www.facebook.com/NamibiaCueSports',
  updated_at = now()
WHERE slug = 'billiards-snooker-namibia'
  AND (facebook IS NULL OR btrim(facebook) = '');
