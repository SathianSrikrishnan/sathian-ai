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
})
