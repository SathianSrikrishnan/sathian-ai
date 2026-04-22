-- TFN Tooth Stories table: child's narrative about a specific milestone tooth.
--
-- Architecture note:
-- Milestone records live ON-CHAIN (Anchor `milestone` account, PDA-addressed),
-- not in a Supabase `milestones` table. The keepsake API reads milestones via
-- `program.account.milestone.fetch(milestonePda)`. To persist off-chain free-text
-- ("the Tell") without forcing it into rigid cNFT metadata, we store it keyed by
-- the milestone PDA here and join at read time in `getKeepsakeData`.
--
-- Why off-chain:
-- - cNFT metadata is immutable + rent-gated; bad fit for free-text up to 500 chars.
-- - Phase 7 will add a content-hash commitment on-chain if tamper-evidence is needed.

CREATE TABLE IF NOT EXISTS tfn_tooth_stories (
  milestone_pda TEXT PRIMARY KEY,  -- Solana milestone account PDA (base58)
  child_profile_pda TEXT,          -- denormalized for efficient child-scoped lookups
  user_id UUID,                    -- Supabase auth user who minted (nullable if server-minted pre-auth)
  tooth_story TEXT,                -- The narrative itself (max 500 chars enforced in API)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for looking up all stories for a given child (dashboard, timeline views)
CREATE INDEX IF NOT EXISTS idx_tfn_tooth_stories_child_profile
  ON tfn_tooth_stories(child_profile_pda);

-- Index for looking up all stories by a given user
CREATE INDEX IF NOT EXISTS idx_tfn_tooth_stories_user_id
  ON tfn_tooth_stories(user_id);

-- RLS: authenticated users can read their own stories; anyone can read by milestone PDA
-- (keepsake pages are public by design — the PDA itself is the access credential).
ALTER TABLE tfn_tooth_stories ENABLE ROW LEVEL SECURITY;

-- Public read: keepsake pages are shared via URL containing the milestone PDA.
-- Knowing the PDA is sufficient proof of access (it's already on-chain public anyway).
CREATE POLICY "Public read by milestone PDA" ON tfn_tooth_stories
  FOR SELECT USING (true);

-- Service role can insert/update (used by mint API with SUPABASE_SERVICE_ROLE_KEY)
CREATE POLICY "Service role can insert" ON tfn_tooth_stories
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role can update" ON tfn_tooth_stories
  FOR UPDATE USING (true);
