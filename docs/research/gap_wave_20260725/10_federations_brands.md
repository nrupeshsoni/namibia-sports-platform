# Gap Analysis — Federations / Brands / Media Assets

**Wave:** `gap_wave_20260725` · **Doc:** `10_federations_brands.md`  
**Date:** 2026-07-25  
**Workspace:** `C:\Projects\The Dome\namibia-sports-platform`  
**DB:** Supabase `rbibqjgsnrueubrvyqps` (live SQL via MCP)  
**Scope:** Official “61” vs platform “85”, soft-merges, crest vs sport-mark logos, heroes, `sportsplatform_media`, Storage buckets, hollow federation tabs.  
**Method:** Live inventory SQL + static code/asset audit. No DB mutations.

**Rules applied:** SEARCH FIRST / NO ASSUMPTIONS / documentation deliverable.

**Sibling evidence (do not re-litigate):**
- `docs/research/FEDERATION_COUNT_OFFICIAL_VS_PLATFORM.md`
- `docs/research/FEDERATION_PHOTOS_COVERAGE.md`
- `docs/research/hollow_longtail_ux_fill_20260724.md`
- `docs/research/crests_hollow_fill_batch_20260724.md`
- `docs/research/media_enrichment_batch.md`

---

## 1. Executive verdict

| Surface | Grade | One-line |
|---------|:-----:|----------|
| 61 vs 85 count honesty | **A−** | Admin Directory card now breaks out sports / bodies / merged; docs explain scopes |
| Soft-merge redirects | **A** | 2 inactive rows; `getBySlug` / `getById` resolve to canonical |
| Hero coverage (`background_image`) | **A** | **83 / 83** active have local `/sports/*` heroes |
| Logo SQL fill | **A** | **83 / 83** non-null — but **28** are generic sport marks, not crests |
| Official crest quality | **C+** | **55** crest-path logos; athletics HTML stub; climbing landscape; shared crests by design |
| Brand colors | **B−** | **47 / 83 (57%)**; **8** crest rows still null (incl. Golf/DSN/Fistball/MMA) |
| Media library (DB + admin) | **C** | **61** rows / **16** feds; admin CRUD exists; **no public gallery** on federation pages |
| Supabase Storage usage | **D** | All 5 `sportsplatform_*` buckets exist and are **empty (0 objects)** — SPA serves static `/logos` `/sports` |
| Hollow tabs (content) | **C** | Triple-empty **20 / 83 (24%)**; UX gate hides empty Clubs/Athletes/News/Streams |
| Static fallback catalogue | **B** | `federations.ts` intentionally small / FALLBACK-ONLY; Home prefers tRPC |

**Launch stance:** Directory branding is **soft-beta ready** for heroes + identity chrome. Do **not** claim “every federation has an official crest” — **34%** of active rows still use `/logos/marks/*` silhouettes. Media is seed-only for flagships; Storage upload path is wired but unused in production data. Hollow long-tail is mitigated by tab honesty, not by content parity.

**One-liner:** 85 is a correct multi-entity directory (not Ministry 61); brands are 100% filled at the column level with a clear crest/mark split; media + Storage remain the thin layer.

---

## 2. Live inventory snapshot (2026-07-25)

### 2.1 Entity mix (85)

```text
85 total rows
├── 83 active (public federations.list)
│   ├── 1  ministry
│   ├── 1  commission
│   ├── 8  umbrella
│   └── 73 federation
└── 2  inactive soft-merged
    ├── namibia-aquatics → swimming-namibia
    └── weightlifting-namibia → powerlifting-namibia
```

| `type` | Active | Soft-merged inactive | Total |
|--------|-------:|---------------------:|------:|
| ministry | 1 | 0 | 1 |
| commission | 1 | 0 | 1 |
| umbrella | 8 | 0 | 8 |
| federation | 73 | 2 | 75 |
| **Sum** | **83** | **2** | **85** |

### 2.2 Brand / media columns (active = 83)

| Metric | Count | Rate |
|--------|------:|-----:|
| `logo` non-null | **83** | **100%** |
| Crest-path logos (`/logos/*` not marks) | **55** | **66%** |
| Sport-mark placeholders (`/logos/marks/*`) | **28** | **34%** |
| Remote / `/sports/*` as logo | **0** | — |
| `background_image` (hero) non-null | **83** | **100%** |
| `primary_color` + `secondary_color` | **47** | **57%** |
| Crest path but colors still null | **8** | — |
| Active null email **and** phone | **10** | 12% |
| Active null website | **28** | 34% |

### 2.3 Soft-merged rows

| Slug | Active | `merged_into_slug` | Logo | Hero |
|------|:------:|--------------------|------|------|
| `namibia-aquatics` | false | `swimming-namibia` | NASFED crest webp | `/sports/namibia-swimming.jpg` |
| `weightlifting-namibia` | false | `powerlifting-namibia` | **null** | `/sports/powerlifting.jpg` |

**Code path:** `server/routers/federations.ts` — `resolveCanonical` on `getBySlug` / `getById`; public `list` filters `is_active=true`; admin `listAll` includes merges.

### 2.4 Media table (`sportsplatform_media`)

| Metric | Count |
|--------|------:|
| Total rows | **61** |
| Images / videos / documents | **61 / 0 / 0** |
| `entity_type=federation` | **56** |
| `entity_type=venue` | **4** |
| `entity_type=athlete` | **1** |
| Distinct federations with ≥1 media row | **16 / 83** |

**Feds with galleries (all local static paths):** NNOC (5); Cricket, NASFED, Basketball, Boxing, NFA, Hockey, NRU, NSC (4 each); Athletics, Judo, Netball, Volleyball, Tennis (3); Beach Volleyball, Handball (2).

### 2.5 Hollow tab inventory (active feds)

| Metric | Count | Rate (n=83) |
|--------|------:|------------:|
| Zero clubs | 41 | 49% |
| Zero athletes | 49 | 59% |
| Zero published news | 22 | 27% |
| Zero events (any) | 18 | 22% |
| Zero streams | 79 | 95% |
| **Hollow triple** (0 clubs + athletes + news) | **20** | **24%** |
| Hollow quad (+ 0 events) | 12 | 14% |

**Content totals (context):** clubs **191** · athletes **198** · published news **147** · streams **4**.

### 2.6 Disk assets (Worker Static Assets → `client/public/`)

| Path | Files |
|------|------:|
| `client/public/logos/` (root, excl. marks) | **49** |
| `client/public/logos/marks/` | **30** SVGs (28 referenced in DB; `golf.svg` + `dance-sport.svg` orphaned after crest promote) |
| `client/public/logos/_candidates/` | **204** rejected / research candidates |
| `client/public/sports/` | **144** |

---

## 3. Gap: Official 61 vs platform 85

### What each number means

| Figure | Meaning | Source |
|------:|---------|--------|
| **61** | Ministry “registered sport federations” funding target | MEIYSAC Budget Vote 27, FY 2026/2027 (10 Apr 2026) |
| **57 (+8 umbrellas)** | NSC contact roster | NSC PDF *UPDATED FEDERATION CONTACT DETAILS* (25 Feb 2025) |
| **~26–32** | NNOC affiliated members | olympic.org.na/members |
| **67** | Legacy design brief (1+1+8+57) | Dec 2025 brief / older CLAUDE snippets |
| **85** | Platform directory rows | Live DB |

**Admin UI (fixed honesty):** `AdminStatsCards` shows Directory = `listAll.length` (**85**) with detail `73 sports · 10 bodies · 2 merged` — not a claim of “61 NSC federations.”

### Why 73 active `type=federation` > 61 / 57

1. Codes beyond the Feb 2025 NSC extract (handball, beach volleyball, futsal, surfing, climbing, long-tail emerging sports, etc.).
2. Splits of combined NSC lines (canoeing vs rowing; angling as one row).
3. Soft-merge retention (+2 inactive federation rows for URL redirects).

### Residual product gap

| Severity | Gap | Fix |
|----------|-----|-----|
| **Low** | No `nsc_registered` / roster tag to filter “official 61/57” vs directory extras | Optional schema flag — **needs product approval**; do not mass-delete |
| **Low** | Some Feb 2025 NSC names still absent as separate rows (Saddle Seat, Endurance Riding, NPL as league body) | Additive research only |

**Verdict:** No purge. Treat **61** / **57** / **85** as different scopes. Full write-up: `FEDERATION_COUNT_OFFICIAL_VS_PLATFORM.md`.

---

## 4. Gap: Soft-merges

| Severity | Finding | Evidence | Recommended fix |
|----------|---------|----------|-----------------|
| — | Soft-merge **works as designed** | `resolveCanonical` + inactive filter | Keep rows; never hard-delete |
| **Low** | `weightlifting-namibia` has **null logo** (inactive) | Live SQL | Cosmetic only; optional copy PWFN mark/crest for admin listAll polish |
| **Low** | Admin Federations table may still look like “duplicates” without clear merged badge | Depends on `FederationsTable` UX | Ensure merged rows show “→ canonical” chip (verify in UI pass) |

**Do not:** delete soft-merged rows to force Admin = 61/83.

---

## 5. Gap: Logo marks vs crests

### Policy (current)

| Kind | Path pattern | Meaning |
|------|--------------|---------|
| **Crest / identity** | `/logos/<Name>_logo.*` | Verified federation / body mark |
| **Sport mark** | `/logos/marks/<sport>.svg` | Generic silhouette — **not** a trademark claim |
| **Hero** | `/sports/*` via `background_image` | Sport atmosphere photo |

### Mark-logo federations (28) — still need real crests

`badminton-namibia`, `baseball-namibia`, `billiards-snooker-namibia`, `bodybuilding-namibia`, `indigenous-combat-sport`, `karate-namibia`, `lacrosse-namibia`, `namibia-footgolf`, `namibia-horse-racing`, `namibia-kendo`, `namibia-korfball`, `namibia-modern-pentathlon`, `namibia-muaythai`, `nnssu`, `namibia-orienteering`, `powerlifting-namibia`, `namibia-practical-shooting`, `namibia-speed-hiking`, `namibia-teqball`, `nufs`, `namibia-waterski`, `namibia-western-mounted-games`, `petanque-namibia`, `softball-namibia`, `surfing-namibia`, `taekwondo-namibia`, `tisan`, `ultimate-frisbee-namibia`

**Highest-value crest hunts (prior rejections stand):** Karate (flag-wave / JKA branch), Badminton, PWFN, NNSSU (Schools eagle = wrong org), NUFS, TISAN, Surfing, Ultimate, TKD.

### Crest-path quality defects (not marks, but weak identity)

| Slug | Path | Issue |
|------|------|-------|
| `athletics-namibia` | `/logos/marks/athletics.svg` | **Fixed 2026-07-25** — was HTML stub PNG; now generic sport mark (no verified crest sourced yet) |
| `namibia-climbing` / `namibia-mountaineering` | shared `Namibia_Climbing_Federation_logo.png` | Landscape / Spitzkoppe-style photo, not a crest; also **shared** across two codes |
| `nawisa` | `Namibia_Women_In_Sports_Association_logo.png` | Promo collage; colors intentionally left null |

### Intentional shared crests (OK if documented)

| Crest file | Slugs |
|------------|-------|
| NIIHA | `namibia-ice-inline-hockey`, `roller-sports-namibia`, `skateboarding-namibia` |
| NCRF | `namibia-canoeing`, `rowing-namibia` |
| NVF | `namibia-volleyball`, `namibia-beach-volleyball` |
| NFA | `nfa`, `namibia-futsal` |
| Martial Arts Namibia | `namibia-martial-arts`, `namibia-full-contact-martial-arts` |
| Climbing landscape | `namibia-climbing`, `namibia-mountaineering` |

### Severity table

| Severity | Gap | Fix |
|----------|-----|-----|
| **Medium** | Athletics uses sport mark (was HTML stub) | Source verified Athletics Namibia crest + brand colors |
| **Medium** | 28 mark placeholders read as “logos” in stats | Admin/UI badge “sport mark” vs “crest”; keep marks until verified |
| **Medium** | Climbing/mountaineering landscape as logo | Dedicated crests or keep marks until found |
| **Low** | Orphan mark SVGs `golf.svg`, `dance-sport.svg` | Delete or leave; DB already on NNOC JPGs |
| **Low** | 204 `_candidates/` files in public tree | Move out of deployable public assets if bundle size matters |

---

## 6. Gap: Heroes (`background_image`)

| Status | Detail |
|--------|--------|
| Coverage | **100%** active (83/83); both soft-merged stubs also have heroes |
| Source | Local `/sports/*` only (prior Unsplash remotes cleared) |
| Shared heroes | Expected for governance bodies — e.g. `/sports/athletics.jpg` used by athletics + ministry + NAWISA + NLAS + NNSSU + NUFS (6) |

| Severity | Gap | Fix |
|----------|-----|-----|
| **Low** | Umbrella / ministry heroes often generic athletics | Prefer body-specific imagery when available (NSC/NNOC already better) |
| **Low** | Footgolf shares golf hero | Acceptable until footgolf-specific photo exists |

**No active null-hero gap.**

---

## 7. Gap: Brand colors

| Metric | Live |
|--------|------|
| Filled | **47 / 83 (57%)** |
| Crest with null colors | **8**: athletics, dance-sport, fistball, golf, MMA, climbing, mountaineering, nawisa |

| Severity | Gap | Fix |
|----------|-----|-----|
| **Medium** | Golf + Dance Sport crests landed **without** color pass | Sample NNOC JPGs → `primary_color` / `secondary_color` |
| **Medium** | Fistball + MMA crests also color-null | Same crest-sampling pass |
| **Low** | Mark-logo rows correctly omit invented brand colors | Keep null until real crest |

---

## 8. Gap: Media library

### What exists

- Schema: polymorphic `sportsplatform_media` (`drizzle/schema.ts`).
- API: `server/routers/media.ts` — public scoped `list`; `create` / `delete` via `federationAdminProcedure` + `assertSameFederation`.
- Admin UI: `MediaLibrary` on platform Admin + `FedAdminMedia`.
- Seed: migrations `000044` + `000054` → **61** static image rows for **16** flagship-ish feds + venues/athlete.

### What is missing

| Severity | Gap | Evidence | Fix |
|----------|-----|----------|-----|
| **High** | **No public federation gallery** — Home/tabs never query `media.list` | `FederationHome.tsx` has no media usage | Optional “Gallery” section or media strip on Home when count > 0 |
| **High** | **67 / 83** active feds have **zero** media rows | Live SQL | Seed only where real assets exist; do not fabricate |
| **Medium** | Media create is federation-entity only in Admin Media tab; no `media.update` | `05_admin_cms.md` | Add update + club/event/athlete entity create in UI |
| **Medium** | All media `file_url`s are **static** `/sports` `/logos` — not Storage URLs | Seed migrations | Fine for beta; migrate to Storage when uploads become source of truth |
| **Low** | 0 video / 0 document rows | Live SQL | Out of scope until content ops |

---

## 9. Gap: Storage buckets

### Platform buckets (exist)

| Bucket | Public | Objects (live) |
|--------|:------:|---------------:|
| `sportsplatform_logos` | yes | **0** |
| `sportsplatform_images` | yes | **0** |
| `sportsplatform_event_posters` | yes | **0** |
| `sportsplatform_athlete_photos` | yes | **0** |
| `sportsplatform_news_images` | yes | **0** |

**Code:** `server/services/supabaseStorage.ts` maps upload entities → those buckets; `ImageUpload` → `trpc.upload.image`. Forms for federation logo/hero, clubs, athletes, news, etc. are wired.

### Architectural reality

Production federation brands are **git-committed static assets** under `client/public/`, served by Cloudflare Worker Static Assets — **not** Supabase Storage. Shared project also has many non-`sportsplatform_*` buckets (other products); ignore for this app.

| Severity | Gap | Fix |
|----------|-----|-----|
| **High** (ops honesty) | Upload path unused → federations still edit path strings / static files | Either (a) keep static-first and document, or (b) start writing logos/heroes to `sportsplatform_logos` and store public URLs in DB |
| **Medium** | Empty buckets + service_role upload = latent capability with no provenance in DB | First real admin upload should set URL; add smoke test |
| **Low** | Shared Supabase project bucket sprawl | Document “only touch `sportsplatform_*`” (already in CLAUDE.md) |

---

## 10. Gap: Federation hollow tabs

### UX honesty (shipped)

`client/src/lib/federationPublicTabs.ts` + `FederationLayout`:

- Always show **Home** + **Events**
- Hide **Clubs / Athletes / News / Streams** when inventory is zero (public)
- Admins / same-fed federation_admin see all tabs
- Covered by `federationPublicTabs.test.ts`

### Content hollow (still real)

**Hollow triple (20)** — 0 clubs + 0 athletes + 0 published news:

| Type | Slugs |
|------|-------|
| federation | `baseball-namibia`, `ice-stock-namibia`, `indigenous-combat-sport`, `lacrosse-namibia`, `namibia-full-contact-martial-arts`, `namibia-kendo`, `namibia-korfball`, `namibia-modern-pentathlon`, `namibia-orienteering`, `namibia-teqball`, `namibia-waterski`, `namibia-western-mounted-games`, `petanque-namibia`, `roller-sports-namibia`, `ultimate-frisbee-namibia` |
| umbrella | `nlas`, `namibia-martial-arts`, `nnssu`, `nufs`, `nawisa` |

| Severity | Gap | Fix |
|----------|-----|-----|
| **Medium** | Raw hollow triple **24%** (scorecard wanted ≤15%) | Verified-source fills only; tab gate already mitigates UX |
| **Medium** | Events always shown even when 0 events (**18** feds) | Optional: gate Events too, or keep as “calendar empty state” (product call) |
| **Low** | Streams empty for almost all (79) — nav already hides | No action until real schedule/live rows |

---

## 11. Gap: Client fallback vs DB

| Item | State |
|------|-------|
| `client/src/data/federations.ts` | FALLBACK-ONLY curated subset; comment says do **not** expand to 85 |
| Home | tRPC `federations.list` first |
| Risk | Offline/API-fail path shows thinner directory + possibly stale logo paths |

| Severity | Gap | Fix |
|----------|-----|-----|
| **Low** | Fallback ≠ 85 | Acceptable; keep intentional |
| **Low** | Stale paths in fallback if used | Spot-check only if API-down UX matters |

---

## 12. Severity-ordered gap register

### Critical
*None specific to brands/media that block soft public.* (Directory count confusion was previously Critical for trust; Admin breakdown + docs mitigate.)

### High
1. **Athletics logo HTML stub** — broken crest asset.  
2. **Media invisible on public federation pages** despite 61 seeded rows.  
3. **Storage buckets empty** while upload UI implies cloud media — ops/docs honesty.

### Medium
4. **28 / 83 sport marks** still stand in for crests.  
5. **Brand colors 57%** — especially new Golf/DSN/Fistball/MMA crests.  
6. **Hollow triple 20 feds (24%)** — content, not nav.  
7. **Climbing/mountaineering / NAWISA** weak “crest” assets.  
8. **Media coverage only 16 feds**; no `media.update`.

### Low
9. Soft-merged weightlifting null logo.  
10. Orphan mark SVGs + large `_candidates/` tree.  
11. Shared heroes among umbrellas.  
12. Optional `nsc_registered` flag.  
13. Fallback catalogue thinner than DB.

---

## 13. What’s already solid

- Live **85 = 83 + 2** arithmetic and soft-merge redirect behaviour.  
- Admin Directory stats copy distinguishes sports / bodies / merged.  
- Heroes **100%** local for active feds.  
- Logos **100%** SQL-filled with honest mark vs crest path convention.  
- Crest deep-passes + NNOC Golf/DSN promote documented with rejections.  
- Public tab honesty for empty Clubs/Athletes/News/Streams.  
- Media router tenancy via `assertSameFederation`.  
- Five `sportsplatform_*` buckets provisioned and named correctly.

---

## 14. Recommended actions (prioritized)

| P | Owner | Action |
|---|-------|--------|
| P1 | Agent | ~~HTML stub~~ → sport mark shipped; source verified Athletics Namibia crest + color fill |
| P0 | Agent | Surface `media.list` on federation Home when count > 0 (or document “admin-only gallery”) |
| P1 | Agent | Crest color pass for Golf, Dance Sport, Fistball, MMA (+ climbing if crest found) |
| P1 | Human + Agent | Crest hunts for Karate / Badminton / PWFN / umbrellas — promote over marks only when verified |
| P1 | Product | Decide: static-assets-first vs Storage-as-source-of-truth; update CLAUDE/admin copy |
| P2 | Agent | Hollow verified fills for umbrellas / long-tail when named sources exist |
| P2 | Agent | Optional Events tab gate when published events = 0 |
| P2 | Agent | Prune or relocate `logos/_candidates/` out of public deploy path |
| P3 | Product | Optional `nsc_registered` / roster tagging for Admin filters |

---

## 15. How to re-check

```sql
-- Entity mix
SELECT type::text, is_active, (merged_into_slug IS NOT NULL) AS soft_merged, COUNT(*)
FROM sportsplatform_federations
GROUP BY 1, 2, 3
ORDER BY 1, 2 DESC, 3;

-- Logo kinds + heroes + colors
SELECT
  COUNT(*) FILTER (WHERE is_active) AS active,
  COUNT(*) FILTER (WHERE is_active AND logo LIKE '/logos/marks/%') AS marks,
  COUNT(*) FILTER (WHERE is_active AND logo LIKE '/logos/%' AND logo NOT LIKE '/logos/marks/%') AS crests,
  COUNT(*) FILTER (WHERE is_active AND background_image IS NOT NULL) AS heroes,
  COUNT(*) FILTER (WHERE is_active AND primary_color IS NOT NULL) AS colors
FROM sportsplatform_federations;

-- Media + Storage
SELECT entity_type::text, COUNT(*) FROM sportsplatform_media GROUP BY 1;
SELECT b.name, COUNT(o.id) AS objects
FROM storage.buckets b
LEFT JOIN storage.objects o ON o.bucket_id = b.id
WHERE b.name LIKE 'sportsplatform_%'
GROUP BY b.name;

-- Hollow triple
WITH f AS (SELECT id FROM sportsplatform_federations WHERE is_active),
c AS (SELECT federation_id, COUNT(*) AS n FROM sportsplatform_clubs WHERE is_active GROUP BY 1),
a AS (SELECT federation_id, COUNT(*) AS n FROM sportsplatform_athletes WHERE is_active GROUP BY 1),
n AS (SELECT federation_id, COUNT(*) AS n FROM sportsplatform_news_articles WHERE is_published GROUP BY 1)
SELECT COUNT(*) FILTER (
  WHERE COALESCE(c.n,0)=0 AND COALESCE(a.n,0)=0 AND COALESCE(n.n,0)=0
) AS hollow_triple
FROM f
LEFT JOIN c ON c.federation_id = f.id
LEFT JOIN a ON a.federation_id = f.id
LEFT JOIN n ON n.federation_id = f.id;
```

---

## 16. Score contribution (for synthesizer)

| Subscore | /10 | Notes |
|---------:|----:|-------|
| Count honesty (61 vs 85) | 9 | Docs + Admin breakdown |
| Soft-merge hygiene | 9 | Redirects solid |
| Hero coverage | 10 | 100% |
| Crest quality | 6 | 55 real paths; athletics broken; 28 marks |
| Brand colors | 6 | 57% |
| Media product | 4 | Seeded, admin-only, 16 feds |
| Storage reality | 3 | Buckets empty; static-first |
| Hollow UX | 7 | Tab gate good; content still thin |
| **Domain blend** | **~6.5 / 10** | Soft-beta directory branding OK; crest/media/Storage unfinished |

---

*End of `10_federations_brands.md`.*
