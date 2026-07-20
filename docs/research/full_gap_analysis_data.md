# Full Gap Analysis — Agent DATA

**Project:** `rbibqjgsnrueubrvyqps` (EU West)  
**Snapshot:** 2026-07-21 ~00:28 CAT (live SQL via Supabase MCP)  
**Mutations:** none (read-only)  
**Source of truth:** live Postgres, not prior audit files  
**Tables:** `sportsplatform_*` (`logo` on federations; `news_articles`; `live_streams`)

---

## Executive scorecard (~74 / 100)

| Domain | Live count | Fill / coverage | Grade |
|--------|-----------:|-----------------|:----:|
| Federations (active) | **83** / 85 | Logos **64%**; heroes **100%**; contacts **88%**; websites **66%**; colors **57%** | B+ |
| Events | **228** pub / **50** upcoming | Posters **76%**; upcoming posters **100%**; **18** feds zero events | B |
| Clubs | **165** active / **34** feds | Logos **100%**; any contact **50%**; **49** feds empty | B− |
| News | **73** published / **51** feds | Featured images **100%**; **32** feds empty | A− |
| Athletes | **124** active / **19** feds | Photos **100%**; **64** feds empty | B |
| Coaches | **47** active / **16** feds | Photos **100%** | C+ |
| Venues | **42** | Photos **100%** | B+ |
| Media | **61** | federation 56 / venue 4 / athlete 1 | C+ |
| Streams | **4** VOD | 0 live / 0 scheduled; thumbs **100%** | D+ |
| HP programs | **10** active | Seeded pathways | C+ |
| Schools | **50** | Seed present | C |

**Verdict:** Soft / invite beta viable on Big-8 + directory. Remaining launch blockers are crest gaps, hollow federation Clubs/News/Athletes pages, Live still VOD-only, and brand colors on ~43% of actives.

Delta vs prior audit (~00:20 CAT): logos 51→**53**; clubs 131→**165**; club contacts 25→**82**; athletes 92→**124**; coaches 35→**47**; feds-with-clubs 26→**34**. Events / news / streams / HP / schools unchanged.

---

## 1. Federations (active n=83)

| Field | Filled | Rate |
|-------|-------:|-----:|
| description (≥40 chars) | 83 | **100%** |
| background_image (hero) | 83 | **100%** |
| email | 73 | **88%** |
| phone | 66 | **80%** |
| email **or** phone | 73 | **88%** |
| website | 55 | **66%** |
| any social | 52 | **63%** |
| president | 71 | **86%** |
| secretary_general | 48 | **58%** |
| logo | **53** | **64%** |
| primary_color | **47** | **57%** |
| secondary_color | 47 | **57%** |

**Gaps:** null logo **30**; null website **28**; null both contacts **10**; null primary_color **36**; logo-but-no-color **6**.  
**Type mix:** 1 ministry + 1 commission + 8 umbrella + 73 federation.

### Null logos (30)

Umbrella: NNSSU, NUFS, TISAN.  
High-visibility feds: NAGU (Golf), NKF (Karate), BFN (Badminton), DSN, NSRF, TKD, UFN, PWFN, plus long-tail emerging (Baseball, Lacrosse, Korfball, Teqball, Muaythai, Soft/Petanque, Footgolf, Horse Racing, etc.).

---

## 2. Events

| Metric | Value |
|--------|------:|
| Total rows | 230 |
| Published | **228** |
| Upcoming (`start_date >= now`) | **50** |
| Past | 178 |
| With poster | 174 (**76%**) |
| Upcoming with poster | **50 / 50 (100%)** |
| Feds with any event | 65 / 83 |
| Feds with upcoming | 28 / 83 |
| Active feds **zero events** | **18** |
| Active feds no upcoming | **55** |

Zero-event actives: BFN, NBB, LN, NKA, NK, NMP, NM, NMTF, NO, NPSA, NSHA, NTBF, NPet, RSN, NSB, NMAF, NUFS, NAWISA.

### Big-8 (all calendars non-empty)

| Fed | Upcoming | Events | Clubs | News | Athletes | Logo |
|-----|---------:|-------:|------:|-----:|---------:|:----:|
| NFA | 3 | 10 | 18 | 6 | 16 | ✓ |
| CN | 5 | 18 | 10 | 4 | 14 | ✓ |
| AN | 4 | 16 | 6 | 5 | 8 | ✓ |
| NHU | 3 | 9 | 5 | 1 | 7 | ✓ |
| NBF | 2 | 7 | 6 | 1 | 0 | ✓ |
| NASFED | 1 | 8 | 10 | 1 | 4 | ✓ |
| NNF | 1 | 5 | 8 | 1 | 5 | ✓ |
| NRU | 1 | 6 | 11 | 4 | 16 | ✓ |

---

## 3. Content entities

| Entity | Rows | Notes |
|--------|-----:|-------|
| Clubs | **165** active | Logos 165/165; any contact **82 (50%)**; **34** feds covered |
| News articles | **73** pub | Images 73/73; **51** feds |
| Athletes | **124** active (133 total) | Photos 124/124; **19** feds |
| Coaches | **47** active (48 total) | Photos 47/47; **16** feds |
| Venues | **42** | Photos 42/42 |
| Media | **61** | federation 56 / venue 4 / athlete 1 |
| Live streams | **4** | 0 live, 0 scheduled |
| HP programs | **10** active | |
| Schools | **50** | |

---

## 4. Hollow federation subpages (active n=83)

| Hollow page | Count | Share |
|-------------|------:|------:|
| 0 clubs | **49** | 59% |
| 0 news | **32** | 39% |
| 0 athletes | **64** | 77% |
| 0 events | **18** | 22% |
| 0 upcoming | **55** | 66% |
| 0 clubs + news + athletes | **28** | 34% |
| 0 clubs + news + athletes + events | **16** | 19% |

Among `type=federation` only (n=73): zero clubs **39**; zero news **27**; zero athletes **55**; zero events **15**.

Fully hollow (no clubs/news/athletes/events): NBB, LN, NKA, NK, NMP, NM, NMTF, NO, NSHA, NTBF, NPet, RSN, NSB, NMAF, NUFS, NAWISA.

---

## 5. Top content gaps (priority)

1. **Crests (30 null logos)** — especially Golf/Karate/Badminton/PWFN + umbrellas NNSSU/NUFS/TISAN (Home grid).
2. **Hollow Clubs pages (49 feds)** — majority of federation sites still empty; contacts only half-filled where clubs exist.
3. **Hollow Athletes (64) / News (32)** — depth concentrated in Big-8; Basketball athletes still **0**.
4. **Live** — still 4 VODs only; no live/scheduled rows.
5. **Brand colors** — 36 actives missing `primary_color` (incl. 6 with logo but no color).
6. **Websites** — 28 actives without website; 10 with neither email nor phone.
7. **Long-tail zero-event feds (18)** — emerging sports + some umbrellas; post-beta unless partner push.

**Highest ROI next:** crest batch → 1–2 scheduled streams → NBF athletes → club contacts for NFA/NRU/CN → empty-state UX for hollow subpages.
