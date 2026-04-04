/**
 * POST /api/toothfairy/setup-tree
 *
 * One-time endpoint to create the Merkle tree for cNFT minting.
 * Call once, then save the returned merkleTree address to .env.local as TFN_MERKLE_TREE.
 *
 * Costs ~0.7 SOL for depth 14 (16,384 capacity).
 * Upgrade to depth 20 (~7.7 SOL) when approaching limit.
 */
import { NextResponse } from "next/server"
import { setupMerkleTree } from "@/lib/toothfairy/cnft"

export async function POST() {
  try {
    // Safety: only allow in development
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "Tree setup disabled in production. Run locally." },
        { status: 403 }
      )
    }

    const result = await setupMerkleTree()

    return NextResponse.json({
      success: true,
      merkleTree: result.merkleTree,
      signature: result.signature,
      instructions: `Add to .env.local: TFN_MERKLE_TREE=${result.merkleTree}`,
    })
  } catch (error: any) {
    console.error("Setup tree error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to create Merkle tree" },
      { status: 500 }
    )
  }
}
