# Federation Completeness Snapshot — 2026-07-20 (post duplicates + brand colors)

**Project:** `rbibqjgsnrueubrvyqps` (Sports)  
**Table:** `sportsplatform_federations`  
**Queried live after** migration `20260720000017_federations_is_active_merge.sql`

## Entity mix

| Metric | count | Notes |
|--------|------:|-------|
| Total rows | **85** | |
| **Active (`is_active`)** | **83** | Public `federations.list` / search |
| Inactive / merged | **2** | Hidden from public directory |

**Soft-merged:** `namibia-aquatics` → `swimming-namibia`; `weightlifting-namibia` → `powerlifting-namibia` (`merged_into_slug`). Old slugs still resolve via `getBySlug`.

## Per-field fill rates

| Field | Filled | Rate | Notes |
|-------|-------:|-----:|-------|
| name | 85/85 | 100% | |
| abbreviation | 85/85 | 100% | 85 unique |
| type | 85/85 | 100% | |
| slug | 85/85 | 100% | 85 unique; merge slugs kept |
| description | 85/85 | 100% | 2 start with `[MERGED]` |
| primary_color | **15/85** | **18%** | Crest-verified only |
| secondary_color | **15/85** | **18%** | Crest-verified only |
| logo | — | — | Sibling LOGOS (re-query if needed) |
| email / phone / website / socials | — | — | Sibling agents |

## Lifecycle columns (applied `20260720000017`)

| Field | Filled | Notes |
|-------|-------:|-------|
| is_active | 85/85 | 83 true / 2 false |
| merged_into_slug | 2/85 | Only on soft-merged rows |

## Columns that do not exist yet

- `established_year`, `international_affiliation`, `city`, `region` (still draft)

See `docs/research/proposed_federation_schema_extensions.md`.

## Brand colors filled (15)

| slug | primary | secondary | Source |
|------|---------|-----------|--------|
| nfa | #FFD700 | #000000 | Crest gold sun + black text |
| nru | #2D8C3C | #FFDE00 | Welwitschia green + yellow |
| cricket-namibia | #0047AB | #00AEEF | Logo swooshes |
| swimming-namibia | #668BE5 | #4464AD | NASFED crest |
| namibia-netball | #2E3192 | #ED1C24 | Wordmark + ribbon |
| nhu | #1B418C | #D71920 | Logo navy + red |
| nnoc | #003580 | #D21034 | Flag in logo |
| namibia-paralympic | #003580 | #D21034 | NPC crest |
| namibia-cycling | #2B3086 | #C42038 | SVG exact fills |
| triathlon-namibia | #003399 | #E31B23 | Icon colors |
| namibia-gymnastics | #1A237E | #B39DDB | NGF crest |
| squash-namibia | #003580 | #D21034 | Flag-fill letters |
| namibia-sports-commission | #1B3664 | #E31E24 | Eagle navy + swoosh |
| ministry-sport | #003580 | #D21034 | Coat of arms flag |
| bowls-namibia | #003580 | #000000 | Flag blue + black ring |

Left null: sport-photo logos, uncertain/photo-bg crests (e.g. tennis), rows without logos.

## Recommended next

1. Apply schema draft (`is_active`, year, affiliation, city/region) after agent freeze; hide merged rows from `list`.
2. More crest-verified colors as logos land.
3. Confirm Climbing vs Mountaineering (shared crest file).
