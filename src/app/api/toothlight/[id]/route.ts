import { type NextRequest, NextResponse } from 'next/server'

import { getPersistedToothlight } from '@/lib/toothlight/server/toothlight-repository'

type RouteContext = {
  params: {
    id: string
  }
}

const DEMO_TOOTHLIGHT_IMAGE_SRC =
  '/toothlight/style-objects/product-renders/v4/moon-window-product.jpg'

export async function GET(_request: NextRequest, { params }: RouteContext) {
  if (params.id === 'demo-toothlight') {
    return NextResponse.json(demoToothlightPayload())
  }

  if (!isValidToothlightId(params.id)) {
    return NextResponse.json(
      {
        success: false,
        statusOnly: true,
        noContent: true,
        error: 'Toothlight not found.',
      },
      { status: 404 },
    )
  }

  const persisted = await getPersistedToothlight(params.id)

  if (!persisted) {
    return NextResponse.json(
      {
        success: false,
        statusOnly: true,
        noContent: true,
        error: 'Toothlight not found.',
      },
      { status: 404 },
    )
  }

  return NextResponse.json({
    success: true,
    statusOnly: true,
    noContent: true,
    toothlight: persisted,
  })
}

function demoToothlightPayload() {
  return {
    success: true,
    statusOnly: true,
    noContent: true,
    toothlight: {
      toothlightId: 'demo-toothlight',
      childName: 'Kai',
      toothName: 'First Tooth',
      caption: 'Lost after breakfast and showed everyone.',
      imageSrc: DEMO_TOOTHLIGHT_IMAGE_SRC,
      sourceImageSrc: DEMO_TOOTHLIGHT_IMAGE_SRC,
      renderedImageSrc: DEMO_TOOTHLIGHT_IMAGE_SRC,
      glowId: 'moon-window',
      treatmentId: 'moon-window',
      treatmentVersion: 'deterministic-css-v2',
      shareUrl: '/toothlight/t/demo-toothlight',
      savedAt: new Date(0).toISOString(),
      futureNoteStatus: 'none',
      unlockAge: 10,
      smileFundStatus: 'none',
      familyNodes: [],
    },
  }
}

function isValidToothlightId(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
}
