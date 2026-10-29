// The site agent is loaded after first paint (see DeferredChatWidget). An
// `open-chat` event fired before ChatWidget registers its listener is held
// here and replayed once the widget mounts, so early clicks are not lost.

type PendingDetail = { message?: string; source?: string } | undefined

let listening = false
let pending: { detail: PendingDetail } | null = null

export function setAgentListening(value: boolean) {
  listening = value
}

export function isAgentListening() {
  return listening
}

export function holdPendingAgentOpen(detail: PendingDetail) {
  pending = { detail }
}

export function takePendingAgentOpen() {
  const held = pending
  pending = null
  return held
}
