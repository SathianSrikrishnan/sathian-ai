-- Dedicated, private newsletter storage with a durable Telegram receipt.
-- Browser clients cannot read or write this table. The public route calls the
-- service-role-only RPC after hashing the visitor address in the application.

CREATE TABLE newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  email_normalized TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'subscribed'
    CHECK (status IN ('subscribed', 'unsubscribed', 'bounced')),
  first_source TEXT NOT NULL,
  last_source TEXT NOT NULL,
  consent_notice_version TEXT NOT NULL,
  consented_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_seen_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  confirmation_sent_at TIMESTAMPTZ,
  intake_receipt_token UUID,
  metadata JSONB NOT NULL DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (char_length(email_normalized) BETWEEN 3 AND 320),
  CHECK (email_normalized = lower(btrim(email_normalized)))
);

CREATE TABLE newsletter_signup_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscriber_id UUID REFERENCES newsletter_subscribers(id) ON DELETE SET NULL,
  visitor_hash TEXT,
  email_hash TEXT NOT NULL,
  source TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_newsletter_subscribers_status_created
  ON newsletter_subscribers(status, created_at DESC);
CREATE INDEX idx_newsletter_signup_events_visitor
  ON newsletter_signup_events(visitor_hash, created_at DESC)
  WHERE visitor_hash IS NOT NULL;
CREATE INDEX idx_newsletter_signup_events_retention
  ON newsletter_signup_events(created_at);

ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_signup_events ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON newsletter_subscribers FROM anon, authenticated;
REVOKE ALL ON newsletter_signup_events FROM anon, authenticated;
GRANT ALL ON newsletter_subscribers TO service_role;
GRANT ALL ON newsletter_signup_events TO service_role;
GRANT SELECT, UPDATE ON newsletter_subscribers TO authenticated;
GRANT SELECT ON newsletter_signup_events TO authenticated;

CREATE POLICY "Studio manages newsletter subscribers"
  ON newsletter_subscribers FOR ALL TO authenticated
  USING (is_studio_operator()) WITH CHECK (is_studio_operator());
CREATE POLICY "Studio reads newsletter signup events"
  ON newsletter_signup_events FOR SELECT TO authenticated
  USING (is_studio_operator());

CREATE OR REPLACE FUNCTION newsletter_subscribe(
  p_email TEXT,
  p_source TEXT,
  p_consent_notice_version TEXT,
  p_visitor_hash TEXT DEFAULT NULL
)
RETURNS TABLE (
  subscriber_id UUID,
  created BOOLEAN,
  status TEXT,
  receipt_token UUID
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

  RETURN QUERY SELECT v_subscriber.id, v_created, v_subscriber.status, v_receipt;
END;
$$;

REVOKE ALL ON FUNCTION newsletter_subscribe(TEXT, TEXT, TEXT, TEXT)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION newsletter_subscribe(TEXT, TEXT, TEXT, TEXT)
  TO service_role;;
