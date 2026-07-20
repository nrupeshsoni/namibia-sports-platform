# Media enrichment batch — flagship federations

**Date:** 2026-07-20  
**Migration:** `20260720000044_media_flagship_seed.sql`  
**Target:** `sportsplatform_media` (was 0 rows)

## Goal

Seed a usable federation gallery for the six flagship orgs so beta federation pages are not media-empty. Paths are local static assets under `client/public/` (served as `/sports/*` and `/logos/*`).

## Schema (inspected)

| Column | Notes |
|--------|--------|
| `file_url` | NOT NULL text |
| `thumbnail_url` | optional |
| `type` | `media_type`: image / video / document |
| `entity_type` | `entity_type`: federation / club / event / athlete / venue / coach |
| `entity_id` | integer (polymorphic; no FK) |

## Rows seeded (24)

| Org | Slug | Count | Assets |
|-----|------|------:|--------|
| NFA | `nfa` | 4 | crest + football / football-action / namibia-football |
| NRU | `nru` | 4 | crest + rugby / namibia-rugby / namibia-rugby-action |
| Cricket Namibia | `cricket-namibia` | 4 | crest + cricket / cricket-action / namibia-cricket |
| Athletics Namibia | `athletics-namibia` | 3 | crest + athletics / athletics-alt |
| NNOC | `nnoc` | 5 | crest + athletics-alt / swimming / boxing / triathlon |
| NSC | `namibia-sports-commission` | 4 | crest + volleyball / netball / hockey-field |

All `type = image`, `entity_type = federation`. Idempotent on `(file_url, entity_type, entity_id)`.

## Disk verification

Every `file_url` checked with `Test-Path` against `client/public/...` on 2026-07-20 — all present.

## Scheduled live streams

Searched Gravity Live, NBC/YouTube Namibia rugby/football, Cricket Namibia fixtures, and federation Facebook/YouTube for **upcoming** watch URLs with a future `scheduled_start` after 2026-07-20.

**Result:** No concrete YouTube/Facebook live or premiere URLs with a verified future start time. Existing 4 VOD rows (`20260720000032`) left unchanged. Live nav remains gated until a real scheduled/live row appears (or `VITE_SHOW_LIVE_NAV=true`).

---

## Pass 2 — expand galleries (2026-07-20)

**Migration:** `20260720000054_media_expansion_pass2.sql`  
**Before → after:** **24 → 61** media rows (+37)

### New federation coverage

| Org | Slug | Count | Assets |
|-----|------|------:|--------|
| Netball Namibia | `namibia-netball` | 3 | crest + `/sports/netball` + `/athletes/netball` |
| Namibia Hockey Union | `nhu` | 4 | crest + hockey / namibia-hockey + `/athletes/hockey` |
| Basketball | `namibia-basketball` | 4 | crest + basketball / basketball-action / namibia-basketball |
| Boxing | `namibia-boxing` | 4 | crest + boxing-action / namibia-boxing + `/athletes/boxing` |
| Volleyball | `namibia-volleyball` | 3 | crest + volleyball + `/athletes/volleyball` |
| Tennis Namibia | `tennis-namibia` | 3 | crest + tennis + `/athletes/tennis` |
| NASFED (Aquatics) | `swimming-namibia` | 4 | crest + swimming-action / namibia-swimming + `/athletes/swimming` |
| Beach Volleyball | `namibia-beach-volleyball` | 2 | beach-volleyball + `/venues/swakopmund-beach-courts` |
| Judo Namibia | `judo-namibia` | 3 | crest + judo + `/athletes/judo` |
| Handball | `namibia-handball` | 2 | crest + handball |

### Venue / athlete rows

| Entity | Slug / name | Count | Path |
|--------|-------------|------:|------|
| venue | `the-dome-swakopmund` | 1 | `/venues/dome-swakopmund.jpg` |
| venue | `independence-stadium` | 1 | `/venues/independence-stadium.jpg` |
| venue | `olympia-aquatic-centre` | 1 | `/venues/olympia-aquatic-centre.jpg` |
| venue | `wanderers-sports-club` | 1 | `/venues/wanderers-sports-club.jpg` |
| athlete | `frankie-fredericks` | 1 | `/athletes/frankie-fredericks.jpg` |

All paths verified on disk under `client/public/` (2026-07-20). Idempotent on `(file_url, entity_type, entity_id)`.

### Schools (Pass 2)

Inspected live `sportsplatform_schools` (50 rows). Most already have non-empty `sports_offered` arrays. Repo research has **no per-school** verified sport lists (NSSU codes are union-level; Academia field mention is club venue use only). **0 schools updated** — do not invent.
