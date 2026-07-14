import { NextRequest, NextResponse } from 'next/server'

import {
  getStudioHomepageSections,
  reorderStudioHomepage,
  updateStudioHomepageSection,
} from '@/lib/studio/data'
import { getStudioOperatorId } from '@/lib/studio/operator'
import { parseHomepageMutation } from '@/lib/studio/records'
import { requireStudioAal2 } from '@/lib/studio-server-auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const denial = await requireStudioAal2(request)
  if (denial) return denial

  try {
    return NextResponse.json(await getStudioHomepageSections())
  } catch {
    return NextResponse.json({ error: 'Homepage records are unavailable.' }, { status: 503 })
  }
}

export async function PATCH(request: NextRequest) {
  const denial = await requireStudioAal2(request)
  if (denial) return denial

  try {
    const sections = await getStudioHomepageSections()
    const parsed = parseHomepageMutation(
      await request.json().catch(() => null),
      new Set(sections.map((section) => section.id)),
    )
    if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 })

    const actorId = await getStudioOperatorId(request)
    if (parsed.value.kind === 'order') {
      await reorderStudioHomepage(parsed.value.records, actorId)
    } else {
      await updateStudioHomepageSection(parsed.value.id, parsed.value.fields, actorId)
    }
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Homepage update could not be saved.' }, { status: 503 })
  }
}
