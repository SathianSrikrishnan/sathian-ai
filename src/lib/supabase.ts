import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Client for browser/public operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client for server-side operations (has full access)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)

// Types for our database tables
export interface Context {
  id: string
  category: string
  subcategory: string | null
  title: string
  content: string
  source_file: string | null
  importance: number
  created_at: string
  updated_at: string
}

export interface Memory {
  id: string
  key: string
  value: string
  category: string
  importance: number
  times_referenced: number
  last_used: string
  created_at: string
}

export interface Conversation {
  id: string
  session_id: string
  role: 'user' | 'assistant'
  content: string
  audio_url: string | null
  timestamp: string
}

export interface Session {
  id: string
  mode: 'walking' | 'deep_work' | 'quick_query' | 'delegation' | 'default'
  started_at: string
  ended_at: string | null
  context_summary: string | null
  message_count: number
}

export interface Task {
  id: string
  description: string
  status: 'pending_approval' | 'approved' | 'in_progress' | 'completed' | 'rejected'
  permissions_needed: string[] | null
  created_at: string
  completed_at: string | null
  result: string | null
}
