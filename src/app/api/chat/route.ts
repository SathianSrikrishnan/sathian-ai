import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { getMemoryContext } from '@/lib/memory'
import { buildSystemPrompt } from '@/lib/prompts'
import { detectConnectionIntent, notifyVisitorMessage } from '@/lib/notifications'
import { buildModelMessages } from '@/lib/chat-history'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// --- Rate Limiting ---
const RATE_LIMIT = 30 // messages per hour per IP
const RATE_WINDOW = 60 * 60 * 1000 // 1 hour in ms
const ipRequests = new Map<string, number[]>()
let cleanupCounter = 0

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const timestamps = ipRequests.get(ip) || []

  // Remove timestamps older than the window
  const recent = timestamps.filter(t => now - t < RATE_WINDOW)
  ipRequests.set(ip, recent)

  // Cleanup stale IPs every 100 requests
  cleanupCounter++
  if (cleanupCounter >= 100) {
    cleanupCounter = 0
    for (const [key, times] of Array.from(ipRequests.entries())) {
      const valid = times.filter(t => now - t < RATE_WINDOW)
      if (valid.length === 0) ipRequests.delete(key)
      else ipRequests.set(key, valid)
    }
  }

  if (recent.length >= RATE_LIMIT) return true

  recent.push(now)
  ipRequests.set(ip, recent)
  return false
}

import { ALLOWED_ORIGINS } from '@/lib/constants'

function corsHeaders(origin: string | null) {
  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin
  }
  return headers
}

export async function OPTIONS(request: NextRequest) {
  const origin = request.headers.get('origin')
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) })
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin')
  try {
    // Rate limiting
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "You've been chatting a lot! Give me a moment to catch up. Try again in a few minutes." },
        { status: 429, headers: corsHeaders(origin) }
      )
    }

    const { message, page, history } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400, headers: corsHeaders(origin) })
    }

    // Input validation — cap message length to prevent token abuse
    if (typeof message !== 'string' || message.length > 2000) {
      return NextResponse.json({ error: 'Message too long (max 2000 characters)' }, { status: 400, headers: corsHeaders(origin) })
    }

    // Get relevant context from local memory
    const memoryContext = await getMemoryContext(message)

    // Build system prompt with page context
    const systemPrompt = buildSystemPrompt(page || '/', memoryContext)

    const messages = buildModelMessages(history, message)

    // Call Claude API
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 400,
      system: systemPrompt,
      messages,
    })

    // Extract text response
    const textContent = response.content.find((c) => c.type === 'text')
    const responseText = textContent ? textContent.text : 'I apologize, but I could not generate a response.'

    // Check if visitor wants to connect/request something - notify Sathian
    const connectionIntent = detectConnectionIntent(message, page || '/')
    if (connectionIntent) {
      notifyVisitorMessage(connectionIntent)
    }

    return NextResponse.json({
      message: responseText,
    }, { headers: corsHeaders(origin) })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500, headers: corsHeaders(origin) }
    )
  }
}
