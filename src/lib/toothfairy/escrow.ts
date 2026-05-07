/**
 * TFN Escrow Client — Client-side interactions with the Tooth Fairy escrow contract.
 *
 * V2: Adds treasury PDA (2% fee), UntilTimestamp lock, simplified lock periods.
 */
import { PublicKey, SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js"
import { Program, AnchorProvider, BN } from "@coral-xyz/anchor"
import idl from "./escrow-idl.json"

export const PROGRAM_ID = new PublicKey("FqCSNerRsjdxamLyiyTvqiGKZ4vnfYngLUuTKtSi7RTC")

// Platform fee: 2% (200 basis points)
export const PLATFORM_FEE_BPS = 200

// Lock period types for the V2 UI (simplified: now vs a suggested unlock age)
export type LockPeriodKey = "immediate" | "untilTimestamp" | "threeYears" | "fiveYears" | "sevenYears" | "tenYears" | "fifteenYears"

export const LOCK_PERIODS: { key: LockPeriodKey; label: string; years: number }[] = [
  { key: "immediate", label: "Available now", years: 0 },
  { key: "threeYears", label: "3 years", years: 3 },
  { key: "fiveYears", label: "5 years", years: 5 },
  { key: "sevenYears", label: "7 years", years: 7 },
  { key: "tenYears", label: "10 years", years: 10 },
  { key: "fifteenYears", label: "15 years", years: 15 },
]

function toLockPeriodArg(key: LockPeriodKey, lockUntilTimestamp?: number) {
  if (key === "untilTimestamp" && lockUntilTimestamp) {
    return { untilTimestamp: { lockUntil: new BN(lockUntilTimestamp) } }
  }
  return { [key]: {} }
}

// ── PDA Derivation ──

/**
 * V2: PDA seeded by child_wallet only (guardian removed from seeds).
 * This allows guardianship transfer without breaking PDA derivation.
 */
export function getChildProfilePDA(childWallet: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("child_profile"), childWallet.toBuffer()],
    PROGRAM_ID
  )
}

export function getConfigPDA(): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("config")],
    PROGRAM_ID
  )
}

export function getMilestonePDA(childProfile: PublicKey, milestoneIndex: number): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("milestone"), childProfile.toBuffer(), Buffer.from([milestoneIndex])],
    PROGRAM_ID
  )
}

export function getDepositPDA(milestone: PublicKey, depositCount: number): [PublicKey, number] {
  const buf = Buffer.alloc(4)
  buf.writeUInt32LE(depositCount)
  return PublicKey.findProgramAddressSync(
    [Buffer.from("deposit"), milestone.toBuffer(), buf],
    PROGRAM_ID
  )
}

export function getTreasuryPDA(): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("treasury")],
    PROGRAM_ID
  )
}

/**
 * Derive a deterministic "placeholder" child wallet from guardian + child name.
 * Used when the parent doesn't provide a real wallet for the child.
 * The guardian can update this later via update_child_wallet.
 */
export function deriveChildWallet(guardian: PublicKey, childName: string): PublicKey {
  const [derived] = PublicKey.findProgramAddressSync(
    [Buffer.from("tfn_child"), guardian.toBuffer(), Buffer.from(childName.toLowerCase().trim())],
    PROGRAM_ID
  )
  return derived
}

/**
 * Calculate the Unix timestamp for a child's suggested TFN unlock date.
 */
export function calculateUnlockBirthday(dob: Date, unlockAge = 10): number {
  const unlockDate = new Date(dob)
  unlockDate.setFullYear(unlockDate.getFullYear() + unlockAge)
  return Math.floor(unlockDate.getTime() / 1000)
}

export function calculateEighteenthBirthday(dob: Date): number {
  return calculateUnlockBirthday(dob, 18)
}

/**
 * Calculate fee breakdown for a deposit.
 */
export function calculateFee(amountSol: number): { gross: number; fee: number; net: number } {
  const grossLamports = Math.floor(amountSol * LAMPORTS_PER_SOL)
  const feeLamports = Math.floor(grossLamports * PLATFORM_FEE_BPS / 10000)
  const netLamports = grossLamports - feeLamports
  return {
    gross: grossLamports / LAMPORTS_PER_SOL,
    fee: feeLamports / LAMPORTS_PER_SOL,
    net: netLamports / LAMPORTS_PER_SOL,
  }
}

// ── Program Instance ──

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getEscrowProgram(provider: AnchorProvider): any {
  return new Program(idl as any, provider)
}

// ── Instructions ──

export async function initializeChild(
  program: any,
  guardian: PublicKey,
  childWallet: PublicKey,
  childName: string,
): Promise<string> {
  const [childProfilePda] = getChildProfilePDA(childWallet)

  return program.methods
    .initializeChild(childName)
    .accounts({
      guardian,
      childWallet,
      childProfile: childProfilePda,
      systemProgram: SystemProgram.programId,
    })
    .rpc()
}

export async function deposit(
  program: any,
  depositor: PublicKey,
  childProfilePda: PublicKey,
  milestonePda: PublicKey,
  amountSol: number,
  lockPeriod: LockPeriodKey,
  depositorName: string,
  lockUntilTimestamp?: number,
): Promise<string> {
  // Fetch current deposit count from milestone (with retry for propagation delay)
  let milestone: any
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      milestone = await program.account.milestone.fetch(milestonePda)
      break
    } catch (err: any) {
      if (attempt < 2) {
        await new Promise(r => setTimeout(r, 2000))
      } else {
        throw new Error(`Milestone not found after retries. It may not be confirmed yet. Try again in a few seconds.`)
      }
    }
  }
  const depositCount = (milestone as any).depositCount as number

  const [depositPda] = getDepositPDA(milestonePda, depositCount)
  const [treasuryPda] = getTreasuryPDA()
  const [configPda] = getConfigPDA()

  return program.methods
    .deposit(
      new BN(Math.floor(amountSol * LAMPORTS_PER_SOL)),
      toLockPeriodArg(lockPeriod, lockUntilTimestamp),
      depositorName,
    )
    .accounts({
      depositor,
      childProfile: childProfilePda,
      milestone: milestonePda,
      depositAccount: depositPda,
      treasury: treasuryPda,
      config: configPda,
      systemProgram: SystemProgram.programId,
    })
    .rpc()
}

export async function claimDeposit(
  program: any,
  guardian: PublicKey,
  childProfilePda: PublicKey,
  milestonePda: PublicKey,
  depositPda: PublicKey,
  childWallet: PublicKey,
): Promise<string> {
  const [configPda] = getConfigPDA()

  return program.methods
    .claimDeposit()
    .accounts({
      guardian,
      childProfile: childProfilePda,
      milestone: milestonePda,
      depositAccount: depositPda,
      childWallet,
      config: configPda,
      systemProgram: SystemProgram.programId,
    })
    .rpc()
}

/**
 * Update child wallet to a new address.
 * Used to redirect claims to the guardian's own wallet (for "Gift Now")
 * or to a child's real wallet when they're old enough.
 */
export async function updateChildWallet(
  program: any,
  guardian: PublicKey,
  childProfilePda: PublicKey,
  newChildWallet: PublicKey,
): Promise<string> {
  return program.methods
    .updateChildWallet()
    .accounts({
      guardian,
      childProfile: childProfilePda,
      newChildWallet,
    })
    .rpc()
}

/**
 * Claim a deposit, sending SOL to the guardian's wallet.
 * Automatically updates child_wallet to guardian's address first if needed.
 */
export async function claimToGuardian(
  program: any,
  guardian: PublicKey,
  childProfilePda: PublicKey,
  milestonePda: PublicKey,
  depositPda: PublicKey,
): Promise<string> {
  // Check if child_wallet already points to guardian
  const profile = await program.account.childProfile.fetch(childProfilePda)
  const currentChildWallet = (profile as any).childWallet as PublicKey

  if (currentChildWallet.toBase58() !== guardian.toBase58()) {
    // Update child wallet to guardian's address first
    await updateChildWallet(program, guardian, childProfilePda, guardian)
  }

  // Now claim — SOL goes to guardian's wallet
  return claimDeposit(program, guardian, childProfilePda, milestonePda, depositPda, guardian)
}

// ── Account Fetching ──

export interface ChildProfileData {
  guardian: string
  childWallet: string
  childName: string
  milestoneCount: number
  totalDeposited: number
  totalClaimed: number
  depositCount: number
  pda: string
}

export async function fetchChildProfile(
  program: any,
  guardian: PublicKey,
  childWallet: PublicKey,
): Promise<ChildProfileData | null> {
  const [pda] = getChildProfilePDA(childWallet)
  try {
    const account = await program.account.childProfile.fetch(pda)
    const a = account as any
    return {
      guardian: a.guardian.toBase58(),
      childWallet: a.childWallet.toBase58(),
      childName: a.childName,
      milestoneCount: a.milestoneCount,
      totalDeposited: a.totalDeposited.toNumber(),
      totalClaimed: a.totalClaimed.toNumber(),
      depositCount: a.depositCount,
      pda: pda.toBase58(),
    }
  } catch {
    return null
  }
}

export interface MilestoneData {
  childProfile: string
  toothType: string
  metadataUri: string
  totalDeposits: number
  depositCount: number
  createdAt: number
  milestoneIndex: number
  pda: string
}

export async function fetchMilestonesForProfile(
  program: any,
  childProfilePda: PublicKey,
): Promise<MilestoneData[]> {
  const milestones = await program.account.milestone.all([
    { memcmp: { offset: 8, bytes: childProfilePda.toBase58() } },
  ])

  return milestones.map((m: any) => {
    const a = m.account as any
    const toothTypeObj = a.toothType
    const toothKey = Object.keys(toothTypeObj)[0] || "unknown"
    return {
      childProfile: a.childProfile.toBase58(),
      toothType: toothKey,
      metadataUri: a.metadataUri,
      totalDeposits: a.totalDeposits.toNumber(),
      depositCount: a.depositCount,
      createdAt: a.createdAt.toNumber(),
      milestoneIndex: a.milestoneIndex,
      pda: m.publicKey.toBase58(),
    }
  })
}

export interface DepositData {
  milestone: string
  depositor: string
  depositorName: string
  amountLamports: number
  amountSol: number
  lockUntil: number
  claimed: boolean
  createdAt: number
  claimedAt: number | null
  depositIndex: number
  pda: string
  isLocked: boolean
  lockLabel: string
}

export async function fetchDepositsForMilestone(
  program: any,
  milestonePda: PublicKey,
): Promise<DepositData[]> {
  const deposits = await program.account.deposit.all([
    { memcmp: { offset: 8, bytes: milestonePda.toBase58() } },
  ])

  const now = Math.floor(Date.now() / 1000)

  return deposits.map((d: any) => {
    const a = d.account as any
    const lockUntil = a.lockUntil.toNumber()
    const isLocked = lockUntil > 0 && now < lockUntil
    const amountLamports = a.amountLamports.toNumber()

    let lockLabel = "Available now"
    if (lockUntil > 0) {
      const unlockDate = new Date(lockUntil * 1000)
      lockLabel = isLocked
        ? `Locked until ${unlockDate.toLocaleDateString()}`
        : `Unlocked (${unlockDate.toLocaleDateString()})`
    }

    return {
      milestone: a.milestone.toBase58(),
      depositor: a.depositor.toBase58(),
      depositorName: a.depositorName,
      amountLamports,
      amountSol: amountLamports / LAMPORTS_PER_SOL,
      lockUntil,
      claimed: a.claimed,
      createdAt: a.createdAt.toNumber(),
      claimedAt: a.claimedAt ? a.claimedAt.toNumber() : null,
      depositIndex: a.depositIndex,
      pda: d.publicKey.toBase58(),
      isLocked,
      lockLabel,
    }
  })
}
