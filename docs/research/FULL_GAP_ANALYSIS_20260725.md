# Full Gap Analysis — Master Synthesis (2026-07-25)

**Role:** SYNTHESIZER (gap wave 20-agent)  
**Date:** 2026-07-25 ~20:05 CAT  
**Workspace:** `namibia-sports-platform` · Project `rbibqjgsnrueubrvyqps`  
**HEAD context:** `main` through adversarial A1–A3 harden (`3f676e7`) + sibling gap docs  
**Bar:** Soft / invite public **vs** full national marketing launch  
**DB mutations this synthesis:** none (read-only SQL + sibling docs)

### Sibling inputs (`docs/research/gap_wave_20260725/`)

| # | Slice | File | Status |
|---|-------|------|--------|
| 01 | Security / Auth / RBAC | `01_security.md` | ✅ |
| 02 | Data completeness | `02_data_completeness.md` | ✅ |
| 03 | SEO / AIO | `03_seo_aio.md` | ✅ |
| 04 | Frontend UX | `04_frontend_ux.md` | ✅ |
| 05 | Admin CMS | `05_admin_cms.md` | ✅ |
| 06 | API / tRPC | `06_api_trpc.md` | ✅ |
| 07 | Perf / Worker / CF | `07_performance_infra.md` | ✅ |
| 08 | News pipeline | `08_news_pipeline.md` | ✅ |
| 09 | Events / Live | `09_events_live.md` | ✅ |
| 10 | Federations / brands | `10_federations_brands.md` | ✅ |
| 11 | Testing / CI / Ops | `11_testing_ci_ops.md` | ✅ |
| 12 | A11y / Legal | `12_a11y_legal.md` | ✅ |
| 13 | Integrations | `13_integrations.md` | ✅ |
| 14 | Docs drift | `14_docs_drift.md` | ✅ |
| 15 | Routes / dead code | `15_routes_dead_code.md` | ✅ |
| 16 | Map / regions | `16_map_regions.md` | ✅ |
| 17 | People / programs | `17_people_programs.md` | ✅ |
| 18 | Go-live blockers | `18_golive_blockers.md` | ✅ |
| 19 | Adversarial | `19_adversarial.md` | ✅ (A1–A3 **code-fixed** mid-wave) |
| — | Prior SoT | `PRODUCTION_GO_LIVE_SCORECARD.md` (85), `PUBLIC_READY_*`, `SEO_AIO_*`, security audit | ✅ |

---

## 1. Executive verdict

| Metric | Soft / invite public | Full national launch |
|--------|---------------------:|---------------------:|
| **Honest score /100** | **84** | **76** |
| **Ops hard cap (creds unrotated)** | **≤52** | **≤52** |
| **After human rotation + Hyperdrive app role** | **~89** | **~82** (content/SEO still bind) |
| **Go / No-Go** | **CONDITIONAL → GO after §5 human blockers** | **NO-GO** |

### One-line decision

**CONDITIONAL.** Soft public (Home + Events + News + Big-8, dark-first, flags off) is **agent-ready** and becomes **GO** the moment credential rotation + Hyperdrive least-privilege complete. Full national marketing remains **NO-GO** — hollow long-tail depth, calendar freshness, map geodata, and crawl/SSR still fail a “national complete” claim even after ops unlocks.

### Score bands (same as prior scorecards)

| Band | Meaning |
|------|---------|
| 90–100 | National launch — dense coverage, hardened abuse/legal surface |
| **75–89** | **← soft public (84)** Public OK with known long-tail gaps |
| **60–74** | Soft marketing to hubs only / invite |
| 40–59 | Invite-only (**also ops-capped ≤52** while secrets unrotated) |
| &lt;40 | Internal demo |

---

## 2. Live inventory (re-spot SQL 2026-07-25)

| Metric | Value |
|--------|------:|
| Active federations (directory) | **83** (85 rows incl. soft-merged) |
| Logos | **83/83 (100%)** — ~55 crests + ~28 sport marks |
| Published events / upcoming | **291** / **40–41** |
| Active clubs / athletes / coaches | **191** / **198** / **47** |
| Published news (`agg-*`) | **147** (**58** aggregator) |
| Live streams live / scheduled / total | **0** / **0** / **4** VOD |
| Venues / media / WA subs | **42** / **61** / **0** |
| Hollow core-5 (0 club+athlete+news+upcoming+coach) | **18 / 83 (21.7%)** |
| Zero-news / zero-club / zero-athlete feds | **22** / **41** / **49** |
| No email+phone / no website | **10** / **28** |
| Hyperdrive origin user | **`postgres`** (still) |
| `sportsplatform_app.has_password` | **false** |
| Workers Builds build command | **`npm run ci:gate`** ✅ (was HUMAN on 2026-07-24 scorecard) |

---

## 3. Summary table by domain

Scores are on the **full public bar** unless noted. Soft-public viability called out in Notes.

| Domain | Score | Soft OK? | Notes |
|--------|------:|:--------:|-------|
| **Security** | **78** | After rotation | App Criticals closed; A1–A3 fixed mid-wave; **C1/C2 human Critical open**; WAF P1 |
| **RBAC / tenancy** | **92** | ✅ | `assertSameFederation` + load-assert; upload now entity-owned |
| **Data** | **86** | Big-8 ✅ | Logos/heroes/desc 100%; depth hollow; upcoming thin |
| **SEO / AIO** | **65** | Hubs ✅ | Athlete Worker SPA fix shipped; no SSR; SearchAction broken; no event/club URLs |
| **Frontend UX** | **68** | Dark ✅ | Light theme incomplete; Fed modal a11y; Map content thin |
| **Admin / CMS** | **90** | ✅ | Real tRPC CRUD; invite honesty + media.update residual |
| **API / tRPC** | **88** | ✅ | Caps + gates solid; docs/03 stale; news attribution CMS gap |
| **Perf / infra** | **58** | Soft OK | Bundle/images/Cache-Control; Hyperdrive works; ci:gate live |
| **News pipeline** | **78** | ✅ | Aggregator + 6h cron + auto-publish trusted feeds |
| **Events / Live** | **51** | Events OK | No `/events/:slug`; Live VOD-honest; upcoming 40 |
| **Federations / brands** | **65** | Directory OK | Marks ≠ crests; media gallery thin; Storage static-first |
| **Testing / CI / Ops** | **72** | After rotation | **Builds `ci:gate` closed**; rotation still open; thin suite |
| **A11y / Legal** | **68** | Soft OK | Privacy/Terms live; cookie/POPIA/a11y debt (prior Legal 92 overstated) |
| **Integrations** | **72** honest / **38** claimed | Flags off | WA hard-off; AI gated; Content Sync + aggregator live |
| **Docs drift** | **58** | — | `PUBLIC_READY` (65) misleads; GO_LIVE was SoT |
| **Map / regions** | **48** | De-emphasize | Crash fixed; not a geocoded national map |
| **People / HP / schools** | **55** | Soft | Athletes deep in majors; coaches/HP thin |
| **Routes / dead code** | **70** | — | No critical dead routes; Register discoverability thin |
| **Weighted (full bar)** | **~83** | — | Caps **≤52** until rotation |
| **Soft public (honest)** | **84** | — | Dark-first hubs + Big-8 |
| **Full national (honest)** | **76** | — | Content + SEO + map bind |

### Weighted math (full public bar — honesty-adjusted)

| Domain | Score | Weight |
|--------|------:|-------:|
| Features | 88 | 10% |
| Security | 78 | 18% |
| RBAC | 92 | 10% |
| Schema | 80 | 8% |
| Data | 86 | 12% |
| Flows | 88 | 8% |
| API | 88 | 8% |
| Frontend | 82 | 8% |
| Ops | 82 | 6% |
| Integrations | 72 | 4% |
| Legal | 78 | 4% |
| Perf / SEO | 70 | 2% |
| CMS | 90 | 1% |
| Tests | 72 | 1% |
| **Weighted** | **~83** | 100% |

Delta vs prior scorecard **85**: −2 net honesty (Legal / Frontend / Perf·SEO corrected down; Security A1–A3 + Ops `ci:gate` up). Soft public lane remains the right ship target.

---

## 4. GO / NO-GO gates

| Condition | Soft public | Full national |
|-----------|:-----------:|:-------------:|
| Rotate Postgres + `service_role` + Worker secrets | **Blocker** | **Blocker** |
| Hyperdrive → `sportsplatform_app` (not `postgres`) | **Blocker** | **Blocker** |
| Workers Builds = `npm run ci:gate` | **Done** ✅ | **Done** ✅ |
| WA / AI / Google flags default off; WA API hard-disabled | Required | Required |
| Live nav inventory-gated; no “live streaming” claims | Required | Required |
| Privacy / Terms + footers | **Done** | **Done** |
| Logos 100% (crests+marks) | **Done** | Prefer real crests ≥85% |
| Hollow UX (hide empty Fed tabs) | **Done** | Raw core-5 ≤15% still open |
| Event detail URLs + denser calendars | Soft OK without | **Required** |
| Map as national geocoded product | Do not claim | **Required** |
| SSR / prerender for AIO | Soft OK | Strongly required |

**Verdict: CONDITIONAL** — soft **GO after human §5**; full national **NO-GO**.

---

## 5. Explicit remaining HUMAN blockers

Agents **cannot** finish these. Canonical runbook: [`SECURITY_CREDENTIAL_ROTATION.md`](./SECURITY_CREDENTIAL_ROTATION.md) · detail: [`gap_wave_20260725/18_golive_blockers.md`](./gap_wave_20260725/18_golive_blockers.md).

| # | Blocker | Owner | Live status 2026-07-25 |
|---|---------|-------|------------------------|
| **H1** | `ALTER ROLE sportsplatform_app PASSWORD …` | **Human** | Role exists; **no password** |
| **H2** | Point Hyperdrive `dbfcf635…` at `sportsplatform_app` | **Human** | Origin still **`postgres`** |
| **H3** | Reset compromised Supabase `postgres` password | **Human** | Treat as compromised (git history) |
| **H4** | Rotate `SUPABASE_SERVICE_ROLE_KEY` | **Human** | Tree scrubbed; live key must rotate |
| **H5** | `wrangler secret put` + smoke on `namibia-sports-platform` | **Human** | — |
| **H6** | Smoke: `federations.list` + Storage upload; old keys fail | **Human** | — |
| **H7** | Confirm prod `VITE_SHOW_*` / Google auth **unset** | **Human** | Code defaults safe; dashboard confirm |
| ~~H8~~ | ~~Workers Builds → `ci:gate`~~ | — | **CLOSED** (live builds use `npm run ci:gate`) |

**Optional human P1 (not hard GO):** Cloudflare WAF / Rate Limiting on `/api/trpc/*`; separate staging Hyperdrive.

---

## 6. Top 20 prioritized actions

| # | Pri | Action | Owner |
|---|:---:|--------|-------|
| 1 | **P0** | Complete H1–H6 credential rotation + Hyperdrive app role | **Human** |
| 2 | **P0** | Confirm Builds env: no `VITE_SHOW_LIVE_NAV` / WA / AI / Google | **Human** |
| 3 | **P0** | Keep marketing honest — no “live streams” / “every federation complete” | **Human** |
| 4 | **P0** | Fill 10 no-contact federations (email or phone) | **Agent** + Human verify |
| 5 | **P0** | Seed ≥1 upcoming event for Big-8 + high-traffic mid-tier with 0 upcoming | **Agent** (verified sources) |
| 6 | **P0** | Banner `PUBLIC_READY_GAP_ANALYSIS.md` as superseded by this doc + GO_LIVE | **Agent** |
| 7 | **P1** | Wire or remove homepage SearchAction (`/?q=` unwired) | **Agent** |
| 8 | **P1** | Ship `/events/:slug` (or fed-scoped detail) + sitemap URLs | **Agent** |
| 9 | **P1** | CF WAF / global rate limit on `/api/trpc/*` | **Human** |
| 10 | **P1** | Light-theme content migration (Home mid-page still forced dark) | **Agent** |
| 11 | **P1** | FederationModal a11y (dialog, Escape, focus trap) | **Agent** |
| 12 | **P1** | News CMS write path for `sourceUrl` / `sourceName` | **Agent** |
| 13 | **P1** | Cache-Control immutable for hashed Worker assets + compress oversized images | **Agent** / **Human** CF |
| 14 | **P1** | Hollow pack: ≥1 news for 22 zero-news feds (verified / evergreen) | **Agent** |
| 15 | **P1** | Separate staging Hyperdrive config | **Human** |
| 16 | **P1** | Cookie / essential-storage disclosure pass (legal honesty) | **Agent** + Human legal |
| 17 | **P2** | Real crests for remaining 28 sport-mark federations | **Human** / Content |
| 18 | **P2** | Event/club geodata + Map lat/lng (national map claim) | **Agent** + Content |
| 19 | **P2** | SSR / edge HTML meta for AIO scrapers | **Agent** |
| 20 | **P2** | Expand vitest beyond tenancy/guards; router integration smoke | **Agent** |

**Already closed mid-wave (do not re-open as P0):** upload entity-ownership IDOR (A1), news `safeHttpsHref` (A2), aggregator SSRF allowlist (A3), `/athletes/:slug` Worker SPA fetch, PWA `/api` navigateFallback denylist, Builds `ci:gate`.

---

## 7. What’s improved since prior ~74–85 scorecards

| Era | Score | Decision |
|-----|------:|----------|
| 2026-07-21 morning FULL_GAP | ~70 | Soft beta after rotation |
| 2026-07-21 PUBLIC_READY | **65** | Full public NO-GO |
| 2026-07-24 GO_LIVE raises | **74 → 83 → 84 → 85** | CONDITIONAL; ops ≤52 |
| **2026-07-25 this synthesis** | Soft **84** / Full **76** / Weighted **~83** | **CONDITIONAL**; soft GO after rotation |

### Closed or improved since 85 scorecard

1. **Workers Builds `ci:gate`** — verified live (scorecard still said HUMAN ❌).  
2. **News auto-feed** — aggregator + 6h cron; **147** published (was ~89 editorial).  
3. **Events web batches A/B/C** — published events **291** (was ~270).  
4. **Content Sync AI** + Admin all-federation lists + Add User.  
5. **Light theme chrome** + Map mobile crash harden + Home news ticker.  
6. **SEO athlete crawl** — Worker extension-aware SPA for `/athletes/:slug`.  
7. **Adversarial A1–A3** — upload ownership, news href harden, aggregator SSRF.  
8. **PWA** — `/api` denylist on navigateFallback.  
9. Hollow UX gate + logos 100% remain banked from 2026-07-24.

### Honesty corrections (scores that were too high)

| Prior claim | This wave |
|-------------|-----------|
| Legal **92** | **~68–78** — Privacy/Terms exist; cookie/POPIA/a11y incomplete |
| Frontend **91** | UX deep dive **68**; soft dark-first still shippable |
| Perf/SEO **93** | SEO **65** + Perf **58** — client-meta only, no SSR |
| Soft = full after rotation | Soft **GO**; full still **NO-GO** on content/SEO/map |

### Still not improved (binders)

- Credential rotation + Hyperdrive `postgres` (C1/C2)  
- Raw hollow core-5 **21.7%**  
- Upcoming calendar **~40** with **58** feds empty forward  
- Live **0/0** scheduled/live  
- Map not geocoded national product  

---

## 8. Hide or ship (feature posture)

| Surface | Decision |
|---------|----------|
| Home / Events / News / Big-8 feds | **SHIP** soft after rotation |
| Live nav | **HIDE** unless inventory; route = Recent Coverage |
| WhatsApp UI + API | **HIDE** (API hard-disabled) |
| AI chat | **HIDE** (`VITE_SHOW_AI_CHAT` unset) |
| Google auth | **HIDE** |
| Content Sync / news aggregator | **SHIP** staff / pipeline (drafts + trusted auto-publish) |
| Map | **SHIP soft** as regional browser — do not market geocoded national map |
| Light theme | **SHIP chrome**; do not market as finished |
| `club_manager` | **HIDE** from marketing |

---

## 9. Related artifacts

- Wave slices: [`docs/research/gap_wave_20260725/`](./gap_wave_20260725/)  
- Scorecard (updated this wave): [`PRODUCTION_GO_LIVE_SCORECARD.md`](./PRODUCTION_GO_LIVE_SCORECARD.md)  
- Rotation: [`SECURITY_CREDENTIAL_ROTATION.md`](./SECURITY_CREDENTIAL_ROTATION.md)  
- Superseded for go/no-go: [`PUBLIC_READY_GAP_ANALYSIS.md`](./PUBLIC_READY_GAP_ANALYSIS.md) (2026-07-21, score 65)  
- CI: [`docs/CI.md`](../CI.md)

---

*End of Full Gap Analysis 2026-07-25. Verdict: **CONDITIONAL** — soft public **84** (GO after human rotation); full national **76** (**NO-GO**). Ops hard-cap **≤52** until H1–H6.*
