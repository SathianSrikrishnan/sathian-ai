// Lightweight session receipt; shared by the doorway and the full chat.
// Loading chat on demand must not change the existing site-session contract.
export function ensureAgentSession(page: string | null) {
  const key = 'sathian-agent-session-id'
  let sessionId = sessionStorage.getItem(key)
  if (!sessionId) {
    sessionId = crypto.randomUUID()
    sessionStorage.setItem(key, sessionId)
    void fetch('/api/agent/event', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ event: 'site_session_started', sessionId, page, source: 'site' }), keepalive: true })
      // Consume the small receipt so Chromium can finish the request. An unread
      // keepalive response otherwise remains pending in navigation diagnostics.
      .then(response => response.arrayBuffer())
      .catch(() => undefined)
  }
  return sessionId
}
