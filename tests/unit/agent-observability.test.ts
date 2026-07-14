import { describe, expect, it } from 'vitest'

import {
  createOperationalAuditRow,
  createOperationalLog,
  getAgentOperationalMetrics,
  type AgentOperationalEvent,
  type OperationalMetricRepository,
} from '@/lib/agent/observability'

class MemoryMetricRepository implements OperationalMetricRepository {
  modelErrorWindow: Date | null = null

  async countModelErrors(since: Date) {
    this.modelErrorWindow = since
    return 2
  }

  async countDeliveryBacklog() {
    return 4
  }

  async countBlockedUploads() {
    return 3
  }
}

describe('public agent observability', () => {
  it('serializes only allowlisted operational fields', () => {
    const event = {
      event: 'agent_answer_model_failed',
      errorCode: 'model_timeout',
      message: 'a private visitor question',
      objectPath: 'intakes/private/object',
    } as AgentOperationalEvent & Record<string, unknown>

    const log = createOperationalLog(event)

    expect(log).toEqual({
      event: 'agent_answer_model_failed',
      error_code: 'model_timeout',
    })
    expect(JSON.stringify(log)).not.toMatch(/private visitor question|objectPath|intakes\/private/i)
  })

  it('creates a content-minimized audit row for model failures', () => {
    const row = createOperationalAuditRow({
      event: 'agent_answer_model_failed',
      errorCode: 'model_error',
    }, 'public-agent-policy/2026-07-14')

    expect(row).toEqual({
      actor_type: 'service',
      event_type: 'agent_answer_model_failed',
      policy_version: 'public-agent-policy/2026-07-14',
      details: { error_code: 'model_error' },
    })
    expect(row).not.toHaveProperty('message')
    expect(row).not.toHaveProperty('content')
  })

  it('loads the three operator metrics over a bounded model-error window', async () => {
    const repository = new MemoryMetricRepository()
    const now = new Date('2026-07-14T16:00:00.000Z')

    const metrics = await getAgentOperationalMetrics(repository, now)

    expect(metrics).toEqual({
      modelErrors24h: 2,
      deliveryBacklog: 4,
      blockedUploads: 3,
      windowStartsAt: '2026-07-13T16:00:00.000Z',
    })
    expect(repository.modelErrorWindow?.toISOString()).toBe('2026-07-13T16:00:00.000Z')
  })
})
