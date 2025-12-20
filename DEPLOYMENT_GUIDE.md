# Namibia Sports Platform - Deployment Guide

## Overview
Comprehensive sports management platform for Namibia with 65 sporting federations, clubs, events, athletes, and high-performance systems.

---

## Database Setup (Supabase)

### Step 1: Run SQL Migration Script

1. Open your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Open the file `supabase-migration.sql` in this project
4. Copy the entire SQL script
5. Paste it into the Supabase SQL Editor
6. Click **Run** to execute the migration

This will create:
- All database tables with `namibia_na_26_` prefix
- All 65 federations with contact data
- Proper indexes and relationships

### Step 2: Verify Database

After running the migration, verify in Supabase:
- Go to **Table Editor**
- You should see all tables: `namibia_na_26_federations`, `namibia_na_26_clubs`, `namibia_na_26_events`, etc.
- Check `namibia_na_26_federations` table - should have 65 rows

---

## Environment Variables

The platform requires the following environment variable:

```
DATABASE_URL=postgresql://postgres:N@mibia!23Sports@db.rbibqjgsnrueubrvyqps.supabase.co:5432/postgres
```

**For Netlify Deployment:**
1. Go to Netlify Dashboard → Site Settings → Environment Variables
2. Add `DATABASE_URL` with the Supabase connection string above

---

## Features Implemented

### Frontend (Public Portal)
- ✅ Full-screen hero carousel with sports stadium images
- ✅ Responsive federation grid (65 sporting bodies)
- ✅ Pop-up modals with federation details
- ✅ Statistics section
- ✅ Namibia flag color scheme (red, blue, gold, green)
- ✅ Smooth animations and transitions
- ✅ Mobile-responsive design

### Backend (Admin Dashboard)
- ✅ Federation management interface
- ✅ Clubs management (linked to federations)
- ✅ Events/calendar management
- ✅ Athletes management
- ✅ Coaches management
- ✅ Venues/facilities management
- ✅ Complete tRPC API with CRUD operations

### Database Structure
- ✅ 10 comprehensive tables
- ✅ Role-based access control (admin, federation_admin, club_manager)
- ✅ Proper relationships and foreign keys
- ✅ All 65 federations pre-populated

---

## Data Included

### 65 Sporting Bodies:

**57 Sports Federations:**
Athletics, Freshwater Angling, Seawater Angling, Archery, Badminton, Basketball, Bowling, Boxing, Canoe & Rowing, Chess, Cricket, Cycling, Dance Sport, Darts, Fistball, E-Sports, Equestrian, Fencing, Football, Golf, Gymnastics, Hockey, Horse Racing, Icestock, Ice & Inline Hockey, Judo, Jukskei, Karate, Kendo, Kickboxing, Motor Sport, Netball, Powerlifting & Weightlifting, Practical Shooting, Rugby, Swimming, Saddle Seat Equestrian, Sailing, Squash, Speed Hiking, Sport Shooting, Tennis, Triathlon, Volleyball, Waterski, Wrestling, Premier League, Table Tennis, Teqball, Taekwondo, Indigenous Combat Sport, Full-Contact Martial Arts, Pool & Billiard, Muaythai, Mixed Martial Arts, Traditional Sport & Games, Endurance Riding

**8 Umbrella Bodies:**
- Disability Sport Namibia
- Namibia Women in Sport Association (NAWISA)
- Namibia National Students Sports Union (NNSU)
- Namibia National Olympic Committee (NNOC)
- TISAN
- Uniformed Forces/Services Sport Association
- Local Authority Sports and Recreation Association
- Martial Arts Namibia

---

## API Endpoints (tRPC)

All API endpoints are available through tRPC:

### Federations
- `federations.list` - Get all federations (with filters)
- `federations.getById` - Get single federation
- `federations.getBySlug` - Get federation by slug
- `federations.create` - Create new federation (protected)
- `federations.update` - Update federation (protected)
- `federations.delete` - Delete federation (protected)

### Clubs
- `clubs.list` - Get all clubs (filterable by federation, region)
- `clubs.getById` - Get single club
- `clubs.create` - Create new club (protected)
- `clubs.update` - Update club (protected)
- `clubs.delete` - Delete club (protected)

### Events
- `events.list` - Get all events (filterable by federation, upcoming)
- `events.getById` - Get single event
- `events.create` - Create new event (protected)
- `events.update` - Update event (protected)
- `events.delete` - Delete event (protected)

### Athletes, Coaches, Venues
- Similar CRUD operations for athletes, coaches, and venues

---

## Next Steps

### Immediate:
1. **Run the SQL migration** in Supabase SQL Editor
2. **Set DATABASE_URL** environment variable
3. **Deploy to Netlify** (or your preferred platform)

### Future Enhancements:
1. **Source federation logos** - Add unique logos for each of the 65 federations
2. **Source sport-specific photos** - Replace generic images with sport-specific imagery
3. **Build clubs management UI** - Full interface for adding/editing clubs
4. **Build events calendar UI** - Visual calendar with event management
5. **Add athlete profiles** - Detailed athlete management system
6. **Implement search & filters** - Advanced search across all entities
7. **Add file uploads** - Logo and photo upload functionality using Supabase Storage
8. **Build reports & analytics** - Statistics and insights dashboard
9. **Add authentication** - Federation-specific admin logins
10. **Mobile app** - PWA or native mobile application

---

## File Structure

```
namibia_sports_platform/
├── client/                          # Frontend React app
│   ├── public/images/hero/         # Hero carousel images
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx            # Landing page with hero & grid
│   │   │   └── Admin.tsx           # Admin dashboard
│   │   └── components/
│   │       └── FederationModal.tsx # Pop-up modal
├── server/
│   ├── routers.ts                  # tRPC API endpoints
│   └── db.ts                       # Database helpers
├── drizzle/
│   └── schema.ts                   # PostgreSQL schema
├── supabase-migration.sql          # Complete database migration
├── federation-data.json            # All 65 federations data
└── DEPLOYMENT_GUIDE.md             # This file
```

---

## Support

For questions or issues with the platform, refer to:
- Supabase documentation: https://supabase.com/docs
- tRPC documentation: https://trpc.io/docs
- Drizzle ORM documentation: https://orm.drizzle.team/docs/overview

---

## Database Schema Overview

### Main Tables:
1. **namibia_na_26_federations** - All 65 sporting bodies
2. **namibia_na_26_clubs** - Clubs linked to federations
3. **namibia_na_26_events** - Competitions, tournaments, workshops
4. **namibia_na_26_athletes** - Athlete profiles and performance
5. **namibia_na_26_coaches** - Coach profiles and certifications
6. **namibia_na_26_venues** - Sports facilities and venues
7. **namibia_na_26_schools** - Schools offering sports programs
8. **namibia_na_26_media** - Photos and videos for all entities
9. **namibia_na_26_hp_programs** - High-performance programs
10. **users** - Authentication and role-based access

---

## Naming Convention

All database tables use the prefix: `namibia_na_26_`

This ensures:
- Clear identification of Namibia sports platform tables
- No conflicts with other projects in the same database
- Easy migration and backup operations

---

**Platform Status:** ✅ Ready for Deployment
**Last Updated:** December 2024
