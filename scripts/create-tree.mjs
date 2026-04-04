/**
 * Standalone script to create the Merkle tree for TFN cNFT minting.
 * Run: node scripts/create-tree.mjs
 */
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createSignerFromKeypair, signerIdentity, generateSigner } from "@metaplex-foundation/umi"
import { mplBubblegum, createTree } from "@metaplex-foundation/mpl-bubblegum"
import dotenv from "dotenv"
import { resolve } from "path"

dotenv.config({ path: resolve(process.cwd(), ".env.local") })

const rpc = process.env.NEXT_PUBLIC_SOLANA_RPC
const secretKeyBase64 = process.env.TFN_MINT_SECRET_KEY

if (!rpc) { console.error("NEXT_PUBLIC_SOLANA_RPC not set"); process.exit(1) }
if (!secretKeyBase64) { console.error("TFN_MINT_SECRET_KEY not set"); process.exit(1) }

console.log("RPC:", rpc.substring(0, 40) + "...")
console.log("Creating Umi instance...")

const umi = createUmi(rpc).use(mplBubblegum())

const keypairBytes = new Uint8Array(Buffer.from(secretKeyBase64, "base64"))
const keypair = umi.eddsa.createKeypairFromSecretKey(keypairBytes)
const signer = createSignerFromKeypair(umi, keypair)
umi.use(signerIdentity(signer))

console.log("Payer:", signer.publicKey.toString())

const merkleTree = generateSigner(umi)
console.log("Merkle tree address:", merkleTree.publicKey.toString())
console.log("Creating tree (depth 14, 16,384 capacity)...")

try {
  const builder = await createTree(umi, {
    merkleTree,
    maxDepth: 14,
    maxBufferSize: 64,
  })

  console.log("Sending transaction...")
  const result = await builder.sendAndConfirm(umi)

  console.log("\n✅ MERKLE TREE CREATED!")
  console.log("Tree:", merkleTree.publicKey.toString())
  console.log("Signature:", Buffer.from(result.signature).toString("base64"))
  console.log("\n📋 Add this to .env.local:")
  console.log(`TFN_MERKLE_TREE=${merkleTree.publicKey.toString()}`)
} catch (err) {
  console.error("\n❌ Failed:", err.message || err)
  if (err.logs) console.error("Logs:", err.logs)
}
