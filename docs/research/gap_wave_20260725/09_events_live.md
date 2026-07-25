# Gap Analysis — Events / Schedules / Live Streams

**Wave:** `gap_wave_20260725` · **Doc:** `09_events_live.md`  
**Date:** 2026-07-25  
**Workspace:** `C:\Projects\The Dome\namibia-sports-platform`  
**DB:** Supabase `rbibqjgsnrueubrvyqps` (live SQL via MCP)  
**Scope:** National + federation calendars, posters, upcoming skew, stream VODs, Live nav gating, missing event detail routes.  
**Method:** Static code audit + live inventory SQL. No DB mutations.

**Rules applied:** SEARCH FIRST / NO ASSUMPTIONS / documentation deliverable.

---

## 1. Executive verdict

| Surface | Grade | One-line |
|---------|:-----:|----------|
| National `/events` list UX | **B** | Usable calendar; rich cards; **no detail destination** |
| Upcoming calendar freshness | **C+** | **40** upcoming vs **251** past; **58/83** feds with none |
| Event posters | **A−** | Upcoming **40/40 (100%)**; overall **238/291 (82%)** |
| Federation Events tabs | **B−** | Always visible; description snippet; still no deep link |
| Live `/live` honesty | **A** | Nav gated; route = Recent Coverage when VOD-only |
| Live inventory (true live) | **D** | **0** live / **0** scheduled / **4** past VODs |
| Event SEO / share URLs | **D+** | Hub-only JSON-LD; no `/events/:slug`; sitemap has hub only |
| Schedules as product | **D** | Flat `events` rows only — no fixtures, rounds, or series |

**Launch stance:** Soft / invite beta can keep `/events` as a national fixture list. Do **not** market “live streams” until ≥1 verified `is_live` or future `scheduled_start` row exists (nav already honest). Highest product gap is **no event detail route** — every deep link dies on a highlighted list card.

---

## 2. Live inventory snapshot (2026-07-25)

### 2.1 Events

| Metric | Count |
|--------|------:|
| Total rows | 293 |
| Published | 291 |
| Upcoming (`start_date >= now()`) | **40** |
| Past published | 251 |
| With `poster_url` | 238 (**82%**) |
| Upcoming with poster | **40 / 40 (100%)** |
| Past missing poster | 53 |
| Poster source | **238 local paths** (`/sports/…`); **0** external HTTP; **0** Supabase Storage URLs |
| With non-empty description | 233 / 291 |
| Upcoming missing description | 9 |
| With `venue_id` FK | 8 (upcoming: **0**) |
| Distinct feds with ≥1 published event | **66 / 83** |
| Distinct feds with ≥1 upcoming | **25 / 83** |
| Active feds with **zero** published events | **18** |
| Active feds with **no upcoming** | **58** |

**Type mix (published / upcoming):** competition 197 / 29 · tournament 85 / 10 · workshop 4 / 0 · training 3 / 1 · other 2 / 0 · meeting 0 / 0

### 2.2 Flagship / Big-8 calendars

| Slug | Published | Upcoming | Latest start |
|------|----------:|---------:|--------------|
| `athletics-namibia` | 22 | **4** | 2026-10-03 |
| `nfa` | 14 | **3** | 2027-03-22 |
| `cricket-namibia` | 25 | **2** | 2026-07-31 |
| `namibia-basketball` | 8 | **1** | 2026-07-29 |
| `nru` | 7 | **1** | 2026-08-20 |
| `nnoc` | 2 | **1** | 2026-10-31 |
| `nhu` (Hockey) | 10 | **0** | 2026-07-24 (rolled past) |
| `swimming-namibia` (NASFED) | 8 | **0** | 2026-07-23 (rolled past) |

**Skew signal:** Content enrichment succeeded on volume (≈291 published), but the **forward calendar is thin and rolling off**. NHU + NASFED already lost upcoming coverage since earlier audits (~50 upcoming on 2026-07-21 → **40** today).

### 2.3 Zero-event active federations (18)

`badminton-namibia`, `baseball-namibia`, `lacrosse-namibia`, `namibia-kendo`, `namibia-korfball`, `namibia-martial-arts`, `namibia-modern-pentathlon`, `namibia-mountaineering`, `namibia-muaythai`, `namibia-orienteering`, `namibia-practical-shooting`, `namibia-speed-hiking`, `namibia-teqball`, `nufs`, `nawisa`, `petanque-namibia`, `roller-sports-namibia`, `softball-namibia`

(Unchanged research ceiling vs Pass 7 / Batch C — no day-level public fixtures found.)

### 2.4 Live streams

| Metric | Count |
|--------|------:|
| Total rows | **4** |
| `is_live = true` | **0** |
| Future `scheduled_start` | **0** |
| Past / VOD (not live, start ≤ now or null) | **4** |
| With thumbnail | 4 / 4 |
| With embed URL | 4 / 4 |

Seed: migration `supabase/migrations/20260720000032_live_streams_seed_verified.sql` — NFA, NRU, Cricket Namibia, NASFED YouTube VODs (oEmbed-verified). Media pass `docs/research/media_enrichment_batch.md` found **no** verified future premiere/live URLs.

---

## 3. Architecture map (what exists)

### 3.1 Schema (`drizzle/schema.ts`)

**`sportsplatform_events`** — name, slug (unique), description, `poster_url`, `federation_id`, `venue_id`, type enum, start/end, registration deadline, location, region, participant counters, `is_published`.

**`sportsplatform_live_streams`** — title, `federation_id`, platform enum, stream/embed/thumbnail URLs, scheduled start/end, `is_live`, `viewer_count`.  
**No:** `description` column, `event_id` FK, status/VOD enum, archive flag, slug.

### 3.2 API

| Router | Procedures | Notes |
|--------|------------|-------|
| `server/routers/events.ts` | `list`, `getById`, `create`, `update`, `delete` | `list` supports `upcoming`, region, search, `includeUnpublished` (staff-gated). **No `getBySlug`.** |
| `server/routers/streams.ts` | `list`, `getById`, `create`, `update`, `setLive`, `delete` | Filter by `isLive` / `federationId`. Hard delete only. |
| `server/routers/search.ts` | `global` includes events by name | Client navigates to `/events?slug=` — not a detail page |

Auth: mutations use `federationAdminProcedure` + `assertSameFederation` / ownership asserts (A6 pattern). Public list hides unpublished unless staff scope allows.

### 3.3 Routes (`client/src/App.tsx`)

| Path | Page | Detail? |
|------|------|:-------:|
| `/events` | `Events.tsx` | **No** — list only |
| `/events/:slug` | — | **Missing** |
| `/federation/:slug/events` | `FederationEvents.tsx` | **No** |
| `/live` | `Live.tsx` | Modal / external watch — no `/live/:id` |
| `/federation/:slug/streams` | `FederationStreams.tsx` | Same pattern |
| `/news/:slug`, `/athletes/:slug` | Detail exists | Contrast |

### 3.4 Admin

- Platform Admin: Events CRUD via `EventForm`; Streams via scoped `FedAdminStreams`.
- Fed Admin: `FedAdminEvents`, `FedAdminStreams` (incl. `setLive`).
- `EventForm`: poster `ImageUpload` **only in edit mode** — create cannot attach a poster until after save.
- Creates default `isPublished: false` until toggled.

---

## 4. Gap deep-dives

### 4.1 No event detail routes (P0 product / SEO)

**Evidence**

- `App.tsx`: only `/events`; no `/events/:slug`.
- `Events.tsx` `EventCard`: plain `motion.div` — **not wrapped in `Link`**, no `onClick` navigation.
- Deep links from Home / Map / Search use `/events?slug=…` → scroll + highlight (`id={`event-${slug}`}`).
- Federation Home event tiles link to **list** `/federation/${slug}/events`, not a specific event.
- `events.getById` exists server-side but **no public page consumes it**.
- SEO (`client/src/lib/seo.ts` `buildSportsEventJsonLd`): every item `url` is `${SITE_ORIGIN}/events` (hub), never a per-event URL.
- Prior audit already flagged this: `docs/research/SEO_AIO_AND_CONTENT_GAPS.md` §4 P2 / §5 #10.

**Impact**

- Cannot share / bookmark / rank a single fixture.
- Descriptions, registration deadline, venue FK, max participants are largely stranded (Fed list shows 2-line description; national list shows almost none).
- AIO/crawlers see an ItemList pointing at one hub URL.

**Fix direction (not implemented here)**

1. Add `events.getBySlug` (mirror news/athletes).
2. Add `/events/:slug` (+ optional `/federation/:slug/events/:eventSlug`).
3. Wire cards + search + Home + Map + JSON-LD + sitemap event URLs.
4. Keep `?slug=` as redirect/compat if desired.

---

### 4.2 Posters

| Aspect | Status |
|--------|--------|
| Upcoming poster coverage | **Complete** (40/40) |
| Overall poster coverage | **82%** — gap is almost entirely **past** events (53 null) |
| Storage vs local | All posters are **committed static paths** under `/sports/…` (Worker assets). Admin upload path exists (`ImageUpload` → event entity / `_event_posters` bucket per security docs) but live inventory shows **0** Storage URLs. |
| Fallback UX | National `Events.tsx` / Home use **Unsplash type stock** when `posterUrl` null — looks “designed” but not federation-authentic. |
| Fed Events | `EventPoster` with broken-image → gradient initial (better than silent Unsplash). |
| Create flow | Poster upload **edit-only** → new events often ship without poster until a second edit. |

**Residual work:** backfill past posters (P2 cosmetics); allow poster on create; prefer Storage or local sport art over Unsplash for nulls on public beta.

---

### 4.3 Upcoming skew

**Data skew**

- Published corpus is **~86% past** (251 / 291).
- Only **25/83** federations have a forward date; **58** have none.
- Big-8 hole reopened on **NHU** and **NASFED** (0 upcoming as of audit day).
- Next fixtures sample (live): Cricket CWC League 2, Boxing clinic, KBA midweek, NCSF women’s, Davis Cup, Red Run, etc. — still a viable national teaser strip.

**Code / query skew**

| Client | Query | Effect |
|--------|-------|--------|
| Home | `events.list({ upcoming: true, limit: 8 })` | Correct — server `gte(startDate, now)` + `asc` |
| Map | `upcoming: true` | Correct |
| `/events` | `events.list({ limit: 200 })` **without** `upcoming` | Server orders `desc(startDate)` then limit 200; client tabs filter. All 40 upcoming fit; **past tab truncates** older history (~91 past rows never fetched). |
| Fed Events | `federationId` + client upcoming/past tabs | Same pattern at fed scale (usually &lt;200) |

**Product skew**

- Default tab on `/events` is **Upcoming** (good honesty).
- Empty upcoming → soft copy + past available — OK.
- No recurring schedule / season model → when a league weekend rolls past, the federation goes “hollow” until the next research insert.

**Fix direction:** continuous fixture pipeline (or fed-admin self-serve calendar); re-seed NHU + NASFED soon; consider server `upcoming` + separate past pagination; raise / paginate past list.

---

### 4.4 Streams = VODs only (Recent Coverage)

**Behaviour (honest, intentional)**

- `Live.tsx` partitions: LIVE NOW (`isLive`) → Scheduled (future `scheduledStart`) → Recent (everything else).
- With current inventory: hero title **“RECENT COVERAGE”**; soft empty copy when nothing live/scheduled; 4 VOD cards open embed modal.
- Federation Streams page mirrors the same partition + empty states linking to `/events`.
- Schema treats VODs as ordinary rows with past `scheduled_start` + `is_live=false` — **no first-class `vod` / `status`**.

**Gaps**

| Gap | Severity | Detail |
|-----|----------|--------|
| No true live / scheduled inventory | **High (content)** | Cannot promote Live product |
| No `event_id` link | Medium | Streams orphaned from fixtures |
| UI `description` on `StreamItem` | Low | **Column does not exist** on `sportsplatform_live_streams` — dead type field |
| `viewerCount` | Low | Manual / reset on `setLive`; no platform sync |
| No stream slug / detail URL | Low | Modal-only; OK for beta |
| Hard delete only | Low | No archive; VODs deleted forever |
| Platform Admin streams | OK | Fed-scoped CRUD + `setLive` |

---

### 4.5 Live nav gating (working as designed)

**Mechanism**

- `client/src/hooks/useShowLiveNav.ts`: show Live iff any stream `isLive` **or** `scheduledStart > now`.
- Explicitly: **VODs alone do not promote Live**.
- While loading → hide (avoids flash).
- Override: `VITE_SHOW_LIVE_NAV=true` via `isLiveNavForced()` (`client/src/lib/features.ts`).

**Consumers:** `Home.tsx` desktop links, `NavDrawer.tsx`, `MobileBottomNav.tsx`.

**Route vs nav**

- `/live` **always routable** (direct URL, bookmarks).
- Sitemap: `scripts/generate-sitemap.mjs` **omits `/live`** while inventory is VOD-only (commented by design).
- Fed public tabs: Streams gated by inventory (`federationPublicTabs`); **Events tab always shown** even when empty.

**Verdict:** Gating is correct for beta honesty. Do not force-show nav without a real scheduled/live row.

---

### 4.6 “Schedules” product gap

There is **no** schedule / fixture / competition tree:

- No rounds, venues per match, home/away, results, or ICS export.
- `registrationDeadline` / participant counts exist in schema; national cards only surface deadline countdown (≤7 days); no register CTA.
- `venueId` almost unused on upcoming rows → Map↔event join is weak for future fixtures.

National “schedule” today = **flat published events sorted by date**.

---

## 5. User-flow matrix

| Flow | Status | Gap |
|------|--------|-----|
| Home → Upcoming strip → `/events?slug=` | Partial | Highlights card; **no detail** |
| `/events` browse / filter / upcoming·past | Usable | Past truncated by limit 200; no detail |
| Search → event | Partial | Lands on list highlight |
| Map region → event | Partial | Same `?slug=` pattern |
| Fed Home → events | Usable | List only |
| Share event URL | **Broken** | No canonical detail URL |
| Nav → Live (current DB) | Hidden | Correct |
| Direct `/live` | Usable | Recent Coverage VODs |
| Fed Streams (4 feds with rows) | Usable | VOD watch |
| Admin create event + poster | Awkward | Poster after create only |
| Admin go-live stream | Ready | Needs real URL + `setLive` / future schedule |

---

## 6. Severity-ranked gaps

| ID | Gap | Sev | Type | Evidence |
|----|-----|-----|------|----------|
| E1 | No `/events/:slug` (or fed equivalent); cards not links | **P0** | Product / SEO | `App.tsx`, `Events.tsx`, SEO JSON-LD hub URLs |
| E2 | Upcoming calendar thin + rolling off (40; NHU/NASFED 0) | **P0** | Content | Live SQL 2026-07-25 |
| E3 | 58 feds with no upcoming; 18 with zero events | **P1** | Content | Live SQL; research ceiling |
| E4 | 0 live / 0 scheduled streams (4 VODs) | **P1** | Content / product | `live_streams` + media batch |
| E5 | No `events.getBySlug`; detail API underused | **P1** | API | `events.ts` |
| E6 | `/events` list limit truncates past history | **P2** | API / UX | `list` limit 200 + client filter |
| E7 | Past-event poster holes (53); Unsplash fallbacks | **P2** | Content / UX | SQL + `TYPE_IMAGES` |
| E8 | Poster upload create-mode missing | **P2** | Admin UX | `EventForm.tsx` |
| E9 | Streams not linked to events; no VOD status | **P2** | Schema | `live_streams` columns |
| E10 | Stream `description` typed in UI, absent in DB | **P3** | Hygiene | Live.tsx vs `information_schema` |
| E11 | `venue_id` unused on upcoming; register fields unused | **P3** | Product depth | SQL + cards |
| E12 | Live nav force-flag risk if mis-set in prod | **P3** | Ops | `VITE_SHOW_LIVE_NAV` |

---

## 7. What is already good (do not “fix”)

1. **Live nav inventory gate** + Recent Coverage copy — beta honesty.
2. **Upcoming poster completeness** after enrichment passes.
3. **Empty states** on national Live / Fed Events / Fed Streams.
4. **Tenant checks** on event/stream mutations + unpublished list gate.
5. **Sitemap omission of `/live`** while VOD-only.
6. **Fed Streams tab hide-when-empty** (Events stay visible by design).
7. Verified VOD seed (real YouTube URLs + embeds + local thumbs).

---

## 8. Recommended next actions

### P0 (this wave)

1. **Event detail route** — `getBySlug` + `/events/:slug` page (description, poster, dates, location, federation link, optional venue); wire all entry points; JSON-LD per-event `url`; sitemap event slugs.
2. **Forward calendar refresh** — re-hunt NHU + NASFED + other majors that rolled past; keep Home strip ≥5 real upcoming with posters.

### P1

3. Seed **≥1 verified scheduled** stream (premiere/live URL + future `scheduled_start`) **or** keep Live nav gated indefinitely.
4. Pagination / split queries for past vs upcoming on `/events`.
5. Allow poster on **create** in `EventForm`.

### P2 / later

6. Optional `event_id` on streams; optional `status` enum (`scheduled` \| `live` \| `ended` \| `vod`).
7. Past poster backfill; retire Unsplash fallbacks for published nulls (use sport local art).
8. Fixture/results model only if product commits beyond flat calendar.
9. Drop or implement stream `description` (schema + form).

---

## 9. Scorecard (domain only)

| Dimension | Score /10 | Notes |
|-----------|----------:|-------|
| Event coverage breadth | 6 | 66/83 feds have history; 18 zeros remain |
| Upcoming freshness | 5 | 40 upcoming; Big-8 uneven; 58 feds empty forward |
| Posters | 8 | Upcoming perfect; past patchy; all local assets |
| Event detail / share | 2 | List + `?slug=` only |
| Live honesty (UX) | 9 | Gate + Recent Coverage |
| Live inventory | 2 | VOD-only |
| Schedules depth | 2 | Flat events |
| Admin operability | 7 | CRUD + setLive; poster-on-create gap |

**Domain composite: ~5.1 / 10** — calendar list is beta-viable; detail routes + forward fixtures + real live/scheduled streams are the unlock for “schedules & live” as a marketed pillar.

---

## 10. Source index

| Source | Path / query |
|--------|----------------|
| Schema | `drizzle/schema.ts` (`events`, `liveStreams`) |
| Routers | `server/routers/events.ts`, `streams.ts`, `search.ts` |
| Pages | `client/src/pages/Events.tsx`, `Live.tsx`, `federation/FederationEvents.tsx`, `FederationStreams.tsx`, `Home.tsx` |
| Nav gate | `client/src/hooks/useShowLiveNav.ts`, `client/src/lib/features.ts` |
| Fed tab gate | `client/src/lib/federationPublicTabs.ts` |
| SEO | `client/src/lib/seo.ts`, `client/src/components/SeoHead.tsx`, `scripts/generate-sitemap.mjs` |
| Seed | `supabase/migrations/20260720000032_live_streams_seed_verified.sql` |
| Prior audits | `docs/research/beta_readiness_data_audit.md`, `full_gap_analysis_data.md`, `SEO_AIO_AND_CONTENT_GAPS.md`, `events_enrichment_batch.md`, `media_enrichment_batch.md` |
| Live SQL | 2026-07-25 MCP `execute_sql` on `rbibqjgsnrueubrvyqps` |

---

*End of gap wave 09 — Events / Schedules / Live Streams.*
