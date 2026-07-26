import { NextRequest, NextResponse } from 'next/server'

import { getStudioInbox } from '@/lib/studio/data'
import { requireStudioAal2 } from '@/lib/studio-server-auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const denial = await requireStudioAal2(request)
  if (denial) return denial

  try {
    return NextResponse.json(await getStudioInbox())
  } catch {
    return NextResponse.json({ error: 'Studio inbox is unavailable.' }, { status: 503 })
  }
}
