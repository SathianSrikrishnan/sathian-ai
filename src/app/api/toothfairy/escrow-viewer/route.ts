import { NextResponse } from "next/server"
import { Connection, PublicKey, Keypair } from "@solana/web3.js"
import { Program, AnchorProvider, Wallet, BN } from "@coral-xyz/anchor"
import IDL from "@/lib/toothfairy/escrow-idl.json"

function getReadOnlyProvider(connection: Connection): AnchorProvider {
  // Create a dummy wallet for read-only operations
  const dummyKeypair = Keypair.generate()
  const dummyWallet = {
    publicKey: dummyKeypair.publicKey,
    signTransaction: async (tx: unknown) => tx,
    signAllTransactions: async (txs: unknown[]) => txs,
  } as unknown as Wallet
  return new AnchorProvider(connection, dummyWallet, {
    commitment: "confirmed",
  })
}

function lamportsToSol(lamports: number | BN): number {
  const val = typeof lamports === "number" ? lamports : Number(lamports.toString())
  return val / 1e9
}

export async function GET() {
  try {
    const rpc = process.env.NEXT_PUBLIC_SOLANA_RPC || "https://api.mainnet-beta.solana.com"
    const connection = new Connection(rpc, "confirmed")
    const provider = getReadOnlyProvider(connection)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const program = new Program(IDL as any, provider)

    // Fetch all account types in parallel
    const [childProfiles, deposits, treasuryAccounts, configAccounts] = await Promise.all([
      program.account.childProfile.all(),
      program.account.deposit.all(),
      program.account.treasury.all(),
      program.account.config.all(),
    ])

    // Process deposits
    const now = Math.floor(Date.now() / 1000)
    const REFUND_GRACE_PERIOD = 7 * 24 * 60 * 60

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const depositRows = deposits.map((d: any) => {
      const acct = d.account
      const lockUntil = Number(acct.lockUntil.toString())
      const createdAt = Number(acct.createdAt.toString())
      const amountLamports = Number(acct.amountLamports.toString())
      const claimed = acct.claimed as boolean
      const claimedAt = acct.claimedAt ? Number(acct.claimedAt.toString()) : null
      const refundDeadline = createdAt + REFUND_GRACE_PERIOD

      // Determine status
      let status: string
      if (claimed) {
        status = "claimed"
      } else if (now <= refundDeadline) {
        status = "refundable"
      } else if (lockUntil === 0) {
        // Immediate lock — always claimable
        status = "matured"
      } else if (now >= lockUntil) {
        status = "matured"
      } else {
        status = "active"
      }

      // Determine lock type
      let lockType: string
      if (lockUntil === 0) {
        lockType = "Immediate"
      } else {
        const lockDurationYears = (lockUntil - createdAt) / 31_557_600
        if (Math.abs(lockDurationYears - 3) < 0.1) lockType = "3 Years"
        else if (Math.abs(lockDurationYears - 5) < 0.1) lockType = "5 Years"
        else if (Math.abs(lockDurationYears - 7) < 0.1) lockType = "7 Years"
        else if (Math.abs(lockDurationYears - 10) < 0.1) lockType = "10 Years"
        else if (Math.abs(lockDurationYears - 15) < 0.1) lockType = "15 Years"
        else lockType = "Custom"
      }

      return {
        pubkey: d.publicKey.toBase58(),
        milestone: (acct.milestone as PublicKey).toBase58(),
        depositor: (acct.depositor as PublicKey).toBase58(),
        depositorName: acct.depositorName as string,
        amountSol: lamportsToSol(amountLamports),
        amountLamports,
        lockType,
        lockUntil: lockUntil > 0 ? new Date(lockUntil * 1000).toISOString() : null,
        status,
        createdAt: new Date(createdAt * 1000).toISOString(),
        claimedAt: claimedAt ? new Date(claimedAt * 1000).toISOString() : null,
        depositIndex: acct.depositIndex as number,
      }
    })

    // Process profiles into a simpler format
    const profiles = childProfiles.map((p) => {
      const acct = p.account
      return {
        pubkey: p.publicKey.toBase58(),
        guardian: (acct.guardian as PublicKey).toBase58(),
        childWallet: (acct.childWallet as PublicKey).toBase58(),
        childName: acct.childName as string,
        milestoneCount: acct.milestoneCount as number,
        totalDepositedSol: lamportsToSol(Number((acct.totalDeposited as BN).toString())),
        totalClaimedSol: lamportsToSol(Number((acct.totalClaimed as BN).toString())),
        depositCount: acct.depositCount as number,
        status: acct.status as number,
      }
    })

    // Treasury info
    const treasury = treasuryAccounts.length > 0
      ? {
          authority: (treasuryAccounts[0].account.authority as PublicKey).toBase58(),
          totalCollectedSol: lamportsToSol(Number((treasuryAccounts[0].account.totalCollected as BN).toString())),
          totalCollectedLamports: Number((treasuryAccounts[0].account.totalCollected as BN).toString()),
        }
      : null

    // Config info
    const config = configAccounts.length > 0
      ? {
          authority: (configAccounts[0].account.authority as PublicKey).toBase58(),
          paused: configAccounts[0].account.paused as boolean,
        }
      : null

    // Summary stats
    const activeDeposits = depositRows.filter((d) => d.status === "active")
    const totalDepositedSol = depositRows.reduce((sum, d) => sum + d.amountSol, 0)
    const totalActiveSOL = activeDeposits.reduce((sum, d) => sum + d.amountSol, 0)

    return NextResponse.json({
      summary: {
        totalProfiles: profiles.length,
        totalDeposits: depositRows.length,
        activeDeposits: activeDeposits.length,
        totalDepositedSol: Math.round(totalDepositedSol * 1e9) / 1e9,
        totalActiveSOL: Math.round(totalActiveSOL * 1e9) / 1e9,
        feesCollectedSol: treasury?.totalCollectedSol ?? 0,
        contractPaused: config?.paused ?? false,
      },
      profiles,
      deposits: depositRows,
      treasury,
      config,
      fetchedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Escrow viewer error:", error)
    return NextResponse.json(
      { error: "Failed to fetch escrow data", details: String(error) },
      { status: 500 }
    )
  }
}
