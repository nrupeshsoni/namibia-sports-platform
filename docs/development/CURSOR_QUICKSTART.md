# Cursor Quickstart — Launch Parallel Agents

## How It Works

You open **4 Cursor windows** on the same project. Each window runs its own Claude Code agent with a specific role. They work on separate files so there are no conflicts.

---

## Step 0: Create Feature Branches (run once in terminal)

```bash
cd C:\Users\Nrupesh\Documents\Projects\namibia-sports-platform

# Create branches from main
git checkout main
git branch feat/schema-evolution
git branch feat/federation-pages
git branch feat/auth-system
git branch feat/news-streams

# Or use worktrees for true isolation:
git worktree add ../sports-agent-B feat/schema-evolution
git worktree add ../sports-agent-A feat/federation-pages
git worktree add ../sports-agent-A2 feat/auth-system
git worktree add ../sports-agent-B2 feat/news-streams
```

---

## Step 1: Open 4 Cursor Windows

1. File → New Window → Open `namibia-sports-platform` (or the worktree folder)
2. Repeat 3 more times
3. In each window, open Claude Code (Ctrl+L or the sidebar)

---

## Step 2: Paste the Agent Prompts

### Window 1 — Agent B (Backend/Schema) — START THIS FIRST

```
You are Agent B (Backend) for the Namibia Sports Platform (sports.com.na).

FIRST: Read these files to understand the project:
- CLAUDE.md (conventions, structure, commands)
- SKILLS.md (tRPC procedures, schema reference)
- drizzle/schema.ts (current DB schema)
- server/routers.ts (current tRPC routers)

YOUR OWNERSHIP: server/, drizzle/
DO NOT modify files in client/ — only create/modify server-side files.

TASK — Phase 1 Backend Foundation:

1. SCHEMA EVOLUTION (drizzle/schema.ts):
   - Add `slug` field (varchar, unique, not null) to namibia_na_26_federations
   - Add `primaryColor` field (varchar) to namibia_na_26_federations
   - Add `secondaryColor` field (varchar) to namibia_na_26_federations
   - Create new table: namibia_na_26_news_articles (id, title, slug, content, summary, federationId, authorId, category, tags, featuredImage, isPublished, publishedAt, createdAt, updatedAt)
   - Create new table: namibia_na_26_live_streams (id, title, federationId, platformType, streamUrl, embedUrl, thumbnailUrl, scheduledStart, scheduledEnd, isLive, viewerCount, createdAt, updatedAt)
   - Create new table: namibia_na_26_whatsapp_subscriptions (id, phone, userId, federationId, subscriptionTypes, isActive, createdAt)

2. RELATIONS (drizzle/relations.ts):
   - Define all relations between existing tables
   - Federations → clubs, events, athletes, coaches, venues, news, streams (one-to-many)
   - Clubs → athletes (one-to-many)
   - Users → federations (many-to-one via federationId)

3. SPLIT ROUTERS:
   - Split server/routers.ts into separate files under server/routers/
   - Create: server/routers/index.ts (combines all), federations.ts, clubs.ts, events.ts, athletes.ts, coaches.ts, venues.ts, auth.ts, system.ts
   - Add getBySlug to federations router
   - Keep all existing functionality working

4. NEW ROUTERS:
   - Create server/routers/news.ts (list, getBySlug, create, update, publish, delete)
   - Create server/routers/streams.ts (list, getById, create, update, setLive)

After completing, run: npm run check
Then run: npm run build

Tell me when you're done so I can merge and start Agent A.
```

---

### Window 2 — Agent A (Frontend/Pages) — START AFTER Agent B finishes schema

```
You are Agent A (Frontend) for the Namibia Sports Platform (sports.com.na).

FIRST: Read these files to understand the project:
- CLAUDE.md (conventions, structure, commands)
- SOUL.md (brand identity, design principles)
- SKILLS.md (component library, routing map, glass card patterns)
- client/src/App.tsx (current routes)
- client/src/pages/Home.tsx (reference for styling patterns)

YOUR OWNERSHIP: client/src/pages/, client/src/components/, client/src/App.tsx
DO NOT modify server/ or drizzle/ files.

TASK — Federation Sub-site Pages:

1. UPDATE ROUTING (client/src/App.tsx):
   Add these routes:
   - /federation/:slug → FederationLayout > FederationHome
   - /federation/:slug/events → FederationLayout > FederationEvents
   - /federation/:slug/clubs → FederationLayout > FederationClubs
   - /federation/:slug/athletes → FederationLayout > FederationAthletes
   - /federation/:slug/news → FederationLayout > FederationNews
   - /federation/:slug/streams → FederationLayout > FederationStreams
   - /news → News (aggregated)
   - /live → Live (aggregated streams)
   - /login → Login
   - /register → Register

2. BUILD FEDERATION LAYOUT (client/src/pages/federation/FederationLayout.tsx):
   - Fetches federation by slug from URL param using trpc.federations.getBySlug
   - Shows federation logo, name, description in a glassmorphism hero banner
   - Tab navigation bar for sub-pages (Home, Events, Clubs, Athletes, News, Streams)
   - Wraps child pages with federation context
   - Loading skeleton while data loads
   - 404 state if federation not found

3. BUILD FEDERATION PAGES:
   Each page uses glassmorphism cards, Framer Motion fadeUp animations, and is mobile-first.

   - FederationHome.tsx: Hero with stats (clubs count, athletes, events), recent news (3 cards), upcoming events (3 items), live stream banner if active
   - FederationEvents.tsx: Calendar/list toggle, filter by event type, glass cards per event
   - FederationClubs.tsx: Grid of club cards with search + region filter
   - FederationAthletes.tsx: Athlete directory with search, club filter
   - FederationNews.tsx: News article cards, category filter
   - FederationStreams.tsx: Embedded player for active stream + upcoming schedule

4. BUILD AGGREGATED PAGES:
   - News.tsx: Aggregated news from all federations, filterable by sport
   - Live.tsx: Grid of all active live streams across federations, with "LIVE" pulse badge

DESIGN RULES (from SOUL.md):
- Dark background (#0a0a0a), glassmorphism cards
- Brand colors: Red #EF4444, Gold #FBBF24, Green #10B981, Blue #3B82F6
- Framer Motion fadeUp on all cards, stagger on grids
- Mobile-first (375px), responsive to desktop
- Use shadcn/ui components (Button, Card, Badge, Tabs, Input, etc.)
- Live streams get a pulsing red dot badge

After completing, run: npm run check
```

---

### Window 3 — Agent A2 (Auth System) — CAN RUN IN PARALLEL with Agent A

```
You are Agent A2 (Auth) for the Namibia Sports Platform (sports.com.na).

FIRST: Read these files:
- CLAUDE.md (auth section, RBAC roles)
- SKILLS.md (auth patterns section)
- client/src/contexts/ (any existing auth context)
- client/src/lib/supabase.ts (existing Supabase client setup)

YOUR OWNERSHIP: client/src/contexts/AuthContext.tsx, client/src/pages/auth/, client/src/components/ProtectedRoute.tsx
DO NOT modify App.tsx (Agent A owns it), server/ files, or other pages.

TASK — Supabase Auth Client-Side:

1. AUTH CONTEXT (client/src/contexts/AuthContext.tsx):
   - Initialize Supabase Auth client
   - Listen to onAuthStateChange
   - Store session (access_token, refresh_token) in state
   - Expose: user, session, isLoading, isAuthenticated
   - Helper methods: isFederationAdmin(federationId), isAdmin(), isClubManager(clubId)
   - signIn(email, password), signUp(email, password, metadata), signOut()
   - Google OAuth: signInWithGoogle()
   - Auto-refresh tokens

2. LOGIN PAGE (client/src/pages/auth/Login.tsx):
   - Glassmorphism card centered on dark background
   - Email + password form (shadcn/ui Input, Button)
   - "Sign in with Google" button
   - "Forgot password?" link
   - "Don't have an account? Register" link
   - Error handling with toast notifications
   - Redirect to / on success, or to returnUrl if provided

3. REGISTER PAGE (client/src/pages/auth/Register.tsx):
   - Similar glassmorphism design
   - Full name, email, password, confirm password
   - Optional: federation selection dropdown (for federation admins)
   - Terms acceptance checkbox
   - "Already have an account? Login" link

4. PROTECTED ROUTE (client/src/components/ProtectedRoute.tsx):
   - Wraps protected pages
   - If not authenticated → redirect to /login?returnUrl=current
   - If authenticated but wrong role → show "Access Denied" page
   - Props: requiredRole?: 'admin' | 'federation_admin' | 'club_manager'
   - Props: federationId?: number (for federation admin scope check)

5. AUTH HEADER COMPONENT (client/src/components/AuthHeader.tsx):
   - If logged in: show avatar, name, dropdown (Profile, Dashboard, Logout)
   - If not logged in: show "Login" and "Register" buttons
   - Glassmorphism dropdown menu

After completing, run: npm run check
```

---

### Window 4 — Agent D (Data Population) — RUN AFTER Agent B finishes schema

```
You are Agent D (Data/Content) for the Namibia Sports Platform (sports.com.na).

FIRST: Read these files:
- CLAUDE.md (database conventions, table prefix)
- drizzle/schema.ts (table definitions)
- docs/research/ (any existing federation data)

YOUR OWNERSHIP: docs/, SQL scripts, data files
DO NOT modify client/ or server/ code.

TASK — Data Population:

1. FEDERATION SLUGS:
   Create a SQL script at docs/scripts/001-add-federation-slugs.sql that:
   - Generates URL-safe slugs from federation abbreviations (lowercase, hyphens)
   - Updates all 67 federation records with their slug
   - Examples: "NFA" → "nfa", "Namibia Rugby Union" → "nru"

2. FEDERATION SEED DATA:
   Create docs/scripts/002-federation-contact-data.sql that updates all 57 federations with:
   - Contact details from the research PDF (email, phone, physical address)
   - President and Secretary General names
   - Social media links (where available)
   - Website URLs (where available)
   The federation contact data for all 57 codes (from the Feb 2025 PDF):

   Include ALL of these federations:
   - Archery Association of Namibia
   - Athletics Namibia
   - Badminton Namibia
   - Baseball & Softball Namibia
   - Basketball Artists Association of Namibia
   - Namibia Billiards & Snooker Association
   - Namibia Body Building & Fitness Association
   - Namibia Boxing Federation
   - Canoe Federation of Namibia
   - Chess Namibia
   - Cricket Namibia
   - Cycling Namibia
   - Darts Namibia
   - Equestrian Namibia
   - Namibia Fencing Association
   - Namibia Football Association
   - Golf Union of Namibia
   - Gymnastics Federation of Namibia
   - Handball Federation of Namibia
   - Namibia Hockey Union
   - Ice Hockey Namibia
   - Judo Association of Namibia
   - Karate Federation of Namibia
   - Kickboxing Namibia
   - Lawn Bowls Namibia
   - MMA Namibia
   - Motor Sport Namibia
   - Mountaineering Association
   - Namibia Netball Association
   - Orienteering Namibia
   - Paravolley Namibia
   - Petanque Namibia
   - Powerlifting Namibia
   - Rowing Namibia
   - Namibia Rugby Union
   - Sailing Namibia
   - Shooting Sport Namibia
   - Skateboarding Namibia
   - Squash Namibia
   - Surfing Namibia
   - Namibia Swimming
   - Namibia Table Tennis Association
   - Taekwondo Namibia
   - Namibia Tennis Association
   - Triathlon Namibia
   - Tug of War Namibia
   - Volleyball Namibia
   - Water Polo Namibia
   - Weightlifting Namibia
   - Wrestling Namibia
   (and remaining codes to reach 57)

3. SAMPLE DATA:
   Create docs/scripts/003-sample-content.sql with:
   - 10 sample clubs (across 5 different federations)
   - 10 sample upcoming events (across different sports)
   - 5 sample news articles
   - 3 sample live stream entries

This data is for development and demo purposes — real data will come from federation admins.

After creating all scripts, verify the SQL syntax is correct for PostgreSQL.
```

---

## Merge Order

```
1. Agent B (schema + routers)     → merge to main first
2. Agent D (data scripts)         → run SQL in Supabase after Agent B
3. Agent A (federation pages)     → merge after schema is on main
4. Agent A2 (auth)                → merge last (independent of others)
```

## After All Agents Finish

Run in terminal:
```bash
git checkout main
git merge feat/schema-evolution
git merge feat/federation-pages
git merge feat/auth-system

npm run check   # must pass
npm run build   # must succeed
npm run dev     # smoke test locally

git push origin main  # triggers Netlify deploy
```
