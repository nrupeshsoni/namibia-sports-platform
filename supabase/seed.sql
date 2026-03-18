-- =============================================================================
-- Namibia Sports Platform — Seed Data
-- Database: Supabase PostgreSQL (rbibqjgsnrueubrvyqps)
-- Table prefix: sportsplatform_
--
-- Apply via:
--   bash scripts/apply-seed.sh
-- Or paste directly into Supabase SQL Editor at:
--   https://supabase.com/dashboard/project/rbibqjgsnrueubrvyqps/editor
--
-- All inserts use ON CONFLICT DO NOTHING for idempotency.
-- Federation IDs 23-32 must exist in sportsplatform_federations.
-- =============================================================================

-- ----------------------------------------------------------------
-- DB MIGRATION: Add nationality column to athletes table if needed
-- ----------------------------------------------------------------
ALTER TABLE sportsplatform_athletes
  ADD COLUMN IF NOT EXISTS nationality VARCHAR(100);

-- =============================================================================
-- EVENTS (10 sample events across federations 23-32)
-- =============================================================================
INSERT INTO sportsplatform_events
  (name, slug, description, type, start_date, end_date, location, region, is_published, federation_id)
VALUES
  (
    'Namibia National Athletics Championships 2026',
    'national-athletics-2026',
    'The premier athletics event in Namibia bringing together athletes from all 14 regions',
    'competition',
    '2026-06-15', '2026-06-17',
    'Sam Nujoma Stadium, Windhoek', 'Khomas',
    true, 23
  ),
  (
    'Erongo Football League Season Opener',
    'erongo-football-2026',
    'Opening match of the 2026 Erongo Regional Football League season',
    'competition',
    '2026-04-05', '2026-04-05',
    'Swakopmund Stadium', 'Erongo',
    true, 24
  ),
  (
    'Namibia Cricket Premier League',
    'cricket-premier-2026',
    'T20 cricket premier league featuring top Namibian clubs',
    'tournament',
    '2026-05-01', '2026-05-30',
    'Wanderers Cricket Ground, Windhoek', 'Khomas',
    true, 25
  ),
  (
    'NSSC Swimming Championships',
    'swimming-champs-2026',
    'National Secondary School Sports Competition Swimming event',
    'competition',
    '2026-07-10', '2026-07-12',
    'Trans Namib Pool, Windhoek', 'Khomas',
    true, 26
  ),
  (
    'Coastal Rugby Union Cup',
    'coastal-rugby-2026',
    'Annual coastal rugby union cup tournament',
    'tournament',
    '2026-08-20', '2026-08-22',
    'The Dome, Swakopmund', 'Erongo',
    true, 27
  ),
  (
    'Namibia Volleyball National Championship',
    'volleyball-nationals-2026',
    'National volleyball championship for men and women categories',
    'competition',
    '2026-09-15', '2026-09-17',
    'Ramblers Hall, Windhoek', 'Khomas',
    true, 28
  ),
  (
    'Netball Development Workshop Oshana',
    'netball-workshop-oshana',
    'Coaching and development workshop for netball coaches and players',
    'workshop',
    '2026-04-20', '2026-04-21',
    'Oshakati Indoor Sport Centre', 'Oshana',
    true, 29
  ),
  (
    'Mountain Bike Challenge Khomas Hochland',
    'mtb-khomas-2026',
    'Annual mountain bike challenge through the Khomas Hochland',
    'competition',
    '2026-05-25', '2026-05-25',
    'Khomas Hochland Trail', 'Khomas',
    true, 30
  ),
  (
    'Namibia Judo Open Championship',
    'judo-open-2026',
    'Open judo championship welcoming international competitors',
    'competition',
    '2026-06-28', '2026-06-29',
    'Brendan Simbwaye Square, Windhoek', 'Khomas',
    true, 31
  ),
  (
    'Boxing Development Clinic Kavango',
    'boxing-clinic-kavango-2026',
    'Youth boxing development clinic and talent identification',
    'training',
    '2026-07-18', '2026-07-19',
    'Rundu Multi-Purpose Centre', 'Kavango East',
    true, 32
  )
ON CONFLICT (slug) DO NOTHING;

-- =============================================================================
-- NEWS ARTICLES — Federation-linked (10 articles)
-- =============================================================================
INSERT INTO sportsplatform_news_articles
  (title, slug, summary, content, category, is_published, published_at, federation_id)
VALUES
  (
    'Athletics Namibia Announces 2026 National Championships Dates',
    'athletics-nationals-2026-dates',
    'Athletics Namibia has officially announced the dates for the 2026 National Championships to be held at Sam Nujoma Stadium.',
    'The national athletics body confirmed that the prestigious annual championships will take place from June 15–17, 2026 at Sam Nujoma Stadium in Windhoek. Athletes from all 14 regions of Namibia are encouraged to register through their respective regional athletics associations.',
    'Announcements', true, NOW() - INTERVAL '2 days', 23
  ),
  (
    'Cricket Namibia Signs New Sponsorship Deal with FNB',
    'cricket-namibia-fnb-sponsorship',
    'Cricket Namibia has secured a landmark sponsorship deal with First National Bank worth N$2 million over two years.',
    'In a ceremony held at the Wanderers Cricket Ground, Cricket Namibia CEO confirmed the partnership with FNB. The deal will fund grassroots development programs, national team preparations, and the new Premier League format rolling out in May 2026.',
    'Sponsorship', true, NOW() - INTERVAL '3 days', 25
  ),
  (
    'Young Footballer Signs Professional Contract in South Africa',
    'namibia-footballer-sa-contract',
    'Windhoek-born striker Johannes Nghipunduka has signed a professional contract with a South African Premier League club.',
    'The 19-year-old forward impressed scouts during the Namibia National Football League season, scoring 14 goals in 18 appearances. He joins the club on a two-year deal with the option for a further year.',
    'Player News', true, NOW() - INTERVAL '5 days', 24
  ),
  (
    'Namibia Swimmers Prepare for CANA Zone IV Championships',
    'swimmers-cana-zone-iv-prep',
    'The Namibia Swimming Federation has announced the squad that will represent Namibia at the CANA Zone IV Championships in Lusaka.',
    'Head coach announced a 12-member squad following intensive trials held in Windhoek. The team includes several junior stars making their senior international debut, alongside experienced campaigners who competed at the 2024 Paris Olympics.',
    'International', true, NOW() - INTERVAL '7 days', 26
  ),
  (
    'NSC Launches High Performance Program for Athletics',
    'nsc-high-performance-athletics',
    'The Namibia Sports Commission has launched a new high-performance program targeting elite athletics talent across all 14 regions.',
    'The program, funded by the Ministry of Sport, will identify and develop 50 elite athletes annually through a structured pathway from regional development to national team selection. Coaches will be recruited from both local and international talent pools.',
    'Development', true, NOW() - INTERVAL '10 days', 23
  ),
  (
    'Rugby Namibia Welcomes New National Team Coach',
    'rugby-namibia-new-coach',
    'Rugby Namibia has announced the appointment of a new head coach for the national team ahead of the 2027 Rugby World Cup qualifiers.',
    'The new coach brings extensive experience from the European club rugby circuit, having previously coached sides in France and Italy. He will be supported by two local assistant coaches as part of a knowledge-transfer program.',
    'Coaching', true, NOW() - INTERVAL '12 days', 27
  ),
  (
    'Volleyball Namibia Junior Team Wins CAVB U20 Championship',
    'volleyball-cavb-u20-victory',
    'The Namibia Under-20 volleyball team claimed the CAVB Junior Championship title defeating Egypt in the final.',
    'In a thrilling five-set final played in Nairobi, Namibia showed exceptional composure to claim the continental title. The team''s captain was named MVP of the tournament, scoring 28 points in the final alone.',
    'International', true, NOW() - INTERVAL '14 days', 28
  ),
  (
    'NFA Announces New Premier League Format for 2026 Season',
    'nfa-premier-league-format-2026',
    'The Namibia Football Association has unveiled a revamped Premier League format with 16 teams and home-and-away fixtures.',
    'Following extensive consultations with clubs and stakeholders, the NFA board approved the new format at their quarterly meeting. The expanded format will begin in August 2026 and will include promotion/relegation play-offs for the first time.',
    'Competitions', true, NOW() - INTERVAL '16 days', 24
  ),
  (
    'Cycling Namibia Hosts First International Stage Race',
    'cycling-international-stage-race-2026',
    'Cycling Namibia will host the inaugural Namibia International Stage Race from May 25–28, attracting teams from 8 African nations.',
    'The four-stage race will cover 420 km through the Khomas region and Erongo, showcasing Namibia''s stunning landscapes to international audiences. Prize money of N$500,000 will be distributed across stages and overall classifications.',
    'Events', true, NOW() - INTERVAL '18 days', 30
  ),
  (
    'Judo Open 2026: International Entries Pour In',
    'judo-open-2026-entries',
    'The upcoming Namibia Judo Open Championship has attracted entries from 15 countries, making it the most international edition yet.',
    'With over 200 athletes registered across 14 weight categories, the 2026 Judo Open promises to be a landmark event for Namibian combat sports. Competitors from South Africa, Botswana, Zimbabwe, Kenya, Tanzania, and as far afield as France and Brazil will participate.',
    'Events', true, NOW() - INTERVAL '20 days', 31
  )
ON CONFLICT (slug) DO NOTHING;

-- =============================================================================
-- NEWS ARTICLES — General platform news (5 articles, no federation)
-- =============================================================================
INSERT INTO sportsplatform_news_articles
  (title, slug, summary, content, category, is_published, published_at)
VALUES
  (
    'Sports.com.na Officially Launched as Namibia National Sports Portal',
    'namibia-sports-portal-launch',
    'The definitive national sports platform for Namibia is now live, bringing together all 57 federations under one digital roof.',
    'The Namibia Sports Platform sports.com.na was officially launched today as the one-stop destination for all sporting news, events, clubs, and athlete information in Namibia. The platform covers all 57 sports federations affiliated with the Namibia Sports Commission.',
    'Platform News', true, NOW() - INTERVAL '1 day'
  ),
  (
    'Ministry of Sport Increases Budget for Sports Development by 30%',
    'ministry-sport-budget-increase-2026',
    'The Ministry of Sport, Youth and National Service has announced a 30% increase in the national sports development budget for 2026.',
    'Minister announced the increased allocation at the annual National Sports Awards ceremony held in Windhoek. The additional funds will be directed towards grassroots infrastructure, coaching education, and high-performance athlete support.',
    'Policy', true, NOW() - INTERVAL '4 days'
  ),
  (
    'Namibia to Host 2027 COSAFA Under-20 Championships',
    'namibia-hosts-cosafa-u20-2027',
    'Namibia has been confirmed as the host nation for the 2027 COSAFA Under-20 Championship, a major boost for football development.',
    'The Confederation of Southern African Football Association confirmed Namibia as the host at their executive committee meeting in Lusaka. The tournament will be hosted across three venues in Windhoek and will feature 14 competing nations.',
    'International', true, NOW() - INTERVAL '8 days'
  ),
  (
    'New Multi-Sport Complex Planned for Oshana Region',
    'oshana-multi-sport-complex-plan',
    'Plans have been unveiled for a state-of-the-art multi-sport complex in Oshakati that will serve the Oshana and surrounding regions.',
    'The N$120 million facility will feature an athletics track, swimming pool, indoor sports hall, and football pitch. Construction is expected to begin in early 2027, with completion targeted for mid-2028.',
    'Infrastructure', true, NOW() - INTERVAL '22 days'
  ),
  (
    'Namibia Athletes Claim 3 Medals at All Africa Games',
    'namibia-medals-all-africa-games',
    'Namibian athletes returned home with 3 medals from the All Africa Games, including a historic gold in the marathon.',
    'The contingent of 28 athletes delivered the country''s best-ever medal haul at the continental games. The gold medal in the marathon was described as a watershed moment for Namibian distance running, with the athlete setting a new national record of 2:09:47.',
    'International', true, NOW() - INTERVAL '25 days'
  )
ON CONFLICT (slug) DO NOTHING;
