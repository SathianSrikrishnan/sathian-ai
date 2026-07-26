'use client'

import { useState } from 'react'

import styles from '../studio-auth.module.css'

export default function StudioLogin() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSent(false)
    setLoading(true)

    try {
      const response = await fetch('/api/studio/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (response.ok) {
        setSent(true)
      } else if (response.status === 400) {
        setError('Enter a valid email address.')
      } else {
        setError('The Studio entrance is temporarily unavailable.')
      }
    } catch {
      setError('The Studio entrance is temporarily unavailable.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className={styles.shell}>
      <div className={styles.wordmark}>sathian.ai / studio</div>
      <section className={styles.panel} aria-labelledby="studio-login-title">
        <div className={styles.eyebrow}>Private operator entrance</div>
        <h1 id="studio-login-title" className={styles.title}>Open the control room</h1>
        <p className={styles.lede}>
          Studio uses a private email link followed by your authenticator. No shared password is stored here.
        </p>

        <ol className={styles.accessRail} aria-label="Studio sign-in progress">
          <li className={styles.railActive}>
            <span>01</span>
            <strong>Email link</strong>
          </li>
          <li>
            <span>02</span>
            <strong>Authenticator</strong>
          </li>
        </ol>

        <form onSubmit={handleSubmit} className={styles.form}>
          <label htmlFor="studio-email">Approved email</label>
          <input
            id="studio-email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
            autoFocus
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Requesting secure link…' : 'Send secure link'}
          </button>
        </form>

        <div className={styles.status} aria-live="polite">
          {sent && <p className={styles.success}>If this address is approved, a secure sign-in link is on its way.</p>}
          {error && <p className={styles.error}>{error}</p>}
          {!sent && !error && <p>Unknown addresses receive no account and no access.</p>}
        </div>
      </section>
      <p className={styles.footnote}>Restricted workspace · activity is audited</p>
    </main>
  )
}
