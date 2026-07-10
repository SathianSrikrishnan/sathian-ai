import { appendFile, mkdir, readFile } from 'node:fs/promises'
import path from 'node:path'

export type LocalProductEventRecord = {
  id: string
  eventName: string
  visitorId: string | null
  sessionId: string | null
  botCategory: string | null
  path: string | null
  properties: Record<string, unknown>
  createdAt: string
}

export type LocalEventSummary = {
  generatedAt: string
  range: {
    days: number
    since: string
  }
  totals: {
    events: number
    uniqueVisitors: number
    uniqueSessions: number
    pageViews: number
  }
  funnel: Array<{
    step: number
    label: string
    eventName: string
    events: number
    uniqueVisitors: number
    conversionFromPrevious: number | null
  }>
  topPages: Array<{ label: string; count: number }>
  topSources: Array<{ label: string; count: number }>
  botBreakdown: Array<{ label: string; count: number }>
  recentEvents: LocalProductEventRecord[]
}

const STORE_DIR = path.join(process.cwd(), '.data', 'tfn-events')
const STORE_FILE = path.join(STORE_DIR, 'events.jsonl')
const MAX_LINE_LENGTH = 25_000

const LAUNCH_FUNNEL_EVENTS = [
  ['Landing viewed', 'landing_view'],
  ['Certificate started', 'certificate_started'],
  ['Certificate generated', 'certificate_generated'],
  ['Certificate downloaded', 'certificate_downloaded'],
  ['Create started', 'capsule_started'],
  ['Capsule created', 'capsule_created'],
  ['Capsule saved', 'capsule_saved'],
  ['Share clicked', 'share_clicked'],
  ['Family note started', 'family_note_started'],
] as const

export async function appendLocalProductEvent(input: {
  eventName: string
  visitorId?: string | null
  sessionId?: string | null
  botCategory?: string | null
  properties?: Record<string, unknown>
}) {
  const record = normalizeEvent(input)
  await mkdir(STORE_DIR, { recursive: true })
  await appendFile(STORE_FILE, `${JSON.stringify(record)}\n`, 'utf8')
  return record
}

export async function readLocalProductEvents(days = 7) {
  const rangeDays = clampDays(days)
  const sinceDate = new Date(Date.now() - rangeDays * 24 * 60 * 60 * 1000)

  try {
    const raw = await readFile(STORE_FILE, 'utf8')
    return raw
      .split('\n')
      .filter(Boolean)
      .slice(-5000)
      .map(parseEventLine)
      .filter((event): event is LocalProductEventRecord => Boolean(event))
      .filter((event) => new Date(event.createdAt).getTime() >= sinceDate.getTime())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  } catch {
    return []
  }
}

export function summarizeLocalProductEvents(events: LocalProductEventRecord[], days = 7): LocalEventSummary {
  const visitors = new Set<string>()
  const sessions = new Set<string>()
  const pages = new Map<string, number>()
  const sources = new Map<string, number>()
  const botBreakdown = new Map<string, number>()

  for (const event of events) {
    if (event.visitorId) visitors.add(event.visitorId)
    if (event.sessionId) sessions.add(event.sessionId)
    increment(botBreakdown, event.botCategory || 'unknown')

    if (event.eventName === 'page_view') {
      increment(pages, event.path || stringValue(event.properties.pathname) || 'unknown')
    }

    const referrer = stringValue(event.properties.referrer)
    increment(sources, referrer ? safeHost(referrer) : 'direct_or_unknown')
  }

  const rangeDays = clampDays(days)
  const since = new Date(Date.now() - rangeDays * 24 * 60 * 60 * 1000).toISOString()

  return {
    generatedAt: new Date().toISOString(),
    range: { days: rangeDays, since },
    totals: {
      events: events.length,
      uniqueVisitors: visitors.size,
      uniqueSessions: sessions.size,
      pageViews: events.filter((event) => event.eventName === 'page_view').length,
    },
    funnel: summarizeFunnel(events),
    topPages: topEntries(pages, 10),
    topSources: topEntries(sources, 10),
    botBreakdown: topEntries(botBreakdown, 10),
    recentEvents: events.slice(0, 30),
  }
}

function normalizeEvent(input: {
  eventName: string
  visitorId?: string | null
  sessionId?: string | null
  botCategory?: string | null
  properties?: Record<string, unknown>
}): LocalProductEventRecord {
  const properties = sanitizeProperties(input.properties)
  const visitorId = cleanToken(input.visitorId, 120) || cleanToken(properties.visitorId, 120)
  const sessionId = cleanToken(input.sessionId, 120) || cleanToken(properties.sessionId, 120)
  const botCategory = cleanToken(input.botCategory, 40) || cleanToken(properties.botCategory, 40)
  const eventName = cleanToken(input.eventName, 100) || 'unknown_event'

  return {
    id: createEventId(),
    eventName,
    visitorId,
    sessionId,
    botCategory,
    path: cleanText(properties.path, 200) || cleanText(properties.pathname, 200),
    properties,
    createdAt: new Date().toISOString(),
  }
}

function parseEventLine(line: string) {
  try {
    if (line.length > MAX_LINE_LENGTH) return null
    const parsed = JSON.parse(line) as Partial<LocalProductEventRecord>
    if (!parsed.eventName || !parsed.createdAt) return null
    return {
      id: cleanToken(parsed.id, 140) || createEventId(),
      eventName: cleanToken(parsed.eventName, 100) || 'unknown_event',
      visitorId: cleanToken(parsed.visitorId, 120),
      sessionId: cleanToken(parsed.sessionId, 120),
      botCategory: cleanToken(parsed.botCategory, 40),
      path: cleanText(parsed.path, 200),
      properties: sanitizeProperties(parsed.properties),
      createdAt: cleanText(parsed.createdAt, 60) || new Date().toISOString(),
    }
  } catch {
    return null
  }
}

function summarizeFunnel(events: LocalProductEventRecord[]) {
  const rows = LAUNCH_FUNNEL_EVENTS.map(([label, eventName], index) => ({
    step: index + 1,
    label,
    eventName,
    events: events.filter((event) => event.eventName === eventName).length,
    uniqueVisitors: uniqueVisitorsFor(events, eventName),
    conversionFromPrevious: null as number | null,
  }))

  return rows.map((row, index) => {
    if (index === 0) return row
    const previous = rows[index - 1]
    return {
      ...row,
      conversionFromPrevious:
        previous.uniqueVisitors > 0 ? Number((row.uniqueVisitors / previous.uniqueVisitors).toFixed(4)) : null,
    }
  })
}

function uniqueVisitorsFor(events: LocalProductEventRecord[], eventName: string) {
  const visitors = new Set<string>()
  for (const event of events) {
    if (event.eventName === eventName && event.visitorId) visitors.add(event.visitorId)
  }
  return visitors.size
}

function sanitizeProperties(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .slice(0, 80)
      .map(([key, entry]) => [cleanToken(key, 80), sanitizeValue(entry)])
      .filter(([key]) => key),
  )
}

function sanitizeValue(value: unknown): unknown {
  if (value === null || value === undefined) return null
  if (typeof value === 'string') return cleanText(value, 1000)
  if (typeof value === 'number' || typeof value === 'boolean') return value
  if (Array.isArray(value)) return value.slice(0, 20).map(sanitizeValue)
  if (typeof value === 'object') return sanitizeProperties(value)
  return String(value).slice(0, 200)
}

function createEventId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `evt_${crypto.randomUUID()}`
  }
  return `evt_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`
}

function cleanToken(value: unknown, maxLength: number) {
  if (typeof value !== 'string') return null
  const cleaned = value.replace(/[^\w:./?=&-]/g, '').slice(0, maxLength)
  return cleaned || null
}

function cleanText(value: unknown, maxLength: number) {
  if (typeof value !== 'string') return null
  const cleaned = value.replace(/\s+/g, ' ').trim().slice(0, maxLength)
  return cleaned || null
}

function stringValue(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim() : null
}

function safeHost(value: string) {
  try {
    return new URL(value).hostname
  } catch {
    return value.slice(0, 80)
  }
}

function increment(map: Map<string, number>, key: string) {
  map.set(key, (map.get(key) ?? 0) + 1)
}

function topEntries(map: Map<string, number>, limit: number) {
  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([label, count]) => ({ label, count }))
}

function clampDays(days: number) {
  if (!Number.isFinite(days)) return 7
  return Math.min(90, Math.max(1, Math.floor(days)))
}
