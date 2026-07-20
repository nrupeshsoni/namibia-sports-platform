-- Agent PHOTOS Pass 2 — fill remaining null background_image heroes
-- WHY: 11 active federations still had null heroes after 000036.
-- Sport-correct Wikimedia Commons assets saved under client/public/sports/.
-- indigenous-combat-sport: African traditional wrestling (Senegalese laamb),
-- not MMA/boxing. Timestamp 000040 (000038 crests / 000039 events taken).
-- Evidence: docs/research/federation_photos_batch.md

UPDATE sportsplatform_federations
SET background_image = '/sports/modern-pentathlon.jpg', updated_at = now()
WHERE slug = 'namibia-modern-pentathlon';

UPDATE sportsplatform_federations
SET background_image = '/sports/padel.jpg', updated_at = now()
WHERE slug = 'namibia-padel-tennis';

UPDATE sportsplatform_federations
SET background_image = '/sports/fistball.jpg', updated_at = now()
WHERE slug = 'fistball-namibia';

UPDATE sportsplatform_federations
SET background_image = '/sports/ice-stock.jpg', updated_at = now()
WHERE slug = 'ice-stock-namibia';

UPDATE sportsplatform_federations
SET background_image = '/sports/african-traditional-wrestling.jpg', updated_at = now()
WHERE slug = 'indigenous-combat-sport';

UPDATE sportsplatform_federations
SET background_image = '/sports/jukskei.jpg', updated_at = now()
WHERE slug = 'namibia-jukskei';

UPDATE sportsplatform_federations
SET background_image = '/sports/kendo.jpg', updated_at = now()
WHERE slug = 'namibia-kendo';

UPDATE sportsplatform_federations
SET background_image = '/sports/practical-shooting.jpg', updated_at = now()
WHERE slug = 'namibia-practical-shooting';

UPDATE sportsplatform_federations
SET background_image = '/sports/speed-hiking.jpg', updated_at = now()
WHERE slug = 'namibia-speed-hiking';

UPDATE sportsplatform_federations
SET background_image = '/sports/teqball.jpg', updated_at = now()
WHERE slug = 'namibia-teqball';

UPDATE sportsplatform_federations
SET background_image = '/sports/western-mounted-games.jpg', updated_at = now()
WHERE slug = 'namibia-western-mounted-games';
