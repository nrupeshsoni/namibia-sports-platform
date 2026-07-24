# Events Web Batch C — 2026-07-24

Agent: Events web discover Batch C (niche / umbrellas / para / remaining thin feds).  
Live project: `rbibqjgsnrueubrvyqps`.  
Migration: `supabase/migrations/20260724210000_events_web_batch_C.sql`  
Applied via Supabase MCP (`events_web_batch_C_20260724`).

## Scope

Remaining / niche / umbrellas / schools / parasport / chess / darts / esports / shooting / archery / sailing / surfing / equestrian / bowls / squash / softball / baseball / fistball / traditional — **verified public web only**. Day-level dates required; month-only calendars skipped.

## Baseline (pre-batch)

| Metric | Value |
|--------|-------|
| Total events | 230 |
| Published | 228 |
| Active feds with ≥1 event | 65 / 83 |
| Zero-event active feds | 18 |

## Actions

| Action | Count |
|--------|-------|
| New inserts | **14** |
| Date/description correction | **1** (`cohen-fistball-tournament-2026` → 9 May 2026) |
| Federations touched | chess, archery, NSC, bowls, paralympic, equestrian, handball, fistball |

## Inserts (verified)

| Slug | Federation | Dates | Primary sources |
|------|------------|-------|-----------------|
| `bank-windhoek-namibian-open-chess-2025` | `chess-namibia` | 10–14 Sep 2025 | Chessdom; chess-results; Namibia Economist |
| `fide-chess-olympiad-2026-namibia` | `chess-namibia` | 15–27 Sep 2026 | FIDE invitation; New Era Closed Champs team path |
| `aga-world-tournament-walvis-bay-2025` | `archery-namibia` | 24–26 Jul 2025 | Roots Gymnasium; Economist; Namibian Sun |
| `aga-african-federation-botswana-2026` | `archery-namibia` | 12–15 Aug 2026 | New Era (Kambonde); Economist follow-up |
| `ausc-region5-youth-games-namibia-2025` | `namibia-sports-commission` | 4–13 Jul 2025 | New Era; Republikein; Namibian Sun |
| `national-youth-games-2026-phase1-ondangwa` | `namibia-sports-commission` | 9–12 May 2026 | NSC LinkedIn; NBC; The Namibian (Phase 2 cancel) |
| `world-bowls-indoor-championship-2026-namibia` | `bowls-namibia` | 11–16 May 2026 | World Bowls; The Namibian; competitor list PDF |
| `commonwealth-games-2026-para-athletics-namibia` | `namibia-paralympic` | 23 Jul–2 Aug 2026 | Economist / New Era / The Namibian Team Namibia |
| `namef-rvs-beach-tournament-2026` | `equestrian-namibia` | 27 Feb–1 Mar 2026 | NAMEF Calendar 2026 PDF |
| `namef-easter-festival-2026` | `equestrian-namibia` | 3–5 Apr 2026 | NAMEF Calendar 2026 PDF |
| `namef-rco-annual-2026` | `equestrian-namibia` | 4–6 Sep 2026 | NAMEF Calendar 2026 PDF |
| `ihf-trophy-zone6-lusaka-2026` | `namibia-handball` | 28 Apr–2 May 2026 | IHF Zone VI event page |
| `redzone-handball-clash-2025` | `namibia-handball` | 22 Nov 2025 | The Namibian |

## Correction

| Slug | Change | Why |
|------|--------|-----|
| `cohen-fistball-tournament-2026` | start/end **2026-04-11 → 2026-05-09** + richer description | Namibian Sun / AZ previews dated 4 May 2026 (“this weekend”); Republikein results wrap |

## Already present (not re-inserted)

- Chess Closed 2026 / qualifiers (duplicate slugs already exist)
- Surfing Sound Garden 2026; sailing junior nationals 2026
- Squash PSA BDO Open 2025/26 + Closed 2026 (end date already 29 Nov 2025)
- Esports MTC NamLAN 2025 + NESA GEF qualifier window (4–25 Jul 2026 covers Grand Finals 25 Jul)
- Bowls National Week 2025/26 + CWG bowls
- Fistball Cohen Cup / National Cup / Ball-Balla 2025
- NAMEF GCW / RCO jumping champs / Eventing champs / FEI Challenge Jul 2026
- Top Score NEC 2026 (NSC); NSSU athletics 2025 (linked to athletics-namibia)
- Darts AUSC Region 5 2025 only (local calendar is month-only)

## Explicitly skipped (no verified day-level public fixture)

| Federation / topic | Reason |
|--------------------|--------|
| `softball-namibia`, `baseball-namibia` | No dated 2024–27 national host found |
| `namibia-practical-shooting`, `shooting-namibia` extras | Club calendars only; no confirmed NAPSA nationals date; IPSC World Shoot SA without verified Namibian entry list |
| `namibia-darts` local series | Official calendar lists **month only** (Mafia/Khomas/Erongo etc.) |
| `nawisa`, `nufs` | No dated public umbrella calendar |
| `badminton-namibia`, `petanque-namibia`, `roller-sports-namibia`, `lacrosse-namibia`, kendo/korfball/muaythai/orienteering/teqball/speed-hiking/mountaineering/martial-arts/modern-pentathlon | Research ceiling unchanged |
| AGA Namibia Nationals Oct 2025 | Press “recently held” / “last weekend” without anchored start day |
| Dance Sport 2026 nationals | Not announced |
| Global Esports Games LA Dec 2026 | Namibia not yet confirmed post–25 Jul finals |
| FEI Leg 1 May vs Apr calendar conflict | Skipped ambiguous press vs PDF clash |

## Post-apply (verified live)

| Metric | After |
|--------|-------|
| Total events | **270** (Batch C +14; concurrent Batches A/B also applied) |
| Published | **268** |
| Fistball Cohen 2026 | start_date **2026-05-09** |
| All 14 Batch C slugs | present |

## Source index

- https://www.chessdom.com/bank-windhoek-2025-namibian-open-live/
- https://ratings.fide.com/tournament_information.phtml?event=467390
- https://www.fide.com/invitation-46th-chess-olympiad-3rd-fide-chess-olympiad-for-people-with-disabilities-fide-congress-2026/
- https://www.rootsgymnasium.org/post/making-history-on-target-rooties-shine-at-the-aga-world-tournament
- https://neweralive.na/kambonde-takes-charge-namibia-targets-african-archery-glory/
- https://neweralive.na/2025-region-5-youth-games-rescheduled/
- https://www.worldbowls.com/2026-world-bowls-indoor-championship/
- https://www.namef.org.na/images/NAMEF_Calendar_2026_Final.pdf
- https://www.ihf.info/continent-federations/african-handball-confederation/109/events/275207
- https://www.namibian.com.na/titans-win-redzone-handball-clash/
- https://economist.com.na/107239/sport/23-athletes-to-participate-in-the-upcoming-2026-glasgow-commonwealth-games/
