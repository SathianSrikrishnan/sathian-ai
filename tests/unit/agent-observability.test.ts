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
  completedTurnWindow: Date | null = null
  intakeWindow: Date | null = null

  async countCompletedTurns(since: Date) {
    this.completedTurnWindow = since
    return 9
  }

  async countIntakes(since: Date) {
    this.intakeWindow = since
    return 2
  }

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

  it('creates content-free activity records for completed agent turns', () => {
    const event = {
      event: 'agent_turn_completed',
      route: 'answer',
      message: 'private visitor question',
    } as AgentOperationalEvent & Record<string, unknown>

    expect(createOperationalLog(event)).toEqual({
      event: 'agent_turn_completed',
      route: 'answer',
    })
    expect(createOperationalAuditRow(event, 'public-agent-policy/2026-07-14')).toEqual({
      actor_type: 'service',
      event_type: 'agent_turn_completed',
      policy_version: 'public-agent-policy/2026-07-14',
      details: { route: 'answer' },
    })
    expect(JSON.stringify(createOperationalAuditRow(event))).not.toContain('private visitor question')
  })

  it('creates content-free funnel rows without accepting visitor content', () => {
    const event = {
      event: 'site_session_started',
      sessionId: '58d6cd80-547b-4ac2-962c-1ce2518e15fc',
      page: '/writing',
      source: 'site',
      message: 'do not persist this',
    } as AgentOperationalEvent & Record<string, unknown>

    expect(createOperationalLog(event)).toEqual({
      event: 'site_session_started',
      session_id: '58d6cd80-547b-4ac2-962c-1ce2518e15fc',
      page: '/writing',
      source: 'site',
    })
    expect(createOperationalAuditRow(event)).toEqual({
      actor_type: 'visitor',
      event_type: 'site_session_started',
      policy_version: null,
      details: {
        session_id: '58d6cd80-547b-4ac2-962c-1ce2518e15fc',
        page: '/writing',
        source: 'site',
      },
    })
    expect(JSON.stringify(createOperationalAuditRow(event))).not.toContain('do not persist this')
  })

  it('loads content-free activity and health metrics over a bounded 24-hour window', async () => {
    const repository = new MemoryMetricRepository()
    const now = new Date('2026-07-14T16:00:00.000Z')

    const metrics = await getAgentOperationalMetrics(repository, now)

    expect(metrics).toEqual({
      completedTurns24h: 9,
      intakes24h: 2,
      modelErrors24h: 2,
      deliveryBacklog: 4,
      blockedUploads: 3,
      windowStartsAt: '2026-07-13T16:00:00.000Z',
    })
    expect(repository.completedTurnWindow?.toISOString()).toBe('2026-07-13T16:00:00.000Z')
    expect(repository.intakeWindow?.toISOString()).toBe('2026-07-13T16:00:00.000Z')
    expect(repository.modelErrorWindow?.toISOString()).toBe('2026-07-13T16:00:00.000Z')
  })
})
