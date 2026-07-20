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
