# Gap Analysis 16 — Map / Regions / Venues

**Wave:** `gap_wave_20260725`  
**Date:** 2026-07-25  
**Project:** `rbibqjgsnrueubrvyqps` (EU West) · Workspace `namibia-sports-platform`  
**Scope:** Leaflet `/map` fix state, region-filter data quality, venue geocode coverage, clubs `region` field usage  
**DB mutations this analysis:** none (read-only SQL + code review)

### Sources

| Source | Status |
|--------|--------|
| Live SQL on `sportsplatform_venues` / `_clubs` / `_events` / `_schools` | ✅ |
| `client/src/pages/Map.tsx`, `mapRegions.ts` (+ tests), `MapRegionPanel.tsx` | ✅ |
| `server/routers/venues.ts`, `clubs.ts`, `events.ts` | ✅ |
| `drizzle/schema.ts` venues/clubs columns | ✅ |
| CHANGELOG + commits `7ad0b2a`, `44efdaf`, `dd2e6ae`, `2f336fd` | ✅ |
| `docs/research/MOBILE_AND_THEME.md`, venue enrichment batches | ✅ |

---

## 1. Executive verdict

| Metric | Value |
|--------|------:|
| **Map / regions / venues score** | **48 / 100** |
| **Leaflet crash / mobile fix** | **Shipped** (stable enough for soft public) |
| **True interactive venue map** | **Not built** (region centroids only; **0%** lat/lng) |
| **Region filter reliability** | **Partial** — aliases + non-canonical event labels break exact-match filters |
| **Go / No-Go for “national map” marketing** | **NO-GO** — do not claim geocoded venues or full 14-region club coverage |

### One-line decision

Ship `/map` as a **region browser** (14 centroids + side-panel lists). Do **not** market it as a facility locator until `latitude`/`longitude` exist and are filled, and Karas/Kharas aliases are normalized in DB + API.

---

## 2. Leaflet / Map page — fix state

### What shipped (FIXED)

| Fix | Evidence | Status |
|-----|----------|--------|
| Suspense remount “Map container is already initialized” | Defer `MapContainer` until after mount (`leafletReady`); stable `key="namibia-sports-map"`; page-level `ErrorBoundary` | ✅ |
| Safe region flyTo during teardown | `MapCenterController` try/catch around `flyTo` | ✅ |
| Invalid / `ǁKaras` query params | `parseRegionParam` + `normalizeRegionName` in `client/src/lib/mapRegions.ts`; vitest coverage | ✅ |
| Empty list guards | `asList()` coerces non-arrays | ✅ |
| Home → Map deep links | Home 14 region cards → `/map?region=…`; Map syncs query via `history.replaceState` | ✅ |
| Mobile crush | `flex-col md:flex-row`; map `min-h-[45vh]`; panel `max-h-[50vh]` (`MOBILE_AND_THEME.md`) | ✅ |
| Theme-aware tiles | Carto `light_all` / `dark_all` by `ThemeContext` | ✅ |
| Default marker icon 404 under Vite | `L.divIcon` circles (no Leaflet PNG paths) | ✅ |
| Lazy route | `React.lazy` `/map` in `App.tsx` | ✅ |

**Commits:** `2f336fd` (Leaflet intro) → `44efdaf` (Home wire) → `7ad0b2a` (crash harden) → `dd2e6ae` (mobile + theme).

### What the map actually renders today

| Layer | Present? | Notes |
|-------|:--------:|-------|
| 14 region **centroid** markers | ✅ | Hardcoded `NAMIBIA_REGION_COORDS` |
| Per-venue markers | ✅ partial | Blue markers when lat/lng set (18/42 as of 2026-07-25 backfill); nulls list-only |
| Per-club markers | ❌ | Clubs not queried on Map page |
| Event markers | ❌ | Upcoming events list in panel only |
| Region polygons / boundaries | ❌ | Points only |
| Google Maps | ❌ | Dead scaffolding: `client/src/components/Map.tsx`, `server/_core/map.ts` (Manus/Forge template; unused by `/map`) |

### Residual UX gaps (Low–Medium, non-blocking for soft public)

1. Region panel is stacked list, not a bottom sheet/drawer on mobile.
2. Popup **regionStats** are computed from the **currently filtered** venues/events response — when a region is selected, other region popups show `0 venues, 0 events` (misleading).
3. Null DB `region` is counted as **Khomas** in client stats (`normalizeRegionName(v.region ?? "Khomas")`) — inflates Khomas if nulls return (venues currently have no nulls).
4. Leaflet attribution/zoom crowding on very small screens (documented Low).
5. Duplicate region lists: `mapRegions.ALL_REGIONS` vs local `NAMIBIA_REGIONS` / `REGIONS` in ClubForm, VenueForm, EventForm, Events.tsx, FederationClubs (drift risk).

**Leaflet fix verdict:** crash path is **closed**. Product gap is **feature depth**, not stability.

---

## 3. Region filter — data quality

### Canonical UI set (14)

`Khomas`, `Erongo`, `Oshana`, `Omusati`, `Ohangwena`, `Oshikoto`, `Kavango East`, `Kavango West`, `Zambezi`, `Kunene`, `Otjozondjupa`, `Omaheke`, `Hardap`, `Karas`

Official southern region is often written **ǁKaras / !Karas / //Kharas / Kharas**. Platform UI + `mapRegions` canonicalize to **`Karas`**. Client normalizer only strips leading `ǁ` / `!` — it does **not** map `Kharas` or `//Kharas`.

### Live distinct `region` values (2026-07-25)

#### Venues (42 active) — near-clean

| Region | Count |
|--------|------:|
| Khomas | 18 |
| Erongo | 8 |
| Otjozondjupa | 4 |
| Hardap | 2 |
| Oshana | 2 |
| Karas | 1 |
| **ǁKaras** | **1** |
| Kavango East, Ohangwena, Omaheke, Omusati, Oshikoto, Zambezi | 1 each |
| **Kavango West** | **0** |
| **Kunene** | **0** |

Alias row: **Lüderitz Sports Stadium** (`luderitz-sports-stadium`) = `ǁKaras` while Keetmanshoop = `Karas`.

#### Clubs (191 active) — filled, skewed, one alias

| Region | Count | % |
|--------|------:|--:|
| Khomas | 125 | 65.4% |
| Erongo | 46 | 24.1% |
| Otjozondjupa | 6 | 3.1% |
| Hardap, Kavango East, Omaheke, Oshikoto | 2 each | — |
| Karas, Ohangwena, Omusati, Oshana, Zambezi | 1 each | — |
| **ǁKaras** | **1** | — |
| **Kavango West** | **0** | — |
| **Kunene** | **0** | — |

Alias row: **Luderitz Sport Shooting Club** = `ǁKaras`; **Karas Handball Club** = `Karas`.

#### Events (291 published) — messiest

| Region (as stored) | Count | Filterable via UI `Karas`? |
|--------------------|------:|:--------------------------:|
| Khomas | 147 | ✅ (Khomas) |
| Erongo | 48 | ✅ |
| **International** | 38 | ❌ (not in 14) |
| **null** | 17 | ❌ |
| **National** | 12 | ❌ |
| Hardap / Oshana / Otjozondjupa | 4 each | ✅ |
| **Khomas / Erongo** | 4 | ❌ (compound) |
| **Kharas** | 3 | ❌ |
| **//Kharas** | 2 | ❌ |
| Omaheke | 2 | ✅ |
| Karas | 1 | ✅ |
| Kavango East, Kunene, Oshikoto, Zambezi | 1 each | ✅ |
| **Kunene / Otjozondjupa** | 1 | ❌ |
| Kavango West, Ohangwena, Omusati | 0 | — |

**Published events with non-canonical or null region:** ≈ **77 / 291 (26%)** fail exact match against the 14-region dropdown (`International` + `National` + null + compounds + Karas aliases).

#### Schools (50) — clean canonical set

All 50 use canonical names; no `ǁKaras`. Zero in Kavango West, Kunene, Omaheke, Omusati.

### Filter mechanics gap (code)

| Surface | Match style | Alias-safe? |
|---------|-------------|:-----------:|
| Map `venues.list` / `events.list` | Server `eq(table.region, input.region)` | ❌ |
| Events page client filter | `e.region !== regionFilter` | ❌ |
| FederationClubs client filter | `c.region === regionFilter` | ❌ |
| Map URL parse | Client normalizes `ǁKaras` → `Karas` before select | ✅ URL only |
| Map popup stats | Client `normalizeRegionName` (ǁ/`!` only) | Partial |

**Consequence:** Selecting **Karas** on `/map` returns Keetmanshoop venue/events with `region='Karas'` but **drops** Lüderitz venue (`ǁKaras`) and events tagged `Kharas` / `//Kharas`.

### Coverage by region (canonicalized Karas aliases for counting)

| Region | Venues | Clubs | Pub. events* | Schools |
|--------|------:|------:|-------------:|--------:|
| Khomas | 18 | 125 | 147 | 21 |
| Erongo | 8 | 46 | 48 | 8 |
| Otjozondjupa | 4 | 6 | 4 | 3 |
| Hardap | 2 | 2 | 4 | 2 |
| Oshana | 2 | 1 | 4 | 5 |
| Karas (incl. aliases) | 2 | 2 | 6 | 3 |
| Kavango East | 1 | 2 | 1 | 3 |
| Ohangwena | 1 | 1 | 0 | 2 |
| Omaheke | 1 | 2 | 2 | 0 |
| Omusati | 1 | 1 | 0 | 0 |
| Oshikoto | 1 | 2 | 1 | 1 |
| Zambezi | 1 | 1 | 1 | 2 |
| **Kunene** | **0** | **0** | 1 | **0** |
| **Kavango West** | **0** | **0** | **0** | **0** |

\*Event counts above exclude `International` / `National` / compounds / nulls except Kunene’s single row.

**Empty map experience:** Kavango West and Kunene region markers always show empty venue lists; Kunene has at most one published event.

---

## 4. Venue geocode coverage

### Schema reality

`sportsplatform_venues` columns (live):  
`id, name, slug, description, photo_url, address, city, region, contact_*, capacity, facilities, is_active, timestamps`

**There are no `latitude`, `longitude`, `geom`, or geocode columns** in Drizzle schema or Postgres.

| Metric | Live value |
|--------|----------:|
| Active venues | **42** |
| With photo | **42 (100%)** |
| With region | **42 (100%)** |
| With city | **42 (100%)** |
| With address | **35 / 42** (7 null/empty) |
| With capacity | **20 / 42** |
| With lat/lng | **0 / 42 (0%)** |

### Product implication

- Map cannot plot facilities; only approximate **region centers**.
- Enrichment batches (`000046`, `000062`) improved photos + regional inventory, **not** coordinates.
- Admin `VenueForm` has no lat/lng fields; create/update Zod schemas omit them.

**Geocode verdict:** coverage = **0%**. This is a schema + content gap, not a Leaflet bug.

---

## 5. Clubs `region` field — usage

### Schema & API

- Column: `sportsplatform_clubs.region` `varchar(100)` — comment: “One of 14 Namibian regions”.
- Indexed with federation for filters (`idx_sportsplatform_clubs_federation_region` per architecture docs).
- `clubs.list` accepts optional `region` → `eq(clubs.region, …)`.
- Admin + FedAdmin forms: `Select` from local `NAMIBIA_REGIONS` (canonical `Karas`).

### Live fill quality

| Metric | Value |
|--------|------:|
| Active clubs | **191** |
| `region` non-null | **191 (100%)** |
| `city` non-null | **191 (100%)** |
| `address` non-null | **20 / 191 (~10%)** |
| Khomas + Erongo share | **171 / 191 (89.5%)** |
| Regions with zero clubs | **Kavango West, Kunene** |
| Non-canonical values | **1** (`ǁKaras` on Lüderitz Sport Shooting) |

### Where the field is used in UI

| Surface | Uses `club.region`? |
|---------|:-------------------:|
| FederationClubs search + chip filter | ✅ |
| FedAdminClubs table column | ✅ |
| ClubForm create/edit | ✅ |
| Admin tables | ✅ |
| **Map page** | ❌ (venues + events only) |
| Home region cards | ❌ (link to Map, not clubs) |
| Platform-wide Clubs directory | N/A (no global clubs hub beyond federation sites) |

### Usage verdict

Field is **populated and wired for federation club filtering**, but:

1. Geographic story is **Windhoek + coast heavy** — interior/north thin.
2. Exact-match filters miss the one `ǁKaras` club when user picks `Karas`.
3. Map does not surface clubs at all — region browsing under-represents club inventory.
4. Address sparsity (~90% empty) blocks future geocoding-from-address without research.

---

## 6. Scorecard (this domain)

| Sub-area | Score /100 | Notes |
|----------|----------:|-------|
| Leaflet stability + mobile | **88** | Crash + crush fixes shipped; polish remains |
| Region deep-link / Home wire-up | **85** | Works for canonical names |
| Region label hygiene (DB) | **55** | Venues/clubs mostly OK; events ~26% non-filterable |
| API/filter alias handling | **35** | Exact `eq` / `===` everywhere server-side |
| Venue inventory depth | **62** | 42 venues, 12/14 regions; photos 100% |
| Venue geocodes | **0** | No columns, no data |
| Clubs region usage | **70** | 100% fill; skewed; unused on Map |
| True “map of sports Namibia” product | **25** | Centroids + lists ≠ locator |

**Blended domain score: ~48 / 100.**

---

## 7. Gap backlog (ordered)

### P0 — correctness (small, high leverage)

1. **Normalize Karas aliases in DB** — set `ǁKaras` → `Karas` on venue id 34 + club id 156; map event `Kharas` / `//Kharas` → `Karas` (ids 103, 115, 171, 279, 289). Idempotent migration.
2. **Extend `normalizeRegionName`** (and server-side filter helper) for `Kharas`, `//Kharas`, `!Karas`, `ǁKaras` → `Karas` so filters cannot regress.
3. **Stop treating null region as Khomas** in Map stats — use `"Unknown"` / omit.

### P1 — product honesty + UX

4. Document or empty-state copy for **Kavango West / Kunene** (and thin regions) on Map panel.
5. Fix popup stats: either always fetch unscoped counts for markers, or hide counts when filtered.
6. Deduplicate region constants → single export from `mapRegions.ts` (forms + Events + FederationClubs).
7. Decide policy for event regions `International` / `National` / compounds (separate filter chips vs leave unfilterable).

### P2 — real map

8. Migration: add `latitude numeric`, `longitude numeric` (nullable) on `sportsplatform_venues` (+ optional clubs later).
9. Admin VenueForm + Zod create/update; backfill geocodes for flagship stadiums first (Independence, Hage Geingob, Sam Nujoma, The Dome, etc.).
10. Plot venue markers when coords present; keep region centroids as fallback zoom targets.
11. Optional: show club counts per region on Map (query `clubs.list` aggregated or lightweight stats procedure).

### P3 — cleanup

12. Remove or quarantine unused Google Maps template (`client/src/components/Map.tsx`, `server/_core/map.ts`) to avoid false “Maps integrated” signal.
13. Mobile Map panel → bottom sheet (from `MOBILE_AND_THEME.md` follow-ups).
14. Seed ≥1 venue (and ideally clubs) for **Kavango West** and **Kunene** when verified sources exist.

---

## 8. Test / verification checklist

- [x] `mapRegions.test.ts` — 14 regions, `ǁKaras`/`!Karas`, bad `%` decode, `asList`
- [ ] E2E: `/map?region=Karas` returns **both** Keetmanshoop + Lüderitz venues after alias fix
- [ ] E2E: `/map?region=%E0%A4%A` (bad URI) does not blank app shell
- [ ] E2E: Home region card → Map filter sync in address bar
- [ ] After geocode work: venue with lat/lng appears as marker; null coords stay list-only

---

## 9. Related artifacts

| Artifact | Role |
|----------|------|
| `client/src/lib/mapRegions.ts` | Canonical coords + URL parse |
| `client/src/pages/Map.tsx` | Leaflet UI |
| `docs/research/MOBILE_AND_THEME.md` | Mobile Map fix notes |
| `docs/research/athletes_venues_enrichment_batch.md` | Venues 15→28 |
| `docs/research/venues_hp_enrichment_batch.md` | Venues 28→42 |
| `docs/02_database_schema.md` | Venue column docs (no geo) |
| CHANGELOG Unreleased | Leaflet crash + Home region wire + mobile layout |

---

## 10. Summary for synthesizer

| Question | Answer |
|----------|--------|
| Is the Leaflet crash fixed? | **Yes** — defer mount + ErrorBoundary + safe flyTo |
| Is region filter data clean? | **No** — Karas aliases + event Internationals/Nationals/compounds |
| Venue geocode coverage? | **0%** — columns absent |
| Clubs region field? | **100% filled**, heavily Khomas/Erongo; **unused on Map**; one `ǁKaras` outlier |

**Do not market `/map` as a geocoded national facilities map.** Market as regional directory browser until P0 alias fix + P2 lat/lng land.
