# Federation Completeness Snapshot — 2026-07-21 (post crest brand colors pass 2)

**Project:** `rbibqjgsnrueubrvyqps` (Sports)  
**Table:** `sportsplatform_federations`  
**Queried live after** migration `20260720000060_federations_crest_brand_colors.sql`

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
| abbreviation | 85/85 | 100% | 85 unique; angling **NFFAA** (crest) |
| type | 85/85 | 100% | |
| slug | 85/85 | 100% | 85 unique; merge slugs kept |
| description | 85/85 | 100% | 2 start with `[MERGED]` |
| primary_color | **47/83** active | **57%** | Crest-verified only (`000013` + `000060`) |
| secondary_color | **47/83** active | **57%** | Paired with primary |
| logo | — | — | Sibling LOGOS |
| email / phone / website / socials | — | — | Sibling agents |

## Lifecycle columns (applied `20260720000017`)

| Field | Filled | Notes |
|-------|-------:|-------|
| is_active | 85/85 | 83 true / 2 false |
| merged_into_slug | 2/85 | Only on soft-merged rows |

## Columns that do not exist yet

- `established_year`, `international_affiliation`, `city`, `region` (still draft)

See `docs/research/proposed_federation_schema_extensions.md`.

## Brand colors

Full inventory: `docs/research/crest_brand_colors_batch.md`.

**Active fill:** **47/83 (57%)**. Prior 15 from `000013` retained; +32 from `000060`.

**Still null with logo path (4):** athletics (HTML stub), climbing + mountaineering (landscape photo), nawisa (promo collage).

## Recommended next

1. Replace athletics HTML stub + NAWISA collage with real crests, then color-fill.
2. Dedicated climbing/mountaineering crests (not landscape heroes).
3. Remaining rows without logos stay null until crest assets land.
