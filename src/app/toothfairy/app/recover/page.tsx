"use client"

import { useState, useEffect, useMemo } from "react"
import { useWallet, useConnection } from "@solana/wallet-adapter-react"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import { AnchorProvider } from "@coral-xyz/anchor"
import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js"
import { WalletButton } from "@/components/toothfairy/app/wallet-button"
import { C } from "@/components/toothfairy/tokens"
import {
  getEscrowProgram,
  claimToGuardian,
  fetchDepositsForMilestone,
  type DepositData,
} from "@/lib/toothfairy/escrow"

interface ProfileInfo {
  pda: string
  childName: string
  childWallet: string
  milestoneCount: number
  totalDeposited: number
  totalClaimed: number
}

interface MilestoneInfo {
  pda: string
  childProfile: string
  toothType: string
  milestoneIndex: number
  totalDeposits: number
  depositCount: number
}

export default function RecoverPage() {
  const { publicKey, signTransaction, signAllTransactions } = useWallet()
  const { connection } = useConnection()
  const { setVisible } = useWalletModal()

  const [loading, setLoading] = useState(false)
  const [profiles, setProfiles] = useState<ProfileInfo[]>([])
  const [milestones, setMilestones] = useState<MilestoneInfo[]>([])
  const [deposits, setDeposits] = useState<DepositData[]>([])
  const [claiming, setClaiming] = useState<string | null>(null)
  const [results, setResults] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  const anchorProvider = useMemo(() => {
    if (!publicKey || !signTransaction || !signAllTransactions) return null
    return new AnchorProvider(connection, { publicKey, signTransaction, signAllTransactions } as any, { commitment: "confirmed" })
  }, [publicKey, signTransaction, signAllTransactions, connection])

  // Scan ALL profiles where guardian = connected wallet
  useEffect(() => {
    if (!anchorProvider || !publicKey) return
    setLoading(true)
    setError(null)

    const program = getEscrowProgram(anchorProvider)

    async function scan() {
      try {
        // Fetch ALL child profiles owned by this guardian
        const allProfiles = await program.account.childProfile.all([
          { memcmp: { offset: 8, bytes: publicKey!.toBase58() } },
        ])

        const profileList: ProfileInfo[] = allProfiles.map((p: any) => ({
          pda: p.publicKey.toBase58(),
          childName: p.account.childName,
          childWallet: p.account.childWallet.toBase58(),
          milestoneCount: p.account.milestoneCount,
          totalDeposited: p.account.totalDeposited.toNumber(),
          totalClaimed: p.account.totalClaimed.toNumber(),
        }))
        setProfiles(profileList)

        // Fetch all milestones for each profile
        const allMilestones: MilestoneInfo[] = []
        const allDeposits: DepositData[] = []

        for (const prof of profileList) {
          const ms = await program.account.milestone.all([
            { memcmp: { offset: 8, bytes: prof.pda } },
          ])
          for (const m of ms) {
            const a = m.account as any
            const toothKey = Object.keys(a.toothType)[0] || "unknown"
            allMilestones.push({
              pda: m.publicKey.toBase58(),
              childProfile: a.childProfile.toBase58(),
              toothType: toothKey,
              milestoneIndex: a.milestoneIndex,
              totalDeposits: a.totalDeposits.toNumber(),
              depositCount: a.depositCount,
            })

            // Fetch deposits for each milestone
            const deps = await fetchDepositsForMilestone(program, m.publicKey)
            allDeposits.push(...deps)
          }
        }

        setMilestones(allMilestones)
        setDeposits(allDeposits)
      } catch (err: any) {
        setError(err.message || "Failed to scan accounts")
      } finally {
        setLoading(false)
      }
    }

    scan()
  }, [anchorProvider, publicKey])

  const unclaimedDeposits = deposits.filter(d => !d.claimed && d.amountLamports > 0)
  const lockedDeposits = unclaimedDeposits.filter(d => d.isLocked)
  const claimableDeposits = unclaimedDeposits.filter(d => !d.isLocked)
  const totalClaimable = claimableDeposits.reduce((s, d) => s + d.amountSol, 0)
  const totalLocked = lockedDeposits.reduce((s, d) => s + d.amountSol, 0)

  const handleClaimOne = async (deposit: DepositData) => {
    if (!anchorProvider || !publicKey) return
    setClaiming(deposit.pda)
    setError(null)

    try {
      const program = getEscrowProgram(anchorProvider)
      // Find the milestone and profile for this deposit
      const milestone = milestones.find(m => m.pda === deposit.milestone)
      if (!milestone) throw new Error("Milestone not found")
      const profile = profiles.find(p => p.pda === milestone.childProfile)
      if (!profile) throw new Error("Profile not found")

      const sig = await claimToGuardian(
        program,
        publicKey,
        new PublicKey(profile.pda),
        new PublicKey(milestone.pda),
        new PublicKey(deposit.pda),
      )

      setResults(prev => [...prev, `✓ Claimed ${deposit.amountSol.toFixed(4)} SOL from ${deposit.depositorName} (${profile.childName}) — ${sig.slice(0, 8)}...`])

      // Update deposit as claimed locally
      setDeposits(prev => prev.map(d => d.pda === deposit.pda ? { ...d, claimed: true } : d))
    } catch (err: any) {
      setError(`Claim failed: ${err.message}`)
    } finally {
      setClaiming(null)
    }
  }

  const handleClaimAll = async () => {
    for (const dep of claimableDeposits) {
      await handleClaimOne(dep)
      // Small delay between claims
      await new Promise(r => setTimeout(r, 1500))
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-8" style={{ background: C.bg, color: C.text, minHeight: "100vh" }}>
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold">Find my memories</h1>
          <p className="text-xs" style={{ color: C.muted }}>Start with Google. Advanced wallet fallback is only for families who already tested it.</p>
        </div>
        <WalletButton />
      </header>

      {!publicKey && (
        <div className="text-center py-20 space-y-4">
          <p className="text-sm" style={{ color: C.muted }}>
            Parents should start with the same Google account used to save the
            memory. Wallet recovery is only for families who already connected
            Phantom.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <a
              href="/api/auth/google?next=%2Ftoothfairy%2Fapp%2Fdashboard"
              className="px-6 py-3 rounded-lg text-sm font-medium text-white"
              style={{ background: "#9945FF" }}
            >
              Continue with Google
            </a>
            <button onClick={() => setVisible(true)} className="px-6 py-3 rounded-lg text-sm font-medium" style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.text }}>
              Advanced wallet fallback
            </button>
          </div>
        </div>
      )}

      {loading && (
        <div className="text-center py-20">
          <p className="text-sm animate-pulse" style={{ color: C.muted }}>Looking for memories...</p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-3 rounded-lg text-sm" style={{ background: "rgba(244,63,94,0.1)", color: C.rose }}>
          {error}
        </div>
      )}

      {!loading && publicKey && profiles.length > 0 && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="rounded-xl p-6 text-center" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
            <div className="text-3xl font-bold mb-1" style={{ color: "#14F195" }}>{totalClaimable.toFixed(4)} SOL</div>
            <p className="text-sm" style={{ color: C.muted }}>claimable now across {claimableDeposits.length} deposits</p>
            {totalLocked > 0 && (
              <p className="text-xs mt-1" style={{ color: C.dim }}>{totalLocked.toFixed(4)} SOL locked ({lockedDeposits.length} deposits)</p>
            )}
            <p className="text-xs mt-2" style={{ color: C.dim }}>
              Found {profiles.length} profiles · {milestones.length} milestones · {deposits.length} total deposits
            </p>
          </div>

          {/* Claim All button */}
          {claimableDeposits.length > 0 && (
            <button
              onClick={handleClaimAll}
              disabled={!!claiming}
              className="w-full px-6 py-4 rounded-xl text-sm font-semibold text-white disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #9945FF, #14F195)" }}
            >
              {claiming ? "Claiming..." : `Claim All ${totalClaimable.toFixed(4)} SOL → Your Wallet`}
            </button>
          )}

          {/* Results log */}
          {results.length > 0 && (
            <div className="rounded-xl p-4 space-y-1" style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.2)" }}>
              <h3 className="text-xs font-medium mb-2" style={{ color: "#14F195" }}>Claim Results</h3>
              {results.map((r, i) => (
                <p key={i} className="text-xs font-mono" style={{ color: C.muted }}>{r}</p>
              ))}
            </div>
          )}

          {/* Individual deposits */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium" style={{ color: C.muted }}>All Deposits</h3>
            {deposits.map(d => {
              const milestone = milestones.find(m => m.pda === d.milestone)
              const profile = profiles.find(p => milestone && p.pda === milestone.childProfile)
              return (
                <div key={d.pda} className="rounded-lg p-3 flex items-center justify-between" style={{ background: C.surface, border: `1px solid ${C.border}`, opacity: d.claimed ? 0.4 : 1 }}>
                  <div>
                    <span className="text-sm font-medium">{profile?.childName || "?"}</span>
                    <span className="text-xs ml-2" style={{ color: C.dim }}>from {d.depositorName}</span>
                    <div className="text-xs" style={{ color: d.isLocked ? "#F0C456" : d.claimed ? C.dim : "#14F195" }}>
                      {d.claimed ? "Claimed" : d.isLocked ? d.lockLabel : "Available"}
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <span className="text-sm font-mono">{d.amountSol.toFixed(4)} SOL</span>
                    {!d.claimed && !d.isLocked && (
                      <button
                        onClick={() => handleClaimOne(d)}
                        disabled={!!claiming}
                        className="text-xs px-3 py-1.5 rounded-full font-medium disabled:opacity-50"
                        style={{ background: "rgba(20,241,149,0.15)", color: "#14F195" }}
                      >
                        {claiming === d.pda ? "..." : "Claim"}
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Profile inventory */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium" style={{ color: C.muted }}>Profiles Found</h3>
            {profiles.map(p => (
              <div key={p.pda} className="rounded-lg p-3 text-xs" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                <div className="flex justify-between">
                  <span className="font-medium text-sm">{p.childName}</span>
                  <span className="font-mono" style={{ color: C.dim }}>{((p.totalDeposited - p.totalClaimed) / 1e9).toFixed(4)} SOL</span>
                </div>
                <div style={{ color: C.dim }}>
                  {p.milestoneCount} milestones · wallet: {p.childWallet.slice(0, 6)}...{p.childWallet.slice(-4)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {!loading && publicKey && profiles.length === 0 && (
        <div className="text-center py-20">
          <p className="text-sm" style={{ color: C.muted }}>No memories found for this wallet.</p>
        </div>
      )}

      <footer className="mt-12 pt-4 text-center" style={{ borderTop: `1px solid ${C.border}` }}>
        <p className="text-xs" style={{ color: C.dim }}>Tooth Fairy Network recovery &middot; Parent-controlled recovery</p>
      </footer>
    </div>
  )
}
