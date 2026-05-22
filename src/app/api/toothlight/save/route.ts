import { createServerClient } from '@supabase/ssr'
import { type NextRequest, NextResponse } from 'next/server'

import { logToothlightProductEvent } from '@/lib/toothlight/server/product-events'
import {
  demoSaveToothlight,
  type ToothlightSaveDraft,
} from '@/lib/toothlight/server/save-toothlight'
import { uploadToothlightImage } from '@/lib/toothlight/server/toothlight-media'
import { savePersistedToothlight } from '@/lib/toothlight/server/toothlight-repository'

export async function POST(request: NextRequest) {
  const payload = await readPayload(request)

  if (process.env.NEXT_PUBLIC_TEST_MODE === 'true') {
    const result = demoSaveToothlight(payload)
    await logToothlightProductEvent({
      userId: 'test-user',
      toothlightId: result.toothlightId,
      eventName: 'toothlight_save_demo',
      properties: { glowId: payload.glowId ?? null },
    })
    return NextResponse.json(result)
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json({ error: 'Supabase auth is not configured.' }, { status: 500 })
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll() {
        // Read-only route response for this first V4 boundary.
      },
    },
  })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Parent account required to save this Toothlight.' }, { status: 401 })
  }

  const imageUri = await uploadToothlightImage({
    userId: user.id,
    imageSrc: payload.imageSrc,
  })
  const result = await savePersistedToothlight({
    userId: user.id,
    draft: { ...payload, imageSrc: imageUri ?? payload.imageSrc },
  })

  if (!result) {
    return NextResponse.json({ error: 'Supabase persistence is not configured.' }, { status: 500 })
  }

  await logToothlightProductEvent({
    userId: user.id,
    toothlightId: result.toothlightId,
    eventName: 'toothlight_save_attempted',
    properties: { status: result.status, glowId: payload.glowId ?? null },
  })

  return NextResponse.json(result)
}

async function readPayload(request: NextRequest): Promise<ToothlightSaveDraft> {
  try {
    const body = await request.json()
    return {
      childName: body.childName,
      toothName: body.toothName,
      caption: body.caption,
      imageSrc: body.imageSrc,
      glowId: body.glowId,
    }
  } catch {
    return {}
  }
}
