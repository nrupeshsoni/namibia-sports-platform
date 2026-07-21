# Public-Ready Gap Analysis — Master Synthesis

**Agent:** PUBLIC-READY GAP — Agent 15 (SYNTHESIZER)  
**Date:** 2026-07-21 ~12:05 CAT  
**Project:** `rbibqjgsnrueubrvyqps` (EU West) · Workspace `namibia-sports-platform`  
**Bar:** **FULL PUBLIC** national launch (stricter than soft/invite beta)

### Sources (sibling + prior + spot-check)

| Source | Status |
|--------|--------|
| `docs/research/public_ready_data_snapshot.md` (Agent 5 DATA, ~11:50) | ✅ received |
| `docs/research/public_ready_db_snapshot.md` (Agent 4 SCHEMA, ~11:53) | ✅ received |
| `docs/research/FULL_GAP_ANALYSIS.md` + `full_gap_analysis_data.md` (morning) | ✅ baseline |
| `docs/research/SECURITY_CREDENTIAL_ROTATION.md`, `docs/CI.md`, `docs/06_tasks.md` | ✅ |
| Other `public_ready_*.md` siblings (features / security / RBAC / flows / API / FE / ops / legal / perf / CMS / tests) | ❌ not written after ~15 min wait |
| Live SQL re-spot + code greps (`trpc.ts`, routers, `Admin.tsx`, `features.ts`, advisors) | ✅ this agent |

**DB mutations this analysis:** none.

---

## 1. Executive verdict

| Metric | Value |
|--------|------:|
| **FULL PUBLIC launch score** | **65 / 100** |
| **Score if live DB + service_role still unrotated** | **≤48** (hard cap) |
| **Go / No-Go** | **NO-GO** for full public national launch |
| Soft / invite public (directory + Big-8) | **Conditional YES** — see §2 |

### Score interpretation (full public bar)

| Band | Meaning |
|------|---------|
| 90–100 | National launch — dense coverage, hardened abuse/legal surface |
| 75–89 | Public OK with known long-tail gaps |
| **60–74** | **← here (65)** Soft public / marketing to hubs only |
| 40–59 | Invite-only |
| &lt;40 | Internal demo |

Morning soft-beta synthesis was **~70/100**. Full-public score is lower because legal is missing, Live/WhatsApp/AI cannot be marketed, crest + hollow-subpage rates remain high, and credential rotation is still an open CRITICAL ops item — even though several code gaps from the morning report have closed (tenancy, AI auth, admin UI role, upload scope, feature flags, SEO seed).

### One-line decision

Ship **soft / invite public** for Home + Events + News + Big-8 federation sites with incomplete features **hidden**; do **not** announce a national public launch until credentials are rotated and crest/hollow gates improve.

---

## 2. Go / No-Go with conditions

### Verdict: **NO-GO** (full public)

| Condition | Required for full public | Soft public |
|-----------|:------------------------:|:-----------:|
| Rotate Postgres password + `service_role` + Hyperdrive origin | **Blocker** | **Blocker** |
| Hyperdrive least-privilege role (not `postgres` superuser) | Strongly required | Required within 48h |
| Keep Live nav gated (0 live / 0 scheduled) | Required | Required |
| Keep WhatsApp UI + AI chat + Google auth flags **off** | Required | Required |
| Crests ≥85% active (today **64%**) | Required | Soft OK with priority crest batch |
| Hollow core-5 ≤15% of active feds (today **31%** / 26 feds) | Required | Soft OK if empty states honest |
| Privacy / Terms (POPIA-facing) pages | Required | Soft OK with draft footer link plan |
| WhatsApp API hardened or route disabled | Required | Soft OK if UI hidden **and** prefer disable procedures |
| Default `limit` on unbound public lists | Required | P1 week-1 |
| Do not claim “live streaming” or “every federation complete” | Required | Required |

**Soft public GO only if:** credential rotation completed **and** feature flags remain default-off **and** marketing copy stays Big-8 / directory scoped.

---

## 3. P0 — must-fix before public (ordered)

1. **Rotate live secrets** — Postgres password, `SUPABASE_SERVICE_ROLE_KEY`, Hyperdrive connection string, Worker secrets. Checklist: `docs/research/SECURITY_CREDENTIAL_ROTATION.md`. Scrub ≠ revoke.
2. **Hyperdrive least-privilege** — replace superuser-class origin with a role limited to `sportsplatform_*` (shared DB). See `docs/CI.md` Security TODO.
3. **Abuse surface: WhatsApp** — `subscribe` / `unsubscribe` / `getSubscriptions` remain `publicProcedure` (phone-only). Either disable routes in production, require auth + Meta opt-in proof, or add signed verify + rate limit. UI flag off is **not** enough if API is reachable.
4. **Broaden rate limits** — AI chat is capped; auth-adjacent + WhatsApp + expensive public mutations still lack limits (`docs/06_tasks.md` still open).
5. **Crest batch (Home perception)** — 30 null logos; priority: NAGU, NKF, BFN, DSN, NSRF, TKD, UFN, PWFN + umbrellas NNSSU / NUFS / TISAN.
6. **Deploy crest/sport/athlete static assets** referenced by DB; keep `_candidates/` out of production (already ignored).
7. **Honesty gate** — do not force `VITE_SHOW_LIVE_NAV`; leave WhatsApp / AI / Google flags unset; avoid “national coverage complete” messaging.
8. **Legal minimum** — ship Privacy + Terms pages (POPIA-aware) linked from footer before broad marketing crawl/ads.

---

## 4. P1 — week-1

1. Default `.limit()` + pagination on `clubs` / `athletes` / `coaches` / `streams` / `events` (when limit omitted) / `venues` / `hpPrograms`.
2. Default-filter `venues.list` / `getById` and `hpPrograms.list` to `is_active = true` (Agent 4: would leak if inactivated).
3. Index migration: 7 unindexed FKs + `media(entity_type, entity_id)` + streams scheduled partial.
4. NBF athletes (Big-8 hole) + club contacts for NFA / NRU / CN (contacts ~18% where clubs exist).
5. Cut hollow core-5 from **26 → ≤12** (min 1 club + 1 news, or hide empty tabs).
6. External API timeouts (Anthropic, WhatsApp); magic-byte sniff on uploads.
7. Refresh stale `docs/04_features_audit.md` + `docs/06_tasks.md` (WhatsApp/AI/Admin/Upload rows wrong).
8. Align remaining Netlify-centric docs (`CLAUDE.md` / SCALE) to Cloudflare Workers (`docs/CI.md` is authoritative).
9. Expand sitemap beyond 5 hub URLs (at least Big-8 federation slugs + top news).
10. Page-level error boundaries + submit loading locks on admin forms.

---

## 5. P2 — later

1. Brand colors for remaining 36 actives; websites for 28; 10 contact-dark orgs.
2. Full club directory for all federations; coaches depth beyond ~16 feds.
3. Seed ≥1 verified scheduled live stream **or** keep Live permanently inventory-gated.
4. `club_manager` role: implement MVP or remove from marketing / enum docs.
5. Schools / HP rich UX; media gallery as first-class surface.
6. Drizzle: declare FKs; `json` → `jsonb` for HP arrays; reconcile 6 unledgered migration files.
7. Dynamic per-route OG/meta (federation/news); drop `/live` from sitemap while inventory empty.
8. Test suite beyond 3 files (`federationScope`, `rateLimit`, `auth.logout`) — router integration + RLS policy smoke.
9. Schema extensions (`established_year`, city/region) — draft only today.
10. Analytics (Umami) when env ready.

---

## 6. Per-domain scores (full public bar)

| Domain | Score | Weight | Evidence / delta vs morning FULL_GAP |
|--------|------:|-------:|--------------------------------------|
| **Features** | **74** | 10% | CRUD + search + upload + AI + WA routers exist; Live product thin; audit doc stale |
| **Security** | **52** | 18% | RLS/grants strong (0 sportsplatform security advisor hits); **creds unrotated**; Hyperdrive superuser; WA public API; rate limit only on AI |
| **RBAC** | **78** | 10% | `assertSameFederation` fail-closed; `/admin` role-gated; upload scoped; `club_manager` unused |
| **Schema** | **78** | 8% | Agent 4: parity A−, orphans 0, indexes C+, ledger hygiene D+ |
| **Data** | **63** | 12% | Agent 5 live: logos 64%, upcoming 46, hollow core-5 31%, Live VOD-only |
| **Flows** | **68** | 8% | Home/Events/News usable; Big-8 pass; long-tail hollow; Live gated honestly |
| **API** | **70** | 8% | Zod + tenancy improved; unbound lists; WA public; venues/HP active filter gaps |
| **Frontend** | **72** | 8% | Empty states; feature flags; crest initials; App-level EB only |
| **Ops** | **58** | 6% | CF Workers Builds live; Hyperdrive TODO; shared multi-app DB; Netlify doc drift |
| **Integrations** | **55** | 4% | WA 0 subs / unverified delivery; AI gated+auth; Google provider off |
| **Legal** | **35** | 4% | No Privacy/Terms/cookie notice pages found |
| **Perf / SEO** | **70** | 2% | robots + static sitemap + OG seed; PWA precache narrowed; sitemap lists empty Live |
| **CMS** | **65** | 1% | Platform Admin + Fed Admin real tRPC; news/streams tabs thinner than entity CRUD |
| **Tests** | **40** | 1% | 3 unit test files; no E2E / router suite |
| **Weighted** | **~65** | 100% | Caps to **≤48** if credentials not rotated |

### Live inventory (re-spot SQL ~12:00 CAT — matches Agent 5)

| Metric | Value |
|--------|------:|
| Active federations / logos | 83 / **53 (64%)** |
| Upcoming published events | **46** |
| Active clubs / athletes / coaches | **165** / **124** / **47** |
| Published news | **73** |
| Streams (live / future scheduled / total) | **0 / 0 / 4** |
| WhatsApp subscriptions | **0** |

Big-8 calendars + logos + clubs + news: **pass**. Residual NBF athletes hole **closed** (2026-07-21 fill → **14** verified KBA/BAL pathway athletes; see `docs/research/hollow_federations_content_fill.md`).

---

## 7. Hide or ship — feature flags

Source of truth: `client/src/lib/features.ts` + `useShowLiveNav`. Defaults are **off / honest**.

| Flag / control | Default | Public launch decision | Rationale |
|----------------|---------|------------------------|-----------|
| `VITE_SHOW_LIVE_NAV` | unset → Live nav from inventory | **HIDE** (do not force `true`) | 0 live / 0 scheduled; 4 VODs only |
| Live route `/live` | always routable | **SHIP as VOD / Recent Coverage** | Honest empty state OK; do not market “Live” |
| `VITE_SHOW_WHATSAPP_SUBSCRIBE` | unset/`false` | **HIDE** | API still public phone-only; 0 delivery proof |
| WhatsApp tRPC procedures | public | **HIDE / disable in prod** until hardened | UI flag ≠ API off |
| `VITE_SHOW_AI_CHAT` | unset/`false` | **HIDE** for launch week | Auth+rate-limit OK, but incomplete product + cost |
| AI `generateSummary` / `suggestTags` | protected | **SHIP for staff CMS only** | Keep out of public chrome |
| `VITE_ENABLE_GOOGLE_AUTH` | unset/`false` | **HIDE** | Provider disabled on shared Supabase project |
| Email/password auth | on | **SHIP** | Signup now handles email confirmation honestly |
| Platform `/admin` | role === `admin` | **SHIP** (staff) | UI + API gated |
| Federation admin sub-routes | role + tenant | **SHIP** (staff) | `assertSameFederation` |
| Schools / HP / Map | present | **SHIP soft** / de-emphasize | Seeded; not hero claims |
| Search (`search.global`) | on | **SHIP** | Per-type limits present |
| Image upload | federationAdmin + scope | **SHIP** (staff) | Tenant assert present |
| `club_manager` capabilities | none | **HIDE from marketing** | Enum only |
| Analytics (Umami) | commented | **HIDE** until env set | — |
| Sitemap `/live` entry | present | **HIDE or demote** until inventory | Avoid crawl of empty Live promise |

---

## 8. 48-hour action plan

| Hour window | Action | Owner | Done when |
|-------------|--------|-------|-----------|
| 0–4 | Rotate DB password + service_role; update Hyperdrive + Worker secrets; smoke `federations.list` on prod | Human / Infra | App returns data; old keys fail |
| 0–4 | Create least-privilege Hyperdrive role (or schedule within 48h with tracked ticket) | Infra | Role used in Hyperdrive config |
| 4–8 | Disable or auth-gate WhatsApp procedures **or** add rate limit + drop `getSubscriptions` by phone | Backend | Anonymous cannot enumerate/spam |
| 4–8 | Confirm prod env: `VITE_SHOW_*` and Google auth **unset** | Infra | Flags off in Workers Builds env |
| 8–16 | Crest batch for Golf / Karate / Badminton / Dance / Surfing / TKD / Ultimate / PWFN + NNSSU/NUFS/TISAN; commit deployable `/logos` | Content | Logos ≥61/83 (≥73%) |
| 8–16 | Deploy static assets; verify no SPA-fallback 200 for missing `/logos/*` | Infra | Real 404 for missing files |
| 16–24 | Draft Privacy + Terms pages + footer links (POPIA-aware skeleton OK) | Frontend / Legal | Pages live |
| 16–24 | Soft-public copy pass: Home/SEO — no “live” / “complete national coverage” claims; demote `/live` in sitemap | Frontend | Messaging honest |
| 24–36 | Default list limits + venues/HP active filters | Backend | No unbounded public lists |
| 24–36 | NBF athletes seed (verified) + 1–2 club contacts for top NFA clubs | Content | Big-8 athletes non-zero |
| 36–48 | Refresh `04_features_audit` + `06_tasks` CRITICAL rows; re-run soft-public smoke (Home, Events, News, 3 Big-8 feds, login, admin denied for user) | Docs + QA | Checklist green |
| 36–48 | Decision gate: **soft public GO** only if P0 #1–#3 closed; else stay invite-only | Product | Written go/no-go |

---

## 9. Closed since morning FULL_GAP (do not re-open as P0)

| Morning finding | Status now |
|-----------------|------------|
| `ai.chatAssistant` public | **Fixed** — `protectedProcedure` + rate limit + size caps |
| `/admin` any logged-in user | **Fixed** — redirects non-admins to `/` |
| Upload unscoped / middleware fail-open | **Fixed** — `assertSameFederation` + required `federationId` |
| Federation middleware sniff fail-open | **Fixed** — role-only middleware; explicit assert at write sites |
| No feature flags for incomplete UX | **Fixed** — Live / WhatsApp / AI / Google flags |
| Missing robots/sitemap/OG | **Seeded** — static hub SEO present |
| Security headers | **Shipped** (CHANGELOG Worker CSP / XFO / etc.) |
| Public PII on athletes/coaches | **Stripped** on public list/get |

---

## 10. Stale docs to correct (agent thrash risk)

| Doc claim | Reality 2026-07-21 |
|-----------|-------------------|
| `04_features_audit`: WhatsApp ❌, AI ❌, Upload ❌, Admin mock, missing Fed layout | Routers/UI exist; flags/hardening pending |
| `06_tasks`: WhatsApp routers pending; rate limit entirely missing | Routers exist; rate limit on AI only |
| CHANGELOG Notes: logos 49/83 | Live **53/83** |
| Soft-beta “70 = go” | Full public bar → **65 / NO-GO** until P0 |

---

## Related artifacts

- `docs/research/public_ready_data_snapshot.md` — content score **63**
- `docs/research/public_ready_db_snapshot.md` — schema/DB **78**
- `docs/research/FULL_GAP_ANALYSIS.md` — morning soft-beta synthesis **~70**
- `docs/research/SECURITY_CREDENTIAL_ROTATION.md` — CRITICAL ops
- `docs/CI.md` — Hyperdrive privilege TODO
- `client/src/lib/features.ts` — hide/ship flags

---

*End of Agent 15 synthesis. No code or DB mutations. Sibling coverage incomplete (only DATA + SCHEMA snapshots arrived); scores for missing domains filled via live code/DB spot-check.*
