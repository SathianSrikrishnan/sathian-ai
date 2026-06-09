import { type NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

import { requireToothFairyAdminRequest } from '@/lib/toothfairy/admin-guard'
import { TOOTHLIGHT_IMAGE_BUCKET } from '@/lib/toothlight/server/toothlight-media'

export const dynamic = 'force-dynamic'

type Check = {
  name: string
  status: 'ok' | 'warn' | 'fail'
  detail: string
}

const REQUIRED_TABLES = [
  'tfn_toothlights',
  'tfn_future_notes',
  'tfn_family_contributions',
  'tfn_product_events',
]

export async function GET(request: NextRequest) {
  const unauthorized = requireToothFairyAdminRequest(request)
  if (unauthorized) return unauthorized

  const checks: Check[] = []
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const noteEncryptionKey = process.env.TOOTHLIGHT_NOTE_ENCRYPTION_KEY
  const voiceTranscribeEnabled = process.env.TOOTHLIGHT_ENABLE_VOICE_TRANSCRIBE
  const openAiKey = process.env.OPENAI_API_KEY

  addEnvCheck(checks, 'NEXT_PUBLIC_SUPABASE_URL', supabaseUrl)
  addEnvCheck(checks, 'NEXT_PUBLIC_SUPABASE_ANON_KEY', anonKey)
  addEnvCheck(checks, 'SUPABASE_SERVICE_ROLE_KEY', serviceKey)
  addNoteEncryptionKeyCheck(checks, noteEncryptionKey)
  addVoiceTranscriptionCheck(checks, voiceTranscribeEnabled, openAiKey)

  if (supabaseUrl && serviceKey) {
    const supabase = createClient(supabaseUrl, serviceKey)

    for (const table of REQUIRED_TABLES) {
      try {
        const { error } = await supabase.from(table).select('*', { count: 'exact', head: true })
        if (error) throw error
        checks.push({ name: table, status: 'ok', detail: 'Reachable' })
      } catch (error) {
        checks.push({
          name: table,
          status: 'fail',
          detail: error instanceof Error ? error.message : 'Not reachable',
        })
      }
    }

    try {
      const { data, error } = await supabase.storage.getBucket(TOOTHLIGHT_IMAGE_BUCKET)
      if (error) throw error
      checks.push({
        name: TOOTHLIGHT_IMAGE_BUCKET,
        status: data.public ? 'ok' : 'warn',
        detail: data.public ? 'Public bucket reachable' : 'Bucket exists but is not public',
      })
    } catch (error) {
      checks.push({
        name: TOOTHLIGHT_IMAGE_BUCKET,
        status: 'fail',
        detail: error instanceof Error ? error.message : 'Bucket not reachable',
      })
    }
  }

  const healthy = checks.every((check) => check.status !== 'fail')
  return NextResponse.json(
    {
      healthy,
      timestamp: new Date().toISOString(),
      checks,
    },
    { status: healthy ? 200 : 503 },
  )
}

function addEnvCheck(checks: Check[], name: string, value: string | undefined) {
  checks.push({
    name,
    status: value ? 'ok' : 'fail',
    detail: value ? 'Configured' : 'Missing',
  })
}

function addNoteEncryptionKeyCheck(checks: Check[], value: string | undefined) {
  if (!value) {
    checks.push({
      name: 'TOOTHLIGHT_NOTE_ENCRYPTION_KEY',
      status: 'fail',
      detail: 'Missing; required before saving private notes',
    })
    return
  }

  const key = Buffer.from(value, 'base64')
  checks.push({
    name: 'TOOTHLIGHT_NOTE_ENCRYPTION_KEY',
    status: key.byteLength === 32 ? 'ok' : 'fail',
    detail: key.byteLength === 32 ? 'Configured' : 'Must be a base64-encoded 32-byte key',
  })
}

function addVoiceTranscriptionCheck(
  checks: Check[],
  enabledValue: string | undefined,
  openAiKey: string | undefined,
) {
  if (enabledValue !== 'true') {
    checks.push({
      name: 'TOOTHLIGHT_ENABLE_VOICE_TRANSCRIBE',
      status: 'warn',
      detail: 'Voice transcription disabled; text input and browser speech remain available',
    })
    return
  }

  checks.push({
    name: 'TOOTHLIGHT_ENABLE_VOICE_TRANSCRIBE',
    status: 'ok',
    detail: 'Voice transcription enabled',
  })

  checks.push({
    name: 'OPENAI_API_KEY',
    status: openAiKey ? 'ok' : 'fail',
    detail: openAiKey
      ? 'Configured for Toothlight voice transcription'
      : 'Voice transcription enabled but OPENAI_API_KEY is missing',
  })
}
