# SECURITY: Credential rotation (Postgres + Supabase)

**Status:** CRITICAL — plaintext Postgres password (and a service-role JWT) were committed in git history. Scrubbing the working tree does **not** revoke access. A human with Supabase/Cloudflare/Netlify access must rotate **now**.

Agents cannot rotate the live password without dashboard access.

---

## What was exposed

| Secret | Where it appeared (scrubbed in tree) | Risk |
|--------|--------------------------------------|------|
| Supabase `postgres` DB password | `README.md`, `DEPLOYMENT_GUIDE.md`, `docs/design/NETLIFY_DEPLOYMENT.md`, `scripts/apply-seed.mjs`, `docs/scripts/test-db-connection.mjs` | Full DB access (shared project) |
| `SUPABASE_SERVICE_ROLE_KEY` | `scripts/seed-via-supabase.mjs` | Bypasses RLS |

Treat both as compromised until rotated. Assume git history and any forks/clones still contain the old values.

---

## Checklist (do in order)

### 1. Rotate Supabase database password — NOW

1. Open [Supabase Dashboard](https://supabase.com/dashboard) → project `rbibqjgsnrueubrvyqps`.
2. **Project Settings → Database → Database password → Reset database password**.
3. Generate a strong password; store it only in a password manager / secrets store.
4. Copy the new **URI** connection strings (session pooler `:5432` and/or transaction pooler `:6543`).
5. URL-encode special characters in the password when building `DATABASE_URL`.

### 2. Rotate Supabase API keys (service role at minimum)

1. **Project Settings → API**.
2. Rotate / regenerate the **service_role** key (and consider rotating **anon** if this project’s keys were ever misused).
3. Update every consumer that stores these keys (below).

### 3. Update Cloudflare Hyperdrive

Workers reach Postgres via Hyperdrive (`wrangler.jsonc` binding `HYPERDRIVE`), not a committed `DATABASE_URL`.

1. After the DB password change, update the Hyperdrive config’s origin connection string to use the **new** password (and ideally a least-privilege role — not the `postgres` superuser).
2. Dashboard: Cloudflare → Hyperdrive → config tied to id in `wrangler.jsonc` → edit connection string  
   **or** recreate with:
   ```bash
   npx wrangler hyperdrive update <HYPERDRIVE_ID> --connection-string="postgresql://<role>:<NEW_PASSWORD>@<host>:5432/postgres"
   ```
3. Prefer a scoped DB role limited to `sportsplatform_*` tables (this Supabase project is shared).

### 4. Update Worker / Netlify / local secrets

| Target | Action |
|--------|--------|
| Cloudflare Worker secrets | `npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY` (and anon if rotated). Redeploy if needed. |
| Hyperdrive | Step 3 — connection string with new DB password |
| Netlify env (if still used) | Site settings → Environment variables → update `DATABASE_URL` / Supabase keys |
| Local `.env` | Replace `DATABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` from `.env.example` placeholders — never commit `.env` |
| CI / Workers Builds | Update any encrypted env vars that held the old password or service role |

### 5. Verify the app still connects

1. Local: `DATABASE_URL=... node docs/scripts/test-db-connection.mjs` (expects federations count).
2. Staging Worker: hit a public tRPC query (e.g. federations list) — must return 200 with data.
3. Production (`sports.com.na`): same smoke check after deploy.
4. Confirm storage uploads still work if they use `SUPABASE_SERVICE_ROLE_KEY`.

### 6. Optional hardening after rotation

- [ ] Create a least-privilege Postgres role for Hyperdrive (no superuser).
- [ ] Revoke/rotate any other leaked keys found in git history (`git log -p -S 'postgresql://postgres:'`).
- [ ] Consider history rewrite only if the repo was private and you accept the cost; public history = assume forever leaked → rotation is the real fix.
- [ ] Enable Supabase leaked-password / audit alerts if available.

---

## Placeholders (safe for docs)

Use only forms like `.env.example`:

```
DATABASE_URL=postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true
SUPABASE_SERVICE_ROLE_KEY=
```

Never paste real passwords or JWTs into markdown, scripts, or `wrangler.jsonc`.
