-- Migration 20260714130000: durable public-agent message rate limiting.

CREATE TABLE agent_message_rate_limits (
  visitor_hash TEXT PRIMARY KEY CHECK (visitor_hash ~ '^[a-f0-9]{64}$'),
  window_started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  attempt_count INTEGER NOT NULL DEFAULT 0 CHECK (attempt_count >= 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE agent_message_rate_limits ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON agent_message_rate_limits FROM PUBLIC, anon, authenticated;
GRANT ALL ON agent_message_rate_limits TO service_role;

CREATE OR REPLACE FUNCTION agent_consume_message_rate_limit(
  p_visitor_hash TEXT,
  p_limit INTEGER DEFAULT 30,
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
  IF p_limit < 1 OR p_limit > 120 OR p_window_seconds < 60 OR p_window_seconds > 86400 THEN
    RAISE EXCEPTION 'Invalid message rate limit';
  END IF;

  INSERT INTO agent_message_rate_limits AS limits (
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

REVOKE ALL ON FUNCTION agent_consume_message_rate_limit(TEXT, INTEGER, INTEGER)
  FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION agent_consume_message_rate_limit(TEXT, INTEGER, INTEGER)
  TO service_role;
