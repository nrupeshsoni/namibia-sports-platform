# Production Go-Live Scorecard — sports.com.na

**Orchestrator:** PRODUCTION ORCHESTRATOR  
**Date:** 2026-07-23 ~22:20 CAT  
**HEAD assessed:** `main` @ latest pull + orchestrator residual fixes (venues active gate, federation https URLs, sitemap hubs)  
**Bar:** **FULL PUBLIC** national launch (same bar as `PUBLIC_READY_GAP_ANALYSIS.md`)  
**Sources:** gap analysis (Agent 15), `PRODUCTION_SECURITY_AUDIT.md`, `SECURITY_CREDENTIAL_ROTATION.md`, sibling merges on `main` (PR #2 + security/CMS/SEO/legal polish), live code spot-check.

**DB mutations this scorecard:** none (orchestrator code-only leftovers below).

---

## 1. Executive verdict

| Metric | Value |
|--------|------:|
| **FULL PUBLIC launch score** | **74 / 100** |
| **Score if DB password + service_role still unrotated** | **≤52** (hard ops cap) |
| **Go / No-Go** | **CONDITIONAL** |
| Soft / invite public (Home + Events + News + Big-8) | **GO after human credential rotation** |
| Full national marketing launch (“every federation / live streaming”) | **NO-GO** until rotation + crest/hollow gates |

### One-line decision

**Ship soft public** once a human finishes credential rotation and Hyperdrive switches to `sportsplatform_app`; keep Live / WhatsApp / AI / Google flags off; do **not** announce a complete national launch until crests and hollow long-tail improve.

---

## 2. Score bands

| Band | Meaning |
|------|---------|
| 90–100 | National launch — dense coverage, hardened abuse/legal surface |
| 75–89 | Public OK with known long-tail gaps |
| **60–74** | **← here (74)** Soft public / marketing to hubs + Big-8 |
| 40–59 | Invite-only (also the **ops-capped** band while secrets unrotated) |
| &lt;40 | Internal demo |

Delta vs Agent 15 (**65 / NO-GO**, 2026-07-21): **+9** from Privacy/Terms, SEO head + federation sitemap, WhatsApp API hard-off, list caps, rate limits/CORS/storage, Admin CMS, hollow/NBF fills, `sportsplatform_app` role created. Residual drag: **unrotated secrets**, Hyperdrive still on `postgres`, crest ~64%, hollow core-5 still high, Live inventory empty.

---

## 3. CONDITIONAL — gates

| Condition | Full public | Soft public |
|-----------|:-----------:|:-----------:|
| Rotate Postgres password + `service_role` + Worker secrets | **Blocker** | **Blocker** |
| Point Hyperdrive `dbfcf635…` at `sportsplatform_app` (password set) | **Blocker** | **Blocker** |
| Keep Live nav inventory-gated; WA/AI/Google flags **off** | Required | Required |
| WhatsApp tRPC remains hard-disabled | Required | Required |
| Crests ≥85% active (today ~**64%** / ~30 null) | Required | Soft OK |
| Hollow core-5 ≤15% active feds (improved but still high) | Required | Soft OK if empty states honest |
| Privacy / Terms live + footer links | **Done** | **Done** |
| Workers Builds build command → `npm run ci:gate` | Strongly required | Required within 48h |
| No “live streaming” / “every federation complete” claims | Required | Required |

**Soft public GO only if:** human checklist in §6 completed **and** feature flags remain default-off **and** marketing stays Big-8 / directory scoped.

---

## 4. Checklist — completed vs open

### Security

| Item | Status |
|------|--------|
| Federation tenancy `assertSameFederation` + tests | ✅ Done |
| Public athlete/coach PII stripped; `includePii` tenant-scoped | ✅ Done |
| Draft/inactive gates (events/news/athletes/coaches/clubs/HP/federations) | ✅ Done |
| WhatsApp API hard-disabled (`WHATSAPP_API_ENABLED=false`) | ✅ Done |
| Rate limits: AI, upload, search | ✅ Done (per-isolate; WAF still open) |
| Worker CSP / security headers / CORS allowlist | ✅ Done |
| Storage MIME + public SELECT on `sportsplatform_*` | ✅ Done |
| Stream URLs https-only | ✅ Done |
| Venues public list/get active-only | ✅ Done (orchestrator 2026-07-23) |
| Federation website/social https on create/update | ✅ Done (orchestrator 2026-07-23) |
| Scrub secrets from working tree | ✅ Done |
| **Rotate live DB password + service_role** | ❌ **HUMAN** |
| **Hyperdrive on `sportsplatform_app` (not `postgres`)** | ❌ **HUMAN** (role exists; password + config pending) |
| Global/WAF rate limits | ⬜ Open (P1) |

### CMS

| Item | Status |
|------|--------|
| Platform Admin CRUD (federations, clubs, athletes, news, streams, venues, schools, media, HP, users/roles) | ✅ Done |
| Federation Admin scoped CRUD + media/coaches/HP | ✅ Done |
| Image upload tenant-scoped | ✅ Done |
| Admin CMS RBAC spot-audit clean | ✅ Done (see security audit follow-up) |
| Loading locks / page-level error boundaries | ⬜ Open (P1 UX) |

### SEO / legal / honesty

| Item | Status |
|------|--------|
| `/privacy` + `/terms` + Register acceptance | ✅ Done |
| Home / Events footer legal links | ✅ Done |
| `SeoHead` + JSON-LD (routes + federations/news/athletes) | ✅ Done |
| Sitemap: hubs + 83 feds + news + athletes | ✅ Done |
| Sitemap: `/privacy` + `/terms`; `/live` omitted while VOD-only | ✅ Done (orchestrator) |
| Live nav inventory-gated; WA/AI/Google flags default off | ✅ Done |
| News page footer legal links | ⬜ Minor polish |

### Data

| Item | Status |
|------|--------|
| Big-8 calendars + logos + clubs + news | ✅ Pass |
| NBF athletes filled (was 0) | ✅ Done |
| Hollow fills (athletes/clubs/news migrations) | ✅ Partial |
| Upcoming events / published news depth | ✅ Soft OK |
| Live streams: 0 live / 0 scheduled (VOD only) | ⚠️ Honest gate required |
| Active federation logos ~64% (~30 null) | ❌ Below 85% full-public gate |
| Hollow core-5 still elevated | ❌ Below 15% full-public gate |
| Crest batch: Golf / Karate / Badminton / PWFN + umbrellas | ⬜ Content |

### Ops

| Item | Status |
|------|--------|
| Cloudflare Worker + Hyperdrive + apex Custom Domain | ✅ Live |
| `sportsplatform_app` role + grants in DB | ✅ Done |
| Hyperdrive origin switched to app role | ❌ **HUMAN** |
| Workers Builds build command = `npm run ci:gate` | ❌ **HUMAN** (still `npm run build` as of 2026-07-23) |
| Docs aligned to Workers (CI authoritative) | ✅ Mostly |
| Shared multi-app Supabase project risk | ⚠️ Accepted; least-privilege Hyperdrive mitigates |

---

## 5. Per-domain scores (full public bar)

| Domain | Score | Weight | Notes |
|--------|------:|-------:|-------|
| Features | **82** | 10% | Admin CMS real; Live thin; flags honest |
| Security | **70** | 18% | App hardened; **creds + Hyperdrive still Critical** |
| RBAC | **85** | 10% | Tenancy + users.setRole; club_manager unused |
| Schema | **78** | 8% | Unchanged A− / index hygiene residual |
| Data | **68** | 12% | NBF + hollow fills; crests / hollow gates miss |
| Flows | **76** | 8% | Home/Events/News/Big-8; long-tail empty states |
| API | **84** | 8% | List caps; WA off; venues active; https URLs |
| Frontend | **78** | 8% | SEO head; legal; lazy routes; EB gaps |
| Ops | **60** | 6% | Role ready; rotation + Builds gate pending |
| Integrations | **58** | 4% | WA/AI/Google correctly off |
| Legal | **82** | 4% | Privacy/Terms + register gate |
| Perf / SEO | **86** | 2% | Full sitemap + SeoHead; `/live` demoted |
| CMS | **88** | 1% | Platform + Fed Admin CRUD |
| Tests | **55** | 1% | federationScope expanded; still thin E2E |
| **Weighted** | **~74** | 100% | Caps to **≤52** while secrets unrotated |

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

## 7. What siblings shipped (since gap analysis)

| Area | Evidence on `main` |
|------|--------------------|
| Legal | Privacy/Terms pages, register checkbox, footer links |
| SEO | `SeoHead`, JSON-LD, generate-sitemap + slug JSON, federation/news/athlete URLs |
| Security | WhatsApp hard-off, rate limits, CORS, storage policies, PII tenant scope, HP/federation inactive gates, https stream URLs, `sportsplatform_app` role |
| API | Default list limits 50/200 |
| Data | NBF athletes, hollow fills, sitemap polish |
| CMS | Full Platform + Federation Admin CRUD + users roles |
| Docs | `PRODUCTION_SECURITY_AUDIT.md`, rotation checklist, CI Builds path |

### Orchestrator residual code (this pass)

1. `venues.list` / `getById` — public active-only (admin `includeInactive`).  
2. Federation `website` / social fields — https-only on create/update (`server/_core/httpsUrl.ts`).  
3. Sitemap hubs — add `/privacy` + `/terms`; omit `/live` while VOD-only.

---

## 8. 24-hour action plan (leftover code + ops)

| Window | Action | Owner | Done when |
|--------|--------|-------|-----------|
| 0–2h | **Human:** §6 steps 1–6 (rotation + Hyperdrive + smoke) | Infra | Prod tRPC OK; old secrets dead |
| 0–2h | **Human:** Workers Builds → `npm run ci:gate` | Infra | Next push runs full gate |
| 2–6h | Confirm flags off in Builds env; smoke Home/Events/News/3 Big-8/login/admin deny | QA | Checklist green |
| 2–6h | Crest batch priority: NAGU, NKF, BFN, DSN, NSRF, TKD, UFN, PWFN + NNSSU/NUFS/TISAN | Content | Logos ≥73% (≥61/83) |
| 6–12h | News/Live footer Privacy/Terms parity; federation `http://` legacy URL client harden (optional) | Frontend | Consistent legal crawl |
| 6–12h | Soft-public copy pass: no “live” / “complete national” claims | Product | Messaging honest |
| 12–24h | WAF / CF rate limit on `/api/trpc/*` (M1) | Infra | Multi-isolate abuse reduced |
| 12–24h | Decision gate: soft public **GO** only if §6 closed; else stay invite-only | Product | Written call |

---

## 9. Related artifacts

- `docs/research/PUBLIC_READY_GAP_ANALYSIS.md` — prior **65 / NO-GO**
- `docs/research/PRODUCTION_SECURITY_AUDIT.md` — code Criticals closed; human C1/C2 open
- `docs/research/SECURITY_CREDENTIAL_ROTATION.md` — **do this first**
- `docs/CI.md` — Workers Builds dashboard path
- `client/src/lib/features.ts` — hide/ship flags

---

*End of Production Go-Live Scorecard. Verdict: **CONDITIONAL** — soft public after human rotation; full national still NO-GO.*
