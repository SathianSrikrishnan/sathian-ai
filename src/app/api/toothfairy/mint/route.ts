/**
 * POST /api/toothfairy/mint
 *
 * Server-subsidized minting flow:
 * 1. Verify Supabase auth session
 * 2. Upload tooth art to Arweave via Irys
 * 3. Mint cNFT to server wallet (parent doesn't need a wallet)
 * 4. Create escrow child profile (server wallet = temp guardian)
 * 5. Create first milestone on the escrow contract
 *
 * Returns: cNFT data + escrow PDAs + server guardian pubkey
 *
 * Protection: auth required, rate limited, origin check
 */
import { NextRequest, NextResponse } from "next/server"
import { mintToothCNFT, uploadMetadata } from "@/lib/toothfairy/cnft"
import { checkRateLimit } from "@/lib/toothfairy/rate-limit"
import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
} from "@solana/web3.js"
import { Program, AnchorProvider, Wallet } from "@coral-xyz/anchor"
import idl from "@/lib/toothfairy/escrow-idl.json"
import { createServerClient } from "@supabase/ssr"

export const maxDuration = 60

const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://sathian.ai",
  "https://www.sathian.ai",
  "https://toothfairy.network",
  "https://www.toothfairy.network",
]

const MAX_IMAGE_SIZE = 2 * 1024 * 1024
const PROGRAM_ID = new PublicKey("FqCSNerRsjdxamLyiyTvqiGKZ4vnfYngLUuTKtSi7RTC")

// ── PDA Derivation (server-side duplicates) ──

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
  const secretKey = Buffer.from(secretKeyBase64, "base64")
  return Keypair.fromSecretKey(new Uint8Array(secretKey))
}

// ── Auth helper ──

async function getAuthUser(request: NextRequest) {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll() {
          // Read-only in API routes
        },
      },
    }
  )
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function POST(request: NextRequest) {
  // ── Test mode short-circuit (E2E tests only) ──
  // Gated by NEXT_PUBLIC_TEST_MODE=true — never set in production.
  // Returns deterministic stub values so Playwright doesn't need real Solana/Arweave/Supabase.
  if (process.env.NEXT_PUBLIC_TEST_MODE === "true") {
    return NextResponse.json({
      success: true,
      signature: "test-sig",
      explorerUrl: "https://solscan.io/tx/test-sig",
      metadataUri: "https://example.test/metadata.json",
      imageUri: "https://example.test/image.png",
      childSlug: "test-child-0000",
      guardianPublicKey: "test-guardian",
      childWalletPubkey: "test-child-wallet",
      childProfilePda: "test-profile",
      milestonePda: "test-pda",
      milestoneIndex: 0,
      isServerGuardian: true,
      smilePhotoUrl: null,
    })
  }

  // ── Origin check ──
  const origin = request.headers.get("origin")
  if (origin && !ALLOWED_ORIGINS.includes(origin)) {
    return NextResponse.json(
      { error: "Unauthorized origin" },
      { status: 403 }
    )
  }

  // ── Rate limit ──
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  const { allowed, remaining } = checkRateLimit(ip)
  if (!allowed) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Max 10 mints per hour." },
      { status: 429, headers: { "Retry-After": "3600" } }
    )
  }

  // ── Auth check ──
  const user = await getAuthUser(request)
  if (!user) {
    return NextResponse.json(
      { error: "Authentication required. Please sign in first." },
      { status: 401 }
    )
  }

  try {
    // ── Pre-flight: check Irys balance before attempting anything ──
    const serverKeypairCheck = getServerKeypair()
    try {
      const irysRes = await fetch(`https://node2.irys.xyz/account/balance/solana?address=${serverKeypairCheck.publicKey.toBase58()}`)
      const irysData = await irysRes.json()
      const irysBalance = parseInt(irysData.balance || "0")
      if (irysBalance < 500000) { // ~0.0005 SOL minimum for one upload
        console.error("[mint] Irys balance critically low:", irysBalance, "lamports")
        return NextResponse.json(
          { error: "Storage service needs funding. Please contact support." },
          { status: 503 }
        )
      }
      // Irys balance OK
    } catch (irysErr) {
      // Could not check Irys balance, proceeding anyway
    }

    const body = await request.json()
    const { childName, birthday, toothType, toothNumber, imageBase64, imageMimeType, smilePhotoBase64, note, toothStory: rawToothStory, traditionSlug: rawTraditionSlug } = body

    // ── Normalize + validate traditionSlug (story this drawing belongs to) ──
    // Written to tfn_tooth_stories sidecar so keepsake display + later analytics
    // can surface which cultural story inspired the drawing. Lightweight string,
    // not embedded in cNFT metadata (that stays fixed for provenance only).
    let traditionSlug: string | null = null
    if (typeof rawTraditionSlug === "string") {
      const trimmed = rawTraditionSlug.trim()
      if (trimmed.length > 64) {
        return NextResponse.json(
          { error: "Tradition slug must be 64 characters or fewer" },
          { status: 400 }
        )
      }
      // Allow only safe slug chars — prevents injection into anything downstream.
      if (trimmed.length > 0 && !/^[a-z0-9-_]+$/i.test(trimmed)) {
        return NextResponse.json(
          { error: "Tradition slug contains invalid characters" },
          { status: 400 }
        )
      }
      traditionSlug = trimmed.length > 0 ? trimmed.toLowerCase() : null
    } else if (rawTraditionSlug !== undefined && rawTraditionSlug !== null) {
      return NextResponse.json(
        { error: "Tradition slug must be a string" },
        { status: 400 }
      )
    }

    // ── Normalize + validate toothStory (Tell step narrative) ──
    // Stored off-chain in Supabase tfn_tooth_stories (see 20260413_add_tooth_story.sql).
    // Not embedded in cNFT metadata — that stays fixed/tamper-evident for provenance only.
    let toothStory: string | null = null
    if (typeof rawToothStory === "string") {
      const trimmed = rawToothStory.trim()
      if (trimmed.length > 500) {
        return NextResponse.json(
          { error: "Tooth story must be 500 characters or fewer" },
          { status: 400 }
        )
      }
      toothStory = trimmed.length > 0 ? trimmed : null
    } else if (rawToothStory !== undefined && rawToothStory !== null) {
      return NextResponse.json(
        { error: "Tooth story must be a string" },
        { status: 400 }
      )
    }

    // ── Generate unique slug (name + 4-char hex suffix) ──
    const { randomBytes } = await import("crypto")
    const slugSuffix = randomBytes(2).toString("hex")
    const childSlug = `${childName.toLowerCase().trim().replace(/\s+/g, "-")}-${slugSuffix}`

    // ── Input validation ──
    if (!childName || !toothType || !toothNumber) {
      return NextResponse.json(
        { error: "Missing required fields: childName, toothType, toothNumber" },
        { status: 400 }
      )
    }

    if (typeof childName !== "string" || childName.length > 50) {
      return NextResponse.json(
        { error: "Child name must be under 50 characters" },
        { status: 400 }
      )
    }

    if (imageBase64 && imageBase64.length > MAX_IMAGE_SIZE) {
      return NextResponse.json(
        { error: "Image too large. Max 2MB." },
        { status: 400 }
      )
    }

    const toothNum = Number(toothNumber)
    if (!Number.isInteger(toothNum) || toothNum < 1 || toothNum > 100) {
      return NextResponse.json(
        { error: "Tooth number must be 1-100" },
        { status: 400 }
      )
    }

    // ── Get server wallet (will be temp guardian) ──
    const serverKeypair = getServerKeypair()
    const serverPubkey = serverKeypair.publicKey

    // ── Upload + Mint cNFT (with retry for Arweave) ──
    let metadataUri: string
    let imageUri: string | undefined

    if (imageBase64) {
      const imageBuffer = Buffer.from(imageBase64, "base64")
      let uploadResult: { metadataUri: string; imageUri: string }
      let lastUploadError: Error | null = null

      for (let attempt = 1; attempt <= 3; attempt++) {
        try {
          uploadResult = await uploadMetadata(
            imageBuffer,
            imageMimeType || "image/png",
            childName,
            toothType,
            toothNum,
            note,
          )
          lastUploadError = null
          break
        } catch (err: any) {
          lastUploadError = err
          console.error(`[mint] Arweave upload attempt ${attempt}/3 failed:`, err.message)
          if (attempt < 3) {
            await new Promise(r => setTimeout(r, 1000 * attempt)) // 1s, 2s backoff
          }
        }
      }

      if (lastUploadError || !uploadResult!) {
        return NextResponse.json(
          { error: "Image upload failed after 3 attempts. Please try again in a moment." },
          { status: 503 }
        )
      }

      metadataUri = uploadResult!.metadataUri
      imageUri = uploadResult!.imageUri
    } else {
      metadataUri = `https://toothfairy.network/api/toothfairy/metadata?child=${encodeURIComponent(childName)}&tooth=${toothNum}&type=${encodeURIComponent(toothType)}`
    }

    // Mint cNFT to server wallet (server-subsidized — user doesn't need a wallet)
    const result = await mintToothCNFT(
      serverPubkey.toBase58(),
      metadataUri,
      childName,
      toothType,
      toothNum,
    )

    // cNFT minted successfully

    // ── Create escrow profile + milestone (server as guardian) ──
    const rpc = process.env.NEXT_PUBLIC_SOLANA_RPC
    if (!rpc) throw new Error("NEXT_PUBLIC_SOLANA_RPC not set")

    const connection = new Connection(rpc, "confirmed")
    const wallet = new Wallet(serverKeypair)
    const provider = new AnchorProvider(connection, wallet, { commitment: "confirmed" })
    const program: any = new Program(idl as any, provider)

    const childWalletPubkey = deriveChildWallet(serverPubkey, childName)
    const [childProfilePda] = getChildProfilePDA(childWalletPubkey)

    // Check if profile already exists
    let milestoneIndex = 0
    let profileExists = false
    try {
      const existingProfile = await program.account.childProfile.fetch(childProfilePda)
      profileExists = true
      milestoneIndex = existingProfile.milestoneCount
      // Profile exists
    } catch {
      // Profile not found — creating
    }

    // Create child profile if needed
    if (!profileExists) {
      // Creating child profile
      await program.methods
        .initializeChild(childName)
        .accounts({
          guardian: serverPubkey,
          childWallet: childWalletPubkey,
          childProfile: childProfilePda,
          systemProgram: SystemProgram.programId,
        })
        .rpc()

      // Wait for confirmation
      await new Promise(r => setTimeout(r, 2000))
      // Child profile created
    }

    // Create milestone
    const [milestonePda] = getMilestonePDA(childProfilePda, milestoneIndex)
    // Creating milestone

    await program.methods
      .createMilestone({ upperRightCentralIncisor: {} }, metadataUri)
      .accounts({
        guardian: serverPubkey,
        childProfile: childProfilePda,
        milestone: milestonePda,
        systemProgram: SystemProgram.programId,
      })
      .rpc()

    // Milestone created

    // ── Store user→child mapping in Supabase ──
    const { createClient } = await import("@supabase/supabase-js")
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )

    // Upload smile photo to Supabase Storage if provided
    let smilePhotoUrl: string | null = null
    if (smilePhotoBase64) {
      try {
        const photoBuffer = Buffer.from(smilePhotoBase64, "base64")
        const photoPath = `${user.id}/${childSlug}-smile.jpg`

        const { error: uploadError } = await supabaseAdmin.storage
          .from("tfn-photos")
          .upload(photoPath, photoBuffer, {
            contentType: "image/jpeg",
            upsert: true,
          })

        if (uploadError) {
          console.error("[mint] Photo upload error:", uploadError)
        } else {
          const { data: urlData } = supabaseAdmin.storage
            .from("tfn-photos")
            .getPublicUrl(photoPath)
          smilePhotoUrl = urlData.publicUrl
          // Smile photo uploaded
        }
      } catch (e) {
        console.error("[mint] Photo upload failed:", e)
      }
    }

    await supabaseAdmin.from("tfn_children").upsert({
      user_id: user.id,
      user_email: user.email,
      child_name: childName,
      child_slug: childSlug,
      birthday: birthday || null,
      guardian_pubkey: serverPubkey.toBase58(),
      child_wallet_pubkey: childWalletPubkey.toBase58(),
      child_profile_pda: childProfilePda.toBase58(),
      cnft_signature: result.signature,
      metadata_uri: metadataUri,
      image_uri: imageUri || null,
      smile_photo_url: smilePhotoUrl,
      is_server_guardian: true,
    }, {
      onConflict: "user_id,child_slug",
    }).then(({ error }) => {
      if (error) console.error("[mint] Supabase upsert error:", error)
      // Child record saved to Supabase
    })

    // ── Persist Tell (toothStory) + tradition context keyed by milestone PDA ──
    // Non-blocking: if this fails, the keepsake still renders without the Tell
    // text. We write whenever EITHER field is present — traditionSlug alone is
    // enough signal to surface "Drawn after reading <story>" on the keepsake.
    if (toothStory || traditionSlug) {
      await supabaseAdmin
        .from("tfn_tooth_stories")
        .upsert(
          {
            milestone_pda: milestonePda.toBase58(),
            child_profile_pda: childProfilePda.toBase58(),
            user_id: user.id,
            tooth_story: toothStory,
            tradition_slug: traditionSlug,
          },
          { onConflict: "milestone_pda" }
        )
        .then(({ error }) => {
          if (error) console.error("[mint] tfn_tooth_stories upsert error:", error)
        })
    }

    // ── Send keepsake email (after mint confirmed + data saved) ──
    const profileUrl = `https://toothfairy.network/tooth/${childSlug}?g=${serverPubkey.toBase58()}`
    try {
      const resendKey = process.env.RESEND_API_KEY
      if (resendKey && user.email) {
        const { Resend } = await import("resend")
        const resend = new Resend(resendKey)
        const firstName = user.user_metadata?.full_name?.split(" ")[0] || "there"

        await resend.emails.send({
          from: "Tooth Fairy Network <noreply@toothfairy.network>",
          to: user.email,
          subject: `${childName}'s tooth is saved forever ✨`,
          html: `
            <div style="font-family: 'Nunito', -apple-system, sans-serif; max-width: 520px; margin: 0 auto; background: #0B1026; color: #F0ECFF; padding: 40px 24px; border-radius: 16px;">
              <div style="text-align: center; margin-bottom: 24px;">
                <span style="font-size: 48px;">🧚‍♀️</span>
              </div>

              <h1 style="color: #F0C456; text-align: center; font-size: 24px; margin-bottom: 8px;">
                ${childName}'s tooth is saved forever
              </h1>

              <p style="text-align: center; color: #A0AEC0; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
                Hi ${firstName} — ${childName}'s keepsake has been permanently stored. No one can delete it, not even us.
              </p>

              <div style="background: rgba(240,196,86,0.08); border: 1px solid rgba(240,196,86,0.2); border-radius: 12px; padding: 20px; margin-bottom: 24px;">
                <h3 style="color: #F0C456; margin: 0 0 12px 0; font-size: 14px;">What to do next</h3>
                <ul style="color: #CBD5E0; font-size: 14px; line-height: 2; padding-left: 20px; margin: 0;">
                  <li>Share ${childName}'s page with family</li>
                  <li>Family members can gift savings directly</li>
                  <li>Each lost tooth becomes a new keepsake</li>
                </ul>
              </div>

              <div style="text-align: center; margin-bottom: 16px;">
                <a href="${profileUrl}"
                   style="display: inline-block; background: linear-gradient(135deg, #F0C456, #E0A830); color: #0B1026; font-weight: 700; padding: 14px 32px; border-radius: 24px; text-decoration: none; font-size: 15px;">
                  See ${childName}'s page →
                </a>
              </div>

              <p style="text-align: center; color: #4A5568; font-size: 12px; margin-top: 32px;">
                Tooth Fairy Network — Permanently stored
              </p>
            </div>
          `,
        })
        // Keepsake email sent
      }
    } catch (emailErr: any) {
      console.error("[mint] Email send failed:", emailErr.message)
      // Non-blocking — mint succeeded, email is a bonus
    }

    return NextResponse.json(
      {
        success: true,
        signature: result.signature,
        explorerUrl: `https://solscan.io/tx/${result.signature}`,
        metadataUri,
        imageUri,
        childSlug,
        // Escrow info for frontend
        guardianPublicKey: serverPubkey.toBase58(),
        childWalletPubkey: childWalletPubkey.toBase58(),
        childProfilePda: childProfilePda.toBase58(),
        milestonePda: milestonePda.toBase58(),
        milestoneIndex,
        isServerGuardian: true,
        smilePhotoUrl,
      },
      {
        headers: { "X-RateLimit-Remaining": remaining.toString() },
      }
    )
  } catch (error: any) {
    console.error("Mint cNFT error:", error)

    // Provide specific user-friendly error messages
    const msg = error.message || ""
    let userMessage = "Something went wrong. Please try again."

    if (msg.includes("insufficient") || msg.includes("lamports")) {
      userMessage = "Server wallet needs funding. Please contact support."
    } else if (msg.includes("blockhash")) {
      userMessage = "Solana network is busy. Please try again in a few seconds."
    } else if (msg.includes("timeout") || msg.includes("ETIMEDOUT")) {
      userMessage = "Network timeout. Please check your connection and try again."
    } else if (msg.includes("AccountNotFound") || msg.includes("account not found")) {
      userMessage = "On-chain account setup failed. Please try again."
    } else if (msg) {
      userMessage = msg
    }

    return NextResponse.json(
      { error: userMessage },
      { status: 500 }
    )
  }
}
