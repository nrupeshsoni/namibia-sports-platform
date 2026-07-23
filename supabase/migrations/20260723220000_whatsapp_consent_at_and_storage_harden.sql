-- WHY: Production hardening — WhatsApp consent timestamp (POPIA / Meta opt-in)
-- and sportsplatform_* Storage MIME allowlist + public SELECT only (uploads via
-- service_role from the Worker; no anon/authenticated INSERT policies).
-- Applied live via Supabase MCP 2026-07-23.

ALTER TABLE public.sportsplatform_whatsapp_subscriptions
  ADD COLUMN IF NOT EXISTS consent_at timestamp without time zone;

UPDATE storage.buckets
SET allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']::text[]
WHERE id IN (
  'sportsplatform_athlete_photos',
  'sportsplatform_event_posters',
  'sportsplatform_images',
  'sportsplatform_logos',
  'sportsplatform_news_images'
);

-- Public read for CDN/API SELECT. No INSERT/UPDATE/DELETE policies for these
-- buckets — anon/authenticated writes fail closed; service_role bypasses RLS.
DO $$
DECLARE
  b text;
  policy_name text;
BEGIN
  FOREACH b IN ARRAY ARRAY[
    'sportsplatform_athlete_photos',
    'sportsplatform_event_posters',
    'sportsplatform_images',
    'sportsplatform_logos',
    'sportsplatform_news_images'
  ]
  LOOP
    policy_name := b || '_public_select';
    IF NOT EXISTS (
      SELECT 1 FROM pg_policies
      WHERE schemaname = 'storage' AND tablename = 'objects' AND policyname = policy_name
    ) THEN
      EXECUTE format(
        'CREATE POLICY %I ON storage.objects FOR SELECT TO public USING (bucket_id = %L)',
        policy_name,
        b
      );
    END IF;
  END LOOP;
END $$;
