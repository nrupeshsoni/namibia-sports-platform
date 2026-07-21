# Public-Ready Data Snapshot — Agent 5 DATA

**Agent:** PUBLIC-READY GAP — Agent 5 (DATA)  
**Project:** `rbibqjgsnrueubrvyqps` (Sports, EU West)  
**Snapshot:** 2026-07-21 ~11:50 CAT  
**Method:** Live SQL via Supabase MCP (`execute_sql`) — read-only, no DB mutations  
**Baseline compare:** `docs/research/beta_readiness_data_audit.md` (~00:20 CAT same day)

---

## Executive verdict

| Gate | Status |
|------|--------|
| Federation directory (identity) | **Soft-ready** — heroes 100%; logos **64%**; colors **57%** |
| Big-8 content depth | **Met** — all 8 have logos + ≥1 upcoming + clubs + news |
| National calendar | **Viable** — **46** upcoming published; **55/83** feds have none |
| Hollow federation subpages | **Blocking** — **26** feds empty on clubs+news+athletes+coaches+upcoming |
| Live / streams | **Not launch-ready** — 4 VODs, **0** live, **0** scheduled |
| People / clubs long-tail | **Partial** — row counts up vs morning audit; majority of feds still empty |

### Content score for public launch: **63 / 100**

Not polished national launch. Soft public / invite-first is defensible for Home, News, Events, and Big-8 federation sites. Majority of federation Clubs / Athletes / Coaches pages still hollow; crest gap (30 null logos) remains the top visual risk on the Home grid.

| Dimension | Max | Score | Why |
|-----------|----:|------:|-----|
| Federation identity (logo / hero / color / contact / website) | 25 | **17** | Heroes perfect; contacts strong; logos & brand colors lag |
| Events calendar (volume + upcoming + coverage) | 20 | **13** | Solid fixture density for majors; 18 zero-event feds |
| Clubs | 15 | **9** | 165 active, logos 100%; contacts thin; 49 feds empty |
| News | 15 | **11** | 73 published + images; 32 feds still zero |
| Athletes & coaches | 10 | **6** | Depth improved; 64 / 67 feds still empty |
| Venues / media / streams / HP | 15 | **7** | Venues strong; Live VOD-only; HP thin (7 feds) |
| **Total** | **100** | **63** | |

**Grade band:** C+ (soft public) — not A-launch until crests close and hollow subpage rate drops below ~15% of active federations.

---

## 1. Federations — fill rates (active only, n=83)

| Field | Filled | Rate |
|-------|-------:|-----:|
| slug / abbreviation / description (≥40 chars) | 83 | **100%** |
| `background_image` (hero) | **83** | **100%** |
| email **or** phone | **73** | **88.0%** |
| email | 73 | 88.0% |
| phone | 66 | 79.5% |
| neither email nor phone | 10 | 12.0% gap |
| website | **55** | **66.3%** |
| any social (FB/IG/X/YT) | 52 | 62.7% |
| president | 71 | 85.5% |
| secretary_general | 48 | 57.8% |
| `logo` | **53** | **63.9%** |
| `primary_color` / `secondary_color` | **47** | **56.6%** |

**Entity mix (active):** 1 ministry + 1 commission + 8 umbrella + 73 federation.  
**Inactive / soft-merged:** 2 of 85 total rows.

### Null logos (30) — launch visual gap

| Type | Abbreviations |
|------|----------------|
| Umbrella (3) | NNSSU, NUFS, TISAN |
| Federation (27) | BFN, NBB, BSN, NBodF, DSN, NAGU, ICSF, NKF, LN, NFGF, NHRA, NKA, NK, NMP, NMTF, NO, PWFN, NPSA, NSHA, NTBF, NWSA, NWMGF, NPet, NSB, NSRF, TKD, UFN |

High-traffic nulls for Home grid: **NAGU (Golf), NKF (Karate), BFN, DSN, NSRF, TKD, UFN, PWFN**, plus umbrellas **NNSSU / NUFS / TISAN**.

### Contact-null (no email and no phone) — 10

Includes long-tail: Baseball, Bodybuilding, Lacrosse, Footgolf, Korfball, Orienteering, Western Mounted Games, Petanque, Softball, Padel Tennis (logo present), etc.

---

## 2. Events

| Metric | Value |
|--------|------:|
| Total rows | 230 |
| Published | **228** |
| Upcoming (`start_date >= now()`) | **46** |
| Past (published) | 182 |
| With `poster_url` | 174 / 228 (**76%**) |
| Upcoming with poster | **46 / 46 (100%)** |
| Distinct feds with any published event | **65 / 83** |
| Distinct feds with upcoming | **28 / 83** |
| Active feds with **zero** events | **18** |
| Active feds with **no upcoming** | **55** |

**Delta vs ~00:20 audit:** upcoming 50 → **46** (fixtures rolled past; calendar still healthy).

### Next fixtures (sample)

| Date | Event | Fed |
|------|-------|-----|
| 2026-07-23 | Commonwealth Games (multi) + Hockey Test 3 | NASFED / AN / NBA / NBCC / NGF / NNOC / NHU |
| 2026-07-24 | KBA Premier League Mid-Season | NBF |
| 2026-07-24 | FEI Jumping World Challenge Gymkhana | NAMEF |
| 2026-07-25 | CWC League 2: Namibia vs Netherlands | CN |

### Zero-event active federations (18)

NMAF, NUFS, NAWISA, Badminton, Baseball, Lacrosse, Kendo, Korfball, Modern Pentathlon, Mountaineering, Muaythai, Orienteering, Practical Shooting, Speed Hiking, Teqball, Petanque, Roller Sports, Softball.

---

## 3. Clubs / news / people / venues / media / streams / HP

| Domain | Rows (usable) | Coverage | Field quality | Notes |
|--------|--------------:|----------|---------------|-------|
| **Clubs** | **165** active | **34 / 83** feds | Logos **100%**; contact email/phone **29 (18%)** | +34 vs morning audit; **49** feds empty |
| **News** | **73** published | **51 / 83** feds | Featured image **100%** | Unchanged count; **32** feds zero news |
| **Athletes** | **124** active (133 total) | **19 / 83** feds | Photos **100%** | +32 active vs morning; **64** feds empty |
| **Coaches** | **47** active (48 total) | **16 / 83** feds | Photos **100%** | +12 vs morning; **67** feds empty |
| **Venues** | **42** active | national seed | Photos **100%** | Launch-OK for directory |
| **Media** | **61** | federation 56 / venue 4 / athlete 1 | — | Gallery UX still thin |
| **Streams** | **4** | 0 live / 0 future scheduled | Thumbnails **100%** | All past YouTube VODs |
| **HP programs** | **10** active | **7 / 83** feds | Seeded pathways | NSC (4), + NPC/NRU/NNOC/AN/NASFED/CN |
| **Schools** | 50 | seed | — | Present; not hero UX |

### Live streams inventory

| # | Title | Live? | Scheduled |
|--:|-------|:-----:|-----------|
| 1 | NFA President on Sport & Namibia's Independence | no | 2026-03-21 (past relative to “now” for live flag) |
| 2 | Return of the Namibia Rugby Premier League | no | 2025-11-15 |
| 3 | Namibia v Oman \| T20 World Cup 2024 Highlights | no | 2024-06-02 |
| 4 | NASFED Long Course Gala Across Three Towns | no | 2025-09-20 |

**Public implication:** keep Live nav gated; do not market “live” until ≥1 scheduled/live row exists.

---

## 4. Hollow subpage counts (active federations, n=83)

A federation is “hollow” when the corresponding public list page would show empty.

| Hollow definition | Count | Rate |
|-------------------|------:|-----:|
| Zero **events** (any published) | **18** | 22% |
| Zero **upcoming** events | **55** | 66% |
| Zero **clubs** | **49** | 59% |
| Zero **news** | **32** | 39% |
| Zero **athletes** | **64** | 77% |
| Zero **coaches** | **67** | 81% |
| Zero **streams** | **79** | 95% |
| Zero **HP** | **76** | 92% |
| Hollow core-4 (no clubs + news + athletes + upcoming) | **26** | 31% |
| Hollow core-5 (+ no coaches) | **26** | 31% |
| Hollow all content (no events + clubs + news + athletes + coaches) | **16** | 19% |

### Sample hollow core-5 (no clubs / news / athletes / coaches / upcoming)

Umbrellas: NLAS, NMAF, NNSSU, NUFS, NAWISA.  
Federations: Baseball, Ice Stock, ICSF, Lacrosse, MMA Namibia, Footgolf, Kendo, Kickboxing, Korfball, Modern Pentathlon, Mountaineering, Muaythai, Orienteering, Speed Hiking, Teqball, Waterski, Western Mounted Games, Petanque, Roller Sports, Skateboarding, Softball, …

---

## 5. Big-8 (must-not-hollow for public launch)

| Fed | Logo | Upcoming | Events | Clubs | News | Athletes | Coaches |
|-----|:----:|---------:|-------:|------:|-----:|---------:|--------:|
| NFA | ✓ | 3 | 10 | 18 | 6 | 16 | 5 |
| CN | ✓ | 3 | 18 | 10 | 4 | 14 | 3 |
| AN | ✓ | 4 | 16 | 6 | 5 | 8 | 4 |
| NHU | ✓ | 2 | 9 | 5 | 1 | 7 | 3 |
| NBF | ✓ | 2 | 7 | 6 | 1 | **0** | 2 |
| NASFED | ✓ | 1 | 8 | 10 | 1 | 4 | 2 |
| NNF | ✓ | 1 | 5 | 8 | 1 | 5 | 3 |
| NRU | ✓ | 1 | 6 | 11 | 4 | 16 | 8 |

**Big-8 gate:** calendars + logos + clubs + news **pass**. Residual: **Basketball athletes = 0**; several feds still only 1 news row.

---

## 6. Delta vs morning beta audit (~00:20 → ~11:50)

| Metric | ~00:20 | ~11:50 | Δ |
|--------|-------:|-------:|--:|
| Active federation logos | 53 / 83 | 53 / 83 | 0 |
| Heroes / contacts / websites / colors | same band | same | ~0 |
| Upcoming events | 50 | **46** | −4 |
| Active clubs | 131 | **165** | **+34** |
| Feds with clubs | 26 | **34** | **+8** |
| Active athletes | 92 | **124** | **+32** |
| Feds with athletes | 15 | **19** | **+4** |
| Active coaches | 35 | **47** | **+12** |
| Feds with coaches | 11 | **16** | **+5** |
| News / streams / media / HP / venues | 73 / 4 / 61 / 10 / 42 | same | 0 |
| Hollow core-5 | (not stated) | **26** | — |
| Beta content+security score (prior) | ~72 | — | — |
| **This snapshot: content-only public launch** | — | **63** | stricter bar |

Sibling enrichment (clubs / people) improved row depth; **identity and hollow-subpage rates still dominate the public-launch gap**.

---

## 7. Highest-ROI content gaps for public launch

1. **Crests (30 null logos)** — especially Golf, Karate, Badminton, Dance, Surfing, TKD, Ultimate, PWFN + NNSSU/NUFS/TISAN.  
2. **Brand colors** — still **47/83**; blocked on missing/invalid crests.  
3. **Hollow subpages** — cut core-5 hollow from **26 → ≤12** with minimum 1 club + 1 news (or honest empty-state copy).  
4. **Club contacts** — only **18%** have email/phone; hurts Clubs detail pages.  
5. **Basketball athletes** — Big-8 hole.  
6. **Live** — seed ≥1 scheduled stream or keep nav gated.  
7. **Zero-event long-tail (18)** — one published fixture or hide Events tab until data exists.

---

## 8. Score interpretation

| Score | Meaning |
|------:|---------|
| 90–100 | National launch — dense content across most federations |
| 75–89 | Public launch OK with known long-tail gaps |
| **60–74** | **← here (63)** Soft public / marketing to Big-8 + national hubs |
| 40–59 | Invite-only beta |
| <40 | Internal demo only |

**Recommendation:** Treat **63/100** as soft-public content readiness. Do not claim “complete national coverage” until logos ≥85% and hollow core-5 ≤15% of active federations.

---

*Generated by Agent 5 DATA — read-only live SQL snapshot. No schema or row mutations.*
