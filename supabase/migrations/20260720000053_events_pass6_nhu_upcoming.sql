-- WHY: Events pass 6 — verified NHU upcoming fixtures (SA women's four-match
-- test series Cape Town 20–24 Jul 2026 with dated kick-offs). Zero-event
-- federations re-hunted; no new dated 2025–27 public fixtures found (see
-- docs/research/events_enrichment_batch.md Pass 6). Never invents dates.
-- Idempotent: ON CONFLICT (slug) DO NOTHING.
-- Applied 2026-07-20.

INSERT INTO sportsplatform_events
  (name, slug, description, type, start_date, end_date, location, region, poster_url, is_published, federation_id)
VALUES

-- NHU — SA vs Namibia women's test series (Cape Town)
(
  'SA vs Namibia Women''s Hockey Test Series (Cape Town)',
  'nhu-sa-women-test-series-cape-town-2026',
  'Four-match women''s outdoor hockey test series hosted by South Africa in Cape Town as FIH World Cup preparation. Three tests at Elkanah House High School; final at Hartleyvale Stadium. Source: https://sahockey.co.za/2026/07/08/south-africa-to-host-namibia-in-womens-test-series-as-fih-world-cup-preparation-continues/ ; https://gsport.co.za/cape-town-to-stage-south-africas-four-match-hockey-test-series-against-namibia/',
  'tournament', '2026-07-20', '2026-07-24',
  'Elkanah House High School / Hartleyvale Stadium, Cape Town', 'International',
  '/sports/hockey.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'nhu')
),
(
  'Hockey Test 1: South Africa vs Namibia (Elkanah House)',
  'nhu-sa-namibia-women-test-1-2026-07-20',
  'Women''s outdoor hockey Test Match 1 — South Africa vs Namibia, 10:00 at Elkanah House High School, Cape Town. Source: https://sahockey.co.za/2026/07/08/south-africa-to-host-namibia-in-womens-test-series-as-fih-world-cup-preparation-continues/',
  'competition', '2026-07-20', '2026-07-20',
  'Elkanah House High School, Cape Town', 'International',
  '/sports/hockey-field.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'nhu')
),
(
  'Hockey Test 2: South Africa vs Namibia (Elkanah House)',
  'nhu-sa-namibia-women-test-2-2026-07-21',
  'Women''s outdoor hockey Test Match 2 — South Africa vs Namibia, 17:00 at Elkanah House High School, Cape Town. Source: https://sahockey.co.za/2026/07/08/south-africa-to-host-namibia-in-womens-test-series-as-fih-world-cup-preparation-continues/',
  'competition', '2026-07-21', '2026-07-21',
  'Elkanah House High School, Cape Town', 'International',
  '/sports/hockey-field.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'nhu')
),
(
  'Hockey Test 3: South Africa vs Namibia (Elkanah House)',
  'nhu-sa-namibia-women-test-3-2026-07-23',
  'Women''s outdoor hockey Test Match 3 — South Africa vs Namibia, 17:00 at Elkanah House High School, Cape Town. Source: https://sahockey.co.za/2026/07/08/south-africa-to-host-namibia-in-womens-test-series-as-fih-world-cup-preparation-continues/',
  'competition', '2026-07-23', '2026-07-23',
  'Elkanah House High School, Cape Town', 'International',
  '/sports/hockey-field.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'nhu')
),
(
  'Hockey Test 4: South Africa vs Namibia (Hartleyvale)',
  'nhu-sa-namibia-women-test-4-2026-07-24',
  'Women''s outdoor hockey Test Match 4 — South Africa vs Namibia, 14:00 at Hartleyvale Stadium, Cape Town. Source: https://sahockey.co.za/2026/07/08/south-africa-to-host-namibia-in-womens-test-series-as-fih-world-cup-preparation-continues/ ; https://gsport.co.za/cape-town-to-stage-south-africas-four-match-hockey-test-series-against-namibia/',
  'competition', '2026-07-24', '2026-07-24',
  'Hartleyvale Stadium, Cape Town', 'International',
  '/sports/hockey.jpg', true,
  (SELECT id FROM sportsplatform_federations WHERE slug = 'nhu')
)

ON CONFLICT (slug) DO NOTHING;
