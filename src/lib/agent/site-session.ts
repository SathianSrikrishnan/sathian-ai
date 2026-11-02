// Lightweight session receipt; shared by the doorway and the full chat.
// Loading chat on demand must not change the existing site-session contract.
export function ensureAgentSession(page: string | null) {
  const key = 'sathian-agent-session-id'
  let sessionId = sessionStorage.getItem(key)
  if (!sessionId) {
    sessionId = crypto.randomUUID()
    sessionStorage.setItem(key, sessionId)
    void fetch('/api/agent/event', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ event: 'site_session_started', sessionId, page, source: 'site' }), keepalive: true }).catch(() => undefined)
  }
  return sessionId
}
