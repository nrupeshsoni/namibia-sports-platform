# Production Security Audit — sports.com.na

**Date:** 2026-07-23  
**Branch / HEAD at audit start:** `main` @ `ca591ee`  
**Scope:** Full platform post-merge go-live review (secrets, tRPC tenancy, AI/WhatsApp, PII, draft leaks, Worker headers, Storage, Hyperdrive, client XSS/redirects, Admin UI).  
**Rules applied:** SEARCH FIRST, REUSE FIRST, VERIFY; security.mdc; documentation.mdc.

---

## Executive summary

| Area | Verdict |
|------|---------|
| Federation tenancy (`assertSameFederation`) | **OK** on fed-admin writes (events/news/streams/upload/hp/media/athletes/clubs/coaches) |
| Public AI | **OK** — `protectedProcedure` + rate limits |
| Public WhatsApp | **Fixed this pass** — API hard-disabled |
| Athlete/coach PII | **Fixed this pass** — `includePii` tenant-scoped |
| Draft/inactive leaks | **Mostly OK**; HP programs + `federations.getById` hardened this pass |
| Worker CSP/headers/CORS | **OK** — security headers + origin allowlist (`server/_core/cors.ts`) |
| Storage (`sportsplatform_*`) | **Hardened this pass** — public SELECT policy + MIME/size limits |
| Credentials / Hyperdrive role | **CRITICAL — human rotation still required** |

**Go-live code gate:** Critical *application* issues from this audit are addressed in code.  
**Go-live ops gate:** Credential rotation + Hyperdrive least-privilege role remain **human Critical**.

---

## Findings (severity-ordered)

### CRITICAL — human action required

| ID | Finding | Location | Fix |
|----|---------|----------|-----|
| C1 | **Postgres password + `SUPABASE_SERVICE_ROLE_KEY` were in git history.** Tree scrubbed; live secrets must still be rotated. | History: commits before `b040dc3`; checklist `docs/research/SECURITY_CREDENTIAL_ROTATION.md` | Rotate DB password → update Hyperdrive connection string → rotate service_role → `wrangler secret put` → redeploy. Agents cannot do this. |
| C2 | **Hyperdrive origin uses `postgres` (`rolbypassrls`).** tRPC/Drizzle path never evaluates RLS; tenancy is API-only. Compromised Worker/Hyperdrive = full shared DB. | `wrangler.jsonc` Hyperdrive binding `dbfcf635ad4a475ba991743b94a5d6a2`; `server/db.ts:52–67`; `docs/architecture/RLS_POLICIES.md` (gap B1) | **Role created in DB:** `sportsplatform_app` (LOGIN, no bypassrls) + grants on all `sportsplatform_*`. **Human still must:** set role password → point Hyperdrive at it → finish C1. Checklist: `SECURITY_CREDENTIAL_ROTATION.md`. |

### HIGH — fixed in this pass (or already fixed on main)

| ID | Finding | Location | Fix applied / status |
|----|---------|----------|----------------------|
| H1 | WhatsApp `subscribe` / `unsubscribe` / `getSubscriptions` were `publicProcedure` (phone write + enumeration). UI flag is not enough. | `server/routers/whatsapp.ts` | **Fixed:** `WHATSAPP_API_ENABLED = false`; all procedures throw `FORBIDDEN`. Phone lookup removed from `getSubscriptions` path even if re-enabled. |
| H2 | `includePii` for any `federation_admin` leaked other federations’ athlete/coach email/phone/DOB. | `server/routers/athletes.ts` (~L64–98, ~L126–131); `server/routers/coaches.ts` (~L48–71, ~L95–100) | **Fixed:** `canIncludePii` / `canIncludePiiInList` in `server/_core/federationScope.ts:79–99`. |
| H3 | `hpPrograms.list` returned inactive programs by default; `getById` had no active gate. | `server/routers/hpPrograms.ts` | **Fixed:** default `isActive=true`; staff `includeInactive` + `canIncludeInactive`; `getById` uses `canViewNonPublic`. |
| H4 | `federations.getById` returned inactive rows to the public. | `server/routers/federations.ts:83–100` | **Fixed:** uses `resolveCanonical` (active or merge successor; else null). Admin uses `listAll`. |
| H5 | `sportsplatform_*` Storage buckets had **no** object policies and null MIME limits. | Supabase project `rbibqjgsnrueubrvyqps` | **Fixed via migration** `sportsplatform_storage_bucket_policies`: public SELECT; MIME + 5MB limits. Writes remain service_role (Worker). |
| H6 | Stream `streamUrl` / `embedUrl` / `thumbnailUrl` accepted arbitrary strings → `javascript:` / open-redirect risk via `window.open` / `<a href>`. | `server/routers/streams.ts`; client `Live.tsx`, `FederationStreams.tsx` | **Fixed:** `httpsUrlSchema` on create/update. |
| H7 | AI helpers / chat unauthenticated spend | `server/routers/ai.ts` | **Already OK on main:** `protectedProcedure` + `RATE_LIMITS.ai` on all three mutations. |
| H8 | Fed-admin writes without tenant assert | events/news/streams/upload/hp/media/… | **Already OK on main:** explicit `assertSameFederation` + `server/federationScope.test.ts` (33 cases). |

### MEDIUM

| ID | Finding | Location | Recommended fix |
|----|---------|----------|-----------------|
| M1 | Rate limiter is **per-isolate** (not global). Multi-isolate abuse still possible. | `server/_core/rateLimit.ts:1–9` | Cloudflare Rate Limiting binding or WAF rules for `/api/trpc/*`. |
| M2 | CSP allows `'unsafe-inline'` scripts (Vite/glass tradeoff). | `server/worker.ts:38–54` | Longer-term: nonces / strict-dynamic if bundle allows. |
| M3 | Federation website/social fields rendered as `href={federation.website}` without https-only validation. | `client/src/components/FederationModal.tsx:187+`; admin federation update | Validate `https://` (or relative) on federation create/update like streams. |
| M4 | `events`/`news`/`streams` update/delete assert on **input** `federationId` + WHERE; wrong id+own-fed is silent no-op (not cross-tenant write). Prefer load-then-assert like `coaches`/`hpPrograms`. | `server/routers/events.ts:136–163`; `news.ts:122–148`; `streams.ts:107–152` | Load existing row → `assertSameFederation(existing)` → mutate. |
| M5 | `.env.production` commits **anon** JWT (intentional for CI). Anon is public-by-design; still rotate if ever paired with leaked service_role. | `.env.production:6–7` | Keep anon only; never commit service_role. |
| M6 | Shared Supabase project (~737 tables). Storage buckets of other products (e.g. `player-photos` anon INSERT) are out of sportsplatform scope but raise shared-project risk. | Storage policies (other products) | Org-level hygiene; not sportsplatform code. |

### LOW / informational

| ID | Finding | Notes |
|----|---------|-------|
| L1 | CORS allowlist (not `*`) | `server/_core/cors.ts` — sports.com.na, staging workers.dev, localhost. Arbitrary origins get no ACAO. **OK.** |
| L2 | Admin UI gates | `Admin.tsx:38–47` redirects non-`admin`; `FederationLayout.tsx:129–147` checks `admin` or matching `federation_admin`. **OK** (API is authoritative). |
| L3 | `dangerouslySetInnerHTML` only in `chart.tsx` (Recharts CSS vars) | Not user HTML. **OK.** |
| L4 | Table RLS enabled on all `sportsplatform_*` | Defence for PostgREST only; Hyperdrive bypasses (see C2). |
| L5 | WhatsApp UI behind `VITE_SHOW_WHATSAPP_SUBSCRIBE` (default false) | Now matched by API hard-off. |

---

## Checklist coverage

### 1. Secrets in repo / history / docs / `.env.production`

| Item | Result |
|------|--------|
| `.env` gitignored | Yes (`.gitignore`) |
| `.env.production` | Public `VITE_SUPABASE_URL` + anon key only (commented as intentional) |
| Live password in tracked tree | Scrubbed (`b040dc3`); **history still dirty → C1** |
| Docs placeholders | Safe forms in `.env.example` / rotation doc |

### 2. tRPC mutations + `assertSameFederation`

Covered routers: `athletes`, `clubs`, `coaches`, `events`, `news`, `streams`, `upload`, `hpPrograms`, `media`.  
Platform-admin-only: `federations`, `venues`, `schools`, `news.delete`.  
Tests: `server/federationScope.test.ts`.

### 3. Public AI / WhatsApp + rate limits

| Procedure | Auth | Rate limit |
|-----------|------|------------|
| `ai.*` | protected | `RATE_LIMITS.ai` (10/min) |
| `whatsapp.*` | disabled (`FORBIDDEN`) | N/A until re-enable |
| `upload.image` | federationAdmin + assert | `RATE_LIMITS.upload` |
| `search.global` | public | `RATE_LIMITS.search` |

### 4. PII stripping (athletes / coaches)

Public list/get strip email/phone/(DOB). Staff `includePii` now tenant-scoped via `canIncludePii*`.

### 5. Draft / inactive leaks

| Resource | Public list | Public get |
|----------|-------------|------------|
| events / news | published-only (staff flag gated) | draft hidden |
| athletes / coaches / clubs | active-only | inactive hidden |
| hp programs | **active-only (fixed)** | **inactive hidden (fixed)** |
| federations | active-only | **canonical only (fixed)** |
| streams | all rows (no draft column) | by id |

### 6. Worker CSP / headers / CORS

`server/worker.ts:56–64` sets CSP, XFO DENY, nosniff, Referrer-Policy, Permissions-Policy, HSTS. Applied to tRPC, health, assets, SPA. No wildcard CORS.

### 7. Storage buckets (MCP `rbibqjgsnrueubrvyqps`)

| Bucket | Public | Policies (after fix) |
|--------|--------|----------------------|
| `sportsplatform_logos` / `_images` / `_athlete_photos` / `_event_posters` / `_news_images` | true | `sportsplatform_storage_public_read` SELECT; MIME images; 5MB; writes via service_role |

### 8. Hyperdrive / role

See **C2**. Role `sportsplatform_app` + grants exist in DB; Hyperdrive still on `postgres` until a human sets the role password and updates config `dbfcf635ad4a475ba991743b94a5d6a2`. Documented in CLAUDE.md / RLS_POLICIES.md / `SECURITY_CREDENTIAL_ROTATION.md`.

### 9. Client XSS / open redirects

- Stream URLs: https-validated server-side (**H6**).
- Login redirect uses `window.location.origin` (not query param) — **OK**.
- Federation social `href` — residual **M3**.

### 10. Admin UI gates

Platform `/admin` and federation `/admin/*` gated in UI; mutations enforce RBAC + tenancy.

---

## Code changes shipped with this audit

1. `server/routers/whatsapp.ts` — hard-disable public WhatsApp API  
2. `server/_core/federationScope.ts` — `canIncludePii` / `canIncludePiiInList`  
3. `server/routers/athletes.ts` / `coaches.ts` — tenant-scoped PII  
4. `server/routers/hpPrograms.ts` — active-only public list/get  
5. `server/routers/federations.ts` — `getById` via `resolveCanonical`  
6. `server/routers/streams.ts` — https-only media URLs  
7. Supabase migration `sportsplatform_storage_bucket_policies`  
8. This document

---

## Remaining Critical for humans (credential rotation)

Complete **before** treating production as safe:

1. **Set password** for DB role `sportsplatform_app` (role + grants already applied 2026-07-23).  
2. **Point Hyperdrive** `dbfcf635ad4a475ba991743b94a5d6a2` at `sportsplatform_app` (not `postgres`).  
3. **Reset Supabase `postgres` DB password** (project `rbibqjgsnrueubrvyqps`).  
4. **Rotate `SUPABASE_SERVICE_ROLE_KEY`** in the dashboard (and consider anon if abused).  
5. **`npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY`** (and related) + redeploy.  
6. Update local `.env` / CI secrets; verify federations list + image upload smoke tests.

Full checklist: [`SECURITY_CREDENTIAL_ROTATION.md`](./SECURITY_CREDENTIAL_ROTATION.md).

---

## Verification

```bash
npm run check          # pass
npm run test -- --run server/federationScope.test.ts server/rateLimit.test.ts  # 37 pass
```

---

## Admin CMS follow-up

**Date:** 2026-07-23  
**HEAD audited:** `b6d1411` / `ae83765` (admin CRUD UIs + `users` RBAC)  
**Scope:** Privilege escalation / tenancy only.  
**Verdict:** **CLEAN** — no Critical/High findings; no code changes required.

| Check | Result |
|-------|--------|
| `users.list` / `users.setRole` | `adminProcedure` only — `federation_admin` cannot call (role gate in `adminProcedure`). |
| Demote last admin | Self-demotion blocked (`id === ctx.user.id && role !== "admin"`). Sole admin cannot remove own admin role. |
| `federation_admin` + null `federationId` | Rejected at runtime (`federationId == null` → `BAD_REQUEST`). Zod input allows `nullable().optional()`; couple is enforced in the mutation body (Medium defense-in-depth only — not exploitable). |
| `news.delete` / `streams.delete` | `assertSameFederation(input.federationId)` then `DELETE … WHERE id AND federationId` — no cross-tenant delete. Ownership load-then-assert still preferred (see M4); silent no-op on id/fed mismatch is not escalation. |
| Upload `coach` / `stream` | `entitySchema` includes both; `assertSameFederation` on `federationId` before storage write (same pattern as club/athlete). |
| Platform Admin UI | `Admin.tsx`: `role === "admin"` redirect + early return before mutation UI; queries `enabled: isPlatformAdmin`. |
| FedAdmin new tabs | Props use `federation.id` from slug lookup (`FederationLayout`); coaches/media/HP/news/streams lock that id — client cannot pass another federation via UI. API still enforces `assertSameFederation`. |

**Tests re-run:** `npm run check` + `vitest run server/federationScope.test.ts` — 35 pass (includes `news.delete` / `streams.delete` / `upload.image` / `coaches.create` cross-tenant).
