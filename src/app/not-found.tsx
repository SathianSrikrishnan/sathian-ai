import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 — sathian.ai',
  description: 'Page not found.',
}

export default function NotFound() {
  return (
    <div
      data-theme="dark"
      style={{
        background: 'var(--hub-bg-primary)',
        color: 'var(--hub-text-primary)',
        minHeight: '100dvh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        textAlign: 'center',
      }}
    >
      <p
        className="hub-mono"
        style={{ fontSize: 13, color: 'var(--hub-text-muted)', marginBottom: 16, letterSpacing: '0.15em' }}
      >
        404
      </p>
      <h1
        className="hub-hero-name"
        style={{ fontSize: 'clamp(32px, 5vw, 48px)', marginBottom: 16 }}
      >
        Nothing here
      </h1>
      <p style={{ color: 'var(--hub-text-secondary)', fontSize: 16, maxWidth: 400, marginBottom: 32, lineHeight: 1.6 }}>
        The page you&apos;re looking for doesn&apos;t exist. It may have moved, or you may have followed a broken link.
      </p>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link
          href="/"
          style={{
            color: 'var(--hub-accent)',
            textDecoration: 'none',
            fontSize: 14,
            borderBottom: '1px solid var(--hub-accent)',
            paddingBottom: 2,
          }}
        >
          Go home
        </Link>
        <Link
          href="/writings"
          style={{
            color: 'var(--hub-text-muted)',
            textDecoration: 'none',
            fontSize: 14,
            borderBottom: '1px solid var(--hub-border-subtle)',
            paddingBottom: 2,
          }}
        >
          Read something
        </Link>
      </div>
    </div>
  )
}
