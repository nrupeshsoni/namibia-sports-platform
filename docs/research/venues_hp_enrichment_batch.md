# Venues + HP Programs Enrichment Batch — 2026-07-21

**Migration:** `supabase/migrations/20260720000062_venues_hp_programs_expansion.sql`  
**Project:** `rbibqjgsnrueubrvyqps`  
**DB mutated:** Yes (via Supabase MCP `apply_migration`)

## Before → After (live)

| Metric | Before | After |
|--------|-------:|------:|
| Venues total / active | 28 | **42** |
| Venues with photo | 28 (100%) | **42 (100%)** |
| HP programs total / active | 0 | **10** |

## Venues — what changed

1. **+14 major/regional venues** covering Otjozondjupa, Zambezi, Omusati, Hardap, ǁKaras, Ohangwena, Erongo specialty (tennis/golf/motorsport) and northern grounds still missing after pass `000046`.
2. **Photos:** sport-correct local copies under `client/public/venues/*` (football/athletics/tennis/golf/motorsport).
3. **Capacity:** set only where publicly listed (Mokati/Katima/Outapi/Rehoboth/Lüderitz from stadium directories / Wikipedia); others `NULL`.

### New venue slugs

`mokati-stadium`, `katima-mulilo-sports-complex`, `outapi-sports-field`, `rehoboth-stadium`, `luderitz-sports-stadium`, `eenhana-sports-grounds`, `okahandja-sports-grounds`, `grootfontein-sports-complex`, `swakopmund-sports-stadium`, `windhoek-tennis-centre`, `omeya-golf-estate`, `tony-rust-raceway`, `paresis-park-otjiwarongo`, `henties-bay-golf-club`

## HP programs — what changed

Seeded **10** active rows on `sportsplatform_hp_programs` (table existed; was empty). Federation resolved by slug (not hard-coded IDs). Descriptions paraphrase public reports with `Source:` links — no invented athlete counts beyond cited PPP cohort.

| Program | Federation slug | Type |
|---------|-----------------|------|
| Namibia Podium Performance Programme (PPP) | `namibia-sports-commission` | elite |
| NNOC Olympic Preparation Pathway (LA 2028) | `nnoc` | elite |
| National Youth Games Talent Identification | `namibia-sports-commission` | talent_identification |
| AUSC Region 5 Youth Games Host Preparation | `namibia-sports-commission` | training |
| UNAM High Performance Sports Centre (MoU) | `namibia-sports-commission` | development |
| Athletics Namibia Elite Sprint & Endurance Pathway | `athletics-namibia` | elite |
| NASFED High Performance Swimming Programme | `swimming-namibia` | training |
| Welwitschias High Performance Pathway | `nru` | elite |
| Cricket Namibia High Performance Programme | `cricket-namibia` | elite |
| NPC Namibia Paralympic High Performance Pathway | `namibia-paralympic` | elite |

### Key sources

- https://www.namibian.com.na/117-athletes-to-benefit-from-podium-programme/
- https://www.namibian.com.na/la-olympics-project-underway/
- https://informante.web.na/?p=384753
- https://economist.com.na/65898/education/unam-signs-mou-with-ministry-of-sport-to-develop-high-performance-sports-centre/
- https://en.wikipedia.org/wiki/Mokati_Stadium

## Assets on disk

- `client/public/venues/*.jpg` — **42** paths referenced (28 prior + 14 new)

## Residual gaps

- Most venue photos remain sport-stock stand-ins (Commons coverage thin for regional grounds).
- HP `participants` / `coaches` JSON left empty (no verified athlete-ID mapping this pass).
- No UI surface yet for HP programmes (schema seed only).
