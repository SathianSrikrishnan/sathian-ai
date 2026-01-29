import { supabaseAdmin, Memory, Session, Conversation } from './supabase'

/**
 * Database-backed memory system for Kai
 * Complements the file-based memory.ts with persistent storage
 */

/**
 * Start a new conversation session
 */
export async function startSession(mode: Session['mode'] = 'default'): Promise<string | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from('sessions')
      .insert({ mode })
      .select('id')
      .single()

    if (error) {
      console.log('[DB Memory] Failed to start session:', error.message)
      return null
    }

    return data.id
  } catch (error) {
    console.error('[DB Memory] Error starting session:', error)
    return null
  }
}

/**
 * End a conversation session with summary
 */
export async function endSession(sessionId: string, summary?: string): Promise<void> {
  try {
    await supabaseAdmin
      .from('sessions')
      .update({
        ended_at: new Date().toISOString(),
        context_summary: summary,
      })
      .eq('id', sessionId)
  } catch (error) {
    console.error('[DB Memory] Error ending session:', error)
  }
}

/**
 * Save a conversation turn
 */
export async function saveConversation(
  sessionId: string | null,
  role: 'user' | 'assistant',
  content: string,
  audioUrl?: string
): Promise<void> {
  if (!sessionId) return

  try {
    // Save the conversation
    const { error: insertError } = await supabaseAdmin.from('conversations').insert({
      session_id: sessionId,
      role,
      content,
      audio_url: audioUrl,
    })

    if (insertError) {
      console.log('[DB Memory] Could not save conversation:', insertError.message)
      return
    }

    // Update message count manually (no RPC needed)
    const { data } = await supabaseAdmin
      .from('sessions')
      .select('message_count')
      .eq('id', sessionId)
      .single()

    if (data) {
      await supabaseAdmin
        .from('sessions')
        .update({ message_count: (data.message_count || 0) + 1 })
        .eq('id', sessionId)
    }
  } catch (error) {
    console.error('[DB Memory] Error saving conversation:', error)
  }
}

/**
 * Get recent conversations for context
 */
export async function getRecentConversations(limit: number = 10): Promise<Conversation[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from('conversations')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit)

    if (error) {
      console.log('[DB Memory] Could not load conversations:', error.message)
      return []
    }

    return data || []
  } catch (error) {
    console.error('[DB Memory] Error getting conversations:', error)
    return []
  }
}

/**
 * Save or update a memory about the user
 */
export async function saveMemory(
  key: string,
  value: string,
  category: string = 'general',
  importance: number = 5
): Promise<void> {
  try {
    const { error } = await supabaseAdmin
      .from('memory')
      .upsert(
        {
          key,
          value,
          category,
          importance,
          last_used: new Date().toISOString(),
        },
        { onConflict: 'key' }
      )

    if (error) {
      console.log('[DB Memory] Failed to save memory:', error.message)
    }
  } catch (error) {
    console.error('[DB Memory] Error saving memory:', error)
  }
}

/**
 * Get memories by category
 */
export async function getMemories(category?: string): Promise<Memory[]> {
  try {
    let query = supabaseAdmin
      .from('memory')
      .select('*')
      .order('importance', { ascending: false })
      .order('last_used', { ascending: false })

    if (category) {
      query = query.eq('category', category)
    }

    const { data, error } = await query.limit(20)

    if (error) {
      console.log('[DB Memory] Could not load memories:', error.message)
      return []
    }

    return data || []
  } catch (error) {
    console.error('[DB Memory] Error getting memories:', error)
    return []
  }
}

/**
 * Update memory usage tracking
 */
export async function touchMemory(key: string): Promise<void> {
  try {
    const { data } = await supabaseAdmin
      .from('memory')
      .select('times_referenced')
      .eq('key', key)
      .single()

    if (data) {
      await supabaseAdmin
        .from('memory')
        .update({
          times_referenced: (data.times_referenced || 0) + 1,
          last_used: new Date().toISOString(),
        })
        .eq('key', key)
    }
  } catch (error) {
    console.error('[DB Memory] Error touching memory:', error)
  }
}

/**
 * Extract and save memories from a conversation
 * Simple heuristic extraction - could be enhanced with LLM
 */
export async function extractMemories(userText: string, assistantText: string): Promise<void> {
  // Look for "I" statements that reveal preferences/facts
  const iStatements = userText.match(/I (?:am|like|prefer|hate|love|need|want|work|live)\s+[^.!?]+/gi)

  if (iStatements) {
    for (const statement of iStatements.slice(0, 3)) {
      const key = statement.slice(0, 50).toLowerCase().replace(/\s+/g, '_')
      await saveMemory(key, statement, 'user_stated', 6)
    }
  }

  // Look for names mentioned
  const namePattern = /(?:my (?:friend|colleague|partner|wife|husband|brother|sister)|called|named)\s+([A-Z][a-z]+)/g
  let match
  while ((match = namePattern.exec(userText)) !== null) {
    await saveMemory(`person_${match[1].toLowerCase()}`, `${match[0]}`, 'people', 7)
  }
}

/**
 * Get all memories formatted for context injection
 */
export async function getMemoriesForContext(): Promise<string> {
  const memories = await getMemories()

  if (memories.length === 0) {
    return ''
  }

  const byCategory: Record<string, Memory[]> = {}
  for (const mem of memories) {
    const cat = mem.category || 'general'
    if (!byCategory[cat]) byCategory[cat] = []
    byCategory[cat].push(mem)
  }

  let result = '## Learned Memories\n\n'
  for (const [category, mems] of Object.entries(byCategory)) {
    result += `### ${category}\n`
    for (const m of mems) {
      result += `- ${m.key}: ${m.value}\n`
    }
    result += '\n'
  }

  return result
}
