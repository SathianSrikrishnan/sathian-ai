-- Retire stale portfolio cards and refresh the canonical Tooth Fairy Network
-- card. History is preserved; no public-memory rows are deleted.

BEGIN;

UPDATE public_memory_cards
SET
  status = 'retired',
  updated_at = NOW()
WHERE slug IN (
  'sathian-ai-practice',
  'btc-cultural-atlas',
  'lex-rooftop-garden'
);

UPDATE public_memory_cards
SET
  title = 'Tooth Fairy Network',
  body = 'Tooth Fairy Network turns a child''s drawing and story into a private time capsule with an optional guardian-controlled future gift. Its deployed Solana Mainnet program is live and supports time-locked SOL and canonical USDC deposits. Verified founder-controlled canaries proved both rails. The public USDC experience and on-ramp remains behind a release gate until the customer flow is approved. Private child content stays off-chain by default.',
  summary = 'A private family time capsule with an optional, guardian-controlled future gift secured on Solana.',
  tags = ARRAY[
    'project',
    'primary-build',
    'tooth-fairy-network',
    'toothlight',
    'solana',
    'mainnet',
    'family-savings',
    'ownership',
    'transparent-value-transfer'
  ],
  source_ref = 'https://toothfairy.network',
  source_kind = 'published_project',
  visibility = 'public',
  status = 'approved',
  valid_until = NULL,
  updated_at = NOW()
WHERE slug = 'tooth-fairy-network';

COMMIT;
