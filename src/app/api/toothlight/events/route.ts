import { type NextRequest, NextResponse } from 'next/server'

import { logToothlightProductEvent } from '@/lib/toothlight/server/product-events'

export const dynamic = 'force-dynamic'

type EventPayload = {
  eventName?: unknown
  visitorId?: unknown
  sessionId?: unknown
  botCategory?: unknown
  toothlightId?: unknown
  properties?: unknown
}

export async function POST(request: NextRequest) {
  const payload = await readPayload(request)
  const eventName = cleanToken(payload.eventName, 80)

  if (!eventName) {
    return NextResponse.json({ error: 'eventName required' }, { status: 400 })
  }

  const visitorId = cleanToken(payload.visitorId, 120) || cleanToken(request.cookies.get('tfn_visitor_id')?.value, 120)
  const sessionId = cleanToken(payload.sessionId, 120)
  const botCategory = cleanBotCategory(payload.botCategory)
  const userAgent = cleanText(request.headers.get('user-agent'), 500)
  const referrer = cleanText(request.headers.get('referer'), 500)
  const country = cleanToken(request.headers.get('cf-ipcountry'), 8)
  const properties = sanitizeProperties(payload.properties)

  await logToothlightProductEvent({
    userId: null,
    toothlightId: cleanToken(payload.toothlightId, 120),
    eventName,
    properties: {
      ...properties,
      visitorId: properties.visitorId ?? visitorId,
      sessionId: properties.sessionId ?? sessionId,
      botCategory: properties.botCategory ?? botCategory,
      userAgent: properties.userAgent ?? userAgent,
      referrer: properties.referrer ?? referrer,
      country,
      receivedAt: new Date().toISOString(),
    },
  })

  return NextResponse.json({ ok: true })
}

async function readPayload(request: NextRequest): Promise<EventPayload> {
  try {
    return await request.json()
  } catch {
    return {}
  }
}

function sanitizeProperties(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
  return Object.fromEntries(
    Object.entries(value as Record<string, unknown>)
      .slice(0, 60)
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

function cleanBotCategory(value: unknown) {
  const category = cleanToken(value, 40)
  return category || 'unknown'
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
