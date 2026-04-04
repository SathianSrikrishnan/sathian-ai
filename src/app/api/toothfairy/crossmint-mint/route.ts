import { NextRequest, NextResponse } from "next/server"
import { mintToEmail } from "@/lib/toothfairy/crossmint"
import { uploadMetadata } from "@/lib/toothfairy/cnft"
import { checkRateLimit } from "@/lib/toothfairy/rate-limit"

// Arweave upload + Crossmint mint can take a while
export const maxDuration = 60

/**
 * Mint a tooth fairy cNFT to an email address via Crossmint.
 * For non-crypto users who don't have a Phantom wallet.
 *
 * Flow: Upload image to Arweave → Mint via Crossmint with Arweave URL → Return result.
 * Accepts either imageBase64 (preferred, uploaded to Arweave) or imageUrl (already hosted).
 */
export async function POST(req: NextRequest) {
  try {
    // Origin check
    const origin = req.headers.get("origin") || ""
    const allowed = ["https://toothfairy.network", "http://localhost:3000", "http://localhost:3001"]
    if (!allowed.some((o) => origin.startsWith(o))) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Rate limit (shares the mint rate limiter)
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
    const { allowed: ok } = checkRateLimit(ip)
    if (!ok) {
      return NextResponse.json({ error: "Rate limited" }, { status: 429 })
    }

    const body = await req.json()
    const { email, childName, imageBase64, imageMimeType, imageUrl, toothNumber } = body

    if (!email || !childName) {
      return NextResponse.json(
        { error: "email and childName are required" },
        { status: 400 },
      )
    }

    if (!imageBase64 && !imageUrl) {
      return NextResponse.json(
        { error: "Either imageBase64 or imageUrl is required" },
        { status: 400 },
      )
    }

    // Basic email validation
    if (!email.includes("@") || !email.includes(".")) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    const toothNum = toothNumber || 1

    // Upload to Arweave if we received base64, otherwise use provided URL
    let finalImageUrl = imageUrl
    let metadataUri: string | undefined

    if (imageBase64) {
      const imageBuffer = Buffer.from(imageBase64, "base64")
      const uploaded = await uploadMetadata(
        imageBuffer,
        imageMimeType || "image/png",
        childName,
        "UpperRightCentralIncisor",
        toothNum,
      )
      finalImageUrl = uploaded.imageUri
      metadataUri = uploaded.metadataUri
    }

    const result = await mintToEmail({
      recipientEmail: email,
      name: `${childName}'s Tooth #${toothNum}`,
      description: `A magical milestone in ${childName}'s journey — preserved forever on Solana by the Tooth Fairy Network.`,
      imageUrl: finalImageUrl,
      attributes: [
        { trait_type: "Child", value: childName },
        { trait_type: "Tooth", value: `#${toothNum}` },
        { trait_type: "Network", value: "Tooth Fairy Network" },
        { trait_type: "Year", value: new Date().getFullYear().toString() },
      ],
    })

    return NextResponse.json({
      success: true,
      actionId: result.actionId,
      id: result.id,
      imageUrl: finalImageUrl,
      metadataUri,
      message: `NFT minted and sent to ${email}. They'll receive an email from Crossmint.`,
    })
  } catch (err: any) {
    console.error("[crossmint-mint] Error:", err.message)
    return NextResponse.json(
      { error: err.message || "Crossmint mint failed" },
      { status: 500 },
    )
  }
}
