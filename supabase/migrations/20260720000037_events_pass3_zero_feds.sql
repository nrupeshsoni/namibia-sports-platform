-- WHY: Events pass 3 — verified events for previously zero-event federations
-- (esports, padel, sailing, jukskei, dance, cue sports, full-contact/RCFA,
-- inline hockey, taekwondo/paralympic). Sources in docs/research/events_enrichment_batch.md.
-- Never invents dates. Applied 2026-07-20.

INSERT INTO sportsplatform_events
  (name, slug, description, type, start_date, end_date, location, region, poster_url, is_published, federation_id)
VALUES
-- ===== Esports (NESA) =====
(
  'MTC NamLAN 2025 – LAN of the Brave',
  'mtc-namlan-2025',
  'NESA flagship LAN event at Vanir Micro Sports Centre. Source: https://esportsnamibia.org/circle-your-calendar-mtc-namlan-2025-lan-of-the-brave-is-only-2-weeks-away/',
  'tournament', '2025-11-27', '2025-11-30',
  'Vanir Micro Sports Centre, Windhoek', 'Khomas',
  '/sports/esports.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-esports')
),
(
  'NESA National Esports Qualifiers Grand Finals 2026',
  'nesa-gef-qualifier-finals-2026',
  'National selection finals for Global Esports Games Los Angeles 2026 (CS2, MLBB, NBA2K, eFootball, Clash Royale). Online brackets 4–17 Jul; offline rounds 4 & 18 Jul; Grand Finals 25 Jul. Source: https://esportsafricanews.com/nesa-launches-national-qualifier-for-globalesports-games-los-angeles-2026/ ; https://www.namibiansun.com/sport-wrap-main/nesa-launches-los-angeles-2026-qualifiers-NMH012931-11-15852',
  'tournament', '2026-07-04', '2026-07-25',
  'Online / Windhoek (Grand Finals venue TBA)', 'Khomas',
  '/sports/esports.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-esports')
),

-- ===== Padel =====
(
  'Heineken 0.0 NPPL Open 2026',
  'heineken-nppl-open-2026',
  'Namibia Professional Padel League major open (men''s & women''s) at LIV Padel and Nam Padel. Source: https://stayhappening.com/e/heineken-00-open-padel-tournament-E2ISYFXTJXO',
  'tournament', '2026-04-16', '2026-04-18',
  'LIV Padel & Nam Padel, Windhoek', 'Khomas',
  NULL, true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-padel-tennis')
),
(
  'NAMBRU Rhino Rally Padel Challenge 2026',
  'nambru-rhino-rally-padel-2026',
  'Charity padel challenge at United Padel Namibia. Source: https://allevents.in/windhoek/nambru-rhino-rally-padel-challenge-2026-serving-for-survival/200030380796346',
  'competition', '2026-08-08', '2026-08-08',
  'United Padel Namibia, Windhoek', 'Khomas',
  NULL, true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-padel-tennis')
),

-- ===== Sailing =====
(
  'Junior National Sailing Championships 2026',
  'junior-sailing-nationals-2026',
  'Namibia Sailing Association Junior Nationals (Laser, Optimist, Pico) over Easter weekend in Walvis Bay; Emily Zander overall champion. Source: https://www.namibiansun.com/local/junior-national-sailing-champions-crowned-nmh009153-11-10554',
  'competition', '2026-04-03', '2026-04-04',
  'Walvis Bay Yacht Club / lagoon', 'Erongo',
  '/sports/sailing.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'sailing-namibia')
),

-- ===== Dance Sport =====
(
  'DanceSport Namibia National Championships 2025',
  'dancesport-nationals-2025',
  'DSN first official nationals under new management (hip-hop, stage, Latin); national teams selected. Source: https://www.republikein.com.na/sport-wrap-main/dance-national-champions-crowned2025-11-25178128',
  'competition', '2025-11-22', '2025-11-22',
  'Windhoek', 'Khomas',
  '/sports/dance-sport.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'dance-sport-namibia')
),

-- ===== Jukskei =====
(
  'Namibia Open Jukskei Championship 2025',
  'namibia-open-jukskei-2025',
  'Namibia Open at Jukskeipark Swakopmund with SA visiting teams (~160 players); international tests 4 Jul. Source: https://www.republikein.com.na/sport-wrap-main/spanne-uit-rsa-speel-saam-in-swakopmund2025-06-30161706 ; IJF Newsletter.',
  'tournament', '2025-06-30', '2025-07-04',
  'Jukskeipark, Swakopmund', 'Erongo',
  NULL, true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-jukskei')
),
(
  'Christie Horn Schools Jukskei Tournament 2025',
  'christie-horn-jukskei-schools-2025',
  'First full junior school jukskei tournament (~50 juniors). Source: https://www.jukskei-nam.com/',
  'competition', '2025-10-04', '2025-10-04',
  'Windhoek', 'Khomas',
  NULL, true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-jukskei')
),
(
  'Coen Brand ATKV Open Day 2025',
  'coen-brand-jukskei-2025',
  'Coen Brand ATKV Open Day jukskei. Source: https://www.jukskei-nam.com/',
  'competition', '2025-10-25', '2025-10-25',
  'Windhoek', 'Khomas',
  NULL, true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-jukskei')
),
(
  'Swakopmund Sakeliga Jukskei 2026',
  'swakopmund-sakeliga-jukskei-2026',
  'Swakopmund Sakeliga jukskei event. Source: https://www.jukskei-nam.com/',
  'competition', '2026-01-24', '2026-01-24',
  'Swakopmund', 'Erongo',
  NULL, true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-jukskei')
),
(
  'IJF International Jukskei Test Matches 2026',
  'ijf-jukskei-tests-2026',
  'IJF international test matches at Jukskei Park Olympia. Source: https://www.jukskei-nam.com/',
  'competition', '2026-05-29', '2026-05-29',
  'Jukskei Park, Olympia, Windhoek', 'Khomas',
  NULL, true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-jukskei')
),
(
  'Outjo Jukskei Doubles 2026',
  'outjo-jukskei-doubles-2026',
  'Outjo Jukskei Doubles (Taranaki first). Source: https://www.jukskei-nam.com/',
  'competition', '2026-06-26', '2026-06-26',
  'Outjo', 'Kunene',
  NULL, true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-jukskei')
),

-- ===== Cue sports / Billiards =====
(
  'NCSF Women''s Championships 2025',
  'ncsf-womens-champs-2025',
  'Inaugural NCSF Women''s Championships at Boiler Room; Kelly-Ann Williams champion. Source: https://www.namibiansun.com/sport-wrap-main/williams-dominates-inaugural-women%E2%80%99s-champs2025-08-19167474',
  'tournament', '2025-08-16', '2025-08-17',
  'Boiler Room, Windhoek', 'Khomas',
  '/sports/billiards-action.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'billiards-snooker-namibia')
),
(
  'NCSF President Cup 2025',
  'ncsf-president-cup-2025',
  'Annual President Cup for senior pool players at Sparta United Club. Source: https://www.confidentenamibia.com/ncsf-play-hosts-to-president-cup/',
  'tournament', '2025-07-04', '2025-07-04',
  'Sparta United Club, Walvis Bay', 'Erongo',
  '/sports/billiards-action.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'billiards-snooker-namibia')
),
(
  'NCSF Champ of Champs 2025',
  'ncsf-champ-of-champs-2025',
  'Season-ending Champ of Champs at King Cues (team + President''s Cup individuals); Namshooters champions. Source: https://www.namibiansun.com/sport-wrap-main/top-cueists-crowned-at-ncsf-champ-of-champs2025-12-05179141',
  'tournament', '2025-11-28', '2025-11-29',
  'King Cues, Windhoek', 'Khomas',
  '/sports/billiards-action.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'billiards-snooker-namibia')
),
(
  'NCSF Women''s Championship 2026',
  'ncsf-womens-champs-2026',
  'NCSF Women''s Championship Windhoek. Source: https://www.confidentenamibia.com/ncsf-play-hosts-to-president-cup/',
  'tournament', '2026-07-31', '2026-07-31',
  'Windhoek', 'Khomas',
  '/sports/billiards-action.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'billiards-snooker-namibia')
),
(
  'NCSF Masters Championship 2026',
  'ncsf-masters-champs-2026',
  'NCSF Masters Championship Windhoek. Source: https://www.confidentenamibia.com/ncsf-play-hosts-to-president-cup/',
  'tournament', '2026-08-28', '2026-08-28',
  'Windhoek', 'Khomas',
  '/sports/billiards-action.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'billiards-snooker-namibia')
),
(
  'NCSF Champ of Champs 2026',
  'ncsf-champ-of-champs-2026',
  'Namibia Champ of Champs 2026. Source: https://www.confidentenamibia.com/ncsf-play-hosts-to-president-cup/',
  'tournament', '2026-11-27', '2026-11-28',
  'Windhoek', 'Khomas',
  '/sports/billiards-action.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'billiards-snooker-namibia')
),

-- ===== Full-contact / RCFA (kickboxing-adjacent) =====
(
  'RCFA Namib War III 2025',
  'rcfa-namib-war-iii-2025',
  'International RCFA Namib War III at Wanderers (semi/full contact boxing, kicks, weapons); 126+ athletes. Source: https://www.kihapp.com/tournaments/19225-namib-war-iii ; https://www.republikein.com.na/sport-wrap-main/rcfa-namib-war-iii-set-to-ignite-windhoek2025-07-25164736',
  'tournament', '2025-07-25', '2025-07-26',
  'Wanderers Sports Club, Windhoek', 'Khomas',
  '/sports/martial-arts.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-full-contact-martial-arts')
),
(
  'RCFA Namib War IV 2026',
  'rcfa-namib-war-iv-2026',
  'International RCFA Namib War IV Championships. Source: https://www.kihapp.com/tournaments/25768-rcfa-namib-war-iv-2026',
  'tournament', '2026-10-09', '2026-10-10',
  'Wanderers Sports Club, Windhoek', 'Khomas',
  '/sports/martial-arts.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-full-contact-martial-arts')
),

-- ===== Ice & Inline Hockey =====
(
  'NIIHA Season Opener Otjiwarongo 2025',
  'niiha-otjiwarongo-2025',
  'First of five NIIHA tournaments in 2025 season (four clubs, 11 divisions). Source: https://www.namibian.com.na/namibian-inline-hockey-confirms-action-packed-calendar/',
  'tournament', '2025-03-20', '2025-03-20',
  'Otjiwarongo', 'Otjozondjupa',
  '/sports/ice-hockey.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-ice-inline-hockey')
),
(
  'NIIHA Championships 2025',
  'niiha-champs-2025',
  'NIIHA Championships at MTC Dome / Coastal Pirates. Source: https://niiha.com/calendar/niiha-champs-2/ ; https://kamikaze-inline.com/2025-namibian-championships/',
  'tournament', '2025-10-24', '2025-10-26',
  'MTC Dome, Swakopmund', 'Erongo',
  '/sports/ice-hockey.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-ice-inline-hockey')
),
(
  'NIIHA National Trials 2026',
  'niiha-national-trials-2026',
  'National trials — senior & junior men and ladies. Source: https://niiha.com/calendar/month/2026-02/',
  'training', '2026-02-06', '2026-02-08',
  'Namibia (NIIHA)', 'National',
  '/sports/ice-hockey.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-ice-inline-hockey')
),

-- ===== Taekwondo (international representation) + Paralympic =====
(
  'World Taekwondo African Open Series Maputo 2025 (Namibia)',
  'wt-african-open-maputo-2025',
  'Sibongile Mabuza made history for Namibia at African Open Series Maputo. Source: https://neweralive.na/namibias-taekwondo-federation-eyes-global-stage/',
  'competition', '2025-09-20', '2025-09-21',
  'Maputo, Mozambique', 'International',
  '/sports/taekwondo.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'taekwondo-namibia')
),
(
  'Gangwon Chuncheon World Para Taekwondo Open 2026 (Namibia)',
  'para-taekwondo-chuncheon-2026',
  'Namibia''s first World Taekwondo Para event participation after Windhoek camp. Source: https://www.republikein.com.na/sport-wrap-main/namibian-team-set-for-first-international-test-NMH013106-11-16119 ; https://neweralive.na/namibia-shine-at-taekwondo-development-camp-in-south-korea/',
  'competition', '2026-07-08', '2026-07-09',
  'Chuncheon, South Korea', 'International',
  '/sports/taekwondo.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-paralympic')
),
(
  'Para Fencing Development Camp Windhoek 2025',
  'para-fencing-camp-windhoek-2025',
  'Namibia Para Fencing Club camp with US DFF coach (FIE gear / first fencing wheelchair). Source: https://www.sportwrap.com.na/fencing-sw/namibia-parafencing-eyes-la28-paralympic-games2025-10-24174764',
  'training', '2025-10-14', '2025-10-26',
  'Windhoek', 'Khomas',
  '/sports/fencing.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-paralympic')
)
-- Able-bodied fencing: Easter Club Challenge was Gaborone; Windhoek end-April 2026 only "planned" — skipped.
ON CONFLICT (slug) DO NOTHING;
