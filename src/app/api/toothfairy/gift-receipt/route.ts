import { NextRequest, NextResponse } from "next/server"
import { AnchorProvider, Program } from "@coral-xyz/anchor"
import { createClient } from "@supabase/supabase-js"
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import { Resend } from "resend"
import { isAllowedOrigin } from "@/lib/constants"
import idl from "@/lib/toothfairy/escrow-idl.json"
import { PLATFORM_FEE_BPS, PROGRAM_ID } from "@/lib/toothfairy/escrow"
import { renderGiftReceivedEmail, toothFairyEmailFrom } from "@/lib/toothfairy/email-templates"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

const RECEIPT_MAX_PER_HOUR = 20
const WINDOW_MS = 60 * 60 * 1000
const hits = new Map<string, { count: number; resetAt: number }>()
const sentReceipts = new Map<string, number>()

function rateLimit(ip: string) {
  const now = Date.now()
  const entry = hits.get(ip)
  if (!entry || now > entry.resetAt) {
    hits.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return true
  }
  if (entry.count >= RECEIPT_MAX_PER_HOUR) return false
  entry.count += 1
  return true
}

function cleanOldReceipts() {
  const cutoff = Date.now() - WINDOW_MS
  sentReceipts.forEach((sentAt, signature) => {
    if (sentAt < cutoff) sentReceipts.delete(signature)
  })
}

function jsonError(error: string, status = 400) {
  return NextResponse.json({ error }, { status })
}

function readOnlyProgram(connection: Connection) {
  const dummyWallet = {
    publicKey: Keypair.generate().publicKey,
    signTransaction: async () => {
      throw new Error("Read-only wallet cannot sign")
    },
    signAllTransactions: async () => {
      throw new Error("Read-only wallet cannot sign")
    },
  }
  const provider = new AnchorProvider(connection, dummyWallet as any, { commitment: "confirmed" })
  return new Program(idl as any, provider as any) as any
}

async function getParsedTransaction(connection: Connection, txSignature: string) {
  for (let attempt = 0; attempt < 4; attempt += 1) {
    const tx = await connection.getParsedTransaction(txSignature, {
      commitment: "confirmed",
      maxSupportedTransactionVersion: 0,
    })
    if (tx) return tx
    await new Promise((resolve) => setTimeout(resolve, 1200))
  }
  return null
}

function transactionAccountKeys(tx: any) {
  return new Set(
    (tx?.transaction?.message?.accountKeys || []).map((key: any) =>
      typeof key?.pubkey?.toBase58 === "function"
        ? key.pubkey.toBase58()
        : typeof key?.toBase58 === "function"
          ? key.toBase58()
          : String(key?.pubkey || key),
    ),
  )
}

function numberFromAnchor(value: any) {
  if (typeof value?.toNumber === "function") return value.toNumber()
  return Number(value || 0)
}

function amountBreakdownFromNet(netLamports: number) {
  const netSol = netLamports / LAMPORTS_PER_SOL
  const grossLamports = Math.round(netLamports * 10000 / (10000 - PLATFORM_FEE_BPS))
  const feeLamports = Math.max(0, grossLamports - netLamports)

  return {
    amountSol: grossLamports / LAMPORTS_PER_SOL,
    feeSol: feeLamports / LAMPORTS_PER_SOL,
    netSol,
  }
}

function lockLabel(lockUntil: number, childName: string) {
  if (!lockUntil || lockUntil <= 0) return "Available now"

  const date = new Date(lockUntil * 1000)
  const formatted = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  })

  return lockUntil > Math.floor(Date.now() / 1000)
    ? `Held for ${childName} until ${formatted}`
    : `Unlocked on ${formatted}`
}

async function findVerifiedDeposit({
  program,
  milestonePda,
  depositorPubkey,
  blockTime,
}: {
  program: any
  milestonePda: PublicKey
  depositorPubkey: PublicKey
  blockTime: number | null | undefined
}) {
  const deposits = await program.account.deposit.all([
    { memcmp: { offset: 8, bytes: milestonePda.toBase58() } },
  ])

  const matches = deposits
    .map((deposit: any) => {
      const account = deposit.account
      return {
        depositor: account.depositor?.toBase58?.() || "",
        depositorName: account.depositorName as string,
        amountLamports: numberFromAnchor(account.amountLamports),
        lockUntil: numberFromAnchor(account.lockUntil),
        createdAt: numberFromAnchor(account.createdAt),
        claimed: Boolean(account.claimed),
      }
    })
    .filter((deposit: any) => deposit.depositor === depositorPubkey.toBase58())
    .sort((a: any, b: any) => b.createdAt - a.createdAt)

  if (matches.length === 0) return null
  if (!blockTime) return matches[0]

  return matches.find((deposit: any) => Math.abs(deposit.createdAt - blockTime) <= 20 * 60) || null
}

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin")
  if (!isAllowedOrigin(origin)) return jsonError("forbidden", 403)

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown"
  if (!rateLimit(ip)) return jsonError("rate_limit", 429)

  let milestonePda: PublicKey
  let depositorPubkey: PublicKey

  try {
    const body = await request.json()
    const txSignature = String(body?.txSignature || "").trim()
    milestonePda = new PublicKey(String(body?.milestonePda || ""))
    depositorPubkey = new PublicKey(String(body?.depositorPubkey || ""))

    if (!txSignature || txSignature.length < 64) return jsonError("invalid_signature")
    cleanOldReceipts()
    if (sentReceipts.has(txSignature)) {
      return NextResponse.json({ success: true, duplicate: true })
    }

    const rpc =
      process.env.NEXT_PUBLIC_SOLANA_RPC ||
      process.env.NEXT_PUBLIC_SOLANA_RPC_URL ||
      "https://api.mainnet-beta.solana.com"
    const connection = new Connection(rpc, "confirmed")
    const program = readOnlyProgram(connection)

    const [tx, milestone] = await Promise.all([
      getParsedTransaction(connection, txSignature),
      program.account.milestone.fetch(milestonePda),
    ])

    if (!tx) return jsonError("transaction_not_found", 404)
    if (tx.meta?.err) return jsonError("transaction_failed", 400)

    const childProfilePda = milestone.childProfile as PublicKey
    const keys = transactionAccountKeys(tx)
    const requiredKeys = [
      PROGRAM_ID.toBase58(),
      milestonePda.toBase58(),
      childProfilePda.toBase58(),
      depositorPubkey.toBase58(),
    ]
    if (!requiredKeys.every((key) => keys.has(key))) {
      return jsonError("transaction_does_not_match_gift", 400)
    }

    const deposit = await findVerifiedDeposit({
      program,
      milestonePda,
      depositorPubkey,
      blockTime: tx.blockTime,
    })
    if (!deposit) return jsonError("deposit_not_found", 404)

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!supabaseUrl || !serviceKey) {
      return NextResponse.json({ success: true, skipped: true, reason: "supabase_not_configured" })
    }

    const admin = createClient(supabaseUrl, serviceKey)
    const { data, error } = await admin
      .from("tfn_children")
      .select("user_email, child_name")
      .eq("child_profile_pda", childProfilePda.toBase58())
      .maybeSingle()

    if (error) {
      console.error("[gift-receipt] guardian lookup failed:", error)
      return NextResponse.json({ success: true, skipped: true, reason: "guardian_lookup_failed" })
    }

    const email = data?.user_email
    if (!email) return NextResponse.json({ success: true, skipped: true, reason: "no_parent_email" })

    const resendKey = process.env.RESEND_API_KEY
    if (!resendKey) return NextResponse.json({ success: true, skipped: true, reason: "no_RESEND_API_KEY" })

    const childName = data?.child_name || "your child"
    const breakdown = amountBreakdownFromNet(deposit.amountLamports)
    const resend = new Resend(resendKey)
    await resend.emails.send({
      from: toothFairyEmailFrom,
      to: email,
      subject: `${childName} received a Smile Fund gift`,
      html: renderGiftReceivedEmail({
        childName,
        giver: deposit.depositorName,
        amountSol: breakdown.amountSol,
        feeSol: breakdown.feeSol,
        netSol: breakdown.netSol,
        lockLabel: lockLabel(deposit.lockUntil, childName),
        solscanUrl: `https://solscan.io/tx/${txSignature}`,
      }),
    })

    sentReceipts.set(txSignature, Date.now())
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[gift-receipt] error:", error)
    return jsonError("receipt_failed", 500)
  }
}
