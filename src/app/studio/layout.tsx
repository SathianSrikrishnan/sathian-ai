import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Studio — sathian.ai',
  robots: 'noindex, nofollow',
}

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: '#0A0A0F', color: '#E6EDF3', minHeight: '100vh' }}>
      <nav
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px',
          borderBottom: '1px solid #1E1E2A',
          position: 'sticky',
          top: 0,
          background: '#0A0A0F',
          zIndex: 50,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <Link
            href="/"
            style={{
              fontFamily: 'monospace',
              fontSize: 13,
              color: '#6B7280',
              textDecoration: 'none',
            }}
          >
            sathian.ai
          </Link>
          <Link
            href="/studio"
            style={{
              fontFamily: 'monospace',
              fontSize: 14,
              fontWeight: 600,
              color: '#E6EDF3',
              textDecoration: 'none',
            }}
          >
            Studio
          </Link>
        </div>
        <Link
          href="/studio/new"
          style={{
            fontFamily: 'monospace',
            fontSize: 13,
            color: '#8B5CF6',
            textDecoration: 'none',
            padding: '6px 14px',
            border: '1px solid #8B5CF633',
            borderRadius: 6,
          }}
        >
          + New Article
        </Link>
      </nav>
      {children}
    </div>
  )
}
