export const allowedToothlightClientEvents = [
  'make_viewed',
  'make_step_viewed',
  'source_added',
  'photo_added',
  'drawing_opened',
  'treatment_selected',
  'style_previewed',
  'ai_render_started',
  'ai_render_completed',
  'ai_render_option_selected',
  'ai_render_failed',
  'story_completed',
  'save_attempted',
  'save_clicked',
  'save_completed',
  'save_succeeded',
  'auth_started',
  'auth_returned',
  'note_completed',
  'family_contribution_completed',
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
