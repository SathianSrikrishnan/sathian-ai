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
import type { KeepsakeData } from "@/lib/toothfairy/keepsake-data"
import Link from "next/link"

const page = {
  cream: "oklch(97.5% 0.01 80)",
  creamDeep: "oklch(95% 0.015 75)",
  paper: "oklch(100% 0 0 / 0.72)",
  ink: "#11234a",
  inkSoft: "#334260",
  muted: "#6b7280",
  gold: "oklch(72% 0.145 75)",
  purple: "#6d45a8",
  border: "oklch(88% 0.015 75)",
}

const amountPresets = [
  { label: "$5", amount: "0.05" },
  { label: "$10", amount: "0.1" },
  { label: "$25", amount: "0.25" },
  { label: "$50", amount: "0.5" },
]

export default function GiftPage() {
  const params = useParams()
  const milestonePda = params.milestone as string

  const { publicKey, signTransaction, signAllTransactions } = useWallet()
  const { connection } = useConnection()
  const { setVisible } = useWalletModal()

  const [depositorName, setDepositorName] = useState("")
  const [depositAmount, setDepositAmount] = useState("0.1")
  const [lockChoice, setLockChoice] = useState<"now" | "ageTen">("ageTen")
  const [loading, setLoading] = useState(false)
  const [deposits, setDeposits] = useState<DepositData[]>([])
  const [milestoneData, setMilestoneData] = useState<any>(null)
  const [childProfileData, setChildProfileData] = useState<any>(null)
  const [childProfilePda, setChildProfilePda] = useState<string | null>(null)
  const [keepsakeData, setKeepsakeData] = useState<KeepsakeData | null>(null)
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

  useEffect(() => {
    let cancelled = false
    if (!milestonePda) return

    fetch(`/api/toothfairy/keepsake/${milestonePda}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: KeepsakeData | null) => {
        if (!cancelled && data) setKeepsakeData(data)
      })
      .catch(() => {})

    return () => {
      cancelled = true
    }
  }, [milestonePda])

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
      if (lockChoice === "ageTen") {
        // Get DOB from localStorage or profile name
        const childName = childProfileData?.childName || ""
        const dobStr = typeof window !== "undefined" ? localStorage.getItem(`tfn-child-dob-${childName}`) || localStorage.getItem(`tfn-child-dob-${childName.toLowerCase().trim()}`) : null
        if (dobStr) {
          const dob = new Date(dobStr + "T00:00:00")
          const unlockDate = new Date(dob)
          unlockDate.setFullYear(unlockDate.getFullYear() + 10)
          lockTimestamp = Math.floor(unlockDate.getTime() / 1000)
          lockPeriodKey = "untilTimestamp"
        } else {
          // Fallback: 10 years from now
          lockTimestamp = Math.floor(Date.now() / 1000) + (10 * 365.25 * 24 * 60 * 60)
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

  const displayChildName = childProfileData?.childName || keepsakeData?.childName || "this child"
  const liveDeposits = deposits.length > 0
    ? deposits
    : (keepsakeData?.deposits || []).map((deposit) => ({
        depositorName: deposit.name,
        amountSol: deposit.amount,
        claimed: false,
        lockLabel: deposit.locked ? "locked" : "available",
      } as DepositData))
  const totalEscrowed =
    deposits.length > 0
      ? deposits.reduce((s, d) => s + (d.claimed ? 0 : d.amountSol), 0)
      : keepsakeData?.totalEscrowed || 0

  return (
    <div
      className="min-h-screen"
      style={{
        background: `linear-gradient(180deg, ${page.creamDeep}, ${page.cream})`,
        color: page.ink,
        fontFamily: "var(--font-body), 'Alegreya Sans', system-ui, sans-serif",
      }}
    >
    <div className="mx-auto max-w-5xl px-5 py-8 md:py-12">
      <header className="mb-8 flex items-center justify-between gap-4">
        <Link href="/toothfairy" className="flex items-center gap-3 no-underline">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-full"
            style={{
              background: "rgba(109, 69, 168, 0.08)",
              color: page.purple,
              border: `1px solid ${page.border}`,
            }}
            aria-hidden
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.7}>
              <path d="M8 3c-2.2 0-4 1.8-4 4 0 1.4.6 2.8 1.1 4.1.6 1.6 1.1 3.2 1.2 5 .1 1.5.7 3.9 2 3.9 1 0 1.4-1.4 1.8-3.1.4-1.6.8-3.1 1.9-3.1s1.5 1.5 1.9 3.1c.4 1.7.8 3.1 1.8 3.1 1.3 0 1.9-2.4 2-3.9.1-1.8.6-3.4 1.2-5 .5-1.3 1.1-2.7 1.1-4.1 0-2.2-1.8-4-4-4-1.3 0-2.4.5-3.2 1.2-.5.4-1.1.4-1.6 0C10.4 3.5 9.3 3 8 3Z" />
            </svg>
          </span>
          <div>
            <h1
              className="text-xl font-bold tracking-tight"
              style={{ fontFamily: "var(--font-display), 'Alegreya', Georgia, serif", color: page.ink }}
            >
              Tooth Fairy Network
            </h1>
            <p className="text-xs" style={{ color: page.muted }}>Family gift link</p>
          </div>
        </Link>
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
        <div className="grid gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <div
            className="overflow-hidden rounded-lg px-6 py-7 md:px-8"
            style={{
              background:
                "radial-gradient(circle at 90% 10%, rgba(216,164,60,0.18), transparent 13rem), radial-gradient(circle at 12% 0%, rgba(109,69,168,0.10), transparent 14rem), oklch(100% 0 0 / 0.70)",
              border: `1px solid ${page.border}`,
              boxShadow: "0 18px 44px oklch(30% 0.035 65 / 0.08)",
            }}
          >
            <p
              className="text-xs font-black uppercase"
              style={{ color: page.gold, letterSpacing: "0.18em", fontWeight: 800 }}
            >
              Family gift link
            </p>
            <h2
              className="mt-3 text-4xl leading-tight md:text-5xl"
              style={{
                color: page.ink,
                fontFamily: "var(--font-display), 'Alegreya', Georgia, serif",
                fontWeight: 700,
              }}
            >
              Add to {displayChildName}&apos;s Smile Fund
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed" style={{ color: page.inkSoft }}>
              A tooth memory was shared with you. Add a small gift and your name
              becomes part of the story they can revisit as they learn how little
              things grow.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-[0.88fr_1.12fr] sm:items-stretch">
              <div
                className="flex min-h-48 items-center justify-center overflow-hidden rounded-lg"
                style={{ background: page.cream, border: `1px solid ${page.border}` }}
              >
                {keepsakeData?.drawingUrl || keepsakeData?.smilePhotoUrl ? (
                  <img
                    src={keepsakeData.drawingUrl || keepsakeData.smilePhotoUrl || ""}
                    alt={`${displayChildName}'s tooth keepsake`}
                    className="h-full max-h-64 w-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full" style={{ background: "rgba(216,164,60,0.14)", color: page.gold }}>
                      <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={1.5}>
                        <path d="M8 3c-2.2 0-4 1.8-4 4 0 1.4.6 2.8 1.1 4.1.6 1.6 1.1 3.2 1.2 5 .1 1.5.7 3.9 2 3.9 1 0 1.4-1.4 1.8-3.1.4-1.6.8-3.1 1.9-3.1s1.5 1.5 1.9 3.1c.4 1.7.8 3.1 1.8 3.1 1.3 0 1.9-2.4 2-3.9.1-1.8.6-3.4 1.2-5 .5-1.3 1.1-2.7 1.1-4.1 0-2.2-1.8-4-4-4-1.3 0-2.4.5-3.2 1.2-.5.4-1.1.4-1.6 0C10.4 3.5 9.3 3 8 3Z" />
                      </svg>
                    </div>
                    <p className="mt-3 text-sm font-bold" style={{ color: page.ink }}>Keepsake preview</p>
                    <p className="mt-1 text-xs" style={{ color: page.muted }}>Connect a wallet to load live chain details.</p>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2 text-center">
                {[
                  [totalEscrowed.toFixed(totalEscrowed >= 1 ? 2 : 3), "SOL saved"],
                  [String(liveDeposits.filter(d => !d.claimed).length), "family gifts"],
                  ["age 10", "default"],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-lg px-3 py-4" style={{ background: page.cream, border: `1px solid ${page.border}` }}>
                    <p className="text-lg font-black" style={{ color: page.ink }}>{value}</p>
                    <p className="mt-1 text-[11px]" style={{ color: page.muted }}>{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <section className="rounded-lg p-5 md:p-6" style={{ background: page.paper, border: `1px solid ${page.border}` }}>
            {/* Existing deposits */}
            {liveDeposits.length > 0 && (
            <div className="mb-5 rounded-lg p-4 space-y-1" style={{ background: page.cream, border: `1px solid ${page.border}` }}>
              <p className="text-xs font-bold uppercase mb-2" style={{ color: page.muted, letterSpacing: "0.14em" }}>
                {liveDeposits.length} gift{liveDeposits.length > 1 ? "s" : ""} &middot; {totalEscrowed.toFixed(2)} SOL saved
              </p>
              {liveDeposits.filter(d => !d.claimed).map((d, i) => (
                <div key={i} className="flex justify-between text-xs py-1">
                  <span>{d.depositorName} <span style={{ color: page.muted }}>{d.lockLabel}</span></span>
                  <span className="font-mono">{d.amountSol.toFixed(2)} SOL</span>
                </div>
              ))}
            </div>
            )}

          {/* Success */}
          {success && (
            <div className="mb-5 rounded-lg p-4 text-center" style={{ background: "rgba(79, 184, 145, 0.12)", border: "1px solid rgba(79, 184, 145, 0.28)" }}>
              <div className="mb-1 text-sm font-black uppercase" style={{ color: page.ink }}>Saved</div>
              <p className="text-sm font-medium" style={{ color: C.emerald }}>{success}</p>
              <p className="text-xs mt-1" style={{ color: C.muted }}>Your gift is held in escrow on Solana.</p>
            </div>
          )}

          {/* Connect wallet prompt */}
          {!publicKey && (
            <div className="space-y-4">
              <div>
                <p className="text-sm font-bold" style={{ color: page.ink }}>Choose a gift amount</p>
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {amountPresets.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      disabled
                      className="rounded-lg px-3 py-3 text-sm font-bold"
                      style={{
                        background: page.cream,
                        border: `1px solid ${page.border}`,
                        color: page.muted,
                      }}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: page.inkSoft }}>
                Card checkout is the next integration. For this preview, the
                live contribution path uses Phantom and SOL.
              </p>
              <button onClick={() => setVisible(true)} className="w-full px-6 py-3 rounded-full text-sm font-bold text-white" style={{ background: page.purple }}>
                Continue with Phantom preview
              </button>
            </div>
          )}

          {/* Deposit form */}
          {publicKey && childProfilePda && (
            <div className="space-y-4">
              <p className="text-sm font-bold">Add your gift for {displayChildName}</p>
              <div className="grid grid-cols-4 gap-2">
                {amountPresets.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => setDepositAmount(preset.amount)}
                    className="rounded-lg px-3 py-3 text-sm font-bold"
                    style={{
                      background: depositAmount === preset.amount ? page.gold : page.cream,
                      border: `1px solid ${depositAmount === preset.amount ? page.gold : page.border}`,
                      color: depositAmount === preset.amount ? "white" : page.ink,
                    }}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs mb-1" style={{ color: page.muted }}>Your name</label>
                  <input type="text" value={depositorName} onChange={e => setDepositorName(e.target.value)} placeholder="Dad"
                    className="w-full px-3 py-2.5 rounded-lg text-sm border outline-none" style={{ borderColor: page.border, color: page.ink, background: page.cream }} />
                </div>
                <div>
                  <label className="block text-xs mb-1" style={{ color: page.muted }}>Amount (SOL)</label>
                  <input type="number" value={depositAmount} onChange={e => setDepositAmount(e.target.value)} min="0.01" step="0.05"
                    className="w-full px-3 py-2.5 rounded-lg text-sm border outline-none" style={{ borderColor: page.border, color: page.ink, background: page.cream }} />
                </div>
              </div>

              {/* Simplified lock: available now or suggested age 10 */}
              <div>
                <label className="block text-xs mb-2" style={{ color: page.muted }}>When can the child access it?</label>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setLockChoice("now")} className="px-3 py-3 rounded-lg text-sm font-medium transition-all"
                    style={{ background: lockChoice === "now" ? "oklch(72% 0.145 75 / 0.12)" : page.cream, border: `2px solid ${lockChoice === "now" ? page.gold : page.border}`, color: lockChoice === "now" ? page.gold : page.muted }}>
                    Available now
                  </button>
                  <button onClick={() => setLockChoice("ageTen")} className="px-3 py-3 rounded-lg text-sm font-medium transition-all"
                    style={{ background: lockChoice === "ageTen" ? "oklch(72% 0.145 75 / 0.12)" : page.cream, border: `2px solid ${lockChoice === "ageTen" ? page.gold : page.border}`, color: lockChoice === "ageTen" ? page.gold : page.muted }}>
                    Until age 10
                  </button>
                </div>
              </div>

              {/* Early withdrawal warning */}
              {lockChoice === "ageTen" && (
                <div className="rounded-lg p-3" style={{ background: "rgba(216,164,60,0.10)", border: "1px solid rgba(216,164,60,0.24)" }}>
                  <p className="text-xs" style={{ color: page.inkSoft }}>
                    Funds will be locked in a smart contract until the suggested age 10 date. Early withdrawal terms should be confirmed before broad launch.
                  </p>
                </div>
              )}

              <button onClick={handleDeposit} disabled={loading || !depositorName.trim()}
                className="w-full px-4 py-3 rounded-full text-sm font-bold text-white disabled:opacity-30 transition-all hover:opacity-90" style={{ background: page.purple, color: "white" }}>
                {loading ? "Depositing..." : `Gift ${depositAmount} SOL${lockChoice === "ageTen" ? " (locked until age 10)" : ""}`}
              </button>
              <p className="text-xs text-center" style={{ color: page.muted }}>Approve in Phantom. SOL is held securely in escrow on Solana.</p>
            </div>
          )}

          {/* Back to profile */}
          {childProfileData?.childName && (
            <div className="text-center pt-4">
              <Link href={`/tooth/${encodeURIComponent(childProfileData.childName.toLowerCase().trim())}`} className="text-sm underline font-medium" style={{ color: page.gold }}>
                View {childProfileData.childName}&apos;s page
              </Link>
            </div>
          )}

          <div className="text-center pt-2">
            <Link href="/toothfairy" className="text-xs underline" style={{ color: page.muted }}>What is Tooth Fairy Network?</Link>
          </div>
          </section>
        </div>
      )}

      <footer className="mt-12 pt-4 border-t text-center" style={{ borderColor: C.border }}>
        <p className="text-xs" style={{ color: page.muted }}>Tooth Fairy Network &middot; Memories today, savings tomorrow</p>
      </footer>
    </div>
    </div>
  )
}
