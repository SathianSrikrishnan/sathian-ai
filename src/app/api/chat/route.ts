import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { getMemoryContext } from '@/lib/memory'
import { buildSystemPrompt } from '@/lib/prompts'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

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
