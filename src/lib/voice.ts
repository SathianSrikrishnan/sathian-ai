// Voice utilities for Kai voice assistant
import OpenAI from 'openai'
import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js'
import Anthropic from '@anthropic-ai/sdk'

// Initialize clients
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
})

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// Default voice ID - can be customized
const DEFAULT_VOICE_ID = 'pNInz6obpgDQGcFmaJgB' // Adam - clear male voice

export interface TranscriptionResult {
  text: string
  duration: number
}

export interface KaiResponse {
  text: string
  audioBuffer?: Buffer
}

/**
 * Transcribe audio using OpenAI Whisper
 */
export async function transcribeAudio(audioBuffer: Buffer): Promise<TranscriptionResult> {
  const startTime = Date.now()

  // Create a File object from buffer
  const file = new File([new Uint8Array(audioBuffer)], 'audio.webm', { type: 'audio/webm' })

  const transcription = await openai.audio.transcriptions.create({
    file,
    model: 'whisper-1',
    language: 'en',
  })

  return {
    text: transcription.text,
    duration: Date.now() - startTime,
  }
}

/**
 * Get response from Claude with Kai context
 */
export async function getKaiResponse(
  userMessage: string,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>,
  systemContext: string
): Promise<string> {
  const messages = [
    ...conversationHistory.map(msg => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    })),
    { role: 'user' as const, content: userMessage },
  ]

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: systemContext,
    messages,
  })

  const textContent = response.content.find(block => block.type === 'text')
  return textContent ? textContent.text : ''
}

/**
 * Convert text to speech using ElevenLabs
 */
export async function textToSpeech(
  text: string,
  voiceId: string = DEFAULT_VOICE_ID
): Promise<Buffer> {
  const audioStream = await elevenlabs.textToSpeech.convert(voiceId, {
    text,
    modelId: 'eleven_turbo_v2_5',
    outputFormat: 'mp3_44100_128',
  })

  // Collect stream into buffer
  const reader = audioStream.getReader()
  const chunks: Buffer[] = []

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    if (value) chunks.push(Buffer.from(value))
  }

  return Buffer.concat(chunks)
}

/**
 * Full voice conversation turn
 */
export async function processVoiceTurn(
  audioBuffer: Buffer,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>,
  systemContext: string,
  voiceId?: string
): Promise<KaiResponse> {
  // 1. Transcribe user speech
  const { text: userText } = await transcribeAudio(audioBuffer)

  // 2. Get Kai's response
  const responseText = await getKaiResponse(userText, conversationHistory, systemContext)

  // 3. Convert to speech
  const audioBuffer2 = await textToSpeech(responseText, voiceId)

  return {
    text: responseText,
    audioBuffer: audioBuffer2,
  }
}
