# 14 — Documentation Drift Gap Analysis

**Wave:** `gap_wave_20260725`  
**Agent:** Docs / hosting truth  
**Date:** 2026-07-25  
**Workspace:** `C:\Projects\The Dome\namibia-sports-platform`  
**Bar:** Agents and humans must not be steered into Netlify, wrong auth levels, stale scores, or obsolete table/bucket names.

**DB mutations this analysis:** none. Evidence = file reads + greps + path existence checks against live code (`server/routers/`, `wrangler.jsonc`, `drizzle/schema.ts`, `package.json`).

---

## 1. Executive verdict

| Metric | Value |
|--------|------:|
| **Docs trust score (agent-facing)** | **58 / 100** |
| **Hosting truth (canonical paths)** | **Mostly correct** — CLAUDE / README / CI / DEPLOYMENT_GUIDE / 01_project_rules |
| **Agent-always-on rules (`.cursor/rules`)** | **Fail** — still Netlify + RLS-as-defence |
| **Scorecards / audits currency** | **Split** — GO_LIVE + 04_features fresh; PUBLIC_READY + SKILLS debt stale |
| **Netlify dead-ref hazard** | **High** — ~20 files still instruct Netlify deploy; `netlify.toml` still present; `netlify/functions` **absent** |

### One-line decision

Treat **`docs/CI.md` + `DEPLOYMENT_GUIDE.md` + `docs/README.md` (hosting banner) + `PRODUCTION_GO_LIVE_SCORECARD.md` (launch bar)** as authoritative. Do **not** trust `.cursor/rules/core.mdc`, historical `design/*`, `PLATFORM_ROADMAP.md`, or un-bannered `PUBLIC_READY_GAP_ANALYSIS.md` for hosting, scores, or “what’s still broken.”

---

## 2. Hosting truth (canonical)

| Fact | Truth (2026-07-25) | Primary sources |
|------|--------------------|-----------------|
| Runtime | One Cloudflare Worker `namibia-sports-platform` | `wrangler.jsonc`, `server/worker.ts` |
| Apex | Custom Domain `sports.com.na` | `wrangler.jsonc` `routes` |
| SPA + API | Static Assets `dist/public` + `/api/*` via `run_worker_first` | `wrangler.jsonc` `assets` |
| Postgres | Hyperdrive binding `HYPERDRIVE` id `dbfcf635ad4a475ba991743b94a5d6a2` | `wrangler.jsonc`, `server/db.ts` |
| Deploy | Workers Builds on `main` **or** `npm run cf:deploy` (`ci:gate` then `wrangler deploy`) | `docs/CI.md`, `package.json` |
| Package manager | **npm only** (`packageManager: npm@10.9.4`) | `package.json` |
| Netlify | **Not used**; no DNS; no `netlify/functions` directory | repo layout + `docs/README.md` |
| `system.sports.com.na` | Different product / Worker / repo — do not bind here | `CLAUDE.md`, `README.md` |

**Dead artifacts that still look “live” if skimmed:**

| Path | Status | Risk if followed |
|------|--------|------------------|
| `netlify.toml` | Present; points at missing `netlify/functions` | Would fail or misconfigure a new Netlify site |
| `netlify/functions/` | **Does not exist** | Deploy guides that require it are unusable |
| `docs/design/NETLIFY_DEPLOYMENT.md` | Historical | Full wrong stack (pnpm, DATABASE_URL, functions) |
| `docs/design/DEPLOYMENT_GUIDE_FINAL.md` | Historical | Same + credentials pattern |
| `.cursor/rules/core.mdc` | **Always-on wrong** | Agents default to Netlify + pnpm locally |

---

## 3. Document trust matrix

| Document | Last useful refresh | Hosting | Feature / score truth | Agent risk | Action |
|----------|--------------------:|---------|----------------------|------------|--------|
| `CLAUDE.md` | Partial | ✅ Workers + Hyperdrive + Netlify dead | ⚠️ Router tree incomplete; AI incomplete; `users` table wrong; anim variants wrong | Medium | Patch P0 drifts (§5) |
| `SKILLS.md` | Partial | n/a (API ref) | ⚠️ Known Issues badly stale; buckets wrong; AI uses `process.env` | High | Refresh Known Issues + buckets |
| `docs/04_features_audit.md` | **2026-07-24** | ✅ | ✅ Aligns with GO_LIVE | Low | Keep; cite as feature SoT |
| `docs/research/PUBLIC_READY_GAP_ANALYSIS.md` | **2026-07-21** | Mentions CF + Netlify drift as open | ❌ Score **65**, Legal **35**, logos **64%**, WA public — superseded | **Critical if used as go-live** | Banner: superseded by GO_LIVE |
| `docs/research/PRODUCTION_GO_LIVE_SCORECARD.md` | **2026-07-24** | ✅ | ✅ Score **85**, CONDITIONAL on human rotation | Low | **Launch SoT** |
| `docs/01_project_rules.md` | Current | ✅ | Thin but correct | Low | OK |
| `docs/03_api_and_integrations.md` | Stale rows | ✅ hosting footer | ❌ Auth levels wrong (protected vs admin); incomplete routers | High | Align to SKILLS + code |
| `docs/05_dependency_graph.md` | Stale | ❌ “Netlify function” | Wrong consumers | Medium | Rewrite consumers → Worker |
| `docs/06_tasks.md` | Current-ish | n/a | ✅ logos 83/83, WA disabled, hollow notes | Low | OK |
| `docs/CI.md` | Current | ✅ Authoritative | ✅ `ci:gate` | Low | OK |
| `DEPLOYMENT_GUIDE.md` | 2026-07-21 | ✅ | Minor: “65 federations”; claims Netlify sections “gone” but `netlify.toml` remains | Low | Tiny honesty fix |
| `docs/README.md` | Current | ✅ Explicit historical banner | Lists stale `design/` + SCALE + ROADMAP | Low | OK — keep banner |
| `README.md` (root) | Current | ✅ | OK | Low | OK |
| `.cursor/rules/core.mdc` | **Wrong** | ❌ Netlify | Wrong package story | **Critical** | Fix always-on rule |
| `.cursor/rules/security.mdc` | Misleading | n/a | ❌ “RLS on every table” as defence | High | Align with `RLS_POLICIES.md` |
| `.cursor/rules/production-readiness.mdc` | Wrong host | ❌ Netlify Functions | — | Medium | Workers isolates |
| `docs/engineering/SCALE_CONSIDERATIONS.md` | Historical | ❌ Netlify | `namibia_na_26_*` tables | Medium | Banner or rewrite |
| `docs/PLATFORM_ROADMAP.md` | Historical | ❌ Netlify secrets/analytics | “Split routers.ts” still open (done) | Medium | Banner |
| `docs/design/*` Netlify guides | Archive | ❌ | — | Medium | Already called out in `docs/README.md` |
| `docs/development/AGENT_WORKFLOWS.md` | Stale | Mentions split in progress | `namibia_na_26_*` examples | Medium | Fix shared-file + examples |
| `docs/development/CURSOR_QUICKSTART.md` | Stale | ❌ Netlify deploy | `server/routers.ts` | Medium | Patch |
| `todo.md` / `docs/Namibia Sports Platform - TODO.md` | Archive | ❌ Netlify checklist open | — | Low–Med | Banner or archive |

---

## 4. Cross-doc contradictions (scores & gates)

### 4.1 Launch score conflict

| Source | Full-public score | Verdict | Logos | Legal | WhatsApp API |
|--------|------------------:|---------|-------|-------|--------------|
| `PUBLIC_READY_GAP_ANALYSIS.md` (2026-07-21) | **65** | **NO-GO** | 53/83 (**64%**) | **35** — no Privacy/Terms | Public procedures; UI hide ≠ enough |
| `PRODUCTION_GO_LIVE_SCORECARD.md` (2026-07-24) | **85** (ops-capped ≤52 unrotated) | **CONDITIONAL** — soft GO after human rotation | **83/83 (100%)** | **92** — Privacy/Terms live | **Hard-disabled** |
| `04_features_audit.md` (2026-07-24) | n/a (matrix) | Soft public notes → GO_LIVE | — | ✅ Privacy/Terms | ⏸ Off |

**Drift severity:** Critical. An agent reading PUBLIC_READY alone will reopen closed P0s (legal pages, crest batch, WA disable, hollow UX) and understate readiness by ~20 points.

**Required banner on PUBLIC_READY** (suggested):

> SUPERSEDED for go/no-go by `PRODUCTION_GO_LIVE_SCORECARD.md` (2026-07-24). Keep as historical synthesis of the 2026-07-21 public-ready wave only.

### 4.2 SKILLS.md “Known Issues” vs GO_LIVE / 04_features

| SKILLS claim (§Known Issues) | Reality (code + GO_LIVE / 06_tasks) | Drift |
|------------------------------|-------------------------------------|-------|
| Logos ~**64%** active | **83/83** crests + marks | Critical stale |
| Hollow core-5 “still above full-public gate” | UX gate closed (tab hide); raw **21.7%** | Stale framing |
| Page-level EBs + submit loading locks “still open” | FederationRoute + Admin EBs; many forms use `isPending` | Stale |
| Credential rotation + Hyperdrive app role | Still human open — **correct** | OK |
| Live thin / flags off | Still true — **correct** | OK |

### 4.3 PUBLIC_READY P1 “refresh 04_features / align CLAUDE” status

| PUBLIC_READY P1 item | Status 2026-07-25 |
|----------------------|-------------------|
| Refresh `04_features_audit` | **Done** (2026-07-24) |
| Align CLAUDE / SCALE to Workers | CLAUDE **mostly**; SCALE / rules / ROADMAP **not** |
| Privacy / Terms | **Done** (GO_LIVE) |
| WhatsApp hard-disable | **Done** (`WHATSAPP_API_ENABLED=false`) |
| Crest ≥85% | **Done** (100%) |

---

## 5. CLAUDE.md drift (vs code)

| Claim in CLAUDE.md | Code / ops truth | Severity |
|--------------------|------------------|----------|
| Hosting Cloudflare Workers; Netlify dead | True; `netlify.toml` leftover | OK (wording accurate) |
| Routers in `server/routers.ts` “being split” | **`server/routers.ts` gone**; composition is `server/routers/index.ts` (20 routers) | High |
| Router tree: system…ai only | Missing **`users`, `adminStats`, `schools`, `media`, `hpPrograms`, `upload`, `search`, `contentSync`** | High |
| AI = Anthropic only (`claude-sonnet-4-6`) | Content Sync prefers **Workers AI** (`env.AI`); Anthropic fallback | Medium |
| Table `users` (no prefix) | Actual table **`sportsplatform_users`** (`drizzle/schema.ts`) | High |
| Migrations “apply in Supabase SQL editor” | Scripts: `db:generate` + `db:migrate`; SQL editor still used for some ops | Medium honesty |
| 8 Framer variants incl. `rotateIn`, `blurIn`, `diagonalIn` | `animations.ts` has fade*/scaleIn/stagger only — **no** rotate/blur/diagonal | Low |
| Shared file `server/routers.ts` for agents | Should be `server/routers/index.ts` + per-domain files | Medium |
| Live since / Hyperdrive | Matches GO_LIVE / DEPLOYMENT_GUIDE | OK |
| Gap B1 password in git history | Still open human item — OK | OK |
| `supabase-migration.sql` in tree diagram | File may exist as legacy; SoT is `drizzle/` + `supabase/migrations/` | Low |

---

## 6. SKILLS.md drift (vs code)

| Area | Drift |
|------|-------|
| Router composition path | Correct (`server/routers/` + `index.ts`) — **better than CLAUDE** |
| Procedure list | Mostly current; includes contentSync, upload, search, users |
| Missing from quick ref | `adminStats`, some procedure nuance (e.g. news.delete = federationAdmin not admin-only) |
| Storage buckets | Documents `federation-logos`, `athlete-photos`, … — code uses **`sportsplatform_logos`**, `sportsplatform_athlete_photos`, etc. (`server/services/supabaseStorage.ts`) |
| AI snippet | Uses `process.env.ANTHROPIC_API_KEY` — Workers use **bindings / `ENV`**, not Node `process.env` at module scope |
| Animations comment | “create if not exists” — file exists |
| Known Issues | **Out of date** vs GO_LIVE (see §4.2) |

---

## 7. `04_features_audit` vs scorecards

| Topic | 04_features (2026-07-24) | PUBLIC_READY (07-21) | GO_LIVE (07-24) |
|-------|--------------------------|----------------------|-----------------|
| Hosting | Workers ✅ | CF + Netlify drift note | Workers ✅ |
| WhatsApp | ⏸ Off hard-disabled | Abuse open | Hard-disabled ✅ |
| AI | ⏸ Off / gated | Hide | Off flags ✅ |
| Legal | ✅ privacy/terms | Missing | Done ✅ |
| SEO | Partial + pointer to SEO gaps | Sitemap thin | Done hubs+feds |
| Admin | Real CRUD | Mock claims obsolete | Done |
| Go-live note | Points to GO_LIVE | Self as SoT | Self as SoT |

**Verdict:** `04_features_audit.md` is consistent with GO_LIVE and should be preferred over PUBLIC_READY for feature status.

---

## 8. Netlify dead-reference inventory

Approximate hit counts (md/mdc/toml/ts; not exhaustive of binary/assets):

| File | ~hits | Class |
|------|------:|-------|
| `docs/design/DEPLOYMENT_GUIDE_FINAL.md` | 18 | Historical how-to — **dangerous** |
| `docs/design/NETLIFY_DEPLOYMENT.md` | 15 | Historical how-to — **dangerous** |
| `docs/Namibia Sports Platform - TODO.md` | 11 | Open Netlify checklist items |
| `docs/design/Namibia_Sports_Management_System_-_Project_Brief.md` | 9 | Archive brief (swakop.netlify.app, pnpm) |
| `todo.md` | 6 | Open Netlify checklist |
| `docs/engineering/SCALE_CONSIDERATIONS.md` | 6 | Stack template still Netlify |
| `docs/PLATFORM_ROADMAP.md` | 5 | Netlify analytics/secrets/timeouts |
| `CLAUDE.md` / `README.md` / `DEPLOYMENT_GUIDE.md` / `docs/CI.md` / `docs/README.md` | few | **Correct** “Netlify is dead” wording |
| `.cursor/rules/core.mdc` | 2 | **Wrong always-on** |
| `.cursor/rules/production-readiness.mdc` | 1 | Wrong host model |
| `docs/05_dependency_graph.md` | 3 | Wrong consumer |
| `docs/development/CURSOR_QUICKSTART.md` | 1 | `git push` → Netlify |
| `netlify.toml` | — | Dead config file |

**Also wrong adjacent claims in those files:** `pnpm build` / `pnpm build:netlify`, `DATABASE_URL` as production data path, `namibia_na_26_*` prefix, “connect repo to Netlify.”

**Mitigation already present:** `docs/README.md` and `docs/CI.md` banner historical Netlify docs. **Gap:** always-on Cursor rules and root `todo.md` are not bannered.

---

## 9. Always-on rule drift (highest agent risk)

| Rule file | Wrong / incomplete claim | Should say |
|-----------|--------------------------|------------|
| `.cursor/rules/core.mdc` | Hosting Netlify; npm (Netlify), pnpm locally | Cloudflare Workers; npm only |
| `.cursor/rules/security.mdc` | “RLS enabled on every table” + “Test RLS” as primary DB security | RLS exists for PostgREST; **Hyperdrive/Drizzle bypasses RLS**; tenancy = tRPC + `assertSameFederation` |
| `.cursor/rules/production-readiness.mdc` | “Netlify Functions are stateless…” | Worker isolates / per-request; no durable module cache |
| `.cursor/rules/audit.mdc` | Checklist “RLS enabled on all tables” without Hyperdrive caveat | Same as security rule |
| `documentation.mdc` | Mandates `docs/01–06`, SCALE, CHANGELOG | Files exist; SCALE content still Netlify — maintenance gap |

This contradicts `CLAUDE.md` “Where tenant isolation actually comes from” and `docs/architecture/RLS_POLICIES.md`. Agents that only load Cursor rules will **over-trust RLS** and **target Netlify**.

---

## 10. API docs drift (`03_api_and_integrations.md`)

Spot-check vs `server/routers/*.ts` + SKILLS:

| Doc claim | Code |
|-----------|------|
| federations create/update/delete = `protected` | **`adminProcedure`** |
| clubs/events mutate = `protected` | **`federationAdminProcedure` + assert** |
| venues mutate = `protected` | **`adminProcedure`** (per SKILLS/audit) |
| news.delete = `admin` | **`federationAdminProcedure`** |
| Missing routers | users, upload, search, ai, contentSync, schools, media, hpPrograms, whatsapp, adminStats, streams delete |
| Anthropic “chat widget 500s” | Still plausible if key unset + UI shown; UI gated by `VITE_SHOW_AI_CHAT` — nuance missing |
| WhatsApp env only | No note that procedures are hard-disabled |

---

## 11. `wrangler.jsonc` internal comment drift

| Comment | Conflict |
|---------|----------|
| “FIRST production deployment. The app has never been live.” | Apex live since **2026-07-19** (DEPLOYMENT_GUIDE / GO_LIVE) |
| Hyperdrive “NOT YET CREATED — placeholder” | Same file has real id `dbfcf635…` and later comment “Bound 2026-07-19” |
| Staging “API routes will fail until Hyperdrive filled” | Staging block uses same Hyperdrive id |

**Risk:** Infra agents may think Hyperdrive still needs creating, or that prod was never released.

---

## 12. Federation count & marketing language drift

| Source | Number | Meaning |
|--------|-------:|---------|
| Design / CLAUDE / SKILLS | **57** federations (+ 8 umbrellas + ministry + commission → **67** entities) | Design brief / NSC roster framing |
| Live DB (GO_LIVE / 06_tasks) | **83** active federations (logos 83/83) | Platform inventory (includes broader entity set) |
| `DEPLOYMENT_GUIDE.md` | **65** sporting federations | Third number — undocumented |

See also `docs/research/FEDERATION_COUNT_OFFICIAL_VS_PLATFORM.md`. Docs should always distinguish **NSC “57 sports”** vs **platform active rows**.

---

## 13. Priority fix list (docs only — ordered)

### P0 — stop wrong agent behaviour

1. **Banner** `PUBLIC_READY_GAP_ANALYSIS.md` as superseded by `PRODUCTION_GO_LIVE_SCORECARD.md`.
2. **Fix** `.cursor/rules/core.mdc` hosting + package manager → Cloudflare Workers / npm.
3. **Fix** `.cursor/rules/security.mdc` (and audit checklist) RLS wording → Hyperdrive bypass + tRPC tenancy.
4. **Refresh SKILLS.md Known Issues** to match GO_LIVE (logos 100%, EBs shipped, hollow UX gate).
5. **Patch CLAUDE.md** router composition path + full router list; `sportsplatform_users`; Workers AI.

### P1 — reduce contradiction surface

6. Rewrite `docs/03_api_and_integrations.md` auth column from live routers (or generate from SKILLS).
7. Fix `docs/05_dependency_graph.md` Netlify consumers → Worker entry.
8. Banner `SCALE_CONSIDERATIONS.md`, `PLATFORM_ROADMAP.md`, design Netlify guides, root `todo.md` (point to `docs/README.md` historical note).
9. Update `AGENT_WORKFLOWS.md` / `CURSOR_QUICKSTART.md`: no `routers.ts`, no Netlify push, no `namibia_na_26_*`.
10. Align SKILLS storage bucket names to `sportsplatform_*`.
11. Clean contradictory comments in `wrangler.jsonc` (live since / Hyperdrive created).
12. Harmonize federation counts with pointer to `FEDERATION_COUNT_OFFICIAL_VS_PLATFORM.md`.

### P2 — hygiene

13. Delete or relocate `netlify.toml` to `docs/archive/` (optional; CLAUDE already marks dead — deletion removes accidental Netlify reconnect).
14. CLAUDE Framer variant list → match `animations.ts`.
15. DEPLOYMENT_GUIDE “65 federations” + “Netlify sections gone” honesty.
16. Expand CLAUDE env docs for Workers AI / `ENABLE_CONTENT_SYNC` / `WHATSAPP_API_ENABLED`.

---

## 14. What is already aligned (do not “fix” as open)

| Topic | Aligned sources |
|-------|-----------------|
| Production = Cloudflare Workers + Hyperdrive | CLAUDE, README, CI, DEPLOYMENT_GUIDE, 01_project_rules, 04_features, GO_LIVE, docs/README banner |
| Never `drizzle-kit push` / shared ~737 tables | CLAUDE, docs/README, CI |
| Tenancy = tRPC not RLS (narrative) | CLAUDE, RLS_POLICIES, GO_LIVE security notes |
| Soft-public feature flags default off | 04_features, GO_LIVE, features.ts |
| Credential rotation still human blocker | GO_LIVE, SKILLS #1, SECURITY_CREDENTIAL_ROTATION |
| Router split to `server/routers/` | Code + SKILLS (CLAUDE lagging) |

---

## 15. Suggested canonical reading order (agents)

1. `docs/README.md` (hosting banner)  
2. `CLAUDE.md` (conventions) — **after P0 patches**  
3. `SKILLS.md` (procedures) — **after Known Issues refresh**  
4. `docs/research/PRODUCTION_GO_LIVE_SCORECARD.md` (go/no-go)  
5. `docs/04_features_audit.md` (feature matrix)  
6. `docs/CI.md` + `DEPLOYMENT_GUIDE.md` (deploy)  
7. `docs/architecture/RLS_POLICIES.md` (security model)  

**Do not use as current truth:** `PUBLIC_READY_GAP_ANALYSIS.md` (unbannered), `docs/design/NETLIFY_*`, `SCALE_CONSIDERATIONS.md`, `.cursor/rules/core.mdc` (until fixed), Netlify sections of TODO files.

---

## 16. Evidence index

| Check | Result |
|-------|--------|
| `server/routers.ts` exists | **No** |
| `server/routers/index.ts` routers | system, auth, users, adminStats, federations, clubs, events, athletes, coaches, venues, news, streams, schools, media, hpPrograms, upload, whatsapp, ai, contentSync, search |
| `netlify/functions` | **Missing** |
| `netlify.toml` | Present (dead) |
| `users` table name | `sportsplatform_users` |
| Storage buckets | `sportsplatform_*` map in `supabaseStorage.ts` |
| `packageManager` | `npm@10.9.4` |
| `ci:gate` | `check && test && build` |
| Animations | fade*/scaleIn/stagger — no rotateIn/blurIn/diagonalIn |
| GO_LIVE date / score | 2026-07-24 / **85** CONDITIONAL |
| PUBLIC_READY date / score | 2026-07-21 / **65** NO-GO |

---

*End of 14_docs_drift.md. Verdict: hosting truth is documented in the right places, but always-on Cursor rules, PUBLIC_READY, SKILLS Known Issues, CLAUDE router/table details, and Netlify archives still create a high drift hazard for agents.*
