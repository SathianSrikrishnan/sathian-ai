import { createClient } from '@supabase/supabase-js'

import { verifyFileIntakeHuman } from '@/lib/agent/turnstile'
import { createUploadReserveHandler } from '@/lib/agent/upload-handlers'
import { createAgentUploadRepository } from '@/lib/agent/upload-repository'

export const runtime = 'nodejs'

export async function POST(request: Request): Promise<Response> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !serviceRoleKey) {
    return Response.json(
      { error: 'Private file intake is temporarily unavailable.' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } },
    )
  }

  const client = createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  const repository = createAgentUploadRepository(client)
  return createUploadReserveHandler({
    verifyHuman: verifyFileIntakeHuman,
    consumeRateLimit: repository.consumeRateLimit,
    reserve: repository.reserve,
  })(request)
}
