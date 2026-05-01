/**
 * POST /api/toothfairy/deposit-email
 *
 * Sends a deposit confirmation email via Resend after a successful escrow deposit.
 * Called fire-and-forget from the client after server-deposit succeeds.
 *
 * Impeccable template: cream + gold + Alegreya. Tanda's voice.
 */
import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { createClient } from "@supabase/supabase-js"

const SITE = "https://toothfairy.network"

export async function POST(request: NextRequest) {
  try {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      console.warn("[deposit-email] RESEND_API_KEY not set, skipping email")
      return NextResponse.json({ success: true, skipped: true })
    }
    const resend = new Resend(apiKey)

    const body = await request.json()
    let { email, childName } = body as { email?: string; childName?: string }
    const { childProfilePda, depositorName, amountSol, feeSol, netSol, lockChoice, txSignature } = body

    // If email wasn't passed directly, look up the guardian email by child_profile_pda.
    // Gift flow (/toothfairy/app/gift/[milestone]) doesn't know the parent email —
    // it only has public PDAs — so we resolve it server-side from tfn_children.
    if (!email && childProfilePda && process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
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
      return NextResponse.json({ error: "Email required (not passed, not resolvable)" }, { status: 400 })
    }

    const kidName = childName || "your child"
    const giver = depositorName || "Someone who loves them"
    const lockLabel =
      lockChoice === "now" || lockChoice === "immediate"
        ? "Available now — gift to open today"
        : lockChoice === "ageTen" || lockChoice === "ten"
          ? `Locked until ${kidName} turns 10`
          : `Locked until ${lockChoice}`

    const solscanUrl = txSignature ? `https://solscan.io/tx/${txSignature}` : null

    await resend.emails.send({
      from: "Tooth Fairy Network <noreply@toothfairy.network>",
      to: email,
      subject: `${kidName} just got a gift.`,
      html: renderDeposit({ kidName, giver, amountSol, feeSol, netSol, lockLabel, solscanUrl }),
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("[deposit-email] Error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

function renderDeposit({
  kidName, giver, amountSol, feeSol, netSol, lockLabel, solscanUrl,
}: {
  kidName: string; giver: string;
  amountSol: number; feeSol: number; netSol: number;
  lockLabel: string; solscanUrl: string | null;
}) {
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F6F2E8;font-family:'Alegreya Sans',Helvetica,Arial,sans-serif;color:#3D2F22;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F6F2E8;padding:32px 16px;">
  <tr><td align="center">
    <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;background:#FBF7EE;border-radius:18px;overflow:hidden;box-shadow:0 12px 40px rgba(61,47,34,0.08);">
      <tr><td style="padding:36px 36px 12px;">
        <p style="margin:0;font-size:11px;letter-spacing:0.28em;text-transform:uppercase;color:#B8903A;font-weight:600;">A gift arrived</p>
      </td></tr>
      <tr><td style="padding:12px 36px 0;">
        <h1 style="margin:0;font-family:'Alegreya',Georgia,serif;font-size:30px;line-height:1.18;color:#3D2F22;font-weight:700;text-align:center;">
          ${kidName} just got<br><em style="color:#C99A3A;font-weight:700;">a gift.</em>
        </h1>
      </td></tr>
      <tr><td style="padding:22px 36px 4px;">
        <p style="margin:0;font-size:16px;line-height:1.7;color:#5A4A3A;text-align:center;">
          ${giver} added ${Number(netSol).toFixed(4)} SOL to ${kidName}'s keepsake.
        </p>
      </td></tr>
      <tr><td style="padding:22px 36px 8px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F2ECDB;border:1px solid #E6DDC8;border-radius:14px;padding:6px;">
          <tr><td style="padding:12px 18px;font-size:14px;color:#8A7560;">Gift amount</td>
              <td style="padding:12px 18px;font-size:14px;color:#3D2F22;text-align:right;font-weight:600;">${Number(amountSol).toFixed(4)} SOL</td></tr>
          <tr><td style="padding:4px 18px;font-size:13px;color:#8A7560;">Network fee (2%)</td>
              <td style="padding:4px 18px;font-size:13px;color:#8A7560;text-align:right;">${Number(feeSol).toFixed(4)} SOL</td></tr>
          <tr><td colspan="2" style="padding:6px 18px 0;"><div style="height:1px;background:#E6DDC8;"></div></td></tr>
          <tr><td style="padding:10px 18px 4px;font-size:14px;color:#C99A3A;font-weight:700;">Deposited for ${kidName}</td>
              <td style="padding:10px 18px 4px;font-size:16px;color:#C99A3A;text-align:right;font-weight:700;">${Number(netSol).toFixed(4)} SOL</td></tr>
          <tr><td style="padding:4px 18px 12px;font-size:13px;color:#8A7560;">Lock</td>
              <td style="padding:4px 18px 12px;font-size:13px;color:#5A4A3A;text-align:right;">${lockLabel}</td></tr>
          <tr><td style="padding:0 18px 12px;font-size:13px;color:#8A7560;">From</td>
              <td style="padding:0 18px 12px;font-size:13px;color:#5A4A3A;text-align:right;">${giver}</td></tr>
        </table>
      </td></tr>
      ${solscanUrl ? `
      <tr><td align="center" style="padding:20px 36px 8px;">
        <a href="${solscanUrl}" style="display:inline-block;background:#C99A3A;color:#FBF7EE;text-decoration:none;padding:14px 30px;border-radius:999px;font-weight:700;font-size:15px;box-shadow:0 6px 20px rgba(201,154,58,0.32);">
          View on Solscan &rarr;
        </a>
      </td></tr>` : ''}
      <tr><td style="padding:16px 36px 28px;">
        <p style="margin:0 0 14px;font-size:14px;line-height:1.7;color:#5A4A3A;text-align:center;">
          Every deposit. Every note. Every photo. All permanent, all ${kidName}'s.
        </p>
        <div style="height:1px;background:#E6DDC8;margin-top:14px;"></div>
        <p style="margin:20px 0 0;font-size:12px;line-height:1.6;color:#8A7560;text-align:center;">
          Tooth Fairy Network &middot; <a href="${SITE}" style="color:#C99A3A;text-decoration:none;">toothfairy.network</a>
        </p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`
}
