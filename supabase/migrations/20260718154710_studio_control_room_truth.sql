-- Stage Studio edits separately from the published homepage projection.
ALTER TABLE homepage_sections
  ADD COLUMN draft_label TEXT CHECK (draft_label IS NULL OR char_length(draft_label) BETWEEN 1 AND 80),
  ADD COLUMN draft_heading TEXT CHECK (draft_heading IS NULL OR char_length(draft_heading) BETWEEN 1 AND 160),
  ADD COLUMN draft_description TEXT CHECK (draft_description IS NULL OR char_length(draft_description) BETWEEN 1 AND 600),
  ADD COLUMN draft_cta_label TEXT CHECK (draft_cta_label IS NULL OR char_length(draft_cta_label) BETWEEN 1 AND 80),
  ADD COLUMN draft_cta_href TEXT CHECK (
    draft_cta_href IS NULL OR draft_cta_href ~ '^/[^/]' OR draft_cta_href ~ '^https://'
  ),
  ADD COLUMN draft_enabled BOOLEAN,
  ADD COLUMN draft_position INTEGER CHECK (draft_position IS NULL OR draft_position BETWEEN 0 AND 50),
  ADD COLUMN last_published_at TIMESTAMPTZ;
-- Bring the typed records to parity with the locked July 18 public baseline
-- before draft values are initialized.
UPDATE homepage_sections SET
  label = 'SATHIAN S. / TORONTO / CURRENTLY BUILDING',
  heading = 'Proof of work, in public.',
  description = 'I build products and small AI systems. I write about what I am learning, from childhood rituals to Solana and personal AI. The site agent is the quickest way to ask what I am working on or leave me a note.',
  cta_label = 'Ask the site agent',
  cta_href = '/#agent',
  enabled = TRUE,
  position = 0,
  updated_at = NOW()
WHERE section_key = 'hero';
UPDATE homepage_sections SET
  label = 'NOW', heading = 'Projects with a pulse.', description = NULL,
  cta_label = NULL, cta_href = NULL, enabled = TRUE, position = 1, updated_at = NOW()
WHERE section_key = 'projects';
UPDATE homepage_sections SET
  label = 'Building in public', heading = 'Active building logs.', description = NULL,
  cta_label = NULL, cta_href = NULL, enabled = TRUE, position = 2, updated_at = NOW()
WHERE section_key = 'building';
UPDATE homepage_sections SET
  label = 'WRITING', heading = 'Essays from the workbench.', description = NULL,
  cta_label = 'All writing', cta_href = '/writings', enabled = TRUE, position = 3, updated_at = NOW()
WHERE section_key = 'writing';
UPDATE homepage_sections SET
  label = 'AI PRACTICE', heading = 'Useful systems, kept close to the work.',
  description = 'I build small AI systems around real work. My own setup runs on persistent context, tools, and review loops. I also help a few people turn repetitive, messy workflows into something useful.',
  cta_label = 'Tell me what keeps getting done by hand', cta_href = '/#agent',
  enabled = TRUE, position = 4, updated_at = NOW()
WHERE section_key = 'practice';
UPDATE homepage_sections SET
  label = 'ABOUT', heading = 'Builder. Student. Father.',
  description = 'I use writing and code to examine money, culture, memory, and how people adapt to new systems. Toronto is home.',
  cta_label = 'A little more context', cta_href = '/about',
  enabled = TRUE, position = 5, updated_at = NOW()
WHERE section_key = 'about';
UPDATE homepage_sections SET
  label = 'PUBLIC CONTEXT / PRIVATE INTAKE', heading = 'Sathian''s site agent',
  description = 'Ask about Sathian''s reviewed public projects, writing, or current work. You can also leave him a note.',
  cta_label = NULL, cta_href = NULL, enabled = TRUE, position = 6, updated_at = NOW()
WHERE section_key = 'agent';
UPDATE homepage_sections SET
  draft_label = label,
  draft_heading = heading,
  draft_description = description,
  draft_cta_label = cta_label,
  draft_cta_href = cta_href,
  draft_enabled = enabled,
  draft_position = position,
  last_published_at = NOW();
-- Publication is atomic: either the complete staged homepage becomes public,
-- or no public section changes. Only the server-side Studio client may call it.
CREATE OR REPLACE FUNCTION studio_publish_homepage(p_actor_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_actor_id IS NULL THEN RAISE EXCEPTION 'Actor is required'; END IF;
  UPDATE homepage_sections SET
    label = draft_label,
    heading = draft_heading,
    description = draft_description,
    cta_label = draft_cta_label,
    cta_href = draft_cta_href,
    enabled = draft_enabled,
    position = draft_position,
    last_published_at = NOW(),
    updated_by = p_actor_id,
    updated_at = NOW();
  INSERT INTO audit_events (actor_type, actor_id, event_type, details)
  VALUES ('operator', p_actor_id, 'homepage_published', jsonb_build_object(
    'section_count', (SELECT COUNT(*) FROM homepage_sections)
  ));
END;
$$;
CREATE OR REPLACE FUNCTION studio_discard_homepage_draft(p_actor_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF p_actor_id IS NULL THEN RAISE EXCEPTION 'Actor is required'; END IF;
  UPDATE homepage_sections SET
    draft_label = label,
    draft_heading = heading,
    draft_description = description,
    draft_cta_label = cta_label,
    draft_cta_href = cta_href,
    draft_enabled = enabled,
    draft_position = position,
    updated_by = p_actor_id,
    updated_at = NOW();
  INSERT INTO audit_events (actor_type, actor_id, event_type, details)
  VALUES ('operator', p_actor_id, 'homepage_draft_discarded', jsonb_build_object(
    'section_count', (SELECT COUNT(*) FROM homepage_sections)
  ));
END;
$$;
REVOKE ALL ON FUNCTION studio_publish_homepage(UUID) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION studio_discard_homepage_draft(UUID) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION studio_publish_homepage(UUID) TO service_role;
GRANT EXECUTE ON FUNCTION studio_discard_homepage_draft(UUID) TO service_role;
-- Complete the build-note presentation contract so Studio can reproduce the
-- approved public timeline without arbitrary components.
ALTER TABLE build_notes
  ADD COLUMN phase_label TEXT CHECK (phase_label IS NULL OR char_length(phase_label) BETWEEN 1 AND 40),
  ADD COLUMN link_href TEXT CHECK (
    link_href IS NULL OR link_href ~ '^#[a-z0-9-]+' OR link_href ~ '^/[^/]' OR link_href ~ '^https://'
  ),
  ADD COLUMN accent TEXT CHECK (accent IS NULL OR accent ~ '^#[0-9A-Fa-f]{6}$'),
  ADD COLUMN external BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN proof_href TEXT CHECK (proof_href IS NULL OR proof_href ~ '^https://'),
  ADD COLUMN proof_label TEXT CHECK (proof_label IS NULL OR char_length(proof_label) BETWEEN 1 AND 100),
  ADD CONSTRAINT build_notes_proof_pair CHECK ((proof_href IS NULL) = (proof_label IS NULL));
INSERT INTO build_notes (
  slug, title, project, note_date, what_changed, what_learned, next_step,
  phase_label, link_href, accent, external, proof_href, proof_label,
  status, published_at
)
VALUES
  (
    'making-a-childhood-memory-ownable-without-making-it-public',
    'Making a childhood memory ownable without making it public',
    'Tooth Fairy Network', '2026-07-15',
    'Minted one synthetic private-provenance Toothlight on Solana devnet to a disposable guardian wallet. Metaplex DAS independently verified the asset, owner, tree, and metadata. No production or mainnet configuration changed.',
    'A guardian-owned digital keepsake can provide verifiable ownership and provenance while the child''s artwork and the parent''s future letter remain private.',
    'Build the parent-facing wallet experience and compare the current Bubblegum V1 proof with the recommended V2 path before choosing a production standard.',
    'PROVEN', 'https://toothfairy.network', '#B794F6', TRUE,
    'https://explorer.solana.com/tx/2gWn6Jd1avq5pvvUBqBjELSxGKQEpbk5MeMamAQLzMpKeW8xieij4ZHR4iwJ7kchhjjZcAK4fcSaSNw7D8JP3Gke?cluster=devnet',
    'Inspect the devnet transaction', 'published', NOW()
  ),
  (
    'the-chatbot-becomes-a-doorway', 'The chatbot becomes a doorway',
    'SITE AGENT', '2026-07-14',
    'Closed the Studio cookie gap, removed duplicate prompts, retired Notion logging, and made message forwarding visible.',
    'A useful agent needs clearer boundaries before it needs more tools.',
    'Reviewed public memory, durable receipts, and one-way Telegram delivery.',
    'BUILDING', '#agent', '#5EEAD4', FALSE, NULL, NULL, 'published', NOW()
  ),
  (
    'back-to-the-ritual', 'Back to the ritual', 'TOOTH FAIRY NETWORK', '2026-07-11',
    'Moved the product away from technical spectacle and toward drawings, stories, and the words children attach to them.',
    'The memory is the product. The technical rails should stay underneath it.',
    'Find the first hundred families willing to tell me what feels meaningful and what should disappear.',
    'ITERATING', '/writings/the-gap-between-weeks', '#B794F6', FALSE, NULL, NULL, 'published', NOW()
  ),
  (
    'bounded-budgets-for-agents', 'Bounded budgets for agents', 'AGENT ALLOWANCE LAB', '2026-07-02',
    'Shipped a small Solana demo and a receipt-backed technical write-up for agent spending limits.',
    'A useful agent wallet starts with explicit authority, not a bigger balance.',
    'Carry the same bounded-authority idea into the public site agent.',
    'SHIPPED', '/writings/agent-allowance-lab', '#14F195', FALSE, NULL, NULL, 'published', NOW()
  )
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title,
  project = EXCLUDED.project,
  note_date = EXCLUDED.note_date,
  what_changed = EXCLUDED.what_changed,
  what_learned = EXCLUDED.what_learned,
  next_step = EXCLUDED.next_step,
  phase_label = EXCLUDED.phase_label,
  link_href = EXCLUDED.link_href,
  accent = EXCLUDED.accent,
  external = EXCLUDED.external,
  proof_href = EXCLUDED.proof_href,
  proof_label = EXCLUDED.proof_label,
  status = EXCLUDED.status,
  published_at = COALESCE(build_notes.published_at, EXCLUDED.published_at),
  updated_at = NOW();
ALTER TABLE build_notes
  ALTER COLUMN phase_label SET NOT NULL,
  ALTER COLUMN link_href SET NOT NULL,
  ALTER COLUMN accent SET NOT NULL;
-- Operator state is private tactical data. It is separate from Telegram
-- delivery status and never appears in public-agent responses.
ALTER TABLE agent_intakes
  ADD COLUMN operator_status TEXT NOT NULL DEFAULT 'new' CHECK (
    operator_status IN ('new', 'review', 'replied_externally', 'closed', 'spam')
  ),
  ADD COLUMN operator_note TEXT CHECK (operator_note IS NULL OR char_length(operator_note) <= 2000),
  ADD COLUMN operator_updated_at TIMESTAMPTZ,
  ADD COLUMN operator_updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
CREATE INDEX idx_agent_intakes_operator_queue
  ON agent_intakes(operator_status, created_at DESC);
REVOKE ALL ON agent_intakes FROM anon;
