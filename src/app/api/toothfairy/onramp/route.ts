/**
 * POST /api/toothfairy/onramp
 *
 * Creates a signed MoonPay widget URL for the Colosseum live-proof path.
 * This is intentionally an on-ramp proof only: it sends purchased SOL to the
 * user's wallet, then the wallet/Blink path records the family gift on-chain.
 */
import { createHmac } from "crypto"
import { NextRequest, NextResponse } from "next/server"
import { PublicKey } from "@solana/web3.js"

const MIN_AMOUNT_USD = 5
const MAX_AMOUNT_USD = 500

type OnrampBody = {
  amountUsd?: unknown
  walletAddress?: unknown
  milestonePda?: unknown
  childProfilePda?: unknown
  depositorName?: unknown
}

const getString = (value: unknown) =>
  typeof value === "string" ? value.trim() : ""

const getAmountUsd = (value: unknown) => {
  const amount = Number(value)
  if (!Number.isFinite(amount)) return MIN_AMOUNT_USD
  return Math.min(MAX_AMOUNT_USD, Math.max(MIN_AMOUNT_USD, Math.round(amount)))
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.MOONPAY_API_KEY || process.env.MOONPAY_PUBLIC_KEY
  const secretKey = process.env.MOONPAY_SECRET_KEY

  if (!apiKey || !secretKey) {
    return NextResponse.json(
      {
        error: "MoonPay is not configured yet.",
        missing: [
          !apiKey ? "MOONPAY_API_KEY" : null,
          !secretKey ? "MOONPAY_SECRET_KEY" : null,
        ].filter(Boolean),
      },
      { status: 503 },
    )
  }

  let body: OnrampBody
  try {
    body = (await request.json()) as OnrampBody
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  let walletAddress: string
  try {
    walletAddress = new PublicKey(getString(body.walletAddress)).toBase58()
  } catch {
    return NextResponse.json(
      { error: "A valid destination wallet is required for MoonPay." },
      { status: 400 },
    )
  }

  const amountUsd = getAmountUsd(body.amountUsd)
  const milestonePda = getString(body.milestonePda)
  const childProfilePda = getString(body.childProfilePda)
  const depositorName = getString(body.depositorName) || "Family"
  const baseUrl =
    process.env.MOONPAY_BUY_BASE_URL ||
    (process.env.MOONPAY_ENVIRONMENT === "sandbox"
      ? "https://buy-sandbox.moonpay.com"
      : "https://buy.moonpay.com")

  const url = new URL(baseUrl)
  url.searchParams.set("apiKey", apiKey)
  url.searchParams.set("currencyCode", "sol")
  url.searchParams.set("baseCurrencyCode", "usd")
  url.searchParams.set("baseCurrencyAmount", String(amountUsd))
  url.searchParams.set("lockAmount", "true")
  url.searchParams.set("walletAddress", walletAddress)
  url.searchParams.set("theme", "light")
  url.searchParams.set("colorCode", "#D7A84A")
  url.searchParams.set("language", "en")
  url.searchParams.set(
    "externalTransactionId",
    `tfn-${milestonePda || "milestone"}-${Date.now()}`.slice(0, 128),
  )
  url.searchParams.set(
    "externalCustomerId",
    `tfn-${childProfilePda || depositorName}`.slice(0, 128),
  )

  if (process.env.MOONPAY_REDIRECT_URL) {
    url.searchParams.set("redirectURL", process.env.MOONPAY_REDIRECT_URL)
  }

  const signature = createHmac("sha256", secretKey)
    .update(url.search)
    .digest("base64")
  url.searchParams.set("signature", signature)

  return NextResponse.json({
    onrampUrl: url.toString(),
    provider: "moonpay",
    amountUsd,
    currencyCode: "sol",
    walletAddress,
  })
}
