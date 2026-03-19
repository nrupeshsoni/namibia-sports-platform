# Master Tasks — Namibia Sports Platform

## 🛑 CRITICAL BLOCKERS
- [x] Federation pages broken (/federation/karate-namibia) — fixed getBySlug fallbacks, migration for slugs, Home→tRPC
- [ ] Verify .env.example is complete and matches actual usage

## ⚠️ HIGH PRIORITY
- [ ] Add RLS policies to all Supabase tables
- [ ] Implement WhatsApp subscribe/unsubscribe routers
- [ ] Add rate limiting to auth and public mutation endpoints
- [ ] Ensure all list queries have .limit() (news: limit 50, verify others)

## 🟡 WARNINGS
- [ ] Admin page: connect to real tRPC, remove mock data
- [ ] Empty states for all list views
- [ ] Loading states to prevent double-click submit
- [ ] Error boundaries on page-level components

## 🟢 SAFE
- [x] Schema: slug, primaryColor, secondaryColor on federations
- [x] Schema: news_articles, live_streams, whatsapp_subscriptions
- [x] Relations defined in drizzle/relations.ts
- [x] Routers split into server/routers/
- [x] federationAdminProcedure added
- [x] news and streams routers with correct auth

## Database Blockers (Phase 1)
- Verify ON DELETE behavior on all FKs in migrations
- Add indexes for: federation_id, club_id, slug, is_published, is_live

## API Vulnerabilities (Phase 2)
- Add timeout to external API calls (Anthropic, WhatsApp)
- Ensure Zod validation on all procedure inputs
