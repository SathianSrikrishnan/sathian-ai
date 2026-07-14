'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Script from 'next/script'

interface TurnstileApi {
  render(
    element: HTMLElement,
    options: {
      sitekey: string
      action: string
      theme: 'light'
      size: 'flexible'
      callback(token: string): void
      'expired-callback'(): void
      'error-callback'(): void
    },
  ): string
  remove(widgetId: string): void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

export const AGENT_FILE_INTAKE_CONFIGURED = Boolean(
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
)

export function AgentFileVerification({
  onToken,
}: {
  onToken(token: string | null): void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetRef = useRef<string | null>(null)
  const [scriptReady, setScriptReady] = useState(false)
  const [verified, setVerified] = useState(false)
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

  const renderWidget = useCallback(() => {
    if (!siteKey || !containerRef.current || !window.turnstile || widgetRef.current) return
    widgetRef.current = window.turnstile.render(containerRef.current, {
      sitekey: siteKey,
      action: 'turnstile-spin-v1',
      theme: 'light',
      size: 'flexible',
      callback(token) {
        setVerified(true)
        onToken(token)
      },
      'expired-callback'() {
        setVerified(false)
        onToken(null)
      },
      'error-callback'() {
        setVerified(false)
        onToken(null)
      },
    })
  }, [onToken, siteKey])

  useEffect(() => {
    if (scriptReady) renderWidget()
  }, [renderWidget, scriptReady])

  useEffect(() => () => {
    if (widgetRef.current && window.turnstile) {
      window.turnstile.remove(widgetRef.current)
      widgetRef.current = null
    }
  }, [])

  if (!siteKey) {
    return <p className="text-[11px] leading-relaxed text-amber-700">Secure file verification is not active yet.</p>
  }

  return (
    <div className="mt-3 border-t border-gray-200 pt-3">
      <Script
        id="agent-file-turnstile"
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="lazyOnload"
        onLoad={() => setScriptReady(true)}
        onReady={() => setScriptReady(true)}
      />
      <div
        ref={containerRef}
        data-action="turnstile-spin-v1"
        aria-label="Human verification for secure file intake"
        className="min-h-16"
      />
      <p className={`mt-1 text-[11px] ${verified ? 'text-emerald-700' : 'text-gray-500'}`} aria-live="polite">
        {verified ? 'Human check complete.' : 'Complete the human check before sending the file.'}
      </p>
    </div>
  )
}
