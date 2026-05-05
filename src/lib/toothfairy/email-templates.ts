const SITE = "https://toothfairy.network"
const FROM = "Tooth Fairy Network <noreply@toothfairy.network>"

export const toothFairyEmailFrom = FROM

export function escapeHtml(value: unknown) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

function firstNameFrom(name?: string | null) {
  const clean = name?.trim()
  return clean ? clean.split(/\s+/)[0] : "there"
}

function emailShell({
  preview,
  eyebrow,
  heading,
  intro,
  body,
  ctaHref,
  ctaLabel,
  footer,
}: {
  preview: string
  eyebrow: string
  heading: string
  intro: string
  body: string
  ctaHref: string
  ctaLabel: string
  footer: string
}) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${escapeHtml(preview)}</title>
</head>
<body style="margin:0;padding:0;background:#F6F2E8;font-family:Helvetica,Arial,sans-serif;color:#11234A;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${escapeHtml(preview)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#F6F2E8;padding:32px 16px;">
  <tr><td align="center">
    <table role="presentation" width="580" cellpadding="0" cellspacing="0" border="0" style="max-width:580px;width:100%;background:#FBF7EE;border:1px solid #E3D9C4;border-radius:18px;overflow:hidden;box-shadow:0 14px 42px rgba(48,38,24,0.08);">
      <tr><td style="padding:34px 36px 10px;">
        <p style="margin:0;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#B6871F;font-weight:700;">${escapeHtml(eyebrow)}</p>
      </td></tr>
      <tr><td style="padding:10px 36px 0;">
        <h1 style="margin:0;font-family:Georgia,serif;font-size:32px;line-height:1.12;color:#11234A;font-weight:700;">${heading}</h1>
        <p style="margin:14px 0 0;font-size:16px;line-height:1.7;color:#334260;">${intro}</p>
      </td></tr>
      <tr><td style="padding:24px 36px 8px;">${body}</td></tr>
      <tr><td align="center" style="padding:18px 36px 8px;">
        <a href="${escapeHtml(ctaHref)}" style="display:inline-block;background:#6D45A8;color:#FFFAF1;text-decoration:none;padding:15px 28px;border-radius:999px;font-weight:700;font-size:15px;box-shadow:0 12px 28px rgba(109,69,168,0.22);">
          ${escapeHtml(ctaLabel)} &rarr;
        </a>
      </td></tr>
      <tr><td style="padding:22px 36px 30px;">
        <div style="height:1px;background:#E3D9C4;"></div>
        <p style="margin:18px 0 0;font-size:12px;line-height:1.6;color:#687186;text-align:center;">
          ${footer}<br>
          <a href="${SITE}" style="color:#6D45A8;text-decoration:none;">toothfairy.network</a>
        </p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`
}

export function renderWelcomeEmail({ name }: { name?: string | null }) {
  const firstName = escapeHtml(firstNameFrom(name))

  return emailShell({
    preview: "Welcome to Tooth Fairy Network.",
    eyebrow: "Welcome",
    heading: `Welcome, ${firstName}.`,
    intro:
      "When the tooth moment happens, you can save the photo, the drawing, and the story in one parent-controlled place.",
    body: `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        ${[
          ["1", "Capture the moment", "Save the smile photo, the tooth story, and your child's drawing."],
          ["2", "Make it theirs", "Create the first forever memory without making your child manage a wallet."],
          ["3", "Invite family later", "Share the memory first. Loved ones can add a small gift when the payment path is ready for them."],
        ].map(([num, title, text]) => `
          <tr><td style="padding:0 0 12px;">
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FFFDF8;border:1px solid #E3D9C4;border-radius:12px;">
              <tr>
                <td width="42" style="padding:14px 0 14px 14px;vertical-align:top;">
                  <span style="display:inline-block;width:28px;height:28px;border-radius:50%;background:#D8A43C;color:#FFFAF1;text-align:center;line-height:28px;font-weight:700;">${num}</span>
                </td>
                <td style="padding:13px 14px 14px 8px;">
                  <p style="margin:0;color:#11234A;font-weight:700;font-size:15px;">${escapeHtml(title)}</p>
                  <p style="margin:5px 0 0;color:#334260;font-size:14px;line-height:1.55;">${escapeHtml(text)}</p>
                </td>
              </tr>
            </table>
          </td></tr>
        `).join("")}
      </table>`,
    ctaHref: `${SITE}/toothfairy/app`,
    ctaLabel: "Create a memory",
    footer: "Parent controlled. Memory first. Solana stays in the background.",
  })
}

export function renderMemoryCreatedEmail({
  parentName,
  childName,
  profileUrl,
}: {
  parentName?: string | null
  childName: string
  profileUrl: string
}) {
  const firstName = escapeHtml(firstNameFrom(parentName))
  const kidName = escapeHtml(childName || "your child")

  return emailShell({
    preview: `${kidName}'s first forever memory is saved.`,
    eyebrow: "Memory saved",
    heading: `${kidName}'s first forever memory is saved.`,
    intro:
      `${firstName}, the photo, drawing, and tooth story are now together in one page your family can come back to.`,
    body: `
      <div style="background:#FFFDF8;border:1px solid #E3D9C4;border-radius:14px;padding:18px 20px;">
        <p style="margin:0;color:#11234A;font-weight:700;font-size:15px;">Share the memory first.</p>
        <p style="margin:8px 0 0;color:#334260;font-size:14px;line-height:1.65;">
          Family can open the link, read the story, and celebrate the moment. Gifts are optional, and the Smile Fund stays parent-controlled.
        </p>
      </div>
      <div style="margin-top:14px;background:#F7F0DF;border:1px solid #E3D9C4;border-radius:14px;padding:18px 20px;">
        <p style="margin:0;color:#11234A;font-weight:700;font-size:15px;">What the Smile Fund teaches</p>
        <p style="margin:8px 0 0;color:#334260;font-size:14px;line-height:1.65;">
          Small gifts can become a first lesson in responsibility, saving, and ownership before a child is ready to manage money alone.
        </p>
      </div>`,
    ctaHref: profileUrl,
    ctaLabel: `See ${childName || "the"} memory`,
    footer: "This is an educational family savings experience, not investment advice.",
  })
}

export function renderGiftReceivedEmail({
  childName,
  giver,
  amountSol,
  feeSol,
  netSol,
  lockLabel,
  solscanUrl,
}: {
  childName?: string | null
  giver?: string | null
  amountSol?: number | string | null
  feeSol?: number | string | null
  netSol?: number | string | null
  lockLabel: string
  solscanUrl?: string | null
}) {
  const kidName = escapeHtml(childName || "your child")
  const giverName = escapeHtml(giver || "Someone who loves them")
  const amount = Number(amountSol || 0)
  const fee = Number(feeSol || 0)
  const net = Number(netSol || 0)

  const rows = [
    ["Gift amount", `${amount.toFixed(4)} SOL`],
    ["Network fee", `${fee.toFixed(4)} SOL`],
    [`Saved for ${kidName}`, `${net.toFixed(4)} SOL`],
    ["Access", lockLabel],
    ["From", giverName],
  ]

  return emailShell({
    preview: `${kidName} received a Smile Fund gift.`,
    eyebrow: "Gift received",
    heading: `${kidName} received a Smile Fund gift.`,
    intro:
      `${giverName} added a small gift. The memory stays first; the parent-controlled fund becomes the learning layer over time.`,
    body: `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#FFFDF8;border:1px solid #E3D9C4;border-radius:14px;padding:8px;">
        ${rows.map(([label, value], index) => `
          <tr>
            <td style="padding:${index === 0 ? "12px" : "8px"} 12px;color:#687186;font-size:14px;">${escapeHtml(label)}</td>
            <td style="padding:${index === 0 ? "12px" : "8px"} 12px;color:#11234A;font-size:14px;text-align:right;font-weight:700;">${escapeHtml(value)}</td>
          </tr>
        `).join("")}
      </table>
      <p style="margin:16px 0 0;color:#334260;font-size:14px;line-height:1.65;text-align:center;">
        The fund is about practice: saving, patience, and responsibility before access.
      </p>`,
    ctaHref: solscanUrl || SITE,
    ctaLabel: solscanUrl ? "View transaction" : "Open Tooth Fairy Network",
    footer: "Parent-controlled until the child is ready to learn from it.",
  })
}
