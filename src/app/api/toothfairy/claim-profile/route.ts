/**
 * POST /api/toothfairy/claim-profile
 *
 * Transfers guardianship from server wallet to user's Phantom wallet.
 * Called when a user connects their wallet on the profile page.
 *
 * Flow:
 * 1. Verify Supabase auth session
 * 2. Verify the child belongs to this user (Supabase lookup)
 * 3. Server wallet signs transferGuardianship instruction
 * 4. Update Supabase record with new guardian
 *
 * Body: { childSlug, newGuardianWallet }
 */
import { NextRequest, NextResponse } from "next/server"
import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
} from "@solana/web3.js"
import { Program, AnchorProvider, Wallet } from "@coral-xyz/anchor"
import { createClient } from "@supabase/supabase-js"
import { createServerClient } from "@supabase/ssr"
import idl from "@/lib/toothfairy/escrow-idl.json"

export const maxDuration = 60

const PROGRAM_ID = new PublicKey("FqCSNerRsjdxamLyiyTvqiGKZ4vnfYngLUuTKtSi7RTC")

function getChildProfilePDA(childWallet: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("child_profile"), childWallet.toBuffer()],
    PROGRAM_ID
  )
}

function deriveChildWallet(guardian: PublicKey, childName: string): PublicKey {
  const [derived] = PublicKey.findProgramAddressSync(
    [Buffer.from("tfn_child"), guardian.toBuffer(), Buffer.from(childName.toLowerCase().trim())],
    PROGRAM_ID
  )
  return derived
}

function getServerKeypair(): Keypair {
  const secretKeyBase64 = process.env.TFN_MINT_SECRET_KEY
  if (!secretKeyBase64) throw new Error("TFN_MINT_SECRET_KEY not set")
  return Keypair.fromSecretKey(new Uint8Array(Buffer.from(secretKeyBase64, "base64")))
}

async function getAuthUser(request: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll() {},
      },
    }
  )
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function POST(request: NextRequest) {
  // Auth check
  const user = await getAuthUser(request)
  if (!user) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 })
  }

  try {
    const { childSlug, newGuardianWallet } = await request.json()

    if (!childSlug || !newGuardianWallet) {
      return NextResponse.json({ error: "Missing childSlug or newGuardianWallet" }, { status: 400 })
    }

    // Verify wallet format
    let newGuardianPubkey: PublicKey
    try {
      newGuardianPubkey = new PublicKey(newGuardianWallet)
    } catch {
      return NextResponse.json({ error: "Invalid wallet address" }, { status: 400 })
    }

    // Look up child in Supabase — verify ownership
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )

    const { data: child, error: lookupError } = await supabaseAdmin
      .from("tfn_children")
      .select("*")
      .eq("user_id", user.id)
      .eq("child_slug", childSlug)
      .single()

    if (lookupError || !child) {
      return NextResponse.json({ error: "Child not found or not owned by this user" }, { status: 404 })
    }

    if (!child.is_server_guardian) {
      return NextResponse.json({ error: "Profile already claimed" }, { status: 400 })
    }

    // Server wallet is current guardian — transfer to user's wallet
    const serverKeypair = getServerKeypair()
    const serverPubkey = serverKeypair.publicKey

    // Verify server wallet matches
    if (serverPubkey.toBase58() !== child.guardian_pubkey) {
      return NextResponse.json({ error: "Guardian mismatch — contact support" }, { status: 500 })
    }

    const rpc = process.env.NEXT_PUBLIC_SOLANA_RPC
    if (!rpc) throw new Error("NEXT_PUBLIC_SOLANA_RPC not set")

    const connection = new Connection(rpc, "confirmed")
    const wallet = new Wallet(serverKeypair)
    const provider = new AnchorProvider(connection, wallet, { commitment: "confirmed" })
    const program: any = new Program(idl as any, provider)

    const childProfilePda = child.child_profile_pda
      ? new PublicKey(child.child_profile_pda)
      : getChildProfilePDA(deriveChildWallet(serverPubkey, child.child_name))[0]

    // Transferring guardianship

    // Execute transferGuardianship on-chain
    const [configPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("config")],
      PROGRAM_ID
    )
    const txSig = await program.methods
      .transferGuardianship()
      .accounts({
        guardian: serverPubkey,
        childProfile: childProfilePda,
        newGuardian: newGuardianPubkey,
        config: configPda,
      })
      .rpc()

    // Transfer complete

    // Update Supabase record — keep original guardian_pubkey for PDA derivation
    await supabaseAdmin
      .from("tfn_children")
      .update({
        is_server_guardian: false,
        user_wallet_pubkey: newGuardianPubkey.toBase58(),
        child_profile_pda: childProfilePda.toBase58(),
        // DO NOT overwrite guardian_pubkey — it's needed for on-chain PDA derivation
        updated_at: new Date().toISOString(),
      })
      .eq("id", child.id)

    // The child profile PDA stays the same after guardianship transfer.
    return NextResponse.json({
      success: true,
      signature: txSig,
      newGuardian: newGuardianPubkey.toBase58(),
      childProfilePda: childProfilePda.toBase58(),
      explorerUrl: `https://solscan.io/tx/${txSig}`,
    })
  } catch (error: any) {
    console.error("Claim profile error:", error)
    return NextResponse.json(
      { error: error.message || "Failed to transfer guardianship" },
      { status: 500 }
    )
  }
}
