/**
 * POST /api/toothfairy/deposit-email
 *
 * Sends a deposit confirmation email via Resend after a successful escrow deposit.
 * Called fire-and-forget from the client after server-deposit succeeds.
 */
import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      console.warn("[deposit-email] RESEND_API_KEY not set, skipping email")
      return NextResponse.json({ success: true, skipped: true })
    }
    const resend = new Resend(apiKey)

    const { email, childName, depositorName, amountSol, feeSol, netSol, lockChoice, txSignature } =
      await request.json()

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 })
    }

    const lockLabel =
      lockChoice === "now" || lockChoice === "immediate"
        ? "Available now (Gift)"
        : lockChoice === "eighteen"
          ? `Locked until ${childName || "child"} turns 18`
          : `Locked until ${lockChoice}`

    const solscanUrl = `https://solscan.io/tx/${txSignature}`

    await resend.emails.send({
      from: "Tooth Fairy Network <noreply@toothfairy.network>",
      to: email,
      subject: `Deposit confirmed for ${childName || "your child"}'s savings`,
      html: `
        <div style="font-family: 'Nunito', -apple-system, sans-serif; max-width: 520px; margin: 0 auto; background: #0B1026; color: #F0ECFF; padding: 40px 24px; border-radius: 16px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <span style="font-size: 48px;">&#x2728;</span>
          </div>

          <h1 style="color: #F0C456; text-align: center; font-size: 24px; margin-bottom: 8px;">
            Deposit Confirmed
          </h1>

          <p style="text-align: center; color: #A0AEC0; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
            ${depositorName || "You"} deposited SOL into ${childName || "your child"}'s savings on the Tooth Fairy Network.
          </p>

          <div style="background: rgba(240,196,86,0.08); border: 1px solid rgba(240,196,86,0.2); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
            <table style="width: 100%; border-collapse: collapse; color: #CBD5E0; font-size: 14px;">
              <tr>
                <td style="padding: 6px 0; color: #A0AEC0;">Amount</td>
                <td style="padding: 6px 0; text-align: right; font-weight: 600; color: #F0ECFF;">${Number(amountSol).toFixed(4)} SOL</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #A0AEC0;">Network fee (2%)</td>
                <td style="padding: 6px 0; text-align: right; color: #A0AEC0;">${Number(feeSol).toFixed(4)} SOL</td>
              </tr>
              <tr style="border-top: 1px solid rgba(240,196,86,0.2);">
                <td style="padding: 8px 0 6px; color: #F0C456; font-weight: 600;">Deposited</td>
                <td style="padding: 8px 0 6px; text-align: right; font-weight: 700; color: #F0C456;">${Number(netSol).toFixed(4)} SOL</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #A0AEC0;">Lock period</td>
                <td style="padding: 6px 0; text-align: right; color: #F0ECFF;">${lockLabel}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #A0AEC0;">From</td>
                <td style="padding: 6px 0; text-align: right; color: #F0ECFF;">${depositorName || "Anonymous"}</td>
              </tr>
            </table>
          </div>

          ${txSignature ? `
          <div style="text-align: center; margin-bottom: 24px;">
            <a href="${solscanUrl}" target="_blank" rel="noopener noreferrer"
               style="display: inline-block; background: linear-gradient(135deg, #F0C456, #E0A830); color: #0B1026; font-weight: 700; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-size: 15px;">
              View on Solscan &rarr;
            </a>
          </div>
          ` : ""}

          <div style="text-align: center;">
            <a href="https://toothfairy.network/app"
               style="display: inline-block; color: #7ECBC3; font-size: 14px; text-decoration: underline;">
              Visit Dashboard
            </a>
          </div>

          <p style="text-align: center; color: #4A5568; font-size: 12px; margin-top: 32px;">
            Tooth Fairy Network &mdash; Turning milestones into permanent treasures
          </p>
        </div>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("[deposit-email] Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
