# Frontend UX / Mobile / Theme — Gap Analysis

**Wave:** `gap_wave_20260725`  
**Agent:** Frontend UX audit  
**Date:** 2026-07-25  
**Workspace:** `C:\Projects\The Dome\namibia-sports-platform`  
**Scope:** Home, Nav (drawer + bottom), News ticker, Map, Admin, Federation public + fed-admin, light theme consistency, a11y, empty states, broken images, PWA / service-worker cache  
**Method:** Code inspection of `client/src/**`, `vite.config.ts`, `client/index.html`, prior notes in `docs/research/MOBILE_AND_THEME.md`  
**DB / deploy mutations:** none

---

## 1. Executive verdict

| Metric | Value |
|--------|------:|
| **Frontend UX score** | **68 / 100** |
| **Mobile readiness** | **Mostly ready** (safe areas + 44px + bottom nav) — not fully polished |
| **Light theme** | **Chrome shipped; content shells incomplete** |
| **A11y** | **Partial** — labels/touch OK; modal traps & landmarks thin |
| **PWA** | **Installable shell OK; cache/update risks remain** |
| **Launch bar (UX only)** | Soft public **OK** if dark remains default; light mode & Live/Map honesty are polish/P1 |

### One-line decision

Ship soft public on **dark-first** UX. Do **not** market light theme or “interactive venue map” as finished until content surfaces and map markers catch up to chrome tokens.

### Score breakdown

| Pillar | Score | Notes |
|--------|------:|-------|
| Home composition / mobile | 72 | Strong glass hero; mid-page still hardcoded dark |
| Nav (drawer + bottom) | 78 | Solid; Federations hash + Live gating quirks |
| News ticker | 80 | Reduced-motion + image `onError`; light tokens OK |
| Map | 62 | Mobile stack fixed; region-only markers; no venue lat/lng |
| Admin / Fed admin | 58 | Usable desktop; tables + dark-locked fed admin on phones |
| Federation public pages | 70 | Empty states honest; dark-inline cards under light shell |
| Light theme consistency | 48 | Tokens exist; Home/Live/Auth/Fed content ignore them |
| A11y | 55 | Touch targets good; skip-link / focus traps / Escape gaps |
| Empty states | 75 | Public Fed + Events/News/Live covered; `ui/empty` unused |
| Broken images | 60 | Cards/ticker OK; CSS `background-image` + logos often silent-fail |
| PWA / SW | 62 | VitePWA + install banner; CacheFirst images + navigateFallback risks |

---

## 2. What is already in good shape

| Area | Evidence |
|------|----------|
| Theme infrastructure | `ThemeProvider` `switchable` + `localStorage.theme`; `:root` / `.dark` chrome + glass vars in `index.css`; `.theme-page` / `.theme-chrome` |
| Theme toggle placement | Home, Events, News, Map, Admin, Fed hero (`onMedia`), NavDrawer |
| Mobile chrome | `viewport-fit=cover`, safe-area CSS, `touch-target` / 44px rules, `MobileBottomNav`, `main` `pb-[72px]` |
| News ticker | Scroll-reveal, marquee pause on hover, `prefers-reduced-motion` static chips, thumb `onError`, `role="region"` |
| Map mobile layout | `flex-col md:flex-row`, map `min-h-[45vh]`, panel `max-h-[50vh]`; Carto light/dark tiles follow theme |
| Fed public tabs | Inventory-gated hide of empty Clubs/Athletes/News/Streams (`federationPublicTabs`) |
| Empty copy (Fed) | Honest “not published yet” + national calendar CTAs on Home/Events/Clubs/Athletes/News/Streams |
| Image `onError` (partial) | `NewsCard`, `FeaturedNewsCard`, `NewsTicker`, `NewsArticleModal`, Fed Clubs/Athletes/Events posters, AthleteProfile |
| PWA baseline | Manifest + icons, `registerType: "autoUpdate"`, offline banner, install banner above bottom nav |
| Admin role gate (UI) | Redirect non-admins away from `/admin` (server still authoritative) |

---

## 3. Gap register (by surface)

Severity: **P0** launch-blocker for marketed UX · **P1** week-1 polish · **P2** backlog · **OK** no action.

### 3.1 Home (`client/src/pages/Home.tsx`)

| ID | Gap | Sev | Evidence / impact |
|----|-----|-----|-------------------|
| H1 | Mid-page sections force `bg-black` / `text-white` / white-glass rgba (~77 hits) | **P1** | Light mode: page shell lightens; Schedules / Federations / Regions / Stats / Venues / Excellence / Footer stay night-club dark → jarring banded page |
| H2 | Expandable search input hardcodes `text-white` + white-glass panel | **P1** | Unreadable / low-contrast under light chrome |
| H3 | Dual brand signals: header `h1` “NAMIBIA” + hero `h1` rotating titles | **P2** | Multiple `h1`s; SEO/a11y hierarchy muddy |
| H4 | Hero uses Unsplash + one local `/sports/athletics.jpg`; no `onError` (CSS bg) | **P2** | Broken CDN → empty slides; off-brand stock photos |
| H5 | Marketing stats hardcoded (`67`, `500+`, `50K+`) | **P1** | Can contradict live inventory; trust risk |
| H6 | Featured venues (Dome / Cricket) are hardcoded Unsplash cards; DB venues get generic stock bg | **P2** | Not linked to `/map` or venue detail; empty venues list has no dedicated empty UI |
| H7 | Federation grid uses `backgroundImage` with fallback path only at map-time; no runtime broken-image fallback | **P1** | Missing/404 crest/bg → blank tiles |
| H8 | “Athlete Registration” CTA → `/register` (account), not athlete enrolment | **P2** | Misleading copy vs product |
| H9 | Footer social: only Facebook; NavDrawer socials are generic `facebook.com` / `twitter.com` / `instagram.com` | **P2** | Dead/generic brand links |
| H10 | Home search is federation-only; global Cmd+K palette exists but is undiscoverable on mobile | **P2** | Two search systems; mobile users never see palette |

**Status vs prior (`MOBILE_AND_THEME.md`):** Home chrome OK; content-card migration still open.

---

### 3.2 Nav — drawer + bottom bar

| ID | Gap | Sev | Evidence / impact |
|----|-----|-----|-------------------|
| N1 | Bottom “Federations” → `/#federations` | **P1** | Hash scroll unreliable when already on `/` with different scroll, or when client router doesn’t re-trigger hash; often lands on Home top |
| N2 | Bottom nav hidden only for `/login`, `/register`, `/admin*` — still shown on Fed public + Live + Map | **P2** | Crowds Map panel / Fed sticky tabs; OK for product nav, cramped on Map |
| N3 | Live item gated by `useShowLiveNav` (good) but desktop Home pills / drawer share same gate | **OK** | Consistent honesty when flag off |
| N4 | NavDrawer auth footer uses `text-gray-300` / white borders even when `isLight` | **P1** | Light drawer: muted text contrast wrong; border `rgba(255,255,255,0.06)` on light panel |
| N5 | Drawer close has `aria-label`; backdrop click + Escape OK; **no focus trap / restore** | **P1** | Keyboard users tab into page behind drawer |
| N6 | No `aria-expanded` / `aria-controls` pairing menu button ↔ drawer | **P2** | Screen-reader relationship weak (open label only) |
| N7 | Social icons point at platform homepages, not NSC / sports.com.na | **P2** | Same as H9 |

---

### 3.3 News ticker (`NewsTicker.tsx` + CSS)

| ID | Gap | Sev | Evidence / impact |
|----|-----|-----|-------------------|
| T1 | Hidden until `scrollY > 160`; `aria-hidden={!visible}` | **OK** | Intentional; good for hero |
| T2 | When `articles.length === 0`, ticker returns `null` — no “no headlines” chrome | **P2** | Fine; Home news teaser covers empty |
| T3 | Fixed `top: calc(safe-area + 4.25rem)` assumes single header height | **P2** | If search expands on Home, ticker can overlap expanded search bar |
| T4 | Marquee duplicates DOM (a/b segments) — duplicate buttons in a11y tree when visible | **P2** | Screen readers may hear each headline twice |
| T5 | Light/dark ticker bar tokens present (`.news-ticker-bar` / `.dark`) | **OK** | Better than Home mid-page |
| T6 | Reduced-motion path implemented | **OK** | |

---

### 3.4 Map (`Map.tsx` + `MapRegionPanel.tsx`)

| ID | Gap | Sev | Evidence / impact |
|----|-----|-----|-------------------|
| M1 | Markers are **14 region centroids only** — venues never plotted | **P1** | Schema has no `latitude`/`longitude` (grep empty in `drizzle/schema.ts`); product copy “Interactive Map” oversells |
| M2 | Region stats compute venues/events from **already-filtered** lists | **P1** | With a region selected, other regions show `0, 0` in popups — misleading |
| M3 | Leaflet Popup content hardcodes `text-gray-900` (light popup) | **OK/P2** | Readable; not theme-tokenized |
| M4 | Loaders in panel use `text-white` on theme chrome | **P2** | Invisible / low contrast in light mode |
| M5 | Mobile = map above + scroll panel below — not a bottom sheet | **P2** | Usable; prior audit still valid |
| M6 | Zoom + attribution crowding on narrow widths | **P2** | Low |
| M7 | No keyboard alternative to map markers (panel filter only) | **P2** | Panel covers filter need |
| M8 | Theme-aware tiles (`light_all` / `dark_all`) | **OK** | |
| M9 | `leafletReady` defer avoids Suspense remount crash | **OK** | |

---

### 3.5 Admin (`Admin.tsx` + panels)

| ID | Gap | Sev | Evidence / impact |
|----|-----|-----|-------------------|
| A1 | Shell uses `theme-page` / `theme-chrome` + ThemeToggle | **OK** | Header OK in light |
| A2 | Search/Add inputs still `bg-white/5 … text-white` | **P1** | Light admin: fields look broken |
| A3 | Tables (`AdminTables`, venues/schools) are wide desktop tables | **P1** | Horizontal scroll only; no card rows `<md` |
| A4 | 13 horizontal tabs — scrollable, 44px — dense on 320px | **P2** | Acceptable, not polished |
| A5 | Delete confirms / modals dark-styled (`EntityModal` `text-white`) | **P1** | Light mode modal contrast |
| A6 | Bottom nav hidden on `/admin` | **OK** | |
| A7 | No ThemeToggle on nested FedAdmin panels reused inside Admin (inherit page) | **OK** | |

---

### 3.6 Federation public + fed admin

| ID | Gap | Sev | Evidence / impact |
|----|-----|-----|-------------------|
| F1 | Public layout shell `theme-page`; tab chrome theme-aware; **content cards** still dark rgba + `text-white` (`FederationHome` etc.) | **P1** | Light mode: light page bg + dark cards = inconsistent |
| F2 | 404 / Access Denied / skeleton still `bg-[#0a0a0a]` | **P2** | Ignore theme |
| F3 | Fed logo `<img>` has no `onError` → letter fallback | **P1** | Broken crest URLs show broken-image icon |
| F4 | Hero `backgroundImage` CSS — silent fail if URL 404 | **P2** | Falls back to empty dark overlay feel |
| F5 | Public empty states: Events/Clubs/Athletes/News/Streams — **good** | **OK** | |
| F6 | Tab gating hides empty sections for public — admins see all | **OK** | Honesty for hollow feds |
| F7 | `FedAdminLayout` locked `bg-[#0a0a0a]`, no ThemeToggle | **P1** | Light preference ignored entirely in fed admin |
| F8 | Fed admin nav horizontal scroll on mobile | **P2** | Acceptable |
| F9 | Nested `<main>` inside App `<main>` (Fed layout) | **P2** | Invalid landmark nesting |
| F10 | Streams/Live pages dark-only (`bg-[#0a0a0a]`), no ThemeToggle on Live | **P1** | Live is a light-theme dead zone |

---

### 3.7 Light theme consistency (cross-cutting)

| Surface | Chrome tokens | Content / cards | Verdict |
|---------|---------------|-----------------|--------|
| Home header / drawer / bottom nav | Yes | Mid-page No | **Partial** |
| Events | Header Yes | Cards `text-white` + dark glass | **Partial** |
| News | Header Yes | Filters/cards dark-inline | **Partial** |
| Live | No | Fully `#0a0a0a` | **Fail** |
| Map | Header + panel Yes | Loaders white | **Mostly** |
| Admin | Header Yes | Inputs/tables dark-inline | **Partial** |
| Fed public | Tabs Yes | Cards dark-inline | **Partial** |
| Fed admin | No | Dark-locked | **Fail** |
| Auth Login/Register | No | Dark-locked | **Fail** |
| Legal | Mixed (layout tokens + some hardcoded) | — | **Partial** |
| AthleteProfile | No | Dark-locked | **Fail** |
| SearchCommandPalette | Dark command chrome hardcoded | — | **Fail** (light) |
| PWAInstallBanner | Always dark glass | — | **OK** (overlay) |

**Root cause:** Design tokens (`--chrome-*`, `--glass-*`, `.theme-page`) stop at chrome. Feature surfaces still use pre-theme glassmorphism literals (`rgba(255,255,255,0.05)`, `text-white`, `bg-[#0a0a0a]`).

**Missing niceties:**
- No `prefers-color-scheme` initial default when `localStorage` empty (always `defaultTheme="dark"`)
- `theme-color` meta stuck at `#0a0a0a` (does not follow light)
- Global `h1–h6` uppercase + wide letter-spacing in `index.css` affects admin/form headings awkwardly

---

### 3.8 Accessibility

| ID | Gap | Sev | Notes |
|----|-----|-----|-------|
| X1 | No skip-to-content link | **P1** | Fixed header + ticker + bottom nav = long tab path |
| X2 | `FederationModal` — no `role="dialog"`, no Escape, no focus trap, close button lacks `aria-label` | **P0** | Primary federation entry from Home grid |
| X3 | `NewsArticleModal` has dialog semantics; **no Escape handler** visible in component | **P1** | Backdrop click only |
| X4 | Live/Fed stream embed modals — close control weak a11y; no Escape guaranteed | **P1** | |
| X5 | NavDrawer — no focus trap (see N5) | **P1** | |
| X6 | Decorative hero/carousel images lack text alternatives (CSS backgrounds) | **P2** | Expected for bg; ensure visible text covers meaning (mostly does) |
| X7 | Ticker duplicate marquee nodes (T4) | **P2** | |
| X8 | Map markers not in tab order | **P2** | Panel compensates |
| X9 | `prefers-reduced-motion` only on ticker CSS — Framer Motion still animates widely | **P1** | Home/Fed/Events motion ignore reduced-motion |
| X10 | Color contrast: red-on-dark OK; gray-400 on black borderline; light mode white text on light chrome **fails** where hardcoded | **P0** in light | Tied to theme migration |
| X11 | Touch targets generally ≥44px on chrome controls | **OK** | |
| X12 | Form labels: auth + admin forms use Label components in places; Home search input has placeholder only | **P2** | |

---

### 3.9 Empty states

| Surface | Empty UX | Grade |
|---------|----------|-------|
| Home schedules | Icon + copy + link | Good |
| Home federations filter | Clear filters CTA | Good |
| Home venues (DB empty) | Silent — featured hardcoded still show | **Gap** |
| Events | Dedicated empty + clear filters | Good |
| News | “No News Yet” + category reset | Good |
| Live | Soft empty (VODs) vs true empty | Good |
| Map region | “No venues/events in this region” | Good |
| Fed public tabs | Honest hollow copy | Good |
| Fed admin tables | Plain “No X found.” | Adequate |
| Platform Admin tables | “No records found.” | Adequate |
| Shared `ui/empty.tsx` | **Unused** by product pages | Debt |

---

### 3.10 Broken / missing images

| Pattern | Where | Risk |
|---------|-------|------|
| `<img onError>` → hide / fallback | News cards, ticker, athlete photo, fed club/athlete/event posters | **Handled** |
| CSS `background-image` | Home hero, federation tiles, event cards (many), stream thumbs, Fed hero | **Unhandled** — 404 = blank |
| Fallback local paths | `/sports/namibia-football.jpg`, Unsplash URLs | Depend on CDN/public assets deploying |
| Fed logo img | Layout hero — no onError | **Broken icon** |
| PWA CacheFirst remote images 30d | `vite.config.ts` runtimeCaching | Stale/wrong image after CMS replace until expiry |
| Maskable icon reuses 512 “any” | Manifest | May crop poorly on Android |

---

### 3.11 PWA / service worker / cache

| ID | Gap | Sev | Evidence / impact |
|----|-----|-----|-------------------|
| P1 | `navigateFallback: "/index.html"` for SPA | **P1** | Offline navigations to deep links get shell — intentional SPA shell |
| P2 | `navigateFallbackDenylist` for `/api` | **FIXED** (was P0) | See §3.11.1 verification note below |
| P3 | Image `CacheFirst` 30 days, max 100–200 entries | **P1** | Crest/news image updates invisible to returning PWA users |
| P4 | `registerType: "autoUpdate"` | **P2** | Updates quietly; no “New version available — refresh” UX |
| P5 | Precache excludes large jpg under `public/` (good) but runtime still caches them aggressively | **P2** | Storage pressure on low-end Android |
| P6 | Offline banner only checks `navigator.onLine` — not SW cache hit/miss | **P2** | Can show online while tRPC fails |
| P7 | Install banner dark-only; dismiss 7 days | **OK** | Positioned above bottom nav |
| P8 | `theme_color` / `background_color` dark-only in manifest + HTML meta | **P2** | Light-theme installed PWA status bar mismatch |
| P9 | iOS: `apple-mobile-web-app-capable` set; no iOS-specific install guidance (Safari share sheet) | **P2** | Banner relies on `beforeinstallprompt` (Chromium) |

### 3.11.1 PWA navigateFallback / `/api` — verification (2026-07-25)

| Check | Result |
|-------|--------|
| `vite.config.ts` before fix | `navigateFallback: "/index.html"` **without** `navigateFallbackDenylist` |
| Live `https://sports.com.na/sw.js` | `registerRoute(new NavigationRoute(createHandlerBoundToURL("/index.html")))` — **no** denylist/allowlist options |
| Live `GET https://sports.com.na/api/health` with browser navigate headers (`Accept: text/html…`, `Sec-Fetch-Mode: navigate`, Chrome UA) | **200** `application/json` `{"status":"ok",…}` — Worker path OK when SW is **not** controlling the client |
| tRPC / `fetch` to `/api/*` | **Not** matched by `NavigationRoute` (only `mode: "navigate"`). App JSON calls were never HTML-poisoned by this route |
| Real risk | Controlling SW + document navigation to `/api/*` (address bar, some offline navigations) → precached `index.html` instead of API |

**Resolution:** Added `navigateFallbackDenylist: [/^\/api(?:\/|$)/]` in `vite.config.ts`. Ships with next production deploy (new `sw.js`). Until then, live SW still lacks the denylist.

**FederationModal a11y** — left on synthesizer backlog (needs dialog role, Escape, focus trap; not a ≤10-line fix).

---

## 4. Priority fix list (recommended order)

### P0 — before marketing light theme or federation modal heavily

1. **FederationModal a11y** — `role="dialog"`, `aria-modal`, Escape, focus trap, labelled close. *(backlog — not done this pass)*
2. ~~**Verify SW `navigateFallbackDenylist` for `/api`**~~ — **FIXED** in config; awaiting deploy for live SW.
3. **Light-mode contrast on chrome-adjacent inputs** — at minimum Home search + Admin search fields (or document “dark-only supported”).

### P1 — week 1 UX hardening

4. Migrate Home / Events / News / Fed content cards from literal dark glass → `--glass-*` / `--chrome-*` / `text-foreground`.
5. Theme Live, Auth, AthleteProfile, FedAdminLayout (or force dark via `class` on those routes and hide toggle).
6. Map: either plot venues (requires geo columns) **or** rename UI to “Regions” and fix popup stats to use unfiltered aggregates.
7. Federation + Home tile image resilience (logo `onError`; optional `<img>` layer instead of pure CSS bg).
8. NavDrawer focus trap; skip link; Escape on news modal.
9. Bottom-nav Federations: use `/` + scroll helper or `/#federations` with `useEffect` hash scroll.
10. Framer Motion: respect `prefers-reduced-motion` globally.
11. Soften CacheFirst image TTL or add revision query params on asset URLs.

### P2 — backlog

12. Admin responsive card tables.
13. Map bottom sheet on mobile.
14. `prefers-color-scheme` bootstrap; dynamic `theme-color`.
15. Deduplicate ticker a11y tree / `aria-live` polite region for new headlines.
16. Adopt `ui/empty` for consistent empty visuals.
17. Honest Home stats from `adminStats` or remove vanity numbers.
18. Discoverable mobile search (button → palette or unify with Home search).
19. PWA “update ready” toast.
20. Fix NavDrawer / footer social URLs.

---

## 5. Surface scorecards (quick)

| Surface | Mobile | Light | A11y | Empty | Images | Notes |
|---------|:------:|:-----:|:----:|:-----:|:------:|-------|
| Home | 75 | 40 | 55 | 70 | 45 | Chrome good; body dark-locked |
| Nav drawer/bottom | 80 | 65 | 60 | n/a | n/a | Hash + focus trap |
| Ticker | 85 | 80 | 70 | n/a | 85 | Best-in-class of this audit |
| Events | 75 | 50 | 60 | 85 | 50 | Cards dark |
| News | 75 | 55 | 65 | 85 | 80 | Modal mostly good |
| Live | 70 | 20 | 55 | 85 | 50 | No theme toggle |
| Map | 70 | 75 | 55 | 80 | n/a | Not a venue map |
| Admin | 55 | 45 | 50 | 60 | n/a | Tables |
| Fed public | 75 | 45 | 55 | 85 | 55 | Tab gating win |
| Fed admin | 60 | 15 | 50 | 60 | n/a | Dark prison |
| PWA shell | 70 | 40 | 50 | n/a | cache risk | Install OK |

---

## 6. Relationship to prior docs

| Doc | Relationship |
|-----|--------------|
| `docs/research/MOBILE_AND_THEME.md` (2026-07-24) | Baseline; this wave **re-confirms** Map mobile fix + toggle ship; **extends** with ticker, PWA cache, a11y modals, image/CSS gaps, Live/FedAdmin theme fails |
| `docs/research/FULL_GAP_ANALYSIS.md` | Frontend pillar ~72; this wave narrows to **68** after light-theme honesty + modal a11y + SW risk |
| `docs/research/PUBLIC_READY_GAP_ANALYSIS.md` | Aligns: do not overclaim Live/map completeness; empty states honesty is a soft-public strength |

---

## 7. Out of scope (this doc)

- Backend RBAC / RLS / credential rotation (see security wave docs)
- Content hollowness counts / crest batch SQL (data wave)
- SEO meta completeness beyond a11y heading notes
- Visual redesign of brand system (audit only)

---

## 8. Rules / method note

Applied workspace rules: search-first against existing Theme/Nav/Map/PWA patterns; no code changes in this pass; documentation-only deliverable under `docs/research/gap_wave_20260725/`.

**Files most cited:**  
`client/src/pages/Home.tsx`, `Events.tsx`, `News.tsx`, `Live.tsx`, `Map.tsx`, `Admin.tsx`,  
`client/src/pages/federation/FederationLayout.tsx`, `FederationHome.tsx`, `admin/FedAdminLayout.tsx`,  
`client/src/components/NewsTicker.tsx`, `NavDrawer.tsx`, `MobileBottomNav.tsx`, `FederationModal.tsx`,  
`client/src/contexts/ThemeContext.tsx`, `client/src/index.css`, `vite.config.ts`, `client/index.html`.
