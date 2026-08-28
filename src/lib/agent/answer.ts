import { buildAgentPrompt } from '@/lib/agent/prompt'
import {
  findSiteProjectsByAlias,
  type PublicSiteProject,
} from '@/content/site-projects'
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

function joinProjectNames(projects: readonly PublicSiteProject[]): string {
  const names = projects.map((project) => project.name)
  if (names.length <= 1) return names[0] ?? ''
  if (names.length === 2) return names.join(' and ')
  return `${names.slice(0, -1).join(', ')}, and ${names.at(-1)}`
}

function projectLifecycleAnswer(
  message: string,
  cards: PublicMemoryCard[],
): AgentAnswerResult | null {
  if (!/\b(active|archive|archived|current|still|working on)\b/i.test(message)) return null
  const projects = findSiteProjectsByAlias(message)
  if (projects.length === 0) return null

  const matchedCards = projects
    .map((project) => cards.find((card) => card.id === project.id))
    .filter((card): card is PublicMemoryCard => Boolean(card))
  if (matchedCards.length !== projects.length) return null

  const allArchived = projects.every((project) => project.status === 'archive')
  let answer: string
  if (projects.length > 1 && allArchived) {
    answer = `${joinProjectNames(projects)} are archived projects, not current active builds. They remain available in Sathian's public portfolio for reference.`
  } else if (projects.length === 1) {
    const [project] = projects
    const lifecycle = project.status === 'archive'
      ? 'an archived project, not a current active build'
      : project.status === 'primary'
        ? "Sathian's primary public build"
        : project.status === 'prototype'
          ? 'a private research prototype with public evidence, not a current active build or a hackathon submission'
          : 'a current active public build'
    answer = `${project.name} is ${lifecycle}. ${project.approvedClaims.join(' ')}`
  } else {
    const statuses = projects.map((project) => {
      const lifecycle = project.status === 'archive'
        ? 'archived'
        : project.status === 'primary'
          ? 'the primary build'
          : project.status === 'prototype'
            ? 'a private prototype with public evidence'
            : 'active'
      return `${project.name} is ${lifecycle}`
    })
    answer = `${statuses.join('; ')}.`
  }

  const [firstProject] = projects
  const [firstCard] = matchedCards
  return {
    answer,
    sources: uniqueSources(matchedCards),
    nextAction: projects.length === 1
      ? {
          label: firstProject.cta,
          href: contextualActionHref(firstCard.source.ref),
        }
      : { label: 'Browse more projects', href: '/#more-projects' },
    unknown: false,
    modelUsed: false,
  }
}

function directIntentCard(message: string, cards: PublicMemoryCard[]): {
  card: PublicMemoryCard
  actionLabel: string
} | null {
  const find = (predicate: (card: PublicMemoryCard) => boolean) => cards.find(predicate)
  const projectMatch = findSiteProjectsByAlias(message)[0]
  const rules: Array<{
    matches: boolean
    card: PublicMemoryCard | undefined
    actionLabel: string
  }> = [
    {
      matches: /^(?:(?:can|could)\s+i\s+(?:leave|send|write)\s+(?:sathian\s+)?(?:a\s+)?(?:note|message)(?:\s+(?:for|to)\s+sathian)?|(?:how|where)\s+(?:can|do)\s+i\s+(?:leave|send|write)\s+(?:sathian\s+)?(?:a\s+)?(?:note|message)(?:\s+(?:for|to)\s+sathian)?)\??$/i.test(message),
      card: find((card) => card.id === 'site-agent-note-workflow'),
      actionLabel: 'Write a note',
    },
    {
      matches: /\b(what can you do|how can you help|what can i ask|what can i find (?:here|on (?:this|the) site)|what (?:are )?the main sections(?: of (?:this|the) site)?|help me (?:use|navigate|explore)(?: (?:this|the) site)?|what features does (?:this|the) site agent have|site guide)\b/i.test(message),
      card: find((card) => card.id === 'site-agent-capabilities'),
      actionLabel: 'Browse featured work',
    },
    {
      matches: Boolean(projectMatch),
      card: projectMatch ? find((card) => card.id === projectMatch.id) : undefined,
      actionLabel: projectMatch?.cta ?? 'Open project',
    },
    {
      matches: /\b(writing|writings|articles|essays|fatherhood|publishes|published)\b/i.test(message)
        || /\bwhere can i read\b/i.test(message),
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

function preferredModelAction(message: string, cards: PublicMemoryCard[]): {
  label: string
  href: string
} | undefined {
  const rules: Array<{
    matches: boolean
    cardId: string
    label: string
  }> = [
    {
      matches: /\bsolana\b/i.test(message),
      cardId: 'project-solana-ecosystem-observatory',
      label: 'Open the Solana guide',
    },
    {
      matches: /\b(tooth fairy network|toothlight|tfn)\b/i.test(message),
      cardId: 'project-tooth-fairy-network',
      label: 'Visit Tooth Fairy Network',
    },
    {
      matches: /\b(writing|writings|articles|essays|fatherhood|publishes|published)\b/i.test(message)
        || /\bwhere can i read\b/i.test(message),
      cardId: 'published-writing',
      label: 'Browse Sathianâ€™s writing',
    },
    {
      matches: /\b(crypto|cryptocurrency|web3|smart contract|transfer of value)\b/i.test(message),
      cardId: 'project-tooth-fairy-network',
      label: 'Visit Tooth Fairy Network',
    },
  ]
  const match = rules.find((rule) => rule.matches)
  const card = match ? cards.find((candidate) => candidate.id === match.cardId) : undefined
  if (!match || !card) return undefined
  return { label: match.label, href: contextualActionHref(card.source.ref) }
}

function contextualComparisonAnswer(
  message: string,
  history: AgentConversationTurn[] = [],
  cards: PublicMemoryCard[],
): AgentAnswerResult | null {
  if (!/\bsolana\b/i.test(message) || !/\b(different|difference|compare|compared)\b/i.test(message)) {
    return null
  }
  const priorContext = history.map((turn) => turn.content).join(' ')
  if (!/\b(tooth fairy network|toothlight|tfn)\b/i.test(priorContext)) return null

  const tfn = cards.find((card) => card.id === 'project-tooth-fairy-network')
  const solana = cards.find((card) => card.id === 'project-solana-ecosystem-observatory')
  if (!tfn || !solana) return null

  return {
    answer: 'Tooth Fairy Network is the consumer product: a private family time capsule with an optional guardian-controlled future gift and a deployed Solana Mainnet program. Solana is the public network underneath it: the shared ledger and program runtime that make the contract rails and receipts inspectable. The Solana Ecosystem Observatory is the plain-English guide to that network. In short, Tooth Fairy Network is the product being built for families; Solana is the infrastructure underneath it. Private child content stays off-chain by default.',
    sources: [tfn.source.ref, solana.source.ref],
    nextAction: {
      label: 'Open the Solana guide',
      href: contextualActionHref(solana.source.ref),
    },
    unknown: false,
    modelUsed: false,
  }
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

  const lifecycleAnswer = projectLifecycleAnswer(input.message, input.cards)
  if (lifecycleAnswer) return lifecycleAnswer

  const contextualQuestion = isContextDependentQuestion(input.message)
    && Boolean(input.history?.length)
  if (contextualQuestion) {
    const comparison = contextualComparisonAnswer(input.message, input.history, input.cards)
    if (comparison) return comparison
  }
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
    const modelUnknown = /i (?:don[^\s]{0,3}t|do not) have approved public information/i.test(normalized)

    return {
      answer: normalized,
      // An honest unknown must not render merely keyword-adjacent links. Those
      // looked like citations for an answer the agent explicitly did not have.
      sources: modelUnknown ? [] : uniqueSources(cards),
      nextAction: modelUnknown ? undefined : preferredModelAction(input.message, cards),
      unknown: modelUnknown,
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
