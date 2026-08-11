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
    expect(widget).toContain('Start with Tooth Fairy Network, the Solana learning dashboard, Sathian’s other public work, or leave him a note.')
    expect(widget).toContain('Ask a question…')
    expect(widget).toContain('Write your note to Sathian…')
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

  it('has a dedicated note composer instead of submitting the suggestion label', () => {
    const widget = readSource('src/components/ChatWidget.tsx')

    expect(widget).toContain("suggestion.action === 'compose_note'")
    expect(widget).toContain("intent: composerMode === 'note' ? 'note' : 'question'")
    expect(widget).toContain('Write your note to Sathian')
    expect(widget).not.toContain("handleSend('I want to leave Sathian a note')")
  })

  it('keeps same-site next actions inside the active preview deployment', () => {
    const widget = readSource('src/components/ChatWidget.tsx')

    expect(widget).toContain('isSafePublicHref(data.nextAction.href)')
    expect(widget).toContain("href.startsWith('/')")
  })

  it('renders one descriptive action instead of a row of identical source links', () => {
    const widget = readSource('src/components/ChatWidget.tsx')

    expect(widget).not.toContain('className="site-agent-sources"')
    expect(widget).not.toContain("{msg.sources.map")
    expect(widget).toContain('className="site-agent-next-action"')
  })

  it('keeps a six-turn session conversation with an explicit reset', () => {
    const widget = readSource('src/components/ChatWidget.tsx')

    expect(widget).toContain("const AGENT_CONVERSATION_SESSION_KEY = 'sathian-agent-conversation'")
    expect(widget).toContain('conversation: conversationRef.current')
    expect(widget).toContain('Start a new conversation')
    expect(widget).toContain('sessionStorage.removeItem(AGENT_CONVERSATION_SESSION_KEY)')
  })

  it('does not auto-focus the inline homepage input and pull mobile visitors past the introduction', () => {
    const widget = readSource('src/components/ChatWidget.tsx')

    expect(widget).toContain('if (open && !isHomepage && inputRef.current) inputRef.current.focus()')
  })

  it('labels every agent input and preserves a visible keyboard focus treatment', () => {
    const widget = readSource('src/components/ChatWidget.tsx')
    const styles = readSource('src/app/globals.css')

    expect(widget).toContain('aria-label="Your name (optional)"')
    expect(widget).toContain('aria-label="Reply email (optional)"')
    expect(widget).toContain("'Write your note to Sathian' : 'Ask a question'")
    expect(styles).toContain('.site-agent-panel input:focus-visible')
  })

  it('shows the machine-readable retry delay when a visitor is rate limited', () => {
    const widget = readSource('src/components/ChatWidget.tsx')

    expect(widget).toContain('data?.retryAfterSeconds')
    expect(widget).toContain('Try again in ${retryAfterSeconds} seconds.')
  })

  it('can attach a session-scoped signed tester token without persisting it in analytics', () => {
    const widget = readSource('src/components/ChatWidget.tsx')

    expect(widget).toContain("const AGENT_TEST_TOKEN_SESSION_KEY = 'sathian-agent-test-token'")
    expect(widget).toContain('sessionStorage.getItem(AGENT_TEST_TOKEN_SESSION_KEY)')
    expect(widget).toContain("'x-site-agent-test-token': agentTesterToken")
    expect(widget).not.toContain("trackSiteEvent('agent_test_token")
  })
})
