# Gap analysis — SEO / AIO

**Date:** 2026-07-25  
**Wave:** `gap_wave_20260725`  
**Scope:** `sports.com.na` — Cloudflare Worker SPA (`server/worker.ts` + Vite static assets) · client SEO (`SeoHead`, `client/src/lib/seo.ts`) · sitemap / robots · structured data · entity URL coverage  
**Related prior art:** `docs/research/SEO_AIO_AND_CONTENT_GAPS.md` (2026-07-24) — this wave re-audits code paths and elevates a **critical crawl bug** on athlete URLs.

**Verdict:** SEO/AIO = **PARTIAL** — hub + federation + news meta/JSON-LD and sitemap inventory are real; **no SSR**, broken **SearchAction**, **no event/club detail URLs**. **P0 athlete Worker 404 fixed** (2026-07-25): `/athletes/:slug` full-document fetches now get SPA `index.html` (extension-aware static rule, parity with `/news/*`).

**Score estimate: 65 / 100** (was 58; +athlete crawl after Worker fix; SearchAction + SSR still open)

---

## 1. Scorecard (this wave)

| Area | Score | Evidence |
|------|------:|----------|
| Static hub meta (`/`, `/events`, `/news`, `/map`, legal) | 88 | `SeoHead` `STATIC_ROUTES` + `index.html` OG seed |
| Federation routes + tabs | 78 | Dynamic title/OG + `SportsOrganization`/`Organization`; tab deep links not in sitemap; soft-404 still indexable while/`when` null |
| News `/news/:slug` | 80 | `NewsArticle` JSON-LD + `og:type=article`; modal UX on hub; no `article:*` / `dateModified` OG |
| Athletes `/athletes/:slug` | **70** | Client SEO + sitemap; Worker now extension-aware (slug → SPA shell). Still no SSR → bots see homepage seed meta |
| Events listing `/events` | 58 | Hub meta + `ItemList`/`SportsEvent`; every event `url` → `/events`; deep link is `?slug=` only |
| Clubs / venues | 20 | Slugs in DB; **no** public detail routes / SEO / sitemap entries |
| Map `/map` | 75 | Static meta; no Place/ItemList JSON-LD (acceptable) |
| Live `/live` | 68 | Meta present; omitted from sitemap (intentional, VOD-only) |
| Sitemap + robots | 78 | 434 URLs (6 hubs + 83 feds + 147 news + 198 athletes); **no `lastmod`**; robots allow-all; athlete URLs no longer hard-404 |
| Canonicals (client) | 82 | `link[rel=canonical]` via `applySeo`; path-based; query stripped in `SeoHead` |
| Open Graph / Twitter | 70 | Full set mutated client-side; first HTML is homepage seed only |
| noindex coverage | 72 | Admin / login / register / unknown routes; **missing** for unresolved entity slugs |
| SearchAction / AIO search | 18 | Declared on homepage; **`/?q=` not implemented** (palette is Cmd+K only) |
| Bot / answer-engine crawl (SSR) | 35 | Client-only head + JSON-LD; many scrapers never run JS |
| **Overall SEO/AIO** | **65** | Soft-public hubs OK; athlete docs crawlable (shell); AIO incomplete without SSR |

---

## 2. Architecture snapshot

| Layer | What exists | Crawl implication |
|-------|-------------|-------------------|
| First HTML | `client/index.html` — homepage title/description/OG/Twitter only | Non-JS bots see **homepage** meta for every SPA URL |
| Runtime SEO | `SeoHead` in `App.tsx` mutates `document.title`, meta, canonical, JSON-LD after React + tRPC | Google generally OK; LinkedIn/Slack/many AIO scrapers **miss** entity tags |
| Delivery | Worker Static Assets, `not_found_handling: single-page-application` | Unknown app paths → **HTTP 200** + shell (soft 404) unless Worker short-circuits |
| Sitemap | Build-time `scripts/generate-sitemap.mjs` (`prebuild`) from `scripts/data/*-slugs.json` | Optional live Supabase REST refresh when env present |
| robots | `client/public/robots.txt` — `Allow: /` + sitemap URL | No `Disallow` for `/admin`, `/login`, `/register` |

**Committed inventory (2026-07-25 read):**

| Source | Count |
|--------|------:|
| `scripts/data/federation-slugs.json` | 83 |
| `scripts/data/news-slugs.json` | 147 |
| `scripts/data/athlete-slugs.json` | 198 |
| `client/public/sitemap.xml` `<loc>` entries | **434** |

---

## 3. Route coverage matrix

| Route pattern | SeoHead | JSON-LD | Sitemap | Full document fetch | Notes |
|---------------|:-------:|:-------:|:-------:|:-------------------:|-------|
| `/` | ✅ | `WebSite` + `SearchAction*` | ✅ | ✅ shell | SearchAction target unwired |
| `/events` | ✅ | `ItemList` → `SportsEvent` | ✅ | ✅ | Event `url` always hub |
| `/events?slug=` | same as hub | same | ❌ | ✅ | In-page highlight only — not a canonical entity URL |
| `/news` | ✅ | — | ✅ | ✅ | No CollectionPage / ItemList |
| `/news/:slug` | ✅ | `NewsArticle` | ✅ published | ✅ SPA (Worker extension-aware) | Detail = modal over listing |
| `/athletes/:slug` | ✅ (if JS runs) | `Person` | ✅ active | ✅ SPA shell (200 HTML) | **Fixed** 2026-07-25 — see §4.1 |
| `/federation/:slug` (+ tabs) | ✅ | Org / SportsOrg | ✅ home only | ✅ | Tabs crawlable, not listed |
| `/federation/:slug/admin*` | ✅ noindex | — | ❌ | ✅ | OK |
| `/login`, `/register`, `/admin` | ✅ noindex | — | ❌ | ✅ | OK |
| `/privacy`, `/terms` | ✅ | — | ✅ | ✅ | OK |
| `/live` | ✅ | — | ❌ by design | ✅ | Honest VOD copy |
| `/map` | ✅ | — | ✅ | ✅ | OK |
| Unknown / `/404` | ✅ noindex | — | ❌ | **200** shell | Soft 404 HTTP status |
| `/events/:slug` | n/a | n/a | n/a | n/a | **Route does not exist** |
| `/clubs/:slug` | n/a | n/a | n/a | n/a | **Route does not exist** (club slug in DB) |
| `/venues/:slug` | n/a | n/a | n/a | n/a | **Route does not exist** |

\*SearchAction → `https://sports.com.na/?q={search_term_string}` — Home does not read `q`; `SearchCommandPalette` uses Cmd/Ctrl+K + `search.global` only.

---

## 4. Top gaps (ordered)

### P0 — Crawl / correctness

1. **Athlete SPA vs asset 404 — FIXED (2026-07-25)**  
   - Was: `ASSET_ONLY_PREFIXES` included `"/athletes/"` with no file-extension exception; `fetchStaticAsset` turned SPA HTML into plain-text 404.  
   - Fix: `STATIC_ASSET_PREFIXES` (`/sports|/logos|/athletes|/venues|/news`) only when `STATIC_FILE_EXT` matches; slug routes fall through to SPA `index.html`.  
   - Verify: `curl -I https://sports.com.na/athletes/<slug>` → **200** + `text/html`. Image paths like `/athletes/vera-looser.jpg` still real-404 when missing.

2. **No SSR / prerender / edge HTML injection**  
   - Entity OG + JSON-LD never appear in first byte.  
   - Blocks reliable AIO citation and most unfurlers for federation/news (athletes already 404).  
   - Options: Cloudflare HTMLRewriter on bot UA, build-time prerender for sitemap URLs, or Workers SSR for `/federation|/news|/athletes`.

3. **Broken SearchAction**  
   - Schema claims site search at `/?q=`.  
   - No reader on Home; answer engines / Google may treat as invalid.  
   - Fix: wire `q` → open palette / dedicated `/search?q=` **or** remove `potentialAction` until real.

### P1 — Entity URL / structured data depth

4. **No event detail URLs**  
   - ~291 published events; deep link is `/events?slug=` (not in sitemap).  
   - JSON-LD `SportsEvent.url` → `https://sports.com.na/events` for all items (duplicate canonical signal).  
   - Need `/events/:slug` (or hash that is not enough for SEO) + sitemap + per-event JSON-LD.

5. **No club (or venue) public SEO surfaces**  
   - Clubs have unique slugs; search navigates to federation `/clubs` tab.  
   - Misses local “club name Namibia” queries and AIO entity cards.

6. **Sitemap quality gaps**  
   - No `<lastmod>` (or news sitemap / image sitemap).  
   - Lag risk if CI `prebuild` runs without Supabase env (committed JSON only).  
   - 198 athlete URLs currently **harm** crawl budget until P0 #1 fixed.  
   - Federation child tabs and events omitted.

7. **Soft-404 indexation**  
   - Unknown federation/news/athlete slug: while/`when` `data` is null, `SeoHead` applies **indexable** placeholder titles (`Federation` / `News` / `Athlete`) without `noIndex`.  
   - Loading and not-found are conflated.  
   - SPA unknown paths: client `noindex` after JS, but HTTP **200**.

### P2 — Meta / AIO polish

8. **Open Graph incompleteness**  
   - Present: `og:type|site_name|title|description|url|image`, Twitter `summary_large_image`.  
   - Missing: `og:locale`, `og:image:alt|width|height`, article `article:published_time` / `article:modified_time` / `article:section`, `twitter:site`.  
   - News JSON-LD has `datePublished` but not `dateModified`.

9. **robots.txt under-specified**  
   - No `Disallow: /admin`, `/login`, `/register`, federation admin paths (rely on meta robots after JS).  
   - Fine for Google-with-JS; weak for naive bots.

10. **Thin / hollow entity pages (content × SEO)**  
    - Prior content audit still applies: many federations with zero news/athletes/clubs/upcoming events → org pages rank but answer poorly.  
    - Aggregator `agg-*` slugs in sitemap (147 news) help volume; quality/AIO trust varies.

11. **No BreadcrumbList / WebPage / speakable / FAQ**  
    - Federation tabs and news lack breadcrumb JSON-LD.  
    - No `llms.txt` / site-level machine summary for answer engines.

12. **News hub JSON-LD absent**  
    - `/news` has meta only; no `CollectionPage` / `ItemList` of recent headlines.

13. **No SEO unit tests**  
    - No `seo*.test.*` for SearchAction target, noindex matrix, or Worker athlete/news path rules.

### P3 — Nice-to-have

14. **RSS/Atom** for published news (syndication + some AIO ingest).  
15. **hreflang** — single locale `en` / Namibia; optional `en-NA` later.  
16. **Image sitemap** for federation logos / news featured images.  
17. **Canonical consolidation** for federation tabs (optional `rel=canonical` → federation home) if tab content is thin duplicates.

---

## 5. Component deep-dive

### 5.1 `SeoHead` (`client/src/components/SeoHead.tsx`)

**Strengths**

- Central route awareness via Wouter `useLocation` (query stripped).  
- Static hubs + auth/admin noindex + unknown-route noindex.  
- Hydrates federation / news / athlete from tRPC; events list feeds ItemList.  
- Federation tab labels in title (`Events`, `Clubs`, …).  
- Federation admin forced `noIndex`.

**Gaps**

- Null entity data → indexable placeholders (see P1 #7).  
- No JSON-LD on `/news`, `/map`, `/live`, legal.  
- Depends entirely on client execution after paint.

### 5.2 `seo.ts` helpers

| Builder | Status |
|---------|--------|
| `applySeo` | Title suffix `\| sports.com.na`; robots; OG; Twitter; canonical |
| `buildWebSiteJsonLd` | OK structure; **SearchAction dishonest** |
| `buildFederationJsonLd` | `sameAs`, `areaServed` Namibia, parent org — solid |
| `buildNewsArticleJsonLd` | Author from `sourceName`; `isBasedOn` / `citation` — good for aggregated news |
| `buildSportsEventJsonLd` | Cap 12; **shared hub URL** — weak |
| `buildAthleteJsonLd` | `Person` + `memberOf` — unused by crawlers until Worker fix |

### 5.3 Sitemap generator

- Static hubs: `/`, `/events`, `/news`, `/map`, `/privacy`, `/terms` (`/live` omitted).  
- Dynamic: federations weekly 0.8, news weekly 0.6, athletes monthly 0.5.  
- Escapes XML; aborts if zero federation slugs.  
- **Missing:** events, clubs, `lastmod`, image/news sitemap extensions, federation tab URLs.

### 5.4 robots.txt

```
User-agent: *
Allow: /

Sitemap: https://sports.com.na/sitemap.xml
```

Minimal and correct for allow-crawl; does not protect auth surfaces or signal AI scrapers.

### 5.5 SSR absence

Confirmed: Vite SPA shell only; Worker does not inject per-route meta. `run_worker_first` is for API + static-asset 404 hardening, not SEO rendering.

---

## 6. Entity coverage summary

| Entity | Public URL | SEO head | JSON-LD | In sitemap | Blocker |
|--------|------------|----------|---------|------------|---------|
| Federations (83 active) | `/federation/:slug` | ✅ | Org | ✅ | Thin content on many; tabs not listed |
| News (147 published) | `/news/:slug` | ✅ | NewsArticle | ✅ | SSR; modal UX; `agg-*` quality mix |
| Athletes (198 active) | `/athletes/:slug` | ✅ in JS | Person | ✅ | Shell OK; no SSR meta |
| Events (~291) | hub + `?slug=` | hub only | ItemList → hub URL | ❌ | No detail route |
| Clubs (~191) | federation tab | via fed page | — | ❌ | No detail route |
| Venues | map / lists | map meta | — | ❌ | No detail route |
| Streams / Live | `/live` | ✅ | — | ❌ | Inventory honesty |

---

## 7. Priority fix backlog (SEO/AIO only)

| Pri | Action | Impact |
|:---:|--------|--------|
| ~~P0~~ | ~~Fix Worker `/athletes/*` extension-aware static rule~~ | **Done** 2026-07-25 |
| ~~P0~~ | ~~verify `curl -I …/athletes/<slug>` → 200 HTML~~ | Confirm post-deploy |
| P0 | Wire or remove SearchAction | Schema honesty (still open) |
| P1 | Prerender or bot HTMLRewriter for sitemap URLs | Real AIO / unfurl |
| P1 | `/events/:slug` + sitemap + fix SportsEvent `url` | Event SEO |
| P1 | `noIndex` when entity query settled + null; prefer HTTP 404 for unknown slugs | Soft-404 hygiene |
| P1 | Sitemap `lastmod` + ensure CI has Supabase env for slug refresh | Freshness |
| P2 | `article:*` OG + `dateModified` JSON-LD | News richness |
| P2 | robots `Disallow` admin/auth | Defense in depth |
| P2 | Club detail routes (at least Big-8) | Local entity SEO |
| P3 | News hub ItemList; BreadcrumbList; RSS; `llms.txt` | AIO polish |
| P3 | SEO/Worker path unit tests | Regression guard |

---

## 8. Score rationale (65)

- **+** Solid client SEO system (`SeoHead` + `seo.ts`), honest soft-public copy, federation/news structured data, build-time sitemap with real inventory, noindex on admin/auth/unknown after JS.  
- **+** Athlete document crawl unblocked (Worker extension-aware static rule).  
- **−** No SSR → AIO/social ceiling (first HTML still homepage seed).  
- **−** Events/clubs lack first-class URLs; SearchAction false claim; soft-404/index placeholders; sitemap without `lastmod`.

If SearchAction is fixed/removed, expect **~68–72** without SSR; with edge prerender for top URLs, **~78–85**.

---

## 9. Return summary

| Question | Answer |
|----------|--------|
| SEO ready for soft public hubs? | **Yes, with caveats** |
| AIO ready? | **No** — client meta + dishonest SearchAction + no SSR |
| Single biggest gap | **No SSR / bot HTML** for entity OG+JSON-LD (athlete hard-404 fixed) |
| Score | **65 / 100** |

**Update 2026-07-25:** Worker P0 athlete 404 fixed in `server/worker.ts` (shipped). SearchAction left as backlog (not trivial — palette is Cmd+K only).

**Rules applied:** search-first · reuse prior SEO audit · no assumptions beyond files read · docs as deliverable.
