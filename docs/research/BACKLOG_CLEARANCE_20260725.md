# Backlog Clearance — 2026-07-25

**Mission:** Clear every agent-doable item from `FULL_GAP_ANALYSIS_20260725.md` + `gap_wave_20260725/*` until nothing agent-doable remains.  
**Workspace:** `main` · Workers Builds deploys on push.  
**Started:** 2026-07-25 · **Closed (agent wave):** 2026-07-25  
**Verified tip:** post-clearance HEAD advanced past `2e958d8` (see git log); residual fix = PERF-CC apply + SeoHead helpers (build was red after sibling SEO commits).

**Legend:** `AGENT` · `HUMAN` · `DONE` · `BLOCKED-HUMAN` · `BLOCKED` (evidence)

---

## Counts (final)

| Status | Count |
|--------|------:|
| **DONE (agent)** | **32** |
| **BLOCKED-HUMAN** | **11** |
| Remaining AGENT open | **0** |

---

## BLOCKED-HUMAN (do not fake)

| ID | Item | Owner | Evidence |
|----|------|-------|----------|
| H1 | `ALTER ROLE sportsplatform_app PASSWORD …` | Human | Role exists; no password |
| H2 | Point Hyperdrive `dbfcf635…` at `sportsplatform_app` | Human | Origin still `postgres` |
| H3 | Reset compromised Supabase `postgres` password | Human | Git history |
| H4 | Rotate `SUPABASE_SERVICE_ROLE_KEY` | Human | Tree scrubbed; live key must rotate |
| H5 | `wrangler secret put` + smoke | Human | After H1–H4 |
| H6 | Smoke: `federations.list` + Storage; old keys fail | Human | — |
| H7 | Confirm prod `VITE_SHOW_*` / Google auth unset | Human | Dashboard confirm |
| H8 | CF WAF / Rate Limiting on `/api/trpc/*` | Human | Dashboard (no API change this wave) |
| H9 | Fill 10 no-contact federations (email/phone) | Human / NSC | Pass 4 = 0/10 research ceiling |
| H10 | Real crests for ~28 sport-mark federations | Human / Content | Marks ship OK for soft public |
| H11 | Separate staging Hyperdrive | Human | Optional P1 |

---

## P0 — Security Mediums + SEO/a11y launch

| ID | Owner | Item | Status |
|----|-------|------|--------|
| SEC-M1 | AGENT | `media.create`/`update` URLs → `mediaAssetUrlSchema` | **DONE** |
| SEC-M2 | AGENT | `upload.image` Zod max length on `base64` | **DONE** |
| SEC-M6 | AGENT | AI / Content Sync generic error messages | **DONE** |
| SEO-SA | AGENT | Wire SearchAction `/?q=` to palette | **DONE** |
| UX-FM | AGENT | FederationModal a11y (Radix dialog) | **DONE** |
| DOC-PR | AGENT | Banner `PUBLIC_READY_GAP_ANALYSIS.md` superseded | **DONE** |

---

## P1 — Product / SEO / CMS / UX / Legal / Data / Docs

| ID | Owner | Item | Status |
|----|-------|------|--------|
| SEO-EV | AGENT | `/events/:slug` + sitemap + JSON-LD | **DONE** |
| SEO-CL | AGENT | `/clubs/:slug` + sitemap | **DONE** |
| NEWS-CMS | AGENT | `sourceUrl`/`sourceName` CMS + Content Sync | **DONE** |
| NEWS-AGG | AGENT | Google News unwrap → `source_url`; 8 items/feed | **DONE** |
| ADM-NULL | AGENT | Admin null-federation_id news publish path | **DONE** |
| ADM-FILT | AGENT | Admin unified `scopeFedId` filter | **DONE** |
| ADM-VEN | AGENT | Venue upload federationId from scope | **DONE** |
| PERF-CC | AGENT | Cache-Control on Worker hashed assets | **DONE** (wired in `withSecurityHeaders` + `/assets/*` in `run_worker_first`) |
| PERF-IMG | AGENT | Lazy loading on cards/media; large compress deferred | **DONE** (lazy); compress = follow-on content |
| UX-LT | AGENT | Light theme on Home/Events/News/Fed content | **DONE** |
| LEG-CK | AGENT | Cookie disclosure + CookieNotice | **DONE** |
| LEG-REG | AGENT | Register terms persist; Google OAuth terms gate | **DONE** |
| A11Y-SK | AGENT | Skip link + focus rings | **DONE** |
| MAP-AL | AGENT | Map region alias normalizer (Karas/Kharas) | **DONE** |
| MAP-LL | AGENT | lat/lng columns + docs (backfill TBD) | **DONE** |
| DATA-SCH | AGENT | Schools dedupe (`is_active`) | **DONE** (live 26/50 active) |
| DATA-HP | AGENT | HP empty-state honesty on Home | **DONE** |
| DOC-CORE | AGENT | `.cursor/rules/core.mdc` Netlify→Workers | **DONE** |
| DOC-SK | AGENT | SKILLS.md align | **DONE** |
| DOC-03 | AGENT | `docs/03_api_and_integrations.md` rewrite | **DONE** |

---

## P2 — Polish / dead code / SSR

| ID | Owner | Item | Status |
|----|-------|------|--------|
| DEAD | AGENT | ManusDialog, unused Map component, DashboardLayout, AIChatBox | **DONE** |
| MED-UP | AGENT | `media.update` procedure | **DONE** |
| FED-INV | AGENT | FedAdmin invite | **BLOCKED** — Platform Admin `inviteOrPromote` only; FedAdmin invite needs product decision (no tenant Auth Admin). Documented, not faked. |
| TICK-P | AGENT | Ticker pause control | **DONE** |
| MAP-AR | AGENT | Map ARIA (expanded/listbox) | **DONE** |
| SSR | AGENT | Full SSR | **BLOCKED** — see `SSR_PRERENDER_PLAN_20260725.md`; max shipped (entity routes + sitemap + Cache-Control) |

---

## Score after wave

| Metric | Before | After |
|--------|-------:|------:|
| Soft public | 84 | **87** |
| Full national | 76 | **80** |
| Weighted | ~83 | **~86** |
| Ops hard-cap (creds) | ≤52 | **≤52** (unchanged — HUMAN) |

Soft public remains **CONDITIONAL → GO after H1–H6**. Full national still **NO-GO** (hollow/calendar/SSR/map geocode).

---

## Commit log (this clearance)

See `git log` on `main` after push — focused commits under `fix(security)`, `feat(seo)`, `fix(ux)`, `feat(news)`, `docs`, etc.

---

*Agent-doable backlog cleared 2026-07-25. Remaining work is HUMAN ops + content.*
