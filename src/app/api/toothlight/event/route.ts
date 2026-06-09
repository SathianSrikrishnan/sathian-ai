import { type NextRequest, NextResponse } from 'next/server'

import {
  allowedToothlightClientEvents,
  type ToothlightClientEventName,
} from '@/lib/toothlight/client/product-events'
import { logToothlightProductEvent } from '@/lib/toothlight/server/product-events'

export async function POST(request: NextRequest) {
  const body = await readBody(request)
  const eventName = typeof body.eventName === 'string' ? body.eventName : ''

  if (!isAllowedEvent(eventName)) {
    return NextResponse.json({ success: false, error: 'Unsupported Toothlight event.' }, { status: 400 })
  }

  await logToothlightProductEvent({
    userId: null,
    toothlightId: typeof body.toothlightId === 'string' ? body.toothlightId : null,
    eventName,
    properties: sanitizeProperties(body.properties),
  })

  return NextResponse.json({ success: true })
}

function isAllowedEvent(eventName: string): eventName is ToothlightClientEventName {
  return allowedToothlightClientEvents.includes(eventName as ToothlightClientEventName)
}

async function readBody(request: NextRequest) {
  try {
    return await request.json()
  } catch {
    return {}
  }
}

function sanitizeProperties(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
  return value as Record<string, unknown>
}
