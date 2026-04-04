/**
 * Crossmint integration for walletless NFT delivery.
 * Mints cNFTs to email addresses — recipients view at crossmint.com/user/collection.
 * Uses server-side API (CROSSMINT_SERVER_KEY, never client-side).
 */

const CROSSMINT_API = "https://www.crossmint.com/api"
const TFN_COLLECTION_ID = "5604753e-f658-49f3-8738-7258573bcff4"

interface CrossmintMintParams {
  recipientEmail: string
  name: string
  description: string
  imageUrl: string // Must be a publicly accessible URL (e.g., Arweave)
  attributes?: Array<{ trait_type: string; value: string }>
}

interface CrossmintMintResult {
  id: string
  actionId: string
  onChain: {
    status: string
    chain: string
    mintHash?: string
  }
}

/**
 * Mint an NFT to an email address via Crossmint.
 * The recipient gets an email notification and can view at crossmint.com.
 */
export async function mintToEmail(params: CrossmintMintParams): Promise<CrossmintMintResult> {
  const serverKey = process.env.CROSSMINT_SERVER_KEY
  if (!serverKey) throw new Error("CROSSMINT_SERVER_KEY not configured")

  const res = await fetch(`${CROSSMINT_API}/2022-06-09/collections/${TFN_COLLECTION_ID}/nfts`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": serverKey,
    },
    body: JSON.stringify({
      recipient: `email:${params.recipientEmail}:solana`,
      metadata: {
        name: params.name,
        description: params.description,
        image: params.imageUrl,
        attributes: params.attributes || [],
      },
      compressed: true, // Use cNFTs for low cost
      sendNotification: true, // Email the recipient
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Crossmint mint failed (${res.status}): ${body}`)
  }

  return res.json()
}

/**
 * Check mint status by action ID.
 */
export async function checkMintStatus(actionId: string): Promise<{ status: string; onChain?: any }> {
  const serverKey = process.env.CROSSMINT_SERVER_KEY
  if (!serverKey) throw new Error("CROSSMINT_SERVER_KEY not configured")

  const res = await fetch(`${CROSSMINT_API}/2022-06-09/actions/${actionId}`, {
    headers: { "X-API-KEY": serverKey },
  })

  if (!res.ok) {
    throw new Error(`Crossmint status check failed (${res.status})`)
  }

  return res.json()
}
