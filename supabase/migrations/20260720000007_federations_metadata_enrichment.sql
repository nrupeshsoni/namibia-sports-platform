-- Federation metadata enrichment (abbreviations + thin descriptions).
-- WHY: Pre-batch audit showed 100% non-null fill for abbr/description/slug/type,
-- but ~62 descriptions were stub phrases ("National X federation") and many
-- 2-letter abbreviations collided (SN×6, BN×4, AN×3, etc.). Sibling agents own
-- logos/contacts/websites/socials — those columns are not touched here.
-- Sources: docs/research/metadata_enrichment_batch.md,
--          docs/research/federation-contacts-extracted.md (NSC Feb 2025),
--          docs/research/all_federations_research.csv
-- Applied remotely 2026-07-20 to project rbibqjgsnrueubrvyqps.
-- Filename 000007 (000006 reserved for contacts_enrichment sibling agent).

-- ===== Abbreviation uniqueness + official-name consistency =====

UPDATE sportsplatform_federations SET abbreviation = 'MSYNS', updated_at = now()
WHERE slug = 'ministry-sport';

UPDATE sportsplatform_federations SET abbreviation = 'AN', updated_at = now()
WHERE slug = 'athletics-namibia';
UPDATE sportsplatform_federations SET abbreviation = 'NFAA', updated_at = now()
WHERE slug = 'angling-namibia';
UPDATE sportsplatform_federations SET abbreviation = 'AAN', updated_at = now()
WHERE slug = 'archery-namibia';

UPDATE sportsplatform_federations SET abbreviation = 'NBA', updated_at = now()
WHERE slug = 'bowls-namibia';
UPDATE sportsplatform_federations SET abbreviation = 'BFN', updated_at = now()
WHERE slug = 'badminton-namibia';
UPDATE sportsplatform_federations SET abbreviation = 'NBB', updated_at = now()
WHERE slug = 'baseball-namibia';
UPDATE sportsplatform_federations SET abbreviation = 'NBodF', updated_at = now()
WHERE slug = 'bodybuilding-namibia';

UPDATE sportsplatform_federations SET abbreviation = 'NSA', updated_at = now()
WHERE slug = 'squash-namibia';
UPDATE sportsplatform_federations SET abbreviation = 'NSRF', updated_at = now()
WHERE slug = 'surfing-namibia';
UPDATE sportsplatform_federations SET abbreviation = 'NSAIL', updated_at = now()
WHERE slug = 'sailing-namibia';
UPDATE sportsplatform_federations SET abbreviation = 'NSB', updated_at = now()
WHERE slug = 'softball-namibia';
UPDATE sportsplatform_federations SET abbreviation = 'NSSF', updated_at = now()
WHERE slug = 'shooting-namibia';
UPDATE sportsplatform_federations SET abbreviation = 'NSU', updated_at = now()
WHERE slug = 'swimming-namibia';

UPDATE sportsplatform_federations SET abbreviation = 'CN', updated_at = now()
WHERE slug = 'cricket-namibia';
UPDATE sportsplatform_federations SET abbreviation = 'NChF', updated_at = now()
WHERE slug = 'chess-namibia';

UPDATE sportsplatform_federations SET abbreviation = 'NFF', updated_at = now()
WHERE slug = 'fencing-namibia';
UPDATE sportsplatform_federations SET abbreviation = 'FBN', updated_at = now()
WHERE slug = 'fistball-namibia';

UPDATE sportsplatform_federations SET abbreviation = 'NWL', updated_at = now()
WHERE slug = 'weightlifting-namibia';
UPDATE sportsplatform_federations SET abbreviation = 'NWR', updated_at = now()
WHERE slug = 'wrestling-namibia';

UPDATE sportsplatform_federations SET abbreviation = 'NClimb', updated_at = now()
WHERE slug = 'namibia-climbing';
UPDATE sportsplatform_federations SET abbreviation = 'NCan', updated_at = now()
WHERE slug = 'namibia-canoeing';

UPDATE sportsplatform_federations SET abbreviation = 'NTA', updated_at = now()
WHERE slug = 'tennis-namibia';
UPDATE sportsplatform_federations SET abbreviation = 'NTFN', updated_at = now()
WHERE slug = 'triathlon-namibia';

UPDATE sportsplatform_federations SET abbreviation = 'NPL', updated_at = now()
WHERE slug = 'powerlifting-namibia';
UPDATE sportsplatform_federations SET abbreviation = 'NPet', updated_at = now()
WHERE slug = 'petanque-namibia';

UPDATE sportsplatform_federations SET abbreviation = 'NAGU', updated_at = now()
WHERE slug = 'golf-namibia';
UPDATE sportsplatform_federations SET abbreviation = 'NAMEF', updated_at = now()
WHERE slug = 'equestrian-namibia';
UPDATE sportsplatform_federations SET abbreviation = 'NMSF', updated_at = now()
WHERE slug = 'motorsport-namibia';
UPDATE sportsplatform_federations SET abbreviation = 'NJDF', updated_at = now()
WHERE slug = 'judo-namibia';
UPDATE sportsplatform_federations SET abbreviation = 'NKF', updated_at = now()
WHERE slug = 'karate-namibia';
UPDATE sportsplatform_federations SET abbreviation = 'NASFED', updated_at = now()
WHERE slug = 'namibia-aquatics';
UPDATE sportsplatform_federations SET abbreviation = 'NTTA', updated_at = now()
WHERE slug = 'table-tennis-namibia';

-- ===== Thin description enrichment (stub / length < 50 only) =====

UPDATE sportsplatform_federations SET
  description = 'National governing body for athletics in Namibia (World Athletics member). Develops track and field, road running, and cross-country pathways.',
  updated_at = now()
WHERE slug = 'athletics-namibia' AND length(description) < 50;

UPDATE sportsplatform_federations SET
  description = 'National federation for freshwater and related angling disciplines in Namibia, recognised by the Namibia Sports Commission.',
  updated_at = now()
WHERE slug = 'angling-namibia' AND length(description) < 50;

UPDATE sportsplatform_federations SET
  description = 'National governing body for archery in Namibia (Archery of Namibia Association). Promotes target and field archery competition.',
  updated_at = now()
WHERE slug = 'archery-namibia' AND length(description) < 50;

UPDATE sportsplatform_federations SET
  description = 'National governing body for badminton in Namibia. Develops players and sanctions national championships under NSC recognition.',
  updated_at = now()
WHERE slug = 'badminton-namibia' AND length(description) < 50;

UPDATE sportsplatform_federations SET
  description = 'National governing body for baseball in Namibia. Focuses on youth development and competitive league play.',
  updated_at = now()
WHERE slug = 'baseball-namibia' AND length(description) < 50;

UPDATE sportsplatform_federations SET
  description = 'National federation for pool, billiards, and snooker in Namibia. Coordinates rankings and sanctioned tournaments.',
  updated_at = now()
WHERE slug = 'billiards-snooker-namibia' AND length(description) < 50;

UPDATE sportsplatform_federations SET
  description = 'National federation for bodybuilding and fitness physique sports in Namibia under NSC recognition.',
  updated_at = now()
WHERE slug = 'bodybuilding-namibia' AND length(description) < 50;

UPDATE sportsplatform_federations SET
  description = 'National governing body for lawn bowls in Namibia (Namibia Bowling Association). Organises national championships and club competitions.',
  updated_at = now()
WHERE slug = 'bowls-namibia' AND length(description) < 50;

UPDATE sportsplatform_federations SET
  description = 'National chess federation of Namibia (FIDE-aligned). Develops players, schools programmes, and national championships.',
  updated_at = now()
WHERE slug = 'chess-namibia' AND length(description) < 50;

UPDATE sportsplatform_federations SET
  description = 'National governing body for cricket in Namibia (ICC Associate Member). Brands as Cricket Namibia; home of the Eagles.',
  updated_at = now()
WHERE slug = 'cricket-namibia' AND length(description) < 50;

UPDATE sportsplatform_federations SET
  description = 'National equestrian federation of Namibia (NAMEF). Governs dressage, show jumping, eventing, and related disciplines.',
  updated_at = now()
WHERE slug = 'equestrian-namibia' AND length(description) < 50;

UPDATE sportsplatform_federations SET
  description = 'National fencing federation of Namibia. Develops foil, épée, and sabre athletes for national and regional competition.',
  updated_at = now()
WHERE slug = 'fencing-namibia' AND length(description) < 50;

UPDATE sportsplatform_federations SET
  description = 'National golf federation of Namibia (also associated with Namibia Amateur Golf Union). Oversees amateur golf and national rankings.',
  updated_at = now()
WHERE slug = 'golf-namibia' AND length(description) < 50;

UPDATE sportsplatform_federations SET
  description = 'National judo federation of Namibia (IJF pathway). Develops judoka and sanctions national competitions.',
  updated_at = now()
WHERE slug = 'judo-namibia' AND length(description) < 50;

UPDATE sportsplatform_federations SET
  description = 'National karate federation of Namibia. Promotes traditional and competitive karate under NSC recognition.',
  updated_at = now()
WHERE slug = 'karate-namibia' AND length(description) < 50;

UPDATE sportsplatform_federations SET
  description = 'National lacrosse federation of Namibia. Builds participation and competitive structures for the sport.',
  updated_at = now()
WHERE slug = 'lacrosse-namibia' AND length(description) < 50;

UPDATE sportsplatform_federations SET
  description = 'National motor sport federation of Namibia (NMSF). Sanctions circuit, rally, and related motorsport events.',
  updated_at = now()
WHERE slug = 'motorsport-namibia' AND length(description) < 50;

UPDATE sportsplatform_federations SET
  description = 'Namibia Aquatic Sports Federation (NASFED) — national body for swimming and aquatic sports, affiliated with World Aquatics.',
  updated_at = now()
WHERE slug = 'namibia-aquatics' AND length(description) < 50;

UPDATE sportsplatform_federations SET
  description = 'National basketball federation of Namibia (FIBA member pathway). Runs national leagues and youth development programmes.',
  updated_at = now()
WHERE slug = 'namibia-basketball' AND length(description) < 50;

UPDATE sportsplatform_federations SET
  description = 'National beach volleyball body in Namibia. Promotes beach volleyball competition alongside indoor volleyball structures.',
  updated_at = now()
WHERE slug = 'namibia-beach-volleyball' AND length(description) < 50;

UPDATE sportsplatform_federations SET
  description = 'Statutory boxing control body for Namibia. Regulates professional and amateur boxing licensing and safety standards.',
  updated_at = now()
WHERE slug = 'namibia-boxing' AND length(description) < 50;

UPDATE sportsplatform_federations SET
  description = 'National canoeing federation of Namibia. Develops sprint, marathon, and related paddle-sport pathways.',
  updated_at = now()
WHERE slug = 'namibia-canoeing' AND length(description) < 50;

UPDATE sportsplatform_federations SET
  description = 'National climbing federation of Namibia. Governs sport climbing, bouldering, and related competition pathways.',
  updated_at = now()
WHERE slug = 'namibia-climbing' AND length(description) < 50;

UPDATE sportsplatform_federations SET
  description = 'National cycling federation of Namibia (UCI member). Oversees road, MTB, and track development and national teams.',
  updated_at = now()
WHERE slug = 'namibia-cycling' AND length(description) < 50;

UPDATE sportsplatform_federations SET
  description = 'National darts association of Namibia. Organises leagues, rankings, and national championships.',
  updated_at = now()
WHERE slug = 'namibia-darts' AND length(description) < 50;

UPDATE sportsplatform_federations SET
  description = 'National football association of Namibia (FIFA and CAF member). Home of the Brave Warriors and Brave Gladiators.',
  updated_at = now()
WHERE slug = 'nfa' AND length(description) < 50;

UPDATE sportsplatform_federations SET
  description = 'National futsal federation of Namibia. Develops indoor football competition and national representation.',
  updated_at = now()
WHERE slug = 'namibia-futsal' AND length(description) < 50;

UPDATE sportsplatform_federations SET
  description = 'National gymnastics federation of Namibia. Covers artistic, rhythmic, and related gymnastics disciplines.',
  updated_at = now()
WHERE slug = 'namibia-gymnastics' AND length(description) < 50;

UPDATE sportsplatform_federations SET
  description = 'National handball federation of Namibia. Promotes indoor handball leagues and national team pathways.',
  updated_at = now()
WHERE slug = 'namibia-handball' AND length(description) < 50;

UPDATE sportsplatform_federations SET
  description = 'National field hockey union of Namibia (FIH member). Governs outdoor and indoor hockey for men and women.',
  updated_at = now()
WHERE slug = 'nhu' AND length(description) < 50;

UPDATE sportsplatform_federations SET
  description = 'National korfball federation of Namibia. Develops the mixed-team ball sport and local competitions.',
  updated_at = now()
WHERE slug = 'namibia-korfball' AND length(description) < 50;

UPDATE sportsplatform_federations SET
  description = 'Umbrella body coordinating local authority sports and recreation programmes across Namibian municipalities.',
  updated_at = now()
WHERE slug = 'nlas' AND length(description) < 50;

UPDATE sportsplatform_federations SET
  description = 'Umbrella body coordinating martial arts federations recognised under the Namibia Sports Commission.',
  updated_at = now()
WHERE slug = 'namibia-martial-arts' AND length(description) < 50;

UPDATE sportsplatform_federations SET
  description = 'National modern pentathlon federation of Namibia. Develops the multi-discipline Olympic sport pathway.',
  updated_at = now()
WHERE slug = 'namibia-modern-pentathlon' AND length(description) < 50;

UPDATE sportsplatform_federations SET
  description = 'National mountaineering federation of Namibia. Promotes mountaineering safety, training, and expeditions.',
  updated_at = now()
WHERE slug = 'namibia-mountaineering' AND length(description) < 50;

UPDATE sportsplatform_federations SET
  description = 'National students sports union coordinating tertiary-institution sport competition across Namibia.',
  updated_at = now()
WHERE slug = 'nnssu' AND length(description) < 50;

UPDATE sportsplatform_federations SET
  description = 'National netball federation of Namibia (World Netball pathway). Brands as Netball Namibia; home of the Desert Jewels.',
  updated_at = now()
WHERE slug = 'namibia-netball' AND length(description) < 50;

UPDATE sportsplatform_federations SET
  description = 'National orienteering federation of Namibia. Organises navigation-sport events and athlete development.',
  updated_at = now()
WHERE slug = 'namibia-orienteering' AND length(description) < 50;

UPDATE sportsplatform_federations SET
  description = 'National Paralympic Committee coordinating Paralympic sport pathways and Team Namibia Paralympic participation.',
  updated_at = now()
WHERE slug = 'namibia-paralympic' AND length(description) < 50;

UPDATE sportsplatform_federations SET
  description = 'National rugby union of Namibia (World Rugby member). Home of the Welwitschias; based at Hage Geingob Stadium.',
  updated_at = now()
WHERE slug = 'nru' AND length(description) < 50;

UPDATE sportsplatform_federations SET
  description = 'Umbrella sports body for Namibia''s uniformed forces and services personnel.',
  updated_at = now()
WHERE slug = 'nufs' AND length(description) < 50;

UPDATE sportsplatform_federations SET
  description = 'National volleyball federation of Namibia (FIVB pathway). Runs the National Volleyball League and national teams.',
  updated_at = now()
WHERE slug = 'namibia-volleyball' AND length(description) < 50;

UPDATE sportsplatform_federations SET
  description = 'Umbrella association promoting women''s participation, leadership, and equity across Namibian sport (NAWISA).',
  updated_at = now()
WHERE slug = 'nawisa' AND length(description) < 50;

UPDATE sportsplatform_federations SET
  description = 'National pétanque federation of Namibia. Promotes boules sport competition and club development.',
  updated_at = now()
WHERE slug = 'petanque-namibia' AND length(description) < 50;

UPDATE sportsplatform_federations SET
  description = 'National powerlifting federation of Namibia. Governs equipped and classic powerlifting competition pathways.',
  updated_at = now()
WHERE slug = 'powerlifting-namibia' AND length(description) < 50;

UPDATE sportsplatform_federations SET
  description = 'National roller sports federation of Namibia. Coordinates roller skating and related World Skate disciplines.',
  updated_at = now()
WHERE slug = 'roller-sports-namibia' AND length(description) < 50;

UPDATE sportsplatform_federations SET
  description = 'National rowing federation of Namibia. Develops sweep and sculling athletes for national and regional events.',
  updated_at = now()
WHERE slug = 'rowing-namibia' AND length(description) < 50;

UPDATE sportsplatform_federations SET
  description = 'National sailing association of Namibia. Promotes dinghy and yacht racing and coastal sailing development.',
  updated_at = now()
WHERE slug = 'sailing-namibia' AND length(description) < 50;

UPDATE sportsplatform_federations SET
  description = 'National sport shooting federation of Namibia. Governs target and related shooting disciplines and safety standards.',
  updated_at = now()
WHERE slug = 'shooting-namibia' AND length(description) < 50;

UPDATE sportsplatform_federations SET
  description = 'National skateboarding federation of Namibia. Develops street and park skateboarding competition pathways.',
  updated_at = now()
WHERE slug = 'skateboarding-namibia' AND length(description) < 50;

UPDATE sportsplatform_federations SET
  description = 'National softball federation of Namibia. Organises leagues and national championships for fastpitch softball.',
  updated_at = now()
WHERE slug = 'softball-namibia' AND length(description) < 50;

UPDATE sportsplatform_federations SET
  description = 'National squash association of Namibia (World Squash pathway). Hosts national opens and player rating systems.',
  updated_at = now()
WHERE slug = 'squash-namibia' AND length(description) < 50;

UPDATE sportsplatform_federations SET
  description = 'National surfing federation of Namibia. Promotes surfing competition and coastal surfing development.',
  updated_at = now()
WHERE slug = 'surfing-namibia' AND length(description) < 50;

UPDATE sportsplatform_federations SET
  description = 'Namibia Swimming Union — national swimming body working with aquatic sports structures (World Aquatics pathway).',
  updated_at = now()
WHERE slug = 'swimming-namibia' AND length(description) < 50;

UPDATE sportsplatform_federations SET
  description = 'National table tennis association of Namibia (ITTF member pathway). Focuses on schools leagues and regional representation.',
  updated_at = now()
WHERE slug = 'table-tennis-namibia' AND length(description) < 50;

UPDATE sportsplatform_federations SET
  description = 'National taekwondo federation of Namibia (World Taekwondo pathway). Develops athletes and sanctions national events.',
  updated_at = now()
WHERE slug = 'taekwondo-namibia' AND length(description) < 50;

UPDATE sportsplatform_federations SET
  description = 'National tennis association of Namibia (ITF member). Hosts Davis Cup ties and junior ITF/CAT circuit events.',
  updated_at = now()
WHERE slug = 'tennis-namibia' AND length(description) < 50;

UPDATE sportsplatform_federations SET
  description = 'Umbrella body preserving and promoting traditional and indigenous sports and games in Namibia (TISAN).',
  updated_at = now()
WHERE slug = 'tisan' AND length(description) < 50;

UPDATE sportsplatform_federations SET
  description = 'National triathlon association of Namibia (World Triathlon pathway). Develops swim-bike-run athletes and events.',
  updated_at = now()
WHERE slug = 'triathlon-namibia' AND length(description) < 50;

UPDATE sportsplatform_federations SET
  description = 'National ultimate (flying disc) federation of Namibia. Promotes ultimate frisbee leagues and national teams.',
  updated_at = now()
WHERE slug = 'ultimate-frisbee-namibia' AND length(description) < 50;

UPDATE sportsplatform_federations SET
  description = 'National weightlifting federation of Namibia. Develops Olympic weightlifting athletes and national championships.',
  updated_at = now()
WHERE slug = 'weightlifting-namibia' AND length(description) < 50;

UPDATE sportsplatform_federations SET
  description = 'National wrestling federation of Namibia (United World Wrestling pathway). Develops freestyle and related styles.',
  updated_at = now()
WHERE slug = 'wrestling-namibia' AND length(description) < 50;

-- Ministry / commission / NNOC short blurbs (still stub-length quality)
UPDATE sportsplatform_federations SET
  description = 'Government ministry responsible for sport, youth, and national service policy and development across Namibia.',
  updated_at = now()
WHERE slug = 'ministry-sport' AND length(description) < 70;

UPDATE sportsplatform_federations SET
  description = 'Statutory national sports commission coordinating recognition, governance, and development of Namibian sport federations.',
  updated_at = now()
WHERE slug = 'namibia-sports-commission' AND length(description) < 70;

UPDATE sportsplatform_federations SET
  description = 'Namibia National Olympic Committee (IOC-recognised). Coordinates Olympic sport preparation and Team Namibia at multi-sport Games.',
  updated_at = now()
WHERE slug = 'nnoc' AND length(description) < 60;
