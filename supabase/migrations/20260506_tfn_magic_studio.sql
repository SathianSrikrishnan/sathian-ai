-- TFN Magic Studio credit ledger.
--
-- Magic generation is a real provider cost, so the app grants a small starter
-- bundle per authenticated guardian and tracks successful AI outputs. The
-- reserve/complete/refund RPCs keep the user experience fair: failed provider
-- calls return the credit, successful outputs spend it.

CREATE TABLE IF NOT EXISTS tfn_magic_credits (
  user_id UUID PRIMARY KEY,
  user_email TEXT,
  lifetime_credits INTEGER NOT NULL DEFAULT 3 CHECK (lifetime_credits >= 0),
  remaining_credits INTEGER NOT NULL DEFAULT 3 CHECK (remaining_credits >= 0),
  reserved_credits INTEGER NOT NULL DEFAULT 0 CHECK (reserved_credits >= 0),
  used_credits INTEGER NOT NULL DEFAULT 0 CHECK (used_credits >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tfn_magic_credits_user_email
  ON tfn_magic_credits(user_email)
  WHERE user_email IS NOT NULL;

ALTER TABLE tfn_magic_credits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own magic credits" ON tfn_magic_credits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own magic credits" ON tfn_magic_credits
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own magic credits" ON tfn_magic_credits
  FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS tfn_magic_generations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  style_id TEXT NOT NULL,
  tradition_slug TEXT,
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  prompt TEXT,
  enhanced_image_url TEXT NOT NULL,
  generation_ms INTEGER,
  cost_usd NUMERIC(8, 4) NOT NULL DEFAULT 0.04,
  original_bytes INTEGER,
  credit_status TEXT NOT NULL DEFAULT 'spent' CHECK (credit_status IN ('spent')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_tfn_magic_generations_user_id
  ON tfn_magic_generations(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_tfn_magic_generations_style_id
  ON tfn_magic_generations(style_id);

ALTER TABLE tfn_magic_generations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own magic generations" ON tfn_magic_generations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own magic generations" ON tfn_magic_generations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION tfn_reserve_magic_credit(p_user_id UUID)
RETURNS TABLE (
  remaining_credits INTEGER,
  reserved_credits INTEGER,
  used_credits INTEGER,
  lifetime_credits INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL OR auth.uid() <> p_user_id THEN
    RAISE EXCEPTION 'Not authorized to reserve magic credits';
  END IF;

  RETURN QUERY
  UPDATE tfn_magic_credits
  SET
    remaining_credits = tfn_magic_credits.remaining_credits - 1,
    reserved_credits = tfn_magic_credits.reserved_credits + 1,
    updated_at = NOW()
  WHERE user_id = p_user_id
    AND tfn_magic_credits.remaining_credits > 0
  RETURNING
    tfn_magic_credits.remaining_credits,
    tfn_magic_credits.reserved_credits,
    tfn_magic_credits.used_credits,
    tfn_magic_credits.lifetime_credits;
END;
$$;

CREATE OR REPLACE FUNCTION tfn_complete_magic_credit(p_user_id UUID)
RETURNS TABLE (
  remaining_credits INTEGER,
  reserved_credits INTEGER,
  used_credits INTEGER,
  lifetime_credits INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL OR auth.uid() <> p_user_id THEN
    RAISE EXCEPTION 'Not authorized to complete magic credits';
  END IF;

  RETURN QUERY
  UPDATE tfn_magic_credits
  SET
    reserved_credits = tfn_magic_credits.reserved_credits - 1,
    used_credits = tfn_magic_credits.used_credits + 1,
    updated_at = NOW()
  WHERE user_id = p_user_id
    AND tfn_magic_credits.reserved_credits > 0
  RETURNING
    tfn_magic_credits.remaining_credits,
    tfn_magic_credits.reserved_credits,
    tfn_magic_credits.used_credits,
    tfn_magic_credits.lifetime_credits;
END;
$$;

CREATE OR REPLACE FUNCTION tfn_refund_magic_credit(p_user_id UUID)
RETURNS TABLE (
  remaining_credits INTEGER,
  reserved_credits INTEGER,
  used_credits INTEGER,
  lifetime_credits INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF auth.uid() IS NULL OR auth.uid() <> p_user_id THEN
    RAISE EXCEPTION 'Not authorized to refund magic credits';
  END IF;

  RETURN QUERY
  UPDATE tfn_magic_credits
  SET
    reserved_credits = tfn_magic_credits.reserved_credits - 1,
    remaining_credits = tfn_magic_credits.remaining_credits + 1,
    updated_at = NOW()
  WHERE user_id = p_user_id
    AND tfn_magic_credits.reserved_credits > 0
  RETURNING
    tfn_magic_credits.remaining_credits,
    tfn_magic_credits.reserved_credits,
    tfn_magic_credits.used_credits,
    tfn_magic_credits.lifetime_credits;
END;
$$;

GRANT EXECUTE ON FUNCTION tfn_reserve_magic_credit(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION tfn_complete_magic_credit(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION tfn_refund_magic_credit(UUID) TO authenticated;
