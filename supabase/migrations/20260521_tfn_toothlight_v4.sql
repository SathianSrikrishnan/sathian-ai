-- Toothlight V4: family time-capsule product layer.
--
-- Keep the on-chain/cNFT record separate from private future notes. The
-- Toothlight can reference minted metadata and Smile Fund state, while private
-- letters/notes remain in user-owned Supabase rows.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'toothlight-images',
  'toothlight-images',
  true,
  5242880,
  ARRAY['image/png', 'image/jpeg', 'image/webp']
)
ON CONFLICT (id) DO UPDATE SET
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

CREATE TABLE IF NOT EXISTS tfn_toothlights (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  child_id UUID,
  child_profile_pda TEXT,
  milestone_pda TEXT,
  child_name TEXT,
  tooth_name TEXT NOT NULL,
  caption TEXT,
  glow_id TEXT NOT NULL DEFAULT 'starlace',
  image_uri TEXT,
  metadata_uri TEXT,
  cnft_asset_id TEXT,
  smile_fund_status TEXT NOT NULL DEFAULT 'none'
    CHECK (smile_fund_status IN ('none', 'pending', 'active')),
  share_status TEXT NOT NULL DEFAULT 'private'
    CHECK (share_status IN ('private', 'family_link', 'public')),
  unlock_age INTEGER NOT NULL DEFAULT 10,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tfn_toothlights_user_id
  ON tfn_toothlights(user_id);

CREATE INDEX IF NOT EXISTS idx_tfn_toothlights_child
  ON tfn_toothlights(child_id, child_profile_pda);

CREATE INDEX IF NOT EXISTS idx_tfn_toothlights_milestone_pda
  ON tfn_toothlights(milestone_pda);

CREATE TABLE IF NOT EXISTS tfn_future_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  toothlight_id UUID NOT NULL REFERENCES tfn_toothlights(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  status TEXT NOT NULL DEFAULT 'none'
    CHECK (status IN ('none', 'seed', 'started', 'sealed')),
  seed_note TEXT,
  note_body_encrypted TEXT,
  voice_note_uri TEXT,
  unlock_age INTEGER NOT NULL DEFAULT 10,
  unlock_date DATE,
  sealed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tfn_future_notes_user_id
  ON tfn_future_notes(user_id);

CREATE INDEX IF NOT EXISTS idx_tfn_future_notes_toothlight_id
  ON tfn_future_notes(toothlight_id);

CREATE UNIQUE INDEX IF NOT EXISTS idx_tfn_future_notes_toothlight_user_unique
  ON tfn_future_notes(toothlight_id, user_id);

CREATE TABLE IF NOT EXISTS tfn_family_contributions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  toothlight_id UUID NOT NULL REFERENCES tfn_toothlights(id) ON DELETE CASCADE,
  user_id UUID,
  contributor_name TEXT,
  contributor_email TEXT,
  node_kind TEXT NOT NULL DEFAULT 'family_note'
    CHECK (node_kind IN ('family_note', 'family_gift', 'family_note_gift')),
  note_status TEXT NOT NULL DEFAULT 'none'
    CHECK (note_status IN ('none', 'seed', 'sealed')),
  note_body_encrypted TEXT,
  gift_amount_cents INTEGER,
  gift_currency TEXT DEFAULT 'USD',
  payment_status TEXT NOT NULL DEFAULT 'demo'
    CHECK (payment_status IN ('demo', 'intent_created', 'paid', 'failed', 'refunded')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tfn_family_contributions_user_id
  ON tfn_family_contributions(user_id);

CREATE INDEX IF NOT EXISTS idx_tfn_family_contributions_toothlight_id
  ON tfn_family_contributions(toothlight_id);

CREATE TABLE IF NOT EXISTS tfn_product_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  toothlight_id UUID,
  event_name TEXT NOT NULL,
  properties JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tfn_product_events_user_id
  ON tfn_product_events(user_id);

CREATE INDEX IF NOT EXISTS idx_tfn_product_events_toothlight_id
  ON tfn_product_events(toothlight_id);

CREATE INDEX IF NOT EXISTS idx_tfn_product_events_event_name
  ON tfn_product_events(event_name);

ALTER TABLE tfn_toothlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE tfn_future_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tfn_family_contributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE tfn_product_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own toothlights" ON tfn_toothlights;
DROP POLICY IF EXISTS "Users can insert own toothlights" ON tfn_toothlights;
DROP POLICY IF EXISTS "Users can update own toothlights" ON tfn_toothlights;
DROP POLICY IF EXISTS "Service can manage toothlights" ON tfn_toothlights;
DROP POLICY IF EXISTS "Users can read own future notes" ON tfn_future_notes;
DROP POLICY IF EXISTS "Users can insert own future notes" ON tfn_future_notes;
DROP POLICY IF EXISTS "Users can update own future notes" ON tfn_future_notes;
DROP POLICY IF EXISTS "Service can manage future notes" ON tfn_future_notes;
DROP POLICY IF EXISTS "Users can read family contributions for own toothlights" ON tfn_family_contributions;
DROP POLICY IF EXISTS "Service can insert family contributions" ON tfn_family_contributions;
DROP POLICY IF EXISTS "Service can manage product events" ON tfn_product_events;
DROP POLICY IF EXISTS "Users can read own product events" ON tfn_product_events;

CREATE POLICY "Users can read own toothlights" ON tfn_toothlights
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own toothlights" ON tfn_toothlights
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own toothlights" ON tfn_toothlights
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Service can manage toothlights" ON tfn_toothlights
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Users can read own future notes" ON tfn_future_notes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own future notes" ON tfn_future_notes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own future notes" ON tfn_future_notes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Service can manage future notes" ON tfn_future_notes
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Users can read family contributions for own toothlights" ON tfn_family_contributions
  FOR SELECT USING (
    EXISTS (
      SELECT 1
      FROM tfn_toothlights
      WHERE tfn_toothlights.id = tfn_family_contributions.toothlight_id
        AND tfn_toothlights.user_id = auth.uid()
    )
  );

CREATE POLICY "Service can insert family contributions" ON tfn_family_contributions
  FOR INSERT TO service_role WITH CHECK (true);

CREATE POLICY "Service can manage product events" ON tfn_product_events
  FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Users can read own product events" ON tfn_product_events
  FOR SELECT USING (auth.uid() = user_id);
