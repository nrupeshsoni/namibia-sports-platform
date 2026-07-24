# Namibian Sports News Sources — Ingestion Research

**Date:** 2026-07-24 (auto-publish policy updated same day)  
**Goal:** Feed sports.com.na with attributed Namibian sports news (auto-publish when Namibia+sports confirmed).  
**Verified by:** HTTP fetch of candidate RSS/Atom URLs from this workspace (User-Agent `NamibiaSportsPlatform/1.0`).

## Verdict

| Question | Answer |
|----------|--------|
| Public news APIs? | **None found** for major Namibian outlets (no documented REST/GraphQL with terms for third-party republication). |
| Working RSS? | **Yes** — several WordPress/Google News feeds verified below. |
| Recommended path | **Phase 1: RSS → auto-publish** trusted sports-category feeds (Namibia+sports heuristics) + **draft** Informanté / uncertain. Content Sync for gaps. |
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
| **Google News** (“Namibia sports”) | No (search RSS only) | ✅ `https://news.google.com/rss/search?q=Namibia+sports&hl=en-NA&gl=NA&ceid=NA:en` · site-scoped variants work | Aggregates many publishers | Links are Google redirect URLs; attribute publisher; require Namibia signal; **auto-publish** teaser + link-out only. | **Y — Phase 1** (best sports recall) |
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

**Invariants (aggregator + Content Sync):**

1. **Auto-publish** when `sportsOnly` feed + (local desk **or** Namibia keyword signal for Google News). Set `is_published = true` + `published_at` from RSS `pubDate`.
2. **Informante** (mixed feed): insert **draft only** when both sports + Namibia keyword filters pass; otherwise skip.
3. Store **`source_url` + `source_name`** columns plus attribution footer in `content`. Snippet/teaser only — link out; do not scrape paywalled full text.
4. Extract **`featured_image`** from RSS (`media:content` / `enclosure`) or timeout-safe `og:image` fetch.
5. Deduplicate by URL hash slug (`agg-<sha256>`).
6. AI may **summarise / categorise / suggest federation** from the RSS title+description only — never invent stories.

**Ops flag / kill-switch:** Supabase secret `ENABLE_NEWS_AGGREGATOR=true` required to insert. Set to `false` (or unset) to disable the whole aggregator — cron may still invoke; function no-ops.

**Deploy:** `supabase functions deploy news-aggregator --no-verify-jwt` + cron every 6h (not auto-deployed from Worker CI).

---

## Ops status (2026-07-24)

| Step | Status | Detail |
|------|--------|--------|
| Deploy Edge Function | **Done** | `news-aggregator` ACTIVE on `rbibqjgsnrueubrvyqps` (`verify_jwt=false`; kill-switch is `ENABLE_NEWS_AGGREGATOR`) |
| `ENABLE_NEWS_AGGREGATOR=true` | **Done** | `npx supabase secrets set ENABLE_NEWS_AGGREGATOR=true --project-ref rbibqjgsnrueubrvyqps` |
| `ANTHROPIC_API_KEY` | **Present** | Already set on the project (required when flag is on) |
| Service role inserts | **OK** | Function uses `SUPABASE_SERVICE_ROLE_KEY`; PostgREST insert to `sportsplatform_news_articles` verified |
| Cron every 6h | **Done** | `pg_cron` job `invoke-news-aggregator` → `0 */6 * * *` → `pg_net.http_post` (150s timeout) to `…/functions/v1/news-aggregator`. Vault secret name: `news_aggregator_invoke_key` (anon JWT for gateway `Authorization`/`apikey`) |
| Smoke invoke | **Fixed → productive** | First smokes showed `inserted:0, skippedNonSports:9` — **not** an over-aggressive sports filter. Root cause: retired Anthropic model `claude-sonnet-4-20250514` (404). Fix: model → `claude-sonnet-4-6`, trust `sportsOnly` feeds. Later: **auto-publish** policy — 58 `agg-*` drafts audited (all Namibia+sports) → published; columns `source_url` / `source_name`; image enrich pass. Informante often unreachable from Edge — non-blocking. |

### Admin: drafts vs auto-publish

1. **Trusted sports feeds** (New Era, Economist, Eagle, Confidente, Google News NA sports / Namibian site-scoped) auto-publish when filters pass — no admin approval.
2. **Informante** (and any future mixed feeds) still land as drafts when sports+Namibia pass → review at `/admin` → **News**.
3. Article page shows hero image (when available), source attribution, and prominent **Read original** (`rel="noopener noreferrer"`).
4. Optional: **Content Sync** tab for on-demand AI leads (separate path; still draft-only).

### Kill-switch / redeploy

```bash
# Disable inserts (cron may still invoke; function no-ops)
npx supabase secrets set ENABLE_NEWS_AGGREGATOR=false --project-ref rbibqjgsnrueubrvyqps

# Redeploy after code changes
npx supabase functions deploy news-aggregator --project-ref rbibqjgsnrueubrvyqps --no-verify-jwt

# Manual smoke
curl -X POST "https://rbibqjgsnrueubrvyqps.supabase.co/functions/v1/news-aggregator" \
  -H "Authorization: Bearer $VITE_SUPABASE_ANON_KEY" \
  -H "apikey: $VITE_SUPABASE_ANON_KEY"
```

### Cron SQL (already applied; reference only)

```sql
-- Requires extensions: pg_cron, pg_net; vault secret news_aggregator_invoke_key
SELECT cron.schedule(
  'invoke-news-aggregator',
  '0 */6 * * *',
  $$
  SELECT net.http_post(
    url := 'https://rbibqjgsnrueubrvyqps.supabase.co/functions/v1/news-aggregator',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'news_aggregator_invoke_key' LIMIT 1),
      'apikey', (SELECT decrypted_secret FROM vault.decrypted_secrets WHERE name = 'news_aggregator_invoke_key' LIMIT 1)
    ),
    body := '{}'::jsonb,
    timeout_milliseconds := 150000
  ) AS request_id;
  $$
);
```

**Not automated from Worker CI** — Edge Function deploy + secrets remain a Supabase ops step when the function source changes.

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
| Edge **news-aggregator** | Anthropic Claude (Edge Function secret) | Filter sports relevance, short teaser summary, tags, federation hint from RSS snippet; **auto-publish** trusted sports desks |

Aggregator path: **real RSS sources only**, always link out. Content Sync remains draft-only for human verify.

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
