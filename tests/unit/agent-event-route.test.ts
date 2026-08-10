import { describe, expect, it, vi } from 'vitest'

import { createAgentEventHandler } from '@/lib/agent/event-handler'

function request(body: unknown, origin = 'https://sathian.ai') {
  return new Request('https://sathian.ai/api/agent/event', {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin },
    body: JSON.stringify(body),
  })
}

function loopbackRequest(body: unknown, origin: string) {
  return new Request('http://localhost:3017/api/agent/event', {
    method: 'POST',
    headers: { 'content-type': 'application/json', origin },
    body: JSON.stringify(body),
  })
}

describe('public agent funnel event route', () => {
  it('records only an allowlisted content-free session event', async () => {
    const recordEvent = vi.fn(async () => undefined)
    const handler = createAgentEventHandler({ recordEvent })

    const response = await handler(request({
      event: 'site_session_started',
      sessionId: '58d6cd80-547b-4ac2-962c-1ce2518e15fc',
      page: '/writings',
      source: 'site',
      message: 'private content must be ignored',
    }))

    expect(response.status).toBe(202)
    expect(recordEvent).toHaveBeenCalledWith({
      event: 'site_session_started',
      sessionId: '58d6cd80-547b-4ac2-962c-1ce2518e15fc',
      page: '/writings',
      source: 'site',
    })
    expect(JSON.stringify(recordEvent.mock.calls)).not.toContain('private content')
  })

  it.each(['agent_widget_viewed', 'site_session_started'])('accepts %s', async (event) => {
    const handler = createAgentEventHandler({ recordEvent: vi.fn(async () => undefined) })
    const response = await handler(request({
      event,
      sessionId: '58d6cd80-547b-4ac2-962c-1ce2518e15fc',
      page: '/',
      source: event === 'agent_widget_viewed' ? 'inline' : 'site',
    }))
    expect(response.status).toBe(202)
  })

  it('rejects arbitrary events, malformed sessions and cross-origin writes', async () => {
    const recordEvent = vi.fn(async () => undefined)
    const handler = createAgentEventHandler({ recordEvent })

    const arbitrary = await handler(request({ event: 'message_dump', sessionId: crypto.randomUUID(), page: '/' }))
    const badSession = await handler(request({ event: 'site_session_started', sessionId: 'visitor-1', page: '/' }))
    const crossOrigin = await handler(request({
      event: 'site_session_started',
      sessionId: crypto.randomUUID(),
      page: '/',
      source: 'site',
    }, 'https://attacker.example'))

    expect(arbitrary.status).toBe(400)
    expect(badSession.status).toBe(400)
    expect(crossOrigin.status).toBe(403)
    expect(recordEvent).not.toHaveBeenCalled()
  })

  it('fails closed when the event limiter is unavailable or exhausted', async () => {
    const recordEvent = vi.fn(async () => undefined)
    const handler = createAgentEventHandler({
      recordEvent,
      isRateLimited: vi.fn(async () => true),
    })
    const response = await handler(request({
      event: 'site_session_started',
      sessionId: crypto.randomUUID(),
      page: '/',
      source: 'site',
    }))
    expect(response.status).toBe(429)
    expect(recordEvent).not.toHaveBeenCalled()
  })

  it('treats equivalent loopback hosts on the same port as same-origin outside production', async () => {
    vi.stubEnv('NODE_ENV', 'development')
    const recordEvent = vi.fn(async () => undefined)
    const handler = createAgentEventHandler({ recordEvent })

    const response = await handler(loopbackRequest({
      event: 'agent_widget_viewed',
      sessionId: crypto.randomUUID(),
      page: '/',
      source: 'inline',
    }, 'http://127.0.0.1:3017'))

    expect(response.status).toBe(202)
    expect(recordEvent).toHaveBeenCalledOnce()
    vi.unstubAllEnvs()
  })
})
