import { describe, expect, it } from 'vitest'

import { CHAT_SUGGESTIONS } from '@/lib/constants'

describe('site-agent suggestion actions', () => {
  const suggestions = CHAT_SUGGESTIONS as readonly unknown[]

  it('treats the latest-release suggestion as a question submission', () => {
    const latestRelease = suggestions.find((suggestion) =>
      typeof suggestion === 'object'
      && suggestion !== null
      && 'id' in suggestion
      && suggestion.id === 'latest-release')

    expect(latestRelease).toEqual({
      id: 'latest-release',
      label: 'Show me the latest release',
      action: 'submit_question',
      message: 'Show me the latest release',
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
