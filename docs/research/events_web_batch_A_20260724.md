# Events Web Batch A — Big Sports (2026-07-24)

Agent: events web research. Live project `rbibqjgsnrueubrvyqps`. Tables: `sportsplatform_*` only.

## Scope

Football, rugby, cricket, athletics, boxing, basketball, netball, hockey, tennis, swimming/aquatics (**merged** → `namibia-aquatics`).

## Rules applied

- Verified public sources only (NFA, NASFED PDF, Athletics Namibia calendar, ESPNcricinfo, NBC, The Namibian, New Era, SportyHQ, Wikipedia/ICC where corroborated).
- No fabricated dates/venues; open-ended seasons use `end_date = NULL` when finals unpublished.
- `is_published = true`; source URLs in `description` (no `source_url` column).
- Federation IDs via slug subselects; slug `ON CONFLICT DO NOTHING`.
- Deduped against existing titles/dates before insert.

## Migration

| Artifact | Purpose |
|----------|---------|
| `supabase/migrations/20260724200000_events_web_batch_A_big_sports.sql` | 4 UPDATEs + **27** INSERTs |
| Supabase MCP `apply_migration` name `events_web_batch_A_big_sports` | Applied live 2026-07-24 |

## Corrections (4)

| Slug | Change | Sources |
|------|--------|---------|
| `davis-cup-namibia-estonia-2026` | Dates **1–2 Feb → 7–8 Feb**; CTC Olympia; result 0–4 | New Era; The Namibian; Wikipedia 2026 Davis Cup |
| `namibia-tri-nation-odi-2026` | Renamed CWC League 2 NAM/OMA/SCO; **2–12 Apr** (was 5–20) | ESPNcricinfo; Wikipedia Tri-Nation |
| `nhu-indoor-hockey-finals-2026` | Description: Old Boys 7–3 SoE; Saints women | The Namibian; Republikein |
| `nujoma-boxing-bonanza-2026` | Description: Heita WBO Africa + Nghitumbwa WBO Global | New Era |

## New inserts (27)

### Football — `nfa` (4)

| Event | Dates | Location | Primary sources |
|-------|-------|----------|-----------------|
| NPFL final matchday — African Stars title | 19 Apr 2026 | Independence Stadium | New Era; Wikipedia Premiership |
| Nedbank Newspaper Cup Final (football) | 6 Apr 2026 | Keetmanshoop | NFA.org.na; RSSSF |
| Standard Bank Top 8 Cup Final | 23 May 2026 | Independence Stadium | The Namibian; NFA; NBC |
| NFA Cup Finals Day | 27 Jun 2026 | Independence Stadium | NFA; New Era |

### Rugby — `nru` (1)

| Event | Dates | Location | Primary sources |
|-------|-------|----------|-----------------|
| Welwitschias Inv. XV vs Zambia | 28 Jun 2026 | Hage Geingob | NBC; The Namibian; New Era |

### Cricket — `cricket-namibia` (7)

| Event | Dates | Location | Primary sources |
|-------|-------|----------|-----------------|
| CWC L2 Namibia vs Oman | 4 Apr 2026 | NCG Windhoek | ESPNcricinfo; Wikipedia |
| CWC L2 Namibia vs Scotland | 12 Apr 2026 | NCG Windhoek | ESPNcricinfo; Wikipedia |
| Scotland T20I series | 15–18 Apr 2026 | NCG Windhoek | ESPNcricinfo |
| T20I NAM vs SCO (1st / 3rd) | 15 & 18 Apr | NCG Windhoek | ESPNcricinfo |
| T20I Tri-Series NAM/HKG/NGA | 18–23 Jun 2026 | NCG Windhoek | ESPNcricinfo; The Namibian |
| Nigeria OD series | 25–29 Jun 2026 | HP Oval Windhoek | The Namibian; Czarsportz |

### Athletics — `athletics-namibia` (6)

| Event | Dates | Location | Primary sources |
|-------|-------|----------|-----------------|
| SAT Khomas Regional Champs | 14 Feb 2026 | Windhoek | AN Calendar PDF |
| UNAC Open T&F | 18 Mar 2026 | Windhoek | AN Calendar PDF |
| RunOMD 2026 | 28 Mar 2026 | Oranjemund | AN Calendar PDF |
| Katutura City Run | 18 Apr 2026 | Katutura | The Namibian; AN Calendar |
| AN T&F Meeting | 16 May 2026 | Windhoek | AN Calendar PDF |
| Bachmus Marathon | 3 Oct 2026 | Swakopmund | AN Calendar PDF |

### Netball — `namibia-netball` (1)

| Event | Dates | Notes | Primary sources |
|-------|-------|-------|-----------------|
| MTC NNPL 2026 Season | 2 May 2026 → (open) | Finals TBC | The Namibian; New Era |

### Hockey — `nhu` (1)

| Event | Dates | Location | Primary sources |
|-------|-------|----------|-----------------|
| NHU Indoor Hockey League 2026 | 28 Feb – 7 May 2026 | Wanderers / MTC Dome | New Era; The Namibian |

### Tennis — `tennis-namibia` (3)

| Event | Dates | Location | Primary sources |
|-------|-------|----------|-----------------|
| HMKV Windhoek Autumn Open | 7–12 Apr 2026 | CTC Windhoek | SportyHQ S326; New Era |
| NTA Senior Tournament | 5–7 Jun 2026 | CTC Windhoek | SportyHQ S426 |
| BJK Cup Africa Group III | 13–18 Jul 2026 | Gaborone | New Era; The Namibian; Botswana Gazette |

### Aquatics (merged) — `namibia-aquatics` (3)

| Event | Dates | Location | Primary sources |
|-------|-------|----------|-----------------|
| NASFED Water Polo Katutura | 8 Feb 2026 | Katutura | NASFED calendar PDF |
| Point Break OWS | 7–8 Mar 2026 | Lake Oanob | NASFED calendar PDF |
| NASFED OWS Event 4 | 4 Apr 2026 | Swakopmund | NASFED calendar PDF |

### Basketball — `namibia-basketball` (1)

| Event | Dates | Notes | Primary sources |
|-------|-------|-------|-----------------|
| KBA 2026 Season | 4 Jul 2026 → (open) | Mid-season 24–26 Jul verified on TeamLinkt | TeamLinkt KBA |

### Boxing — `namibia-boxing`

No new row (avoid duplicate of `nujoma-boxing-bonanza-2026`); description enriched with WBO title results.

## Live snapshot (post-apply)

| Metric | Value |
|--------|-------|
| Total events | **270** |
| Published | **268** |
| Batch A new slugs | **27** |
| Corrections | **4** |

### Federation event counts (Batch A feds)

| Federation slug | Events |
|-----------------|--------|
| athletics-namibia | 23 |
| cricket-namibia | 25 |
| nfa | 14 |
| tennis-namibia | 12 |
| nhu | 10 |
| swimming-namibia | 8 |
| namibia-basketball | 8 |
| nru | 8 |
| namibia-netball | 6 |
| namibia-boxing | 5 |
| namibia-aquatics | 3 (new merged OWS/WP) |

## Skipped / not invented

- Victoria Cup Oct 2026 (mentioned in rugby preview only — no confirmed schedule).
- Hong Kong OD series 13–16 Jun (Czarsportz claim; not on ESPNcricinfo Hong Kong tour page).
- Point Break Economist 14–15 Mar vs NASFED 7–8 Mar — used **NASFED calendar**.
- NNPL / KBA finals dates (unpublished at research time).
- SC nationals 2026 (no public date yet).

## Posters

Sport-matched `/sports/*` assets already in repo (`football-action`, `cricket-action`, `athletics`, `netball`, `hockey`, `tennis`, `swimming-action`, `basketball-action`, `namibia-rugby-action`, `boxing-action`).
