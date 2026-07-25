# Gap Analysis 08 — News / Aggregator / Content Sync

**Wave:** `gap_wave_20260725`  
**Date:** 2026-07-25  
**Workspace:** `C:\Projects\The Dome\namibia-sports-platform`  
**Live project:** `rbibqjgsnrueubrvyqps` (EU West)  
**DB mutations this analysis:** none (read-only SQL + Edge Function logs + code audit)

---

## 1. Executive verdict

| Metric | Value |
|--------|------:|
| **Pipeline readiness** | **78 / 100** — productive RSS → auto-publish path is live; daily freshness and Google News attribution still incomplete |
| **Ship daily national sports headlines?** | **YES** for Home ticker + `/news` (trusted desks) |
| **Ship as complete federation news coverage?** | **NO** — 22 active federations still have zero published news; Content Sync unused in prod |
| **Ops health (cron / Edge)** | **Healthy** — `news-aggregator` v12 ACTIVE; `pg_cron` every 6h succeeded today; recent invocations ~87–93s, HTTP 200 |

**One-liner:** The aggregator + ticker product surface works; the remaining gaps are **fresh insert throughput**, **Google News unwrap-to-`source_url`**, **Informante/admin draft UX**, **federation matching**, and **doc drift** (SEO scorecard still says draft-only).

---

## 2. Architecture map (as shipped)

```
┌─────────────────────────────────────────────────────────────────────────┐
│ PATH A — Passive RSS (Supabase Edge)                                      │
│  pg_cron 0 */6 * * *                                                    │
│    → pg_net.http_post …/functions/v1/news-aggregator                    │
│    → fetch RSS (7 sources) → Claude classify/summary → insert/enrich     │
│    → sportsplatform_news_articles (auto-publish OR draft)               │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ PATH B — Content Sync (Cloudflare Worker, admin-only)                   │
│  /admin → Content Sync tab                                              │
│    → contentSync.suggestNews|suggestEvents (Workers AI → Anthropic)     │
│    → createNewsDraft|createEventDraft (ALWAYS isPublished=false)        │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ PATH C — Manual CMS                                                     │
│  Platform Admin / Fed Admin → news.create|update|publish|delete         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ CONSUMERS                                                               │
│  Home: news.list(limit:12) → NewsTicker + NewsArticleModal              │
│  /news + Fed News pages → NewsCard / FeaturedNewsCard                   │
│  SEO: NewsArticle JSON-LD uses sourceUrl / sourceName / featuredImage   │
└─────────────────────────────────────────────────────────────────────────┘
```

| Surface | Primary code |
|---------|----------------|
| Aggregator | `supabase/functions/news-aggregator/{index,rss,googleNews}.ts` |
| Content Sync AI | `server/services/contentSyncAi.ts`, `server/routers/contentSync.ts` |
| News API | `server/routers/news.ts` |
| Ticker UI | `client/src/components/NewsTicker.tsx`, `client/src/pages/Home.tsx` |
| Research docs | `docs/research/NAMIBIAN_SPORTS_NEWS_SOURCES.md`, `CONTENT_SYNC_AI.md` |

---

## 3. Live inventory (2026-07-25)

| Metric | Count | Notes |
|--------|------:|-------|
| Published articles | **147** | 89 editorial (no `source_name`) + 58 `agg-*` |
| Drafts | **1** | Informante `agg-*` (correctly unpublished) |
| Aggregator rows (`slug LIKE 'agg-%'`) | **59** | 58 published + 1 draft |
| Published with `featured_image` | **143** | 4 published missing image |
| Published with `source_url` | **58** | Only aggregator-attributed rows |
| Google News `source_url` still on `news.google.com` | **18** | Unwrap used for images, **not** stored URL |
| Google News missing image | **4** | Unwrap / og fetch failures |
| Content Sync tagged (`content-sync`) | **0** | Feature unused in production DB |
| Aggregator with `federation_id` | **17 / 59** | **42 unscoped** |
| Active feds with zero published news | **22** | Hollow Fed News tabs |
| New `agg-*` created today | **0** | Cron ran; inserts stalled (see §6) |
| `agg-*` `updated_at` last 24h | **59** | Enrichment/backfill still touching rows |

### By `source_name` (aggregator)

| Source | Rows | Published | With image |
|--------|-----:|----------:|-----------:|
| New Era | 10 | 10 | 10 |
| Namibia Economist | 10 | 10 | 10 |
| Eagle FM | 10 | 10 | 10 |
| Confidente | 10 | 10 | 10 |
| Google News (Namibia sports) | 10 | 10 | 6 |
| The Namibian (via Google News) | 8 | 8 | 8 |
| Informante | 1 | **0** (draft) | 1 |
| *(null — editorial CMS)* | 89 | 89 | 89 |

---

## 4. Feed matrix — wired vs research

| Priority | Source | Feed in code? | `sportsOnly` | `requireNamibia` | Auto-publish? | Live status |
|----------|--------|:-------------:|:------------:|:----------------:|:-------------:|-------------|
| P0 | New Era Sports | ✅ | true | false | ✅ | Productive |
| P0 | Google News — Namibia sports | ✅ | true | true | ✅ | Productive; Google wrapper URLs stored |
| P0 | Google News — namibian.com.na sport | ✅ | true | true | ✅ | Productive; same URL gap |
| P1 | Namibia Economist Sport | ✅ | true | false | ✅ | Productive |
| P1 | Eagle FM Sport | ✅ | true | false | ✅ | Productive |
| P1 | Informante (site-wide RSS) | ✅ | **false** | true | **Draft only** | **Fragile** — only 1 row ever; often unreachable from Edge |
| P2 | Confidente Sport | ✅ | true | false | ✅ | Productive |
| P2 | Windhoek Observer sport search | ❌ | — | — | — | **Not wired** (documented optional) |
| — | Namibian Sun / NMH | ❌ | — | — | — | No usable RSS (known gap) |
| — | NBC | ❌ | — | — | — | Unusable RSS (known gap) |
| — | The Namibian native `/category/sport/feed/` | ❌ | — | — | — | Returns HTML; Google proxy used |

**Code list:** `RSS_SOURCES` in `supabase/functions/news-aggregator/index.ts` (7 feeds).

---

## 5. Auto-publish policy — status

| Rule | Implemented? | Evidence |
|------|:------------:|----------|
| Trusted `sportsOnly` feeds auto-publish when Namibia heuristics pass | ✅ | `autoPublish = source.sportsOnly && (!requireNamibia \|\| namibiaOk)` |
| Informante / mixed feeds stay draft | ✅ | Live: 1 Informante draft, `is_published=false` |
| Kill-switch `ENABLE_NEWS_AGGREGATOR=true` | ✅ | Ops documented; function no-ops otherwise |
| `source_url` / `source_name` columns | ✅ | Migration `20260724220000_news_source_url_auto_publish_agg.sql` |
| Attribution footer in `content` | ✅ | `buildAttributedContent` |
| Snippet/teaser only (no full scrape) | ✅ | Description + link-out |
| One-shot backfill of 58 drafts → published | ✅ | Same migration |

**Residual risk:** `sportsOnly: true` **forces** `isSports` even if Claude would reject — intentional after retired-model incident, but a non-sports item in a mis-tagged WP category would auto-publish. Mitigated by using category feeds only (not site-wide), except Informante.

---

## 6. Cron / Edge Function ops

| Check | Status | Detail |
|-------|--------|--------|
| Edge Function deployed | ✅ ACTIVE | slug `news-aggregator`, **version 12**, `verify_jwt=false` |
| Kill-switch secret | ✅ (ops doc) | `ENABLE_NEWS_AGGREGATOR=true` |
| `ANTHROPIC_API_KEY` on Edge | ✅ required | Function 500s if missing when enabled |
| `pg_cron` job | ✅ active | `invoke-news-aggregator` · `0 */6 * * *` |
| Cron runs today | ✅ | 00:00 / 06:00 / 12:00 UTC succeeded (`return_message: 1 row` = `http_post` id) |
| Edge invocations (24h) | ✅ 200s | Latest ~93s / 87s / 87s — under 150s `pg_net` timeout |
| CI auto-deploy Edge | ❌ | Manual `supabase functions deploy news-aggregator --no-verify-jwt` |
| Vault invoke key | ✅ (ops) | `news_aggregator_invoke_key` (anon JWT for gateway) |

### Gap: insert stall after initial fill

- Cron is healthy, but **`created_today = 0`** while all 59 `agg-*` rows were `updated_at` within 24h.
- Root cause in code: **only top 3 RSS items per feed** per run (`items.slice(0, 3)`), then dedupe by `agg-<sha256(link)>`. Once those three exist, the run becomes enrich-only.
- Second pass re-fetches sports feeds (up to 12 items) for image backfill; third pass og-backfills up to 30 published rows missing images — explains `updated_at` churn without new headlines.

**Impact:** Home ticker can go stale between real desk rotations if new stories fall outside the top-3 window between 6h ticks.

---

## 7. Claude model (aggregator + Worker)

| Path | Model constant | Status |
|------|----------------|--------|
| `news-aggregator` | `claude-sonnet-4-6` | ✅ Fixed (was `claude-sonnet-4-20250514` → API 404 → 0 inserts) |
| Worker `server/services/anthropic.ts` | `claude-sonnet-4-6` | ✅ Aligned |
| Content Sync Anthropic fallback | `claude-sonnet-4-6` | ✅ Aligned |
| Content Sync Phase 1 | `@cf/meta/llama-3.1-8b-instruct` | ✅ Workers AI binding in `wrangler.jsonc` |

| Gap | Severity | Notes |
|-----|----------|-------|
| Aggregator **hard-depends** on Anthropic even for `sportsOnly` feeds | Medium | Claude still called for summary/tags/federationHint; failure falls back to keyword summary — OK — but key outage degrades quality |
| Worker chat `ANTHROPIC_API_KEY` may be unset | Medium (separate) | Content Sync prefers Workers AI; chat widget still 500s if key missing (`docs/03_api_and_integrations.md`) |
| No model canary / health check in cron response beyond per-source errors | Low | Diagnostics exist in JSON `sources[]` but nothing alerts on `inserted=0` for N runs |

---

## 8. Images pipeline

**Resolution order** (`resolveImage` → `fetchOgImage`):

1. RSS `media:content` / `media:thumbnail` / `enclosure` / `<img>` in description  
2. HTML body extract (ad/banner/SVG filter)  
3. If Google News URL → **`unwrapGoogleNewsUrl`** then og/twitter/JSON-LD  
4. WordPress oEmbed thumbnail fallback  
5. Cron pass 2/3: backfill existing rows missing `featured_image`

| Aspect | Status | Gap |
|--------|--------|-----|
| Timeouts | ✅ | Feed 12s / og 6s / unwrap 15s |
| Ad image filter | ✅ | `AD_IMG_RE` |
| Google image enrich | ✅ partial | 14/18 Google rows have images; **4 still null** |
| Hotlink vs Storage | ❌ gap | Images stay on publisher CDN — link rot / hotlink blocks / no resize |
| UI without image | ✅ | Text-first cards; ticker uses red dot; modal skips hero |
| Ticker thumbs | ✅ | 32–36px with `onError` hide |

---

## 9. Google News unwrap

**Implementation:** `supabase/functions/news-aggregator/googleNews.ts`  
Browser UA → scrape `data-n-a-sg` / `data-n-a-ts` → `batchexecute` `Fbv4je` → `garturlres` publisher URL.

| Use case | Uses unwrap? | Status |
|----------|:------------:|--------|
| `og:image` enrichment | ✅ | Working for most Google rows |
| Persist `source_url` as publisher URL | ❌ | **Gap — 18 rows still `news.google.com/rss/articles/…`** |
| Persist true publisher in `source_name` | ❌ | Shows "Google News (…)" not outlet |
| Dedup slug | Uses Google link hash | Same story via New Era + Google = **two rows** possible |

**Product impact:** "Read original" often lands on Google News interstitial, not the outlet. SEO `isBasedOn` / citation also point at Google.

**Recommended fix (not done):** On insert/enrich, if unwrap succeeds, set `source_url = unwrapped` and parse publisher from title (`"… - The Namibian"`) into `source_name` (keep tag `source:Google News…`).

---

## 10. Informante

| Check | Status |
|-------|--------|
| Feed URL correct (`?feed=rss2`) | ✅ |
| Keyword sports filter before Claude | ✅ |
| Namibia signal required | ✅ |
| Auto-publish blocked (`sportsOnly: false`) | ✅ |
| Volume in DB | **1 draft** only |
| Admin Publish/Edit/Delete when `federation_id` null | ❌ **broken UX** — `FedAdminNews` disables actions if `federationId == null` |

**Gaps:**

1. **Reachability** — research notes Informante often fails from Edge; non-blocking but starves mixed-desk intake.  
2. **Draft orphan** — Claude may leave `federation_id` null → admin cannot Publish/Edit/Delete via current UI (button `disabled` / early `return`).  
3. No dedicated sports category feed — always mixed homepage RSS.

---

## 11. Content Sync (Cloudflare Workers AI)

| Check | Status |
|-------|--------|
| `ai.binding = "AI"` in `wrangler.jsonc` | ✅ |
| Provider order Workers AI → Anthropic | ✅ |
| Admin-only + rate limit 10/min | ✅ |
| Never auto-publish | ✅ invariant |
| Draft tags `content-sync`, `ai-draft` | ✅ |
| Unit tests (`contentSyncAi.test.ts`) | ✅ parse/scope/flag |
| Production drafts created | ❌ **0 rows** with those tags |
| `ENABLE_CONTENT_SYNC` default ON | ✅ |
| Documented in `.env.example` | Partial — flag commented; no Edge aggregator flag |

**Gaps:**

| Gap | Severity | Detail |
|-----|----------|--------|
| Unused vs hollow feds | High (product) | 22 zero-news feds; Sync is the intended gap-filler but unused |
| Hallucinated leads | Accepted risk | Docs warn; confidence advisory only |
| No link to aggregator drafts queue | Low | Separate mental models in Admin |
| Docs drift in `SEO_AIO_AND_CONTENT_GAPS.md` | Medium | Still says aggregator is draft-only / "never auto-publish" RSS — **stale vs 2026-07-24 policy** |

---

## 12. Ticker integration

| Check | Status |
|-------|--------|
| Home loads `trpc.news.list({ limit: 12 })` | ✅ |
| `NewsTicker` after ~160px scroll | ✅ |
| Marquee + reduced-motion chips | ✅ |
| Click → `NewsArticleModal` | ✅ |
| Shows `sourceName` + `featuredImage` thumb | ✅ |
| Link to `/news` | ✅ |
| Only published articles | ✅ (`news.list` public filter) |
| Federation-scoped ticker | ❌ N/A — national only on Home |
| `/news` page still card grid | ✅ intentional |

**Gaps (minor):**

- Ticker order is `publishedAt DESC` — Google/Confidente bursts can dominate if editorial lacks `source_name` and older dates.  
- No live/“breaking” badge; no WebSocket refresh (6h cron cadence).  
- Hero “latest headline” teaser shares same query — fine.

---

## 13. News API / CMS gaps (cross-cutting)

| Gap | Severity | Detail |
|-----|----------|--------|
| `news.create` has no `sourceUrl`/`sourceName` / publish fields | Medium | Editorial articles stay `source_*=null` (89 rows) — SEO weaker |
| `news.publish` requires non-null `federationId` match | High for drafts | Unscoped Informante draft cannot be published via UI/API as designed |
| No platform-admin `news.publish` bypass for `federation_id IS NULL` | High | Blocks draft review workflow |
| Aggregator federation match weak | Medium | 42/59 `agg-*` unscoped — Fed News pages don't show them |
| No Deno/unit tests for RSS parse / unwrap / auto-publish matrix | Medium | Regressions only caught by smoke |
| Hotlinked images | Low–Med | No Supabase Storage mirror |
| Dual-path Claude cost | Low | Content Sync uses Llama; aggregator always Anthropic |
| Observer + Sun + NBC still out | Medium (coverage) | Partnership / Phase 2 |

---

## 14. Security / tenancy notes

| Topic | Assessment |
|-------|------------|
| Edge uses **service_role** for inserts | Expected for cron; kill-switch is the ops brake |
| `verify_jwt=false` | Cron uses vault anon key in headers; function still publicly invokable — mitigated by kill-switch + no secrets in response, but **anyone can trigger a heavy Anthropic+fetch run** (cost/DoS). Consider re-enabling JWT verify or shared cron secret header. |
| Auto-publish without human review | Explicit product choice for trusted desks; Informante held back |
| Content Sync | Admin-only; drafts only — good |
| RLS | Not on Hyperdrive app path; Edge service_role bypasses RLS — tenancy for aggregator is N/A (national rows) |

---

## 15. Scorecard by theme

| Theme | Score | Weight | Notes |
|-------|------:|-------:|-------|
| Feeds wired vs research | 85 | 15% | 7/8 Phase-1 targets; Observer missing |
| Auto-publish correctness | 88 | 15% | Policy matches code + live Informante draft |
| Images | 80 | 10% | Strong enrich; 4 Google misses; no Storage mirror |
| Cron / ops | 82 | 12% | Healthy runs; insert stall; no CI deploy |
| Claude model hygiene | 90 | 8% | `claude-sonnet-4-6` consistent |
| Google News unwrap | 55 | 12% | Images yes; **source_url/name no** |
| Informante | 45 | 8% | Draft policy OK; reachability + admin orphan |
| Content Sync CF AI | 70 | 10% | Shipped unused; good invariants |
| Ticker integration | 92 | 10% | Polished; depends on feed freshness |

**Weighted ≈ 78.**

---

## 16. Prioritized backlog

### P0 — fix before calling the pipeline “done”

1. **Unwrap Google News into `source_url` (+ publisher `source_name`)** on insert and enrich pass.  
2. **Admin workflow for `federation_id IS NULL` aggregator drafts** — allow assign-federation + publish (or default to a “National / Unscoped” bucket).  
3. **Raise insert freshness** — process more than top-3 (e.g. 8–12) or skip Claude on known `sportsOnly` + batch summaries; alert when `inserted=0` for ≥3 consecutive cron runs while feeds return items.

### P1 — coverage & quality

4. Wire **Observer** sport search RSS (optional P2 in research).  
5. Improve **federationHint → federation_id** matching (abbrev table: NFA, NRU, NNC, etc.).  
6. Use Content Sync deliberately for the **22 zero-news federations** (evergreen verified drafts — still human publish).  
7. Protect Edge invoke (JWT verify or `X-Cron-Secret`) to stop anonymous cost amplification.

### P2 — polish / Phase 2

8. Mirror `featured_image` into Supabase Storage.  
9. Dedup cross-feed (canonical URL after unwrap).  
10. NMH / NBC partnership asks (no RSS today).  
11. Refresh stale docs: `SEO_AIO_AND_CONTENT_GAPS.md` auto-publish section; `.env.example` Edge kill-switch note.  
12. Add Deno tests for `parseRssItems`, `unwrapGoogleNewsUrl`, auto-publish matrix.

---

## 17. Acceptance checks (re-run later)

```text
[ ] Cron job active + last 3 runs succeeded
[ ] Edge news-aggregator latest version deployed matches git
[ ] New agg-* inserts appear within 12h of a fresh desk story in top of New Era feed
[ ] Google News rows: source_url host ≠ news.google.com (or documented exception)
[ ] Informante draft can be assigned a federation and published from /admin
[ ] content_sync tagged drafts > 0 for at least Big-8 hollow fill OR explicit “won't use” decision
[ ] Published missing featured_image < 5% of agg-* 
[ ] SEO doc agrees with auto-publish policy
```

---

## 18. Related artifacts

- `docs/research/NAMIBIAN_SPORTS_NEWS_SOURCES.md` — outlet matrix + ops runbook (authoritative for feeds)  
- `docs/research/CONTENT_SYNC_AI.md` — admin AI assist  
- `docs/research/SEO_AIO_AND_CONTENT_GAPS.md` — **partially stale** on aggregator publish policy  
- `CHANGELOG.md` [Unreleased] — ticker, auto-publish, unwrap, model fix  
- `docs/06_tasks.md` — aggregator/ticker items marked done  
- Migration `supabase/migrations/20260724220000_news_source_url_auto_publish_agg.sql`

---

*End of `08_news_pipeline.md`.*
