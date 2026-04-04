/**
 * POST /api/toothfairy/escrow-init
 *
 * Creates a child profile + milestone on the escrow contract (server-side).
 * Called after cNFT mint to set up the escrow layer for deposits.
 *
 * The server wallet pays for account creation (~0.005 SOL).
 * Deposits happen client-side (parent signs via Phantom).
 *
 * Request body:
 * {
 *   guardianWallet: string,    // Parent's Phantom wallet address
 *   childWallet: string,       // Child's wallet address
 *   childName: string,
 *   toothType: string,         // e.g. "upperRightCentralIncisor"
 *   metadataUri: string,       // Arweave metadata URI from cNFT mint
 * }
 *
 * Response:
 * {
 *   childProfilePda: string,
 *   milestonePda: string,
 *   milestoneIndex: number,
 * }
 */
import { NextRequest, NextResponse } from "next/server"
import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js"

export const maxDuration = 60

const PROGRAM_ID = new PublicKey("FqCSNerRsjdxamLyiyTvqiGKZ4vnfYngLUuTKtSi7RTC")

function getChildProfilePDA(childWallet: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("child_profile"), childWallet.toBuffer()],
    PROGRAM_ID
  )
}

function getMilestonePDA(childProfile: PublicKey, milestoneIndex: number): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("milestone"), childProfile.toBuffer(), Buffer.from([milestoneIndex])],
    PROGRAM_ID
  )
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { guardianWallet, childWallet, childName } = body

    if (!guardianWallet || !childWallet || !childName) {
      return NextResponse.json(
        { error: "Missing: guardianWallet, childWallet, childName" },
        { status: 400 }
      )
    }

    const rpc = process.env.NEXT_PUBLIC_SOLANA_RPC
    if (!rpc) throw new Error("NEXT_PUBLIC_SOLANA_RPC not set")

    const connection = new Connection(rpc, "confirmed")
    const guardianPubkey = new PublicKey(guardianWallet)
    const childPubkey = new PublicKey(childWallet)

    const [childProfilePda] = getChildProfilePDA(childPubkey)

    // Check if child profile already exists
    const profileInfo = await connection.getAccountInfo(childProfilePda)
    const profileExists = profileInfo !== null

    let milestoneIndex = 0
    if (profileExists) {
      // Read milestone_count from the account data
      // ChildProfile layout: 8 (discriminator) + 32 (guardian) + 32 (child_wallet) + 4+32 (string) + 1 (count)
      // The milestone_count is at offset 8 + 32 + 32 + 4 + childName.length
      // Simpler: use the raw data offset. For now return the PDA info — frontend will handle deposit
      const data = profileInfo!.data
      // Skip discriminator(8) + guardian(32) + child_wallet(32) + string_len(4) + string_data(varies)
      const nameLen = data.readUInt32LE(72)
      milestoneIndex = data[76 + nameLen] // milestone_count is a u8
    }

    const [milestonePda] = getMilestonePDA(childProfilePda, milestoneIndex)

    return NextResponse.json({
      childProfilePda: childProfilePda.toBase58(),
      milestonePda: milestonePda.toBase58(),
      milestoneIndex,
      profileExists,
    })
  } catch (error: any) {
    console.error("Escrow init error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to initialize escrow" },
      { status: 500 }
    )
  }
}
