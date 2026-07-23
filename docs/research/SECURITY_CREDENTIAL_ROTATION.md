# SECURITY: Credential rotation (Postgres + Supabase)

**Status:** CRITICAL — plaintext Postgres password (and a service-role JWT) were committed in git history. Scrubbing the working tree does **not** revoke access. A human with Supabase/Cloudflare access must finish rotation **now**.

**Project:** `rbibqjgsnrueubrvyqps` (EU West)  
**Hyperdrive config id** (from `wrangler.jsonc`): `dbfcf635ad4a475ba991743b94a5d6a2`  
**Account id** (from `wrangler.jsonc`): `172d6c3857f7ef25ecc5caadc9381e9f`

Agents cannot rotate the live password or `service_role` without dashboard access. Never paste real passwords or JWTs into git, chat logs, or `wrangler.jsonc`.

---

## What was exposed

| Secret | Where it appeared (scrubbed in tree) | Risk |
|--------|--------------------------------------|------|
| Supabase `postgres` DB password | `README.md`, `DEPLOYMENT_GUIDE.md`, `docs/design/NETLIFY_DEPLOYMENT.md`, `scripts/apply-seed.mjs`, `docs/scripts/test-db-connection.mjs` | Full DB access (shared project) |
| `SUPABASE_SERVICE_ROLE_KEY` | `scripts/seed-via-supabase.mjs` | Bypasses RLS (PostgREST / Storage) |

Treat both as compromised until rotated. Assume git history and any forks/clones still contain the old values.

---

## Already done in DB (agent / MCP — 2026-07-23)

Applied migration `create_sportsplatform_app_role` (Supabase version `20260723200947`; repo copy `supabase/migrations/20260723230000_create_sportsplatform_app_role.sql`):

| Item | Result |
|------|--------|
| Role `sportsplatform_app` | Exists: `LOGIN`, `rolsuper=false`, `rolbypassrls=false`, no CREATEDB/CREATEROLE |
| Schema | `GRANT USAGE ON SCHEMA public` |
| Tables | `SELECT/INSERT/UPDATE/DELETE` on all `sportsplatform_*` tables (13) including `sportsplatform_users` |
| Sequences | `USAGE, SELECT` on all `sportsplatform_*` sequences |
| Password | **Not set** — role cannot authenticate until a human sets one |
| Bare `users` table | **No grant** (app uses `sportsplatform_users` only) |
| `ALTER DEFAULT PRIVILEGES` | **Skipped on purpose** — shared DB (~737 tables); broad defaults would leak other products’ future tables |

**Not done (human only):** set role password, point Hyperdrive at the role, rotate `postgres` password, rotate `service_role`, update Worker secrets, smoke-test.

---

## Copy-paste checklist (human — do in order)

### A. Set password for `sportsplatform_app` (required before Hyperdrive switch)

1. Open [Supabase SQL Editor](https://supabase.com/dashboard/project/rbibqjgsnrueubrvyqps/sql) for project `rbibqjgsnrueubrvyqps`.
2. Generate a strong password in a password manager (do **not** reuse the leaked `postgres` password).
3. Run (replace the placeholder yourself; do not commit the password):

```sql
ALTER ROLE sportsplatform_app PASSWORD '<PASTE_NEW_STRONG_PASSWORD>';
```

4. Confirm login attributes (should already match):

```sql
SELECT rolname, rolsuper, rolbypassrls, rolcanlogin
FROM pg_roles
WHERE rolname = 'sportsplatform_app';
-- expect: false, false, true
```

### B. Point Hyperdrive at the least-privilege role

**Hyperdrive id:** `dbfcf635ad4a475ba991743b94a5d6a2`  
**Binding:** `HYPERDRIVE` in `wrangler.jsonc` (production + staging env currently share this id).

Prefer **session / direct** Postgres host (port **5432**), not transaction pooler `:6543`, for Hyperdrive.

Connection string shape (**placeholders only** — never commit the filled string):

```
postgresql://sportsplatform_app:<URL_ENCODED_PASSWORD>@db.rbibqjgsnrueubrvyqps.supabase.co:5432/postgres
```

If Supabase requires the pooler username form for your network path:

```
postgresql://sportsplatform_app.rbibqjgsnrueubrvyqps:<URL_ENCODED_PASSWORD>@aws-0-eu-west-1.pooler.supabase.com:5432/postgres
```

**Option 1 — Cloudflare Dashboard**

1. Cloudflare → account that owns Worker `namibia-sports-platform` → **Hyperdrive**.
2. Open config id `dbfcf635ad4a475ba991743b94a5d6a2`.
3. Edit origin connection string → use `sportsplatform_app` + new password (not `postgres`).
4. Save. No `wrangler.jsonc` change needed if the id stays the same.

**Option 2 — Wrangler CLI** (run locally; password stays in your shell history — prefer Dashboard if unsure):

```bash
npx wrangler hyperdrive update dbfcf635ad4a475ba991743b94a5d6a2 --connection-string="postgresql://sportsplatform_app:<URL_ENCODED_PASSWORD>@db.rbibqjgsnrueubrvyqps.supabase.co:5432/postgres"
```

Do **not** put the real connection string in git, PR descriptions, or agent chat.

### C. Rotate the compromised `postgres` password

1. Supabase Dashboard → project `rbibqjgsnrueubrvyqps` → **Project Settings → Database → Database password → Reset**.
2. Store the new password in a password manager only.
3. Update any **local/CI** tools that still use `postgres` (migrations, one-off scripts). Production Worker traffic should use Hyperdrive → `sportsplatform_app` after step B.
4. If anything still pointed Hyperdrive at `postgres`, re-do step B with the new `sportsplatform_app` password (role password is independent of the `postgres` password reset — only reset of the role’s own password would require B again).

### D. Rotate Supabase API keys (service_role — dashboard only)

1. **Project Settings → API**.
2. Rotate / regenerate **`service_role`** (consider rotating **anon** only if you believe it was abused alongside the leak).
3. Agents must **not** rotate service_role via API automation from this checklist.

### E. Update Worker / local / CI secrets

| Target | Action |
|--------|--------|
| Cloudflare Worker secrets | `npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY` (and anon if rotated). |
| Hyperdrive | Step B — already uses DB role password, not Worker secrets |
| Local `.env` | Replace `DATABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` from `.env.example` placeholders — never commit `.env` |
| CI / Workers Builds | Update any encrypted env vars that held the old password or service role |
| Netlify (dead) | Ignore unless something still reads old Netlify env |

Redeploy after secrets change if the Worker was built/cached with old values:

```bash
npm run cf:deploy
```

### F. Verify

1. Local (optional): `DATABASE_URL=... node docs/scripts/test-db-connection.mjs` using a URL that uses **`sportsplatform_app`**, not `postgres`.
2. Staging / production: public tRPC query (e.g. federations list) returns 200 with data.
3. Confirm Storage uploads still work (`SUPABASE_SERVICE_ROLE_KEY` path).
4. Optional: from SQL editor as a privileged role, confirm the app role has **no** privilege on unrelated tables:

```sql
SELECT has_table_privilege('sportsplatform_app', 'public.users', 'SELECT') AS bare_users;
-- expect: false
```

### G. After adding new `sportsplatform_*` tables

Re-run the grant block in `supabase/migrations/20260723230000_create_sportsplatform_app_role.sql` (or re-apply the same `DO $$ … GRANT …` loop). Do **not** add `ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public`.

---

## Optional hardening after rotation

- [ ] Revoke/rotate any other leaked keys found in git history (`git log -p -S 'postgresql://postgres:'` — do not paste secrets into tickets).
- [ ] Consider history rewrite only if the repo was private and you accept the cost; public history = assume forever leaked → rotation is the real fix.
- [ ] Enable Supabase leaked-password / audit alerts if available.
- [ ] Give staging its **own** Hyperdrive id (today staging reuses `dbfcf635ad4a475ba991743b94a5d6a2`).

---

## Placeholders (safe for docs)

Use only forms like `.env.example`:

```
DATABASE_URL=postgresql://sportsplatform_app.[PROJECT_REF]:[PASSWORD]@aws-0-eu-west-1.pooler.supabase.com:5432/postgres
SUPABASE_SERVICE_ROLE_KEY=
```

Never paste real passwords or JWTs into markdown, scripts, or `wrangler.jsonc`.
