/**
 * POST /api/toothfairy/deposit-email
 *
 * Internal-only transactional email sent after a successful Smile Fund gift.
 */
import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { createClient } from "@supabase/supabase-js"
import { requireToothFairyAdminRequest } from "@/lib/toothfairy/admin-guard"
import { renderGiftReceivedEmail, toothFairyEmailFrom } from "@/lib/toothfairy/email-templates"

export async function POST(request: NextRequest) {
  const unauthorized = requireToothFairyAdminRequest(request)
  if (unauthorized) return unauthorized

  try {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      console.warn("[deposit-email] RESEND_API_KEY not set, skipping email")
      return NextResponse.json({ success: true, skipped: true })
    }

    const body = await request.json()
    let { email, childName } = body as { email?: string; childName?: string }
    const {
      childProfilePda,
      depositorName,
      amountSol,
      feeSol,
      netSol,
      lockChoice,
      txSignature,
    } = body

    if (
      !email &&
      childProfilePda &&
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY
    ) {
      try {
        const admin = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.SUPABASE_SERVICE_ROLE_KEY,
        )
        const { data } = await admin
          .from("tfn_children")
          .select("user_email, child_name")
          .eq("child_profile_pda", childProfilePda)
          .maybeSingle()

        if (data?.user_email) email = data.user_email
        if (!childName && data?.child_name) childName = data.child_name
      } catch (lookupErr) {
        console.error("[deposit-email] guardian lookup failed:", lookupErr)
      }
    }

    if (!email) {
      return NextResponse.json(
        { error: "Email required (not passed, not resolvable)" },
        { status: 400 },
      )
    }

    const kidName = childName || "your child"
    const lockLabel =
      lockChoice === "now" || lockChoice === "immediate"
        ? "Available now"
        : lockChoice === "ageTen" || lockChoice === "ten"
          ? `Held until ${kidName} turns 10`
          : `Held until ${lockChoice || "the selected milestone"}`
    const solscanUrl = txSignature ? `https://solscan.io/tx/${txSignature}` : null

    const resend = new Resend(apiKey)
    await resend.emails.send({
      from: toothFairyEmailFrom,
      to: email,
      subject: `${kidName} received a Smile Fund gift`,
      html: renderGiftReceivedEmail({
        childName: kidName,
        giver: depositorName,
        amountSol,
        feeSol,
        netSol,
        lockLabel,
        solscanUrl,
      }),
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("[deposit-email] Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
