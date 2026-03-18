# Dependency Graph — Namibia Sports Platform

## Shared Utilities (Breaking Changes Affect Multiple Features)

| Utility | Location | Consumers |
|---------|----------|-----------|
| getDb | server/db.ts | All tRPC routers |
| publicProcedure, protectedProcedure, federationAdminProcedure, adminProcedure | server/_core/trpc.ts | All routers |
| federations, clubs, events, etc. | drizzle/schema.ts | All routers, relations |
| trpc client | client/src/lib/trpc.ts | All pages using tRPC |
| useAuth | client/contexts/AuthContext | Protected pages |
| AppRouter type | server/routers/index.ts | Client trpc, Netlify function |

## Router Dependencies
- All routers depend on: getDb, drizzle schema, trpc procedures
- news, streams depend on: federationAdminProcedure
- Netlify api.ts imports appRouter from server/routers

## Frontend Dependencies
- Pages → trpc hooks, AuthContext, components
- FederationLayout → FederationHome, FederationEvents, etc. (some may be missing)

## External Package Dependencies
- @trpc/server, @trpc/client, @trpc/react-query — tRPC
- drizzle-orm, postgres — DB
- @supabase/supabase-js — Auth client
- react-query — Data fetching
- framer-motion — Animations

## Impact Analysis
Before modifying:
- `drizzle/schema.ts` → Check all routers, migrations
- `server/_core/trpc.ts` → Check all procedure-using routers
- `server/db.ts` → All DB access
- `server/routers/index.ts` → Netlify function, client
