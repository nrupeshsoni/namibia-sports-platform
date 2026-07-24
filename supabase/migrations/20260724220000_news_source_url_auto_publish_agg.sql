-- WHY: Aggregated RSS news needs stable source attribution for SEO/AIO and outbound
-- "Read original" links. Auto-publish policy stores source_url/source_name; existing
-- agg-* drafts are published after Namibia+sports audit (58/58 had NA signals).

ALTER TABLE sportsplatform_news_articles
  ADD COLUMN IF NOT EXISTS source_url text,
  ADD COLUMN IF NOT EXISTS source_name text;

COMMENT ON COLUMN sportsplatform_news_articles.source_url IS
  'Canonical URL of original article (RSS link); never invent.';
COMMENT ON COLUMN sportsplatform_news_articles.source_name IS
  'Publisher/outlet display name for attribution.';

-- Backfill attribution from content footer: "---\nSource: Name\nhttps://..."
UPDATE sportsplatform_news_articles
SET
  source_name = COALESCE(
    source_name,
    NULLIF(trim((regexp_match(content, 'Source:\s*([^\n]+)'))[1]), '')
  ),
  source_url = COALESCE(
    source_url,
    NULLIF(
      trim((regexp_match(content, 'Source:[^\n]*\n(https?://[^\s]+)'))[1]),
      ''
    )
  )
WHERE slug LIKE 'agg-%'
  AND content IS NOT NULL
  AND (source_url IS NULL OR source_name IS NULL);

-- Auto-publish audited aggregator drafts (all 58 matched Namibia sports heuristics)
UPDATE sportsplatform_news_articles
SET
  is_published = true,
  published_at = COALESCE(published_at, created_at, now())
WHERE slug LIKE 'agg-%'
  AND is_published = false;
