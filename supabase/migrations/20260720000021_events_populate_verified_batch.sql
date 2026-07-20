-- WHY: Insert verified Namibian sports events (2025–2026) missing from the calendar.
-- federation_id resolved by slug. Idempotent via ON CONFLICT (slug) DO NOTHING.
-- Sources documented in docs/research/events_enrichment_batch.md.
-- Applied 2026-07-20.

INSERT INTO sportsplatform_events
  (name, slug, description, type, start_date, end_date, location, region, poster_url, is_published, federation_id)
VALUES
-- ===== Cycling: Nedbank Desert Dash =====
(
  'Nedbank Desert Dash 2025',
  'nedbank-desert-dash-2025',
  '21st Nedbank Desert Dash — 401 km single-stage MTB endurance race Windhoek (Grove Mall) to Swakopmund (Platz Am Meer) within 24 hours. Source: https://www.nedbank.com.na/group/news-insights/press/nedbank-desert-dash.html ; https://www.desertdashnamibia.com/',
  'competition',
  '2025-12-05', '2025-12-06',
  'Grove Mall Windhoek → Platz Am Meer Swakopmund', 'Khomas / Erongo',
  NULL, true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-cycling')
),
(
  'Nedbank Desert Dash 2026',
  'nedbank-desert-dash-2026',
  '22nd Nedbank Desert Dash — 401 km Namib Desert MTB ultra (11–12 December 2026). Solo entries open 1 June 2026. Source: https://www.namibian.com.na/entries-to-open-for-the-2026-nedbank-desert-dash/ ; https://www.desertdashnamibia.com/',
  'competition',
  '2026-12-11', '2026-12-12',
  'Windhoek → Swakopmund (Namib Desert)', 'Khomas / Erongo',
  NULL, true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-cycling')
),

-- ===== Athletics: Red Run, marathons, road races =====
(
  'Bank Windhoek Red Run 2025',
  'bank-windhoek-red-run-2025',
  'Annual Bank Windhoek Red Run (5km / 10km / 21.1km) at Ramblers Sports Club. Source: https://www.bankwindhoek.com.na/Pages/News/The-Bank-Windhoek-Red-Run-is-back---N$-60,000-prize-money.aspx',
  'competition',
  '2025-08-09', '2025-08-09',
  'Ramblers Sports Club, Windhoek', 'Khomas',
  NULL, true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'athletics-namibia')
),
(
  'Bank Windhoek Red Run 2026',
  'bank-windhoek-red-run-2026',
  '2026 Bank Windhoek Red Run (5km / 10km / 21.1km) at Wanderers Sport Club; N$70,000 prize pool. Source: https://www.easyreg.co.za/events/bank-windhoek-red-run-2026 ; https://www.nampa.org/text/22932603 ; Athletics Namibia calendar.',
  'competition',
  '2026-08-01', '2026-08-01',
  'Wanderers Sport Club, Pioneerspark, Windhoek', 'Khomas',
  NULL, true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'athletics-namibia')
),
(
  'Vivo Energy Windhoek Marathon 2026',
  'vivo-windhoek-marathon-2026',
  'Vivo Energy Windhoek Marathon — City of Windhoek community race; entries closed 30 April 2026. Source: City of Windhoek LinkedIn announcement; EasyReg series.',
  'competition',
  '2026-05-23', '2026-05-23',
  'Windhoek', 'Khomas',
  NULL, true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'athletics-namibia')
),
(
  'Spar Ocean View Marathon 2026',
  'spar-ocean-view-marathon-2026',
  'Spar Ocean View Marathon, Swakopmund (Swakop Striders). Source: Athletics Namibia calendar https://athletics-namibia.com.na/wp-content/uploads/2026/04/AN-Calendar-Mar-26.pdf',
  'competition',
  '2026-02-07', '2026-02-07',
  'Swakopmund', 'Erongo',
  NULL, true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'athletics-namibia')
),
(
  'Rössing Marathon Championships 2026',
  'rossing-marathon-2026',
  'Rössing Marathon Championships, Swakopmund. Source: Athletics Namibia calendar March 2026 PDF.',
  'competition',
  '2026-03-07', '2026-03-07',
  'Swakopmund', 'Erongo',
  NULL, true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'athletics-namibia')
),
(
  'Bank Windhoek Senior Track & Field Championships 2026',
  'bank-windhoek-senior-athletics-2026',
  'Athletics Namibia senior national championships at Independence Stadium (Bank Windhoek title sponsor). Source: https://www.namibian.com.na/explosive-action-in-store-at-national-athletics-champs/ ; AN calendar 24–25 April 2026.',
  'competition',
  '2026-04-24', '2026-04-25',
  'Independence Stadium, Windhoek', 'Khomas',
  NULL, true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'athletics-namibia')
),
(
  'Sanlam Coastal Marathon 2026',
  'sanlam-coastal-marathon-2026',
  'Sanlam Coastal Marathon, Swakopmund (Swakop Striders). Source: Athletics Namibia calendar.',
  'competition',
  '2026-04-25', '2026-04-25',
  'Swakopmund', 'Erongo',
  NULL, true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'athletics-namibia')
),
(
  'NSSU National Athletics Championship 2025',
  'nssu-athletics-nationals-2025',
  'Namibia Schools Sport Union national athletics championship — 1,000+ athletes from all 14 regions. NSSU is not yet a federation row; linked to Athletics Namibia for sport coverage. Source: https://www.namibian.com.na/over-1-000-athletes-to-compete-in-nssu-national-athletics-championship-2025/',
  'competition',
  '2025-05-02', '2025-05-03',
  'Independence Stadium, Windhoek', 'Khomas',
  NULL, true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'athletics-namibia')
),
(
  'Husab Marathon 2026',
  'husab-marathon-2026',
  'Husab Marathon (Swakop Striders / Husab Mine Access). Source: Athletics Namibia calendar.',
  'competition',
  '2026-08-15', '2026-08-15',
  'Husab Mine Access, Erongo', 'Erongo',
  NULL, true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'athletics-namibia')
),
(
  'Navachab Half Marathon Challenge 2026',
  'navachab-half-marathon-2026',
  '12th Edition Navachab Half Marathon Challenge, Karibib. Source: Athletics Namibia calendar.',
  'competition',
  '2026-09-19', '2026-09-19',
  'Karibib', 'Erongo',
  NULL, true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'athletics-namibia')
),

-- ===== Football cups =====
(
  'Standard Bank Top 8 Cup 2026',
  'standard-bank-top-8-2026',
  'Standard Bank Top 8 Cup — NPFL top-eight knockout. Quarters Vineta Stadium Swakopmund (2–3 May), semis Outjo (9 May), final Independence Stadium Windhoek (23 May). Source: https://nfa.org.na/standard-bank-top-8-draw-sets-stage-for-exciting-knockout-action/ ; https://www.rsssf.org/tablesn/nami2026.html',
  'tournament',
  '2026-05-02', '2026-05-23',
  'Swakopmund / Outjo / Independence Stadium Windhoek', 'National',
  '/sports/football-action.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'nfa')
),

-- ===== School multi-sport (NSSU) — linked to NSC =====
(
  'Top Score National Elite Championships 2026',
  'top-score-nec-2026',
  'Inaugural Top Score National Elite Championships under NSSU — soccer, netball, hockey, rugby for elite schools (18 schools). Venue TBC in Windhoek. Source: https://www.namibian.com.na/elite-schools-sport-championship-launched/',
  'tournament',
  '2026-09-10', '2026-09-12',
  'Windhoek (venue TBC)', 'Khomas',
  NULL, true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-sports-commission')
),

-- ===== Aquatics OWS + Zone note =====
(
  'NASFED Open Water National Championships 2025',
  'nasfed-ows-nationals-2025',
  'Namibia open-water swimming national championships at Oanob. Source: NASFED Event Calendar 2025–2026 PDF.',
  'competition',
  '2025-11-29', '2025-11-30',
  'Oanob Dam', 'Hardap',
  '/sports/namibia-swimming.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'swimming-namibia')
),
(
  'NASFED Aquapentathlon 2026',
  'nasfed-aquapentathlon-2026',
  'NASFED Aquapentathlon (incl. World Aquatic Day programming) at Olympia. Source: NASFED Event Calendar 2025–2026 PDF.',
  'competition',
  '2026-04-11', '2026-04-11',
  'Olympia Swimming Pool, Windhoek', 'Khomas',
  '/sports/namibia-swimming.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'swimming-namibia')
),

-- ===== Boxing 2025 card =====
(
  'Tribute to Dr Sam Nujoma Boxing Bonanza 2025',
  'nujoma-boxing-bonanza-2025',
  'MTC Nestor Sunshine Academy card with WBO Africa title fights (Nghitumbwa, Heita, Ndjolonimus). Source: https://www.namibian.com.na/sunshine-finalises-tribute-to-nujoma-card/',
  'competition',
  '2025-04-12', '2025-04-12',
  'Windhoek Showgrounds / Ramatex', 'Khomas',
  '/sports/namibia-boxing.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-boxing')
),

-- ===== Golf =====
(
  'Namibian Open Golf Championship 2026',
  'namibian-open-golf-2026',
  'Namibian Open at Windhoek Golf Club; Todd Parker and Wilna Bredenhann crowned. Source: https://www.namibian.com.na/parker-bredenhann-win-namibian-open-titles/',
  'tournament',
  '2026-05-17', '2026-05-18',
  'Windhoek Golf Club', 'Khomas',
  NULL, true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'golf-namibia')
),
(
  'FNB Namibian Open Golf Championship 2025',
  'fnb-namibian-open-golf-2025',
  'FNB Namibian Open at Rössmund Golf Club near Swakopmund; Likius Nande overall champion. Source: https://www.az.com.na/sport-wrap-main/nande-haal-uit-en-wen-2025-namibiese-ope-titel2025-05-21157945',
  'tournament',
  '2025-05-17', '2025-05-18',
  'Rössmund Golf Club, Swakopmund', 'Erongo',
  NULL, true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'golf-namibia')
),

-- ===== Rugby =====
(
  'Welwitschias vs Vodacom Blue Bulls 2026',
  'welwitschias-blue-bulls-2026',
  'International friendly: Welwitschias Invitational XV vs Vodacom Blue Bulls at Hage Geingob Stadium (Blue Bulls won 50–47). Source: https://www.namibian.com.na/welwitschias-face-huge-blue-bulls-challenge/ ; https://www.we.com.na/sport-wrap-main/blue-bulls-edge-brave-welwitschias-in-97-point-thriller-NMH013511-11-16669',
  'competition',
  '2026-07-11', '2026-07-11',
  'Hage Geingob National Rugby Stadium, Windhoek', 'Khomas',
  '/sports/namibia-rugby-action.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'nru')
),

-- ===== Hockey domestic season markers =====
(
  'NHU Indoor Hockey Premier League Finals 2026',
  'nhu-indoor-hockey-finals-2026',
  'NHU Indoor Men''s Premier League final — Windhoek Old Boys retained title 7–3 vs School of Excellence; Saints won women''s league. Outdoor field league to follow. Source: https://www.namibian.com.na/old-boys-are-indoor-hockey-champions/',
  'competition',
  '2026-05-16', '2026-05-16',
  'Windhoek', 'Khomas',
  '/sports/namibia-hockey.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'nhu')
),

-- ===== Ministry / multi-sport awareness =====
(
  'Nedbank Namibian Newspaper Cup 2026 (Netball)',
  'nedbank-newspaper-cup-netball-2026',
  'Netball component of the 24th Nedbank Namibian Newspaper Cup in Keetmanshoop (all 14 regions). Football fixture listed separately under NFA. Source: https://nfa.org.na/keetmanshoop-ready-for-2026-nedbank-namibian-newspaper-cup/',
  'tournament',
  '2026-04-03', '2026-04-06',
  'Keetmanshoop', '//Kharas',
  '/sports/netball.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-netball')
)
ON CONFLICT (slug) DO NOTHING;
