-- WHY: Beta content hole — after Pass 2, 58/83 active federations still had 0 news.
-- Seeds 12 original paraphrased pieces with /sports/* featured images for previously
-- zero-news federations. Sources attributed in content (New Era / The Namibian / NBC /
-- Confidente). Idempotent: ON CONFLICT (slug) DO NOTHING.
-- Evidence: docs/research/news_enrichment_batch.md (Pass 3)
-- Applied 2026-07-20.

INSERT INTO sportsplatform_news_articles
  (title, slug, summary, content, federation_id, category, tags, featured_image, is_published, published_at)
VALUES

-- 1. Handball — coastal regional tournament
(
  'Handball Regions Set for Swakopmund National Tournament',
  'handball-swakopmund-regional-tournament-2025',
  'The Namibia Handball Federation staged its third national regional tournament in Swakopmund as part of preparations for 2026 international competition.',
  E'The Namibia Handball Federation (NHF) hosted its third national regional tournament in Swakopmund, Erongo Region, from 10 to 13 September 2025.

President Issy Nakamwe said the four-day event was designed to strengthen regional structures, develop coaches and referees, and identify players for Namibia''s national programme ahead of a 2026 international championship in Lesotho. Handball only gained Namibia Sports Commission accreditation in 2021 and has since become one of the country''s fastest-growing codes, with IHF and NNOC support for coach and referee qualifications.

Original summary for sports.com.na. Source: https://www.confidentenamibia.com/regional-handball-tourney-set-coast',
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-handball'),
  'handball',
  ARRAY['NHF','Swakopmund','regional','development'],
  '/sports/handball.jpg',
  true,
  '2025-09-11 10:00:00'
),

-- 2. Karate — UFAK Region South Championships Angola
(
  'Namibia Karate Hauls 42 Medals and Team Kata Gold in Angola',
  'namibia-karate-ufak-angola-medals-2026',
  'Namibia won 42 medals at the 23rd UFAK Region South Karate Championships in Angola, capped by a first senior Team Kata title since 2019.',
  E'Namibia''s karate team collected 42 medals — four gold, 13 silver and 25 bronze — at the 23rd UFAK Region South Karate Championships in Angola from 14 to 17 May 2026.

The highlight was gold in the Male Team Kata division for Keanu Stuurman, Gino Sibattie and Dylan Grove, Namibia''s first senior Team Kata appearance since 2019. Officials said the haul reflects progress in African karate as the squad turns toward the African Championships later in the year.

Original summary for sports.com.na. Source: https://www.nbcnews.na/node/116773',
  (SELECT id FROM sportsplatform_federations WHERE slug = 'karate-namibia'),
  'karate',
  ARRAY['NKF','UFAK','Team Kata','Angola'],
  '/sports/karate.jpg',
  true,
  '2026-05-18 12:00:00'
),

-- 3. Beach volleyball — CAVB Zone VI Tour Windhoek
(
  'Namibia Hosts CAVB Zone VI Beach Volleyball Tour in Windhoek',
  'namibia-zone-vi-beach-volleyball-tour-2026',
  'The Namibia Volleyball Federation and DTS hosted the first leg of the CAVB Zone Six Beach Volleyball Tour at Olympia.',
  E'The Namibia Volleyball Federation (NVF), in partnership with Deutscher Turn- und Sportverein (DTS), hosted the first leg of the Confederation of African Volleyball (CAVB) Zone Six Beach Volleyball Tour from 20 to 22 February 2026 at the DTS Sports Grounds in Olympia, Windhoek.

Beach volleyball coordinator Heiko Kesselmann said ranking points from the tour feed the Olympic qualification cycle toward Los Angeles 2028 and continental age-group pathways. Athletes from about 10 southern African countries competed in one of Africa''s strongest beach volleyball regions.

Original summary for sports.com.na. Source: https://neweralive.na/namibia-stages-zone-vi-beach-volleyball-tour/',
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-beach-volleyball'),
  'beach-volleyball',
  ARRAY['NVF','CAVB','Zone VI','Olympic pathway'],
  '/sports/beach-volleyball.jpg',
  true,
  '2026-02-21 11:00:00'
),

-- 4. Taekwondo — first international medal
(
  'Mabuza Wins Namibia''s First International Taekwondo Medal',
  'mabuza-taekwondo-african-open-bronze-2025',
  'Twelve-year-old Sibongile Mabuza took bronze at the African Open Series in Maputo, then Namibia debuted at the World Championships in China.',
  E'Sibongile Mabuza (12) won bronze at the African Open Series in Maputo, Mozambique (20–21 September 2025) — Namibia''s first international taekwondo medal since the federation was established in 2022.

Building on that breakthrough, Owen Samunzala carried the Namibian flag at the 2025 Wuxi World Taekwondo Championships in China (24–30 October). Federation president Siegfried Veii-Mujoro said the results put a young code on the global stage despite limited resources, with longer-term aims including Commonwealth Games and Olympic pathways.

Original summary for sports.com.na. Source: https://neweralive.na/namibias-taekwondo-federation-eyes-global-stage/',
  (SELECT id FROM sportsplatform_federations WHERE slug = 'taekwondo-namibia'),
  'taekwondo',
  ARRAY['NTF','World Taekwondo','African Open','Mabuza'],
  '/sports/taekwondo.jpg',
  true,
  '2025-10-02 09:00:00'
),

-- 5. Motorsport — Weskus 4x4 Vasbyt season finale
(
  'Weskus 4x4 Vasbyt Closes Namibia Motorsport Season in Walvis Bay',
  'weskus-4x4-vasbyt-motorsport-finale-2025',
  'Sixteen teams, including South African visitors, contested the final 2025 motorsport leg in the Walvis Bay dunes.',
  E'The Weskus 4×4 Vasbyt wrapped up the 2025 Namibian motorsport calendar on 27 December at Walvis Bay, with 16 teams — including several from South Africa — tackling a technical dune layout.

Classes C and D produced local podiums led by Rico Bothma / Stoffel and Eben Janse van Rensburg / Liam Janse van Vuuren, while Izak and Johan Maritz topped the South Africa class. Organisers emphasised safety inspections and a more technical course than previous editions as teams arrived from Mariental, Windhoek and Otjiwarongo.

Original summary for sports.com.na. Source: https://www.namibian.com.na/weskus-4x4-vasbyt-wraps-up-2025-motorsport-season/',
  (SELECT id FROM sportsplatform_federations WHERE slug = 'motorsport-namibia'),
  'motorsport',
  ARRAY['NMSF','4x4','Walvis Bay','Vasbyt'],
  '/sports/motorsport.jpg',
  true,
  '2025-12-28 16:00:00'
),

-- 6. Equestrian — FEI World Jumping Challenge Swakopmund
(
  'NAMEF Stages FEI World Jumping Challenge Leg in Swakopmund',
  'fei-world-jumping-challenge-swakopmund-2026',
  'Namibia''s showjumpers competed under FEI-benchmark courses at Reiterverein Swakopmund from 29 to 31 May 2026.',
  E'The Namibia Equestrian Federation (NAMEF) hosted FEI World Jumping Challenge Leg 1 from 29 to 31 May 2026 at the Reiterverein Swakopmund grounds.

The three-day programme opened with Welcome Stakes, moved into the official FEI Leg 1 on Saturday, and closed with a final competition on Sunday. NAMEF said internationally accredited course design lets local riders on their own horses measure themselves against global standards without leaving Namibia — a rare development pathway for emerging equestrian nations.

Original summary for sports.com.na. Source: https://neweralive.na/nam-riders-eye-global-standards-at-fei-world-jumping-challenge/ ; https://www.namibiansun.com/sport-wrap-main/namibia-to-host-world-jumping-challenge-NMH009988-11-11723',
  (SELECT id FROM sportsplatform_federations WHERE slug = 'equestrian-namibia'),
  'equestrian',
  ARRAY['NAMEF','FEI','showjumping','Swakopmund'],
  '/sports/equestrian.jpg',
  true,
  '2026-05-30 14:00:00'
),

-- 7. Archery — Kambonde appointment / AGA Africa
(
  'Kambonde Takes Archery Reins Ahead of AGA African Tournament',
  'kambonde-archery-aga-botswana-2026',
  'Hilma Kambonde was named national archery head coach as Namibia prepared to defend continental titles in Botswana.',
  E'Hilma Kambonde was appointed head coach of Namibia''s national archery team ahead of the AGA African Federation Tournament in Botswana from 12 to 15 August.

Namibia enters as reigning AGA World Champions after a clean sweep at the 2025 AGA World Championship in Walvis Bay across Bullseye, 3D and Overall for both Development and National teams. Five African nations — Namibia, South Africa, Botswana, Zambia and Zimbabwe — were expected in Botswana, with athletes still relying heavily on community fundraising for travel.

Original summary for sports.com.na. Source: https://neweralive.na/kambonde-takes-charge-namibia-targets-african-archery-glory/',
  (SELECT id FROM sportsplatform_federations WHERE slug = 'archery-namibia'),
  'archery',
  ARRAY['Archery Namibia','AGA','Kambonde','Botswana'],
  '/sports/archery.jpg',
  true,
  '2026-07-08 10:00:00'
),

-- 8. Fencing — Easter Club Challenge Gaborone
(
  'Namibian Fencers Bring Home Three Bronzes from Gaborone',
  'namibia-fencing-gaborone-easter-bronzes-2026',
  'Coach Dillon Kotze and debutant Sebastian Botha earned bronze medals at the 2026 Easter Club Challenge in Botswana.',
  E'Namibian fencers won three bronze medals at the 2026 Easter Club Challenge on 28 March in Gaborone, hosted by Thobega Fencing Academy.

Coach Dillon Kotze took bronze in senior men''s épée after a 15–14 semi-final loss, while Sebastian Botha — in his first international competition — earned junior and cadet épée bronzes. The Namibia Fencing Federation said the results support a post-COVID rebuild, with plans for a local Windhoek competition alongside Namibian Para Fencing.

Original summary for sports.com.na. Source: https://neweralive.na/namibia-secures-bronze-in-gaborone/',
  (SELECT id FROM sportsplatform_federations WHERE slug = 'fencing-namibia'),
  'fencing',
  ARRAY['NFF','épée','Gaborone','development'],
  '/sports/fencing.jpg',
  true,
  '2026-03-30 11:00:00'
),

-- 9. Powerlifting — National Qualifier Championships
(
  'Powerlifting Nationals Set African and World Qualifying Path',
  'namibia-powerlifting-national-qualifier-2026',
  'The Namibia Powerlifting Association scheduled National Qualifier Championships at CrossFit Windhoek as the gateway to WPC Africa and Worlds.',
  E'The Namibia Powerlifting Association (NPA) scheduled its National Qualifier Championships for 25 July 2026 at CrossFit Windhoek, featuring squat, bench press and deadlift in full-power and single-lift formats.

Organisers said the event is the official qualification pathway to World Powerlifting Congress African and World Championships. Lifters expected to draw attention included Phillipus Shangadi, Melt Meyer and Marius Johannes, with entries closing 17 July and athletes invited from across Namibia.

Original summary for sports.com.na. Source: https://neweralive.na/national-powerlifting-showdown-awaits/',
  (SELECT id FROM sportsplatform_federations WHERE slug = 'powerlifting-namibia'),
  'powerlifting',
  ARRAY['NPA','WPC','nationals','CrossFit Windhoek'],
  '/sports/powerlifting.jpg',
  true,
  '2026-07-15 09:00:00'
),

-- 10. Bodybuilding — WFF African Championship Lusaka
(
  'Namibian Bodybuilders Claim Gold and Silver at WFF Africa',
  'namibia-bodybuilding-wff-africa-medals-2025',
  'Pedro Mututo won gold and Tshipanda Mbuyi silver as Namibia impressed at the WFF African Championship in Lusaka.',
  E'Four Namibian bodybuilding athletes returned from the World Fitness Federation (WFF) African Championship in Lusaka with gold and silver medals among more than 100 competitors from nine African countries.

Pedro Mututo took gold in men''s fitness bodybuilding, Tshipanda Mbuyi silver in men''s bodybuilding, Venomusheko Winfriend reached the top six in men''s bermuder, and WFF Namibia president Evaristor Gylgrister received an honorary gold. The federation flagged Cameroon''s Mr Universe as a next target and appealed for community support.

Original summary for sports.com.na. Source: https://neweralive.na/namibian-bodybuilders-claim-gold-silver/',
  (SELECT id FROM sportsplatform_federations WHERE slug = 'bodybuilding-namibia'),
  'bodybuilding',
  ARRAY['WFF Namibia','Lusaka','Mututo','Mbuyi'],
  '/sports/bodybuilding.jpg',
  true,
  '2025-11-10 13:00:00'
),

-- 11. Angling — Black Bass World Championships
(
  'Namibia Bass Anglers Compete at World Championships in Limpopo',
  'namibia-bass-angling-world-championships-2025',
  'Team Namibia represented the country at the XIX Black Bass World Championships at Arabie Dam in South Africa.',
  E'A Namibian bass angling squad competed at the XIX Black Bass World Championships at Arabie Dam in Limpopo, South Africa, after three months of map study and on-site practice.

Vice chairman Richard Grant of the Namibia Bass Angling Association called the World Championships the pinnacle of team bass angling and said the squad aimed for a podium after Namibia''s best prior results of regional silver and seventh at Worlds. Practice opened 1 September with three official tournament days before the closing ceremony; the association continues junior development and catch-and-release programmes at home.

Original summary for sports.com.na. Source: https://neweralive.na/namibian-bass-anglers-cast-for-glory-on-world-stage/',
  (SELECT id FROM sportsplatform_federations WHERE slug = 'angling-namibia'),
  'angling',
  ARRAY['bass angling','World Championships','Arabie Dam','NBAA'],
  '/sports/fishing.jpg',
  true,
  '2025-09-05 10:00:00'
),

-- 12. Darts — AUSC Region 5 youth haul
(
  'Youth Darts Team Returns with Five Medals from Region 5',
  'namibia-darts-region5-five-medals-2025',
  'Namibia''s junior darts side won two golds, three bronzes and the Best U/18 boys team trophy at AUSC Region 5 Youth Championships.',
  E'The Namibian youth darts team returned from the Bi-Annual African Union Sports Council (AUSC) Region 5 Youth Championships (26–29 August) with five medals — two gold and three bronze — plus the Best U/18 boys team trophy across six competing countries.

Namibia Darts Federation secretary general Ralph Ludwig praised the seven-player squad''s discipline and called the result a major milestone, while pointing to the 2027 championships in Mozambique and the need for stronger sponsorship to send a full 12-player team.

Original summary for sports.com.na. Source: https://neweralive.na/darts-team-collects-five-medals/',
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-darts'),
  'darts',
  ARRAY['NDF','AUSC Region 5','youth','medals'],
  '/sports/darts-action.jpg',
  true,
  '2025-09-02 12:00:00'
)

ON CONFLICT (slug) DO NOTHING;
