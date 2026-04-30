/**
 * GET /api/auth/callback
 *
 * Handles OAuth and magic link callbacks from Supabase Auth.
 * After auth completes, redirects to the wizard or profile page.
 */
import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/app"

  // Use the host header to preserve the original domain (toothfairy.network vs sathian.ai)
  const host = request.headers.get("host") || request.headers.get("x-forwarded-host") || "toothfairy.network"
  const protocol = host.includes("localhost") ? "http" : "https"
  const origin = `${protocol}://${host}`

  if (code) {
    // Append returning=auth so the wizard knows this is an OAuth return
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
          setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
            cookiesToSet.forEach(({ name, value, options }) => {
              response.cookies.set(name, value, options as any)
            })
          },
        },
      }
    )

    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Fire the welcome email (Tanda's intro + "read the three stories" CTA).
      // Fire-and-forget — we don't want auth return blocked on Resend latency.
      // Distinct from the post-mint keepsake email fired by /api/toothfairy/mint.
      const email = data.session?.user?.email
      const name = (data.session?.user?.user_metadata?.full_name as string | undefined) ?? undefined
      if (email) {
        fetch(`${origin}/api/toothfairy/welcome-email`, {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ email, name }),
        }).catch((err) => console.error("[auth.callback] welcome-email dispatch failed:", err))
      }
      return response
    }
  }

  // Auth failed — redirect to landing with error
  return NextResponse.redirect(new URL("/app?auth_error=1", origin))
}
