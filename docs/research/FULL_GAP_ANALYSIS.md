# Full Gap Analysis — Namibia Sports Platform

**Agent:** SYNTHESIZER  
**Date:** 2026-07-21 (~00:35 CAT)  
**Project:** `rbibqjgsnrueubrvyqps` (EU West) · Workspace `namibia-sports-platform`  
**Sources:**
- Sibling DATA: `docs/research/full_gap_analysis_data.md` (live SQL ~00:28 CAT)
- Prior audit: `docs/research/beta_readiness_data_audit.md` (~00:20 CAT; superseded on counts where DATA differs)
- Checklists: `docs/06_tasks.md`, `docs/04_features_audit.md`
- Spot-checks: tRPC routers, `server/_core/trpc.ts`, Admin UI, RLS migrations `000030`/`000034`, Supabase advisors (0 `sportsplatform_*` lints), live SQL counts

**DB mutations this analysis:** none.

---

## 1. Executive verdict

| Metric | Value |
|--------|------:|
| **Overall score** | **70 / 100** (holds only if credential rotation is in flight; **≤55** if live DB/service_role keys remain unrevolved after scrub) |
| **Beta recommendation** | **Soft / invite-only beta — YES** after **rotate leaked DB + service_role keys**. Broad public “national launch” — **NO** until crests + Live honesty + rate-limit / Hyperdrive least-privilege. |
| Data readiness (live) | ~**74** (DATA agent) |
| Security / RLS write gate | **Cleared** (residual ops/abuse gaps remain) |
| Content gate (Big-8 upcoming) | **Met** |
| Visual / polish gate | **Not met** (30 null crests; hollow Fed subpages) |

### Score breakdown

| Pillar | Score | Weight | Notes |
|--------|------:|-------:|-------|
| Features (product surface) | 72 | 15% | CRUD + news/streams/upload/AI/WhatsApp exist; docs stale; Live product thin |
| Database / schema | 78 | 10% | Soft-merge lifecycle OK; indexes/ON DELETE audit open; schema extensions draft |
| Auth / RBAC | 68 | 12% | Procedures solid; `/admin` UI not role-gated; `club_manager` unused; upload unscoped |
| Security | 55 | 18% | RLS+GRANTs good; **leaked creds scrubbed but must rotate**; Hyperdrive superuser; rate limits; public AI/WhatsApp |
| User flows | 70 | 10% | Home/Events/News usable; long-tail Fed pages hollow; Live gated |
| API | 68 | 10% | Zod mostly present; unbound list queries; WhatsApp auth gaps |
| Frontend | 72 | 10% | Empty states for Fed Clubs/Athletes/News/Events; Admin on real tRPC; page EB thin |
| Ops / integrations | 58 | 8% | CF Workers live vs docs Netlify drift; Hyperdrive credential TODO |
| Data / content | 74 | 7% | Big-8 strong; 49 Fed Clubs empty; Live VOD-only |

**Weighted ≈ 70.** Delta vs evening prior (~58) and ~00:20 audit (~72 data-only): content enrichment landed; platform score pulled down by security/ops residuals that data audits under-weight.

### One-line decision

Ship **invite / soft public beta** for directory + Big-8 calendars/news; do **not** claim Live or complete national coverage until P0 crests and abuse controls land.

---

## 2. Features gaps

Evidence: `docs/04_features_audit.md` (stale in places) vs live `server/routers/*`.

| Feature | Audit status | Reality (2026-07-21) | Gap |
|---------|--------------|----------------------|-----|
| Federation / Clubs / Events / Athletes / Coaches / Venues CRUD | ✅ | ✅ routers + Fed admin UI | Low — polish only |
| News + Live streams CRUD | ✅ | ✅ | Live inventory empty (product gap, not API) |
| WhatsApp subscriptions | ❌ Deferred | **Routers exist** (`whatsapp.ts`) | No OTP/verify; public by phone; delivery pipeline unclear |
| AI (summary / tags / chat) | ❌ Deferred | **Implemented** (`ai.ts`) | `chatAssistant` is **public** → cost abuse |
| Image uploads (Storage) | ❌ Not started | **`upload.image`** + size/type checks | No `federationId` scope on upload procedure |
| Admin dashboard | 🚧 mock | **Real tRPC** (`Admin.tsx` → `listAll`, mutations) | UI role gate incomplete (see Auth) |
| Federation pages | 🚧 incomplete | Layout + empty states shipped | Content hollow for majority of feds |
| Schools / HP UX | thin | Data seeded (50 / 10); no hero product surface | Post-beta |
| Media gallery UX | thin | 61 rows; not a first-class UI | Post-beta |
| Search | not in audit matrix | `search.global` exists with per-type limits | OK |

**Doc debt:** Refresh `docs/04_features_audit.md` — several ❌/🚧 rows are wrong and will mislead agents.

---

## 3. Database gaps

| Gap | Severity | Evidence |
|-----|----------|----------|
| Indexes / ON DELETE FK audit still open | Medium | `docs/06_tasks.md` Phase 1; `SCALE_CONSIDERATIONS.md` unchecked |
| Schema extensions (`established_year`, city/region, IF affiliation) | Low | Draft only: `proposed_federation_schema_extensions.md` |
| `sportsplatform_media` / `schools` public SELECT `USING (true)` | Low–Med | Residual after `000034`; no publish flag |
| Soft-merge lifecycle | Done | `is_active` + `merged_into_slug` (`000017`) |
| Brand colors incomplete | Low | **47/83** (57%); 6 logos without color |
| Hyperdrive uses privileged DB role (bypasses RLS) | High (ops) | Intentional for tRPC; see Security |

**Live inventory (DATA + re-spot SQL):**

| Table / metric | Count |
|----------------|------:|
| Active federations | 83 |
| Logos filled | **53 (64%)** |
| Events published / upcoming | 228 / **50** |
| Clubs active / feds covered | **165** / **34** |
| News published / feds | 73 / 51 |
| Athletes / coaches active | **124** / **47** |
| Venues / media / HP / schools | 42 / 61 / 10 / 50 |
| Streams (live / scheduled / VOD) | 0 / 0 / **4** |

---

## 4. Auth / RBAC gaps

| Gap | Severity | Evidence |
|-----|----------|----------|
| `/admin` only redirects unauthenticated users — **no `role === 'admin'` gate** | **High (UI)** | `Admin.tsx` `useEffect` → `/login` if `!user` only; nav/footer hide link (`Home.tsx`, `NavDrawer.tsx`) but deep-link works. Mutations still server-enforced. CHANGELOG Fixed claim is **overstated**. |
| `federationAdminMiddleware` skips tenant check when `federationId` omitted | **Medium** | `trpc.ts`: check only if `federationId !== undefined`. `upload.image` has **no** `federationId` → any `federation_admin` can upload to any entity path. |
| `club_manager` role unused | Low | Enum exists; no write policies / routers |
| Supabase Auth JWT in tRPC | Working | Features audit still says 🚧 — stale |
| Self-signup always `user` | OK | `.env.example` documents |
| Fed admin sub-routes | OK | `FederationLayout` role + `federationId` match |

---

## 5. Security gaps (severity ordered)

| # | Finding | Severity | Evidence |
|---|---------|----------|----------|
| 1 | **Postgres password + `SUPABASE_SERVICE_ROLE_KEY` were committed; tree scrubbed — keys must still be rotated live** | **Critical** | CHANGELOG [Unreleased] Security; `docs/research/SECURITY_CREDENTIAL_ROTATION.md` |
| 2 | **Hyperdrive / DB credential is superuser-class; bypasses RLS; rotate + least-privilege** | **Critical / High** | `docs/CI.md` Security TODO; Worker Hyperdrive → Postgres |
| 3 | **No rate limiting** on auth, public mutations, AI, WhatsApp | **High** | `docs/06_tasks.md`; no limiter in `server/` |
| 4 | **`ai.chatAssistant` is `publicProcedure`** — unauthenticated Anthropic spend | **High** | `server/routers/ai.ts` |
| 5 | **WhatsApp subscribe/unsubscribe/getSubscriptions public; phone-only identity** | **High** | `whatsapp.ts` — enumeration + spam insert; no Meta opt-in proof |
| 6 | **Upload procedure not federation-scoped** | **Medium** | `upload.ts` + middleware behavior |
| 7 | **`/admin` UI accessible to any logged-in user** | **Medium** | Defense-in-depth fail; API still protects writes |
| 8 | Unbounded public list queries (clubs, athletes, coaches, streams, events without `limit`) | **Medium** | DoS / memory on growth |
| 9 | `media` / `schools` open SELECT | **Low** | Acceptable if no drafts; document |
| 10 | Advisors: **0** lints naming `sportsplatform_*` | — | Residual project-wide advisors are co-tenant noise |

**Cleared (do not re-open as P0):** open PostgREST writes (`000030` + `000034` REVOKE); public draft SELECT leaks on news/events (staff gate in routers + SELECT policies).

---

## 6. User flow gaps

| Flow | Status | Gap |
|------|--------|-----|
| Home → federation directory | Usable | ~36% crest initials (30 null logos) |
| Events calendar | Usable | 50 upcoming; Big-8 all ≥1; **55** feds no upcoming |
| News feed | Strong | 73 w/ images; **32** Fed News empty |
| Live | Honest but empty | Nav gated (`useShowLiveNav`); 4 VODs; 0 live/scheduled |
| Federation home (majors) | OK | Long-tail feels unfinished |
| Fed Clubs / Athletes / News / Events | Empty-state UI ✅ | **49 / 64 / 32 / 18** hollow (active feds) |
| Athlete profile | Present | Depth in ~19 feds only; NBF athletes **0** |
| Platform Admin | Functional for admins | Any user can open shell UI |
| Fed Admin | Role-gated | OK |
| Register → elevate to federation_admin | Manual / ops | No self-serve admin onboarding |
| WhatsApp notify | API stub | No verified end-user journey |
| Map / Schools / HP | Secondary | Not launch-critical |

**Hollow triple (0 clubs + news + athletes):** 28 active (34%). Fully hollow (+0 events): 16 — listed in DATA report.

---

## 7. API gaps

| Gap | Severity | Evidence |
|-----|----------|----------|
| Default `.limit()` missing on clubs / athletes / coaches / streams / events (optional only) | Medium | Grep `server/routers`; news defaults 50; media 100; schools 100 |
| WhatsApp mutations unauthenticated | High | See Security |
| AI public chat | High | See Security |
| External API timeouts (Anthropic, WhatsApp) | Medium | `docs/06_tasks.md` Phase 2 |
| Upload: content-type client-asserted (magic-byte not verified) | Low–Med | `supabaseStorage.ts` trusts `contentType` |
| Zod coverage | Mostly OK | Routers use Zod inputs |
| `auth.logout` is public no-op style | Low | Client signs out via Supabase |

---

## 8. Frontend gaps

| Gap | Severity | Evidence |
|-----|----------|----------|
| Crest / brand polish on Home grid | High (perception) | 30 null logos |
| Hollow Fed subpages despite empty states | Medium | Perception ≠ crash |
| Live page = Recent Coverage only | Medium (honest) | Keep gated |
| Page-level error boundaries | Low–Med | App-level `ErrorBoundary` only (`App.tsx`); tasks still open |
| Loading / double-submit guards | Low | Tasks open |
| Admin news/streams tabs read-only-ish vs CRUD tabs | Low | CRUD_TABS excludes news/streams |
| Static asset deploy | High if CDN miss | Local `/sports/*`, `/athletes/*`, `/logos/*` must ship with Worker assets |
| `docs/04_features_audit` “missing FederationLayout components” | Stale | Components exist |

---

## 9. Ops / integrations gaps

| Gap | Severity | Evidence |
|-----|----------|----------|
| **Hosting docs drift:** CLAUDE / SCALE still Netlify-centric; CI is **Cloudflare Workers Builds** | Medium | `docs/CI.md` vs `CLAUDE.md` / `SCALE_CONSIDERATIONS.md` |
| Hyperdrive connection string / privilege | High | `CI.md` TODO |
| WhatsApp Edge webhook + Business API delivery | Medium | Schema + tRPC; production verify token in `.env.example` |
| Analytics optional / unset | Low | `.env.example` |
| `.env.example` completeness | Low–Med | Tasks still open; file looks reasonably current for CF/Supabase |
| Deploy local logo/sport assets with DB paths | High for visuals | Uncommitted public assets in working tree (git status) |
| SCALE table names outdated (`namibia_na_26_*`) | Low | Doc hygiene |

---

## 10. Data / content gaps

Authoritative live numbers: **`full_gap_analysis_data.md`**. Summary:

### P0 content
1. **30 null federation logos** — umbrellas NNSSU / NUFS / TISAN; Golf, Karate, Badminton, Dance, Surfing, TKD, Ultimate, PWFN, Horse Racing, + emerging long-tail.
2. **Live:** 0 live / 0 scheduled (4 VODs). Keep nav gated or seed ≥1 verified scheduled stream before marketing Live.
3. **Deploy** crest + sport + athlete assets referenced by DB.

### P1 content
4. **49** feds with 0 clubs; club contacts **50%** where clubs exist (improved from 19%).
5. **64** feds with 0 athletes; **Basketball (NBF) athletes = 0** despite Big-8 calendar.
6. **32** feds with 0 news.
7. **18** zero-event actives; **55** with no upcoming.

### P2 / post-beta
8. Brand colors for remaining 36; websites for 28; 10 contact-dark orgs.
9. Schools / HP UX; media gallery; obscure emerging sports.

### Big-8 snapshot (all calendars non-empty)

| Fed | Upcoming | Clubs | News | Athletes | Logo |
|-----|---------:|------:|-----:|---------:|:----:|
| NFA | 3 | 18 | 6 | 16 | ✓ |
| CN | 5 | 10 | 4 | 14 | ✓ |
| AN | 4 | 6 | 5 | 8 | ✓ |
| NHU | 3 | 5 | 1 | 7 | ✓ |
| NBF | 2 | 6 | 1 | **0** | ✓ |
| NASFED | 1 | 10 | 1 | 4 | ✓ |
| NNF | 1 | 8 | 1 | 5 | ✓ |
| NRU | 1 | 11 | 4 | 16 | ✓ |

---

## 11. Prioritized action plan

### Next 48 hours (ship soft beta)

| # | Action | Owner hint | Why |
|---|--------|------------|-----|
| 0 | **Rotate live DB password + service_role** (scrub alone is insufficient) | Human / Infra | CRITICAL — see `SECURITY_CREDENTIAL_ROTATION.md` |
| 1 | **Rotate Hyperdrive DB credential** → least-privilege role on `sportsplatform_*` | Infra | Critical trust |
| 2 | **Rate-limit** public mutations + `ai.*` + WhatsApp + auth-adjacent | Backend | Abuse / cost |
| 3 | Gate **`ai.chatAssistant`** behind auth (or strict IP/token quota) | Backend | Cost |
| 4 | **`/admin` require `role === 'admin'`** (match CHANGELOG claim) | Frontend | Defense-in-depth |
| 5 | Crest batch: Golf / Karate / Badminton / PWFN / Dance / umbrellas NNSSU/NUFS/TISAN | Content | Home looks unfinished |
| 6 | **Commit + deploy** local `/logos`, `/sports`, `/athletes`, `/venues` assets | Content + Infra | Stop 404 heroes |
| 7 | Keep Live nav gated; optional 1 scheduled stream if URL verified | Product | Honesty |
| 8 | WhatsApp: require auth **or** signed verify; stop phone-only `getSubscriptions` | Backend | Privacy |
| 9 | Refresh `docs/04_features_audit.md` + sync `06_tasks` Admin/WhatsApp/AI rows | Docs | Stop agent thrash |

### Next 2 weeks (broaden public beta)

| # | Action | Why |
|---|--------|-----|
| 1 | Default `limit` on all list procedures + pagination | Scale / DoS |
| 2 | Scope `upload.image` with `federationId` + ownership assert | Multi-tenant integrity |
| 3 | NBF athletes + next-tier Fed content (Golf, Volleyball, Tennis, Boxing) | Hollow-page perception |
| 4 | Club contacts for top NFA / NRU / Cricket clubs | Directory usefulness |
| 5 | Events pass 8 / NSC ask for remaining 18 zero-event feds | Calendar breadth |
| 6 | News pass 5 for remaining 32 zero-news feds | Fed News pages |
| 7 | External API timeouts; magic-byte image sniff | Hardening |
| 8 | Align CLAUDE / SCALE docs to Cloudflare Workers | Ops clarity |
| 9 | Index / ON DELETE FK audit | Data integrity |
| 10 | Page-level error boundaries + submit loading locks | UX polish |
| 11 | Decide `club_manager` MVP or remove from marketing | RBAC honesty |

### Explicitly defer

- Full club directory for all 73 federations  
- Brand colors for every remaining crest  
- Schools / HP rich UX  
- Obscure emerging-sport contact research  
- Schema extensions (`established_year`, city/region)  

---

## Cross-doc corrections (stale claims)

| Doc claim | Correction |
|-----------|------------|
| `04_features_audit`: WhatsApp ❌, AI ❌, Upload ❌, Admin mock | All implemented to varying degrees |
| `06_tasks`: Admin still mock | Admin uses real tRPC; **role UI gate still missing** |
| `06_tasks`: WhatsApp routers pending | Routers exist; hardening pending |
| `beta_readiness` clubs 131 / athletes 92 / logos 51 | Superseded: **165 / 124 / 53** |
| CHANGELOG: `/admin` role-gated | Nav gated; **page not** |

---

## Related artifacts

- `docs/research/full_gap_analysis_data.md` — live SQL scorecard  
- `docs/research/beta_readiness_data_audit.md` — prior full data+RLS audit  
- `docs/research/federation_data_gap_list.md` — crest/website detail  
- `docs/06_tasks.md` — master checklist  
- `docs/04_features_audit.md` — needs refresh  
- `docs/CI.md` — Hyperdrive security TODO  

---

*End of synthesis. Backlog-clearance refresh: soft public **87/100**, full national **80/100**, weighted **~86/100**; credential rotation remains a human blocker.*


