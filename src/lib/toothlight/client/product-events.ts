export const allowedToothlightClientEvents = [
  'make_viewed',
  'make_step_viewed',
  'source_added',
  'drawing_opened',
  'treatment_selected',
  'story_completed',
  'save_clicked',
  'save_succeeded',
  'auth_started',
  'auth_returned',
] as const

export type ToothlightClientEventName = (typeof allowedToothlightClientEvents)[number]

export function logToothlightClientEvent(
  eventName: ToothlightClientEventName,
  properties: Record<string, unknown> = {},
) {
  if (typeof window === 'undefined') return

  try {
    void fetch('/api/toothlight/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventName, properties }),
      keepalive: true,
    })
  } catch {
    // Funnel logging should never block making or saving a Toothlight.
  }
}
