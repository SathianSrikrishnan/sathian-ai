import { buildAgentPrompt } from '@/lib/agent/prompt'
import type { AgentPolicyDecision, PublicMemoryCard } from '@/lib/agent/types'

const ABSOLUTE_MAX_TOKENS = 400
const DEFAULT_TIMEOUT_MS = 8_000
const MAX_ANSWER_CHARS = 4_000

const STOP_WORDS = new Set([
  'about', 'are', 'can', 'could', 'does', 'favorite', 'from', 'have', 'is', 'read',
  'sathian', 'should', 'tell', 'that', 'the', 'their', 'this', 'what', 'which', 'with',
  'would', 'your',
])

const SAFE_UNKNOWN = "I don't have approved public information about that. You can leave Sathian a note if you'd like."
export const SAFE_MODEL_FAILURE = 'I could not answer that safely right now. If you left a note, it is still handled separately from this answer.'

export interface AnswerModelAdapter {
  generate(input: {
    system: string
    user: string
    maxTokens: number
    signal: AbortSignal
  }): Promise<string>
}

export interface AgentAnswerResult {
  answer: string
  sources: string[]
  unknown: boolean
  modelUsed: boolean
}

function meaningfulTokens(message: string): string[] {
  return message
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length >= 3 && !STOP_WORDS.has(token))
}

function hasRelevantCard(message: string, cards: PublicMemoryCard[]): boolean {
  if (/\b(who are you|what are you|are you sathian)\b/i.test(message)) return true
  const tokens = meaningfulTokens(message)
  if (tokens.length === 0) return false

  return cards.some((card) => {
    const haystack = `${card.title} ${card.body} ${card.tags.join(' ')}`.toLowerCase()
    return tokens.some((token) => haystack.includes(token))
  })
}

function uniqueSources(cards: PublicMemoryCard[]): string[] {
  return Array.from(new Set(cards.map((card) => card.source.ref)))
}

export async function answerAgentQuestion(
  input: {
    message: string
    page: string
    policy: AgentPolicyDecision
    cards: PublicMemoryCard[]
  },
  options: {
    model: AnswerModelAdapter
    maxTokens?: number
    timeoutMs?: number
  },
): Promise<AgentAnswerResult> {
  if (!hasRelevantCard(input.message, input.cards)) {
    return { answer: SAFE_UNKNOWN, sources: [], unknown: true, modelUsed: false }
  }

  const controller = new AbortController()
  const timeoutMs = Math.max(1, options.timeoutMs ?? DEFAULT_TIMEOUT_MS)
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const answer = await Promise.race([
      options.model.generate({
        system: buildAgentPrompt({ cards: input.cards, page: input.page, policy: input.policy }),
        user: input.message,
        maxTokens: Math.min(Math.max(options.maxTokens ?? ABSOLUTE_MAX_TOKENS, 1), ABSOLUTE_MAX_TOKENS),
        signal: controller.signal,
      }),
      new Promise<never>((_resolve, reject) => {
        controller.signal.addEventListener('abort', () => reject(new Error('answer_timeout')), { once: true })
      }),
    ])

    const normalized = answer.trim().slice(0, MAX_ANSWER_CHARS)
    if (!normalized) throw new Error('empty_answer')

    return {
      answer: normalized,
      sources: uniqueSources(input.cards),
      unknown: false,
      modelUsed: true,
    }
  } catch {
    return {
      answer: SAFE_MODEL_FAILURE,
      sources: [],
      unknown: true,
      modelUsed: false,
    }
  } finally {
    clearTimeout(timer)
  }
}
