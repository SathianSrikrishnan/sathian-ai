import { NextRequest, NextResponse } from 'next/server'

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID
const NOTION_API_KEY = process.env.NOTION_API_KEY
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID

// Simple rate limit: 5 submissions per hour per IP
const RATE_LIMIT = 5
const RATE_WINDOW = 60 * 60 * 1000
const ipRequests = new Map<string, number[]>()

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const timestamps = (ipRequests.get(ip) || []).filter(t => now - t < RATE_WINDOW)
  if (timestamps.length >= RATE_LIMIT) return true
  timestamps.push(now)
  ipRequests.set(ip, timestamps)
  return false
}

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: 'Too many submissions' }, { status: 429 })
    }

    const { email } = await request.json()

    if (!email || typeof email !== 'string' || !email.includes('@') || email.length > 200) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    // Send Telegram notification (immediate visibility)
    if (TELEGRAM_BOT_TOKEN && TELEGRAM_CHAT_ID) {
      fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: `📧 *Waitlist Signup*\n\n${email}\n\n_via sathian.ai/toothfairy_`,
          parse_mode: 'Markdown'
        })
      }).catch(() => {})
    }

    // Log to Notion
    if (NOTION_API_KEY && NOTION_DATABASE_ID) {
      fetch('https://api.notion.com/v1/pages', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${NOTION_API_KEY}`,
          'Notion-Version': '2022-06-28',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          parent: { database_id: NOTION_DATABASE_ID },
          properties: {
            Title: {
              title: [{ text: { content: `[WAITLIST] ${email}` } }]
            },
            'First Message': {
              rich_text: [{ text: { content: email } }]
            },
            Mode: {
              select: { name: 'Standard' }
            },
            Messages: {
              number: 0
            }
          }
        })
      }).catch(() => {})
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Failed to process' }, { status: 500 })
  }
}
