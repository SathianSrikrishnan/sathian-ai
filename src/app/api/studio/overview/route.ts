import { NextRequest, NextResponse } from 'next/server'

import { getStudioOverview } from '@/lib/studio/data'
import { requireStudioAal2 } from '@/lib/studio-server-auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const denial = await requireStudioAal2(request)
  if (denial) return denial

  try {
    return NextResponse.json(await getStudioOverview())
  } catch {
    return NextResponse.json({ error: 'Studio overview is unavailable.' }, { status: 503 })
  }
}
