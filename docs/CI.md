# CI/CD — Cloudflare Workers Builds

The `namibia-sports-platform` Worker auto-deploys from GitHub via **Cloudflare
Workers Builds**.

- **Repository:** `nrupeshsoni/namibia-sports-platform`
- **Production branch:** `main` → deploys to the apex `sports.com.na`
- **Build command:** `npm run build` (`vite build` → `dist/public`, served as Static Assets)
- **Deploy command:** `npx wrangler deploy` (reads `wrangler.jsonc`)

Every push to `main` builds and deploys automatically. Secrets
(`SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) live in the Worker and are
injected at runtime — not in the repo.

## Data layer

Postgres is reached through a **Hyperdrive** binding (`HYPERDRIVE`), not a direct
`DATABASE_URL`. The committed pooler `DATABASE_URL` is stale (Supabase migrated
the pooler host); Hyperdrive points at the Supabase **direct** connection
(`db.<ref>.supabase.co:5432`), which is also the recommended target since
Hyperdrive does its own pooling.

> Security TODO: the Hyperdrive config currently uses the `postgres` superuser
> credential that was committed to this repo. Rotate it and re-scope to a role
> limited to `sportsplatform_*`, then update the Hyperdrive config:
> `wrangler hyperdrive update namibia-sports-db --connection-string=…`

Manual deploy: `npm run cf:deploy` (production) / `npm run cf:deploy:staging`.
