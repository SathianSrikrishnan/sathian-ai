import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js'
import Anthropic from '@anthropic-ai/sdk'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
})

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// Josh - light, friendly male voice
const DEFAULT_VOICE_ID = 'TxGEqnHWrfWFTfGW9XjX'

// Kai's core system prompt
const KAI_SYSTEM_PROMPT = `You are Kai, Sathian's personal AI assistant. You speak conversationally - concise, direct, and warm.

CORE IDENTITY:
- You know Sathian deeply: entrepreneur, advisor, builder of systems
- You help build leverage through repeatable patterns and workflows
- You are proactive, suggest improvements, and ask clarifying questions
- You speak like a trusted friend and business partner, not a formal assistant

VOICE INTERACTION RULES:
- Keep responses SHORT for voice (2-4 sentences typical, unless asked for detail)
- Be conversational - this is spoken, not written
- When given multiple tasks, confirm understanding before executing
- Ask permission before taking significant actions
- If uncertain, ask rather than assume

CURRENT CONTEXT:
- Sathian is building personal AI infrastructure
- Key projects: sathian.ai website, Kai voice system, Bitcoin Bay involvement
- Key people: Kobhi (Auracle), Itika (Starknet DevRel), Leo/Alvin (Bitcoin Bay)
- Goals: Build leverage, systematize workflows, delegate effectively

When responding:
1. Acknowledge what you heard
2. Provide value immediately
3. If action needed, state what you'll do and ask for permission
4. Keep it tight - this is voice, not text`

export async function POST(request: NextRequest) {
  const startTime = Date.now()

  try {
    const formData = await request.formData()
    const audioFile = formData.get('audio') as File
    const historyJson = formData.get('history') as string
    const customContext = formData.get('context') as string

    if (!audioFile) {
      return NextResponse.json({ error: 'No audio file provided' }, { status: 400 })
    }

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
    const transcribeStart = Date.now()
    const arrayBuffer = await audioFile.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const file = new File([buffer], 'audio.webm', { type: audioFile.type })

    const transcription = await openai.audio.transcriptions.create({
      file,
      model: 'whisper-1',
      language: 'en',
    })
    const transcribeTime = Date.now() - transcribeStart

    const userText = transcription.text

    // 2. THINK - Get Claude's response
    const thinkStart = Date.now()
    const systemPrompt = customContext
      ? `${KAI_SYSTEM_PROMPT}\n\nADDITIONAL CONTEXT:\n${customContext}`
      : KAI_SYSTEM_PROMPT

    const messages = [
      ...history.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
      { role: 'user' as const, content: userText },
    ]

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 500, // Keep responses short for voice
      system: systemPrompt,
      messages,
    })

    const textContent = response.content.find(block => block.type === 'text')
    const assistantText = textContent ? textContent.text : "I didn't catch that. Could you repeat?"
    const thinkTime = Date.now() - thinkStart

    // 3. SPEAK - Convert response to audio
    const speakStart = Date.now()
    const audioStream = await elevenlabs.textToSpeech.convert(DEFAULT_VOICE_ID, {
      text: assistantText,
      modelId: 'eleven_turbo_v2_5',
      outputFormat: 'mp3_44100_128',
      voiceSettings: {
        stability: 0.5,
        similarityBoost: 0.75,
        style: 0.4,
        useSpeakerBoost: true,
      },
    })

    // Convert stream to buffer
    const reader = audioStream.getReader()
    const chunks: Uint8Array[] = []

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      if (value) chunks.push(value)
    }

    const audioBuffer = Buffer.concat(chunks)
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
    console.error('Conversation error:', error)
    return NextResponse.json(
      {
        error: 'Conversation failed',
        details: String(error),
      },
      { status: 500 }
    )
  }
}
