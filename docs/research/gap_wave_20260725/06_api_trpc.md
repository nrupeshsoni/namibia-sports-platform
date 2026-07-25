# Gap Wave 2026-07-25 — API / tRPC

**Agent:** API / tRPC gap analysis  
**Date:** 2026-07-25  
**Workspace:** `C:\Projects\The Dome\namibia-sports-platform`  
**Sources (read-only):**
- `SKILLS.md` (procedure quick ref)
- `docs/03_api_and_integrations.md` (canonical API table — **stale**)
- `docs/04_features_audit.md`, `docs/research/CONTENT_SYNC_AI.md`
- Live routers: `server/routers/index.ts` + `server/routers/*.ts` + `server/_core/systemRouter.ts`
- Shared: `server/_core/trpc.ts`, `listLimits.ts`, `rateLimit.ts`, `federationScope.ts`
- Schema: `drizzle/schema.ts` (`newsArticles.sourceUrl` / `sourceName`)
- Client consumers: Admin, FedAdmin, News UI, Content Sync panel

**DB / deploy mutations this analysis:** none.

---

## 1. Executive verdict

| Metric | Value |
|--------|------:|
| **API surface health** | **Strong** — CRUD + tenancy + rate limits largely shipped |
| **Doc drift severity** | **High** for `docs/03_api_and_integrations.md`; **Medium** for `SKILLS.md` |
| **Critical functional gaps** | News `sourceUrl`/`sourceName` not writable via tRPC CMS path; Content Sync buries URL in body text |
| **Admin list completeness** | Stats fixed via `adminStats.counts`; Admin **tables** still capped at 200 |

**One-line:** Code is ahead of `docs/03_*`; SKILLS is mostly current but omits `adminStats` and half of `users.*`. Biggest product gap is attribution fields (`sourceUrl` / `sourceName`) existing in DB + UI read path but not in `news.create` / `news.update` / Content Sync draft inserts.

---

## 2. Router inventory — code vs docs

### 2.1 Mounted routers (`server/routers/index.ts`)

| Router key | File | In SKILLS.md | In docs/03 |
|------------|------|:------------:|:----------:|
| `system` | `_core/systemRouter.ts` | partial (`health` only) | partial |
| `auth` | `auth.ts` | yes | yes |
| `users` | `users.ts` | partial | **missing** |
| `adminStats` | `adminStats.ts` | **missing** | **missing** |
| `federations` | `federations.ts` | yes | incomplete auth |
| `clubs` | `clubs.ts` | yes | wrong auth labels |
| `events` | `events.ts` | yes | wrong auth labels |
| `athletes` | `athletes.ts` | yes | yes (better than SKILLS on PII) |
| `coaches` | `coaches.ts` | yes | yes |
| `venues` | `venues.ts` | yes | wrong auth (`protected` vs `admin`) |
| `news` | `news.ts` | yes | wrong `news.delete` auth |
| `streams` | `streams.ts` | yes | **missing `delete`** |
| `schools` | `schools.ts` | yes | **missing** |
| `media` | `media.ts` | yes | **missing** |
| `hpPrograms` | `hpPrograms.ts` | yes | **missing** |
| `upload` | `upload.ts` | yes | **missing** |
| `whatsapp` | `whatsapp.ts` | yes | **missing** |
| `ai` | `ai.ts` | yes | **missing** |
| `contentSync` | `contentSync.ts` | yes (one-liner) | **missing** |
| `search` | `search.ts` | yes | **missing** |

**Verdict:** `docs/03_api_and_integrations.md` stops mid-streams and never documents ~half the production surface. Treat **SKILLS.md + router source** as the working source of truth until `docs/03` is rewritten.

---

## 3. Full procedure matrix (actual code)

Auth key: `pub` = publicProcedure · `prot` = protectedProcedure · `fed` = federationAdminProcedure (+ in-proc `assertSameFederation` where noted) · `adm` = adminProcedure

### 3.1 Platform / auth / users / stats

| Procedure | Auth | Notes / gaps |
|-----------|------|--------------|
| `system.health` | pub | Requires `{ timestamp: number }` input |
| `system.notifyOwner` | adm | In `docs/03`; **not** in SKILLS |
| `auth.me` | pub | Returns `null` if anonymous |
| `auth.logout` | pub | No server session clear (client `signOut`) |
| `users.list` | adm | Uncapped user directory |
| `users.inviteCapabilities` | adm | **Missing from SKILLS + docs/03 + features audit** |
| `users.findByEmail` | adm | **Missing from SKILLS + docs/03** |
| `users.setRole` | adm | Input uses `id` (not `userId` as SKILLS claims) |
| `users.inviteOrPromote` | adm | **Missing from SKILLS**; features audit only mentions list/setRole |
| `adminStats.counts` | adm | **Missing from SKILLS procedure list**; returns uncapped counts |

### 3.2 Federations

| Procedure | Auth | Notes |
|-----------|------|-------|
| `list` | pub | Active only; `limit` 1–200 (default 50) |
| `listAll` | adm | Uncapped; includes inactive/merged |
| `getById` / `getByAbbreviation` / `getBySlug` | pub | Merge-aware resolution |
| `create` / `update` / `delete` | adm | **docs/03 wrongly says `protected`** |

### 3.3 Tenant content (federation-scoped mutations)

| Router | list / get | Mutations | Tenancy |
|--------|------------|-----------|---------|
| `clubs` | pub list/getById | fed CUD | assert + claim match |
| `events` | pub list/getById; drafts via `includeUnpublished` | fed CUD | same |
| `athletes` | pub list/getById/getBySlug; PII strip | fed CUD | same |
| `coaches` | pub list/getById; PII strip | fed CUD | same |
| `news` | pub list/getBySlug | fed create/update/publish/**delete** | same; **docs/03 says delete = admin (wrong)** |
| `streams` | pub list/getById | fed create/update/setLive/**delete** | same; **docs/03 omits delete** |
| `hpPrograms` | pub list/getById | fed CUD | assertSameFederation |
| `media` | pub list/getById (unscoped list = admin only) | fed create/delete; **no update** | resolve entity → federation |
| `upload.image` | — | fed | federationId asserted; rate-limited |

### 3.4 Platform-scoped content

| Router | list / get | Mutations |
|--------|------------|-----------|
| `venues` | pub (active; staff `includeInactive`) | **adm** CUD (not protected) |
| `schools` | pub (contact strip for non-admin) | **adm** CUD |

### 3.5 Integrations

| Procedure | Auth | Status |
|-----------|------|--------|
| `search.global` | pub | Rate-limited; 5 rows per entity type |
| `ai.generateSummary` / `suggestTags` / `chatAssistant` | prot | Rate-limited; needs `ANTHROPIC_API_KEY` |
| `contentSync.status` | adm | Kill-switch `ENABLE_CONTENT_SYNC` |
| `contentSync.suggestNews` / `suggestEvents` | adm | Rate-limited; Workers AI → Anthropic |
| `contentSync.createNewsDraft` / `createEventDraft` | adm | Always `isPublished=false` |
| `whatsapp.subscribe` / `unsubscribe` / `getSubscriptions` | pub shape | **Hard-disabled** (`WHATSAPP_API_ENABLED=false` → FORBIDDEN) |

---

## 4. Doc vs code — detailed mismatches

### 4.1 `docs/03_api_and_integrations.md` (critical staleness)

| Claim in docs/03 | Reality |
|------------------|---------|
| federations/clubs/events/venues mutations = `protected` | federations/venues = **admin**; clubs/events = **federationAdmin** |
| `news.delete` = admin | **federationAdmin** + tenant assert |
| streams has no `delete` | **`streams.delete` exists** |
| Entire table ends at streams | Missing: schools, media, hpPrograms, upload, search, ai, contentSync, users extras, adminStats, whatsapp |
| Auth note incomplete | Does not document that federation middleware is **role-only** |

### 4.2 `SKILLS.md` (mostly good; omissions)

| Gap | Detail |
|-----|--------|
| No `adminStats.*` | Client uses `adminStats.counts` heavily (`AdminStatsCards`, invalidations) |
| `users` incomplete | Missing `inviteCapabilities`, `findByEmail`, `inviteOrPromote` |
| `users.setRole({ userId })` | Actual input field is **`id`** |
| `system.notifyOwner` omitted | Exists as admin mutation |
| `ai` / `contentSync` formatting | contentSync listed under ai block; comment about `protectedProcedure` applies to **ai**, not contentSync (contentSync is **admin**) |
| Events list inputs | Code also accepts `region`, `search` (SKILLS omits) |
| Schools/media limits | SKILLS implies shared list pattern; schools/media hardcode `.limit(100)` without `listLimitSchema` |

### 4.3 `docs/04_features_audit.md`

| Gap | Detail |
|-----|--------|
| Users row | Only `list` + `setRole`; omits invite/promote flow (shipped) |
| No mention of `adminStats` or Content Sync | Both are live Admin tabs |
| News | Does not mention `sourceUrl` / `sourceName` attribution columns |

---

## 5. Missing / incomplete procedures (functional)

These are **product gaps**, not just doc gaps:

| Gap | Severity | Evidence |
|-----|----------|----------|
| **`news.create` / `news.update` omit `sourceUrl` & `sourceName`** | **High** | Zod inputs lack fields; DB columns exist; client `NewsForm` has no inputs; UI (`NewsCard`, modal, SEO) already render them |
| **`contentSync.createNewsDraft` does not persist `sourceUrl` column** | **High** | Appends URL into `content` text only; column stays null → “Read original” CTA missing on AI drafts |
| **No `news.getById`** | Low | Only `getBySlug`; Admin edits from list rows (OK for now) |
| **No `media.update`** | Low | Features audit correctly shows “—”; replace via delete+create |
| **No cursor/offset pagination** | Medium | Hard `limit` only; Admin tables silently truncate past 200 |
| **No admin uncapped list for events/clubs/athletes** | Medium | `adminStats.counts` fixes **numbers**; CRUD tables still use `ADMIN_LIMIT = 200` |
| **WhatsApp API surface dead** | Intentional | Procedures exist but always FORBIDDEN; re-enable needs Meta opt-in + auth redesign |
| **`club_manager` role** | Deferred | Enum only; `users` rejects `clubId` assignment |

### Documented-but-present (not missing)

SKILLS / CONTENT_SYNC_AI accurately list all five `contentSync.*` procedures. They exist and are wired in Admin.

---

## 6. List limits

### 6.1 Shared policy (`server/_core/listLimits.ts`)

| Constant | Value |
|----------|------:|
| `DEFAULT_LIST_LIMIT` | 50 |
| `MAX_LIST_LIMIT` | 200 |

Zod: `listLimitSchema` = optional int 1…200. Resolver clamps to max.

### 6.2 Per-router application

| Router | Uses shared limit? | Cap |
|--------|:------------------:|-----|
| federations.list | yes | default 50 / max 200 |
| clubs / events / athletes / coaches | yes | same |
| venues / news / streams / hpPrograms | yes | same |
| schools.list | **no** | hard **100** (no client `limit` input) |
| media.list | **no** | hard **100** |
| search.global | n/a | **5 per type** |
| federations.listAll | n/a | **uncapped** |
| users.list | n/a | **uncapped** |
| adminStats.counts | n/a | SQL `count()` — **uncapped totals** |

### 6.3 Client impact

| Caller | Request | Risk |
|--------|---------|------|
| `Home` / `Events` / `Live` / Map | `limit: 200` | At ceiling — OK unless inventory exceeds 200 |
| Platform `Admin.tsx` | `ADMIN_LIMIT = 200` for events/clubs/athletes | **Silent truncation** if >200 rows (or >200 in filtered federation) |
| FedAdmin dashboards | often default 50 | May under-show without explicit limit |
| `adminStats.counts` | none | Correct totals for dashboard cards |

**Gap:** No admin-only `listAll` (or pagination) for events/clubs/athletes/news — only federations have uncapped list.

---

## 7. Public vs protected — security notes

### 7.1 Correct patterns (code)

- Mutations for tenant data use `federationAdminProcedure` + **explicit** `assertSameFederation` / `assertClaimMatchesOwnedRow` (gap A6 pattern).
- Platform-wide entities (federations, venues, schools, users, adminStats, contentSync) use `adminProcedure`.
- AI spend gated by `protectedProcedure` + rate limits + conversation caps.
- Public athlete/coach/school list/get strip PII/contact for non-staff.
- News/events public reads enforce `isPublished` unless staff `includeUnpublished` + `canIncludeUnpublished`.

### 7.2 Soft / intentional exposures

| Item | Notes |
|------|-------|
| List queries catch DB errors and **return `[]`** | Hides outages as “empty” (federations, clubs, events, athletes, news, streams) |
| `media.getById` public | Any id readable if known (no publish flag on media) |
| WhatsApp procedures remain `publicProcedure` shape | Safe today only because hard-disabled |
| `auth.logout` public | Harmless no-op server-side |

### 7.3 docs/03 understates protection

Calling mutations “protected” in docs/03 is **wrong and dangerous for agents** — it implies any logged-in user can mutate. Code correctly uses federationAdmin/admin.

---

## 8. Error handling consistency

### 8.1 Patterns in use

| Pattern | Where | Client effect |
|---------|-------|---------------|
| `TRPCError` with codes (`NOT_FOUND`, `FORBIDDEN`, `PRECONDITION_FAILED`, …) | news/streams/users/contentSync/whatsapp/ai (mostly) | Proper tRPC error UX |
| `throw new Error("Database not available")` | federations, clubs, events, athletes, coaches, venues, schools, media, hpPrograms, upload | Often surfaces as **INTERNAL_SERVER_ERROR** with raw message — inconsistent with TRPCError style |
| `catch` → `console.error` → `return []` | Several `*.list` | Failures look like empty catalogs |
| Rate limit → `TOO_MANY_REQUESTS` | ai, contentSync, upload, search | Good |
| Feature flags → `PRECONDITION_FAILED` / `FORBIDDEN` | contentSync off, WhatsApp off | Good |

### 8.2 Gaps

1. **Normalize DB-unavailable** to `TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" })` everywhere (news/streams already do this).
2. **List swallow-errors** vs fail-loud: decide product policy (honest error vs empty fallback). Current choice favors Home resilience, hurts observability.
3. **`upload.image`** throws bare `Error` for bad base64 — should be `BAD_REQUEST` TRPCError.
4. **AI errors** may forward provider message strings to clients (`INTERNAL_SERVER_ERROR` with `e.message`) — prefer generic client messages + server logs (security guideline).

---

## 9. Deep dive: `adminStats`

**File:** `server/routers/adminStats.ts`  
**Procedure:** `adminStats.counts` — `adminProcedure.query`

**Returns:**
```ts
{ federations: number; events: number; clubs: number; athletes: number }
```

**Behavior:**
- Four parallel `select count()` queries (no filters: includes inactive/unpublished/etc.).
- If DB unavailable → zeros (not an error).
- Purpose: Admin dashboard cards must not use capped list lengths (50/200).

**Client:** `AdminStatsCards.tsx`; invalidated on deletes / Content Sync drafts.

**Gaps:**
| Gap | Severity |
|-----|----------|
| Not documented in SKILLS procedure block or docs/03 | Doc |
| No counts for news, streams, coaches, schools, media, users | Low–Med product |
| Federations count includes soft-merged inactive rows (directory card elsewhere uses `listAll` length + breakdown) | UX clarity (partially handled in UI copy) |
| No tests for zero/DB-down path beyond auth deny in `usersAdmin.test.ts` | Low |

---

## 10. Deep dive: `contentSync`

**File:** `server/routers/contentSync.ts`  
**Docs (good):** `docs/research/CONTENT_SYNC_AI.md`, SKILLS one-liner, SECURITY.md rate table

| Procedure | Auth | Flag | Rate limit |
|-----------|------|------|------------|
| `status` | admin | reports enablement | none |
| `suggestNews` | admin | `ENABLE_CONTENT_SYNC` | 10/min user + IP |
| `suggestEvents` | admin | same | same |
| `createNewsDraft` | admin | same | same |
| `createEventDraft` | admin | same | same |

**Strengths:** Admin-only; drafts only; provider fallback; Zod suggestion schema; manual CMS hint when AI unavailable.

**Gaps:**

| Gap | Severity | Detail |
|-----|----------|--------|
| **`sourceUrl` not written to column** | High | Only embedded in `content` / `description` markdown note |
| No `sourceName` at all | Medium | Aggregator sets both; Content Sync sets neither |
| Suggestions may hallucinate URLs | Known | Documented; confidence advisory |
| Event date placeholder (+30d) | Accepted risk | Flagged via `startDatePlaceholder` |
| SKILLS groups contentSync under `ai` + `protectedProcedure` comment | Doc confusion | Auth is **admin**, not protected |

---

## 11. Deep dive: news `sourceUrl` / `sourceName`

### 11.1 Schema (source of truth)

`drizzle/schema.ts` → `sportsplatform_news_articles`:

- `sourceUrl: text("source_url")` — “Canonical original article URL (RSS / outlet); never invent.”
- `sourceName: text("source_name")` — publisher display name

Migration: `supabase/migrations/20260724220000_news_source_url_auto_publish_agg.sql`

### 11.2 Writers today

| Writer | Sets `source_url`? | Sets `source_name`? |
|--------|:------------------:|:-------------------:|
| Edge `news-aggregator` | **yes** (`item.link`) | **yes** (feed name) |
| `news.create` / `news.update` tRPC | **no** | **no** |
| `contentSync.createNewsDraft` | **no** (text footnote only) | **no** |
| Admin `NewsForm` UI | **no** fields | **no** fields |

### 11.3 Readers today

Client already consumes fields: `NewsCard`, `FeaturedNewsCard`, `NewsArticleModal`, `NewsTicker`, `Home` headline, `seo.ts` JSON-LD (`isBasedOn` / `citation`).

### 11.4 Gap summary

Attribution works for **RSS-aggregated** articles and fails for **manual CMS** and **Content Sync AI drafts** unless editors paste links into body text. That splits the product experience (“Read original” present vs absent) by ingestion path.

**Recommended fix (out of scope for this doc, tracked as gap):**
1. Add optional `sourceUrl` / `sourceName` to `news.create` + `news.update` Zod (+ https URL validation via existing `_core/httpsUrl` if available).
2. Persist `suggestion.sourceUrl` onto the column in `createNewsDraft` (keep body note optional).
3. Extend `NewsForm` with optional Source URL / Source name fields.
4. Update SKILLS + docs/03 field lists.

---

## 12. Procedures present in code but missing from SKILLS.md

Quick checklist for SKILLS refresh:

- [ ] `system.notifyOwner`
- [ ] `adminStats.counts`
- [ ] `users.inviteCapabilities`
- [ ] `users.findByEmail`
- [ ] `users.inviteOrPromote`
- [ ] Fix `users.setRole` param name (`id`)
- [ ] Clarify `contentSync` = `adminProcedure` (not under protected AI comment)
- [ ] Note schools/media hard limit 100
- [ ] Note news attribution fields (once wired)

---

## 13. Procedures / routers missing from docs/03 (rewrite list)

Entire sections to add: `users` (full), `adminStats`, `schools`, `media`, `hpPrograms`, `upload`, `search`, `ai`, `contentSync`, `whatsapp` (disabled), `streams.delete`, correct auth column for all mutations, list-limit policy footnote.

---

## 14. Severity-ranked gap backlog (API-only)

| ID | Severity | Gap | Suggested fix |
|----|----------|-----|---------------|
| A1 | **P0** | Rewrite `docs/03_api_and_integrations.md` auth + missing routers | Align table to §3 matrix |
| A2 | **P0** | `sourceUrl`/`sourceName` not in news CMS tRPC | Extend Zod + NewsForm + Content Sync insert |
| A3 | **P1** | Content Sync drops structured `sourceUrl` | Map suggestion → columns |
| A4 | **P1** | Admin lists capped at 200 without pagination | Admin `listAll` or cursor pages |
| A5 | **P1** | Inconsistent `throw new Error` vs `TRPCError` | Normalize mutations |
| A6 | **P2** | List queries swallow errors → `[]` | Structured error or logging metric |
| A7 | **P2** | SKILLS omissions (`adminStats`, users invite flow) | Patch SKILLS |
| A8 | **P2** | schools/media ignore shared `listLimitSchema` | Adopt shared helper |
| A9 | **P3** | `adminStats` only 4 entities | Optional news/streams/users counts |
| A10 | **P3** | AI error messages may leak provider detail | Generic client messages |

---

## 15. Score (API pillar only)

| Sub-area | Score /10 | Notes |
|----------|----------:|-------|
| Procedure completeness | 8 | CRUD + integrations present |
| Auth correctness (code) | 9 | Tenancy pattern solid |
| Doc accuracy | 4 | docs/03 badly stale; SKILLS ~7 |
| List/pagination | 6 | Caps exist; admin tables truncate |
| Error handling consistency | 5 | Mixed TRPCError / Error / empty catch |
| Attribution / news fields | 4 | Schema+readers yes; CMS writers no |
| Content Sync | 7 | Safe drafts; sourceUrl column gap |
| adminStats | 8 | Solves count problem; narrow scope |

**API pillar ≈ 6.4 / 10** for gap-wave purposes — implementation stronger than documentation; attribution write-path is the standout functional hole.

---

## 16. Evidence index (absolute paths)

- `C:\Projects\The Dome\namibia-sports-platform\SKILLS.md`
- `C:\Projects\The Dome\namibia-sports-platform\docs\03_api_and_integrations.md`
- `C:\Projects\The Dome\namibia-sports-platform\server\routers\index.ts`
- `C:\Projects\The Dome\namibia-sports-platform\server\routers\news.ts`
- `C:\Projects\The Dome\namibia-sports-platform\server\routers\adminStats.ts`
- `C:\Projects\The Dome\namibia-sports-platform\server\routers\contentSync.ts`
- `C:\Projects\The Dome\namibia-sports-platform\server\routers\users.ts`
- `C:\Projects\The Dome\namibia-sports-platform\server\_core\listLimits.ts`
- `C:\Projects\The Dome\namibia-sports-platform\server\_core\trpc.ts`
- `C:\Projects\The Dome\namibia-sports-platform\drizzle\schema.ts` (news `sourceUrl` / `sourceName`)
- `C:\Projects\The Dome\namibia-sports-platform\client\src\components\admin\NewsForm.tsx`
- `C:\Projects\The Dome\namibia-sports-platform\supabase\functions\news-aggregator\index.ts`
- `C:\Projects\The Dome\namibia-sports-platform\docs\research\CONTENT_SYNC_AI.md`
