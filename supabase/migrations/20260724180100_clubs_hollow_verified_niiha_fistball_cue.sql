-- Hollow Clubs fill — NIIHA / Fistball / Cue sports / Climbing (2026-07-24).
-- WHY: Active federations with 0 clubs but named clubs on official/press pages.
-- Contacts only when published on source; no invented phones/emails.
-- Idempotent by club slug.
-- Evidence: docs/research/crests_hollow_fill_batch_20260724.md

INSERT INTO sportsplatform_clubs (
  name, slug, federation_id, city, region, logo_url, website, contact_phone, contact_email, is_active
)
SELECT v.name, v.slug, f.id, v.city, v.region, v.logo_url, v.website, v.contact_phone, v.contact_email, true
FROM (
  VALUES
    -- NIIHA — https://niiha.com/the-clubs/
    ('Badgers Inline Hockey Club', 'badgers-inline-hockey', 'namibia-ice-inline-hockey',
     'Windhoek', 'Khomas', '/sports/ice-hockey.jpg', 'https://niiha.com/badgers-inline-hockey-club/',
     '+264 81 278 9194', NULL),
    ('Kamikaze Inline Hockey Club', 'kamikaze-inline-hockey', 'namibia-ice-inline-hockey',
     'Windhoek', 'Khomas', '/sports/ice-hockey.jpg', 'https://www.kamikaze-inline.com/',
     NULL, 'info@kamikaze-inline.com'),
    ('Coastal Pirates Inline Hockey Club', 'coastal-pirates-inline-hockey', 'namibia-ice-inline-hockey',
     'Swakopmund', 'Erongo', '/sports/ice-hockey.jpg', 'https://www.coastalpiratesswakopmund.com/',
     '+264 81 785 0764', 'coastalpirates@gmail.com'),
    ('Scorpions Inline Hockey Club', 'scorpions-inline-hockey', 'namibia-ice-inline-hockey',
     'Otjiwarongo', 'Otjozondjupa', '/sports/ice-hockey.jpg', 'https://niiha.com/scorpions/',
     '+264 81 769 1340', NULL),

    -- Fistball — SKW lists national clubs: https://www.skw.com.na/SKW%20Faustball%20Fistball.html
    ('SKW Fistball', 'skw-fistball', 'fistball-namibia',
     'Windhoek', 'Khomas', '/sports/fistball.jpg', 'http://www.skw.com.na/SKW%20Faustball%20Fistball.html',
     NULL, NULL),
    ('Cohen Faustball Club', 'cohen-faustball-club', 'fistball-namibia',
     'Windhoek', 'Khomas', '/sports/fistball.jpg', NULL, NULL, NULL),
    ('DTS Fistball', 'dts-fistball', 'fistball-namibia',
     'Windhoek', 'Khomas', '/sports/fistball.jpg', NULL, NULL, NULL),
    ('SFC Swakopmund Fistball', 'sfc-swakopmund-fistball', 'fistball-namibia',
     'Swakopmund', 'Erongo', '/sports/fistball.jpg', NULL, NULL, NULL),

    -- Cue sports / NCSF Champ of Champs — Namibian Sun 2025-12-05
    ('Namshooters', 'namshooters-cue', 'billiards-snooker-namibia',
     'Windhoek', 'Khomas', '/sports/billiards-action.jpg', NULL, NULL, NULL),
    ('Coastal Waves', 'coastal-waves-cue', 'billiards-snooker-namibia',
     'Swakopmund', 'Erongo', '/sports/billiards-action.jpg', NULL, NULL, NULL),
    ('Young Ones Cue', 'young-ones-cue', 'billiards-snooker-namibia',
     'Windhoek', 'Khomas', '/sports/billiards-action.jpg', NULL, NULL, NULL),
    ('Tura Boys Cue', 'tura-boys-cue', 'billiards-snooker-namibia',
     'Windhoek', 'Khomas', '/sports/billiards-action.jpg', NULL, NULL, NULL),
    ('Queen Cues', 'queen-cues', 'billiards-snooker-namibia',
     'Windhoek', 'Khomas', '/sports/billiards-action.jpg', NULL, NULL, NULL),
    ('King Cues', 'king-cues', 'billiards-snooker-namibia',
     'Windhoek', 'Khomas', '/sports/billiards-action.jpg', NULL, NULL, NULL),
    ('Rehoboth Pool Club', 'rehoboth-pool-club', 'billiards-snooker-namibia',
     'Rehoboth', 'Hardap', '/sports/billiards-action.jpg', NULL, NULL, NULL),
    ('007 Cue', '007-cue', 'billiards-snooker-namibia',
     'Windhoek', 'Khomas', '/sports/billiards-action.jpg', NULL, NULL, NULL),
    ('Coastal Warriors Cue', 'coastal-warriors-cue', 'billiards-snooker-namibia',
     'Swakopmund', 'Erongo', '/sports/billiards-action.jpg', NULL, NULL, NULL),

    -- Climbing — Mountain Club of Namibia (MCSA section / UIAA pathway)
    ('Mountain Club of Namibia', 'mountain-club-namibia', 'namibia-climbing',
     'Windhoek', 'Khomas', '/sports/climbing.jpg', 'https://www.mcnam.org/', NULL, NULL)
) AS v(name, slug, fed_slug, city, region, logo_url, website, contact_phone, contact_email)
JOIN sportsplatform_federations f ON f.slug = v.fed_slug AND f.is_active = true
WHERE NOT EXISTS (
  SELECT 1 FROM sportsplatform_clubs c WHERE c.slug = v.slug
);
