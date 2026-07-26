import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'
import { loadContext, buildSystemPrompt } from '@/lib/context-loader'
import { startSession, saveConversation, extractMemories } from '@/lib/db-memory'
import { checkVoiceAuth } from '@/lib/voice-auth'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// Josh - light, friendly male voice
const DEFAULT_VOICE_ID = 'TxGEqnHWrfWFTfGW9XjX'

export async function POST(request: NextRequest) {
  // PIN gate
  const authError = checkVoiceAuth(request)
  if (authError) return authError

  const startTime = Date.now()
  let step = 'init'

  try {
    step = 'formData'
    const formData = await request.formData()
    const audioFile = formData.get('audio') as File
    const historyJson = formData.get('history') as string
    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 })
    }

    // Cap audio file size at 10MB to prevent abuse
    if (audioFile.size > 10 * 1024 * 1024) {
      return NextResponse.json({ error: 'Audio file too large (max 10MB)' }, { status: 400 })
    }


    // Parse and validate conversation history
    let history: Array<{ role: 'user' | 'assistant'; content: string }> = []
    if (historyJson) {
      try {
        const parsed = JSON.parse(historyJson)
        if (Array.isArray(parsed)) {
          history = parsed
            .slice(-20)
            .filter((msg: { role: string; content: string }) =>
              msg &&
              typeof msg.content === 'string' &&
              (msg.role === 'user' || msg.role === 'assistant')
            )
            .map((msg: { role: string; content: string }) => ({
              role: msg.role as 'user' | 'assistant',
              content: msg.content.slice(0, 2000),
            }))
        }
      } catch {
        // Ignore parse errors, start fresh
      }
    }

    // 1. TRANSCRIBE - Convert speech to text
    step = 'transcribe'
    const transcribeStart = Date.now()
    const arrayBuffer = await audioFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Use Blob instead of File for better compatibility
    const blob = new Blob([buffer], { type: 'audio/webm' })
    const file = new File([blob], 'audio.webm', { type: 'audio/webm' })


    const transcription = await openai.audio.transcriptions.create({
      file,
      model: 'whisper-1',
      language: 'en',
    })
    const transcribeTime = Date.now() - transcribeStart

    const userText = transcription.text

    if (!userText || userText.trim() === '') {
      return NextResponse.json({
        success: true,
        userText: '(no speech detected)',
        assistantText: "I didn't hear anything. Could you try again?",
        audio: '',
        timing: { transcribe: transcribeTime, think: 0, speak: 0, total: Date.now() - startTime },
      })
    }

    // 2. THINK - Get Claude's response
    step = 'think'
    const thinkStart = Date.now()

    // Load context from database (with fallback to hardcoded)
    const context = await loadContext(userText)
    const systemPrompt = buildSystemPrompt(context)


    const messages = [
      ...history.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
      { role: 'user' as const, content: userText },
    ]

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 500,
      system: systemPrompt,
      messages,
    })

    const textContent = response.content.find(block => block.type === 'text')
    const assistantText = textContent ? textContent.text : "I didn't catch that. Could you repeat?"
    const thinkTime = Date.now() - thinkStart

    // Try to extract and save memories from this conversation (async, don't wait)
    extractMemories(userText, assistantText).catch(() => {})

    // 3. SPEAK - Convert response to audio using raw API (supports speed parameter)
    step = 'speak'
    const speakStart = Date.now()
    // Speed parameter from request (default 1.2)
    const speedParam = formData.get('speed') as string
    const speed = speedParam ? parseFloat(speedParam) : 1.2

    const ttsResponse = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${DEFAULT_VOICE_ID}?output_format=mp3_44100_128`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': process.env.ELEVENLABS_API_KEY || '',
        },
        body: JSON.stringify({
          text: assistantText,
          model_id: 'eleven_turbo_v2_5',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.4,
            use_speaker_boost: true,
          },
          speed,
        }),
      }
    )

    if (!ttsResponse.ok) {
      const errorText = await ttsResponse.text()
      throw new Error(`ElevenLabs TTS failed: ${ttsResponse.status} - ${errorText}`)
    }

    const audioBuffer = Buffer.from(await ttsResponse.arrayBuffer())
    const speakTime = Date.now() - speakStart

    const totalTime = Date.now() - startTime

    // Return JSON with audio as base64
    return NextResponse.json({
      success: true,
      userText,
      assistantText,
      audio: audioBuffer.toString('base64'),
      timing: {
        transcribe: transcribeTime,
        think: thinkTime,
        speak: speakTime,
        total: totalTime,
      },
    })
  } catch (error) {
    console.error(`[Voice] Error at step "${step}":`, error)

    return NextResponse.json(
      { error: 'Conversation failed. Please try again.' },
      { status: 500 }
    )
  }
}
