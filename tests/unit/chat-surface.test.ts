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

    expect(widget).toContain('By sending, you agree this message may be stored and forwarded to Sathian.')
    expect(widget).toContain('Please do not send secrets.')
  })

  it('retires the legacy direct-model endpoint in favor of the bounded agent route', () => {
    const route = readSource('src/app/api/chat/route.ts')

    expect(route).toMatch(/status:\s*410/)
    expect(route).toContain('/api/agent/message')
    expect(route).not.toMatch(/Anthropic|notifyVisitorMessage|anthropic\.messages\.create/)
  })

  it('presents a general site agent rather than an automation-only Kai surface', () => {
    const widget = readSource('src/components/ChatWidget.tsx')
    const prompt = readSource('src/lib/prompts.ts')
    const constants = readSource('src/lib/constants.ts')

    expect(widget).toContain('Sathian’s site agent')
    expect(widget).toContain('Ask about Sathian’s reviewed public projects, writing, or current work. You can also leave him a note.')
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

  it('uses the bounded agent endpoint with consent, idempotency, and public receipts', () => {
    const widget = readSource('src/components/ChatWidget.tsx')

    expect(widget).toContain("fetch('/api/agent/message'")
    expect(widget).toContain("'Idempotency-Key': idempotencyKey")
    expect(widget).toContain('consent: true')
    expect(widget).toContain('data.receipt')
    expect(widget).toContain('By sending, you agree this message may be stored and forwarded to Sathian.')
  })
})
