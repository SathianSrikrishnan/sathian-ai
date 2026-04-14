-- Add tradition_slug to tfn_tooth_stories.
--
-- Why: The Tell step often flows from a story page (e.g. "Draw a tooth for
-- this story" on /toothfairy/story/tanda). Knowing which cultural tradition
-- inspired a given drawing lets us:
--   (a) surface the story on the keepsake page ("This tooth was drawn
--       after reading Tanda's story")
--   (b) power later analytics — which stories drive the most mints
--   (c) feed the fairy enhancement pipeline's tradition-specific prompts
--
-- Set by the frontend at mint time and persisted alongside the tooth_story
-- narrative so read paths can join it in a single query.

ALTER TABLE tfn_tooth_stories
  ADD COLUMN IF NOT EXISTS tradition_slug TEXT;

-- Optional lookup for "all mints for story X" analytics queries.
CREATE INDEX IF NOT EXISTS idx_tfn_tooth_stories_tradition_slug
  ON tfn_tooth_stories(tradition_slug)
  WHERE tradition_slug IS NOT NULL;
