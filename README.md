# Namibia Sports Platform

Comprehensive sports management platform for Namibia with 65 sporting federations, clubs, events, athletes, and high-performance systems.

## Features

- **65 Sporting Bodies**: 57 federations + 8 umbrella organizations
- **Full Management System**: Federations, clubs, events, athletes, coaches, venues
- **Beautiful UI**: Responsive design matching tourism portal aesthetic
- **Admin Dashboard**: Complete backend management interface
- **Supabase Backend**: PostgreSQL database with comprehensive schema

## Tech Stack

- **Frontend**: React 19 + TypeScript + TailwindCSS 4 + Framer Motion
- **Backend**: tRPC v11 on a Cloudflare Worker (`server/worker.ts`)
- **Database**: Supabase (PostgreSQL), reached via a Cloudflare **Hyperdrive** binding
- **Hosting**: **Cloudflare Workers** — one Worker serves the SPA (Static Assets from
  `dist/public`) and the API at `/api/*`. Live on the apex **sports.com.na**.

> Netlify is not used. `netlify.toml` is a retired leftover and serves no traffic.

## Deployment

`main` auto-deploys via **Cloudflare Workers Builds**; `npm run cf:deploy` does the
same thing from a local checkout. See [`docs/CI.md`](docs/CI.md).

```bash
npm run cf:dryrun          # build + wrangler deploy --dry-run
npm run cf:deploy          # production (apex sports.com.na)
npm run cf:deploy:staging  # namibia-sports-platform-staging on workers.dev
npm run cf:tail            # live logs
npm run cf:secret          # wrangler secret put <NAME>
```

Secrets (`SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `ANTHROPIC_API_KEY`) live
in the Worker and are injected at runtime — never in the repo, never in a hosting
dashboard. `SUPABASE_URL` is a plain var in `wrangler.jsonc`.

### Rollback

```bash
npx wrangler deployments status --name namibia-sports-platform
npx wrangler versions list      --name namibia-sports-platform
npx wrangler rollback [VERSION_ID] --name namibia-sports-platform --message "reason"
```

Assets ship inside the version, so a rollback restores the SPA and API together.
It does **not** revert secrets or bindings.

### Database Setup

1. Open the Supabase project dashboard → **SQL Editor**
2. Run `supabase-migration.sql`
3. Verify the `sportsplatform_*` tables exist

> This Supabase project is shared with 15+ unrelated products (~737 tables). Only
> `sportsplatform_*` belongs to this app. Never run unscoped DDL.

### Custom domain

The apex `sports.com.na` is bound in `wrangler.jsonc` as a Custom Domain
(`"routes": [{ "pattern": "sports.com.na", "custom_domain": true }]`). A Custom
Domain binds to exactly one Worker — `system.sports.com.na` belongs to the separate
DOME X Worker and must not be added here.

## Local Development

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env    # local dev only; production uses Worker secrets + Hyperdrive

# Database: generate a migration from drizzle/schema.ts, then apply it
npm run db:generate
npm run db:migrate

# Start the Worker locally
npm run dev
```

> **Never run `drizzle-kit push`, and never re-add a `db:push` script.** It was
> deliberately removed. `push` diffs the entire database against
> `drizzle/schema.ts`, and this instance holds ~724 tables owned by 15+ other
> products — it would emit `DROP TABLE` for all of them. Use `db:generate` +
> `db:migrate`.

## Project Structure

```
namibia_sports_platform/
├── client/                  # Frontend React app
│   ├── src/
│   │   ├── pages/          # Page components
│   │   └── components/     # Reusable components
│   └── public/             # Static assets
├── server/                  # Backend API
│   ├── worker.ts           # Cloudflare Worker entry (fetch handler)
│   ├── _core/              # tRPC init, auth middleware, env bindings, context
│   ├── routers/            # tRPC endpoints, split by domain
│   └── db.ts               # Request-scoped Drizzle client over Hyperdrive
├── drizzle/
│   └── schema.ts           # Database schema — source of truth
├── wrangler.jsonc          # Worker config: apex domain, assets, Hyperdrive
├── supabase-migration.sql  # Database migration
└── netlify.toml            # DEAD — retired Netlify config, serves no traffic
```

## API Endpoints

All API endpoints are available through tRPC at `/api/trpc/*`:

- `federations.*` - Federation management
- `clubs.*` - Club management
- `events.*` - Event/calendar management
- `athletes.*` - Athlete profiles
- `coaches.*` - Coach management
- `venues.*` - Venue/facility management

## Database Schema

All tables use the **`sportsplatform_`** prefix (`drizzle/schema.ts` is the source of
truth). An older `namibia_na_26_` prefix appears in some legacy docs and in
`supabase-migration.sql` — it is **not** what the live schema uses.

- `sportsplatform_federations` - 65 sporting bodies
- `sportsplatform_clubs` - Clubs linked to federations
- `sportsplatform_events` - Competitions and events
- `sportsplatform_athletes` - Athlete profiles
- `sportsplatform_coaches` - Coach profiles
- `sportsplatform_venues` - Sports facilities
- `sportsplatform_schools` - Schools offering sports
- `sportsplatform_media` - Photos and videos
- `sportsplatform_hp_programs` - High-performance programs

Tenant isolation is enforced by the tRPC layer, **not** by RLS — see
[`docs/architecture/RLS_POLICIES.md`](docs/architecture/RLS_POLICIES.md) before
assuming otherwise.

## Support

For deployment issues or questions, refer to:
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Supabase Documentation](https://supabase.com/docs)
- [tRPC Documentation](https://trpc.io/docs)

## License

MIT
