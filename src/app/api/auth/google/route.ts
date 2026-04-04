/**
 * GET /api/auth/google
 *
 * Initiates Google OAuth directly — no Supabase intermediary.
 * Redirects browser to Google's consent screen, which then
 * redirects back to /api/auth/google/callback.
 */
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const host =
    request.headers.get("host") ||
    request.headers.get("x-forwarded-host") ||
    "toothfairy.network"
  const protocol = host.includes("localhost") ? "http" : "https"
  const origin = `${protocol}://${host}`

  const next = request.nextUrl.searchParams.get("next") || "/app"

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: `${origin}/api/auth/google/callback`,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "select_account",
    state: next,
  })

  return NextResponse.redirect(
    `https://accounts.google.com/o/oauth2/v2/auth?${params}`
  )
}
