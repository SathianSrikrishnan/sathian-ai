'use client'

import { useState } from 'react'

import { trackSiteEvent } from '@/lib/site-analytics'

// Reuses the Proof interest endpoint; source "village" and a [Village] note prefix mark these requests in the owner email.
export function VillageForm() {
  const [requestId, setRequestId] = useState(() => crypto.randomUUID())
  const [status, setStatus] = useState<'idle' | 'saving' | 'done' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const call = data.get('call') === 'on' ? `Call first: yes${data.get('call_time') ? `, best time: ${data.get('call_time')}` : ''}. ` : ''
    const note = `[Village] ${call}${String(data.get('feedback') || '')}`.slice(0, 1500)
    setStatus('saving')
    setMessage('Sending…')
    try {
      const response = await fetch('/api/proof-interest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          contact: data.get('contact'),
          childAge: Number(data.get('child_age')),
          relationship: data.get('relationship'),
          updates: data.get('updates') === 'on',
          feedback: note,
          company: data.get('company'),
          requestId,
          source: 'village',
        }),
      })
      const result = await response.json()
      if (!response.ok || !result.receipt) throw new Error(result.error || 'That did not send. Please try again.')
      setStatus('done')
      setMessage('Thank you. I’ll be in touch soon.')
      trackSiteEvent('village_requested', { placement: 'village_form', call_first: Boolean(call) })
      form.reset()
      setRequestId(crypto.randomUUID())
    } catch (error) {
      setStatus('error')
      setMessage(error instanceof Error ? error.message : 'That did not send. Please try again.')
    }
  }

  return (
    <form className="first20-form" onSubmit={onSubmit}>
      <label>
        Your name
        <input name="name" maxLength={100} autoComplete="name" required />
      </label>
      <label>
        Email or phone
        <input name="contact" maxLength={320} autoComplete="email" required />
      </label>
      <label>
        The child’s age
        <input name="child_age" type="number" min={0} max={17} step={1} inputMode="numeric" required />
      </label>
      <label>
        Who are you to the child?
        <select name="relationship" required defaultValue="">
          <option value="" disabled>Choose one</option>
          <option value="network">Aunt, uncle, godparent, grandparent or friend</option>
          <option value="caregiver">Their parent</option>
        </select>
      </label>
      <label className="first20-form__wide">
        How did you hear about this? Anything else? (optional)
        <textarea name="feedback" maxLength={1500} rows={3} />
      </label>
      <label className="first20-form__check">
        <input type="checkbox" name="call" /> I&apos;d like a quick call first.
      </label>
      <label className="first20-form__wide">
        Best time to call (optional)
        <input name="call_time" maxLength={80} placeholder="Weekday evenings" />
      </label>
      <label className="first20-form__check">
        <input type="checkbox" name="updates" /> Send me updates as I build.
      </label>
      <input name="company" tabIndex={-1} autoComplete="off" aria-hidden="true" className="first20-form__trap" />
      <button type="submit" disabled={status === 'saving'}>Ask for a free gift</button>
      <small role="status">{message}</small>
      <small className="first20-form__wide">I use your email or phone to arrange your gift, and send updates if you choose them; read the <a href="/privacy">privacy policy</a>.</small>
    </form>
  )
}
