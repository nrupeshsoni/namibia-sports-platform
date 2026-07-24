# SEO / AIO readiness + content population gaps

**Date:** 2026-07-24  
**Scope:** `sports.com.na` (Cloudflare Worker SPA + tRPC) · Supabase `rbibqjgsnrueubrvyqps`  
**Verdict:** SEO/AIO = **PARTIAL** (client meta/JSON-LD + sitemap solid; crawl/SSR + daily news pipeline incomplete)

---

## 1. SEO / AIO scorecard

| Area | Score | Notes |
|------|------:|-------|
| Static hub meta (`/`, `/events`, `/news`, `/map`, legal) | 90 | `SeoHead` static routes + `index.html` OG seed |
| Federation routes + tabs | 85 | Dynamic title/description/OG + `SportsOrganization` JSON-LD |
| News articles `/news/:slug` | 85 | `NewsArticle` JSON-LD + article OG type |
| Athletes `/athletes/:slug` | 80 | `Person` JSON-LD; no standalone club SEO routes |
| Events listing `/events` | 75 | Hub meta + `ItemList` of `SportsEvent`; **no** `/events/:slug` page |
| Map `/map` | 80 | Static meta; intentionally no heavy JSON-LD |
| Live `/live` | 70 | Meta present; **omitted from sitemap** (VOD-only inventory) |
| Sitemap + robots | 85 | Build-time `scripts/generate-sitemap.mjs`; refreshed 2026-07-24 |
| Bot / answer-engine crawl | 45 | Client-side head mutation only — many crawlers see shell HTML |
| **Overall SEO/AIO** | **~72 / 100** | Ready for soft public; not “SSR-complete” AIO |

### Route coverage matrix

| Route pattern | SeoHead | JSON-LD | In sitemap |
|---------------|:-------:|:-------:|:----------:|
| `/` | ✅ | WebSite (+ SearchAction*) | ✅ |
| `/events` | ✅ | ItemList / SportsEvent | ✅ |
| `/news` | ✅ | — | ✅ |
| `/news/:slug` | ✅ | NewsArticle | ✅ (published slugs) |
| `/athletes/:slug` | ✅ | Person | ✅ (active slugs) |
| `/map` | ✅ | — | ✅ |
| `/live` | ✅ | — | ❌ (by design) |
| `/federation/:slug` (+ events/clubs/athletes/news/streams) | ✅ | SportsOrganization / Organization | ✅ (home slug only) |
| `/federation/:slug/admin*` | ✅ noindex | — | ❌ |
| `/login`, `/register`, `/admin` | ✅ noindex | — | ❌ |
| `/privacy`, `/terms` | ✅ | — | ✅ |
| Unknown / 404 | ✅ noindex | — | ❌ |
| `/events/:slug` | n/a | n/a | n/a — **route does not exist** |
| `/clubs/:slug` | n/a | n/a | n/a — **route does not exist** |

\*SearchAction targets `/?q={search_term_string}` but Home does not wire `q` to `search.global` — schema claims a search UX that is not implemented on that URL.

### Gaps (SEO/AIO)

1. **No SSR / prerender** — first HTML from Worker Static Assets is the Vite shell; Google often executes JS, many AIO scrapers and social previews do not. OG tags in `index.html` are homepage-only until JS runs.
2. **No per-event detail URL** — event JSON-LD `url` points at `/events` hub, not a canonical event page.
3. **Federation child tabs** share one sitemap URL (`/federation/{slug}`); tab deep links are crawlable but not listed.
4. **Sitemap lag risk** — slug JSONs are committed; must re-run `generate-sitemap` (or `prebuild` with Supabase env) after content inserts. Refreshed this audit: **83** feds / **89** news / **198** athletes (was 79 / 178).
5. **Broken SearchAction** — homepage `?q=` not wired.
6. **Thin entity pages hurt AIO** — empty federation tabs (hidden in UI) still leave shallow org pages for crawlers when description/contact/news are weak.
7. **`news-aggregator` deployed** (2026-07-24) with 6h cron — still draft-only; first productive inserts pending (see `NAMIBIAN_SPORTS_NEWS_SOURCES.md` ops).

---

## 2. Live DB content gaps (active entities)

Snapshot: 2026-07-24 · `is_active` / not merged · published where applicable.

### Totals

| Entity | Count | Notes |
|--------|------:|-------|
| Active federations (directory) | 83 | logos 83/83; descriptions **0** missing |
| Published news | **147** (89 editorial + 58 `agg-*`) | aggregator auto-publish (2026-07-24) |
| Aggregator rows (`slug LIKE 'agg-%'`) | **58** published | auto-publish policy; `source_url`/`source_name`; images enrich on cron |
| Published events | 291 | **41** upcoming · **250** past |
| Active athletes (all slugged) | 198 | photos + achievements present |
| Active clubs | 191 | **129** missing description |
| Media rows | 61 | **67/83** federations have **0** federation-scoped media |
| Venues | 42 | map coverage thin outside major centres |
| Live streams | 4 | VOD/recent coverage, not live |

### Federation-shaped gaps

| Gap | Count (of 83) |
|-----|--------------:|
| Zero published news | 22 |
| Zero athletes | 49 |
| Zero clubs | 41 |
| Zero upcoming events | 58 |
| Zero federation media | 67 |
| Missing email **and** phone | 10 |
| Missing website | 28 |
| Missing email only | 10 |
| Missing phone only | 17 |

**Contact/website empty shell (no email + no phone):** Baseball, Bodybuilding, Lacrosse, Footgolf, Korfball, Orienteering, Padel, Western Mounted Games, Petanque, Softball.

**Zero-news federations (priority fill):** Baseball, Ice Stock, Indigenous Combat, Lacrosse, Full-Contact Martial Arts, Kendo, Korfball, NLAS, Martial Arts umbrella, Modern Pentathlon, NNSSU, Orienteering, Teqball, NUFS, Waterski, Western Mounted Games, NAWISA, Petanque, Roller Sports, Ultimate Frisbee, Speed Hiking, Practical Shooting.

---

## 3. Daily news — what can work today

### Code present

| Piece | Path | Status |
|-------|------|--------|
| Edge Function source | `supabase/functions/news-aggregator/index.ts` | Written |
| RSS sources in code | Verified Phase 1 list — see `NAMIBIAN_SPORTS_NEWS_SOURCES.md` | Wired |
| Claude summarize/tag | Anthropic in function | Requires `ANTHROPIC_API_KEY` |
| Insert target | `sportsplatform_news_articles` | **Auto-publish** trusted sports feeds; Informante drafts |
| Dedup | SHA-256 of source URL → `agg-{hash}` slug | OK |
| Source attribution | `source_url` / `source_name` + footer | SEO JSON-LD author + `isBasedOn` |
| Deployed on project | `rbibqjgsnrueubrvyqps` | **ACTIVE** + `ENABLE_NEWS_AGGREGATOR=true` |
| Cron / `pg_cron` / schedule | Job `invoke-news-aggregator` | **Every 6h** via `pg_net` |
| Design doc | `docs/architecture/SYSTEM_DESIGN.md` | Overstates NBC scrape + WhatsApp notify (not implemented) |

### How daily news CAN work (ordered)

| Option | Effort | Fit | Recommendation |
|--------|--------|-----|----------------|
| **A. RSS auto-publish** (`news-aggregator`) | Low | Trusted sports desks → live with link-out | **Primary daily feed** — kill-switch `ENABLE_NEWS_AGGREGATOR` |
| **B. Manual CMS** (FedAdmin / Platform Admin news CRUD) | Low | High quality, federation-scoped | Federation exclusives / corrections |
| **C. Content Sync AI** (`/admin` → Intelligence) | Low | On-demand Workers AI leads → draft only | Gaps / hollow federations — see `CONTENT_SYNC_AI.md` |
| **D. Full scrape (NBC etc.)** | High | Fragile; copyright/ToS risk | Defer |

**Recommended operating model (today → 30 days):**

1. **Now:** Manual CMS for verified stories + Content Sync AI for draft leads on hollow federations (Big-8 + 22 zero-news). Never auto-publish AI/RSS drafts.
2. **Aggregator:** Deployed + 6h cron (2026-07-24). Keep `is_published: false`; admin reviews in CMS (`/admin` → News).
3. Content Sync and the Edge Function are complementary: Sync = on-demand research; aggregator = passive RSS intake.
4. Wire WhatsApp notify only after WhatsApp product flag is on (`WHATSAPP_API_ENABLED`).

---

## 4. Population priority matrix

| Priority | Workstream | Why | Target |
|:--------:|------------|-----|--------|
| P0 | Contact + website for 10 hollow + 28 missing websites | Directory trust / AIO org cards | Complete Big-8 first, then hollow 10 |
| P0 | News for 22 zero-news federations | Empty News tabs / thin AIO | ≥1 evergreen article each |
| P0 | Upcoming events for Big-8 + calendar sports | Hub freshness | Keep ≥3 upcoming on NFA/NRU/Cricket/Athletics |
| P1 | Athletes for 49 zero-athlete feds | Profile SEO already works | 2–5 named athletes on mid-tier sports |
| P1 | Clubs for 41 zero-club feds | Map + federation Clubs tab | 1–3 clubs where public sources exist |
| P1 | Club descriptions (129 blank) | Listing quality | Top clubs per Big-8 |
| P2 | Federation media (67 empty) | Visual AIO / social | 2–4 assets per fed with events |
| P2 | Event detail routes + sitemap event URLs | Deep SEO | Product change, not just content |
| P2 | Prerender/SSR or edge HTML meta | True AIO | Architecture follow-up |
| P3 | ~~Deploy news-aggregator + cron~~ **done** | Daily volume | Draft queue; monitor inserts |
| P3 | Fix SearchAction → real search URL | Schema honesty | `/` search or dedicated `/search?q=` |

---

## 5. Top 10 content gaps (actionable)

1. **22 federations with zero published news** — largest content/AIO hole after directory shell.
2. **58 federations with zero upcoming events** — calendar looks stale outside big sports.
3. **49 federations with zero athletes** — athlete SEO inventory concentrated in football/rugby/cricket/etc.
4. **41 federations with zero clubs** — hollow Clubs tabs.
5. **67 federations with zero media** — only 61 media rows platform-wide.
6. **28 federations missing website** (+ 10 with no email/phone at all).
7. **129/191 clubs lack descriptions** — directory depth weak.
8. **Sitemap was stale** (−10 news, −20 athletes vs DB) — process gap; refreshed in this pass.
9. ~~News aggregator 0 drafts~~ — fixed (retired Claude model); **58** `agg-*` drafts as of 2026-07-24; human publish from Admin News.
10. **No event/club detail routes** — cannot rank or cite individual events/clubs as first-class URLs.

---

## 6. Quick wins shipped with this audit

- Unknown / unmatched routes → `noindex,nofollow` in `SeoHead` (was default indexable homepage copy).
- Sitemap slug JSONs + `client/public/sitemap.xml` refreshed from live DB (**83 / 89 / 198**).

---

## 7. Return summary

| Question | Answer |
|----------|--------|
| SEO ready? | **Partial** |
| Top content gaps | See §5 |
| Daily news path | **Manual CMS + Content Sync AI** + deployed `news-aggregator` 6h cron (draft intake); **never auto-publish** |

**Rules applied:** search-first / reuse-first · docs as deliverable · smallest safe SEO fixes · no secrets committed.
