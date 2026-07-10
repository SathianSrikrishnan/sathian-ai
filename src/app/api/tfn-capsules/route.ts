import { NextResponse } from 'next/server'

import { saveLocalCapsule } from '@/lib/tfn-capsule/local-capsule-store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  try {
    const capsule = await saveLocalCapsule(await request.json())
    return NextResponse.json({ capsule })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unable to save capsule' },
      { status: 400 },
    )
  }
}
