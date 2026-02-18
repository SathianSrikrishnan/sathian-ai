import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { getMemoryContext } from '@/lib/memory'
import { buildSystemPrompt } from '@/lib/prompts'
import { detectConnectionIntent, notifyVisitorMessage } from '@/lib/notifications'

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

// Log conversation to Notion (fire and forget)
async function logToNotion(firstMessage: string, page: string, messageCount: number) {
  const notionKey = process.env.NOTION_API_KEY
  const databaseId = process.env.NOTION_DATABASE_ID

  if (!notionKey || !databaseId) return

  try {
    await fetch('https://api.notion.com/v1/pages', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${notionKey}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        parent: { database_id: databaseId },
        properties: {
          Title: {
            title: [{ text: { content: new Date().toISOString().split('T')[0] + ' - ' + firstMessage.slice(0, 50) } }]
          },
          'First Message': {
            rich_text: [{ text: { content: firstMessage.slice(0, 2000) } }]
          },
          Mode: {
            select: { name: page || '/' }
          },
          Messages: {
            number: messageCount
          }
        }
      })
    })
  } catch (e) {
    // Silently fail - don't break chat for logging issues
    console.error('Notion logging failed:', e)
  }
}

// CORS headers for cross-origin chat widget
const ALLOWED_ORIGINS = ['https://btc.sathian.ai', 'https://sathian.ai', 'https://toothfairy.sathian.ai']

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

    // Validate and sanitize conversation history
    const rawHistory = Array.isArray(history) ? history.slice(-20) : []
    const validatedHistory = rawHistory
      .filter((msg: { role: string; content: string }) =>
        msg &&
        typeof msg.content === 'string' &&
        (msg.role === 'user' || msg.role === 'assistant')
      )
      .map((msg: { role: string; content: string }) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content.slice(0, 2000),
      }))

    const messages = [
      ...validatedHistory,
      { role: 'user' as const, content: message },
    ]

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

    // Log first message of new conversations to Notion (fire and forget)
    if (!history || history.length === 0) {
      logToNotion(message, page || '/', 1)
    }

    // Check if visitor wants to connect/request something - notify Sathian
    const connectionIntent = detectConnectionIntent(message, page || '/')
    if (connectionIntent) {
      notifyVisitorMessage(connectionIntent)
    }

    return NextResponse.json({
      message: responseText,
      memoryUsed: memoryContext.sources,
    }, { headers: corsHeaders(origin) })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500, headers: corsHeaders(origin) }
    )
  }
}
