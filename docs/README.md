# Documentation — Namibia Sports Platform

This directory follows the **Project Documentation Architecture** from the AI Audit governance system.

## Current stack — read this before trusting any older doc

Production is **Cloudflare Workers**, not Netlify. The apex **sports.com.na** is a
Custom Domain on the Worker `namibia-sports-platform`, which serves the SPA (Static
Assets from `dist/public`) and the API (`/api/*`) from one artifact. Postgres is
reached through a **Hyperdrive** binding, not a `DATABASE_URL`. Deploy, secret and
rollback procedure: [`CI.md`](CI.md) and [`../DEPLOYMENT_GUIDE.md`](../DEPLOYMENT_GUIDE.md).

Two things that are easy to get wrong and are documented in full elsewhere:

- **RLS is not a defence layer here.** All application queries run over Hyperdrive
  as a role that bypasses RLS; the tRPC layer is the sole tenancy boundary.
  See [`architecture/RLS_POLICIES.md`](architecture/RLS_POLICIES.md).
- **Never run `drizzle-kit push`.** The Supabase instance is shared with 15+ other
  products (~737 tables). Use `npm run db:generate` + `npm run db:migrate`.

Several documents here still describe the Netlify architecture and an older
`namibia_na_26_` table prefix — notably everything under **`design/`**
(`NETLIFY_DEPLOYMENT.md`, `DEPLOYMENT_GUIDE_FINAL.md`, the project brief),
`engineering/SCALE_CONSIDERATIONS.md`, `PLATFORM_ROADMAP.md` and
`Namibia Sports Platform - TODO.md`. They are kept as a record of what was true when
written and have **not** been rewritten. Treat any hosting, deploy, env-var or table-
prefix detail in them as historical.

## Structure

| Directory | Purpose |
|-----------|---------|
| **Root** | Phase 0 audit artifacts: 01–06 |
| **engineering/** | ARCHITECTURE, SCHEMAS, WORKFLOWS, SCALE_CONSIDERATIONS |
| **governance/** | SECURITY, CONTRIBUTING, CODE_OF_CONDUCT |
| **development/** | Agent workflows, quickstart, audit prompt |
| **design/** | Project brief, completion summaries |
| **research/** | Federation contacts, logos, data |
| **scripts/** | Seed scripts, migrations, utilities |

## Key Files

- **01_project_rules.md** — Coding standards, tech stack, file conventions
- **02_database_schema.md** — Schema documentation (source: drizzle/schema.ts)
- **03_api_and_integrations.md** — tRPC procedures, external APIs
- **04_features_audit.md** — Feature matrix (Pass/Fail/Incomplete)
- **05_dependency_graph.md** — Component → utility dependencies
- **06_tasks.md** — Master checklist (blockers, high priority, warnings)

## Canonical Project Files (at repo root)

- **CLAUDE.md** — AI agent rules (project context, conventions)
- **SKILLS.md** — tRPC procedures, component library reference
- **SOUL.md** — Project identity, mission, brand voice

## Cursor Rules (`.cursor/rules/`)

| Rule | Scope | Purpose |
|------|-------|---------|
| core.mdc | Always | Tech stack, standards, prohibited actions |
| production-readiness.mdc | TS/TSX | Scale, connection pooling, bounded queries |
| testing.mdc | Test files | Test-first, coverage, AAA pattern |
| documentation.mdc | Always | Doc maintenance, changelog |
| security.mdc | Always | Input validation, RBAC, secrets |
| database.mdc | DB/migrations | Schema protocol, RLS, migrations |
| api.mdc | tRPC/routes | Route template, validation |
| audit.mdc | Manual @audit | Pre-launch checklist |
