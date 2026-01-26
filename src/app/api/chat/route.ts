import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { getMemoryContext } from '@/lib/memory'
import { buildSystemPrompt } from '@/lib/prompts'
import { detectConnectionIntent, notifyVisitorMessage } from '@/lib/notifications'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

// Log conversation to Notion (fire and forget)
async function logToNotion(firstMessage: string, mode: string, messageCount: number) {
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
            select: { name: mode === 'kids' ? 'Kids' : 'Standard' }
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

export async function POST(request: NextRequest) {
  try {
    const { message, mode, history } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // Get relevant context from local memory
    const memoryContext = await getMemoryContext(message)

    // Build system prompt with mode and context
    const systemPrompt = buildSystemPrompt(mode, memoryContext)

    // Build conversation history
    const messages = [
      ...(history || []).map((msg: { role: string; content: string }) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
      { role: 'user' as const, content: message },
    ]

    // Call Claude API
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages,
    })

    // Extract text response
    const textContent = response.content.find((c) => c.type === 'text')
    const responseText = textContent ? textContent.text : 'I apologize, but I could not generate a response.'

    // Log first message of new conversations to Notion (fire and forget)
    if (!history || history.length === 0) {
      logToNotion(message, mode, 1)
    }

    // Check if visitor wants to connect/request something - notify Sathian
    const connectionIntent = detectConnectionIntent(message)
    if (connectionIntent) {
      notifyVisitorMessage(connectionIntent)
    }

    return NextResponse.json({
      message: responseText,
      memoryUsed: memoryContext.sources,
    })

  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Failed to process message' },
      { status: 500 }
    )
  }
}
