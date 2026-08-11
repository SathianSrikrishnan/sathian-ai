import { buildAgentPrompt } from '@/lib/agent/prompt'
import {
  isContextDependentQuestion,
  type AgentConversationTurn,
} from '@/lib/agent/conversation'
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
  nextAction?: {
    label: string
    href: string
  }
  unknown: boolean
  modelUsed: boolean
  operationalErrorCode?: 'model_timeout' | 'model_error'
}

function isLatestReleaseQuestion(message: string): boolean {
  return /\b(latest|newest|most recent|current)\b.{0,64}\b(release|launch|video|episode)\b/i.test(message)
    || /\bwhat(?:'s| is) new\b/i.test(message)
}

function meaningfulTokens(message: string): string[] {
  return message
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((token) => token.length >= 3 && !STOP_WORDS.has(token))
}

function relevantCards(message: string, cards: PublicMemoryCard[]): PublicMemoryCard[] {
  if (/\b(who are you|what are you|are you sathian)\b/i.test(message)) {
    const identityCards = cards.filter((card) =>
      card.tags.some((tag) => ['bio', 'site-agent', 'public-context'].includes(tag)),
    )
    return (identityCards.length > 0 ? identityCards : cards).slice(0, 12)
  }
  const tokens = meaningfulTokens(message)
  if (tokens.length === 0) return []

  return cards.filter((card) => {
    const haystack = `${card.title} ${card.body} ${card.tags.join(' ')}`.toLowerCase()
    return tokens.some((token) => haystack.includes(token))
  }).slice(0, 12)
}

function uniqueSources(cards: PublicMemoryCard[]): string[] {
  return Array.from(new Set(cards.map((card) => card.source.ref)))
}

function contextualActionHref(sourceRef: string): string {
  try {
    const source = new URL(sourceRef)
    if (['sathian.ai', 'www.sathian.ai'].includes(source.hostname)) {
      return `${source.pathname}${source.search}${source.hash}`
    }
  } catch {
    // Non-URL sources are returned unchanged and filtered by the client.
  }
  return sourceRef
}

function directIntentCard(message: string, cards: PublicMemoryCard[]): {
  card: PublicMemoryCard
  actionLabel: string
} | null {
  const find = (predicate: (card: PublicMemoryCard) => boolean) => cards.find(predicate)
  const hasTag = (tag: string) => (card: PublicMemoryCard) => card.tags.includes(tag)
  const rules: Array<{
    matches: boolean
    card: PublicMemoryCard | undefined
    actionLabel: string
  }> = [
    {
      matches: /\b(tooth fairy network|toothlight|tfn)\b/i.test(message),
      card: find(hasTag('tooth-fairy-network')),
      actionLabel: 'Visit Tooth Fairy Network',
    },
    {
      matches: /\bcoverage ledger\b/i.test(message),
      card: find(hasTag('coverage-ledger')),
      actionLabel: 'Open AutoQuote Automator',
    },
    {
      matches: /\bautoquote(?: automator)?\b/i.test(message),
      card: find(hasTag('autoquote-automator')),
      actionLabel: 'Open AutoQuote Automator',
    },
    {
      matches: /\bclinical\s*guard\b/i.test(message),
      card: find(hasTag('clinicalguard')),
      actionLabel: 'Open ClinicalGuard',
    },
    {
      matches: /\bsolana\b/i.test(message) && /\b(dashboard|observatory|ecosystem|beginner)\b/i.test(message),
      card: find(hasTag('solana-dashboard')),
      actionLabel: 'Open the Solana dashboard',
    },
    {
      matches: /\b(writing|writings|articles|essays)\b/i.test(message),
      card: find((card) => card.id === 'published-writing'),
      actionLabel: 'Browse Sathian’s writing',
    },
    {
      matches: /\b(building now|current public work|working on now)\b/i.test(message),
      card: find((card) => card.id === 'current-public-work'),
      actionLabel: 'Open current work',
    },
  ]

  const match = rules.find((rule) => rule.matches && rule.card)
  return match?.card ? { card: match.card, actionLabel: match.actionLabel } : null
}

function deterministicCardAnswer(
  card: PublicMemoryCard,
  actionLabel: string,
): AgentAnswerResult {
  return {
    answer: `${card.title}. ${card.body}`,
    sources: [card.source.ref],
    nextAction: {
      label: actionLabel,
      href: contextualActionHref(card.source.ref),
    },
    unknown: false,
    modelUsed: false,
  }
}

function normalizeAnswerText(value: string): string {
  return value
    .trim()
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/__([^_]+)__/g, '$1')
    .replace(/\s*—\s*([a-z])/g, (_match, next: string) => `. ${next.toUpperCase()}`)
    .replace(/\s*—\s*/g, '. ')
    .slice(0, MAX_ANSWER_CHARS)
}

export async function answerAgentQuestion(
  input: {
    message: string
    page: string
    policy: AgentPolicyDecision
    cards: PublicMemoryCard[]
    history?: AgentConversationTurn[]
  },
  options: {
    model: AnswerModelAdapter
    maxTokens?: number
    timeoutMs?: number
  },
): Promise<AgentAnswerResult> {
  if (isLatestReleaseQuestion(input.message)) {
    const release = input.cards.find((card) => card.tags.includes('latest-release'))
    if (release) {
      return deterministicCardAnswer(release, 'Open the latest release')
    }
  }

  const contextualQuestion = isContextDependentQuestion(input.message)
    && Boolean(input.history?.length)
  const directMatch = contextualQuestion ? null : directIntentCard(input.message, input.cards)
  if (directMatch) return deterministicCardAnswer(directMatch.card, directMatch.actionLabel)

  const contextQuery = contextualQuestion
    ? `${input.history?.map((turn) => turn.content).join(' ') ?? ''} ${input.message}`
    : input.message
  const cards = relevantCards(contextQuery, input.cards)
  if (cards.length === 0) {
    return { answer: SAFE_UNKNOWN, sources: [], unknown: true, modelUsed: false }
  }

  const controller = new AbortController()
  const timeoutMs = Math.max(1, options.timeoutMs ?? DEFAULT_TIMEOUT_MS)
  const timer = setTimeout(() => controller.abort(), timeoutMs)

  try {
    const answer = await Promise.race([
      options.model.generate({
        system: buildAgentPrompt({
          cards,
          page: input.page,
          policy: input.policy,
          history: input.history,
        }),
        user: input.message,
        maxTokens: Math.min(Math.max(options.maxTokens ?? ABSOLUTE_MAX_TOKENS, 1), ABSOLUTE_MAX_TOKENS),
        signal: controller.signal,
      }),
      new Promise<never>((_resolve, reject) => {
        controller.signal.addEventListener('abort', () => reject(new Error('answer_timeout')), { once: true })
      }),
    ])

    const normalized = normalizeAnswerText(answer)
    if (!normalized) throw new Error('empty_answer')

    return {
      answer: normalized,
      sources: uniqueSources(cards),
      nextAction: cards[0]
        ? { label: `Explore ${cards[0].title}`, href: contextualActionHref(cards[0].source.ref) }
        : undefined,
      unknown: false,
      modelUsed: true,
    }
  } catch {
    return {
      answer: SAFE_MODEL_FAILURE,
      sources: [],
      unknown: true,
      modelUsed: false,
      operationalErrorCode: controller.signal.aborted ? 'model_timeout' : 'model_error',
    }
  } finally {
    clearTimeout(timer)
  }
}
