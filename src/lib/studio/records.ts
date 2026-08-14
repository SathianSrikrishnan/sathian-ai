export type PublicMemoryStatus = 'draft' | 'approved' | 'retired'
export type PublicMemoryVisibility = 'public' | 'private'
export type BuildNoteStatus = 'draft' | 'published'
export type AgentGapStatus = 'open' | 'in_review' | 'resolved' | 'wont_fix'

export type HomepageSectionFields = {
  label?: string | null
  heading?: string | null
  description?: string | null
  ctaLabel?: string | null
  ctaHref?: string | null
  enabled?: boolean
}

type ParseResult<T> = { ok: true; value: T } | { ok: false; error: string }

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/
const HTML_PATTERN = /<\/?[a-z][^>]*>/i

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value))
}

function hasOnlyKeys(value: Record<string, unknown>, keys: ReadonlySet<string>) {
  return Object.keys(value).every((key) => keys.has(key))
}

function isUuid(value: unknown): value is string {
  return typeof value === 'string' && UUID_PATTERN.test(value)
}

function plainText(value: unknown, maxLength: number, nullable?: false): { ok: true; value: string } | { ok: false }
function plainText(value: unknown, maxLength: number, nullable: true): { ok: true; value: string | null } | { ok: false }
function plainText(value: unknown, maxLength: number, nullable = false) {
  if (nullable && value === null) return { ok: true as const, value: null }
  if (typeof value !== 'string') return { ok: false as const }
  const normalized = value.trim()
  if (!normalized || normalized.length > maxLength || HTML_PATTERN.test(normalized) || normalized.includes('\0')) {
    return { ok: false as const }
  }
  return { ok: true as const, value: normalized }
}

function optionalPlainText(value: unknown, maxLength: number) {
  if (value === undefined) return { ok: true as const, value: undefined }
  return plainText(value, maxLength, true)
}

function validCtaHref(value: unknown) {
  if (value === undefined) return { ok: true as const, value: undefined }
  if (value === null) return { ok: true as const, value: null }
  if (typeof value !== 'string' || value.length > 500 || value.includes('\0')) return { ok: false as const }
  const normalized = value.trim()
  if (!/^\/(?!\/)[^\s]*$/.test(normalized) && !/^https:\/\/[^\s]+$/i.test(normalized)) {
    return { ok: false as const }
  }
  return { ok: true as const, value: normalized }
}

export function parseHomepageMutation(
  input: unknown,
  existingIds: ReadonlySet<string>,
): ParseResult<
  | { kind: 'order'; records: Array<{ id: string; position: number }> }
  | { kind: 'section'; id: string; fields: HomepageSectionFields }
> {
  if (!isRecord(input) || typeof input.kind !== 'string') {
    return { ok: false, error: 'Invalid homepage update.' }
  }

  if (input.kind === 'order') {
    if (!hasOnlyKeys(input, new Set(['kind', 'ids'])) || !Array.isArray(input.ids)) {
      return { ok: false, error: 'Invalid homepage order.' }
    }
    if (input.ids.length !== existingIds.size || !input.ids.every(isUuid)) {
      return { ok: false, error: 'Homepage order must include every section once.' }
    }
    const ids = input.ids as string[]
    if (new Set(ids).size !== ids.length || ids.some((id) => !existingIds.has(id))) {
      return { ok: false, error: 'Homepage order contains an unknown or duplicate section.' }
    }
    return {
      ok: true,
      value: {
        kind: 'order',
        records: ids.map((id, position) => ({ id, position })),
      },
    }
  }

  if (input.kind !== 'section' || !hasOnlyKeys(input, new Set(['kind', 'id', 'fields']))) {
    return { ok: false, error: 'Invalid homepage update type.' }
  }
  if (!isUuid(input.id) || !existingIds.has(input.id) || !isRecord(input.fields)) {
    return { ok: false, error: 'Unknown homepage section.' }
  }

  const fields = input.fields
  const allowedFields = new Set(['label', 'heading', 'description', 'ctaLabel', 'ctaHref', 'enabled'])
  if (!hasOnlyKeys(fields, allowedFields) || Object.keys(fields).length === 0) {
    return { ok: false, error: 'No supported homepage fields were supplied.' }
  }

  const label = optionalPlainText(fields.label, 80)
  const heading = optionalPlainText(fields.heading, 160)
  const description = optionalPlainText(fields.description, 600)
  const ctaLabel = optionalPlainText(fields.ctaLabel, 80)
  const ctaHref = validCtaHref(fields.ctaHref)
  if (!label.ok || !heading.ok || !description.ok || !ctaLabel.ok || !ctaHref.ok) {
    return { ok: false, error: 'Homepage copy must be short plain text with an approved link.' }
  }
  if (fields.enabled !== undefined && typeof fields.enabled !== 'boolean') {
    return { ok: false, error: 'Homepage visibility must be true or false.' }
  }

  return {
    ok: true,
    value: {
      kind: 'section',
      id: input.id,
      fields: {
        ...(label.value !== undefined ? { label: label.value } : {}),
        ...(heading.value !== undefined ? { heading: heading.value } : {}),
        ...(description.value !== undefined ? { description: description.value } : {}),
        ...(ctaLabel.value !== undefined ? { ctaLabel: ctaLabel.value } : {}),
        ...(ctaHref.value !== undefined ? { ctaHref: ctaHref.value } : {}),
        ...(fields.enabled !== undefined ? { enabled: fields.enabled } : {}),
      },
    },
  }
}

export function parseMemoryMutation(input: unknown): ParseResult<{
  id: string
  status?: PublicMemoryStatus
  visibility?: PublicMemoryVisibility
  validUntil?: string | null
}> {
  if (!isRecord(input) || !hasOnlyKeys(input, new Set(['id', 'status', 'visibility', 'validUntil']))) {
    return { ok: false, error: 'Invalid memory review.' }
  }
  if (!isUuid(input.id)) return { ok: false, error: 'Invalid memory card.' }

  const statuses = new Set<unknown>(['draft', 'approved', 'retired'])
  const visibilities = new Set<unknown>(['public', 'private'])
  if (input.status !== undefined && !statuses.has(input.status)) {
    return { ok: false, error: 'Invalid memory status.' }
  }
  if (input.visibility !== undefined && !visibilities.has(input.visibility)) {
    return { ok: false, error: 'Invalid memory visibility.' }
  }
  if (
    input.validUntil !== undefined &&
    input.validUntil !== null &&
    (typeof input.validUntil !== 'string' || Number.isNaN(Date.parse(input.validUntil)))
  ) {
    return { ok: false, error: 'Invalid memory expiry.' }
  }
  if (input.status === undefined && input.visibility === undefined && input.validUntil === undefined) {
    return { ok: false, error: 'No memory review fields were supplied.' }
  }

  return {
    ok: true,
    value: {
      id: input.id,
      ...(input.status !== undefined ? { status: input.status as PublicMemoryStatus } : {}),
      ...(input.visibility !== undefined ? { visibility: input.visibility as PublicMemoryVisibility } : {}),
      ...(input.validUntil !== undefined ? { validUntil: input.validUntil as string | null } : {}),
    },
  }
}

export function parseAgentGapMutation(input: unknown): ParseResult<{
  id: string
  status: AgentGapStatus
  operatorNote: string | null
}> {
  if (!isRecord(input) || !hasOnlyKeys(input, new Set(['id', 'status', 'operatorNote']))) {
    return { ok: false, error: 'Invalid agent-gap review.' }
  }
  if (!isUuid(input.id)) return { ok: false, error: 'Invalid agent gap.' }
  const statuses = new Set<unknown>(['open', 'in_review', 'resolved', 'wont_fix'])
  if (!statuses.has(input.status)) return { ok: false, error: 'Invalid agent-gap status.' }
  const operatorNote = plainText(input.operatorNote, 1000, true)
  if (!operatorNote.ok) return { ok: false, error: 'Agent-gap notes must be plain text.' }
  return {
    ok: true,
    value: {
      id: input.id,
      status: input.status as AgentGapStatus,
      operatorNote: operatorNote.value,
    },
  }
}

export type BuildNoteInput = {
  title: string
  slug: string
  project: string
  date: string
  whatChanged: string
  whatLearned: string
  nextStep: string
  status: BuildNoteStatus
}

export function parseBuildNoteMutation(input: unknown): ParseResult<BuildNoteInput> {
  if (!isRecord(input)) return { ok: false, error: 'Invalid build note.' }
  const keys = new Set([
    'title',
    'slug',
    'project',
    'date',
    'whatChanged',
    'whatLearned',
    'nextStep',
    'status',
  ])
  if (!hasOnlyKeys(input, keys) || Object.keys(input).length !== keys.size) {
    return { ok: false, error: 'Build notes use only the supported fields.' }
  }

  const title = plainText(input.title, 160)
  const project = plainText(input.project, 100)
  const whatChanged = plainText(input.whatChanged, 1200)
  const whatLearned = plainText(input.whatLearned, 1200)
  const nextStep = plainText(input.nextStep, 1200)
  if (!title.ok || !project.ok || !whatChanged.ok || !whatLearned.ok || !nextStep.ok) {
    return { ok: false, error: 'Build note fields must be plain text within their limits.' }
  }
  if (typeof input.slug !== 'string' || !SLUG_PATTERN.test(input.slug)) {
    return { ok: false, error: 'Build note slug is invalid.' }
  }
  if (typeof input.date !== 'string' || !DATE_PATTERN.test(input.date) || Number.isNaN(Date.parse(input.date))) {
    return { ok: false, error: 'Build note date is invalid.' }
  }
  if (input.status !== 'draft' && input.status !== 'published') {
    return { ok: false, error: 'Build note status is invalid.' }
  }

  return {
    ok: true,
    value: {
      title: title.value,
      slug: input.slug,
      project: project.value,
      date: input.date,
      whatChanged: whatChanged.value,
      whatLearned: whatLearned.value,
      nextStep: nextStep.value,
      status: input.status,
    },
  }
}

export function formatStudioReceipt(receiptToken: string) {
  return receiptToken.replace(/-/g, '').slice(0, 8).toUpperCase()
}
