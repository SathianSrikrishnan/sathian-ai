/**
 * Solana Actions / Blinks — Deposit SOL for a child's tooth
 *
 * GET  → Returns the Action metadata (title, description, inputs)
 * POST → Builds and returns an unsigned transaction for the wallet to sign
 *
 * URL format: /api/toothfairy/actions/deposit?milestone=<PDA>&profile=<PDA>&name=<childName>
 *
 * This enables one-click deposits from any Solana wallet (Phantom, Backpack, etc.)
 * via Blinks shared on Twitter/X, Discord, or any platform that supports Solana Actions.
 */
import { NextRequest, NextResponse } from "next/server"
import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  Keypair,
} from "@solana/web3.js"
import { Program, AnchorProvider, Wallet } from "@coral-xyz/anchor"
import idl from "@/lib/toothfairy/escrow-idl.json"

const PROGRAM_ID = new PublicKey("FqCSNerRsjdxamLyiyTvqiGKZ4vnfYngLUuTKtSi7RTC")
const ACTIONS_CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, Content-Encoding, Accept-Encoding",
  "Access-Control-Expose-Headers": "X-Action-Version, X-Blockchain-Ids",
  "X-Action-Version": "2.1.3",
  "X-Blockchain-Ids": "solana:5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp",
}

// OPTIONS — CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, { headers: ACTIONS_CORS_HEADERS })
}

// GET — Return Action metadata
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const childName = searchParams.get("name") || "a child"
  const milestonePda = searchParams.get("milestone")

  if (!milestonePda) {
    return NextResponse.json({ error: "Missing milestone parameter" }, { status: 400, headers: ACTIONS_CORS_HEADERS })
  }

  const actionMetadata = {
    type: "action",
    icon: `https://sathian.ai/tooth/${encodeURIComponent(childName)}/opengraph-image`,
    title: `Gift SOL for ${childName}'s Tooth`,
    description: `Deposit SOL savings for ${childName} through the Tooth Fairy Network. SOL is held in an on-chain escrow until the child is ready to claim it.`,
    label: "Deposit SOL",
    links: {
      actions: [
        {
          type: "transaction",
          label: "Gift 0.1 SOL",
          href: `/api/toothfairy/actions/deposit?milestone=${milestonePda}&name=${encodeURIComponent(childName)}&amount=0.1&depositorName=Friend`,
        },
        {
          type: "transaction",
          label: "Gift 0.5 SOL",
          href: `/api/toothfairy/actions/deposit?milestone=${milestonePda}&name=${encodeURIComponent(childName)}&amount=0.5&depositorName=Friend`,
        },
        {
          type: "transaction",
          label: "Gift 1 SOL",
          href: `/api/toothfairy/actions/deposit?milestone=${milestonePda}&name=${encodeURIComponent(childName)}&amount=1&depositorName=Friend`,
        },
        {
          type: "transaction",
          label: "Custom amount",
          href: `/api/toothfairy/actions/deposit?milestone=${milestonePda}&name=${encodeURIComponent(childName)}&amount={amount}&depositorName={depositorName}`,
          parameters: [
            { name: "amount", label: "SOL amount", type: "number", required: true, min: 0.001 },
            { name: "depositorName", label: "Your name (e.g. Grandma)", type: "text", required: true, maxLength: 32 },
          ],
        },
      ],
    },
  }

  return NextResponse.json(actionMetadata, { headers: ACTIONS_CORS_HEADERS })
}

// POST — Build deposit transaction
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const milestonePda = searchParams.get("milestone")
    const amountStr = searchParams.get("amount") || "0.1"
    const depositorName = searchParams.get("depositorName") || "Friend"

    if (!milestonePda) {
      return NextResponse.json({ error: "Missing milestone" }, { status: 400, headers: ACTIONS_CORS_HEADERS })
    }

    const body = await request.json()
    const depositorPubkey = new PublicKey(body.account)

    const rpc = process.env.NEXT_PUBLIC_SOLANA_RPC
    if (!rpc) throw new Error("RPC not configured")

    const connection = new Connection(rpc, "confirmed")
    const dummyWallet = new Wallet(Keypair.generate())
    const provider = new AnchorProvider(connection, dummyWallet, { commitment: "confirmed" })
    const program: any = new Program(idl as any, provider)

    // Fetch milestone to get child_profile and deposit_count
    const milestone = await program.account.milestone.fetch(new PublicKey(milestonePda))
    const childProfilePda = milestone.childProfile
    const depositCount = milestone.depositCount

    // Derive deposit PDA
    const buf = Buffer.alloc(4)
    buf.writeUInt32LE(depositCount)
    const [depositPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("deposit"), new PublicKey(milestonePda).toBuffer(), buf],
      PROGRAM_ID
    )

    // Derive treasury PDA
    const [treasuryPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("treasury")],
      PROGRAM_ID
    )

    const amountLamports = Math.floor(parseFloat(amountStr) * 1e9)

    // Build deposit instruction (2% fee goes to treasury)
    const depositIx = await program.methods
      .deposit(
        new (await import("@coral-xyz/anchor")).BN(amountLamports),
        { immediate: {} }, // Blinks default to immediate — no time-lock UI in Actions yet
        depositorName.slice(0, 32),
      )
      .accounts({
        depositor: depositorPubkey,
        childProfile: childProfilePda,
        milestone: new PublicKey(milestonePda),
        depositAccount: depositPda,
        treasury: treasuryPda,
        systemProgram: SystemProgram.programId,
      })
      .instruction()

    const tx = new Transaction().add(depositIx)
    const { blockhash } = await connection.getLatestBlockhash("confirmed")
    tx.recentBlockhash = blockhash
    tx.feePayer = depositorPubkey

    const serialized = tx.serialize({ requireAllSignatures: false, verifySignatures: false })

    return NextResponse.json(
      {
        type: "transaction",
        transaction: serialized.toString("base64"),
        message: `Depositing ${amountStr} SOL for a child's tooth via Tooth Fairy Network`,
      },
      { headers: ACTIONS_CORS_HEADERS }
    )
  } catch (error: any) {
    console.error("Blink deposit error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to create deposit transaction" },
      { status: 500, headers: ACTIONS_CORS_HEADERS }
    )
  }
}
