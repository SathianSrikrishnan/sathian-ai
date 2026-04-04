"use client"

/**
 * Auth Gate — appears between wizard step 3 and step 4.
 * Google OAuth + email magic link. Styled to match fairy theme.
 */
import { useState, useEffect } from "react"
import { createBrowserSupabase } from "@/lib/supabase-auth"
import { C, glow } from "@/components/toothfairy/tokens"
import { SparkleIcon } from "@/components/toothfairy/fairy-icons"

interface AuthGateProps {
  childName: string
  onAuthenticated: (email: string) => void
  onBack: () => void
}

export function AuthGate({ childName, onAuthenticated, onBack }: AuthGateProps) {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [magicLinkSent, setMagicLinkSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const supabase = createBrowserSupabase()

  // Get the correct redirect URL based on current hostname
  const getRedirectUrl = () => {
    const origin = window.location.origin
    const hostname = window.location.hostname
    const isTfnDomain = hostname === 'toothfairy.network' || hostname === 'www.toothfairy.network'
    const nextPath = isTfnDomain ? '/app' : '/toothfairy/app'
    return `${origin}/api/auth/callback?next=${nextPath}`
  }

  const handleGoogleSignIn = () => {
    setLoading(true)
    setError(null)
    // Direct Google OAuth — bypasses Supabase redirect, no supabase.co domain exposure
    const hostname = window.location.hostname
    const isTfnDomain = hostname === "toothfairy.network" || hostname === "www.toothfairy.network"
    const nextPath = isTfnDomain ? "/app" : "/toothfairy/app"
    window.location.href = `/api/auth/google?next=${encodeURIComponent(nextPath)}`
  }

  const handleMagicLink = async () => {
    if (!email.trim()) return
    setLoading(true)
    setError(null)
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: {
          emailRedirectTo: getRedirectUrl(),
        },
      })
      if (error) throw error
      setMagicLinkSent(true)
    } catch (err: any) {
      setError(err.message || "Failed to send magic link")
    }
    setLoading(false)
  }

  // Check if user is already authenticated (from OAuth redirect back)
  const checkExistingSession = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user?.email) {
      onAuthenticated(user.email)
      return true
    }
    return false
  }

  // Check on mount — if returning from OAuth, session may already exist
  useEffect(() => {
    checkExistingSession()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (magicLinkSent) {
    return (
      <div className="w-full max-w-md animate-fadeIn">
        <div
          className="rounded-[18px] px-6 py-8 text-center"
          style={{
            background: "rgba(14, 21, 48, 0.6)",
            border: "1px solid rgba(240, 196, 86, 0.18)",
            boxShadow: glow.gold,
            backdropFilter: "blur(24px)",
          }}
        >
          <div className="text-4xl mb-4">✉️</div>
          <h3
            className="text-lg font-bold mb-2"
            style={{ color: C.gold, fontFamily: "'Nunito', sans-serif" }}
          >
            Check your email!
          </h3>
          <p className="text-sm mb-4" style={{ color: C.muted }}>
            We sent a magic link to <strong style={{ color: C.text }}>{email}</strong>.
            Click it to continue minting {childName}&apos;s tooth.
          </p>
          <button
            onClick={() => { setMagicLinkSent(false); setEmail("") }}
            className="text-xs underline"
            style={{ color: C.teal }}
          >
            Use a different email
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md animate-fadeIn">
      <div
        className="rounded-[18px] px-6 py-6 text-center"
        style={{
          background: "rgba(14, 21, 48, 0.6)",
          border: "1px solid rgba(240, 196, 86, 0.18)",
          boxShadow: glow.gold,
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
        }}
      >
        <SparkleIcon size={32} className="mx-auto mb-3" />

        <h3
          className="text-lg font-bold mb-1"
          style={{ color: C.gold, fontFamily: "'Nunito', sans-serif" }}
        >
          One last step to save {childName}&apos;s tooth
        </h3>
        <p className="text-sm mb-5" style={{ color: C.muted }}>
          We need your email so you can always find {childName}&apos;s keepsakes
        </p>

        {/* Google OAuth */}
        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full rounded-xl px-4 py-3.5 text-sm font-semibold flex items-center justify-center gap-3 mb-4 transition-all hover:scale-[1.01] disabled:opacity-50"
          style={{
            background: "#fff",
            color: "#1f2937",
            border: "none",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
            <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.1)" }} />
          <span className="text-xs" style={{ color: C.dim }}>or</span>
          <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.1)" }} />
        </div>

        {/* Email magic link */}
        <div className="flex gap-2 mb-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            onKeyDown={(e) => e.key === "Enter" && handleMagicLink()}
            className="flex-1 rounded-xl px-4 py-3 text-sm outline-none transition-all focus:border-[rgba(240,196,86,0.6)]"
            style={{
              background: "rgba(14, 21, 48, 0.8)",
              border: "1px solid rgba(240,196,86,0.3)",
              color: "#F0ECFF",
            }}
          />
          <button
            onClick={handleMagicLink}
            disabled={loading || !email.trim()}
            className="fairy-btn px-4 disabled:opacity-40"
          >
            {loading ? "..." : "Go"}
          </button>
        </div>
        <p className="text-xs mb-4" style={{ color: C.dim }}>
          We&apos;ll send you a sign-in link
        </p>

        {error && (
          <p className="text-xs mb-3" style={{ color: C.ember }}>{error}</p>
        )}

        <button
          onClick={onBack}
          className="fairy-btn-secondary w-full"
        >
          Back
        </button>
      </div>
    </div>
  )
}
