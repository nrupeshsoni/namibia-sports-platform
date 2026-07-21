# API and Integrations — Namibia Sports Platform

## Internal API — tRPC

**Base URL:** `/api/trpc` (Netlify Function)
**Transport:** HTTP with superjson
**Auth:** Session cookie + JWT verification

### Routers and Procedures

| Router | Procedure | Auth | Description |
|--------|-----------|------|-------------|
| **system** | health | public | Health check |
| **system** | notifyOwner | admin | Admin notification |
| **auth** | me | public | Current user |
| **auth** | logout | public | Clear session |
| **federations** | list | public | List federations (search, type filter) |
| **federations** | getById | public | Get by id |
| **federations** | getByAbbreviation | public | Get by abbreviation |
| **federations** | getBySlug | public | Get by slug |
| **federations** | create | protected | Create federation |
| **federations** | update | protected | Update federation |
| **federations** | delete | protected | Delete federation |
| **clubs** | list | public | List clubs (federationId, region, search) |
| **clubs** | getById | public | |
| **clubs** | create | protected | |
| **clubs** | update | protected | |
| **clubs** | delete | protected | |
| **events** | list | public | |
| **events** | getById | public | |
| **events** | create | protected | |
| **events** | update | protected | |
| **events** | delete | protected | |
| **athletes** | list | public | Active-only by default; strips email/phone/DOB. Staff: `includeInactive`, `includePii` |
| **athletes** | getById | public | Active-only; strips PII. Staff: `includePii` |
| **athletes** | getBySlug | public | Active-only; strips PII (e.g. christine-mboma-1) |
| **athletes** | create | federation_admin | |
| **athletes** | update | federation_admin | |
| **athletes** | delete | federation_admin | |
| **coaches** | list | public | Active-only by default; strips email/phone. Staff: `includeInactive`, `includePii` |
| **coaches** | getById | public | Active-only; strips PII. Staff: `includePii` |
| **coaches** | create | federation_admin | |
| **coaches** | update | federation_admin | |
| **coaches** | delete | federation_admin | |
| **venues** | list | public | |
| **venues** | getById | public | |
| **venues** | create | protected | |
| **venues** | update | protected | |
| **venues** | delete | protected | |
| **news** | list | public | Published only |
| **news** | getBySlug | public | |
| **news** | create | federationAdmin | Requires federationId |
| **news** | update | federationAdmin | |
| **news** | publish | federationAdmin | |
| **news** | delete | admin | |
| **streams** | list | public | Filter by isLive |
| **streams** | getById | public | |
| **streams** | create | federationAdmin | |
| **streams** | update | federationAdmin | |
| **streams** | setLive | federationAdmin | |

### Auth Procedures
- **publicProcedure** — No auth required
- **protectedProcedure** — Any authenticated user
- **federationAdminProcedure** — federation_admin or admin; federationId must match
- **adminProcedure** — admin only

## External Integrations

| Service | Purpose | Env Var | Webhooks |
|---------|---------|---------|----------|
| Supabase | DB, Auth, Storage | DATABASE_URL, VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY | |
| Anthropic | AI (Claude) | ANTHROPIC_API_KEY | |
| WhatsApp Business | Notifications | WHATSAPP_API_TOKEN, WHATSAPP_PHONE_NUMBER_ID | Configure in Meta |
| Netlify | Hosting | N/A | Deploy on push to main |
| Cloudflare | DNS (sports.com.na) | N/A | |

## Webhook Triggers
- Netlify deploy: push to main
- WhatsApp: incoming message/status (configure callback URL in Meta)
- Supabase Edge Functions: cron (news-aggregator, whatsapp-webhook)
