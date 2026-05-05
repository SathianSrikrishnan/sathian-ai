import { NextRequest, NextResponse } from "next/server"

const ADMIN_SECRET_ENV_KEYS = [
  "TFN_ADMIN_SECRET",
  "TOOTHFAIRY_ADMIN_SECRET",
  "CRON_SECRET",
]

function configuredSecret() {
  for (const key of ADMIN_SECRET_ENV_KEYS) {
    const value = process.env[key]
    if (value && value.trim().length > 0) return value
  }
  return null
}

function bearerToken(request: NextRequest) {
  const auth = request.headers.get("authorization") || ""
  if (!auth.toLowerCase().startsWith("bearer ")) return null
  return auth.slice("bearer ".length).trim()
}

export function requireToothFairyAdminRequest(request: NextRequest) {
  const secret = configuredSecret()
  const provided =
    request.headers.get("x-tfn-admin-secret") ||
    bearerToken(request) ||
    request.nextUrl.searchParams.get("admin_secret")

  if (!secret || provided !== secret) {
    return NextResponse.json({ error: "not_found" }, { status: 404 })
  }

  return null
}

export function internalToothFairyHeaders(): HeadersInit {
  const secret = configuredSecret()
  return secret ? { "x-tfn-admin-secret": secret } : {}
}
