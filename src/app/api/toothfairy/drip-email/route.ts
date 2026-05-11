/**
 * POST /api/toothfairy/drip-email
 *
 * Fires one of three scheduled drip emails, each in a character's voice:
 *   - t24        — 24h post-signup, no mint yet ("Tanda is waiting")
 *   - t72-viking — 72h post-mint ("Where Tanda came from")
 *   - t7d-perez  — 7 days post-mint ("There's a mouse in Madrid")
 *
 * Called by the VPS daily cron. Gated by DRIP_CRON_SECRET header so
 * only our cron can trigger sends.
 */
import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const SITE = "https://toothfairy.network"
type DripType = "t24" | "t72-viking" | "t7d-perez"

export async function POST(request: NextRequest) {
  try {
    // Shared-secret gate — never run by anon traffic
    const expected = process.env.DRIP_CRON_SECRET
    const provided = request.headers.get("x-drip-secret")
    if (!expected || provided !== expected) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      return NextResponse.json({ success: true, skipped: true, reason: "no RESEND_API_KEY" })
    }
    const resend = new Resend(apiKey)

    const { type, email, firstName, childName } = (await request.json()) as {
      type: DripType
      email: string
      firstName?: string
      childName?: string
    }

    if (!email || !type) {
      return NextResponse.json({ error: "email + type required" }, { status: 400 })
    }

    const ctx = {
      firstName: firstName?.trim() || "there",
      childName: childName?.trim() || "your child",
    }

    let subject = ""
    let html = ""
    if (type === "t24") {
      subject = "Tanda checked twice."
      html = renderT24(ctx)
    } else if (type === "t72-viking") {
      subject = "Before Tanda was a fairy."
      html = renderT72Viking(ctx)
    } else if (type === "t7d-perez") {
      subject = "Hola. There's a mouse in Madrid."
      html = renderT7dPerez(ctx)
    } else {
      return NextResponse.json({ error: "unknown drip type" }, { status: 400 })
    }

    await resend.emails.send({
      from: "Tooth Fairy Network <noreply@toothfairy.network>",
      to: email,
      subject,
      html,
    })

    return NextResponse.json({ success: true, type })
  } catch (error: any) {
    console.error("[drip-email] error:", error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

/* ─── Shared HTML shell ──────────────────────────────────────────────────── */
function shell({
  eyebrow, heroImage, heroAlt, heading, italicBit, body, ctaHref, ctaLabel, footerLine,
}: {
  eyebrow: string
  heroImage: string
  heroAlt: string
  heading: string
  italicBit?: string
  body: string
  ctaHref: string
  ctaLabel: string
  footerLine: string
}) {
  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F6F2E8;font-family:'Alegreya Sans',Helvetica,Arial,sans-serif;color:#3D2F22;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F6F2E8;padding:32px 16px;">
  <tr><td align="center">
    <table role="presentation" width="560" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;width:100%;background:#FBF7EE;border-radius:18px;overflow:hidden;box-shadow:0 12px 40px rgba(61,47,34,0.08);">
      <tr><td style="padding:36px 36px 10px;">
        <p style="margin:0;font-size:11px;letter-spacing:0.28em;text-transform:uppercase;color:#B8903A;font-weight:600;">${eyebrow}</p>
      </td></tr>
      <tr><td align="center" style="padding:10px 36px 8px;">
        <img src="${heroImage}" alt="${heroAlt}" width="120" height="120" style="width:120px;height:120px;object-fit:cover;border-radius:50%;border:3px solid #C99A3A;box-shadow:0 6px 28px rgba(201,154,58,0.28);display:block;">
      </td></tr>
      <tr><td style="padding:22px 36px 4px;">
        <h1 style="margin:0;font-family:'Alegreya',Georgia,serif;font-size:30px;line-height:1.2;color:#3D2F22;font-weight:700;text-align:center;">
          ${heading}
        </h1>
        ${italicBit ? `<p style="margin:10px 0 0;font-family:'Alegreya',Georgia,serif;font-size:19px;line-height:1.35;color:#C99A3A;font-style:italic;text-align:center;">${italicBit}</p>` : ''}
      </td></tr>
      <tr><td style="padding:22px 36px 8px;">
        ${body}
      </td></tr>
      <tr><td align="center" style="padding:14px 36px 8px;">
        <a href="${ctaHref}" style="display:inline-block;background:#C99A3A;color:#FBF7EE;text-decoration:none;padding:16px 34px;border-radius:999px;font-weight:700;font-size:16px;letter-spacing:0.02em;box-shadow:0 6px 24px rgba(201,154,58,0.35);">
          ${ctaLabel} &rarr;
        </a>
      </td></tr>
      <tr><td style="padding:20px 36px 28px;">
        <div style="height:1px;background:#E6DDC8;"></div>
        <p style="margin:18px 0 0;font-size:12px;line-height:1.6;color:#8A7560;text-align:center;">
          ${footerLine}<br>
          <a href="${SITE}" style="color:#C99A3A;text-decoration:none;">toothfairy.network</a>
        </p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`
}

/* ─── T+24h · Tanda nudge (no mint yet) ──────────────────────────────────── */
function renderT24({ firstName }: { firstName: string }) {
  return shell({
    eyebrow: "Tanda, checking in",
    heroImage: `${SITE}/story-assets/characters/char-tooth-fairy.jpg`,
    heroAlt: "Tanda",
    heading: `Tanda checked twice.`,
    italicBit: `Still waiting for ${firstName}'s first tooth.`,
    body: `
      <p style="margin:0 0 14px;font-size:16px;line-height:1.7;color:#5A4A3A;">
        You joined yesterday. Tanda noticed. She's been doing this a thousand years and she still gets a little anxious when one of hers hasn't brought a tooth in yet.
      </p>
      <p style="margin:0 0 14px;font-size:16px;line-height:1.7;color:#5A4A3A;">
        When it happens — the wiggle, the pop, the palm — you have three minutes of work:
      </p>
      <p style="margin:0 0 10px;font-size:15px;line-height:1.7;color:#5A4A3A;">
        <span style="color:#C99A3A;font-weight:700;">&#x2022;</span>&nbsp; A photo of the gap-toothed smile.
      </p>
      <p style="margin:0 0 10px;font-size:15px;line-height:1.7;color:#5A4A3A;">
        <span style="color:#C99A3A;font-weight:700;">&#x2022;</span>&nbsp; A sentence about how it fell out.
      </p>
      <p style="margin:0 0 16px;font-size:15px;line-height:1.7;color:#5A4A3A;">
        <span style="color:#C99A3A;font-weight:700;">&#x2022;</span>&nbsp; A drawing, if they want.
      </p>
      <p style="margin:0 0 4px;font-size:16px;line-height:1.7;color:#5A4A3A;font-style:italic;">
        That's it. Tanda does the rest.
      </p>`,
    ctaHref: `${SITE}/toothfairy/app/draw?from=email`,
    ctaLabel: "Make the keepsake",
    footerLine: "Tanda &middot; keeper on call for a thousand years",
  })
}

/* ─── T+72h · Viking origin story nudge ──────────────────────────────────── */
function renderT72Viking({ childName }: { childName: string }) {
  return shell({
    eyebrow: "Story two — the origin",
    heroImage: `${SITE}/story-assets/viking-origin/vo-09-transformation.png`,
    heroAlt: "Young Tanda becomes the Tooth Fairy",
    heading: `Before Tanda was a fairy,`,
    italicBit: `she was a girl by the sea.`,
    body: `
      <p style="margin:0 0 14px;font-size:16px;line-height:1.7;color:#5A4A3A;">
        A thousand years ago, in a Viking village, Tanda was seven years old and her father built ships.
      </p>
      <p style="margin:0 0 14px;font-size:16px;line-height:1.7;color:#5A4A3A;">
        When she lost her first tooth, he knelt down — all the way down, to her eyes — and threaded it onto a leather cord around his neck. <em>&ldquo;Where I go, a part of you goes.&rdquo;</em>
      </p>
      <p style="margin:0 0 14px;font-size:16px;line-height:1.7;color:#5A4A3A;">
        He sailed the next morning.
      </p>
      <p style="margin:0 0 14px;font-size:16px;line-height:1.7;color:#5A4A3A;">
        What happened in the years she waited is how Tanda became the keeper of every child's tooth, for every child, for the next thousand years.
      </p>
      <p style="margin:0 0 4px;font-size:15px;line-height:1.7;color:#8A7560;font-style:italic;">
        Four minutes with ${childName} tonight. Just before bed.
      </p>`,
    ctaHref: `${SITE}/toothfairy/story/viking-origin`,
    ctaLabel: "Read the origin",
    footerLine: "Story two of three &middot; The First Tooth",
  })
}

/* ─── T+7d · Ratoncito Pérez broadener ───────────────────────────────────── */
function renderT7dPerez({ childName }: { childName: string }) {
  return shell({
    eyebrow: "There are other collectors",
    heroImage: `${SITE}/story-assets/characters/char-perez.jpg`,
    heroAlt: "El Ratoncito Pérez",
    heading: `Hola.`,
    italicBit: `Ratoncito Pérez here.`,
    body: `
      <p style="margin:0 0 14px;font-size:16px;line-height:1.7;color:#5A4A3A;">
        I am a mouse. A small one. I live behind a cookie tin in a bakery in Madrid, on a street called Calle del Arenal. (A real street. You could visit.)
      </p>
      <p style="margin:0 0 14px;font-size:16px;line-height:1.7;color:#5A4A3A;">
        I have been collecting teeth in Spain for a hundred years. Each one labeled. Each one remembered. The whole shelf is a little heavy these days — but now Tanda and I share it.
      </p>
      <p style="margin:0 0 14px;font-size:16px;line-height:1.7;color:#5A4A3A;">
        And we aren't the only ones. A magpie in Korea. A crow in Romania. A beaver in Canada. Every culture keeps teeth a little differently. All of us are on the Network now.
      </p>
      <p style="margin:0 0 4px;font-size:15px;line-height:1.7;color:#8A7560;font-style:italic;">
        When ${childName} loses their next tooth, come and meet us.
      </p>`,
    ctaHref: `${SITE}/toothfairy/stories`,
    ctaLabel: "Meet the collectors",
    footerLine: "Story three of three &middot; Pérez, Tanda, and the whole world",
  })
}
