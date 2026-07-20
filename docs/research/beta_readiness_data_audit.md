# Beta / Prod Readiness — Data Completeness Audit

**Agent:** AUDIT 10/10 (platform scorecard)  
**Project:** `rbibqjgsnrueubrvyqps` (EU West)  
**Snapshot:** 2026-07-21 ~00:20 CAT (live SQL via Supabase MCP; ~2 min wait for sibling agents)  
**Scope:** Federations, events, clubs, news, streams, media, athletes/coaches/venues/HP — plus RLS / client empty-state blockers  
**DB mutations this audit:** none (read-only)  
**Note:** Supersedes 2026-07-20 evening scorecard (~58/100). Sibling enrichment passes landed; Big-8 calendars no longer empty.

---

## Executive scorecard

| Domain | Rows (usable) | Completeness | Beta grade | Verdict |
|--------|--------------:|-------------:|:----------:|---------|
| Federations (active) | 83 / 85 | Meta **strong**; logos **64%** (53/83 after `000055`); heroes **100%**; contacts **good** | **B+** | Directory demo-ready; close remaining crests |
| Events | **228** published / **50** upcoming | Posters **76%** overall; **upcoming posters 50/50 (100%)**; **18** feds still zero events | **B** | Calendar viable; Big-8 all have ≥1 upcoming |
| Clubs | **131** active / **26** feds | Logos **100%**; contacts **19%** (25); **49** feds empty | **C+** | Flagships covered; most Fed Clubs pages still empty |
| News | **73** published / **51** feds | Featured images **100%** | **A−** | Home/News strong; **32** feds still zero news |
| Live streams | **4** VODs (0 live / 0 scheduled) | Thumbnails **100%** | **D+** | Nav gated via `useShowLiveNav`; `/live` = Recent Coverage |
| Media / photos | **61** | federation 56 / venue 4 / athlete 1 | **C+** | Seeded; still not wired as rich gallery UX |
| Athletes | **92** active / **15** feds (101 total) | Photos **100%** | **B** | Depth OK for majors; most feds empty |
| Coaches | **35** active / **11** feds | Photos **100%** | **C+** | Thin but no longer stub-only |
| Venues | **42** | Photos **100%** | **B+** | Major venues covered |
| Schools | 50 | N/A (seed) | **C** | Present; not wired as hero UX |
| HP programs | **10** active | Seeded pathways | **C+** | Was empty; now has national/pathway rows |
| **Security / RLS** | 13 tables | Hardened (`000030` + `000034`); **0** sportsplatform advisor lints | **A−** | Write GRANTs revoked; residual: Hyperdrive bypass, media/schools open SELECT |

**Overall beta readiness (data + security): ~72 / 100 — invite-only / soft public beta possible; not polished national launch.**  
Security gate cleared. Content gate for Big-8 upcoming **met**. Remaining blockers: Live still VOD-only, **30** null crests, hollow Clubs/News/Athletes for majority of federations, backend hygiene (rate limit, admin tRPC, WhatsApp routers).

### Path to public beta (minimum bar)

1. **Hard gate:** ~~tighten RLS~~ **done** (`000030` + `000034`).  
2. **Content gate:** ~~≥40 upcoming + Big-8 calendars~~ **done** (**50** upcoming; Big-8 all ≥1); news+images **done**; Live nav gated + 4 VODs seeded.  
3. **Visual gate:** logos on remaining high-traffic nulls (Golf/Karate/Badminton/PWFN + umbrellas NNSSU/NUFS/TISAN); club contacts still thin.  
4. **UX gate:** keep Live nav honest; optionally seed 1–2 scheduled streams; commit/deploy local logo+sport assets; empty-state copy for hollow federation subpages.

---

## 1. Federations scorecard (active only, n=83)

| Field | Filled | Rate |
|-------|-------:|-----:|
| slug / abbreviation / description (≥40 chars) | 83 | **100%** |
| email | 73 | **88%** |
| phone | 66 | **80%** |
| email **or** phone | 73 | **88%** |
| website | 55 | **66%** |
| any social | 52 | **63%** |
| president | 71 | **86%** |
| secretary_general | 48 | **58%** |
| logo | **53** | **64%** |
| background_image | **83** | **100%** |
| primary_color | **47** | **57%** |
| null email **and** phone | 10 | **12%** gap |

**Type mix (active):** 1 ministry + 1 commission + 8 umbrella + 73 federation.

**Still strong:** roster reconciled, descriptions + heroes filled, soft-merge lifecycle works, leadership fill improved.  
**Still weak:** crest coverage (~39% null), brand colors on non-crest logos (4 left), emerging-sport contacts.

---

## 2. Top remaining empty / hollow federations

Ranked by importance × content gap (after sibling passes). Big-8 calendars are no longer the #1 hole.

| # | Org | Type | Gap focus | Why it matters |
|--:|-----|------|-----------|----------------|
| 1 | Ministry (MSYNS) | ministry | Thin upcoming / clubs / news | National brand; directory OK, subpages hollow |
| 2 | Namibia Sports Commission | commission | Profile OK; clubs/athletes thin | Same |
| 3 | NNSSU | umbrella | **Null logo** + little content | Students sport on Home grid |
| 4 | NUFS | umbrella | **Null logo** + little content | Umbrella |
| 5 | TISAN | umbrella | **Null logo** + little content | Umbrella |
| 6 | Golf (NAGU) | federation | **Null logo**; content thin | High consumer interest |
| 7 | Karate (NKF) | federation | **Null logo** | Visible combat sport |
| 8 | Badminton / Dance / Surfing / TKD / Ultimate / PWFN | federation | **Null logos** | Crest gap on Home grid |
| 9 | Ice & Inline Hockey | federation | Crest OK; content still thin | Empty-feeling site |
| 10 | Long-tail emerging (Baseball, Lacrosse, Korfball…) | federation | Profile stubs + zero content | Post-beta unless partner asks |

### Big-8 content (live)

| Fed | Upcoming | Events | Clubs | News | Athletes | Logo |
|-----|---------:|-------:|------:|-----:|---------:|:----:|
| NFA | 3 | 10 | 18 | 6 | 16 | ✓ |
| Cricket (CN) | 5 | 18 | 10 | 4 | 14 | ✓ |
| Athletics (AN) | 4 | 16 | 6 | 5 | 8 | ✓ |
| Hockey (NHU) | 3 | 9 | 5 | 1 | 7 | ✓ |
| Basketball (NBF) | 2 | 7 | 6 | 1 | 0 | ✓ |
| Aquatics (NASFED) | 1 | 8 | 10 | 1 | 4 | ✓ |
| Netball (NNF) | 1 | 5 | 8 | 1 | 5 | ✓ |
| Rugby (NRU) | 1 | 6 | 11 | 4 | 16 | ✓ |

**Highest-ROI remaining:** crest batch for Golf/Karate/umbrellas; 1–2 scheduled Live streams; club contacts for top NFA/NRU/Cricket clubs; athlete rows for Basketball.

---

## 3. Events coverage

| Metric | Value |
|--------|------:|
| Published events | **228** (230 total rows) |
| Upcoming (`start_date >= now`) | **50** |
| Past | 178 |
| With poster_url | **174 (76%)** |
| Upcoming with poster | **50 / 50 (100%)** |
| Distinct feds with any event | **65 / 83** |
| Distinct feds with **upcoming** | **28 / 83** |
| Active feds with **zero** events | **18** |
| Active feds with no upcoming | **55** |

### Sample upcoming (next fixtures)

| Date | Event | Fed |
|------|-------|-----|
| 2026-07-21 | 15th African Archery Championships | AAN |
| 2026-07-21 | CWC League 2 / Hockey Test (CN, NHU) | CN / NHU |
| 2026-07-23 | Commonwealth Games (multi-sport + NNOC) | AN / NASFED / NNOC… |
| 2026-07-24 | KBA Premier League Mid-Season | NBF |
| 2026-08-01 | Bank Windhoek Red Run / Davis Cup | AN / NTA |
| 2026-08-20 | Coastal Rugby Union Cup | NRU |
| 2026-09-21 | AFCON 2027 Qualifiers MD1–2 | NFA |
| 2026-11-09 | AFCON 2027 Qualifiers MD3–4 | NFA |
| 2027-03-22 | AFCON 2027 Qualifiers MD5–6 | NFA |

**Hole closed vs prior audit:** NFA, Cricket, Athletics, Basketball, Hockey, Aquatics all have upcoming rows. Remaining calendar gap is **breadth** (55 feds with no upcoming), not flagship emptiness.

---

## 4. Image / photo holes

| Asset | Status | Impact |
|-------|--------|--------|
| Federation logos | **53/83** active (64%); **30** null | Home grid initials for ~36% |
| Federation background_image | **83/83 (100%)** | Heroes closed |
| Event posters | **174/228 (76%)**; upcoming **100%** | Past events still patchy |
| Club logos | **131/131 (100%)** | Clubs list no longer bland |
| News featured_image | **73/73 (100%)** | Cards always have image |
| Athlete photos | **92/92 active (100%)** | Mostly sport stock, not portraits |
| Coach photos | **35/35 active (100%)** | Same |
| Venue photos | **42/42 (100%)** | Closed |
| `sportsplatform_media` | **61** (fed 56 / venue 4 / athlete 1) | Gallery UX still thin |
| Live stream thumbnails | **4/4** | VODs only |

**P0 crest still null (active, n=32):** umbrellas **NNSSU / NUFS / TISAN**; Golf, Karate, Badminton, Billiards, Bodybuilding, Dance Sport, Fistball, Horse Racing, Powerlifting, Surfing, Taekwondo, Ultimate, + long-tail emerging sports (Baseball, Lacrosse, Korfball, Orienteering, Petanque, Softball, Footgolf, MMA, Muaythai, etc.).

**Recently closed vs prior audit:** Handball crest present; Big-8 logos all set; club logos 0% → 100%.

---

## 5. Clubs / news / streams / media / people

| Domain | Count | Distinct feds | Notes |
|--------|------:|--------------:|-------|
| Clubs | **131** | **26** | Logos 100%; contacts 25 (19%); **49** feds with 0 clubs |
| News | **73** | **51** | All published + images; **32** feds with 0 news |
| Streams | **4** | 4 | VODs only; nav hidden until live/scheduled |
| Media | **61** | — (entity_type) | federation-heavy; not a product surface yet |
| Athletes | **92** active | **15** | Photos 100%; **68** feds with 0 athletes |
| Coaches | **35** active | **11** | Photos 100% |
| Venues | **42** | — | Photos 100% |
| HP programs | **10** | — | Pathways seeded (was 0) |

---

## 6. Client pages that look empty without data

| Route | Data dependency | Live empty risk |
|-------|-----------------|-----------------|
| `/` Home | Federations OK; upcoming (richer); news (73) | Much improved; crest initials remain |
| `/events` | `events.list` | **Usable** — 50 upcoming, posters on all upcoming |
| `/live` | `streams.list` | No live/scheduled; **Recent Coverage** (4 VODs); nav hidden |
| `/news` | `news.list` | Strong (~73 w/ images); many Fed News still empty |
| `/federation/:slug` home | events + news + streams + clubs + athletes | Majors OK; long-tail still hollow |
| `…/events` | federation events | Empty for **18** feds; **55** no upcoming |
| `…/clubs` | clubs | Empty for **49** feds |
| `…/news` | news | Empty for **32** feds |
| `…/streams` | streams | Empty for nearly all |
| `…/athletes` | athletes | Empty for **68** feds |
| Admin | mock vs tRPC | Still flagged in `docs/06_tasks.md` |

Empty-state UI **exists** (good). Perception risk is now concentrated on Live + long-tail federation subpages, not Home/Events/News.

---

## 7. Backend / security must-fix before public beta

### 7.1 RLS — critical → **FIXED 2026-07-20 (Agent RLS)**

**Before:** all 13 tables had `INSERT/UPDATE/DELETE … auth.role() = 'authenticated'` (any logged-in user could mutate any row via PostgREST).

**After:** migration `20260720000030_harden_sportsplatform_rls.sql` applied live on `rbibqjgsnrueubrvyqps`:
- Dropped open write policies; public SELECT retained for catalog tables
- Writes: platform `admin` and/or `federation_admin` matched via `sportsplatform_users.open_id = auth.uid()` + `federation_id`
- Users / WhatsApp: SELECT/WRITE own row (or admin) only

**Residual pass (`20260720000034`, applied live):**
- Public SELECT tightened: `is_published` (news/events), active rows (federations/clubs/athletes/coaches/venues/hp), streams with URL/schedule/live
- `REVOKE INSERT/UPDATE/DELETE/TRUNCATE` from `anon` + `authenticated` on all `sportsplatform_*`
- Advisors (re-checked 2026-07-21): **423** project-wide (co-tenant); **0** lints naming `sportsplatform_*`

Remaining residuals: Hyperdrive privileged role bypasses RLS (server-only); `media`/`schools` still public SELECT `USING (true)` (no publish column); `club_manager` write policies deferred; PostgREST admin writes also blocked by GRANT (mutations via tRPC only — intentional).

### 7.2 Other backend blockers

| Item | Status |
|------|--------|
| Rate limiting on auth / public mutations | **Missing** |
| `.env.example` completeness | Still open in tasks |
| List query limits | Partial (news limit 50); audit others |
| WhatsApp subscribe/unsubscribe routers | Still open |
| Admin page on real tRPC | Still mock |
| Indexes / ON DELETE FK audit | Still open Phase 1 |

---

## 8. Remaining blockers for public beta (ordered)

### P0 — ship blockers / trust

1. **Live product honesty** — keep nav gated; optionally seed ≥1 scheduled stream before marketing “Live”.  
2. **Crest batch** — Golf, Karate, Badminton, PWFN, Dance, Horse Racing, Surfing, TKD, Ultimate + umbrellas NNSSU/NUFS/TISAN (stops Home looking unfinished).  
3. **Deploy local assets** — `/sports/*`, `/athletes/*`, `/coaches/*` must be on the CDN the DB URLs point at.

### P1 — polish before broad public

4. Club **contacts** for top clubs (logos done; 19% have email/phone).  
5. Fill hollow federation subpages for next tier (Golf, Volleyball, Tennis, Boxing) — news/clubs/athletes.  
6. Rate limiting + `.env.example` + Admin → real tRPC.  
7. Basketball athletes (0) — odd gap vs other Big-8.

### P2 — post-soft-launch

8. Schools / HP UX surfaces.  
9. ~~Brand colors beyond 18%~~ — **47/83 (57%)** via `000060`.  
10. Full club directory for all 73 federations.  
11. Obscure federation contact research.

---

## 9. What *not* to prioritize before beta

- Brand colors for remaining **36** (need crests first).  
- Full club directory for all federations.  
- Schools / HP deep UX.  
- Obscure federation contact research (Baseball/Lacrosse/Korfball…) unless partners demand it.  
- Schema extensions (`established_year`, city/region) — draft only.

---

## 10. Scoreboard summary (one glance)

```
Federations meta     █████████████████░░░  88%
Federation logos     █████████████░░░░░░░  64%
Fed heroes           ████████████████████ 100%
Events (upcoming)    ████████████░░░░░░░░  50 events / 28 feds (Big-8 OK)
Event posters (up)   ████████████████████ 100% of upcoming
Clubs coverage       ██████░░░░░░░░░░░░░░  26/83 feds (logos 100%)
News coverage        ████████████░░░░░░░░  51/83 feds (73 w/ images)
Streams (VOD)        █░░░░░░░░░░░░░░░░░░░  4 (nav gated)
Media                ██████░░░░░░░░░░░░░░  61 rows
Athletes / coaches   ████████░░░░░░░░░░░░  92 / 35 (photos 100%)
Venues / HP          ████████████░░░░░░░░  42 / 10
RLS write safety     ████████████████████  PASS (writes+SELECT+GRANTs)
────────────────────────────────────────
Public beta          SOFT / INVITE OK (~72/100)
Polished national    NOT YET (Live + crests + hollow Fed subpages)
```

### Delta vs prior audit (~58 → ~72)

| Metric | Prior | Now |
|--------|------:|----:|
| Upcoming events | 32 | **50** |
| Upcoming posters | 14/32 | **50/50** |
| Clubs | 62 / 16 feds | **131 / 26** (logos 100%) |
| News | 47 / 25 feds | **73 / 51** |
| Athletes | 71 | **92** |
| Coaches | 16 | **35** |
| Venues | 28 | **42** |
| HP programs | 0 | **10** |
| Fed logos | 49 (59%) | **53 (64%)** |
| Big-8 upcoming | mostly 0 | **all ≥1** |

---

## Related docs

- `docs/research/federation_data_gap_list.md` — logo/website/contact detail  
- `docs/research/federation_completeness_snapshot.md` — field fill rates  
- `docs/research/contacts_enrichment_batch.md`  
- `docs/research/websites_socials_enrichment_batch.md`  
- `docs/research/events_enrichment_batch.md`  
- `docs/research/news_enrichment_batch.md`  
- `docs/research/clubs_enrichment_batch.md`  
- `docs/06_tasks.md` — master checklist
