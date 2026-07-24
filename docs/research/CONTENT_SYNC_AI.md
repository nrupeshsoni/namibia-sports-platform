# Content Sync AI (Platform Admin Intelligence)

**Status:** MVP shipped (2026-07-24)  
**Audience:** Platform `admin` only  
**Invariant:** AI never auto-publishes. Drafts only; humans verify and publish.

## Purpose

Help Platform Admins populate federation **news**, **schedules**, and **events** by generating structured research *leads* — not verified facts. Admins review suggestions and click **Create draft**, which writes `isPublished = false` rows into `sportsplatform_news_articles` / `sportsplatform_events`.

This is separate from the Supabase Edge Function `news-aggregator` (RSS + Claude cron; verified feeds in `docs/research/NAMIBIAN_SPORTS_NEWS_SOURCES.md`). Content Sync is an on-demand, in-Worker admin tool. Cloudflare Workers AI here (and Claude in the aggregator) **classify/tag/match federation** from real leads or RSS snippets — they must not fabricate articles.

## Providers

| Phase | Provider | When |
|-------|----------|------|
| **1 (default)** | Cloudflare Workers AI (`env.AI`) | `ai.binding = "AI"` in `wrangler.jsonc` |
| **2** | Anthropic (`ANTHROPIC_API_KEY`) | Workers AI binding missing; key set via `wrangler secret put` |

Model (Phase 1): `@cf/meta/llama-3.1-8b-instruct`  
Resolution order: Workers AI → Anthropic → clear error + manual CMS hint.

## Feature flag

| Var | Default | Effect |
|-----|---------|--------|
| `ENABLE_CONTENT_SYNC` | **ON** (unset) | Set `"false"` to disable all `contentSync.*` procedures |

Procedures remain `adminProcedure` regardless. The flag is an ops kill-switch, not a public UX toggle.

## tRPC surface (`contentSync.*`)

| Procedure | Auth | Notes |
|-----------|------|-------|
| `status` | admin | Provider readiness + manual CMS message |
| `suggestNews` | admin | Structured suggestions (rate-limited) |
| `suggestEvents` | admin | Structured suggestions (rate-limited) |
| `createNewsDraft` | admin | Insert unpublished news |
| `createEventDraft` | admin | Insert unpublished event (`isPublished: false`) |

Suggestion shape (Zod):

```json
{
  "title": "string",
  "summary": "string",
  "date": "YYYY-MM-DD | null",
  "sourceUrl": "https://… | null",
  "confidence": 0.0,
  "federationHint": "Federation name | null"
}
```

Rate limit: `RATE_LIMITS.contentSync` — 10 / min per user and per IP (`server/_core/rateLimit.ts`).

## How to use (`/admin`)

1. Sign in as a platform `admin`.
2. Open **Content Sync**.
3. Optionally pick a federation (or leave **All federations**).
4. Run **Suggest news topics** or **Find event candidates**.
5. Review confidence / source URL; click **Create draft**.
6. Finish editing under **News** / **Events**, then publish only after human verification.

If AI is unavailable, the panel shows a clear message and points to the manual CMS tabs.

## Binding status

`wrangler.jsonc` includes:

```jsonc
"ai": { "binding": "AI" }
```

(also under `env.staging`). Deploy with `npm run cf:deploy` for the binding to attach to the live Worker. Local `wrangler dev` uses the remote Workers AI API (billable).

## Safety rules

1. Never invent live events into a **published** state.
2. Draft content is tagged `content-sync` / `ai-draft` (news) and includes an “unverified research” note.
3. Event drafts without a parseable date get a **placeholder** start date (~+30 days); UI warns the admin.
4. LLM knowledge can hallucinate — treat `confidence` and `sourceUrl` as advisory only.

## Related code

- `server/routers/contentSync.ts`
- `server/services/contentSyncAi.ts`
- `server/services/contentSyncScope.ts`
- `client/src/pages/admin/AdminContentSyncPanel.tsx`
- Existing Anthropic helpers: `server/services/anthropic.ts` / `server/routers/ai.ts` (chat/summary — not Content Sync)
- RSS aggregator: `supabase/functions/news-aggregator/`
