# Production Go-Live Scorecard — sports.com.na

**Orchestrator:** PRODUCTION ORCHESTRATOR (score raise pass)  
**Date:** 2026-07-24 ~20:15 CAT  
**HEAD assessed:** `main` @ agent go-live raise + sibling Medium/SEO/crest passes  
**Bar:** **FULL PUBLIC** national launch (same bar as `PUBLIC_READY_GAP_ANALYSIS.md`)  
**Sources:** prior scorecard (74), `PRODUCTION_SECURITY_AUDIT.md`, `SECURITY_CREDENTIAL_ROTATION.md`, `FEDERATION_PHOTOS_COVERAGE.md`, live SQL + code spot-check.

**DB mutations this scorecard:** crest/sport-mark logo fill already applied live (`20260724120000_federations_sport_marks_coverage.sql` — ledger in repo). No new DDL this pass.

---

## 1. Executive verdict

| Metric | Value |
|--------|------:|
| **FULL PUBLIC launch score (code + data bar)** | **84 / 100** |
| **Score if DB password + service_role still unrotated** | **≤52** (hard ops cap — do not ship) |
| **Max after human credential rotation alone** | **~87–88** (soft public **GO**) |
| **Path to ≥90 full public** | Rotation + Hyperdrive app role + Builds `ci:gate` + hollow long-tail ≤15% (see §7) |
| **Go / No-Go** | **CONDITIONAL — NO-GO until human rotation** |
| Soft / invite public (Home + Events + News + Big-8) | **GO after §6 human checklist** |
| Full national marketing launch | **NO-GO** until §7 hollow + ops gates |

### One-line decision

**Agent work maximized the code/data bar to ~84.** Credential rotation still hard-caps live risk at ≤52 and blocks any public GO. After rotation expect **~87–88 soft public GO**; **≥90 full public** needs hollow core fill (or honest long-tail demotion) plus Workers Builds `ci:gate`.

---

## 2. Score bands

| Band | Meaning |
|------|---------|
| 90–100 | National launch — dense coverage, hardened abuse/legal surface |
| **75–89** | **← code bar here (84)** Public OK with known long-tail gaps |
| 60–74 | Soft public / marketing to hubs + Big-8 |
| 40–59 | Invite-only (also the **ops-capped** band while secrets unrotated → **≤52**) |
| &lt;40 | Internal demo |

Delta vs prior scorecard (**74**, 2026-07-23): **+10** from sport-mark logos **83/83** (+ Golf/DSN NNOC crest upgrades), hollow fill (clubs **189** / athletes **193** / news **83**), Medium guards, `club_manager` honesty, soft-public SEO, legal footers, page EBs, Anthropic timeout, media list scope, Live honesty, vitest.

---

## 3. CONDITIONAL — gates

| Condition | Full public | Soft public |
|-----------|:-----------:|:-----------:|
| Rotate Postgres password + `service_role` + Worker secrets | **Blocker** | **Blocker** |
| Point Hyperdrive `dbfcf635…` at `sportsplatform_app` (password set) | **Blocker** | **Blocker** |
| Keep Live nav inventory-gated; WA/AI/Google flags **off** | Required | Required |
| WhatsApp tRPC remains hard-disabled | Required | Required |
| Crests / logos ≥85% active (today **100%** / 83 — **55** crests + **28** sport marks) | **Done** | **Done** |
| Hollow core-5 ≤15% active feds (still elevated; ~16 all-empty / many missing club∨news) | Required | Soft OK if empty states honest |
| Privacy / Terms live + footer links (Home/Events/News/Live/Map) | **Done** | **Done** |
| Workers Builds build command → `npm run ci:gate` | Strongly required | Required within 48h |
| No “live streaming” / “every federation complete” claims | **Done** (meta + Live hero) | Required |

**Soft public GO only if:** human checklist in §6 completed **and** feature flags remain default-off **and** marketing stays Big-8 / directory scoped.

---

## 4. Checklist — completed vs open

### Security

| Item | Status |
|------|--------|
| Federation tenancy `assertSameFederation` + tests | ✅ Done |
| Public athlete/coach/club PII stripped; `includePii` tenant-scoped | ✅ Done |
| Draft/inactive gates (events/news/athletes/coaches/clubs/HP/federations/venues) | ✅ Done |
| WhatsApp API hard-disabled (`WHATSAPP_API_ENABLED=false`) | ✅ Done |
| Rate limits: AI, upload, search | ✅ Done (per-isolate; WAF still open) |
| Worker CSP / security headers / CORS allowlist | ✅ Done |
| Storage MIME + public SELECT on `sportsplatform_*` | ✅ Done |
| Stream / federation / club website https-only | ✅ Done |
| Load-then-assert ownership (events/news/streams/clubs/athletes) | ✅ Done |
| `users.setRole` assignable roles only; `federationId` required for fed admin | ✅ Done |
| `media.list` unscoped dump = platform admin only | ✅ Done |
| Anthropic client `timeout: 30_000` | ✅ Done |
| Scrub secrets from working tree | ✅ Done |
| **Rotate live DB password + service_role** | ❌ **HUMAN** |
| **Hyperdrive on `sportsplatform_app` (not `postgres`)** | ❌ **HUMAN** |
| Global/WAF rate limits | ⬜ Open (P1) |

### CMS

| Item | Status |
|------|--------|
| Platform + Federation Admin CRUD | ✅ Done |
| Loading locks on admin forms (`isPending`) | ✅ Done |
| Page-level error boundaries (Federation + Admin) | ✅ Done |
| ErrorBoundary stack traces DEV-only | ✅ Done |

### SEO / legal / honesty

| Item | Status |
|------|--------|
| Privacy / Terms + Register acceptance | ✅ Done |
| SiteLegalFooter on News / Live / Map (+ Home/Events) | ✅ Done |
| Soft-public meta (no “live streams” / “every sport”) | ✅ Done |
| Live hero VOD-honest when inventory empty | ✅ Done |
| Sitemap hubs + feds; `/live` omitted while VOD-only | ✅ Done |
| Feature flags default off | ✅ Done |

### Data

| Item | Status |
|------|--------|
| Big-8 calendars + logos + clubs + news | ✅ Pass |
| Active federation logos **83/83 (100%)** | ✅ Done (crests + sport marks) |
| Live streams: 0 live / 0 scheduled (4 VOD) | ⚠️ Honest gate |
| Hollow long-tail improved (NIIHA/fistball/cue/NESA fills) but still above 15% incomplete | ❌ Below full-public 15% gate |
| Crest/mark assets under `/logos` + `/logos/marks` | ✅ Deployable with Worker assets |

### Ops

| Item | Status |
|------|--------|
| Cloudflare Worker + Hyperdrive + apex Custom Domain | ✅ Live |
| `sportsplatform_app` role + grants in DB | ✅ Done |
| Hyperdrive origin switched to app role | ❌ **HUMAN** |
| Workers Builds build command = `npm run ci:gate` | ❌ **HUMAN** |
| GitHub Actions `quality-gates` (= `ci:gate`) | ✅ Done |
| Docs aligned to Workers | ✅ Mostly |

---

## 5. Per-domain scores (full public bar)

| Domain | Score | Weight | Notes |
|--------|------:|-------:|-------|
| Features | **86** | 10% | Admin CMS; Live honest; flags off |
| Security | **76** | 18% | App hardened; **creds + Hyperdrive still Critical** |
| RBAC | **92** | 10% | Tenancy + setRole; `club_manager` not assignable |
| Schema | **80** | 8% | A−; index hygiene residual |
| Data | **86** | 12% | Logos 100%; hollow fill +18 clubs/+15 athletes/+news; long-tail still misses 15% gate |
| Flows | **84** | 8% | Empty states + Live error; long-tail hollow OK if honest |
| API | **91** | 8% | Caps; WA off; load-assert; media scope; timeouts; https |
| Frontend | **90** | 8% | SEO honesty; legal footers; page EBs; safeHref |
| Ops | **66** | 6% | Role ready; rotation + Builds `ci:gate` pending |
| Integrations | **66** | 4% | WA/AI/Google off; Anthropic timeout set |
| Legal | **92** | 4% | Privacy/Terms + footers + register |
| Perf / SEO | **93** | 2% | Sitemap + honest meta; `/live` demoted |
| CMS | **93** | 1% | CRUD + loading locks + route EBs |
| Tests | **72** | 1% | federationScope + mediumGuards + features tests |
| **Weighted** | **~84** | 100% | Caps to **≤52** while secrets unrotated |

### Score math (after human rotation — estimate)

| Unlock | Security | Ops | Weighted ≈ |
|--------|---------:|----:|-----------:|
| Rotation + Hyperdrive app role | **94** | **88** | **~87** soft public **GO** |
| + Builds `ci:gate` | 94 | **94** | **~88** |
| + Hollow core-5 ≤15% (or hide empty tabs) | 94 | 94 | **≥90** full public |

---

## 6. Explicit HUMAN steps (credential rotation) — do in order

Agents **cannot** complete these. Full copy-paste checklist: [`SECURITY_CREDENTIAL_ROTATION.md`](./SECURITY_CREDENTIAL_ROTATION.md).

1. **Set password** for DB role `sportsplatform_app` (SQL `ALTER ROLE … PASSWORD` — never commit it).
2. **Update Hyperdrive** id `dbfcf635ad4a475ba991743b94a5d6a2` connection string to `sportsplatform_app` (not `postgres`).
3. **Reset** compromised Supabase **Database password** (`postgres`).
4. **Rotate** `SUPABASE_SERVICE_ROLE_KEY` (consider anon if abused).
5. **`wrangler secret put`** updated keys on Worker `namibia-sports-platform` (+ staging if used).
6. **Smoke:** `federations.list` on `https://sports.com.na` returns data; storage upload still works; old password/key fail.
7. **Workers Builds:** Dashboard → Worker → Settings → Build → Build command = `npm run ci:gate` (see `docs/CI.md`).
8. Confirm prod **VITE_SHOW_*** and `VITE_ENABLE_GOOGLE_AUTH` remain **unset**.

---

## 7. Remaining gaps to ≥90 (ordered)

| # | Gap | Owner | Points unlocked |
|---|-----|-------|-----------------|
| 1 | §6 steps 1–6 (rotation + Hyperdrive) | **HUMAN** | ~+4 (Security/Ops); lifts ops cap |
| 2 | Workers Builds → `npm run ci:gate` | **HUMAN** | ~+1 Ops |
| 3 | Hollow long-tail: cut incomplete core-5 toward ≤15% **or** hide empty federation tabs | Content / Frontend | ~+2–3 Data/Flows |
| 4 | Optional: CF WAF / rate limit on `/api/trpc/*` | **HUMAN** | ~+1 Security |

---

## 8. Agent-fixable shipped this raise (2026-07-24)

1. Soft-public SEO copy (`index.html`, `seo.ts`, `SeoHead` `/live`, Home, Live hero).
2. `club_manager` removed from assignable roles (UI + Zod); docs honesty.
3. Clubs/athletes load-then-assert; club `website` https; `media.list` scoped.
4. Anthropic `timeout: 30_000`.
5. Page EBs (FederationRoute + Admin); ErrorBoundary stack DEV-only.
6. Live `isError` UI; SiteLegalFooter already on News/Live/Map (sibling).
7. Crest/sport-mark coverage **83/83** (sibling migration + assets — credited in Data score).
8. Medium guards + features vitest (sibling); scorecard ownership this pass.

---

## 9. Related artifacts

- `docs/research/PUBLIC_READY_GAP_ANALYSIS.md` — prior **65 / NO-GO**
- `docs/research/PRODUCTION_SECURITY_AUDIT.md` — code Criticals closed; human C1/C2 open
- `docs/research/SECURITY_CREDENTIAL_ROTATION.md` — **do this first**
- `docs/research/FEDERATION_PHOTOS_COVERAGE.md` — logos 83/83 evidence
- `docs/CI.md` — Workers Builds dashboard path
- `client/src/lib/features.ts` — hide/ship flags

---

*End of Production Go-Live Scorecard. Verdict: **CONDITIONAL** — agent bar **84**; soft public after human rotation (**~87–88**); full national **≥90** after rotation + Builds gate + hollow gate.*
