import { NextRequest } from 'next/server'

import { createRouteSupabase } from '@/lib/supabase-auth'

export async function getStudioOperatorId(request: NextRequest) {
  const { supabase } = createRouteSupabase(request)
  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) throw new Error('Studio operator session is unavailable')
  return data.user.id
}
