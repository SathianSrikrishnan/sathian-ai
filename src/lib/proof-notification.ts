const ENDPOINT = 'https://api.resend.com/emails'
const RECIPIENT = 'info@toothfairy.network'

/** Notify the owner only. Registration success never depends on email availability. */
export async function notifyProofInterest(receipt: string): Promise<void> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return
  const headers = { apikey: key, authorization: `Bearer ${key}`, 'Content-Type': 'application/json' }
  const endpoint = `${url}/rest/v1/proof_family_interest?id=eq.${encodeURIComponent(receipt)}`
  try {
    const read = await fetch(`${endpoint}&select=adult_name,contact,feedback,notification_id`, { headers, signal: AbortSignal.timeout(5000) })
    if (!read.ok) throw new Error('notification_read')
    const [row] = await read.json()
    if (!row || row.notification_id) return
    let providerId: string | null = null
    if (process.env.RESEND_API_KEY) {
      const result = await fetch(ENDPOINT, {
        method: 'POST',
        headers: { authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': `proof-interest-${receipt}` },
        body: JSON.stringify({
          from: 'Tooth Fairy Network <noreply@toothfairy.network>',
          to: [RECIPIENT],
          subject: row.feedback?.startsWith('[Village]') ? 'New Village request' : 'PROOF — new founding-family interest',
          text: `A new PROOF registration is saved.\n\nName: ${row.adult_name}\nContact: ${row.contact}\nFeedback: ${row.feedback || '(none)'}\n\nReceipt: ${receipt}\nReview: https://supabase.com/dashboard/project/tvujxgdwgvrunjvhseey/editor\n\nThe child’s age is kept in the private database, not included in this email.`,
        }),
        signal: AbortSignal.timeout(8000),
      })
      if (result.ok) providerId = (await result.json()).id || null
    }
    const saved = await fetch(endpoint, { method: 'PATCH', headers, body: JSON.stringify({ notification_id: providerId, notification_status: providerId ? 'accepted' : 'pending', notification_attempted_at: new Date().toISOString() }), signal: AbortSignal.timeout(5000) })
    if (!saved.ok) throw new Error('notification_status_write')
  } catch {
    // No names, contact details, feedback, provider bodies or credentials in logs.
    console.warn('[proof-interest] owner notification remains unconfirmed; inspect pending registrations')
  }
}
