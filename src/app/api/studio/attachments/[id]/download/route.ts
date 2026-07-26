import { NextRequest, NextResponse } from 'next/server'

import { createOperatorAttachmentUrl } from '@/lib/agent/operator-files'
import { supabaseAdmin } from '@/lib/supabase'
import {
  getStudioAttachmentAccess,
  recordStudioAttachmentAccess,
} from '@/lib/studio/data'
import { getStudioOperatorId } from '@/lib/studio/operator'
import { requireStudioAal2 } from '@/lib/studio-server-auth'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const denial = await requireStudioAal2(request)
  if (denial) return denial
  if (!supabaseAdmin || !/^[a-f0-9-]{36}$/i.test(params.id)) {
    return NextResponse.json({ error: 'Attachment not found.' }, { status: 404 })
  }

  try {
    const attachment = await getStudioAttachmentAccess(params.id)
    if (!attachment) {
      return NextResponse.json({ error: 'Attachment not found.' }, { status: 404 })
    }

    const access = await createOperatorAttachmentUrl(
      supabaseAdmin.storage.from('agent-quarantine'),
      attachment.objectPath,
      attachment.filename,
    )
    await recordStudioAttachmentAccess(params.id, await getStudioOperatorId(request))
    const response = NextResponse.redirect(access.url, 307)
    response.headers.set('Cache-Control', 'private, no-store')
    return response
  } catch {
    return NextResponse.json({ error: 'Attachment access is unavailable.' }, { status: 503 })
  }
}
