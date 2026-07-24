# Namibian Sports News Sources — Ingestion Research

**Date:** 2026-07-24  
**Goal:** Feed sports.com.na with attributed Namibian sports news (drafts for human review).  
**Verified by:** HTTP fetch of candidate RSS/Atom URLs from this workspace (User-Agent `NamibiaSportsPlatform/1.0`).

## Verdict

| Question | Answer |
|----------|--------|
| Public news APIs? | **None found** for major Namibian outlets (no documented REST/GraphQL with terms for third-party republication). |
| Working RSS? | **Yes** — several WordPress/Google News feeds verified below. |
| Recommended path | **Phase 1: RSS → draft news** (existing `supabase/functions/news-aggregator`) + **admin Content Sync** for gaps. Scrape = last resort. |
| Cloudflare AI role | **Classify / tag / match federation** from RSS titles+snippets (Workers AI in Content Sync; Claude in the Edge aggregator). **Never fabricate articles.** |

---

## Outlet matrix

| Outlet | Public API | RSS / Atom (verified) | Sports category / sitemap | License / scrape risk | Integrate? |
|--------|------------|------------------------|---------------------------|------------------------|------------|
| **The Namibian** | No | ✅ `https://www.namibian.com.na/feed/` (site-wide). ❌ `/category/sport/feed/` returns HTML (not RSS). | ✅ `https://www.namibian.com.na/category/sport/` · sitemap `…/wp-sitemap.xml` | RSS OK for headlines/teasers; full-text scrape high risk. | **Y** — via Google News `site:namibian.com.na sport` + keyword filter on main feed |
| **New Era** (`neweralive.na`) | No | ✅ `https://neweralive.na/feed/` · ✅ **`https://neweralive.na/category/sports/feed/`** | ✅ `/category/sports/` · sitemap `…/wp-sitemap.xml` | RSS preferred. | **Y — Phase 1** (sports category feed) |
| **Informanté** | No | ✅ `https://informante.web.na/?feed=rss2` (not `/feed/` — 404). No sports category feed found. | Sports mixed into homepage; no dedicated sport feed | RSS teaser OK; scrape caution. | **Y — Phase 1** with sports keyword filter |
| **Namibian Sun / NMH** | No | ❌ `https://www.namibiansun.com/rss` is an HTML page titled “rss”, not a feed. `/feed` aborted. | Sport pages often fail/timeout from outside | No usable RSS; scrape = high risk + fragile. | **N** until NMH provides a feed/API |
| **NBC Digital** (`nbc.na`) | No | ⚠️ `https://www.nbc.na/rss.xml` returns markup that *looks* like RSS but lists radio/podcast channels, not news articles. | No working `/sport(s)` URL | Unusable for news ingestion. | **N** |
| **Confidente** | No | ✅ `https://confidentenamibia.com/feed/` (main feed **spam-polluted**). ✅ **`…/category/sport/feed/`** sports-relevant. | ✅ `/category/sport/` | Prefer category feed only; main feed unsafe. | **Optional** Phase 1b (sport category) |
| **Windhoek Observer** | No | ✅ `https://www.observer.com.na/feed/` · ✅ `…/?s=sport&feed=rss2` · thin `/category/sport/feed/` | Search RSS usable | RSS OK. | **Optional** Phase 1b |
| **Namibia Economist** | No | ✅ `https://economist.com.na/feed/` · ✅ **`…/category/sport/feed/`** | ✅ `/category/sport/` | RSS OK. | **Y — Phase 1** (sport category) |
| **Eagle FM** | No | ✅ `https://eaglefm.com.na/feed/` · ✅ **`…/category/sport/feed/`** | ✅ `/category/sport/` | RSS OK. | **Y — Phase 1** (sport category) |
| **Google News** (“Namibia sports”) | No (search RSS only) | ✅ `https://news.google.com/rss/search?q=Namibia+sports&hl=en-NA&gl=NA&ceid=NA:en` · site-scoped variants work | Aggregates many publishers | Links are Google redirect URLs; attribute publisher name from title; ToS: personal/non-commercial aggregation norms — keep **drafts**, link out, don’t republish full text. | **Y — Phase 1** (best sports recall) |
| **KickOff / Goal.com NA** | No usable NA API | No stable Namibia-specific RSS verified | Social / site scrape | Not reliable for NA desk. | **N** (monitor) |
| **Federation sites / Facebook** | Rarely | Almost never RSS; Facebook has no public RSS | Per-federation websites | Scraping FB violates ToS. Use **Content Sync** + manual CMS + official press pages. | **Content Sync / manual**, not aggregator |

---

## Phase 1 — RSS (ship now)

Wire **verified sports or filterable** feeds into `supabase/functions/news-aggregator`:

| Priority | Source | Feed URL | Notes |
|----------|--------|----------|-------|
| P0 | New Era Sports | `https://neweralive.na/category/sports/feed/` | Native sports desk |
| P0 | Google News — Namibia sports | `https://news.google.com/rss/search?q=Namibia+sports&hl=en-NA&gl=NA&ceid=NA:en` | Highest sports density |
| P0 | Google News — The Namibian sport | `https://news.google.com/rss/search?q=site:namibian.com.na+sport&hl=en&gl=NA&ceid=NA:en` | Proxy for The Namibian sport (native category RSS broken) |
| P1 | Namibia Economist Sport | `https://economist.com.na/category/sport/feed/` | Strong football/rugby/cricket desk |
| P1 | Eagle FM Sport | `https://eaglefm.com.na/category/sport/feed/` | Broadcast + stadium coverage |
| P1 | Informanté | `https://informante.web.na/?feed=rss2` | Keyword filter required |
| P2 | Confidente Sport | `https://confidentenamibia.com/category/sport/feed/` | Use category only |
| P2 | Observer sport search | `https://www.observer.com.na/?s=sport&feed=rss2` | Thin but valid |

**Invariants (already matched by aggregator + Content Sync):**

1. Insert **`is_published = false`** drafts only — humans publish.
2. Store **source name + canonical link** in article body (no `source_url` column yet; same pattern as Content Sync footer).
3. Deduplicate by URL hash slug (`agg-<sha256>`).
4. AI may **summarise / categorise / suggest federation** from the RSS title+description only — never invent stories or scrape full paywalled HTML.

**Ops flag:** Supabase secret/env `ENABLE_NEWS_AGGREGATOR=true` required to insert (kill-switch: unset or `false`).

**Deploy:** `supabase functions deploy news-aggregator` + schedule cron every 6h (documented in `SYSTEM_DESIGN.md`; not auto-deployed from Worker CI).

---

## Phase 2 — APIs / partnerships

| Path | Status | Action |
|------|--------|--------|
| Outlet public APIs | **None** | Re-check annually; ask NMH / The Namibian / New Era for content licensing + feed. |
| NMH (Sun / Republikein / AZ) | No RSS from outside | Commercial syndication ask. |
| NBC | Broken RSS | Ask NBC Digital for a sports Atom/RSS or CMS webhook. |
| Supabase + admin CMS | Exists | Primary when RSS misses a federation. |
| Content Sync (Workers AI) | Shipped | On-demand leads; still draft-only. See `CONTENT_SYNC_AI.md`. |

---

## Cloudflare AI vs Anthropic

| Surface | Provider | Role |
|---------|----------|------|
| Platform Admin **Content Sync** | Cloudflare Workers AI (`env.AI`), Anthropic fallback | Suggest news/event *leads*; classify federation hints — **not** auto-publish |
| Edge **news-aggregator** | Anthropic Claude (Edge Function secret) | Filter sports relevance, short teaser summary, tags, federation hint from RSS snippet |

Both paths: **ingest or suggest from real sources only**; editors verify before publish.

---

## Legal / product notes

- Prefer **headline + teaser + link-out** over republishing full articles.
- Google News items should credit the **underlying publisher** (often in the title) and keep `sourceUrl` as the item link.
- Do not scrape Facebook, gated archives, or HTML when RSS exists.
- Namibian Sun remains a **gap** until a real feed or license exists.

---

## Related code

- `supabase/functions/news-aggregator/index.ts` — cron RSS → draft `sportsplatform_news_articles`
- `server/routers/contentSync.ts` + `docs/research/CONTENT_SYNC_AI.md` — admin AI assist
- `docs/architecture/SYSTEM_DESIGN.md` — AI pipeline sketch (partially outdated source list; this doc supersedes the outlet list)
