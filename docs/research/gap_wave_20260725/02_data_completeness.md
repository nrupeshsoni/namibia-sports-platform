# 02 — Data Completeness Gap Analysis

**Wave:** `gap_wave_20260725`  
**Agent:** Data completeness  
**Date:** 2026-07-25  
**Project:** `rbibqjgsnrueubrvyqps` (EU West)  
**Snapshot:** live SQL via Supabase MCP `execute_sql` (read-only; no mutations)  
**Tables:** `sportsplatform_*`  
**Compare baseline:** `docs/research/full_gap_analysis_data.md` (2026-07-21)

---

## 1. Executive scorecard

| Domain | Live count | Fill / coverage | Grade |
|--------|-----------:|-----------------|:----:|
| Federations (active) | **83** / 85 | Logos **100%**; heroes **100%**; desc **100%**; contact **88%**; websites **66%**; colors **57%** | A− |
| Events | **291** pub / **40** upcoming | Posters **82%**; upcoming posters **100%**; **18** feds zero events | B+ |
| Clubs | **191** active / **42** feds | Logos **100%**; any contact **~17%**; **41** feds empty | B− |
| News | **147** published / **61** feds | Images **97%**; agg **58**; **22** feds empty; **46** unlinked | A− |
| Athletes | **198** active / **34** feds | Photos **100%**; **49** feds empty | B |
| Coaches | **47** active / **16** feds | Photos **100%**; **67** feds empty | C |
| Venues | **42** (no `federation_id`) | Photos present; **only 8/291** pub events linked | C+ |
| Media | **61** | federation 56 / venue 4 / athlete 1; **67** feds zero | C |
| Streams | **4** VOD | **0** live; **79** feds zero | D |
| HP programs | **10** active / **7** feds | **76** feds zero | C |
| Schools | **50** | Seed present; not federation-scoped | C |

**Completeness score: ~72 / 100** — directory identity (logo/hero/description) is solved; content depth and calendar freshness remain the launch risk. Soft beta viable on Big-8 + directory; hollow long-tail federation pages and Live (VOD-only) are the main public gaps.

### Headline deltas vs 2026-07-21

| Metric | 2026-07-21 | **2026-07-25** | Δ |
|--------|----------:|---------------:|--:|
| Active logos | 53 (64%) | **83 (100%)** | +30 |
| Published events | 228 | **291** | +63 |
| Upcoming events | 50 | **40** | −10 |
| Published news | 73 | **147** | +74 |
| Active clubs | 165 | **191** | +26 |
| Active athletes | 124 | **198** | +74 |
| Coaches / media / streams / HP | 47 / 61 / 4 / 10 | **unchanged** | — |
| Feds with news | 51 | **61** | +10 |
| Feds with clubs | 34 | **42** | +8 |
| Feds with athletes | 19 | **34** | +15 |

---

## 2. Federations — inventory & profile fill

### 2.1 Active counts by type

| Type | Active | Inactive | Total |
|------|-------:|---------:|------:|
| ministry | 1 | 0 | 1 |
| commission | 1 | 0 | 1 |
| umbrella | 8 | 0 | 8 |
| federation | 73 | 2 | 75 |
| **Total** | **83** | **2** | **85** |

### 2.2 Profile field fill (active n=83)

| Field | Filled | Rate |
|-------|-------:|-----:|
| logo | 83 | **100%** |
| background_image (hero) | 83 | **100%** |
| description (≥40 chars) | 83 | **100%** |
| email **or** phone (contact) | 73 | **88.0%** |
| email | 73 | 88.0% |
| phone | 66 | 79.5% |
| website | 55 | **66.3%** |
| any social | 52 | 62.7% |
| president | 71 | 85.5% |
| secretary_general | 48 | 57.8% |
| primary_color | 47 | **56.6%** |

**Remaining profile gaps**

| Gap | n | Abbreviations |
|-----|--:|---------------|
| No email **and** no phone | **10** | LN, NBB, NBodF, NFGF, NK, NO, NPet, NPTF, NSB, NWMGF |
| No website | **28** | (see §6 priorities; includes BSN, NBCC, PWFN, TKD, NUFS, TISAN, …) |
| No primary_color | **36** | ~43% of actives still unbranded |

---

## 3. Per-federation content zeros (active n=83)

Venues have **no** `federation_id` (global inventory). “Venues per federation” is therefore reported via event linkage only (§4).

| Entity | Feds with ≥1 | Feds at **zero** | Zero rate |
|--------|-------------:|-----------------:|----------:|
| News (published) | 61 | **22** | 27% |
| Events (published) | 65 | **18** | 22% |
| Upcoming events | 25 | **58** | 70% |
| Clubs (active) | 42 | **41** | 49% |
| Athletes (active) | 34 | **49** | 59% |
| Coaches (active) | 16 | **67** | 81% |
| Media (`entity_type=federation`) | 16 | **67** | 81% |
| Streams | 4 | **79** | 95% |
| HP programs | 7 | **76** | 92% |
| Core-4 hollow (news+events+clubs+athletes all 0) | — | **12** | 14% |

### 3.1 Fully hollow (8/8 content dims zero) — 12

| Abbr | Name | Type |
|------|------|------|
| NAWISA | Namibia Women in Sport Association | umbrella |
| NMAF | Namibia Martial Arts Federation | umbrella |
| NUFS | Namibia Uniformed Forces Sports | umbrella |
| LN | Lacrosse Namibia | federation |
| NBB | Baseball Namibia | federation |
| NK | Namibia Korfball | federation |
| NKA | Namibia Kendo Association | federation |
| NMP | Namibia Modern Pentathlon | federation |
| NO | Namibia Orienteering | federation |
| NPet | Petanque Namibia | federation |
| NTBF | Namibia Teqball Federation | federation |
| RSN | Roller Sports Namibia | federation |

### 3.2 Zero-list abbreviations

| Gap | Count | List |
|-----|------:|------|
| Zero news | 22 | ICSF, ISN, LN, NAWISA, NBB, NFCMA, NK, NKA, NLAS, NMAF, NMP, NNSSU, NO, NPet, NPSA, NSHA, NTBF, NUFS, NWMGF, NWSA, RSN, UFN |
| Zero events | 18 | BFN, LN, NAWISA, NBB, NK, NKA, NM, NMAF, NMP, NMTF, NO, NPet, NPSA, NSB, NSHA, NTBF, NUFS, RSN |
| Zero clubs | 41 | ICSF, ISN, LN, MSYNS, NAWISA, NBB, NBodF, NBV, NDA, NESA, NF, NFCMA, NFGF, NHRA, NK, NKA, NLAS, NM, NMAF, NMP, NMTF, NNOC, NNSSU, NO, NPC, NPet, NSB, NSC, NSRF, NSSF, NTBF, NTFN, NUFS, NWMGF, NWSA, PWFN, RN, RSN, TISAN, TKD, UFN |
| Zero athletes | 49 | AAN, FBN, ICSF, ISN, LN, MSYNS, NAMEF, NAWISA, NBA, NBB, NBodF, NBV, NClimb, NF, NFCMA, NFF, NFFAA, NFGF, NHRA, NK, NKA, NLAS, NM, NMAF, NMP, NMSF, NMTF, NNOC, NNSSU, NO, NPet, NPSA, NPTF, NSA, NSAIL, NSB, NSC, NSHA, NSRF, NSSF, NTBF, NUFS, NWMGF, NWSA, RN, RSN, SKN, TISAN, UFN |
| With media | 16 | AN, CN, NASFED, NBCC, NBF, NBV, NFA, NHF, NHU, NJDF, NNF, NNOC, NRU, NSC, NTA, NVF |
| With streams | 4 | CN, NASFED, NFA, NRU |
| With HP | 7 | AN, CN, NASFED, NNOC, NPC, NRU, NSC |

### 3.3 Big-8 snapshot

| Fed | News | Events | Upcoming | Clubs | Athletes | Coaches | Media | Streams | HP | Zero dims |
|-----|-----:|-------:|---------:|------:|---------:|--------:|------:|--------:|---:|----------:|
| NFA | 13 | 14 | 3 | 18 | 16 | 5 | 4 | 1 | 0 | 1 (HP) |
| CN | 6 | 25 | 2 | 10 | 14 | 3 | 4 | 1 | 1 | **0** |
| AN | 5 | 22 | 4 | 6 | 8 | 4 | 3 | 0 | 1 | 1 (streams) |
| NHU | 1 | 10 | 0 | 5 | 7 | 3 | 4 | 0 | 0 | 2 |
| NBF | 1 | 8 | 1 | 7 | 14 | 2 | 4 | 0 | 0 | 2 |
| NASFED | 1 | 8 | 0 | 10 | 4 | 2 | 4 | 1 | 1 | **0** |
| NNF | 2 | 6 | 1 | 8 | 5 | 3 | 3 | 0 | 0 | 2 |
| NRU | 7 | 7 | 1 | 11 | 16 | 8 | 4 | 1 | 1 | **0** |

---

## 4. Events — upcoming vs past

| Metric | Value |
|--------|------:|
| Total rows | 293 |
| Published | **291** |
| Upcoming (`start_date >= now`) | **40** |
| Past (published) | **251** |
| With poster (published) | 238 (**81.8%**) |
| Upcoming with poster | **40 / 40 (100%)** |
| Published with `venue_id` | **8** |
| Published without venue | **283** |
| Active feds with any event | 65 / 83 |
| Active feds with upcoming | 25 / 83 |
| Active feds **zero events** | **18** |
| Active feds no upcoming | **58** |

**Calendar risk:** volume is healthy (+63 published since 21 Jul) but the **forward calendar shrank** (50 → 40). Most federations show only history — federation Events pages read as archives.

**Venue note:** `sportsplatform_venues` is a global table (42 active). There is no `federation_id`; federation↔venue association is only via `events.venue_id`, which is almost unused (8/291). Treat venue population as a platform-level gap, not a per-fed zero count.

---

## 5. Aggregated news stats

| Metric | Value |
|--------|------:|
| Total rows | 148 |
| Published | **147** |
| Unpublished | 1 |
| With featured image | 143 (**97.3%**) |
| With summary | 147 (100%) |
| With content (≥100 chars) | 147 (100%) |
| With tags | 124 (84%) |
| With `source_url` / `source_name` | 58 / 58 (**agg feed**) |
| Editorial/CMS (no source) | **89** |
| `federation_id` null | **46** (31% of published) |
| Distinct federations covered | **61** |
| Published last 30 days | **76** |
| Published last 90 days | **83** |
| Oldest / newest `published_at` | 2012-06-15 / 2026-07-24 |

### 5.1 By source (published)

| Source | n |
|--------|--:|
| (editorial/CMS) | 89 |
| Eagle FM | 10 |
| Confidente | 10 |
| Namibia Economist | 10 |
| Google News (Namibia sports) | 10 |
| New Era | 10 |
| The Namibian (via Google News) | 8 |

### 5.2 Top categories (published)

Football 19 · multi-sport 19 · netball 5 · rugby 5 · then long tail of 1–3 per sport (category taxonomy is noisy — mixed Title Case / kebab / free text).

**News gaps:** 22 federations still have zero articles; 46 published items are unlinked to a federation (aggregator + platform pieces) — hurts federation News pages even when national feed looks full.

---

## 6. Entity inventory (non-federation)

| Entity | Rows | Quality notes |
|--------|-----:|---------------|
| Clubs | **191** active | Logos 191/191; email **11.5%**; phone **16.8%**; any contact **33**; website **47.6%**; description ≥40 **24.6%**; region 191/191 |
| Athletes | **198** active (207 total) | Photos 198/198; 34 feds |
| Coaches | **47** active (48 total) | Photos 47/47; **only 16** feds — unchanged since 21 Jul |
| Venues | **42** | Photos present; weak event FK usage |
| Media | **61** | federation 56 / venue 4 / athlete 1 / club 0 / event 0 / coach 0 |
| Live streams | **4** | 0 live / 0 scheduled; CN, NASFED, NFA, NRU only |
| HP programs | **10** | AN, CN, NASFED, NNOC, NPC, NRU, NSC |
| Schools | **50** | Seed; not fed-scoped |

---

## 7. Top gaps (ordered by public impact)

1. **Upcoming calendar thin (40) + 58 feds with none** — Events pages look stale despite 291 published history.
2. **12 fully hollow federations** (incl. 3 umbrellas) — Clubs/News/Events/Athletes all empty; directory-only shells.
3. **Athletes sparse outside ~34 feds** — 49 zeros; Big sports mostly OK, mid-tier (AAN, NAMEF, NMSF, NSA, etc.) still empty.
4. **Coaches stuck at 47 / 16 feds** — no growth since prior audit; worst people-depth gap.
5. **Club contacts collapsed relative to count** — 191 clubs but only **33** with email/phone (~17%); logos solved, reachability not.
6. **Streams still VOD-only (4)** — Live aggregator cannot show live content for 79/83 actives.
7. **News federation linking** — 46 published articles with null `federation_id`; 22 feds at zero.
8. **Brand colors 57%** — identity visual solved for logo/hero; primary_color still missing on 36.
9. **Website 66%** — 28 actives without website (contacts research backlog).
10. **Media / HP / venues-on-events** — gallery and pathway depth concentrated in Big-8 + NSC/NNOC; event→venue FK almost unused.

---

## 8. Population priorities

### P0 — before soft public launch messaging

| Priority | Action | Target |
|----------|--------|--------|
| P0.1 | Seed **≥1 upcoming event** for every Big-8 + high-traffic mid-tier (NHU, NAGU, NCF, NKF, NAMEF, AAN, NVF, NTA, NBCC) that currently has 0 upcoming | Reduce “no upcoming” from 58 → &lt;40 |
| P0.2 | Minimum content pack for **12 hollow** shells: 1 news + 1 event (or clear “emerging sport” stub) + 1 club or athlete where real data exists | Eliminate 8/8 zero shells |
| P0.3 | Fill **10 no-contact** federations (email or phone) | Contact 88% → **100%** |
| P0.4 | Keep news-aggregator healthy; backfill `federation_id` on unlinked agg items where sport hint is confident | Cut null-fed news from 46 |

### P1 — beta quality (next 1–2 weeks)

| Priority | Action | Target |
|----------|--------|--------|
| P1.1 | Athletes for mid-tier zeros with public squads (AAN, NAMEF, NMSF, NSA, NFF, FBN, NBA, …) | Athletes coverage 34 → **45+** feds |
| P1.2 | Coaches for Big-8 + next 10 (NAGU, NCF, NKF, NChF already partial) | Coaches 16 → **30** feds |
| P1.3 | Club contact enrichment (email/phone) on existing 191 | Contact rate ≥ **40%** |
| P1.4 | Websites for remaining 28; brand colors for remaining 36 | Website ≥80%; colors ≥80% |
| P1.5 | Zero-news list (22) — one editorial or attributed agg article each | News coverage 61 → **83** |

### P2 — depth / differentiation

| Priority | Action | Target |
|----------|--------|--------|
| P2.1 | Live or scheduled streams beyond NFA/CN/NRU/NASFED | Streams feds 4 → **10+** |
| P2.2 | Federation media galleries beyond current 16 | Media feds → **30+** |
| P2.3 | Link published events to `venue_id` (Windhoek / coastal hubs) | Events-with-venue 8 → **100+** |
| P2.4 | HP pathways for remaining Big-8 (NFA, NHU, NBF, NNF) | HP on all Big-8 |
| P2.5 | Normalize news `category` taxonomy (kebab + controlled vocab) | Collapse ~80 free-text labels |

---

## 9. Method notes

- Active = `sportsplatform_federations.is_active = true`.
- Contact = non-empty `email` OR `phone`.
- Description fill requires `length(btrim(description)) >= 40`.
- News / events counts use `is_published = true`.
- Upcoming = `start_date >= NOW()` at query time (UTC on Supabase).
- Media per federation = `entity_type = 'federation' AND entity_id = fed.id`.
- Venues are **not** federation-scoped in schema; do not invent per-fed venue zeros.
- All figures from live Postgres on 2026-07-25; prior audit numbers cited only for deltas.

---

## 10. One-line verdict

**Identity complete (100% logo/hero/description); content depth uneven — 12 hollow shells, 58 feds without upcoming events, coaches/media/streams still Big-8-centric.**
