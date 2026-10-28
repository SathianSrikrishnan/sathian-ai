'use client'

import { useId, useRef, useState, type FormEvent } from 'react'
import { EARLY_TESTING, type EarlyTestingSite } from '@/lib/early-testing'
import styles from './EarlyTesterSignup.module.css'

/** Mount in the parent-facing area only, never inside child lesson/readers. */
export function EarlyTesterSignup({ sourceSite, enabled = false }: { sourceSite: EarlyTestingSite; enabled?: boolean }) {
  const id = useId()
  const requestId = useRef<string | null>(null)
  const requestEmail = useRef<string>('')
  const [busy, setBusy] = useState(false)
  const [note, setNote] = useState<string>('')
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!enabled || busy) return
    const form = event.currentTarget
    const data = new FormData(form)
    const email = String(data.get('email') || '').trim().toLowerCase()
    if (requestEmail.current !== email) { requestId.current = crypto.randomUUID(); requestEmail.current = email }
    requestId.current ||= crypto.randomUUID()
    setBusy(true); setNote('Saving.')
    try {
      const response = await fetch(EARLY_TESTING.endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, company: data.get('company'), sourceSite, sourcePage: location.pathname,
          availabilityConsent: true, requestId: requestId.current }) })
      const result = await response.json()
      if (!response.ok || result.receipt !== requestId.current) throw new Error(result.error || EARLY_TESTING.failure)
      setNote(EARLY_TESTING.success); form.reset(); requestId.current = null; requestEmail.current = ''
    } catch (error) { setNote(error instanceof Error ? error.message : EARLY_TESTING.failure) }
    finally { setBusy(false) }
  }
  return <section aria-labelledby={`${id}-heading`} className={styles.card}>
    <p className={styles.adult}>For parents and grown-ups</p>
    <h2 id={`${id}-heading`}>{EARLY_TESTING.heading}</h2>
    <p>{EARLY_TESTING.introduction}</p>
    {!enabled && <p role="note">Preview — signup is not activated. No emails are being collected.</p>}
    <form onSubmit={submit} aria-busy={busy} className={styles.form}>
      <label htmlFor={`${id}-email`}>Your email</label>
      <input className={styles.email} disabled={!enabled || busy} id={`${id}-email`} name="email" type="email" autoComplete="email" maxLength={254} required aria-describedby={`${id}-consent ${id}-terms`} />
      <div aria-hidden="true" style={{ position: 'absolute', left: -10000 }}><label>Company<input name="company" tabIndex={-1} autoComplete="off" defaultValue="" /></label></div>
      <p id={`${id}-consent`} className={styles.notice}>{EARLY_TESTING.consent}</p>
      <p id={`${id}-terms`} className={styles.notice}>{EARLY_TESTING.terms}</p>
      <button type="submit" className={styles.submit} disabled={!enabled || busy}>{busy ? 'Saving.' : EARLY_TESTING.button}</button>
      <p role="status" aria-live="polite" className={styles.status}>{note}</p>
      <p><a href="https://toothfairy.network/privacy">Privacy</a></p>
    </form>
  </section>
}
