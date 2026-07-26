import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const source = readFileSync(
  new URL('../../src/components/ChatWidget.tsx', import.meta.url),
  'utf8',
)

describe('site-agent contact and funnel surface', () => {
  it('offers optional reply fields and sends them through the existing intake request', () => {
    expect(source).toContain('Want a reply?')
    expect(source).toMatch(/name="displayName"/)
    expect(source).toMatch(/name="replyEmail"/)
    expect(source).toContain('displayName')
    expect(source).toContain('replyEmail')
    expect(source).toMatch(/type="email"/)
  })

  it('records content-free session and widget-view events without including message text', () => {
    expect(source).toContain("'/api/agent/event'")
    expect(source).toContain("event: 'site_session_started'")
    expect(source).toContain("event: 'agent_widget_viewed'")
    const eventCall = source.match(/fetch\('\/api\/agent\/event'[\s\S]{0,900}/)?.[0] ?? ''
    expect(eventCall).not.toContain('message: msg')
  })
})
