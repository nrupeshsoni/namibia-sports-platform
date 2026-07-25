# Gap Analysis — Testing / CI / Ops

**Wave:** `gap_wave_20260725` · **Doc:** `11_testing_ci_ops.md`  
**Date:** 2026-07-25  
**Workspace:** `C:\Projects\The Dome\namibia-sports-platform`  
**Scope:** Vitest suite & coverage policy; `federationScope` tenancy tests; `ci:gate` vs Cloudflare Workers Builds; migrations process; rollback; secrets rotation docs; monitoring / `wrangler tail` / Observability.  
**Method:** Static audit of `package.json`, `vitest.config.ts`, `server/*.test.ts`, `client/src/lib/*.test.ts`, `.github/workflows/ci.yml`, `docs/CI.md`, `DEPLOYMENT_GUIDE.md`, `docs/research/SECURITY_CREDENTIAL_ROTATION.md`, `wrangler.jsonc`, Supabase migration layout; live verification via Workers Builds MCP + Observability MCP (account `172d6c3857f7ef25ecc5caadc9381e9f`). Ran `npm test` locally (84/84 pass). No DB mutations.

**Rules applied:** SEARCH FIRST / REUSE FIRST / NO ASSUMPTIONS / documentation deliverable.

---

## 1. Executive verdict

| Metric | Verdict |
|--------|---------|
| **Overall Testing / CI / Ops readiness** | **Soft-beta OK; national-launch Ops still blocked on credential rotation** |
| **Vitest** | **84 tests / 9 files / all green** — strong on tenancy + a few guards; **no coverage reporter**; policy vs practice diverge |
| **federationScope suite** | **Core A6 regression net is solid** for input-`federationId` mutations; **DB-first** scoped mutations untested without mocks |
| **`ci:gate` vs CF Builds** | **CLOSED (2026-07-24)** — dashboard now runs `npm run ci:gate`; scorecard/`docs/CI.md` still say HUMAN pending |
| **Migrations process** | **Operational but dual-tracked** — real ledger is `supabase/migrations/`; `drizzle/` has schema only (no generated SQL) |
| **Rollback** | **Worker version rollback documented**; **no DB down-migration / secrets rollback** story |
| **Secrets rotation** | **Docs excellent; live rotation still CRITICAL / HUMAN** |
| **Monitoring** | **Observability on + `cf:tail` + `/api/health`**; **no alerts, no Sentry, no on-call runbook** |

**One-liner:** Quality gate is now on both GitHub Actions and Workers Builds; tenancy unit/integration tests exist; Ops launch gate remains **rotate Hyperdrive/DB/service_role**, then add coverage tooling, DB-first tenancy mocks, and alerting.

---

## 2. Vitest coverage audit

### 2.1 Inventory (verified 2026-07-25)

| File | Focus | Approx. `it()` cases |
|------|-------|---------------------|
| `server/federationScope.test.ts` | Tenancy helpers + cross-tenant tRPC FORBIDDEN + same-tenant pass-through | ~18 static + **21** parameterized cross-tenant |
| `server/mediumGuards.test.ts` | setRole Zod, storage path sanitize, https href, CORS | 9 |
| `server/usersAdmin.test.ts` | Admin user invite/promote / stats guards | 7 |
| `server/auth.logout.test.ts` | logout behaviour + role gate smoke | 6 |
| `server/rateLimit.test.ts` | `enforceRateLimit` / `clientKey` | 4 |
| `server/contentSyncAi.test.ts` | AI suggestion parse + scope helpers + flag | 9 |
| `client/src/lib/federationPublicTabs.test.ts` | Public Fed tab honesty | 5 |
| `client/src/lib/features.test.ts` | Feature flags default-off + client https | 2 |
| `client/src/lib/mapRegions.test.ts` | Map region parsing | 5 |

**Local run:** `npm test` → **9 files passed, 84 tests passed** (~12s).

### 2.2 Config

```ts
// vitest.config.ts
test: {
  environment: "node",
  include: [
    "server/**/*.test.ts",
    "server/**/*.spec.ts",
    "client/src/lib/**/*.test.ts",
  ],
}
```

| Gap | Severity | Evidence |
|-----|----------|----------|
| **No coverage provider** (`@vitest/coverage-v8` optional peer only) | Medium | No `coverage` block; CI never fails on % |
| **No component / page tests** | Medium | `include` excludes `client/src/pages/**`, `components/**` |
| **No E2E** (Playwright/Cypress) | Medium–High for launch | `.cursor/rules/testing.mdc` requires E2E; none in repo |
| **Most tRPC routers untested** | High (policy) / Medium (beta) | No dedicated suites for `federations`, `venues`, `schools`, `whatsapp`, `ai`, `search`, `media`, `contentSync` procedures |
| **Policy vs practice** | Medium | `testing.mdc`: 80% new code / 100% auth+mutation — **not measured or enforced** |
| **`todo.md` stale** | Low | Still lists “Write vitest tests for all tRPC procedures” |

### 2.3 What is well covered

- Federation tenancy early-reject path (A6) — see §3.
- Rate limit helper, CORS allowlist, https URL filter, storage entity-id sanitize.
- Admin-only user procedures (role reject).
- Content Sync AI JSON parsing (unit, not live Worker AI).
- Public Fed tab inventory gate + feature-flag defaults.

### 2.4 Score (Tests pillar)

| Lens | Score | Notes |
|------|------:|-------|
| Critical security/tenancy regression net | **82** | federationScope + mediumGuards |
| Breadth vs routers / UI | **45** | Thin |
| Tooling (coverage, E2E, CI fail-on-cov) | **35** | Missing |
| **Composite Tests** | **~62** | Adequate soft-beta; not launch-grade |

---

## 3. `federationScope` audit

### 3.1 Design (correct)

- Middleware (`federationAdminProcedure`) checks **role only**.
- Tenant isolation is **explicit** `assertSameFederation` / `assertClaimMatchesOwnedRow` inside each mutation (`server/_core/federationScope.ts`).
- Suite uses real `appRouter.createCaller` so guards run on the live call path.
- Without DB, post-guard failures surface as `"Database not available"` — used as negative control that authorization ran first.

### 3.2 Cross-tenant matrix covered today

From `crossTenantCalls()` in `server/federationScope.test.ts`:

| Procedure | Cross-tenant FORBIDDEN |
|-----------|------------------------|
| `athletes.create/update/delete` | Yes |
| `clubs.create/update/delete` | Yes |
| `coaches.create` | Yes |
| `events.create/update/delete` | Yes |
| `hpPrograms.create` | Yes |
| `news.create/update/publish/delete` | Yes |
| `streams.create/update/setLive/delete` | Yes |
| `upload.image` | Yes |

Also: unit tests for `assertSameFederation`, `assertClaimMatchesOwnedRow`, `canIncludeUnpublished` / `canIncludeInactive` / `canViewNonPublic`; null-federation admin reject; same-tenant pass-through for clubs/events/news/streams/upload.

### 3.3 Gaps in the tenancy suite

| Mutation / path | Why untested | Risk |
|-----------------|--------------|------|
| `coaches.update` / `coaches.delete` | ~~Load before assert — no DB~~ | **Covered** — `federationScopeDbFirst.test.ts` (mocked `getDb`) |
| `hpPrograms.update` / `hpPrograms.delete` | ~~Same DB-first pattern~~ | **Covered** — same suite |
| `media.create` / `media.delete` | ~~Resolve via entity lookup~~ | **Covered** — same suite (+ club ownership case) |
| Claim≠row on `events/news/streams` update/delete/publish/setLive | `assertClaimMatchesOwnedRow` needs a loaded row | Medium — unit-tested helper; not end-to-end |
| `federations.*` admin mutations | Platform-admin scoped (not fed-tenant) | N/A for A6 |
| Read paths leaking unpublished/inactive | Helpers unit-tested; list queries not integration-tested | Medium |

**Rule for new mutations (from CLAUDE.md):** add `assertSameFederation` **and** a cross-tenant case in `federationScope.test.ts`. DB-first mutations need a **mock `getDb`** (or injectable repository) before that rule is enforceable for media/coaches/hp update-delete.

---

## 4. `ci:gate` vs Cloudflare Workers Builds

### 4.1 Definitions

| Path | Command | Deploys? |
|------|---------|----------|
| Local / scripted | `npm run ci:gate` = `check` → `test` → `build` | No |
| `npm run cf:deploy` / `cf:deploy:staging` | `ci:gate` then `wrangler deploy` | Yes |
| GitHub Actions `.github/workflows/ci.yml` | Same three steps separately | **No** (quality only) |
| Cloudflare Workers Builds (dashboard) | Build + Deploy commands | Yes → apex |

### 4.2 Live verification (Builds MCP, 2026-07-25)

Worker id `27078facc5ee495db6dfbbefa6df4aa8` · account `172d6c3857f7ef25ecc5caadc9381e9f`.

| Build UUID | Time (UTC) | Commit note | **Build command** | Outcome |
|------------|------------|-------------|-------------------|---------|
| `8a590c71-…` | 2026-07-24 18:40 | Map harden | `npm run build` | success |
| `993a3dfc-…` | 2026-07-24 18:57 | **“ci: trigger… gated build command (B6)”** | **`npm run ci:gate`** | success |
| `0ef69976-…` | 2026-07-24 20:33 | latest sampled | **`npm run ci:gate`** | success |

Deploy command remains `npx wrangler deploy` throughout.

**Verdict:** Builds dashboard gap from `docs/CI.md` (verified stale as of 2026-07-23) and `PRODUCTION_GO_LIVE_SCORECARD.md` (“❌ HUMAN”) is **outdated — gate is live**. Keep monitoring that a future dashboard edit does not silently revert to `npm run build`.

### 4.3 Residual CI/Ops gaps

| Gap | Severity | Notes |
|-----|----------|-------|
| **Dual writers** | Medium | `main` auto-deploy via Builds **and** humans can `cf:deploy` — last-writer-wins (`DEPLOYMENT_GUIDE.md`) |
| **GHA ≠ deploy gate** | Low now that Builds uses `ci:gate` | GHA still valuable for PRs (Builds typically only on `main`) |
| **Agents cannot PATCH Builds triggers** | Low | Documented in `docs/CI.md`; needs API token with Workers Builds Configuration: Edit |
| **Failed build example** | Info | Build `84c59f79-…` (Content Sync) `fail` same day — proves gate can stop deploys when check/test/build breaks |
| **Doc drift** | Medium | Update `docs/CI.md` §Verified + scorecard Ops row to ✅ |

---

## 5. Migrations process

### 5.1 Documented happy path

| Source | Says |
|--------|------|
| `package.json` | `db:generate` / `db:migrate` via drizzle-kit |
| `CLAUDE.md` / README | Generate → migrate; **never** `drizzle-kit push` |
| `drizzle.config.ts` | `tablesFilter: ["sportsplatform_*"]` — shared-DB safety |
| `docs/development/AGENT_WORKFLOWS.md` | Agent B writes SQL into `drizzle/` then migrates |

### 5.2 Reality (repo + practice)

| Fact | Evidence |
|------|----------|
| **`drizzle/` has no migration SQL** | Only `schema.ts` + `relations.ts` (no `meta/`, no `0000_*.sql`) |
| **Authoritative ledger is Supabase SQL files** | **67** files under `supabase/migrations/` (data + RLS + role grants) |
| **Apply path in practice** | Supabase MCP `apply_migration` / SQL Editor; research batch notes cite this repeatedly |
| **`db:migrate` requires `DATABASE_URL`** | `drizzle.config.ts` throws if unset — Workers prod has **no** `DATABASE_URL` (Hyperdrive only) |
| **Initial bootstrap doc still points at monolith SQL** | `DEPLOYMENT_GUIDE.md` §Database schema → `supabase-migration.sql` |

### 5.3 Gaps

| Gap | Severity | Recommendation |
|-----|----------|----------------|
| **Dual migration mental models** | **High (ops confusion)** | Pick one ledger: treat `supabase/migrations/` as SoT; document drizzle-kit generate as optional/unused or wire `out` to a real folder and stop hand-SQL drift |
| **No automated migrate in CI/Builds** | Medium | Intentional (shared DB) — but means schema/data apply is **human/agent MCP**, not gated by deploy |
| **No down / rollback SQL** | Medium | Forward-only; bad data migrations need compensating SQL |
| **AGENT_WORKFLOWS wrong path** | Medium | Still says SQL lands in `drizzle/` |
| **New table grants for `sportsplatform_app`** | Medium | Rotation doc §G — re-run grant loop; easy to forget |
| **`push` reintroduction risk** | Critical if done | Correctly removed; keep banned |

---

## 6. Rollback

### 6.1 What exists (good)

Documented in `DEPLOYMENT_GUIDE.md`, `README.md`, `CLAUDE.md`:

```bash
npx wrangler deployments status --name namibia-sports-platform
npx wrangler versions list --name namibia-sports-platform
npx wrangler rollback [VERSION_ID] --name namibia-sports-platform --message "reason"
```

| Property | Status |
|----------|--------|
| SPA + API atomic (assets in version) | Yes |
| Limit 100 recent versions | Documented |
| Does **not** revert secrets / bindings | Documented |
| Refused if target version’s binding missing | Documented (`HYPERDRIVE`, `ASSETS`) |
| Staging env separate Worker name | Yes (`namibia-sports-platform-staging`) |

### 6.2 Gaps

| Gap | Severity | Notes |
|-----|----------|-------|
| **No DB schema/data rollback procedure** | High for bad migrations | Compensating SQL only; no `drizzle-kit drop` story |
| **Dual deploy writers complicate “which version”** | Medium | Always `deployments status` after manual deploy |
| **Secrets mis-rotation not fixable by rollback** | High (ops) | Must re-`wrangler secret put` / Hyperdrive update |
| **No staged canary / percentage rollback** | Low | Single apex Worker |
| **No post-rollback smoke checklist in one place** | Low | Federations list + Storage upload + health — scatter across rotation doc |

---

## 7. Secrets rotation docs

### 7.1 Strengths

`docs/research/SECURITY_CREDENTIAL_ROTATION.md` is **launch-grade ops documentation**:

- What leaked (postgres password, service_role JWT) and that scrub ≠ revoke.
- Role `sportsplatform_app` already created (migration `20260723230000_…` / Supabase `20260723200947`).
- Ordered checklist A→G (password → Hyperdrive → rotate postgres → rotate service_role → Worker secrets → verify → future grants).
- Explicit “agents cannot rotate” / never paste secrets.

Cross-links: `docs/06_tasks.md`, `PRODUCTION_SECURITY_AUDIT.md` C1/C2, `RLS_POLICIES.md` B1, `docs/CI.md` Hyperdrive TODO.

### 7.2 Live status (still open)

| Step | Status |
|------|--------|
| Scrub tree of plaintext secrets | Done (historical) |
| Create `sportsplatform_app` + grants | Done |
| Set role password | **HUMAN pending** |
| Point Hyperdrive `dbfcf635ad4a475ba991743b94a5d6a2` at app role | **HUMAN pending** (still `postgres` / bypassrls) |
| Rotate leaked `postgres` password | **HUMAN pending** |
| Rotate `SUPABASE_SERVICE_ROLE_KEY` + `wrangler secret put` | **HUMAN pending** |
| Staging own Hyperdrive id | Optional hardening — still shared id |

### 7.3 Doc gaps (minor)

| Gap | Severity |
|-----|----------|
| `wrangler.jsonc` comments still say Hyperdrive “NOT YET CREATED” / placeholder — **id is live** | Low–Med drift |
| `DEPLOYMENT_GUIDE.md` B1 paragraph slightly behind “role created, switch pending” | Low |
| Scorecard Ops still lists Builds `ci:gate` as HUMAN — **should flip** | Low |

---

## 8. Monitoring / tail / Observability

### 8.1 What is on

| Capability | Status | Evidence |
|------------|--------|----------|
| Workers Observability | **Enabled** | `wrangler.jsonc` `"observability": { "enabled": true }` (prod + staging) |
| Live log stream | **Scripted** | `npm run cf:tail` → `wrangler tail namibia-sports-platform` |
| Health HTTP | **Present** | `server/worker.ts` `/api/health`; tRPC `system.health` |
| MCP log query | **Works** | Observability MCP returned data for service `namibia-sports-platform` |

### 8.2 Sample signal (Observability MCP)

Timeframe `2026-07-24T00:00:00Z` → `2026-07-25T18:00:00Z`: **21** events with `$metadata.error` exists. Volume is low, but **nobody is paged**.

### 8.3 Gaps

| Gap | Severity | Notes |
|-----|----------|-------|
| **No alerting** (error rate, 5xx, duration) | High for launch | Observability without notify = passive |
| **No Sentry / client error pipeline** | Medium | Roadmap / old Netlify guide only; no `client/src/lib/sentry.ts` |
| **No runbook** (tail → filter → rollback) | Medium | Pieces exist; not one ops page |
| **`SCALE_CONSIDERATIONS.md` still Netlify-centric** | Medium | Misleads capacity/ops planning |
| **Health is shallow** | Low | `system.health` does not probe Hyperdrive/DB |
| **No synthetic uptime check** documented | Low | External ping of `sports.com.na` / `/api/health` |
| **Edge Function logs** (news-aggregator, WA webhook) | Medium | Separate from Worker tail; not in `cf:tail` |

---

## 9. Consolidated gap register

| ID | Gap | Severity | Owner | Status |
|----|-----|----------|-------|--------|
| T1 | No vitest coverage reporting / thresholds | Medium | Eng | Open |
| T2 | No E2E; almost no UI tests | Medium–High | Frontend | Open |
| T3 | Most routers lack procedure tests | Medium | Backend | Open |
| T4 | `media` / DB-first coach+hp mutations missing from federationScope matrix | Medium–High | Backend | **Closed 2026-07-25** — `federationScopeDbFirst.test.ts` |
| C1 | Workers Builds build command ≠ `ci:gate` | ~~Critical~~ | Infra | **Closed 2026-07-24** |
| C2 | Docs/scorecard still claim Builds HUMAN | Medium | Docs | Open (doc fix) |
| C3 | Dual deploy writers (Builds + manual) | Medium | Infra | Accepted risk — document smoke after manual |
| M1 | drizzle generate/migrate vs supabase/migrations dual process | High | Backend/Infra | Open |
| M2 | No migrate-in-CI; apply is MCP/human | Medium | Infra | Accepted for shared DB |
| M3 | No down-migration / DB rollback playbook | Medium | Backend | Open |
| R1 | Worker rollback OK; secrets/DB not covered | High (awareness) | Ops | Documented partially |
| S1 | Live credential + Hyperdrive rotation | **Critical** | **Human** | Open |
| S2 | Staging shares production Hyperdrive id | Medium | Infra | Open (optional) |
| O1 | No error/latency alerting | High | Infra | Open |
| O2 | No Sentry / client error tracking | Medium | Frontend | Open |
| O3 | No single monitoring runbook | Medium | Docs | Open |
| O4 | SCALE_CONSIDERATIONS Netlify drift | Medium | Docs | Open |

---

## 10. Scores (this domain)

| Sub-area | Score | Weight | Notes |
|----------|------:|-------:|-------|
| Unit / tenancy tests | 78 | 25% | federationScope strong |
| Coverage tooling & breadth | 40 | 15% | Policy unmet |
| CI (GHA + Builds gate) | **92** | 20% | `ci:gate` on both paths |
| Migrations process clarity | 48 | 15% | Works in practice; dual SoT |
| Rollback readiness | 70 | 10% | Worker yes; DB/secrets no |
| Secrets rotation (docs + live) | 55 | 10% | Docs 95; live 10 |
| Monitoring & alerting | 45 | 5% | Observability on; no alerts |
| **Weighted Testing/CI/Ops** | **~68** | 100% | Cap for **go-live trust** remains **S1 rotation** |

After S1 (rotation + Hyperdrive app role) and C2 doc sync: domain ≈ **78–82**. After T1+T4+O1: ≈ **88+**.

---

## 11. Recommended next actions (priority)

### P0 — Human / launch blockers

1. Execute `SECURITY_CREDENTIAL_ROTATION.md` A→F (password → Hyperdrive → rotate postgres → service_role → Worker secrets → smoke).
2. Confirm Builds trigger still `npm run ci:gate` after any dashboard edits.

### P1 — Close residual quality/ops gaps

3. Add `@vitest/coverage-v8` + CI threshold (start modest: e.g. lines on `server/_core/federationScope.ts` + `server/routers/{clubs,events,news,streams,upload}.ts`).
4. Extend `federationScope.test.ts` with mocked DB for `media.*`, `coaches.update/delete`, `hpPrograms.update/delete`.
5. Publish one **Ops runbook** page: tail → Observability query → rollback → secret re-put → health smoke.
6. Wire Cloudflare/Workers alert or external uptime on 5xx / error spike.

### P2 — Process hygiene

7. Rewrite migration section in `AGENT_WORKFLOWS.md` + `DEPLOYMENT_GUIDE.md` to match `supabase/migrations/` reality; either delete unused `db:generate` narrative or start committing drizzle SQL.
8. Flip scorecard / `docs/CI.md` Builds row to ✅ with date **2026-07-24**.
9. Refresh `SCALE_CONSIDERATIONS.md` for Workers + Hyperdrive (drop Netlify as primary).
10. Add shallow DB ping to `/api/health` or a separate admin-only readiness probe (careful with cost/latency).

---

## 12. Evidence index

| Artifact | Path / ID |
|----------|-----------|
| Gate script | `package.json` → `ci:gate` |
| Vitest config | `vitest.config.ts` |
| GHA | `.github/workflows/ci.yml` |
| CI docs | `docs/CI.md` |
| Tenancy tests | `server/federationScope.test.ts` |
| Deploy / rollback | `DEPLOYMENT_GUIDE.md` |
| Rotation checklist | `docs/research/SECURITY_CREDENTIAL_ROTATION.md` |
| Worker config | `wrangler.jsonc` (observability, Hyperdrive id) |
| Migration ledger | `supabase/migrations/` (67 SQL files) |
| Builds (latest) | UUID `0ef69976-88c0-43c4-b3b4-4b2dcb17c52d` · build `npm run ci:gate` |
| Builds (pre-gate) | UUID `8a590c71-8a25-4381-84cb-1fa10f8e8551` · build `npm run build` |
| Local test run | 2026-07-25 · 84 passed |

---

*End of Agent doc `11_testing_ci_ops.md`. No code or DB mutations.*
