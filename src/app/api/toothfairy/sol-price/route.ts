import { NextResponse } from "next/server"

export const dynamic = "force-dynamic"

// Cache SOL price for 5 minutes to avoid hammering the API
let cachedPrice: { price: number; source: string; fetchedAt: number } | null = null
const CACHE_TTL_MS = 5 * 60 * 1000

export async function GET() {
  // Return cache if fresh
  if (cachedPrice && Date.now() - cachedPrice.fetchedAt < CACHE_TTL_MS) {
    return NextResponse.json(cachedPrice, {
      headers: { "Cache-Control": "public, max-age=300" },
    })
  }

  // Try CoinGecko free API (no key needed)
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd",
      { next: { revalidate: 300 } }
    )
    if (res.ok) {
      const data = await res.json()
      const price = data?.solana?.usd
      if (typeof price === "number" && price > 0) {
        cachedPrice = { price, source: "coingecko", fetchedAt: Date.now() }
        return NextResponse.json(cachedPrice, {
          headers: { "Cache-Control": "public, max-age=300" },
        })
      }
    }
  } catch {
    // Fall through to fallback
  }

  // Fallback: return last known or static estimate
  const fallback = cachedPrice || { price: 150, source: "fallback", fetchedAt: Date.now() }
  return NextResponse.json(fallback, {
    headers: { "Cache-Control": "public, max-age=60" },
  })
}
