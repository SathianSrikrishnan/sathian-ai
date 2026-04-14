/**
 * TFN cNFT Minting via Metaplex Bubblegum
 *
 * Server-side only — uses a backend keypair to mint cNFTs
 * to parent wallet addresses. Parent never signs or pays.
 *
 * NOTE: Uses send() + HTTP polling instead of sendAndConfirm()
 * because Next.js webpack breaks WebSocket native bindings (bufferutil).
 */
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import {
  createSignerFromKeypair,
  signerIdentity,
  publicKey as umiPublicKey,
  generateSigner,
  type Umi,
  type KeypairSigner,
} from "@metaplex-foundation/umi"
import { mplBubblegum, mintV1, createTree } from "@metaplex-foundation/mpl-bubblegum"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"

// Initialize Umi with Bubblegum + Irys uploader
export function createMintUmi(): { umi: Umi; signer: KeypairSigner } {
  const rpc = process.env.NEXT_PUBLIC_SOLANA_RPC
  if (!rpc) throw new Error("NEXT_PUBLIC_SOLANA_RPC not set")

  const secretKeyBase64 = process.env.TFN_MINT_SECRET_KEY
  if (!secretKeyBase64) throw new Error("TFN_MINT_SECRET_KEY not set — generate a server keypair")

  const umi = createUmi(rpc)
    .use(mplBubblegum())
    .use(irysUploader({ address: "https://node2.irys.xyz" }))

  // Load server-side payer/authority keypair (base64 encoded)
  const keypairBytes = new Uint8Array(Buffer.from(secretKeyBase64, "base64"))
  const keypair = umi.eddsa.createKeypairFromSecretKey(keypairBytes)
  const signer = createSignerFromKeypair(umi, keypair)
  umi.use(signerIdentity(signer))

  return { umi, signer }
}

// Poll for transaction confirmation via HTTP (avoids WebSocket/bufferutil issues)
async function pollForConfirmation(
  rpcUrl: string,
  signatureBytes: Uint8Array,
  maxWaitMs = 45000,
): Promise<string> {
  const bs58Chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz"
  // Convert signature bytes to base58
  const sigArray = Array.from(signatureBytes)
  let sigBigInt = BigInt(0)
  for (let i = 0; i < sigArray.length; i++) {
    sigBigInt = sigBigInt * BigInt(256) + BigInt(sigArray[i])
  }
  let bs58Sig = ""
  while (sigBigInt > BigInt(0)) {
    const remainder = Number(sigBigInt % BigInt(58))
    bs58Sig = bs58Chars[remainder] + bs58Sig
    sigBigInt = sigBigInt / BigInt(58)
  }
  // Add leading 1s for leading zero bytes
  for (let i = 0; i < sigArray.length; i++) {
    if (sigArray[i] === 0) bs58Sig = "1" + bs58Sig
    else break
  }

  console.log(`[TFN] Polling for tx confirmation: ${bs58Sig}`)

  const start = Date.now()
  while (Date.now() - start < maxWaitMs) {
    try {
      const res = await fetch(rpcUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jsonrpc: "2.0",
          id: 1,
          method: "getSignatureStatuses",
          params: [[bs58Sig], { searchTransactionHistory: true }],
        }),
      })
      const data = await res.json()
      const status = data?.result?.value?.[0]
      if (status) {
        if (status.err) {
          throw new Error(`Transaction failed on-chain: ${JSON.stringify(status.err)}`)
        }
        if (status.confirmationStatus === "confirmed" || status.confirmationStatus === "finalized") {
          console.log(`[TFN] Transaction ${status.confirmationStatus}: ${bs58Sig}`)
          return bs58Sig
        }
      }
    } catch (err: any) {
      if (err.message?.includes("failed on-chain")) throw err
      // RPC error, keep polling
    }
    await new Promise((r) => setTimeout(r, 2000))
  }

  // Timeout — tx may still confirm, return the signature anyway
  console.warn(`[TFN] Tx not confirmed in ${maxWaitMs / 1000}s, returning signature: ${bs58Sig}`)
  return bs58Sig
}

// Create a Merkle tree (run once via setup endpoint)
export async function setupMerkleTree() {
  const { umi } = createMintUmi()
  const merkleTree = generateSigner(umi)

  // Depth 14 = 16,384 capacity (covers hackathon + first year)
  const builder = await createTree(umi, {
    merkleTree,
    maxDepth: 14,
    maxBufferSize: 64,
  })

  const result = await builder.sendAndConfirm(umi)

  return {
    merkleTree: merkleTree.publicKey.toString(),
    signature: Buffer.from(result.signature).toString("base64"),
  }
}

// Upload metadata + image to Arweave via Irys
export async function uploadMetadata(
  imageBuffer: Buffer,
  imageMimeType: string,
  childName: string,
  toothType: string,
  toothNumber: number,
  note?: string,
) {
  const { umi } = createMintUmi()

  // Uploading image to Arweave

  // Upload image first
  const imageFile = {
    buffer: new Uint8Array(imageBuffer),
    fileName: `tooth-${toothNumber}.png`,
    displayName: `${childName}'s Tooth #${toothNumber}`,
    uniqueName: `tfn-tooth-${Date.now()}`,
    contentType: imageMimeType,
    extension: imageMimeType.split("/")[1] || "png",
    tags: [{ name: "Content-Type", value: imageMimeType }],
  }

  const [imageUri] = await umi.uploader.upload([imageFile])
  // Image uploaded

  // Upload metadata JSON
  const metadata: Record<string, any> = {
    name: `${childName}'s Tooth #${toothNumber}`,
    symbol: "TFN",
    description: `A childhood milestone from ${childName}'s journey, preserved on the Tooth Fairy Network.`,
    image: imageUri,
    ...(note && { note }),
    external_url: "https://toothfairy.network",
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
      files: [{ uri: imageUri, type: imageMimeType }],
    },
  }

  const metadataUri = await umi.uploader.uploadJson(metadata)
  // Metadata uploaded
  return { imageUri, metadataUri }
}

// Mint a cNFT to a parent's wallet (no collection — simplest approach)
// Uses send() + HTTP polling to avoid WebSocket bufferutil crash in Next.js
export async function mintToothCNFT(
  parentWalletAddress: string,
  metadataUri: string,
  childName: string,
  toothType: string,
  toothNumber: number,
) {
  const { umi, signer } = createMintUmi()

  const merkleTreeKey = process.env.TFN_MERKLE_TREE
  if (!merkleTreeKey) throw new Error("TFN_MERKLE_TREE not set — run setup first")

  console.log(`[TFN] Minting cNFT to ${parentWalletAddress}...`)

  // Build and send — use send() not sendAndConfirm() to avoid WebSocket
  const result = await mintV1(umi, {
    leafOwner: umiPublicKey(parentWalletAddress),
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
  }).send(umi)

  // Poll for confirmation via HTTP instead of WebSocket
  const rpc = process.env.NEXT_PUBLIC_SOLANA_RPC!
  const bs58Sig = await pollForConfirmation(rpc, result)

  console.log(`[TFN] Mint complete: ${bs58Sig}`)

  return {
    signature: bs58Sig,
    leafOwner: parentWalletAddress,
  }
}
