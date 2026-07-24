# System Design — Namibia Sports Platform

## Architecture Overview

```
Browser / PWA
      │
      ├── React 19 SPA (Vite, Wouter, TanStack Query)
      │        │
      │        ├── tRPC client → /api/trpc  (same origin — no CORS in production)
      │        └── Supabase Auth JS SDK → Supabase Auth
      │
Cloudflare Worker "namibia-sports-platform"  (apex sports.com.na, Custom Domain)
      │
      ├── Static assets (dist/public) — Workers Static Assets, SPA fallback
      │
      └── Worker code (/api/* only, via run_worker_first)
               │
               ├── tRPC v11 (server/worker.ts → server/_core)
               │        │
               │        └── Drizzle ORM → Hyperdrive → Supabase PostgreSQL
               │            (Workers cannot open arbitrary TCP sockets, so the
               │             pooled Hyperdrive connection string is the DB path.
               │             Its origin role bypasses RLS — see RLS_POLICIES.md)
               │
               ├── POST /api/webhooks/whatsapp → WhatsApp Business API
               └── POST /api/webhooks/youtube  → YouTube Data API

Supabase
      ├── PostgreSQL (sportsplatform_* tables — shared instance, 15+ other products)
      ├── Auth (JWT, email/password, OAuth)
      ├── Storage (logos, images, documents)
      └── Edge Functions (cron jobs, heavy AI processing)
            ├── news-aggregator (every 6h)
            └── weekly-digest (every Monday 8am)

External Services
      ├── Anthropic Claude API (AI features)
      ├── WhatsApp Business API (notifications)
      ├── YouTube Data API (stream metadata)
      └── Web Push (browser notifications)
```

---

## Federation Sub-site Architecture

Federation pages use **dynamic path-based routing** (not subdomains):

```
sports.com.na/federation/:slug  →  FederationLayout (fetches data by slug)
                                         └── child pages: home, events, clubs,
                                             athletes, news, streams, admin
```

**Why not subdomains?** Subdomains (nfa.sports.com.na) would require wildcard DNS plus a Custom Domain record per federation (57+). Path-based routing achieves the same result with zero DNS configuration per federation. Subdomain support could be added later inside the existing Worker by rewriting `{slug}.sports.com.na` → `/federation/{slug}` — note that a Custom Domain binds to exactly one Worker, and `system.sports.com.na` already belongs to the DOME X Worker.

**How new federation pages are created:** Adding a federation to the database automatically creates its page — no code deployment needed. The slug in the database becomes the URL path.

---

## Authentication Flow

```
1. User visits /login
2. Enters email/password (or clicks Google/Facebook OAuth)
3. Supabase Auth returns JWT (access_token + refresh_token)
4. Client stores tokens in memory (AuthContext) + localStorage for persistence
5. tRPC client sends Authorization: Bearer {access_token} on every request
6. Server verifies JWT with Supabase service role key
7. Fetches user record from `users` table by supabaseUid
8. Attaches user object to tRPC context
9. Middleware checks role for protected procedures
```

**Platform admin login:**
1. Sign in at `https://sports.com.na/login` (or `/admin`, which redirects unauthenticated users to login).
2. Role lives in `sportsplatform_users.role` (`admin`). Auth credentials are Supabase Auth — not stored in that table.
3. Password reset: Supabase Dashboard → Authentication → Users → select user → Send password recovery / reset. There is no in-app “forgot password” UI yet.
4. Promote after self-register: an existing platform admin uses `/admin` → Users → set role to `admin`, or run SQL: `UPDATE sportsplatform_users SET role = 'admin' WHERE email = '…';` (user must already exist via Auth + app login sync).

**Federation admin onboarding:**
1. Federation admin registers with email
2. Super admin approves and sets `role = 'federation_admin'` + `federationId`
3. Admin receives WhatsApp/email confirmation
4. Admin can now manage their federation's data

---

## Data Flow: Main Portal Homepage

```
Home.tsx loads
    │
    ├── trpc.federations.list() ──────────────→ federations grid
    ├── trpc.events.list({ upcoming: true }) → events carousel
    ├── trpc.streams.list({ isLive: true }) ─→ live stream banners
    └── trpc.news.list({ limit: 6 }) ────────→ news feed

All queries use React Query with:
    - federations: staleTime 5min (rarely changes)
    - events: staleTime 2min
    - streams: staleTime 30sec (must be fresh)
    - news: staleTime 2min
```

---

## AI Pipeline: News Aggregation

```
Supabase Edge Function (cron: every 6h)
    │
    ├── Fetch from Namibian sources:
    │       - The Namibian (sports section RSS)
    │       - New Era (sports RSS)
    │       - NBC Sport (scrape)
    │       - NSC press releases
    │
    ├── For each article:
    │       ├── Deduplicate (check URL hash in DB)
    │       ├── Claude API: extract sport/federation category
    │       ├── Claude API: generate 150-word summary
    │       ├── Claude API: suggest 3-5 tags
    │       └── Insert into namibia_na_26_news_articles (isPublished: false)
    │
    └── Notify admin via WhatsApp: "X new articles pending review"

Federation admin reviews in dashboard → publishes selected articles
```

---

## WhatsApp Notification Flow

```
Trigger event (e.g., new event created by federation admin)
    │
    ├── server/services/notification-dispatcher.ts fires
    │
    ├── Query: SELECT * FROM whatsapp_subscriptions
    │          WHERE federationId = ? OR federationId IS NULL
    │          AND subscriptionType IN ('events', 'all')
    │          AND isActive = true
    │
    ├── Batch messages (max 1000/sec per WhatsApp API limits)
    │
    └── POST to WhatsApp Business API
            Template: EVENT_REMINDER
            Variables: [eventName, date, venue, registrationUrl]
```

---

## Live Streaming Architecture

The platform does NOT host video. It is an aggregator and directory.

```
Federation admin adds stream URL
    │
    ├── Auto-detect platform from URL:
    │       youtube.com/watch?v=* → YouTube embed
    │       youtube.com/live/* → YouTube Live embed
    │       fb.com/*/live → Facebook Live embed
    │       twitch.tv/* → Twitch embed
    │       custom URL → iframe embed
    │
    ├── Store in namibia_na_26_live_streams:
    │       { platformType, streamUrl, embedCode, scheduledStart, isLive }
    │
    ├── Federation admin sets isLive = true when stream starts
    │       → triggers notification to subscribers
    │
    └── Embed rendered via <StreamEmbed streamUrl={url} />
```

Optional enhancement: YouTube Data API polling every 5min to auto-detect when a YouTube stream goes live (avoids manual toggle).

---

## PWA Strategy

```
vite-plugin-pwa generates:
    ├── /manifest.json  → installable as app
    ├── /sw.js          → service worker
    └── precache manifest

Caching strategies:
    ├── Static assets (JS/CSS/fonts): Cache-first, 1 year
    ├── API calls (/api/trpc/*): Network-first, cache fallback (5min)
    ├── Images (Supabase Storage): Stale-while-revalidate, 1 hour
    └── Offline fallback: /offline.html for no-network scenario

Push notifications:
    ├── User subscribes via browser prompt
    ├── Subscription stored in users.pushSubscription (JSON)
    └── Server sends via web-push library when events trigger
```

---

## Database Indexing Strategy

Critical indexes to add (performance at scale with 57 federations + large club/event datasets):

```sql
-- Federation lookups by slug (most common)
CREATE INDEX idx_federations_slug ON namibia_na_26_federations(slug);

-- Events by federation + date (federation calendar pages)
CREATE INDEX idx_events_federation_date ON namibia_na_26_events(federation_id, start_date);

-- News by federation + published (news feeds)
CREATE INDEX idx_news_federation_published ON namibia_na_26_news_articles(federation_id, published_at DESC);

-- Clubs by federation + region (club directories)
CREATE INDEX idx_clubs_federation_region ON namibia_na_26_clubs(federation_id, region);

-- Active streams (homepage live stream section)
CREATE INDEX idx_streams_live ON namibia_na_26_live_streams(is_live, scheduled_start);

-- WhatsApp subscriptions (notification dispatch)
CREATE INDEX idx_whatsapp_active ON namibia_na_26_whatsapp_subscriptions(federation_id, is_active);
```

---

## Scalability Projections

| Metric | Current | 6 months | 2 years |
|--------|---------|----------|---------|
| Federations | 67 | 67 | 67 (fixed) |
| Clubs | ~0 | ~500 | ~2,000 |
| Athletes | ~0 | ~5,000 | ~20,000 |
| Events/year | ~0 | ~500 | ~2,000 |
| News articles | ~0 | ~1,000 | ~10,000 |
| WhatsApp subscribers | 0 | ~5,000 | ~50,000 |
| Monthly users | ~100 | ~10,000 | ~100,000 |

Supabase free tier handles up to 50,000 MAU. Pro tier ($25/mo) for 100k+. On Workers, only `/api/*` counts as an invocation — static asset requests are served by the asset layer and are not billed as invocations, so SPA traffic does not consume the request budget. `limits.subrequests` is raised to 50,000 in `wrangler.jsonc`.
