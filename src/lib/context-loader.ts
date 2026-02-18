import { supabaseAdmin, Context } from './supabase'

// Fallback context if database isn't set up yet
// This must only contain PUBLIC-safe information
const FALLBACK_CONTEXT = `
CORE IDENTITY:
- You are Kai, Sathian's personal digital assistant
- Model-agnostic. Intelligence stored locally. You speak conversationally — concise, direct, and warm.

ABOUT SATHIAN:
- Technologist, builder, digital anthropologist, historian based in Toronto
- Entrepreneur for 20+ years. Late bloomer. Self-taught.
- Father of twins — his children are a big part of his life and inspiration
- Building personal AI infrastructure and technology advisory
- Passionate about in-person connection — 100+ dinners with strangers in Toronto

PROJECTS:
- Kai (this system), Tooth Fairy Network, Cultural Atlas, Storybook Universe, Writings

VALUES:
- Radical honesty, long-game thinking, building in public, financial sovereignty
- Bitcoin as foundation for financial freedom — builder, not trader
`

export interface LoadedContext {
  universal: string
  relevant: string
  memories: string
  fromDatabase: boolean
}

/**
 * Load context from Supabase database
 * Falls back to hardcoded context if tables don't exist
 */
export async function loadContext(topic?: string): Promise<LoadedContext> {
  try {
    if (!supabaseAdmin) {
      return { universal: FALLBACK_CONTEXT, relevant: '', memories: '', fromDatabase: false }
    }
    // Try to load universal context (highest importance)
    const { data: universalData, error: universalError } = await supabaseAdmin
      .from('context')
      .select('*')
      .eq('category', 'universal')
      .order('importance', { ascending: false })
      .limit(10)

    if (universalError) {
      console.log('[Context] Database not ready, using fallback:', universalError.message)
      return {
        universal: FALLBACK_CONTEXT,
        relevant: '',
        memories: '',
        fromDatabase: false,
      }
    }

    // Load relevant context based on topic if provided
    let relevantData: Context[] = []
    if (topic) {
      const { data } = await supabaseAdmin
        .from('context')
        .select('*')
        .textSearch('content', topic, { type: 'websearch' })
        .limit(5)
      relevantData = data || []
    }

    // Load recent memories
    const { data: memoriesData } = await supabaseAdmin
      .from('memory')
      .select('*')
      .order('importance', { ascending: false })
      .order('last_used', { ascending: false })
      .limit(10)

    // Format context for prompt
    const universalText = universalData
      ?.map(c => `## ${c.title}\n${c.content}`)
      .join('\n\n') || ''

    const relevantText = relevantData
      .map(c => `## ${c.title}\n${c.content}`)
      .join('\n\n')

    const memoriesText = memoriesData
      ?.map(m => `- ${m.key}: ${m.value}`)
      .join('\n') || ''

    return {
      universal: universalText || FALLBACK_CONTEXT,
      relevant: relevantText,
      memories: memoriesText,
      fromDatabase: true,
    }
  } catch (error) {
    console.error('[Context] Error loading context:', error)
    return {
      universal: FALLBACK_CONTEXT,
      relevant: '',
      memories: '',
      fromDatabase: false,
    }
  }
}

/**
 * Build a full system prompt with loaded context
 * Used by voice routes (PIN-gated, so this is for Sathian's private use)
 */
export function buildSystemPrompt(context: LoadedContext): string {
  let prompt = `You are Kai, Sathian's personal AI assistant. You speak conversationally - concise, direct, and warm.

CORE CONTEXT:
${context.universal}
`

  if (context.relevant) {
    prompt += `
RELEVANT TO THIS CONVERSATION:
${context.relevant}
`
  }

  if (context.memories) {
    prompt += `
THINGS I REMEMBER ABOUT SATHIAN:
${context.memories}
`
  }

  prompt += `
VOICE INTERACTION RULES:
- Keep responses SHORT for voice (2-4 sentences typical, unless asked for detail)
- Be conversational - this is spoken, not written
- When given multiple tasks, confirm understanding before executing
- Ask permission before taking significant actions
- If uncertain, ask rather than assume

When responding:
1. Acknowledge what you heard
2. Provide value immediately
3. If action needed, state what you'll do and ask for permission
4. Keep it tight - this is voice, not text`

  return prompt
}
