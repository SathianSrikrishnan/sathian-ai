import { Program, AnchorProvider, BN } from "@coral-xyz/anchor"
import { Connection, PublicKey, Keypair, SystemProgram, SYSVAR_RENT_PUBKEY } from "@solana/web3.js"
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress, createInitializeMintInstruction } from "@solana/spl-token"
import { ToothfairyEscrow } from "./types"
import IDL from "./idl.json"

// Program ID
export const PROGRAM_ID = new PublicKey("FqCSNerRsjdxamLyiyTvqiGKZ4vnfYngLUuTKtSi7RTC")
export const TOKEN_METADATA_PROGRAM_ID = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s")
// NEXT_PUBLIC_SOLANA_RPC env var overrides this default
export const DEVNET_RPC = process.env.NEXT_PUBLIC_SOLANA_RPC || "https://api.mainnet-beta.solana.com"

// Tooth type labels for UI
export const TOOTH_LABELS: Record<string, string> = {
  upperRightCentralIncisor: "Upper Right Central Incisor",
  upperLeftCentralIncisor: "Upper Left Central Incisor",
  lowerRightCentralIncisor: "Lower Right Central Incisor",
  lowerLeftCentralIncisor: "Lower Left Central Incisor",
  upperRightLateralIncisor: "Upper Right Lateral Incisor",
  upperLeftLateralIncisor: "Upper Left Lateral Incisor",
  lowerRightLateralIncisor: "Lower Right Lateral Incisor",
  lowerLeftLateralIncisor: "Lower Left Lateral Incisor",
  upperRightCanine: "Upper Right Canine",
  upperLeftCanine: "Upper Left Canine",
  lowerRightCanine: "Lower Right Canine",
  lowerLeftCanine: "Lower Left Canine",
  upperRightFirstMolar: "Upper Right First Molar",
  upperLeftFirstMolar: "Upper Left First Molar",
  lowerRightFirstMolar: "Lower Right First Molar",
  lowerLeftFirstMolar: "Lower Left First Molar",
  upperRightSecondMolar: "Upper Right Second Molar",
  upperLeftSecondMolar: "Upper Left Second Molar",
  lowerRightSecondMolar: "Lower Right Second Molar",
  lowerLeftSecondMolar: "Lower Left Second Molar",
}

// All tooth type keys in order
export const TOOTH_TYPES = Object.keys(TOOTH_LABELS)

// Convert tooth type key to Anchor enum format
export function toothTypeToEnum(key: string): Record<string, Record<string, never>> {
  return { [key]: {} }
}

// Get the Anchor program instance
export function getProgram(provider: AnchorProvider): Program<ToothfairyEscrow> {
  return new Program(IDL as unknown as ToothfairyEscrow, provider)
}

// PDA derivation helpers
export function getChildProfilePDA(childWallet: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("child_profile"), childWallet.toBuffer()],
    PROGRAM_ID
  )
}

export function getMilestonePDA(childProfile: PublicKey, index: number): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("milestone"), childProfile.toBuffer(), Buffer.from([index])],
    PROGRAM_ID
  )
}

export function getMetadataPDA(mint: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("metadata"), TOKEN_METADATA_PROGRAM_ID.toBuffer(), mint.toBuffer()],
    TOKEN_METADATA_PROGRAM_ID
  )
}

// Build initialize_child transaction
export async function buildInitializeChild(
  program: Program<ToothfairyEscrow>,
  guardian: PublicKey,
  childWallet: PublicKey,
  childName: string
) {
  const [childProfilePda] = getChildProfilePDA(childWallet)

  return program.methods
    .initializeChild(childName)
    .accountsPartial({
      guardian,
      childWallet,
      childProfile: childProfilePda,
      systemProgram: SystemProgram.programId,
    })
}

// Build log_milestone transaction
export async function buildLogMilestone(
  program: Program<ToothfairyEscrow>,
  connection: Connection,
  guardian: PublicKey,
  childProfilePda: PublicKey,
  milestoneIndex: number,
  toothType: string,
  metadataUri: string,
  depositLamports: BN
) {
  const nftMint = Keypair.generate()
  const [milestonePda] = getMilestonePDA(childProfilePda, milestoneIndex)
  const guardianNftAccount = await getAssociatedTokenAddress(nftMint.publicKey, guardian)
  const [metadataPda] = getMetadataPDA(nftMint.publicKey)

  // Pre-instructions: create mint account + initialize mint
  const createMintIx = SystemProgram.createAccount({
    fromPubkey: guardian,
    newAccountPubkey: nftMint.publicKey,
    space: 82,
    lamports: await connection.getMinimumBalanceForRentExemption(82),
    programId: TOKEN_PROGRAM_ID,
  })

  const initMintIx = createInitializeMintInstruction(
    nftMint.publicKey,
    0,
    guardian,
    null
  )

  const tx = await program.methods
    .logMilestone(
      toothTypeToEnum(toothType),
      metadataUri,
      depositLamports
    )
    .accountsPartial({
      guardian,
      childProfile: childProfilePda,
      milestone: milestonePda,
      nftMint: nftMint.publicKey,
      guardianNftAccount,
      metadataAccount: metadataPda,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
      rent: SYSVAR_RENT_PUBKEY,
      tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
    })
    .preInstructions([createMintIx, initMintIx])
    .signers([nftMint])

  return { tx, nftMint }
}

// Build claim_milestone transaction
export async function buildClaimMilestone(
  program: Program<ToothfairyEscrow>,
  guardian: PublicKey,
  childProfilePda: PublicKey,
  milestoneIndex: number,
  childWallet: PublicKey
) {
  const [milestonePda] = getMilestonePDA(childProfilePda, milestoneIndex)

  return program.methods
    .claimMilestone()
    .accountsPartial({
      guardian,
      childProfile: childProfilePda,
      milestone: milestonePda,
      childWallet,
      systemProgram: SystemProgram.programId,
    })
}

// Fetch all milestones for a child profile
export async function fetchMilestones(program: Program<ToothfairyEscrow>, childProfilePda: PublicKey) {
  return program.account.milestone.all([
    {
      memcmp: {
        offset: 8,
        bytes: childProfilePda.toBase58(),
      },
    },
  ])
}

// Fetch child profile
export async function fetchChildProfile(program: Program<ToothfairyEscrow>, childProfilePda: PublicKey) {
  try {
    return await program.account.childProfile.fetch(childProfilePda)
  } catch {
    return null
  }
}
