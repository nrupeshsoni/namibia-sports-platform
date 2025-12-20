# Namibia Sports Management System - Project Brief

## 🎯 Project Overview

Build a comprehensive **Namibia Sports Management System** showcasing all 58 sports federations and governing bodies in Namibia. This system will maintain the same design language, structure, and technical stack as the three existing tourism portals while adapting the content and functionality for sports management.

---

## 📚 Context: Existing Tourism Portals

We have successfully built and deployed **three tourism portals** with a consistent design system:

### 1. **Main Namibia Tourism Portal**
- **Database Prefix:** `cnrtp_`
- **Focus:** Nationwide tourism across all 14 regions
- **Features:** 27 categories, 6,985 NTB-registered businesses, routes, trip planning
- **Design:** Vibrant nature-focused with desert oranges, wildlife greens, ocean blues

### 2. **Windhoek Tourism Portal**
- **Database Prefix:** `windhoek_na_26_`
- **Focus:** Capital city tourism (Windhoek)
- **Features:** City tours, cultural experiences, urban attractions
- **Design:** Urban sophistication with warm earth tones

### 3. **Coastal Namibia Tourism Portal**
- **Repository:** https://github.com/nrupeshsoni/coastal-namibia
- **Database Prefix:** `coastal_26_`
- **Live Site:** https://swakop.netlify.app
- **Focus:** Coastal destinations (Swakopmund, Walvis Bay, Lüderitz, Henties Bay)
- **Features:** 18 categories, 21 businesses, marine tours, adventure sports
- **Design:** Ocean blues, turquoise, seafoam color scheme

---

## 🎨 Design System to Preserve

### Visual Identity
- **Typography:** Georgia serif for headers with wide letter-spacing (0.15em - 0.3em)
- **Layout:** Full-screen hero sections with cycling carousels
- **Navigation:** Minimal fixed header with hamburger menu
- **Cards:** Glassmorphic effects, hover animations, shadow elevations
- **Images:** Edge-to-edge, full-bleed photography with gradient overlays
- **Animations:** Framer Motion with staggered reveals, 8 animation variants

### Color Palette Approach
Each portal has a distinct color scheme matching its theme:
- **Main Portal:** Desert orange (#F59E0B), wildlife green (#10B981), sky blue (#0EA5E9)
- **Windhoek:** Warm earth tones, urban grays
- **Coastal:** Ocean blue (#0EA5E9), turquoise (#14B8A6), seafoam (#06B6D4)

**For Sports System:** Use **athletic/energetic colors**:
- Primary: Vibrant red (#EF4444) or athletic orange (#F97316)
- Secondary: Champion gold (#FBBF24)
- Accent: Victory green (#10B981) or team blue (#3B82F6)
- Background: Clean white with dark overlays for hero sections

### Component Patterns
1. **Hero Section:** Full-screen with cycling carousel (5-7 images, 5-second intervals)
2. **Category/Federation Cards:** Grid layout with hover effects and flip animations
3. **Modal Popups:** For detailed views instead of navigation
4. **Tabs Component:** For organizing content by location/category
5. **Statistics Section:** Prominent numbers with icons
6. **Footer:** Large branding with "Where Desert Meets Ocean" style tagline

---

## 🏗️ Technical Stack (Must Use Same)

### Frontend
- **Framework:** React 19 + TypeScript + Vite
- **Styling:** Tailwind CSS 4
- **Routing:** Wouter
- **Animations:** Framer Motion
- **UI Components:** shadcn/ui

### Backend
- **Server:** Node.js + Express + tRPC 11
- **Database:** PostgreSQL via Supabase
- **ORM:** Drizzle ORM with postgres-js
- **Authentication:** Manus OAuth (built-in)

### Deployment
- **Platform:** Netlify (auto-deploy from GitHub)
- **Build Command:** `pnpm build:netlify`
- **Package Manager:** pnpm

### Database Structure
- **Table Prefix:** `namibia_sports_` (to keep separate from tourism portals)
- **Connection:** Supabase PostgreSQL with SSL

---

## 🏅 Sports System Requirements

### Core Entities

#### 1. **Sports Federations (58 Total)**
Replace tourism "categories" with sports federations:
- Athletics
- Football (Soccer)
- Rugby
- Cricket
- Netball
- Basketball
- Swimming
- Cycling
- Boxing
- Tennis
- Golf
- Volleyball
- Handball
- Hockey
- Martial Arts (Judo, Karate, Taekwondo)
- Wrestling
- Weightlifting
- Gymnastics
- Equestrian
- Motor Sports
- Sailing
- Rowing
- Canoeing
- Triathlon
- Archery
- Shooting
- Fencing
- Badminton
- Squash
- Table Tennis
- Chess
- Darts
- Bowls
- Softball
- Baseball
- American Football
- Surfing
- Skateboarding
- BMX
- Mountain Biking
- Rock Climbing
- Paragliding
- Skydiving
- Ultimate Frisbee
- Lacrosse
- Water Polo
- Synchronized Swimming
- Diving
- Snooker
- Pool
- Esports
- Dance Sport
- Cheerleading
- Bodybuilding
- Powerlifting
- Crossfit
- Yoga Sports
- Kite Surfing
- Wind Surfing

#### 2. **Clubs/Teams**
Replace tourism "listings" with sports clubs:
- Club name
- Sport/Federation
- Location (city/region)
- Contact information
- Facilities
- Membership info
- Achievements
- Photos

#### 3. **Events/Competitions**
Replace tourism "routes" with sporting events:
- Event name
- Sport/Federation
- Date and time
- Venue
- Registration info
- Results
- Photos/media

#### 4. **Athletes**
New entity for athlete profiles:
- Name
- Sport/Federation
- Club affiliation
- Achievements
- Biography
- Photos

#### 5. **Facilities/Venues**
Sports facilities across Namibia:
- Stadium/venue name
- Location
- Capacity
- Sports supported
- Contact info
- Booking information

---

## 📊 Database Schema

### Core Tables (with `namibia_sports_` prefix)

```sql
-- Users (admin, federation admins, club managers)
namibia_sports_users
- id, openId, name, email, role, federation_id, club_id

-- Sports Federations (58 federations)
namibia_sports_federations
- id, name, slug, description, icon, logo_url, contact_email, contact_phone, 
  president_name, secretary_name, established_year, member_count, is_active

-- Clubs/Teams
namibia_sports_clubs
- id, federation_id, name, slug, description, location, region, contact_email, 
  contact_phone, website, established_year, member_count, achievements, is_active

-- Athletes
namibia_sports_athletes
- id, federation_id, club_id, name, slug, biography, date_of_birth, gender,
  achievements, profile_photo_url, is_active

-- Events/Competitions
namibia_sports_events
- id, federation_id, name, slug, description, event_type, start_date, end_date,
  venue, registration_deadline, registration_url, results_url, is_active

-- Venues/Facilities
namibia_sports_venues
- id, name, slug, location, region, capacity, sports_supported, contact_email,
  contact_phone, booking_url, facilities, is_active

-- Media (photos/videos for federations, clubs, events)
namibia_sports_media
- id, url, type, alt_text, caption, created_at

-- Junction tables for media relationships
namibia_sports_federation_media
namibia_sports_club_media
namibia_sports_event_media
namibia_sports_athlete_media

-- Contact inquiries
namibia_sports_contact_inquiries
- id, name, email, message, federation_id, status, created_at
```

---

## 🎯 Key Features to Implement

### 1. **Public-Facing Portal**
- **Homepage:** Full-screen hero with Namibian sports imagery
- **Federation Directory:** Grid of all 58 federations with icons/logos
- **Club Directory:** Searchable/filterable list of all clubs
- **Events Calendar:** Upcoming competitions and events
- **Athlete Profiles:** Showcase top Namibian athletes
- **Venues Map:** Sports facilities across Namibia
- **News/Updates:** Latest sports news and results

### 2. **Management System (Admin Dashboard)**
- **Federation Management:** CRUD for federations
- **Club Management:** CRUD for clubs (federation admins can manage their clubs)
- **Event Management:** Create and manage competitions
- **Athlete Management:** Athlete profiles and achievements
- **Venue Management:** Sports facilities
- **Media Library:** Upload and manage photos/videos
- **User Management:** Role-based access (super admin, federation admin, club manager)
- **Reports:** Statistics, membership numbers, event participation

### 3. **Role-Based Access Control**
- **Super Admin:** Full system access
- **Federation Admin:** Manage their federation's clubs, events, athletes
- **Club Manager:** Manage their club's information and members
- **Public User:** Browse and view information

### 4. **Search & Filtering**
- Search by sport, location, club name
- Filter by region (14 Namibian regions)
- Filter events by date, sport, location
- Filter athletes by sport, achievements

---

## 🎨 Homepage Structure (Adapt from Tourism Portals)

### Section 1: Hero Carousel
- 7 rotating images of Namibian sports (athletes, stadiums, competitions)
- Large title: "NAMIBIA SPORTS"
- Tagline: "Excellence in Athletics, Unity in Sport"
- CTA buttons: "Explore Federations" and "Upcoming Events"

### Section 2: Statistics
- 58 Sports Federations
- 500+ Registered Clubs
- 10,000+ Athletes
- 14 Regions Represented

### Section 3: Featured Federations
- Grid of 8-12 major federations with icons
- Click opens modal with federation details
- Shows: Logo, description, contact info, affiliated clubs

### Section 4: Upcoming Events
- Horizontal scroll or grid of next 6-8 major events
- Event card shows: Sport, date, venue, registration link

### Section 5: Top Athletes
- Showcase 6-8 prominent Namibian athletes
- Photo, name, sport, key achievements

### Section 6: Regions
- Map or grid of 14 Namibian regions
- Click to filter clubs/events by region

### Section 7: Call to Action
- "Join a Club" or "Register Your Federation"
- Contact form popup

### Footer
- Large "NAMIBIA SPORTS" branding
- Tagline: "Excellence in Athletics, Unity in Sport"
- Links to federations, clubs, events, venues
- Contact: info@namibia.na

---

## 🔧 Technical Implementation Notes

### Database Connection
```typescript
// Use separate database prefix
const TABLE_PREFIX = 'namibia_sports_';

// Supabase connection (same as tourism portals)
DATABASE_URL=postgresql://postgres.fykchaqksvuwweuzgkxt:[PASSWORD]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres?sslmode=require
```

### File Structure (Same as Tourism Portals)
```
client/
  src/
    pages/
      Home.tsx              // Main landing page
      Federations.tsx       // All 58 federations
      FederationDetail.tsx  // Single federation view
      Clubs.tsx             // All clubs
      ClubDetail.tsx        // Single club view
      Events.tsx            // Events calendar
      EventDetail.tsx       // Single event view
      Athletes.tsx          // Athlete directory
      AthleteDetail.tsx     // Athlete profile
      Venues.tsx            // Facilities directory
      Admin/                // Admin dashboard pages
        Dashboard.tsx
        FederationManagement.tsx
        ClubManagement.tsx
        EventManagement.tsx
        AthleteManagement.tsx
    components/
      FederationCard.tsx
      ClubCard.tsx
      EventCard.tsx
      AthleteCard.tsx
      ContactFormModal.tsx
      FederationModal.tsx
server/
  routers.ts              // tRPC endpoints
  db.ts                   // Database queries
drizzle/
  schema.ts               // Database schema
```

### Color Scheme Variables (Tailwind Config)
```css
:root {
  --sports-red: #EF4444;
  --champion-gold: #FBBF24;
  --victory-green: #10B981;
  --team-blue: #3B82F6;
  --athletic-orange: #F97316;
}
```

---

## 📋 Initial Data to Populate

### 58 Sports Federations
You'll need to research and populate:
- Official names of all 58 Namibian sports federations
- Contact information (email, phone)
- Leadership (president, secretary names)
- Logos/icons for each federation
- Brief descriptions

### Sample Clubs (Start with 20-30)
- Major clubs from popular sports (football, rugby, athletics)
- Distributed across different regions
- Real contact information where available

### Upcoming Events (Next 3-6 months)
- Major national competitions
- Regional tournaments
- International events hosted in Namibia

### Featured Athletes (10-15)
- Olympic athletes
- Commonwealth Games participants
- National champions
- Rising stars

---

## 🚀 Deployment Setup

### GitHub Repository
- Create new private repository: `namibia-sports-system`
- Same structure as coastal-namibia portal

### Netlify Configuration
- Auto-deploy from GitHub main/master branch
- Build command: `pnpm build:netlify`
- Environment variables:
  ```
  DATABASE_URL=postgresql://...
  VITE_DATABASE_URL=postgresql://...
  ```

### Domain
- Suggest: `sports.namibia.na` or `namibiasports.com`
- Or use Netlify subdomain: `namibia-sports.netlify.app`

---

## 🎯 Success Criteria

### Phase 1: Public Portal (Week 1-2)
- [ ] Homepage with hero carousel and statistics
- [ ] Federation directory (all 58 federations)
- [ ] Club directory (searchable/filterable)
- [ ] Events calendar
- [ ] Athlete profiles
- [ ] Contact form
- [ ] Responsive design matching tourism portals

### Phase 2: Admin Dashboard (Week 3-4)
- [ ] Admin authentication and role management
- [ ] Federation CRUD operations
- [ ] Club CRUD operations
- [ ] Event CRUD operations
- [ ] Athlete CRUD operations
- [ ] Media upload and management
- [ ] User management

### Phase 3: Advanced Features (Week 5-6)
- [ ] Event registration system
- [ ] Results tracking
- [ ] Statistics and reports
- [ ] Email notifications
- [ ] Calendar integration
- [ ] Mobile app considerations

---

## 📝 Prompt for New Manus Instance

**Copy and paste this to the new Manus instance:**

---

### START OF PROMPT

I need you to build a **Namibia Sports Management System** that showcases all 58 sports federations and governing bodies in Namibia. This system should maintain the same design language, structure, and technical stack as our existing tourism portals.

**Context:**
We have successfully built 3 tourism portals (Main Namibia, Windhoek, and Coastal Namibia) with a consistent design system. The Coastal Namibia portal is at https://github.com/nrupeshsoni/coastal-namibia and deployed at https://swakop.netlify.app.

**Technical Stack (MUST USE):**
- React 19 + TypeScript + Vite
- Tailwind CSS 4
- Wouter routing
- Framer Motion animations
- tRPC 11 + Express backend
- PostgreSQL (Supabase) with Drizzle ORM
- Netlify deployment
- pnpm package manager

**Design Requirements:**
- Full-screen hero carousel (7 images, 5-second intervals)
- Athletic color scheme: Red (#EF4444), Gold (#FBBF24), Green (#10B981), Blue (#3B82F6)
- Glassmorphic cards with hover animations
- Minimal fixed header with hamburger menu
- Modal popups for detailed views
- Georgia serif typography with wide letter-spacing
- Framer Motion animations (8 variants: fade up/down/left/right, scale, rotate, blur, diagonal)

**Database:**
- Prefix: `namibia_sports_`