/**
 * POST /api/toothfairy/onramp
 *
 * Card gifts are intentionally paused until payment provider, webhook,
 * stored-intent, fee, receipt, and refund behavior are production-ready.
 */
import { NextResponse } from "next/server"

export async function POST() {
  return NextResponse.json(
    {
      error: "Card gifts are not enabled yet.",
      nextStep:
        "Share the keepsake first. Family wallet gifts can be tested separately.",
    },
    { status: 410 },
  )
}
