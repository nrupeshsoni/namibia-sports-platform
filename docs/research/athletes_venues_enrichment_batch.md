# Athletes + Venues Enrichment Batch — 2026-07-20

**Migration:** `supabase/migrations/20260720000046_athletes_venues_enrichment.sql`  
**Project:** `rbibqjgsnrueubrvyqps`  
**DB mutated:** Yes (via Supabase MCP `execute_sql` + migration record `athletes_venues_enrichment`)

## Before → After (live)

| Metric | Before | After |
|--------|-------:|------:|
| Athletes total | 44 | **80** |
| Athletes active | 44 | **71** |
| Athletes with photo (active) | 0 (0%) | **71 (100%)** |
| Athlete federations (active) | 11 | **12** |
| Venues total / active | 15 | **28** |
| Venues with photo | 8 | **28 (100%)** |

## Athletes — what changed

1. **Deduped** 9 obvious duplicate rows (`is_active = false`): Christine Mboma, Beatrice Masilingi, Gerhard Erasmus, David Wiese, Jan Frylinck, Ruben Trumpelmann, Peter Shalulile, Cliven Loubser, Helaria/Helalia typo.
2. **Fixed broken slugs** (first letter had been stripped, e.g. `rankie-redericks-1` → `frankie-fredericks`).
3. **Corrected federation links:** Philip Seidler → NASFED/swimming (`35`); Johannes Nambala + Ananias Shikongo → Paralympic NPC (`24`).
4. **Photos:** Frankie Fredericks Wikimedia Commons portrait at `/athletes/frankie-fredericks.jpg` (Osaka 2007 crop, Commons). All other active athletes use sport-correct `/sports/*` (no invented portraits).
5. **Bios:** Flagship achievements rewritten as short paraphrases with `Source:` Wikipedia/ESPNcricinfo/Olympics links. No invented medals/stats.
6. **+36 new verified notables** across football, rugby, cricket, athletics, boxing, paralympic, canoe (see migration VALUES).

### New athlete slugs (sample)

Boxing: `harry-simon`, `paulus-ambunda`  
Athletics/Para: `agnes-samaria`, `johanna-benson`, `lahja-ishitile`, `reginald-benade`, `tjipekapora-herunga`  
Cricket: `bernard-scholtz`, `zane-green`, `niko-davin`, `michael-van-lingen`, `ben-shikongo`, `jp-kotze`, `stephan-baard`, `craig-williams`, `tangeni-lungameni`  
Rugby: `jc-greyling`, `johan-retief`, `rohan-kitshoff`, `tjiuee-uanivi`, `chrysander-botha`, `pj-van-lill`, `aranos-coetzee`, `johan-tromp`, `louis-van-der-westhuizen`, `prince-gaoseb`  
Football: `manfred-starke`, `willy-stephanus`, `benson-shilongo`, `riaan-hanamub`, `joslin-kamatuka`, `virgil-vries`, `ananias-gebhardt`, `larry-horaeb`, `wendell-rudath`  
Canoe: `alexander-miller`

### Schema note

No dedicated `bio` / `source_url` columns — sources appended in `achievements` text. Venues have no `federation_id` FK — federation links noted in descriptions where relevant.

## Venues — what changed

1. **Materialized** missing `client/public/venues/` assets (DB pointed at `/venues/*` but folder was absent).
2. **Wikimedia venue photos:** Independence Stadium main gate, Hage Geingob exterior (2018), Sam Nujoma Stadium.
3. **Sport-correct copies** for remaining venues (football/cricket/rugby/hockey/swimming/beach volleyball action).
4. **+13 venues:** Wanderers, Ramblers, UNAM, NUST, Vineta, Kuisebmond, Oshakati Independence, Rundu, Gobabis, Keetmanshoop, Khomasdal, DTS, Olympia Aquatic Centre.
5. **Capacity:** left `NULL` on new rows unless previously cited publicly (existing Independence/Hage/Sam capacities retained).

## Assets on disk

- `client/public/athletes/frankie-fredericks.jpg` (+ sport fallbacks unused by DB)
- `client/public/venues/*.jpg` (28 paths referenced)

## Residual gaps

- Most athlete photos are sport stock, not individual portraits (Commons coverage thin for living Namibian athletes).
- No club_id links on new athletes (optional follow-up).
- Netball/hockey athlete depth still thin.
- Emma Nzaramba / Mikkel Samson / Lotta Reinefeld / Nicola Bayer remain from prior seed — bios not re-verified this pass.
