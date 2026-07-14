export type AgentOperationalErrorCode = 'model_timeout' | 'model_error'

export interface AgentOperationalEvent {
  event: 'agent_answer_model_failed'
  errorCode: AgentOperationalErrorCode
}

export interface AgentOperationalRecord extends AgentOperationalEvent {
  policyVersion?: string
}

export interface AgentOperationalMetrics {
  modelErrors24h: number
  deliveryBacklog: number
  blockedUploads: number
  windowStartsAt: string
}

export interface OperationalMetricRepository {
  countModelErrors(since: Date): Promise<number>
  countDeliveryBacklog(): Promise<number>
  countBlockedUploads(): Promise<number>
}

export function createOperationalLog(
  event: AgentOperationalEvent,
): { event: AgentOperationalEvent['event']; error_code: AgentOperationalErrorCode } {
  return {
    event: event.event,
    error_code: event.errorCode,
  }
}

export function createOperationalAuditRow(
  event: AgentOperationalEvent,
  policyVersion?: string,
) {
  return {
    actor_type: 'service' as const,
    event_type: event.event,
    policy_version: policyVersion ?? null,
    details: { error_code: event.errorCode },
  }
}

export async function getAgentOperationalMetrics(
  repository: OperationalMetricRepository,
  now = new Date(),
): Promise<AgentOperationalMetrics> {
  const since = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  const [modelErrors24h, deliveryBacklog, blockedUploads] = await Promise.all([
    repository.countModelErrors(since),
    repository.countDeliveryBacklog(),
    repository.countBlockedUploads(),
  ])

  return {
    modelErrors24h,
    deliveryBacklog,
    blockedUploads,
    windowStartsAt: since.toISOString(),
  }
}
