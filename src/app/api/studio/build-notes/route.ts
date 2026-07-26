import { NextRequest, NextResponse } from 'next/server'

import {
  createStudioBuildNote,
  getStudioBuildNotes,
  updateStudioBuildNote,
} from '@/lib/studio/data'
import { getStudioOperatorId } from '@/lib/studio/operator'
import { parseBuildNoteMutation } from '@/lib/studio/records'
import { requireStudioAal2 } from '@/lib/studio-server-auth'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const denial = await requireStudioAal2(request)
  if (denial) return denial

  try {
    return NextResponse.json(await getStudioBuildNotes())
  } catch {
    return NextResponse.json({ error: 'Build notes are unavailable.' }, { status: 503 })
  }
}

export async function POST(request: NextRequest) {
  const denial = await requireStudioAal2(request)
  if (denial) return denial

  const parsed = parseBuildNoteMutation(await request.json().catch(() => null))
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 })

  try {
    const id = await createStudioBuildNote(parsed.value, await getStudioOperatorId(request))
    return NextResponse.json({ id }, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Build note could not be created.' }, { status: 503 })
  }
}

export async function PATCH(request: NextRequest) {
  const denial = await requireStudioAal2(request)
  if (denial) return denial

  const body = await request.json().catch(() => null)
  if (!body || typeof body !== 'object' || typeof (body as { id?: unknown }).id !== 'string') {
    return NextResponse.json({ error: 'Build note ID is required.' }, { status: 400 })
  }
  const { id, ...note } = body as { id: string } & Record<string, unknown>
  const parsed = parseBuildNoteMutation(note)
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 })

  try {
    await updateStudioBuildNote(id, parsed.value, await getStudioOperatorId(request))
    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Build note could not be updated.' }, { status: 503 })
  }
}
