/**
 * Mint a cNFT with image uploaded to Arweave via Irys.
 * This is the REAL flow — image permanently stored, Phantom will display it.
 *
 * Run: node scripts/test-mint-arweave.mjs [wallet] [childName] [toothNumber] [toothType]
 * Example: node scripts/test-mint-arweave.mjs 5fWRv9gLT23uZnrRXRtCrqnQG1y8E4h2NftrVh9YdYq9 Isa 2 "Upper Left Central Incisor"
 */
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import {
  createSignerFromKeypair,
  signerIdentity,
  publicKey as umiPublicKey,
} from "@metaplex-foundation/umi"
import { mplBubblegum, mintV1 } from "@metaplex-foundation/mpl-bubblegum"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"
import { readFileSync } from "fs"
import { resolve } from "path"
import dotenv from "dotenv"

dotenv.config({ path: resolve(process.cwd(), ".env.local") })

const rpc = process.env.NEXT_PUBLIC_SOLANA_RPC
const secretKeyBase64 = process.env.TFN_MINT_SECRET_KEY
const merkleTreeKey = process.env.TFN_MERKLE_TREE

if (!rpc || !secretKeyBase64 || !merkleTreeKey) {
  console.error("Missing env vars. Need: NEXT_PUBLIC_SOLANA_RPC, TFN_MINT_SECRET_KEY, TFN_MERKLE_TREE")
  process.exit(1)
}

const walletAddress = process.argv[2] || "5fWRv9gLT23uZnrRXRtCrqnQG1y8E4h2NftrVh9YdYq9"
const childName = process.argv[3] || "Isa"
const toothNumber = parseInt(process.argv[4] || "2")
const toothType = process.argv[5] || "Upper Left Central Incisor"

console.log("\n🦷 Tooth Fairy Network — Full Arweave Mint")
console.log("═".repeat(50))
console.log("  Wallet:", walletAddress)
console.log("  Child:", childName)
console.log("  Tooth #:", toothNumber)
console.log("  Type:", toothType)
console.log("  Tree:", merkleTreeKey)
console.log("")

// ── Step 1: Initialize Umi with Bubblegum + Irys ──
console.log("Step 1: Initializing Umi + Irys uploader...")
const umi = createUmi(rpc)
  .use(mplBubblegum())
  .use(irysUploader({ address: "https://node2.irys.xyz" }))

const keypairBytes = new Uint8Array(Buffer.from(secretKeyBase64, "base64"))
const keypair = umi.eddsa.createKeypairFromSecretKey(keypairBytes)
const signer = createSignerFromKeypair(umi, keypair)
umi.use(signerIdentity(signer))
console.log("  Signer:", signer.publicKey.toString())

// ── Step 2: Load and upload image to Arweave ──
console.log("\nStep 2: Uploading image to Arweave via Irys...")
const svgPath = resolve(process.cwd(), "public/toothfairy/tooth-placeholder.svg")
const svgBuffer = readFileSync(svgPath)

const imageFile = {
  buffer: new Uint8Array(svgBuffer),
  fileName: `tooth-${toothNumber}.svg`,
  displayName: `${childName}'s Tooth #${toothNumber}`,
  uniqueName: `tfn-tooth-${Date.now()}`,
  contentType: "image/svg+xml",
  extension: "svg",
  tags: [{ name: "Content-Type", value: "image/svg+xml" }],
}

let imageUri
try {
  ;[imageUri] = await umi.uploader.upload([imageFile])
  console.log("  Image URI:", imageUri)
} catch (err) {
  console.error("  Image upload failed:", err.message)
  console.log("\n  Irys may need funding. Checking balance...")

  // Try to get price estimate
  try {
    const price = await umi.uploader.getUploadPrice(svgBuffer.length)
    console.log("  Upload price:", price, "lamports")
    console.log("  Attempting to fund Irys...")
    // Fund with a small amount for this upload
    await umi.uploader.fund(price)
    console.log("  Funded! Retrying upload...")
    ;[imageUri] = await umi.uploader.upload([imageFile])
    console.log("  Image URI:", imageUri)
  } catch (fundErr) {
    console.error("  Funding/retry failed:", fundErr.message)
    process.exit(1)
  }
}

// ── Step 3: Upload metadata JSON to Arweave ──
console.log("\nStep 3: Uploading metadata to Arweave...")
const metadata = {
  name: `${childName}'s Tooth #${toothNumber}`,
  symbol: "TFN",
  description: `Tooth #${toothNumber} (${toothType}) — A childhood milestone recorded on the Tooth Fairy Network. This soulbound token marks a moment in ${childName}'s journey, permanently preserved on Solana.`,
  image: imageUri,
  external_url: "https://sathian.ai/toothfairy/network",
  attributes: [
    { trait_type: "Child", value: childName },
    { trait_type: "Tooth Type", value: toothType },
    { trait_type: "Tooth Number", value: toothNumber.toString() },
    { trait_type: "Network", value: "Tooth Fairy Network" },
    { trait_type: "Milestone", value: "Baby Tooth Lost" },
    { trait_type: "Date", value: new Date().toISOString().split("T")[0] },
  ],
  properties: {
    category: "image",
    files: [{ uri: imageUri, type: "image/svg+xml" }],
  },
}

const metadataUri = await umi.uploader.uploadJson(metadata)
console.log("  Metadata URI:", metadataUri)

// ── Step 4: Mint cNFT ──
console.log("\nStep 4: Minting cNFT to", walletAddress, "...")
const result = await mintV1(umi, {
  leafOwner: umiPublicKey(walletAddress),
  merkleTree: umiPublicKey(merkleTreeKey),
  metadata: {
    name: `${childName}'s Tooth #${toothNumber}`,
    symbol: "TFN",
    uri: metadataUri,
    sellerFeeBasisPoints: 0,
    collection: null,
    creators: [
      { address: signer.publicKey, verified: true, share: 100 },
    ],
  },
}).sendAndConfirm(umi)

const sig = Buffer.from(result.signature).toString("base64")
console.log("\n✅ cNFT MINTED with Arweave image!")
console.log("═".repeat(50))
console.log("  Signature:", sig)
console.log("  Image:", imageUri)
console.log("  Metadata:", metadataUri)
console.log("")
console.log("🔍 Verify:")
console.log("  Solscan:", `https://solscan.io/account/${walletAddress}#portfolio`)
console.log("  Phantom: Check Collectibles tab (may take 1-2 min to index)")
console.log("")
console.log("📝 Save these URIs — they're permanent on Arweave!")
