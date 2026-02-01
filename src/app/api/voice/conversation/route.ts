import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'
import { loadContext, buildSystemPrompt } from '@/lib/context-loader'
import { startSession, saveConversation, extractMemories } from '@/lib/db-memory'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// Josh - light, friendly male voice
const DEFAULT_VOICE_ID = 'TxGEqnHWrfWFTfGW9XjX'

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  let step = 'init'

  try {
    step = 'formData'
    const formData = await request.formData()
    const audioFile = formData.get('audio') as File
    const historyJson = formData.get('history') as string
    const customContext = formData.get('context') as string

    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file provided', step }, { status: 400 })
    }

    console.log(`[Voice] Audio received: ${audioFile.size} bytes, type: ${audioFile.type}`)

    // Parse conversation history
    let history: Array<{ role: 'user' | 'assistant'; content: string }> = []
    if (historyJson) {
      try {
        history = JSON.parse(historyJson)
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

    console.log(`[Voice] Sending to Whisper: ${buffer.length} bytes`)

    const transcription = await openai.audio.transcriptions.create({
      file,
      model: 'whisper-1',
      language: 'en',
    })
    const transcribeTime = Date.now() - transcribeStart

    const userText = transcription.text
    console.log(`[Voice] Transcribed in ${transcribeTime}ms: "${userText}"`)

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
    let systemPrompt = buildSystemPrompt(context)

    // Add custom context if provided
    if (customContext) {
      systemPrompt += `\n\nADDITIONAL CONTEXT:\n${customContext}`
    }

    console.log(`[Voice] Context loaded from ${context.fromDatabase ? 'database' : 'fallback'}`)

    const messages = [
      ...history.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
      { role: 'user' as const, content: userText },
    ]

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500,
      system: systemPrompt,
      messages,
    })

    const textContent = response.content.find(block => block.type === 'text')
    const assistantText = textContent ? textContent.text : "I didn't catch that. Could you repeat?"
    const thinkTime = Date.now() - thinkStart
    console.log(`[Voice] Claude responded in ${thinkTime}ms: "${assistantText.substring(0, 50)}..."`)

    // Try to extract and save memories from this conversation (async, don't wait)
    extractMemories(userText, assistantText).catch(e =>
      console.log('[Voice] Memory extraction skipped:', e.message)
    )

    // 3. SPEAK - Convert response to audio using raw API (supports speed parameter)
    step = 'speak'
    const speakStart = Date.now()
    // Speed parameter from request (default 1.35 = 35% faster)
    const speedParam = formData.get('speed') as string
    const speed = speedParam ? parseFloat(speedParam) : 2.0

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
          speed, // 0.25 to 4.0, default 1.0 - we use 1.35 for 35% faster
        }),
      }
    )

    if (!ttsResponse.ok) {
      const errorText = await ttsResponse.text()
      throw new Error(`ElevenLabs TTS failed: ${ttsResponse.status} - ${errorText}`)
    }

    const audioBuffer = Buffer.from(await ttsResponse.arrayBuffer())
    const speakTime = Date.now() - speakStart
    console.log(`[Voice] TTS completed in ${speakTime}ms: ${audioBuffer.length} bytes`)

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
    const errorMessage = error instanceof Error ? error.message : String(error)
    const errorStack = error instanceof Error ? error.stack : undefined
    console.error(`[Voice] Error at step "${step}":`, errorMessage)
    if (errorStack) console.error(errorStack)

    return NextResponse.json(
      {
        error: 'Conversation failed',
        step,
        details: errorMessage,
      },
      { status: 500 }
    )
  }
}
