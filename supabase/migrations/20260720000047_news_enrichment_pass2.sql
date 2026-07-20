-- WHY: Beta content hole — 35 published news linked to only 13 federations; most majors
-- (basketball, tennis, cycling, golf, etc.) still had 0 articles. Seeds 12 original
-- paraphrased pieces with /sports/* featured images for previously zero-news federations.
-- Sources attributed in content (New Era / The Namibian). Idempotent: ON CONFLICT (slug) DO NOTHING.
-- Evidence: docs/research/news_enrichment_batch.md (Pass 2)
-- Applied 2026-07-20.

INSERT INTO sportsplatform_news_articles
  (title, slug, summary, content, federation_id, category, tags, featured_image, is_published, published_at)
VALUES

-- 1. Basketball — FIBA Women's League Africa qualifiers
(
  'Unam Phoenix Fall Short at FIBA Women''s Africa Qualifiers',
  'unam-phoenix-fiba-africa-qualifiers-2025',
  'Namibia''s Unam Phoenix hosted FIBA Women''s Basketball League Africa Group E qualifiers in Windhoek but finished outside the two qualification places.',
  E'The Namibia Basketball Federation hosted the FIBA Women''s Basketball League Africa Group E qualifiers in Windhoek, with Unam Phoenix representing Namibia against Angola''s Sporting Clube de Luanda and Malawi''s Bravehearts.

Phoenix lost heavily to Luanda (98–52) before falling 58–55 to Bravehearts in a tight second match. Angola and Malawi took the two spots for the next stage. Coach Melusi Linda said the young Phoenix side showed growth despite missing out on qualification.

Original summary for sports.com.na. Source: https://neweralive.na/unam-phoenix-narrowly-miss-finals/',
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-basketball'),
  'basketball',
  ARRAY['NBF','Unam Phoenix','FIBA','women''s basketball'],
  '/sports/basketball-action.jpg',
  true,
  '2025-11-12 10:00:00'
),

-- 2. Cycling — Nedbank National Road Championships
(
  'Suren and Greeff Crowned Namibia Road Cycling Champions',
  'suren-greeff-nedbank-road-champs-2026',
  'Roger Suren and Anri Greeff won the Nedbank National Road Cycling Championships outside Windhoek.',
  E'Roger Suren and Anri Greeff claimed the Nedbank National Road Cycling Championship titles after racing outside Windhoek.

Suren (19) outsprinted defending champion Alex Miller to win the 165 km men''s race in 4:00:02 and take the national jersey, while Miller kept the elite men''s category. Greeff dominated the women''s 114 km race, finishing nearly five minutes ahead of Delsia Janse van Vuuren after also winning the individual time trial the day before.

Original summary for sports.com.na. Source: https://www.namibian.com.na/suren-greeff-namibias-cycling-champions/',
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-cycling'),
  'cycling',
  ARRAY['Namibian Cycling Federation','Nedbank','road racing','nationals'],
  '/sports/cycling.jpg',
  true,
  '2026-02-09 18:00:00'
),

-- 3. Table tennis — junior schools series
(
  'Record Entry Lights Up Junior Table Tennis Series Opener',
  'junior-table-tennis-record-entry-2026',
  'Eighty juniors contested the first Arysteq Simonis Storm Schools table tennis event of 2026 at Wanderers Sports Hall.',
  E'The opening tournament of the Arysteq Simonis Storm Schools series for 2026 drew a record 80 entries — 53 boys and 27 girls — across U11 to U19 categories at Wanderers Sports Hall in Pioneerspark on 13–14 March.

Organisers said it was the largest junior entry list yet and the first time junior table tennis in Namibia needed two full days of competition, reflecting growing participation ahead of the domestic season.

Original summary for sports.com.na. Source: https://www.namibian.com.na/record-entry-at-first-junior-table-tennis-tourney/',
  (SELECT id FROM sportsplatform_federations WHERE slug = 'table-tennis-namibia'),
  'table-tennis',
  ARRAY['NTTA','junior','schools','Wanderers'],
  '/sports/table-tennis.jpg',
  true,
  '2026-03-16 09:00:00'
),

-- 4. Tennis — Billie Jean King Cup Africa Group III
(
  'Namibia Women''s Tennis Remain in Billie Jean King Cup Group III',
  'namibia-bjk-cup-africa-group-iii-2026',
  'Namibia finished seventh at the Billie Jean King Cup Africa Group III event in Gaborone and avoided relegation.',
  E'Namibia''s women''s national tennis team finished seventh overall at the Billie Jean King Cup Africa Group III tournament in Gaborone, staying in the division after avoiding relegation.

Drawn in a tough group with Nigeria, Madagascar and Burundi, Namibia recovered with a 3–0 win over Burundi and later beat Cameroon 2–1 in placement play to secure seventh. New Namibia Tennis Association president Vekondja Kuzee said the young core leaves the team well placed to chase promotion in coming years.

Original summary for sports.com.na. Source: https://www.namibian.com.na/namibia-remain-in-africa-group-iii-3/',
  (SELECT id FROM sportsplatform_federations WHERE slug = 'tennis-namibia'),
  'tennis',
  ARRAY['NTA','Billie Jean King Cup','Fed Cup','women''s tennis'],
  '/sports/tennis.jpg',
  true,
  '2026-07-20 12:00:00'
),

-- 5. Golf — Namibian Open
(
  'Parker and Bredenhann Win Namibian Open Golf Titles',
  'parker-bredenhann-namibian-open-2026',
  'Todd Parker and Wilna Bredenhann were crowned champions of the Namibian Open at Windhoek Golf Club.',
  E'Todd Parker and Wilna Bredenhann won the men''s and women''s titles at the Namibian Open Golf Championship at Windhoek Golf Club.

Parker finished on 216, nine strokes clear of Edwin Kutara, sealing the win with a closing two-under-par 70 after studying in the United States and recently representing Namibia at the Africa Region 5 Golf Championships. Bredenhann took the women''s championship with a gross 174, two strokes ahead of Sesilia Nkosi.

Original summary for sports.com.na. Source: https://www.namibian.com.na/parker-bredenhann-win-namibian-open-titles/',
  (SELECT id FROM sportsplatform_federations WHERE slug = 'golf-namibia'),
  'golf',
  ARRAY['Namibia Golf Federation','Namibian Open','Windhoek Golf Club'],
  '/sports/golf.jpg',
  true,
  '2026-05-19 17:00:00'
),

-- 6. Wrestling — Spain Grand Prix / camp
(
  'Namibian Wrestlers Head to Spain for Grand Prix and Training Camp',
  'namibia-wrestlers-spain-grand-prix-2026',
  'Haimbodi, Nguatjiti and Uys travel to Madrid for the Grand Prix of Spain and a United World Wrestling camp.',
  E'Three of Namibia''s top wrestlers — Lazarus Haimbodi, Virinao Nguatjiti and Lafras Uys — travelled to Madrid for the 2026 Grand Prix of Spain and a week-long United World Wrestling training camp.

Accompanied by national head coach Luis Forcelledo Paz, the trip forms part of the Namibia Wrestling Federation high-performance path toward African Championships and Olympic qualification, supported by an NNOC Youth Development Grant. The federation also scheduled the Windhoek Open / National Championships at SKW Hall.

Original summary for sports.com.na. Source: https://www.namibian.com.na/top-wrestlers-off-to-spain/',
  (SELECT id FROM sportsplatform_federations WHERE slug = 'wrestling-namibia'),
  'wrestling',
  ARRAY['NWF','United World Wrestling','Olympic pathway','Spain'],
  '/sports/wrestling.jpg',
  true,
  '2026-07-10 11:00:00'
),

-- 7. Squash — Jarvis Cup
(
  'Namibia Men Finish Fourth in Jarvis Cup C Division',
  'namibia-squash-jarvis-cup-2026',
  'The Namibian men''s squash side finished fourth in the Jarvis Cup C Division in Mossel Bay.',
  E'Namibia''s men''s squash team finished fourth in the Jarvis Cup C Division in Mossel Bay after strong group wins over KwaZulu Natal B and SACD D, then narrow losses to Northerns C, SACD C and Western Province C.

Former Wanderers Squash Club chair Steven Berry said the results show clear improvement after an intensive training block from January, with Arno Diekmann, Danie Greeff, Francois Hanekom and others pushing top sides in deciding matches.

Original summary for sports.com.na. Source: https://www.namibian.com.na/namibian-squash-continues-to-grow/',
  (SELECT id FROM sportsplatform_federations WHERE slug = 'squash-namibia'),
  'squash',
  ARRAY['Namibia Squash','Jarvis Cup','Mossel Bay'],
  '/sports/squash.jpg',
  true,
  '2026-07-16 14:00:00'
),

-- 8. Judo — AUSC Region 5 Games
(
  'Region 5 Judo Games Bring Young Athletes to Windhoek',
  'region-5-judo-games-windhoek-2025',
  'Sixty junior judokas from eight Southern African countries competed at the AUSC Region 5 Judo Games in Windhoek.',
  E'The AUSC Region 5 Judo Games wrapped up at the Windhoek Showgrounds after three days of competition (8–10 July 2025), with 60 athletes — 26 girls and 34 boys — from eight Southern African countries.

Namibia Judo Federation president Keith Bock said hosting the regional event gave young Namibian judokas vital home exposure even as the sport seeks more support. Namibia finished seventh in the mixed team category, with Bock stressing the need to keep momentum for future campaigns.

Original summary for sports.com.na. Source: https://neweralive.na/judo-tournament-provides-exposure-to-young-athletes/',
  (SELECT id FROM sportsplatform_federations WHERE slug = 'judo-namibia'),
  'judo',
  ARRAY['NJF','AUSC Region 5','youth','Windhoek'],
  '/sports/judo.jpg',
  true,
  '2025-07-11 10:00:00'
),

-- 9. Gymnastics — Ekandjo World Championships
(
  'Emilia Ekandjo Qualifies for Rhythmic Gymnastics World Championships',
  'ekandjo-rhythmic-gymnastics-worlds-2026',
  'Namibian rhythmic gymnast Emilia Ekandjo booked a place at the 42nd Rhythmic Gymnastics World Championships.',
  E'Namibian rhythmic gymnast Emilia Ekandjo qualified for the 42nd Rhythmic Gymnastics World Championships (12–16 August), confirmed by the Namibian Gymnastics Federation.

Ekandjo said strong African Championships performances opened the door after years of balancing training, academics and injury recovery. She aims for clean routines and personal-best scores on ball and ribbon rather than chasing medals, and credited her coach, family and the federation for the breakthrough.

Original summary for sports.com.na. Source: https://neweralive.na/ekandjo-qualifies-for-rhythmic-gymnastics-world-championships/',
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-gymnastics'),
  'gymnastics',
  ARRAY['NGF','rhythmic gymnastics','World Championships','Ekandjo'],
  '/sports/gymnastics.jpg',
  true,
  '2026-07-01 09:00:00'
),

-- 10. Triathlon — Africa Junior Championships double gold
(
  'Chase and Brinkmann Sweep Africa Junior Triathlon Golds',
  'chase-brinkmann-africa-junior-triathlon-2026',
  'Nathan Chase and Maja Brinkmann both won gold at the Africa Junior Triathlon Championships in Cairo.',
  E'Nathan Chase and Maja Brinkmann made history by both winning gold at the Africa Junior Triathlon Championships in Cairo — the first time Namibia claimed both junior titles on the same day.

Chase won the junior men''s race in 58:34 after a strong bike and run; Brinkmann led from the swim to take the junior women''s title in 1:07:01. Coach Adele de la Rey praised the full squad, including James Langford, Matt Izaaks and others who finished outside the medals.

Original summary for sports.com.na. Source: https://www.namibian.com.na/a-great-day-for-namibian-sport/',
  (SELECT id FROM sportsplatform_federations WHERE slug = 'triathlon-namibia'),
  'triathlon',
  ARRAY['NTF','Africa Junior Championships','Chase','Brinkmann'],
  '/sports/triathlon.jpg',
  true,
  '2026-02-16 16:00:00'
),

-- 11. Chess — National Closed Championships
(
  'National Closed Chess Championships Set Olympiad Path',
  'namibia-national-closed-chess-2026',
  'The 2026 Namibia National Closed Chess Championships in Windhoek decided national titles and Olympiad selection.',
  E'The 2026 Namibia National Closed Chess Championships ran in Windhoek to crown national champions and select the five-player national team for the FIDE Chess Olympiad in Uzbekistan.

Favourites in the open section included International Master Dante Beukes and three-time defending champion FM Heskiel Ndahangwapo, with strong women''s contenders including WCM Jamie-Nicole Beukes and WFM Rauha Mulisa. Chief arbiter Lazarus Shatipamba highlighted rising junior talent in the field.

Original summary for sports.com.na. Source: https://neweralive.na/chess-players-battle-for-national-champ-title/',
  (SELECT id FROM sportsplatform_federations WHERE slug = 'chess-namibia'),
  'chess',
  ARRAY['Namibia Chess Federation','National Closed','Olympiad','FIDE'],
  '/sports/chess-tournament.jpg',
  true,
  '2026-02-26 11:00:00'
),

-- 12. Bowls — Commonwealth Games team inclusion
(
  'Bowls Quartet Named in Team Namibia for Glasgow 2026',
  'bowls-commonwealth-games-squad-2026',
  'Four lawn bowls athletes were selected in Namibia''s 23-athlete Commonwealth Games squad for Glasgow.',
  E'The Namibia National Olympic Committee named a 23-athlete Team Namibia for the 2026 Commonwealth Games in Glasgow, including a four-player bowls contingent.

Amanda Steenkamp, Diana Viljoen, Ronald Christo Steenkamp and Waylon Wentzel will compete for bowls, with Lesley Vermeulen as team manager and Axel Krahenbuhl as coach. The bowls selection sits alongside athletics, boxing, gymnastics, aquatics and para-athletics in Namibia''s eighth Commonwealth Games appearance.

Original summary for sports.com.na. Source: https://www.namibian.com.na/tough-act-to-follow-for-commonwealth-games-team/',
  (SELECT id FROM sportsplatform_federations WHERE slug = 'bowls-namibia'),
  'bowls',
  ARRAY['Bowls Namibia','Commonwealth Games','Glasgow 2026','NNOC'],
  '/sports/bowls.jpg',
  true,
  '2026-07-05 13:00:00'
)

ON CONFLICT (slug) DO NOTHING;
