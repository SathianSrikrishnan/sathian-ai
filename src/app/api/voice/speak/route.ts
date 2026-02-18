import { NextRequest, NextResponse } from 'next/server'
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js'
import { checkVoiceAuth } from '@/lib/voice-auth'

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
})

// Light, fun male voice - Josh (conversational and friendly)
const DEFAULT_VOICE_ID = 'TxGEqnHWrfWFTfGW9XjX' // Josh

export async function POST(request: NextRequest) {
  // PIN gate
  const authError = checkVoiceAuth(request)
  if (authError) return authError

  try {
    const { text, voiceId } = await request.json()

    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 })
    }

    const audioStream = await elevenlabs.textToSpeech.convert(
      voiceId || DEFAULT_VOICE_ID,
      {
        text,
        modelId: 'eleven_turbo_v2_5',
        outputFormat: 'mp3_44100_128',
        voiceSettings: {
          stability: 0.5,
          similarityBoost: 0.75,
          style: 0.5,
          useSpeakerBoost: true,
        },
      }
    )

    // Collect stream into buffer
    const reader = audioStream.getReader()
    const chunks: Uint8Array[] = []

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      if (value) chunks.push(value)
    }

    const audioBuffer = Buffer.concat(chunks)

    // Return audio as binary
    return new NextResponse(audioBuffer, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.length.toString(),
      },
    })
  } catch (error) {
    console.error('Text-to-speech error:', error)
    return NextResponse.json(
      { error: 'Speech synthesis failed. Please try again.' },
      { status: 500 }
    )
  }
}
