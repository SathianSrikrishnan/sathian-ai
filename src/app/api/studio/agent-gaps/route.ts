import { NextRequest, NextResponse } from 'next/server'

import {
  getStudioAgentKnowledgeGaps,
  updateStudioAgentKnowledgeGap,
} from '@/lib/studio/data'
import { getStudioOperatorId } from '@/lib/studio/operator'
import { parseAgentGapMutation } from '@/lib/studio/records'
import { requireStudioAal2 } from '@/lib/studio-server-auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const denial = await requireStudioAal2(request)
  if (denial) return denial

  try {
    return NextResponse.json(await getStudioAgentKnowledgeGaps())
  } catch {
    return NextResponse.json({ error: 'Agent knowledge gaps are unavailable.' }, { status: 503 })
  }
}

export async function PATCH(request: NextRequest) {
  const denial = await requireStudioAal2(request)
  if (denial) return denial

  const parsed = parseAgentGapMutation(await request.json().catch(() => null))
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 })

  try {
    await updateStudioAgentKnowledgeGap(parsed.value, await getStudioOperatorId(request))
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Agent-gap review could not be saved.' }, { status: 503 })
  }
}
