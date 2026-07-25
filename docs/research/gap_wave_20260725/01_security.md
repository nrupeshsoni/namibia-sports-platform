# Gap Wave 2026-07-25 — SECURITY / AUTH / RBAC

**Slice:** Security, authentication, RBAC, tenancy, secrets, abuse controls  
**Workspace:** `namibia-sports-platform`  
**Audit date:** 2026-07-25  
**HEAD at audit:** `64bf86b` (`main`)  
**Rules applied:** SEARCH FIRST, REUSE FIRST, VERIFY; `security.mdc`; `CLAUDE.md` tenancy notes; live checks via Supabase MCP + Cloudflare Hyperdrive MCP.

**Prior art:** [`PRODUCTION_SECURITY_AUDIT.md`](../PRODUCTION_SECURITY_AUDIT.md) (2026-07-23), [`SECURITY_CREDENTIAL_ROTATION.md`](../SECURITY_CREDENTIAL_ROTATION.md), [`PRODUCTION_GO_LIVE_SCORECARD.md`](../PRODUCTION_GO_LIVE_SCORECARD.md), [`docs/governance/SECURITY.md`](../../governance/SECURITY.md), [`docs/architecture/RLS_POLICIES.md`](../../architecture/RLS_POLICIES.md).

---

## Executive verdict

Application-layer RBAC and federation tenancy are in good shape. The **blocking Critical gaps remain operational**: live credentials from git history are still treated as compromised, and Hyperdrive origin is still the `postgres` superuser (`rolbypassrls=true`). Until those human steps complete, treat Security score as hard-capped (see go-live scorecard).

---

## Severity-ordered gaps

### CRITICAL

| ID | Gap | Evidence | Recommended fix |
|----|-----|----------|-----------------|
| **C1** | **Postgres password + `SUPABASE_SERVICE_ROLE_KEY` exposed in git history; live rotation not confirmed.** Scrubbing the tree does not revoke access. Shared Supabase project (~737 tables) amplifies blast radius. | `docs/research/SECURITY_CREDENTIAL_ROTATION.md`; scorecard still ❌ HUMAN; tree scrub referenced at `b040dc3` | Follow rotation checklist in order: set `sportsplatform_app` password → update Hyperdrive → reset `postgres` password → rotate `service_role` → `wrangler secret put` → smoke `federations.list` + storage upload. Agents cannot complete this. |
| **C2** | **Hyperdrive origin still connects as `postgres` (bypass RLS).** Drizzle path never evaluates RLS; tRPC is the sole tenancy boundary. Compromised Worker/Hyperdrive credential = full shared DB. | **Live MCP (2026-07-25):** Hyperdrive `dbfcf635ad4a475ba991743b94a5d6a2` → `origin.user: "postgres"` on host `db.rbibqjgsnrueubrvyqps.supabase.co:5432`. DB: `postgres.rolbypassrls=true`; `sportsplatform_app.rolbypassrls=false` exists but is unused. `wrangler.jsonc` binding; `server/db.ts` uses `HYPERDRIVE.connectionString`. | Point Hyperdrive at `sportsplatform_app` (role + grants already applied). Staging currently **shares the same Hyperdrive id** — give staging its own config after prod switch. |

---

### HIGH

| ID | Gap | Evidence | Recommended fix |
|----|-----|----------|-----------------|
| **H1** | **Rate limits are per-isolate only; no global/WAF ceiling on `/api/trpc/*`.** AI, upload, search, contentSync are bounded per isolate; multi-isolate or auth-adjacent spam still possible. | `server/_core/rateLimit.ts` (explicit comment L3–9); scorecard “WAF still open” | Add Cloudflare Rate Limiting / WAF custom rules for `/api/trpc/*` (and optionally Anthropic-backed procedure names). Keep in-app limits as defence-in-depth. |
| **H2** | **WhatsApp API surface is hard-off in code, but still shaped as `publicProcedure` and docs/env disagree — re-enable footgun.** `.env.example` / `ENV.enableWhatsAppSubscribe` / `SECURITY.md` describe env-gated + auth’d procedures; router ignores env and uses `WHATSAPP_API_ENABLED = false`. | `server/routers/whatsapp.ts` L23–32, L44–130; `server/_core/env.ts` `ENABLE_WHATSAPP_SUBSCRIBE`; `docs/governance/SECURITY.md` L50–57 (stale); UI `VITE_SHOW_WHATSAPP_SUBSCRIBE` default off (`client/src/lib/features.ts`) | Before any re-enable: wire `ENV.enableWhatsAppSubscribe === "true"`; convert `unsubscribe`/`getSubscriptions` to `protectedProcedure`; require Meta opt-in proof on `subscribe`; apply `RATE_LIMITS.whatsapp`; align `SECURITY.md`. Until then keep hard-off (current behaviour is safe). |
| **H3** | **Staging and production share one Hyperdrive config.** A staging misconfig or credential experiment affects prod DB path. | `wrangler.jsonc` prod + `env.staging` both use `dbfcf635…` | Create separate Hyperdrive for staging; never share origin passwords across envs. |

---

### MEDIUM

| ID | Gap | Evidence | Recommended fix |
|----|-----|----------|-----------------|
| **M1** | **`media.create` accepts arbitrary `fileUrl` / `thumbnailUrl` strings** (not `httpsUrlSchema`). Risk of `javascript:` / open-redirect when clients render as `href`/`src`. Streams/federation websites were hardened; media was not. | `server/routers/media.ts` L117–118 | Use `httpsUrlSchema` / `optionalHttpsUrlSchema` from `server/_core/httpsUrl.ts`; client `safeHttpsHref` on any media link rendering. |
| **M2** | **`upload.image` `base64` has no Zod max length.** Size is checked after decode (`5MB` in `supabaseStorage.ts`), so a huge base64 body can stress Worker memory/CPU first. | `server/routers/upload.ts` L34; `server/services/supabaseStorage.ts` L22, L81–83 | Cap `base64` string length in Zod (~7MB encoded ≈ 5MB binary + margin); reject early. |
| **M3** | **`users.inviteOrPromote` uses Auth Admin `createUser` with `email_confirm: true` and no password / invite link.** Correct email → intended admin bootstrap; typo’d email → confirmed Auth user that can take over via password recovery. No rate limit on invite. | `server/routers/users.ts` L113–161, L184–188 | Prefer `inviteUserByEmail` (or generateLink + email); never auto-confirm without invite token; rate-limit invites; require email confirmation before role grant where possible. |
| **M4** | **No “last remaining platform admin” guard when demoting another admin.** Self-demotion blocked; Admin A can demote Admin B to zero admins left if A is the only remaining admin after demotions… actually A cannot demote self, so at least A remains. Residual: no audit log / dual-control for privilege grants. | `server/_core/assignUserRole.ts` L18–23 | Add audit log for role changes; optional: require second admin for promoting to `admin`. Low urgency if sole-admin self-lock is the main concern (already covered). |
| **M5** | **CSP allows `'unsafe-inline'` for scripts and styles.** Necessary today for Vite/glass; weakens XSS containment. | `server/worker.ts` L39–55 | Longer-term nonces / `strict-dynamic` if bundle allows; keep style-src inline until glass tokens move to classes. |
| **M6** | **AI / Content Sync error paths may return upstream message text to clients.** Generic messages preferred in production. | `server/routers/ai.ts` L41–42, L54–55, L83–84 | Map to generic `TRPCError` messages; log details server-side only. |
| **M7** | **Federation directory exposes org `email`/`phone` publicly** via `select()`. Likely intentional (NSC contacts), but is PII under POPIA if personal. | `server/routers/federations.ts` list/get `select()` | Confirm product intent; if personal contacts, strip for anonymous and expose only for staff. |
| **M8** | **Doc drift: `SECURITY.md` WhatsApp section does not match code.** Operators may flip env expecting API to open. | `docs/governance/SECURITY.md` vs `whatsapp.ts` | Update governance doc to “hard-disabled constant; env unused until Meta opt-in ships.” |

---

### LOW

| ID | Gap | Evidence | Recommended fix |
|----|-----|----------|-----------------|
| **L1** | `auth.logout` is a no-op server-side (bearer tokens). Correct for design; clients must `signOut()`. | `server/routers/auth.ts` | Keep; document only. |
| **L2** | `club_manager` enum exists but is not assignable — good. Ensure UI never offers it. | `server/routers/users.ts` `assignableRoleSchema` | Already rejected via Zod `clubId`. |
| **L3** | Shared-project Storage buckets for *other* products may have weaker policies (out of sportsplatform scope). | Prior audit M6 | Org hygiene; not this Worker’s code. |
| **L4** | PostgREST RLS on `sportsplatform_*` is SELECT-oriented; WhatsApp table policies tightened to own/admin — good for Data API, irrelevant to Hyperdrive path. | Live policies on `sportsplatform_whatsapp_subscriptions` | Keep; do not treat as Worker tenancy layer. |
| **L5** | `.env.production` commits anon JWT (intentional for CI). Public-by-design; rotate if paired with leaked service_role. | `.env.production` | Keep anon only; never commit service_role. |

---

## Checklist deep-dive (requested surfaces)

### 1. tRPC procedure auth matrix (summary)

| Router | Public reads | Mutations |
|--------|--------------|-----------|
| `auth` | `me`, `logout` | — |
| `federations` / `venues` / `schools` | public list/get | `adminProcedure` |
| `clubs` / `events` / `athletes` / `coaches` / `news` / `streams` / `hpPrograms` / `media` | public list/get (draft/inactive gated) | `federationAdminProcedure` + `assertSameFederation` / `assertClaimMatchesOwnedRow` |
| `upload` | — | `federationAdminProcedure` + assert + rate limit |
| `ai` | — | `protectedProcedure` + rate limit + size caps |
| `contentSync` | — | `adminProcedure` + kill-switch + dual rate limit |
| `users` | — | `adminProcedure` only (`list`, `setRole`, `inviteOrPromote`, …) |
| `whatsapp` | shaped public | **hard-disabled** (`FORBIDDEN`) |
| `search.global` | public + rate limit | — |
| `adminStats` / `system.notifyOwner` | — | `adminProcedure` |
| `system.health` | public | — |

Middleware (`server/_core/trpc.ts`): `federationAdminProcedure` checks **role only** by design; tenancy is explicit in each mutation.

### 2. `assertSameFederation` coverage

**Present on write paths:** `athletes`, `clubs`, `coaches`, `events`, `news`, `streams`, `hpPrograms`, `media`, `upload`.

**Load-then-assert / claim match:** `events` / `news` / `streams` use `assertClaimMatchesOwnedRow`; `clubs` / `athletes` / `coaches` / `hpPrograms` / `media.delete` load existing row then assert.

**Tests:** `server/federationScope.test.ts` — unit + cross-tenant FORBIDDEN cases including `upload.image`, create paths for clubs/events/news/streams.

**No gap found** for missing assert on federation-scoped mutations in current tree.

### 3. Public leaks (drafts / inactive / PII)

| Resource | Public gate | PII |
|----------|-------------|-----|
| events / news | published-only; staff `includeUnpublished` + `canIncludeUnpublished` | N/A |
| athletes / coaches | active-only; staff flags | stripped unless tenant-scoped `includePii` (`canIncludePii*`) |
| clubs / venues / schools | active-only | contacts stripped for non-staff (`stripClubContact` / venue / school) |
| hp programs | active-only | N/A |
| federations | active / canonical resolve | org email/phone public (**M7**) |
| media.list | unscoped dump = platform admin only | URLs only |
| whatsapp | API disabled | — |

### 4. Rate limits

| Key | Limit | Wired |
|-----|-------|-------|
| `ai.*` | 10/min | yes |
| `contentSync.*` | 10/min (user + IP) | yes |
| `upload.image` | 20/min | yes |
| `search.global` | 30/min | yes |
| `whatsapp.*` | 5/min defined | **not applied** (API hard-off) |

Global WAF: **open** (**H1**).

### 5. CORS / CSP

- **CORS:** allowlist only — `sports.com.na`, `www`, staging workers.dev, localhost Vite/wrangler (`server/_core/cors.ts`). Arbitrary origins get no ACAO; preflight 403. Covered by `server/mediumGuards.test.ts`.
- **CSP + headers:** CSP, XFO DENY, nosniff, Referrer-Policy, Permissions-Policy, HSTS on all Worker responses (`server/worker.ts`). Residual: `'unsafe-inline'` (**M5**).

### 6. Secrets

| Item | Status |
|------|--------|
| Working tree scrub | Done (no live DB password in tracked sources) |
| History / forks | Still dirty → **C1** |
| Worker secrets | Via `wrangler secret put` (correct pattern) |
| `.env.production` | Anon only (intentional) |
| Hyperdrive password | Lives in CF Hyperdrive config (not Worker secrets) — still `postgres` → **C2** |

### 7. Hyperdrive role (live)

| Check | Result (2026-07-25) |
|-------|---------------------|
| Role `sportsplatform_app` | Exists, `LOGIN`, `rolbypassrls=false` |
| Hyperdrive origin user | **`postgres`** |
| Staging Hyperdrive | Same id as prod |

### 8. WhatsApp / AI flags

| Flag | Default | Effect |
|------|---------|--------|
| `VITE_SHOW_WHATSAPP_SUBSCRIBE` | off | Hides UI |
| `WHATSAPP_API_ENABLED` (code const) | `false` | API `FORBIDDEN` |
| `ENABLE_WHATSAPP_SUBSCRIBE` (env) | documented | **Unused by router** |
| `VITE_SHOW_AI_CHAT` | off | Hides widget |
| `ai.*` procedures | always callable if authenticated | Cost risk if key set + flag off — mitigated by auth + rate limit |
| `ENABLE_CONTENT_SYNC` | default ON | Admin-only; drafts only |

### 9. `users.inviteOrPromote`

- Auth: **`adminProcedure` only** — federation_admin cannot call.
- Role assign: shared `assignUserRole` — requires `federationId` for `federation_admin`; rejects `club_manager`; blocks self-demotion from admin.
- Provisioning: service_role `createUser` + `ensureUser` when key present; else register-then-promote message.
- Gaps: **M3** (auto-confirm / invite UX), optional audit (**M4**).

### 10. Storage policies (live Supabase)

| Bucket | public | size | MIME | Object policies |
|--------|--------|------|------|-----------------|
| `sportsplatform_logos` | true | 5MB | jpeg/png/webp/gif | public SELECT only |
| `sportsplatform_images` | true | 5MB | same | public SELECT only |
| `sportsplatform_athlete_photos` | true | 5MB | same | public SELECT only |
| `sportsplatform_event_posters` | true | 5MB | same | public SELECT only |
| `sportsplatform_news_images` | true | 5MB | same | public SELECT only |

Writes: Worker `service_role` via `upload.image` only (no anon INSERT policies). **Solid** for sportsplatform buckets.

---

## What’s already solid

1. **Explicit federation tenancy** — middleware fails closed by design; mutations call `assertSameFederation` / `assertClaimMatchesOwnedRow`; regression tests in `federationScope.test.ts`.
2. **RBAC procedure ladder** — `public` / `protected` / `federationAdmin` / `admin` used consistently; platform-only routers (`users`, `federations` writes, `schools`, `venues`, `contentSync`, `adminStats`) are `adminProcedure`.
3. **PII stripping** — athletes/coaches/clubs/venues/schools; tenant-scoped `includePii`.
4. **Draft/inactive gates** — events, news, athletes, coaches, clubs, HP, federations, venues.
5. **AI cost controls** — auth + rate limit + history/message/total char caps; UI flag default off.
6. **WhatsApp hard-disabled** at API (not just UI) — correct posture for launch.
7. **Worker security headers + CORS allowlist** — no wildcard ACAO.
8. **Storage MIME/size + public-read-only** on `sportsplatform_*` buckets.
9. **Upload path sanitization** — `sanitizeStorageEntityId`; content-type allowlist; 5MB cap after decode.
10. **HTTPS URL validation** on streams/federation/club website fields + client `safeHttpsHref`.
11. **Role assign Zod** — `federation_admin` requires `federationId`; `club_manager` not grantable.
12. **Content Sync** — admin-only, drafts-only, kill-switch, dual rate limits.

---

## Top 10 security gaps (priority order)

1. **C1** — Rotate compromised Postgres password + `service_role` + Worker secrets (human).
2. **C2** — Switch Hyperdrive origin from `postgres` → `sportsplatform_app` (human; verified still `postgres`).
3. **H1** — Add global Cloudflare WAF / Rate Limiting on `/api/trpc/*`.
4. **H3** — Separate staging Hyperdrive from production.
5. **H2** — Align WhatsApp re-enable path (env + auth + rate limit + Meta opt-in); fix `SECURITY.md` drift.
6. **M1** — HTTPS-validate `media.create` URLs.
7. **M2** — Cap `upload.image` base64 input length in Zod.
8. **M3** — Harden `users.inviteOrPromote` (invite link, not auto-confirmed bare `createUser`).
9. **M5** — Plan CSP nonce / reduce `'unsafe-inline'` scripts.
10. **M6** — Sanitize AI/Content Sync client-facing error messages.

---

## Suggested next actions

| Owner | Action |
|-------|--------|
| Human / Infra | Complete `SECURITY_CREDENTIAL_ROTATION.md` steps A–F; verify Hyperdrive user ≠ `postgres`. |
| Human / Infra | Staging Hyperdrive + CF WAF rate limit. |
| Backend | M1–M3, M6 code fixes; H2 doc/env alignment (keep API off). |
| Docs | Sync `docs/governance/SECURITY.md` WhatsApp section to hard-disable reality. |

---

## Verification performed this slice

- Grep of all `publicProcedure` / `federationAdminProcedure` / `assertSameFederation` call sites under `server/`.
- Read of `trpc.ts`, `federationScope.ts`, `users.ts`, `whatsapp.ts`, `upload.ts`, `ai.ts`, `worker.ts`, `cors.ts`, `rateLimit.ts`, `assignUserRole.ts`, `features.ts`.
- Supabase SQL: roles, storage buckets/policies, WhatsApp RLS quals.
- Cloudflare Hyperdrive MCP: origin user **`postgres`** confirmed.
- Cross-check against 2026-07-23 production security audit + go-live scorecard.
