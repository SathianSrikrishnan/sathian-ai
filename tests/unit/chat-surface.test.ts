import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const readSource = (path: string) => readFileSync(new URL(`../../${path}`, import.meta.url), 'utf8')

describe('public chat surface', () => {
  it('has no Notion logging code path', () => {
    const route = readSource('src/app/api/chat/route.ts')
    const notifications = readSource('src/lib/notifications.ts')

    expect(route).not.toMatch(/notion/i)
    expect(notifications).not.toMatch(/notion/i)
  })

  it('discloses forwarding and warns visitors not to send secrets', () => {
    const widget = readSource('src/components/ChatWidget.tsx')

    expect(widget).toContain('Messages may be stored and forwarded to Sathian.')
    expect(widget).toContain('Please do not send secrets.')
  })

  it('sends prior history separately from the current message', () => {
    const route = readSource('src/app/api/chat/route.ts')
    const widget = readSource('src/components/ChatWidget.tsx')

    expect(route).toContain('buildModelMessages(history, message)')
    expect(widget).toMatch(/const history = messages\s*\.slice\(1\)/)
  })

  it('presents a general site agent rather than an automation-only Kai surface', () => {
    const widget = readSource('src/components/ChatWidget.tsx')
    const prompt = readSource('src/lib/prompts.ts')
    const constants = readSource('src/lib/constants.ts')

    expect(widget).toContain('Sathian’s site agent')
    expect(widget).toContain('I can answer from Sathian’s public projects and writing, or pass a note to him.')
    expect(widget).toContain('Ask a question or leave a note…')
    expect(prompt).toContain("You are Sathian's site agent")
    expect(prompt).not.toMatch(/You are Kai/i)
    expect(constants).toContain('What is Sathian building now?')
  })

  it('does not claim message delivery before a durable receipt exists', () => {
    const prompt = readSource('src/lib/prompts.ts')
    const memory = readSource('src/lib/memory.ts')

    expect(prompt).not.toContain('Sathian reads every piece of feedback')
    expect(prompt).not.toContain("I've flagged that for Sathian")
    expect(memory).not.toContain('every message gets forwarded directly to him')
  })
})
