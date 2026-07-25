# 15 — Routes / Dead Code / Static Fallbacks

**Wave:** `gap_wave_20260725`  
**Date:** 2026-07-25  
**Scope:** `client/src/App.tsx` routes, page inventory, static `federations.ts` fallback, Register CTAs, `club_manager` role, orphaned components  
**Verdict:** **PARTIAL** — core public + federation routes are wired; product CTAs over-promise; several scaffold components and one RBAC enum value are dead; static federation fallback is intentional but thin and ID-fragile.

---

## 1. Executive summary

| Area | Status | Severity if left |
|------|--------|------------------|
| App.tsx public + auth + admin routes | Wired | — |
| Federation public + admin sub-routes | Wired via `FederationRoute` → `FederationLayout` | Low (unknown admin section = blank) |
| Orphan *pages* under `client/src/pages/` | **None** — all page modules are reachable | — |
| Orphan *components* (scaffold) | **4 clusters** unused | Low (bundle noise / confusion) |
| Static `federations.ts` fallback | Used only on Home API **error** | Medium (wrong offline catalogue) |
| Home “Athlete Registration” → `/register` | **CTA mismatch** | Medium (UX honesty) |
| `club_manager` role | Enum + `users.clubId` only; not assignable | Low (docs/marketing drift) |
| Missing public directory routes | No `/athletes`, `/clubs`, `/coaches`, `/venues`, `/schools` indexes | Medium (product / SEO) |

---

## 2. Route inventory (`client/src/App.tsx`)

### 2.1 Declared routes

| Path | Component | Notes |
|------|-----------|-------|
| `/` | `Home` | Eager |
| `/athletes/:slug` | `AthleteProfile` | Detail only — **no** `/athletes` index |
| `/events` | `Events` | List; deep-link uses query `?slug=` (not `/events/:slug`) |
| `/news` | `News` | List |
| `/news/:slug` | `News` | Same page; slug selects article |
| `/live` | `Live` | Always routable; nav gated by inventory / `VITE_SHOW_LIVE_NAV` |
| `/map` | `Map` (lazy) | Leaflet + `MapRegionPanel`; Home regions → `/map?region=` |
| `/privacy` | `Privacy` | Legal |
| `/terms` | `Terms` | Legal |
| `/login` | `Login` | Auth |
| `/register` | `Register` | Auth (generic account, not athlete profile) |
| `/admin` | `Admin` (lazy + ErrorBoundary) | Platform admin; UI gated `role === "admin"` |
| `/federation/:slug` | `FederationRoute` | Public shell |
| `/federation/:slug/admin` | `FederationRoute` | Fed admin dashboard |
| `/federation/:slug/admin/:section` | `FederationRoute` | Fed admin section |
| `/federation/:slug/{events,clubs,athletes,news,streams}` | `FederationRoute` | Public tabs |
| `/404` | `NotFound` | Explicit |
| `*` (default) | `NotFound` | Catch-all |

`FederationRoute` only extracts `slug` and renders `FederationLayout` (`FederationShell`). Tab / admin section parsing lives in `FederationLayout.tsx`.

### 2.2 Federation admin sections (layout-internal)

From `FedAdminLayout` `ADMIN_TABS` + `FederationLayoutInner` switch:

| Section path | Page module |
|--------------|-------------|
| (empty) | `FedAdminDashboard` |
| `events` | `FedAdminEvents` |
| `clubs` | `FedAdminClubs` |
| `athletes` | `FedAdminAthletes` |
| `coaches` | `FedAdminCoaches` |
| `news` | `FedAdminNews` |
| `streams` | `FedAdminStreams` |
| `media` | `FedAdminMedia` |
| `hp-programs` | `FedAdminHpPrograms` |

**Gap:** Unknown `admin/:section` values render the admin chrome with **empty children** (no NotFound). Low severity.

### 2.3 Public federation tabs

| Tab | Page | Inventory-gated? |
|-----|------|------------------|
| Home | `FederationHome` | No |
| Events | `FederationEvents` | No |
| Clubs | `FederationClubs` | Yes (`federationPublicTabs`) |
| Athletes | `FederationAthletes` | Yes |
| News | `FederationNews` | Yes |
| Streams | `FederationStreams` | Yes |

Empty gated tabs redirect public users to `/federation/:slug`. Admins / auth-loading see all tabs.

### 2.4 Chrome vs routes

| Surface | Links | Gaps |
|---------|-------|------|
| `NavDrawer` | `/`, `/events`, `/news`, `/live` (conditional), `/map`, `/admin` (platform admin only), `/login` | No Register CTA in drawer |
| `MobileBottomNav` | `/`, `/events`, `/news`, `/live` (conditional), `/#federations` | No `/map`, no `/register` |
| `SeoHead` | Meta for hubs + auth noindex | Aligns with App routes |
| Sitemap (`scripts/generate-sitemap.mjs`) | Hubs + fed/news/athlete slugs; omits `/live`, `/login`, `/register`, `/admin` | By design for Live/auth |

### 2.5 Stale design docs (route fiction)

These are **not** App routes today:

- `docs/design/COMPLETION_SUMMARY.md`: `/admin/federations`, `/admin/clubs`, `/admin/athletes`, `/admin/events` (Admin is a single `/admin` tabbed SPA).
- `docs/design/NETLIFY_DEPLOYMENT.md`: `/admin/events` + Netlify hosting (dead stack; Worker is live).
- `docs/development/CURSOR_QUICKSTART.md`: describes `ProtectedRoute.tsx` / `AuthHeader.tsx` with `club_manager` — **files do not exist**.

---

## 3. Pages audit — unused vs missing

### 3.1 All page files under `client/src/pages/` (38)

**Reachable (no orphan pages):**

- Top-level: `Home`, `Events`, `News`, `Live`, `Map`, `Admin`, `NotFound`
- Auth: `Login`, `Register`
- Legal: `Privacy`, `Terms`, `LegalPageLayout`
- Athletes: `AthleteProfile`
- Federation public: `FederationRoute`, `FederationLayout`, `FederationHome`, `FederationEvents`, `FederationClubs`, `FederationAthletes`, `FederationNews`, `FederationStreams`
- Federation admin: `FedAdminLayout`, `FedAdminDashboard`, `FedAdminEvents`, `FedAdminClubs`, `FedAdminAthletes`, `FedAdminCoaches`, `FedAdminNews`, `FedAdminStreams`, `FedAdminMedia`, `FedAdminHpPrograms`
- Platform admin panels: `AdminTables`, `AdminFedScope`, `AdminStatsCards`, `AdminFederationFilter`, `AdminVenuesPanel`, `AdminSchoolsPanel`, `AdminContentSyncPanel`

### 3.2 Missing public product routes (not dead — never built)

| Expected surface | Reality |
|------------------|---------|
| National athletes directory `/athletes` | Only `/athletes/:slug`; discovery via federation / search / sitemap |
| National clubs directory `/clubs` | Fed-scoped `/federation/:slug/clubs` only |
| Coaches public browse | Fed admin CMS only (`…/admin/coaches`); no public coaches tab |
| Venues directory | Home section + `/map`; no `/venues` |
| Schools directory | Platform Admin panel only |
| Event detail `/events/:slug` | Query param on `/events` instead |

---

## 4. Dead / scaffold code (components)

Confirmed **zero import sites** outside their own files (2026-07-25 scan):

| File | Lineage | Recommendation |
|------|---------|----------------|
| `client/src/components/ManusDialog.tsx` | Manus scaffold dialog | Delete or quarantine |
| `client/src/components/DashboardLayout.tsx` | Manus dashboard shell | Delete with skeleton |
| `client/src/components/DashboardLayoutSkeleton.tsx` | Only used by `DashboardLayout` | Delete with parent |
| `client/src/components/AIChatBox.tsx` | Generic chat UI; **not** used by `AIChatAssistant` | Delete or wire; currently dead |
| `client/src/components/Map.tsx` (`MapView`) | Google Maps guide + wrapper | Dead — live map is Leaflet in `pages/Map.tsx` |

**Not dead (flagged elsewhere as incomplete product, but imported):**

- `WhatsAppSubscribe` — behind `isWhatsAppSubscribeEnabled()`
- `AIChatAssistant` — behind `isAiChatEnabled()`; own UI, not `AIChatBox`

---

## 5. Static fallback — `client/src/data/federations.ts`

### 5.1 Intent (documented in file header)

- **FALLBACK-ONLY** curated subset (~13 bodies).
- Canonical source: Supabase `sportsplatform_federations` via `federations.list` / `getBySlug`.
- Must **not** expand toward DB parity; prefer migrations.

### 5.2 Call sites

| Consumer | Usage |
|----------|--------|
| `Home.tsx` | Imports `federations as staticFederations`; on `federations.list` **error** only → `setFederations(staticFederations)` |
| `FederationModal.tsx` | Type `Federation` + `getFederationSlug()` only — not the static array |

### 5.3 Gaps

| Gap | Severity | Detail |
|-----|----------|--------|
| Fallback catalogue ≠ production (~83 active) | Medium | Offline/error Home shows ~13 orgs; user may think platform is tiny |
| Hardcoded numeric `id`s (1, 2, 3, 6, 14, …) | Medium | May not match live PK if seed/order diverged; modal “Visit site” uses slug derivation from **name** when `slug` omitted — static entries mostly **omit** `slug` |
| Fallback only on **error**, not empty success | Low | `fedList.length === 0 && !fedError` leaves `[]` (no static fill) |
| Image paths may be stale | Low | Header already warns; logos live under `client/public/logos/` |
| Dual type model | Low | Home maps tRPC rows → static `Federation` shape for modal reuse — fine, but couples UI to fallback type |

**Keep** the fallback for resilience; **do not** grow it. Prefer honest empty/error UI if list fails in production (banner already sets `error`).

---

## 6. Register CTAs — honesty gap

### 6.1 Entry points to `/register`

| Source | Copy / context |
|--------|----------------|
| `Home.tsx` “ATHLETE REGISTRATION” card | “Register as an **athlete, coach, or official**… access development programs.” → `Link href="/register"` |
| `Login.tsx` | “Register” link — neutral |
| Direct `/register` | Routed |

No Register link in `NavDrawer` / `MobileBottomNav`.

### 6.2 What `/register` actually does

`Register.tsx`:

- Creates a Supabase Auth user (`signUp`) with role default **`user`**.
- Terms + Privacy acceptance required.
- Honest note: federation/club management **cannot** be self-assigned; admin grants `federation_admin` via `users.setRole`.
- Prior dead field (federation `<Select>` never sent to API) removed — comment cites **A13**.
- Does **not** create `sportsplatform_athletes` / coaches / officials rows.

### 6.3 Gap

| Claim (Home CTA) | Reality | Severity |
|------------------|---------|----------|
| Athlete / coach / official registration | Generic community account | **Medium** |
| Access development programs | No post-signup program enrolment flow | Medium |
| Implied federation affiliation | Explicitly blocked at register (correct) | — (CTA still misleads) |

**Fix options (pick one):**

1. **Honest CTA (smallest):** Rename Home card to “Create account” / “Join the community”; drop athlete/coach/official language.  
2. **Product path:** Post-signup “request athlete profile” or admin invite that creates athlete rows.  
3. **Deep-link:** CTA → federation admin / contact for registration programs (external), keep `/register` for accounts only.

---

## 7. `club_manager` unused role

### 7.1 Where it exists

| Layer | State |
|-------|--------|
| `drizzle/schema.ts` `userRoleEnum` | Includes `club_manager` |
| `users.clubId` column | Comment: “Link to club for club_manager” |
| DB migration / `user_role` enum | Label present (`20260720000030`, `supabase-migration.sql`) |
| `users.setRole` Zod | Assignable: `user` \| `admin` \| `federation_admin` only; `clubId` input **rejected** |
| Admin UI (`UsersAdminPanel`, `AddUserForm`) | Role dropdown omits `club_manager` |
| tRPC middleware | No `clubManagerProcedure` |
| Club-scoped write policies / routers | **None** |
| Tests | `mediumGuards.test.ts` asserts rejection |

### 7.2 Marketing / docs drift

| Doc | Problem |
|-----|---------|
| `DEPLOYMENT_GUIDE.md` | Lists `club_manager` as ✅ RBAC capability |
| `CURSOR_QUICKSTART.md` | Specs `ProtectedRoute` with `requiredRole: 'club_manager'` |
| `CLAUDE.md` / governance | Correctly marked **Deferred** |

### 7.3 Recommendation

| Option | When |
|--------|------|
| **A — Keep enum, hide marketing** (current code intent) | Before club-tenant MVP; fix `DEPLOYMENT_GUIDE` + quickstart |
| **B — Implement MVP** | `clubManagerProcedure` + `assertSameClub` + club-scoped mutations; then grantable |
| **C — Remove from enum** | Only if sure never needed; costly enum migration on shared DB |

**Wave decision default:** A — honesty pass on docs; leave schema reserved.

---

## 8. Severity-ordered gap list

| ID | Gap | Severity | Evidence | Suggested action |
|----|-----|----------|----------|------------------|
| R1 | Home “Athlete Registration” CTA over-promises | **Medium** | `Home.tsx` ~1002–1015 vs `Register.tsx` | Rewrite CTA copy (or build athlete signup) |
| R2 | Static fallback IDs/slugs diverge from DB | **Medium** | `data/federations.ts` 13 rows, mostly no `slug` | Keep tiny; add real `slug`s matching DB **or** error UI without fake grid |
| R3 | No public national directories (athletes/clubs/coaches/venues/schools) | **Medium** | App.tsx route table | Product backlog; search/sitemap partially cover athletes |
| R4 | Dead scaffold components (Manus/Dashboard/AIChatBox/MapView) | **Low** | Import scan | Delete in cleanup PR |
| R5 | `club_manager` in enum + marketing as live | **Low** | schema + `DEPLOYMENT_GUIDE` | Docs honesty; keep enum |
| R6 | Unknown fed-admin section → blank | **Low** | `FederationLayoutInner` | Render NotFound / redirect to admin home |
| R7 | Stale design docs invent `/admin/*` child routes | **Low** | `docs/design/*` | Mark superseded or fix |
| R8 | Quickstart references missing `ProtectedRoute` / `AuthHeader` | **Low** | `CURSOR_QUICKSTART.md` | Update to AuthContext + Admin/Fed gates |
| R9 | NavDrawer socials → generic facebook.com / twitter.com / instagram.com | **Low** | `NavDrawer.tsx` `SOCIAL_LINKS` | Point to real org accounts or remove |
| R10 | Fallback unused on empty success | **Low** | `Home.tsx` effect | Intentional OK; document |

---

## 9. What is *not* a gap (cleared)

- All `client/src/pages/**` modules are mounted (no orphan page files).
- Platform `/admin` UI requires `role === "admin"` (not login-only).
- Fed admin requires `admin` or matching `federation_admin` + `federationId`.
- `club_manager` is intentionally non-grantable in API + Admin UI.
- Register federation self-assign dead field removed (A13).
- Live nav honesty via inventory / feature flags (route still exists on purpose).

---

## 10. Recommended 48h / P2 actions

**48h (honesty):**

1. Fix Home ATHLETE REGISTRATION copy → account signup language.  
2. Strike `club_manager` from `DEPLOYMENT_GUIDE.md` “ready” checklist.  
3. Optionally add `slug` fields to the 13 static fallback rows matching production slugs (no catalogue expansion).

**P2 (cleanup):**

4. Delete dead scaffolds: `ManusDialog`, `DashboardLayout*`, `AIChatBox`, `components/Map.tsx`.  
5. Unknown admin section → redirect.  
6. Decide club_manager MVP vs permanent hide.  
7. Product: athletes/clubs national indexes if SEO/directory is a launch claim.

---

## 11. Evidence index

| Artifact | Path |
|----------|------|
| Router | `client/src/App.tsx` |
| Fed shell | `client/src/pages/federation/FederationRoute.tsx`, `FederationLayout.tsx` |
| Fed admin tabs | `client/src/pages/federation/admin/FedAdminLayout.tsx` |
| Static fallback | `client/src/data/federations.ts` |
| Home fallback + CTA | `client/src/pages/Home.tsx` |
| Register | `client/src/pages/auth/Register.tsx` |
| Role assign | `server/routers/users.ts`, `client/src/components/admin/UsersAdminPanel.tsx` |
| Feature flags | `client/src/lib/features.ts` |
| Prior gap notes | `docs/research/FULL_GAP_ANALYSIS.md`, `PUBLIC_READY_GAP_ANALYSIS.md` |

---

*Generated for gap wave 2026-07-25 — routes / dead code / static fallbacks.*
