-- Migration 20260714103000: typed content records for the private Studio control room.

CREATE TABLE homepage_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT NOT NULL UNIQUE CHECK (section_key ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  section_type TEXT NOT NULL CHECK (
    section_type IN ('hero', 'projects', 'building', 'writing', 'practice', 'about', 'agent')
  ),
  label TEXT CHECK (label IS NULL OR char_length(label) BETWEEN 1 AND 80),
  heading TEXT CHECK (heading IS NULL OR char_length(heading) BETWEEN 1 AND 160),
  description TEXT CHECK (description IS NULL OR char_length(description) BETWEEN 1 AND 600),
  cta_label TEXT CHECK (cta_label IS NULL OR char_length(cta_label) BETWEEN 1 AND 80),
  cta_href TEXT CHECK (
    cta_href IS NULL OR
    cta_href ~ '^/[^/]' OR
    cta_href ~ '^https://'
  ),
  enabled BOOLEAN NOT NULL DEFAULT TRUE,
  position INTEGER NOT NULL CHECK (position BETWEEN 0 AND 50),
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_homepage_sections_order ON homepage_sections(enabled, position);

CREATE TABLE build_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE CHECK (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title TEXT NOT NULL CHECK (char_length(title) BETWEEN 1 AND 160),
  project TEXT NOT NULL CHECK (char_length(project) BETWEEN 1 AND 100),
  note_date DATE NOT NULL,
  what_changed TEXT NOT NULL CHECK (char_length(what_changed) BETWEEN 1 AND 1200),
  what_learned TEXT NOT NULL CHECK (char_length(what_learned) BETWEEN 1 AND 1200),
  next_step TEXT NOT NULL CHECK (char_length(next_step) BETWEEN 1 AND 1200),
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  published_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (status <> 'published' OR published_at IS NOT NULL)
);

CREATE INDEX idx_build_notes_publication ON build_notes(status, note_date DESC);

ALTER TABLE homepage_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE build_notes ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON homepage_sections FROM anon, authenticated;
REVOKE ALL ON build_notes FROM anon, authenticated;
GRANT SELECT ON homepage_sections TO anon, authenticated;
GRANT SELECT ON build_notes TO anon, authenticated;
GRANT ALL ON homepage_sections TO authenticated, service_role;
GRANT ALL ON build_notes TO authenticated, service_role;

CREATE POLICY "Public reads enabled homepage sections"
  ON homepage_sections
  FOR SELECT
  TO anon, authenticated
  USING (enabled = TRUE);

CREATE POLICY "Studio manages homepage sections"
  ON homepage_sections
  FOR ALL
  TO authenticated
  USING (is_studio_operator())
  WITH CHECK (is_studio_operator());

CREATE POLICY "Public reads published build notes"
  ON build_notes
  FOR SELECT
  TO anon, authenticated
  USING (status = 'published');

CREATE POLICY "Studio manages build notes"
  ON build_notes
  FOR ALL
  TO authenticated
  USING (is_studio_operator())
  WITH CHECK (is_studio_operator());

INSERT INTO homepage_sections (
  section_key,
  section_type,
  label,
  heading,
  description,
  cta_label,
  cta_href,
  enabled,
  position
)
VALUES
  ('hero', 'hero', 'Currently building', 'Proof of work, in public.', 'Products, small AI systems, and essays from the workbench.', 'See what is moving', '/#now', TRUE, 0),
  ('projects', 'projects', 'Now', 'Three things with a pulse.', 'The projects receiving real attention now.', NULL, NULL, TRUE, 1),
  ('building', 'building', 'Building in public', 'A dated record, including the misses.', 'What changed, what I learned, and what comes next.', NULL, NULL, TRUE, 2),
  ('writing', 'writing', 'Writing', 'Essays from the workbench.', NULL, 'All writing', '/writings', TRUE, 3),
  ('practice', 'practice', 'AI practice', 'Useful systems, kept close to the work.', 'Small AI systems around real work, persistent context, tools, and review loops.', NULL, NULL, TRUE, 4),
  ('about', 'about', 'About', 'Builder. Student. Father.', 'Writing and code about money, culture, memory, and adaptation.', 'A little more context', '/about', TRUE, 5),
  ('agent', 'agent', 'A direct doorway', 'Ask my agent', 'Public knowledge, useful answers, and a safe way to leave a note.', NULL, NULL, TRUE, 6)
ON CONFLICT (section_key) DO NOTHING;

INSERT INTO build_notes (
  slug,
  title,
  project,
  note_date,
  what_changed,
  what_learned,
  next_step,
  status,
  published_at
)
VALUES
  (
    'the-chatbot-becomes-a-doorway',
    'The chatbot becomes a doorway',
    'sathian.ai',
    '2026-07-14',
    'Removed duplicate prompts, retired Notion logging, and made forwarding visible.',
    'A useful agent needs clearer boundaries before it needs more tools.',
    'Reviewed public memory, durable receipts, and one-way Telegram delivery.',
    'published',
    NOW()
  ),
  (
    'back-to-the-ritual',
    'Back to the ritual',
    'Tooth Fairy Network',
    '2026-07-11',
    'Moved the product toward drawings, stories, and the words children attach to them.',
    'The memory is the product. The technical rails should stay underneath it.',
    'Learn from the first hundred families and remove what does not feel meaningful.',
    'published',
    NOW()
  )
ON CONFLICT (slug) DO NOTHING;
