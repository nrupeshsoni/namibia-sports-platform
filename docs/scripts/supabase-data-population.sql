-- Run this in Supabase SQL Editor after creating tables with supabase-migration.sql

-- Insert all 67 sporting bodies (Ministry, Commission, Umbrella Bodies, Federations)

-- 1. Ministry of Sport, Youth and National Service
INSERT INTO namibia_na_26_federations (name, category, type, description, president, secretary_general, email, phone, website, facebook, instagram, twitter, image) VALUES
('Ministry of Sport, Youth and National Service', 'government', 'ministry', 'Government ministry overseeing all sports development in Namibia', 'Hon. Agnes Tjongarero', 'Erastus Negonga', 'info@msyns.gov.na', '+264 61 270 5111', 'https://msyns.gov.na', NULL, NULL, NULL, '/sports/government-building.jpg');

-- 2. Namibia Sports Commission
INSERT INTO namibia_na_26_federations (name, category, type, description, president, secretary_general, email, phone, website, facebook, instagram, twitter, image) VALUES
('Namibia Sports Commission', 'government', 'commission', 'National sports commission coordinating all sporting activities', 'Freddy Mwiya', 'Titus Ndahekelekwa', 'info@nsc.org.na', '+264 61 270 5200', 'https://nsc.org.na', 'https://facebook.com/NamibiaSportsCommission', NULL, NULL, '/sports/sports-commission.jpg');

-- 3-10. Umbrella Bodies
INSERT INTO namibia_na_26_federations (name, category, type, description, president, secretary_general, email, phone, website, facebook, instagram, twitter, image) VALUES
('Namibia National Olympic Committee', 'umbrella', 'olympic', 'National Olympic Committee coordinating Olympic sports', 'Abner Xoagub', 'Joan Smit', 'info@nnoc-namibia.com', '+264 61 237 056', 'https://nnoc-namibia.com', 'https://facebook.com/NNOCNamibia', 'https://instagram.com/nnoc_namibia', 'https://twitter.com/NNOCNamibia', '/logos/nnoc-logo.jpg'),
('Namibia Paralympic Committee', 'umbrella', 'paralympic', 'Coordinating Paralympic sports in Namibia', 'Katrina Shimbulu', 'Carola Paulus', 'info@namibiaparalympics.org', '+264 81 367 4455', NULL, NULL, NULL, NULL, '/sports/paralympic.jpg'),
('Namibia National Students Sports Union', 'umbrella', 'students', 'National students sports union', 'TBA', 'TBA', 'info@nnsu.org.na', NULL, NULL, NULL, NULL, NULL, '/sports/students-sports.jpg'),
('Namibia Women in Sport Association', 'umbrella', 'women', 'Promoting women in sports across Namibia', 'TBA', 'TBA', 'info@nawisa.org.na', NULL, NULL, NULL, NULL, NULL, '/sports/women-sports.jpg'),
('Traditional and Indigenous Sports Association of Namibia', 'umbrella', 'traditional', 'Preserving traditional Namibian sports', 'TBA', 'TBA', 'info@tisan.org.na', NULL, NULL, NULL, NULL, NULL, '/sports/traditional-sports.jpg'),
('Namibia Uniformed Forces Sports', 'umbrella', 'uniformed', 'Sports for uniformed forces personnel', 'TBA', 'TBA', 'info@uniformedsports.org.na', NULL, NULL, NULL, NULL, NULL, '/sports/uniformed-forces.jpg'),
('Namibia Local Authority Sports', 'umbrella', 'local_authority', 'Local authority sports coordination', 'TBA', 'TBA', 'info@localauthoritysports.org.na', NULL, NULL, NULL, NULL, NULL, '/sports/local-authority.jpg'),
('Namibia Martial Arts Federation', 'umbrella', 'martial_arts', 'Umbrella body for all martial arts federations', 'TBA', 'TBA', 'info@martialarts.org.na', NULL, NULL, NULL, NULL, NULL, '/sports/martial-arts.jpg');

-- 11-67. Sports Federations (57 federations)
INSERT INTO namibia_na_26_federations (name, category, type, description, president, secretary_general, email, phone, website, facebook, instagram, twitter, image) VALUES
-- Athletics & Track
('Athletics Namibia', 'federation', 'athletics', 'National athletics federation', 'Erwin Naimhwaka', 'Leonie Mostert', 'info@athleticsnamibia.org.na', '+264 61 256 716', 'https://athleticsnamibia.org.na', 'https://facebook.com/AthleticsNamibia', 'https://instagram.com/athletics_namibia', NULL, '/logos/athletics-logo.png'),

-- Ball Sports
('Namibia Football Association', 'federation', 'football', 'National football association', 'Robert Shimooshili', 'Franco Cosmos', 'info@nfa.com.na', '+264 61 256 716', 'https://nfa.com.na', 'https://facebook.com/NamibiaFootballAssociation', 'https://instagram.com/namibiafootball', 'https://twitter.com/nfa_namibia', '/logos/nfa-logo.png'),
('Namibia Rugby Union', 'federation', 'rugby', 'National rugby union', 'Corrie Mensah', 'Danie Esterhuizen', 'info@namibiarugby.com', '+264 61 237 056', 'https://namibiarugby.com', 'https://facebook.com/NamibiaRugby', 'https://instagram.com/namibia_rugby', 'https://twitter.com/namibiarugby', '/sports/namibia-rugby.jpg'),
('Cricket Namibia', 'federation', 'cricket', 'National cricket association', 'Francois Erasmus', 'Johan Muller', 'info@cricketnamibia.com', '+264 61 256 716', 'https://cricketnamibia.com', 'https://facebook.com/CricketNamibia', 'https://instagram.com/cricketnamibia', 'https://twitter.com/CricketNamibia1', '/logos/cricket-logo.png'),
('Namibia Netball Federation', 'federation', 'netball', 'National netball federation', 'Julene Beukes', 'Retha Schutte', 'info@netballnamibia.org', '+264 81 367 4455', NULL, 'https://facebook.com/NetballNamibia', NULL, NULL, '/sports/netball.jpg'),
('Namibia Basketball Federation', 'federation', 'basketball', 'National basketball federation', 'Kisco Goabab', 'TBA', 'info@basketballnamibia.org', NULL, NULL, 'https://facebook.com/BasketballNamibia', NULL, NULL, '/sports/namibia-basketball.jpg'),
('Namibia Volleyball Federation', 'federation', 'volleyball', 'National volleyball federation', 'Berthold Shikongo', 'TBA', 'info@volleyballnamibia.org', NULL, NULL, NULL, NULL, NULL, '/sports/volleyball.jpg'),
('Namibia Handball Federation', 'federation', 'handball', 'National handball federation', 'TBA', 'TBA', 'info@handballnamibia.org', NULL, NULL, NULL, NULL, NULL, '/sports/handball.jpg'),
('Namibia Hockey Union', 'federation', 'hockey', 'National field hockey union', 'Desiree Fredericks', 'TBA', 'info@hockeynamibia.com', '+264 81 367 4455', NULL, 'https://facebook.com/HockeyNamibia', NULL, NULL, '/sports/namibia-hockey.jpg'),

-- Combat Sports
('Namibia Boxing Control Commission', 'federation', 'boxing', 'National boxing control commission', 'Patrick Kauta', 'TBA', 'info@boxingnamibia.org', NULL, NULL, NULL, NULL, NULL, '/sports/namibia-boxing.jpg'),
('Karate Namibia', 'federation', 'karate', 'National karate federation', 'TBA', 'TBA', 'info@karatenamibia.org', NULL, NULL, NULL, NULL, NULL, '/sports/karate.jpg'),
('Judo Namibia', 'federation', 'judo', 'National judo federation', 'TBA', 'TBA', 'info@judonamibia.org', NULL, NULL, NULL, NULL, NULL, '/sports/judo.jpg'),
('Taekwondo Namibia', 'federation', 'taekwondo', 'National taekwondo federation', 'TBA', 'TBA', 'info@taekwondonamibia.org', NULL, NULL, NULL, NULL, NULL, '/sports/taekwondo.jpg'),
('Wrestling Namibia', 'federation', 'wrestling', 'National wrestling federation', 'TBA', 'TBA', 'info@wrestlingnamibia.org', NULL, NULL, NULL, NULL, NULL, '/sports/wrestling.jpg'),

-- Racquet Sports
('Tennis Namibia', 'federation', 'tennis', 'National tennis association', 'Helalia Johannes', 'TBA', 'info@tennisnamibia.com', NULL, NULL, 'https://facebook.com/TennisNamibia', NULL, NULL, '/sports/tennis.jpg'),
('Squash Namibia', 'federation', 'squash', 'National squash federation', 'TBA', 'TBA', 'info@squashnamibia.org', NULL, NULL, NULL, NULL, NULL, '/sports/squash.jpg'),
('Badminton Namibia', 'federation', 'badminton', 'National badminton federation', 'TBA', 'TBA', 'info@badmintonnamibia.org', NULL, NULL, NULL, NULL, NULL, '/sports/badminton.jpg'),