/**
 * Supabase Auth helpers for Next.js App Router.
 *
 * - createBrowserSupabase(): Client-side auth (React components)
 * - createServerSupabase(): Server-side auth (API routes, middleware)
 */
import { createBrowserClient, createServerClient } from "@supabase/ssr"
import { type NextRequest, NextResponse } from "next/server"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// ── Browser Client (use in React components) ──

export function createBrowserSupabase() {
  return createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY)
}

// ── Server Client for API Routes ──

export function createRouteSupabase(request: NextRequest) {
  const response = NextResponse.next()

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
        cookiesToSet.forEach(({ name, value, options }) => {
          request.cookies.set(name, value)
          response.cookies.set(name, value, options as any)
        })
      },
    },
  })

  return { supabase, response }
}

// ── Middleware Session Refresh ──

export async function updateSupabaseSession(request: NextRequest) {
  let response = NextResponse.next({ request })

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet: { name: string; value: string; options?: Record<string, unknown> }[]) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        response = NextResponse.next({ request })
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options as any)
        )
      },
    },
  })

  // This refreshes the session if expired — MUST be called
  await supabase.auth.getUser()

  return response
}
