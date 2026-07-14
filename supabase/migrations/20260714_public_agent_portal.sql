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
  provider_message_id TEXT,
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

-- Creates the visitor session, message, policy decision, intake, delivery
-- event, and audit receipt in one transaction. The unique dedupe key makes
-- retries return the original receipt without creating another outbox event.
CREATE OR REPLACE FUNCTION agent_create_intake(
  p_idempotency_key TEXT,
  p_message TEXT,
  p_route agent_route,
  p_reason_codes TEXT[],
  p_policy_version TEXT,
  p_consent_notice_version TEXT,
  p_page_context TEXT DEFAULT '/',
  p_visitor_hash TEXT DEFAULT NULL,
  p_display_name TEXT DEFAULT NULL,
  p_reply_email TEXT DEFAULT NULL
)
RETURNS TABLE (
  receipt_token UUID,
  delivery_status TEXT,
  created BOOLEAN,
  retention_until TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_existing agent_intakes%ROWTYPE;
  v_session_id UUID;
  v_message_id UUID;
  v_intake_id UUID;
  v_receipt_token UUID := gen_random_uuid();
  v_intake_retention TIMESTAMPTZ := NOW() + INTERVAL '180 days';
BEGIN
  IF char_length(p_idempotency_key) < 32 OR char_length(p_idempotency_key) > 128 THEN
    RAISE EXCEPTION 'Invalid idempotency key';
  END IF;
  IF char_length(p_message) < 1 OR char_length(p_message) > 2000 THEN
    RAISE EXCEPTION 'Invalid message length';
  END IF;
  IF p_route NOT IN ('intake', 'answer_and_intake') THEN
    RAISE EXCEPTION 'Invalid intake route';
  END IF;
  IF char_length(p_page_context) > 256 THEN
    RAISE EXCEPTION 'Invalid page context';
  END IF;

  SELECT *
  INTO v_existing
  FROM agent_intakes
  WHERE dedupe_key = p_idempotency_key;

  IF FOUND THEN
    RETURN QUERY SELECT
      v_existing.receipt_token,
      CASE
        WHEN v_existing.status = 'delivered' THEN 'delivered'
        WHEN v_existing.status = 'failed' THEN 'failed'
        ELSE 'queued'
      END,
      FALSE,
      v_existing.retention_until;
    RETURN;
  END IF;

  INSERT INTO agent_sessions (
    visitor_hash,
    policy_version,
    consent_notice_version,
    metadata,
    retention_until
  )
  VALUES (
    p_visitor_hash,
    p_policy_version,
    p_consent_notice_version,
    jsonb_build_object('entry_page', p_page_context),
    NOW() + INTERVAL '90 days'
  )
  RETURNING id INTO v_session_id;

  INSERT INTO agent_messages (
    session_id,
    sequence_no,
    role,
    content,
    intent,
    reason_codes,
    retention_until
  )
  VALUES (
    v_session_id,
    0,
    'visitor',
    p_message,
    p_route,
    p_reason_codes,
    NOW() + INTERVAL '90 days'
  )
  RETURNING id INTO v_message_id;

  INSERT INTO routing_decisions (
    session_id,
    message_id,
    route,
    policy_version,
    reason_codes,
    classifier_enabled,
    blocked
  )
  VALUES (
    v_session_id,
    v_message_id,
    p_route,
    p_policy_version,
    p_reason_codes,
    FALSE,
    FALSE
  );

  INSERT INTO agent_intakes (
    session_id,
    source_message_id,
    kind,
    display_name,
    reply_email,
    message,
    status,
    dedupe_key,
    receipt_token,
    consented_at,
    metadata,
    retention_until
  )
  VALUES (
    v_session_id,
    v_message_id,
    'note',
    p_display_name,
    p_reply_email,
    p_message,
    'queued',
    p_idempotency_key,
    v_receipt_token,
    NOW(),
    jsonb_build_object(
      'page_context', p_page_context,
      'consent_notice_version', p_consent_notice_version
    ),
    v_intake_retention
  )
  RETURNING id INTO v_intake_id;

  INSERT INTO delivery_outbox (
    intake_id,
    channel,
    destination_key,
    payload,
    status,
    idempotency_key
  )
  VALUES (
    v_intake_id,
    'telegram',
    'primary_private_topic',
    jsonb_build_object(
      'intake_id', v_intake_id,
      'receipt_token', v_receipt_token,
      'page_context', p_page_context
    ),
    'pending',
    'telegram:' || p_idempotency_key
  );

  INSERT INTO audit_events (
    session_id,
    intake_id,
    actor_type,
    event_type,
    policy_version,
    details
  )
  VALUES (
    v_session_id,
    v_intake_id,
    'service',
    'agent_intake_created',
    p_policy_version,
    jsonb_build_object('route', p_route, 'reason_codes', p_reason_codes)
  );

  RETURN QUERY SELECT v_receipt_token, 'queued'::TEXT, TRUE, v_intake_retention;
EXCEPTION
  WHEN unique_violation THEN
    SELECT *
    INTO v_existing
    FROM agent_intakes
    WHERE dedupe_key = p_idempotency_key;

    IF FOUND THEN
      RETURN QUERY SELECT
        v_existing.receipt_token,
        CASE
          WHEN v_existing.status = 'delivered' THEN 'delivered'
          WHEN v_existing.status = 'failed' THEN 'failed'
          ELSE 'queued'
        END,
        FALSE,
        v_existing.retention_until;
      RETURN;
    END IF;
    RAISE;
END;
$$;

REVOKE ALL ON FUNCTION agent_create_intake(
  TEXT, TEXT, agent_route, TEXT[], TEXT, TEXT, TEXT, TEXT, TEXT, TEXT
) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION agent_create_intake(
  TEXT, TEXT, agent_route, TEXT[], TEXT, TEXT, TEXT, TEXT, TEXT, TEXT
) TO service_role;

-- Claims a small ready batch in one transaction. Processing rows with stale
-- leases may be reclaimed after five minutes so a crashed worker cannot strand
-- an intake forever. Delivered and dead-letter rows are never reclaimed.
CREATE OR REPLACE FUNCTION agent_claim_delivery_batch(
  p_worker_id TEXT,
  p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
  outbox_id UUID,
  idempotency_key TEXT,
  receipt_token UUID,
  message TEXT,
  page_context TEXT,
  attachment_count BIGINT,
  attempts INTEGER,
  max_attempts INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF char_length(p_worker_id) < 8 OR char_length(p_worker_id) > 128 THEN
    RAISE EXCEPTION 'Invalid worker identifier';
  END IF;
  IF p_limit < 1 OR p_limit > 25 THEN
    RAISE EXCEPTION 'Invalid delivery batch size';
  END IF;

  RETURN QUERY
  WITH candidates AS (
    SELECT delivery_outbox.id
    FROM delivery_outbox
    WHERE delivery_outbox.channel = 'telegram'
      AND delivery_outbox.attempts < delivery_outbox.max_attempts
      AND (
        (
          delivery_outbox.status IN ('pending', 'failed')
          AND delivery_outbox.next_attempt_at <= NOW()
        )
        OR (
          delivery_outbox.status = 'processing'
          AND delivery_outbox.locked_at < NOW() - INTERVAL '5 minutes'
        )
      )
    ORDER BY delivery_outbox.next_attempt_at, delivery_outbox.created_at
    FOR UPDATE SKIP LOCKED
    LIMIT p_limit
  ), claimed AS (
    UPDATE delivery_outbox AS delivery
    SET
      status = 'processing',
      attempts = delivery.attempts + 1,
      locked_at = NOW(),
      locked_by = p_worker_id,
      updated_at = NOW()
    FROM candidates
    WHERE delivery.id = candidates.id
    RETURNING delivery.*
  )
  SELECT
    claimed.id,
    claimed.idempotency_key,
    intake.receipt_token,
    intake.message,
    COALESCE(intake.metadata ->> 'page_context', '/'),
    (
      SELECT COUNT(*)
      FROM agent_attachments AS attachment
      WHERE attachment.intake_id = intake.id
        AND attachment.status IN ('pending', 'quarantined', 'approved')
    ),
    claimed.attempts,
    claimed.max_attempts
  FROM claimed
  JOIN agent_intakes AS intake ON intake.id = claimed.intake_id;
END;
$$;

CREATE OR REPLACE FUNCTION agent_mark_delivery_succeeded(
  p_outbox_id UUID,
  p_worker_id TEXT,
  p_provider_message_id TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_intake_id UUID;
BEGIN
  UPDATE delivery_outbox
  SET
    status = 'delivered',
    provider_message_id = p_provider_message_id,
    delivered_at = NOW(),
    locked_at = NULL,
    locked_by = NULL,
    last_error = NULL,
    updated_at = NOW()
  WHERE id = p_outbox_id
    AND status = 'processing'
    AND locked_by = p_worker_id
  RETURNING intake_id INTO v_intake_id;

  IF v_intake_id IS NULL THEN
    RETURN FALSE;
  END IF;

  UPDATE agent_intakes
  SET status = 'delivered', delivered_at = NOW(), updated_at = NOW()
  WHERE id = v_intake_id;

  INSERT INTO audit_events (intake_id, actor_type, actor_id, event_type, details)
  VALUES (
    v_intake_id,
    'service',
    p_worker_id,
    'telegram_delivery_succeeded',
    jsonb_build_object('outbox_id', p_outbox_id)
  );

  RETURN TRUE;
END;
$$;

CREATE OR REPLACE FUNCTION agent_mark_delivery_failed(
  p_outbox_id UUID,
  p_worker_id TEXT,
  p_error_code TEXT,
  p_permanent BOOLEAN,
  p_next_attempt_at TIMESTAMPTZ DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_intake_id UUID;
  v_dead_letter BOOLEAN;
BEGIN
  IF p_error_code !~ '^[a-z0-9_]{3,80}$' THEN
    RAISE EXCEPTION 'Invalid delivery error code';
  END IF;

  UPDATE delivery_outbox
  SET
    status = CASE
      WHEN p_permanent OR attempts >= max_attempts THEN 'dead_letter'::delivery_status
      ELSE 'failed'::delivery_status
    END,
    next_attempt_at = CASE
      WHEN p_permanent OR attempts >= max_attempts THEN next_attempt_at
      ELSE COALESCE(p_next_attempt_at, NOW() + INTERVAL '5 minutes')
    END,
    locked_at = NULL,
    locked_by = NULL,
    last_error = p_error_code,
    updated_at = NOW()
  WHERE id = p_outbox_id
    AND status = 'processing'
    AND locked_by = p_worker_id
  RETURNING intake_id, status = 'dead_letter'
  INTO v_intake_id, v_dead_letter;

  IF v_intake_id IS NULL THEN
    RETURN FALSE;
  END IF;

  UPDATE agent_intakes
  SET status = CASE WHEN v_dead_letter THEN 'failed'::agent_intake_status ELSE 'queued'::agent_intake_status END,
      updated_at = NOW()
  WHERE id = v_intake_id;

  INSERT INTO audit_events (intake_id, actor_type, actor_id, event_type, details)
  VALUES (
    v_intake_id,
    'service',
    p_worker_id,
    CASE WHEN v_dead_letter THEN 'telegram_delivery_dead_lettered' ELSE 'telegram_delivery_retry_scheduled' END,
    jsonb_build_object('outbox_id', p_outbox_id, 'error_code', p_error_code)
  );

  RETURN TRUE;
END;
$$;

REVOKE ALL ON FUNCTION agent_claim_delivery_batch(TEXT, INTEGER) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION agent_mark_delivery_succeeded(UUID, TEXT, TEXT) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION agent_mark_delivery_failed(UUID, TEXT, TEXT, BOOLEAN, TIMESTAMPTZ) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION agent_claim_delivery_batch(TEXT, INTEGER) TO service_role;
GRANT EXECUTE ON FUNCTION agent_mark_delivery_succeeded(UUID, TEXT, TEXT) TO service_role;
GRANT EXECUTE ON FUNCTION agent_mark_delivery_failed(UUID, TEXT, TEXT, BOOLEAN, TIMESTAMPTZ) TO service_role;
