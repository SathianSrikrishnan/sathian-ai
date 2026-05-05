/**
 * GET /api/toothfairy/child-lookup?slug=daniel-the-tiger
 *
 * Returns child info from Supabase, including the original guardian pubkey.
 * Used by the profile page to find the correct on-chain PDA.
 */
import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug")
  if (!slug) {
    return NextResponse.json({ error: "slug required" }, { status: 400 })
  }

  try {
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )

    // Try with smile_photo_url, fall back without it
    let data: any = null
    const { data: d1, error: e1 } = await supabaseAdmin
      .from("tfn_children")
      .select("*")
      .eq("child_slug", slug)
      .order("created_at", { ascending: false })
      .limit(1)
      .single()

    if (!e1 && d1) {
      data = d1
    } else {
      return NextResponse.json({ found: false })
    }

    return NextResponse.json({
      found: true,
      guardianPubkey: data.guardian_pubkey,
      childWalletPubkey: data.child_wallet_pubkey,
      childProfilePda: data.child_profile_pda,
      isServerGuardian: data.is_server_guardian,
      userWalletPubkey: data.user_wallet_pubkey,
      childName: data.child_name,
      smilePhotoUrl: data.smile_photo_url || null,
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
