// Notification system - sends visitor messages to Telegram, Notion, and Email

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID
const NOTION_API_KEY = process.env.NOTION_API_KEY
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID

interface VisitorMessage {
  type: 'connect' | 'feedback' | 'number_suggestion' | 'resource' | 'subscribe' | 'general'
  message: string
  context?: string
  visitorInfo?: string
  page?: string
}

// Send to Telegram
async function sendTelegram(msg: VisitorMessage): Promise<boolean> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return false

  const typeEmoji: Record<string, string> = {
    connect: '\u{1F91D}',
    feedback: '\u{1F4AC}',
    number_suggestion: '\u{1F522}',
    resource: '\u{1F517}',
    subscribe: '\u{1F4E7}',
    general: '\u{1F4E8}',
  }

  const emoji = typeEmoji[msg.type] || '\u{1F514}'

  const text = `${emoji} *${msg.type.replace('_', ' ').toUpperCase()}*

*Message:* ${msg.message.slice(0, 500)}
${msg.page ? `*Page:* ${msg.page}` : ''}
${msg.visitorInfo ? `*Visitor:* ${msg.visitorInfo}` : ''}
${msg.context ? `*Context:* ${msg.context}` : ''}

_via sathian.ai_`

  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text,
        parse_mode: 'Markdown'
      })
    })
    return true
  } catch (e) {
    console.error('Telegram notification failed:', e)
    return false
  }
}

// Log to Notion (same conversations database, with special tag)
async function logToNotion(msg: VisitorMessage): Promise<boolean> {
  if (!NOTION_API_KEY || !NOTION_DATABASE_ID) return false

  try {
    await fetch('https://api.notion.com/v1/pages', {
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
            title: [{ text: { content: `[${msg.type.toUpperCase()}] ${msg.message.slice(0, 50)}` } }]
          },
          'First Message': {
            rich_text: [{ text: { content: msg.message.slice(0, 2000) } }]
          },
          Mode: {
            select: { name: msg.page || '/' }
          },
          Messages: {
            number: 0  // 0 indicates this is a direct request, not a conversation
          }
        }
      })
    })
    return true
  } catch (e) {
    console.error('Notion logging failed:', e)
    return false
  }
}

// Main notification function
export async function notifyVisitorMessage(msg: VisitorMessage): Promise<void> {
  // Fire all notifications in parallel, don't wait
  Promise.all([
    sendTelegram(msg),
    logToNotion(msg),
  ]).catch(e => console.error('Notification error:', e))
}

// Detect if a message indicates the visitor wants to connect/request something
export function detectConnectionIntent(message: string, page: string): VisitorMessage | null {
  const msgLower = message.toLowerCase()

  // Number suggestions for Cultural Atlas
  if (msgLower.includes('number') && (msgLower.includes('should') || msgLower.includes('add') || msgLower.includes('suggest') || msgLower.includes('what about')) ||
      msgLower.match(/\b(area code|dial|marker)\b/) && (msgLower.includes('story') || msgLower.includes('add'))) {
    return {
      type: 'number_suggestion',
      message,
      page,
      context: 'Suggested a number or story for the Cultural Atlas'
    }
  }

  // Resource / person recommendations
  if (msgLower.includes('check out') ||
      msgLower.includes('you should') && (msgLower.includes('follow') || msgLower.includes('read') || msgLower.includes('watch') || msgLower.includes('meet')) ||
      msgLower.includes('recommend') && !msgLower.includes('recommend me') ||
      msgLower.includes('interesting person') ||
      msgLower.includes('should connect with') ||
      msgLower.includes('know someone')) {
    return {
      type: 'resource',
      message,
      page,
      context: 'Shared a resource or person recommendation'
    }
  }

  // Subscribe intent
  if (msgLower.includes('subscribe') || msgLower.includes('newsletter') || msgLower.includes('updates') && msgLower.includes('get')) {
    return {
      type: 'subscribe',
      message,
      page,
      context: 'Wants to subscribe'
    }
  }

  // Connection/collaboration requests
  if (msgLower.includes('connect with sathian') ||
      msgLower.includes('reach sathian') ||
      msgLower.includes('contact') ||
      msgLower.includes('collaborate') ||
      msgLower.includes('work together') ||
      msgLower.includes('get in touch') ||
      msgLower.includes('hire') ||
      msgLower.includes('consult')) {
    return {
      type: 'connect',
      message,
      page,
      context: 'Wants to connect'
    }
  }

  // Feedback
  if (msgLower.includes('feedback') ||
      msgLower.includes('suggestion') ||
      msgLower.includes('bug') && (msgLower.includes('found') || msgLower.includes('report')) ||
      msgLower.includes('broken') ||
      msgLower.includes('doesn\'t work')) {
    return {
      type: 'feedback',
      message,
      page,
      context: 'Providing feedback'
    }
  }

  // Email/contact info shared
  const emailMatch = message.match(/[\w.-]+@[\w.-]+\.\w+/)
  if (emailMatch) {
    return {
      type: 'connect',
      message,
      visitorInfo: emailMatch[0],
      page,
      context: 'Shared email address'
    }
  }

  return null
}
