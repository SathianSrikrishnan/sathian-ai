import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

import {
  getDemoFutureNoteStatus,
  validateFutureNote,
} from '@/lib/toothlight/server/future-notes'
import { logToothlightProductEvent } from '@/lib/toothlight/server/product-events'
import {
  getPersistedToothlight,
  savePersistedFutureNote,
} from '@/lib/toothlight/server/toothlight-repository'

type RouteContext = {
  params: {
    id: string
  }
}

export async function GET(_request: NextRequest, { params }: RouteContext) {
  const persisted = process.env.NEXT_PUBLIC_TEST_MODE === 'true' ? null : await getPersistedToothlight(params.id)
  const publicStatus = persisted
    ? {
        toothlightId: params.id,
        status: persisted.futureNoteStatus,
        unlockAge: persisted.unlockAge,
      }
    : getDemoFutureNoteStatus(params.id)

  return NextResponse.json({
    statusOnly: true,
    noContent: true,
    publicStatus,
  })
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  const payload = await readPayload(request, params.id)

  if (process.env.NEXT_PUBLIC_TEST_MODE === 'true') {
    const saved = validateFutureNote(payload)
    await logToothlightProductEvent({
      userId: 'test-user',
      toothlightId: params.id,
      eventName: 'future_note_saved_demo',
      properties: { status: saved.status, unlockAge: saved.unlockAge },
    })
    return NextResponse.json({
      success: true,
      status: saved.status,
      unlockAge: saved.unlockAge,
    })
  }

  const user = await getUser(request)
  if (!user) {
    return NextResponse.json({ error: 'Parent account required to save a note for later.' }, { status: 401 })
  }

  const saved = validateFutureNote(payload)
  const persisted = await savePersistedFutureNote({ ...payload, userId: user.id })
  const responseStatus = persisted ?? {
    success: false,
    status: saved.status,
    unlockAge: saved.unlockAge,
  }

  await logToothlightProductEvent({
    userId: user.id,
    toothlightId: params.id,
    eventName: 'future_note_save_attempted',
    properties: { status: responseStatus.status, unlockAge: responseStatus.unlockAge },
  })

  if (!persisted) {
    return NextResponse.json({ error: 'Supabase persistence is not configured.', ...responseStatus }, { status: 500 })
  }

  return NextResponse.json(responseStatus)
}

async function getUser(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) return null

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll() {},
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  return user
}

async function readPayload(request: NextRequest, toothlightId: string) {
  try {
    const body = await request.json()
    return {
      toothlightId,
      seedNote: body.seedNote,
      sealedText: body.sealedText,
      unlockAge: body.unlockAge,
    }
  } catch {
    return { toothlightId }
  }
}
