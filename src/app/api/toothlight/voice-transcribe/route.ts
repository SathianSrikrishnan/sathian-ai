import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

export const dynamic = 'force-dynamic'

const MAX_AUDIO_BYTES = 6 * 1024 * 1024
const AUDIO_EXTENSION_BY_MIME_TYPE = new Map([
  ['audio/webm', 'webm'],
  ['audio/mp4', 'm4a'],
  ['audio/x-m4a', 'm4a'],
  ['audio/mpeg', 'mp3'],
  ['audio/mp3', 'mp3'],
  ['audio/wav', 'wav'],
  ['audio/x-wav', 'wav'],
  ['audio/ogg', 'ogg'],
])

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
    const file = new File([Buffer.from(arrayBuffer)], getTranscriptionAudioFileName(audioFile), {
      type: getTranscriptionAudioType(audioFile),
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

function getTranscriptionAudioFileName(audioFile: File) {
  const uploadedName = audioFile.name?.toLowerCase() ?? ''
  if (/\.(webm|mp4|m4a|mp3|mpeg|mpga|wav|ogg)$/.test(uploadedName)) {
    return uploadedName.replace(/[^a-z0-9._-]/g, '') || 'toothlight-note.webm'
  }

  const extension = AUDIO_EXTENSION_BY_MIME_TYPE.get(getBaseMimeType(audioFile.type)) ?? 'webm'
  return `toothlight-note.${extension}`
}

function getTranscriptionAudioType(audioFile: File) {
  return getBaseMimeType(audioFile.type) || 'audio/webm'
}

function getBaseMimeType(mimeType: string) {
  return mimeType.split(';')[0]?.trim().toLowerCase() ?? ''
}
