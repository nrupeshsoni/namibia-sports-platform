# CLAUDE.md — Namibia Sports Platform

## Project Overview

**sports.com.na** — The definitive national sports platform for Namibia. Covers all 57 sports federations, live streams, news, events, clubs, athletes, and coaching resources in one glassmorphism-first web app.

- **Domain**: **sports.com.na** (apex) — a Cloudflare Custom Domain on the Worker
  `namibia-sports-platform`. The `system.sports.com.na` subdomain is a *different*
  product (DOME X / NAMS) on a *different* Worker in a different repo. A Custom
  Domain binds to exactly one Worker; do not add `system.*` here.
- **Hosting**: **Cloudflare Workers** — one Worker serves the SPA (Static Assets
  from `dist/public`) and the API at `/api/*` via `run_worker_first`. Config:
  `wrangler.jsonc`. Entry: `server/worker.ts`. Netlify is **not** used; `netlify.toml`
  and any `netlify/` remnants are dead and serve no traffic.
- **Database**: Supabase PostgreSQL (`rbibqjgsnrueubrvyqps`, EU West / Ireland),
  reached through a **Hyperdrive** binding — Workers cannot open arbitrary TCP
  sockets, so postgres-js does not connect to Supabase directly.
- **Table prefix**: `sportsplatform_` — **and nothing else.** This Supabase project
  is shared with 15+ unrelated products (~737 tables). Never run unscoped DDL.
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
| Backend | tRPC v11 on a Cloudflare Worker (`server/worker.ts`) |
| ORM | Drizzle ORM + postgres-js over Hyperdrive |
| Auth | Supabase Auth (JWT, email/password, social OAuth) |
| AI | Anthropic Claude API (claude-sonnet-4-6) |
| Notifications | WhatsApp Business API, Web Push |
| Package Manager | npm |

---

## Commands

```bash
# Dev
npm run dev           # wrangler dev — the Worker, locally

# Build / check / test / format
npm run build         # vite build -> dist/public (served as Worker Static Assets)
npm run check         # tsc --noEmit
npm run test          # vitest run
npm run format        # prettier --write .

# Deploy
npm run cf:dryrun     # build + wrangler deploy --dry-run
npm run cf:deploy     # build + wrangler deploy            (production, apex)
npm run cf:deploy:staging
npm run cf:tail       # wrangler tail namibia-sports-platform
npm run cf:secret     # wrangler secret put <NAME>

# Database — generate a migration, then apply it deliberately
npm run db:generate   # drizzle-kit generate  (writes SQL to drizzle/)
npm run db:migrate    # drizzle-kit migrate   (applies the generated SQL)
```

> **Never run `drizzle-kit push` against this project, and never re-add a
> `db:push` script.** It was deliberately removed. `push` diffs the *whole*
> database against `drizzle/schema.ts`, and this database holds ~737 tables
> belonging to 15+ other products — it would emit `DROP TABLE` for every one of
> them. If you hit "script not found: db:push", the fix is `db:generate` +
> `db:migrate`, never restoring `push`.

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
│   ├── worker.ts               # Cloudflare Worker entry (fetch handler)
│   ├── _core/                  # tRPC setup, auth middleware, env bindings, context
│   ├── routers/                # tRPC router files (split by domain)
│   ├── services/               # AI, WhatsApp, notifications, streaming
│   └── db.ts                   # Request-scoped Drizzle client over Hyperdrive
├── drizzle/
│   ├── schema.ts               # ALL table definitions — source of truth
│   └── relations.ts            # Drizzle ORM relations
├── wrangler.jsonc              # Worker config: apex Custom Domain, assets, Hyperdrive
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
└── netlify.toml                # DEAD — retired Netlify config, serves no traffic
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
| `club_manager` | **Deferred** — enum only; not assignable until club-scoped procedures exist |
| `admin` | Full platform access |

### tRPC Middleware Procedures

- `publicProcedure` — No auth required
- `protectedProcedure` — Any authenticated user
- `federationAdminProcedure` — Must be `federation_admin` or `admin`. It checks the
  **role only**. The "federation ID must match" half is deliberately not here: call
  `assertSameFederation(ctx.user, …)` inside the mutation — see the note below.
- `adminProcedure` — Must be `admin`

### Where tenant isolation actually comes from

**Not RLS.** Two facts, both easy to get wrong:

1. The Worker holds the **anon** key, not `service_role`. It is used to verify the
   caller's bearer token (and, separately, the service-role key is used for storage
   uploads only).
2. Every real read and write goes through **Drizzle over Hyperdrive**, whose origin
   role is `postgres` (`rolbypassrls = true`). RLS is not evaluated on that path at
   all — not "bypassed by service_role", simply not in the request path.

So RLS on `sportsplatform_*` provides **no** defence for application queries, and
the tRPC middleware + explicit in-procedure checks are the **sole** tenancy
boundary. Do not treat RLS as a second layer, and do not "fix" this by switching
the Worker to the service-role key — that changes nothing about the Drizzle path
and removes JWT-scoped access from the Supabase path.

Consequences to keep in mind: every federation-scoped mutation needs its own
`federationId` check (gap A6 — now in place, and covered by
`server/federationScope.test.ts`; a new mutation must add both), and the Hyperdrive
superuser credential is itself an
open critical issue (gap B1 — the password is in public git history, unrotated).
See `docs/architecture/RLS_POLICIES.md`.

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
# Server-side — Worker secrets (`wrangler secret put NAME`), NOT a hosting dashboard.
# There is no DATABASE_URL in production: Postgres is reached via the HYPERDRIVE
# binding declared in wrangler.jsonc. The committed pooler DATABASE_URL is stale.
SUPABASE_URL=https://rbibqjgsnrueubrvyqps.supabase.co   # var in wrangler.jsonc, not a secret
SUPABASE_ANON_KEY=...          # verifies caller JWTs
SUPABASE_SERVICE_ROLE_KEY=...  # storage uploads ONLY — never for normal reads
ANTHROPIC_API_KEY=...          # ai router (currently UNSET — the chat widget 500s)
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
- **Federation admin scope** — Call `assertSameFederation(ctx.user, …)`
  (`server/_core/federationScope.ts`) **explicitly, inside each federation-scoped
  mutation**, before it touches the database, and add a cross-tenant case to
  `server/federationScope.test.ts`. The middleware deliberately does not do this:
  it used to infer the tenant from the raw input, which failed open for any input
  it could not read (gap **A6**). The tRPC layer is the **only** tenancy boundary
  here — see the RLS note below.
- **Data access** — Drizzle over Hyperdrive for all real reads/writes. The
  per-request Supabase client exists to verify the caller's JWT (and for storage
  uploads with the service-role key); it is not the data path.
- **Error handling** — Use tRPC `TRPCError` with appropriate HTTP codes
- **Image uploads** — Always use Supabase Storage, never store binary in DB

---

## Deployment

```
Push to main → Cloudflare Workers Builds → deploys the Worker to sports.com.na
Build:   npm run build          (vite build → dist/public, served as Static Assets)
Deploy:  npx wrangler deploy    (reads wrangler.jsonc)
Manual:  npm run cf:deploy      (identical; both write the same Worker)
Logs:    npm run cf:tail
```

Rollback is a **Worker version rollback**, not a hosting-dashboard republish:

```bash
npx wrangler deployments status --name namibia-sports-platform
npx wrangler versions list      --name namibia-sports-platform
npx wrangler rollback [VERSION_ID] --name namibia-sports-platform --message "reason"
```

Static assets are part of a version, so a rollback restores the SPA and the API
together. Rollback does **not** revert secrets or bindings. See `docs/CI.md`.

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
- **Agent C (Infra)**: `wrangler.jsonc`, `server/worker.ts`, `supabase/functions/`, deployment config
- **Agent D (Content/Data)**: `docs/`, SQL migrations, data scripts

**Shared files requiring coordination:**
- `drizzle/schema.ts` — coordinate via feature branches
- `server/routers.ts` — each agent works on their router file
- `client/src/App.tsx` — coordinate route additions
