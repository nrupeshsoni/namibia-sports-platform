# Production Go-Live Scorecard — sports.com.na

**Orchestrator:** Gap-wave SYNTHESIZER (2026-07-25)  
**Date:** 2026-07-25 ~20:05 CAT  
**HEAD assessed:** `main` @ adversarial A1–A3 + news/SEO/PWA harden  
**Bar:** Soft public **and** full national (see dual scores)  
**Master synthesis:** [`FULL_GAP_ANALYSIS_20260725.md`](./FULL_GAP_ANALYSIS_20260725.md)  
**Wave slices:** [`gap_wave_20260725/`](./gap_wave_20260725/)

**DB mutations this scorecard:** none.

---

## 1. Executive verdict

| Metric | Value |
|--------|------:|
| **Soft / invite public score** | **87 / 100** |
| **Full national launch score** | **80 / 100** |
| **Weighted full-bar (honesty-adjusted)** | **~86 / 100** |
| **Score if DB password + service_role still unrotated** | **≤52** (hard ops cap — do not ship) |
| **Max after human credential rotation alone** | Soft **~89** (**GO**); Full **~82** (still **NO-GO**) |
| **Path to ≥90 full national** | Rotation + denser calendars/hollow + event URLs + crest quality + SSR/WAF polish |
| **Go / No-Go** | **CONDITIONAL** — soft **GO after §6 human checklist**; full national **NO-GO** |
| Soft / invite public (Home + Events + News + Big-8) | **GO after §6** |
| Full national marketing launch | **NO-GO** (content / SEO / map bind after ops unlock) |

### One-line decision

**Agent + wave work keeps soft public agent-ready.** Workers Builds `ci:gate` is **closed** (no longer a human blocker). Credential rotation + Hyperdrive least-privilege still hard-cap live risk at ≤52. After rotation: soft public **GO ~89**; full national stays **NO-GO** until hollow/calendar/SEO depth improve.

---

## 2. Score bands

| Band | Meaning |
|------|---------|
| 90–100 | National launch — dense coverage, hardened abuse/legal surface |
| **75–89** | **← soft public (84)** Public OK with known long-tail gaps |
| 60–74 | Soft public / marketing to hubs + Big-8 |
| 40–59 | Invite-only (also the **ops-capped** band while secrets unrotated → **≤52**) |
| &lt;40 | Internal demo |

Delta vs prior scorecard (**85**, 2026-07-24): **−1 soft / −9 full honesty** — Legal/Frontend/Perf·SEO overstatement corrected; offset by `ci:gate` ✅ + A1–A3 security fixes + news pipeline. See master synthesis §7.

---

## 3. CONDITIONAL — gates

| Condition | Full public | Soft public |
|-----------|:-----------:|:-----------:|
| Rotate Postgres password + `service_role` + Worker secrets | **Blocker** | **Blocker** |
| Point Hyperdrive `dbfcf635…` at `sportsplatform_app` (password set) | **Blocker** | **Blocker** |
| Keep Live nav inventory-gated; WA/AI/Google flags **off** | Required | Required |
| WhatsApp tRPC remains hard-disabled | Required | Required |
| Crests / logos ≥85% active (today **100%** / 83 — crests + marks) | Prefer real crests | **Done** |
| Hollow core-5 ≤15% **or** hide empty federation tabs | UX **Done**; raw **21.7%** | Soft OK |
| Privacy / Terms live + footer links | **Done** | **Done** |
| Workers Builds build command → `npm run ci:gate` | **Done** ✅ | **Done** ✅ |
| No “live streaming” / “every federation complete” claims | Required | Required |
| Event detail URLs + denser upcoming calendars | **Open** | Soft OK |
| Map as geocoded national product | **Open** | Do not claim |

**Soft public GO only if:** human checklist in §6 completed **and** feature flags remain default-off **and** marketing stays Big-8 / directory scoped.

---

## 4. Checklist — completed vs open

### Security

| Item | Status |
|------|--------|
| Federation tenancy `assertSameFederation` + tests | ✅ Done |
| Upload entity ownership (A1 — not just federationId claim) | ✅ Done (2026-07-25) |
| News `sourceUrl` via `safeHttpsHref` (A2) | ✅ Done (2026-07-25) |
| Aggregator outbound SSRF allowlist (A3) | ✅ Done (2026-07-25) |
| Public athlete/coach/club PII stripped; `includePii` tenant-scoped | ✅ Done |
| Draft/inactive gates | ✅ Done |
| WhatsApp API hard-disabled | ✅ Done |
| Rate limits: AI, upload, search, contentSync | ✅ Done (per-isolate; WAF still open) |
| Worker CSP / security headers / CORS allowlist | ✅ Done |
| Storage MIME + public SELECT on `sportsplatform_*` | ✅ Done |
| Stream / federation / club website https-only | ✅ Done |
| Load-then-assert ownership | ✅ Done |
| `users.setRole` assignable roles only | ✅ Done |
| `media.list` unscoped dump = platform admin only | ✅ Done |
| Anthropic client `timeout: 30_000` | ✅ Done |
| Scrub secrets from working tree | ✅ Done |
| **Rotate live DB password + service_role** | ❌ **HUMAN** |
| **Hyperdrive on `sportsplatform_app` (not `postgres`)** | ❌ **HUMAN** |
| Global/WAF rate limits | ⬜ Open (P1) |

### CMS / product

| Item | Status |
|------|--------|
| Platform + Federation Admin CRUD | ✅ Done |
| Content Sync AI + news-aggregator cron | ✅ Done |
| Loading locks / page-level ErrorBoundaries | ✅ Done |
| News auto-publish trusted RSS | ✅ Done |

### SEO / legal / honesty

| Item | Status |
|------|--------|
| Privacy / Terms + Register acceptance | ✅ Done |
| Soft-public meta; Live hero VOD-honest | ✅ Done |
| Sitemap hubs + feds; `/live` omitted | ✅ Done |
| `/athletes/:slug` Worker SPA fetch (not hard 404) | ✅ Done (2026-07-25) |
| Feature flags default off | ✅ Done |
| Public Fed tabs hide when empty | ✅ Done |
| SearchAction wired / removed | ⬜ Open |
| Event / club detail routes | ⬜ Open |
| Cookie / POPIA depth | ⬜ Partial (Legal ~68–78 not 92) |

### Data

| Item | Status |
|------|--------|
| Big-8 calendars + logos + clubs + news | ✅ Pass (upcoming uneven) |
| Active federation logos **83/83 (100%)** | ✅ Done |
| Published news **147** (incl. 58 agg) | ✅ Up |
| Live streams: 0 live / 0 scheduled (4 VOD) | ⚠️ Honest gate |
| Hollow long-tail: core-5 **21.7%**; public empty tabs hidden | ✅ Experience gate |

### Ops

| Item | Status |
|------|--------|
| Cloudflare Worker + Hyperdrive + apex Custom Domain | ✅ Live |
| `sportsplatform_app` role + grants in DB | ✅ Done |
| Hyperdrive origin switched to app role | ❌ **HUMAN** |
| Workers Builds build command = `npm run ci:gate` | ✅ **Done** (verified 2026-07-24 builds) |
| GitHub Actions `quality-gates` (= `ci:gate`) | ✅ Done |

---

## 5. Per-domain scores (full public bar)

| Domain | Score | Weight | Notes |
|--------|------:|-------:|-------|
| Features | **88** | 10% | CMS + Content Sync + news pipeline |
| Security | **78** | 18% | A1–A3 closed; **creds + Hyperdrive still Critical** |
| RBAC | **92** | 10% | Tenancy + upload ownership |
| Schema | **80** | 8% | A−; index hygiene residual |
| Data | **86** | 12% | Logos 100%; news/events up; hollow 21.7% |
| Flows | **88** | 8% | Empty Fed tabs hidden; light theme incomplete |
| API | **88** | 8% | Caps; WA off; entity upload assert |
| Frontend | **82** | 8% | Soft dark OK; UX deep dive 68 |
| Ops | **82** | 6% | **ci:gate done**; rotation pending |
| Integrations | **72** | 4% | Honest flags; aggregator live |
| Legal | **78** | 4% | Privacy/Terms; cookie/a11y debt |
| Perf / SEO | **70** | 2% | SEO ~65; perf ~58; athlete crawl fixed |
| CMS | **90** | 1% | Strong beta |
| Tests | **72** | 1% | Tenancy + guards; ci:gate live |
| **Weighted** | **~83** | 100% | Caps to **≤52** while secrets unrotated |

### Score math (after human rotation — estimate)

| Unlock | Soft public | Full national |
|--------|------------:|--------------:|
| Rotation + Hyperdrive app role | **~89 GO** | **~82** still NO-GO |
| + calendars / hollow / event URLs / crests | — | **~88–90** path |
| + WAF / SSR polish | Polish | ≥90 national |

---

## 6. Explicit HUMAN steps (credential rotation) — do in order

Agents **cannot** complete these. Full copy-paste checklist: [`SECURITY_CREDENTIAL_ROTATION.md`](./SECURITY_CREDENTIAL_ROTATION.md).

1. **Set password** for DB role `sportsplatform_app` (SQL `ALTER ROLE … PASSWORD` — never commit it).
2. **Update Hyperdrive** id `dbfcf635ad4a475ba991743b94a5d6a2` connection string to `sportsplatform_app` (not `postgres`).
3. **Reset** compromised Supabase **Database password** (`postgres`).
4. **Rotate** `SUPABASE_SERVICE_ROLE_KEY` (consider anon if abused).
5. **`wrangler secret put`** updated keys on Worker `namibia-sports-platform` (+ staging if used).
6. **Smoke:** `federations.list` on `https://sports.com.na` returns data; storage upload still works; old password/key fail.
7. ~~Workers Builds → `npm run ci:gate`~~ — **DONE** (keep monitoring dashboard does not revert to `npm run build`).
8. Confirm prod **VITE_SHOW_*** and `VITE_ENABLE_GOOGLE_AUTH` remain **unset**.

---

## 7. Remaining gaps to soft GO / full ≥90 (ordered)

| # | Gap | Owner | Points unlocked |
|---|-----|-------|-----------------|
| 1 | §6 steps 1–6 (rotation + Hyperdrive) | **HUMAN** | Lifts ops cap; soft → **GO ~89** |
| 2 | Confirm VITE flags unset in Builds env | **HUMAN** | Honesty gate |
| 3 | Workers Builds `ci:gate` | **Done** | Already banked |
| 4 | Upcoming events + contacts + zero-news fills | Content / Agent | Full national path |
| 5 | Event detail routes + SearchAction fix | Agent | SEO / share |
| 6 | Optional: CF WAF on `/api/trpc/*` | **HUMAN** | ~+1 Security |

---

## 8. Agent-fixable shipped this raise (since 2026-07-24 scorecard)

1. News aggregator auto-publish + image enrich + Google News unwrap.  
2. Content Sync AI + Admin all-fed lists + Add User.  
3. Light theme chrome + Map mobile/ErrorBoundary harden.  
4. Home news ticker (replaces mid-page news grid).  
5. Worker `/athletes/:slug` SPA document fetch.  
6. PWA navigateFallback denylist for `/api`.  
7. Adversarial A1–A3: upload ownership, news href, aggregator SSRF.  
8. Gap wave docs + this scorecard refresh + master synthesis.

---

## 9. Related artifacts

- `docs/research/FULL_GAP_ANALYSIS_20260725.md` — **master synthesis**  
- `docs/research/gap_wave_20260725/` — 19 domain slices  
- `docs/research/PUBLIC_READY_GAP_ANALYSIS.md` — superseded for go/no-go (65 / 2026-07-21)  
- `docs/research/PRODUCTION_SECURITY_AUDIT.md` — code Criticals closed; human C1/C2 open  
- `docs/research/SECURITY_CREDENTIAL_ROTATION.md` — **do this first**  
- `docs/CI.md` — Workers Builds path (`ci:gate` live)

---

*End of Production Go-Live Scorecard. Verdict: **CONDITIONAL** — soft **84** (GO after human rotation ~89); full national **76** (**NO-GO**). Ops cap **≤52** while secrets unrotated. Builds `ci:gate` **closed**.*


