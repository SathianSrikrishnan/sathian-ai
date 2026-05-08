"use client"

import { useState, useEffect, useMemo, useRef } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { useWallet, useConnection } from "@solana/wallet-adapter-react"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import { AnchorProvider } from "@coral-xyz/anchor"
import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js"
import { useSolPrice } from "@/lib/toothfairy/use-sol-price"
import { MagicalBirthday } from "@/components/toothfairy/magical-birthday"
import { ToothIcon, SparkleIcon, LockIcon } from "@/components/toothfairy/fairy-icons"

/* ─── Local cream palette (OKLCH, matches landing page) ──────────────────── */
const c = {
  cream:      'oklch(97.5% 0.01 80)',
  creamDeep:  'oklch(95% 0.015 75)',
  brown:      'oklch(30% 0.035 65)',
  brownSoft:  'oklch(42% 0.03 65)',
  brownMuted: 'oklch(58% 0.025 65)',
  gold:       'oklch(72% 0.145 75)',
  goldHover:  'oklch(62% 0.13 72)',
  goldLight:  'oklch(82% 0.1 78)',
  border:     'oklch(88% 0.015 75)',
  teal:       'oklch(68% 0.11 180)',
  error:      'oklch(58% 0.18 25)',
}

// Shim for legacy C.* references — maps to cream palette
const C = {
  muted: c.brownMuted,
  dim: c.brownMuted,
  gold: c.gold,
  teal: c.teal,
  ember: c.error,
  text: c.brown,
  border: c.border,
}
import {
  getEscrowProgram, fetchChildProfile, fetchMilestonesForProfile,
  fetchDepositsForMilestone, deriveChildWallet, deposit as escrowDeposit,
  calculateEighteenthBirthday, calculateFee, getChildProfilePDA, getMilestonePDA,
  type ChildProfileData, type DepositData, type MilestoneData, type LockPeriodKey,
} from "@/lib/toothfairy/escrow"
import Link from "next/link"

function seedColors(seed: string) {
  let hash = 0
  for (let i = 0; i < seed.length; i++) { hash = ((hash << 5) - hash) + seed.charCodeAt(i); hash |= 0 }
  const hue1 = Math.abs(hash % 360)
  const hue2 = (hue1 + 120 + (hash % 60)) % 360
  return { hue1, hue2, gradient: `linear-gradient(135deg, hsl(${hue1}, 70%, 55%), hsl(${hue2}, 60%, 45%))` }
}

export default function ToothChildPage() {
  const params = useParams()
  const solPrice = useSolPrice()
  const rawName = (params?.name as string) || ""
  const slugName = decodeURIComponent(rawName).replace(/-/g, " ")
  // Display name: prefer clean name from Supabase, fall back to slug-derived name
  const [displayName, setDisplayName] = useState<string | null>(null)
  const childName = displayName || slugName
  const childNameCapitalized = childName.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ")

  const { publicKey, signTransaction, signAllTransactions } = useWallet()
  const { connection } = useConnection()
  const { setVisible } = useWalletModal()
  const searchParams = useSearchParams()

  // Support ?g= query param as fallback guardian key for read-only viewing
  const guardianParam = searchParams.get("g")

  // Server-guardian detection: check if this child was created by server-subsidized mint
  const [serverGuardian, setServerGuardian] = useState<string | null>(null)
  const [isServerGuardian, setIsServerGuardian] = useState(false)
  const [claiming, setClaiming] = useState(false)
  const [claimed, setClaimed] = useState(false)

  // Deposit form state
  const [showDepositForm, setShowDepositForm] = useState(false)
  const [depositAmount, setDepositAmount] = useState("1")
  const [depositorName, setDepositorName] = useState("")
  const [lockChoice, setLockChoice] = useState<"now" | "eighteen">("eighteen")
  const [depositing, setDepositing] = useState(false)
  const [depositSuccess, setDepositSuccess] = useState<string | null>(null)

  // Stored profile PDA from Supabase (authoritative, doesn't need derivation)
  const [storedProfilePda, setStoredProfilePda] = useState<string | null>(null)

  // Load server guardian from localStorage OR Supabase lookup
  useEffect(() => {
    const key = slugName.toLowerCase().trim()
    const sg = localStorage.getItem(`tfn-server-guardian-${key}`)
    if (sg) {
      setServerGuardian(sg)
      setIsServerGuardian(true)
    }
    const pda = localStorage.getItem(`tfn-child-profile-pda-${key}`)
    if (pda) setStoredProfilePda(pda)

    // Look up in Supabase for the authoritative data (use raw slug from URL, not display name)
    const slug = rawName.toLowerCase().trim()
    fetch(`/api/toothfairy/child-lookup?slug=${encodeURIComponent(slug)}`)
      .then(r => r.json())
      .then(data => {
        if (data.found) {
          if (data.guardianPubkey) {
            setServerGuardian(data.guardianPubkey)
            localStorage.setItem(`tfn-server-guardian-${key}`, data.guardianPubkey)
          }
          if (data.isServerGuardian) {
            setIsServerGuardian(true)
          }
          if (data.childProfilePda) {
            setStoredProfilePda(data.childProfilePda)
            localStorage.setItem(`tfn-child-profile-pda-${key}`, data.childProfilePda)
          }
          // Use clean name from Supabase instead of slug-derived name
          if (data.childName) {
            setDisplayName(data.childName)
          }
          // Load smile photo from Supabase (persistent, survives OAuth redirect)
          if (data.smilePhotoUrl) {
            setChildPhoto(data.smilePhotoUrl)
          }
        }
      })
      .catch(() => {})
  }, [rawName, slugName])

  // Determine the guardian key to use for profile lookup.
  // IMPORTANT: The on-chain PDA is derived from the ORIGINAL guardian (server wallet).
  // Even after transferGuardianship, the PDA address doesn't change.
  // So we always prefer the server guardian key for lookups if available.
  const guardianKey = useMemo(() => {
    // Server guardian takes priority for profile PDA lookup
    if (serverGuardian) {
      try { return new PublicKey(serverGuardian) } catch { /* fall through */ }
    }
    if (publicKey) return publicKey
    if (guardianParam) {
      try { return new PublicKey(guardianParam) } catch { return null }
    }
    return null
  }, [publicKey, guardianParam, serverGuardian])

  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<ChildProfileData | null>(null)
  const [milestones, setMilestones] = useState<MilestoneData[]>([])
  const [deposits, setDeposits] = useState<DepositData[]>([])
  const [childPhoto, setChildPhoto] = useState<string | null>(null)
  const [artworkUrl, setArtworkUrl] = useState<string | null>(null)
  const [milestoneImages, setMilestoneImages] = useState<Map<string, string>>(new Map())
  const [birthday, setBirthday] = useState<string | null>(null)
  const [birthdayInput, setBirthdayInput] = useState("")
  const [error, setError] = useState<string | null>(null)
  const balanceRef = useRef<HTMLSpanElement>(null)

  const { gradient } = seedColors(childName)

  // Load localStorage data (check both old flow key and new wizard key)
  useEffect(() => {
    const key = childName.toLowerCase().trim()
    const photo = localStorage.getItem(`tfn-child-photo-${key}`) || localStorage.getItem("tfn-wizard-smile")
    const art = localStorage.getItem(`tfn-child-art-${key}`)
    const preview = localStorage.getItem(`tfn-child-preview-${key}`)
    const dob = localStorage.getItem(`tfn-child-dob-${key}`)
    if (photo) setChildPhoto(photo)
    if (art) setArtworkUrl(art)
    else if (preview) setArtworkUrl(preview)
    if (dob) setBirthday(dob)
  }, [childName])

  const anchorProvider = useMemo(() => {
    if (publicKey && signTransaction && signAllTransactions) {
      return new AnchorProvider(connection, { publicKey, signTransaction, signAllTransactions } as any, { commitment: "confirmed" })
    }
    if (guardianKey) {
      return new AnchorProvider(
        connection,
        { publicKey: guardianKey, signTransaction: async (tx: any) => tx, signAllTransactions: async (txs: any) => txs } as any,
        { commitment: "confirmed" }
      )
    }
    return null
  }, [publicKey, signTransaction, signAllTransactions, connection, guardianKey])

  useEffect(() => {
    async function load() {
      if (!childName || !anchorProvider) { setLoading(false); return }
      try {
        const program = getEscrowProgram(anchorProvider)

        // Try multiple strategies to find the profile
        let prof = null

        // Strategy 1: Use stored PDA directly (most reliable after claim)
        if (storedProfilePda) {
          try {
            const pda = new PublicKey(storedProfilePda)
            const account = await program.account.childProfile.fetch(pda)
            if (account) {
              const a = account as any
              prof = {
                guardian: a.guardian.toBase58(),
                childWallet: a.childWallet.toBase58(),
                childName: a.childName,
                milestoneCount: a.milestoneCount,
                totalDeposited: a.totalDeposited.toNumber(),
                totalClaimed: a.totalClaimed.toNumber(),
                depositCount: a.depositCount,
                pda: storedProfilePda,
              }
            }
          } catch { /* PDA not found, try next strategy */ }
        }

        // Strategy 2: Derive from guardian key
        if (!prof && guardianKey) {
          const childWallet = deriveChildWallet(guardianKey, childName)
          prof = await fetchChildProfile(program, guardianKey, childWallet)
        }

        // Strategy 3: Derive from connected wallet
        if (!prof && publicKey && (!guardianKey || guardianKey.toBase58() !== publicKey.toBase58())) {
          const childWallet = deriveChildWallet(publicKey, childName)
          prof = await fetchChildProfile(program, publicKey, childWallet)
        }

        if (prof) {
          setProfile(prof)
          const ms = await fetchMilestonesForProfile(program, new PublicKey(prof.pda))
          setMilestones(ms)
          const allDeps: DepositData[] = []
          for (const m of ms) {
            const deps = await fetchDepositsForMilestone(program, new PublicKey(m.pda))
            allDeps.push(...deps)
          }
          setDeposits(allDeps)
          const imgMap = new Map<string, string>()
          for (const m of ms) {
            if (m.metadataUri?.startsWith("http")) {
              try {
                const res = await fetch(m.metadataUri)
                if (res.ok) {
                  const meta = await res.json()
                  if (meta.image) { imgMap.set(m.pda, meta.image); if (!artworkUrl) setArtworkUrl(meta.image) }
                }
              } catch {}
            }
          }
          setMilestoneImages(imgMap)
        }
      } catch (e) { console.error("Load error:", e) }
      setLoading(false)
    }
    load()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [childName, anchorProvider, guardianKey, storedProfilePda])

  // GSAP balance count-up
  useEffect(() => {
    if (!profile || !balanceRef.current) return
    const target = (profile.totalDeposited - profile.totalClaimed) / LAMPORTS_PER_SOL
    import("gsap").then(({ gsap }) => {
      const counter = { value: 0 }
      gsap.to(counter, {
        value: target, duration: 1.5, ease: "power2.out",
        onUpdate: () => { if (balanceRef.current) balanceRef.current.textContent = counter.value.toFixed(2) }
      })
    })
  }, [profile])

  // ─── Claim Profile (transfer guardianship) ──────────────────────
  const handleClaimProfile = async () => {
    if (!publicKey) {
      // Check if Phantom (or any Solana wallet) is actually available
      const hasPhantom = typeof window !== "undefined" && !!(window as any).phantom?.solana?.isPhantom
      const hasAnySolana = typeof window !== "undefined" && !!(window as any).solana

      if (!hasPhantom && !hasAnySolana) {
        // No wallet extension found — redirect to install or open in Phantom mobile browser
        const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent)
        if (isMobile) {
          // Deep link into Phantom mobile browser
          window.location.href = `https://phantom.app/ul/browse/${encodeURIComponent(window.location.href)}`
        } else {
          window.open("https://phantom.app/download", "_blank")
          setError("You'll need a Solana wallet like Phantom to claim this profile.")
        }
        return
      }

      setVisible(true)
      return
    }

    setClaiming(true)
    setError(null)
    try {
      const slug = childName.toLowerCase().trim().replace(/\s+/g, "-")
      const res = await fetch("/api/toothfairy/claim-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          childSlug: slug,
          newGuardianWallet: publicKey.toBase58(),
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || "Claim failed")
      }

      const data = await res.json()
      console.log("[claim] Success:", data)

      // Update local state — keep serverGuardian for PDA lookups
      setClaimed(true)
      setIsServerGuardian(false)
      // DO NOT clear serverGuardian — the on-chain PDA is derived from the original guardian

      // Store the new guardian info
      localStorage.setItem(`tfn-children-${publicKey.toBase58()}`, JSON.stringify([
        deriveChildWallet(publicKey, childName).toBase58()
      ]))

      // Show deposit form
      setShowDepositForm(true)
    } catch (err: any) {
      setError(err.message || "Claim failed")
    }
    setClaiming(false)
  }

  // ─── Deposit handler ──────────────────────────────────────────
  const handleDeposit = async () => {
    if (!publicKey || !signTransaction || !signAllTransactions) return
    setDepositing(true)
    setError(null)
    try {
      const { AnchorProvider: AP } = await import("@coral-xyz/anchor")
      const anchorProv = new AP(connection, { publicKey, signTransaction, signAllTransactions } as any, { commitment: "confirmed" })
      const program = getEscrowProgram(anchorProv)

      // Use already-loaded milestones if available
      console.log("[deposit] milestones in state:", milestones.length, "profile:", profile?.pda)
      let ms = [...milestones]

      // If no milestones in state, try multiple lookup strategies
      if (ms.length === 0) {
        // Strategy 1: Use loaded profile PDA
        if (profile) {
          ms = await fetchMilestonesForProfile(program, new PublicKey(profile.pda))
        }

        // Strategy 2: Derive from server guardian (original creator)
        if (ms.length === 0) {
          const key = childName.toLowerCase().trim()
          const sg = localStorage.getItem(`tfn-server-guardian-${key}`)
          if (sg) {
            try {
              const sgPubkey = new PublicKey(sg)
              const sgChildWallet = deriveChildWallet(sgPubkey, childName)
              const [sgProfilePda] = getChildProfilePDA(sgChildWallet)
              ms = await fetchMilestonesForProfile(program, sgProfilePda)
            } catch {}
          }
        }

        // Strategy 3: Derive from connected wallet
        if (ms.length === 0 && publicKey) {
          try {
            const userChildWallet = deriveChildWallet(publicKey, childName)
            const [userProfilePda] = getChildProfilePDA(userChildWallet)
            ms = await fetchMilestonesForProfile(program, userProfilePda)
          } catch {}
        }

        // Strategy 4: Use stored profile PDA from localStorage
        if (ms.length === 0) {
          const key = childName.toLowerCase().trim()
          const storedPda = localStorage.getItem(`tfn-child-profile-pda-${key}`)
          if (storedPda) {
            try {
              ms = await fetchMilestonesForProfile(program, new PublicKey(storedPda))
            } catch {}
          }
        }
      }

      if (ms.length === 0) throw new Error("No milestone found for deposit. Please reload the page and try again.")

      let lockPeriod: LockPeriodKey = "immediate"
      let lockUntilTimestamp: number | undefined
      if (lockChoice === "eighteen" && birthday) {
        lockPeriod = "untilTimestamp"
        lockUntilTimestamp = calculateEighteenthBirthday(new Date(birthday))
      }

      // Use the profile PDA from the milestone data (guaranteed correct regardless of guardian)
      const profilePda = new PublicKey(ms[0].childProfile)
      const txSig = await escrowDeposit(
        program,
        publicKey,
        profilePda,
        new PublicKey(ms[0].pda),
        parseFloat(depositAmount) || 1,
        lockPeriod,
        depositorName || "Guardian",
        lockUntilTimestamp,
      )
      setDepositSuccess(txSig)

      // Refresh profile data after deposit (wait for confirmation)
      setTimeout(async () => {
        try {
          const refreshProgram = getEscrowProgram(anchorProv)
          const profilePdaKey = new PublicKey(ms[0].childProfile)
          const freshProfile = await refreshProgram.account.childProfile.fetch(profilePdaKey)
          if (freshProfile) {
            setProfile({
              guardian: (freshProfile as any).guardian.toBase58(),
              childWallet: (freshProfile as any).childWallet.toBase58(),
              childName: (freshProfile as any).childName,
              milestoneCount: (freshProfile as any).milestoneCount,
              totalDeposited: (freshProfile as any).totalDeposited.toNumber(),
              totalClaimed: (freshProfile as any).totalClaimed.toNumber(),
              depositCount: (freshProfile as any).depositCount,
              pda: ms[0].childProfile,
            })
          }
          // Refresh deposits
          const freshDeps = await fetchDepositsForMilestone(refreshProgram, new PublicKey(ms[0].pda))
          setDeposits(freshDeps)
        } catch (e) { console.error("[deposit] refresh error:", e) }
      }, 3000)
    } catch (err: any) {
      setError(err.message || "Deposit failed")
    }
    setDepositing(false)
  }

  const totalBalance = profile ? (profile.totalDeposited - profile.totalClaimed) / LAMPORTS_PER_SOL : 0
  const usdBalance = totalBalance * 130
  const activeDeposits = deposits.filter(d => !d.claimed)
  const lockedDeposits = activeDeposits.filter(d => d.isLocked)

  // Allow sharing for anyone viewing the page — no wallet required
  const canShare = true

  const pageUrl = useMemo(() => {
    if (typeof window === "undefined") return ""
    const base = `${window.location.origin}/tooth/${rawName.replace(/\s+/g, "-")}`
    const g = guardianKey?.toBase58()
    return g ? `${base}?g=${g}` : base
  }, [rawName, guardianKey])
  const shareText = `I created a digital savings wallet for ${childNameCapitalized} on the Tooth Fairy Network!`

  return (
    <div className="min-h-screen flex flex-col" style={{ color: c.brown, background: c.cream, fontFamily: "var(--font-body)" }}>
      {/* Nav */}
      <header className="px-6 py-5 flex items-center justify-between relative z-10" style={{ borderBottom: `1px solid ${c.border}`, background: c.cream }}>
        <Link href="/toothfairy" className="text-xs font-medium flex items-center gap-1.5" style={{ color: c.brownMuted, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
          <SparkleIcon size={12} /> Tooth Fairy Network
        </Link>
        {!publicKey ? (
          <button onClick={() => setVisible(true)} className="text-xs px-5 py-2 rounded-full font-semibold active:scale-[0.98]" style={{ background: c.gold, color: 'oklch(98% 0.005 80)', boxShadow: `0 4px 16px oklch(72% 0.145 75 / 0.2)`, transition: 'background 0.2s' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = c.goldHover }}
            onMouseLeave={(e) => { e.currentTarget.style.background = c.gold }}>
            Connect Wallet
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono" style={{ color: c.brownMuted }}>{publicKey.toBase58().slice(0, 4)}...{publicKey.toBase58().slice(-4)}</span>
            <Link href="/toothfairy/app/dashboard" className="text-xs px-3 py-1.5 rounded-full" style={{ border: `1px solid ${c.border}`, color: c.gold, fontWeight: 500 }}>Dashboard</Link>
          </div>
        )}
      </header>

      <main className="flex-1 flex flex-col items-center px-6 py-10 sm:py-14 max-w-md mx-auto w-full relative z-10">

        {/* ═══ HERO: Photo + Name + Birthday ═══ */}
        {childPhoto ? (
          <div className="relative mb-6">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full p-[3px]" style={{
              background: `linear-gradient(135deg, ${c.gold}, ${c.goldLight}, ${c.gold})`,
              boxShadow: `0 12px 32px oklch(30% 0.035 65 / 0.15), 0 4px 12px oklch(72% 0.145 75 / 0.12)`,
            }}>
              <img src={childPhoto} alt={childNameCapitalized} className="w-full h-full rounded-full object-cover" />
            </div>
          </div>
        ) : artworkUrl ? (
          <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl mb-6 overflow-hidden" style={{
            border: `1px solid ${c.border}`,
            boxShadow: `0 16px 40px oklch(30% 0.035 65 / 0.12)`,
          }}>
            <img src={artworkUrl} alt={`${childNameCapitalized}'s tooth`} className="w-full h-full object-cover"
              onError={(e) => { (e.target as HTMLImageElement).parentElement!.style.display = "none" }} />
          </div>
        ) : (
          <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full mb-6" style={{
            background: gradient,
            boxShadow: `0 16px 40px oklch(30% 0.035 65 / 0.15)`,
          }} />
        )}

        <div className="flex items-center justify-center gap-3 mb-3">
          <h1 className="tracking-tight leading-[1.05] text-center" style={{
            fontSize: "clamp(40px, 10vw, 52px)",
            fontFamily: "var(--font-display)",
            fontWeight: 500,
            color: c.brown,
            letterSpacing: '-0.01em',
          }}>
            {childNameCapitalized}
          </h1>
        </div>

        <style>{`
          .tooth-card-hover { transition: border-color 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s cubic-bezier(0.16, 1, 0.3, 1), transform 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
          .tooth-card-hover:hover { border-color: oklch(72% 0.145 75 / 0.4) !important; box-shadow: 0 24px 48px oklch(30% 0.035 65 / 0.14) !important; transform: translateY(-2px); }
        `}</style>

        {birthday ? (
          <div className="mb-8">
            <MagicalBirthday dateStr={birthday} />
          </div>
        ) : publicKey && profile ? (
          <div className="mb-8 flex items-center gap-2">
            <input type="date" value={birthdayInput} onChange={e => setBirthdayInput(e.target.value)}
              className="px-3 py-1.5 rounded-lg text-xs outline-none" style={{ background: c.cream, border: `1px solid ${c.border}`, color: c.brown }} />
            <button onClick={() => { if (birthdayInput) { localStorage.setItem(`tfn-child-dob-${childName.toLowerCase().trim()}`, birthdayInput); setBirthday(birthdayInput) } }}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold" style={{ background: c.gold, color: 'oklch(98% 0.005 80)' }}>Save</button>
          </div>
        ) : (
          <p className="text-xs uppercase mb-8" style={{ color: c.gold, letterSpacing: '0.2em', fontWeight: 500 }}>A digital keepsake</p>
        )}

        {/* ═══ CLAIM CTA (server-guardian profiles only, secondary) ═══ */}
        {isServerGuardian && !claimed && (
          <div className="w-full rounded-2xl p-5 text-center mb-6" style={{
            background: c.creamDeep,
            border: `1px solid ${c.border}`,
          }}>
            <p className="text-sm mb-3" style={{ color: c.brownSoft, lineHeight: 1.55 }}>
              Have a Solana wallet? Connect it to deposit directly and manage savings.
            </p>
            {error && <p className="text-xs mb-2" style={{ color: c.error }}>{error}</p>}
            <button
              onClick={handleClaimProfile}
              disabled={claiming}
              className="px-5 py-2.5 rounded-full text-xs font-semibold transition-all hover:scale-[1.02] disabled:opacity-50"
              style={{ background: 'transparent', color: c.gold, border: `1px solid ${c.gold}` }}
            >
              {claiming ? "Connecting..." : publicKey ? "Connect Profile" : "Connect Wallet"}
            </button>
          </div>
        )}

        {/* ═══ TOTAL SAVINGS BAR (compact) ═══ */}
        <div className="w-full rounded-2xl p-5 mb-6 flex items-center justify-between" style={{
          background: c.creamDeep,
          border: `1px solid ${c.border}`,
          boxShadow: `0 8px 24px oklch(30% 0.035 65 / 0.08)`,
        }}>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] mb-1 font-medium" style={{ color: c.gold }}>Total Savings</p>
            {profile ? (
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-semibold" style={{ color: c.brown, fontFamily: 'var(--font-display)' }} ref={balanceRef}>{totalBalance.toFixed(2)}</span>
                <span className="text-sm" style={{ color: c.brownSoft }}>SOL</span>
                <span className="text-xs font-mono" style={{ color: c.brownMuted }}>≈ ${usdBalance.toFixed(2)}</span>
              </div>
            ) : loading ? (
              <p className="text-sm animate-pulse" style={{ color: c.brownMuted }}>Loading…</p>
            ) : (
              <p className="text-sm" style={{ color: c.brownMuted, maxWidth: '32ch', lineHeight: 1.5 }}>Share this page with family to start saving</p>
            )}
          </div>
          {lockedDeposits.length > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full" style={{ background: c.cream, border: `1px solid ${c.border}` }}>
              <LockIcon size={11} />
              <span className="text-xs font-medium" style={{ color: c.brownSoft }}>{lockedDeposits.length} locked</span>
            </div>
          )}
          {!publicKey && !serverGuardian && !guardianParam && (
            <button onClick={() => setVisible(true)} className="px-4 py-2 rounded-full text-xs font-semibold active:scale-[0.98]"
              style={{ background: c.gold, color: 'oklch(98% 0.005 80)', transition: 'background 0.2s' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = c.goldHover }}
              onMouseLeave={(e) => { e.currentTarget.style.background = c.gold }}>
              Connect Wallet
            </button>
          )}
        </div>

        {/* ═══ TOOTH SCRAPBOOK — each tooth card with art + deposits ═══ */}
        {milestones.length > 0 && (
          <div className="w-full space-y-4 mb-6">
            {milestones.map((m) => {
              const img = milestoneImages.get(m.pda)
              const mDeps = deposits.filter(d => d.milestone === m.pda && !d.claimed)
              const mTotal = mDeps.reduce((s, d) => s + d.amountSol, 0)
              const toothDate = m.createdAt ? new Date(m.createdAt * 1000).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : null

              return (
                <div key={m.pda} className="w-full rounded-3xl overflow-hidden tooth-card-hover" style={{
                  background: c.cream,
                  border: `1px solid ${c.border}`,
                  boxShadow: `0 12px 32px oklch(30% 0.035 65 / 0.1)`,
                }}>
                  {/* Tooth art — large, prominent */}
                  {img ? (
                    <div className="relative w-full" style={{ aspectRatio: "4/3" }}>
                      <img src={img} alt={`Tooth #${m.milestoneIndex + 1}`} className="w-full h-full object-cover" />
                      <div className="absolute inset-0" style={{ background: `linear-gradient(to top, oklch(30% 0.035 65 / 0.55) 0%, transparent 45%)` }} />
                      {/* Tooth number badge */}
                      <div className="absolute top-3 left-3 px-3 py-1.5 rounded-full flex items-center gap-1.5" style={{
                        background: `${c.cream}ee`, backdropFilter: "blur(8px)",
                        border: `1px solid ${c.border}`,
                      }}>
                        <ToothIcon size={12} />
                        <span className="text-xs font-semibold" style={{ color: c.brown, letterSpacing: '0.04em' }}>Tooth #{m.milestoneIndex + 1}</span>
                      </div>
                      {/* Savings badge */}
                      {mTotal > 0 && (
                        <div className="absolute top-3 right-3 px-3 py-1.5 rounded-full" style={{
                          background: `${c.cream}ee`, backdropFilter: "blur(8px)",
                          border: `1px solid ${c.border}`,
                        }}>
                          <span className="text-xs font-mono font-semibold" style={{ color: c.gold }}>{mTotal.toFixed(2)} SOL</span>
                        </div>
                      )}
                      {/* Date at bottom */}
                      {toothDate && (
                        <div className="absolute bottom-3 left-3">
                          <span className="text-xs font-medium" style={{ color: c.cream, textShadow: `0 1px 4px oklch(30% 0.035 65 / 0.4)` }}>{toothDate}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="w-full flex flex-col items-center justify-center gap-2 py-10" style={{ background: c.creamDeep }}>
                      <ToothIcon size={40} />
                      <span className="text-sm font-semibold" style={{ color: c.brown, fontFamily: 'var(--font-display)' }}>Tooth #{m.milestoneIndex + 1}</span>
                      {toothDate && <span className="text-xs" style={{ color: c.brownMuted }}>{toothDate}</span>}
                    </div>
                  )}

                  {/* Deposits for THIS tooth */}
                  {mDeps.length > 0 && (
                    <div className="px-5 py-4 space-y-2">
                      {mDeps.map((d) => (
                        <div key={d.pda} className="flex items-center justify-between py-2">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold" style={{
                              background: c.creamDeep, border: `1px solid ${c.border}`, color: c.gold,
                            }}>
                              {d.depositorName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="text-sm font-semibold" style={{ color: c.brown }}>{d.depositorName}</p>
                              <p className="text-[11px] flex items-center gap-1" style={{ color: c.brownMuted }}>
                                {d.isLocked && <LockIcon size={9} />}
                                {d.isLocked ? `Until ${new Date(d.lockUntil * 1000).toLocaleDateString("en-US", { month: "short", year: "numeric" })}` : "Available now"}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-mono font-semibold" style={{ color: c.gold }}>{d.amountSol.toFixed(2)} SOL</p>
                            <p className="text-[11px] font-mono" style={{ color: c.brownMuted }}>≈ ${(d.amountSol * solPrice).toFixed(0)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Empty state for tooth with no deposits */}
                  {mDeps.length === 0 && (
                    <div className="px-4 py-4 text-center cursor-pointer" onClick={() => { if (publicKey) setShowDepositForm(true); else setVisible(true) }}>
                      <p className="text-xs font-medium hover:underline" style={{ color: c.gold }}>No gifts yet — be the first!</p>
                    </div>
                  )}
                </div>
              )
            })}

            {/* Placeholder for next teeth */}
            {milestones.length < 3 && (
              <div className="w-full rounded-3xl p-7 flex flex-col items-center justify-center gap-2" style={{
                border: `1px dashed ${c.border}`, background: c.creamDeep, opacity: 0.65,
              }}>
                <ToothIcon size={24} />
                <span className="text-xs" style={{ color: c.brownMuted, letterSpacing: '0.04em' }}>Next tooth goes here</span>
              </div>
            )}
          </div>
        )}

        {/* ═══ DEPOSIT FORM ═══ */}
        {((claimed && showDepositForm) || (!depositSuccess && activeDeposits.length === 0)) && publicKey && (
          <div className="w-full rounded-3xl p-6 mb-6" style={{
            background: c.creamDeep,
            border: `1px solid ${c.border}`,
            boxShadow: `0 12px 32px oklch(30% 0.035 65 / 0.08)`,
          }}>
            <h3 className="text-xl mb-5 text-center" style={{ color: c.brown, fontFamily: "var(--font-display)", fontWeight: 500 }}>
              {claimed ? "Make the first deposit" : `Add SOL for ${childNameCapitalized}`}
            </h3>

            <label className="block text-xs mb-1.5 font-medium" style={{ color: c.brownSoft, letterSpacing: '0.04em' }}>Your name</label>
            <input
              type="text" value={depositorName} onChange={(e) => setDepositorName(e.target.value)}
              placeholder="Dad"
              className="w-full rounded-xl px-4 py-3 text-sm outline-none mb-4"
              style={{ background: c.cream, border: `1px solid ${c.border}`, color: c.brown, fontFamily: 'var(--font-body)' }}
            />

            <label className="block text-xs mb-1.5 font-medium" style={{ color: c.brownSoft, letterSpacing: '0.04em' }}>Amount (SOL)</label>
            <input
              type="number" value={depositAmount} onChange={(e) => setDepositAmount(e.target.value)}
              min="0.01" step="0.1"
              className="w-full rounded-xl px-4 py-3 text-sm outline-none mb-4"
              style={{ background: c.cream, border: `1px solid ${c.border}`, color: c.brown, fontFamily: 'var(--font-body)' }}
            />

            <label className="block text-xs mb-2 font-medium" style={{ color: c.brownSoft, letterSpacing: '0.04em' }}>When can {childNameCapitalized} access it?</label>
            <div className="flex gap-2 mb-4">
              <button onClick={() => setLockChoice("now")} className="flex-1 rounded-xl py-3 text-sm font-semibold transition-all"
                style={{ background: lockChoice === "now" ? c.gold : c.cream, border: `1px solid ${lockChoice === "now" ? c.gold : c.border}`, color: lockChoice === "now" ? 'oklch(98% 0.005 80)' : c.brownSoft }}>
                Available now
              </button>
              <button onClick={() => setLockChoice("eighteen")} className="flex-1 rounded-xl py-3 text-sm font-semibold transition-all"
                style={{ background: lockChoice === "eighteen" ? c.gold : c.cream, border: `1px solid ${lockChoice === "eighteen" ? c.gold : c.border}`, color: lockChoice === "eighteen" ? 'oklch(98% 0.005 80)' : c.brownSoft }}>
                <span className="flex items-center justify-center gap-1"><LockIcon size={12} /> Until 18</span>
              </button>
            </div>

            {lockChoice === "eighteen" && birthday && (
              <p className="text-xs mb-2 text-center" style={{ color: c.brownSoft }}>
                Unlocks {new Date(new Date(birthday).setFullYear(new Date(birthday).getFullYear() + 18)).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </p>
            )}

            {parseFloat(depositAmount) > 0 && (
              <p className="text-xs mb-3 text-center" style={{ color: c.brownMuted }}>
                2% platform fee: {calculateFee(parseFloat(depositAmount) || 0).fee.toFixed(4)} SOL
              </p>
            )}

            {error && <p className="text-xs mb-3 text-center" style={{ color: c.error }}>{error}</p>}

            <button onClick={handleDeposit} disabled={depositing || !depositAmount || parseFloat(depositAmount) <= 0}
              className="w-full px-6 py-3.5 rounded-full text-sm font-semibold transition-all disabled:opacity-40 active:scale-[0.98]"
              style={{ background: c.gold, color: 'oklch(98% 0.005 80)', boxShadow: `0 4px 20px oklch(72% 0.145 75 / 0.2)` }}
              onMouseEnter={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.background = c.goldHover }}
              onMouseLeave={(e) => { e.currentTarget.style.background = c.gold }}>
              {depositing ? "Depositing…" : `Deposit ${depositAmount} SOL`}
            </button>

            {!claimed && (
              <button onClick={() => setShowDepositForm(false)} className="w-full text-center text-xs mt-3 py-2" style={{ color: c.brownMuted }}>
                Skip for now
              </button>
            )}
          </div>
        )}

        {/* Deposit success */}
        {depositSuccess && (
          <div className="w-full rounded-3xl p-6 mb-6 text-center" style={{
            background: c.creamDeep, border: `1px solid ${c.goldLight}`,
            boxShadow: `0 8px 24px oklch(72% 0.145 75 / 0.12)`,
          }}>
            <SparkleIcon size={32} className="mx-auto mb-3" />
            <p className="text-lg mb-1" style={{ color: c.brown, fontFamily: 'var(--font-display)', fontWeight: 500 }}>
              {depositAmount} SOL deposited!
            </p>
            <p className="text-xs" style={{ color: c.brownSoft }}>
              {lockChoice === "eighteen" ? `Locked until ${childNameCapitalized} turns 18` : "Available for withdrawal now"}
            </p>
          </div>
        )}

        {/* ═══ SHARE — PRIMARY ACTION ═══ */}
        <div className="w-full mb-4 flex flex-col items-center gap-3">
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({ title: `${childNameCapitalized}'s Tooth Fairy Collection`, text: shareText, url: pageUrl }).catch(() => {})
              } else {
                window.open(`https://wa.me/?text=${encodeURIComponent(shareText + "\n" + pageUrl)}`, "_blank")
              }
            }}
            className="w-full px-6 py-4 rounded-full text-base font-semibold transition-all active:scale-[0.98]"
            style={{ background: c.gold, color: 'oklch(98% 0.005 80)', boxShadow: `0 4px 24px oklch(72% 0.145 75 / 0.25)` }}
            onMouseEnter={(e) => { e.currentTarget.style.background = c.goldHover }}
            onMouseLeave={(e) => { e.currentTarget.style.background = c.gold }}
          >
            <span className="flex items-center justify-center gap-2">
              Share {childNameCapitalized}&apos;s Page
            </span>
          </button>
          <button
            onClick={() => navigator.clipboard.writeText(pageUrl).then(() => alert("Link copied!")).catch(() => prompt("Copy:", pageUrl))}
            className="text-xs transition-all hover:opacity-70"
            style={{ color: c.brownMuted, letterSpacing: '0.04em' }}
          >
            Copy link
          </button>
        </div>

        {/* ═══ GIFT SOL — SECONDARY ACTION ═══ */}
        <button
          className="w-full px-6 py-3 rounded-full text-sm font-semibold mb-8 transition-all active:scale-[0.98]"
          style={{ background: 'transparent', color: c.gold, border: `1px solid ${c.gold}` }}
          onClick={() => {
            if (milestones.length > 0) {
              const url = `${window.location.origin}/api/toothfairy/actions/deposit?milestone=${milestones[0].pda}&name=${encodeURIComponent(childName)}`
              window.open(`https://dial.to/?action=${encodeURIComponent(`solana-action:${url}`)}`, "_blank")
            } else { setVisible(true) }
          }}
        >
          <span className="flex items-center justify-center gap-2">
            <SparkleIcon size={16} /> Gift SOL to {childNameCapitalized}
          </span>
        </button>

        {/* CTA for visitors who don't have their own child profile */}
        {!publicKey && !isServerGuardian && (
          <div className="w-full rounded-3xl p-6 text-center mb-6" style={{ background: c.creamDeep, border: `1px solid ${c.border}` }}>
            <p className="text-sm mb-4" style={{ color: c.brownSoft, lineHeight: 1.55 }}>Save your child&apos;s milestones too</p>
            <Link href="/toothfairy/app/draw?from=shared-tooth" className="inline-block px-6 py-3 rounded-full text-sm font-semibold active:scale-[0.98]"
              style={{ background: c.gold, color: 'oklch(98% 0.005 80)', boxShadow: `0 4px 20px oklch(72% 0.145 75 / 0.2)` }}>
              Create a keepsake
            </Link>
          </div>
        )}
      </main>

      <footer className="px-6 py-6 text-center relative z-10" style={{ borderTop: `1px solid ${c.border}`, background: c.creamDeep }}>
        <p className="text-xs" style={{ color: c.brownMuted, letterSpacing: '0.04em' }}>
          Tooth Fairy Network &middot; Permanently stored &middot;{" "}
          <a href="https://solscan.io/account/FqCSNerRsjdxamLyiyTvqiGKZ4vnfYngLUuTKtSi7RTC" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: c.gold }}>Verify on Solana</a>
        </p>
      </footer>
    </div>
  )
}
