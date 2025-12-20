-- ===================================================
-- Namibia Sports Platform - Supabase Migration Script
-- Run this script in your Supabase SQL Editor
-- ===================================================

-- Create ENUMS
CREATE TYPE user_role AS ENUM ('user', 'admin', 'federation_admin', 'club_manager');
CREATE TYPE federation_type AS ENUM ('federation', 'umbrella_body', 'ministry', 'commission');
CREATE TYPE gender AS ENUM ('male', 'female', 'other');
CREATE TYPE event_type AS ENUM ('competition', 'tournament', 'training', 'workshop', 'meeting', 'other');
CREATE TYPE media_type AS ENUM ('image', 'video', 'document');
CREATE TYPE entity_type AS ENUM ('federation', 'club', 'event', 'athlete', 'venue', 'coach');
CREATE TYPE program_type AS ENUM ('talent_identification', 'training', 'development', 'elite');

-- ===== USERS TABLE =====
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  open_id VARCHAR(64) NOT NULL UNIQUE,
  name TEXT,
  email VARCHAR(320),
  login_method VARCHAR(64),
  role user_role DEFAULT 'user' NOT NULL,
  federation_id INTEGER,
  club_id INTEGER,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL,
  last_signed_in TIMESTAMP DEFAULT NOW() NOT NULL
);

-- ===== FEDERATIONS TABLE =====
CREATE TABLE IF NOT EXISTS namibia_na_26_federations (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  logo_url TEXT,
  hero_image_url TEXT,
  
  -- Contact Information
  contact_email VARCHAR(320),
  contact_phone VARCHAR(50),
  website TEXT,
  address TEXT,
  
  -- Leadership
  president_name VARCHAR(255),
  president_contact VARCHAR(50),
  secretary_general_name VARCHAR(255),
  secretary_general_contact VARCHAR(50),
  
  -- Metadata
  type federation_type DEFAULT 'federation' NOT NULL,
  established_year INTEGER,
  member_count INTEGER,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- ===== CLUBS TABLE =====
CREATE TABLE IF NOT EXISTS namibia_na_26_clubs (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  logo_url TEXT,
  
  -- Relationships
  federation_id INTEGER NOT NULL REFERENCES namibia_na_26_federations(id) ON DELETE CASCADE,
  
  -- Contact Information
  contact_email VARCHAR(320),
  contact_phone VARCHAR(50),
  website TEXT,
  address TEXT,
  
  -- Location
  region VARCHAR(100),
  city VARCHAR(100),
  
  -- Leadership
  president_name VARCHAR(255),
  coach_name VARCHAR(255),
  
  -- Metadata
  established_year INTEGER,
  member_count INTEGER,
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- ===== SCHOOLS TABLE =====
CREATE TABLE IF NOT EXISTS namibia_na_26_schools (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  region VARCHAR(100),
  city VARCHAR(100),
  contact_email VARCHAR(320),
  contact_phone VARCHAR(50),
  sports_offered TEXT[], -- Array of sports
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- ===== ATHLETES TABLE =====
CREATE TABLE IF NOT EXISTS namibia_na_26_athletes (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  date_of_birth DATE,
  gender gender,
  photo_url TEXT,
  
  -- Relationships
  federation_id INTEGER REFERENCES namibia_na_26_federations(id) ON DELETE SET NULL,
  club_id INTEGER REFERENCES namibia_na_26_clubs(id) ON DELETE SET NULL,
  
  -- Contact
  email VARCHAR(320),
  phone VARCHAR(50),
  
  -- Performance
  achievements TEXT,
  current_ranking INTEGER,
  
  -- Metadata
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- ===== COACHES TABLE =====
CREATE TABLE IF NOT EXISTS namibia_na_26_coaches (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  photo_url TEXT,
  
  -- Relationships
  federation_id INTEGER REFERENCES namibia_na_26_federations(id) ON DELETE SET NULL,
  club_id INTEGER REFERENCES namibia_na_26_clubs(id) ON DELETE SET NULL,
  
  -- Contact
  email VARCHAR(320),
  phone VARCHAR(50),
  
  -- Qualifications
  certifications TEXT,
  specialization VARCHAR(255),
  years_experience INTEGER,
  
  -- Metadata
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- ===== EVENTS TABLE =====
CREATE TABLE IF NOT EXISTS namibia_na_26_events (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  poster_url TEXT,
  
  -- Relationships
  federation_id INTEGER REFERENCES namibia_na_26_federations(id) ON DELETE CASCADE,
  venue_id INTEGER,
  
  -- Event Details
  type event_type DEFAULT 'competition' NOT NULL,
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP,
  registration_deadline TIMESTAMP,
  
  -- Location
  location VARCHAR(255),
  region VARCHAR(100),
  
  -- Metadata
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  is_published BOOLEAN DEFAULT FALSE NOT NULL,
  
  -- Timestamps
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- ===== VENUES TABLE =====
CREATE TABLE IF NOT EXISTS namibia_na_26_venues (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  description TEXT,
  photo_url TEXT,
  
  -- Location
  address TEXT,
  city VARCHAR(100),
  region VARCHAR(100),
  
  -- Contact
  contact_email VARCHAR(320),
  contact_phone VARCHAR(50),
  
  -- Facilities
  capacity INTEGER,
  facilities TEXT[], -- Array of facilities
  
  -- Metadata
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- ===== MEDIA TABLE =====
CREATE TABLE IF NOT EXISTS namibia_na_26_media (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  file_url TEXT NOT NULL,
  thumbnail_url TEXT,
  type media_type DEFAULT 'image' NOT NULL,
  entity_type entity_type NOT NULL,
  entity_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- ===== HIGH PERFORMANCE PROGRAMS TABLE =====
CREATE TABLE IF NOT EXISTS namibia_na_26_hp_programs (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  
  -- Relationships
  federation_id INTEGER REFERENCES namibia_na_26_federations(id) ON DELETE CASCADE,
  
  -- Program Details
  type program_type NOT NULL,
  start_date DATE,
  end_date DATE,
  
  -- Metadata
  is_active BOOLEAN DEFAULT TRUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX idx_clubs_federation ON namibia_na_26_clubs(federation_id);
CREATE INDEX idx_athletes_federation ON namibia_na_26_athletes(federation_id);
CREATE INDEX idx_athletes_club ON namibia_na_26_athletes(club_id);
CREATE INDEX idx_coaches_federation ON namibia_na_26_coaches(federation_id);
CREATE INDEX idx_coaches_club ON namibia_na_26_coaches(club_id);
CREATE INDEX idx_events_federation ON namibia_na_26_events(federation_id);
CREATE INDEX idx_events_start_date ON namibia_na_26_events(start_date);
CREATE INDEX idx_media_entity ON namibia_na_26_media(entity_type, entity_id);

-- ===================================================
-- INSERT ALL 65 FEDERATIONS DATA
-- ===================================================

INSERT INTO namibia_na_26_federations (name, slug, type, contact_email, contact_phone, secretary_general_name, president_name) VALUES
('Athletics Namibia', 'athletics-namibia', 'federation', 'nam@mf.worldathletics.org', '0811243550', 'Madeleine Kotze', NULL),
('Namibia Freshwater Angling', 'freshwater-angling', 'federation', 'hjpdp@afol.com.na', '264 81-228 0100', 'Carol Stinton', 'Henry Du Plessis'),
('Sea Water Angling', 'seawater-angling', 'federation', 'simena@iway.na', '+264813684860', NULL, 'Sinen Andresen'),
('Archery of Namibia Association', 'archery', 'federation', 'secretarygeneral.aan@gmail.com', '+264 81 205 3715', 'Jacqueline Coetzee', 'Jannie Meuwesen'),
('Namibia Badminton Federation', 'badminton', 'federation', 'bfnamibia@gmail.com', '063 - 234306', NULL, 'Lynn du Preez'),
('Namibia Basketball Federation', 'basketball', 'federation', 'namibianbasketball@gmail.com', '0813813749', 'Titus MWAHAFA', 'Nigel MUBITA'),
('Namibia Bowling Association', 'bowling', 'federation', 'namibiabowls@gmail.com', '0811293931', 'Derek Brune', 'Anjuleen Viljoen'),
('Namibia Boxing Federation', 'boxing', 'federation', 'namibiaboxing_federation@yahoo.com', '0812885831', NULL, 'Petrus n Kashango'),
('Namibia Canoe & Rowing Federation', 'canoe-rowing', 'federation', 'secretarygeneralnamcanrowing@gmail.com', '+264 81 854 0882', 'Theo Tjiueza', 'Mike Haibondi'),
('Namibia Chess Federation', 'chess', 'federation', 'secretary@namibiachessfederation.com', '(+264)81 338 2087', 'Lloyd Diën', NULL),
('Cricket Namibia', 'cricket', 'federation', 'operations@cricketnamibia.com', '+264 85 129 5930', 'Johan MULLER', 'Harald Fülle'),
('Namibia Cycling Federation', 'cycling', 'federation', 'info@namcf.org', '+264 81 293 1460', 'Elanor Grassow', 'Tauko Shilongo'),
('Dance Sport Namibia', 'dancesport', 'federation', 'dancesportnam@gmail.com', '0816686881', 'Alta Hill', 'Edmund Van Neel'),
('Namibia Darts Federation', 'darts', 'federation', 'buksie1962@icloud.com', '0812147484', 'Ludwig Ralph', NULL),
('Namibia Fist Ball Federation', 'fistball', 'federation', 'secretary@fistballnamibia.com', NULL, NULL, NULL),
('Namibian Electronic Sport Association', 'esports', 'federation', 'salome@esportsnamibia.org', '0818085332', 'Salome De Bryun', 'Flip de Bryun'),
('Namibia Equestrian Federation', 'equestrian', 'federation', 'secretary@namef.org.na', '+264 81 829 0260', 'Bruce Lourens', 'Richard Frankle'),
('Namibia Fencing Federation', 'fencing', 'federation', 'secretary@namibianfencing.com', '081 674 6508', 'Janine Briedenhann', 'Rainer Visser'),
('Namibia Football Association', 'football', 'federation', 'csiyauya@nfa.org.na', '0811488640', 'Charles Siyauya', 'Robert Shimooshili'),
('Namibia Golf Federation', 'golf', 'federation', 'brenda@iway.na', '+264 81 155 8888', 'Brenda Lens', 'Marc Swartz'),
('Namibia Gymnastic Federation', 'gymnastics', 'federation', 'sg@gymnasticsnamibia.org', '0811482548', 'Mariette Van Zyl', 'Sharifa Wentworth'),
('Namibia Hockey Union', 'hockey', 'federation', 'secretary@namibiahockey.org', '0811298085', NULL, 'Cari Slabbert'),
('Namibia Horse Racing Association', 'horse-racing', 'federation', 'namibiahorseraicingassociation@gmail.com', '0714830003', 'John Wellmann', 'Gottfried Mootu'),
('Icestock Namibia Association', 'icestock', 'federation', 'detlef.pfeifer@goethe.de', NULL, NULL, 'Detlef Pfeifer'),
('Namibia Ice & Inline Hockey Association', 'ice-inline-hockey', 'federation', 'secretary@niiha.com', '+264 (0)81 124 7603', 'Lucille Coetzee', NULL),
('Namibia Judo Federation', 'judo', 'federation', 'keith.bock17@gmail.com', '0812888123', NULL, 'Keith BOCK'),
('Namibia JUKSKEI Federation', 'jukskei', 'federation', 'pro@jukskei-nam.com', '0811222743', NULL, 'Erick Straus'),
('Namibia Karate Federation', 'karate', 'federation', 'secretarynkf@gmail.com', '0814009050', 'Marchelle De Jager', 'De Wet Moolman'),
('Namibia Kendo Association', 'kendo', 'federation', 'pineuest@africaonline.com.na', '0811278899', NULL, 'Andre PIENAAR'),
('Namibia Kickboxing Federation', 'kickboxing', 'federation', 'kickfederation@gmail.com', '0811481322', 'Ankia Rentzke', 'Anita DE KLERK'),
('Namibia Motor Sport Federation', 'motorsport', 'federation', 'info@motorsportnamibia.org', '0814116442', 'Derek Jacobs', 'Daniel Tjongarero'),
('Netball Namibia', 'netball', 'federation', 'netballnamibia@gmail.com', '0816982299', NULL, 'Simon Sofia'),
('Namibia Power & Weight Lifting Association', 'powerlifting-weightlifting', 'federation', 'viadante.johannes@gmail.com', '0816951214', NULL, 'Dr. Marius Johannes'),
('Namibia Practical Shooting Association', 'practical-shooting', 'federation', 'napsa.chairman@gmail.com', '+264 81 272 3009', NULL, 'Gustaf Bauer'),
('Namibia Rugby Union', 'rugby', 'federation', 'ceo@nru.com.na', '0811228390', 'John Heynes', 'William Steenkamp'),
('Namibia Swimming Union', 'swimming', 'federation', 'secgen@swimmingnamibia.com', '081 124 4065', 'Agata Mason', 'Riaan Steyn'),
('Namibia Saddle Seat Equestrian Federation', 'saddle-seat-equestrian', 'federation', 'nico@namibbeton.com', '0811491002', NULL, 'Nico Badenhorst'),
('Namibia Sailing Association', 'sailing', 'federation', 'jaimeemilyg@gmail.com', '+264 81 209 0871', 'Jaime Grobler', 'William Graham'),
('Namibia Squash Association', 'squash', 'federation', 'RiaanS@tgh.na', '081 140 7350', NULL, 'Riaan Steyn'),
('Namibia Speed Hiking Association', 'speed-hiking', 'federation', 'namibianhikers@gmail.com', '0817147555', 'Mercia Diana Goliath', 'Eino J I Mbango'),
('Namibia Sport Shooting Federation', 'sport-shooting', 'federation', 'namsportshooting@gmail.com', '0812483227', NULL, 'Karola Marais'),
('Namibia Tennis Association', 'tennis', 'federation', 'nta@iway.na', '0816586383', 'Natalia NANGOLO', 'Samson KAULINGE'),
('Namibia Triathlon Association', 'triathlon', 'federation', 'sg@ntf.go.na', '0812462204', 'Adele De La REY', NULL),
('Namibia Volleyball Federation', 'volleyball', 'federation', 'ceo@namibiavolleyball.org', '+264 81 747 0995', 'Festus Shituliipo Hamukwaya', 'Tobias Eden Mwatelulo'),
('Namibia Waterski Association', 'waterski', 'federation', 'namwaterski@gmail.com', '0811701644', NULL, 'Gesche Hannam'),
('Namibia Wrestling Federation', 'wrestling', 'federation', 'nam@uww.org', '0814389884', 'Anke Erasmus', NULL),
('Namibia Premier League', 'premier-league', 'federation', 'kauta@wkh-law.com', '0811447777', NULL, 'Patrick Kauta'),
('Namibia Table Tennis Association', 'table-tennis', 'federation', 'rudisaunderson@gmail.com', '+264811611070', NULL, 'Rudi Saunderson'),
('Namibia Teq Ball Federation', 'teqball', 'federation', 'ramahmumba@yahoo.com', '0811284638', NULL, 'Ramah Mumba'),
('Namibia Taekwondo Federation', 'taekwondo', 'federation', 'taekwondonnamibia@gmail.com', '+264 812613641', 'Jatjinda Kambatuku Kavezemburuka', 'Sieggie Veii Mujoro'),
('Indigenous Combat Sport Federation', 'indigenous-combat-sport', 'federation', 'icsfnam@gmail.com', '+264 85 127 9065', NULL, 'Hidipo Nangolo'),
('Namibia Full-Contact Martial-Arts', 'full-contact-martial-arts', 'federation', 'getfitdivine@gmail.com', '0817068305', NULL, 'Simba Mangaba'),
('Namibia Pool and Billiard Federation', 'pool-billiard', 'federation', 'namibiapool@outlook.com', '0813335422', 'Louw Cyril Moller', 'Cyril Moller'),
('Namibia Muaythai Federation', 'muaythai', 'federation', 'namibianmuaythaifederation@gmail.com', NULL, NULL, 'Sheila Martins'),
('Mixed Martial Arts Namibia', 'mixed-martial-arts', 'federation', 'mixedmartialartsnamibia@gmail.com', NULL, NULL, 'Natascha De Sousa'),
('Namibia Traditional Sport and Games Federation', 'traditional-sport-games', 'federation', 'jwmarais2013@gmail.com', '0818657971', NULL, 'Jan Marais'),
('Namibia Endurance Riding Federation', 'endurance-riding', 'federation', 'secretary@nerf.org.na', '0817584552', 'Michelle Kotze', NULL),
('Disability Sport Namibia', 'disability-sport', 'umbrella_body', 'admin@namparalympics.org.na', NULL, 'Michael Hamukwaya', 'Abner Sheya'),
('Namibia Women in Sport Association (NAWISA)', 'nawisa', 'umbrella_body', 'elizabethngulungu@gmail.com', '0814140744', 'Karen Mubonenwa', 'Elizabeth Ngulungu'),
('Namibia National Students Sports Union (NNSU)', 'nnsu', 'umbrella_body', 'Info.NSSU@msyns.gov.na', '0812516760', 'Allan Kake', 'Rogerdeltry Kambatuku'),
('Namibia National Olympic Committee (NNOC)', 'nnoc', 'umbrella_body', 'info@olympic.org.na', '0811226060', 'Joan SMITH', 'Ndeulipulwa Hamutumwa'),
('TISAN', 'tisan', 'umbrella_body', 'tisan_a@yahoo.com', '0812865849', 'Roline DIERGAARD', 'John-Graftt Ndungaua'),
('Namibia Uniformed Forces/Services Sport Association', 'uniformed-forces-sport', 'umbrella_body', 'kevinlubinda@gmail.com', '0818537766', 'Chief Kenneth MWATARA', 'Ali Nuumbembe'),
('Namibia Local Authority Sports and Recreation Association', 'local-authority-sport', 'umbrella_body', 'Gert.VanWyk@windhoekcc.org.na', '0811296322', NULL, 'Mr. Mouton'),
('Martial Arts Namibia', 'martial-arts-namibia', 'umbrella_body', 'martialartsnamibia@gmail.com', 'Adel Oosthuizen', 'Ingo Oosthuizen', NULL);

-- ===================================================
-- MIGRATION COMPLETE
-- ===================================================
