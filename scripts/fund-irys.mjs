/**
 * Fund Irys (Arweave uploader) with SOL from the server wallet.
 *
 * Run: node scripts/fund-irys.mjs [amount_in_sol]
 * Default: 0.2 SOL (~200+ uploads)
 */
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults"
import {
  createSignerFromKeypair,
  signerIdentity,
  sol,
} from "@metaplex-foundation/umi"
import { irysUploader } from "@metaplex-foundation/umi-uploader-irys"
import { resolve } from "path"
import dotenv from "dotenv"

dotenv.config({ path: resolve(process.cwd(), ".env.local") })

const rpc = process.env.NEXT_PUBLIC_SOLANA_RPC
const secretKeyBase64 = process.env.TFN_MINT_SECRET_KEY

if (!rpc || !secretKeyBase64) {
  console.error("Missing env vars: NEXT_PUBLIC_SOLANA_RPC, TFN_MINT_SECRET_KEY")
  process.exit(1)
}

const amountSol = parseFloat(process.argv[2] || "0.2")

console.log("\n💰 Funding Irys (Arweave uploader)")
console.log("═".repeat(40))
console.log("  Amount:", amountSol, "SOL")
console.log("  Node: https://node2.irys.xyz")

const umi = createUmi(rpc)
  .use(irysUploader({ address: "https://node2.irys.xyz" }))

const keypairBytes = new Uint8Array(Buffer.from(secretKeyBase64, "base64"))
const keypair = umi.eddsa.createKeypairFromSecretKey(keypairBytes)
const signer = createSignerFromKeypair(umi, keypair)
umi.use(signerIdentity(signer))

console.log("  Wallet:", signer.publicKey.toString())

try {
  console.log("\n  Sending", amountSol, "SOL to Irys...")
  await umi.uploader.fund(sol(amountSol))
  console.log("  ✅ Funded successfully!")

  // Verify new balance
  const response = await fetch(`https://node2.irys.xyz/account/balance/solana?address=${signer.publicKey.toString()}`)
  const data = await response.json()
  console.log("  New Irys balance:", (parseInt(data.balance) / 1e9).toFixed(6), "SOL")
  console.log("  Estimated uploads remaining: ~" + Math.floor(parseInt(data.balance) / 1000000))
} catch (err) {
  console.error("  ❌ Funding failed:", err.message)
  process.exit(1)
}
