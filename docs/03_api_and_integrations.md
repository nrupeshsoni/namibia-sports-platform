# API and Integrations — Namibia Sports Platform

## Internal API — tRPC

**Base URL:** `/api/trpc` — same origin as the SPA; `run_worker_first: ["/api/*"]`
routes it to Worker code before the asset layer sees it
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
- **federationAdminProcedure** — federation_admin or admin (role check only). Each
  mutation asserts the federation match itself via `assertSameFederation`
- **adminProcedure** — admin only

## External Integrations

| Service | Purpose | Env Var | Webhooks |
|---------|---------|---------|----------|
| Supabase | DB (via Hyperdrive), Auth, Storage | `HYPERDRIVE` binding, SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY (uploads only), VITE_SUPABASE_* (client) | |
| Anthropic | AI (Claude) | ANTHROPIC_API_KEY — **currently unset**, so the chat widget 500s on every message (gap B10) | |
| WhatsApp Business | Notifications | WHATSAPP_API_TOKEN, WHATSAPP_PHONE_NUMBER_ID | Configure in Meta |
| Cloudflare | Hosting (Worker `namibia-sports-platform`) + DNS + Hyperdrive | Secrets via `wrangler secret put`; vars in `wrangler.jsonc` | Deploy on push to main (Workers Builds) |

## Webhook Triggers
- Cloudflare Workers Builds deploy: push to main (or `npm run cf:deploy` locally)
- WhatsApp: incoming message/status (configure callback URL in Meta)
- Supabase Edge Functions: cron (news-aggregator, whatsapp-webhook)
