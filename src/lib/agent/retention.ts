export type RetentionCandidate =
  | {
      kind: 'session'
      id: string
      anonymous: boolean
      objectCleanupComplete: boolean
      retentionUntil: string
    }
  | {
      kind: 'object'
      id: string
      sessionId: string
      objectPath: string
      status: 'pending' | 'quarantined' | 'approved' | 'rejected' | 'deleted'
      retentionUntil: string
    }

export type RetentionTarget =
  | {
      kind: 'anonymous_session'
      id: string
      retentionUntil: string
    }
  | {
      kind: 'quarantined_object'
      id: string
      sessionId: string
      objectPath: string
      retentionUntil: string
    }

export interface RetentionAuditEvent {
  actorType: 'service'
  eventType: 'agent_retention_cleanup_completed'
  details: {
    cutoff: string
    anonymousSessionsDeleted: number
    quarantinedObjectsDeleted: number
  }
}

export interface RetentionRepository {
  listCandidates(cutoff: Date): Promise<RetentionCandidate[]>
  deleteQuarantinedObject(
    target: Extract<RetentionTarget, { kind: 'quarantined_object' }>,
  ): Promise<void>
  deleteAnonymousSession(
    target: Extract<RetentionTarget, { kind: 'anonymous_session' }>,
  ): Promise<void>
  writeAuditEvent(event: RetentionAuditEvent): Promise<void>
}

export interface RetentionFailure {
  kind: RetentionTarget['kind'] | 'audit_event'
  id: string
  errorCode: 'retention_object_delete_failed'
    | 'retention_session_delete_failed'
    | 'retention_object_cleanup_incomplete'
    | 'retention_audit_write_failed'
  retryable: true
}

export interface RetentionCleanupReport {
  dryRun: boolean
  cutoff: string
  selected: RetentionTarget[]
  deleted: RetentionTarget[]
  failures: RetentionFailure[]
  auditEventWritten: boolean
}

function expired(retentionUntil: string, cutoff: Date): boolean {
  const timestamp = Date.parse(retentionUntil)
  return Number.isFinite(timestamp) && timestamp <= cutoff.getTime()
}

export function selectExpiredRetentionTargets(
  candidates: RetentionCandidate[],
  cutoff: Date,
): RetentionTarget[] {
  const objects: RetentionTarget[] = []
  const sessions: RetentionTarget[] = []

  for (const candidate of candidates) {
    if (!expired(candidate.retentionUntil, cutoff)) continue

    if (candidate.kind === 'object' && candidate.status === 'quarantined') {
      objects.push({
        kind: 'quarantined_object',
        id: candidate.id,
        sessionId: candidate.sessionId,
        objectPath: candidate.objectPath,
        retentionUntil: candidate.retentionUntil,
      })
    }

    if (
      candidate.kind === 'session'
      && candidate.anonymous
      && candidate.objectCleanupComplete
    ) {
      sessions.push({
        kind: 'anonymous_session',
        id: candidate.id,
        retentionUntil: candidate.retentionUntil,
      })
    }
  }

  return [...objects, ...sessions]
}

export async function runRetentionCleanup(
  repository: RetentionRepository,
  options: { now: Date; dryRun: boolean },
): Promise<RetentionCleanupReport> {
  const selected = selectExpiredRetentionTargets(
    await repository.listCandidates(options.now),
    options.now,
  )
  const report: RetentionCleanupReport = {
    dryRun: options.dryRun,
    cutoff: options.now.toISOString(),
    selected,
    deleted: [],
    failures: [],
    auditEventWritten: false,
  }

  if (options.dryRun) return report

  const sessionsBlockedByObjectFailure = new Set<string>()
  for (const target of selected) {
    if (target.kind !== 'quarantined_object') continue
    try {
      await repository.deleteQuarantinedObject(target)
      report.deleted.push(target)
    } catch {
      sessionsBlockedByObjectFailure.add(target.sessionId)
      report.failures.push({
        kind: target.kind,
        id: target.id,
        errorCode: 'retention_object_delete_failed',
        retryable: true,
      })
    }
  }

  for (const target of selected) {
    if (target.kind !== 'anonymous_session') continue
    if (sessionsBlockedByObjectFailure.has(target.id)) {
      report.failures.push({
        kind: target.kind,
        id: target.id,
        errorCode: 'retention_object_cleanup_incomplete',
        retryable: true,
      })
      continue
    }
    try {
      await repository.deleteAnonymousSession(target)
      report.deleted.push(target)
    } catch {
      report.failures.push({
        kind: target.kind,
        id: target.id,
        errorCode: 'retention_session_delete_failed',
        retryable: true,
      })
    }
  }

  if (report.deleted.length === 0) return report

  const anonymousSessionsDeleted = report.deleted.filter(
    (target) => target.kind === 'anonymous_session',
  ).length
  const quarantinedObjectsDeleted = report.deleted.filter(
    (target) => target.kind === 'quarantined_object',
  ).length

  try {
    await repository.writeAuditEvent({
      actorType: 'service',
      eventType: 'agent_retention_cleanup_completed',
      details: {
        cutoff: report.cutoff,
        anonymousSessionsDeleted,
        quarantinedObjectsDeleted,
      },
    })
    report.auditEventWritten = true
  } catch {
    report.failures.push({
      kind: 'audit_event',
      id: 'cleanup_batch',
      errorCode: 'retention_audit_write_failed',
      retryable: true,
    })
  }

  return report
}
