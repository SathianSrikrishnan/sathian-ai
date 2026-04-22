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
    <div className="max-w-lg mx-auto px-6 py-8">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Tooth Fairy Network</h1>
          <p className="text-xs" style={{ color: C.muted }}>Your child&apos;s digital wallet</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/" className="px-3 py-1.5 rounded-lg text-xs hover:bg-white/10" style={{ border: `1px solid ${C.border}`, color: C.muted }}>
            + New Tooth
          </Link>
          <WalletButton />
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
                className="block rounded-xl p-4 transition-all hover:translate-y-[-1px]"
                style={{
                  background: "rgba(22,36,71,0.7)",
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
                      {child.is_server_guardian ? "Tap to claim with wallet" : "View profile →"}
                    </p>
                  </div>
                  {child.is_server_guardian && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full" style={{ background: "rgba(79,209,197,0.1)", color: C.teal, border: "1px solid rgba(79,209,197,0.2)" }}>
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
        <div className="text-center py-20 space-y-4">
          <div className="w-14 h-14 mx-auto rounded-full" style={{ background: "linear-gradient(135deg, #f43f5e, #F0C456)" }} />
          <h2 className="text-xl font-medium">Connect to view your child&apos;s wallet</h2>
          <p className="text-sm" style={{ color: C.muted }}>See their milestones and savings.</p>
          <button onClick={() => setVisible(true)} className="px-6 py-3 rounded-lg text-sm font-medium text-white" style={{ background: C.rose }}>
            Connect Wallet
          </button>
        </div>
      )}

      {publicKey && loading && (
        <div className="text-center py-20">
          <p className="text-sm animate-pulse" style={{ color: C.muted }}>Loading wallet...</p>
        </div>
      )}

      {/* Empty state */}
      {publicKey && !loading && profiles.length === 0 && (
        <div className="text-center py-16 space-y-4">
          <div className="text-4xl">🦷</div>
          <h2 className="text-xl font-medium">No wallets yet</h2>
          <p className="text-sm" style={{ color: C.muted }}>Create your child&apos;s first digital wallet by recording a tooth.</p>
          <Link href="/" className="inline-block px-6 py-3 rounded-lg text-sm font-medium text-white" style={{ background: C.rose }}>
            Create Wallet
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
                      border: `2px solid ${i === activeChild ? "#F0C456" : C.border}`,
                      color: i === activeChild ? "#F0C456" : C.muted,
                    }}>
                    {label}
                  </button>
                )
              })}
            </div>
          )}

          {/* ── Wallet Card ── */}
          <div className="rounded-2xl p-6 space-y-5" style={{ background: "linear-gradient(135deg, rgba(240,196,86,0.1) 0%, rgba(16,185,129,0.05) 100%)", border: `1px solid rgba(240,196,86,0.2)` }}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">{activeProfile.childName}&apos;s Wallet</h2>
                <p className="text-xs mt-0.5" style={{ color: C.dim }}>Tooth Fairy Digital Wallet</p>
              </div>
              <div className="w-9 h-9 rounded-full" style={{ background: "linear-gradient(135deg, #f43f5e, #F0C456)" }} />
            </div>

            {/* Balance */}
            <div className="text-center py-4">
              <div className="text-4xl font-bold" style={{ color: "#F0C456" }}>
                {totalEscrowed.toFixed(4)} <span className="text-lg font-normal">SOL</span>
              </div>
              <p className="text-sm mt-1 font-mono" style={{ color: C.muted }}>
                ≈ ${(totalEscrowed * solPrice).toFixed(2)} USD
              </p>
              <p className="text-xs mt-1" style={{ color: C.dim }}>
                Total savings held on-chain
                {totalClaimed > 0 && <span> &middot; {totalClaimed.toFixed(4)} SOL released</span>}
              </p>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-xl py-3 px-2" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="text-lg font-bold">{milestones.length}</div>
                <div className="text-xs" style={{ color: C.muted }}>Teeth</div>
              </div>
              <div className="rounded-xl py-3 px-2" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="text-lg font-bold">{claimableDeposits.reduce((s, d) => s + d.amountSol, 0).toFixed(2)}</div>
                <div className="text-xs" style={{ color: C.emerald }}>Available SOL</div>
              </div>
              <div className="rounded-xl py-3 px-2" style={{ background: "rgba(255,255,255,0.03)" }}>
                <div className="text-lg font-bold">{lockedDeposits.reduce((s, d) => s + d.amountSol, 0).toFixed(2)}</div>
                <div className="text-xs" style={{ color: "#F0C456" }}>Locked SOL</div>
              </div>
            </div>
          </div>

          {/* ── Available Deposits ── */}
          {claimableDeposits.length > 0 && (
            <div className="rounded-xl p-4 space-y-3" style={{ background: "rgba(16, 185, 129, 0.05)", border: "1px solid rgba(16, 185, 129, 0.2)" }}>
              <h3 className="text-sm font-medium" style={{ color: C.emerald }}>
                Available Savings
              </h3>
              {claimableDeposits.map(d => {
                const milestone = milestones.find(m => allDeposits.get(m.pda)?.some(dep => dep.pda === d.pda))
                return (
                  <div key={d.pda} className="flex items-center justify-between py-2">
                    <div>
                      <span className="text-sm font-medium">{d.depositorName}</span>
                      <div className="text-xs font-mono" style={{ color: C.muted }}>{d.amountSol.toFixed(4)} SOL <span style={{ color: C.dim }}>≈ ${(d.amountSol * solPrice).toFixed(2)}</span></div>
                    </div>
                    <button
                      onClick={() => milestone && handleClaim(milestone.pda, d.pda)}
                      disabled={claimingPda === d.pda}
                      className="text-xs px-3 py-1.5 rounded-full font-medium transition-all hover:opacity-80 disabled:opacity-50"
                      style={{ background: "rgba(20,241,149,0.15)", color: C.emerald }}
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
            <div className="rounded-xl p-4 space-y-3" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
              <h3 className="text-sm font-medium" style={{ color: "#F0C456" }}>
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
                    <div className="text-xs font-mono" style={{ color: C.dim }}>≈ ${(d.amountSol * solPrice).toFixed(2)}</div>
                  </div>
                </div>
              ))}
              <p className="text-xs pt-2" style={{ color: C.dim }}>
                Held securely on-chain. Cannot be withdrawn until the unlock date. Early withdrawal available with 10% penalty.
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
                  <div key={m.pda} className="rounded-xl p-3 text-center" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                    <div className="text-lg">🦷</div>
                    <div className="text-xs font-medium mt-1">#{m.milestoneIndex + 1}</div>
                    {total > 0 && <div className="text-xs font-mono mt-0.5" style={{ color: "#F0C456" }}>{total.toFixed(2)}</div>}
                  </div>
                )
              })}
              {/* Empty slots */}
              {Array.from({ length: Math.max(0, 4 - milestones.length) }).map((_, i) => (
                <div key={`empty-${i}`} className="rounded-xl p-3 text-center opacity-20" style={{ background: C.surface, border: `1px dashed ${C.border}` }}>
                  <div className="text-lg">🦷</div>
                  <div className="text-xs mt-1">—</div>
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
                  <span>{d.depositorName} — released {d.claimedAt ? new Date(d.claimedAt * 1000).toLocaleDateString() : ""}</span>
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
                const url = `${window.location.origin}/gift/${milestonePda}`
                navigator.clipboard.writeText(url)
                  .then(() => alert("Family link copied! Anyone with this link can view the wallet and add SOL."))
                  .catch(() => prompt("Copy this link:", url))
              }}
              className="w-full px-4 py-3 rounded-xl text-sm font-medium"
              style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.muted }}
            >
              Share {activeProfile.childName}&apos;s wallet with family
            </button>
            <Link href="/"
              className="block w-full px-4 py-3 rounded-xl text-sm font-medium text-white text-center"
              style={{ background: C.rose }}>
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

      <footer className="mt-12 pt-4 border-t text-center" style={{ borderColor: C.border }}>
        <p className="text-xs" style={{ color: C.dim }}>Tooth Fairy Network &middot; Your child&apos;s first digital wallet</p>
      </footer>
    </div>
  )
}
