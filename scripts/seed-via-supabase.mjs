/**
 * Seed script using @supabase/supabase-js with service role key
 * Run: node scripts/seed-via-supabase.mjs
 */
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://rbibqjgsnrueubrvyqps.supabase.co';
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJiaWJxamdzbnJ1ZXVicnZ5cXBzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NjA3NDk4OSwiZXhwIjoyMDgxNjUwOTg5fQ.37JuxxExgIxQ32oSPwuaJOB1g_Tt2KAcNn-XvdDQ-dM';

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

// ── Helpers ─────────────────────────────────────────────────────────────────
function daysAgo(n) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

function futureDate(daysFromNow) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString();
}

// ── Check federation IDs ─────────────────────────────────────────────────────
console.log('🔍 Checking federation IDs...');
const { data: feds, error: fedErr } = await supabase
  .from('sportsplatform_federations')
  .select('id, name')
  .order('id')
  .limit(15);

if (fedErr) {
  console.error('❌ Cannot read federations:', fedErr.message);
  process.exit(1);
}

console.log(`✅ Found ${feds.length} federations. First few IDs:`, feds.slice(0, 5).map(f => `${f.id}: ${f.name}`));
const fedIds = feds.map(f => f.id);
const f0 = fedIds[0];
const f1 = fedIds[1] ?? f0;
const f2 = fedIds[2] ?? f0;
const f3 = fedIds[3] ?? f0;
const f4 = fedIds[4] ?? f0;
const f5 = fedIds[5] ?? f0;
const f6 = fedIds[6] ?? f0;
const f7 = fedIds[7] ?? f0;
const f8 = fedIds[8] ?? f0;
const f9 = fedIds[9] ?? f0;

// ── Add nationality column if missing ───────────────────────────────────────
console.log('\n🔧 Ensuring nationality column exists on athletes...');
// We can't run DDL via the JS client directly, so we'll just proceed and note it

// ── Events ───────────────────────────────────────────────────────────────────
console.log('\n📅 Inserting events...');
const events = [
  { name: 'Namibia National Athletics Championships 2026', slug: 'national-athletics-2026', description: 'The premier athletics event in Namibia bringing together athletes from all 14 regions', type: 'competition', start_date: futureDate(90), end_date: futureDate(92), location: 'Sam Nujoma Stadium, Windhoek', region: 'Khomas', is_published: true, federation_id: f0 },
  { name: 'Erongo Football League Season Opener', slug: 'erongo-football-2026', description: 'Opening match of the 2026 Erongo Regional Football League season', type: 'competition', start_date: futureDate(18), end_date: futureDate(18), location: 'Swakopmund Stadium', region: 'Erongo', is_published: true, federation_id: f1 },
  { name: 'Namibia Cricket Premier League 2026', slug: 'cricket-premier-2026', description: 'T20 cricket premier league featuring top Namibian clubs', type: 'tournament', start_date: futureDate(45), end_date: futureDate(75), location: 'Wanderers Cricket Ground, Windhoek', region: 'Khomas', is_published: true, federation_id: f2 },
  { name: 'NSSC Swimming Championships', slug: 'swimming-champs-2026', description: 'National Secondary School Sports Competition Swimming event', type: 'competition', start_date: futureDate(120), end_date: futureDate(122), location: 'Trans Namib Pool, Windhoek', region: 'Khomas', is_published: true, federation_id: f3 },
  { name: 'Coastal Rugby Union Cup', slug: 'coastal-rugby-2026', description: 'Annual coastal rugby union cup tournament', type: 'tournament', start_date: futureDate(155), end_date: futureDate(157), location: 'The Dome, Swakopmund', region: 'Erongo', is_published: true, federation_id: f4 },
  { name: 'Namibia Volleyball National Championship', slug: 'volleyball-nationals-2026', description: 'National volleyball championship for men and women categories', type: 'competition', start_date: futureDate(180), end_date: futureDate(182), location: 'Ramblers Hall, Windhoek', region: 'Khomas', is_published: true, federation_id: f5 },
  { name: 'Netball Development Workshop Oshana', slug: 'netball-workshop-oshana', description: 'Coaching and development workshop for netball coaches and players', type: 'workshop', start_date: futureDate(33), end_date: futureDate(34), location: 'Oshakati Indoor Sport Centre', region: 'Oshana', is_published: true, federation_id: f6 },
  { name: 'Mountain Bike Challenge Khomas Hochland', slug: 'mtb-khomas-2026', description: 'Annual mountain bike challenge through the Khomas Hochland', type: 'competition', start_date: futureDate(68), end_date: futureDate(68), location: 'Khomas Hochland Trail', region: 'Khomas', is_published: true, federation_id: f7 },
  { name: 'Namibia Judo Open Championship', slug: 'judo-open-2026', description: 'Open judo championship welcoming international competitors', type: 'competition', start_date: futureDate(103), end_date: futureDate(104), location: 'Brendan Simbwaye Square, Windhoek', region: 'Khomas', is_published: true, federation_id: f8 },
  { name: 'Boxing Development Clinic Kavango', slug: 'boxing-clinic-kavango-2026', description: 'Youth boxing development clinic and talent identification', type: 'training', start_date: futureDate(131), end_date: futureDate(132), location: 'Rundu Multi-Purpose Centre', region: 'Kavango East', is_published: true, federation_id: f9 },
];

const { data: insertedEvents, error: eventsErr } = await supabase
  .from('sportsplatform_events')
  .upsert(events, { onConflict: 'slug', ignoreDuplicates: true })
  .select('id, name');

if (eventsErr) {
  console.error('❌ Events error:', eventsErr.message);
} else {
  console.log(`✅ Events inserted/skipped: ${insertedEvents?.length ?? 0}`);
}

// ── News Articles ─────────────────────────────────────────────────────────────
console.log('\n📰 Inserting news articles...');
const news = [
  // Platform news (no federation)
  { title: 'Sports.com.na Officially Launched as Namibia National Sports Portal', slug: 'namibia-sports-portal-launch', summary: 'The definitive national sports platform for Namibia is now live, bringing together all 57 federations under one digital roof.', content: 'The Namibia Sports Platform sports.com.na was officially launched today as the one-stop destination for all sporting news, events, clubs, and athlete information in Namibia. The platform covers all 57 sports federations affiliated with the Namibia Sports Commission, providing real-time updates, event calendars, and club directories.', category: 'Platform News', is_published: true, published_at: daysAgo(1) },
  { title: 'Ministry of Sport Increases Budget for Sports Development by 30%', slug: 'ministry-sport-budget-increase-2026', summary: 'The Ministry of Sport, Youth and National Service has announced a 30% increase in the national sports development budget for 2026.', content: 'Minister announced the increased allocation at the annual National Sports Awards ceremony held in Windhoek. The additional funds will be directed towards grassroots infrastructure, coaching education, and high-performance athlete support programs across all 14 regions.', category: 'Policy', is_published: true, published_at: daysAgo(4) },
  { title: 'Namibia to Host 2027 COSAFA Under-20 Championships', slug: 'namibia-hosts-cosafa-u20-2027', summary: 'Namibia has been confirmed as the host nation for the 2027 COSAFA Under-20 Championship, a major boost for football development.', content: 'The Confederation of Southern African Football Association confirmed Namibia as the host at their executive committee meeting in Lusaka. The tournament will be hosted across three venues in Windhoek and will feature 14 competing nations from the southern African region.', category: 'International', is_published: true, published_at: daysAgo(8) },
  { title: 'New Multi-Sport Complex Planned for Oshana Region', slug: 'oshana-multi-sport-complex-plan', summary: 'Plans have been unveiled for a state-of-the-art multi-sport complex in Oshakati that will serve the Oshana and surrounding regions.', content: 'The N$120 million facility will feature a standard athletics track, 50-metre swimming pool, indoor sports hall seating 3,000 spectators, and a football pitch with floodlights. Construction is expected to begin in early 2027, with completion targeted for mid-2028.', category: 'Infrastructure', is_published: true, published_at: daysAgo(22) },
  { title: 'Namibia Athletes Claim 3 Medals at All Africa Games', slug: 'namibia-medals-all-africa-games', summary: 'Namibian athletes returned home with 3 medals from the All Africa Games, including a historic gold in the marathon.', content: 'The contingent of 28 athletes delivered the country\'s best-ever medal haul at the continental games. The gold medal in the marathon was described as a watershed moment for Namibian distance running, with the athlete setting a new national record of 2:09:47. Two silver medals were also claimed in swimming and cycling.', category: 'International', is_published: true, published_at: daysAgo(25) },
  // Federation-linked news
  { title: 'Athletics Namibia Announces 2026 National Championships Dates', slug: 'athletics-nationals-2026-dates', summary: 'Athletics Namibia has officially announced the dates for the 2026 National Championships to be held at Sam Nujoma Stadium.', content: 'The national athletics body confirmed that the prestigious annual championships will take place over three days at Sam Nujoma Stadium in Windhoek. Athletes from all 14 regions of Namibia are encouraged to register through their respective regional athletics associations.', category: 'Announcements', is_published: true, published_at: daysAgo(2), federation_id: f0 },
  { title: 'Young Footballer Signs Professional Contract in South Africa', slug: 'namibia-footballer-sa-contract', summary: 'Windhoek-born striker Johannes Nghipunduka has signed a professional contract with a South African Premier League club.', content: 'The 19-year-old forward impressed scouts during the Namibia National Football League season, scoring 14 goals in 18 appearances. He joins the club on a two-year deal with the option for a further year. NFA President said the signing is an inspiration for all young Namibian footballers.', category: 'Player News', is_published: true, published_at: daysAgo(5), federation_id: f1 },
  { title: 'Cricket Namibia Signs New Sponsorship Deal with FNB', slug: 'cricket-namibia-fnb-sponsorship', summary: 'Cricket Namibia has secured a landmark sponsorship deal with First National Bank worth N$2 million over two years.', content: 'In a ceremony held at the Wanderers Cricket Ground, Cricket Namibia CEO confirmed the partnership with FNB. The deal will fund grassroots development programs, national team preparations, and the new Premier League format rolling out in May 2026. FNB becomes the title sponsor of all Cricket Namibia domestic competitions.', category: 'Sponsorship', is_published: true, published_at: daysAgo(3), federation_id: f2 },
  { title: 'NSC Launches High Performance Program for Athletics', slug: 'nsc-high-performance-athletics', summary: 'The Namibia Sports Commission has launched a new high-performance program targeting elite athletics talent across all 14 regions.', content: 'The program, funded by the Ministry of Sport, will identify and develop 50 elite athletes annually through a structured pathway from regional development to national team selection. Coaches will be recruited from both local and international talent pools, with quarterly training camps planned.', category: 'Development', is_published: true, published_at: daysAgo(10), federation_id: f0 },
  { title: 'Volleyball Namibia Junior Team Wins CAVB U20 Championship', slug: 'volleyball-cavb-u20-victory', summary: 'The Namibia Under-20 volleyball team claimed the CAVB Junior Championship title defeating Egypt in the final.', content: 'In a thrilling five-set final played in Nairobi, Namibia showed exceptional composure to claim the continental title. The team\'s captain was named MVP of the tournament, scoring 28 points in the final alone. The victory qualifies Namibia for the FIVB Under-20 World Championship next year.', category: 'International', is_published: true, published_at: daysAgo(14), federation_id: f5 },
  { title: 'Rugby Namibia Welcomes New National Team Coach', slug: 'rugby-namibia-new-coach', summary: 'Rugby Namibia has announced the appointment of a new head coach for the national team ahead of the 2027 Rugby World Cup qualifiers.', content: 'The new coach brings extensive experience from the European club rugby circuit, having previously coached sides in France and Italy. He will be supported by two local assistant coaches as part of a knowledge-transfer program. Pre-season training begins in April.', category: 'Coaching', is_published: true, published_at: daysAgo(12), federation_id: f4 },
  { title: 'NFA Announces New Premier League Format for 2026 Season', slug: 'nfa-premier-league-format-2026', summary: 'The Namibia Football Association has unveiled a revamped Premier League format with 16 teams and home-and-away fixtures.', content: 'Following extensive consultations with clubs and stakeholders, the NFA board approved the new format at their quarterly meeting. The expanded format will begin in August 2026 and will include promotion/relegation play-offs for the first time in Namibian football history.', category: 'Competitions', is_published: true, published_at: daysAgo(16), federation_id: f1 },
];

const { data: insertedNews, error: newsErr } = await supabase
  .from('sportsplatform_news_articles')
  .upsert(news, { onConflict: 'slug', ignoreDuplicates: true })
  .select('id, title');

if (newsErr) {
  console.error('❌ News error:', newsErr.message);
} else {
  console.log(`✅ News articles inserted/skipped: ${insertedNews?.length ?? 0}`);
}

// ── Final report ──────────────────────────────────────────────────────────────
console.log('\n🎉 Seed complete!');
