-- RLS and Indexes for Namibia Sports Platform
-- Table prefix: sportsplatform_
-- Run via Supabase SQL editor or MCP

-- ===== INDEXES =====
CREATE INDEX IF NOT EXISTS idx_sportsplatform_federations_slug ON sportsplatform_federations(slug);
CREATE INDEX IF NOT EXISTS idx_sportsplatform_events_federation_date ON sportsplatform_events(federation_id, start_date);
CREATE INDEX IF NOT EXISTS idx_sportsplatform_events_slug ON sportsplatform_events(slug);
CREATE INDEX IF NOT EXISTS idx_sportsplatform_news_federation_published ON sportsplatform_news_articles(federation_id, published_at DESC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_sportsplatform_news_is_published ON sportsplatform_news_articles(is_published) WHERE is_published = true;
CREATE INDEX IF NOT EXISTS idx_sportsplatform_clubs_federation_id ON sportsplatform_clubs(federation_id);
CREATE INDEX IF NOT EXISTS idx_sportsplatform_clubs_federation_region ON sportsplatform_clubs(federation_id, region);
CREATE INDEX IF NOT EXISTS idx_sportsplatform_clubs_slug ON sportsplatform_clubs(slug);
CREATE INDEX IF NOT EXISTS idx_sportsplatform_streams_live ON sportsplatform_live_streams(is_live) WHERE is_live = true;
CREATE INDEX IF NOT EXISTS idx_sportsplatform_streams_scheduled ON sportsplatform_live_streams(scheduled_start) WHERE scheduled_start IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_sportsplatform_whatsapp_active ON sportsplatform_whatsapp_subscriptions(federation_id, is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_sportsplatform_athletes_federation_id ON sportsplatform_athletes(federation_id);
CREATE INDEX IF NOT EXISTS idx_sportsplatform_media_entity ON sportsplatform_media(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_sportsplatform_hp_programs_federation ON sportsplatform_hp_programs(federation_id);

-- ===== ROW LEVEL SECURITY =====
-- Public read for all; mutations only via service_role (app server)

ALTER TABLE sportsplatform_federations ENABLE ROW LEVEL SECURITY;
ALTER TABLE sportsplatform_clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE sportsplatform_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE sportsplatform_athletes ENABLE ROW LEVEL SECURITY;
ALTER TABLE sportsplatform_coaches ENABLE ROW LEVEL SECURITY;
ALTER TABLE sportsplatform_venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE sportsplatform_news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE sportsplatform_live_streams ENABLE ROW LEVEL SECURITY;
ALTER TABLE sportsplatform_whatsapp_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE sportsplatform_schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE sportsplatform_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE sportsplatform_hp_programs ENABLE ROW LEVEL SECURITY;

-- Public read policies (anon and authenticated can SELECT)
CREATE POLICY "Public read federations" ON sportsplatform_federations FOR SELECT USING (true);
CREATE POLICY "Public read clubs" ON sportsplatform_clubs FOR SELECT USING (true);
CREATE POLICY "Public read events" ON sportsplatform_events FOR SELECT USING (true);
CREATE POLICY "Public read athletes" ON sportsplatform_athletes FOR SELECT USING (true);
CREATE POLICY "Public read coaches" ON sportsplatform_coaches FOR SELECT USING (true);
CREATE POLICY "Public read venues" ON sportsplatform_venues FOR SELECT USING (true);
CREATE POLICY "Public read news_articles" ON sportsplatform_news_articles FOR SELECT USING (true);
CREATE POLICY "Public read live_streams" ON sportsplatform_live_streams FOR SELECT USING (true);
CREATE POLICY "Public read whatsapp_subscriptions" ON sportsplatform_whatsapp_subscriptions FOR SELECT USING (true);
CREATE POLICY "Public read schools" ON sportsplatform_schools FOR SELECT USING (true);
CREATE POLICY "Public read media" ON sportsplatform_media FOR SELECT USING (true);
CREATE POLICY "Public read hp_programs" ON sportsplatform_hp_programs FOR SELECT USING (true);

-- Service role bypasses RLS by default in Supabase; no INSERT/UPDATE/DELETE policies needed for anon
-- (default is deny, so anon cannot mutate; service_role bypasses and can mutate)
