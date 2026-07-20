-- WHY: Beta blocker — 23 published news across 8 federations with 0 featured images.
-- Seeds 12 original paraphrased articles (source URLs in content) spanning Big sports +
-- Olympic/Paralympic, each with a local /sports/* featured image. Also backfills
-- featured_image on existing rows so the Home/News strip is not image-less.
-- Idempotent: ON CONFLICT (slug) DO NOTHING; backfill only where featured_image IS NULL.
-- Evidence: docs/research/news_enrichment_batch.md
-- Applied 2026-07-20.

-- ===== Backfill featured images on existing published rows =====
UPDATE sportsplatform_news_articles
SET
  featured_image = CASE
    WHEN federation_id = (SELECT id FROM sportsplatform_federations WHERE slug = 'athletics-namibia') THEN '/sports/athletics.jpg'
    WHEN federation_id = (SELECT id FROM sportsplatform_federations WHERE slug = 'nfa') THEN '/sports/football.jpg'
    WHEN federation_id = (SELECT id FROM sportsplatform_federations WHERE slug = 'cricket-namibia') THEN '/sports/cricket.jpg'
    WHEN federation_id = (SELECT id FROM sportsplatform_federations WHERE slug = 'nru') THEN '/sports/namibia-rugby.jpg'
    WHEN federation_id = (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-volleyball') THEN '/sports/volleyball.jpg'
    WHEN federation_id = (SELECT id FROM sportsplatform_federations WHERE slug = 'nnoc') THEN '/sports/athletics-alt.jpg'
    WHEN federation_id = (SELECT id FROM sportsplatform_federations WHERE slug = 'swimming-namibia') THEN '/sports/swimming.jpg'
    WHEN federation_id IS NULL AND category ILIKE '%international%' THEN '/sports/football-action.jpg'
    WHEN federation_id IS NULL THEN '/sports/athletics.jpg'
    ELSE '/sports/football.jpg'
  END,
  updated_at = NOW()
WHERE featured_image IS NULL
  OR featured_image = '';

-- ===== Insert 12 new published articles =====
INSERT INTO sportsplatform_news_articles
  (title, slug, summary, content, federation_id, category, tags, featured_image, is_published, published_at)
VALUES

-- 1. Football — African Stars fourth NPFL title
(
  'African Stars Clinch Fourth Straight NPFL Title',
  'african-stars-fourth-npfl-title-2026',
  'African Stars FC sealed a fourth consecutive Namibia Premier Football League crown after finishing top of the 2025/26 table.',
  E'African Stars FC have been crowned 2025/26 Namibia Premier Football League champions, completing a fourth straight league title after finishing on 58 points.

A 2–0 win over FC Ongos at Independence Stadium on the final day kept Stars ahead of Eeshoke Chula Chula (57 points). The club’s run now spans the 2022/23 through 2025/26 seasons. Tigers FC, Rundu Chiefs and Life Fighters were relegated, while the top eight qualify for the Standard Bank Top 8 Cup.

This summary is an original paraphrase for sports.com.na. Source: https://neweralive.na/starlile-makes-it-4-in-a-row-young-brazilians-return-to-the-premier-league/',
  (SELECT id FROM sportsplatform_federations WHERE slug = 'nfa'),
  'football',
  ARRAY['NFA','NPFL','African Stars','league'],
  '/sports/football-action.jpg',
  true,
  '2026-07-14 10:00:00'
),

-- 2. Football — NFA Cup finals
(
  'UNAM FC and Mighty Gunners Ladies Lift NFA Cup Titles',
  'unam-fc-nfa-cup-champs-2026',
  'UNAM FC won the men’s NFA Cup final and NDF Mighty Gunners Ladies claimed the women’s title at Independence Stadium.',
  E'UNAM FC and NDF Mighty Gunners Ladies were the standout winners on NFA Cup finals day at Independence Stadium in Windhoek.

UNAM edged KK Palace 2–1 in the men’s final, while Mighty Gunners Ladies defeated Khomas Nampol 4–0 in the women’s decider, with Leena Alweendo scoring a first-half hat-trick. Okahandja United took men’s third place on penalties after a 2–2 draw with NDF Mighty Gunners.

Original summary for sports.com.na. Source: https://neweralive.na/unam-fc-ndf-mighty-gunners-ladies-crowned-nfa-cup-champs/',
  (SELECT id FROM sportsplatform_federations WHERE slug = 'nfa'),
  'football',
  ARRAY['NFA','NFA Cup','UNAM FC','women''s football'],
  '/sports/football.jpg',
  true,
  '2026-06-22 11:00:00'
),

-- 3. Rugby — Welwitschias vs Blue Bulls
(
  'Welwitschias Push Blue Bulls to the Wire in 50–47 Thriller',
  'welwitschias-blue-bulls-thriller-2026',
  'Namibia’s Welwitschias Invitational XV lost a high-scoring friendly 50–47 to the Vodacom Blue Bulls at Hage Geingob Stadium.',
  E'The Welwitschias Invitational XV pushed the Vodacom Blue Bulls to the final minutes before falling 50–47 in a rugby friendly at Hage Geingob Stadium in Windhoek.

The hosts mounted a strong second-half comeback after an earlier win over Zambia (71–12), but a late Blue Bulls try sealed the result. Coaches on both sides praised the competitiveness of the fixture as Namibia continues a rebuilding phase with a largely local-based squad.

Original summary for sports.com.na. Sources: https://www.we.com.na/sport-wrap-main/blue-bulls-edge-brave-welwitschias-in-97-point-thriller-NMH013511-11-16669 ; https://www.nbcnews.na/node/117742',
  (SELECT id FROM sportsplatform_federations WHERE slug = 'nru'),
  'rugby',
  ARRAY['NRU','Welwitschias','Blue Bulls','friendly'],
  '/sports/namibia-rugby-action.jpg',
  true,
  '2026-07-12 16:30:00'
),

-- 4. Cricket — T20 Tri-Nations sweep
(
  'Eagles Sweep T20 Tri-Nations After Dominating Nigeria',
  'eagles-t20-tri-nations-sweep-2026',
  'The FNB Namibian Eagles finished unbeaten atop a T20 Tri-Nations series, sealing the title with a big win over Nigeria.',
  E'The FNB Namibian Eagles wrapped up a T20 Tri-Nations series with an unbeaten record, beating Nigeria by 93 runs after posting 220/5 and restricting the visitors to 127/9.

Young batters featured prominently: Alex Volschenk scored 73 and Junior Taanyanda added 35, while captain Gerhard Erasmus contributed a quick 51. Coach Craig Williams highlighted Taanyanda’s series form after the teenager opened at senior international level for the first time. Namibia then prepared for a follow-on 50-over series against Nigeria.

Original summary for sports.com.na. Source: https://www.namibian.com.na/eagles-sweep-to-series-win/',
  (SELECT id FROM sportsplatform_federations WHERE slug = 'cricket-namibia'),
  'cricket',
  ARRAY['Cricket Namibia','Eagles','T20','Tri-Nations'],
  '/sports/cricket-action.jpg',
  true,
  '2026-07-08 12:00:00'
),

-- 5. Athletics — Glasgow squad names
(
  'Athletics Namibia Names Glasgow Commonwealth Track Contenders',
  'athletics-namibia-glasgow-squad-2026',
  'Athletics Namibia confirmed its track contingent for Team Namibia at the Glasgow 2026 Commonwealth Games.',
  E'Athletics Namibia will be represented at the Glasgow 2026 Commonwealth Games by Chenoul Lionel Coetzee, Elvis Khikhoe Gaseb, Charley Matundu and Ryan Williams, with coaching support announced alongside the national team.

The athletics group forms part of Team Namibia’s multi-code Commonwealth delegation competing from 23 July to 2 August 2026. Selection follows federation criteria approved through the Namibia National Olympic Committee process.

Original summary for sports.com.na. Sources: https://neweralive.na/namibia-announces-glasgow-squad/ ; https://economist.com.na/107239/sport/23-athletes-to-participate-in-the-upcoming-2026-glasgow-commonwealth-games/',
  (SELECT id FROM sportsplatform_federations WHERE slug = 'athletics-namibia'),
  'athletics',
  ARRAY['Athletics Namibia','Commonwealth Games','Glasgow 2026'],
  '/sports/athletics.jpg',
  true,
  '2026-07-10 09:00:00'
),

-- 6. Netball — Desert Jewels squad
(
  'Desert Jewels Squad Named for Zimbabwe Series and Africa Cup',
  'desert-jewels-squad-zimbabwe-africa-cup-2026',
  'Coach Julene Meyer named a 15-player Debmarine Desert Jewels squad for August Tests against Zimbabwe and the Africa Netball Cup in Kenya.',
  E'Head coach Julene Meyer has selected a 15-player Debmarine Desert Jewels squad after national trials in Windhoek, targeting a Test series against Zimbabwe in August at the MTC Dome in Swakopmund.

The Zimbabwe series is preparation for the Africa Netball Cup in Nairobi in September, which doubles as a pathway toward qualification for the 2027 Netball World Cup in Sydney. Meyer said the group blends experienced internationals with emerging talent across court positions.

Original summary for sports.com.na. Sources: https://neweralive.na/meyer-names-15-player-desert-jewels-squad-for-two-tough-test/ ; https://www.namibian.com.na/namibia-prepares-for-netball-world-cup-qualifier/',
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-netball'),
  'netball',
  ARRAY['Netball Namibia','Desert Jewels','World Cup qualifier'],
  '/sports/netball.jpg',
  true,
  '2026-07-16 08:30:00'
),

-- 7. Hockey — women’s SA series
(
  'Namibia Women Face South Africa in Cape Town Hockey Tests',
  'namibia-women-hockey-sa-series-2026',
  'A young Namibian women’s hockey squad travels to Cape Town for a four-match Test series against South Africa.',
  E'Namibia’s women’s hockey team is contesting a four-match Test series against South Africa in Cape Town (20–24 July 2026), with fixtures at Elkanah House High School and Hartleyvale Stadium.

Coach Trevor Cormack has called a youthful group mixing u18/u21 call-ups with senior internationals as Namibia builds toward the Africa Games. South Africa is using the series as World Cup preparation. Cormack said the assignment is tough but valuable exposure as Namibia aims to climb African rankings.

Original summary for sports.com.na. Sources: https://www.namibian.com.na/young-namibian-hockey-squad-to-face-sa/ ; https://gsport.co.za/cape-town-to-stage-south-africas-four-match-hockey-test-series-against-namibia/',
  (SELECT id FROM sportsplatform_federations WHERE slug = 'nhu'),
  'hockey',
  ARRAY['NHU','women''s hockey','South Africa','Tests'],
  '/sports/hockey.jpg',
  true,
  '2026-07-18 10:00:00'
),

-- 8. Boxing — Mischa Araes history
(
  'Mischa Araes Set to Become First Namibian Woman Boxer at Commonwealth Games',
  'mischa-araes-commonwealth-boxing-debut-2026',
  'Eighteen-year-old Mischa Araes is set to make history as Namibia’s first woman boxer at the Commonwealth Games in Glasgow.',
  E'Swakopmund boxer Mischa Monique Araes, 18, is poised to become the first Namibian woman to compete in boxing at the Commonwealth Games when Team Namibia takes to Glasgow from 23 July to 2 August 2026.

Araes joins a five-boxer Namibia contingent that also includes Philip Hoaseb, Gebhard Ipinge, Petrus Kotze and Tryagain Ndevelo. She has described the Games as a learning step toward a longer-term Olympic ambition rather than a moment for bold medal predictions.

Original summary for sports.com.na. Source: https://neweralive.na/young-araes-to-make-commonwealth-history/',
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-boxing'),
  'boxing',
  ARRAY['boxing','Commonwealth Games','Mischa Araes','women in sport'],
  '/sports/boxing.jpg',
  true,
  '2026-07-15 09:30:00'
),

-- 9. Olympic / NNOC — flag handover
(
  'President Hands Team Namibia the Flag Ahead of Glasgow 2026',
  'team-namibia-commonwealth-flag-handover-2026',
  'Team Namibia formally received the national flag at State House ahead of the Glasgow 2026 Commonwealth Games.',
  E'Team Namibia has received the national flag from President Netumbo Nandi-Ndaitwah at State House ahead of the Commonwealth Games in Glasgow (23 July–2 August 2026).

NNOC president Ndeulipula Hamutumwa and Chef de Mission Joseph Amakali emphasised discipline and preparation across the multi-code squad. Athletes including swimmer Jessica Humphrey and boxer Tryagain Ndevelo spoke about readiness for Namibia’s ninth Commonwealth Games appearance, with a delegation of roughly two dozen athletes plus officials.

Original summary for sports.com.na. Source: https://neweralive.na/team-namibia-set-for-commonwealth-games/',
  (SELECT id FROM sportsplatform_federations WHERE slug = 'nnoc'),
  'olympic',
  ARRAY['NNOC','Commonwealth Games','Team Namibia'],
  '/sports/swimming.jpg',
  true,
  '2026-07-17 14:00:00'
),

-- 10. Paralympic — Ananias Shikongo
(
  'Ananias Shikongo Selected for Commonwealth Para-Athletics in Glasgow',
  'shikongo-para-athletics-commonwealth-2026',
  'Paralympic sprint star Ananias Shikongo will represent Namibia in para-athletics at the Glasgow 2026 Commonwealth Games.',
  E'Ananias Shikongo has been named in Team Namibia’s para-athletics contingent for the Glasgow 2026 Commonwealth Games, working with competition guide Even Tjiviju.

His selection sits within the wider NNOC Commonwealth squad announcement covering athletics, boxing, bowls, gymnastics and swimming. The Games include an expanded integrated Para programme, giving Namibia another high-profile stage for disability sport excellence.

Original summary for sports.com.na. Sources: https://neweralive.na/namibia-announces-glasgow-squad/ ; https://economist.com.na/107239/sport/23-athletes-to-participate-in-the-upcoming-2026-glasgow-commonwealth-games/',
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-paralympic'),
  'paralympic',
  ARRAY['NPC','para-athletics','Ananias Shikongo','Commonwealth Games'],
  '/sports/athletics-alt.jpg',
  true,
  '2026-07-11 08:00:00'
),

-- 11. Rugby — Zambia win (context for rebuild)
(
  'New-Look Welwitschias Overwhelm Zambia 71–12 in Windhoek',
  'welwitschias-zambia-71-12-2026',
  'A rebuilt Welwitschias side opened its year with an emphatic 71–12 victory over Zambia, scoring 11 tries.',
  E'Namibia’s rebuilt Welwitschias opened their year with a commanding 71–12 win over Zambia, scoring 11 tries in a performance that showcased emerging local talent.

Fullback Jaylon Carew scored a hat-trick, with Adriaan Booysen among the other try-scorers. Assistant coach Darryl de la Harpe praised both starters and bench players, calling the display a foundation ahead of a tougher assignment against the Blue Bulls.

Original summary for sports.com.na. Source: https://www.namibian.com.na/welwitschias-overpower-zambia/',
  (SELECT id FROM sportsplatform_federations WHERE slug = 'nru'),
  'rugby',
  ARRAY['NRU','Welwitschias','Zambia','Test'],
  '/sports/namibia-rugby.jpg',
  true,
  '2026-06-29 18:00:00'
),

-- 12. NSC / national calendar context
(
  'Namibia’s 2026 Sports Calendar: Cricket Hosting, Glasgow and Dakar Youth Olympics',
  'namibia-2026-major-sports-calendar',
  'A look at Namibia’s major 2026 international sports milestones, from U19 cricket hosting to Commonwealth and Youth Olympic pathways.',
  E'Namibia’s 2026 sporting calendar features several landmark international moments. Cricket’s U19 World Cup hosting kicked off the year, while senior cricket lined up a busy slate of men’s and women’s internationals.

Looking ahead on the multi-sport stage, Team Namibia competes at the Glasgow Commonwealth Games (23 July–2 August), and the Youth Olympic Games in Dakar later in the year offer a pathway for emerging codes. Domestic football’s Brave Warriors remain focused on future AFCON qualification cycles after missing recent finals.

Original summary for sports.com.na (calendar overview; not a results claim). Source: https://www.namibian.com.na/major-sporting-events-for-2026/',
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-sports-commission'),
  'general',
  ARRAY['NSC','calendar','Commonwealth Games','Youth Olympics'],
  '/sports/cricket.jpg',
  true,
  '2026-01-08 09:00:00'
)

ON CONFLICT (slug) DO NOTHING;
