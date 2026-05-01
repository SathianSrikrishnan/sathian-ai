/**
 * POST /api/toothfairy/server-deposit
 *
 * Server-side escrow deposit — called after Coinbase delivers SOL to the server wallet.
 * Uses the server wallet (TFN_MINT_SECRET_KEY) as the depositor to call the escrow
 * contract's deposit() instruction on behalf of the parent.
 *
 * Request body: {
 *   childProfilePda, milestonePda, amountSol, lockChoice, depositorName, childDob?
 * }
 *
 * lockChoice: "now" | "ageTen" | "eighteen" | "custom"
 * childDob: ISO date string (used for suggested age unlock choices)
 */
import { NextRequest, NextResponse } from "next/server"
import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js"
import { Program, AnchorProvider, Wallet, BN } from "@coral-xyz/anchor"
import idl from "@/lib/toothfairy/escrow-idl.json"

export const maxDuration = 60

const PROGRAM_ID = new PublicKey("FqCSNerRsjdxamLyiyTvqiGKZ4vnfYngLUuTKtSi7RTC")

const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://sathian.ai",
  "https://www.sathian.ai",
  "https://toothfairy.network",
  "https://www.toothfairy.network",
]

function getServerKeypair(): Keypair {
  const secretKeyBase64 = process.env.TFN_MINT_SECRET_KEY
  if (!secretKeyBase64) throw new Error("TFN_MINT_SECRET_KEY not set")
  const secretKey = Buffer.from(secretKeyBase64, "base64")
  return Keypair.fromSecretKey(new Uint8Array(secretKey))
}

function getDepositPDA(milestone: PublicKey, depositCount: number): [PublicKey, number] {
  const buf = Buffer.alloc(4)
  buf.writeUInt32LE(depositCount)
  return PublicKey.findProgramAddressSync(
    [Buffer.from("deposit"), milestone.toBuffer(), buf],
    PROGRAM_ID,
  )
}

function getTreasuryPDA(): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("treasury")],
    PROGRAM_ID,
  )
}

function getConfigPDA(): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("config")],
    PROGRAM_ID,
  )
}

function toLockPeriodArg(lockChoice: string, childDob?: string) {
  if (lockChoice === "now" || lockChoice === "immediate") {
    return { immediate: {} }
  }

  let lockTimestamp: number

  if ((lockChoice === "ageTen" || lockChoice === "ten") && childDob) {
    const dob = new Date(childDob + "T00:00:00")
    const unlockDate = new Date(dob)
    unlockDate.setFullYear(unlockDate.getFullYear() + 10)
    lockTimestamp = Math.floor(unlockDate.getTime() / 1000)
  } else if (lockChoice === "ageTen" || lockChoice === "ten") {
    // Fallback: 10 years from now
    lockTimestamp = Math.floor(Date.now() / 1000) + Math.floor(10 * 365.25 * 24 * 60 * 60)
  } else if (lockChoice === "eighteen" && childDob) {
    const dob = new Date(childDob + "T00:00:00")
    const eighteenth = new Date(dob)
    eighteenth.setFullYear(eighteenth.getFullYear() + 18)
    lockTimestamp = Math.floor(eighteenth.getTime() / 1000)
  } else if (lockChoice === "eighteen") {
    // Fallback: 18 years from now
    lockTimestamp = Math.floor(Date.now() / 1000) + Math.floor(18 * 365.25 * 24 * 60 * 60)
  } else {
    // Custom date — lockChoice IS the ISO date string
    const customDate = new Date(lockChoice + "T00:00:00")
    lockTimestamp = Math.floor(customDate.getTime() / 1000)
  }

  return { untilTimestamp: { lockUntil: new BN(lockTimestamp) } }
}

export async function POST(request: NextRequest) {
  // Origin check
  const origin = request.headers.get("origin")
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    return NextResponse.json({ error: "Unauthorized origin" }, { status: 403 })
  }

  try {
    const body = await request.json()
    const { childProfilePda, milestonePda, amountSol, lockChoice, depositorName, childDob } = body

    if (!childProfilePda || !milestonePda || !amountSol || !lockChoice || !depositorName) {
      return NextResponse.json(
        { error: "Missing required fields: childProfilePda, milestonePda, amountSol, lockChoice, depositorName" },
        { status: 400 },
      )
    }

    const rpc = process.env.NEXT_PUBLIC_SOLANA_RPC
    if (!rpc) throw new Error("NEXT_PUBLIC_SOLANA_RPC not set")

    const connection = new Connection(rpc, "confirmed")
    const serverKeypair = getServerKeypair()
    const serverWallet = new Wallet(serverKeypair)
    const provider = new AnchorProvider(connection, serverWallet, { commitment: "confirmed" })
    const program: any = new Program(idl as any, provider)

    const milestonePubkey = new PublicKey(milestonePda)
    const childProfilePubkey = new PublicKey(childProfilePda)

    // Check server wallet balance
    const balance = await connection.getBalance(serverKeypair.publicKey)
    const amountLamports = Math.floor(parseFloat(amountSol) * LAMPORTS_PER_SOL)
    const minRequired = amountLamports + 10_000_000 // deposit + rent + fees buffer

    // Balance and deposit amount verified

    if (balance < minRequired) {
      return NextResponse.json(
        { error: `Server wallet insufficient balance. Has ${(balance / LAMPORTS_PER_SOL).toFixed(4)} SOL, needs ~${(minRequired / LAMPORTS_PER_SOL).toFixed(4)} SOL` },
        { status: 503 },
      )
    }

    // Fetch milestone to get deposit count
    let milestone: any
    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        milestone = await program.account.milestone.fetch(milestonePubkey)
        break
      } catch (err: any) {
        if (attempt < 2) {
          await new Promise(r => setTimeout(r, 2000))
        } else {
          throw new Error("Milestone not found after retries. It may not be confirmed yet.")
        }
      }
    }

    const depositCount = milestone.depositCount as number
    const [depositPda] = getDepositPDA(milestonePubkey, depositCount)
    const [treasuryPda] = getTreasuryPDA()
    const [configPda] = getConfigPDA()

    const lockPeriodArg = toLockPeriodArg(lockChoice, childDob)

    // Executing deposit

    // Execute the deposit transaction
    const txSig = await program.methods
      .deposit(
        new BN(amountLamports),
        lockPeriodArg,
        depositorName.trim(),
      )
      .accounts({
        depositor: serverKeypair.publicKey,
        childProfile: childProfilePubkey,
        milestone: milestonePubkey,
        depositAccount: depositPda,
        treasury: treasuryPda,
        config: configPda,
        systemProgram: SystemProgram.programId,
      })
      .rpc()

    // Deposit complete

    // Calculate fee breakdown
    const feeBps = 200 // 2%
    const feeLamports = Math.floor(amountLamports * feeBps / 10000)
    const netLamports = amountLamports - feeLamports

    return NextResponse.json({
      success: true,
      txSignature: txSig,
      depositPda: depositPda.toBase58(),
      amountSol: parseFloat(amountSol),
      netSol: netLamports / LAMPORTS_PER_SOL,
      feeSol: feeLamports / LAMPORTS_PER_SOL,
      lockChoice,
      depositorName,
    })
  } catch (error: any) {
    console.error("[server-deposit] Error:", error)
    return NextResponse.json(
      { error: error.message || "Server deposit failed" },
      { status: 500 },
    )
  }
}
