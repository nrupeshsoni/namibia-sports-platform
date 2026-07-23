-- WHY: Hyperdrive currently connects as postgres (rolbypassrls=true). Create a
-- least-privilege login role limited to sportsplatform_* for the Worker DB path
-- (audit C2 / gap B1). Password is NOT set here — a human must
-- ALTER ROLE sportsplatform_app PASSWORD '...' then point Hyperdrive
-- id dbfcf635ad4a475ba991743b94a5d6a2 at that role.
--
-- Role attribute flags (NOSUPERUSER/NOBYPASSRLS) are Postgres defaults for new
-- roles; Supabase's migrator cannot ALTER those attributes (needs SUPERUSER).
-- Do NOT use ALTER DEFAULT PRIVILEGES FOR ROLE postgres on public — shared DB
-- (~737 tables). Re-run the grant DO block after adding sportsplatform_* tables.
--
-- Applied live via Supabase MCP 2026-07-23 (migration name:
-- create_sportsplatform_app_role). Safe to re-run (idempotent).

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'sportsplatform_app') THEN
    CREATE ROLE sportsplatform_app LOGIN;
  END IF;
END
$$;

GRANT USAGE ON SCHEMA public TO sportsplatform_app;

DO $$
DECLARE
  r record;
BEGIN
  FOR r IN
    SELECT c.relname AS name
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND c.relkind IN ('r', 'p')
      AND c.relname LIKE 'sportsplatform_%'
  LOOP
    EXECUTE format(
      'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.%I TO sportsplatform_app',
      r.name
    );
  END LOOP;

  FOR r IN
    SELECT c.relname AS name
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND c.relkind = 'S'
      AND c.relname LIKE 'sportsplatform_%'
  LOOP
    EXECUTE format(
      'GRANT USAGE, SELECT ON SEQUENCE public.%I TO sportsplatform_app',
      r.name
    );
  END LOOP;
END
$$;
