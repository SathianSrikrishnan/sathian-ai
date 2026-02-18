'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function StudioLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/studio/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      router.push('/studio')
    } else {
      setError('Wrong password')
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: '#0A0A0F',
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          width: 320,
          padding: 32,
        }}
      >
        <h1
          style={{
            fontFamily: 'monospace',
            fontSize: 18,
            color: '#E6EDF3',
            marginBottom: 8,
            textAlign: 'center',
          }}
        >
          Studio
        </h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoFocus
          style={{
            fontFamily: 'monospace',
            fontSize: 14,
            padding: '10px 14px',
            background: '#111118',
            border: '1px solid #1E1E2A',
            borderRadius: 6,
            color: '#E6EDF3',
            outline: 'none',
          }}
        />
        {error && (
          <p style={{ fontFamily: 'monospace', fontSize: 12, color: '#EF4444', textAlign: 'center' }}>
            {error}
          </p>
        )}
        <button
          type="submit"
          disabled={loading}
          style={{
            fontFamily: 'monospace',
            fontSize: 14,
            padding: '10px 14px',
            background: loading ? '#1E1E2A' : '#8B5CF6',
            border: 'none',
            borderRadius: 6,
            color: '#fff',
            cursor: loading ? 'wait' : 'pointer',
          }}
        >
          {loading ? 'Entering...' : 'Enter'}
        </button>
      </form>
    </div>
  )
}
