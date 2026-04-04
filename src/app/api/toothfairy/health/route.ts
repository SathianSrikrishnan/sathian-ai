/**
 * GET /api/toothfairy/health
 *
 * Pre-flight health check for TFN mint infrastructure.
 * Hit this before any demo. All checks must pass for minting to work.
 */
import { NextResponse } from "next/server"
import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js"
import { createClient } from "@supabase/supabase-js"

export const maxDuration = 15
export const dynamic = "force-dynamic"

interface Check {
  name: string
  status: "ok" | "warn" | "fail"
  detail: string
}

export async function GET() {
  const checks: Check[] = []
  let allOk = true

  // 1. Server wallet keypair loads
  let serverPubkey = ""
  try {
    const secretKeyBase64 = process.env.TFN_MINT_SECRET_KEY
    if (!secretKeyBase64) throw new Error("TFN_MINT_SECRET_KEY not set")
    const keypair = Keypair.fromSecretKey(new Uint8Array(Buffer.from(secretKeyBase64, "base64")))
    serverPubkey = keypair.publicKey.toBase58()
    checks.push({ name: "Server Keypair", status: "ok", detail: serverPubkey.slice(0, 8) + "..." })
  } catch (e: any) {
    checks.push({ name: "Server Keypair", status: "fail", detail: e.message })
    allOk = false
  }

  // 2. Solana RPC connection + server wallet balance
  try {
    const rpc = process.env.NEXT_PUBLIC_SOLANA_RPC
    if (!rpc) throw new Error("NEXT_PUBLIC_SOLANA_RPC not set")
    const connection = new Connection(rpc, "confirmed")
    const balance = await connection.getBalance(Keypair.fromSecretKey(
      new Uint8Array(Buffer.from(process.env.TFN_MINT_SECRET_KEY!, "base64"))
    ).publicKey)
    const sol = balance / LAMPORTS_PER_SOL
    if (sol < 0.05) {
      checks.push({ name: "Server Wallet SOL", status: "fail", detail: `${sol.toFixed(4)} SOL — TOO LOW (need >0.05)` })
      allOk = false
    } else if (sol < 0.2) {
      checks.push({ name: "Server Wallet SOL", status: "warn", detail: `${sol.toFixed(4)} SOL — getting low` })
    } else {
      checks.push({ name: "Server Wallet SOL", status: "ok", detail: `${sol.toFixed(4)} SOL` })
    }
  } catch (e: any) {
    checks.push({ name: "Server Wallet SOL", status: "fail", detail: e.message })
    allOk = false
  }

  // 3. Irys balance
  try {
    const res = await fetch(`https://node2.irys.xyz/account/balance/solana?address=${serverPubkey}`)
    const data = await res.json()
    const irysBalance = parseInt(data.balance) / 1e9
    const estimatedUploads = Math.floor(parseInt(data.balance) / 1000000)
    if (irysBalance < 0.01) {
      checks.push({ name: "Irys (Arweave) Balance", status: "fail", detail: `${irysBalance.toFixed(6)} SOL — EMPTY. Run: node scripts/fund-irys.mjs 0.2` })
      allOk = false
    } else if (irysBalance < 0.05) {
      checks.push({ name: "Irys (Arweave) Balance", status: "warn", detail: `${irysBalance.toFixed(6)} SOL (~${estimatedUploads} uploads left)` })
    } else {
      checks.push({ name: "Irys (Arweave) Balance", status: "ok", detail: `${irysBalance.toFixed(6)} SOL (~${estimatedUploads} uploads)` })
    }
  } catch (e: any) {
    checks.push({ name: "Irys (Arweave) Balance", status: "fail", detail: e.message })
    allOk = false
  }

  // 4. Merkle tree exists
  try {
    const merkleTree = process.env.TFN_MERKLE_TREE
    if (!merkleTree) throw new Error("TFN_MERKLE_TREE not set")
    checks.push({ name: "Merkle Tree", status: "ok", detail: merkleTree.slice(0, 8) + "..." })
  } catch (e: any) {
    checks.push({ name: "Merkle Tree", status: "fail", detail: e.message })
    allOk = false
  }

  // 5. Supabase connection
  try {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) throw new Error("Supabase env vars missing")
    const supabase = createClient(url, key)
    const { count, error } = await supabase.from("tfn_children").select("*", { count: "exact", head: true })
    if (error) throw error
    checks.push({ name: "Supabase", status: "ok", detail: `Connected (${count} children in DB)` })
  } catch (e: any) {
    checks.push({ name: "Supabase", status: "fail", detail: e.message })
    allOk = false
  }

  // 6. Escrow program reachable
  try {
    const rpc = process.env.NEXT_PUBLIC_SOLANA_RPC!
    const connection = new Connection(rpc, "confirmed")
    const programId = "FqCSNerRsjdxamLyiyTvqiGKZ4vnfYngLUuTKtSi7RTC"
    const info = await connection.getAccountInfo(new (await import("@solana/web3.js")).PublicKey(programId))
    if (info && info.executable) {
      checks.push({ name: "Escrow Program", status: "ok", detail: "Deployed and executable" })
    } else {
      checks.push({ name: "Escrow Program", status: "fail", detail: "Not found or not executable" })
      allOk = false
    }
  } catch (e: any) {
    checks.push({ name: "Escrow Program", status: "fail", detail: e.message })
    allOk = false
  }

  const statusCode = allOk ? 200 : 503

  return NextResponse.json(
    {
      healthy: allOk,
      timestamp: new Date().toISOString(),
      checks,
    },
    { status: statusCode }
  )
}
