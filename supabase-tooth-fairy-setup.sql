-- Tooth Fairy App - Supabase Table Setup
-- Run this in the Supabase SQL Editor

-- Create tooth_states table
CREATE TABLE IF NOT EXISTS tooth_states (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  child_name TEXT NOT NULL,
  tooth_position INTEGER NOT NULL CHECK (tooth_position >= 0 AND tooth_position < 20),
  state TEXT NOT NULL CHECK (state IN ('healthy', 'wiggly', 'lost')),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Unique constraint: one record per child per tooth
  UNIQUE(child_name, tooth_position)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_tooth_states_child ON tooth_states(child_name);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE tooth_states ENABLE ROW LEVEL SECURITY;

-- Allow public read/write for now (since this is a family app)
-- You can restrict this later
CREATE POLICY "Allow all access to tooth_states" ON tooth_states
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Grant permissions
GRANT ALL ON tooth_states TO anon;
GRANT ALL ON tooth_states TO authenticated;
