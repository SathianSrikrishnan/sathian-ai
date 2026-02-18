import { NextRequest, NextResponse } from 'next/server'

/**
 * Check if a voice API request is authorized via PIN.
 * Returns null if authorized, or a NextResponse error if not.
 */
export function checkVoiceAuth(request: NextRequest): NextResponse | null {
  const voicePin = process.env.VOICE_PIN

  // If VOICE_PIN is not configured, voice is disabled entirely
  if (!voicePin) {
    return NextResponse.json(
      { error: 'Voice is currently unavailable.' },
      { status: 503 }
    )
  }

  // Check for PIN in header
  const pin = request.headers.get('x-voice-pin')

  if (!pin || pin !== voicePin) {
    return NextResponse.json(
      { error: 'Voice access requires authentication.' },
      { status: 401 }
    )
  }

  // Authorized
  return null
}
