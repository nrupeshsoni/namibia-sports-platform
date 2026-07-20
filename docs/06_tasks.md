# Master Tasks — Namibia Sports Platform

## 🛑 CRITICAL BLOCKERS
- [x] Federation pages broken (/federation/karate-namibia) — fixed getBySlug fallbacks, migration for slugs, Home→tRPC
- [ ] Verify .env.example is complete and matches actual usage
- [~] Federation logos — ~49/83 active have logos; +Ice Stock/Boxing NABF (`20260720000038`); +Kickboxing/Sailing/NCRF/Jukskei (`000033`); still null: Karate/Golf/Handball/Badminton/PWFN/Dance/Horse Racing/Taekwondo — see `docs/research/federation_data_gap_list.md`
- [x] **RLS write policies unsafe for prod** — hardened `20260720000030` + residual `20260720000034` (applied live): open writes dropped; public SELECT = published/active/visible only; staff draft SELECT; write GRANTs revoked from anon/authenticated
- [~] **Content hollow for public beta** — streams: **4** VODs + Live nav gated (`20260720000032`; no real upcoming live found); media: **61** rows (`20260720000044` + pass 2 `20260720000054`); news **59/59 images** / **37** feds (`000031` + `000047` + pass 3 `000052`); events pass 6 NHU upcoming (`20260720000053`) → **49** upcoming / NHU **5** forward-dated; clubs **131** across **26** feds (`20260720000048` + pass 4 `20260720000050`); athletes **92** active / **100%** photos + venues **28** (`20260720000046` + coaches/athletes depth `20260720000051`); coaches **35** active / **100%** photos — still ~57 feds with zero clubs; audit §8 action plan

## ⚠️ HIGH PRIORITY
- [x] RLS enabled on all `sportsplatform_*` tables — write + SELECT harden complete (`20260720000030`, `20260720000034`)
- [ ] Implement WhatsApp subscribe/unsubscribe routers
- [ ] Add rate limiting to auth and public mutation endpoints
- [ ] Ensure all list queries have .limit() (news: limit 50, audit others)
- [x] Reconcile federation roster to NSC 2026 list (85 entities; migration `20260720000001`)
- [x] Populate new federation descriptions/contacts from NSC Feb 2025 extract (migration `20260720000002`)
- [x] Restore recoverable logos + null broken paths (migration `20260720000003`)
- [x] Priority crests: Ministry, Paralympic, NRU, Bowls (migration `20260720000004`)
- [x] More crests: NSC, Volleyball, Chess, Judo + batch (migration `20260720000010`)
- [x] Padel leadership + Ultimate/Billiards contacts from verified sources
- [~] Research contacts for Footgolf, Western Mounted Games + remaining unverified federations — Footgolf leadership + Handball email/phone (`20260720000006`) + Surfing ISA contacts (`20260720000011`); 10 rows still null email+phone; see `docs/research/contacts_enrichment_batch.md`
- [x] Enrich federation metadata (unique abbrs + thin descriptions) — migration `20260720000007`; see `docs/research/metadata_enrichment_batch.md`
- [x] Resolve Aquatics/Swimming + Power/Weightlifting duplicates + crest brand colors — migration `20260720000013`; see `docs/research/naming_duplicates_resolution.md`
- [x] Soft-merge lifecycle: `is_active` + `merged_into_slug` + public list filter + slug redirect — migration `20260720000017`
- [~] Schema: `established_year`, `international_affiliation`, city/region — still draft in `docs/research/proposed_federation_schema_extensions.md`
- [~] Brand colors: 15/85 filled; continue as logos land
- [x] Mark `client/src/data/federations.ts` FALLBACK-ONLY (67 vs DB 85); fix broken hero image paths

## 🟡 WARNINGS
- [x] Athletes + venues beta depth — dedupe/slugs/photos + 36 notables; venues 15→28 (`20260720000046`); see `docs/research/athletes_venues_enrichment_batch.md`
- [x] Coaches + athletes depth — coaches 16→35 active (100% photos); +21 athletes for netball/hockey/cycling/swim/judo/para (`20260720000051`); see `docs/research/coaches_athletes_depth_batch.md`
- [ ] Athletes pass 3: more individual Wikimedia/official portraits; optional club_id links; residual judo depth
- [x] Events calendar enrichment pass 1 — corrections + 22 verified inserts (`20260720000020`/`021`); see `docs/research/events_enrichment_batch.md`
- [x] Events pass 2 — dedupe 9 duplicates + gap federations (`20260720000035`); live **160** events, **40/83** feds, **99** posters, **43** still zero
- [x] Events pass 3 — +26 verified zero-fed events (`20260720000037`); live **186** events, **50/83** feds, **117** posters, **33** still zero
- [x] Events pass 4 — +19 verified (`20260720000039`); live **205** events, **62/83** feds, **131** posters, **21** still zero (see Pass 4 categorization)
- [x] Events pass 5 — majors upcoming + poster backfill (`20260720000041`); live **217** events / **44** upcoming / **163** posters; NHU still 0 forward-dated (outdoor season start past)
- [x] Events pass 6 — NHU SA women’s Cape Town tests (`20260720000053`); live **222** events / **49** upcoming; **21** zeros unchanged (no dated public fixtures)
- [ ] Events pass 7 / NSC ask: remaining 21 zeros; thin tennis/archery/chess seeds; NSSU federation row
- [x] News pass 3 — +12 zero-news feds (`20260720000052`); live **59** published / **37** feds / **46** still zero news
- [ ] Admin page: connect to real tRPC, remove mock data
- [ ] Empty states for all list views
- [ ] Loading states to prevent double-click submit
- [ ] Error boundaries on page-level components

## 🟢 SAFE
- [x] Schema: slug, primaryColor, secondaryColor on federations
- [x] Schema: news_articles, live_streams, whatsapp_subscriptions
- [x] Relations defined in drizzle/relations.ts
- [x] Routers split into server/routers/
- [x] federationAdminProcedure added
- [x] news and streams routers with correct auth

## Database Blockers (Phase 1)
- Verify ON DELETE behavior on all FKs in migrations
- Add indexes for: federation_id, club_id, slug, is_published, is_live

## API Vulnerabilities (Phase 2)
- Add timeout to external API calls (Anthropic, WhatsApp)
- Ensure Zod validation on all procedure inputs

## Data / beta readiness (2026-07-20 audit)
- Full scorecard: `docs/research/beta_readiness_data_audit.md` (~42/100; not public-beta ready)
- 48h ROI: (1) ~~harden RLS writes~~ done `20260720000030`+`000034` (2) seed upcoming for Big-8 (3) news+images (4) ~~hide or seed Live~~ done — seed + nav gate (`20260720000032`) (5) P0 crests
- [x] Seed verified Live streams + de-emphasize empty Live nav — migration `20260720000032`; `useShowLiveNav`; `/live` Recent Coverage
- [x] Seed flagship `sportsplatform_media` (≥20) — migration `20260720000044` (**24** rows); scheduled live skipped (no verified upcoming URLs)
- [x] Expand `sportsplatform_media` ≥50 — pass 2 `20260720000054` (**61** rows; +netball/hockey/basketball/boxing/volleyball/tennis/aquatics/judo/handball + venues/athlete); schools sport notes skipped (no verified per-school research)
