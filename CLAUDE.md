# CLAUDE.md — Namibia Sports Platform

## Project Overview

**sports.com.na** — The definitive national sports platform for Namibia. Covers all 57 sports federations, live streams, news, events, clubs, athletes, and coaching resources in one glassmorphism-first web app.

- **Domain**: sports.com.na (Cloudflare DNS)
- **Hosting**: Netlify (auto-deploy from GitHub `main`)
- **Database**: Supabase PostgreSQL (`rbibqjgsnrueubrvyqps`, EU West / Ireland)
- **Table prefix**: `sportsplatform_`
- **Supabase project**: rbibqjgsnrueubrvyqps

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, TypeScript, Vite 7 |
| Styling | TailwindCSS 4, custom glassmorphism tokens |
| Routing | Wouter |
| Animations | Framer Motion |
| UI Components | shadcn/ui (Radix UI primitives) |
| State / Data | TanStack React Query v5 + tRPC v11 |
| Backend | Express + tRPC serverless via Netlify Functions |
| ORM | Drizzle ORM + postgres-js |
| Auth | Supabase Auth (JWT, email/password, social OAuth) |
| AI | Anthropic Claude API (claude-sonnet-4-6) |
| Notifications | WhatsApp Business API, Web Push |
| Package Manager | npm (Netlify), pnpm locally |

---

## Commands

```bash
# Dev
npm run dev           # Start dev server (tsx watch on server/_core/index.ts)

# Build
npm run build         # Vite build + esbuild for server

# Type check
npm run check         # tsc --noEmit

# Tests
npm run test          # vitest run

# Format
npm run format        # prettier --write .

# Database
npm run db:push       # drizzle-kit generate && drizzle-kit migrate
```

---

## Project Structure

```
namibia-sports-platform/
├── client/
│   └── src/
│       ├── pages/              # Route-level page components
│       │   ├── Home.tsx        # Main portal homepage
│       │   ├── Events.tsx      # Aggregated events
│       │   ├── News.tsx        # Aggregated news feed
│       │   ├── Live.tsx        # Live streams aggregator
│       │   ├── Admin.tsx       # Super admin dashboard
│       │   ├── auth/           # Login, Register pages
│       │   └── federation/     # Federation sub-site pages
│       │       ├── FederationLayout.tsx
│       │       ├── FederationHome.tsx
│       │       ├── FederationEvents.tsx
│       │       ├── FederationClubs.tsx
│       │       ├── FederationAthletes.tsx
│       │       ├── FederationNews.tsx
│       │       ├── FederationStreams.tsx
│       │       └── admin/      # Federation admin pages
│       ├── components/         # Shared components
│       ├── contexts/           # React contexts (Auth, Theme)
│       ├── hooks/              # Custom hooks
│       ├── lib/                # Utilities (supabase client, trpc client)
│       └── data/               # Static fallback data
├── server/
│   ├── _core/                  # tRPC setup, auth middleware, Express
│   ├── routers/                # tRPC router files (split by domain)
│   ├── services/               # AI, WhatsApp, notifications, streaming
│   └── db.ts                   # Drizzle database connection
├── drizzle/
│   ├── schema.ts               # ALL table definitions — source of truth
│   └── relations.ts            # Drizzle ORM relations
├── netlify/
│   └── functions/              # Netlify serverless function entry points
├── supabase/
│   └── functions/              # Supabase Edge Functions (cron jobs, webhooks)
├── docs/
│   ├── architecture/           # System design, DB schema, ADRs
│   ├── development/            # Agent workflows, task board
│   ├── research/               # Federation research data
│   └── design/                 # Original project brief, completion summaries
├── CLAUDE.md                   # This file
├── SOUL.md                     # Project identity and brand voice
├── SKILLS.md                   # Available tRPC procedures, component library
├── supabase-migration.sql      # Database schema migration
└── netlify.toml                # Netlify deployment config
```

---

## Database Conventions

- **All tables use prefix**: `sportsplatform_`
- **Schema file**: `drizzle/schema.ts` is the single source of truth
- **Column naming**: camelCase in TypeScript, matching the actual Supabase column names
- **Migrations**: Generate with `drizzle-kit generate`, apply in Supabase SQL editor

### Core Tables

| Table | Purpose |
|-------|---------|
| `sportsplatform_federations` | 67 entities: Ministry + Commission + 8 Umbrella Bodies + 57 Federations |
| `sportsplatform_clubs` | Clubs/teams linked to federations |
| `sportsplatform_events` | Competitions, tournaments, workshops |
| `sportsplatform_athletes` | Athlete profiles |
| `sportsplatform_coaches` | Coach profiles |
| `sportsplatform_venues` | Sports facilities |
| `sportsplatform_schools` | Schools with sports programs |
| `sportsplatform_media` | Photos, videos, documents |
| `sportsplatform_hp_programs` | High-performance programs |
| `users` | Platform users with RBAC |

---

## Authentication & RBAC

Auth uses **Supabase Auth** with JWT verification in tRPC context.

### Roles (defined in `userRoleEnum`)

| Role | Access |
|------|--------|
| `user` | Public browsing, subscribe to notifications |
| `federation_admin` | Full CRUD for their own federation's data only |
| `club_manager` | Manage their own club's info |
| `admin` | Full platform access |

### tRPC Middleware Procedures

- `publicProcedure` — No auth required
- `protectedProcedure` — Any authenticated user
- `federationAdminProcedure` — Must be `federation_admin`, federation ID must match
- `adminProcedure` — Must be `admin`

---

## tRPC Router Structure

All routers in `server/routers.ts` (being split into `server/routers/` folder):

```
appRouter
├── system          — Health checks
├── auth            — me, logout, login
├── federations     — list, getById, getBySlug, create, update, delete
├── clubs           — list, getById, create, update, delete
├── events          — list, getById, create, update, delete
├── athletes        — list, getById, create, update, delete
├── coaches         — list, getById, create, update, delete
├── venues          — list, getById, create, update, delete
├── news            — list, getById, getBySlug, create, update, publish
├── streams         — list, getById, create, update, setLive
├── whatsapp        — subscribe, unsubscribe, getSubscriptions
└── ai              — generateSummary, suggestTags, chatAssistant
```

---

## Design System

### Glassmorphism Tokens (used throughout)

```css
/* Glass card */
background: rgba(255, 255, 255, 0.1);
backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.2);
border-radius: 16px;

/* Dark glass */
background: rgba(0, 0, 0, 0.3);
backdrop-filter: blur(20px);
border: 1px solid rgba(255, 255, 255, 0.1);
```

### Brand Colors

```
Primary Red:    #EF4444
Champion Gold:  #FBBF24
Victory Green:  #10B981
Team Blue:      #3B82F6
Athletic Orange:#F97316
Dark BG:        #0a0a0a / #111111
```

### Framer Motion Variants

8 standard animation variants used in `client/src/lib/animations.ts`:
- `fadeUp`, `fadeDown`, `fadeLeft`, `fadeRight`
- `scaleIn`, `rotateIn`, `blurIn`, `diagonalIn`

---

## Environment Variables

```bash
# Server-side (Netlify env vars)
DATABASE_URL=postgresql://...supabase.com.../postgres
SUPABASE_URL=https://rbibqjgsnrueubrvyqps.supabase.co
SUPABASE_SERVICE_ROLE_KEY=...
ANTHROPIC_API_KEY=...
WHATSAPP_API_TOKEN=...
WHATSAPP_PHONE_NUMBER_ID=...

# Client-side (VITE_ prefix)
VITE_SUPABASE_URL=https://rbibqjgsnrueubrvyqps.supabase.co
VITE_SUPABASE_ANON_KEY=...
VITE_TRPC_URL=/api/trpc
```

---

## Coding Standards

- **TypeScript strict mode** — No `any`, always type return values
- **No inline styles** except for glassmorphism effects (they use CSS variables not supported by Tailwind)
- **All mutations protected** — Never expose data-modifying tRPC procedures as `publicProcedure`
- **Federation admin scope** — Always check `ctx.user.federationId === input.federationId` in federation-scoped mutations
- **No direct Supabase client calls from tRPC** — Use Drizzle ORM exclusively in the server layer
- **Error handling** — Use tRPC `TRPCError` with appropriate HTTP codes
- **Image uploads** — Always use Supabase Storage, never store binary in DB

---

## Deployment

```
Push to main → Netlify auto-builds → deploys to sports.com.na
Build: npm install --legacy-peer-deps && npm run build
Publish: dist/public
Functions: netlify/functions (esbuild bundled)
```

### Supabase Edge Functions (for cron/webhooks)
```bash
supabase functions deploy news-aggregator
supabase functions deploy whatsapp-webhook
```

---

## Multi-Agent Development

See `docs/development/AGENT_WORKFLOWS.md` for how to run parallel Claude Code agents in Cursor.

**Directory ownership by agent:**
- **Agent A (Frontend)**: `client/`
- **Agent B (Backend)**: `server/`, `drizzle/`
- **Agent C (Infra)**: `netlify/`, `supabase/functions/`, deployment config
- **Agent D (Content/Data)**: `docs/`, SQL migrations, data scripts

**Shared files requiring coordination:**
- `drizzle/schema.ts` — coordinate via feature branches
- `server/routers.ts` — each agent works on their router file
- `client/src/App.tsx` — coordinate route additions
