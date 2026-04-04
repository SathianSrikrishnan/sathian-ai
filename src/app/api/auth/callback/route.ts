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

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Email now fires from the mint route (after keepsake is confirmed)
      // No email here — avoids sending a welcome before the mint succeeds
      return response
    }
  }

  // Auth failed — redirect to landing with error
  return NextResponse.redirect(new URL("/app?auth_error=1", origin))
}
