/**
 * POST /api/toothfairy/escrow-setup
 *
 * Creates child profile + milestone on the escrow contract (NO NFT minting).
 * Uses `create_milestone` instead of `log_milestone` — cleaner, cheaper, no blank NFTs.
 *
 * Returns a partially-signed transaction for the guardian to sign in Phantom.
 */
import { NextRequest, NextResponse } from "next/server"
import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js"
import { Program, AnchorProvider, Wallet } from "@coral-xyz/anchor"
import idl from "@/lib/toothfairy/escrow-idl.json"

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
    const { guardianWallet, childWallet, childName, toothType, metadataUri } = body

    if (!guardianWallet || !childWallet || !childName || !toothType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const rpc = process.env.NEXT_PUBLIC_SOLANA_RPC
    if (!rpc) throw new Error("NEXT_PUBLIC_SOLANA_RPC not set")

    const connection = new Connection(rpc, "confirmed")
    const guardianPubkey = new PublicKey(guardianWallet)
    const childPubkey = new PublicKey(childWallet)

    const [childProfilePda] = getChildProfilePDA(childPubkey)

    // Guardian and child wallet PDAs derived

    // Check if profile exists and get milestone count via Anchor (not raw bytes)
    const dummyKeypair = Keypair.generate()
    const dummyWallet = new Wallet(dummyKeypair)
    const provider = new AnchorProvider(connection, dummyWallet, { commitment: "confirmed" })
    const program: any = new Program(idl as any, provider)

    let profileExists = false
    let milestoneIndex = 0
    try {
      const profile = await program.account.childProfile.fetch(childProfilePda)
      profileExists = true
      milestoneIndex = profile.milestoneCount
      // Profile exists
    } catch {
      // Profile doesn't exist yet — will be created
      profileExists = false
      milestoneIndex = 0
      // Profile not found — will create
    }

    const [milestonePda] = getMilestonePDA(childProfilePda, milestoneIndex)

    // Check if milestone already exists
    const milestoneInfo = await connection.getAccountInfo(milestonePda)
    if (milestoneInfo !== null) {
      return NextResponse.json({
        childProfilePda: childProfilePda.toBase58(),
        milestonePda: milestonePda.toBase58(),
        milestoneIndex,
        alreadyExists: true,
      })
    }

    const toothTypeArg = { [toothType]: {} }
    const uri = metadataUri || "https://toothfairy.network"
    const { blockhash } = await connection.getLatestBlockhash("confirmed")

    // If profile doesn't exist, create it in a separate transaction first
    let initTransaction: string | undefined
    if (!profileExists) {
      const initTx = new Transaction()
      const initIx = await program.methods
        .initializeChild(childName)
        .accounts({
          guardian: guardianPubkey,
          childWallet: childPubkey,
          childProfile: childProfilePda,
          systemProgram: SystemProgram.programId,
        })
        .instruction()
      initTx.add(initIx)
      initTx.recentBlockhash = blockhash
      initTx.feePayer = guardianPubkey
      initTransaction = initTx.serialize({ requireAllSignatures: false }).toString("base64")
      // initializeChild tx built
    }

    // Build milestone creation transaction
    const milestoneTx = new Transaction()
    const createMilestoneIx = await program.methods
      .createMilestone(toothTypeArg, uri)
      .accounts({
        guardian: guardianPubkey,
        childProfile: childProfilePda,
        milestone: milestonePda,
        systemProgram: SystemProgram.programId,
      })
      .instruction()
    milestoneTx.add(createMilestoneIx)
    milestoneTx.recentBlockhash = blockhash
    milestoneTx.feePayer = guardianPubkey
    const milestoneTransaction = milestoneTx.serialize({ requireAllSignatures: false }).toString("base64")
    // createMilestone tx built

    return NextResponse.json({
      transaction: milestoneTransaction,
      initTransaction,
      childProfilePda: childProfilePda.toBase58(),
      milestonePda: milestonePda.toBase58(),
      milestoneIndex,
      alreadyExists: false,
      needsInit: !profileExists,
    })
  } catch (error: any) {
    console.error("Escrow setup error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to set up escrow" },
      { status: 500 }
    )
  }
}
