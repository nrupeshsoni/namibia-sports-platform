# Namibia Sports Platform - Deployment Guide

**Last updated:** 2026-07-21
**Platform:** Cloudflare Workers. Live on the apex **sports.com.na** since 2026-07-19.

## Overview
Comprehensive sports management platform for Namibia with 65 sporting federations, clubs, events, athletes, and high-performance systems.

Deployment is one Cloudflare Worker, `namibia-sports-platform`, serving both the SPA
(Static Assets from `dist/public`) and the API (`/api/*` via `run_worker_first`).
Config lives in `wrangler.jsonc`; the entry point is `server/worker.ts`.
Pipeline detail: [`docs/CI.md`](docs/CI.md).

> Netlify is not used. `netlify.toml` and the Netlify sections that used to be in
> this guide are gone — that path holds no DNS and serves no traffic.

---

## Deploying

```bash
npm run cf:dryrun          # build + wrangler deploy --dry-run (resolves config, uploads nothing)
npm run cf:deploy          # production — the apex
npm run cf:deploy:staging  # namibia-sports-platform-staging on workers.dev
npm run cf:tail            # live logs
```

`main` also auto-deploys via **Cloudflare Workers Builds**, so the same Worker has
two writers and last-writer-wins. After any deploy, confirm the version that is
actually serving:

```bash
npx wrangler deployments status --name namibia-sports-platform
```

### Rollback

Not a dashboard republish — a Worker **version** rollback. Assets ship inside the
version, so this restores the SPA and API together.

```bash
npx wrangler versions list      --name namibia-sports-platform
npx wrangler rollback [VERSION_ID] --name namibia-sports-platform --message "reason"
```

Limits: the 100 most recent versions only; rollback does **not** revert secrets or
bindings, and is refused if a binding referenced by the target version no longer
exists (this Worker binds `HYPERDRIVE` and `ASSETS`).

---

## Configuration

### Secrets — Worker only

```bash
npx wrangler secret put SUPABASE_ANON_KEY           # verifies caller JWTs
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY   # storage uploads ONLY
npx wrangler secret put ANTHROPIC_API_KEY           # ai router
npx wrangler secret list --name namibia-sports-platform
```

`SUPABASE_URL` is a non-secret `var` in `wrangler.jsonc`. There is no hosting
dashboard holding environment variables.

> `SUPABASE_ANON_KEY` must never hold a service-role key. It would not improve
> anything and would silently remove JWT-scoped access. See
> [`docs/architecture/RLS_POLICIES.md`](docs/architecture/RLS_POLICIES.md).

### Database — Hyperdrive, not DATABASE_URL

Workers cannot open arbitrary TCP sockets, so Postgres is reached through the
`HYPERDRIVE` binding declared in `wrangler.jsonc`. The committed pooler
`DATABASE_URL` is **stale** (Supabase moved the pooler host) and is used for local
development only.

```bash
# Update the origin connection string (after rotating credentials)
npx wrangler hyperdrive update <ID> --connection-string="postgres://<role>:<pw>@<host>:5432/postgres"
```

> **Open critical issue (gap B1):** the Hyperdrive origin role is the `postgres`
> superuser (`rolbypassrls = true`, full DDL over all ~737 tables on this shared
> instance) and its password is in this repo's public git history, unrotated.
> Rotate it, create a role scoped to `sportsplatform_*` without `BYPASSRLS`, then
> `hyperdrive update`. Do this before anything else on this platform.

### Database schema

1. Open the Supabase project dashboard → **SQL Editor**
2. Run `supabase-migration.sql`
3. Verify the `sportsplatform_*` tables exist and `sportsplatform_federations` has 65 rows

Ongoing changes: `npm run db:generate` then `npm run db:migrate`.
**Never `drizzle-kit push`** — it would emit `DROP TABLE` for the ~724 tables on
this shared instance belonging to other products.

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
