"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { useWallet, useConnection } from "@solana/wallet-adapter-react"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import { AnchorProvider } from "@coral-xyz/anchor"
import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js"
import { WalletButton } from "@/components/toothfairy/app/wallet-button"
import { C } from "@/components/toothfairy/tokens"
import { useSolPrice } from "@/lib/toothfairy/use-sol-price"
import {
  getEscrowProgram,
  fetchChildProfile,
  fetchMilestonesForProfile,
  fetchDepositsForMilestone,
  claimToGuardian,
  calculateFee,
  deriveChildWallet,
  type ChildProfileData,
  type MilestoneData,
  type DepositData,
} from "@/lib/toothfairy/escrow"
import Link from "next/link"
import { createBrowserSupabase } from "@/lib/supabase-auth"

// Supabase child record
interface SupabaseChild {
  child_name: string
  child_slug: string
  child_profile_pda: string | null
  guardian_pubkey: string
  smile_photo_url: string | null
  birthday: string | null
  is_server_guardian: boolean
}

const page = {
  cream: "oklch(97.5% 0.01 80)",
  creamDeep: "oklch(95% 0.015 75)",
  paper: "oklch(100% 0 0 / 0.62)",
  ink: "#11234a",
  inkSoft: "#334260",
  muted: "#6b7280",
  gold: "oklch(72% 0.145 75)",
  purple: "#6d45a8",
  border: "oklch(88% 0.015 75)",
}

const GOOGLE_DASHBOARD_SIGN_IN = "/api/auth/google?next=%2Ftoothfairy%2Fapp%2Fdashboard"

export default function WalletDashboard() {
  const { publicKey, signTransaction, signAllTransactions } = useWallet()
  const { connection } = useConnection()
  const { setVisible } = useWalletModal()

  const solPrice = useSolPrice()
  const [loading, setLoading] = useState(true)
  const [childWallets, setChildWallets] = useState<string[]>([])
  const [profiles, setProfiles] = useState<ChildProfileData[]>([])
  const [supabaseChildren, setSupabaseChildren] = useState<SupabaseChild[]>([])
  const [activeChild, setActiveChild] = useState(0)
  const [milestones, setMilestones] = useState<MilestoneData[]>([])
  const [allDeposits, setAllDeposits] = useState<Map<string, DepositData[]>>(new Map())
  const [claimingPda, setClaimingPda] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const anchorProvider = useMemo(() => {
    if (!publicKey || !signTransaction || !signAllTransactions) return null
    return new AnchorProvider(connection, { publicKey, signTransaction, signAllTransactions } as any, { commitment: "confirmed" })
  }, [publicKey, signTransaction, signAllTransactions, connection])

  // Load children from Supabase (works even without wallet)
  useEffect(() => {
    const supabase = createBrowserSupabase()
    supabase.auth.getUser().then(({ data: { user } }: any) => {
      if (!user) return
      // Fetch this user's children from Supabase
      fetch(`/api/toothfairy/my-children`)
        .then(r => r.json())
        .then(data => {
          if (data.children) {
            setSupabaseChildren(data.children)
          }
        })
        .catch(() => {})
    })
  }, [])

  // Load saved child wallets from localStorage
  useEffect(() => {
    if (!publicKey) return
    const key = `tfn-children-${publicKey.toBase58()}`
    const saved: string[] = JSON.parse(localStorage.getItem(key) || "[]")
    const deduped = saved.filter((v, i, a) => a.indexOf(v) === i)
    if (deduped.length !== saved.length) localStorage.setItem(key, JSON.stringify(deduped))
    setChildWallets(deduped)
  }, [publicKey])

  // Load profiles and milestones
  const loadData = useCallback(async () => {
    if (!anchorProvider || childWallets.length === 0) { setLoading(false); return }
    setLoading(true)
    const program = getEscrowProgram(anchorProvider)
    const loadedProfiles: ChildProfileData[] = []

    for (const walletAddr of childWallets) {
      const profile = await fetchChildProfile(program, anchorProvider.publicKey, new PublicKey(walletAddr))
      if (profile) loadedProfiles.push(profile)
    }

    setProfiles(loadedProfiles)

    if (loadedProfiles.length > 0) {
      const profile = loadedProfiles[activeChild] || loadedProfiles[0]
      const ms = await fetchMilestonesForProfile(program, new PublicKey(profile.pda))
      setMilestones(ms)

      const depositMap = new Map<string, DepositData[]>()
      for (const m of ms) {
        const deps = await fetchDepositsForMilestone(program, new PublicKey(m.pda))
        depositMap.set(m.pda, deps)
      }
      setAllDeposits(depositMap)
    }
    setLoading(false)
  }, [anchorProvider, childWallets, activeChild])

  useEffect(() => { loadData() }, [loadData])

  // Handle claim
  const handleClaim = async (milestonePda: string, depositPda: string) => {
    if (!anchorProvider || !publicKey) return
    setError(null); setClaimingPda(depositPda)
    try {
      const program = getEscrowProgram(anchorProvider)
      const profile = profiles[activeChild]
      if (!profile) throw new Error("No profile selected")
      await claimToGuardian(program, publicKey, new PublicKey(profile.pda), new PublicKey(milestonePda), new PublicKey(depositPda))
      await loadData()
    } catch (err: any) {
      setError(err.message || "Claim failed")
    } finally { setClaimingPda(null) }
  }

  // Computed
  const activeProfile = profiles[activeChild]
  const totalDeposited = activeProfile ? activeProfile.totalDeposited / LAMPORTS_PER_SOL : 0
  const totalClaimed = activeProfile ? activeProfile.totalClaimed / LAMPORTS_PER_SOL : 0
  const totalEscrowed = totalDeposited - totalClaimed
  const allDepositsList = Array.from(allDeposits.values()).flat()
  const claimableDeposits = allDepositsList.filter(d => !d.claimed && !d.isLocked)
  const lockedDeposits = allDepositsList.filter(d => !d.claimed && d.isLocked)
  const claimedDeposits = allDepositsList.filter(d => d.claimed)

  return (
    <main
      className="min-h-screen px-4 py-8 md:py-12"
      style={{
        background: `linear-gradient(180deg, ${page.creamDeep}, ${page.cream})`,
        color: page.ink,
        fontFamily: "var(--font-body), 'Alegreya Sans', system-ui, sans-serif",
      }}
    >
      <div className="mx-auto w-full max-w-5xl">
      <header
        className="mb-8 overflow-hidden rounded-lg px-6 py-7 md:px-8"
        style={{
          background:
            "radial-gradient(circle at 86% 12%, rgba(216,164,60,0.18), transparent 16rem), radial-gradient(circle at 6% 0%, rgba(109,69,168,0.09), transparent 14rem), oklch(100% 0 0 / 0.68)",
          border: `1px solid ${page.border}`,
          boxShadow: "0 24px 70px oklch(30% 0.035 65 / 0.08)",
        }}
      >
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-2xl">
            <p
              className="text-xs uppercase"
              style={{ color: page.gold, letterSpacing: "0.18em", fontWeight: 800 }}
            >
              Parent control room
            </p>
            <h1
              className="mt-3 text-4xl leading-tight md:text-5xl"
              style={{
                color: page.ink,
                fontFamily: "var(--font-display), 'Alegreya', Georgia, serif",
                fontWeight: 700,
              }}
            >
              Smile Fund dashboard
            </h1>
            <p className="mt-3 max-w-xl text-base leading-relaxed" style={{ color: page.inkSoft }}>
              Revisit first forever memories, share family links, and track the
              small gifts that become your child&apos;s first ownership lesson.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row md:flex-col lg:flex-row">
            <a
              href={GOOGLE_DASHBOARD_SIGN_IN}
              className="rounded-full px-5 py-3 text-center text-sm font-bold"
              style={{
                background: "rgba(109,69,168,0.09)",
                color: page.purple,
                border: "1px solid rgba(109,69,168,0.18)",
              }}
            >
              Continue with Google
            </a>
            <Link
              href="/toothfairy/app"
              className="rounded-full px-5 py-3 text-center text-sm font-bold"
              style={{
                background: page.gold,
                color: "white",
                boxShadow: "0 10px 26px oklch(72% 0.145 75 / 0.22)",
              }}
            >
              Record a tooth
            </Link>
            <WalletButton />
          </div>
        </div>
      </header>

      {error && (
        <div className="mb-6 p-3 rounded-lg text-sm" style={{ background: "rgba(244, 63, 94, 0.1)", color: C.rose }}>
          {error}
          <button onClick={() => setError(null)} className="ml-2 underline text-xs">dismiss</button>
        </div>
      )}

      {/* Supabase children (works even without wallet) */}
      {supabaseChildren.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: C.muted }}>Your Children</h2>
          <div className="space-y-2">
            {supabaseChildren.map((child) => (
              <Link
                key={child.child_slug}
                href={`/tooth/${child.child_slug}`}
                className="block rounded-lg p-4 transition-all hover:translate-y-[-1px]"
                style={{
                  background: "oklch(100% 0 0 / 0.68)",
                  border: `1px solid ${C.border}`,
                }}
              >
                <div className="flex items-center gap-3">
                  {child.smile_photo_url ? (
                    <img src={child.smile_photo_url} alt={child.child_name} className="w-10 h-10 rounded-full object-cover" style={{ border: `2px solid ${C.gold}` }} />
                  ) : (
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: "rgba(240,196,86,0.1)", border: `1px solid ${C.border}`, color: C.gold }}>
                      {child.child_name.charAt(0)}
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-semibold" style={{ color: C.text }}>{child.child_name}</p>
                    <p className="text-xs" style={{ color: C.muted }}>
                      {child.is_server_guardian ? "Tap to claim with wallet" : "View profile"}
                    </p>
                  </div>
                  {child.is_server_guardian && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "rgba(109,69,168,0.08)", color: page.purple, border: "1px solid rgba(109,69,168,0.18)" }}>
                      Unclaimed
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* No wallet connected and no Supabase children */}
      {!publicKey && supabaseChildren.length === 0 && (
        <section className="grid gap-5 md:grid-cols-[1.1fr_0.9fr]">
          <div
            className="rounded-lg p-6 md:p-8"
            style={{ background: page.paper, border: `1px solid ${page.border}` }}
          >
            <p
              className="text-xs uppercase"
              style={{ color: page.muted, letterSpacing: "0.14em", fontWeight: 800 }}
            >
              What parents see
            </p>
            <h2
              className="mt-3 text-3xl leading-tight"
              style={{
                color: page.ink,
                fontFamily: "var(--font-display), 'Alegreya', Georgia, serif",
                fontWeight: 700,
              }}
            >
              One place for the memory, the family link, and the balance.
            </h2>
            <p className="mt-4 text-base leading-relaxed" style={{ color: page.inkSoft }}>
              Sign in with the same Google account you used to save the memory.
              Wallet tools are still here for controlled testing, but Google is
              the normal parent path.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <a
                href={GOOGLE_DASHBOARD_SIGN_IN}
                className="rounded-full px-6 py-3 text-center text-sm font-bold text-white"
                style={{ background: page.purple }}
              >
                Continue with Google
              </a>
              <button
                onClick={() => setVisible(true)}
                className="rounded-full px-6 py-3 text-sm font-bold"
                style={{ background: "transparent", border: `1px solid ${page.border}`, color: page.inkSoft }}
              >
                Connect guardian wallet
              </button>
            </div>
          </div>

          <div
            className="rounded-lg p-5"
            style={{
              background: "linear-gradient(145deg, oklch(100% 0 0 / 0.68), oklch(96% 0.018 75 / 0.72))",
              border: `1px solid ${page.border}`,
            }}
          >
            <div className="rounded-lg p-5" style={{ background: page.cream }}>
              <p className="text-sm font-bold" style={{ color: page.ink }}>Little Smile Fund</p>
              <p className="mt-1 text-xs" style={{ color: page.muted }}>Preview balance</p>
              <div className="mt-5 text-4xl font-black" style={{ color: page.ink }}>
                12.45 <span className="text-lg font-semibold" style={{ color: page.muted }}>SOL</span>
              </div>
              <div className="mt-5 flex h-24 items-end gap-2">
                {[28, 42, 35, 54, 62, 58, 73, 88].map((height, i) => (
                  <span
                    key={i}
                    className="flex-1 rounded-t-full"
                    style={{
                      height: `${height}%`,
                      background: `linear-gradient(180deg, ${page.gold}, oklch(86% 0.08 78))`,
                    }}
                  />
                ))}
              </div>
              <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                {[
                  ["5", "memories"],
                  ["23", "gifts"],
                  ["age 10", "default"],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-lg py-3" style={{ background: "oklch(100% 0 0 / 0.58)" }}>
                    <p className="text-sm font-bold">{value}</p>
                    <p className="text-[11px]" style={{ color: page.muted }}>{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {publicKey && loading && (
        <div className="text-center py-20">
          <p className="text-sm animate-pulse" style={{ color: C.muted }}>Loading wallet...</p>
        </div>
      )}

      {/* Empty state */}
      {publicKey && !loading && profiles.length === 0 && (
          <div className="rounded-lg px-6 py-16 text-center" style={{ background: page.paper, border: `1px solid ${page.border}` }}>
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full text-xl font-bold" style={{ background: "oklch(72% 0.145 75 / 0.14)", color: page.gold }}>TFN</div>
          <h2 className="text-2xl font-bold">No Smile Fund yet</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed" style={{ color: C.muted }}>Save the first tooth story to create the family link and the Smile Fund.</p>
          <Link href="/toothfairy/app" className="mt-5 inline-block px-6 py-3 rounded-full text-sm font-bold text-white" style={{ background: page.purple }}>
            Mint first memory
          </Link>
        </div>
      )}

      {/* ── CHILD'S WALLET VIEW ── */}
      {publicKey && !loading && profiles.length > 0 && activeProfile && (
        <div className="space-y-6">
          {/* Child selector (if multiple children) */}
          {profiles.length > 1 && (
            <div className="flex gap-2 flex-wrap">
              {profiles.map((p, i) => {
                const dupes = profiles.filter(pp => pp.childName === p.childName)
                const label = dupes.length > 1 ? `${p.childName} (${p.childWallet.slice(0, 4)}...)` : p.childName
                return (
                  <button key={p.pda} onClick={() => setActiveChild(i)}
                    className="px-4 py-2 rounded-lg text-sm"
                    style={{
                      background: i === activeChild ? "rgba(171, 159, 242, 0.15)" : C.surface,
                      border: `2px solid ${i === activeChild ? page.gold : C.border}`,
                      color: i === activeChild ? page.gold : C.muted,
                    }}>
                    {label}
                  </button>
                )
              })}
            </div>
          )}

          {/* ── Wallet Card ── */}
          <div className="rounded-lg p-6 space-y-5" style={{ background: "linear-gradient(135deg, rgba(216,164,60,0.12) 0%, rgba(109,69,168,0.08) 100%)", border: `1px solid ${page.border}`, boxShadow: "0 18px 44px oklch(30% 0.035 65 / 0.08)" }}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">{activeProfile.childName}&apos;s Smile Fund</h2>
                <p className="text-xs mt-0.5" style={{ color: C.dim }}>Tooth memories and family savings</p>
              </div>
              <div className="flex h-9 w-9 items-center justify-center rounded-full" style={{ background: "rgba(109,69,168,0.10)", color: page.purple }}>
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.6}>
                  <path d="M8 3c-2.2 0-4 1.8-4 4 0 1.4.6 2.8 1.1 4.1.6 1.6 1.1 3.2 1.2 5 .1 1.5.7 3.9 2 3.9 1 0 1.4-1.4 1.8-3.1.4-1.6.8-3.1 1.9-3.1s1.5 1.5 1.9 3.1c.4 1.7.8 3.1 1.8 3.1 1.3 0 1.9-2.4 2-3.9.1-1.8.6-3.4 1.2-5 .5-1.3 1.1-2.7 1.1-4.1 0-2.2-1.8-4-4-4-1.3 0-2.4.5-3.2 1.2-.5.4-1.1.4-1.6 0C10.4 3.5 9.3 3 8 3Z" />
                </svg>
              </div>
            </div>

            {/* Balance */}
            <div className="text-center py-4">
              <div className="text-4xl font-bold" style={{ color: page.ink }}>
                {totalEscrowed.toFixed(4)} <span className="text-lg font-normal">SOL</span>
              </div>
              <p className="text-sm mt-1 font-mono" style={{ color: C.muted }}>
                ~ ${(totalEscrowed * solPrice).toFixed(2)} USD
              </p>
              <p className="text-xs mt-1" style={{ color: C.dim }}>
                Total savings held on-chain
                {totalClaimed > 0 && <span> &middot; {totalClaimed.toFixed(4)} SOL released</span>}
              </p>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-lg py-3 px-2" style={{ background: "oklch(100% 0 0 / 0.50)", border: `1px solid ${page.border}` }}>
                <div className="text-lg font-bold">{milestones.length}</div>
                <div className="text-xs" style={{ color: C.muted }}>Teeth</div>
              </div>
              <div className="rounded-lg py-3 px-2" style={{ background: "oklch(100% 0 0 / 0.50)", border: `1px solid ${page.border}` }}>
                <div className="text-lg font-bold">{claimableDeposits.reduce((s, d) => s + d.amountSol, 0).toFixed(2)}</div>
                <div className="text-xs" style={{ color: C.emerald }}>Available SOL</div>
              </div>
              <div className="rounded-lg py-3 px-2" style={{ background: "oklch(100% 0 0 / 0.50)", border: `1px solid ${page.border}` }}>
                <div className="text-lg font-bold">{lockedDeposits.reduce((s, d) => s + d.amountSol, 0).toFixed(2)}</div>
                <div className="text-xs" style={{ color: page.gold }}>Locked SOL</div>
              </div>
            </div>
          </div>

          {/* ── Available Deposits ── */}
          {claimableDeposits.length > 0 && (
            <div className="rounded-lg p-4 space-y-3" style={{ background: "rgba(79,184,145,0.08)", border: "1px solid rgba(79,184,145,0.22)" }}>
              <h3 className="text-sm font-medium" style={{ color: page.ink }}>
                Available Savings
              </h3>
              {claimableDeposits.map(d => {
                const milestone = milestones.find(m => allDeposits.get(m.pda)?.some(dep => dep.pda === d.pda))
                return (
                  <div key={d.pda} className="flex items-center justify-between py-2">
                    <div>
                      <span className="text-sm font-medium">{d.depositorName}</span>
                      <div className="text-xs font-mono" style={{ color: C.muted }}>
                        {d.amountSol.toFixed(4)} SOL <span style={{ color: C.dim }}>~ ${(d.amountSol * solPrice).toFixed(2)}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => milestone && handleClaim(milestone.pda, d.pda)}
                      disabled={claimingPda === d.pda}
                      className="text-xs px-3 py-1.5 rounded-full font-medium transition-all hover:opacity-80 disabled:opacity-50"
                      style={{ background: "rgba(79,184,145,0.15)", color: "#2f7d62" }}
                    >
                      {claimingPda === d.pda ? "Claiming..." : "Withdraw"}
                    </button>
                  </div>
                )
              })}
              <p className="text-xs pt-1" style={{ color: C.dim }}>
                Deposited and held securely on-chain. Available to withdraw anytime.
              </p>
            </div>
          )}

          {/* ── Locked Savings ── */}
          {lockedDeposits.length > 0 && (
            <div className="rounded-lg p-4 space-y-3" style={{ background: page.paper, border: `1px solid ${C.border}` }}>
              <h3 className="text-sm font-medium" style={{ color: page.ink }}>
                Locked Savings
              </h3>
              {lockedDeposits.map(d => (
                <div key={d.pda} className="flex justify-between items-center py-2 text-sm">
                  <div>
                    <span className="font-medium">{d.depositorName}</span>
                    <div className="text-xs" style={{ color: C.dim }}>Unlocks {d.lockLabel}</div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono">{d.amountSol.toFixed(4)} SOL</span>
                    <div className="text-xs font-mono" style={{ color: C.dim }}>~ ${(d.amountSol * solPrice).toFixed(2)}</div>
                  </div>
                </div>
              ))}
              <p className="text-xs pt-2" style={{ color: C.dim }}>
                Held securely on-chain until the unlock date. Early withdrawal terms should be reviewed before launch.
              </p>
            </div>
          )}

          {/* ── Teeth Collection ── */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium" style={{ color: C.muted }}>Tooth Collection</h3>
            {milestones.length === 0 && (
              <p className="text-sm" style={{ color: C.dim }}>No teeth recorded yet.</p>
            )}
            <div className="grid grid-cols-4 gap-2">
              {milestones.map((m, i) => {
                const deps = allDeposits.get(m.pda) || []
                const total = deps.reduce((s, d) => s + (d.claimed ? 0 : d.amountSol), 0)
                return (
                  <div key={m.pda} className="rounded-lg p-3 text-center" style={{ background: page.paper, border: `1px solid ${C.border}` }}>
                    <div className="mx-auto flex h-6 w-6 items-center justify-center" style={{ color: page.gold }} aria-hidden>
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.7}>
                        <path d="M8 3c-2.2 0-4 1.8-4 4 0 1.4.6 2.8 1.1 4.1.6 1.6 1.1 3.2 1.2 5 .1 1.5.7 3.9 2 3.9 1 0 1.4-1.4 1.8-3.1.4-1.6.8-3.1 1.9-3.1s1.5 1.5 1.9 3.1c.4 1.7.8 3.1 1.8 3.1 1.3 0 1.9-2.4 2-3.9.1-1.8.6-3.4 1.2-5 .5-1.3 1.1-2.7 1.1-4.1 0-2.2-1.8-4-4-4-1.3 0-2.4.5-3.2 1.2-.5.4-1.1.4-1.6 0C10.4 3.5 9.3 3 8 3Z" />
                      </svg>
                    </div>
                    <div className="text-xs font-medium mt-1">#{m.milestoneIndex + 1}</div>
                    {total > 0 && <div className="text-xs font-mono mt-0.5" style={{ color: page.gold }}>{total.toFixed(2)}</div>}
                  </div>
                )
              })}
              {/* Empty slots */}
              {Array.from({ length: Math.max(0, 4 - milestones.length) }).map((_, i) => (
                <div key={`empty-${i}`} className="rounded-lg p-3 text-center opacity-40" style={{ background: page.paper, border: `1px dashed ${C.border}` }}>
                  <div className="mx-auto flex h-6 w-6 items-center justify-center" style={{ color: page.muted }} aria-hidden>
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth={1.7}>
                      <path d="M8 3c-2.2 0-4 1.8-4 4 0 1.4.6 2.8 1.1 4.1.6 1.6 1.1 3.2 1.2 5 .1 1.5.7 3.9 2 3.9 1 0 1.4-1.4 1.8-3.1.4-1.6.8-3.1 1.9-3.1s1.5 1.5 1.9 3.1c.4 1.7.8 3.1 1.8 3.1 1.3 0 1.9-2.4 2-3.9.1-1.8.6-3.4 1.2-5 .5-1.3 1.1-2.7 1.1-4.1 0-2.2-1.8-4-4-4-1.3 0-2.4.5-3.2 1.2-.5.4-1.1.4-1.6 0C10.4 3.5 9.3 3 8 3Z" />
                    </svg>
                  </div>
                  <div className="text-xs mt-1">open</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── History ── */}
          {claimedDeposits.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium" style={{ color: C.muted }}>History</h3>
              {claimedDeposits.map(d => (
                <div key={d.pda} className="flex justify-between text-xs py-1.5" style={{ color: C.dim }}>
                  <span>{d.depositorName} - released {d.claimedAt ? new Date(d.claimedAt * 1000).toLocaleDateString() : ""}</span>
                  <span className="font-mono">{d.amountSol.toFixed(4)} SOL</span>
                </div>
              ))}
            </div>
          )}

          {/* ── Share + Actions ── */}
          <div className="space-y-2 pt-2">
            <button
              onClick={() => {
                // Use the first milestone's gift link for sharing
                const milestonePda = milestones.length > 0 ? milestones[0].pda : activeProfile.pda
                const url = `${window.location.origin}/toothfairy/app/gift/${milestonePda}`
                navigator.clipboard.writeText(url)
                  .then(() => alert("Family link copied! Anyone with this link can view the keepsake and add to the Smile Fund."))
                  .catch(() => prompt("Copy this link:", url))
              }}
              className="w-full px-4 py-3 rounded-lg text-sm font-medium"
              style={{ background: page.paper, border: `1px solid ${C.border}`, color: page.inkSoft }}
            >
              Share {activeProfile.childName}&apos;s Smile Fund with family
            </button>
            <Link href="/toothfairy/app"
              className="block w-full px-4 py-3 rounded-lg text-sm font-medium text-white text-center"
              style={{ background: page.purple }}>
              Record Another Tooth
            </Link>
          </div>

          {/* On-chain proof */}
          <div className="text-center pt-2">
            <p className="text-xs" style={{ color: C.dim }}>
              All savings held on-chain by a Solana smart contract &middot;{" "}
              <a href={`https://solscan.io/account/${activeProfile.pda}`} target="_blank" rel="noopener noreferrer" className="underline">
                Verify on Solscan
              </a>
            </p>
          </div>
        </div>
      )}

      <footer className="mt-12 pt-4 border-t text-center" style={{ borderColor: page.border }}>
          <p className="text-xs" style={{ color: C.dim }}>Tooth Fairy Network &middot; First forever memories, protected by parents</p>
      </footer>
    </div>
    </main>
  )
}
