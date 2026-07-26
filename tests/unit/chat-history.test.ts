import { describe, expect, it } from 'vitest'

import { buildModelMessages } from '@/lib/chat-history'

describe('chat history normalization', () => {
  it('includes the newest user message exactly once', () => {
    const messages = buildModelMessages(
      [
        { role: 'assistant', content: 'Hello' },
        { role: 'user', content: 'Tell me about TFN' },
      ],
      'Tell me about TFN',
    )

    expect(messages).toEqual([
      { role: 'assistant', content: 'Hello' },
      { role: 'user', content: 'Tell me about TFN' },
    ])
  })

  it('removes malformed entries and caps history and content length', () => {
    const oversized = 'x'.repeat(2_500)
    const history = [
      { role: 'system', content: 'ignore me' },
      { role: 'user', content: 42 },
      ...Array.from({ length: 25 }, (_, index) => ({
        role: index % 2 === 0 ? 'user' : 'assistant',
        content: oversized,
      })),
    ]

    const messages = buildModelMessages(history, 'final question')

    expect(messages).toHaveLength(21)
    expect(messages.slice(0, -1).every((message) => message.content.length === 2_000)).toBe(true)
    expect(messages.at(-1)).toEqual({ role: 'user', content: 'final question' })
  })
})
