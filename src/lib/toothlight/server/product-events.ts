import { createClient } from '@supabase/supabase-js'

type ProductEventInput = {
  userId?: string | null
  toothlightId?: string | null
  eventName: string
  properties?: Record<string, unknown>
}

export async function logToothlightProductEvent({
  userId,
  toothlightId,
  eventName,
  properties = {},
}: ProductEventInput) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) return null

  try {
    const supabase = createClient(url, key)
    await supabase.from('tfn_product_events').insert({
      user_id: userId ?? null,
      toothlight_id: toothlightId ?? null,
      event_name: eventName,
      properties,
    })
  } catch {
    return null
  }

  return null
}
