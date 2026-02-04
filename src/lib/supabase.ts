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

// ============================================
// TOOTH FAIRY APP
// ============================================

export type ToothState = 'healthy' | 'wiggly' | 'lost'

export interface ToothRecord {
  id?: string
  child_name: string
  tooth_position: number
  state: ToothState
  updated_at?: string
}

// Save tooth state
export async function saveToothState(childName: string, position: number, state: ToothState) {
  const { data, error } = await supabase
    .from('tooth_states')
    .upsert({
      child_name: childName,
      tooth_position: position,
      state: state,
      updated_at: new Date().toISOString()
    }, {
      onConflict: 'child_name,tooth_position'
    })

  if (error) console.error('Error saving tooth state:', error)
  return { data, error }
}

// Get all tooth states for a child
export async function getToothStates(childName: string): Promise<ToothRecord[]> {
  const { data, error } = await supabase
    .from('tooth_states')
    .select('*')
    .eq('child_name', childName)

  if (error) {
    console.error('Error fetching tooth states:', error)
    return []
  }
  return data || []
}

// Count lost teeth for a child
export async function countLostTeeth(childName: string): Promise<number> {
  const { count, error } = await supabase
    .from('tooth_states')
    .select('*', { count: 'exact', head: true })
    .eq('child_name', childName)
    .eq('state', 'lost')

  if (error) {
    console.error('Error counting lost teeth:', error)
    return 0
  }
  return count || 0
}
