# Changelog

All notable changes to this project are documented in this file.

## [Unreleased]

### Security
- Closed public detail/search leaks for drafts and inactive entities: `events.getById` returns null unless `isPublished` (admin / same-federation `federation_admin` may see drafts); `athletes.getById` / `getBySlug`, `clubs.getById`, `coaches.getById` return null unless `isActive` (same staff exception); `search.global` events require `isPublished`. List `includeInactive` for `federation_admin` requires matching `federationId` (same gate as `includeUnpublished`).
- Worker responses now set security headers on all routes: `Content-Security-Policy` (Vite SPA + Supabase + YouTube embeds + Maps forge), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security`. Missing static assets under `/sports/`, `/logos/`, `/athletes/`, `/venues/`, and `/news/*` with a file extension return real **404** (not SPA `index.html`); app routes keep SPA fallback.
- Public `athletes.list` / `getById` / `getBySlug` and `coaches.list` / `getById` omit `email`, `phone`, and (athletes) `dateOfBirth`; inactive rows hidden on get; staff may pass `includePii` for full rows. Public AthleteProfile no longer shows contact/DOB.
- **CRITICAL:** Scrubbed plaintext Supabase Postgres password from tracked docs/scripts (`README.md`, `DEPLOYMENT_GUIDE.md`, `docs/design/NETLIFY_DEPLOYMENT.md`, `scripts/apply-seed.mjs`, `docs/scripts/test-db-connection.mjs`) and removed committed `SUPABASE_SERVICE_ROLE_KEY` from `scripts/seed-via-supabase.mjs`. Scripts now require env vars (see `.env.example`). **Human must rotate the live DB password + service_role key NOW** ΓÇö scrubbing the tree does not revoke access. Checklist: `docs/research/SECURITY_CREDENTIAL_ROTATION.md`.
- `ai.chatAssistant` now requires `protectedProcedure` (was `publicProcedure`) to block unauthenticated Anthropic spend.
- **Gap A6 ΓÇö federation tenancy was unenforced.** The `federationAdminProcedure` middleware inferred the tenant by sniffing `federationId` out of the raw tRPC input, which silently skipped the check for any input it could not read ΓÇö every federation-scoped mutation was effectively "any federation_admin may write to any federation". The middleware now only checks the role; each mutation calls `assertSameFederation(ctx.user, ΓÇª)` explicitly, before it touches the database (`athletes`, `clubs`, `coaches`, `events`, `hpPrograms`, `media`, `news`, `streams`, `upload`). Covered by `server/federationScope.test.ts` (one cross-tenant case per mutation, plus a same-tenant negative control).
- **Gap A14 ΓÇö AI chat cost caps.** `ai.chatAssistant` now caps history at 10 turns, each message at 2,000 characters and the whole conversation at 12,000, and rate limits to 10 messages/minute per caller (`server/_core/rateLimit.ts`). No API key was set ΓÇö the widget stays behind `VITE_SHOW_AI_CHAT`.

### Added
- Production legal pages at `/privacy` and `/terms` (glass/dark layout): operator disclosure (The Dome Technologies / Facilit8 Namibia), honest NSC data-controller placeholder, data purposes, WhatsApp/marketing opt-in language, athlete data, user rights, contacts. Home footer links + Register required Terms/Privacy acceptance checkbox.
- Public-ready master gap analysis (Agent 15 SYNTHESIZER): `docs/research/PUBLIC_READY_GAP_ANALYSIS.md` ΓÇö full public launch **65/100**, **NO-GO** with soft/invite conditional YES; P0/P1/P2, hide-or-ship flags, 48h plan. Synthesizes Agent 5 data (`public_ready_data_snapshot.md`, content **63**) + Agent 4 schema (`public_ready_db_snapshot.md`, **78**) + live SQL/code spot-checks. Caps Γëñ48 if credentials unrotated.
- Public-ready SEO seed: `client/public/robots.txt` (allow crawl + sitemap) and static `client/public/sitemap.xml` for `/`, `/events`, `/news`, `/live`, `/map`.
- `client/index.html` Open Graph + Twitter Card meta (`og:title`, `og:description`, `og:image` ΓåÆ `/sports/football-action.jpg`).
- Public-ready DB/schema snapshot (Agent 4): live Supabase vs Drizzle drift, orphan FKs, indexes, draft/inactive API gates, migration ledger hygiene ΓÇö `docs/research/public_ready_db_snapshot.md` (~78/100 schema/DB).
- Full platform gap analysis (features, DB, auth/RBAC, security, flows, API, frontend, ops, data) with 48h / 2-week plan: `docs/research/FULL_GAP_ANALYSIS.md` (synthesizes live DATA scorecard `docs/research/full_gap_analysis_data.md` + code spot-checks). Overall **~70/100** ΓÇö soft/invite beta OK; not polished national launch. Score assumes credential rotation in `SECURITY_CREDENTIAL_ROTATION.md` is treated as P0 ops.
- Migration `20260720000050_clubs_expansion_pass4.sql` ΓÇö **+39** verified clubs ΓåÆ **131** total; feds-with-clubs **21ΓåÆ26** (new: chess, motorsport, equestrian, sailing, handball) + depth for swimming/NASFED, cycling, cricket, rugby, karate. Evidence: `docs/research/clubs_enrichment_batch.md` Pass 4.
- Migration `20260720000052_news_enrichment_pass3.sql` ΓÇö **12** paraphrased news articles with `/sports/*` images for previously zero-news federations (handball, karate, beach volleyball, taekwondo, motorsport, equestrian, archery, fencing, powerlifting, bodybuilding, angling, darts). Live: **59** published / **59** with images / **37** federations. Evidence: `docs/research/news_enrichment_batch.md` Pass 3.
- Migration `20260720000053_events_pass6_nhu_upcoming.sql` ΓÇö **+5** verified NHU upcoming fixtures (SA women's Cape Town test series 20ΓÇô24 Jul 2026 + 4 dated tests). Zero-event feds re-hunted ΓÇö no new dated inserts. Live: **222** events / **49** upcoming. Evidence: `docs/research/events_enrichment_batch.md` Pass 6.
- Migration `20260720000051_coaches_athletes_depth.sql` ΓÇö coaches **16ΓåÆ36** total / **35** active (**0%ΓåÆ100%** photos); +20 verified national/club coaches (football/rugby/cricket/netball/hockey/boxing/swimming/judo) with paraphrased role bios + sources (no invented licences). Athletes **80ΓåÆ101** total / **92** active (**100%** photos); +21 notables for netball/hockey/cycling/swimming/judo/para. Assets: `client/public/coaches/jacques-burger.jpg`, `client/public/athletes/vera-looser.jpg`. Evidence: `docs/research/coaches_athletes_depth_batch.md`.
- Migration `20260720000054_media_expansion_pass2.sql` ΓÇö `sportsplatform_media` **24ΓåÆ61** (+37 images) for netball/hockey/basketball/boxing/volleyball/tennis/aquatics/judo/handball/beach volleyball + 4 venues + Frankie; paths under `/sports/`, `/logos/`, `/venues/`, `/athletes/`. Schools unchanged (no per-school verified sport notes in research). Evidence: `docs/research/media_enrichment_batch.md` Pass 2.
- Migration `20260720000046_athletes_venues_enrichment.sql` ΓÇö athletes **44ΓåÆ80** total / **71** active (**0%ΓåÆ100%** photos); +36 verified notables (football/rugby/cricket/athletics/boxing/para/canoe) with paraphrased bios + source links; venues **15ΓåÆ28** (**100%** photos). Assets: `client/public/athletes/`, `client/public/venues/` (Wikimedia Independence/Hage/Sam + Frankie Fredericks). Evidence: `docs/research/athletes_venues_enrichment_batch.md`.
- Migration `20260720000047_news_enrichment_pass2.sql` ΓÇö **12** paraphrased news articles with `/sports/*` images for previously zero-news federations (basketball, cycling, table tennis, tennis, golf, wrestling, squash, judo, gymnastics, triathlon, chess, bowls). Live: **47** published / **47** with images / **25** federations. Evidence: `docs/research/news_enrichment_batch.md` Pass 2.
- Migration `20260720000049_federations_websites_socials_pass3.sql` ΓÇö Jukskei website + Judo/Wrestling/Darts Facebook (null-guarded). Active: website **55**, facebook **52**. Evidence: `docs/research/websites_socials_enrichment_batch.md` Pass 3.
- Migration `20260720000048_clubs_expansion_verified.sql` ΓÇö **+30** verified clubs ΓåÆ **92** total; feds-with-clubs **16ΓåÆ21** (new: boxing, squash, bowls, wrestling, gymnastics) + expansions for hockey/basketball/tennis/volleyball/netball/athletics. Evidence: `docs/research/clubs_enrichment_batch.md` Pass 3.
- Migration `20260720000043_federations_crests_deep_pass3.sql` ΓÇö Handball (CAHB/Sportaview NHF crest) + NLAS/NALASRA (Wayback `nalasra.com/mobile_logo.png`); null-guarded ΓåÆ logos **51/83**. Sources in `docs/research/federation_data_gap_list.md`.
- Migration `20260720000045_clubs_contacts_pass2.sql` ΓÇö **+14** club websites/socials (NFA priority + United/Suburbs/Old Boys); any-contact **8ΓåÆ22/62**; no new emails/phones (none verified). Evidence appended in `docs/research/clubs_enrichment_batch.md` Pass 2.
- Migration `20260720000041_events_pass5_majors_upcoming.sql` ΓÇö **+12** verified upcoming events for majors (NFA AFCON 2027 qualifier windows, Cricket CWC L2 Utrecht, NASFED/Athletics Commonwealth Games Glasgow, KBA mid-season fixtures); poster backfill ΓåÆ **0** upcoming without posters; live **217** events / **44** upcoming. See `docs/research/events_enrichment_batch.md` Pass 5.
- Migration `20260720000042_clubs_enrichment_batch.sql` ΓÇö clubs logos **0ΓåÆ62/62** (25 dedicated crest paths + 37 sport-correct `/sports/*`; assets in `client/public/logos/clubs/`); verified contacts for **8** clubs (Wanderers├ù3, DTS, Rossmund, WGCC, Dome Basketball, Cricket Academy). Evidence: `docs/research/clubs_enrichment_batch.md`.
- Migration `20260720000044_media_flagship_seed.sql` ΓÇö **24** `sportsplatform_media` images for NFA/NRU/Cricket/Athletics/NNOC/NSC using verified `/sports/*` + `/logos/*` paths; no fake scheduled live (streams unchanged at 4 VODs). Evidence: `docs/research/media_enrichment_batch.md`.
- Migration `20260720000040_federations_sport_photos_pass2.sql` ΓÇö fill remaining **11** null `background_image` heroes (padel, fistball, ice stock, jukskei, kendo, teqball, etc.) ΓåÆ **83/83** active coverage; Commons sources in `docs/research/federation_photos_batch.md`.
- Migration `20260720000039_events_pass4_zero_feds.sql` ΓÇö **+19** verified events for 12 more zero-event feds (fistball, horse racing, fencing, bodybuilding, canoe/rowing, WMG, waterski, MMA, kickboxing, darts, indigenous, skateboarding); live **205** events, **62/83** feds, **21** still zero. See `docs/research/events_enrichment_batch.md` Pass 4.
- Migration `20260720000037_events_pass3_zero_feds.sql` ΓÇö **+26** verified events for previously zero-event feds (esports, padel, sailing, dance, jukskei, cue sports, RCFA full-contact, NIIHA, taekwondo, paralympic); live **186** events, **50/83** feds, **33** still zero. See `docs/research/events_enrichment_batch.md` Pass 3.
- Migration `20260720000036_federations_sport_photos.sql` ΓÇö sport-correct `background_image` heroes for **72/83** active federations; ~75 named assets in `client/public/sports/`; evidence in `docs/research/federation_photos_batch.md`.
- Migration `20260720000035_events_pass2_dedupe_enrich.sql` ΓÇö delete 9 true duplicate event slugs; +21 verified events for bowls/squash/motorsport/equestrian/gymnastics/surfing/karate/basketball/NRU/NHU/judo/volleyball; poster backfill ΓåÆ **99** posters; live **160** events (40/83 feds covered). See `docs/research/events_enrichment_batch.md` Pass 2.
- Migration `20260720000038_federations_crests_deep_pass2.sql` ΓÇö Ice Stock + Boxing NABF crest (replaces boxing sport photo); null-/sports-guarded. Sources in `docs/research/federation_data_gap_list.md`.
- Migration `20260720000033_federations_crests_deep.sql` ΓÇö Kickboxing, Sailing, Canoeing/Rowing (NCRF), Jukskei crests (logo column only; null-guard). Sources in `docs/research/federation_data_gap_list.md`.
- Migration `20260720000032_live_streams_seed_verified.sql` ΓÇö **4** verified YouTube VODs (NFA, NRU, Cricket Namibia, NASFED) with `/sports/*` thumbnails; oEmbed-checked watch/embed URLs.
- `useShowLiveNav` ΓÇö hide Live from Home/NavDrawer/MobileBottomNav unless a stream is live or scheduled upcoming (override: `VITE_SHOW_LIVE_NAV=true`). Route `/live` remains with Recent Coverage + empty state.
- Migration `20260720000020_events_corrections_enrichment.sql` ΓÇö correct mislinked/wrong-dated events (NASFED, NPFL, athletics, WPP, netball); add source URLs in descriptions + sport-matched posters.
- Migration `20260720000021_events_populate_verified_batch.sql` ΓÇö +22 verified Namibian events (Desert Dash, Red Run, Vivo Marathon, Top 8, NSSU athletics, senior T&F, golf opens, WelwitschiasΓÇôBlue Bulls, etc.). Live events: **148** (was 126).
- Events research notes: `docs/research/events_enrichment_batch.md`.
- Migration `20260720000001_federations_reconcile.sql` ΓÇö merge Triathlon/Squash duplicates; add 20 NSC-recognised federations. Live count: **85** entities.
- Migration `20260720000002_federations_populate_batch.sql` ΓÇö descriptions + verified NSC contacts for new federations; website enrichment; clear fabricated placeholder emails.
- Migration `20260720000003_federations_logos_and_contacts.sql` ΓÇö restore logo paths; null broken image paths; Ultimate/Billiards/Handball/Padel contacts.
- Migration `20260720000004_federations_priority_crests.sql` ΓÇö Ministry (MSYNS), Paralympic, NRU crest, Bowls Namibia logos.
- Migration `20260720000006_federations_contacts_enrichment.sql` ΓÇö verified Footgolf leadership, Handball email/phone (CAHB), Bodybuilding (WFF) president.
- Migration `20260720000007_federations_metadata_enrichment.sql` ΓÇö unique abbreviations + quality descriptions for thin stubs.
- Migration `20260720000012_federations_websites_socials.sql` ΓÇö verified websites (+5 ΓåÆ 48/85) and social URLs; evidence in `docs/research/websites_socials_enrichment_batch.md`.
- Migration `20260720000018_federations_websites_socials_pass2.sql` ΓÇö Pass 2 IF/archive websites (+7 ΓåÆ 55/85) + Footgolf/Cue Sports Facebook; evidence appended to same research file.
- Migration `20260720000011_federations_contacts_enrichment_pass2.sql` ΓÇö Surfing Namibia email/phone/SG from ISA member directory.
- Migration `20260720000010_federations_more_crests.sql` ΓÇö NSC, Volleyball, Chess, Judo + Tennis/Shooting/Basketball/Table Tennis + shared NVF/NIIHA/NFA crests for beach volleyball, roller/skate, futsal.
- Migration `20260720000019_federations_crests_batch19.sql` ΓÇö Fencing, Archery, Wrestling, Esports (NESA), Padel crests (logo column only).
- Migration `20260720000013_federations_duplicates_and_brand_colors.sql` ΓÇö soft-merge Aquatics/Swimming + Power/Weightlifting; 15 crest-verified brand color pairs.
- Migration `20260720000017_federations_is_active_merge.sql` ΓÇö `is_active` + `merged_into_slug`; deactivate 2 merged rows; public list/search hide inactive; `getBySlug` returns canonical; admin `listAll`.
- Schema extension draft (remaining columns): `docs/research/proposed_federation_schema_extensions.md`.
- Duplicate decisions: `docs/research/naming_duplicates_resolution.md`.
- Restored federation logos under `client/public/logos/` (37 files); gap inventory in `docs/research/federation_data_gap_list.md`.
- Contacts research notes: `docs/research/contacts_enrichment_batch.md` (incl. Pass 2).
- Metadata research + completeness: `docs/research/metadata_enrichment_batch.md`, `docs/research/federation_completeness_snapshot.md`.
- Websites/socials research notes: `docs/research/websites_socials_enrichment_batch.md`.
- Beta/prod data readiness audit: `docs/research/beta_readiness_data_audit.md` (live Supabase fill rates, empty federations, events/media holes, RLS blockers, 48h action plan).
- Migration `20260720000031_news_enrichment_batch.sql` ΓÇö **12** published news articles with `/sports/*` featured images (football, rugby, cricket, athletics, netball, hockey, boxing, NNOC, NPC, NSC); backfill images on prior 23 rows. Evidence: `docs/research/news_enrichment_batch.md`. Live: **35** published / **35** with images / **13** federations.

### Changed
- **Gap A12 ΓÇö signup no longer fakes a signed-in state.** `signUp` returns `needsEmailConfirmation` when Supabase creates the account without a session (autoconfirm is off); `/register` then shows a "check your email" panel instead of routing to `/` as if the user were authenticated, and passes `emailRedirectTo` so the confirmation link returns to this site rather than the shared project Site URL. `/login` explains "Email not confirmed" instead of surfacing it raw, and sends an already-authenticated arrival (the confirmation link lands there with a session in the URL) home. The "Continue with Google" buttons are hidden behind `VITE_ENABLE_GOOGLE_AUTH` (default off) because the provider is disabled project-wide ΓÇö enabling it stays an owner decision.
- Public-ready perf: VitePWA `workbox.globPatterns` narrowed to js/css/html/ico/svg/woff2 + `icons/*.png` (no bulk public jpg/png precache); same-origin sport/logo/media images use `runtimeCaching`.
- Ignore + strip `client/public/logos/_candidates/` from git and production builds (research scratch only).
- Public-ready: hide incomplete WhatsApp subscribe + AI chat UI behind feature flags (`VITE_SHOW_WHATSAPP_SUBSCRIBE`, `VITE_SHOW_AI_CHAT`; both default off). See `client/src/lib/features.ts` and `.env.example`.
- `docs/research/beta_readiness_data_audit.md` executive scorecard re-queried live (~58/100): events **215** pub / **44** upcoming / **163** posters (pass 5); logos **51/83**; heroes **83/83**; streams **4** VODs (nav gated); zero-event feds **21**.
- Live DB federations populated from NSC Feb 2025 contact extract.
- Federation abbreviations now unique (85/85); thin ΓÇ£National X federationΓÇ¥ stubs replaced (avg description length ~117).
- Canonical NASFED = `swimming-namibia`; PWFN = `powerlifting-namibia` (duplicate rows soft-merged, slugs retained).
- Public federation directory shows **83/85** active rows; merged slugs still resolve via `getBySlug`.
- Brand colors: 15/85 federations with verified `#RRGGBB` primary/secondary from crests.
- `client/src/data/federations.ts` marked FALLBACK-ONLY (67 vs DB 85).
- Compressed NAWISA and Climbing logos (&lt;400KB / &lt;110KB).

### Removed
- **Gap A21** ΓÇö five runtime dependencies with zero references anywhere in `client/`, `server/`, `shared/`, `scripts/` or `drizzle/`: `@aws-sdk/client-s3` and `@aws-sdk/s3-request-presigner` (leftovers from the storage approach Supabase Storage replaced), `axios`, `dotenv`, `nanoid`. The `overrides.tailwindcss.nanoid` pin stays. 118 packages removed; `check`, `build` and `test` verified after.

### Fixed
- **Public-ready P0 (Home/Events):** hero auto-rotate uses `useEffect` with cleanup (was broken `useState` initializer); replaced broken Unsplash hero URL with `/sports/athletics.jpg`; Home news cards link to `/news/:slug`; High Performance CTA ΓåÆ `#federations`, Athlete Register CTA ΓåÆ `/register`; Events removes dead "Register" buttons and honors `?slug=` with scroll + highlight.
- **Security:** public `athletes.list`, `coaches.list`, `clubs.list` default to `is_active = true`; `search.global` clubs/athletes are active-only. Staff may pass `includeInactive` (admin / federation_admin only); anonymous callers cannot bypass.
- **Security:** `federationAdminMiddleware` uses tRPC v11 `await opts.getRawInput()` (obsolete `rawInput` removed); platform admins bypass tenant check.
- **Security:** closed public draft leaks ΓÇö `news.list` / `events.list` ignore `includeUnpublished` unless admin or federation_admin (own federation); anonymous always published-only.
- **Security:** `/admin` UI + nav/footer Admin links gated on `auth.me` role === `admin`.
- **Security:** `athletes.create` / `coaches.create` require `federationId`; coaches/media/hp update-delete verify resource federation ownership (admin bypass); `upload.image` requires `federationId` for tenant middleware.

- Athletes: repaired stripped slugs, soft-deactivated 9 duplicate rows, moved SeidlerΓåÆswimming and Nambala/ShikongoΓåÆNPC; materialized missing `/venues/*` static assets that previously 404'd.
- Federation heroes: replaced 404 `/sports/*` paths and wrong-sport Unsplash covers (athleticsΓåÆgym, netballΓåÆbasketball, fencingΓåÆbowls) with local sport-correct photos; prefer null over wrong (**11** niche sports left null).
- Events pass 2: removed duplicate WPP/boxing/hockey/triathlon/netball/golf/CAVB slugs; soft-deprecated unverified Welwitschias test 2025-07-15.
- Events: swimming nationals mislinked to skateboarding; fabricated ΓÇ£Bank Windhoek MarathonΓÇ¥ replaced with Vivo Energy Windhoek Marathon 2025; NPFL/netball/WPP4/boxing/NASFED dates corrected; unverified June athletics nationals unpublished.
- Removed placeholder federation emails and `TBA` leadership stubs.
- Nulled broken logo paths; NRU now uses crest instead of sport photo.
- Handball federation email/phone filled from CAHB Zone 6 directory.
- Surfing Namibia email/phone filled from ISA member directory (Rainer Eimbeck).
- **Security:** hardened `sportsplatform_*` RLS ΓÇö removed open `authenticated` INSERT/UPDATE/DELETE; writes now admin / federation-scoped / own WhatsApp only (`20260720000030_harden_sportsplatform_rls.sql`). Also added missing `user_role` enum labels `federation_admin`, `club_manager`.
- **Security:** residual RLS ΓÇö public SELECT limited to published/active/visible rows; staff draft SELECT via admin/federation_admin; `REVOKE INSERT/UPDATE/DELETE/TRUNCATE` on all `sportsplatform_*` from `anon`/`authenticated` (`20260720000034_rls_select_and_revoke_writes.sql`).

### Notes
- Supabase `sportsplatform_logos` still unused (local `/logos` paths consistent).
- Logo coverage **49/83 active**; still null for Karate, Golf, Badminton, Weightlifting/PWFN, Handball, Dance Sport, Horse Racing, Taekwondo, etc. Contact gaps tracked separately by sibling agents.
