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
  let contribution: NonNullable<Awaited<ReturnType<typeof savePersistedFamilyContribution>>> | ReturnType<typeof demoFamilyContribution>
  if (process.env.NEXT_PUBLIC_TEST_MODE === 'true' || isDemoToothlight(params.id)) {
    contribution = demoFamilyContribution(input)
  } else {
    try {
      contribution = (await savePersistedFamilyContribution(input)) ?? demoFamilyContribution(input)
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: familyContributionErrorMessage(error),
        },
        { status: 500 },
      )
    }
  }

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
  await logToothlightProductEvent({
    userId: null,
    toothlightId: params.id,
    eventName: 'family_contribution_completed',
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

function familyContributionErrorMessage(error: unknown) {
  const message =
    error instanceof Error
      ? error.message
      : typeof error === 'string'
        ? error
        : ''

  if (message.includes('TOOTHLIGHT_NOTE_ENCRYPTION_KEY')) {
    return 'Private note encryption is not configured for this preview. Add TOOTHLIGHT_NOTE_ENCRYPTION_KEY, then try again.'
  }

  return 'Contribution is not ready yet.'
}

function isDemoToothlight(toothlightId: string) {
  return toothlightId === 'demo-toothlight'
}
