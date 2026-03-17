# Agent Workflows — Running Parallel Claude Code Agents

This document describes how to run multiple Claude Code agents in Cursor simultaneously to develop the Namibia Sports Platform in parallel.

---

## Directory Ownership Model

Each agent owns a set of directories and is responsible for changes within them. This prevents merge conflicts.

| Agent | Owns | Focus |
|-------|------|-------|
| **Agent A — Frontend** | `client/src/pages/`, `client/src/components/` | UI, routing, user experience |
| **Agent B — Backend** | `server/routers/`, `server/services/`, `drizzle/` | APIs, DB schema, business logic |
| **Agent C — Infrastructure** | `netlify/`, `supabase/functions/`, `netlify.toml` | Deployment, edge functions, cron |
| **Agent D — Content** | `docs/`, `docs/scripts/`, SQL data scripts | Data population, migrations, docs |

### Shared Files (require coordination)
- `drizzle/schema.ts` — coordinate via feature branches; merge after review
- `server/routers.ts` → being split to `server/routers/index.ts` per domain
- `client/src/App.tsx` — route additions; Agent A owns, Agent B coordinates
- `package.json` — Agent B owns; Agent A requests new dependencies

---

## How to Launch Parallel Agents in Cursor

### Method 1: Multiple Cursor Windows

1. Open Cursor in a new window: `File → New Window`
2. Open the same project folder
3. Each window gets its own Claude Code session
4. Give each session its agent role at the start

**Recommended prompt to start each agent:**

```
You are Agent [A/B/C/D] for the Namibia Sports Platform.
Read CLAUDE.md and SKILLS.md first to understand the codebase.
Your ownership area is: [client/src/pages/ and client/src/components/]
Do NOT modify files outside your ownership area without confirming.
Your task for this session: [specific phase/feature]
```

### Method 2: Cursor Composer + Background Agents

1. Open Cursor Composer (Cmd+Shift+I)
2. Use `@Codebase` context and specify the phase
3. Composer can run background tasks while you work with the main chat

### Method 3: Git Worktrees (cleanest for parallel work)

```bash
# Create separate worktrees for each agent
git worktree add ../sports-frontend feat/federation-pages
git worktree add ../sports-backend feat/auth-supabase
git worktree add ../sports-infra feat/edge-functions

# Each agent works in their worktree
# Merge via PR when phase is complete
```

---

## Task Assignment by Phase

### Sprint 1 (Week 1): Foundation
| Agent | Task | Branch |
|-------|------|--------|
| A | Set up federation sub-site routing in App.tsx, create FederationLayout | `feat/federation-routing` |
| B | Add slug to federations schema, add relations, split routers.ts | `feat/schema-evolution` |
| D | Write SQL migration for new tables (news, streams, whatsapp_subs) | `feat/db-migrations` |

### Sprint 2 (Week 2): Auth + Federation Pages
| Agent | Task | Branch |
|-------|------|--------|
| A | Build Login/Register pages, AuthContext, ProtectedRoute | `feat/supabase-auth-client` |
| B | Supabase Auth JWT verification in tRPC context, RBAC middleware | `feat/supabase-auth-server` |
| A2 | Build FederationHome, FederationEvents, FederationClubs pages | `feat/federation-pages` |

### Sprint 3 (Week 3): Federation Admin Dashboard
| Agent | Task | Branch |
|-------|------|--------|
| A | Build federation admin UI: dashboard, profile editor, events CRUD | `feat/fed-admin-ui` |
| B | Add federationAdminProcedure middleware, protected mutations | `feat/fed-admin-api` |
| B2 | Build news + streams tRPC routers | `feat/news-streams-api` |

### Sprint 4 (Week 4): Main Portal + PWA
| Agent | Task | Branch |
|-------|------|--------|
| A | Redesign Home.tsx with aggregated feeds, live section, global search | `feat/homepage-redesign` |
| A2 | Set up vite-plugin-pwa, manifest, service worker, bottom nav | `feat/pwa` |
| B | Connect Events.tsx to real tRPC data | `feat/events-live-data` |

### Sprint 5 (Week 5): AI + WhatsApp
| Agent | Task | Branch |
|-------|------|--------|
| B | Claude API service, news aggregation service | `feat/ai-integration` |
| C | Supabase Edge Function for news cron job | `feat/news-cron` |
| B2 | WhatsApp API service, subscription tRPC router | `feat/whatsapp` |
| C2 | Supabase Edge Function for WhatsApp webhook | `feat/whatsapp-webhook` |

---

## Communication Protocol Between Agents

### When Agent A needs a new tRPC endpoint from Agent B

1. Agent A creates a placeholder in `SKILLS.md` under "TO BE ADDED"
2. Agent A adds a comment in code: `// TODO: needs trpc.news.list from Agent B`
3. Agent B implements the endpoint and updates `SKILLS.md`

### When schema changes are needed

1. Agent B updates `drizzle/schema.ts` on their branch
2. Runs `npm run db:push` to generate migration
3. Creates PR for review before other agents pull the changes
4. All agents pull the latest schema before using new tables

### Merge Order for Each Sprint

```
Agent D (migrations) → merge first (DB must be ready)
Agent B (API) → merge second (endpoints must exist for frontend)
Agent A (UI) → merge third (uses the API)
Agent C (Infra) → merge last (deployment config)
```

---

## Avoiding Common Conflicts

### Scenario: Both agents modify App.tsx

- **Solution**: Only Agent A modifies App.tsx
- Agent B creates a new page file and tells Agent A the route to add
- Example: Agent B creates `client/src/pages/federation/FederationAdmin.tsx`, adds a comment at the top: `// Add route: /federation/:slug/admin → FederationAdmin`

### Scenario: Both agents add to routers.ts

- **Solution**: Immediately split `server/routers.ts` into separate files
  ```
  server/routers/
    ├── index.ts         (combines all sub-routers)
    ├── federations.ts   (Agent B owns)
    ├── clubs.ts         (Agent B owns)
    ├── events.ts        (Agent B owns)
    ├── news.ts          (Agent B2 owns)
    ├── streams.ts       (Agent B2 owns)
    ├── auth.ts          (Agent B owns)
    └── ai.ts            (Agent B owns)
  ```

### Scenario: Schema conflicts

- `drizzle/schema.ts` is **Agent B only**
- No agent touches the schema without going through Agent B
- Agent B reviews schema change requests within the same session

---

## Testing Before Merge

Before any branch merges to `main`:

```bash
# Type check (must pass)
npm run check

# Build (must succeed)
npm run build

# Manual smoke tests:
# - Home page loads with federation grid
# - Navigate to /federation/nfa (or any slug)
# - All sub-pages load (events, clubs, news, streams)
# - Admin protected routes redirect when not logged in
# - Login flow works end-to-end
```

---

## Prompt Templates for Common Tasks

### Starting a new Federation Admin page

```
Context:
- Read CLAUDE.md and SKILLS.md
- Current auth: Supabase Auth with AuthContext (client/src/contexts/AuthContext.tsx)
- Federation admin tRPC procedures: uses federationAdminProcedure
- Design: glassmorphism (see SKILLS.md for glass card pattern)
- Framer Motion for animations (fadeUp variant)

Task: Build the Federation Admin Events page at:
client/src/pages/federation/admin/FedAdminEvents.tsx

Requirements:
- Protected: redirect to /login if not federation_admin
- CRUD table for events belonging to ctx.user.federationId
- Uses trpc.events.list, create, update, delete
- shadcn/ui Table component
- Dialog for create/edit form
- Glassmorphism card wrapping the table
```

### Adding a new tRPC router

```
Context:
- Read CLAUDE.md and SKILLS.md
- Router pattern in server/routers/federations.ts
- All new routers go in server/routers/{name}.ts
- Import and register in server/routers/index.ts

Task: Create server/routers/news.ts

Requirements:
- list: publicProcedure, filter by federationId/category/limit
- getBySlug: publicProcedure
- create: federationAdminProcedure
- update: federationAdminProcedure (scope to own federation)
- publish: federationAdminProcedure
- delete: adminProcedure only
- Use drizzle/schema.ts namibia_na_26_news_articles table
```

### Adding a Supabase Edge Function

```
Context:
- Supabase project: rbibqjgsnrueubrvyqps
- Edge functions in supabase/functions/{name}/index.ts
- Deno runtime
- Access DB via SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY env vars
- Access Claude API via ANTHROPIC_API_KEY env var

Task: Create supabase/functions/news-aggregator/index.ts

Requirements:
- Cron schedule: every 6 hours
- Fetch RSS from The Namibian sports section
- For each article: call Claude API to categorize and summarize
- Insert into namibia_na_26_news_articles with isPublished: false
- Log count to console
```
