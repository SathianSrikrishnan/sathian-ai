import { buildToothlightAnalyticsProperties } from '@/lib/toothlight/client/product-analytics'

export const allowedToothlightClientEvents = [
  'landing_view',
  'cta_click',
  'landing_cta_click',
  'certificate_started',
  'certificate_generated',
  'email_submitted',
  'certificate_downloaded',
  'capsule_started',
  'capsule_mission_selected',
  'parent_gate_completed',
  'tooth_photo_added',
  'tooth_story_added',
  'child_mode_started',
  'capsule_style_selected',
  'child_prompt_answered',
  'capsule_created',
  'capsule_sealed',
  'capsule_saved',
  'unlock_date_set',
  'share_clicked',
  'family_note_started',
  'family_invite_clicked',
  'upgrade_viewed',
  'checkout_started',
  'purchase_completed',
  'solana_option_viewed',
  'wallet_connect_clicked',
  'mint_started',
  'mint_completed',
  'start_flow',
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
  'google_parent_auth',
  'note_completed',
  'parent_note_saved',
  'toothlight_sealed',
  'invite_clicked',
  'learn_clicked',
  'family_contribution_completed',
] as const

export type ToothlightClientEventName = (typeof allowedToothlightClientEvents)[number]

export function logToothlightClientEvent(
  eventName: ToothlightClientEventName,
  properties: Record<string, unknown> = {},
) {
  if (typeof window === 'undefined') return

  try {
    const enrichedProperties = buildToothlightAnalyticsProperties(properties)

    void fetch('/api/toothlight/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventName, properties: enrichedProperties }),
      keepalive: true,
    })
  } catch {
    // Funnel logging should never block making or saving a Toothlight.
  }
}
