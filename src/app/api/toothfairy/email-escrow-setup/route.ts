/**
 * POST /api/toothfairy/email-escrow-setup
 *
 * Server-side escrow setup for email (non-crypto) users.
 * The TFN server wallet acts as guardian and signs the transaction.
 * Uses a hash of the user's email to derive a unique child wallet PDA,
 * avoiding collisions when multiple email users use the same child name.
 *
 * Flow: derive child wallet → init child profile → create milestone → sign & send.
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
import { createHash } from "crypto"
import idl from "@/lib/toothfairy/escrow-idl.json"
import { requireToothFairyAdminRequest } from "@/lib/toothfairy/admin-guard"

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

/**
 * Derive a deterministic child wallet PDA from the server wallet + email + child name.
 * This avoids collisions: two parents both naming their kid "Isa" get different PDAs.
 */
function deriveEmailChildWallet(serverWallet: PublicKey, email: string, childName: string): PublicKey {
  const emailHash = createHash("sha256").update(email.toLowerCase().trim()).digest().slice(0, 16)
  const [derived] = PublicKey.findProgramAddressSync(
    [Buffer.from("tfn_child"), serverWallet.toBuffer(), emailHash, Buffer.from(childName.toLowerCase().trim())],
    PROGRAM_ID
  )
  return derived
}

function loadServerKeypair(): Keypair {
  const secretKeyBase64 = process.env.TFN_MINT_SECRET_KEY
  if (!secretKeyBase64) throw new Error("TFN_MINT_SECRET_KEY not set")
  const keypairBytes = new Uint8Array(Buffer.from(secretKeyBase64, "base64"))
  return Keypair.fromSecretKey(keypairBytes)
}

export async function POST(request: NextRequest) {
  const unauthorized = requireToothFairyAdminRequest(request)
  if (unauthorized) return unauthorized

  try {
    const body = await request.json()
    const { email, childName, toothType, metadataUri } = body

    if (!email || !childName || !toothType) {
      return NextResponse.json(
        { error: "Missing required fields: email, childName, toothType" },
        { status: 400 }
      )
    }

    const rpc = process.env.NEXT_PUBLIC_SOLANA_RPC
    if (!rpc) throw new Error("NEXT_PUBLIC_SOLANA_RPC not set")

    const connection = new Connection(rpc, "confirmed")
    const serverKeypair = loadServerKeypair()
    const guardianPubkey = serverKeypair.publicKey

    // Derive child wallet using email hash to avoid collisions
    const childPubkey = deriveEmailChildWallet(guardianPubkey, email, childName)
    const [childProfilePda] = getChildProfilePDA(childPubkey)

    // Check profile state via Anchor
    const wallet = new Wallet(serverKeypair)
    const provider = new AnchorProvider(connection, wallet, { commitment: "confirmed" })
    const program: any = new Program(idl as any, provider)

    let profileExists = false
    let milestoneIndex = 0
    try {
      const profile = await program.account.childProfile.fetch(childProfilePda)
      profileExists = true
      milestoneIndex = profile.milestoneCount
    } catch {
      profileExists = false
      milestoneIndex = 0
    }

    const [milestonePda] = getMilestonePDA(childProfilePda, milestoneIndex)

    // Check if milestone already exists
    const milestoneInfo = await connection.getAccountInfo(milestonePda)
    if (milestoneInfo !== null) {
      return NextResponse.json({
        childProfilePda: childProfilePda.toBase58(),
        milestonePda: milestonePda.toBase58(),
        childWallet: childPubkey.toBase58(),
        milestoneIndex,
        alreadyExists: true,
      })
    }

    // Build transaction: init_child (if needed) + create_milestone
    const tx = new Transaction()

    if (!profileExists) {
      const initIx = await program.methods
        .initializeChild(childName)
        .accounts({
          guardian: guardianPubkey,
          childWallet: childPubkey,
          childProfile: childProfilePda,
          systemProgram: SystemProgram.programId,
        })
        .instruction()
      tx.add(initIx)
    }

    const toothTypeArg = { [toothType]: {} }
    const uri = metadataUri || "https://toothfairy.network"

    const createMilestoneIx = await program.methods
      .createMilestone(toothTypeArg, uri)
      .accounts({
        guardian: guardianPubkey,
        childProfile: childProfilePda,
        milestone: milestonePda,
        systemProgram: SystemProgram.programId,
      })
      .instruction()
    tx.add(createMilestoneIx)

    // Sign and send — server wallet is both fee payer and guardian
    const { blockhash } = await connection.getLatestBlockhash("confirmed")
    tx.recentBlockhash = blockhash
    tx.feePayer = guardianPubkey
    tx.sign(serverKeypair)

    const signature = await connection.sendRawTransaction(tx.serialize())
    await connection.confirmTransaction(signature, "confirmed")

    // Escrow created

    return NextResponse.json({
      success: true,
      childProfilePda: childProfilePda.toBase58(),
      milestonePda: milestonePda.toBase58(),
      childWallet: childPubkey.toBase58(),
      milestoneIndex,
      signature,
      alreadyExists: false,
    })
  } catch (error: any) {
    console.error("[email-escrow] Error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to set up escrow for email user" },
      { status: 500 }
    )
  }
}
