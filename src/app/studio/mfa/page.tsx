'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

import { createBrowserSupabase } from '@/lib/supabase-auth'
import styles from '../studio-auth.module.css'

type Enrollment = {
  factorId: string
  qrCode: string
  secret: string
}

export default function StudioMfaPage() {
  const router = useRouter()
  const supabase = useMemo(() => createBrowserSupabase(), [])
  const [factorId, setFactorId] = useState<string | null>(null)
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null)
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(true)
  const [working, setWorking] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    async function prepareCheckpoint() {
      const { data: userData } = await supabase.auth.getUser()
      if (!active) return
      if (!userData.user) {
        router.replace('/studio/login')
        return
      }

      const { data: aalData } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
      if (!active) return
      if (aalData?.currentLevel === 'aal2') {
        router.replace('/studio')
        return
      }

      const { data, error: factorError } = await supabase.auth.mfa.listFactors()
      if (!active) return
      if (factorError) {
        setError('The authenticator checkpoint could not be loaded.')
      } else {
        setFactorId(data.totp[0]?.id ?? null)
      }
      setLoading(false)
    }

    void prepareCheckpoint()
    return () => {
      active = false
    }
  }, [router, supabase])

  async function enrollTotp() {
    setWorking(true)
    setError('')

    const { data: factors } = await supabase.auth.mfa.listFactors()
    const abandoned = factors?.all.filter(
      (factor) => factor.factor_type === 'totp' && factor.status === 'unverified',
    ) ?? []
    for (const factor of abandoned) {
      await supabase.auth.mfa.unenroll({ factorId: factor.id })
    }

    const { data, error: enrollError } = await supabase.auth.mfa.enroll({
      factorType: 'totp',
      friendlyName: 'sathian.ai Studio',
    })

    if (enrollError) {
      setError('A new authenticator could not be enrolled. Try again.')
    } else {
      setFactorId(data.id)
      setEnrollment({
        factorId: data.id,
        qrCode: data.totp.qr_code,
        secret: data.totp.secret,
      })
    }
    setWorking(false)
  }

  async function verifyCode(event: React.FormEvent) {
    event.preventDefault()
    const activeFactorId = enrollment?.factorId ?? factorId
    if (!activeFactorId || !/^\d{6}$/.test(code)) {
      setError('Enter the current six-digit code from your authenticator.')
      return
    }

    setWorking(true)
    setError('')
    const { error: verifyError } = await supabase.auth.mfa.challengeAndVerify({
      factorId: activeFactorId,
      code,
    })

    if (verifyError) {
      setError('That code could not be verified. Check the current code and try again.')
      setWorking(false)
      return
    }

    router.replace('/studio')
    router.refresh()
  }

  async function signOut() {
    await supabase.auth.signOut({ scope: 'local' })
    router.replace('/studio/login')
    router.refresh()
  }

  return (
    <main className={styles.shell}>
      <div className={styles.wordmark}>sathian.ai / studio</div>
      <section className={styles.panel} aria-labelledby="studio-mfa-title">
        <div className={styles.eyebrow}>Identity checkpoint</div>
        <h1 id="studio-mfa-title" className={styles.title}>Confirm it is really you</h1>
        <p className={styles.lede}>
          Finish the private handoff with a time-based code from your authenticator app.
        </p>

        <ol className={styles.accessRail} aria-label="Studio sign-in progress">
          <li className={styles.railComplete}>
            <span>01</span>
            <strong>Email link</strong>
          </li>
          <li className={styles.railActive}>
            <span>02</span>
            <strong>Authenticator</strong>
          </li>
        </ol>

        {loading ? (
          <div className={styles.instrumentReadout}>Checking enrolled factors…</div>
        ) : (
          <>
            {!factorId && !enrollment && (
              <div className={styles.enrollPrompt}>
                <p>No verified authenticator is attached to this operator yet.</p>
                <button type="button" onClick={enrollTotp} disabled={working}>
                  {working ? 'Preparing authenticator…' : 'Set up authenticator'}
                </button>
              </div>
            )}

            {enrollment && (
              <div className={styles.qrInstrument}>
                <div className={styles.scanFrame}>
                  <img src={enrollment.qrCode} alt="Authenticator setup QR code" />
                </div>
                <div>
                  <span className={styles.readoutLabel}>Manual setup key</span>
                  <code className={styles.secret}>{enrollment.secret}</code>
                  <p>Scan the code or enter the key once. It is shown only for this setup.</p>
                </div>
              </div>
            )}

            {(factorId || enrollment) && (
              <form onSubmit={verifyCode} className={styles.form}>
                <label htmlFor="studio-totp">Six-digit authenticator code</label>
                <input
                  id="studio-totp"
                  name="totp"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  value={code}
                  onChange={(event) => setCode(event.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  className={styles.codeInput}
                  required
                  autoFocus={!enrollment}
                />
                <button type="submit" disabled={working || code.length !== 6}>
                  {working ? 'Verifying…' : 'Enter Studio'}
                </button>
              </form>
            )}
          </>
        )}

        <div className={styles.status} aria-live="polite">
          {error && <p className={styles.error}>{error}</p>}
        </div>
        <button type="button" className={styles.textButton} onClick={signOut}>Use a different account</button>
      </section>
      <p className={styles.footnote}>AAL2 required · restricted workspace</p>
    </main>
  )
}
