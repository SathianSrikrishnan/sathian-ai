/**
 * Test minting a cNFT to a wallet address.
 * Run: node scripts/test-mint.mjs <wallet_address> <child_name> <tooth_number>
 * Example: node scripts/test-mint.mjs 5fWRv9gLT23uZnrRXRtCrqnQG1y8E4h2NftrVh9YdYq9 Isa 1
 */
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import { createSignerFromKeypair, signerIdentity, publicKey as umiPublicKey, generateSigner } from "@metaplex-foundation/umi"
import { mplBubblegum, mintV1 } from "@metaplex-foundation/mpl-bubblegum"
import dotenv from "dotenv"
import { resolve } from "path"

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
const toothNumber = parseInt(process.argv[4] || "1")

console.log("Minting cNFT...")
console.log("  To wallet:", walletAddress)
console.log("  Child:", childName)
console.log("  Tooth #:", toothNumber)
console.log("  Merkle tree:", merkleTreeKey)

const umi = createUmi(rpc).use(mplBubblegum())

const keypairBytes = new Uint8Array(Buffer.from(secretKeyBase64, "base64"))
const keypair = umi.eddsa.createKeypairFromSecretKey(keypairBytes)
const signer = createSignerFromKeypair(umi, keypair)
umi.use(signerIdentity(signer))

try {
  const result = await mintV1(umi, {
    leafOwner: umiPublicKey(walletAddress),
    merkleTree: umiPublicKey(merkleTreeKey),
    metadata: {
      name: `${childName}'s Tooth #${toothNumber}`,
      symbol: "TFN",
      uri: `https://sathian.ai/api/toothfairy/metadata?child=${encodeURIComponent(childName)}&tooth=${toothNumber}&type=Baby+Tooth`,
      sellerFeeBasisPoints: 0,
      collection: null,
      creators: [
        { address: signer.publicKey, verified: true, share: 100 },
      ],
    },
  }).sendAndConfirm(umi)

  console.log("\n✅ cNFT MINTED!")
  console.log("Signature:", Buffer.from(result.signature).toString("base64"))
  console.log("\n🔍 Check in Phantom wallet → Collectibles tab")
  console.log("   Or view on Solscan: https://solscan.io/account/" + walletAddress + "#portfolio")
} catch (err) {
  console.error("\n❌ Mint failed:", err.message || err)
  if (err.logs) console.error("Logs:", err.logs)
}
