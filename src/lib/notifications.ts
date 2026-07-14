// Notification system - sends actionable visitor messages to Telegram.

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID

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

// Main notification function
export async function notifyVisitorMessage(msg: VisitorMessage): Promise<void> {
  void sendTelegram(msg)
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

  // Parent interest in Tooth Fairy
  if ((msgLower.includes('parent') || msgLower.includes('my kid') || msgLower.includes('my child') || msgLower.includes('my son') || msgLower.includes('my daughter') || msgLower.includes('my family')) &&
      (msgLower.includes('interest') || msgLower.includes('love') || msgLower.includes('want') || msgLower.includes('sign up') || msgLower.includes('try') || msgLower.includes('meaningful'))) {
    return {
      type: 'feedback',
      message,
      page,
      context: 'Parent expressing interest in Tooth Fairy Network'
    }
  }

  // Explicit "pass a message to Sathian" intent
  if (msgLower.includes('tell sathian') ||
      msgLower.includes('tell him') ||
      msgLower.includes('let him know') ||
      msgLower.includes('pass along') ||
      msgLower.includes('pass this') ||
      msgLower.includes('message for sathian') ||
      msgLower.includes('leave a message')) {
    return {
      type: 'general',
      message,
      page,
      context: 'Visitor left a message for Sathian'
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
