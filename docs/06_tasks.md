# Master Tasks — Namibia Sports Platform

## 🛑 CRITICAL BLOCKERS
- [x] Federation pages broken (/federation/karate-namibia) — fixed getBySlug fallbacks, migration for slugs, Home→tRPC
- [~] **CRITICAL credentials in git** — plaintext Postgres password + service_role JWT scrubbed from tree (2026-07-21); **human must rotate Supabase DB password + API keys + Hyperdrive/Worker secrets NOW** — see `docs/research/SECURITY_CREDENTIAL_ROTATION.md`
- [ ] Verify .env.example is complete and matches actual usage
- [x] Federation logos — **83/83** active have logo or sport mark (live 2026-07-24; `20260724120000` + NNOC Golf/DSN crests `20260724180000`); **55** real crests + **28** `/logos/marks/*` (marks shrink as verified crests land) — `docs/research/FEDERATION_PHOTOS_COVERAGE.md` + `crests_hollow_fill_batch_20260724.md`
- [x] **RLS write policies unsafe for prod** — hardened `20260720000030` + residual `20260720000034` (applied live): open writes dropped; public SELECT = published/active/visible only; staff draft SELECT; write GRANTs revoked from anon/authenticated
- [x] **Auth/API gap hotfix** — `getRawInput()` tenant middleware; close `news.list`/`events.list` draft leak; Admin UI role gate; require federationId on athlete/coach create; ownership checks on coaches/media/hp mutations
- [x] **Public athlete/coach PII stripped** — list/get omit email/phone/DOB; getById/getBySlug enforce `is_active`; staff `includePii` for admin forms
- [~] **Content hollow for public beta** — streams: **4** VODs + Live nav gated; media: **61**; news **89** / clubs **191** / athletes **198** after `20260724190000`; hollow core-5 **21.7%** (18/83) — public Fed tabs hide when empty (`federationPublicTabs`); crests/marks **83/83**; see `docs/research/hollow_longtail_ux_fill_20260724.md`

## ⚠️ HIGH PRIORITY
- [x] RLS enabled on all `sportsplatform_*` tables — write + SELECT harden complete (`20260720000030`, `20260720000034`)
- [x] WhatsApp public API **hard-disabled** for go-live (`WHATSAPP_API_ENABLED=false` in `server/routers/whatsapp.ts`); `consent_at` column ready for future Meta opt-in re-enable
- [x] Rate limiting on `ai.*`, `upload.image`, `search.global` (`server/_core/rateLimit.ts`) — auth endpoints / global WAF still open if needed later
- [x] Production security audit 2026-07-23 — `docs/research/PRODUCTION_SECURITY_AUDIT.md` (Critical remaining: credential rotation + Hyperdrive least-privilege)
- [x] Ensure all list queries have .limit() — news default 50; events/clubs/athletes/coaches/streams/venues/federations/hpPrograms default 50 / max 200 (server/_core/listLimits.ts)
- [x] Reconcile federation roster to NSC 2026 list (85 entities; migration `20260720000001`)
- [x] Explain official **61** vs platform **85** — `docs/research/FEDERATION_COUNT_OFFICIAL_VS_PLATFORM.md`; Admin Directory card breaks down sports · bodies · merged (no mass-delete)
- [x] Populate new federation descriptions/contacts from NSC Feb 2025 extract (migration `20260720000002`)
- [x] Restore recoverable logos + null broken paths (migration `20260720000003`)
- [x] Priority crests: Ministry, Paralympic, NRU, Bowls (migration `20260720000004`)
- [x] More crests: NSC, Volleyball, Chess, Judo + batch (migration `20260720000010`)
- [x] Padel leadership + Ultimate/Billiards contacts from verified sources
- [~] Research contacts for Footgolf, Western Mounted Games + remaining unverified federations — Footgolf/Handball/Surfing (`000006`/`000011`) + Pass 3 leadership wins (`20260720000056`); **10** rows still null email+phone (emerging codes); see `docs/research/contacts_enrichment_batch.md`
- [x] Enrich federation metadata (unique abbrs + thin descriptions) — migration `20260720000007`; see `docs/research/metadata_enrichment_batch.md`
- [x] Resolve Aquatics/Swimming + Power/Weightlifting duplicates + crest brand colors — migration `20260720000013`; see `docs/research/naming_duplicates_resolution.md`
- [x] Crest brand colors pass 2 (≥40/83) — migration `20260720000060`; see `docs/research/crest_brand_colors_batch.md` (**47/83**)
- [x] Soft-merge lifecycle: `is_active` + `merged_into_slug` + public list filter + slug redirect — migration `20260720000017`
- [~] Schema: `established_year`, `international_affiliation`, city/region — still draft in `docs/research/proposed_federation_schema_extensions.md`
- [~] Brand colors: 15/85 filled; continue as logos land
- [x] Mark `client/src/data/federations.ts` FALLBACK-ONLY; shrunk to 12-entry error fallback (Home uses DB first)
- [x] Federation Clubs/Athletes/News/Events empty states + initials image fallbacks (beta thin-data polish)

## 🟡 WARNINGS
- [x] Namibian sports news ingestion research — `docs/research/NAMIBIAN_SPORTS_NEWS_SOURCES.md`; RSS Phase 1 wired in `news-aggregator` (opt-in `ENABLE_NEWS_AGGREGATOR`); no outlet APIs
- [x] Deploy `news-aggregator` + `ENABLE_NEWS_AGGREGATOR=true` + `pg_cron` every 6h (`invoke-news-aggregator`); first smoke looked idle (`skippedNonSports:9`) but was retired Claude model 404 — fixed to `claude-sonnet-4-6` + trust sports category feeds; **`agg-*` drafts live** (Admin News)
- [x] News auto-publish policy — trusted sports feeds publish when Namibia+sports pass; `source_url`/`source_name`; image enrich; 58 `agg-*` backfill published; kill-switch `ENABLE_NEWS_AGGREGATOR`
- [x] News missing-image UX — text-first cards (Home/`/news`/federation); aggregator og/RSS backfill + timeouts; no fake Unsplash/initials placeholders
- [x] Home Sports News ticker — scroll-reveal headline bar + shared article modal; mid-page grid → compact teaser; `/news` keeps cards
- [x] News ticker polish — marquee motion fix, translucent glass bar, thumbs from `featuredImage`; Google News URL unwrap for image enrich
- [x] Athletes + venues beta depth — dedupe/slugs/photos + 36 notables; venues 15→28 (`20260720000046`); see `docs/research/athletes_venues_enrichment_batch.md`
- [x] Venues ≥40 + HP programs seed — venues 28→42 (**100%** photos); `sportsplatform_hp_programs` 0→10 (`20260720000062`); see `docs/research/venues_hp_enrichment_batch.md`
- [x] Coaches + athletes depth — coaches 16→35 active (100% photos); +21 athletes for netball/hockey/cycling/swim/judo/para (`20260720000051`); see `docs/research/coaches_athletes_depth_batch.md`
- [x] People pass 3 (underrepresented sports) — athletes 92→124 active; coaches 35→47 active; volleyball/tennis/TT/boxing/gymnastics/wrestling/chess (`20260720000061`); see `docs/research/people_underrepresented_batch.md`
- [ ] Athletes pass 4: more individual Wikimedia/official portraits; optional club_id links; residual judo/beach volleyball depth
- [x] Events calendar enrichment pass 1 — corrections + 22 verified inserts (`20260720000020`/`021`); see `docs/research/events_enrichment_batch.md`
- [x] Events pass 2 — dedupe 9 duplicates + gap federations (`20260720000035`); live **160** events, **40/83** feds, **99** posters, **43** still zero
- [x] Events pass 3 — +26 verified zero-fed events (`20260720000037`); live **186** events, **50/83** feds, **117** posters, **33** still zero
- [x] Events pass 4 — +19 verified (`20260720000039`); live **205** events, **62/83** feds, **131** posters, **21** still zero (see Pass 4 categorization)
- [x] Events pass 5 — majors upcoming + poster backfill (`20260720000041`); live **217** events / **44** upcoming / **163** posters; NHU still 0 forward-dated (outdoor season start past)
- [x] Events pass 6 — NHU SA women’s Cape Town tests (`20260720000053`); live **222** events / **49** upcoming; **21** zeros unchanged (no dated public fixtures)
- [x] Events pass 7 — zero-fed deep-research + CWG bowls/boxing/gymnastics upcoming (`20260720000059`); live **230** events / **52** upcoming / **18** zeros
- [x] Events web Batch A (big sports) — +27 verified inserts + 4 corrections (`20260724200000`); live **270** events / **268** published; evidence `docs/research/events_web_batch_A_20260724.md`
- [ ] Events pass 8 / NSC ask: remaining 18 zeros; thin tennis/archery/chess seeds; NSSU federation row
- [x] News pass 3 — +12 zero-news feds (`20260720000052`); live **59** published / **37** feds / **46** still zero news
- [x] News pass 4 — +14 zero-news feds (`20260720000058`); live **73** published / **51** feds / **32** still zero news
- [x] Admin page: connect to real tRPC CRUD for news/streams/venues/coaches/schools/media/HP + Users role assignment; FedAdmin coaches/media/HP + ImageUpload on news/streams/clubs
- [x] Platform Admin: all-section lists without forced working federation; optional federation filter; real stats via `adminStats.counts`; Users Add User / inviteOrPromote + Assign role; `/admin` remains admin-only (FedAdmin tenant-scoped)
- [x] Empty states for all list views — federation Clubs/Athletes/News/Events/Streams + Federation Home sections + Live VOD honesty; remaining: admin lists only
- [ ] Loading states to prevent double-click submit
- [ ] Error boundaries on page-level components

## 🟢 SAFE
- [x] Production SEO + AIO — `SeoHead` route meta/OG/JSON-LD; build-time sitemap with all 83 active federation slugs (`scripts/generate-sitemap.mjs` + `scripts/data/`)
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
