-- Migration 20260714114500: constrained public-agent file intake.
--
-- The browser receives a signed token for one generated object key. It never
-- receives bucket listing or read permission. The service role alone reserves,
-- verifies, and transitions an attachment.

ALTER TABLE agent_attachments
  ADD COLUMN IF NOT EXISTS declared_content_type TEXT,
  ADD COLUMN IF NOT EXISTS detected_content_type TEXT,
  ADD COLUMN IF NOT EXISTS completion_token_hash TEXT;

ALTER TABLE agent_attachments
  ALTER COLUMN sha256 DROP NOT NULL;

ALTER TABLE agent_attachments
  DROP CONSTRAINT IF EXISTS agent_attachments_sha256_check;

ALTER TABLE agent_attachments
  ADD CONSTRAINT agent_attachments_sha256_check
  CHECK (sha256 IS NULL OR sha256 ~ '^[a-f0-9]{64}$');

ALTER TABLE agent_attachments
  DROP CONSTRAINT IF EXISTS agent_attachments_completion_token_hash_check;

ALTER TABLE agent_attachments
  ADD CONSTRAINT agent_attachments_completion_token_hash_check
  CHECK (completion_token_hash IS NULL OR completion_token_hash ~ '^[a-f0-9]{64}$');

CREATE UNIQUE INDEX IF NOT EXISTS uq_agent_attachments_one_per_intake
  ON agent_attachments(intake_id);

UPDATE storage.buckets
SET allowed_mime_types = ARRAY[
  'application/pdf', 'text/plain', 'text/markdown',
  'image/jpeg', 'image/png', 'image/webp'
]
WHERE id = 'agent-quarantine';

CREATE TABLE agent_upload_rate_limits (
  visitor_hash TEXT PRIMARY KEY CHECK (visitor_hash ~ '^[a-f0-9]{64}$'),
  window_started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  attempt_count INTEGER NOT NULL DEFAULT 0 CHECK (attempt_count >= 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE agent_upload_rate_limits ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON agent_upload_rate_limits FROM PUBLIC, anon, authenticated;
GRANT ALL ON agent_upload_rate_limits TO service_role;

CREATE OR REPLACE FUNCTION agent_consume_upload_rate_limit(
  p_visitor_hash TEXT,
  p_limit INTEGER DEFAULT 3,
  p_window_seconds INTEGER DEFAULT 3600
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_attempt_count INTEGER;
BEGIN
  IF p_visitor_hash !~ '^[a-f0-9]{64}$' THEN
    RAISE EXCEPTION 'Invalid visitor hash';
  END IF;
  IF p_limit < 1 OR p_limit > 10 OR p_window_seconds < 60 OR p_window_seconds > 86400 THEN
    RAISE EXCEPTION 'Invalid upload rate limit';
  END IF;

  INSERT INTO agent_upload_rate_limits AS limits (
    visitor_hash,
    window_started_at,
    attempt_count,
    updated_at
  )
  VALUES (p_visitor_hash, NOW(), 1, NOW())
  ON CONFLICT (visitor_hash) DO UPDATE
  SET
    window_started_at = CASE
      WHEN limits.window_started_at <= NOW() - make_interval(secs => p_window_seconds)
        THEN NOW()
      ELSE limits.window_started_at
    END,
    attempt_count = CASE
      WHEN limits.window_started_at <= NOW() - make_interval(secs => p_window_seconds)
        THEN 1
      ELSE limits.attempt_count + 1
    END,
    updated_at = NOW()
  RETURNING attempt_count INTO v_attempt_count;

  RETURN v_attempt_count <= p_limit;
END;
$$;

REVOKE ALL ON FUNCTION agent_consume_upload_rate_limit(TEXT, INTEGER, INTEGER)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION agent_consume_upload_rate_limit(TEXT, INTEGER, INTEGER)
  TO service_role;

CREATE OR REPLACE FUNCTION agent_reserve_attachment(
  p_idempotency_key TEXT,
  p_attachment_id UUID,
  p_original_filename TEXT,
  p_sanitized_filename TEXT,
  p_declared_content_type TEXT,
  p_byte_size BIGINT,
  p_completion_token_hash TEXT
)
RETURNS TABLE (
  attachment_id UUID,
  object_path TEXT,
  created BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_intake agent_intakes%ROWTYPE;
  v_existing agent_attachments%ROWTYPE;
  v_object_path TEXT;
BEGIN
  IF p_attachment_id IS NULL OR char_length(p_idempotency_key) < 32 THEN
    RAISE EXCEPTION 'Invalid reservation receipt';
  END IF;
  IF p_byte_size < 1 OR p_byte_size > 5242880 THEN
    RAISE EXCEPTION 'Invalid attachment size';
  END IF;
  IF p_declared_content_type NOT IN (
    'application/pdf', 'text/plain', 'text/markdown',
    'image/jpeg', 'image/png', 'image/webp'
  ) THEN
    RAISE EXCEPTION 'Invalid attachment type';
  END IF;
  IF p_completion_token_hash !~ '^[a-f0-9]{64}$' THEN
    RAISE EXCEPTION 'Invalid completion token';
  END IF;

  SELECT * INTO v_intake
  FROM agent_intakes
  WHERE dedupe_key = p_idempotency_key;

  IF NOT FOUND THEN
    RETURN;
  END IF;

  SELECT * INTO v_existing
  FROM agent_attachments
  WHERE intake_id = v_intake.id;

  IF FOUND THEN
    IF v_existing.completion_token_hash = p_completion_token_hash THEN
      RETURN QUERY SELECT v_existing.id, v_existing.object_path, FALSE;
    END IF;
    RAISE EXCEPTION 'Attachment already reserved';
  END IF;

  v_object_path := 'intakes/' || v_intake.id || '/' || p_attachment_id;

  INSERT INTO agent_attachments (
    id,
    intake_id,
    object_path,
    original_filename,
    sanitized_filename,
    content_type,
    declared_content_type,
    byte_size,
    completion_token_hash,
    status,
    scan_result,
    retention_until
  )
  VALUES (
    p_attachment_id,
    v_intake.id,
    v_object_path,
    p_original_filename,
    p_sanitized_filename,
    p_declared_content_type,
    p_declared_content_type,
    p_byte_size,
    p_completion_token_hash,
    'pending',
    jsonb_build_object('policy', 'pending', 'content_processing', 'disabled'),
    LEAST(v_intake.retention_until, NOW() + INTERVAL '30 days')
  );

  UPDATE agent_intakes
  SET kind = 'mixed', updated_at = NOW()
  WHERE id = v_intake.id;

  INSERT INTO audit_events (
    session_id,
    intake_id,
    actor_type,
    event_type,
    details
  )
  VALUES (
    v_intake.session_id,
    v_intake.id,
    'service',
    'agent_attachment_reserved',
    jsonb_build_object('attachment_id', p_attachment_id, 'byte_size', p_byte_size)
  );

  RETURN QUERY SELECT p_attachment_id, v_object_path, TRUE;
END;
$$;

REVOKE ALL ON FUNCTION agent_reserve_attachment(
  TEXT, UUID, TEXT, TEXT, TEXT, BIGINT, TEXT
) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION agent_reserve_attachment(
  TEXT, UUID, TEXT, TEXT, TEXT, BIGINT, TEXT
) TO service_role;

CREATE OR REPLACE FUNCTION agent_complete_attachment(
  p_attachment_id UUID,
  p_completion_token_hash TEXT,
  p_sha256 TEXT,
  p_detected_content_type TEXT,
  p_scan_result JSONB,
  p_status agent_attachment_status
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_intake_id UUID;
BEGIN
  IF p_status NOT IN ('quarantined', 'rejected') THEN
    RAISE EXCEPTION 'Invalid completion state';
  END IF;
  IF p_completion_token_hash !~ '^[a-f0-9]{64}$' OR p_sha256 !~ '^[a-f0-9]{64}$' THEN
    RAISE EXCEPTION 'Invalid attachment digest';
  END IF;

  UPDATE agent_attachments
  SET
    sha256 = p_sha256,
    detected_content_type = p_detected_content_type,
    status = p_status,
    scan_result = p_scan_result,
    reviewed_at = CASE WHEN p_status = 'rejected' THEN NOW() ELSE reviewed_at END
  WHERE id = p_attachment_id
    AND status = 'pending'
    AND completion_token_hash = p_completion_token_hash
  RETURNING intake_id INTO v_intake_id;

  IF v_intake_id IS NULL THEN
    RETURN FALSE;
  END IF;

  UPDATE delivery_outbox
  SET next_attempt_at = LEAST(next_attempt_at, NOW()), updated_at = NOW()
  WHERE intake_id = v_intake_id
    AND status IN ('pending', 'failed');

  INSERT INTO audit_events (intake_id, actor_type, event_type, details)
  VALUES (
    v_intake_id,
    'service',
    CASE
      WHEN p_status = 'quarantined' THEN 'agent_attachment_quarantined'
      ELSE 'agent_attachment_rejected'
    END,
    jsonb_build_object(
      'attachment_id', p_attachment_id,
      'status', p_status,
      'detected_content_type', p_detected_content_type
    )
  );

  RETURN TRUE;
END;
$$;

REVOKE ALL ON FUNCTION agent_complete_attachment(
  UUID, TEXT, TEXT, TEXT, JSONB, agent_attachment_status
) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION agent_complete_attachment(
  UUID, TEXT, TEXT, TEXT, JSONB, agent_attachment_status
) TO service_role;

-- Authenticated browser clients must not list or read the private bucket. A
-- Studio server route creates a one-object, sixty-second URL after AAL2 checks.
DROP POLICY IF EXISTS "Studio reads agent quarantine objects" ON storage.objects;
DROP POLICY IF EXISTS "Studio removes agent quarantine objects" ON storage.objects;

-- Rebuild the worker claim contract so only byte-cleared metadata is surfaced.
DROP FUNCTION IF EXISTS agent_claim_delivery_batch(TEXT, INTEGER);

CREATE FUNCTION agent_claim_delivery_batch(
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
  attachment_metadata JSONB,
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
        AND attachment.status IN ('quarantined', 'approved')
    ),
    COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'filename', attachment.sanitized_filename,
        'content_type', COALESCE(attachment.detected_content_type, attachment.content_type),
        'byte_size', attachment.byte_size
      ) ORDER BY attachment.created_at)
      FROM agent_attachments AS attachment
      WHERE attachment.intake_id = intake.id
        AND attachment.status IN ('quarantined', 'approved')
    ), '[]'::JSONB),
    claimed.attempts,
    claimed.max_attempts
  FROM claimed
  JOIN agent_intakes AS intake ON intake.id = claimed.intake_id;
END;
$$;

REVOKE ALL ON FUNCTION agent_claim_delivery_batch(TEXT, INTEGER)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION agent_claim_delivery_batch(TEXT, INTEGER)
  TO service_role;
