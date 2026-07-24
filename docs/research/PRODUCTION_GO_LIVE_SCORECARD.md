# Production Go-Live Scorecard — sports.com.na

**Orchestrator:** PRODUCTION ORCHESTRATOR (hollow gate + tab honesty pass)  
**Date:** 2026-07-24 ~20:30 CAT  
**HEAD assessed:** `main` @ hollow long-tail fill + public tab hide  
**Bar:** **FULL PUBLIC** national launch (same bar as `PUBLIC_READY_GAP_ANALYSIS.md`)  
**Sources:** prior scorecard (84), live SQL hollow measure, `hollow_longtail_ux_fill_20260724.md`, code spot-check.

**DB mutations this scorecard:** verified hollow fill applied live (`hollow_longtail_verified_fill` — ledger `20260724190000_hollow_longtail_verified_fill.sql`). No DDL.

---

## 1. Executive verdict

| Metric | Value |
|--------|------:|
| **FULL PUBLIC launch score (code + data bar)** | **85 / 100** |
| **Score if DB password + service_role still unrotated** | **≤52** (hard ops cap — do not ship) |
| **Max after human credential rotation alone** | **~89** (soft public **GO**) |
| **Path to ≥90 full public** | Rotation + Hyperdrive app role + Builds `ci:gate` (hollow **experience** gate closed via tab hide) |
| **Go / No-Go** | **CONDITIONAL — NO-GO until human rotation** |
| Soft / invite public (Home + Events + News + Big-8) | **GO after §6 human checklist** |
| Full national marketing launch | **NO-GO** until §6 rotation + Builds `ci:gate` |

### One-line decision

**Agent work closed the hollow long-tail public UX gate** (hide empty Fed tabs) and cut raw core-5 **28.9% → 21.7%** with verified fills. Credential rotation still hard-caps live risk at ≤52. After rotation expect **~89** soft/full-ready; Workers Builds `ci:gate` pushes the weighted total to **≥90**.

---

## 2. Score bands

| Band | Meaning |
|------|---------|
| 90–100 | National launch — dense coverage, hardened abuse/legal surface |
| **75–89** | **← code bar here (85)** Public OK with known long-tail gaps (tabs hidden when empty) |
| 60–74 | Soft public / marketing to hubs + Big-8 |
| 40–59 | Invite-only (also the **ops-capped** band while secrets unrotated → **≤52**) |
| &lt;40 | Internal demo |

Delta vs prior scorecard (**84**, earlier 2026-07-24): **+1** from hollow verified fill (+2 clubs / +5 athletes / +6 news) + public FederationLayout inventory-gated tabs + vitest.

---

## 3. CONDITIONAL — gates

| Condition | Full public | Soft public |
|-----------|:-----------:|:-----------:|
| Rotate Postgres password + `service_role` + Worker secrets | **Blocker** | **Blocker** |
| Point Hyperdrive `dbfcf635…` at `sportsplatform_app` (password set) | **Blocker** | **Blocker** |
| Keep Live nav inventory-gated; WA/AI/Google flags **off** | Required | Required |
| WhatsApp tRPC remains hard-disabled | Required | Required |
| Crests / logos ≥85% active (today **100%** / 83 — **55** crests + **28** sport marks) | **Done** | **Done** |
| Hollow core-5 ≤15% **or** hide empty federation tabs | **Done** (UX hide; raw core-5 **21.7%**) | Soft OK |
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
| Public Fed tabs hide when Clubs/Athletes/News/Streams empty | ✅ Done |

### Data

| Item | Status |
|------|--------|
| Big-8 calendars + logos + clubs + news | ✅ Pass |
| Active federation logos **83/83 (100%)** | ✅ Done (crests + sport marks) |
| Live streams: 0 live / 0 scheduled (4 VOD) | ⚠️ Honest gate |
| Hollow long-tail: core-5 **24 → 18** (28.9% → 21.7%); public empty tabs hidden | ✅ Experience gate |
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
| Features | **87** | 10% | Admin CMS; Live + Fed tab inventory honesty |
| Security | **76** | 18% | App hardened; **creds + Hyperdrive still Critical** |
| RBAC | **92** | 10% | Tenancy + setRole; `club_manager` not assignable |
| Schema | **80** | 8% | A−; index hygiene residual |
| Data | **88** | 12% | Logos 100%; hollow fill; raw core-5 still 21.7% |
| Flows | **90** | 8% | Empty Fed tabs hidden for public; admin preview intact |
| API | **91** | 8% | Caps; WA off; load-assert; media scope; timeouts; https |
| Frontend | **91** | 8% | SEO honesty; legal footers; page EBs; Fed tab gate |
| Ops | **66** | 6% | Role ready; rotation + Builds `ci:gate` pending |
| Integrations | **66** | 4% | WA/AI/Google off; Anthropic timeout set |
| Legal | **92** | 4% | Privacy/Terms + footers + register |
| Perf / SEO | **93** | 2% | Sitemap + honest meta; `/live` demoted |
| CMS | **93** | 1% | CRUD + loading locks + route EBs |
| Tests | **74** | 1% | + federationPublicTabs vitest |
| **Weighted** | **~85** | 100% | Caps to **≤52** while secrets unrotated |

### Score math (after human rotation — estimate)

| Unlock | Security | Ops | Weighted ≈ |
|--------|---------:|----:|-----------:|
| Rotation + Hyperdrive app role | **94** | **88** | **~89** soft public **GO** (hollow UX done) |
| + Builds `ci:gate` | 94 | **94** | **≥90** full public |

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
| 1 | §6 steps 1–6 (rotation + Hyperdrive) | **HUMAN** | ~+3–4 (Security/Ops); lifts ops cap |
| 2 | Workers Builds → `npm run ci:gate` | **HUMAN** | ~+1 Ops (cleans ≥90) |
| 3 | Hollow long-tail experience | **Done** | Tab hide + verified fill (raw % still 21.7%) |
| 4 | Optional: CF WAF / rate limit on `/api/trpc/*` | **HUMAN** | ~+1 Security |
| 5 | Optional: more verified clubs/news toward raw core-5 ≤15% | Content | Polish only |

---

## 8. Agent-fixable shipped this raise (2026-07-24)

1. Soft-public SEO copy (`index.html`, `seo.ts`, `SeoHead` `/live`, Home, Live hero).
2. `club_manager` removed from assignable roles (UI + Zod); docs honesty.
3. Clubs/athletes load-then-assert; club `website` https; `media.list` scoped.
4. Anthropic `timeout: 30_000`.
5. Page EBs (FederationRoute + Admin); ErrorBoundary stack DEV-only.
6. Live `isError` UI; SiteLegalFooter already on News/Live/Map (sibling).
7. Crest/sport-mark coverage **83/83** (sibling migration + assets — credited in Data score).
8. Medium guards + features vitest (sibling); prior scorecard ownership.
9. **Hollow long-tail:** verified fill (SKN/NSHA/NFGF/NMTF/NM/NSB + NIIHA athletes) + **public Fed tab inventory gate** + vitest.

---

## 9. Related artifacts

- `docs/research/PUBLIC_READY_GAP_ANALYSIS.md` — prior **65 / NO-GO**
- `docs/research/PRODUCTION_SECURITY_AUDIT.md` — code Criticals closed; human C1/C2 open
- `docs/research/SECURITY_CREDENTIAL_ROTATION.md` — **do this first**
- `docs/research/FEDERATION_PHOTOS_COVERAGE.md` — logos 83/83 evidence
- `docs/research/hollow_longtail_ux_fill_20260724.md` — hollow before/after + UX
- `docs/CI.md` — Workers Builds dashboard path
- `client/src/lib/features.ts` — hide/ship flags
- `client/src/lib/federationPublicTabs.ts` — Fed public tab inventory gate

---

*End of Production Go-Live Scorecard. Verdict: **CONDITIONAL** — agent bar **85**; after human rotation **~89**; **≥90** with Builds `ci:gate`. Hollow public UX gate **closed**.*
