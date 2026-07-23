-- News for hollow / thin federation News tabs (2026-07-21).
-- WHY: Jukskei (9 clubs, 0 news), badminton (0 news), MMA/kickboxing hollow
-- core-5, golf depth. Paraphrased originals with source URLs; /sports/* images.
-- Idempotent: ON CONFLICT (slug) DO NOTHING.
-- Evidence: docs/research/hollow_federations_content_fill.md

INSERT INTO sportsplatform_news_articles
  (title, slug, summary, content, federation_id, category, tags, featured_image, is_published, published_at)
VALUES

(
  'Senior Jukskei Teams Beat South Africa in Kroonstad Tests',
  'jukskei-namibia-senior-tests-kroonstad-sa',
  'NSC-reported Namibian senior men''s and women''s jukskei sides won multiple test matches against South Africa in Kroonstad.',
  E'Namibia''s senior men''s jukskei teams won all their test matches against South Africa in the over-50 and over-60 categories during International Test Matches in Kroonstad, the Namibia Sports Commission confirmed.

Namibian women''s sides also secured victories in two of their tests. Named senior men included captain Francois Boshoff alongside Dries Verwey, Johan Viljoen, Micheal Duvenhage and Marius Esterhuizen; the women''s group included captain Elmarie Horn with Heleen Steenkamp, Tienie Duvenhage, Petro Beyleveld and Elize Duvenhage.

Jukskei Namibia continues to promote the code as a family sport across western, northern and central regions.

Original summary for sports.com.na. Source: https://economist.com.na/96779/sport/senior-jukskei-teams-dominate-south-africa-in-international-test/',
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-jukskei'),
  'jukskei',
  ARRAY['NJF','jukskei','NSC','South Africa'],
  '/sports/jukskei.jpg',
  true,
  '2025-04-08 10:00:00'
),

(
  'Damian Muller Retains IMMAF African Flyweight Title in Windhoek',
  'mman-damian-muller-immaf-africa-flyweight-2024',
  'Hometown favourite Damian Muller became a two-time IMMAF African Championships flyweight champion as Namibia hosted the continental event.',
  E'Namibia''s Damian Muller retained his IMMAF African Championships flyweight crown in Windhoek, defeating South Africa''s Obakeng Mahura to become a two-time continental champion for Mixed Martial Arts Namibia (MMAN).

The 2024 African Championships were hosted in Windhoek with athletes from across the continent. Muller trains through the Hybrid Fitness Centre pathway associated with MMAN, Namibia''s IMMAF member federation.

Original summary for sports.com.na. Source: https://immaf.org/2024/06/01/immaf-african-championships-final-day-likobele-makes-immaf-history-damian-muller-and-anderson-gouveia-also-become-two-time-african-champions/',
  (SELECT id FROM sportsplatform_federations WHERE slug = 'mixed-martial-arts-namibia'),
  'mma',
  ARRAY['MMAN','IMMAF','Damian Muller','Windhoek'],
  '/sports/martial-arts-mma.jpg',
  true,
  '2024-06-01 18:00:00'
),

(
  'Muller Brothers Headline Desert Storm 5 Kickboxing Card',
  'nkbf-muller-brothers-desert-storm-5',
  'Delano and Julian Muller defended Sub-Saharan titles as Namibia Kickboxing Federation staged Desert Storm 5.',
  E'Delano Muller and Julian Muller headlined Desert Storm 5 for the Namibia Kickboxing Federation, both winning main-stage title fights — Delano on points against Zimbabwe''s Royal Tengezi and Julian by TKO against Isaac Klanga.

Federation president Anita de Klerk said the two-day Windhoek event was the federation''s first in two years and larger than expected, with jiu-jitsu and kickboxing divisions contested.

Original summary for sports.com.na. Source: https://www.republikein.com.na/sport-wrap-main/m%C3%BCller-brothers-lead-the-charge-at-desert-storm-52024-07-03122525',
  (SELECT id FROM sportsplatform_federations WHERE slug = 'namibia-kickboxing'),
  'kickboxing',
  ARRAY['NKBF','Desert Storm','Muller'],
  '/sports/kickboxing.jpg',
  true,
  '2024-07-03 12:00:00'
),

(
  'Lynn du Preez Honoured with African Women in Badminton Award',
  'bfn-lynn-du-preez-awiba-2021',
  'Badminton Confederation of Africa recognised Namibia federation president Lynn du Preez for sustaining badminton in Oranjemund.',
  E'The Badminton Confederation of Africa''s Gender Equity Commission selected Mrs Lynn du Preez of Namibia for the African Women in Badminton Award 2021.

Du Preez was elected president of the Badminton Federation of Namibia in 2021 and has long coached youth in Oranjemund, a remote mining town where much of Namibia''s organised badminton activity is concentrated. BCA noted her role in keeping the national federation active after a leadership resignation.

Original summary for sports.com.na. Source: https://badmintonafrica.com/05-june-2022/',
  (SELECT id FROM sportsplatform_federations WHERE slug = 'badminton-namibia'),
  'badminton',
  ARRAY['BFN','BCA','Lynn du Preez','Oranjemund'],
  '/sports/badminton.jpg',
  true,
  '2022-06-05 09:00:00'
),

(
  'Parker Claims 2026 Namibian Open Title at Windhoek Golf Club',
  'nagu-parker-namibian-open-2026',
  'Todd Parker took overall best gross at the NAGU Namibian Open; Wilna Bredenhann led the ladies'' gross division.',
  E'Todd Parker carded rounds of 77, 69 and 70 for 216 to win overall best gross at the 2026 Namibian Open hosted by Windhoek Golf Club under the Namibia Amateur Golf Union.

Edwin Kutara finished runner-up on 225. Wilna Bredenhann won the ladies'' overall best gross on 174 ahead of Sesilia Nkosi. NAGU president Toady Gurirab thanked NNOC, club management and sponsors for staging the 94-player event.

Original summary for sports.com.na. Source: https://neweralive.na/parker-claims-2026-namibian-open-title/',
  (SELECT id FROM sportsplatform_federations WHERE slug = 'golf-namibia'),
  'golf',
  ARRAY['NAGU','Namibian Open','Windhoek Golf Club'],
  '/sports/golf.jpg',
  true,
  '2026-05-18 11:00:00'
),

(
  'Shangadi Takes World Powerlifting Bronze in Brazil',
  'pwfn-shangadi-world-championships-brazil-bronze',
  'Phillipus Shangadi finished third overall in his category at the World Powerlifting Championship in Santa Catarina.',
  E'Namibian powerlifter Phillipus Shangadi earned an overall third-place finish at the World Powerlifting Championship in Santa Catarina, Brazil, also placing second in the biceps curl discipline.

Competing under full powerlifting conditions for the first time, Shangadi said standing on the podium with the Namibian flag was a highlight for a growing domestic powerlifting community aligned with PWFN pathways.

Original summary for sports.com.na. Source: https://neweralive.na/shangadi-gets-bronze-in-brazil/',
  (SELECT id FROM sportsplatform_federations WHERE slug = 'powerlifting-namibia'),
  'powerlifting',
  ARRAY['PWFN','Shangadi','World Championships'],
  '/sports/powerlifting.jpg',
  true,
  '2025-10-27 10:00:00'
)

ON CONFLICT (slug) DO NOTHING;
