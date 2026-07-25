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
| **system** | notifyOwner | 
...(trimmed — see routers in `server/routers/` and `SKILLS.md`)...
## Region filters

List procedures on **events**, **clubs**, **venues**, and **schools** accept `region` and match via `shared/regions` aliases (e.g. Kharas → Karas). Schools default to `isActive=true`; admins may pass `includeInactive`. Delete on schools is a soft `isActive=false`.

## HTTP caching (Worker)

`/api/*` responses: `Cache-Control: private, no-store`. Vite `/assets/*`: long immutable cache. `/logos/` and `/sports/` static files: 7-day public cache. SPA HTML: `no-cache`.

h, Storage | `HYPERDRIVE` binding, SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY (uploads only), VITE_SUPABASE_* (client) | |
| Anthropic | AI (Claude) | ANTHROPIC_API_KEY — **currently unset**, so the chat widget 500s on every message (gap B10) | |
| WhatsApp Business | Notifications | WHATSAPP_API_TOKEN, WHATSAPP_PHONE_NUMBER_ID | Configure in Meta |
| Cloudflare | Hosting (Worker `namibia-sports-platform`) + DNS + Hyperdrive | Secrets via `wrangler secret put`; vars in `wrangler.jsonc` | Deploy on push to main (Workers Builds) |

## Webhook Triggers
- Cloudflare Workers Builds deploy: push to main (or `npm run cf:deploy` locally)
- WhatsApp: incoming message/status (configure callback URL in Meta)
- Supabase Edge Functions: cron (news-aggregator, whatsapp-webhook)
