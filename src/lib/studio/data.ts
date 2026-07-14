import { supabaseAdmin } from '@/lib/supabase'
import type { BuildNoteInput, HomepageSectionFields } from '@/lib/studio/records'
import { formatStudioReceipt } from '@/lib/studio/records'

export interface StudioOverview {
  writing: number
  buildNotes: number
  homepageSections: number
  publicMemory: number
  inbox: number
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

function admin() {
  if (!supabaseAdmin) throw new Error('Studio data client is unavailable')
  return supabaseAdmin
}

async function count(table: string) {
  const { count: value, error } = await admin().from(table).select('*', { count: 'exact', head: true })
  if (error) throw error
  return value ?? 0
}

export async function getStudioOverview(): Promise<StudioOverview> {
  const [writing, buildNotes, homepageSections, publicMemory, inbox] = await Promise.all([
    count('articles'),
    count('build_notes'),
    count('homepage_sections'),
    count('public_memory_cards'),
    count('agent_intakes'),
  ])
  return { writing, buildNotes, homepageSections, publicMemory, inbox }
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
