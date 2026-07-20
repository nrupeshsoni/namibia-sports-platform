-- WHY: Correct mislinked / wrong-dated seed events against verified public sources
-- (NASFED calendar, Athletics Namibia calendar, NFA/RSSSF, EasyReg, press).
-- Does not invent fixtures. Source URLs embedded in descriptions (no source_url column).
-- Applied 2026-07-20. See docs/research/events_enrichment_batch.md.

-- ===== Mislinked federation =====
UPDATE sportsplatform_events e
SET
  federation_id = f.id,
  name = 'Bank Windhoek NASFED National Open Short Course Championships 2025',
  description = 'Namibia Aquatic Sports Federation (NASFED) short-course national championships at The Cube, Swakopmund. Eight Namibian SC records broken on opening day. Source: https://swimmingnamibia.com/wp-content/uploads/2025/08/NASFED-EVENT-CALENDAR-2025-2026.pdf ; https://neweralive.na/swimming-short-course-championship-kicks-off-in-swakopmund/',
  start_date = '2025-09-24',
  end_date = '2025-09-28',
  location = 'The Cube, Swakopmund',
  region = 'Erongo',
  type = 'competition',
  poster_url = '/sports/namibia-swimming.jpg',
  is_published = true,
  updated_at = now()
FROM sportsplatform_federations f
WHERE e.slug = 'swimming-nationals-2025'
  AND f.slug = 'swimming-namibia';

-- ===== Wrong marathon branding / date =====
UPDATE sportsplatform_events e
SET
  name = 'Vivo Energy Windhoek Marathon 2025',
  description = 'City of Windhoek / Vivo Energy community marathon (full, half, 10km, 5km). Proceeds support the Windhoek Residents Mayoral Trust. Source: https://www.easyreg.co.za/events/vivo-energy-windhoek-marathon-2025',
  start_date = '2025-05-24',
  end_date = '2025-05-24',
  location = 'Windhoek',
  region = 'Khomas',
  type = 'competition',
  is_published = true,
  updated_at = now()
WHERE e.slug = 'bw-marathon-2025';

-- ===== Athletics senior nationals 2025 (delayed to late August) =====
UPDATE sportsplatform_events e
SET
  name = 'Namibia Senior Track & Field Championships 2025',
  description = 'Athletics Namibia senior national championships at Independence Stadium. Originally scheduled for April; staged 30–31 August after stadium/weather delays. Source: https://de.wikipedia.org/wiki/Namibische_Leichtathletik-Meisterschaften_2025 ; https://www.thevillager.com.na/sports/2025/16-year-old-sets-national-record-at-national-athletics-championships/',
  start_date = '2025-08-30',
  end_date = '2025-08-31',
  location = 'Independence Stadium, Windhoek',
  region = 'Khomas',
  type = 'competition',
  is_published = true,
  updated_at = now()
WHERE e.slug = 'athletics-nationals-2025';

-- ===== u18/u20 nationals (calendar confirmed) =====
UPDATE sportsplatform_events e
SET
  name = 'Athletics Namibia U18 & U20 Championships 2026',
  description = 'National under-18 and under-20 track & field championships. Source: Athletics Namibia calendar https://athletics-namibia.com.na/wp-content/uploads/2026/04/AN-Calendar-Mar-26.pdf',
  start_date = '2026-04-17',
  end_date = '2026-04-18',
  location = 'Independence Stadium, Windhoek',
  region = 'Khomas',
  type = 'competition',
  is_published = true,
  updated_at = now()
WHERE e.slug = 'athletics-nationals-2026-main';

-- ===== Unverified June “nationals” seed — unpublish =====
UPDATE sportsplatform_events
SET
  description = COALESCE(description, '') || E'\n[UNVERIFIED SEED] June 2026 senior nationals date not found on Athletics Namibia March 2026 calendar; unpublished pending confirmation.',
  is_published = false,
  updated_at = now()
WHERE slug = 'national-athletics-2026';

-- ===== NPFL 2025/26 season window =====
UPDATE sportsplatform_events e
SET
  name = 'Namibia Premiership (NPFL) 2025/26',
  description = 'Top-tier Namibia Premiership Football League season. Kick-off 24 October 2025 after government funding; African Stars retained the title. Former Debmarine title sponsorship withdrawn. Source: https://namibiadailynews.info/namibias-top-football-league-to-begin-oct-24-after-govt-funding-boost/ ; https://en.wikipedia.org/wiki/2025%E2%80%9326_Namibia_Premiership ; https://www.rsssf.org/tablesn/nami2026.html',
  start_date = '2025-10-24',
  end_date = '2026-04-19',
  location = 'Various venues (Independence Stadium, regional stadiums)',
  region = 'National',
  type = 'competition',
  poster_url = '/sports/football-action.jpg',
  is_published = true,
  updated_at = now()
WHERE e.slug = 'npl-2025';

-- ===== Netball 2025 season window =====
UPDATE sportsplatform_events e
SET
  name = 'MTC Netball Namibia Premier League 2025',
  description = '2025 MTC NNPL domestic season; NCS crowned champions at Khomasdal. Source: https://www.namibian.com.na/new-challengers-as-mtc-netball-premier-league-returns/',
  start_date = '2025-05-31',
  end_date = '2025-10-04',
  location = 'Khomasdal Courts, Windhoek',
  region = 'Khomas',
  type = 'competition',
  poster_url = '/sports/netball.jpg',
  is_published = true,
  updated_at = now()
WHERE e.slug = 'netball-premier-2025';

-- ===== Misdated NNPL “playoffs” (season actually opens May 2026) =====
UPDATE sportsplatform_events
SET
  name = 'MTC Netball Namibia Premier League 2026 Opening Weekend',
  description = '2026 MTC NNPL season opens 2–4 May 2026 at Khomasdal Stadium (12 clubs including promoted sides). Source: https://neweralive.na/defending-champions-ncs-confident-mtc-nnpl-season-looms/ ; https://www.namibian.com.na/new-challengers-as-mtc-netball-premier-league-returns/',
  start_date = '2026-05-02',
  end_date = '2026-05-04',
  location = 'Khomasdal Stadium, Windhoek',
  region = 'Khomas',
  type = 'competition',
  poster_url = '/sports/netball.jpg',
  is_published = true,
  updated_at = now()
WHERE slug IN ('nnpl-playoffs-2026', 'netball-nnpl-playoffs-2026');

-- ===== Pedal Power WPP4 date (Matchless = 22 March, not February) =====
UPDATE sportsplatform_events
SET
  start_date = '2026-03-22',
  end_date = '2026-03-22',
  location = 'Matchless, Windhoek',
  region = 'Khomas',
  description = 'Round 4 of the 2026 Nedbank Windhoek Pedal Power Race Series at Matchless. Source: https://www.nedbank.com.na/group/news-insights/press/nedbank-namibia-champions-cycling-excellence---nedbank-namibia.html ; https://neweralive.na/windhoek-pedal-power-race-series-this-weekend/',
  is_published = true,
  updated_at = now()
WHERE slug IN ('nedbank-wpp4-2026', 'wpp4-matchless-2026');

-- ===== Enrich existing WPP rounds with sources =====
UPDATE sportsplatform_events
SET
  description = 'WPP2: Individual Time Trial (17 Jan) and Road Race (18 Jan), Teufelsschlucht area; 285 riders. Source: https://www.nedbank.com.na/group/news-insights/press/windhoek-pedal-power-race-series.html',
  location = 'Teufelsschlucht / Windhoek',
  region = 'Khomas',
  updated_at = now()
WHERE slug IN ('nedbank-wpp2-2026', 'wpp2-time-trial-2026');

UPDATE sportsplatform_events
SET
  description = 'WPP3 road race at Dobra Loops. Source: https://www.nedbank.com.na/group/news-insights/press/nedbank-namibia-champions-cycling-excellence---nedbank-namibia.html',
  location = 'Dobra Loops',
  region = 'Khomas',
  updated_at = now()
WHERE slug = 'nedbank-wpp3-2026';

UPDATE sportsplatform_events
SET
  description = 'WPP5 at Carin Park. Source: https://www.nedbank.com.na/group/news-insights/press/nedbank-namibia-champions-cycling-excellence---nedbank-namibia.html',
  location = 'Carin Park',
  region = 'Khomas',
  updated_at = now()
WHERE slug = 'nedbank-wpp5-2026';

UPDATE sportsplatform_events
SET
  name = 'Nedbank Windhoek Pedal Power Series WPP 6 (Finals)',
  description = 'Series finale at Kupferberg and Airport Highway (Route 2). Source: https://www.nedbank.com.na/group/news-insights/press/nedbank-namibia-champions-cycling-excellence---nedbank-namibia.html',
  location = 'Kupferberg / Airport Highway, Windhoek',
  region = 'Khomas',
  updated_at = now()
WHERE slug IN ('nedbank-wpp-finals-2026', 'wpp-finals-2026');

-- ===== NASFED LC nationals dates =====
UPDATE sportsplatform_events
SET
  name = 'Bank Windhoek NASFED Long Course National Championships 2026',
  description = 'NASFED long-course national championships at Olympia Swimming Pool, Windhoek. Source: https://swimmingnamibia.com/wp-content/uploads/2025/08/NASFED-EVENT-CALENDAR-2025-2026.pdf ; https://neweralive.na/swimmers-set-for-nationals/',
  start_date = '2026-02-19',
  end_date = '2026-02-22',
  location = 'Olympia Swimming Pool, Windhoek',
  region = 'Khomas',
  poster_url = '/sports/namibia-swimming.jpg',
  is_published = true,
  updated_at = now()
WHERE slug = 'nasfed-long-course-2026';

-- ===== Duplicate/wrong March “swimming nationals” → Infinity LC gala =====
UPDATE sportsplatform_events
SET
  name = 'Bank Windhoek NASFED Long Course Gala 4 (Infinity) 2026',
  description = 'NASFED LC Gala 4 hosted by Infinity at Olympia. Source: https://swimmingnamibia.com/wp-content/uploads/2025/08/NASFED-EVENT-CALENDAR-2025-2026.pdf',
  start_date = '2026-03-13',
  end_date = '2026-03-14',
  location = 'Olympia Swimming Pool, Windhoek',
  region = 'Khomas',
  poster_url = '/sports/namibia-swimming.jpg',
  is_published = true,
  updated_at = now()
WHERE slug = 'swimming-nationals-2026';

-- ===== Boxing nationals postponed window =====
UPDATE sportsplatform_events
SET
  name = 'Namibia National Boxing Championships 2026 (Keetmanshoop)',
  description = 'Junior and elite national boxing championships in Keetmanshoop; originally 12–14 March, staged 14–16 March 2026. Source: http://amateur-boxing.strefa.pl/Nationalchamps/Namibia2026.pdf',
  start_date = '2026-03-14',
  end_date = '2026-03-16',
  location = 'Keetmanshoop',
  region = '//Kharas',
  poster_url = '/sports/namibia-boxing.jpg',
  is_published = true,
  updated_at = now()
WHERE slug IN ('boxing-nationals-keetmanshoop-2026', 'boxing-nationals-2026');

-- ===== Newspaper Cup enrichment =====
UPDATE sportsplatform_events
SET
  description = '24th Nedbank Namibian Newspaper Cup — U20 football and netball from all 14 regions in Keetmanshoop. Source: https://nfa.org.na/keetmanshoop-ready-for-2026-nedbank-namibian-newspaper-cup/',
  location = 'Westdene Stadium / Keetmanshoop',
  region = '//Kharas',
  poster_url = '/sports/football.jpg',
  is_published = true,
  updated_at = now()
WHERE slug = 'nedbank-newspaper-cup-2026';

-- ===== Street Classic enrichment =====
UPDATE sportsplatform_events
SET
  name = 'Herman Davids Namibia Street Classic 2026 (Continental Tour Bronze)',
  description = 'World Athletics Continental Tour Bronze street event at Vegkop Stadium; Christine Mboma billed for women''s 60m. Source: https://www.nampa.org/text/22880051 ; Athletics Namibia calendar.',
  start_date = '2026-03-27',
  end_date = '2026-03-28',
  location = 'Vegkop Stadium, Windhoek',
  region = 'Khomas',
  is_published = true,
  updated_at = now()
WHERE slug = 'namibia-street-classic-2026';

-- ===== Triathlon Premium Cup enrichment =====
UPDATE sportsplatform_events
SET
  description = 'World Triathlon / Africa Triathlon Premium Cup sprint triathlon in Swakopmund. Source: https://events.triathlon.org/2026-africa-triathlon-premium-cup-swakopmund',
  location = 'Swakopmund',
  region = 'Erongo',
  is_published = true,
  updated_at = now()
WHERE slug IN ('africa-triathlon-premium-cup-2026', 'ntf-triathlon-premium-2026');

-- ===== ICC U19 co-host window (Namibia legs + tournament span) =====
UPDATE sportsplatform_events
SET
  description = 'ICC U19 Men''s Cricket World Cup 2026 co-hosted by Zimbabwe and Namibia (15 Jan–6 Feb). Namibia hosted 16 matches at Namibia Cricket Ground and HP Oval, Windhoek. Source: https://www.icc-cricket.com/media-releases/icc-u19-men-s-cricket-world-cup-schedule-announced',
  start_date = '2026-01-15',
  end_date = '2026-02-06',
  location = 'Namibia Cricket Ground & HP Oval, Windhoek',
  region = 'Khomas',
  poster_url = '/sports/cricket-action.jpg',
  is_published = true,
  updated_at = now()
WHERE slug = 'icc-u19-wc-2026-namibia';

-- ===== Hockey ACCC enrichment =====
UPDATE sportsplatform_events
SET
  description = 'Africa Cup of Club Champions — School of Excellence HC (Namibia outdoor men''s champions) competed in Harare. Source: https://neweralive.na/soehc-to-fly-namibias-flag-at-accc/',
  location = 'St John''s College, Harare, Zimbabwe',
  region = 'International',
  poster_url = '/sports/namibia-hockey.jpg',
  is_published = true,
  updated_at = now()
WHERE slug IN ('hockey-accc-2026', 'accc-hockey-harare-2026');

-- ===== Nujoma boxing 2026 enrichment =====
UPDATE sportsplatform_events
SET
  description = 'MTC Nestor Sunshine Tobias Academy tribute card; Mateus Heita WBO Africa featherweight defence billed at Windhoek Showgrounds. Source: https://neweralive.na/heita-to-co-headline-nujoma-tribute-boxing-bonanza/',
  location = 'Windhoek Showgrounds',
  region = 'Khomas',
  poster_url = '/sports/namibia-boxing.jpg',
  is_published = true,
  updated_at = now()
WHERE slug = 'nujoma-boxing-bonanza-2026';
