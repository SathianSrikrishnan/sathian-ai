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
  | {
      event: 'agent_contact_supplied'
    }
  | {
      event: 'site_session_started' | 'agent_widget_viewed'
      sessionId: string
      page: string
      source: 'site' | 'inline' | 'floating'
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
  switch (event.event) {
    case 'agent_answer_model_failed':
      return { event: event.event, error_code: event.errorCode }
    case 'agent_turn_completed':
      return { event: event.event, route: event.route }
    case 'site_session_started':
    case 'agent_widget_viewed':
      return {
        event: event.event,
        session_id: event.sessionId,
        page: event.page,
        source: event.source,
      }
    case 'agent_contact_supplied':
      return { event: event.event }
  }
}

export function createOperationalAuditRow(
  event: AgentOperationalEvent,
  policyVersion?: string,
) {
  const log = createOperationalLog(event)
  const { event: _event, ...details } = log
  return {
    actor_type: event.event === 'site_session_started' || event.event === 'agent_widget_viewed'
      ? 'visitor' as const
      : 'service' as const,
    event_type: event.event,
    policy_version: policyVersion ?? null,
    details,
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
