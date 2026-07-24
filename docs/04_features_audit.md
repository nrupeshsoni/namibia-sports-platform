# Features Audit — Namibia Sports Platform

**Last refreshed:** 2026-07-24  
**Hosting:** Cloudflare Worker (`namibia-sports-platform`) + Hyperdrive → Supabase Postgres  
**Auth:** Supabase Auth JWT in tRPC context · RBAC via `admin` / `federation_admin` / `user`

| Feature | Status | Scale Status | Notes |
|---------|--------|--------------|-------|
| **Federation listing** | ✅ | Beta | `list`, `getById`, `getBySlug`, `getByAbbreviation`, `listAll` (admin) |
| **Federation CRUD** | ✅ | Beta | create/update/delete = `adminProcedure`; https website/socials |
| **Club listing & CRUD** | ✅ | Beta | federation-scoped; `assertSameFederation` on mutations |
| **Event listing & CRUD** | ✅ | Beta | published gate on public get; drafts for same-tenant staff |
| **Athlete listing & CRUD** | ✅ | Beta | public PII stripped; `getBySlug`; staff `includePii` |
| **Coach listing & CRUD** | ✅ | Beta | public PII stripped; same tenancy pattern |
| **Venue listing & CRUD** | ✅ | Beta | public active-only; admin `includeInactive` |
| **News articles** | ✅ | Beta | list/getBySlug public; create/update/publish/delete federationAdmin |
| **Live streams** | ✅ | Soft | list/CRUD + setLive; nav gated while inventory VOD-only |
| **Schools / media / HP** | ✅ | Beta | routers + Admin + FedAdmin UIs |
| **Auth (me, logout)** | ✅ | Beta | Supabase session → tRPC `ctx.user` |
| **Users / roles** | ✅ | Beta | `users.list` + `users.setRole` (admin) |
| **Image uploads** | ✅ | Beta | `upload.image` → Supabase Storage (service role, tenant-scoped) |
| **Search** | ✅ | Beta | `search.global` rate-limited |
| **WhatsApp subscriptions** | ⏸ | Off | Router present; API hard-disabled (`WHATSAPP_API_ENABLED=false`) |
| **AI (summary / tags / chat)** | ⏸ | Off | `protectedProcedure` + caps; UI gated by `VITE_SHOW_AI_CHAT` |
| **Federation pages (frontend)** | ✅ | Beta | Layout + Home/Events/Clubs/Athletes/News/Streams + FedAdmin |
| **Platform Admin dashboard** | ✅ | Beta | Full CRUD UIs (not mock) |
| **SEO / AIO** | ✅ | Beta | `SeoHead` + JSON-LD; build-time sitemap (83 feds / news / athletes) |
| **Legal** | ✅ | Beta | `/privacy` + `/terms`; Register acceptance; hub footers |

## CRUD Matrix

| Entity | Create | Read | Update | Delete |
|--------|--------|------|--------|--------|
| Federations | ✅ admin | ✅ | ✅ admin | ✅ admin |
| Clubs | ✅ fedAdmin | ✅ | ✅ fedAdmin | ✅ fedAdmin |
| Events | ✅ fedAdmin | ✅ | ✅ fedAdmin | ✅ fedAdmin |
| Athletes | ✅ fedAdmin | ✅ | ✅ fedAdmin | ✅ fedAdmin |
| Coaches | ✅ fedAdmin | ✅ | ✅ fedAdmin | ✅ fedAdmin |
| Venues | ✅ admin | ✅ | ✅ admin | ✅ admin |
| News | ✅ fedAdmin | ✅ | ✅ fedAdmin | ✅ fedAdmin |
| Streams | ✅ fedAdmin | ✅ | ✅ fedAdmin | ✅ fedAdmin |
| Schools | ✅ admin | ✅ | ✅ admin | ✅ admin |
| Media | ✅ fedAdmin | ✅ | — | ✅ fedAdmin |
| HP programs | ✅ fedAdmin | ✅ | ✅ fedAdmin | ✅ fedAdmin |

## Empty States

Public federation subpages (Events / Clubs / Athletes / News / Streams) and Federation Home sections use honest empty copy when content is thin — not broken UI. National `/live` distinguishes true empty vs Recent Coverage VODs.

## Go-live perception notes

- Soft public OK for Home / Events / News / Big-8; full national marketing still gated by credential rotation (+ Builds `ci:gate`); hollow public Fed tabs now inventory-gated — see `docs/research/PRODUCTION_GO_LIVE_SCORECARD.md`.
- Stale “routers pending / mock admin” claims in older docs are obsolete as of this refresh.
