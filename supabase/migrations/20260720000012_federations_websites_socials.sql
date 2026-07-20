-- Federations websites & socials enrichment (website/facebook/instagram/twitter/youtube ONLY).
-- WHY: 51% website coverage; many rows with site but null socials. Fill only verified URLs
-- (NNOC member list, official sites, IF directories, prior research). Never invent pages.
-- Evidence: docs/research/websites_socials_enrichment_batch.md
-- Applied 2026-07-20. Does NOT touch logo/email/phone/president/secretary_general.

-- ===== Websites (null only) =====

UPDATE sportsplatform_federations SET
  website = 'https://esportsnamibia.org/',
  updated_at = now()
WHERE slug = 'namibia-esports'
  AND (website IS NULL OR btrim(website) = '');

UPDATE sportsplatform_federations SET
  website = 'https://www.fisu.net/nusf/namibia/',
  updated_at = now()
WHERE slug = 'nnssu'
  AND (website IS NULL OR btrim(website) = '');

UPDATE sportsplatform_federations SET
  website = 'https://www.ihf.info/member-federations/namibia-handball-federation/5571',
  updated_at = now()
WHERE slug = 'namibia-handball'
  AND (website IS NULL OR btrim(website) = '');

UPDATE sportsplatform_federations SET
  website = 'https://www.canoeicf.com/federation/namibia-canoeing-rowing-federation',
  updated_at = now()
WHERE slug IN ('namibia-canoeing', 'rowing-namibia')
  AND (website IS NULL OR btrim(website) = '');

-- ===== Facebook (null only) =====

UPDATE sportsplatform_federations SET facebook = 'https://www.facebook.com/archeryassociationofnamibia', updated_at = now()
WHERE slug = 'archery-namibia' AND (facebook IS NULL OR btrim(facebook) = '');

UPDATE sportsplatform_federations SET facebook = 'https://www.facebook.com/officialmeiysac/', updated_at = now()
WHERE slug = 'ministry-sport' AND (facebook IS NULL OR btrim(facebook) = '');

UPDATE sportsplatform_federations SET facebook = 'https://www.facebook.com/www.namef.org.na/', updated_at = now()
WHERE slug = 'equestrian-namibia' AND (facebook IS NULL OR btrim(facebook) = '');

UPDATE sportsplatform_federations SET facebook = 'https://www.facebook.com/motorsportnamibia/', updated_at = now()
WHERE slug = 'motorsport-namibia' AND (facebook IS NULL OR btrim(facebook) = '');

UPDATE sportsplatform_federations SET facebook = 'https://www.facebook.com/Namibia.Aquatic.Sports.Federation/', updated_at = now()
WHERE slug = 'namibia-aquatics' AND (facebook IS NULL OR btrim(facebook) = '');

UPDATE sportsplatform_federations SET facebook = 'https://www.facebook.com/namibiacanoerowing/', updated_at = now()
WHERE slug IN ('namibia-canoeing', 'rowing-namibia') AND (facebook IS NULL OR btrim(facebook) = '');

UPDATE sportsplatform_federations SET facebook = 'https://www.facebook.com/windynamib/', updated_at = now()
WHERE slug = 'sailing-namibia' AND (facebook IS NULL OR btrim(facebook) = '');

UPDATE sportsplatform_federations SET facebook = 'https://www.facebook.com/Nesa.Namibia/', updated_at = now()
WHERE slug = 'namibia-esports' AND (facebook IS NULL OR btrim(facebook) = '');

UPDATE sportsplatform_federations SET facebook = 'https://www.facebook.com/kickfederation/', updated_at = now()
WHERE slug = 'namibia-kickboxing' AND (facebook IS NULL OR btrim(facebook) = '');

UPDATE sportsplatform_federations SET facebook = 'https://www.facebook.com/profile.php?id=100071276602545', updated_at = now()
WHERE slug = 'namibia-muaythai' AND (facebook IS NULL OR btrim(facebook) = '');

UPDATE sportsplatform_federations SET facebook = 'https://www.facebook.com/FencingNamibia', updated_at = now()
WHERE slug = 'fencing-namibia' AND (facebook IS NULL OR btrim(facebook) = '');

UPDATE sportsplatform_federations SET facebook = 'https://www.facebook.com/NamibiaChessFederation/', updated_at = now()
WHERE slug = 'chess-namibia' AND (facebook IS NULL OR btrim(facebook) = '');

UPDATE sportsplatform_federations SET facebook = 'https://www.facebook.com/dancesport.namibia', updated_at = now()
WHERE slug = 'dance-sport-namibia' AND (facebook IS NULL OR btrim(facebook) = '');

UPDATE sportsplatform_federations SET facebook = 'https://www.facebook.com/p/Namibia-Golf-Federation-100068944364682/', updated_at = now()
WHERE slug = 'golf-namibia' AND (facebook IS NULL OR btrim(facebook) = '');

UPDATE sportsplatform_federations SET facebook = 'https://www.facebook.com/MCSANamibia', updated_at = now()
WHERE slug IN ('namibia-climbing', 'namibia-mountaineering') AND (facebook IS NULL OR btrim(facebook) = '');

UPDATE sportsplatform_federations SET facebook = 'https://www.facebook.com/NamibiaMartialArtsFederation', updated_at = now()
WHERE slug IN ('namibia-martial-arts', 'namibia-full-contact-martial-arts') AND (facebook IS NULL OR btrim(facebook) = '');

UPDATE sportsplatform_federations SET facebook = 'https://www.facebook.com/NamibiaIceandInlineHockeyAssociation/', updated_at = now()
WHERE slug = 'skateboarding-namibia' AND (facebook IS NULL OR btrim(facebook) = '');

-- ===== Instagram (null only) =====

UPDATE sportsplatform_federations SET instagram = 'https://www.instagram.com/archeryassociationofnamibia/', updated_at = now()
WHERE slug = 'archery-namibia' AND (instagram IS NULL OR btrim(instagram) = '');

UPDATE sportsplatform_federations SET instagram = 'https://www.instagram.com/nasfednamibia/', updated_at = now()
WHERE slug = 'namibia-aquatics' AND (instagram IS NULL OR btrim(instagram) = '');

UPDATE sportsplatform_federations SET instagram = 'https://www.instagram.com/namibiancyclingfederation/', updated_at = now()
WHERE slug = 'namibia-cycling' AND (instagram IS NULL OR btrim(instagram) = '');

UPDATE sportsplatform_federations SET instagram = 'https://www.instagram.com/namibian_gymnastics_federation', updated_at = now()
WHERE slug = 'namibia-gymnastics' AND (instagram IS NULL OR btrim(instagram) = '');

UPDATE sportsplatform_federations SET instagram = 'https://www.instagram.com/nsa_squashforlife/', updated_at = now()
WHERE slug = 'squash-namibia' AND (instagram IS NULL OR btrim(instagram) = '');

UPDATE sportsplatform_federations SET instagram = 'https://www.instagram.com/netballnamibia/', updated_at = now()
WHERE slug = 'namibia-netball' AND (instagram IS NULL OR btrim(instagram) = '');

UPDATE sportsplatform_federations SET instagram = 'https://www.instagram.com/namibiahockeyunion/', updated_at = now()
WHERE slug = 'nhu' AND (instagram IS NULL OR btrim(instagram) = '');

UPDATE sportsplatform_federations SET instagram = 'https://www.instagram.com/namibiavolleyballfederation/', updated_at = now()
WHERE slug IN ('namibia-volleyball', 'namibia-beach-volleyball') AND (instagram IS NULL OR btrim(instagram) = '');

UPDATE sportsplatform_federations SET instagram = 'https://www.instagram.com/tennisnamibia/', updated_at = now()
WHERE slug = 'tennis-namibia' AND (instagram IS NULL OR btrim(instagram) = '');

UPDATE sportsplatform_federations SET instagram = 'https://www.instagram.com/ntta_2025_/', updated_at = now()
WHERE slug = 'table-tennis-namibia' AND (instagram IS NULL OR btrim(instagram) = '');

UPDATE sportsplatform_federations SET instagram = 'https://www.instagram.com/ntfnam/', updated_at = now()
WHERE slug = 'triathlon-namibia' AND (instagram IS NULL OR btrim(instagram) = '');

UPDATE sportsplatform_federations SET instagram = 'https://www.instagram.com/namibia_chess_federation/', updated_at = now()
WHERE slug = 'chess-namibia' AND (instagram IS NULL OR btrim(instagram) = '');

UPDATE sportsplatform_federations SET instagram = 'https://www.instagram.com/dancesport.namibia/', updated_at = now()
WHERE slug = 'dance-sport-namibia' AND (instagram IS NULL OR btrim(instagram) = '');

UPDATE sportsplatform_federations SET instagram = 'https://www.instagram.com/namibia_martial_arts/', updated_at = now()
WHERE slug IN ('namibia-martial-arts', 'namibia-full-contact-martial-arts') AND (instagram IS NULL OR btrim(instagram) = '');

UPDATE sportsplatform_federations SET instagram = 'https://www.instagram.com/official_namibian_inlinehockey/', updated_at = now()
WHERE slug = 'skateboarding-namibia' AND (instagram IS NULL OR btrim(instagram) = '');

-- ===== Twitter / X (null only) =====

UPDATE sportsplatform_federations SET twitter = 'https://x.com/NamibiaHockey', updated_at = now()
WHERE slug = 'nhu' AND (twitter IS NULL OR btrim(twitter) = '');

UPDATE sportsplatform_federations SET twitter = 'https://x.com/namibianvolley1', updated_at = now()
WHERE slug = 'namibia-volleyball' AND (twitter IS NULL OR btrim(twitter) = '');

UPDATE sportsplatform_federations SET twitter = 'https://x.com/CyclingNamibian', updated_at = now()
WHERE slug = 'namibia-cycling' AND (twitter IS NULL OR btrim(twitter) = '');

-- ===== YouTube (null only) =====

UPDATE sportsplatform_federations SET youtube = 'https://www.youtube.com/@namibiafootballassociation', updated_at = now()
WHERE slug = 'nfa' AND (youtube IS NULL OR btrim(youtube) = '');

UPDATE sportsplatform_federations SET youtube = 'https://www.youtube.com/channel/UCtQjXG3rS5XmFfX-4mOA-MQ', updated_at = now()
WHERE slug = 'cricket-namibia' AND (youtube IS NULL OR btrim(youtube) = '');
