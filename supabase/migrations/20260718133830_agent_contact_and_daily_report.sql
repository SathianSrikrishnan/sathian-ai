-- Keep reply requests distinguishable without putting any contact data in
-- operational events. File completion can later promote the row to `mixed`.
CREATE OR REPLACE FUNCTION agent_assign_intake_kind()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.display_name IS NOT NULL OR NEW.reply_email IS NOT NULL THEN
    NEW.kind := 'contact';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS agent_assign_intake_kind_before_insert ON agent_intakes;
CREATE TRIGGER agent_assign_intake_kind_before_insert
BEFORE INSERT ON agent_intakes
FOR EACH ROW
EXECUTE FUNCTION agent_assign_intake_kind();

REVOKE ALL ON FUNCTION agent_assign_intake_kind() FROM PUBLIC, anon, authenticated;

-- Extend the private worker contract with the intake label and optional reply
-- fields. This function remains service-role only.
DROP FUNCTION IF EXISTS agent_claim_delivery_batch(TEXT, INTEGER);

CREATE FUNCTION agent_claim_delivery_batch(
  p_worker_id TEXT,
  p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
  outbox_id UUID,
  idempotency_key TEXT,
  receipt_token UUID,
  kind TEXT,
  display_name TEXT,
  reply_email TEXT,
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
    intake.kind,
    intake.display_name,
    intake.reply_email,
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

-- One content-free row powers the private rolling digest. No message, name,
-- email, object path, or attachment metadata leaves this function.
CREATE OR REPLACE FUNCTION agent_get_daily_report(
  p_since TIMESTAMPTZ,
  p_until TIMESTAMPTZ
)
RETURNS TABLE (
  site_sessions BIGINT,
  widget_views BIGINT,
  completed_turns BIGINT,
  intakes BIGINT,
  reply_enabled_intakes BIGINT,
  telegram_delivered BIGINT,
  telegram_dead_letters BIGINT,
  delivery_backlog BIGINT,
  model_errors BIGINT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_since IS NULL OR p_until IS NULL OR p_since >= p_until
    OR p_until - p_since > INTERVAL '48 hours' THEN
    RAISE EXCEPTION 'Invalid report window';
  END IF;

  RETURN QUERY SELECT
    (SELECT COUNT(*) FROM audit_events
      WHERE event_type = 'site_session_started' AND created_at >= p_since AND created_at < p_until),
    (SELECT COUNT(*) FROM audit_events
      WHERE event_type = 'agent_widget_viewed' AND created_at >= p_since AND created_at < p_until),
    (SELECT COUNT(*) FROM audit_events
      WHERE event_type = 'agent_turn_completed' AND created_at >= p_since AND created_at < p_until),
    (SELECT COUNT(*) FROM agent_intakes
      WHERE created_at >= p_since AND created_at < p_until),
    (SELECT COUNT(*) FROM agent_intakes
      WHERE reply_email IS NOT NULL AND created_at >= p_since AND created_at < p_until),
    (SELECT COUNT(*) FROM audit_events
      WHERE event_type = 'telegram_delivery_succeeded' AND created_at >= p_since AND created_at < p_until),
    (SELECT COUNT(*) FROM audit_events
      WHERE event_type = 'telegram_delivery_dead_lettered' AND created_at >= p_since AND created_at < p_until),
    (SELECT COUNT(*) FROM delivery_outbox
      WHERE status IN ('pending', 'processing', 'failed')),
    (SELECT COUNT(*) FROM audit_events
      WHERE event_type = 'agent_answer_model_failed' AND created_at >= p_since AND created_at < p_until);
END;
$$;

REVOKE ALL ON FUNCTION agent_get_daily_report(TIMESTAMPTZ, TIMESTAMPTZ)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION agent_get_daily_report(TIMESTAMPTZ, TIMESTAMPTZ)
  TO service_role;
