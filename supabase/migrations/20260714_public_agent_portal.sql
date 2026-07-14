-- Public site agent, reviewed public memory, durable intake, and delivery queue.
--
-- Trust zones:
--   1. Visitors may read only approved, currently valid public-memory cards.
--   2. Browser clients have no direct access to conversations, intake, or uploads.
--   3. Server-side services use the service role. Studio operators require an
--      authenticated JWT with app_metadata.role=studio_admin and AAL2.

CREATE TYPE public_memory_status AS ENUM ('draft', 'approved', 'retired');
CREATE TYPE agent_session_status AS ENUM ('active', 'closed', 'expired', 'blocked');
CREATE TYPE agent_message_role AS ENUM ('visitor', 'agent', 'system');
CREATE TYPE agent_intake_status AS ENUM (
  'received',
  'queued',
  'delivered',
  'failed',
  'quarantined',
  'reviewed'
);
CREATE TYPE agent_attachment_status AS ENUM (
  'pending',
  'quarantined',
  'approved',
  'rejected',
  'deleted'
);
CREATE TYPE agent_route AS ENUM ('answer', 'intake', 'answer_and_intake', 'block');
CREATE TYPE delivery_status AS ENUM ('pending', 'processing', 'delivered', 'failed', 'dead_letter');

CREATE TABLE public_memory_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title TEXT NOT NULL CHECK (char_length(title) BETWEEN 1 AND 160),
  body TEXT NOT NULL CHECK (char_length(body) BETWEEN 1 AND 8000),
  summary TEXT CHECK (summary IS NULL OR char_length(summary) <= 500),
  tags TEXT[] NOT NULL DEFAULT '{}',
  source_ref TEXT NOT NULL CHECK (btrim(source_ref) <> ''),
  source_kind TEXT NOT NULL DEFAULT 'local_markdown',
  visibility TEXT NOT NULL DEFAULT 'private' CHECK (visibility IN ('public', 'private')),
  status public_memory_status NOT NULL DEFAULT 'draft',
  valid_from TIMESTAMPTZ,
  valid_until TIMESTAMPTZ,
  approved_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  approved_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (valid_until IS NULL OR valid_from IS NULL OR valid_until > valid_from),
  CHECK (status <> 'approved' OR approved_at IS NOT NULL)
);

CREATE TABLE agent_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  public_id UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  status agent_session_status NOT NULL DEFAULT 'active',
  visitor_hash TEXT,
  policy_version TEXT NOT NULL,
  consent_notice_version TEXT NOT NULL,
  locale TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '24 hours'),
  retention_until TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '90 days')
);

CREATE TABLE agent_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES agent_sessions(id) ON DELETE CASCADE,
  sequence_no INTEGER NOT NULL CHECK (sequence_no >= 0),
  role agent_message_role NOT NULL,
  content TEXT NOT NULL CHECK (char_length(content) BETWEEN 1 AND 12000),
  intent agent_route,
  reason_codes TEXT[] NOT NULL DEFAULT '{}',
  model_name TEXT,
  prompt_version TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  retention_until TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '90 days'),
  UNIQUE (session_id, sequence_no)
);

CREATE TABLE agent_intakes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES agent_sessions(id) ON DELETE CASCADE,
  source_message_id UUID REFERENCES agent_messages(id) ON DELETE SET NULL,
  kind TEXT NOT NULL DEFAULT 'note' CHECK (kind IN ('note', 'contact', 'file', 'mixed')),
  display_name TEXT CHECK (display_name IS NULL OR char_length(display_name) <= 120),
  reply_email TEXT CHECK (reply_email IS NULL OR char_length(reply_email) <= 320),
  message TEXT NOT NULL CHECK (char_length(message) BETWEEN 1 AND 12000),
  status agent_intake_status NOT NULL DEFAULT 'received',
  dedupe_key TEXT NOT NULL UNIQUE,
  receipt_token UUID NOT NULL UNIQUE DEFAULT gen_random_uuid(),
  consented_at TIMESTAMPTZ NOT NULL,
  delivered_at TIMESTAMPTZ,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  retention_until TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '180 days')
);

CREATE TABLE agent_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  intake_id UUID NOT NULL REFERENCES agent_intakes(id) ON DELETE CASCADE,
  object_path TEXT NOT NULL UNIQUE,
  original_filename TEXT NOT NULL CHECK (char_length(original_filename) <= 255),
  sanitized_filename TEXT NOT NULL CHECK (char_length(sanitized_filename) <= 255),
  content_type TEXT NOT NULL,
  byte_size BIGINT NOT NULL CHECK (byte_size BETWEEN 1 AND 10485760),
  sha256 TEXT NOT NULL CHECK (sha256 ~ '^[a-f0-9]{64}$'),
  status agent_attachment_status NOT NULL DEFAULT 'pending',
  scan_result JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  retention_until TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '30 days')
);

CREATE TABLE routing_decisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES agent_sessions(id) ON DELETE CASCADE,
  message_id UUID NOT NULL REFERENCES agent_messages(id) ON DELETE CASCADE,
  route agent_route NOT NULL,
  policy_version TEXT NOT NULL,
  reason_codes TEXT[] NOT NULL,
  classifier_enabled BOOLEAN NOT NULL DEFAULT FALSE,
  classifier_label TEXT,
  classifier_payload JSONB,
  blocked BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (message_id)
);

CREATE TABLE delivery_outbox (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  intake_id UUID NOT NULL REFERENCES agent_intakes(id) ON DELETE CASCADE,
  channel TEXT NOT NULL CHECK (channel IN ('telegram')),
  destination_key TEXT NOT NULL,
  payload JSONB NOT NULL,
  status delivery_status NOT NULL DEFAULT 'pending',
  attempts INTEGER NOT NULL DEFAULT 0 CHECK (attempts >= 0),
  max_attempts INTEGER NOT NULL DEFAULT 8 CHECK (max_attempts BETWEEN 1 AND 20),
  idempotency_key TEXT NOT NULL UNIQUE,
  next_attempt_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  locked_at TIMESTAMPTZ,
  locked_by TEXT,
  last_error TEXT,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE audit_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES agent_sessions(id) ON DELETE SET NULL,
  intake_id UUID REFERENCES agent_intakes(id) ON DELETE SET NULL,
  actor_type TEXT NOT NULL CHECK (actor_type IN ('visitor', 'agent', 'service', 'operator')),
  actor_id TEXT,
  event_type TEXT NOT NULL,
  policy_version TEXT,
  details JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  retention_until TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '365 days')
);

CREATE INDEX idx_public_memory_cards_retrieval
  ON public_memory_cards(status, valid_from, valid_until);
CREATE INDEX idx_public_memory_cards_tags ON public_memory_cards USING GIN(tags);
CREATE INDEX idx_agent_sessions_retention ON agent_sessions(retention_until);
CREATE INDEX idx_agent_messages_session ON agent_messages(session_id, sequence_no);
CREATE INDEX idx_agent_messages_retention ON agent_messages(retention_until);
CREATE INDEX idx_agent_intakes_status ON agent_intakes(status, created_at DESC);
CREATE INDEX idx_agent_intakes_retention ON agent_intakes(retention_until);
CREATE INDEX idx_agent_attachments_intake ON agent_attachments(intake_id, created_at);
CREATE INDEX idx_agent_attachments_retention ON agent_attachments(retention_until);
CREATE INDEX idx_routing_decisions_session ON routing_decisions(session_id, created_at DESC);
CREATE INDEX idx_delivery_outbox_ready
  ON delivery_outbox(status, next_attempt_at)
  WHERE status IN ('pending', 'failed');
CREATE INDEX idx_audit_events_session ON audit_events(session_id, created_at DESC);
CREATE INDEX idx_audit_events_intake ON audit_events(intake_id, created_at DESC);
CREATE INDEX idx_audit_events_retention ON audit_events(retention_until);

CREATE OR REPLACE FUNCTION is_studio_operator()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    COALESCE(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'studio_admin'
    AND COALESCE(auth.jwt() ->> 'aal', '') = 'aal2';
$$;

REVOKE ALL ON FUNCTION is_studio_operator() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION is_studio_operator() TO authenticated, service_role;

ALTER TABLE public_memory_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_intakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE agent_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE routing_decisions ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_outbox ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_events ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON public_memory_cards FROM anon, authenticated;
REVOKE ALL ON agent_sessions FROM anon, authenticated;
REVOKE ALL ON agent_messages FROM anon, authenticated;
REVOKE ALL ON agent_intakes FROM anon, authenticated;
REVOKE ALL ON agent_attachments FROM anon, authenticated;
REVOKE ALL ON routing_decisions FROM anon, authenticated;
REVOKE ALL ON delivery_outbox FROM anon, authenticated;
REVOKE ALL ON audit_events FROM anon, authenticated;

GRANT SELECT ON public_memory_cards TO anon, authenticated;
GRANT ALL ON public_memory_cards TO service_role;
GRANT ALL ON agent_sessions TO service_role;
GRANT ALL ON agent_messages TO service_role;
GRANT ALL ON agent_intakes TO service_role;
GRANT ALL ON agent_attachments TO service_role;
GRANT ALL ON routing_decisions TO service_role;
GRANT ALL ON delivery_outbox TO service_role;
GRANT ALL ON audit_events TO service_role;

GRANT ALL ON public_memory_cards TO authenticated;
GRANT ALL ON agent_sessions TO authenticated;
GRANT ALL ON agent_messages TO authenticated;
GRANT ALL ON agent_intakes TO authenticated;
GRANT ALL ON agent_attachments TO authenticated;
GRANT ALL ON routing_decisions TO authenticated;
GRANT ALL ON delivery_outbox TO authenticated;
GRANT SELECT ON audit_events TO authenticated;

CREATE POLICY "Public reads approved current memory"
  ON public_memory_cards
  FOR SELECT
  TO anon, authenticated
  USING (
    visibility = 'public'
    AND status = 'approved'
    AND (valid_from IS NULL OR valid_from <= NOW())
    AND (valid_until IS NULL OR valid_until > NOW())
  );

CREATE POLICY "Studio manages memory cards"
  ON public_memory_cards
  FOR ALL
  TO authenticated
  USING (is_studio_operator())
  WITH CHECK (is_studio_operator());

CREATE POLICY "Studio manages agent sessions"
  ON agent_sessions FOR ALL TO authenticated
  USING (is_studio_operator()) WITH CHECK (is_studio_operator());
CREATE POLICY "Studio manages agent messages"
  ON agent_messages FOR ALL TO authenticated
  USING (is_studio_operator()) WITH CHECK (is_studio_operator());
CREATE POLICY "Studio manages agent intakes"
  ON agent_intakes FOR ALL TO authenticated
  USING (is_studio_operator()) WITH CHECK (is_studio_operator());
CREATE POLICY "Studio manages agent attachments"
  ON agent_attachments FOR ALL TO authenticated
  USING (is_studio_operator()) WITH CHECK (is_studio_operator());
CREATE POLICY "Studio manages routing decisions"
  ON routing_decisions FOR ALL TO authenticated
  USING (is_studio_operator()) WITH CHECK (is_studio_operator());
CREATE POLICY "Studio manages delivery outbox"
  ON delivery_outbox FOR ALL TO authenticated
  USING (is_studio_operator()) WITH CHECK (is_studio_operator());
CREATE POLICY "Studio reads audit events"
  ON audit_events FOR SELECT TO authenticated
  USING (is_studio_operator());

-- The server writes uploads using its service-role client. Browser clients have
-- no upload or read policy. Studio may inspect quarantined files after AAL2.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'agent-quarantine',
  'agent-quarantine',
  false,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'text/plain']
)
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

CREATE POLICY "Studio reads agent quarantine"
  ON storage.objects
  FOR SELECT
  TO authenticated
  USING (bucket_id = 'agent-quarantine' AND is_studio_operator());

CREATE POLICY "Studio removes agent quarantine objects"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'agent-quarantine' AND is_studio_operator());
