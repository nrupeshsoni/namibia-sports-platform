-- Athletes fill — NBF Big-8 hole + zero-athlete majors (2026-07-21).
-- WHY: Live NBF athletes=0 despite Big-8 calendar/clubs; hollow Athletes tabs on
-- golf/badminton/powerlifting/MMA/kickboxing/handball/jukskei. Seeds verified
-- notables only (Wikipedia/FIBA/IMMAF/New Era/The Namibian/Economist/IHF/BCA).
-- Photos: sport-matched /athletes/* or /sports/* (no invented portraits).
-- Never fabricate contacts or event dates. Idempotent by name + federation.
-- Evidence: docs/research/hollow_federations_content_fill.md

INSERT INTO sportsplatform_athletes (
  first_name, last_name, slug, gender, photo_url, federation_id, nationality, achievements, is_active
)
SELECT * FROM (VALUES
  -- ===== NBF / KBA + BAL pathway (federation_id 36) =====
  ('Yaurovandu', 'Ndjavera', 'yaurovandu-ndjavera', 'male'::gender, '/sports/basketball.jpg', 36, 'Namibian',
   'UNAM Wolves forward; Lions BAL qualifier squad (2019) and UNAM Road to BAL roster. Source: https://en.wikipedia.org/wiki/UNAM_Wolves', true),
  ('Michael', 'Katoko', 'michael-katoko', 'male'::gender, '/sports/basketball.jpg', 36, 'Namibian',
   'UNAM Wolves / Lions guard; Road to BAL and KBA Premier League regular. Source: https://en.wikipedia.org/wiki/UNAM_Wolves', true),
  ('Allan', 'Nghixulifwa', 'allan-nghixulifwa', 'male'::gender, '/sports/basketball.jpg', 36, 'Namibian',
   'UNAM Wolves forward; also listed on Lions BAL qualifier roster. Source: https://en.wikipedia.org/wiki/Lions_B.C.', true),
  ('Mabeth', 'Kazeurua', 'mabeth-kazeurua', 'male'::gender, '/sports/basketball.jpg', 36, 'Namibian',
   'UNAM Wolves guard; Lions BAL qualifier squad member. Source: https://en.wikipedia.org/wiki/UNAM_Wolves', true),
  ('Michael', 'Mukumbutaa', 'michael-mukumbutaa', 'male'::gender, '/sports/basketball.jpg', 36, 'Namibian',
   'UNAM Wolves forward (Michael Popisi Mukumbutaa); Lions BAL qualifier; also listed on eFIBA Namibia squads. Source: https://en.wikipedia.org/wiki/UNAM_Wolves', true),
  ('Kautjeza', 'Tjirimuje', 'kautjeza-tjirimuje', 'male'::gender, '/sports/basketball.jpg', 36, 'Namibian',
   'UNAM Wolves / Lions guard; Road to BAL and KBA Premier League. Source: https://en.wikipedia.org/wiki/Lions_B.C.', true),
  ('Elijah', 'Hilukiluah', 'elijah-hilukiluah', 'male'::gender, '/sports/basketball.jpg', 36, 'Namibian',
   'UNAM Wolves forward on the club''s published Road to BAL roster. Source: https://en.wikipedia.org/wiki/UNAM_Wolves', true),
  ('Vetjitiraije', 'Kaunami', 'vetjitiraije-kaunami', 'male'::gender, '/sports/basketball.jpg', 36, 'Namibian',
   'UNAM Wolves point guard on the published club roster. Source: https://en.wikipedia.org/wiki/UNAM_Wolves', true),
  ('Kevin', 'Kazadi Muanza', 'kevin-kazadi-muanza', 'male'::gender, '/sports/basketball.jpg', 36, 'Namibian',
   'UNAM Wolves forward on the published Road to BAL roster. Source: https://en.wikipedia.org/wiki/UNAM_Wolves', true),
  ('Mevin', 'Mutakalilumo', 'mevin-mutakalilumo', 'male'::gender, '/sports/basketball.jpg', 36, 'Namibian',
   'UNAM Wolves forward on the published club roster. Source: https://en.wikipedia.org/wiki/UNAM_Wolves', true),
  ('Ellen', 'Melani', 'ellen-melani', 'male'::gender, '/sports/basketball.jpg', 36, 'Namibian',
   'UNAM Wolves centre on the published Road to BAL roster. Source: https://en.wikipedia.org/wiki/UNAM_Wolves', true),
  ('Petrus', 'Iyambo', 'petrus-iyambo', 'male'::gender, '/sports/basketball.jpg', 36, 'Namibian',
   'Lions Basketball Club player on the 2019 Road to BAL qualifier roster — Namibia''s first BAL pathway club. Source: https://en.wikipedia.org/wiki/Lions_B.C.', true),
  ('Joe', 'Banda', 'joe-banda', 'male'::gender, '/sports/basketball.jpg', 36, 'Namibian',
   'Lions Basketball Club player on the 2019 Road to BAL qualifier roster. Source: https://en.wikipedia.org/wiki/Lions_B.C.', true),
  ('Corbin', 'Prinzonsky', 'corbin-prinzonsky', 'male'::gender, '/sports/basketball.jpg', 36, 'Namibian',
   'Lions Basketball Club player on the 2019 Road to BAL qualifier roster. Source: https://en.wikipedia.org/wiki/Lions_B.C.', true),

  -- ===== Golf (NAGU) — federation_id 81 =====
  ('Likius', 'Nande', 'likius-nande', 'male'::gender, '/athletes/golf.jpg', 81, 'Namibian',
   'Namibia Amateur Golf Union standout; 2025 Gold Cup overall gross champion and Ongos Valley Windhoek Open winner. Source: https://neweralive.na/nande-shines-corner-butcher-elevates-gold-cup/', true),
  ('Todd', 'Parker', 'todd-parker', 'male'::gender, '/athletes/golf.jpg', 81, 'Namibian',
   '2026 Namibian Open overall best gross champion at Windhoek Golf Club (NAGU). Source: https://neweralive.na/parker-claims-2026-namibian-open-title/', true),
  ('Wilna', 'Bredenhann', 'wilna-bredenhann', 'female'::gender, '/athletes/golf.jpg', 81, 'Namibian',
   'Ladies overall best gross winner at the 2026 Namibian Open; Namibia women''s national amateur team member. Source: https://neweralive.na/parker-claims-2026-namibian-open-title/', true),
  ('Wensley', 'Haseb', 'wensley-haseb', 'male'::gender, '/athletes/golf.jpg', 81, 'Namibian',
   'Bank Windhoek Northern Open champion at Tsumeb Golf Club. Source: https://www.namibian.com.na/haseb-wins-northern-open/', true),
  ('Edwin', 'Kutara', 'edwin-kutara', 'male'::gender, '/athletes/golf.jpg', 81, 'Namibian',
   'Regular NAGU open contender; Namibian Open runner-up gross (2026) and Northern Open joint runner-up. Source: https://neweralive.na/parker-claims-2026-namibian-open-title/', true),
  ('Wilmari', 'Woest', 'wilmari-woest', 'female'::gender, '/athletes/golf.jpg', 81, 'Namibian',
   'Namibia women''s amateur international (Southern Regional All Africa Challenge Trophy squad). Source: https://www.namibian.com.na/regional-womens-golf-challenge-tees-off-in-windhoek/', true),

  -- ===== Badminton (BFN) — federation_id 79 =====
  ('Nino', 'Leicher', 'nino-leicher', 'male'::gender, '/sports/badminton.jpg', 79, 'Namibian',
   'Namibia national badminton squad (men''s singles/doubles pathway). Source: https://en.wikipedia.org/wiki/Namibia_national_badminton_team', true),
  ('Ronald', 'Neville', 'ronald-smith-neville', 'male'::gender, '/sports/badminton.jpg', 79, 'Namibian',
   'Namibia national badminton squad (listed as Ronald Smith Neville). Source: https://en.wikipedia.org/wiki/Namibia_national_badminton_team', true),
  ('Colbin', 'du Plessis', 'colbin-du-plessis', 'male'::gender, '/sports/badminton.jpg', 79, 'Namibian',
   'Namibia national badminton squad. Source: https://en.wikipedia.org/wiki/Namibia_national_badminton_team', true),
  ('Liza', 'Hanekom', 'liza-hanekom', 'female'::gender, '/sports/badminton.jpg', 79, 'Namibian',
   'Namibia national badminton women''s squad. Source: https://en.wikipedia.org/wiki/Namibia_national_badminton_team', true),
  ('Gesa', 'Jeske', 'gesa-jeske', 'female'::gender, '/sports/badminton.jpg', 79, 'Namibian',
   'Namibia national badminton women''s squad. Source: https://en.wikipedia.org/wiki/Namibia_national_badminton_team', true),
  ('Liezl', 'Maritz', 'liezl-maritz', 'female'::gender, '/sports/badminton.jpg', 79, 'Namibian',
   'Namibia national badminton women''s squad / veteran international. Source: https://en.wikipedia.org/wiki/Namibia_national_badminton_team', true),

  -- ===== Powerlifting (PWFN) — federation_id 46 =====
  ('Phillipus', 'Shangadi', 'phillipus-shangadi', 'male'::gender, '/sports/powerlifting.jpg', 46, 'Namibian',
   'Namibian powerlifter; podium at World Powerlifting Championship (Santa Catarina, Brazil) — overall third in category. Source: https://neweralive.na/shangadi-gets-bronze-in-brazil/', true),
  ('Melt', 'Meyer', 'melt-meyer', 'male'::gender, '/sports/powerlifting.jpg', 46, 'Namibian',
   'Namibian powerlifter; AWPC African Championships qualifier; national deadlift record holder (300 kg, 2024). Source: https://www.namibian.com.na/meyer-qualifies-for-african-championships/', true),
  ('Marius', 'Johannes', 'marius-johannes', 'male'::gender, '/sports/powerlifting.jpg', 46, 'Namibian',
   'PWFN president and competing powerlifter; Commonwealth Games bronze medallist (2017). Source: https://neweralive.na/pwfn-operating-zealously-on-laughable-budget/', true),

  -- ===== MMA Namibia — federation_id 106 =====
  ('Damian', 'Muller', 'damian-muller', 'male'::gender, '/sports/martial-arts-mma.jpg', 106, 'Namibian',
   'IMMAF African Championships flyweight champion (two-time); Hybrid Fitness / MMAN national pathway. Source: https://immaf.org/2024/06/01/immaf-african-championships-final-day-likobele-makes-immaf-history-damian-muller-and-anderson-gouveia-also-become-two-time-african-champions/', true),
  ('Veja', 'Hinda', 'veja-hinda', 'male'::gender, '/sports/martial-arts-mma.jpg', 106, 'Namibian',
   'Namibian MMA national standout mentored at Hybrid Fitness Centre (MMAN). Source: https://www.hybridfitnesscentre.com/', true),

  -- ===== Kickboxing — federation_id 98 =====
  ('Delano', 'Muller', 'delano-muller', 'male'::gender, '/sports/kickboxing.jpg', 98, 'Namibian',
   'Namibian kickboxing Sub-Saharan titleholder; main-stage winner at Desert Storm 5. Source: https://www.republikein.com.na/sport-wrap-main/m%C3%BCller-brothers-lead-the-charge-at-desert-storm-52024-07-03122525', true),
  ('Julian', 'Muller', 'julian-muller', 'male'::gender, '/sports/kickboxing.jpg', 98, 'Namibian',
   'Namibian kickboxing Sub-Saharan titleholder; Desert Storm 5 main-stage TKO win. Source: https://www.republikein.com.na/sport-wrap-main/m%C3%BCller-brothers-lead-the-charge-at-desert-storm-52024-07-03122525', true),

  -- ===== Handball — federation_id 39 =====
  ('Sakaria', 'Shikongo', 'sakaria-shikongo', 'male'::gender, '/sports/handball.jpg', 39, 'Namibian',
   'IHF-registered Namibian left wing with Karas Handball Club. Source: https://www.ihf.info/about/players/profiles/170439', true),

  -- ===== Jukskei — federation_id 96 =====
  ('Francois', 'Boshoff', 'francois-boshoff', 'male'::gender, '/sports/jukskei.jpg', 96, 'Namibian',
   'Namibia senior men''s jukskei international / captain in NSC-reported test matches vs South Africa (Kroonstad). Source: https://economist.com.na/96779/sport/senior-jukskei-teams-dominate-south-africa-in-international-test/', true),
  ('Elmarie', 'Horn', 'elmarie-horn', 'female'::gender, '/sports/jukskei.jpg', 96, 'Namibian',
   'Namibia senior women''s jukskei international / captain in NSC-reported tests vs South Africa. Source: https://economist.com.na/96779/sport/senior-jukskei-teams-dominate-south-africa-in-international-test/', true),
  ('Dries', 'Verwey', 'dries-verwey', 'male'::gender, '/sports/jukskei.jpg', 96, 'Namibian',
   'Namibia senior men''s jukskei international (NSC-reported Kroonstad tests). Source: https://economist.com.na/96779/sport/senior-jukskei-teams-dominate-south-africa-in-international-test/', true),
  ('Heleen', 'Steenkamp', 'heleen-steenkamp', 'female'::gender, '/sports/jukskei.jpg', 96, 'Namibian',
   'Namibia senior women''s jukskei international (NSC-reported tests vs South Africa). Source: https://economist.com.na/96779/sport/senior-jukskei-teams-dominate-south-africa-in-international-test/', true)
) AS v(first_name, last_name, slug, gender, photo_url, federation_id, nationality, achievements, is_active)
WHERE NOT EXISTS (
  SELECT 1 FROM sportsplatform_athletes a
  WHERE lower(a.first_name) = lower(v.first_name)
    AND lower(a.last_name) = lower(v.last_name)
    AND a.federation_id = v.federation_id
)
AND NOT EXISTS (
  SELECT 1 FROM sportsplatform_athletes a WHERE a.slug = v.slug
);

-- Link UNAM Wolves roster athletes to the existing club (no invented contacts)
UPDATE sportsplatform_athletes a
SET club_id = c.id, updated_at = now()
FROM sportsplatform_clubs c
WHERE c.slug = 'unam-wolves-basketball'
  AND a.federation_id = 36
  AND a.club_id IS NULL
  AND a.slug IN (
    'yaurovandu-ndjavera', 'michael-katoko', 'allan-nghixulifwa', 'mabeth-kazeurua',
    'michael-mukumbutaa', 'kautjeza-tjirimuje', 'elijah-hilukiluah', 'vetjitiraije-kaunami',
    'kevin-kazadi-muanza', 'mevin-mutakalilumo', 'ellen-melani'
  );
