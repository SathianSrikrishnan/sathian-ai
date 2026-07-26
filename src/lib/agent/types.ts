export type PublicMemoryVisibility = 'public' | 'private'
export type PublicMemoryStatus = 'draft' | 'approved' | 'retired'

export interface PublicMemoryRow {
  id: string
  slug: string
  title: string
  body: string
  summary: string | null
  tags: string[]
  source_ref: string
  source_kind: string
  visibility: PublicMemoryVisibility
  status: PublicMemoryStatus
  valid_from: string | null
  valid_until: string | null
  approved_at: string | null
}

export interface PublicMemoryCard {
  id: string
  slug: string
  title: string
  body: string
  summary: string | null
  tags: string[]
  source: {
    ref: string
    kind: string
  }
  validFrom: string | null
  validUntil: string | null
}

export interface MemoryContext {
  content: string
  sources: string[]
}

export interface PublicMemoryQueryResult {
  data: PublicMemoryRow[] | null
  error: { message: string } | null
}

export interface PublicMemoryQuery extends PromiseLike<PublicMemoryQueryResult> {
  select(columns: string): PublicMemoryQuery
  eq(column: string, value: unknown): PublicMemoryQuery
  not(column: string, operator: string, value: unknown): PublicMemoryQuery
  neq(column: string, value: unknown): PublicMemoryQuery
  or(filters: string): PublicMemoryQuery
  order(column: string, options: { ascending: boolean }): PublicMemoryQuery
  limit(count: number): PublicMemoryQuery
}

export interface PublicMemoryClient {
  from(table: 'public_memory_cards'): PublicMemoryQuery
}

export type AgentRoute = 'answer' | 'intake' | 'answer_and_intake' | 'block'
export type ClassifierRoute = Exclude<AgentRoute, 'block'>

export interface AgentPolicyInput {
  message: string
  untrustedContent?: string[]
}

export interface AgentPolicyDecision {
  route: AgentRoute
  allowed: boolean
  policyVersion: string
  reasonCodes: string[]
  normalizedMessage: string
}

export interface ClassifierDecision {
  route: ClassifierRoute
  reasonCodes: string[]
}

export interface AgentRoutingDecision extends AgentPolicyDecision {
  classifierUsed: boolean
}
