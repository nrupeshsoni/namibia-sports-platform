# Row Level Security (RLS) Policies — Namibia Sports Platform

**Last updated:** 2026-07-21
**Database:** Supabase PostgreSQL (`sportsplatform_` prefix), project `rbibqjgsnrueubrvyqps`

---

## ⚠️ RLS is not a defence layer on this platform

The previous version of this document said the server connects as `service_role`
and therefore bypasses RLS. That was wrong in a way that mattered: it implied RLS
was still enforcing something for everyone else. It is not.

**There are two real data paths, and neither is protected by RLS:**

| Path | Credential | Used for | Is RLS evaluated? |
|---|---|---|---|
| Drizzle → Hyperdrive → Postgres | Hyperdrive origin role **`postgres`** (`rolbypassrls = true`) | **All** application reads and writes | **No** — the role bypasses RLS entirely |
| `@supabase/supabase-js` client | **anon** key + the caller's `Authorization` header | Verifying the caller's JWT / loading the user | Yes, but almost nothing reads data this way |
| `@supabase/supabase-js` client | **service_role** key | **Storage uploads only** | No (by design, and correctly scoped) |

Consequences, stated plainly:

- **The tRPC layer is the sole tenancy boundary.** There is no second line. If a
  procedure forgets its federation check, there is nothing behind it.
- **The documented "remedy" is the exact thing you must not do.** Switching the
  Worker's `SUPABASE_ANON_KEY` to a service-role key would not improve the Drizzle
  path (already unrestricted) and would silently remove JWT-scoped access from the
  Supabase path. `wrangler.jsonc` carries this warning inline.
- **The federation tenancy check lives in the mutations, not the middleware.**
  It used to be a middleware branch reading `opts.rawInput` — which does not exist
  in `@trpc/server` v11 (it is `await opts.getRawInput()`) — so `federationId` was
  always `undefined` and every federation-scoped mutation was effectively "any
  `federation_admin` may write to any federation". Gap **A6**, now fixed: the
  middleware checks the role only, and each mutation calls
  `assertSameFederation(ctx.user, …)` before it touches the database. Fails closed,
  type-safe, and visible at the point of use. A new federation-scoped mutation must
  add the call *and* a case in `server/federationScope.test.ts`.
- **The Hyperdrive credential is itself an open critical issue.** The origin user is
  the `postgres` superuser, with full DDL over all ~737 tables on this shared
  instance, and its password is in public git history, unrotated. Gap **B1**.

### What must be true before this doc can claim RLS as a control

1. B1 done: password rotated, Hyperdrive re-pointed at a least-privilege role
   scoped to `sportsplatform_*` **without** `BYPASSRLS`.
2. ~~A6~~ **done**: explicit federation assertions in every federation-scoped
   mutation, with a cross-tenant test per mutation in
   `server/federationScope.test.ts` — that suite is the actual control, not the
   policies below.

Until then, treat the policy matrix as a description of what the anon key can reach
directly over PostgREST, not as protection for the application.

---

## Policy Matrix (what the anon/authenticated keys can reach over PostgREST)

Public SELECT here is a real exposure, not just a formality: gap **A4** records that
`sportsplatform_athletes` publishes 35 athlete birth dates to anyone holding the
shipped anon key, and 45 of 50 rows in `sportsplatform_schools` expose
`contact_email` / `contact_phone`. The policies are **column-blind**, so the first
contact detail entered into an athlete row becomes public the moment it is saved.
This is a youth-sport directory. The fix is a narrow public directory *view* plus
revoking anon SELECT on the base tables.

| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| sportsplatform_federations | ✅ Public | service_role | service_role | service_role |
| sportsplatform_clubs | ✅ Public | service_role | service_role | service_role |
| sportsplatform_events | ✅ Public | service_role | service_role | service_role |
| sportsplatform_athletes | ✅ Public | service_role | service_role | service_role |
| sportsplatform_coaches | ✅ Public | service_role | service_role | service_role |
| sportsplatform_venues | ✅ Public | service_role | service_role | service_role |
| sportsplatform_news_articles | ✅ Public | service_role | service_role | service_role |
| sportsplatform_live_streams | ✅ Public | service_role | service_role | service_role |
| sportsplatform_whatsapp_subscriptions | ✅ Public | service_role | service_role | service_role |
| sportsplatform_schools | ✅ Public | service_role | service_role | service_role |
| sportsplatform_media | ✅ Public | service_role | service_role | service_role |
| sportsplatform_hp_programs | ✅ Public | service_role | service_role | service_role |

---

## Indexes (Performance)

| Index | Table | Purpose |
|-------|-------|---------|
| idx_sportsplatform_federations_slug | federations | Slug lookups |
| idx_sportsplatform_events_federation_date | events | Federation calendars |
| idx_sportsplatform_events_slug | events | Slug lookups |
| idx_sportsplatform_news_federation_published | news_articles | News feeds |
| idx_sportsplatform_news_is_published | news_articles | Published filter |
| idx_sportsplatform_clubs_federation_id | clubs | Federation club lists |
| idx_sportsplatform_clubs_federation_region | clubs | Region filter |
| idx_sportsplatform_clubs_slug | clubs | Slug lookups |
| idx_sportsplatform_streams_live | live_streams | Active streams |
| idx_sportsplatform_streams_scheduled | live_streams | Scheduled streams |
| idx_sportsplatform_whatsapp_active | whatsapp_subscriptions | Notification dispatch |
| idx_sportsplatform_athletes_federation_id | athletes | Federation rosters |
| idx_sportsplatform_media_entity | media | Entity media lookup |
| idx_sportsplatform_hp_programs_federation | hp_programs | Federation HP programs |

---

## Migration

See `supabase/migrations/20250318000001_rls_and_indexes.sql` for the full DDL.

Generate new migrations with `npm run db:generate`, apply with `npm run db:migrate`.
**Never `drizzle-kit push`** — it diffs the whole database against
`drizzle/schema.ts` and would emit `DROP TABLE` for the ~724 tables on this shared
instance that belong to other products.
