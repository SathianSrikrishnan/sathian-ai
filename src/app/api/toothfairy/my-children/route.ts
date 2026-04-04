/**
 * GET /api/toothfairy/my-children
 *
 * Returns all children belonging to the authenticated user.
 * Used by the dashboard to show the parent's children.
 */
import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { createServerClient } from "@supabase/ssr"

async function getAuthUser(request: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll() {},
      },
    }
  )
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function GET(request: NextRequest) {
  const user = await getAuthUser(request)
  if (!user) {
    return NextResponse.json({ children: [] })
  }

  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )

    const { data, error } = await supabaseAdmin
      .from("tfn_children")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: true })

    if (error) {
      return NextResponse.json({ children: [], error: error.message })
    }

    return NextResponse.json({
      children: (data || []).map((c: any) => ({
        child_name: c.child_name,
        child_slug: c.child_slug,
        child_profile_pda: c.child_profile_pda,
        guardian_pubkey: c.guardian_pubkey,
        smile_photo_url: c.smile_photo_url || null,
        birthday: c.birthday,
        is_server_guardian: c.is_server_guardian,
      })),
    })
  } catch (err: any) {
    return NextResponse.json({ children: [], error: err.message })
  }
}
