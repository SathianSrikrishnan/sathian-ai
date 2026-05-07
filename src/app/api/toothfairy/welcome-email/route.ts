/**
 * POST /api/toothfairy/welcome-email
 *
 * Internal-only transactional email sent after a parent signs in.
 */
import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { requireToothFairyAdminRequest } from "@/lib/toothfairy/admin-guard"
import { renderWelcomeEmail, toothFairyEmailFrom } from "@/lib/toothfairy/email-templates"

export async function POST(request: NextRequest) {
  const unauthorized = requireToothFairyAdminRequest(request)
  if (unauthorized) return unauthorized

  try {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      console.warn("[welcome-email] RESEND_API_KEY not set, skipping email")
      return NextResponse.json({ success: true, skipped: true })
    }

    const { email, name } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 })
    }

    const resend = new Resend(apiKey)
    await resend.emails.send({
      from: toothFairyEmailFrom,
      to: email,
      subject: "Welcome to Tooth Fairy Network",
      html: renderWelcomeEmail({ name }),
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("[welcome-email] error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
