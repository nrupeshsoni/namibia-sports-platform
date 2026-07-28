-- Lock obsolete namibia_na_26_* + orphan public.users on Sports (rbibqjgsnrueubrvyqps).
-- Live app uses sportsplatform_* via Hyperdrive/drizzle (not these tables).
-- public.users is empty legacy scaffold; live table is sportsplatform_users.
-- Applied remotely via Supabase MCP apply_migration: lockdown_namibia_na26_users_rls_deny_all

DO $$
DECLARE
  r record;
BEGIN
  FOR r IN
    SELECT c.relname
    FROM pg_class c
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname = 'public'
      AND c.relkind = 'r'
      AND (
        c.relname LIKE 'namibia_na_26_%'
        OR c.relname = 'users'
      )
  LOOP
    EXECUTE format('REVOKE ALL ON TABLE public.%I FROM anon, authenticated', r.relname);
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', r.relname);
    EXECUTE format('ALTER TABLE public.%I FORCE ROW LEVEL SECURITY', r.relname);
  END LOOP;
END $$;
