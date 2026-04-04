/**
 * GET /api/auth/google/callback
 *
 * Receives the authorization code from Google, exchanges it for tokens,
 * then uses Supabase signInWithIdToken to create a session.
 *
 * Flow: Google → this route → Supabase session → redirect to app
 * The user never sees the Supabase domain.
 */
import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("state") || "/app"
  const error = searchParams.get("error")

  const host =
    request.headers.get("host") ||
    request.headers.get("x-forwarded-host") ||
    "toothfairy.network"
  const protocol = host.includes("localhost") ? "http" : "https"
  const origin = `${protocol}://${host}`

  // Google denied or user cancelled
  if (error || !code) {
    return NextResponse.redirect(new URL("/app?auth_error=1", origin))
  }

  // Step 1: Exchange authorization code for tokens with Google
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: `${origin}/api/auth/google/callback`,
      grant_type: "authorization_code",
    }),
  })

  const tokens = await tokenRes.json()

  if (!tokens.id_token) {
    console.error("Google token exchange failed:", tokens)
    return NextResponse.redirect(new URL("/app?auth_error=1", origin))
  }

  // Step 2: Create Supabase session using the Google ID token
  const redirectUrl = new URL(next, origin)
  redirectUrl.searchParams.set("returning", "auth")
  const response = NextResponse.redirect(redirectUrl)

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(
          cookiesToSet: {
            name: string
            value: string
            options?: Record<string, unknown>
          }[]
        ) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options as any)
          })
        },
      },
    }
  )

  const { error: authError } = await supabase.auth.signInWithIdToken({
    provider: "google",
    token: tokens.id_token,
    access_token: tokens.access_token,
  })

  if (authError) {
    console.error("Supabase signInWithIdToken failed:", authError.message)
    return NextResponse.redirect(new URL("/app?auth_error=1", origin))
  }

  return response
}
