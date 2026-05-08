import { mkdir, writeFile } from "fs/promises"
import path from "path"
import { NextRequest, NextResponse } from "next/server"
import { checkVoiceAuth } from "@/lib/voice-auth"
import {
  voiceoverChunks,
  type VoiceoverKind,
} from "@/remotion/colosseum/voiceover"

export const runtime = "nodejs"

const DEFAULT_MODEL = "eleven_turbo_v2_5"
const SCRATCH_VOICE_ID = "TxGEqnHWrfWFTfGW9XjX"

type GenerateBody = {
  kind?: VoiceoverKind
  voiceId?: string
  chunkIds?: string[]
  limit?: number
}

const isVoiceoverKind = (value: unknown): value is VoiceoverKind =>
  value === "pitch" || value === "technical"

export async function POST(request: NextRequest) {
  const authError = checkVoiceAuth(request)
  if (authError) return authError

  if (!process.env.ELEVENLABS_API_KEY) {
    return NextResponse.json(
      { error: "ELEVENLABS_API_KEY is not configured." },
      { status: 503 },
    )
  }

  let body: GenerateBody
  try {
    body = (await request.json()) as GenerateBody
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  const kind = isVoiceoverKind(body.kind) ? body.kind : "pitch"
  const voiceId =
    body.voiceId?.trim() ||
    process.env.TANDA_ELEVENLABS_VOICE_ID ||
    process.env.ELEVENLABS_VOICE_ID ||
    SCRATCH_VOICE_ID

  const requestedIds = new Set(body.chunkIds || [])
  const limit = Math.max(1, Math.min(12, Number(body.limit || 12)))
  const chunks = voiceoverChunks[kind]
    .filter((chunk) => requestedIds.size === 0 || requestedIds.has(chunk.id))
    .slice(0, limit)

  const outputDir = path.join(
    process.cwd(),
    "public",
    "colosseum-frontier-2026",
    "audio",
    "elevenlabs",
  )
  await mkdir(outputDir, { recursive: true })

  const generated: Array<{
    id: string
    filename: string
    publicPath: string
    bytes: number
  }> = []

  for (const chunk of chunks) {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": process.env.ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text: chunk.text,
          model_id: DEFAULT_MODEL,
          voice_settings: {
            stability: chunk.speaker === "tanda" ? 0.58 : 0.5,
            similarity_boost: 0.78,
            style: chunk.speaker === "tanda" ? 0.42 : 0.25,
            use_speaker_boost: true,
          },
        }),
      },
    )

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json(
        {
          error: "ElevenLabs generation failed.",
          chunkId: chunk.id,
          status: response.status,
          detail: errorText,
        },
        { status: 502 },
      )
    }

    const buffer = Buffer.from(await response.arrayBuffer())
    const filename = chunk.filename.endsWith(".mp3")
      ? chunk.filename
      : chunk.filename.replace(/\.[^.]+$/, ".mp3")
    const filePath = path.join(outputDir, filename)
    await writeFile(filePath, buffer)
    generated.push({
      id: chunk.id,
      filename,
      publicPath: `/colosseum-frontier-2026/audio/elevenlabs/${filename}`,
      bytes: buffer.length,
    })
  }

  return NextResponse.json({
    ok: true,
    kind,
    count: generated.length,
    generated,
  })
}
