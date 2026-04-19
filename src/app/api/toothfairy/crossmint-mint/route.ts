import { NextRequest, NextResponse } from "next/server"

/**
 * Crossmint minting path is disabled.
 * The email-based Crossmint flow exposed collection internals via crossmint.com.
 * Re-enable when per-user collection scoping is implemented.
 */
export async function POST(req: NextRequest) {
  return NextResponse.json(
    { error: "Crossmint minting is currently disabled" },
    { status: 410 },
  )
}

// Previous implementation preserved in git history (pre-disable commit)
