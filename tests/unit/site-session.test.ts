import { afterEach, expect, it, vi } from 'vitest'
import { ensureAgentSession } from '../../src/lib/agent/site-session'

afterEach(() => vi.unstubAllGlobals())
function setup() {
  const storage = new Map<string, string>()
  vi.stubGlobal('sessionStorage', { getItem: (key: string) => storage.get(key) ?? null, setItem: (key: string, value: string) => storage.set(key, value) })
  const arrayBuffer = vi.fn().mockResolvedValue(new ArrayBuffer(0))
  const fetch = vi.fn().mockResolvedValue({ arrayBuffer })
  vi.stubGlobal('fetch', fetch)
  return { arrayBuffer, fetch }
}
it('finishes the receipt response while preserving the exact session event contract', async () => {
  const { fetch, arrayBuffer } = setup()
  const sessionId = ensureAgentSession('/village')
  await vi.waitFor(() => expect(arrayBuffer).toHaveBeenCalledOnce())
  expect(fetch).toHaveBeenCalledWith('/api/agent/event', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, keepalive: true,
    body: JSON.stringify({ event: 'site_session_started', sessionId, page: '/village', source: 'site' }),
  })
})
it('reuses the same session without sending a second event', async () => {
  const { fetch, arrayBuffer } = setup()
  expect(ensureAgentSession('/')).toBe(ensureAgentSession('/village'))
  await vi.waitFor(() => expect(arrayBuffer).toHaveBeenCalledOnce())
  expect(fetch).toHaveBeenCalledOnce()
})
it('keeps navigation usable if the receipt response fails', async () => {
  const { arrayBuffer } = setup()
  arrayBuffer.mockRejectedValueOnce(new Error('connection closed'))
  expect(ensureAgentSession('/')).toMatch(/^[0-9a-f-]{36}$/)
  await vi.waitFor(() => expect(arrayBuffer).toHaveBeenCalledOnce())
})
