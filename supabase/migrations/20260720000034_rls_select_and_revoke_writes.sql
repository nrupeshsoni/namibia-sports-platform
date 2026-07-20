-- Residual RLS harden: published/active SELECT + revoke write GRANTs
-- WHY: After 20260720000030, catalog SELECT still USING (true) leaked unpublished
-- news/events (and inactive federations) via PostgREST. anon/authenticated also
-- retained INSERT/UPDATE/DELETE/TRUNCATE table privileges; RLS denied writes but
-- defense-in-depth requires REVOKE. App mutations use Hyperdrive/postgres (not
-- anon/authenticated). Draft visibility for admins remains via existing FOR ALL
-- write policies (SELECT path) + new explicit draft SELECT policies.

-- ===== Tighten public SELECT (published / active / visible only) =====
DROP POLICY IF EXISTS sportsplatform_news_articles_select_public ON public.sportsplatform_news_articles;
CREATE POLICY sportsplatform_news_articles_select_public
  ON public.sportsplatform_news_articles FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

DROP POLICY IF EXISTS sportsplatform_events_select_public ON public.sportsplatform_events;
CREATE POLICY sportsplatform_events_select_public
  ON public.sportsplatform_events FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

-- Streams have no is_published; hide empty drafts (no URL / schedule / live flag)
DROP POLICY IF EXISTS sportsplatform_live_streams_select_public ON public.sportsplatform_live_streams;
CREATE POLICY sportsplatform_live_streams_select_public
  ON public.sportsplatform_live_streams FOR SELECT
  TO anon, authenticated
  USING (
    is_live = true
    OR scheduled_start IS NOT NULL
    OR stream_url IS NOT NULL
    OR embed_url IS NOT NULL
  );

DROP POLICY IF EXISTS sportsplatform_federations_select_public ON public.sportsplatform_federations;
CREATE POLICY sportsplatform_federations_select_public
  ON public.sportsplatform_federations FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

DROP POLICY IF EXISTS sportsplatform_clubs_select_public ON public.sportsplatform_clubs;
CREATE POLICY sportsplatform_clubs_select_public
  ON public.sportsplatform_clubs FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

DROP POLICY IF EXISTS sportsplatform_athletes_select_public ON public.sportsplatform_athletes;
CREATE POLICY sportsplatform_athletes_select_public
  ON public.sportsplatform_athletes FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

DROP POLICY IF EXISTS sportsplatform_coaches_select_public ON public.sportsplatform_coaches;
CREATE POLICY sportsplatform_coaches_select_public
  ON public.sportsplatform_coaches FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

DROP POLICY IF EXISTS sportsplatform_venues_select_public ON public.sportsplatform_venues;
CREATE POLICY sportsplatform_venues_select_public
  ON public.sportsplatform_venues FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

DROP POLICY IF EXISTS sportsplatform_hp_programs_select_public ON public.sportsplatform_hp_programs;
CREATE POLICY sportsplatform_hp_programs_select_public
  ON public.sportsplatform_hp_programs FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

-- Explicit draft/inactive SELECT for staff (FOR ALL also covers this; keep clear)
CREATE POLICY sportsplatform_news_articles_select_staff
  ON public.sportsplatform_news_articles FOR SELECT
  TO authenticated
  USING (sportsplatform_private.is_federation_admin(federation_id));

CREATE POLICY sportsplatform_events_select_staff
  ON public.sportsplatform_events FOR SELECT
  TO authenticated
  USING (sportsplatform_private.is_federation_admin(federation_id));

CREATE POLICY sportsplatform_live_streams_select_staff
  ON public.sportsplatform_live_streams FOR SELECT
  TO authenticated
  USING (sportsplatform_private.is_federation_admin(federation_id));

CREATE POLICY sportsplatform_federations_select_staff
  ON public.sportsplatform_federations FOR SELECT
  TO authenticated
  USING (sportsplatform_private.is_admin());

CREATE POLICY sportsplatform_clubs_select_staff
  ON public.sportsplatform_clubs FOR SELECT
  TO authenticated
  USING (sportsplatform_private.is_federation_admin(federation_id));

CREATE POLICY sportsplatform_athletes_select_staff
  ON public.sportsplatform_athletes FOR SELECT
  TO authenticated
  USING (sportsplatform_private.is_federation_admin(federation_id));

CREATE POLICY sportsplatform_coaches_select_staff
  ON public.sportsplatform_coaches FOR SELECT
  TO authenticated
  USING (sportsplatform_private.is_federation_admin(federation_id));

CREATE POLICY sportsplatform_venues_select_staff
  ON public.sportsplatform_venues FOR SELECT
  TO authenticated
  USING (sportsplatform_private.is_admin());

CREATE POLICY sportsplatform_hp_programs_select_staff
  ON public.sportsplatform_hp_programs FOR SELECT
  TO authenticated
  USING (sportsplatform_private.is_federation_admin(federation_id));

-- ===== REVOKE write privileges from PostgREST roles =====
-- service_role / postgres / Hyperdrive owners keep their grants; not touched.
DO $$
DECLARE
  t text;
BEGIN
  FOREACH t IN ARRAY ARRAY[
    'sportsplatform_federations',
    'sportsplatform_clubs',
    'sportsplatform_events',
    'sportsplatform_athletes',
    'sportsplatform_coaches',
    'sportsplatform_venues',
    'sportsplatform_news_articles',
    'sportsplatform_live_streams',
    'sportsplatform_whatsapp_subscriptions',
    'sportsplatform_schools',
    'sportsplatform_media',
    'sportsplatform_hp_programs',
    'sportsplatform_users'
  ]
  LOOP
    EXECUTE format(
      'REVOKE INSERT, UPDATE, DELETE, TRUNCATE ON TABLE public.%I FROM anon, authenticated',
      t
    );
  END LOOP;
END $$;
