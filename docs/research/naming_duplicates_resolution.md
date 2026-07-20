# Naming Duplicates Resolution — 2026-07-20

**Agent:** METADATA  
**Migration:** `supabase/migrations/20260720000013_federations_duplicates_and_brand_colors.sql`

## Decisions

### 1. Aquatics vs Swimming — DUPLICATE (same body)

| Evidence | Detail |
|----------|--------|
| Live rows | `namibia-aquatics` (id 61, NASFED) and `swimming-namibia` (id 35, NSU) |
| Shared assets | Same logo path, same website (`swimmingnamibia.com`), same email |
| Official site | Brands as **NASFED \| Namibia Swimming Federation** |
| NSC Feb 2025 | Lists **Namibia Swimming Union** (one entry) |
| FKs | id 35: 3 clubs, 3 events, 2 athletes, 1 news; id 61: 1 event |

**Decision:** Soft-deprecate `namibia-aquatics`. Canonical = `swimming-namibia`.

- Slug **unchanged** (`swimming-namibia`) — no hardcoded client slug refs; keeps existing URLs/FKs.
- Canonical name → **Namibia Aquatic Sports Federation**, abbr **NASFED**.
- Deprecated row kept for `/federation/namibia-aquatics` URL compatibility (no `is_active` column on federations).
- Event FK `federation_id=61` → `35` before deprecate note.
- Lifecycle columns applied (`20260720000017`): `is_active=false`, `merged_into_slug='swimming-namibia'`.

### 2. Powerlifting vs Weightlifting — DUPLICATE (combined body)

| Evidence | Detail |
|----------|--------|
| Live rows | `powerlifting-namibia` (id 46) and `weightlifting-namibia` (id 23) |
| Shared contact | Same email `viadante.johannes@gmail.com` |
| NSC Feb 2025 | **One** entry: Namibia Power & Weight Lifting Association |
| Research | PWFN / Namibian Powerlifting & Weightlifting Federation (est. 2016) |
| FKs | id 46: 2 events; id 23: none |

**Decision:** Soft-deprecate `weightlifting-namibia`. Canonical = `powerlifting-namibia`.

- Slug **unchanged** (`powerlifting-namibia`).
- Canonical name → **Namibia Power & Weight Lifting Association**, abbr **PWFN**.
- Description clarifies both Olympic weightlifting and powerlifting pathways.
- Weightlifting row retained with `[MERGED]` note; `is_active=false`, `merged_into_slug='powerlifting-namibia'` (`20260720000017`).

## Not hard-deleted

Both deprecated rows retain slugs. `is_active=false` hides them from public `list`/`search`; `getBySlug` returns the canonical federation via `merged_into_slug`. Admin uses `federations.listAll`.

## Out of scope this pass

- Climbing vs Mountaineering (shared logo file — may be legitimate sister sports; needs NSC confirmation)
- Martial Arts umbrella vs Full-Contact (shared crest — likely intentional umbrella branding)
