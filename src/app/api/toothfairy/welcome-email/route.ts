/**
 * POST /api/toothfairy/welcome-email
 *
 * Sends a welcome email via Resend when a user signs up.
 * Called from the auth callback (fire-and-forget).
 *
 * Impeccable template: cream + gold + Alegreya. Tanda speaks.
 */
import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { requireToothFairyAdminRequest } from "@/lib/toothfairy/admin-guard"

const SITE = "https://toothfairy.network"

export async function POST(request: NextRequest) {
  const unauthorized = requireToothFairyAdminRequest(request)
  if (unauthorized) return unauthorized

  try {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      console.warn("[welcome-email] RESEND_API_KEY not set, skipping email")
      return NextResponse.json({ success: true, skipped: true })
    }
    const resend = new Resend(apiKey)

    const { email, name } = await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 })
    }

    const firstName = name?.split(" ")[0] || "there"

    await resend.emails.send({
      from: "Tooth Fairy Network <noreply@toothfairy.network>",
      to: email,
      subject: "Welcome — Tanda's expecting you",
      html: renderWelcome({ firstName }),
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Welcome email error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

function renderWelcome({ firstName }: { firstName: string }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Welcome to the Tooth Fairy Network</title>
</head>
<body style="margin:0;padding:0;background:#F6F2E8;font-family:'Alegreya Sans',Helvetica,Arial,sans-serif;color:#3D2F22;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F6F2E8;padding:32px 16px;">
  <tr><td align="center">
    <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;background:#FBF7EE;border-radius:18px;overflow:hidden;box-shadow:0 12px 40px rgba(61,47,34,0.08);">
      <tr><td style="padding:36px 36px 12px;">
        <p style="margin:0;font-size:11px;letter-spacing:0.28em;text-transform:uppercase;color:#B8903A;font-weight:600;">Tooth Fairy Network</p>
      </td></tr>
      <tr><td align="center" style="padding:16px 36px 8px;">
        <img src="${SITE}/story-assets/characters/char-tooth-fairy.jpg" alt="Tanda" width="120" height="120" style="width:120px;height:120px;object-fit:cover;border-radius:50%;border:3px solid #C99A3A;box-shadow:0 6px 28px rgba(201,154,58,0.3);display:block;">
      </td></tr>
      <tr><td style="padding:24px 36px 8px;">
        <h1 style="margin:0;font-family:'Alegreya',Georgia,serif;font-size:32px;line-height:1.15;color:#3D2F22;font-weight:700;text-align:center;">
          Welcome, ${firstName}.
        </h1>
        <p style="margin:12px 0 0;font-family:'Alegreya',Georgia,serif;font-size:20px;line-height:1.35;color:#C99A3A;font-style:italic;text-align:center;">
          Tanda is already expecting you.
        </p>
      </td></tr>
      <tr><td style="padding:24px 36px 4px;">
        <p style="margin:0 0 14px;font-size:16px;line-height:1.7;color:#5A4A3A;">
          She's the one who has been slipping through windows for a thousand years. And tonight she's pretty excited — you just joined the network that lets her keep every tooth permanent.
        </p>
        <p style="margin:0 0 14px;font-size:16px;line-height:1.7;color:#5A4A3A;">
          Here's how it works. It takes about three minutes:
        </p>
      </td></tr>
      <tr><td style="padding:8px 36px 24px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
          <tr><td style="padding:10px 0;font-size:15px;line-height:1.6;color:#5A4A3A;">
            <span style="color:#C99A3A;font-weight:700;">1.</span>&nbsp;&nbsp;Read one of the three bedtime stories with your child.
          </td></tr>
          <tr><td style="padding:10px 0;font-size:15px;line-height:1.6;color:#5A4A3A;">
            <span style="color:#C99A3A;font-weight:700;">2.</span>&nbsp;&nbsp;When they lose a tooth, take a photo of the smile and write the story of how it fell out.
          </td></tr>
          <tr><td style="padding:10px 0;font-size:15px;line-height:1.6;color:#5A4A3A;">
            <span style="color:#C99A3A;font-weight:700;">3.</span>&nbsp;&nbsp;Family anywhere in the world can add a note, a gift, a few dollars. All of it — theirs when they're 18.
          </td></tr>
        </table>
      </td></tr>
      <tr><td align="center" style="padding:8px 36px 36px;">
        <a href="${SITE}/toothfairy" style="display:inline-block;background:#C99A3A;color:#FBF7EE;text-decoration:none;padding:16px 36px;border-radius:999px;font-weight:700;font-size:16px;letter-spacing:0.02em;box-shadow:0 6px 24px rgba(201,154,58,0.35);">
          Read the three stories &rarr;
        </a>
        <p style="margin:20px 0 0;font-size:13px;color:#8A7560;">
          Takes 12 minutes together. Tanda's first. Then her origin. Then the mouse in Madrid.
        </p>
      </td></tr>
      <tr><td style="padding:0 36px 28px;">
        <div style="height:1px;background:#E6DDC8;"></div>
        <p style="margin:20px 0 0;font-size:12px;line-height:1.6;color:#8A7560;text-align:center;">
          Tooth Fairy Network &middot; Permanent keepsakes for the children they are right now<br>
          <a href="${SITE}" style="color:#C99A3A;text-decoration:none;">toothfairy.network</a>
        </p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`
}
