import { type NextRequest, NextResponse } from 'next/server'

import { demoFamilyContribution } from '@/lib/toothlight/server/family-contributions'
import { logToothlightProductEvent } from '@/lib/toothlight/server/product-events'
import { savePersistedFamilyContribution } from '@/lib/toothlight/server/toothlight-repository'

type RouteContext = {
  params: {
    id: string
  }
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  const body = await readBody(request)
  const input = {
    toothlightId: params.id,
    contributorName: body.contributorName,
    noteText: body.noteText,
    giftAmountCents: body.giftAmountCents,
    includeGift: body.includeGift,
  }
  const contribution =
    process.env.NEXT_PUBLIC_TEST_MODE === 'true'
      ? demoFamilyContribution(input)
      : (await savePersistedFamilyContribution(input)) ?? demoFamilyContribution(input)

  await logToothlightProductEvent({
    userId: null,
    toothlightId: params.id,
    eventName: 'family_contribution_demo',
    properties: {
      nodeKind: contribution.nodeKind,
      noteOnly: contribution.noteOnly,
      giftAmountCents: contribution.giftAmountCents,
    },
  })

  return NextResponse.json(contribution)
}

async function readBody(request: NextRequest) {
  try {
    return await request.json()
  } catch {
    return {}
  }
}
