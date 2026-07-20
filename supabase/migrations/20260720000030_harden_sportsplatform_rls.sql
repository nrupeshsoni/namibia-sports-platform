-- Harden sportsplatform_* RLS (prod blocker)
-- WHY: Live policies allowed any authenticated user INSERT/UPDATE/DELETE on all
-- sportsplatform_* tables via PostgREST, bypassing tRPC RBAC. Public SELECT stays
-- for catalog content; writes require platform admin or federation_admin scoped to
-- federation_id. service_role and table-owner connections (Hyperdrive/tRPC) bypass RLS.
-- open_id on sportsplatform_users stores auth.users.id (see ensureUser / createContext).
--
-- NOTE: Live user_role enum historically only had (user, admin). Drizzle defines
-- federation_admin / club_manager — add those labels here. Role checks use ::text
-- so new enum labels are safe to reference in the same transaction as ADD VALUE.

-- Align enum with drizzle/schema.ts (IF NOT EXISTS is a no-op when already present)
ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'federation_admin';
ALTER TYPE public.user_role ADD VALUE IF NOT EXISTS 'club_manager';

-- ===== Helper schema (SECURITY DEFINER not exposed as a data API surface) =====
CREATE SCHEMA IF NOT EXISTS sportsplatform_private;

REVOKE ALL ON SCHEMA sportsplatform_private FROM PUBLIC;
GRANT USAGE ON SCHEMA sportsplatform_private TO anon, authenticated, service_role;

CREATE OR REPLACE FUNCTION sportsplatform_private.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.sportsplatform_users u
    WHERE u.open_id = (SELECT auth.uid()::text)
      AND u.role::text = 'admin'
  );
$$;

CREATE OR REPLACE FUNCTION sportsplatform_private.is_federation_admin(p_federation_id integer)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.sportsplatform_users u
    WHERE u.open_id = (SELECT auth.uid()::text)
      AND (
        u.role::text = 'admin'
        OR (
          u.role::text = 'federation_admin'
          AND p_federation_id IS NOT NULL
          AND u.federation_id IS NOT NULL
          AND u.federation_id = p_federation_id
        )
      )
  );
$$;

CREATE OR REPLACE FUNCTION sportsplatform_private.current_user_id()
RETURNS integer
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT u.id
  FROM public.sportsplatform_users u
  WHERE u.open_id = (SELECT auth.uid()::text)
  LIMIT 1;
$$;

REVOKE ALL ON FUNCTION sportsplatform_private.is_admin() FROM PUBLIC;
REVOKE ALL ON FUNCTION sportsplatform_private.is_federation_admin(integer) FROM PUBLIC;
REVOKE ALL ON FUNCTION sportsplatform_private.current_user_id() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION sportsplatform_private.is_admin() TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION sportsplatform_private.is_federation_admin(integer) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION sportsplatform_private.current_user_id() TO anon, authenticated, service_role;

-- ===== Drop overly-permissive policies =====
DO $$
DECLARE
  r record;
BEGIN
  FOR r IN
    SELECT schemaname, tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename LIKE 'sportsplatform_%'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
  END LOOP;
END $$;

-- Ensure RLS remains on (including users)
ALTER TABLE public.sportsplatform_federations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sportsplatform_clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sportsplatform_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sportsplatform_athletes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sportsplatform_coaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sportsplatform_venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sportsplatform_news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sportsplatform_live_streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sportsplatform_whatsapp_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sportsplatform_schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sportsplatform_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sportsplatform_hp_programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sportsplatform_users ENABLE ROW LEVEL SECURITY;

-- ===== SELECT: public catalog =====
CREATE POLICY sportsplatform_federations_select_public
  ON public.sportsplatform_federations FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY sportsplatform_clubs_select_public
  ON public.sportsplatform_clubs FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY sportsplatform_events_select_public
  ON public.sportsplatform_events FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY sportsplatform_athletes_select_public
  ON public.sportsplatform_athletes FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY sportsplatform_coaches_select_public
  ON public.sportsplatform_coaches FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY sportsplatform_venues_select_public
  ON public.sportsplatform_venues FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY sportsplatform_news_articles_select_public
  ON public.sportsplatform_news_articles FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY sportsplatform_live_streams_select_public
  ON public.sportsplatform_live_streams FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY sportsplatform_schools_select_public
  ON public.sportsplatform_schools FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY sportsplatform_media_select_public
  ON public.sportsplatform_media FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY sportsplatform_hp_programs_select_public
  ON public.sportsplatform_hp_programs FOR SELECT
  TO anon, authenticated
  USING (true);

-- Users: self or admin only (no directory dump via PostgREST)
CREATE POLICY sportsplatform_users_select_own_or_admin
  ON public.sportsplatform_users FOR SELECT
  TO authenticated
  USING (
    open_id = (SELECT auth.uid()::text)
    OR sportsplatform_private.is_admin()
  );

-- WhatsApp: own subscriptions or admin (phone numbers are PII)
CREATE POLICY sportsplatform_whatsapp_select_own_or_admin
  ON public.sportsplatform_whatsapp_subscriptions FOR SELECT
  TO authenticated
  USING (
    user_id = sportsplatform_private.current_user_id()
    OR sportsplatform_private.is_admin()
  );

-- ===== WRITE: federations — platform admin only =====
CREATE POLICY sportsplatform_federations_write_admin
  ON public.sportsplatform_federations FOR ALL
  TO authenticated
  USING (sportsplatform_private.is_admin())
  WITH CHECK (sportsplatform_private.is_admin());

-- ===== WRITE: federation-scoped tables =====
CREATE POLICY sportsplatform_clubs_write_fed_admin
  ON public.sportsplatform_clubs FOR ALL
  TO authenticated
  USING (sportsplatform_private.is_federation_admin(federation_id))
  WITH CHECK (sportsplatform_private.is_federation_admin(federation_id));

CREATE POLICY sportsplatform_events_write_fed_admin
  ON public.sportsplatform_events FOR ALL
  TO authenticated
  USING (sportsplatform_private.is_federation_admin(federation_id))
  WITH CHECK (sportsplatform_private.is_federation_admin(federation_id));

CREATE POLICY sportsplatform_athletes_write_fed_admin
  ON public.sportsplatform_athletes FOR ALL
  TO authenticated
  USING (sportsplatform_private.is_federation_admin(federation_id))
  WITH CHECK (sportsplatform_private.is_federation_admin(federation_id));

CREATE POLICY sportsplatform_coaches_write_fed_admin
  ON public.sportsplatform_coaches FOR ALL
  TO authenticated
  USING (sportsplatform_private.is_federation_admin(federation_id))
  WITH CHECK (sportsplatform_private.is_federation_admin(federation_id));

CREATE POLICY sportsplatform_news_articles_write_fed_admin
  ON public.sportsplatform_news_articles FOR ALL
  TO authenticated
  USING (sportsplatform_private.is_federation_admin(federation_id))
  WITH CHECK (sportsplatform_private.is_federation_admin(federation_id));

CREATE POLICY sportsplatform_live_streams_write_fed_admin
  ON public.sportsplatform_live_streams FOR ALL
  TO authenticated
  USING (sportsplatform_private.is_federation_admin(federation_id))
  WITH CHECK (sportsplatform_private.is_federation_admin(federation_id));

CREATE POLICY sportsplatform_hp_programs_write_fed_admin
  ON public.sportsplatform_hp_programs FOR ALL
  TO authenticated
  USING (sportsplatform_private.is_federation_admin(federation_id))
  WITH CHECK (sportsplatform_private.is_federation_admin(federation_id));

-- Venues / schools / media: no federation_id — platform admin only via PostgREST
CREATE POLICY sportsplatform_venues_write_admin
  ON public.sportsplatform_venues FOR ALL
  TO authenticated
  USING (sportsplatform_private.is_admin())
  WITH CHECK (sportsplatform_private.is_admin());

CREATE POLICY sportsplatform_schools_write_admin
  ON public.sportsplatform_schools FOR ALL
  TO authenticated
  USING (sportsplatform_private.is_admin())
  WITH CHECK (sportsplatform_private.is_admin());

CREATE POLICY sportsplatform_media_write_admin
  ON public.sportsplatform_media FOR ALL
  TO authenticated
  USING (sportsplatform_private.is_admin())
  WITH CHECK (sportsplatform_private.is_admin());

-- Users: no PostgREST role elevation; provisioning/mutations via tRPC (Hyperdrive)
CREATE POLICY sportsplatform_users_write_admin
  ON public.sportsplatform_users FOR ALL
  TO authenticated
  USING (sportsplatform_private.is_admin())
  WITH CHECK (sportsplatform_private.is_admin());

-- WhatsApp: own rows (user_id) or admin
CREATE POLICY sportsplatform_whatsapp_write_own_or_admin
  ON public.sportsplatform_whatsapp_subscriptions FOR ALL
  TO authenticated
  USING (
    user_id = sportsplatform_private.current_user_id()
    OR sportsplatform_private.is_admin()
  )
  WITH CHECK (
    user_id = sportsplatform_private.current_user_id()
    OR sportsplatform_private.is_admin()
  );
