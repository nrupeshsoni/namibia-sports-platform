# Gap Analysis — Integrations

**Wave:** `gap_wave_20260725`  
**Doc:** `13_integrations.md`  
**Date:** 2026-07-25  
**Project:** `rbibqjgsnrueubrvyqps` (EU West) · Worker `namibia-sports-platform` · apex `sports.com.na`  
**Scope:** WhatsApp Business, Anthropic Claude, Cloudflare Workers AI, Supabase Auth Google OAuth, transactional/product email, Web Push, Supabase Edge Functions inventory  
**DB mutations this analysis:** none  
**Method:** Codebase grep/read + live Supabase `list_edge_functions` + SQL (`whatsapp_subscriptions` counts, `pg_cron` jobs)

---

## 1. Executive verdict

| Metric | Value |
|--------|------:|
| **Integrations readiness** | **~38 / 100** for “product claims in CLAUDE.md / SYSTEM_DESIGN”; **~72 / 100** for “honest go-live posture” (flags off, hard-disable WhatsApp, Content Sync + news-aggregator live) |
| **Ship recommendation** | Keep WhatsApp / AI chat / Google OAuth **UI+API off** for public beta. Treat Content Sync (Workers AI) and `news-aggregator` (Anthropic on Edge) as the only production AI paths. Do **not** market WhatsApp notify, browser push, or Google sign-in until the gaps below close. |
| **Biggest lie in docs** | CLAUDE.md / SYSTEM_DESIGN still describe WhatsApp delivery + Web Push as stack capabilities; delivery code does not exist. |
| **Biggest silent win** | `news-aggregator` Edge Function **ACTIVE** (v12) + `pg_cron` `invoke-news-aggregator` every 6h; Content Sync Workers AI binding present in `wrangler.jsonc`. |

### Score by integration

| Integration | Score | Status | One-line gap |
|-------------|------:|--------|--------------|
| WhatsApp Business | 15 | ⏸ Hard-off | Schema + stub tRPC + stub webhook; **no send path**, webhook **not deployed** |
| Anthropic (Worker `ai.*`) | 45 | ⏸ UI off | Code + auth + rate limits; key often unset → chat fails when flag on |
| Anthropic (Edge news-aggregator) | 80 | ✅ Live | Deployed + cron + kill-switch; depends on Edge secret |
| Workers AI (Content Sync) | 78 | ✅ Live (admin) | Binding + admin tRPC; not used for public chat |
| Supabase Google OAuth | 25 | ⏸ Flag off | Client wired; provider disabled on shared project |
| Email (product/transactional) | 10 | ❌ Absent | Auth mail via Supabase only; no platform mailer |
| Web Push | 5 | ❌ Absent | PWA shell exists; no VAPID / subscription store / sender |
| Edge Functions (sports) | 70 | Partial | `news-aggregator` live; `whatsapp-webhook` repo-only |

**Weighted ≈ 38** against marketed stack; **≈ 72** against deliberate soft-beta flags.

---

## 2. Matrix — claimed vs reality

| Claimed (docs / CLAUDE.md) | Reality (2026-07-25) | Gap severity |
|----------------------------|----------------------|--------------|
| WhatsApp Business API notifications | Subscribe tRPC **hard-disabled**; **0** DB rows; no outbound Graph API client; webhook not deployed | **Critical** (product) |
| Anthropic Claude AI | Worker helpers exist; UI default off; Content Sync prefers Workers AI; Edge aggregator uses Claude | **Medium** (ops/key) |
| Workers AI | Bound (`ai: { binding: "AI" }`); used only by `contentSync.*` | **Low** (scope) |
| Supabase Auth social OAuth | Email/password live; Google button gated; provider disabled on shared project | **Medium** (product) |
| Web Push | `vite-plugin-pwa` install/offline only; no push pipeline | **High** (roadmap) |
| Edge cron news + WhatsApp webhook | News cron live; WhatsApp webhook **not** in project function list | **High** (WhatsApp) |
| `notification-dispatcher.ts` | **File does not exist** | **High** (design drift) |

---

## 3. WhatsApp Business

### 3.1 What exists

| Layer | Path / evidence | Notes |
|-------|-----------------|-------|
| Schema | `drizzle/schema.ts` → `sportsplatform_whatsapp_subscriptions` | `phone`, `userId`, `federationId`, `subscriptionTypes[]`, `isActive`, **`consentAt`** |
| Live data | SQL 2026-07-25 | **total=0, active=0, with_consent=0** |
| tRPC | `server/routers/whatsapp.ts` | `subscribe` / `unsubscribe` / `getSubscriptions` — all `publicProcedure` behind `WHATSAPP_API_ENABLED = false` → `FORBIDDEN` |
| UI | `client/src/components/WhatsAppSubscribe.tsx` + Fed Home | Gated by `VITE_SHOW_WHATSAPP_SUBSCRIBE` (default **off**) |
| Edge stub | `supabase/functions/whatsapp-webhook/index.ts` | GET verify + POST log-only; **does not write DB** |
| Env docs | `.env.example`, `wrangler.jsonc` comments | `WHATSAPP_API_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_VERIFY_TOKEN`, `ENABLE_WHATSAPP_SUBSCRIBE` |
| Rate-limit constant | `RATE_LIMITS.whatsapp` in `server/_core/rateLimit.ts` | **Never called** from `whatsapp.ts` |
| Legal copy | `/privacy`, `/terms` | Mentions optional WhatsApp opt-in |

### 3.2 What does **not** exist

1. **Outbound send client** — no `graph.facebook.com` / Cloud API wrapper under `server/services/`.
2. **`server/services/notification-dispatcher.ts`** — referenced in `docs/architecture/SYSTEM_DESIGN.md`, absent from repo.
3. **Meta message templates** — no template IDs, no approval tracking.
4. **Opt-in verification** — subscribe path never sets `consentAt`; no double-opt-in / Meta “user to message” proof.
5. **Deployed webhook** — `list_edge_functions` on `rbibqjgsnrueubrvyqps` has **no** `whatsapp-webhook` slug (only sports-owned deployed function is `news-aggregator`).
6. **Wiring of `ENABLE_WHATSAPP_SUBSCRIBE`** — seeded in `server/_core/env.ts` but **ignored** by router (hard const wins).

### 3.3 Doc / code drift (security)

| Document | Claims | Actual code |
|----------|--------|-------------|
| `docs/governance/SECURITY.md` | `ENABLE_WHATSAPP_SUBSCRIBE=true` opens public subscribe; unsubscribe/getSubscriptions are `protectedProcedure`; rate-limited; sets `consent_at` | Hard `WHATSAPP_API_ENABLED=false`; all three stay `publicProcedure` (gated by assert); **no** `enforceRateLimit`; **no** `consentAt` write |
| `docs/04_features_audit.md` | ⏸ API hard-disabled | Matches code |
| `docs/03_api_and_integrations.md` | WhatsApp env + Meta webhook | Overstates readiness |

### 3.4 Gaps (ordered)

| ID | Gap | Severity | Fix sketch |
|----|-----|----------|------------|
| WA-1 | No delivery pipeline (dispatcher + Cloud API + templates) | Critical | New `server/services/whatsappCloudApi.ts` + dispatcher; template env IDs |
| WA-2 | Webhook not deployed; stub does not mutate subscriptions | High | Deploy `--no-verify-jwt` only with signature verify; wire STOP/START → DB |
| WA-3 | Re-enable path unsafe if flag flipped without Meta opt-in | High | Auth or signed OTP; set `consentAt`; phone lookup only for authenticated user |
| WA-4 | `ENABLE_WHATSAPP_SUBSCRIBE` vs `WHATSAPP_API_ENABLED` dual control | Medium | Single source of truth; align SECURITY.md |
| WA-5 | Rate limit defined but unused | Medium | Call `enforceRateLimit` before any DB write when re-enabled |
| WA-6 | Docs/SYSTEM_DESIGN describe live notify flow | Medium | Mark as design-target / Phase 7 |

**Go-live posture:** Correct to keep hard-off. Do not flip UI or API until WA-1–WA-3 land.

---

## 4. Anthropic Claude

### 4.1 Two runtimes, two readiness levels

| Runtime | Code | Model | Auth / gate | Production status |
|---------|------|-------|-------------|-------------------|
| **Worker** `server/services/anthropic.ts` → `ai.*` | `generateSummary`, `suggestTags`, `chatAssistant` | `claude-sonnet-4-6` | `protectedProcedure` + `RATE_LIMITS.ai` (10/min); UI `VITE_SHOW_AI_CHAT` default off | **Incomplete** — CLAUDE.md / `.env.example`: Worker `ANTHROPIC_API_KEY` often **unset** → failures when UI enabled |
| **Worker** Content Sync Phase 2 | `server/services/contentSyncAi.ts` → `runAnthropic` | `claude-sonnet-4-6` | `adminProcedure` + `ENABLE_CONTENT_SYNC` | Fallback only if Workers AI binding missing |
| **Edge** `news-aggregator` | `supabase/functions/news-aggregator/index.ts` | `claude-sonnet-4-6` | Kill-switch `ENABLE_NEWS_AGGREGATOR=true`; service_role + Anthropic secrets | **Live** (see §9) |

### 4.2 Hardening already done (Worker)

- Chat is **not** public (was gap; fixed).
- Caps: history ≤10 turns, message ≤2k chars, conversation ≤12k chars, Anthropic client `timeout: 30_000`.
- Per-user rate limit key for chat (avoids NAT shared budget).

### 4.3 Gaps

| ID | Gap | Severity | Notes |
|----|-----|----------|-------|
| AN-1 | Worker secret may be unset while UI can be flipped on | High | Enabling `VITE_SHOW_AI_CHAT` without `wrangler secret put ANTHROPIC_API_KEY` → user-visible errors |
| AN-2 | Public chat still Anthropic-only (no Workers AI fallback) | Medium | Cost + single-vendor; Content Sync already has dual provider |
| AN-3 | Error messages may leak upstream text to client | Low | `TRPCError` uses `e.message` from Anthropic path |
| AN-4 | Docs still say chat widget “500s” as eternal fact | Low | True only when key unset; refresh after secret set |

**Recommendation:** Keep `VITE_SHOW_AI_CHAT` off for beta. Prefer Workers AI for any new public-facing assist; reserve Anthropic for Edge classification + optional admin fallback.

---

## 5. Cloudflare Workers AI

### 5.1 What exists

| Item | Evidence |
|------|----------|
| Binding | `wrangler.jsonc` → `"ai": { "binding": "AI" }` (production + `env.staging`) |
| Provider resolution | `resolveContentSyncProvider` prefers `env.AI.run`, else Anthropic |
| Model | `@cf/meta/llama-3.1-8b-instruct` |
| Consumers | `contentSync.suggestNews` / `suggestEvents` only |
| Docs | `docs/research/CONTENT_SYNC_AI.md` |
| UI | Platform Admin → Content Sync panel shows provider |

### 5.2 Gaps

| ID | Gap | Severity | Notes |
|----|-----|----------|-------|
| WAI-1 | Not used by `ai.chatAssistant` / summary / tags | Medium | Intentional Phase-1 scope; public AI still Anthropic-coupled |
| WAI-2 | Structured JSON quality vs Claude | Medium | Hallucination risk mitigated by draft-only + human publish |
| WAI-3 | Billing visibility | Low | Account-level Workers AI usage; no in-app quota UI |
| WAI-4 | Local `wrangler dev` hits remote Workers AI (billable) | Low | Documented in CONTENT_SYNC_AI.md |

**Recommendation:** Treat Workers AI as **production-ready for admin Content Sync**. Do not expand to public chat without abuse budget + eval harness.

---

## 6. Supabase Auth — Google OAuth

### 6.1 What exists

| Layer | Evidence |
|-------|----------|
| Client API | `AuthContext.signInWithGoogle` → `supabase.auth.signInWithOAuth({ provider: "google", redirectTo: origin + "/" })` |
| UI | Login + Register “Continue with Google” behind `isGoogleAuthEnabled()` |
| Flag | `VITE_ENABLE_GOOGLE_AUTH` default **false** (`.env.example`, `features.test.ts`) |
| Rationale in code | Comment: Google provider **disabled on shared Supabase project** → button would error “Unsupported provider” |
| Email/password | Primary path; register confirmation flow handled |

### 6.2 Gaps

| ID | Gap | Severity | Notes |
|----|-----|----------|-------|
| GO-1 | Provider not enabled on `rbibqjgsnrueubrvyqps` | High (product) | Shared with 15+ products — enabling Google is a **project-level** decision, not app-only |
| GO-2 | No redirect allowlist audit for `sports.com.na` in this repo | Medium | Must configure Supabase Auth URL config when enabling |
| GO-3 | Legacy Manus OAuth portal helpers still present | Medium | `client/src/const.ts` `getLoginUrl()` uses `VITE_OAUTH_PORTAL_URL` / `VITE_APP_ID`; still referenced from `main.tsx`, `DashboardLayout`, `_core/hooks/useAuth` — parallel to Supabase Auth |
| GO-4 | No server-side mapping of Google identity → `sportsplatform_users.loginMethod` documented in this wave | Low | Verify upsert path when provider enabled |
| GO-5 | No Apple / Facebook OAuth | Low | Out of scope unless product asks |

**Go-live posture:** Keep `VITE_ENABLE_GOOGLE_AUTH` off until (1) Google provider enabled on shared project with consent of other product owners, (2) redirect URLs include apex + staging, (3) smoke test create/link user row.

---

## 7. Email

### 7.1 What exists

| Path | Reality |
|------|---------|
| Auth emails | Supabase Auth (confirm signup, reset password) — platform does not own templates in this repo |
| Contact fields | Federation/club/athlete `email` columns — **data display / mailto**, not outbound |
| Admin notify | `system.notifyOwner` → Manus/Forge `SendNotification` HTTP (`server/_core/notification.ts`) — **not email**; needs `BUILT_IN_FORGE_API_*` |
| Shared-project Edge | `send-templated-mail` ACTIVE on same Supabase project — **other product**, not referenced by Worker |

### 7.2 What does **not** exist

- No Resend / SendGrid / Postmark / Cloudflare Email Routing / Workers Email binding in this codebase.
- No federation “contact us” mailer, digest mailer, or invite email owned by sports platform.
- No POPIA marketing-mail consent pipeline (WhatsApp consent column is the only related prep).

### 7.3 Gaps

| ID | Gap | Severity | Notes |
|----|-----|----------|-------|
| EM-1 | No product transactional email | High (if product needs it) | Choose provider; Worker or Edge sender; templates |
| EM-2 | Auth email branding/custom SMTP not verified in-repo | Medium | Supabase dashboard concern |
| EM-3 | `notifyOwner` depends on Forge keys rarely set | Low | Dead for production ops unless secrets filled |
| EM-4 | Docs imply WhatsApp/email marketing readiness | Medium | Align Privacy copy with actual channels |

**Recommendation:** For soft beta, rely on Supabase Auth mail only. Do not claim email digests. If ops alerts needed, use Cloudflare observability / external paging — not Forge leftovers.

---

## 8. Push notifications (Web Push / PWA)

### 8.1 What exists

| Item | Evidence |
|------|----------|
| PWA plugin | `vite-plugin-pwa` in `vite.config.ts` — manifest, workbox precache, image runtime cache, `registerType: "autoUpdate"` |
| UI | `PWAInstallBanner`, `OfflineBanner`, `MobileBottomNav` |
| Roadmap | `docs/PLATFORM_ROADMAP.md` Phase 8 still checks Web Push as open |

### 8.2 What does **not** exist

| Claimed in SYSTEM_DESIGN | Reality |
|--------------------------|---------|
| `users.pushSubscription` JSON | **No column** in `drizzle/schema.ts` users table |
| `web-push` library | **Not** in `package.json` dependencies |
| VAPID keys / subscribe tRPC | Absent |
| Service worker `push` event handler | Not implemented (Workbox caching only) |

### 8.3 Gaps

| ID | Gap | Severity | Notes |
|----|-----|----------|-------|
| PU-1 | No subscription storage or send path | Critical (vs design) | Schema + tRPC + SW + VAPID secrets |
| PU-2 | Roadmap / SYSTEM_DESIGN overclaim | Medium | Relabel as future |
| PU-3 | iOS Web Push constraints undocumented | Low | Needs HTTPS + Add to Home Screen notes for NA mobile |

**Recommendation:** Ship PWA as **install + offline shell** only. Defer Web Push until WhatsApp strategy is decided (avoid dual notification stacks without product priority).

---

## 9. Edge Functions inventory

### 9.1 In this repository (`supabase/functions/`)

| Slug | Files | Purpose | Deployed on `rbibqjgsnrueubrvyqps`? |
|------|-------|---------|-------------------------------------|
| `news-aggregator` | `index.ts`, `rss.ts`, `googleNews.ts` | RSS → Claude classify → `sportsplatform_news_articles`; auto-publish trusted sports desks | **YES** — ACTIVE, version **12**, `verify_jwt: false` |
| `whatsapp-webhook` | `index.ts` | Meta verify + inbound stub | **NO** — not in live function list |

### 9.2 Live ops — `news-aggregator`

| Control | Value |
|---------|-------|
| Kill-switch | `ENABLE_NEWS_AGGREGATOR=true` required |
| Secrets | `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `ANTHROPIC_API_KEY` |
| Cron | `pg_cron` job **`invoke-news-aggregator`**, schedule `0 */6 * * *`, **active=true** |
| Docs | `docs/research/NAMIBIAN_SPORTS_NEWS_SOURCES.md` |

### 9.3 Other ACTIVE Edge Functions on shared project (not this app)

The Supabase project hosts many functions belonging to **other products**. Do **not** call, redeploy, or assume ownership. Snapshot 2026-07-25 (names only):

`cricket-ai-query`, `player-research`, `cricsheet-import`, `invite-user`, `dashboard-stats`, `admin-create-user`, `attendees-import`, `speakers-import`, `registration-batch-approve`, `event-landing-page`, `admin-manage-org`, `admin-update-user`, `send-templated-mail`, `set-user-password`, `event-register`, `payment-config-save`, `payment-buddy-init`, `payment-buddy-webhook`, `payment-buddy-return`, `ticket-public-view`, `invoice-download`, `payment-adumo-init`, `payment-adumo-webhook`, `payment-adumo-return`, `ics-import`, `ics-export`, `notify-event`, `event-invite`, `exhibitor-register`, `contact-enquiry`, `signup-waitlist`, **`news-aggregator`** (sports).

**Risk:** Shared project + shared secrets culture. Sports platform must only deploy/update functions under `supabase/functions/` in **this** repo, with explicit project-ref and no unscoped DDL.

### 9.4 Edge gaps

| ID | Gap | Severity | Notes |
|----|-----|----------|-------|
| EF-1 | `whatsapp-webhook` undeployed | High | Blocks Meta callback even for stub testing |
| EF-2 | `docs/03_api_and_integrations.md` lists WhatsApp webhook as if cron-paired | Medium | Stale |
| EF-3 | News aggregator uses service_role on shared DB | Medium (ops) | Acceptable for Edge; keep kill-switch; never broaden table scope |
| EF-4 | No CI deploy for Edge Functions from Worker Builds | Medium | Manual `supabase functions deploy` (documented) |
| EF-5 | `verify_jwt=false` on news-aggregator | Accepted | Compensated by secret + cron vault key; do not expose without kill-switch |

---

## 10. Feature flags & kill-switches (source of truth)

| Flag | Default | Controls | Wired? |
|------|---------|----------|--------|
| `VITE_SHOW_WHATSAPP_SUBSCRIBE` | off | Fed Home CTA | Yes |
| `WHATSAPP_API_ENABLED` (const) | **false** | All `whatsapp.*` procedures | Yes (hard) |
| `ENABLE_WHATSAPP_SUBSCRIBE` (Worker env) | unset/off | Documented API open | **No** — unused by router |
| `VITE_SHOW_AI_CHAT` | off | Floating assistant | Yes |
| `ANTHROPIC_API_KEY` | often unset (Worker) | `ai.*` + Content Sync Phase 2 | Yes when set |
| `ENABLE_CONTENT_SYNC` | **ON** | Admin Content Sync | Yes |
| Workers AI binding | present | Content Sync Phase 1 | Yes |
| `VITE_ENABLE_GOOGLE_AUTH` | off | Google buttons | Yes |
| `ENABLE_NEWS_AGGREGATOR` | must be `true` | Edge inserts | Yes (ops set) |

---

## 11. Priority backlog (integrations only)

### P0 — honesty / safety (before flipping any flag)

1. **WA-1 / WA-3** — Do not re-enable WhatsApp API without Meta opt-in + send path or explicit “store only” product decision.
2. **GO-1** — Keep Google flag off until shared-project provider decision.
3. **Doc sync** — Align `SECURITY.md` WhatsApp section with hard-disable reality; fix SYSTEM_DESIGN notification-dispatcher claim.

### P1 — production value already partially shipped

4. Monitor `news-aggregator` cron health + Anthropic Edge spend.
5. Confirm Worker Workers AI binding on apex deploy; Content Sync smoke as admin.
6. Decide whether Worker `ANTHROPIC_API_KEY` is required this quarter (chat vs Edge-only).

### P2 — product integrations

7. WhatsApp Cloud API + dispatcher + deployed signed webhook.
8. Google OAuth enablement ceremony on shared Supabase + redirect allowlist + remove/replace Manus `getLoginUrl` dead path.
9. Transactional email provider (if digests/invites become P0 product).
10. Web Push (schema + VAPID + SW) only after notification channel strategy chosen.

---

## 12. Dependent files (for future re-enable work)

**WhatsApp:** `server/routers/whatsapp.ts`, `server/_core/env.ts`, `server/_core/rateLimit.ts`, `drizzle/schema.ts` (`consentAt`), `client/src/components/WhatsAppSubscribe.tsx`, `client/src/lib/features.ts`, `supabase/functions/whatsapp-webhook/index.ts`, `.env.example`, `docs/governance/SECURITY.md`

**AI:** `server/services/anthropic.ts`, `server/services/contentSyncAi.ts`, `server/routers/ai.ts`, `server/routers/contentSync.ts`, `client/src/components/AIChatAssistant.tsx`, `wrangler.jsonc`

**Auth Google:** `client/src/contexts/AuthContext.tsx`, `client/src/pages/auth/Login.tsx`, `client/src/pages/auth/Register.tsx`, `client/src/lib/features.ts`, legacy `client/src/const.ts`

**Push / PWA:** `vite.config.ts`, future schema + SW push handler (none today)

**Edge:** `supabase/functions/news-aggregator/*`, cron/vault ops in `NAMIBIAN_SPORTS_NEWS_SOURCES.md`

---

## 13. Verdict one-liner

Integrations are **correctly gated for soft beta** (WhatsApp/AI chat/Google off), with **two live AI paths** (Workers AI Content Sync + Anthropic news-aggregator cron); **WhatsApp delivery, Web Push, and product email are design fiction** until explicitly built — and `SECURITY.md` still describes a WhatsApp re-enable path the code does not implement.
