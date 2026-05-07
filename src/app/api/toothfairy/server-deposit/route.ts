/**
 * POST /api/toothfairy/server-deposit
 *
 * Public card gifts are intentionally paused. A server-funded deposit endpoint
 * must not move SOL until it is tied to a verified payment intent and webhook.
 */
import { NextResponse } from "next/server"

export async function POST() {
  return NextResponse.json(
    {
      error: "Card gifts are not enabled yet.",
      nextStep:
        "Use a Solana wallet for controlled testing, or share the keepsake link without a gift.",
    },
    { status: 410 },
  )
}
