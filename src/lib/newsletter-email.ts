const workshopFrom = 'Sathian S. <hi@sathian.ai>'
const toothFairyFrom = 'Tooth Fairy Network <noreply@toothfairy.network>'

function unsubscribeFooter(unsubscribeUrl: string) {
  return `
    <p style="margin-top:28px;font-size:12px;line-height:1.6;color:#786b5c">
      You joined this list from the website.
      <a href="${unsubscribeUrl}" style="color:inherit;text-decoration:underline">Unsubscribe</a>
      at any time.
    </p>`
}

export function newsletterConfirmation(
  source: 'sathian-home' | 'tfn-footer',
  unsubscribeUrl: string,
) {
  if (source === 'tfn-footer') {
    return {
      from: toothFairyFrom,
      subject: 'You’re on the Tooth Fairy Network list',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:36px;color:#11234a;background:#fffaf1">
          <p style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#0c7d78">Tooth Fairy Network</p>
          <h1 style="font-family:Georgia,serif;font-size:32px">Thanks for following the story.</h1>
          <p style="font-size:16px;line-height:1.7">You’re on the list for occasional story drops, parent notes, and meaningful product updates.</p>
          <p style="font-size:13px;line-height:1.6;color:#687186">Reply any time if you want to share feedback.</p>
          ${unsubscribeFooter(unsubscribeUrl)}
        </div>`,
    }
  }

  return {
    from: workshopFrom,
    subject: 'You’re on the sathian.ai field-notes list',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;padding:36px;color:#2b1c13;background:#f6ead3">
        <p style="font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:#a84c19">Sathian’s workshop</p>
        <h1 style="font-family:Georgia,serif;font-size:32px">Thanks for joining.</h1>
        <p style="font-size:16px;line-height:1.7">I’ll send a quiet note when a new essay or build note is worth sharing.</p>
        <p style="font-size:13px;line-height:1.6;color:#6c5843">Reply any time if you want to say hello.</p>
        ${unsubscribeFooter(unsubscribeUrl)}
      </div>`,
  }
}
