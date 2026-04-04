/**
 * POST /api/toothfairy/onramp
 *
 * Generates a Coinbase Onramp session token + URL.
 * Parent sends fiat via Apple Pay / card → SOL delivered to server wallet.
 * Server then calls escrow deposit() with the parent's chosen lock period.
 *
 * Request body: { amountUsd, lockChoice, depositorName, childProfilePda, milestonePda, childDob? }
 * Returns: { onrampUrl, sessionId }
 */
import { NextRequest, NextResponse } from "next/server"
import crypto from "crypto"

export const maxDuration = 30

// Server wallet — SOL arrives here, then gets deposited to escrow
const SERVER_WALLET = "BcXBqUqEdKuK6ZRSKi4C2Q6LmhdE8BzA19YgX6gTg76"

const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:3003",
  "https://sathian.ai",
  "https://www.sathian.ai",
  "https://toothfairy.network",
  "https://www.toothfairy.network",
]

/**
 * Generate a CDP JWT (Ed25519 / EdDSA) for Coinbase API auth.
 * Uses Node.js native crypto — no external SDK needed.
 *
 * Key format: base64-encoded 64 bytes = 32-byte seed + 32-byte public key
 * Algorithm: EdDSA (Ed25519)
 * Matches @coinbase/cdp-sdk buildEdwardsJWT() exactly.
 */
function generateCdpJwt(
  method: string,
  host: string,
  path: string,
): string {
  const keyId = process.env.CDP_API_KEY_ID
  const keySecret = process.env.CDP_API_KEY_SECRET
  if (!keyId || !keySecret) throw new Error("CDP_API_KEY_ID or CDP_API_KEY_SECRET not set")

  const now = Math.floor(Date.now() / 1000)
  const nonce = crypto.randomBytes(16).toString("hex")
  const uri = `${method} ${host}${path}`

  // JWT Header — must be EdDSA for Ed25519 keys
  const header = {
    alg: "EdDSA",
    kid: keyId,
    typ: "JWT",
    nonce,
  }

  // JWT Payload — matches CDP SDK exactly
  const payload = {
    sub: keyId,
    iss: "cdp",
    nbf: now,
    iat: now,
    exp: now + 120,
    uris: [uri],
  }

  const b64url = (obj: object) =>
    Buffer.from(JSON.stringify(obj)).toString("base64url")

  const headerB64 = b64url(header)
  const payloadB64 = b64url(payload)
  const signingInput = `${headerB64}.${payloadB64}`

  // Decode the base64 secret: 64 bytes = 32-byte Ed25519 seed + 32-byte public key
  const secretBytes = Buffer.from(keySecret, "base64")
  const seed = secretBytes.subarray(0, 32)
  const pubKeyBytes = secretBytes.subarray(32, 64)

  // Build Ed25519 private key from JWK (Node.js native crypto)
  const privateKey = crypto.createPrivateKey({
    key: {
      kty: "OKP",
      crv: "Ed25519",
      d: seed.toString("base64url"),
      x: pubKeyBytes.toString("base64url"),
    },
    format: "jwk",
  })

  // Sign with Ed25519
  const signature = crypto.sign(null, Buffer.from(signingInput), privateKey)

  return `${signingInput}.${Buffer.from(signature).toString("base64url")}`
}

export async function POST(request: NextRequest) {
  // Origin check
  const origin = request.headers.get("origin")
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    return NextResponse.json({ error: "Unauthorized origin" }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { amountUsd, lockChoice, depositorName, childProfilePda, milestonePda, childDob } = body

    if (!amountUsd || !childProfilePda || !milestonePda) {
      return NextResponse.json({ error: "Missing required fields: amountUsd, childProfilePda, milestonePda" }, { status: 400 })
    }

    // Generate JWT for Coinbase API
    const jwt = generateCdpJwt(
      "POST",
      "api.developer.coinbase.com",
      "/onramp/v1/token",
    )

    // Get client IP (Coinbase requires it, rejects private IPs)
    let clientIp =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "203.0.113.1" // RFC 5737 documentation IP as fallback

    // Replace private IPs with documentation IP for local dev
    if (clientIp.startsWith("192.168.") || clientIp.startsWith("10.") || clientIp === "127.0.0.1" || clientIp === "::1") {
      clientIp = "203.0.113.1"
    }

    // Generate a session ID to track this deposit intent
    const sessionId = crypto.randomUUID()

    // Request session token from Coinbase
    const cbResponse = await fetch("https://api.developer.coinbase.com/onramp/v1/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        addresses: [{ address: SERVER_WALLET, blockchains: ["solana"] }],
        assets: ["SOL"],
        clientIp,
      }),
    })

    if (!cbResponse.ok) {
      const errText = await cbResponse.text()
      console.error("[onramp] Coinbase token error:", cbResponse.status, errText)
      return NextResponse.json(
        { error: "Failed to create onramp session", details: errText },
        { status: cbResponse.status },
      )
    }

    const cbData = await cbResponse.json()
    const sessionToken = cbData.token

    // Build the Coinbase Onramp URL with presets
    const params = new URLSearchParams({
      sessionToken,
      defaultAsset: "SOL",
      defaultNetwork: "solana",
      presetFiatAmount: String(amountUsd),
      fiatCurrency: "USD",
      // Sandbox mode for testing — remove "sandbox-" prefix for production
      partnerUserId: `tfn-${sessionId.substring(0, 40)}`,
    })

    const onrampUrl = `https://pay.coinbase.com/buy/select-asset?${params.toString()}`

    // Store the pending deposit intent (for when SOL arrives)
    // In production, this would go to a database. For hackathon, we use a simple approach.
    // The server-deposit route will be called manually after Coinbase confirms.
    console.log("[onramp] Session created:", {
      sessionId,
      amountUsd,
      lockChoice,
      depositorName,
      childProfilePda,
      milestonePda,
      childDob,
    })

    return NextResponse.json({
      onrampUrl,
      sessionId,
      sessionToken,
      serverWallet: SERVER_WALLET,
    })
  } catch (error: any) {
    console.error("[onramp] Error:", error)
    return NextResponse.json(
      { error: error.message || "Onramp session creation failed" },
      { status: 500 },
    )
  }
}
