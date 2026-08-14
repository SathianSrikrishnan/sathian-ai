import { supabaseAdmin } from '@/lib/supabase'
import {
  getAgentOperationalMetrics,
  type AgentOperationalMetrics,
  type OperationalMetricRepository,
} from '@/lib/agent/observability'
import {
  runRetentionCleanup,
  type RetentionCandidate,
  type RetentionCleanupReport,
} from '@/lib/agent/retention'
import type {
  AgentGapStatus,
  BuildNoteInput,
  HomepageSectionFields,
} from '@/lib/studio/records'
import { formatStudioReceipt } from '@/lib/studio/records'

export interface StudioOverview {
  writing: number
  buildNotes: number
  homepageSections: number
  publicMemory: number
  inbox: number
  operations: AgentOperationalMetrics
}

export interface StudioMemoryCard {
  id: string
  slug: string
  title: string
  summary: string | null
  tags: string[]
  sourceRef: string
  sourceKind: string
  visibility: 'public' | 'private'
  status: 'draft' | 'approved' | 'retired'
  validFrom: string | null
  validUntil: string | null
  approvedAt: string | null
  updatedAt: string
}

export interface StudioInboxItem {
  id: string
  receipt: string
  kind: string
  displayName: string | null
  replyEmail: string | null
  message: string
  status: string
  createdAt: string
  retentionUntil: string
  delivery: {
    status: string
    attempts: number
    deliveredAt: string | null
    nextAttemptAt: string | null
  } | null
  attachments: Array<{
    id: string
    filename: string
    contentType: string
    byteSize: number
    status: string
    retentionUntil: string
  }>
}

export interface StudioHomepageSection {
  id: string
  key: string
  type: 'hero' | 'projects' | 'building' | 'writing' | 'practice' | 'about' | 'agent'
  label: string | null
  heading: string | null
  description: string | null
  ctaLabel: string | null
  ctaHref: string | null
  enabled: boolean
  position: number
  updatedAt: string
}

export interface StudioBuildNote extends BuildNoteInput {
  id: string
  publishedAt: string | null
  updatedAt: string
}

export interface StudioSubscriber {
  id: string
  email: string
  status: 'subscribed' | 'unsubscribed' | 'bounced'
  firstSource: string
  lastSource: string
  consentNoticeVersion: string
  consentedAt: string
  lastSeenAt: string
  confirmationSentAt: string | null
  confirmationAttemptedAt: string | null
  confirmationErrorCode: string | null
  createdAt: string
  unsubscribedAt: string | null
}

export interface StudioAgentKnowledgeGap {
  id: string
  caseId: string
  datasetVersion: string
  category: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  expectedFacts: string[]
  expectedSources: string[]
  failedChecks: string[]
  sourceReceipt: string
  status: AgentGapStatus
  operatorNote: string | null
  firstSeenAt: string
  lastSeenAt: string
  occurrenceCount: number
  reviewedAt: string | null
}

function admin() {
  if (!supabaseAdmin) throw new Error('Studio data client is unavailable')
  return supabaseAdmin
}

async function count(table: string) {
  const { count: value, error } = await admin().from(table).select('*', { count: 'exact', head: true })
  if (error) throw error
  return value ?? 0
}

const operationalMetricRepository: OperationalMetricRepository = {
  async countCompletedTurns(since) {
    const { count: value, error } = await admin()
      .from('audit_events')
      .select('*', { count: 'exact', head: true })
      .eq('event_type', 'agent_turn_completed')
      .gte('created_at', since.toISOString())
    if (error) throw error
    return value ?? 0
  },
  async countIntakes(since) {
    const { count: value, error } = await admin()
      .from('agent_intakes')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', since.toISOString())
    if (error) throw error
    return value ?? 0
  },
  async countModelErrors(since) {
    const { count: value, error } = await admin()
      .from('audit_events')
      .select('*', { count: 'exact', head: true })
      .eq('event_type', 'agent_answer_model_failed')
      .gte('created_at', since.toISOString())
    if (error) throw error
    return value ?? 0
  },
  async countDeliveryBacklog() {
    const { count: value, error } = await admin()
      .from('delivery_outbox')
      .select('*', { count: 'exact', head: true })
      .in('status', ['pending', 'processing', 'failed'])
    if (error) throw error
    return value ?? 0
  },
  async countBlockedUploads() {
    const { count: value, error } = await admin()
      .from('agent_attachments')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'rejected')
    if (error) throw error
    return value ?? 0
  },
}

export async function getStudioOverview(): Promise<StudioOverview> {
  const [writing, buildNotes, homepageSections, publicMemory, inbox, operations] = await Promise.all([
    count('articles'),
    count('build_notes'),
    count('homepage_sections'),
    count('public_memory_cards'),
    count('agent_intakes'),
    getAgentOperationalMetrics(operationalMetricRepository),
  ])
  return { writing, buildNotes, homepageSections, publicMemory, inbox, operations }
}

export async function getStudioRetentionDryRun(
  now = new Date(),
): Promise<RetentionCleanupReport> {
  const cutoff = now.toISOString()
  const [sessionsResult, attachmentsResult] = await Promise.all([
    admin()
      .from('agent_sessions')
      .select('id, retention_until, agent_intakes(agent_attachments(status))')
      .is('visitor_hash', null)
      .lte('retention_until', cutoff)
      .limit(200),
    admin()
      .from('agent_attachments')
      .select('id, object_path, status, retention_until, agent_intakes!inner(session_id)')
      .eq('status', 'quarantined')
      .lte('retention_until', cutoff)
      .limit(200),
  ])
  if (sessionsResult.error) throw sessionsResult.error
  if (attachmentsResult.error) throw attachmentsResult.error

  const candidates: RetentionCandidate[] = [
    ...(sessionsResult.data ?? []).map((row: any) => ({
      kind: 'session' as const,
      id: row.id,
      anonymous: true,
      objectCleanupComplete: (Array.isArray(row.agent_intakes)
        ? row.agent_intakes
        : row.agent_intakes ? [row.agent_intakes] : [])
        .every((intake: any) => (Array.isArray(intake.agent_attachments)
          ? intake.agent_attachments
          : intake.agent_attachments ? [intake.agent_attachments] : [])
          .every((attachment: any) => attachment.status === 'deleted')),
      retentionUntil: row.retention_until,
    })),
    ...(attachmentsResult.data ?? []).flatMap((row: any) => {
      const intake = Array.isArray(row.agent_intakes)
        ? row.agent_intakes[0]
        : row.agent_intakes
      if (!intake?.session_id) return []
      return [{
        kind: 'object' as const,
        id: row.id,
        sessionId: intake.session_id,
        objectPath: row.object_path,
        status: 'quarantined' as const,
        retentionUntil: row.retention_until,
      }]
    }),
  ]

  return runRetentionCleanup({
    async listCandidates() {
      return candidates
    },
    async deleteQuarantinedObject() {
      throw new Error('retention_execution_disabled')
    },
    async deleteAnonymousSession() {
      throw new Error('retention_execution_disabled')
    },
    async writeAuditEvent() {
      throw new Error('retention_execution_disabled')
    },
  }, { now, dryRun: true })
}

export async function getStudioMemoryCards(): Promise<StudioMemoryCard[]> {
  const { data, error } = await admin()
    .from('public_memory_cards')
    .select('id, slug, title, summary, tags, source_ref, source_kind, visibility, status, valid_from, valid_until, approved_at, updated_at')
    .order('updated_at', { ascending: false })
  if (error) throw error

  return (data ?? []).map((row: any) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    tags: row.tags ?? [],
    sourceRef: row.source_ref,
    sourceKind: row.source_kind,
    visibility: row.visibility,
    status: row.status,
    validFrom: row.valid_from,
    validUntil: row.valid_until,
    approvedAt: row.approved_at,
    updatedAt: row.updated_at,
  }))
}

export async function updateStudioMemoryReview(
  review: {
    id: string
    status?: 'draft' | 'approved' | 'retired'
    visibility?: 'public' | 'private'
    validUntil?: string | null
  },
  actorId: string,
) {
  const update: Record<string, unknown> = {
    updated_by: actorId,
    updated_at: new Date().toISOString(),
  }
  if (review.status !== undefined) {
    update.status = review.status
    update.approved_by = review.status === 'approved' ? actorId : null
    update.approved_at = review.status === 'approved' ? new Date().toISOString() : null
  }
  if (review.visibility !== undefined) update.visibility = review.visibility
  if (review.validUntil !== undefined) update.valid_until = review.validUntil

  const { data, error } = await admin()
    .from('public_memory_cards')
    .update(update)
    .eq('id', review.id)
    .select('id')
    .single()
  if (error) throw error

  await writeStudioAudit(actorId, 'public_memory_reviewed', {
    memory_card_id: data.id,
    status: review.status,
    visibility: review.visibility,
    has_expiry: review.validUntil !== undefined && review.validUntil !== null,
  })
}

export async function getStudioInbox(): Promise<StudioInboxItem[]> {
  const { data, error } = await admin()
    .from('agent_intakes')
    .select(`
      id,
      receipt_token,
      kind,
      display_name,
      reply_email,
      message,
      status,
      created_at,
      retention_until,
      delivery_outbox(status, attempts, delivered_at, next_attempt_at),
      agent_attachments(id, sanitized_filename, content_type, byte_size, status, retention_until)
    `)
    .order('created_at', { ascending: false })
    .limit(100)
  if (error) throw error

  return (data ?? []).map((row: any) => {
    const delivery = Array.isArray(row.delivery_outbox)
      ? row.delivery_outbox[0]
      : row.delivery_outbox
    return {
      id: row.id,
      receipt: formatStudioReceipt(row.receipt_token),
      kind: row.kind,
      displayName: row.display_name,
      replyEmail: row.reply_email,
      message: row.message,
      status: row.status,
      createdAt: row.created_at,
      retentionUntil: row.retention_until,
      delivery: delivery
        ? {
            status: delivery.status,
            attempts: delivery.attempts,
            deliveredAt: delivery.delivered_at,
            nextAttemptAt: delivery.next_attempt_at,
          }
        : null,
      attachments: (row.agent_attachments ?? []).map((attachment: any) => ({
        id: attachment.id,
        filename: attachment.sanitized_filename,
        contentType: attachment.content_type,
        byteSize: Number(attachment.byte_size),
        status: attachment.status,
        retentionUntil: attachment.retention_until,
      })),
    }
  })
}

export async function getStudioSubscribers(): Promise<StudioSubscriber[]> {
  const { data, error } = await admin()
    .from('newsletter_subscribers')
    .select('id, email, status, first_source, last_source, consent_notice_version, consented_at, last_seen_at, confirmation_sent_at, confirmation_attempted_at, confirmation_error_code, created_at, unsubscribed_at')
    .order('created_at', { ascending: false })
    .limit(500)
  if (error) throw error

  return (data ?? []).map((row: any) => ({
    id: row.id,
    email: row.email,
    status: row.status,
    firstSource: row.first_source,
    lastSource: row.last_source,
    consentNoticeVersion: row.consent_notice_version,
    consentedAt: row.consented_at,
    lastSeenAt: row.last_seen_at,
    confirmationSentAt: row.confirmation_sent_at,
    confirmationAttemptedAt: row.confirmation_attempted_at,
    confirmationErrorCode: row.confirmation_error_code,
    createdAt: row.created_at,
    unsubscribedAt: row.unsubscribed_at,
  }))
}

export async function updateStudioSubscriberStatus(
  id: string,
  status: StudioSubscriber['status'],
  actorId: string,
) {
  const now = new Date().toISOString()
  const update = {
    status,
    unsubscribed_at: status === 'unsubscribed' ? now : null,
    updated_at: now,
  }
  const { data, error } = await admin()
    .from('newsletter_subscribers')
    .update(update)
    .eq('id', id)
    .select('id')
    .single()
  if (error) throw error

  await writeStudioAudit(actorId, 'newsletter_subscriber_status_changed', {
    subscriber_id: data.id,
    status,
  })
}

export async function getStudioAgentKnowledgeGaps(): Promise<StudioAgentKnowledgeGap[]> {
  const { data, error } = await admin()
    .from('agent_knowledge_gaps')
    .select('id, eval_case_id, dataset_version, category, severity, expected_facts, expected_sources, failed_checks, source_receipt, status, operator_note, first_seen_at, last_seen_at, occurrence_count, reviewed_at')
    .order('last_seen_at', { ascending: false })
    .limit(250)
  if (error) throw error

  return (data ?? []).map((row: any) => ({
    id: row.id,
    caseId: row.eval_case_id,
    datasetVersion: row.dataset_version,
    category: row.category,
    severity: row.severity,
    expectedFacts: row.expected_facts ?? [],
    expectedSources: row.expected_sources ?? [],
    failedChecks: row.failed_checks ?? [],
    sourceReceipt: row.source_receipt,
    status: row.status,
    operatorNote: row.operator_note,
    firstSeenAt: row.first_seen_at,
    lastSeenAt: row.last_seen_at,
    occurrenceCount: Number(row.occurrence_count),
    reviewedAt: row.reviewed_at,
  }))
}

export async function updateStudioAgentKnowledgeGap(
  review: { id: string; status: AgentGapStatus; operatorNote: string | null },
  actorId: string,
) {
  const now = new Date().toISOString()
  const { data, error } = await admin()
    .from('agent_knowledge_gaps')
    .update({
      status: review.status,
      operator_note: review.operatorNote,
      reviewed_by: actorId,
      reviewed_at: now,
      updated_at: now,
    })
    .eq('id', review.id)
    .select('id')
    .single()
  if (error) throw error

  await writeStudioAudit(actorId, 'agent_knowledge_gap_reviewed', {
    gap_id: data.id,
    status: review.status,
    has_operator_note: Boolean(review.operatorNote),
  })
}

export async function getStudioAttachmentAccess(
  attachmentId: string,
): Promise<{ objectPath: string; filename: string } | null> {
  const { data, error } = await admin()
    .from('agent_attachments')
    .select('object_path, sanitized_filename, status')
    .eq('id', attachmentId)
    .in('status', ['quarantined', 'approved'])
    .maybeSingle()
  if (error) throw error
  return data
    ? { objectPath: data.object_path, filename: data.sanitized_filename }
    : null
}

export async function recordStudioAttachmentAccess(
  attachmentId: string,
  actorId: string,
) {
  await writeStudioAudit(actorId, 'agent_attachment_signed_url_created', {
    attachment_id: attachmentId,
    expires_in_seconds: 60,
  })
}

export async function getStudioHomepageSections(): Promise<StudioHomepageSection[]> {
  const { data, error } = await admin()
    .from('homepage_sections')
    .select('*')
    .order('position', { ascending: true })
  if (error) throw error

  return (data ?? []).map((row: any) => ({
    id: row.id,
    key: row.section_key,
    type: row.section_type,
    label: row.label,
    heading: row.heading,
    description: row.description,
    ctaLabel: row.cta_label,
    ctaHref: row.cta_href,
    enabled: row.enabled,
    position: row.position,
    updatedAt: row.updated_at,
  }))
}

export async function reorderStudioHomepage(
  records: Array<{ id: string; position: number }>,
  actorId: string,
) {
  const client = admin()
  for (const record of records) {
    const { error } = await client
      .from('homepage_sections')
      .update({ position: record.position, updated_by: actorId, updated_at: new Date().toISOString() })
      .eq('id', record.id)
    if (error) throw error
  }
  await writeStudioAudit(actorId, 'homepage_sections_reordered', {
    section_ids: records.map((record) => record.id),
  })
}

export async function updateStudioHomepageSection(
  id: string,
  fields: HomepageSectionFields,
  actorId: string,
) {
  const update: Record<string, unknown> = {
    updated_by: actorId,
    updated_at: new Date().toISOString(),
  }
  if (fields.label !== undefined) update.label = fields.label
  if (fields.heading !== undefined) update.heading = fields.heading
  if (fields.description !== undefined) update.description = fields.description
  if (fields.ctaLabel !== undefined) update.cta_label = fields.ctaLabel
  if (fields.ctaHref !== undefined) update.cta_href = fields.ctaHref
  if (fields.enabled !== undefined) update.enabled = fields.enabled

  const { error } = await admin().from('homepage_sections').update(update).eq('id', id)
  if (error) throw error
  await writeStudioAudit(actorId, 'homepage_section_updated', {
    section_id: id,
    changed_fields: Object.keys(fields),
  })
}

export async function getStudioBuildNotes(): Promise<StudioBuildNote[]> {
  const { data, error } = await admin()
    .from('build_notes')
    .select('*')
    .order('note_date', { ascending: false })
  if (error) throw error

  return (data ?? []).map((row: any) => ({
    id: row.id,
    title: row.title,
    slug: row.slug,
    project: row.project,
    date: row.note_date,
    whatChanged: row.what_changed,
    whatLearned: row.what_learned,
    nextStep: row.next_step,
    status: row.status,
    publishedAt: row.published_at,
    updatedAt: row.updated_at,
  }))
}

function buildNoteRow(note: BuildNoteInput, actorId: string) {
  return {
    title: note.title,
    slug: note.slug,
    project: note.project,
    note_date: note.date,
    what_changed: note.whatChanged,
    what_learned: note.whatLearned,
    next_step: note.nextStep,
    status: note.status,
    published_at: note.status === 'published' ? new Date().toISOString() : null,
    updated_by: actorId,
    updated_at: new Date().toISOString(),
  }
}

export async function createStudioBuildNote(note: BuildNoteInput, actorId: string) {
  const { data, error } = await admin()
    .from('build_notes')
    .insert({ ...buildNoteRow(note, actorId), created_by: actorId })
    .select('id')
    .single()
  if (error) throw error
  await writeStudioAudit(actorId, 'build_note_created', { build_note_id: data.id, status: note.status })
  return data.id as string
}

export async function updateStudioBuildNote(id: string, note: BuildNoteInput, actorId: string) {
  const { error } = await admin().from('build_notes').update(buildNoteRow(note, actorId)).eq('id', id)
  if (error) throw error
  await writeStudioAudit(actorId, 'build_note_updated', { build_note_id: id, status: note.status })
}

async function writeStudioAudit(actorId: string, eventType: string, details: Record<string, unknown>) {
  const { error } = await admin().from('audit_events').insert({
    actor_type: 'operator',
    actor_id: actorId,
    event_type: eventType,
    details,
  })
  if (error) throw error
}
