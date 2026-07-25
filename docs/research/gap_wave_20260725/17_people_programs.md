# Gap Wave 2026-07-25 — Athletes / Coaches / Schools / HP Programs

**Wave:** `gap_wave_20260725` · **Doc:** `17_people_programs.md`  
**Date:** 2026-07-25  
**Workspace:** `C:\Projects\The Dome\namibia-sports-platform`  
**Scope:** Public profiles, PII stripping, photo coverage, HP programs emptiness, schools data quality.  
**Method:** Live Supabase SQL (`rbibqjgsnrueubrvyqps`) + static code audit of routers, schema, public/admin UI.  
**DB / deploy mutations this analysis:** none.

**Rules applied:** SEARCH FIRST / REUSE FIRST / NO ASSUMPTIONS / documentation deliverable.

---

## 1. Executive verdict

| Domain | Headcount (live) | Public surface | PII gate | Biggest gap |
|--------|-----------------:|:--------------:|:--------:|-------------|
| **Athletes** | 207 total / **198 active** | ✅ `/athletes/:slug` + fed tab | ✅ strip email/phone/DOB | **49/83** active feds have **0** athletes; **73%** photos are sport-stock |
| **Coaches** | 48 total / **47 active** | ❌ no public page/slug | ✅ strip email/phone | Admin-only; **67/83** feds have **0** coaches; almost all sport-stock avatars |
| **Schools** | **50 rows → 26 unique** | ❌ no public directory | ✅ strip contact (non-admin) | Duplicate seed (~48% excess rows); 4 regions missing; phones nearly empty |
| **HP programs** | **10 active** | ❌ no public list/detail | N/A (no PII columns) | **0/10** have `participants` or `coaches` linked; Home CTA is marketing only |

**One-liner:** Athlete public profiles + PII stripping are ship-ready; coaches/schools/HP are CMS-seeded but publicly invisible or hollow — schools also need dedupe before any public claim.

---

## 2. Live inventory (2026-07-25)

### 2.1 Headline counts

| Metric | Value |
|--------|------:|
| Athletes total / active | 207 / **198** |
| Athletes with slug | **207** (100%) |
| Athletes with photo (active) | **198** (100% of active) |
| Athletes with achievements | **207** (100%) |
| Athletes with email / phone in DB | **0** / **0** |
| Athletes with DOB stored | **44** (stripped on public API) |
| Athletes with `club_id` | **47** (~23%) |
| Athletes with `federation_id` | **207** (100%) |
| Coaches total / active | 48 / **47** |
| Coaches with photo (active) | **47** (100%) |
| Coaches with certifications text | **48** |
| Coaches with email / phone in DB | **0** / **0** |
| Coaches with `years_experience` | **15** |
| Schools rows / unique `(name,region,city)` | **50** / **26** |
| Schools with email / phone | **44** / **3** |
| Schools with `sports_offered` non-empty | **50** |
| HP programs total / active | **10** / **10** |
| HP with description | **10** |
| HP with participants JSON populated | **0** |
| HP with coaches JSON populated | **0** |
| Active federations | **83** |
| Feds with ≥1 active athlete | **34** |
| Feds with 0 athletes | **49** |
| Feds with ≥5 / ≥10 athletes | **20** / **4** |
| Feds with ≥1 active coach | **16** |

### 2.2 Athlete depth by federation (top; active only)

| Federation | Active athletes | Photo mix |
|------------|----------------:|-----------|
| NRU / NFA | 16 / 16 | all `/sports/*` stock |
| Cricket Namibia / NBF | 14 / 14 | all `/sports/*` stock |
| Boxing / Athletics / Paralympic | 8 / 8 / 8 | mixed stock + `/athletes/*` |
| Hockey / Golf / Volleyball | 7 each | mostly `/athletes/{sport}.jpg` |
| Netball / Wrestling / Chess / Tennis / … | 5–6 | sport-named paths |
| Long-tail (many feds) | 0 | — |

Only **4** federations reach 10+ athletes (NRU, NFA, Cricket, Basketball). Prior Big-8 “NBF athletes = 0” hole is **closed** (14).

### 2.3 Coach depth by federation

**16** federations have coaches; concentration in Big codes:

| Federation | Active coaches |
|------------|---------------:|
| NRU | 8 |
| NFA | 5 |
| Athletics Namibia | 4 |
| Hockey / Cricket / Netball / Volleyball / Gymnastics | 3 each |
| Basketball / Boxing / Swimming / Tennis / Judo / Wrestling / Table tennis | 2 each |
| Chess | 1 |

**~67** active federations have zero coaches.

### 2.4 HP programs (all 10)

| ID | Name | Federation | Type | Participants / Coaches |
|----|------|------------|------|------------------------|
| 1 | NPC Namibia Paralympic High Performance Pathway | namibia-paralympic | elite | null / null |
| 2 | Welwitschias High Performance Pathway | nru | elite | null / null |
| 3 | AUSC Region 5 Youth Games Host Preparation | namibia-sports-commission | training | null / null |
| 4 | NNOC Olympic Preparation Pathway (LA 2028) | nnoc | elite | null / null |
| 5 | Namibia Podium Performance Programme (PPP) | namibia-sports-commission | elite | null / null |
| 6 | Athletics Namibia Elite Sprint & Endurance Pathway | athletics-namibia | elite | null / null |
| 7 | NASFED High Performance Swimming Programme | swimming-namibia | training | null / null |
| 8 | National Youth Games Talent Identification | namibia-sports-commission | talent_identification | null / null |
| 9 | UNAM High Performance Sports Centre (MoU) | namibia-sports-commission | development | null / null |
| 10 | Cricket Namibia High Performance Programme | cricket-namibia | elite | null / null |

Descriptions exist (sourced paraphrases from 2026-07-21 enrichment). Relational payload is empty by design of that seed — still empty today.

### 2.5 Schools regional coverage

| Region | Rows | With email | With phone |
|--------|-----:|-----------:|-----------:|
| Khomas | 21 | 21 | 2 |
| Erongo | 8 | 6 | 1 |
| Oshana | 5 | 5 | 0 |
| Otjozondjupa / Kavango East / Karas | 3 each | ≤2 | 0 |
| Ohangwena / Hardap / Zambezi | 2 each | 2 | 0 |
| Oshikoto | 1 | 0 | 0 |

**Missing regions (0 schools):** Kunene, Omaheke, Kavango West, Omusati.  
**Avg sports listed:** ~4.1 per row; 14 schools list ≥5 sports.

---

## 3. Public profiles

### 3.1 Athletes — **shipped**

| Surface | Status | Notes |
|---------|--------|-------|
| Route `/athletes/:slug` | ✅ | `client/src/pages/athletes/AthleteProfile.tsx` |
| Fed tab `/federation/:slug/athletes` | ✅ | Hidden when inventory = 0 (`federationPublicTabs`) |
| tRPC `athletes.getBySlug` | ✅ | Joins federation + club names; PII stripped |
| tRPC `athletes.list` / `getById` | ✅ | Active-only for public; staff flags |
| SEO / JSON-LD `Person` | ✅ | Via `SeoHead` + `buildAthleteJsonLd` (not in page component itself) |
| Sitemap athlete slugs | ✅ | Build-time; audit notes 198 active |
| Global search → profile | ⚠️ | Search returns athletes but navigates to **fed athletes tab**, not `/athletes/:slug` (slug omitted from `search.global`) |
| National `/athletes` index | ❌ | No directory hub; profiles are deep-linked or fed-scoped |

**Profile content shown publicly:** name, gender, nationality, ranking, photo, federation/club links, achievements. Contact/DOB never rendered (API nulls them).

**UX dead-ends:**
- `FederationAthletes` still calls `calcAge(athlete.dateOfBirth)` — always null publicly (harmless dead branch after PII strip).
- Status filter includes “inactive” but public list only returns active rows — filter never finds inactive for anonymous users.
- Club chip on profile is non-linkable (`clubSlug` shown as `<span>`, not `/clubs/...`).

### 3.2 Coaches — **no public product**

| Surface | Status |
|---------|--------|
| Public route `/coaches/:slug` or `/coaches/:id` | ❌ schema has **no slug** |
| Federation public tab | ❌ tabs are Home/Events/Clubs/Athletes/News/Streams only |
| Admin / FedAdmin CRUD | ✅ `FedAdminCoaches`, platform Admin embeds same |
| tRPC `coaches.list` / `getById` | ✅ public procedures exist but **no consumer UI** |

Coaches are discoverable only inside CMS. Home “HIGH PERFORMANCE” card does not surface coaches.

### 3.3 Schools — **admin-only product**

| Surface | Status |
|---------|--------|
| Public `/schools` directory | ❌ |
| Federation school sport linkage | ❌ no FK from schools → federations |
| Admin CRUD | ✅ `AdminSchoolsPanel` + `adminProcedure` mutations |
| tRPC public `list` / `getById` | ✅ API ready; contact stripped for non-admin |

Claiming a national schools directory would overstate uniqueness (26 real entities behind 50 rows).

### 3.4 HP programs — **CMS + marketing stub**

| Surface | Status |
|---------|--------|
| Public `/hp` or fed HP tab | ❌ |
| Home “HIGH PERFORMANCE” card | ⚠️ Static copy; CTA → `#federations` (not HP data) |
| FedAdmin / Admin CRUD | ✅ `FedAdminHpPrograms` |
| Participant / coach pickers in form | ❌ `HpProgramForm` omits `participants` / `coaches` arrays even though create/update Zod accepts them |
| Resolve athlete/coach IDs to names on read | ❌ list returns raw JSON IDs (currently always null) |

---

## 4. PII stripping (security)

### 4.1 Implementation matrix

| Entity | Fields treated as PII | Public strip | Staff reveal | Tenant scope |
|--------|----------------------|--------------|--------------|--------------|
| Athletes | `email`, `phone`, `dateOfBirth` | `stripAthletePii` on list/getById/getBySlug | `includePii` + `canIncludePii*` | ✅ federation_admin cannot cross-tenant |
| Coaches | `email`, `phone` | `stripCoachPii` on list/getById | same | ✅ |
| Schools | `contactEmail`, `contactPhone` | `stripSchoolContact` unless `role === admin` | admin only | N/A (platform admin) |
| HP | — | no contact columns | — | fed scoped on mutations |

**Sources:** `server/routers/athletes.ts`, `coaches.ts`, `schools.ts`; helpers in `server/_core/federationScope.ts`.

### 4.2 What is still public (intentional / residual)

| Field | Public? | Assessment |
|-------|---------|------------|
| Gender | Yes | Normal for athlete directories; not stripped |
| Achievements / certifications (may contain career history) | Yes | Expected public bio text |
| Photo URL | Yes | Expected |
| School name / region / city / sports | Yes | Directory fields |
| Inactive athlete/coach rows | Hidden on get unless staff | ✅ |

### 4.3 Residual PII / privacy gaps

| ID | Severity | Gap |
|----|----------|-----|
| P1 | **Low** (today) | Athlete/coach contact columns are **empty in DB** (0 emails/phones) — strip path is correct but **untested against real PII load** |
| P2 | **Medium** | No automated test asserts `stripAthletePii` / `stripCoachPii` / school strip (`federationScope.test.ts` covers tenant mutations, not PII shape) |
| P3 | **Low** | 44 DOBs remain stored; public API nulls them — ensure no future client path uses `includePii` without admin gate |
| P4 | **Info** | Schools contacts (44 emails) are real-ish directory data; public API correctly nulls for non-admin — good for POPIA posture |
| P5 | **Low** | `search.global` does not return email/phone/DOB (safe); also omits athlete slug (product gap, not leak) |

**Verdict:** PII stripping for people entities is **code-complete and tenant-scoped** (post 2026-07-23 security pass). Residual risk is test coverage + empty-column false confidence.

---

## 5. Photo coverage

### 5.1 Athletes (active)

| Photo class | Count | % of active |
|-------------|------:|------------:|
| `/sports/*` sport stock | **144** | **73%** |
| `/athletes/*` dedicated path | **54** | **27%** |
| External `http(s)` | 0 | 0% |
| Missing photo | 0 | 0% |

**Quality note:** `/athletes/{sport}.jpg` (netball, hockey, boxing, …) is still a **sport stand-in**, not an individual portrait. True Wikimedia portraits are rare (e.g. Frankie Fredericks, Vera Looser). UI falls back to initials if image 404s.

**On-disk static assets (sample):** `client/public/athletes/*.jpg` (~18 sport/portrait files). Deploy must keep Worker Static Assets in sync with DB paths.

### 5.2 Coaches (active)

| Photo class | Count | % of active |
|-------------|------:|------------:|
| `/sports/*` stock | **45** | **96%** |
| `/coaches/*` dedicated | **1** | ~2% (Jacques Burger) |
| `/athletes/*` reuse | **1** | ~2% |
| Missing | 0 | 0% |

### 5.3 Schools / HP

| Entity | Photo column | Coverage |
|--------|--------------|----------|
| Schools | none in schema | N/A |
| HP programs | none in schema | N/A |

### 5.4 Photo gaps (ranked)

1. **High (perception):** Big-4 athlete grids (NFA/NRU/Cricket/NBF) are 100% sport-stock — looks generic next to named achievements.  
2. **Medium:** Coaches almost entirely stock; only one real portrait asset.  
3. **Low:** Broken-image handling exists; zero null `photo_url` among active people.  
4. **Process:** Prefer verified Commons / federation press kits; never invent faces.

---

## 6. HP programs emptiness

### 6.1 Structural hollowness

| Dimension | State |
|-----------|-------|
| Row count | 10 (seeded 2026-07-21 — see `venues_hp_enrichment_batch.md`) |
| Descriptions | Present with `Source:` lineage |
| `participants` JSON | **All null / empty** |
| `coaches` JSON | **All null / empty** |
| Public UX | None |
| Form fields for roster IDs | Missing in `HpProgramForm` |
| Federation coverage | NSC (4), NRU, NNOC, Athletics, NASFED, Cricket, NPC — football/netball/hockey/etc. have **no** HP rows |

### 6.2 Product implication

HP is a **named programme catalogue**, not a high-performance system. Linking to athlete/coach IDs was deferred (“no verified athlete-ID mapping”) and never finished. Home page markets HP without reading `hpPrograms.list`.

### 6.3 Recommended fill order (content)

1. Wire public read surface (fed admin already writes).  
2. Add form multi-select for athletes/coaches in-tenant.  
3. Populate PPP / Welwitschias / Cricket / Athletics rosters only from **verified** public national-team lists (never invent).  
4. Leave youth/talent rows without named minors if age/consent unclear.

---

## 7. Schools data quality

### 7.1 Duplicate seed (critical data gap)

| Metric | Value |
|--------|------:|
| Table rows | 50 |
| Unique `(name, region, city)` | **26** |
| Excess duplicate rows | **~24** (~48%) |

Known triple dupes (3×): Academia Secondary, Otjiwarongo Secondary, Rundu Secondary, Windhoek High School.  
Many doubles: Concordia, DHPS, Dome Sports Academy, UNAM, NUST, Swakopmund Secondary, etc.

Near-dupes also exist across naming (`Keetmanshoop Secondary` vs `Keetmanshoop Secondary School`).

**Action:** Deduplicate before any public schools directory or NSSU partnership claim. Prefer keep row with richest contact + sports arrays.

### 7.2 Contact & geography gaps

| Gap | Detail |
|-----|--------|
| Phone coverage | **3/50** rows (~6%); public strip makes this admin-only anyway |
| Email | 44/50 — but inflated by duplicates |
| Regions missing | Kunene, Omaheke, Kavango West, Omusati |
| Khomas overweight | 21/50 rows (~42%) |
| Tertiary mixed in | UNAM, NUST counted as “schools” |
| No slug / logo / geo coords | Schema minimal — fine for admin directory, weak for map product |
| No NSSU federation link | Logo asset exists (`Namibia_Schools_Sport_Union_logo.png`); no relational tie |

### 7.3 API / schema notes

- `schools.ts` defines unused `slugify()` (dead code).  
- Public list hard-caps at 100 (fine at n=50).  
- Mutations are `adminProcedure` only (correct — not federation-scoped).

---

## 8. Code / product gap checklist

| ID | Area | Severity | Finding | Suggested fix |
|----|------|----------|---------|---------------|
| A1 | Athletes coverage | **High** | 49/83 feds have 0 athletes | Verified 2–5 notables per mid-tier fed; keep empty-state honesty |
| A2 | Athlete photos | **Medium** | 73% `/sports/*` stock | Prioritise portraits for flagship names on Big-4 |
| A3 | Athlete ↔ club | **Medium** | Only 47 linked | Backfill `club_id` where domestic club known |
| A4 | Search → profile | **Medium** | Palette skips `/athletes/:slug` | Return `slug` from `search.global`; navigate to profile |
| A5 | National athlete hub | **Low** | No `/athletes` index | Optional post-beta; SEO already has deep links |
| C1 | Coach public surface | **High** (if coaches are a launch claim) | No page/tab/slug | Add slug + public list or keep intentionally admin-only and de-market |
| C2 | Coach coverage | **High** | 67 feds empty | Depth batch for Big-8 + aquatics/combat already started; expand carefully |
| C3 | Coach photos | **Medium** | 96% stock | Same portrait discipline as athletes |
| S1 | School dupes | **Critical** (data) | 50→26 unique | Dedup migration + unique index on `(name, region, city)` |
| S2 | School public UX | **Medium** | API without UI | Ship `/schools` only after dedupe + region fill |
| S3 | School geography | **Medium** | 4 regions missing | Seed verified schools for Kunene/Omaheke/Kavango West/Omusati |
| H1 | HP emptiness | **High** (product honesty) | 0 rosters; no public UI | Either ship catalogue page or remove Home marketing CTA |
| H2 | HP form incomplete | **Medium** | Can't set participants/coaches in UI | Add multi-select; validate IDs in-tenant |
| H3 | HP federation skew | **Low** | NSC-heavy; no NFA/NHU/Netball HP rows | Add only with public programme evidence |
| T1 | PII tests | **Medium** | No strip assertions | Add unit tests for public nulling + includePii tenant deny |
| T2 | Schools dead code | **Low** | Unused `slugify` | Remove or use if public slugs added |

---

## 9. Priority roadmap

### P0 — before public claims

1. **Deduplicate schools** (S1) — stop counting 50 as coverage.  
2. **HP honesty** (H1) — either hide Home HP marketing or wire `hpPrograms.list` to a real page.  
3. Keep athlete/coach PII strip as-is; add **PII unit tests** (T1).

### P1 — beta content depth

4. Mid-tier athlete fills for hollow feds (A1) — verified names only.  
5. Search deep-link to athlete profiles (A4).  
6. Coach public decision: ship minimal directory **or** document as admin-only (C1).  
7. HP form roster fields + fill 2–3 elite programmes (H2).

### P2 — polish

8. Portrait pass for flagship athletes/coaches (A2/C3).  
9. Club links on athletes (A3).  
10. Schools public directory + missing regions (S2/S3) after dedupe.  
11. Remove dead `slugify` / unused age UI branch.

---

## 10. Sources

| Kind | Path / ref |
|------|------------|
| Schema | `drizzle/schema.ts` — `athletes`, `coaches`, `schools`, `highPerformancePrograms` |
| Routers | `server/routers/athletes.ts`, `coaches.ts`, `schools.ts`, `hpPrograms.ts`, `search.ts` |
| Scope helpers | `server/_core/federationScope.ts` |
| Public UI | `client/src/pages/athletes/AthleteProfile.tsx`, `federation/FederationAthletes.tsx`, `Home.tsx` (HP card) |
| Admin UI | `FedAdminAthletes/Coaches/HpPrograms`, `AdminSchoolsPanel`, forms under `components/admin/` |
| Prior enrichment | `docs/research/coaches_athletes_depth_batch.md`, `athletes_venues_enrichment_batch.md`, `venues_hp_enrichment_batch.md` |
| Cross-audits | `docs/research/SEO_AIO_AND_CONTENT_GAPS.md`, `PRODUCTION_SECURITY_AUDIT.md`, `PUBLIC_READY_GAP_ANALYSIS.md` |
| Live SQL | Supabase project `rbibqjgsnrueubrvyqps`, 2026-07-25 |

---

## 11. Scorecard (this wave)

| Dimension | Score | Comment |
|-----------|:-----:|---------|
| Athlete public profiles | **8/10** | Solid; depth uneven across feds |
| Coach public profiles | **2/10** | API only |
| PII stripping | **9/10** | Implemented + tenant-scoped; needs tests |
| Photo authenticity | **4/10** | Coverage 100%, authenticity ~25% athletes / ~2% coaches |
| HP programme product | **2/10** | Named shells, empty rosters, no public UX |
| Schools data integrity | **3/10** | Duplicate-heavy; region skew |
| Schools public product | **1/10** | Admin CMS only |

**Overall people/programs readiness for public launch claims:** **Athletes yes (with hollow-fed honesty); Coaches/Schools/HP not yet.**
