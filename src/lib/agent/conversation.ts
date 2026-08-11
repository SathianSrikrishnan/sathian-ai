export const AGENT_CONVERSATION_MAX_TURNS = 6
export const AGENT_CONVERSATION_TTL_MS = 45 * 60 * 1_000

const MAX_TURN_CHARS = 2_000

export interface AgentConversationTurn {
  role: 'user' | 'assistant'
  content: string
}

export interface AgentConversationState {
  updatedAt: number
  turns: AgentConversationTurn[]
}

function normalizeTurns(value: unknown): AgentConversationTurn[] {
  if (!Array.isArray(value)) return []

  return value
    .filter((turn): turn is AgentConversationTurn => Boolean(
      turn
      && typeof turn === 'object'
      && 'role' in turn
      && 'content' in turn
      && (turn.role === 'user' || turn.role === 'assistant')
      && typeof turn.content === 'string'
      && turn.content.trim(),
    ))
    .map((turn) => ({
      role: turn.role,
      content: turn.content.trim().slice(0, MAX_TURN_CHARS),
    }))
    .slice(-AGENT_CONVERSATION_MAX_TURNS)
}

export function parseAgentConversationState(
  value: unknown,
  now = Date.now(),
): AgentConversationState | null {
  if (!value || typeof value !== 'object' || !('updatedAt' in value) || !('turns' in value)) {
    return null
  }

  const updatedAt = value.updatedAt
  if (
    typeof updatedAt !== 'number'
    || !Number.isFinite(updatedAt)
    || updatedAt > now + 60_000
    || now - updatedAt > AGENT_CONVERSATION_TTL_MS
  ) return null

  const turns = normalizeTurns(value.turns)
  return turns.length > 0 ? { updatedAt, turns } : null
}

export function appendAgentConversation(
  current: AgentConversationState | null,
  additions: AgentConversationTurn[],
  now = Date.now(),
): AgentConversationState {
  return {
    updatedAt: now,
    turns: normalizeTurns([...(current?.turns ?? []), ...additions]),
  }
}

export function isContextDependentQuestion(message: string): boolean {
  return /\b(that|this|it|they|them|those|different|difference|compare|compared|what about|how does|how is)\b/i
    .test(message)
}
