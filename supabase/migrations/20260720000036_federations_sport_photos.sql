-- Agent PHOTOS — sport-correct federation background_image (hero/cover) paths
-- WHY: 31 active rows pointed at missing /sports/*.jpg (404); several Unsplash
-- URLs were wrong-sport (e.g. athletics→gym, netball→basketball, fencing→bowls).
-- Prefer local named assets under client/public/sports/; null over wrong.
-- Logos/crests remain owned by Agent LOGOS (do not overwrite /logos/* here).
-- Evidence: docs/research/federation_photos_batch.md

-- ===== Majors (Namibia-specific or verified sport-correct) =====

UPDATE sportsplatform_federations
SET background_image = '/sports/namibia-football.jpg', updated_at = now()
WHERE slug = 'nfa';

UPDATE sportsplatform_federations
SET background_image = '/sports/namibia-rugby-action.jpg', updated_at = now()
WHERE slug = 'nru';

UPDATE sportsplatform_federations
SET background_image = '/sports/namibia-cricket.jpg', updated_at = now()
WHERE slug = 'cricket-namibia';

UPDATE sportsplatform_federations
SET background_image = '/sports/athletics.jpg', updated_at = now()
WHERE slug = 'athletics-namibia';

UPDATE sportsplatform_federations
SET background_image = '/sports/netball.jpg', updated_at = now()
WHERE slug = 'namibia-netball';

UPDATE sportsplatform_federations
SET background_image = '/sports/namibia-hockey.jpg', updated_at = now()
WHERE slug = 'nhu';

UPDATE sportsplatform_federations
SET background_image = '/sports/namibia-basketball.jpg', updated_at = now()
WHERE slug = 'namibia-basketball';

UPDATE sportsplatform_federations
SET background_image = '/sports/namibia-swimming.jpg', updated_at = now()
WHERE slug IN ('swimming-namibia', 'namibia-aquatics');

UPDATE sportsplatform_federations
SET background_image = '/sports/namibia-boxing.jpg', updated_at = now()
WHERE slug = 'namibia-boxing';

UPDATE sportsplatform_federations
SET background_image = '/sports/volleyball.jpg', updated_at = now()
WHERE slug = 'namibia-volleyball';

UPDATE sportsplatform_federations
SET background_image = '/sports/beach-volleyball.jpg', updated_at = now()
WHERE slug = 'namibia-beach-volleyball';

UPDATE sportsplatform_federations
SET background_image = '/sports/tennis.jpg', updated_at = now()
WHERE slug = 'tennis-namibia';

UPDATE sportsplatform_federations
SET background_image = '/sports/cycling.jpg', updated_at = now()
WHERE slug = 'namibia-cycling';

-- ===== Other federations with verified local sport photos =====

UPDATE sportsplatform_federations
SET background_image = '/sports/archery.jpg', updated_at = now()
WHERE slug = 'archery-namibia';

UPDATE sportsplatform_federations
SET background_image = '/sports/badminton.jpg', updated_at = now()
WHERE slug = 'badminton-namibia';

UPDATE sportsplatform_federations
SET background_image = '/sports/baseball.jpg', updated_at = now()
WHERE slug = 'baseball-namibia';

UPDATE sportsplatform_federations
SET background_image = '/sports/softball.jpg', updated_at = now()
WHERE slug = 'softball-namibia';

UPDATE sportsplatform_federations
SET background_image = '/sports/billiards-action.jpg', updated_at = now()
WHERE slug = 'billiards-snooker-namibia';

UPDATE sportsplatform_federations
SET background_image = '/sports/bodybuilding.jpg', updated_at = now()
WHERE slug = 'bodybuilding-namibia';

UPDATE sportsplatform_federations
SET background_image = '/sports/bowls.jpg', updated_at = now()
WHERE slug = 'bowls-namibia';

UPDATE sportsplatform_federations
SET background_image = '/sports/chess-tournament.jpg', updated_at = now()
WHERE slug = 'chess-namibia';

UPDATE sportsplatform_federations
SET background_image = '/sports/dance-sport.jpg', updated_at = now()
WHERE slug = 'dance-sport-namibia';

UPDATE sportsplatform_federations
SET background_image = '/sports/equestrian.jpg', updated_at = now()
WHERE slug = 'equestrian-namibia';

UPDATE sportsplatform_federations
SET background_image = '/sports/fencing.jpg', updated_at = now()
WHERE slug = 'fencing-namibia';

UPDATE sportsplatform_federations
SET background_image = '/sports/fishing.jpg', updated_at = now()
WHERE slug = 'angling-namibia';

UPDATE sportsplatform_federations
SET background_image = '/sports/golf.jpg', updated_at = now()
WHERE slug = 'golf-namibia';

UPDATE sportsplatform_federations
SET background_image = '/sports/gymnastics.jpg', updated_at = now()
WHERE slug = 'namibia-gymnastics';

UPDATE sportsplatform_federations
SET background_image = '/sports/handball.jpg', updated_at = now()
WHERE slug = 'namibia-handball';

UPDATE sportsplatform_federations
SET background_image = '/sports/judo.jpg', updated_at = now()
WHERE slug = 'judo-namibia';

UPDATE sportsplatform_federations
SET background_image = '/sports/karate.jpg', updated_at = now()
WHERE slug = 'karate-namibia';

UPDATE sportsplatform_federations
SET background_image = '/sports/lacrosse.jpg', updated_at = now()
WHERE slug = 'lacrosse-namibia';

UPDATE sportsplatform_federations
SET background_image = '/sports/motorsport.jpg', updated_at = now()
WHERE slug = 'motorsport-namibia';

UPDATE sportsplatform_federations
SET background_image = '/sports/canoeing.jpg', updated_at = now()
WHERE slug = 'namibia-canoeing';

UPDATE sportsplatform_federations
SET background_image = '/sports/climbing.jpg', updated_at = now()
WHERE slug = 'namibia-climbing';

UPDATE sportsplatform_federations
SET background_image = '/sports/darts-action.jpg', updated_at = now()
WHERE slug = 'namibia-darts';

UPDATE sportsplatform_federations
SET background_image = '/sports/esports.jpg', updated_at = now()
WHERE slug = 'namibia-esports';

UPDATE sportsplatform_federations
SET background_image = '/sports/futsal.jpg', updated_at = now()
WHERE slug = 'namibia-futsal';

UPDATE sportsplatform_federations
SET background_image = '/sports/horse-racing.jpg', updated_at = now()
WHERE slug = 'namibia-horse-racing';

UPDATE sportsplatform_federations
SET background_image = '/sports/ice-hockey.jpg', updated_at = now()
WHERE slug = 'namibia-ice-inline-hockey';

UPDATE sportsplatform_federations
SET background_image = '/sports/kickboxing.jpg', updated_at = now()
WHERE slug = 'namibia-kickboxing';

UPDATE sportsplatform_federations
SET background_image = '/sports/korfball.jpg', updated_at = now()
WHERE slug = 'namibia-korfball';

UPDATE sportsplatform_federations
SET background_image = '/sports/mountaineering.jpg', updated_at = now()
WHERE slug = 'namibia-mountaineering';

UPDATE sportsplatform_federations
SET background_image = '/sports/muaythai.jpg', updated_at = now()
WHERE slug = 'namibia-muaythai';

UPDATE sportsplatform_federations
SET background_image = '/sports/orienteering.jpg', updated_at = now()
WHERE slug = 'namibia-orienteering';

UPDATE sportsplatform_federations
SET background_image = '/sports/powerlifting.jpg', updated_at = now()
WHERE slug IN ('powerlifting-namibia', 'weightlifting-namibia');

UPDATE sportsplatform_federations
SET background_image = '/sports/rowing.jpg', updated_at = now()
WHERE slug = 'rowing-namibia';

UPDATE sportsplatform_federations
SET background_image = '/sports/sailing.jpg', updated_at = now()
WHERE slug = 'sailing-namibia';

UPDATE sportsplatform_federations
SET background_image = '/sports/shooting.jpg', updated_at = now()
WHERE slug = 'shooting-namibia';

UPDATE sportsplatform_federations
SET background_image = '/sports/skateboarding-action.jpg', updated_at = now()
WHERE slug = 'skateboarding-namibia';

UPDATE sportsplatform_federations
SET background_image = '/sports/rollerskating-action.jpg', updated_at = now()
WHERE slug = 'roller-sports-namibia';

UPDATE sportsplatform_federations
SET background_image = '/sports/squash.jpg', updated_at = now()
WHERE slug = 'squash-namibia';

UPDATE sportsplatform_federations
SET background_image = '/sports/surfing.jpg', updated_at = now()
WHERE slug = 'surfing-namibia';

UPDATE sportsplatform_federations
SET background_image = '/sports/table-tennis.jpg', updated_at = now()
WHERE slug = 'table-tennis-namibia';

UPDATE sportsplatform_federations
SET background_image = '/sports/taekwondo.jpg', updated_at = now()
WHERE slug = 'taekwondo-namibia';

UPDATE sportsplatform_federations
SET background_image = '/sports/triathlon.jpg', updated_at = now()
WHERE slug = 'triathlon-namibia';

UPDATE sportsplatform_federations
SET background_image = '/sports/frisbee.jpg', updated_at = now()
WHERE slug = 'ultimate-frisbee-namibia';

UPDATE sportsplatform_federations
SET background_image = '/sports/wrestling.jpg', updated_at = now()
WHERE slug = 'wrestling-namibia';

UPDATE sportsplatform_federations
SET background_image = '/sports/petanque.jpg', updated_at = now()
WHERE slug = 'petanque-namibia';

UPDATE sportsplatform_federations
SET background_image = '/sports/waterski.jpg', updated_at = now()
WHERE slug = 'namibia-waterski';

UPDATE sportsplatform_federations
SET background_image = '/sports/martial-arts-mma.jpg', updated_at = now()
WHERE slug IN ('mixed-martial-arts-namibia', 'namibia-full-contact-martial-arts');

UPDATE sportsplatform_federations
SET background_image = '/sports/golf.jpg', updated_at = now()
WHERE slug = 'namibia-footgolf';

-- ===== Umbrella / governance — sport-atmosphere (not wrong-sport) =====

UPDATE sportsplatform_federations
SET background_image = '/sports/athletics.jpg', updated_at = now()
WHERE slug = 'ministry-sport';

UPDATE sportsplatform_federations
SET background_image = '/sports/namibia-football.jpg', updated_at = now()
WHERE slug = 'namibia-sports-commission';

UPDATE sportsplatform_federations
SET background_image = '/sports/martial-arts.jpg', updated_at = now()
WHERE slug = 'namibia-martial-arts';

UPDATE sportsplatform_federations
SET background_image = '/sports/athletics-alt.jpg', updated_at = now()
WHERE slug = 'nnoc';

UPDATE sportsplatform_federations
SET background_image = '/sports/triathlon.jpg', updated_at = now()
WHERE slug = 'namibia-paralympic';

UPDATE sportsplatform_federations
SET background_image = '/sports/athletics.jpg', updated_at = now()
WHERE slug IN ('nlas', 'nnssu', 'nufs', 'nawisa');

UPDATE sportsplatform_federations
SET background_image = '/sports/fitness-aerobics.jpg', updated_at = now()
WHERE slug = 'tisan';

-- ===== Prefer null over wrong / no verified photo =====
-- pentathlon: no dedicated asset (prior athletics reuse rejected)
-- padel: only tennis-court interim available — leave null
-- niche combat/emerging without verified sport photo

UPDATE sportsplatform_federations
SET background_image = NULL, updated_at = now()
WHERE slug IN (
  'namibia-modern-pentathlon',
  'namibia-padel-tennis',
  'fistball-namibia',
  'ice-stock-namibia',
  'indigenous-combat-sport',
  'namibia-jukskei',
  'namibia-kendo',
  'namibia-practical-shooting',
  'namibia-speed-hiking',
  'namibia-teqball',
  'namibia-western-mounted-games'
);
