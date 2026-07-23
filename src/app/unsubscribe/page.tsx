'use client'

import { useSearchParams } from 'next/navigation'
import { useState } from 'react'

export default function UnsubscribePage() {
  const token = useSearchParams().get('token') ?? ''
  const [state, setState] = useState<'idle' | 'saving' | 'done' | 'error'>('idle')

  async function unsubscribe() {
    setState('saving')
    const response = await fetch('/api/unsubscribe', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ token }),
    })
    setState(response.ok ? 'done' : 'error')
  }

  return (
    <main className="newsletter-governance-page">
      <section>
        <p className="hub-eyebrow">SATHIAN.AI / EMAIL</p>
        <h1>{state === 'done' ? 'You are off the list.' : 'Leave the writing list?'}</h1>
        {state === 'done' ? (
          <p>No more newsletter emails will be sent to this address. You can subscribe again from the website whenever you like.</p>
        ) : (
          <>
            <p>This confirmation step prevents email scanners from unsubscribing you automatically.</p>
            {state === 'error' && <p role="alert">That did not save. The link may be invalid, or the service may be temporarily unavailable.</p>}
            <button type="button" onClick={unsubscribe} disabled={state === 'saving' || !token}>
              {state === 'saving' ? 'Saving…' : 'Confirm unsubscribe'}
            </button>
          </>
        )}
        <a href="/">Return to sathian.ai</a>
      </section>
    </main>
  )
}
