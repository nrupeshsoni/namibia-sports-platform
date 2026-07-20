-- WHY: Events pass 7 — deep-research fill for remaining zero-event federations
-- with verified dated 2025–26 public fixtures, plus Commonwealth Games upcoming
-- rows for bowls/boxing/gymnastics (named Team Namibia squads). Never invents
-- dates. Idempotent: ON CONFLICT (slug) DO NOTHING.
-- Applied 2026-07-21.

INSERT INTO sportsplatform_events
  (name, slug, description, type, start_date, end_date, location, region, poster_url, is_published, federation_id)
VALUES

-- ice-stock-namibia — IFI 11th Africa Cup (hosted by Icestocksport Association of Namibia)
(
  '11th Africa Cup Icestocksport (Windhoek)',
  'ifi-africa-cup-icestock-windhoek-2026',
  'IFI 11th Africa Cup (team game + target competition, women/men/youth) hosted in Windhoek by the Icestocksport Association of Namibia at the German Gymnastics and Sport Club (DTS), Sean McBride & Tennis Street, Olympia. Source: https://www.icestock.sport/en/event/afrika-cup-2026/ ; https://www.icestock.sport/wp-content/uploads/2026/02/S26AusDuH_Afrika-Cup_EN.pdf ; https://www.republikein.com.na/sport-wrap-main/windhoek-hosts-thrilling-african-championships-NMH013308-11-16371',
  'tournament', '2026-06-19', '2026-06-21',
  'German Gymnastics and Sport Club (DTS), Olympia, Windhoek', 'Khomas',
  '/sports/ice-stock.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'ice-stock-namibia')
),

-- namibia-footgolf — federation launch + coastal open day
(
  'FootGolf Namibia Official Launch',
  'footgolf-namibia-launch-2025',
  'Namibia FootGolf Federation officially launched FootGolf at Windhoek Golf Club (MTC Windhoek Golf Club), becoming the 57th NSC-recognised sports federation. Deputy Minister Dino Ballotti and African FootGolf Association leadership attended; interactive try-out session closed the day. Source: https://www.thevillager.com.na/sports/2025/namibia-launches-footgolf-as-a-new-sport-code/ ; https://www.az.com.na/sport-wrap-main/footgolf-tees-off-in-namibia2025-07-08162655',
  'other', '2025-07-07', '2025-07-07',
  'Windhoek Golf Club, Windhoek', 'Khomas',
  '/sports/golf.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-footgolf')
),
(
  'FootGolf Namibia Coastal Open Day (Rossmund)',
  'footgolf-namibia-coastal-open-day-2026',
  'FootGolf Namibia Federation open day at Rossmund Golf Course, Swakopmund — free beginner-friendly introduction with rules briefing and on-course demos; RSVP required by 24 Feb 2026. Source: https://neweralive.na/footgolf-namibia-to-host-coastal-open-day/',
  'workshop', '2026-02-28', '2026-02-28',
  'Rossmund Golf Course, Swakopmund', 'Erongo',
  '/sports/golf.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-footgolf')
),

-- nlas — NALASRA Local Authority Games (NLAS umbrella / NALASRA branding)
(
  'NALASRA Games 2025 (Katima Mulilo)',
  'nalasra-games-katima-mulilo-2025',
  '14th Namibia Local Authorities Sports and Recreation Association (NALASRA) Games — week-long multi-code competition for municipal/town/village councils (football, netball, volleyball, athletics and more). Opened by NSC Chief Administrator Freddy Simataa Mwiya; City of Windhoek finished overall champions. Source: https://www.nampa.org/text/22642563 ; https://neweralive.na/windhoek-scoops-naslara-games/',
  'tournament', '2025-05-26', '2025-05-30',
  'Katima Mulilo, Zambezi', 'Zambezi',
  '/sports/football-action.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'nlas')
),
(
  'NALASRA Games 2026 (Grootfontein)',
  'nalasra-games-grootfontein-2026',
  '15th NALASRA Local Authority Games at Omulunga Sports Stadium, Grootfontein — 25 May to 2 June 2026. Theme: Promoting unity and team spirit through sports, recreation and wellness. Codes include netball, volleyball, tug of war, soccer, pool, touch, marathon and fun walk; 35+ local authorities / 1,200+ participants reported. Source: https://www.nbcnews.na/node/116766 ; https://www.nbcnews.na/node/116818',
  'tournament', '2026-05-25', '2026-06-02',
  'Omulunga Sports Stadium, Grootfontein', 'Otjozondjupa',
  '/sports/football-action.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'nlas')
),

-- Upcoming: Commonwealth Games Glasgow 2026 — named Team Namibia squads (bowls / boxing / gymnastics)
(
  'Commonwealth Games Glasgow 2026 (Bowls)',
  'commonwealth-games-2026-bowls-namibia',
  'Namibia Lawn Bowls Association athletes Amanda Steenkamp, Diana Viljoen, Ronald Christo Steenkamp and Waylon Wentzel selected for Team Namibia at Glasgow 2026 (23 Jul–2 Aug); coach Axel Kranenbuhl, team manager Lesley Vermeulen. Source: https://economist.com.na/107239/sport/23-athletes-to-participate-in-the-upcoming-2026-glasgow-commonwealth-games/',
  'competition', '2026-07-23', '2026-08-02',
  'Glasgow, Scotland', 'International',
  '/sports/bowls.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'bowls-namibia')
),
(
  'Commonwealth Games Glasgow 2026 (Boxing)',
  'commonwealth-games-2026-boxing-namibia',
  'Namibia Boxing Federation boxers Mischa Monique Araes, Philip Pumulo Mutalela Hoaseb, Gebhard Tonateni Ipinge, Petrus Jacobus Kotze and Tryagain Morning Ndevelo selected for Team Namibia at Glasgow 2026 (23 Jul–2 Aug). Source: https://economist.com.na/107239/sport/23-athletes-to-participate-in-the-upcoming-2026-glasgow-commonwealth-games/',
  'competition', '2026-07-23', '2026-08-02',
  'Glasgow, Scotland', 'International',
  '/sports/boxing-action.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-boxing')
),
(
  'Commonwealth Games Glasgow 2026 (Gymnastics)',
  'commonwealth-games-2026-gymnastics-namibia',
  'Gymnastics Namibia athletes Sureshni Andrew, Anne-Leen Thorburn, Jonie Thorburn and Tyesha Humphries selected for Team Namibia at Glasgow 2026 (23 Jul–2 Aug); coach Petra Thorburn. Source: https://economist.com.na/107239/sport/23-athletes-to-participate-in-the-upcoming-2026-glasgow-commonwealth-games/',
  'competition', '2026-07-23', '2026-08-02',
  'Glasgow, Scotland', 'International',
  '/sports/gymnastics.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-gymnastics')
)

ON CONFLICT (slug) DO NOTHING;
