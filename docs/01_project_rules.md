# 01 — Project Rules

> **Source of truth for coding standards, tech stack, and file structure.**

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, TypeScript, Vite 7 |
| Styling | TailwindCSS 4, shadcn/ui |
| Routing | Wouter |
| State | TanStack React Query v5 + tRPC v11 |
| Backend | tRPC v11 on a Cloudflare Worker (`server/worker.ts`) |
| ORM | Drizzle ORM + postgres-js over a Hyperdrive binding |
| Database | Supabase PostgreSQL (shared instance — only `sportsplatform_*` is ours) |
| Auth | Supabase Auth (JWT verified in the tRPC context) |
| Hosting | Cloudflare Workers — SPA (Static Assets) + API in one Worker, apex `sports.com.na` |

## Coding Standards

- **TypeScript strict mode** — No `any` without justification
- **Column naming**: camelCase in TypeScript, matching DB column names
- **Table prefix**: `sportsplatform_` for all platform tables
- **No inline styles** except for glassmorphism (use CSS variables)
- **No direct Supabase client in tRPC** — Use Drizzle ORM in server layer

## File Structure Conventions

- `client/src/pages/` — Route-level page components
- `client/src/components/` — Shared UI components
- `server/routers/` — tRPC routers (one file per domain)
- `drizzle/schema.ts` — Single source of truth for DB schema
- `docs/` — Documentation (architecture, research, scripts)

## Reference

- **CLAUDE.md** — Full project overview and conventions
- **SKILLS.md** — tRPC procedures and component library
- **SOUL.md** — Brand voice and mission
