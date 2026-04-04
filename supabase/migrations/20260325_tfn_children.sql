-- TFN Children table: maps Supabase auth users to on-chain child profiles
-- Used by server-subsidized minting flow

CREATE TABLE IF NOT EXISTS tfn_children (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,  -- Supabase auth user ID
  user_email TEXT,
  child_name TEXT NOT NULL,
  child_slug TEXT NOT NULL,  -- URL-safe slug
  birthday DATE,
  guardian_pubkey TEXT NOT NULL,  -- Solana pubkey of guardian (server wallet initially)
  child_wallet_pubkey TEXT,  -- Derived PDA child wallet
  child_profile_pda TEXT,  -- On-chain child profile PDA
  cnft_signature TEXT,  -- Mint transaction signature
  metadata_uri TEXT,  -- Arweave metadata URI
  image_uri TEXT,  -- Arweave image URI
  is_server_guardian BOOLEAN DEFAULT true,  -- true until user connects own wallet
  user_wallet_pubkey TEXT,  -- User's real wallet (set after transferGuardianship)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, child_slug)
);

-- Index for looking up children by user
CREATE INDEX IF NOT EXISTS idx_tfn_children_user_id ON tfn_children(user_id);

-- Index for looking up by slug (profile page)
CREATE INDEX IF NOT EXISTS idx_tfn_children_slug ON tfn_children(child_slug);

-- RLS: users can only read their own children
ALTER TABLE tfn_children ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own children" ON tfn_children
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own children" ON tfn_children
  FOR UPDATE USING (auth.uid() = user_id);

-- Service role can insert (used by mint API)
CREATE POLICY "Service role can insert" ON tfn_children
  FOR INSERT WITH CHECK (true);
