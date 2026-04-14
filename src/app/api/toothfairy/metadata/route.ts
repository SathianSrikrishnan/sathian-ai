/**
 * GET /api/toothfairy/metadata?child=Isa&tooth=1&type=Upper+Right+Central+Incisor
 *
 * Returns Metaplex-compatible metadata JSON for a tooth cNFT.
 * Used as a fallback when Arweave upload is skipped (testing/MVP).
 */
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const childName = searchParams.get("child") || "Unknown"
  const toothNumber = searchParams.get("tooth") || "1"
  const toothType = searchParams.get("type") || "Baby Tooth"

  const metadata = {
    name: `${childName}'s Tooth #${toothNumber}`,
    symbol: "TFN",
    description: `A childhood milestone from ${childName}'s journey, preserved on the Tooth Fairy Network.`,
    image: "https://sathian.ai/toothfairy/tooth-placeholder.svg",
    external_url: "https://toothfairy.network",
    attributes: [
      { trait_type: "Child", value: childName },
      { trait_type: "Tooth Type", value: toothType },
      { trait_type: "Tooth Number", value: toothNumber },
      { trait_type: "Network", value: "Tooth Fairy Network" },
      { trait_type: "Milestone", value: "Baby Tooth Lost" },
    ],
    properties: {
      category: "image",
      files: [
        {
          uri: "https://sathian.ai/toothfairy/tooth-placeholder.svg",
          type: "image/png",
        },
      ],
    },
  }

  return NextResponse.json(metadata, {
    headers: {
      "Cache-Control": "public, max-age=31536000, immutable",
      "Access-Control-Allow-Origin": "*",
    },
  })
}
