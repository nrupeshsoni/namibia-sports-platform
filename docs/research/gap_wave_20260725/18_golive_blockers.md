# 18 — Human ops / go-live blockers

**Wave:** `gap_wave_20260725`  
**Date:** 2026-07-25  
**Bar:** FULL PUBLIC national launch (`sports.com.na`)  
**Sources (read in full):**
- [`docs/research/SECURITY_CREDENTIAL_ROTATION.md`](../SECURITY_CREDENTIAL_ROTATION.md)
- [`docs/research/PRODUCTION_GO_LIVE_SCORECARD.md`](../PRODUCTION_GO_LIVE_SCORECARD.md) (2026-07-24, score **85**, CONDITIONAL)
- [`docs/research/PRODUCTION_SECURITY_AUDIT.md`](../PRODUCTION_SECURITY_AUDIT.md) (C1/C2 open)
- Cross-check: `docs/CI.md`, `docs/06_tasks.md`, `docs/architecture/RLS_POLICIES.md` (gap **B1**)

**Live re-verify (this wave):**
| Check | Result | Meaning |
|-------|--------|---------|
| `sportsplatform_app.has_password` | **`false`** | Role exists; cannot authenticate |
| Hyperdrive `dbfcf635…` origin user | **`postgres`** | Still superuser-class (`rolbypassrls`) |
| Latest Workers Build command | **`npm run ci:gate`** | Builds gate **closed** (was open on 2026-07-24 scorecard) |

---

## 1. Executive verdict

| Question | Answer |
|----------|--------|
| **Ship full public national launch now?** | **NO-GO** |
| **Ship soft / invite public (Home + Events + News + Big-8)?** | **NO-GO until §2 hard blockers** (creds + Hyperdrive) |
| **Code / agent security bar** | **Cleared** for prior Critical *application* findings (tenancy, WA hard-off, PII, drafts, Storage MIME, https URLs) |
| **Ops / credential bar** | **Open Critical** — leaked secrets still live; Hyperdrive still on `postgres` |
| **Scorecard carry-forward** | Code bar **~85**; **ops-capped ≤52** while C1/C2 open; after §2 expect **~89–90+** (Builds `ci:gate` already done) |

**One line:** Agents finished the application harden + hollow UX gate; the only remaining **hard** go-live blockers are **human dashboard actions** (password + Hyperdrive + rotate + Worker secrets). Builds `ci:gate` is no longer a blocker.

---

## 2. Hard blockers — HUMAN ONLY (must complete before any public GO)

Ordered exactly as `SECURITY_CREDENTIAL_ROTATION.md` / scorecard §6. Agents **cannot** complete these without pasting secrets into chat/git.

| # | Blocker | Owner | Live status 2026-07-25 | Why human-only | Done when |
|---|---------|-------|------------------------|----------------|-----------|
| **H1** | Set password for DB role `sportsplatform_app` | Human (Supabase SQL) | Role exists (`LOGIN`, `rolsuper=false`, `rolbypassrls=false`); **`has_password=false`** | Requires secret password generation + `ALTER ROLE … PASSWORD` in SQL Editor; must never enter agent context | `SELECT … has_password` → true; login attrs unchanged |
| **H2** | Point Hyperdrive `dbfcf635ad4a475ba991743b94a5d6a2` at `sportsplatform_app` (not `postgres`) | Human (CF Dashboard or local `wrangler hyperdrive update`) | Origin **`user: postgres`**, host `db.rbibqjgsnrueubrvyqps.supabase.co:5432` | Connection string contains the role password | Hyperdrive origin user = `sportsplatform_app`; tRPC still 200 |
| **H3** | Reset compromised Supabase **Database password** (`postgres`) | Human (Supabase → Database password) | Treat as **still compromised** (git history); Hyperdrive still uses `postgres` so reset must be sequenced with H2 | Dashboard-only; old value in public history | Old password fails; local/CI migration tools updated |
| **H4** | Rotate `SUPABASE_SERVICE_ROLE_KEY` (consider anon if abused) | Human (Supabase → API) | Tree scrubbed; history dirty; live key unknown to agents | Dashboard regenerate; never commit JWT | Old JWT fails Storage; new key only in secrets manager |
| **H5** | `wrangler secret put` updated keys on Worker `namibia-sports-platform` (+ staging if used) + redeploy if needed | Human (Wrangler / CF) | Secrets not readable via MCP | Runtime secrets; must not paste into PRs/chat | Storage upload works; federations list 200 |
| **H6** | Smoke: `federations.list` on `https://sports.com.na`; Storage upload; old password/key fail | Human (QA) | Not re-run this wave post-rotation (rotation unfinished) | Confirms H1–H5 did not break prod | Checklist green |
| **H7** | Confirm prod `VITE_SHOW_*` + `VITE_ENABLE_GOOGLE_AUTH` remain **unset** | Human (CF Builds env) | Defaults off in code (`client/src/lib/features.ts`); dashboard env not agent-editable here | Build-time flags live in Workers Builds / deploy env | Flags unset; Live/WA/AI/Google stay gated |

**Canonical checklist:** [`SECURITY_CREDENTIAL_ROTATION.md`](../SECURITY_CREDENTIAL_ROTATION.md) §§ A–F.

### Soft vs full public (after H1–H7)

| Launch type | After H1–H7 | Still required |
|-------------|-------------|----------------|
| Soft / invite (Home, Events, News, Big-8; long-tail tabs hide empty) | **GO** | Keep WA/AI/Google flags off; no “live streaming / every federation complete” claims |
| Full national marketing | **GO** (Builds `ci:gate` already satisfied) | Same honesty gates; optional WAF (P1) |

---

## 3. Formerly human — now CLOSED (re-verified)

| Item | Scorecard (2026-07-24) | This wave |
|------|------------------------|-----------|
| Workers Builds build command → `npm run ci:gate` | ❌ HUMAN | ✅ **Done** — latest successful build `0ef69976…` (2026-07-24) used `npm run ci:gate` → `npx wrangler deploy` |
| `sportsplatform_app` role + grants on `sportsplatform_*` | ✅ Done | ✅ Confirmed (role present; no password) |
| GitHub Actions `quality-gates` (= `ci:gate`) | ✅ Done | ✅ Unchanged |
| Hollow public UX (hide empty Fed tabs) + verified fill | ✅ Done | ✅ Agent-closed experience gate (raw core-5 still ~21.7%) |
| Logos / crests+marks 83/83 | ✅ Done | ✅ |
| Privacy / Terms + footers + Register acceptance | ✅ Done | ✅ |
| Application Criticals from security audit (H1–H8 in audit doc) | ✅ Fixed in code | ✅ |

---

## 4. Agent-fixable vs human — remaining non-hard items

### 4a. Agent-fixable (code / docs / content — not go-live hard blockers)

| ID | Item | Severity | Notes |
|----|------|----------|-------|
| A1 | Keep new federation-scoped mutations on `assertSameFederation` + `federationScope.test.ts` case | Ongoing | Sole tenancy boundary until Hyperdrive least-privilege lands |
| A2 | After humans add new `sportsplatform_*` tables — re-run grant loop for `sportsplatform_app` | Ops follow-up | Documented in rotation §G; agents can draft SQL, not set password |
| A3 | CSP `'unsafe-inline'` (audit M2) | Medium / later | Nonces / strict-dynamic if bundle allows |
| A4 | Optional: further hollow core-5 toward ≤15% with verified clubs/news | Content polish | UX gate already closed via tab hide |
| A5 | Doc drift after rotation: mark C1/C2 closed in audit, scorecard, `RLS_POLICIES.md` B1, `06_tasks.md`, CHANGELOG | Docs | **Only after** H1–H6 proven |
| A6 | `.env.example` completeness check (`06_tasks.md` open) | Low | No secrets; placeholders only |
| A7 | Staging Hyperdrive id separate from prod (rotation optional hardening) | Ops polish | Today staging reuses `dbfcf635…` — human creates second config; agent can wire `wrangler.jsonc` env once id exists |

### 4b. Human / infra — recommended but not hard GO blockers

| ID | Item | Severity | Owner | Why not agent |
|----|------|----------|-------|---------------|
| P1 | Cloudflare WAF / Rate Limiting on `/api/trpc/*` (audit M1) | P1 | Human (CF) | Per-isolate rate limit already in Worker; global needs dashboard / binding |
| P2 | Separate staging Hyperdrive config | P2 | Human | New Hyperdrive resource + secrets |
| P3 | Supabase leaked-password / audit alerts | P2 | Human | Project settings |
| P4 | History rewrite for leaked secrets | Optional / costly | Human | Public history → assume forever leaked; **rotation is the real fix** |
| P5 | Org hygiene on shared DB (~737 tables) / other products’ Storage policies (audit M6) | Org | Human | Out of sportsplatform code scope |
| P6 | Enable Google OAuth on shared Supabase project | Product decision | Human | Keep `VITE_ENABLE_GOOGLE_AUTH` unset until then |
| P7 | Set `ANTHROPIC_API_KEY` Worker secret if AI chat ever ships | Product | Human | Widget stays behind flag; unset key → 500 if enabled |

### 4c. Explicitly NOT agent-fixable (do not attempt)

- Setting or rotating live DB passwords / `service_role` / anon via automation that would print secrets into transcripts
- Committing real connection strings or JWTs to `wrangler.jsonc`, markdown, or scripts
- Restoring `drizzle-kit push` / unscoped DDL on the shared project
- Switching Worker to `service_role` for “RLS bypass fix” (wrong remedy — see `RLS_POLICIES.md`)

---

## 5. Map to prior audit IDs

| Audit / gap ID | Finding | Status |
|----------------|---------|--------|
| **C1** (security audit) | Postgres password + `service_role` in git history | **OPEN — HUMAN** (H3–H5) |
| **C2** / **B1** (audit + RLS doc) | Hyperdrive origin `postgres` (`rolbypassrls`) | **OPEN — HUMAN** (H1–H2); role pre-created by agent |
| Scorecard §6.1–6.6 | Rotation + Hyperdrive + smoke | **OPEN — HUMAN** |
| Scorecard §6.7 Builds `ci:gate` | Dashboard build command | **CLOSED** (live build uses `ci:gate`) |
| Scorecard §6.8 feature flags | Prod VITE flags unset | **CONFIRM — HUMAN** (H7); code defaults safe |
| Audit H1–H8 | WA, PII, drafts, Storage, https URLs, AI auth, tenancy | **CLOSED — AGENT** (code) |
| Audit M1 | Global/WAF rate limits | **OPEN — HUMAN P1** (not hard GO) |
| Audit M2 | CSP unsafe-inline | **OPEN — AGENT later** |

---

## 6. Ordered human runbook (copy — do not paste secrets here)

1. Generate strong password (password manager) for `sportsplatform_app`.
2. Supabase SQL Editor → `ALTER ROLE sportsplatform_app PASSWORD '…';` (never commit).
3. Cloudflare Hyperdrive `dbfcf635ad4a475ba991743b94a5d6a2` → origin  
   `postgresql://sportsplatform_app:<URL_ENCODED>@db.rbibqjgsnrueubrvyqps.supabase.co:5432/postgres`.
4. Supabase → Reset **Database password** (`postgres`); update any local/CI migration URLs.
5. Supabase → Rotate **service_role** (and anon only if abuse suspected).
6. `npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY` (and anon if rotated) on `namibia-sports-platform` (+ staging).
7. Smoke: `https://sports.com.na` federations list; Storage upload; old creds fail.
8. Confirm Builds env: no `VITE_SHOW_LIVE_NAV` / `VITE_SHOW_WHATSAPP_SUBSCRIBE` / `VITE_SHOW_AI_CHAT` / `VITE_ENABLE_GOOGLE_AUTH`.
9. (Optional P1) WAF / rate limit `/api/trpc/*`.
10. Ping agent wave to flip docs: C1/C2/B1 → closed; scorecard → soft/full GO.

---

## 7. Score impact (unchanged math, Builds unlock already taken)

| State | Security | Ops | Weighted (approx) | Decision |
|-------|---------:|----:|------------------:|----------|
| Now (creds open, Hyperdrive `postgres`) | ~76 (capped) | ~66–70 | **≤52 ops hard cap** | **NO-GO** |
| After H1–H6 (rotation + app role) | ~94 | ~90+ | **~89–90** | Soft public **GO**; full public **GO** if honesty flags hold |
| + WAF (P1) | +~1 | — | Polish | Not required for GO |

Builds `ci:gate` was the last ~+1 Ops unlock on the 2026-07-24 scorecard path to ≥90 — **already landed**.

---

## 8. Agent work already banked (do not re-open as blockers)

From security audit + go-live scorecard (non-exhaustive):

- `assertSameFederation` + load-then-assert ownership; `federationScope` / mediumGuards tests  
- WhatsApp tRPC hard-disabled (`WHATSAPP_API_ENABLED=false`)  
- Public PII strip + tenant-scoped `includePii`  
- Draft/inactive gates (events/news/athletes/coaches/clubs/HP/federations)  
- Storage MIME + public SELECT policies on `sportsplatform_*` buckets  
- https-only stream / website URLs; Worker CSP/headers/CORS allowlist  
- Rate limits: AI, upload, search (per-isolate)  
- Privacy/Terms + SiteLegalFooter; soft-public SEO honesty  
- Fed public tab inventory gate; hollow verified fill  
- `sportsplatform_app` role + table/sequence grants (password intentionally unset)

---

## 9. Related artifacts

- [`SECURITY_CREDENTIAL_ROTATION.md`](../SECURITY_CREDENTIAL_ROTATION.md) — **do this first**
- [`PRODUCTION_GO_LIVE_SCORECARD.md`](../PRODUCTION_GO_LIVE_SCORECARD.md)
- [`PRODUCTION_SECURITY_AUDIT.md`](../PRODUCTION_SECURITY_AUDIT.md)
- [`docs/CI.md`](../../CI.md) — Builds path (command now correct)
- [`docs/architecture/RLS_POLICIES.md`](../../architecture/RLS_POLICIES.md) — gap B1
- [`docs/06_tasks.md`](../../06_tasks.md) — CRITICAL credentials row still `[~]`

---

*End of 18_golive_blockers. Verdict: **NO-GO** until human H1–H6; Builds `ci:gate` closed; application Criticals closed. Soft/full public unlock is ops-only.*
