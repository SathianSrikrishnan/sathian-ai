"use client"

import { useState, useMemo, useEffect } from "react"
import { useWallet, useConnection } from "@solana/wallet-adapter-react"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import { AnchorProvider } from "@coral-xyz/anchor"
import { PublicKey } from "@solana/web3.js"
import { useParams } from "next/navigation"
import {
  getEscrowProgram,
  deposit as escrowDeposit,
  fetchDepositsForMilestone,
  calculateFee,
  type LockPeriodKey,
  type DepositData,
} from "@/lib/toothfairy/escrow"
import { WalletButton } from "@/components/toothfairy/app/wallet-button"
import { C } from "@/components/toothfairy/tokens"
import Link from "next/link"

export default function GiftPage() {
  const params = useParams()
  const milestonePda = params.milestone as string

  const { publicKey, signTransaction, signAllTransactions } = useWallet()
  const { connection } = useConnection()
  const { setVisible } = useWalletModal()

  const [depositorName, setDepositorName] = useState("")
  const [depositAmount, setDepositAmount] = useState("1")
  const [lockChoice, setLockChoice] = useState<"now" | "eighteen">("eighteen")
  const [loading, setLoading] = useState(false)
  const [deposits, setDeposits] = useState<DepositData[]>([])
  const [milestoneData, setMilestoneData] = useState<any>(null)
  const [childProfileData, setChildProfileData] = useState<any>(null)
  const [childProfilePda, setChildProfilePda] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [pageLoading, setPageLoading] = useState(true)

  const anchorProvider = useMemo(() => {
    if (!publicKey || !signTransaction || !signAllTransactions) return null
    return new AnchorProvider(connection, { publicKey, signTransaction, signAllTransactions } as any, { commitment: "confirmed" })
  }, [publicKey, signTransaction, signAllTransactions, connection])

  // Load milestone data + deposits
  useEffect(() => {
    if (!anchorProvider || !milestonePda) return
    const load = async () => {
      try {
        const program = getEscrowProgram(anchorProvider)
        const milestone = await program.account.milestone.fetch(new PublicKey(milestonePda))
        setMilestoneData(milestone)
        setChildProfilePda(milestone.childProfile.toBase58())

        // Fetch child profile for name and DOB
        try {
          const profile = await program.account.childProfile.fetch(milestone.childProfile)
          setChildProfileData(profile)
        } catch {}

        const deps = await fetchDepositsForMilestone(program, new PublicKey(milestonePda))
        setDeposits(deps)
      } catch (err: any) {
        setError("Could not find this milestone. The link may be invalid.")
      } finally {
        setPageLoading(false)
      }
    }
    load()
  }, [anchorProvider, milestonePda])

  // Also try loading without wallet (just to show info)
  useEffect(() => {
    if (anchorProvider) return // already loading with wallet
    setPageLoading(false)
  }, [anchorProvider])

  const handleDeposit = async () => {
    if (!publicKey || !anchorProvider || !childProfilePda) return
    setError(null); setLoading(true); setSuccess(null)

    try {
      const program = getEscrowProgram(anchorProvider)
      const amount = parseFloat(depositAmount)
      if (isNaN(amount) || amount <= 0) throw new Error("Enter a valid amount")
      if (!depositorName.trim()) throw new Error("Enter your name")

      // Calculate lock
      let lockPeriodKey: LockPeriodKey = "immediate"
      let lockTimestamp: number | undefined
      if (lockChoice === "eighteen") {
        // Get DOB from localStorage or profile name
        const childName = childProfileData?.childName || ""
        const dobStr = typeof window !== "undefined" ? localStorage.getItem(`tfn-child-dob-${childName}`) || localStorage.getItem(`tfn-child-dob-${childName.toLowerCase().trim()}`) : null
        if (dobStr) {
          const dob = new Date(dobStr + "T00:00:00")
          const eighteenth = new Date(dob)
          eighteenth.setFullYear(eighteenth.getFullYear() + 18)
          lockTimestamp = Math.floor(eighteenth.getTime() / 1000)
          lockPeriodKey = "untilTimestamp"
        } else {
          // Fallback: 18 years from now
          lockTimestamp = Math.floor(Date.now() / 1000) + (18 * 365.25 * 24 * 60 * 60)
          lockPeriodKey = "untilTimestamp"
        }
      }

      await escrowDeposit(program, publicKey, new PublicKey(childProfilePda), new PublicKey(milestonePda), amount, lockPeriodKey, depositorName.trim(), lockTimestamp)

      const deps = await fetchDepositsForMilestone(program, new PublicKey(milestonePda))
      setDeposits(deps)
      setSuccess(`${depositAmount} SOL deposited!`)

      // Fire-and-forget deposit email to the child's guardian.
      // The route resolves the guardian email server-side from childProfilePda.
      const feeSol = amount * 0.02
      const netSol = amount - feeSol
      fetch("/api/toothfairy/deposit-email", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          childProfilePda,
          depositorName: depositorName.trim(),
          amountSol: amount,
          feeSol,
          netSol,
          lockChoice,
          txSignature: null,
        }),
      }).catch((err) => console.error("[gift] deposit-email dispatch failed:", err))

      setDepositAmount("0.1"); setDepositorName("")
    } catch (err: any) {
      setError(err.message || "Deposit failed")
    } finally { setLoading(false) }
  }

  const totalEscrowed = deposits.reduce((s, d) => s + (d.claimed ? 0 : d.amountSol), 0)

  return (
    <div className="max-w-lg mx-auto px-6 py-8">
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Tooth Fairy Network</h1>
          <p className="text-xs" style={{ color: C.muted }}>Gift SOL savings</p>
        </div>
        <WalletButton />
      </header>

      {error && (
        <div className="mb-6 p-3 rounded-lg text-sm" style={{ background: "rgba(244, 63, 94, 0.1)", color: C.rose }}>
          {error}
          <button onClick={() => setError(null)} className="ml-2 underline text-xs">dismiss</button>
        </div>
      )}

      {pageLoading && (
        <div className="text-center py-20">
          <p className="text-sm animate-pulse" style={{ color: C.muted }}>Loading...</p>
        </div>
      )}

      {!pageLoading && (
        <div className="space-y-6">
          <div className="text-center py-4">
            <div className="text-4xl mb-3">🎁</div>
            <h2 className="text-xl font-medium">Gift SOL to a child&apos;s tooth</h2>
            <p className="text-sm mt-1" style={{ color: C.muted }}>
              Someone shared this link with you. Deposit SOL as a gift — the child claims it when they grow up.
            </p>
          </div>

          {/* Existing deposits */}
          {deposits.length > 0 && (
            <div className="rounded-xl p-4 space-y-1" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
              <p className="text-xs font-medium mb-2" style={{ color: C.muted }}>
                {deposits.length} gift{deposits.length > 1 ? "s" : ""} &middot; {totalEscrowed.toFixed(2)} SOL in escrow
              </p>
              {deposits.filter(d => !d.claimed).map((d, i) => (
                <div key={i} className="flex justify-between text-xs py-1">
                  <span>{d.depositorName} <span style={{ color: C.dim }}>{d.lockLabel}</span></span>
                  <span className="font-mono">{d.amountSol.toFixed(2)} SOL</span>
                </div>
              ))}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="rounded-xl p-4 text-center" style={{ background: "rgba(16, 185, 129, 0.1)", border: "1px solid rgba(16, 185, 129, 0.3)" }}>
              <div className="text-2xl mb-1">✨</div>
              <p className="text-sm font-medium" style={{ color: C.emerald }}>{success}</p>
              <p className="text-xs mt-1" style={{ color: C.muted }}>Your gift is held safely in escrow on Solana.</p>
            </div>
          )}

          {/* Connect wallet prompt */}
          {!publicKey && (
            <div className="text-center py-8 space-y-4">
              <p className="text-sm" style={{ color: C.muted }}>Connect your Phantom wallet to deposit SOL.</p>
              <button onClick={() => setVisible(true)} className="px-6 py-3 rounded-lg text-sm font-medium text-white" style={{ background: "#ab9ff2" }}>
                Connect Wallet
              </button>
            </div>
          )}

          {/* Deposit form */}
          {publicKey && childProfilePda && (
            <div className="rounded-xl p-5 space-y-4" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
              <p className="text-sm font-semibold">Add your gift{childProfileData?.childName ? ` for ${childProfileData.childName}` : ""}</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs mb-1" style={{ color: C.muted }}>Your name</label>
                  <input type="text" value={depositorName} onChange={e => setDepositorName(e.target.value)} placeholder="Dad"
                    className="w-full px-3 py-2.5 rounded-lg text-sm bg-white/[0.03] border outline-none focus:border-white/20" style={{ borderColor: C.border, color: C.text }} />
                </div>
                <div>
                  <label className="block text-xs mb-1" style={{ color: C.muted }}>Amount (SOL)</label>
                  <input type="number" value={depositAmount} onChange={e => setDepositAmount(e.target.value)} min="0.01" step="0.1"
                    className="w-full px-3 py-2.5 rounded-lg text-sm bg-white/[0.03] border outline-none focus:border-white/20" style={{ borderColor: C.border, color: C.text }} />
                </div>
              </div>

              {/* Simplified lock: Available now OR Until 18 */}
              <div>
                <label className="block text-xs mb-2" style={{ color: C.muted }}>When can the child access it?</label>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setLockChoice("now")} className="px-3 py-3 rounded-lg text-sm font-medium transition-all"
                    style={{ background: lockChoice === "now" ? "rgba(20,241,149,0.15)" : "rgba(255,255,255,0.03)", border: `2px solid ${lockChoice === "now" ? "#14F195" : C.border}`, color: lockChoice === "now" ? "#14F195" : C.muted }}>
                    Available now
                  </button>
                  <button onClick={() => setLockChoice("eighteen")} className="px-3 py-3 rounded-lg text-sm font-medium transition-all"
                    style={{ background: lockChoice === "eighteen" ? "rgba(153,69,255,0.15)" : "rgba(255,255,255,0.03)", border: `2px solid ${lockChoice === "eighteen" ? "#9945FF" : C.border}`, color: lockChoice === "eighteen" ? "#9945FF" : C.muted }}>
                    Until they turn 18
                  </button>
                </div>
              </div>

              {/* Early withdrawal warning */}
              {lockChoice === "eighteen" && (
                <div className="rounded-lg p-3" style={{ background: "rgba(244,63,94,0.06)", border: "1px solid rgba(244,63,94,0.15)" }}>
                  <p className="text-xs" style={{ color: "rgba(244,63,94,0.8)" }}>
                    Funds will be locked in a smart contract until the child turns 18. Early withdrawal is possible but carries a <strong>10% non-refundable penalty</strong>.
                  </p>
                </div>
              )}

              <button onClick={handleDeposit} disabled={loading || !depositorName.trim()}
                className="w-full px-4 py-3 rounded-lg text-sm font-semibold text-white disabled:opacity-30 transition-all hover:opacity-90" style={{ background: lockChoice === "eighteen" ? "#9945FF" : "#14F195", color: lockChoice === "eighteen" ? "white" : "#030712" }}>
                {loading ? "Depositing..." : `Gift ${depositAmount} SOL${lockChoice === "eighteen" ? " (locked until 18)" : ""}`}
              </button>
              <p className="text-xs text-center" style={{ color: C.dim }}>Approve in Phantom. SOL held securely in escrow on Solana.</p>
            </div>
          )}

          {/* Back to profile */}
          {childProfileData?.childName && (
            <div className="text-center pt-4">
              <Link href={`/tooth/${encodeURIComponent(childProfileData.childName.toLowerCase().trim())}`} className="text-sm underline font-medium" style={{ color: "#9945FF" }}>
                View {childProfileData.childName}&apos;s page
              </Link>
            </div>
          )}

          <div className="text-center pt-2">
            <Link href="/toothfairy/network" className="text-xs underline" style={{ color: C.dim }}>What is Tooth Fairy Network?</Link>
          </div>
        </div>
      )}

      <footer className="mt-12 pt-4 border-t text-center" style={{ borderColor: C.border }}>
        <p className="text-xs" style={{ color: C.dim }}>Tooth Fairy Network &middot; Savings on Solana</p>
      </footer>
    </div>
  )
}
