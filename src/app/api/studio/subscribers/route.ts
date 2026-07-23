import { NextRequest, NextResponse } from 'next/server'

import { getStudioSubscribers, updateStudioSubscriberStatus } from '@/lib/studio/data'
import { getStudioOperatorId } from '@/lib/studio/operator'
import { requireStudioAal2 } from '@/lib/studio-server-auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const denial = await requireStudioAal2(request)
  if (denial) return denial
  try {
    return NextResponse.json(await getStudioSubscribers())
  } catch {
    return NextResponse.json({ error: 'Subscribers are unavailable.' }, { status: 503 })
  }
}

export async function PATCH(request: NextRequest) {
  const denial = await requireStudioAal2(request)
  if (denial) return denial

  const body = await request.json().catch(() => null) as { id?: unknown; status?: unknown } | null
  if (
    typeof body?.id !== 'string'
    || !['subscribed', 'unsubscribed', 'bounced'].includes(String(body.status))
  ) {
    return NextResponse.json({ error: 'Subscriber ID and a valid status are required.' }, { status: 400 })
  }

  try {
    await updateStudioSubscriberStatus(
      body.id,
      body.status as 'subscribed' | 'unsubscribed' | 'bounced',
      await getStudioOperatorId(request),
    )
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Subscriber status could not be changed.' }, { status: 503 })
  }
}
