-- Subscriber governance: verifiable delivery state and a scanner-safe unsubscribe flow.

ALTER TABLE newsletter_subscribers
  ADD COLUMN unsubscribe_token UUID NOT NULL DEFAULT gen_random_uuid(),
  ADD COLUMN unsubscribed_at TIMESTAMPTZ,
  ADD COLUMN confirmation_email_id TEXT,
  ADD COLUMN confirmation_error_code TEXT,
  ADD COLUMN confirmation_attempted_at TIMESTAMPTZ;

CREATE UNIQUE INDEX newsletter_subscribers_unsubscribe_token_key
  ON newsletter_subscribers(unsubscribe_token);

-- The previous application marked confirmation_sent_at without checking Resend's
-- returned error object. Clear those unverified timestamps; future sends store an ID.
UPDATE newsletter_subscribers
SET confirmation_sent_at = NULL
WHERE confirmation_email_id IS NULL;

DROP FUNCTION newsletter_subscribe(TEXT, TEXT, TEXT, TEXT);

CREATE FUNCTION newsletter_subscribe(
  p_email TEXT,
  p_source TEXT,
  p_consent_notice_version TEXT,
  p_visitor_hash TEXT DEFAULT NULL
)
RETURNS TABLE (
  subscriber_id UUID,
  created BOOLEAN,
  status TEXT,
  receipt_token UUID,
  unsubscribe_token UUID,
  confirmation_sent_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_email TEXT := lower(btrim(p_email));
  v_source TEXT := lower(btrim(p_source));
  v_subscriber newsletter_subscribers%ROWTYPE;
  v_created BOOLEAN := FALSE;
  v_receipt UUID;
BEGIN
  IF char_length(v_email) > 320
    OR v_email !~ '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' THEN
    RAISE EXCEPTION 'newsletter_invalid_email';
  END IF;
  IF v_source NOT IN ('sathian-home', 'tfn-footer') THEN
    RAISE EXCEPTION 'newsletter_invalid_source';
  END IF;
  IF char_length(p_consent_notice_version) < 8
    OR char_length(p_consent_notice_version) > 100 THEN
    RAISE EXCEPTION 'newsletter_invalid_consent_notice';
  END IF;
  IF p_visitor_hash IS NOT NULL AND (
    SELECT COUNT(*)
    FROM newsletter_signup_events
    WHERE visitor_hash = p_visitor_hash
      AND created_at > NOW() - INTERVAL '1 hour'
  ) >= 5 THEN
    RAISE EXCEPTION 'newsletter_rate_limited';
  END IF;

  INSERT INTO newsletter_subscribers (
    email,
    email_normalized,
    first_source,
    last_source,
    consent_notice_version
  )
  VALUES (
    v_email,
    v_email,
    v_source,
    v_source,
    p_consent_notice_version
  )
  ON CONFLICT (email_normalized) DO NOTHING
  RETURNING * INTO v_subscriber;

  IF FOUND THEN
    v_created := TRUE;

    SELECT result.receipt_token
    INTO v_receipt
    FROM agent_create_intake(
      p_idempotency_key => 'newsletter:' || md5(v_email),
      p_message => 'New email subscriber from ' || v_source || '.',
      p_route => 'intake',
      p_reason_codes => ARRAY['newsletter_signup'],
      p_policy_version => 'newsletter/2026-07-23',
      p_consent_notice_version => p_consent_notice_version,
      p_page_context => CASE WHEN v_source = 'tfn-footer' THEN '/toothfairy' ELSE '/' END,
      p_visitor_hash => p_visitor_hash,
      p_display_name => NULL,
      p_reply_email => v_email
    ) AS result;

    UPDATE newsletter_subscribers
    SET intake_receipt_token = v_receipt, updated_at = NOW()
    WHERE id = v_subscriber.id
    RETURNING * INTO v_subscriber;
  ELSE
    UPDATE newsletter_subscribers
    SET
      last_source = v_source,
      last_seen_at = NOW(),
      status = CASE WHEN status = 'unsubscribed' THEN 'subscribed' ELSE status END,
      consent_notice_version = p_consent_notice_version,
      consented_at = CASE WHEN status = 'unsubscribed' THEN NOW() ELSE consented_at END,
      unsubscribed_at = CASE WHEN status = 'unsubscribed' THEN NULL ELSE unsubscribed_at END,
      updated_at = NOW()
    WHERE email_normalized = v_email
    RETURNING * INTO v_subscriber;
    v_receipt := v_subscriber.intake_receipt_token;
  END IF;

  INSERT INTO newsletter_signup_events (
    subscriber_id,
    visitor_hash,
    email_hash,
    source
  )
  VALUES (
    v_subscriber.id,
    p_visitor_hash,
    md5(v_email),
    v_source
  );

  RETURN QUERY SELECT
    v_subscriber.id,
    v_created,
    v_subscriber.status,
    v_receipt,
    v_subscriber.unsubscribe_token,
    v_subscriber.confirmation_sent_at;
END;
$$;

REVOKE ALL ON FUNCTION newsletter_subscribe(TEXT, TEXT, TEXT, TEXT)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION newsletter_subscribe(TEXT, TEXT, TEXT, TEXT)
  TO service_role;

CREATE FUNCTION newsletter_unsubscribe(p_token UUID)
RETURNS TABLE (found BOOLEAN, status TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_status TEXT;
BEGIN
  UPDATE newsletter_subscribers
  SET
    status = 'unsubscribed',
    unsubscribed_at = COALESCE(unsubscribed_at, NOW()),
    updated_at = NOW()
  WHERE unsubscribe_token = p_token
  RETURNING newsletter_subscribers.status INTO v_status;

  RETURN QUERY SELECT v_status IS NOT NULL, COALESCE(v_status, 'unknown');
END;
$$;

REVOKE ALL ON FUNCTION newsletter_unsubscribe(UUID)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION newsletter_unsubscribe(UUID)
  TO service_role;
