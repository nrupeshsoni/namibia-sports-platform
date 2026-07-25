# Gap Analysis — Performance / Worker / Cloudflare

**Wave:** `gap_wave_20260725`  
**Doc:** `07_performance_infra.md`  
**Date:** 2026-07-25  
**Workspace:** `C:\Projects\The Dome\namibia-sports-platform`  
**Scope:** Bundle size & lazy routes, Hyperdrive, caching headers, service worker / PWA, image sizes, rate limits, Workers AI latency, `ci:gate`, `wrangler.jsonc` bindings  

**DB / config mutations this analysis:** none.  
**Evidence sources:** local `dist/public` build artifacts, `vite.config.ts`, `client/src/App.tsx`, `server/worker.ts`, `server/db.ts`, `server/_core/rateLimit.ts`, `wrangler.jsonc`, Cloudflare MCP (Hyperdrive config + Workers Builds), `docs/CI.md`, `docs/research/SECURITY_CREDENTIAL_ROTATION.md`.

---

## 1. Executive verdict

| Metric | Value |
|--------|------:|
| **Performance / infra score** | **58 / 100** |
| Soft-beta impact | **Medium** — site is usable; first paint / mobile data hurt by JS + image weight |
| National-launch impact | **High** — Hyperdrive still on `postgres` superuser; no HTTP cache strategy for API/assets; ~44 MB static images in Worker assets |
| CI gate | **Fixed in Builds** (latest build uses `npm run ci:gate`) |

### Score breakdown

| Pillar | Score | Weight | Notes |
|--------|------:|-------:|-------|
| Bundle / code-splitting | 48 | 18% | Main JS **~931 KB** raw / **~266 KB** gzip; most public routes eager |
| Hyperdrive / DB path | 55 | 18% | Live + caching on; **origin user still `postgres`**; staging shares prod id |
| HTTP / edge caching | 35 | 12% | Security headers yes; **no Cache-Control / Cache API** on Worker path |
| Service worker / PWA | 72 | 8% | VitePWA + Workbox shipped; sensible precache vs runtime split |
| Image weight | 40 | 16% | **~44 MB** public images; 160 files >100 KB; almost no `srcset`/CDN resize |
| Rate limiting | 70 | 10% | AI / upload / search / contentSync covered; isolate-local only |
| Workers AI latency | 62 | 8% | Bound + used for contentSync; no timeout/telemetry on `AI.run` |
| CI / deploy gate | 85 | 5% | Builds verified `ci:gate` (2026-07-24); local scripts already gated |
| Wrangler bindings hygiene | 60 | 5% | AI + Hyperdrive + ASSETS OK; comments stale; no KV/R2/Rate Limit binding |

**Weighted ≈ 58.** Strongest: CI gate + PWA shell + Hyperdrive connectivity. Weakest: image payload, main-bundle size, absence of cache headers on the Worker-first path.

### One-line decision

Ship soft beta on current Worker infra **only if** Hyperdrive least-privilege rotation stays on the critical path; treat **image compression + route lazy-loading + Cache-Control for hashed assets** as the performance P0s before national marketing.

---

## 2. Bundle size & lazy routes

### Measured (local `dist/public`, post-`vite build`)

| Artifact | Raw | Gzip (level 9) |
|----------|----:|---------------:|
| `assets/index-*.js` (entry) | **930.8 KB** | **265.7 KB** |
| `assets/index-*.css` | 160.9 KB | 23.6 KB |
| `assets/Map-*.js` (lazy) | 158.2 KB | 46.6 KB |
| `assets/Admin-*.js` (lazy) | 42.6 KB | 8.6 KB |
| Fed admin section chunks | ~1–9 KB each | ~0.2–2.6 KB |
| **All Worker assets** | **~45.4 MB** (351 files) | — |

Cloudflare/browser brotli will usually beat gzip slightly; treat **~250–280 KB** compressed JS as the realistic first-navigation JS tax.

### What is lazy today

| Surface | Mechanism | Evidence |
|---------|-----------|----------|
| Platform `/admin` | `React.lazy` | `client/src/App.tsx` |
| `/map` (+ Leaflet) | `React.lazy` | `App.tsx` → `Map-*.js` ~158 KB |
| AI chat widget | `React.lazy` + feature flag | `App.tsx` + `isAiChatEnabled()` |
| Federation **admin** sections | `lazy()` in layout | `FederationLayout.tsx` |

### What is eager (gap)

Eagerly imported into the main graph from `App.tsx` / federation layout:

- `Home`, `Events`, `News`, `Live`
- Auth + legal (`Login`, `Register`, `Privacy`, `Terms`)
- `AthleteProfile`
- `FederationRoute` → `FederationLayout` → **all public federation tabs** (`FederationHome|Events|Clubs|Athletes|News|Streams`) as static imports

**Gap P1 — public federation tabs not code-split.** Visiting any `/federation/:slug` pulls every tab module even if the user only sees Home.

**Gap P1 — core marketing routes not lazy.** `/events`, `/news`, `/live` ride in the main chunk with Home. Acceptable for a small app; at **~266 KB gzip JS** it is already past a healthy mobile budget (~100–150 KB gzip for first route).

### Vite config gaps

| Item | Status |
|------|--------|
| `build.rollupOptions.output.manualChunks` | **Absent** — no vendor split (React / Framer / Radix / tRPC likely sit in `index-*.js`) |
| `chunkSizeWarningLimit` | Default (Vite warns ≥500 KB — entry triggers it) |
| Tree-shaking / lucide | Icon imports appear per-file; still contributes to main weight via many pages |

### Recommendations

1. Lazy-load federation **public** tabs the same way admin tabs are lazy.
2. Lazy-load `Events`, `News`, `Live`, `AthleteProfile`, legal pages (keep `Home` eager).
3. Add `manualChunks` for `react`/`react-dom`, `@trpc`+`@tanstack`, `framer-motion`.
4. Re-measure after split: target **&lt;150 KB gzip** for Home-route JS.

---

## 3. Hyperdrive

### Live config (Cloudflare MCP, 2026-07-25)

| Field | Value |
|-------|-------|
| Id | `dbfcf635ad4a475ba991743b94a5d6a2` |
| Name | `namibia-sports-db` |
| Origin host | `db.rbibqjgsnrueubrvyqps.supabase.co:5432` (direct, correct for HD) |
| Origin **user** | **`postgres`** |
| Origin connection limit | 60 |
| Query caching | **Enabled** (`caching.disabled: false`) |
| Bound in | Production + `env.staging` (same id) |

### Application path (good)

- Worker uses `env.HYPERDRIVE.connectionString` via request-scoped `AsyncLocalStorage` (`server/db.ts`).
- Client never closed per request (correct for Hyperdrive; documented anti-pattern avoided).
- `postgres-js`: `max: 5`, `prepare: false`, `fetch_types: false` — Worker-appropriate.
- List procedures capped via `resolveListLimit` (default 50 / max 200).

### Gaps

| ID | Severity | Gap |
|----|----------|-----|
| **HD-1** | **Critical (security → ops)** | Origin role is still **`postgres`** (`rolbypassrls`). Least-privilege role `sportsplatform_app` exists in docs/SQL but Hyperdrive has not been re-pointed. See `SECURITY_CREDENTIAL_ROTATION.md`. |
| **HD-2** | High | **Staging shares production Hyperdrive id** — blast radius / credential coupling. |
| **HD-3** | Medium | `wrangler.jsonc` comments still say Hyperdrive is a “placeholder / NOT YET CREATED” while a real id is wired — misleads agents. |
| **HD-4** | Low–Med | Hyperdrive **result caching** is on; no documented invalidation story for admin mutations vs cached reads (may be fine for public lists; verify after rotation). |
| **HD-5** | Low | `localConnectionString` is still the literal `<DATABASE_URL_FOR_LOCAL_DEV>` — local `wrangler dev` DB requires human secret, not committed (correct) but easy to miss. |

### Recommendations

1. Complete rotation checklist: password → Hyperdrive update → smoke `federations.list`.
2. Create `namibia-sports-db-staging` Hyperdrive; bind only under `env.staging`.
3. Rewrite stale Hyperdrive comments in `wrangler.jsonc` to match reality.

---

## 4. Caching headers & edge cache

### What the Worker sets today

`server/worker.ts` applies **security** headers (CSP, HSTS, XFO, nosniff, Referrer-Policy, Permissions-Policy) and CORS. It does **not** set:

- `Cache-Control`
- `CDN-Cache-Control` / `Cloudflare-CDN-Cache-Control`
- `ETag` / `Last-Modified` (beyond whatever Assets returns)
- Cache API (`caches.default`) usage

There is **no** `_headers` file and **no** `manualChunks`-related long-cache policy in Vite.

### Request path implications

| Path | Worker role | Cache reality |
|------|-------------|---------------|
| `/api/trpc/*` | Always Worker (`run_worker_first`) | Uncached JSON — correct for auth'd data; public lists also uncached |
| `/sports/*`, `/logos/*`, … | Worker-first for real 404s | Responses pass through Worker → **security headers added**, but **no long-cache Cache-Control** for immutable images |
| SPA HTML / hashed `/assets/*` | Assets binding (SPA fallback) | Cloudflare Assets defaults apply; Worker still wraps many paths when `run_worker_first` matches |

**Gap P0 — hashed JS/CSS should be `public, max-age=31536000, immutable`.** Without explicit headers on the Worker-touched path, browsers/CDNs may under-cache.

**Gap P1 — static sport/logo images lack long-lived cache headers** despite content-addressed-ish filenames (many are stable names like `football.jpg`).

**Gap P2 — no short TTL / SWR for anonymous public tRPC** (`federations.list`, published news). Every Home load hits Hyperdrive. Acceptable at &lt;100 concurrent users; wasteful at launch spikes.

### Recommendations

1. In `withSecurityHeaders` (or a sibling helper), set Cache-Control by path class:
   - `/assets/*` → immutable year
   - `/sports|logos|athletes|venues|icons/*` → `public, max-age=86400` (or 7d) + optional `stale-while-revalidate`
   - HTML / `index.html` → `no-cache` or short max-age
   - `/api/*` → `private, no-store` (or omit)
2. Optionally cache anonymous public queries in Cache API keyed by path+input (invalidate on admin write later).
3. Consider dropping Worker-first for pure static trees **only if** Assets can return proper 404s without SPA HTML — today Worker-first is required for correctness; keep it, add headers.

---

## 5. Service worker / PWA

### Shipped

| Piece | Status |
|-------|--------|
| `vite-plugin-pwa` | Enabled, `registerType: "autoUpdate"` |
| Artifacts in dist | `sw.js`, `registerSW.js`, `workbox-*.js`, `manifest.webmanifest` |
| Precache globs | JS/CSS/HTML/ICO/SVG/WOFF2 + `icons/*.png` only |
| Runtime caching | CacheFirst for remote images + `/sports|logos|athletes|venues|coaches|events/*` images (30d, capped entries) |
| UI | `OfflineBanner`, `PWAInstallBanner` |

### Gaps

| ID | Severity | Gap |
|----|----------|-----|
| **SW-1** | Medium | Precache does **not** include large JPG/PNG under `/sports` etc. (intentional) — first visit still pays full image tax; runtime cache helps only on repeat views |
| **SW-2** | Medium | `navigateFallback: "/index.html"` can interact poorly with Worker-first asset 404 logic offline (edge case) |
| **SW-3** | Low | No explicit offline API strategy (NetworkOnly for `/api/trpc` is implicit/default — good) |
| **SW-4** | Low | Install banner is fine; no update-toast UX when `autoUpdate` swaps SW |

**Verdict:** PWA layer is **above average** for this codebase. Not a launch blocker. Main SW risk is masking stale assets if Cache-Control remains unspecified and Workbox CacheFirst holds 30-day image copies after content replaces same URL.

---

## 6. Image sizes

### Measured (`client/public`, excluding `logos/_candidates`)

| Metric | Value |
|--------|------:|
| Image files | 284 |
| Total image weight | **~43.9 MB** |
| Files &gt;100 KB | **160** |
| Files &gt;300 KB | **47** |
| Files &gt;500 KB | **5** |
| Dist total (all assets) | **~45.4 MB** |

Largest offenders (examples): `sports/HGSleWuAynhF.jpg` (~799 KB), `sports/fWC91d2S3U7T.webp` (~781 KB), `sports/fishing.jpg` (~719 KB), duplicated netball/rugby assets under `sports/` and `athletes/`.

### Delivery gaps

| Gap | Severity | Evidence |
|-----|----------|----------|
| No build-time image pipeline for sport/venue photos | **High** | `sharp` used only for PWA icons (`generate-pwa-icons.mjs`) |
| Almost no `loading="lazy"` / `srcset` / `sizes` | **High** | Spot-check: News cards lazy; Home uses CSS `backgroundImage` (no lazy/decode control) |
| Duplicate binaries | Medium | Same sport images copied across folders |
| Remote Unsplash fallbacks on Home | Medium | Extra third-party latency + CSP already allows `img-src https:` |
| Upload cap 5 MB | OK | `supabaseStorage.ts` — server-side limit exists; does not help static public tree |
| `_candidates` logo research | Low (build) | Stripped from dist via Vite plugin — good |

### Recommendations

1. Batch-compress `/sports`, `/venues`, `/athletes`, `/logos` to WebP/AVIF with max dimension ~1600px; target **&lt;150 KB** per hero, **&lt;40 KB** per card.
2. Deduplicate shared sport images (one canonical path).
3. Prefer `<img decoding="async" loading="lazy">` over CSS backgrounds for below-fold grids.
4. Longer term: move media to Supabase Storage / R2 + on-the-fly transforms; stop shipping megabytes through Worker Static Assets.

---

## 7. Rate limits

### Implemented (`server/_core/rateLimit.ts`)

| Key | Ceiling | Wired to |
|-----|---------|----------|
| `ai.*` | 10 / min | `ai.generateSummary`, `suggestTags`, `chatAssistant` |
| `contentSync.*` | 10 / min (user **and** IP) | contentSync suggest/create |
| `upload.image` | 20 / min | `upload.image` |
| `search.global` | 30 / min | `search.global` |
| `whatsapp.*` | 5 / min | **Defined but not enforced** — API hard-disabled |

### Architecture limits (documented, intentional)

- Counters are **per-isolate memory**, not global.
- No Cloudflare **Rate Limiting** binding / WAF custom rule in `wrangler.jsonc`.
- Fine as a cost fuse; **not** a hard abuse guarantee under multi-isolate load.

### Gaps

| ID | Severity | Gap |
|----|----------|-----|
| **RL-1** | Medium | No rate limit on expensive **public list** fan-out beyond search (`federations.list`, news, events) |
| **RL-2** | Medium | Auth endpoints (Supabase-hosted) not Worker-limited — rely on Supabase; OK if documented |
| **RL-3** | Low | `RATE_LIMITS.whatsapp` + `docs/governance/SECURITY.md` imply wired limits; `whatsapp.ts` uses `WHATSAPP_API_ENABLED = false` and never calls `enforceRateLimit` — doc/code drift |
| **RL-4** | Low–Med | No global CF Rate Limit binding for `/api/trpc/*` |

### Recommendations

1. Before re-enabling WhatsApp: wire `enforceRateLimit` + auth/Meta proof (already called out in security docs).
2. Add light IP limits on unauthenticated list procedures if launch traffic spikes.
3. For hard ceilings: Cloudflare Rate Limiting binding or WAF rate rules (preferred over growing in-memory Maps).

---

## 8. Workers AI latency

### Configuration

| Item | Value |
|------|-------|
| Binding | `ai.binding = "AI"` (prod + staging) |
| Consumer | `server/services/contentSyncAi.ts` |
| Model | `@cf/meta/llama-3.1-8b-instruct` |
| Fallback | Anthropic `claude-sonnet-4-6` (30 s SDK timeout) if `AI` missing + secret set |
| Caps | `max_tokens: 1024`; Zod max 12 suggestions; rate limit 10/min |

Platform chat (`ai.*`) uses **Anthropic only**, not Workers AI — separate latency/cost path; UI gated by `VITE_SHOW_AI_CHAT`.

### Gaps

| ID | Severity | Gap |
|----|----------|-----|
| **AI-1** | Medium | **No timeout / AbortSignal** around `env.AI.run` — Worker can approach wall-time limits on slow inference |
| **AI-2** | Medium | **No latency metrics** (Workers Observability is on, but no custom timing logs around AI) |
| **AI-3** | Low | Cold-start + EU model routing unknown for Namibia users; admin-only so UX impact is limited |
| **AI-4** | Low | Structured JSON from 8B model can fail parse → retries burn quota; no circuit breaker |
| **AI-5** | Info | Chat assistant still depends on `ANTHROPIC_API_KEY`; unset → 500s if flag enabled |

### Recommendations

1. Wrap `AI.run` with `AbortSignal.timeout(15_000)` (or Promise.race) and map to friendly tRPC error.
2. Log `{ provider, model, ms, ok }` for contentSync.
3. Keep contentSync admin-only + kill-switch (`ENABLE_CONTENT_SYNC`) — already good.

---

## 9. `ci:gate`

### Definition (`package.json`)

```text
ci:gate = check (tsc) && test (vitest) && build (vite)
```

Local deploy scripts:

- `cf:deploy` / `cf:deploy:staging` → run `ci:gate` then `wrangler deploy`

### Cloudflare Workers Builds (MCP, latest success 2026-07-24)

| Field | Value |
|-------|-------|
| Worker | `namibia-sports-platform` (`27078facc5ee495db6dfbbefa6df4aa8`) |
| Build command | **`npm run ci:gate`** |
| Deploy command | `npx wrangler deploy` |
| Outcome | success |

**Update vs `docs/CI.md` (2026-07-23 note):** dashboard previously ran `npm run build` only. **As of 2026-07-24 the gate is live in Builds.** Treat the “still on build-only” instruction in `docs/CI.md` as **stale — needs a one-line refresh**, not an open infra blocker.

### Residual CI gaps

| ID | Severity | Gap |
|----|----------|-----|
| **CI-1** | Low | No bundle-size budget step inside `ci:gate` (e.g. fail if entry JS &gt; 300 KB gzip) |
| **CI-2** | Low | No Lighthouse / Web Perf CI |
| **CI-3** | Low | Staging deploy path exists but staging Hyperdrive coupling remains (see HD-2) |
| **CI-4** | Info | `cf:dryrun` still `build` only (no tests) — intentional for speed |

---

## 10. `wrangler.jsonc` bindings inventory

| Binding / config | Present | Notes / gap |
|------------------|---------|-------------|
| `main` → `server/worker.ts` | Yes | Correct entry |
| `assets` → `ASSETS` / `dist/public` | Yes | SPA `not_found_handling` |
| `run_worker_first` | Yes | `/api/*` + static trees — required for asset 404s |
| `hyperdrive` → `HYPERDRIVE` | Yes | Real id; origin user **postgres** (HD-1) |
| `ai` → `AI` | Yes | contentSync Phase 1 |
| `vars.SUPABASE_URL` | Yes | Non-secret |
| Secrets (documented) | External | `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `ANTHROPIC_API_KEY` |
| Feature vars | Optional | `ENABLE_WHATSAPP_SUBSCRIBE`, `ENABLE_CONTENT_SYNC` |
| `observability.enabled` | Yes | Good |
| `limits.subrequests` | 50 000 | Paid-plan headroom |
| `compatibility_flags` | `nodejs_compat` | Needed for ALS + postgres-js |
| Custom domain route | `sports.com.na` | Apex bound |
| `env.staging` | Yes | workers.dev; **same Hyperdrive id**; empty `routes` (correct inheritance guard) |
| KV / R2 / Queues / D1 / DO | **No** | No edge cache store / job queue yet |
| Rate Limiting binding | **No** | Relies on in-memory limiter |
| `limits.cpu_ms` | Unset | Deliberate (comment) |

### Comment / docs drift inside wrangler

- Lines ~48–61 still describe Hyperdrive as uncreated placeholder; contradicted by live id + MCP origin.
- Staging comment still says API fails until Hyperdrive filled — **outdated** (shared id is filled).

---

## 11. Consolidated gap register

| ID | Area | Severity | Summary | Effort |
|----|------|----------|---------|--------|
| **HD-1** | Hyperdrive | **Critical** | Origin role still `postgres` | Human / ops |
| **IMG-1** | Images | **High** | ~44 MB static images; 160 &gt;100 KB | Content + script |
| **JS-1** | Bundle | **High** | Main JS ~266 KB gzip; public routes eager | Frontend |
| **CACHE-1** | Headers | **High** | No Cache-Control strategy on Worker responses | Worker |
| **HD-2** | Hyperdrive | High | Staging shares prod Hyperdrive | Infra |
| **JS-2** | Bundle | Medium | No `manualChunks` vendor split | Frontend |
| **JS-3** | Bundle | Medium | Federation public tabs not lazy | Frontend |
| **CACHE-2** | API | Medium | Public tRPC always hits DB | Worker |
| **AI-1** | Workers AI | Medium | No timeout on `AI.run` | Backend |
| **RL-1** | Rate limit | Medium | Public lists uncapped | Backend |
| **SW-1** | PWA | Medium | First-visit image tax unchanged by SW | Content |
| **DOC-1** | Docs | Low | `CI.md` Builds command note stale; wrangler Hyperdrive comments stale; SCALE still Netlify | Docs |
| **RL-3** | Docs/code | Low | WhatsApp rate-limit docs vs hard-off router | Docs |
| **CI-1** | CI | Low | No bundle budget in `ci:gate` | CI |

---

## 12. Prioritized action plan

### P0 (before / during credential rotation week)

1. **HD-1** — Point Hyperdrive at `sportsplatform_app`; rotate `postgres` / service_role.
2. **CACHE-1** — Add path-based `Cache-Control` for `/assets/*` and static image trees.
3. **IMG-1** — Compress top 50 images; kill obvious duplicates.

### P1 (soft-beta polish)

4. **JS-1 / JS-3** — Lazy public federation tabs + Events/News/Live.
5. **JS-2** — Vendor `manualChunks`.
6. **HD-2** — Separate staging Hyperdrive.
7. **AI-1** — Timeout + timing logs for Workers AI.

### P2 (scale)

8. **CACHE-2** — Cache anonymous public reads (Cache API or Hyperdrive-aware TTLs).
9. **RL-1** — Broader public rate limits or CF WAF rules.
10. **CI-1** — Bundle-size assertion in `ci:gate`.
11. Refresh `docs/CI.md`, wrangler comments, `SCALE_CONSIDERATIONS.md` (Netlify → Workers).

---

## 13. What is already in good shape

- Single Worker serves SPA + tRPC with `run_worker_first` correctness for asset 404s.
- Security header baseline + CORS allowlist.
- Hyperdrive connectivity verified historically; query caching enabled.
- Request-scoped DB client (no CONNECTION_DESTROYED footgun).
- List query limits (50/200).
- Cost-aware rate limits on AI, upload, search, contentSync.
- PWA precache scoped to shell (not entire 44 MB image tree).
- `logo _candidates` stripped from dist.
- Map/Admin/AI chat code-split.
- Workers Builds runs full **`ci:gate`** (verified 2026-07-24).
- Observability enabled; subrequest limit raised.

---

## 14. Score rationale (why 58, not lower/higher)

- **Not &lt;45:** CI gate fixed, Hyperdrive live, PWA present, rate limits on paid paths, Worker architecture sound.
- **Not &gt;70:** Superuser Hyperdrive origin remains; first-load JS + image weight are launch-hostile on Namibian mobile data; zero Cache-Control engineering on the Worker path.

---

## 15. Evidence index

| Claim | Where |
|-------|-------|
| Main bundle sizes | Local `dist/public/assets/index-*.js` (+ node gzip) |
| Lazy vs eager routes | `client/src/App.tsx`, `FederationLayout.tsx` |
| PWA config | `vite.config.ts` VitePWA block; dist `sw.js` |
| Worker headers / routing | `server/worker.ts` |
| DB / Hyperdrive client | `server/db.ts`, `server/_core/env.ts` |
| Hyperdrive origin user | MCP `hyperdrive_config_get` → `user: postgres` |
| Rate limits | `server/_core/rateLimit.ts` + router call sites |
| Workers AI | `server/services/contentSyncAi.ts`, `wrangler.jsonc` `ai` |
| Builds command | MCP `workers_builds_get_build` UUID `0ef69976-…` → `npm run ci:gate` |
| Image totals | Walk of `client/public` (excl. `_candidates`) |
| Credential / HD runbook | `docs/research/SECURITY_CREDENTIAL_ROTATION.md` |

---

*End of `07_performance_infra.md`.*
