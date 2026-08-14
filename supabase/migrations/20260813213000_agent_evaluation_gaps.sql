-- Private, sanitized release-evaluation gaps for the Studio control room.
-- The table intentionally stores fixture IDs and expected public claims only.

CREATE TABLE agent_knowledge_gaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  fingerprint TEXT NOT NULL UNIQUE CHECK (fingerprint ~ '^[a-f0-9]{16,64}$'),
  eval_case_id TEXT NOT NULL CHECK (eval_case_id ~ '^EVAL-[0-9]{3}$'),
  dataset_version TEXT NOT NULL CHECK (char_length(dataset_version) BETWEEN 8 AND 80),
  category TEXT NOT NULL CHECK (category ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  severity TEXT NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low')),
  expected_facts TEXT[] NOT NULL DEFAULT '{}',
  expected_sources TEXT[] NOT NULL DEFAULT '{}',
  failed_checks TEXT[] NOT NULL DEFAULT '{}',
  source_receipt TEXT NOT NULL CHECK (char_length(source_receipt) BETWEEN 8 AND 500),
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_review', 'resolved', 'wont_fix')),
  operator_note TEXT CHECK (operator_note IS NULL OR char_length(operator_note) BETWEEN 1 AND 1000),
  first_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  occurrence_count INTEGER NOT NULL DEFAULT 1 CHECK (occurrence_count > 0),
  reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_agent_knowledge_gaps_triage
  ON agent_knowledge_gaps(status, severity, last_seen_at DESC);

ALTER TABLE agent_knowledge_gaps ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON agent_knowledge_gaps FROM anon, authenticated;
GRANT ALL ON agent_knowledge_gaps TO service_role;
GRANT SELECT, UPDATE ON agent_knowledge_gaps TO authenticated;

CREATE POLICY "Studio reads agent knowledge gaps"
  ON agent_knowledge_gaps
  FOR SELECT
  TO authenticated
  USING (is_studio_operator());

CREATE POLICY "Studio reviews agent knowledge gaps"
  ON agent_knowledge_gaps
  FOR UPDATE
  TO authenticated
  USING (is_studio_operator())
  WITH CHECK (is_studio_operator());
