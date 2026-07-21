# Public-Ready Gap — Schema / DB Snapshot (Agent 4)

**Project:** `rbibqjgsnrueubrvyqps` (EU West)  
**Snapshot:** 2026-07-21 ~11:50 CAT  
**Method:** Live Supabase MCP (`list_tables`, `list_migrations`, `execute_sql`, `get_advisors`) + `drizzle/schema.ts` + tRPC router spot-check  
**DB mutations this audit:** none (read-only)

---

## Executive verdict

| Area | Grade | Verdict |
|------|:-----:|---------|
| Drizzle ↔ live column parity | **A−** | 13 `sportsplatform_*` tables align; only `json` vs `jsonb` drift on HP program arrays |
| Orphan FKs / referential integrity | **A** | **0** orphans on all FK columns + media polymorphic parents |
| Draft / inactive API leakage | **B+** | Lists mostly gated; **venues** + **hpPrograms** omit default active filter (no inactive rows today) |
| Indexes | **C+** | Core federation/event/news indexes present; **7 unindexed FKs** + missing media/HP/whatsapp indexes from early migration |
| Migration ledger hygiene | **D+** | Shared multi-app DB (215 ledger rows); sports files use repo stamps ≠ applied stamps; **6** repo SQL files never appear in ledger by name |
| RLS / grants (sportsplatform) | **A−** | RLS on all 13 tables; anon/auth write revoked; **0** sportsplatform security advisor lints |

**Overall schema/DB public-ready: ~78 / 100** — safe for soft public beta on integrity/RLS; clean up indexes + migration ledger before treating Drizzle/migrations as single source of truth for deploy.

---

## 1. Live inventory

| Table | Rows (approx) | Notes |
|-------|--------------:|-------|
| `sportsplatform_federations` | 85 (83 active / 2 merged inactive) | Soft-merge via `is_active` + `merged_into_slug` |
| `sportsplatform_clubs` | 165 (all active) | |
| `sportsplatform_events` | 230 (228 published / **2 unpublished**) | |
| `sportsplatform_news_articles` | 73 (all published) | |
| `sportsplatform_athletes` | 133 (124 active / **9 inactive**) | |
| `sportsplatform_coaches` | 48 (47 active / **1 inactive**) | |
| `sportsplatform_venues` | 42 (all active) | |
| `sportsplatform_media` | 61 | federation 56 / venue 4 / athlete 1 |
| `sportsplatform_live_streams` | 4 (0 live) | VODs with URLs |
| `sportsplatform_hp_programs` | 10 (all active) | |
| `sportsplatform_schools` | present | |
| `sportsplatform_users` | present | |
| `sportsplatform_whatsapp_subscriptions` | 0 | |

**Enums** (`user_role`, `federation_category`, `gender`, `event_type`, `media_type`, `entity_type`, `program_type`, `platform_type`) match Drizzle values 1:1.

**Shared DB note:** ledger total **215** migrations — Facilit8 / Dome / NRU / HPHub / wellness / sportsplatform coexist. Sports tables are ~1.5 MB total.

---

## 2. Schema drift vs Drizzle

### Aligned

- All 13 tables in `drizzle/schema.ts` exist live with matching column names, nullability, defaults, and varchar lengths (spot-checked via `information_schema.columns`).
- Lifecycle columns present: `federations.is_active`, `merged_into_slug`; `events`/`news`.`is_published`; entity `is_active` flags.

### Drift / gaps

| Item | Live | Drizzle | Risk |
|------|------|---------|------|
| `hp_programs.participants` / `coaches` | `jsonb` | `json()` | Low — both accepted by postgres-js; prefer `jsonb()` in schema |
| Foreign keys | 13 FK constraints on sports tables | **None declared** in `pgTable` | Medium — ORM won't enforce/cascade; live DB does |
| Indexes | Many exist | None in schema | Low for runtime; high for migrate-from-scratch |
| `users.federation_id` / `users.club_id` | No FK constraints | Integers only | Low today (0 orphans); add FKs when auth matures |
| `media.entity_id` | Polymorphic, no FK | Same | Expected |

No live columns missing from Drizzle; no Drizzle columns missing from live.

---

## 3. Orphan FK spot-check

Left-join checks (non-null child → missing parent):

| Check | Orphans |
|-------|--------:|
| athletes → federations / clubs | 0 |
| coaches → federations / clubs | 0 |
| clubs → federations | 0 |
| events → federations / venues | 0 |
| news → federations / users | 0 |
| streams / hp / whatsapp → parents | 0 |
| users → federations / clubs | 0 |
| media polymorphic parents | **0** |

Inactive federations (merged only):

| id | slug | merged_into_slug |
|---:|------|------------------|
| 23 | `weightlifting-namibia` | `powerlifting-namibia` |
| 61 | `namibia-aquatics` | `swimming-namibia` |

No published content / active clubs / active athletes hang off inactive federations.

---

## 4. Draft / inactive — still API-visible?

tRPC uses Hyperdrive/`DATABASE_URL` (bypasses RLS). Visibility depends on router filters. PostgREST/Data API still enforced by RLS.

### Counts

| Entity | Hidden flag | Hidden rows | Public list filter | getById / detail |
|--------|-------------|------------:|--------------------|------------------|
| Federations | `is_active=false` | 2 | Yes (`list` active-only; merge redirect on slug) | Resolve canonical if merged |
| Events | `is_published=false` | **2** | Yes | Guards unpublished unless staff |
| News | `is_published=false` | 0 | Yes | Published-only |
| Athletes | `is_active=false` | **9** | Yes (+ staff `includeInactive`) | Active-only |
| Coaches | `is_active=false` | **1** | Yes | Active-only |
| Clubs | `is_active=false` | 0 | Yes | Guards inactive |
| Venues | `is_active=false` | 0 | **No filter on `list`/`getById`** | Would leak if inactivated |
| HP programs | `is_active=false` | 0 | **Optional only** — defaults to all | Would leak if inactivated |
| Streams | n/a | 4 VODs | All rows with filters for live flag | Public |

### Unpublished events still in DB (list-hidden)

| id | slug | federation_id |
|---:|------|--------------:|
| 5 | `welwitschias-test-2025` | 84 |
| 20 | `national-athletics-2026` | 33 |

### Gaps for public-ready

1. **`venues.list` / `venues.getById`** — no `is_active` gate (RLS would hide via PostgREST; tRPC would not).
2. **`hpPrograms.list`** — does not default `isActive=true`.
3. Inactive athletes (e.g. Mboma, Erasmus, Shalulile) correctly excluded from public lists — good.

---

## 5. Indexes

### Present (high-value)

- Federations: slug unique + partial `is_active`
- Events: federation, start_date, federation+date, slug
- News: federation, published composite, partial `is_published`
- Clubs: federation (×2 duplicate), federation+region, slug
- Athletes: federation, club, slug unique
- Streams: federation, `is_live`

### Missing / advisor findings (sportsplatform only)

**Unindexed foreign keys (Supabase performance advisor):**

1. `coaches.club_id`
2. `coaches.federation_id`
3. `events.venue_id`
4. `hp_programs.federation_id`
5. `news_articles.author_id`
6. `whatsapp_subscriptions.federation_id`
7. `whatsapp_subscriptions.user_id`

**Declared in `20250318000001_rls_and_indexes.sql` but absent live:**

- `idx_sportsplatform_media_entity` `(entity_type, entity_id)`
- `idx_sportsplatform_hp_programs_federation`
- `idx_sportsplatform_whatsapp_active`
- `idx_sportsplatform_streams_scheduled` (partial)

**Hygiene:**

- Duplicate: `idx_sportsplatform_clubs_federation` ≡ `idx_sportsplatform_clubs_federation_id` — drop one
- Several “unused index” INFO lints (expected at low traffic)
- Multiple permissive SELECT policies for `authenticated` — INFO only; intentional staff+public pattern

**Security advisors:** 0 lints mentioning `sportsplatform_*`.

---

## 6. Migration ledger hygiene

| Metric | Value |
|--------|------:|
| Ledger total (`schema_migrations`) | **215** |
| Repo `supabase/migrations/*.sql` | **52** |
| Sports-related applied (by name, ~Jul 19–20) | **46** |
| Repo files with **no** ledger name match | **6** |
| Version stamp matches repo filename | **0** of the 46 applied sports migrations |

### Repo files not in ledger (by name)

| File | Likely status |
|------|----------------|
| `20250318000001_rls_and_indexes.sql` | Partially superseded; indexes incomplete vs file |
| `20250319000001_populate_federation_slugs.sql` | Effect present (slugs exist); not ledgered under this name |
| `20250319100001_add_athlete_slugs.sql` | Effect present (`athletes.slug`); not ledgered |
| `20260720000007_federations_metadata_enrichment.sql` | Unknown / may have been applied out-of-band |
| `20260720000013_federations_duplicates_and_brand_colors.sql` | Unknown / out-of-band |
| `20260720000020_events_corrections_enrichment.sql` | Referenced in CHANGELOG; **not** in live ledger under this name |

### Pattern

MCP `apply_migration` stamps **wall-clock** versions (e.g. repo `20260720000001_*` → live `20260719225729` `sportsplatform_federations_reconcile`). Names usually match; versions never do. Re-running `supabase db push` / CLI migrate against this project would mis-detect history.

### Recommendations (no changes this audit)

1. Treat live ledger as authority for “what ran”; keep repo SQL as content archive.
2. Add a mapping table in docs (repo file → applied version+name) or backfill `schema_migrations` with repo versions only if adopting CLI as source of truth (coordinate with other apps on same DB).
3. Either apply or delete/archive the 6 unledgered files after verifying content.
4. Ship one small index migration for the 7 unindexed FKs + media/HP indexes.

---

## 7. RLS / grants (sportsplatform)

- **RLS enabled** on all 13 tables (`relforcerowsecurity=false`).
- Public SELECT policies filter `is_active` / `is_published` where applicable.
- Exceptions: `media` and `schools` public SELECT `USING (true)` — intentional open catalogs.
- `live_streams` public SELECT allows live **or** scheduled **or** URL present (VODs visible).
- Grants: `anon`/`authenticated` = SELECT (+ REFERENCES/TRIGGER); writes via `service_role` only — matches harden migrations.

tRPC bypasses RLS via server DB role — router filters remain the public gate.

---

## 8. Public-ready action list (schema/DB only)

| Priority | Action | Why |
|:--------:|--------|-----|
| P1 | Default-filter `venues` + `hpPrograms` to active in tRPC | Prevent future inactive leaks |
| P1 | Add covering indexes for 7 unindexed FKs + `media(entity_type,entity_id)` | Advisor + list/join perf |
| P2 | Drop duplicate clubs federation index | Advisor `duplicate_index` |
| P2 | Align Drizzle `json` → `jsonb` for HP arrays; optionally declare FKs | Source-of-truth hygiene |
| P2 | Reconcile 6 unledgered migration files | Avoid double-apply / false history |
| P3 | Document repo↔ledger version map for sports migrations | Shared-DB multi-app safety |
| P3 | Decide fate of 2 unpublished events (publish or delete) | Dead draft rows |

---

## 9. Evidence sources

- Live SQL via Supabase MCP project `rbibqjgsnrueubrvyqps`
- `drizzle/schema.ts`
- `server/routers/{federations,events,news,athletes,coaches,clubs,venues,hpPrograms,streams}.ts`
- `supabase/migrations/` (52 files)
- Supabase advisors: performance (26 sportsplatform lints), security (0 sportsplatform)

**Rules applied:** SEARCH FIRST / NO ASSUMPTIONS / read-only preferred / documentation as deliverable.
