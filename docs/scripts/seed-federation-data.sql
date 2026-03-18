-- Seed Federation Data from NSC Contact Details (Feb 2025)
-- Source: docs/research/federation-contacts-extracted.md
-- Run in Supabase SQL Editor after federations exist
-- Updates: slug, email, phone, secretaryGeneral, president, website

-- ===== 57 Sport Federations =====

UPDATE namibia_na_26_federations SET slug = 'athletics-namibia', email = 'nam@mf.worldathletics.org', phone = '0811243550', "secretaryGeneral" = 'Madeleine Kotze' WHERE name = 'Athletics Namibia';

UPDATE namibia_na_26_federations SET slug = 'namibia-freshwater-angling', email = 'hjpdp@afol.com.na', phone = '+264 81-228 0100', "secretaryGeneral" = 'Henry Du Plessis', president = 'Carol Stinton (Dev Officer)' WHERE name = 'Namibia Freshwater Angling';

UPDATE namibia_na_26_federations SET slug = 'sea-water-angling', email = 'simena@iway.na', phone = '+264813684860', "secretaryGeneral" = 'Sinen Andresen', president = 'Sinen Andresen' WHERE name = 'Sea Water Angling';

UPDATE namibia_na_26_federations SET slug = 'archery-namibia', email = 'secretarygeneral.aan@gmail.com', phone = '+264 81 205 3715', "secretaryGeneral" = 'Jacqueline Coetzee', president = 'Jannie Meuwesen', website = NULL WHERE name = 'Archery of Namibia Association';

UPDATE namibia_na_26_federations SET slug = 'namibia-badminton', email = 'bfnamibia@gmail.com', "secretaryGeneral" = NULL, president = 'Lynn du Preez' WHERE name = 'Namibia Badminton Federation';

UPDATE namibia_na_26_federations SET slug = 'namibia-basketball', email = 'namibianbasketball@gmail.com', phone = '0813813749', "secretaryGeneral" = 'Titus Mwahafa', president = 'Nigel Mubita' WHERE name = 'Namibia Basketball Federation';

UPDATE namibia_na_26_federations SET slug = 'namibia-bowling', email = 'namibiabowls@gmail.com', phone = '0811293931', "secretaryGeneral" = 'Derek Brune', president = 'Anjuleen Viljoen' WHERE name = 'Namibia Bowling Association';

UPDATE namibia_na_26_federations SET slug = 'namibia-boxing', email = 'namibiaboxing_federation@yahoo.com', phone = '0812885831', "secretaryGeneral" = 'Petrus N Kashango', president = NULL WHERE name = 'Namibia Boxing Federation';

UPDATE namibia_na_26_federations SET slug = 'namibia-canoe-rowing', email = 'secretarygeneralnamcanrowing@gmail.com', "secretaryGeneral" = 'Theo Tjiueza', president = 'Mike Haibondi' WHERE name = 'Namibia Canoe & Rowing Federation';

UPDATE namibia_na_26_federations SET slug = 'namibia-chess', email = 'secretary@namibiachessfederation.com', phone = '(+264)81 338 2087', "secretaryGeneral" = 'Lloyd Dien' WHERE name = 'Namibia Chess Federation';

UPDATE namibia_na_26_federations SET slug = 'cricket-namibia', email = 'ceo@cricketnamibia.com', phone = '0811266560', "secretaryGeneral" = 'Johan Muller (CEO)', president = 'Harald Fulle (COO)' WHERE name = 'Cricket Namibia';

UPDATE namibia_na_26_federations SET slug = 'namibia-cycling', email = 'info@namcf.org', phone = '+264 81 293 1460', "secretaryGeneral" = 'Elanor Grassow', president = 'Tauko Shilongo (VP)' WHERE name = 'Namibia Cycling Federation';

UPDATE namibia_na_26_federations SET slug = 'dance-sport-namibia', email = 'dancesportnam@gmail.com', "secretaryGeneral" = 'Alta Hill', president = 'Edmund Van Neel' WHERE name = 'Dance Sport Namibia';

UPDATE namibia_na_26_federations SET slug = 'namibia-darts', email = 'buksie1962@icloud.com', phone = '0812147484', "secretaryGeneral" = 'Ludwig Ralph' WHERE name = 'Namibia Darts Federation';

UPDATE namibia_na_26_federations SET slug = 'namibia-fistball', email = 'secretary@fistballnamibia.com', "secretaryGeneral" = NULL, president = NULL WHERE name = 'Namibia Fistball Federation';

UPDATE namibia_na_26_federations SET slug = 'esports-namibia', email = 'salome@esportsnamibia.org', phone = '0818085332', "secretaryGeneral" = 'Salome De Bryun', president = 'Flip de Bryun' WHERE name = 'Namibian Electronic Sport Association';

UPDATE namibia_na_26_federations SET slug = 'namibia-equestrian', email = 'secretary@namef.org.na', phone = '+264 81 829 0260', "secretaryGeneral" = 'Bruce Lourens', president = 'Richard Frankle' WHERE name = 'Namibia Equestrian Federation';

UPDATE namibia_na_26_federations SET slug = 'namibia-fencing', email = 'secretary@namibianfencing.com', phone = '081 674 6508', "secretaryGeneral" = 'Janine Briedenhann', president = 'Rainer Visser' WHERE name = 'Namibia Fencing Federation';

UPDATE namibia_na_26_federations SET slug = 'nfa', email = 'csiyauya@nfa.org.na', phone = '0811488640', "secretaryGeneral" = 'Mr. Charles Siyauya', president = 'Mr. Robert Shimooshili' WHERE name = 'Namibia Football Association';

UPDATE namibia_na_26_federations SET slug = 'namibia-golf', email = 'brenda@iway.na', phone = '+264 81 155 8888', "secretaryGeneral" = 'Brenda Lens', president = 'Marc Swartz' WHERE name = 'Namibia Golf Federation';

UPDATE namibia_na_26_federations SET slug = 'namibia-gymnastics', email = 'sg@gymnasticsnamibia.org', phone = '0811482548', "secretaryGeneral" = 'Ms. Mariette Van Zyl', president = 'Sharifa Wentworth' WHERE name = 'Namibia Gymnastic Federation';

UPDATE namibia_na_26_federations SET slug = 'nhu', email = 'secretary@namibiahockey.org', "secretaryGeneral" = NULL, president = 'Cari Slabbert' WHERE name = 'Namibia Hockey Union';

UPDATE namibia_na_26_federations SET slug = 'namibia-horse-racing', email = 'namibiahorseraicingassociation@gmail.com', phone = '0714830003', "secretaryGeneral" = 'Mr. John Wellmann', president = 'Mr. Gottfried Mootu' WHERE name = 'Namibia Horse Racing Association';

UPDATE namibia_na_26_federations SET slug = 'icestock-namibia', email = 'detlef.pfeifer@goethe.de', "secretaryGeneral" = NULL, president = 'Detlef Pfeifer' WHERE name = 'Icestock Namibia Association';

UPDATE namibia_na_26_federations SET slug = 'namibia-ice-inline-hockey', email = 'secretary@niiha.com', phone = '+264 81 124 7603', "secretaryGeneral" = 'Lucille Coetzee', president = NULL WHERE name = 'Namibia Ice & Inline Hockey Association';

UPDATE namibia_na_26_federations SET slug = 'namibia-judo', email = 'keith.bock17@gmail.com', phone = '0812888123', "secretaryGeneral" = NULL, president = 'Keith Bock' WHERE name = 'Namibia Judo Federation';

UPDATE namibia_na_26_federations SET slug = 'namibia-jukskei', email = 'pro@jukskei-nam.com', phone = '0811222743', "secretaryGeneral" = NULL, president = 'Erick Straus' WHERE name = 'Namibia Jukskei Federation';

UPDATE namibia_na_26_federations SET slug = 'namibia-karate', email = 'secretarynkf@gmail.com', phone = '0814009050', "secretaryGeneral" = 'Marchelle De Jager', president = 'De Wet Moolman' WHERE name = 'Namibia Karate Federation';

UPDATE namibia_na_26_federations SET slug = 'namibia-kendo', email = 'pineuest@africaonline.com.na', phone = '0811278899', "secretaryGeneral" = NULL, president = 'Andre Pienaar' WHERE name = 'Namibia Kendo Association';

UPDATE namibia_na_26_federations SET slug = 'namibia-kickboxing', email = 'ankia.rentzke26@gmail.com', phone = '0811481322', "secretaryGeneral" = 'Ankia Rentzke', president = 'Anita De Klerk' WHERE name = 'Namibia Kickboxing Federation';

UPDATE namibia_na_26_federations SET slug = 'namibia-motor-sport', email = 'info@motorsportnamibia.org', phone = '0814116442', "secretaryGeneral" = 'Derek Jacobs', president = 'Daniel Tjongarero' WHERE name = 'Namibia Motor Sport Federation';

UPDATE namibia_na_26_federations SET slug = 'nn', email = 'netballnamibia@gmail.com', phone = '0816982299', "secretaryGeneral" = 'Simon Sofia' WHERE name = 'Netball Namibia';

UPDATE namibia_na_26_federations SET slug = 'namibia-power-weightlifting', email = 'viadante.johannes@gmail.com', phone = '0816951214', "secretaryGeneral" = NULL, president = 'Dr. Marius Johannes' WHERE name = 'Namibia Power & Weight Lifting Association';

UPDATE namibia_na_26_federations SET slug = 'namibia-practical-shooting', email = 'napsa.chairman@gmail.com', phone = '+264 81 272 3009', "secretaryGeneral" = NULL, president = 'Gustaf Bauer' WHERE name = 'Namibia Practical Shooting Association';

UPDATE namibia_na_26_federations SET slug = 'nru', email = 'ceo@nru.com.na', phone = '0811228390', "secretaryGeneral" = 'John Heynes (CEO)', president = 'William Steenkamp (Ops Manager)' WHERE name = 'Namibia Rugby Union';

UPDATE namibia_na_26_federations SET slug = 'namibia-swimming', email = 'secgen@swimmingnamibia.com', phone = '0811270266', "secretaryGeneral" = 'Agata Mason', president = 'Riaan Steyn' WHERE name = 'Namibia Swimming Union';

UPDATE namibia_na_26_federations SET slug = 'namibia-saddle-seat-equestrian', email = 'nico@namibbeton.com', phone = '061262971', "secretaryGeneral" = NULL, president = 'Nico Badenhorst' WHERE name = 'Namibia Saddle Seat Equestrian Federation';

UPDATE namibia_na_26_federations SET slug = 'namibia-sailing', email = 'jaimeemilyg@gmail.com', phone = '+264 81 209 0871', "secretaryGeneral" = 'Jaime Grobler', president = 'William Graham' WHERE name = 'Namibia Sailing Association';

UPDATE namibia_na_26_federations SET slug = 'namibia-squash', email = 'RiaanS@tgh.na', phone = '081 140 7350', "secretaryGeneral" = NULL, president = 'Riaan Steyn' WHERE name = 'Namibia Squash Association';

UPDATE namibia_na_26_federations SET slug = 'namibia-speed-hiking', email = 'namibianhikers@gmail.com', phone = '0817147555', "secretaryGeneral" = 'Mercia Diana Goliath', president = 'Eino J I Mbango' WHERE name = 'Namibia Speed Hiking Association';

UPDATE namibia_na_26_federations SET slug = 'namibia-sport-shooting', email = 'namsportshooting@gmail.com', phone = '0812483227', "secretaryGeneral" = NULL, president = 'Karola Marais' WHERE name = 'Namibia Sport Shooting Federation';

UPDATE namibia_na_26_federations SET slug = 'namibia-tennis', email = 'nta@iway.na', phone = '0816586383', "secretaryGeneral" = 'Natalia Nangolo', president = 'Samson Kaulinge' WHERE name = 'Namibia Tennis Association';

UPDATE namibia_na_26_federations SET slug = 'namibia-triathlon', email = 'sg@ntf.go.na', phone = '0812462204', "secretaryGeneral" = 'Adele De La Rey' WHERE name = 'Namibia Triathlon Association';

UPDATE namibia_na_26_federations SET slug = 'namibia-volleyball', email = 'ceo@namibiavolleyball.org', phone = '+264 81 954 7600', "secretaryGeneral" = 'Festus Shituliipo Hamukwaya', president = 'Tobias Eden Mwatelulo' WHERE name = 'Namibia Volleyball Federation';

UPDATE namibia_na_26_federations SET slug = 'namibia-waterski', email = 'geschef@gmail.com', phone = '0811701644', "secretaryGeneral" = 'Gesche Hannam' WHERE name = 'Namibia Waterski Association';

UPDATE namibia_na_26_federations SET slug = 'namibia-wrestling', email = 'nam@uww.org', phone = '0814389884', "secretaryGeneral" = 'Anke Erasmus' WHERE name = 'Namibia Wrestling Federation';

UPDATE namibia_na_26_federations SET slug = 'namibia-premier-league', email = 'kauta@wkh-law.com', phone = '0811447777', "secretaryGeneral" = NULL, president = 'Patrick Kauta' WHERE name = 'Namibia Premier League';

UPDATE namibia_na_26_federations SET slug = 'namibia-table-tennis', email = 'rudisaunderson@gmail.com', phone = '+264811611070', "secretaryGeneral" = 'Rudi Saunderson' WHERE name = 'Namibia Table Tennis Association';

UPDATE namibia_na_26_federations SET slug = 'namibia-teqball', email = 'ramahmumba@yahoo.com', phone = '0811284638', "secretaryGeneral" = NULL, president = 'Ramah Mumba' WHERE name = 'Namibia Teq Ball Federation';

UPDATE namibia_na_26_federations SET slug = 'namibia-taekwondo', email = 'taekwondonamibia@gmail.com', "secretaryGeneral" = 'Jatjinda Kambatuku', president = 'Kavezemburuka Sieggie Veii Mujoro' WHERE name = 'Namibia Taekwondo Federation';

UPDATE namibia_na_26_federations SET slug = 'indigenous-combat-sport', email = 'icsfnam@gmail.com', phone = '+264 85 127 9065', "secretaryGeneral" = NULL, president = 'Hidipo Nangolo (Coordinator)' WHERE name = 'Indigenous Combat Sport Federation';

UPDATE namibia_na_26_federations SET slug = 'namibia-full-contact-martial-arts', email = 'getfitdivine@gmail.com', phone = '0817068305', "secretaryGeneral" = NULL, president = 'Simba Mangaba' WHERE name = 'Namibia Full-Contact Martial Arts';

UPDATE namibia_na_26_federations SET slug = 'namibia-pool-billiard', email = 'louwls@gmail.com', "secretaryGeneral" = 'Mr. Louw', president = 'Cyril Moller' WHERE name = 'Namibia Pool and Billiard Federation';

UPDATE namibia_na_26_federations SET slug = 'namibia-muaythai', email = 'namibianmuaythaifederation@gmail.com', "secretaryGeneral" = NULL, president = 'Sheila Martins' WHERE name = 'Namibia Muaythai Federation';

UPDATE namibia_na_26_federations SET slug = 'mixed-martial-arts-namibia', email = 'mixedmartialartsnamibia@gmail.com', "secretaryGeneral" = NULL, president = 'Natascha De Sousa' WHERE name = 'Mixed Martial Arts Namibia';

UPDATE namibia_na_26_federations SET slug = 'namibia-traditional-sport-games', email = 'jwmarais2013@gmail.com', phone = '0818657971', "secretaryGeneral" = NULL, president = 'Jan Marais' WHERE name = 'Namibia Traditional Sport and Games Federation';

UPDATE namibia_na_26_federations SET slug = 'namibia-endurance-riding', email = 'secretary@nerf.org.na', phone = '0817584552', "secretaryGeneral" = 'Michelle Kotze' WHERE name = 'Namibia Endurance Riding Federation';

-- ===== 8 Umbrella Sport Bodies =====

UPDATE namibia_na_26_federations SET slug = 'disability-sport-namibia', email = 'admin@namparalympics.org.na', "secretaryGeneral" = 'Michael Hamukwaya', president = 'Abner Sheya' WHERE name = 'Disability Sport Namibia';

UPDATE namibia_na_26_federations SET slug = 'nawisa', email = 'elizabethngulungu@gmail.com', phone = '0814140744', "secretaryGeneral" = 'Karen Mubonenwa', president = 'Elizabeth Ngulungu' WHERE name = 'Namibia Women in Sport Association (NAWISA)';

UPDATE namibia_na_26_federations SET slug = 'nssu', email = 'Info.NSSU@msyns.gov.na', phone = '0812516760', "secretaryGeneral" = 'Rogerdeltry Kambatuku', president = 'Allan Kake' WHERE name = 'NNSU (National Sport Student Union)';

UPDATE namibia_na_26_federations SET slug = 'nnoc', email = 'info@olympic.org.na', phone = '0811226060', "secretaryGeneral" = 'Joan Smith', president = 'Ndeulipulwa Hamutumwa' WHERE name = 'NNOC (Namibia National Olympic Committee)';

UPDATE namibia_na_26_federations SET slug = 'tisan', email = 'tisan_a@yahoo.com', phone = '0812865849', "secretaryGeneral" = 'Roline Diergaard', president = 'John-Graftt Ndungaua' WHERE name = 'TISAN';

UPDATE namibia_na_26_federations SET slug = 'namibia-uniformed-forces-sport', email = 'kevinlubinda@gmail.com', "secretaryGeneral" = 'Kevin Lubinda', president = 'Ali Nuumbembe' WHERE name = 'Namibia Uniformed Forces/Services Sport Association';

UPDATE namibia_na_26_federations SET slug = 'nalasra', email = 'Gert.VanWyk@windhoekcc.org.na', phone = '0811296322', "secretaryGeneral" = 'Mr. Mouton' WHERE name = 'Namibia Local Authority Sports and Recreation Association';

UPDATE namibia_na_26_federations SET slug = 'martial-arts-namibia', email = 'martialartsnamibia@gmail.com', "secretaryGeneral" = 'Adel Oosthuizen', president = 'Ingo Oosthuizen' WHERE name = 'Martial Arts Namibia';
