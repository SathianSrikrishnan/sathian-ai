-- Toothlight V4 creation UX: preserve original source and rendered Light Style output.

ALTER TABLE tfn_toothlights
  ADD COLUMN IF NOT EXISTS source_image_uri TEXT,
  ADD COLUMN IF NOT EXISTS rendered_image_uri TEXT,
  ADD COLUMN IF NOT EXISTS treatment_id TEXT,
  ADD COLUMN IF NOT EXISTS treatment_version TEXT;

UPDATE tfn_toothlights
SET
  source_image_uri = COALESCE(source_image_uri, image_uri),
  rendered_image_uri = COALESCE(rendered_image_uri, image_uri),
  treatment_id = COALESCE(treatment_id, glow_id),
  treatment_version = COALESCE(treatment_version, 'legacy-glow-v0');

CREATE INDEX IF NOT EXISTS idx_tfn_toothlights_treatment_id
  ON tfn_toothlights(treatment_id);
