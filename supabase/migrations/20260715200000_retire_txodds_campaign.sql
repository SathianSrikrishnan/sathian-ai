-- Preserve the short-lived campaign records for audit history while removing
-- them from the approved public-agent retrieval surface.

UPDATE public_memory_cards
SET
  status = 'retired',
  valid_until = COALESCE(valid_until, NOW()),
  updated_at = NOW()
WHERE slug IN (
  'txodds-canada-referral-sprint',
  'txodds-world-cup-hackathon'
)
AND status <> 'retired';
