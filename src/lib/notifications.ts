// Notification system - sends visitor messages to Telegram, Notion, and Email

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID
const NOTION_API_KEY = process.env.NOTION_API_KEY
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID

interface VisitorMessage {
  type: 'connect' | 'feedback' | 'story_request' | 'general'
  message: string
  context?: string
  visitorInfo?: string
}

// Send to Telegram
async function sendTelegram(msg: VisitorMessage): Promise<boolean> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return false

  const text = `🔔 *New Visitor Message*

*Type:* ${msg.type}
*Message:* ${msg.message}
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
            select: { name: 'Standard' }
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

// Send email notification
async function sendEmail(msg: VisitorMessage): Promise<boolean> {
  // Using a simple email service - for now we'll use a webhook approach
  // In production, integrate with SendGrid, Resend, or similar

  // For MVP, we'll rely on Telegram + Notion
  // Email can be added when you set up a mail service
  console.log('Email notification (not yet configured):', msg)
  return true
}

// Main notification function
export async function notifyVisitorMessage(msg: VisitorMessage): Promise<void> {
  // Fire all notifications in parallel, don't wait
  Promise.all([
    sendTelegram(msg),
    logToNotion(msg),
    sendEmail(msg)
  ]).catch(e => console.error('Notification error:', e))
}

// Detect if a message indicates the visitor wants to connect/request something
export function detectConnectionIntent(message: string): VisitorMessage | null {
  const msgLower = message.toLowerCase()

  // Story access requests
  if (msgLower.includes('see the stories') ||
      msgLower.includes('access to stories') ||
      msgLower.includes('storybook') && (msgLower.includes('access') || msgLower.includes('see'))) {
    return {
      type: 'story_request',
      message: message,
      context: 'Requested access to Storybook Universe'
    }
  }

  // Connection/collaboration requests
  if (msgLower.includes('connect with sathian') ||
      msgLower.includes('reach sathian') ||
      msgLower.includes('contact') ||
      msgLower.includes('collaborate') ||
      msgLower.includes('work together') ||
      msgLower.includes('get in touch')) {
    return {
      type: 'connect',
      message: message,
      context: 'Wants to connect'
    }
  }

  // Feedback
  if (msgLower.includes('feedback') ||
      msgLower.includes('suggestion')) {
    return {
      type: 'feedback',
      message: message,
      context: 'Providing feedback'
    }
  }

  // Email/contact info shared
  const emailMatch = message.match(/[\w.-]+@[\w.-]+\.\w+/)
  if (emailMatch) {
    return {
      type: 'connect',
      message: message,
      visitorInfo: emailMatch[0],
      context: 'Shared email address'
    }
  }

  return null
}
