# CI/CD — Cloudflare Workers Builds

> **Production hosting is Cloudflare Workers** (not Netlify). Ignore legacy
> Netlify deploy docs elsewhere in the tree; this file is authoritative for CI/CD.

The `namibia-sports-platform` Worker auto-deploys from GitHub via **Cloudflare
Workers Builds**.

- **Repository:** `nrupeshsoni/namibia-sports-platform`
- **Production branch:** `main` → deploys to the apex `sports.com.na`
- **Local / required quality gate:** `npm run ci:gate`  
  (`check` + `test` + `build` — see `package.json`)
- **Workers Builds build command (recommended):** `npm run ci:gate`  
  Falls back to `npm run build` only if the dashboard cannot be updated yet —
  **do not treat build-only as sufficient for production confidence.**
- **Deploy command:** `npx wrangler deploy` (reads `wrangler.jsonc`)

## Quality gate (mandatory before deploy)

Before any production deploy (manual or CI), the following must pass:

```bash
npm run check   # tsc --noEmit
npm run test    # vitest run (includes federationScope cross-tenant FORBIDDEN cases)
npm run build   # vite build → dist/public
```

Or in one shot:

```bash
npm run ci:gate
```

Local scripts `npm run cf:deploy` and `npm run cf:deploy:staging` already run
`ci:gate` before `wrangler deploy`.

### Workers Builds dashboard

Build/deploy commands live in the **Cloudflare dashboard** (or Builds Triggers
API), not in `wrangler.jsonc`. The Builds MCP can **read** build history
(including the commands used) but **cannot** change trigger settings. Wrangler
OAuth also lacks **Workers Builds Configuration** edit, so agents cannot PATCH
triggers without a dedicated API token.

**Verified 2026-07-23** (account `172d6c3857f7ef25ecc5caadc9381e9f`, Worker
`namibia-sports-platform`): latest successful build still ran
`npm run build` → `npx wrangler deploy`. Change the dashboard so the next push
runs the full gate:

1. Open [Cloudflare Dashboard](https://dash.cloudflare.com/) → account
   **Nrupesh@facilit8.com.na** (not The Dome Namibia).
2. **Workers & Pages** → **namibia-sports-platform**.
3. **Settings** → **Build**.
4. Set **Build command** to `npm run ci:gate` (was `npm run build`).
5. Leave **Deploy command** as `npx wrangler deploy` (do not change secrets).
6. **Save**. Applies to the **next** build only (retries use settings at retry time).

Optional API (needs a user API token with **Workers Builds Configuration: Edit**):

```bash
# GET …/builds/workers/{worker_tag}/triggers  → trigger_uuid
# PATCH …/builds/triggers/{trigger_uuid}
# body: {"build_command":"npm run ci:gate"}
```

Do **not** add a `prepare` hook that runs the full gate — that would slow every
`npm install`.

Every push to `main` builds and deploys automatically. Secrets
(`SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) live in the Worker and are
injected at runtime — not in the repo.

## Tenancy regression tests

`server/federationScope.test.ts` covers:

- Unit: `assertSameFederation`, `canIncludeUnpublished`, `canIncludeInactive`,
  `canViewNonPublic`
- Cross-tenant FORBIDDEN via real tRPC callers for federation-scoped mutations
  (including `events` / `news` / `streams` / `upload`)
- Same-tenant pass-through negative controls (guard allows; failure is DB/storage)

`server/federationScopeDbFirst.test.ts` (mocked `getDb`) covers DB-first paths:

- `media.create` / `media.delete` (federation + club entity ownership)
- `coaches.update` / `coaches.delete`, `hpPrograms.update` / `hpPrograms.delete`
- `upload.image` entity ownership (A1): own `federationId` + foreign `entityId`,
  venue reject, missing row, matching ownership success

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
