# Proposed Federation Schema Extensions — DRAFT ONLY

**Status:** Partially applied. `is_active` + `merged_into_slug` shipped in `20260720000017`. Remaining columns still draft.  
**Target table:** `sportsplatform_federations`  
**Suggested next migration:** `20260720000020_federations_schema_extensions.sql` (year / affiliation / city / region)

## Motivation

1. Soft-deprecate duplicates without hard-delete (`is_active`) — needed after Aquatics/Swimming and Power/Weight merges.
2. Structured international affiliation (FIFA, World Athletics, …) instead of prose-only descriptions.
3. Established year for heritage display.
4. Optional HQ location (city/region) — currently only on clubs.

## Proposed columns

| Column (Postgres) | Drizzle | Type | Notes |
|-------------------|---------|------|-------|
| `is_active` | `isActive` | `boolean NOT NULL DEFAULT true` | Filter `federations.list`; soft-deprecate merged rows |
| `merged_into_slug` | `mergedIntoSlug` | `varchar(255)` nullable | e.g. `namibia-aquatics` → `swimming-namibia` |
| `established_year` | `establishedYear` | `integer` nullable | CHECK 1800–2100 |
| `international_affiliation` | `internationalAffiliation` | `text` nullable | Comma-separated or short label; avoid array until UI needs multi |
| `city` | `city` | `varchar(100)` nullable | HQ city |
| `region` | `region` | `varchar(100)` nullable | One of 14 Namibian regions |

## Draft SQL (not applied)

```sql
-- DRAFT — do not run until coordinated
ALTER TABLE sportsplatform_federations
  ADD COLUMN IF NOT EXISTS is_active boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS merged_into_slug varchar(255),
  ADD COLUMN IF NOT EXISTS established_year integer,
  ADD COLUMN IF NOT EXISTS international_affiliation text,
  ADD COLUMN IF NOT EXISTS city varchar(100),
  ADD COLUMN IF NOT EXISTS region varchar(100);

ALTER TABLE sportsplatform_federations
  ADD CONSTRAINT sportsplatform_federations_established_year_chk
  CHECK (established_year IS NULL OR (established_year >= 1800 AND established_year <= 2100));

CREATE INDEX IF NOT EXISTS idx_sportsplatform_federations_active
  ON sportsplatform_federations (is_active)
  WHERE is_active = true;
```

## Drizzle patch notes (`drizzle/schema.ts`)

Add inside `federations` table definition (after branding block):

```ts
  // Lifecycle / merge
  isActive: boolean("is_active").default(true).notNull(),
  mergedIntoSlug: varchar("merged_into_slug", { length: 255 }),

  // Enrichment
  establishedYear: integer("established_year"),
  internationalAffiliation: text("international_affiliation"),
  city: varchar("city", { length: 100 }),
  region: varchar("region", { length: 100 }),
```

## App impact (when applying)

| Area | Change |
|------|--------|
| `server/routers/federations.ts` `list` | Default `where isActive = true`; optional `includeInactive` for admin |
| `getBySlug` | If inactive + `mergedIntoSlug`, resolve/redirect to canonical |
| Admin UI | Toggle active; show merge target |
| Seed data for merges | Set `namibia-aquatics` and `weightlifting-namibia` `is_active=false`, `merged_into_slug` accordingly |

## Seed candidates (post-migration)

| slug | established_year | international_affiliation | city | region |
|------|----------------:|---------------------------|------|--------|
| nfa | 1990 | FIFA, CAF | Windhoek | Khomas |
| nru | 1990 | World Rugby | Windhoek | Khomas |
| cricket-namibia | 1989 | ICC (Associate) | Windhoek | Khomas |
| athletics-namibia | — | World Athletics | Windhoek | Khomas |
| swimming-namibia | — | World Aquatics | Windhoek | Khomas |
| powerlifting-namibia | 2016 | African Powerlifting Federation / IWF pathway | Windhoek | Khomas |
| nnoc | — | IOC | Windhoek | Khomas |
| namibia-paralympic | 1999 | IPC | Windhoek | Khomas |

Years marked — need primary-source confirmation before seed.

## Coordination

- Coordinate with Agent B (schema owner) before `drizzle/schema.ts` change.
- Apply only after contacts/logos/websites batches land.
- After apply: set `is_active=false` on current soft-deprecated rows and hide from Home directory.
