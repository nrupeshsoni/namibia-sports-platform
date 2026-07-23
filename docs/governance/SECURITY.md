# SECURITY.md — Namibia Sports Platform

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.x | ✅ Security updates |
| < 1.0 | ❌ Not supported |

## Security Architecture

### Authentication
- **Provider:** Supabase Auth (JWT)
- **Methods:** Email/password, OAuth (as configured)
- **Session:** Cookie-based with JWT verification in tRPC context

### Authorization
- **Model:** Role-based (user, admin, federation_admin, club_manager)
- **Enforcement:** tRPC procedures — `publicProcedure`, `protectedProcedure`, `federationAdminProcedure`, `adminProcedure`
- **RLS:** enabled on `sportsplatform_*` tables, but it is **not** a control for
  application queries — all real reads/writes go through Drizzle over Hyperdrive as
  a role that bypasses RLS. The tRPC layer is the sole tenancy boundary. See
  `docs/architecture/RLS_POLICIES.md`.

### Data Protection
- **At rest:** Supabase managed (PostgreSQL encryption)
- **In transit:** HTTPS/TLS terminated by Cloudflare; TLS to Supabase
- **Secrets:** Cloudflare Worker secrets (`wrangler secret put`) only; never in code
  and never in a hosting dashboard

### Network Boundaries
- **Public:** Home, events list, news list, streams list, federation pages
- **Authenticated:** Profile, subscriptions
- **Federation admin:** CRUD for own federation data
- **Admin:** Full platform access

## Reporting a Vulnerability

**Do NOT open a public GitHub issue for security vulnerabilities.**

1. Email the project maintainers at the contact listed in the repository
2. Include: description, steps to reproduce, impact assessment
3. Allow 72 hours for initial response
4. We will acknowledge and provide a timeline for fix

**Out of scope:** Feature requests, dependency update suggestions (use regular issues)

## Abuse controls (2026-07-23 hardening)

### WhatsApp tRPC
| Procedure | Auth | Notes |
|-----------|------|-------|
| `whatsapp.subscribe` | Public **only if** Worker `ENABLE_WHATSAPP_SUBSCRIBE=true` | Rate-limited; sets `consent_at`. Default **off**. |
| `whatsapp.unsubscribe` | `protectedProcedure` | Own rows only (`userId`); phone-only opt-outs via Meta webhook. |
| `whatsapp.getSubscriptions` | `protectedProcedure` | Own rows only — no phone enumeration. |

UI flag `VITE_SHOW_WHATSAPP_SUBSCRIBE` does **not** open the API; both must be enabled deliberately.

### Rate limits (`server/_core/rateLimit.ts`)
Per-isolate fixed windows (not global — see module comment):

| Key prefix | Ceiling | Procedures |
|------------|---------|------------|
| `ai.*` | 10 / min | `generateSummary`, `suggestTags`, `chatAssistant` |
| `whatsapp.*` | 5 / min | `subscribe`, `unsubscribe`, `getSubscriptions` |
| `upload.image` | 20 / min | federation-admin image upload |
| `search.global` | 30 / min | public search fan-out |

### CORS
Worker allowlist (`server/_core/cors.ts`): `https://sports.com.na`, `https://www.sports.com.na`, staging `https://namibia-sports-platform-staging.facilit8.workers.dev`, local Vite/wrangler. Unlisted origins get no CORS headers; API preflight → 403.

### Supabase Storage (`sportsplatform_*` buckets)
- `allowed_mime_types`: `image/jpeg`, `image/png`, `image/webp`, `image/gif`
- Public **SELECT** policies only; **no** anon/authenticated INSERT — uploads use Worker `service_role` via `upload.image`
- Buckets remain `public: true` for CDN URLs

## Security Maintenance

- **Dependency audit:** Run `npm audit` before each release
- **API key rotation:** Document schedule in ops runbook
- **Access review:** Quarterly for admin accounts
