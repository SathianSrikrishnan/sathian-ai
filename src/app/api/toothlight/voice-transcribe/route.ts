import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

export const dynamic = 'force-dynamic'

const MAX_AUDIO_BYTES = 6 * 1024 * 1024

function isVoiceTranscribeEnabled() {
  return process.env.NODE_ENV !== 'production' || process.env.TOOTHLIGHT_ENABLE_VOICE_TRANSCRIBE === 'true'
}

export async function POST(request: NextRequest) {
  if (!isVoiceTranscribeEnabled()) {
    return NextResponse.json(
      { error: 'Voice transcription is not enabled for this environment.' },
      { status: 503 },
    )
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'Voice transcription is not configured.' },
      { status: 503 },
    )
  }

  try {
    const formData = await request.formData()
    const audioFile = formData.get('audio') as File | null

    if (!audioFile) {
      return NextResponse.json({ error: 'No audio provided.' }, { status: 400 })
    }

    if (audioFile.size > MAX_AUDIO_BYTES) {
      return NextResponse.json({ error: 'Audio is too large. Try a shorter note.' }, { status: 413 })
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    const arrayBuffer = await audioFile.arrayBuffer()
    const file = new File([Buffer.from(arrayBuffer)], 'toothlight-note.webm', {
      type: audioFile.type || 'audio/webm',
    })

    const transcription = await openai.audio.transcriptions.create({
      file,
      model: 'whisper-1',
      language: 'en',
    })

    return NextResponse.json({
      success: true,
      text: transcription.text?.trim() ?? '',
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Voice transcription failed.',
      },
      { status: 500 },
    )
  }
}

