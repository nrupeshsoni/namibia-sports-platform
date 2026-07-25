# Venue geocode backfill — 2026-07-25

**Project:** `rbibqjgsnrueubrvyqps` · table `sportsplatform_venues`  
**Method:** Nominatim OpenStreetMap (polite 1 req/sec + identifying User-Agent) + curated OSM pins only when Nominatim missed known facilities  
**Policy:** [Nominatim Usage Policy](https://operations.osmfoundation.org/policies/nominatim/) — no bulk hammering; leave `NULL` if unsure  
**Script:** `scripts/geocode-venues-nominatim.mjs`  
**Map:** `client/src/pages/Map.tsx` — blue venue markers when `latitude`/`longitude` present

---

## Counts (live SQL after update)

| Metric | Count |
|--------|------:|
| Active venues | 42 |
| **Geocoded** (lat+lng set) | **18** |
| **Remaining null** | **24** |
| Coverage | 43% |

---

## Geocoded rows (18)

| id | Name | lat | lng | Source |
|---:|------|----:|----:|--------|
| 1 | The Dome Swakopmund | -22.6729847 | 14.5327506 | Nominatim amenity |
| 3 | Hage Geingob Stadium | -22.6075475 | 17.0889821 | Nominatim stadium |
| 4 | Independence Stadium | -22.6077241 | 17.0909926 | Nominatim stadium |
| 5 | Sam Nujoma Stadium | -22.5157289 | 17.060654 | Nominatim stadium |
| 6 | Rossmund Desert Golf Course | -22.6406 | 14.5789 | Curated (OSM golf pin) |
| 7 | Windhoek Country Club | -22.6152399 | 17.0835335 | Nominatim golf_course |
| 8 | SKW Sports Complex | -22.6141947 | 17.0883911 | Nominatim club/sport (2nd pass) |
| 19 | Wanderers Sports Club | -22.5916267 | 17.0709619 | Nominatim sports_centre |
| 20 | Ramblers Club | -22.5903005 | 17.0722885 | Nominatim sports_centre |
| 23 | Olympia Aquatic Centre | -22.6094316 | 17.0948584 | Nominatim swimming_pool (2nd pass) |
| 24 | Kuisebmond Stadium | -22.932021 | 14.5286454 | Nominatim stadium |
| 26 | Oshakati Independence Stadium | -17.7877741 | 15.6923942 | Nominatim sports_centre |
| 28 | Rundu Sports Stadium | -17.9239442 | 19.7728462 | Nominatim stadium (2nd pass) |
| 33 | Rehoboth Stadium | -23.3149895 | 17.0779392 | Nominatim sports_centre |
| 34 | Lüderitz Sports Stadium | -26.6412303 | 15.1616987 | Nominatim stadium |
| 36 | Henties Bay Golf Club | -22.1112458 | 14.2789585 | Nominatim golf_course (2nd pass) |
| 40 | Omeya Golf Estate | -22.7142 | 17.0611 | Curated (OSM golf pin) |
| 41 | Mokati Stadium | -20.4589438 | 16.6588161 | Nominatim stadium |

Acceptance rules applied to Nominatim hits:

- `countrycodes=na` + Namibia bounding box check
- Prefer `leisure` / `sport` / stadium / golf / sports_centre features
- Reject city/town-only centroids (e.g. “Mariental” as a stand-in for unnamed grounds)
- Name-token match required when feature class is ambiguous

---

## Left null (24) — unsure / no OSM feature

Namibia Cricket Ground, Vegkop Athletics Stadium, High Performance Oval, Walvis Bay HS Rugby Ground, Ongwediva Multi-Sport Centre, Tsumeb Sports Complex, Mariental Sports Grounds, Swakopmund Beach Courts, DTS Sports Grounds, NUST Sports Grounds, UNAM Sports Grounds, Keetmanshoop Sports Complex, Khomasdal Stadium, Gobabis Sports Grounds, Vineta Sports Grounds, Windhoek Tennis Centre, Outapi Sports Field, Tony Rust Raceway, Grootfontein Sports Complex, Paresis Park Sports Fields, Swakopmund Sports Stadium, Katima Mulilo Sports Complex, Eenhana Sports Grounds, Okahandja Sports Grounds.

NUST campus geocoded in Nominatim but **not** applied — campus centroid ≠ sports grounds.

---

## Map markers

| Layer | Status |
|-------|--------|
| Region centroids (green/red) | Unchanged |
| Venue markers (blue `#3B82F6`) | **Yes** — only rows with finite lat/lng |
| Null-coord venues | Side panel list only |

---

## Admin API

`venues.create` / `venues.update` accept optional `latitude` / `longitude` (Zod-bounded) so VenueForm can persist manual corrections.
