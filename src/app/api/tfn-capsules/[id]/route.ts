import { NextResponse } from 'next/server'

import { isValidCapsuleId, readLocalCapsule } from '@/lib/tfn-capsule/local-capsule-store'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  if (!isValidCapsuleId(params.id)) {
    return NextResponse.json({ error: 'Invalid capsule id' }, { status: 400 })
  }

  const capsule = await readLocalCapsule(params.id)
  if (!capsule) {
    return NextResponse.json({ error: 'Capsule not found' }, { status: 404 })
  }

  return NextResponse.json({ capsule })
}
