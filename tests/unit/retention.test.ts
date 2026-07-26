import { existsSync, readFileSync } from 'node:fs'

import { describe, expect, it } from 'vitest'

import {
  runRetentionCleanup,
  selectExpiredRetentionTargets,
  type RetentionAuditEvent,
  type RetentionCandidate,
  type RetentionRepository,
  type RetentionTarget,
} from '@/lib/agent/retention'

const cutoff = new Date('2026-07-14T16:00:00.000Z')

const expiredObject: RetentionCandidate = {
  kind: 'object',
  id: 'attachment-expired',
  sessionId: 'session-expired',
  objectPath: 'intakes/session-expired/attachment-expired',
  status: 'quarantined',
  retentionUntil: '2026-07-13T16:00:00.000Z',
}

const expiredAnonymousSession: RetentionCandidate = {
  kind: 'session',
  id: 'session-expired',
  anonymous: true,
  objectCleanupComplete: true,
  retentionUntil: '2026-07-12T16:00:00.000Z',
}

class MemoryRetentionRepository implements RetentionRepository {
  readonly deleted: RetentionTarget[] = []
  readonly audits: RetentionAuditEvent[] = []
  failObjectOnce = false

  constructor(readonly candidates: RetentionCandidate[]) {}

  async listCandidates(): Promise<RetentionCandidate[]> {
    return this.candidates
  }

  async deleteQuarantinedObject(target: Extract<RetentionTarget, { kind: 'quarantined_object' }>) {
    if (this.failObjectOnce) {
      this.failObjectOnce = false
      throw new Error('private storage detail')
    }
    this.deleted.push(target)
  }

  async deleteAnonymousSession(target: Extract<RetentionTarget, { kind: 'anonymous_session' }>) {
    this.deleted.push(target)
  }

  async writeAuditEvent(event: RetentionAuditEvent) {
    this.audits.push(event)
  }
}

describe('public agent retention cleanup', () => {
  it('selects only expired anonymous sessions and quarantined objects', () => {
    const selected = selectExpiredRetentionTargets([
      expiredAnonymousSession,
      expiredObject,
      { ...expiredAnonymousSession, id: 'known-visitor', anonymous: false },
      { ...expiredAnonymousSession, id: 'still-current', retentionUntil: '2026-07-15T16:00:00.000Z' },
      { ...expiredAnonymousSession, id: 'retained-object', objectCleanupComplete: false },
      { ...expiredObject, id: 'approved-object', status: 'approved' },
    ], cutoff)

    expect(selected).toEqual([
      {
        kind: 'quarantined_object',
        id: 'attachment-expired',
        sessionId: 'session-expired',
        objectPath: 'intakes/session-expired/attachment-expired',
        retentionUntil: '2026-07-13T16:00:00.000Z',
      },
      {
        kind: 'anonymous_session',
        id: 'session-expired',
        retentionUntil: '2026-07-12T16:00:00.000Z',
      },
    ])
  })

  it('reports a dry run without deleting records or writing an audit event', async () => {
    const repository = new MemoryRetentionRepository([expiredAnonymousSession, expiredObject])

    const report = await runRetentionCleanup(repository, { now: cutoff, dryRun: true })

    expect(report.dryRun).toBe(true)
    expect(report.selected).toHaveLength(2)
    expect(report.deleted).toEqual([])
    expect(report.failures).toEqual([])
    expect(report.auditEventWritten).toBe(false)
    expect(repository.deleted).toEqual([])
    expect(repository.audits).toEqual([])
  })

  it('writes a content-minimized audit event after successful cleanup', async () => {
    const repository = new MemoryRetentionRepository([expiredAnonymousSession, expiredObject])

    const report = await runRetentionCleanup(repository, { now: cutoff, dryRun: false })

    expect(report.deleted.map((target) => target.kind)).toEqual([
      'quarantined_object',
      'anonymous_session',
    ])
    expect(repository.audits).toEqual([{
      actorType: 'service',
      eventType: 'agent_retention_cleanup_completed',
      details: {
        cutoff: cutoff.toISOString(),
        anonymousSessionsDeleted: 1,
        quarantinedObjectsDeleted: 1,
      },
    }])
    expect(JSON.stringify(repository.audits)).not.toMatch(/message|filename|objectPath|private storage detail/i)
    expect(report.auditEventWritten).toBe(true)
  })

  it('retries failures without extending retention or deleting their session early', async () => {
    const repository = new MemoryRetentionRepository([expiredAnonymousSession, expiredObject])
    repository.failObjectOnce = true

    const first = await runRetentionCleanup(repository, { now: cutoff, dryRun: false })
    const second = await runRetentionCleanup(repository, { now: cutoff, dryRun: false })

    expect(first.deleted).toEqual([])
    expect(first.failures).toEqual([
      { kind: 'quarantined_object', id: 'attachment-expired', errorCode: 'retention_object_delete_failed', retryable: true },
      { kind: 'anonymous_session', id: 'session-expired', errorCode: 'retention_object_cleanup_incomplete', retryable: true },
    ])
    expect(second.selected).toContainEqual(expect.objectContaining({
      id: 'attachment-expired',
      retentionUntil: expiredObject.retentionUntil,
    }))
    expect(second.deleted.map((target) => target.kind)).toEqual([
      'quarantined_object',
      'anonymous_session',
    ])
  })

  it('documents the dry-run approval gate and content-minimized incident checks', () => {
    const runbookUrl = new URL('../../docs/security/public-agent-runbook.md', import.meta.url)

    expect(existsSync(runbookUrl)).toBe(true)
    if (!existsSync(runbookUrl)) return

    const runbook = readFileSync(runbookUrl, 'utf8')
    expect(runbook).toMatch(/dry run/i)
    expect(runbook).toMatch(/AAL2/)
    expect(runbook).toMatch(/schedule[\s\S]*approval/i)
    expect(runbook).toMatch(/model errors[\s\S]*delivery backlog[\s\S]*blocked uploads/i)
    expect(runbook).toMatch(/message content[\s\S]*never/i)
  })
})
