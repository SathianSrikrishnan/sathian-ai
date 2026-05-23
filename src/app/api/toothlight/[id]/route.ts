import { type NextRequest, NextResponse } from 'next/server'

import { getPersistedToothlight } from '@/lib/toothlight/server/toothlight-repository'

type RouteContext = {
  params: {
    id: string
  }
}

export async function GET(_request: NextRequest, { params }: RouteContext) {
  if (process.env.NEXT_PUBLIC_TEST_MODE === 'true' && params.id === 'demo-toothlight') {
    return NextResponse.json({
      success: true,
      statusOnly: true,
      noContent: true,
      toothlight: {
        toothlightId: 'demo-toothlight',
        childName: 'Kai',
        toothName: 'First Tooth',
        caption: 'Lost after breakfast and showed everyone.',
        imageSrc: null,
        sourceImageSrc: null,
        renderedImageSrc: null,
        glowId: 'nightlight',
        treatmentId: 'nightlight',
        treatmentVersion: 'deterministic-css-v1',
        shareUrl: '/toothlight/t/demo-toothlight',
        savedAt: new Date(0).toISOString(),
        futureNoteStatus: 'none',
        unlockAge: 10,
        smileFundStatus: 'none',
        familyNodes: [],
      },
    })
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
