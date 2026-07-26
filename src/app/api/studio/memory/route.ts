import { NextRequest, NextResponse } from 'next/server'

import { getStudioMemoryCards, updateStudioMemoryReview } from '@/lib/studio/data'
import { getStudioOperatorId } from '@/lib/studio/operator'
import { parseMemoryMutation } from '@/lib/studio/records'
import { requireStudioAal2 } from '@/lib/studio-server-auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const denial = await requireStudioAal2(request)
  if (denial) return denial

  try {
    return NextResponse.json(await getStudioMemoryCards())
  } catch {
    return NextResponse.json({ error: 'Public memory is unavailable.' }, { status: 503 })
  }
}

export async function PATCH(request: NextRequest) {
  const denial = await requireStudioAal2(request)
  if (denial) return denial

  const parsed = parseMemoryMutation(await request.json().catch(() => null))
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 })

  try {
    await updateStudioMemoryReview(parsed.value, await getStudioOperatorId(request))
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Memory review could not be saved.' }, { status: 503 })
  }
}
