# Documentation — Namibia Sports Platform

This directory follows the **Project Documentation Architecture** from the AI Audit governance system.

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
