# Row Level Security (RLS) Policies — Namibia Sports Platform

**Last updated:** March 2025  
**Database:** Supabase PostgreSQL (`sportsplatform_` prefix)

---

## Overview

RLS is enabled on all `sportsplatform_` tables. The platform uses **app-level auth** (tRPC + Supabase Auth JWT) for mutations; the Netlify server connects with **service_role**, which bypasses RLS.

- **Reads (SELECT):** Public — anyone with anon or authenticated key can read
- **Mutations (INSERT/UPDATE/DELETE):** Denied for anon/authenticated; service_role bypasses RLS

---

## Policy Matrix

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
