/**
 * POST /api/toothfairy/welcome-email
 *
 * Sends a welcome email via Resend when a user signs up.
 * Called from the auth callback (fire-and-forget).
 */
import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

export async function POST(request: NextRequest) {
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
      subject: "Welcome to the Tooth Fairy Network! ✨",
      html: `
        <div style="font-family: 'Nunito', -apple-system, sans-serif; max-width: 520px; margin: 0 auto; background: #0B1026; color: #F0ECFF; padding: 40px 24px; border-radius: 16px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <span style="font-size: 48px;">🧚‍♀️</span>
          </div>

          <h1 style="color: #F0C456; text-align: center; font-size: 24px; margin-bottom: 8px;">
            Welcome, ${firstName}!
          </h1>

          <p style="text-align: center; color: #A0AEC0; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
            You've joined the Tooth Fairy Network — where every lost tooth becomes a permanent digital keepsake and savings account for your child.
          </p>

          <div style="background: rgba(240,196,86,0.08); border: 1px solid rgba(240,196,86,0.2); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
            <h3 style="color: #F0C456; margin: 0 0 8px 0; font-size: 14px;">What happens next?</h3>
            <ul style="color: #CBD5E0; font-size: 14px; line-height: 1.8; padding-left: 20px; margin: 0;">
              <li>Your child's tooth art is permanently stored on Arweave</li>
              <li>A digital keepsake (cNFT) was minted on Solana</li>
              <li>Connect a wallet to start saving SOL for their future</li>
              <li>Share the profile link — family can gift SOL too!</li>
            </ul>
          </div>

          <div style="text-align: center;">
            <a href="https://toothfairy.network/app"
               style="display: inline-block; background: linear-gradient(135deg, #F0C456, #E0A830); color: #0B1026; font-weight: 700; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-size: 15px;">
              Visit Your Dashboard →
            </a>
          </div>

          <p style="text-align: center; color: #4A5568; font-size: 12px; margin-top: 32px;">
            Tooth Fairy Network — Turning milestones into permanent treasures
          </p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Welcome email error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
