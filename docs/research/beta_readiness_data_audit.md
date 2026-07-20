# Beta / Prod Readiness — Data Completeness Audit

**Agent:** AUDIT  
**Project:** `rbibqjgsnrueubrvyqps` (EU West)  
**Snapshot:** 2026-07-20 evening re-query (live SQL via Supabase MCP)  
**Scope:** Federations, events, clubs, news, streams, media, athletes/venues — plus RLS / client empty-state blockers  
**DB mutations this audit:** none  
**Note:** Earlier same-day scorecard (events 126 / posters 0% / logos 52% / streams 0) is superseded below after passes `000032`–`000040`.

---

## Executive scorecard

| Domain | Rows (usable) | Completeness | Beta grade | Verdict |
|--------|--------------:|-------------:|:----------:|---------|
| Federations (active) | 83 / 85 | Meta **strong**; logos **59%**; heroes **100%**; contacts **good** | **B+** | Directory demo-ready; close P0 crests |
| Events | **203** published / **32 upcoming** | Posters **64%** (129); **21** feds still zero events | **C+** | Calendar improved; Big-8 upcoming still patchy |
| Clubs | 62 active / **16** feds only | Logos **0%**; contacts **0%**; 67 feds empty | **D** | Most federation Clubs pages empty |
| News | 47 published / **25** feds | Featured images **100%** | **B** | Home/News usable; Pass 2 filled 12 more zero-news majors |
| Live streams | **4** VODs (0 live / 0 scheduled) | Thumbnails **100%** | **D+** | Nav gated via `useShowLiveNav`; `/live` = Recent Coverage |
| Media / photos | **61** | Flagship + pass 2 galleries | **C+** | `000044`+`000054`; still not wired as rich UX |
| Athletes | **71** active / **12** feds (80 total) | Photos **100%** | **B−** | Depth OK; most photos sport stock not portraits (`000046`) |
| Venues | **28** | Photos **100%** | **B** | Major venues covered; capacities sparse on new rows |
| Schools | 50 | N/A (seed) | **C** | Present; not wired as hero UX |
| HP programs | 0 | — | **F** | Unused |
| **Security / RLS** | 13 tables | Hardened (`000030` + `000034`); **0** sportsplatform advisor lints | **A-** | Write GRANTs revoked; residual: Hyperdrive bypass, media/schools open SELECT |

**Overall beta readiness (data + security): ~58 / 100 — soft-demo OK; not public-beta ready.**  
Security gate cleared. Content blockers: upcoming calendars for NFA/Cricket/Aquatics/Basketball/Hockey, remaining crests, clubs/media depth, Live still VOD-only.

### Path to public beta (minimum bar)

1. **Hard gate:** ~~tighten RLS~~ **done** (`000030` + `000034`).  
2. **Content gate:** ≥40 upcoming across Big-8 (**32** now; majors still missing); news+images **done**; Live nav gated + 4 VODs seeded.  
3. **Visual gate:** logos on remaining high-traffic feds (Golf/Karate/Handball…); posters on remaining **18** upcoming without.  
4. **UX gate:** keep Live nav honest (already gated); commit/deploy local logo+sport assets.

---

## 1. Federations scorecard (active only, n=83)

| Field | Filled | Rate |
|-------|-------:|-----:|
| slug / abbreviation / description (≥40 chars) | 83 | **100%** |
| email | 73 | **88%** |
| phone | 66 | **80%** |
| email **or** phone | 73 | **88%** |
| website | 54 | **65%** |
| any social | 49 | **59%** |
| president | 57 | **69%** |
| secretary_general | 46 | **55%** |
| logo | **49** | **59%** |
| background_image | **83** | **100%** |
| primary_color | 15 | **18%** |
| null email **and** phone | 10 | **12%** gap |

**Type mix (active):** 1 ministry + 1 commission + 8 umbrella + 73 federation.

**Still strong:** roster reconciled, descriptions + heroes filled, soft-merge lifecycle works.  
**Still weak:** crest coverage (~41% null), brand colors, emerging-sport contacts.

---

## 2. Top 20 empty federations by importance

Ranked by importance band (Ministry/Commission → Umbrella → Big sports → rest), then content/profile gap score (missing logo/contacts + no upcoming/clubs/news).

| # | Org | Type | Gap focus | Why it matters |
|--:|-----|------|-----------|----------------|
| 1 | Ministry (MSYNS) | ministry | No upcoming / clubs / news | National brand; directory OK, subpages hollow |
| 2 | Namibia Sports Commission | commission | No upcoming / clubs / news | Same |
| 3 | NLAS | umbrella | Null logo + no content | Umbrella body on Home grid |
| 4 | NUFS | umbrella | Null logo + no content | Umbrella |
| 5 | TISAN | umbrella | Null logo + almost no content | Umbrella (1 past news) |
| 6 | NNSSU | umbrella | Null logo + no content | Students sport |
| 7 | Martial Arts (NMAF) | umbrella | Phone/color + no content | Umbrella with crest |
| 8 | NAWISA | umbrella | Social/color + no content | Women in sport |
| 9 | Paralympic (NPC) | umbrella | Profile OK; **1 news** (Shikongo); still 0 events/clubs | High visibility |
| 10 | NNOC | umbrella | Has upcoming + news; **0 clubs** | Olympics path |
| 11 | **Padel (NPTF)** | federation | Email/phone/website/social + no content | Growing sport; crest landed |
| 12 | Ice & Inline Hockey | federation | Profile OK; **zero** content rows | Crest present, empty site |
| 13 | Beach Volleyball | federation | 1 upcoming; 0 clubs/news | Linked to NVF brand |
| 14 | Athletics Namibia | federation | **0 upcoming** (6 past); missing president/color | Flagship athletics |
| 15 | Basketball | federation | **0 upcoming**; 0 news | Major |
| 16 | Table Tennis | federation | **0 upcoming**; 0 news | Major |
| 17 | Hockey Union | federation | **0 upcoming**; 0 news | Major |
| 18 | Cricket Namibia | federation | **0 upcoming** (13 past!) | Flagship — calendar stale |
| 19 | Aquatics (NASFED) | federation | **0 upcoming** | Flagship |
| 20 | Football (NFA) | federation | **0 upcoming** (6 past, 18 clubs) | Highest traffic — calendar hole |

**Highest-ROI empties (not just obscure sports):** NFA, Cricket, Athletics, Basketball, Hockey, Aquatics need **new upcoming events** first — profile fields are already good. Umbrellas need logos (NLAS/NUFS/TISAN/NNSSU) or honest “body” empty states.

**Worst profile stubs (gap_score 13–15, lower importance):** Baseball, Lacrosse, Korfball, Orienteering, Western Mounted Games, Petanque, Softball, Footgolf, Bodybuilding — leave for post-beta unless a partner asks.

---

## 3. Events coverage holes

| Metric | Value |
|--------|------:|
| Published events | **203** (205 total rows) |
| Upcoming (`start_date >= now`) | **32** |
| Past | 171 |
| With poster_url | **129 (64%)** |
| Upcoming with poster | **14 / 32** |
| Distinct feds with any event | **62 / 83** |
| Distinct feds with **upcoming** | **21 / 83** |
| Active feds with **zero** events | **21** |
| Active feds with no upcoming | **62** |

*(Older table below listed the prior 16 upcoming; superseded by Passes 2–4 — see `events_enrichment_batch.md`.)*

### Upcoming 16 (all poster-less)

| Date | Event | Federation |
|------|-------|------------|
| 2026-07-21 | 15th African Archery Championships | Archery |
| 2026-07-23 | Commonwealth Games 2026 – Namibia Delegation | NNOC |
| 2026-07-27 | Boxing Development Clinic Kavango | Boxing Control |
| 2026-08-01 | Davis Cup Africa Group III | Tennis |
| 2026-08-07 | World Games Archery | Archery |
| 2026-08-07 | CAVB Zone VI Beach VB Leg 4 | Volleyball |
| 2026-08-15 | Namibia Youth Netball Tournament | Netball |
| 2026-08-20 | Coastal Rugby Union Cup | NRU |
| 2026-09-10 | Regional Handball Tournament | Handball |
| 2026-09-14 | Volleyball National Championship | NVF |
| 2026-09-23 | Beach VB Leg 5 (×2 rows) | Beach VB / NVF |
| 2026-10-01 | Africa Nation Ultimate Championship | Ultimate |
| 2026-10-30 | African Powerlifting Champs | PWFN |
| 2026-10-31 | Olympic Youth Games – Namibia | NNOC |
| 2026-11-05 | Youth Olympics Triathlon Qualifier | Triathlon |

**Hole:** NFA, Cricket, Athletics, Basketball, Hockey, Netball (beyond one youth event), Aquatics — the sports users will click first — have **no or stale** upcoming calendars.

---

## 4. Image / photo holes

| Asset | Status | Impact |
|-------|--------|--------|
| Federation logos | **49/83** active (59%); **34** null | Home grid still initials for ~41% |
| Federation background_image | **83/83 (100%)** | Heroes closed (`000036`/`000040`) |
| Event posters | **129/203 (64%)** | Much improved; 18 upcoming still poster-less |
| Club logos | **0/62** | Clubs list bland |
| News featured_image | **35/35** | Filled via `20260720000031` + `/sports/*` assets |
| Athlete photos | **0/44** | Profiles initials-only |
| Venue photos | 8/15 (53%) | Partial |
| `sportsplatform_media` | **61 rows** | Flagship + pass 2 (`20260720000044`/`000054`); +netball/hockey/basketball/boxing/volleyball/tennis/aquatics/judo/handball + venues/athlete |
| Live stream thumbnails | **4/4** | VODs have thumbs; none live/scheduled |

**P0 crest still null (active):** Golf, Karate, Handball, Badminton, Powerlifting, Dance Sport, Horse Racing, Surfing, Taekwondo, Ultimate, + umbrellas NLAS/NUFS/TISAN/NNSSU, + long tail of emerging sports.

**Recently closed (batch19):** Fencing, Archery, Wrestling, Esports, Padel — logos now set.

---

## 5. Clubs / news / streams / media

| Domain | Count | Distinct feds | Notes |
|--------|------:|--------------:|-------|
| Clubs | 62 | 16 | Concentrated (NFA 18, NRU 7, Cricket 6…); **67 feds with 0 clubs** |
| News | **35** | **13** | All published + images (NEWS batch 2026-07-20); Big-8 + NNOC/NPC/NSC covered |
| Streams | **4** | 4 | VODs only; nav hidden until live/scheduled |
| Media | **24** | 6 | Flagship seed `20260720000044`; other feds still empty |
| Athletes | **71** active (80 total) | **12** | Photos **100%** (`20260720000046`); most sport stock |
| Coaches | 16 | — | Thin |
| Venues | **28** | — | Photos **100%**; major venues covered (`000046`) |

---

## 6. Client pages that look empty without data

| Route | Data dependency | Live empty risk |
|-------|-----------------|-----------------|
| `/` Home | Federations OK; upcoming events (8); news (6) | Events/news sections often near-empty |
| `/events` | `events.list` | Works but **poster-less**, calendar skewed past |
| `/live` | `streams.list` | No live/scheduled now; shows **Recent Coverage** (4 VODs); nav hidden |
| `/news` | `news.list` | ~47 items with featured images (25 feds); many Fed News still empty |
| `/federation/:slug` home | events + news + streams + clubs + athletes | Most slugs: all five empty |
| `…/events` | federation events | Empty for 48 feds; majors often past-only |
| `…/clubs` | clubs | Empty for 67 feds |
| `…/news` | news | Empty for 75 feds |
| `…/streams` | streams | Empty for **all** |
| `…/athletes` | athletes | Empty for 72 feds |
| Admin | mock vs tRPC | Still flagged in `docs/06_tasks.md` |

Empty-state UI **exists** on these pages (good). Problem is product perception: nav promises Live/News/Clubs that are hollow for most orgs.

---

## 7. Backend / security must-fix before public beta

### 7.1 RLS — critical → **FIXED 2026-07-20 (Agent RLS)**

**Before:** all 13 tables had `INSERT/UPDATE/DELETE … auth.role() = 'authenticated'` (any logged-in user could mutate any row via PostgREST).

**After:** migration `20260720000030_harden_sportsplatform_rls.sql` applied live on `rbibqjgsnrueubrvyqps`:
- Dropped open write policies; public SELECT retained for catalog tables
- Writes: platform `admin` and/or `federation_admin` matched via `sportsplatform_users.open_id = auth.uid()` + `federation_id`
- Users / WhatsApp: SELECT/WRITE own row (or admin) only
- Verified: `SET ROLE authenticated` update on federations → **0 rows**
- Advisors: still **423** project-wide (co-tenant); **0** lints naming `sportsplatform_*` after harden

**Residual pass (`20260720000034`, applied live):**
- Public SELECT tightened: `is_published` (news/events), active rows (federations/clubs/athletes/coaches/venues/hp), streams with URL/schedule/live
- Staff SELECT drafts/inactive via admin / federation_admin policies
- `REVOKE INSERT/UPDATE/DELETE/TRUNCATE` from `anon` + `authenticated` on all `sportsplatform_*` (SELECT kept; `service_role` writes intact)
- Verified: anon cannot see unpublished event/news or inactive federation; authenticated update → `permission denied` (GRANT)

Remaining residuals: Hyperdrive privileged role bypasses RLS (server-only); `media`/`schools` still public SELECT `USING (true)` (no publish column); `club_manager` write policies deferred; PostgREST admin writes also blocked by GRANT (mutations via tRPC only — intentional).

### 7.2 Other backend blockers (from tasks + quick scan)

| Item | Status |
|------|--------|
| Rate limiting on auth / public mutations | **Missing** (no `rateLimit` in `server/`) |
| `.env.example` completeness | Still open in tasks |
| List query limits | Partial (news limit 50); audit others |
| WhatsApp subscribe/unsubscribe routers | Still open |
| Admin page on real tRPC | Still mock |
| Indexes / ON DELETE FK audit | Still open Phase 1 |

tRPC federation admin procedures + revoked PostgREST write GRANTs: clients cannot mutate via anon/authenticated keys.

---

## 8. Ordered action plan — next 48 hours

### Hour 0–4 — Security (blocker)

1. ~~Replace open write policies~~ **done** (`20260720000030`). ~~Tighten SELECT + REVOKE write GRANTs~~ **done** (`20260720000034`).
2. Confirm client never uses service_role; document that mutations go through tRPC only.  
3. ~~Re-run Supabase security advisors filtered to `sportsplatform_%`~~ — 0 sportsplatform-named lints; 423 project-wide remain (other products).

### Hour 4–16 — Calendar + Home (highest UX ROI)

4. Seed **≥3 upcoming events each** for NFA, Cricket, Athletics, Basketball, Hockey, Aquatics, Netball, NRU (reuse real fixtures from federation sites/NSC calendar).  
5. Add `poster_url` (even shared stock/sport imagery) for the current **16** upcoming events.  
6. ~~Publish **8–12 news articles** with `featured_image` spanning NFA/NRU/Cricket/Athletics/NNOC/NSC.~~ **Done** — migration `20260720000031` (12 new + image backfill) + Pass 2 `20260720000047` (+12 zero-news majors → **47** / **25** feds; see `docs/research/news_enrichment_batch.md`).

### Hour 16–28 — Stop empty Live / media void

7. Either **hide Live from nav** until data exists, or seed **2–4 scheduled streams** (YouTube embeds for next NRU/NFA/NNOC events).  
8. Add **≥20 media** rows (federation entity photos) for 5 flagship orgs — unblocks gallery patterns later.

### Hour 28–40 — Visual federation grid

9. Crests for: **Golf, Karate, Handball, Badminton, Powerlifting**, umbrellas **NNSSU/NLAS** if assets exist in `_candidates`.  
10. Club logos for top NFA/NRU/Cricket clubs (even 15 logos changes Clubs perception).

### Hour 40–48 — Hygiene

11. Fill remaining **10** null email+phone only where verified (don’t invent).  
12. Update `docs/06_tasks.md` RLS item to “harden open policies” (done in this PR of docs).  
13. Smoke: Home, Events, News, one full federation (NFA), one empty federation (Padel) — confirm empty states, not errors.

---

## 9. What *not* to prioritize before beta

- Brand colors for all 83 (18% is fine if logos exist).  
- Full club directory for all 73 federations.  
- Schools / HP programs depth.  
- Obscure federation contact research (Baseball/Lacrosse/Korfball…) unless partners demand it.  
- Schema extensions (`established_year`, city/region) — draft only.

---

## 10. Scoreboard summary (one glance)

```
Federations meta     ████████████████░░░░  82%
Federation logos     ████████████░░░░░░░░  59%
Fed heroes           ████████████████████ 100%
Events (upcoming)    ██████░░░░░░░░░░░░░░  32 events / 21 feds
Event posters        █████████████░░░░░░░  64%
Clubs coverage       ████░░░░░░░░░░░░░░░░  16/83 feds
News coverage        ███░░░░░░░░░░░░░░░░░  13/83 feds (35 w/ images)
Streams (VOD)        █░░░░░░░░░░░░░░░░░░░  4 (nav gated)
Media / HP           ░░░░░░░░░░░░░░░░░░░░  0
RLS write safety     ████████████████████  PASS (writes+SELECT+GRANTs)
────────────────────────────────────────
Public beta          NOT READY (~58/100; security gate cleared)
Demo / invite-only   OK; Live nav honest; deploy local assets
```

---

## Related docs

- `docs/research/federation_data_gap_list.md` — logo/website/contact detail  
- `docs/research/federation_completeness_snapshot.md` — field fill rates  
- `docs/research/contacts_enrichment_batch.md`  
- `docs/research/websites_socials_enrichment_batch.md`  
- `docs/06_tasks.md` — master checklist (updated with audit findings)
