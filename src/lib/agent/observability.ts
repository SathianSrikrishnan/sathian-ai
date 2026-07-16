export type AgentOperationalErrorCode = 'model_timeout' | 'model_error'
export type AgentTurnRoute = 'answer' | 'intake' | 'answer_and_intake'

export type AgentOperationalEvent =
  | {
      event: 'agent_answer_model_failed'
      errorCode: AgentOperationalErrorCode
    }
  | {
      event: 'agent_turn_completed'
      route: AgentTurnRoute
    }

export type AgentOperationalRecord = AgentOperationalEvent & { policyVersion?: string }

export interface AgentOperationalMetrics {
  completedTurns24h: number
  intakes24h: number
  modelErrors24h: number
  deliveryBacklog: number
  blockedUploads: number
  windowStartsAt: string
}

export interface OperationalMetricRepository {
  countCompletedTurns(since: Date): Promise<number>
  countIntakes(since: Date): Promise<number>
  countModelErrors(since: Date): Promise<number>
  countDeliveryBacklog(): Promise<number>
  countBlockedUploads(): Promise<number>
}

export function createOperationalLog(
  event: AgentOperationalEvent,
) {
  return event.event === 'agent_answer_model_failed'
    ? { event: event.event, error_code: event.errorCode }
    : { event: event.event, route: event.route }
}

export function createOperationalAuditRow(
  event: AgentOperationalEvent,
  policyVersion?: string,
) {
  return {
    actor_type: 'service' as const,
    event_type: event.event,
    policy_version: policyVersion ?? null,
    details: event.event === 'agent_answer_model_failed'
      ? { error_code: event.errorCode }
      : { route: event.route },
  }
}

export async function getAgentOperationalMetrics(
  repository: OperationalMetricRepository,
  now = new Date(),
): Promise<AgentOperationalMetrics> {
  const since = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  const [completedTurns24h, intakes24h, modelErrors24h, deliveryBacklog, blockedUploads] = await Promise.all([
    repository.countCompletedTurns(since),
    repository.countIntakes(since),
    repository.countModelErrors(since),
    repository.countDeliveryBacklog(),
    repository.countBlockedUploads(),
  ])

  return {
    completedTurns24h,
    intakes24h,
    modelErrors24h,
    deliveryBacklog,
    blockedUploads,
    windowStartsAt: since.toISOString(),
  }
}
