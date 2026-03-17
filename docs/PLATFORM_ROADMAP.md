# Platform Roadmap — sports.com.na

## Vision
THE definitive sports platform for Namibia. One place for all 57 federations, every club, every athlete, every event, every live stream — powered by AI, delivered via WhatsApp, beautiful on any screen.

---

## Phase 1 — Foundation (Week 1)
**Goal: Correct the technical debt and lay the architecture**

### Database
- [ ] Add `slug` field to `namibia_na_26_federations` + generate slugs from existing data
- [ ] Define Drizzle relations in `drizzle/relations.ts`
- [ ] Create new tables: `news_articles`, `live_streams`, `whatsapp_subscriptions`, `results`, `sponsors`, `federation_pages`
- [ ] Add indexes for performance (slug, federation_id+date, live streams)
- [ ] Run migration in Supabase

### Backend
- [ ] Split `server/routers.ts` into `server/routers/` directory (one file per domain)
- [ ] Add `getBySlug` to federations router
- [ ] Create `news` router (list, getBySlug, create, update, publish)
- [ ] Create `streams` router (list, create, setLive)

### Documentation
- [x] CLAUDE.md — project conventions and commands
- [x] SOUL.md — brand identity and principles
- [x] SKILLS.md — developer reference for agents
- [x] docs/architecture/SYSTEM_DESIGN.md
- [x] docs/development/AGENT_WORKFLOWS.md

---

## Phase 2 — Authentication Overhaul (Week 2)
**Goal: Replace localStorage auth with Supabase Auth + proper RBAC**

- [ ] Server: Supabase JWT verification in tRPC context (`server/auth/supabase-auth.ts`)
- [ ] Server: Add `federationAdminProcedure` and `clubManagerProcedure` middleware
- [ ] Client: `AuthContext` with Supabase Auth JS SDK
- [ ] Client: `Login.tsx` — glassmorphism, email/password + Google/Facebook OAuth
- [ ] Client: `Register.tsx` — with role selection
- [ ] Client: `ProtectedRoute.tsx` component
- [ ] Federation admin onboarding flow (request → super admin approves)

**RBAC Matrix:**
| Role | Own Federation | Other Federations | Admin Dashboard |
|------|---------------|------------------|-----------------|
| Public | Read | Read | No |
| User | Read + subscribe | Read | No |
| Club Manager | Manage own club | Read | Club panel |
| Federation Admin | Full CRUD | Read | Federation panel |
| Super Admin | Full | Full | Full |

---

## Phase 3 — Federation Sub-sites (Week 2-3)
**Goal: Every federation gets a full sub-site at /federation/:slug**

URL structure:
```
/federation/:slug             — Landing page
/federation/:slug/events      — Events calendar
/federation/:slug/clubs       — Club directory
/federation/:slug/athletes    — Athlete profiles
/federation/:slug/news        — News feed
/federation/:slug/streams     — Live streams
/federation/:slug/admin       — Admin portal (protected)
```

### Pages to Build
- [ ] `FederationLayout.tsx` — shared layout with federation branding, tabs nav
- [ ] `FederationHome.tsx` — hero, stats, recent news, upcoming events, live stream
- [ ] `FederationEvents.tsx` — calendar + list view, filter by type/date
- [ ] `FederationClubs.tsx` — grid with search + region filter
- [ ] `FederationAthletes.tsx` — athlete directory
- [ ] `FederationNews.tsx` — news articles list
- [ ] `FederationStreams.tsx` — embedded stream player + schedule

### Automation
Federation pages are **100% data-driven** — adding a federation to the database automatically creates its page. No code deploy needed per federation.

---

## Phase 4 — Federation Admin Dashboard (Week 3)
**Goal: Each federation can self-manage their entire presence**

- [ ] Dashboard overview (stats, recent activity, quick actions)
- [ ] Profile editor (name, description, logo, colors, contact info, social media)
- [ ] Events CRUD with calendar UI
- [ ] Clubs management (add/edit/remove clubs under federation)
- [ ] Athletes management (profiles, club assignments)
- [ ] News editor with rich text + image upload
- [ ] Live streams manager (add YouTube/FB/Twitch URL, set live status)
- [ ] Settings (admin user management for the federation)

---

## Phase 5 — Main Portal Redesign (Week 4)
**Goal: The homepage becomes THE sports hub for Namibia**

### Sections
1. **Live Now** — Active streams across all federations (pulsing red badges)
2. **Hero Carousel** — Rotating sports imagery with key stats overlay
3. **Latest News** — Aggregated from all federations, 6 cards
4. **Upcoming Events** — Next 7 days across all codes
5. **Federation Grid** — All 57, filterable by category, links to sub-sites
6. **Featured Athletes** — Spotlight section, rotating
7. **Regions Map** — Interactive Namibia map, click region to filter

### Features
- [ ] Global search (Cmd+K command palette, searches all entities)
- [ ] PWA manifest + service worker setup
- [ ] Bottom navigation for mobile
- [ ] Pull-to-refresh on lists
- [ ] Performance: React Query stale times tuned per data type

---

## Phase 6 — AI Integration (Week 5)
**Goal: AI reduces admin burden and surfaces content automatically**

### News Aggregation (Supabase Edge Function, every 6h)
- Fetch sports news from: The Namibian, New Era, NBC Sport
- Claude API: categorize by sport/federation
- Claude API: generate 150-word summary
- Claude API: suggest tags
- Queue for federation admin review before publishing

### AI Features in Admin Dashboard
- "Auto-summarize" button on article creation
- Tag suggestions for news articles
- Event description generator from basic inputs

### AI Sports Assistant (public-facing)
- Floating glassmorphism chat widget
- Answer questions: "When is the next football match?", "How do I join a tennis club?"
- Uses Claude API with platform context injected into system prompt
- Streaming responses

### Content Translation
- Translate articles to Afrikaans and Oshiwambo via Claude API
- Federation admin can trigger translation per article

---

## Phase 7 — WhatsApp Integration (Week 5)
**Goal: Reach fans where they are — on WhatsApp**

### Subscription System
- Subscribe via website: phone number + federation selection + notification types
- Subscribe via WhatsApp: text "SUBSCRIBE FOOTBALL" to platform number
- Unsubscribe: text "STOP" anytime

### Notification Types
- **Events**: Upcoming event reminders (24h before)
- **Live**: "🔴 LIVE NOW: [federation] is streaming"
- **Scores**: Real-time score updates during matches
- **News**: Weekly digest every Monday

### WhatsApp Chatbot (text-based)
- "NEXT EVENTS" → list next 3 events across all codes
- "NFA NEWS" → last 3 NFA news items
- "HELP" → command list
- Free-form questions → Claude API answers with platform context

### Message Templates (pre-approved with Meta)
```
EVENT_REMINDER: 🏆 {eventName} tomorrow at {time}, {venue}
LIVE_ALERT: 🔴 LIVE: {federationName} — Watch: {url}
WEEKLY_DIGEST: 🗞️ Namibia Sports Weekly — {topStories}
```

---

## Phase 8 — PWA & Mobile (Week 6)
**Goal: Installable, offline-capable, push-notification-enabled app**

- [ ] vite-plugin-pwa configuration
- [ ] manifest.json (name, icons, theme colors, display: standalone)
- [ ] Service worker (cache strategies per asset type)
- [ ] Offline fallback page
- [ ] Web Push notifications (browser-level)
- [ ] App icons in all required sizes
- [ ] iOS/Android splash screens
- [ ] Lighthouse PWA score > 90

---

## Additional Features (Post-MVP)

### Digital Scoreboard
- Live score entry by federation admins during events
- Auto-push to WhatsApp subscribers on score change
- Historical results stored in `namibia_na_26_results` table
- Results pages per federation and per event

### Interactive Namibia Map
- SVG map of all 14 regions
- Click region → filtered view of clubs, venues, upcoming events in that region
- Heat map overlay showing sports activity density
- Pinned venues on map using Google Maps integration

### Event Registration System
- Online registration forms per event
- Payment integration via PayToday (Namibian payment gateway) or DPO
- QR code tickets (generated on registration)
- Attendance tracking for federation admins

### Athlete Rankings & Profiles
- Public athlete profiles at `/athletes/:slug`
- Performance tracking over time (Recharts graphs)
- National rankings per sport/category
- Head-to-head comparison tool
- Scout/coaching inquiry form

### Sponsorship Marketplace
- Sponsor directory with logos, tier levels (Title / Gold / Silver / Bronze)
- Sponsorship opportunity listings (federations post what they're looking for)
- Contact form linking sponsors to federations
- Impression/click tracking for sponsors

### Annual Sports Awards
- Public nomination system (tied to user accounts)
- Online voting with fraud prevention (1 vote per verified phone)
- Categories: Sportsman/Sportswoman/Team/Coach/Federation of the Year
- Results display with animated glassmorphism reveal
- Archive of past winners

### Multi-language Support
- Afrikaans, Oshiwambo, Otjiherero, Nama/Damara
- `react-i18next` framework
- Claude API for assisted translation
- Language switcher in header

### Public API & Embed Widgets
- REST API for federation/event data (public, rate-limited)
- Embeddable widgets: upcoming events, live scores, federation news
- Federation websites can embed their own live data from sports.com.na
- API documentation at `/api/docs`

### Training & Coaching Hub
- Online coaching resources per sport
- YouTube playlist integration per federation
- Coach certification tracking (federation admins manage)
- Development program applications and tracking

### Social/Community Features
- Comments on news articles (moderated)
- User profiles with followed federations (fan accounts)
- "Follow this athlete" for notifications
- Share-to-WhatsApp buttons throughout

---

## Infrastructure & DevOps

### Monitoring
- Supabase dashboard for DB query performance
- Netlify Analytics for traffic
- Sentry for frontend error tracking (`client/src/lib/sentry.ts`)
- Uptime monitoring via Better Uptime or UptimeRobot (free)

### Performance Targets
- Lighthouse Performance: > 80
- Lighthouse PWA: > 90
- Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1
- API response time: < 200ms for list queries

### Security
- All secrets in Netlify env vars (never committed)
- Supabase Row-Level Security enabled on all tables
- Rate limiting on WhatsApp webhook endpoint
- Input validation via Zod on all tRPC procedures
- CORS properly configured on Express server

### CDN Strategy
- Cloudflare CDN for all static assets (already DNS on Cloudflare)
- Supabase Storage CDN for images (transform API for resizing)
- Cache headers on Netlify for static assets: 1 year
- Netlify Function timeout: 10s (increase for AI calls)

---

## Technology Cost Estimates (Monthly)

| Service | Free Tier | Paid |
|---------|-----------|------|
| Netlify | 125k function calls, 100GB bandwidth | $19/mo (pro) |
| Supabase | 50k MAU, 500MB DB, 1GB storage | $25/mo (pro) |
| Anthropic Claude API | Pay per use | ~$20-50/mo (moderate use) |
| WhatsApp Business API | Free for first 1k conversations | ~$0.005/message after |
| Cloudflare | Free (DNS + CDN) | — |
| Sentry | 5k errors/month free | $26/mo |
| **Total MVP** | **Free** | **~$90-150/mo at scale** |
