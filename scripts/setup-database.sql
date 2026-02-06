-- Kai Voice Database Schema
-- Run this in your Supabase SQL Editor

-- Context table: Stores all knowledge from kai/context
CREATE TABLE IF NOT EXISTS context (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  subcategory TEXT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  source_file TEXT,
  importance INTEGER DEFAULT 5 CHECK (importance >= 1 AND importance <= 10),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Memory table: Things Kai learns about the user over time
CREATE TABLE IF NOT EXISTS memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  importance INTEGER DEFAULT 5 CHECK (importance >= 1 AND importance <= 10),
  times_referenced INTEGER DEFAULT 0,
  last_used TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sessions table: Track conversation sessions
CREATE TABLE IF NOT EXISTS sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mode TEXT DEFAULT 'default' CHECK (mode IN ('walking', 'deep_work', 'quick_query', 'delegation', 'default')),
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ended_at TIMESTAMP WITH TIME ZONE,
  context_summary TEXT,
  message_count INTEGER DEFAULT 0
);

-- Conversations table: Store all voice conversations
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  audio_url TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks table: Track delegated tasks and permissions
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  description TEXT NOT NULL,
  status TEXT DEFAULT 'pending_approval' CHECK (status IN ('pending_approval', 'approved', 'in_progress', 'completed', 'rejected')),
  permissions_needed TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE,
  result TEXT
);

-- Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_context_category ON context(category);
CREATE INDEX IF NOT EXISTS idx_context_importance ON context(importance DESC);
CREATE INDEX IF NOT EXISTS idx_memory_category ON memory(category);
CREATE INDEX IF NOT EXISTS idx_memory_importance ON memory(importance DESC);
CREATE INDEX IF NOT EXISTS idx_memory_last_used ON memory(last_used DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_session ON conversations(session_id);
CREATE INDEX IF NOT EXISTS idx_conversations_timestamp ON conversations(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_sessions_started ON sessions(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);

-- Enable Row Level Security (RLS)
ALTER TABLE context ENABLE ROW LEVEL SECURITY;
ALTER TABLE memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Policies: Allow all operations for authenticated service role
-- (We use service role key from server, so these are permissive)
CREATE POLICY "Allow all for service role" ON context FOR ALL USING (true);
CREATE POLICY "Allow all for service role" ON memory FOR ALL USING (true);
CREATE POLICY "Allow all for service role" ON sessions FOR ALL USING (true);
CREATE POLICY "Allow all for service role" ON conversations FOR ALL USING (true);
CREATE POLICY "Allow all for service role" ON tasks FOR ALL USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for context table
DROP TRIGGER IF EXISTS update_context_updated_at ON context;
CREATE TRIGGER update_context_updated_at
  BEFORE UPDATE ON context
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Insert some initial context (Kai's identity)
INSERT INTO context (category, subcategory, title, content, importance) VALUES
('universal', 'identity', 'Kai Identity', 'Kai is Sathian''s personal AI assistant. Built on Claude, customized for deep context and leverage. Kai speaks conversationally, is proactive, and helps systematize workflows.', 10),
('universal', 'goals', 'Core Goals', 'Build leverage through repeatable patterns and workflows. Systematize everything. Enable delegation. Move from AI-with-capabilities to digital-assistant-that-knows-me.', 10),
('universal', 'principles', 'Operating Principles', 'Context > Model. Permission to fail. Three-level loading. Always ask before significant actions. Confirm understanding before executing multiple tasks.', 9)
ON CONFLICT DO NOTHING;
