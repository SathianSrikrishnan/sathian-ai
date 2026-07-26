-- Remove accidental public mutation paths while preserving intended reads and
-- owner-scoped TFN access. Service-role operations bypass RLS and retain access.

DROP POLICY IF EXISTS "Service role full access" ON articles;
REVOKE ALL ON articles FROM anon, authenticated;
GRANT SELECT ON articles TO anon, authenticated;

DROP POLICY IF EXISTS "Allow all access" ON family_members;
REVOKE ALL ON family_members FROM anon, authenticated;

DROP POLICY IF EXISTS "Allow all" ON tooth_states;
DROP POLICY IF EXISTS "Allow all access to tooth_states" ON tooth_states;
REVOKE ALL ON tooth_states FROM anon, authenticated;

DROP POLICY IF EXISTS "Service role can insert" ON tfn_children;
REVOKE ALL ON tfn_children FROM anon, authenticated;
GRANT SELECT, UPDATE ON tfn_children TO authenticated;

-- Keepsake stories are intentionally readable by their public milestone PDA.
-- Mutation remains server-only.
DROP POLICY IF EXISTS "Service role can insert" ON tfn_tooth_stories;
DROP POLICY IF EXISTS "Service role can update" ON tfn_tooth_stories;
REVOKE ALL ON tfn_tooth_stories FROM anon, authenticated;
GRANT SELECT ON tfn_tooth_stories TO anon, authenticated;

-- These helpers are useful to authenticated callers and enforce auth.uid()
-- internally. Anonymous execution is unnecessary.
REVOKE EXECUTE ON FUNCTION is_studio_operator() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION tfn_reserve_magic_credit(UUID) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION tfn_complete_magic_credit(UUID) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION tfn_refund_magic_credit(UUID) FROM PUBLIC, anon;
