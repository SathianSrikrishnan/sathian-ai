import { describe, expect, it } from 'vitest'

import { CHAT_SUGGESTIONS } from '@/lib/constants'

describe('site-agent suggestion actions', () => {
  const suggestions = CHAT_SUGGESTIONS as readonly unknown[]

  it('treats the gift suggestion as a question submission', () => {
    const giveGift = suggestions.find((suggestion) =>
      typeof suggestion === 'object'
      && suggestion !== null
      && 'id' in suggestion
      && suggestion.id === 'give-gift')

    expect(giveGift).toEqual({
      id: 'give-gift',
      label: 'Give a child their first wallet',
      action: 'submit_question',
      message: 'How do I give a child their first digital wallet?',
    })
  })

  it('opens note composition without submitting the suggestion text', () => {
    const leaveNote = suggestions.find((suggestion) =>
      typeof suggestion === 'object'
      && suggestion !== null
      && 'id' in suggestion
      && suggestion.id === 'leave-note')

    expect(leaveNote).toEqual({
      id: 'leave-note',
      label: 'I want to leave Sathian a note',
      action: 'compose_note',
    })
    expect(leaveNote).not.toHaveProperty('message')
  })
})
