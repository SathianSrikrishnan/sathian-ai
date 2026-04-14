"use client"

import { useState, useRef, useCallback, useMemo, useEffect } from "react"
import { useWallet, useConnection } from "@solana/wallet-adapter-react"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import { AnchorProvider } from "@coral-xyz/anchor"
import {
  getEscrowProgram,
  deposit as escrowDeposit,
  fetchDepositsForMilestone,
  calculateFee,
  calculateEighteenthBirthday,
  deriveChildWallet,
  type DepositData,
} from "@/lib/toothfairy/escrow"
import { PublicKey } from "@solana/web3.js"
import { WalletButton } from "@/components/toothfairy/app/wallet-button"
import { C, ds, gradients, glow, glass } from "@/components/toothfairy/tokens"
import Link from "next/link"
import { createBrowserSupabase } from "@/lib/supabase-auth"
import { useViewMode } from "@/components/toothfairy/view-mode-context"
import { ViewToggle } from "@/components/toothfairy/view-toggle"
import DrawingCanvas, { type DrawingCanvasRef } from "@/components/toothfairy/app/drawing-canvas"
import { PC, parentGradients, parentGlow } from "@/components/toothfairy/parent-theme"
import TellStep from "@/components/toothfairy/app/tell-step"
import { useRouter } from "next/navigation"

// Flow:
//   child mode:  setup → create → tell → preview → minting → done (done redirects to keepsake)
//   parent mode: setup → create → tell → preview → deposit → minting → done (deposit skippable)
// The Tell step captures the child's narrative about this tooth. It's the
// single most defensible data TFN collects — a photo app saves images, we
// save the story. Always inserted between the creation and mint.
type Step = "setup" | "create" | "tell" | "preview" | "deposit" | "minting" | "done"
type LockChoice = "now" | "eighteen" | "custom"

// Flow-level localStorage keys — cleared on successful mint.
const TELL_TEXT_KEY = "tfn-tell-text"
const STORY_CONTEXT_KEY = "tfn-story-context"
const LATEST_DRAWING_KEY = "toothfairy-latest-drawing"
const LATEST_ENHANCED_KEY = "toothfairy-latest-enhanced"
const LATEST_TRADITION_KEY = "toothfairy-latest-tradition"

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => { setIsMobile(/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) }, [])
  return isMobile
}

function isInPhantomBrowser() {
  if (typeof window === "undefined") return false
  return !!(window as any).phantom?.solana?.isPhantom
}

export default function ToothFairyApp() {
  // Wallet hooks are instantiated for both modes (they're cheap / provider-bound),
  // but every wallet UI surface is gated on `isParent` below. Child mode never
  // sees WalletButton, connect prompts, or the deposit step.
  const { publicKey, signTransaction, signAllTransactions } = useWallet()
  const { connection } = useConnection()
  const { setVisible } = useWalletModal()
  const isMobile = useIsMobile()
  const { isChild, isParent } = useViewMode()
  const router = useRouter()

  // Flow state
  const [step, setStep] = useState<Step>("setup")
  const [tellText, setTellText] = useState<string>("")
  const [childName, setChildName] = useState("")
  const [childDob, setChildDob] = useState("")
  const [photo, setPhoto] = useState<string | null>(null)
  const [note, setNote] = useState("")
  const [toothName, setToothName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [mintProgress, setMintProgress] = useState("")
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  // Deposit state
  const [lockChoice, setLockChoice] = useState<LockChoice>("eighteen")
  const [customLockDate, setCustomLockDate] = useState("")
  const [depositAmount, setDepositAmount] = useState("1")
  const [childPhoto, setChildPhoto] = useState<string | null>(null)
  const childPhotoRef = useRef<HTMLInputElement>(null)
  const [depositorName, setDepositorName] = useState("")
  const [depositMessage, setDepositMessage] = useState("")

  // Auth state (Supabase session — required for wallet mint path)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authLoading, setAuthLoading] = useState(true)
  const [authEmail, setAuthEmail] = useState<string | null>(null)
  const supabase = useMemo(() => createBrowserSupabase(), [])

  // Check auth session on mount and listen for changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session?.user)
      setAuthEmail(session?.user?.email ?? null)
      setAuthLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session?.user)
      setAuthEmail(session?.user?.email ?? null)
      setAuthLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  // Handle returning from OAuth redirect
  useEffect(() => {
    if (typeof window === "undefined") return
    const params = new URLSearchParams(window.location.search)
    if (params.get("returning") === "auth") {
      // Clean up URL without triggering navigation
      const url = new URL(window.location.href)
      url.searchParams.delete("returning")
      window.history.replaceState({}, "", url.toString())
    }
  }, [])

  // Email mint state (Crossmint)
  const [useEmailMint, setUseEmailMint] = useState(false)
  const [recipientEmail, setRecipientEmail] = useState("")
  const [emailMinting, setEmailMinting] = useState(false)
  const [emailMintDone, setEmailMintDone] = useState(false)
  const [emailMintProgress, setEmailMintProgress] = useState("")

  // Done screen state
  const [mintSignature, setMintSignature] = useState("")
  const [deposits, setDeposits] = useState<DepositData[]>([])
  const [escrowInfo, setEscrowInfo] = useState<{ childProfilePda: string; milestonePda: string } | null>(null)
  const [depositSuccess, setDepositSuccess] = useState<string | null>(null)

  // Card payment state (Coinbase Onramp)
  const [cardPaymentLoading, setCardPaymentLoading] = useState(false)
  const [onrampWindow, setOnrampWindow] = useState<Window | null>(null)
  const [awaitingCardDeposit, setAwaitingCardDeposit] = useState(false)

  // Canvas
  const drawingCanvasRef = useRef<DrawingCanvasRef>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  // Anchor provider
  const anchorProvider = useMemo(() => {
    if (!publicKey || !signTransaction || !signAllTransactions) return null
    return new AnchorProvider(connection, { publicKey, signTransaction, signAllTransactions } as any, { commitment: "confirmed" })
  }, [publicKey, signTransaction, signAllTransactions, connection])

  // Computed
  const eighteenthBirthday = useMemo(() => {
    if (!childDob) return null
    return calculateEighteenthBirthday(new Date(childDob + "T00:00:00"))
  }, [childDob])

  const eighteenthDate = useMemo(() => {
    if (!eighteenthBirthday) return ""
    return new Date(eighteenthBirthday * 1000).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
  }, [eighteenthBirthday])

  const feeInfo = useMemo(() => calculateFee(parseFloat(depositAmount) || 0), [depositAmount])

  // ── Persist/restore flow state for mobile Phantom deep link ──
  const FLOW_STORAGE_KEY = "tfn-flow-state"

  // Restore state on mount (survives Phantom deep link redirect)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(FLOW_STORAGE_KEY)
      if (!saved) return
      const state = JSON.parse(saved)
      if (state.childName) setChildName(state.childName)
      if (state.childDob) setChildDob(state.childDob)
      if (state.childPhoto) setChildPhoto(state.childPhoto)
      if (state.previewImage) setPreviewImage(state.previewImage)
      if (state.photo) setPhoto(state.photo)
      // Resume at preview step so wallet connection triggers auto-advance to deposit
      if (state.step === "preview" || state.step === "deposit") setStep("preview")
    } catch { /* ignore corrupt localStorage */ }
  }, [])

  // Save flow state before Phantom redirect (called by the deep link click)
  const saveFlowState = useCallback(() => {
    try {
      localStorage.setItem(FLOW_STORAGE_KEY, JSON.stringify({
        childName, childDob, childPhoto, previewImage, photo, step: "preview",
      }))
    } catch { /* localStorage full or unavailable */ }
  }, [childName, childDob, childPhoto, previewImage, photo])

  // Clear saved flow state (after mint completes or user starts over)
  const clearFlowState = useCallback(() => {
    try { localStorage.removeItem(FLOW_STORAGE_KEY) } catch {}
  }, [])

  // Clear every flow-level localStorage key so the next session starts clean.
  // Called immediately before the keepsake redirect.
  const clearAllFlowKeys = useCallback(() => {
    const keys = [
      FLOW_STORAGE_KEY,
      TELL_TEXT_KEY,
      STORY_CONTEXT_KEY,
      LATEST_DRAWING_KEY,
      LATEST_ENHANCED_KEY,
      LATEST_TRADITION_KEY,
    ]
    for (const k of keys) {
      try { localStorage.removeItem(k) } catch { /* ignore */ }
    }
  }, [])

  // Keepsake is the terminal destination. Mint API is synchronous wrt
  // Arweave + Supabase writes, so by the time we land here the keepsake
  // row can be read back without a race.
  const redirectToKeepsake = useCallback((milestonePda: string) => {
    clearAllFlowKeys()
    router.replace(`/toothfairy/keepsake/${milestonePda}`)
  }, [clearAllFlowKeys, router])

  // Sign in with Google — direct OAuth, no Supabase intermediary
  const handleGoogleSignIn = useCallback(() => {
    saveFlowState()
    const hostname = typeof window !== "undefined" ? window.location.hostname : "toothfairy.network"
    const isTfnDomain = hostname === "toothfairy.network" || hostname === "www.toothfairy.network"
    const nextPath = isTfnDomain ? "/app" : "/toothfairy/app"
    window.location.href = `/api/auth/google?next=${encodeURIComponent(nextPath)}`
  }, [saveFlowState])

  // ── Photo ──
  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => { setPhoto(reader.result as string) }
    reader.readAsDataURL(file)
  }

  const handleChildPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => { setChildPhoto(reader.result as string) }
    reader.readAsDataURL(file)
  }

  // Save canvas preview and advance to the Tell step.
  // Tell sits between creation and preview so the child captures their
  // narrative while the drawing is fresh in their head.
  const goToPreview = () => {
    const dataUrl = drawingCanvasRef.current?.toDataURL()
    if (dataUrl) setPreviewImage(dataUrl)
    setStep("tell")
  }

  // Tell handlers — persist via localStorage so mint payload can read the
  // final text regardless of re-renders. Empty string on skip.
  const handleTellContinue = useCallback((text: string) => {
    const final = (text || "").trim()
    setTellText(final)
    try {
      if (final) localStorage.setItem(TELL_TEXT_KEY, final)
      else localStorage.removeItem(TELL_TEXT_KEY)
    } catch { /* ignore */ }
    setStep("preview")
  }, [])

  const handleTellSkip = useCallback(() => {
    setTellText("")
    try { localStorage.removeItem(TELL_TEXT_KEY) } catch { /* ignore */ }
    setStep("preview")
  }, [])

  // Auto-advance from preview to deposit when wallet connects (only if already minted)
  // In child mode, skip deposit entirely
  useEffect(() => {
    if (step === "preview" && publicKey && mintSignature) {
      setStep(isChild ? "done" : "deposit")
    }
  }, [publicKey, step, mintSignature, isChild])

  // ── Server-Side Mint (NO wallet required) ──
  // The mint API uses the server keypair as temporary guardian.
  // User's Phantom wallet is NOT needed until they want to deposit SOL.
  const handleServerMint = async () => {
    // Pre-flight auth check
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) {
      setError("Your session expired. Please sign in again to continue.")
      setIsAuthenticated(false)
      return
    }

    setError(null); setStep("minting")
    const imageBase64 = previewImage ? previewImage.split(",")[1] : undefined

    // Pull Tell + story context from localStorage at submit time so any
    // inline edits between Tell step and mint click aren't lost.
    let toothStoryForMint: string | undefined
    let traditionSlugForMint: string | undefined
    try {
      const t = localStorage.getItem(TELL_TEXT_KEY)?.trim()
      if (t) toothStoryForMint = t
    } catch { /* ignore */ }
    try {
      const ctx = localStorage.getItem(STORY_CONTEXT_KEY)
      if (ctx) {
        const parsed = JSON.parse(ctx)
        if (parsed?.traditionSlug) traditionSlugForMint = parsed.traditionSlug
      }
    } catch { /* ignore */ }

    try {
      // Step 1: Mint cNFT + create escrow profile (all server-side, no wallet needed)
      setMintProgress("Saving artwork permanently...")
      const mintRes = await fetch("/api/toothfairy/mint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          childName,
          toothType: "UpperRightCentralIncisor",
          toothNumber: 1,
          imageBase64,
          imageMimeType: "image/png",
          note: note || undefined,
          birthday: childDob || undefined,
          smilePhotoBase64: childPhoto ? childPhoto.split(",")[1] : undefined,
          toothStory: toothStoryForMint,
          traditionSlug: traditionSlugForMint,
        }),
      })

      if (!mintRes.ok) {
        const d = await mintRes.json().catch(() => ({}))
        throw new Error(d.error || "Mint failed")
      }

      const mintData = await mintRes.json()
      setMintSignature(mintData.signature)
      setEscrowInfo({
        childProfilePda: mintData.childProfilePda,
        milestonePda: mintData.milestonePda,
      })

      setMintProgress("Almost done...")

      // Save metadata to localStorage (NOT base64 images — they exceed quota)
      const nameKey = childName.toLowerCase().trim()
      if (childDob) localStorage.setItem(`tfn-child-dob-${nameKey}`, childDob)
      if (mintData.imageUri) localStorage.setItem(`tfn-child-art-${nameKey}`, mintData.imageUri)

      // Clear restart-resume state (flow-level keys cleared on redirect below)
      clearFlowState()

      await new Promise(r => setTimeout(r, 500))

      // Child mode: keepsake IS the terminal destination. No deposit UI.
      // Parent mode: surface deposit step — still skippable from its UI.
      if (isChild) {
        redirectToKeepsake(mintData.milestonePda)
        return
      }
      setStep("deposit")
    } catch (err: any) {
      console.error("Mint error:", err)
      setError(err.message || "Something went wrong. Please try again.")
      setStep("preview")
    }
  }

  // ── Deposit (REQUIRES wallet — separate from minting) ──
  const handleDeposit = async () => {
    if (!publicKey || !signTransaction || !anchorProvider || !escrowInfo) return
    setError(null)

    try {
      setMintProgress("Depositing SOL...")
      setStep("minting")
      const program = getEscrowProgram(anchorProvider)
      const lockPeriod = lockChoice === "now" ? "immediate" as const : "untilTimestamp" as const
      let lockTimestamp: number | undefined
      if (lockChoice === "eighteen" && eighteenthBirthday) lockTimestamp = eighteenthBirthday
      if (lockChoice === "custom" && customLockDate) lockTimestamp = Math.floor(new Date(customLockDate + "T00:00:00").getTime() / 1000)
      await escrowDeposit(program, publicKey, new PublicKey(escrowInfo.childProfilePda), new PublicKey(escrowInfo.milestonePda), parseFloat(depositAmount), lockPeriod, depositorName.trim(), lockTimestamp)
      setDepositSuccess(`${depositAmount} SOL deposited for ${childName}!`)
      const program2 = getEscrowProgram(anchorProvider)
      const allDeps = await fetchDepositsForMilestone(program2, new PublicKey(escrowInfo.milestonePda))
      setDeposits(allDeps)
      redirectToKeepsake(escrowInfo.milestonePda)
    } catch (err: any) {
      console.error("Deposit error:", err)
      setError(err.message || "Deposit failed. Your child's milestone was already saved.")
      // Deposit failed but mint succeeded — keepsake still exists, send user there.
      if (escrowInfo) redirectToKeepsake(escrowInfo.milestonePda)
      else setStep("done")
    }
  }

  // ── Card Payment (Coinbase Onramp → server-side escrow deposit) ──
  const handleCardPayment = async () => {
    if (!escrowInfo) return
    setError(null); setCardPaymentLoading(true)

    try {
      // Convert SOL deposit amount to approximate USD
      // For hackathon demo, use preset USD amounts
      const usdPresets: Record<string, number> = { "0.1": 5, "0.5": 10, "1": 20, "5": 50 }
      const amountUsd = usdPresets[depositAmount] || Math.max(5, Math.round(parseFloat(depositAmount) * 150))

      // Get Coinbase Onramp session from our API
      const res = await fetch("/api/toothfairy/onramp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amountUsd,
          lockChoice: lockChoice === "custom" ? customLockDate : lockChoice,
          depositorName: depositorName.trim() || "Parent",
          childProfilePda: escrowInfo.childProfilePda,
          milestonePda: escrowInfo.milestonePda,
          childDob: childDob || undefined,
        }),
      })

      if (!res.ok) {
        const d = await res.json().catch(() => ({}))
        throw new Error(d.error || "Failed to start card payment")
      }

      const { onrampUrl } = await res.json()

      // Open Coinbase Onramp in popup
      const popup = window.open(onrampUrl, "coinbase-onramp", "width=460,height=700,left=200,top=100")
      setOnrampWindow(popup)
      setAwaitingCardDeposit(true)
      setCardPaymentLoading(false)

      // Listen for postMessage events from Coinbase widget
      const handleMessage = async (event: MessageEvent) => {
        if (event.origin !== "https://pay.coinbase.com") return
        const { eventName } = event.data || {}

        if (eventName === "onramp_api.polling_success" || eventName === "onramp_api.commit_success") {
          // Payment completed — trigger server-side escrow deposit
          window.removeEventListener("message", handleMessage)
          popup?.close()
          setAwaitingCardDeposit(false)
          setStep("minting")
          setMintProgress("Processing deposit...")

          try {
            const depositRes = await fetch("/api/toothfairy/server-deposit", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                childProfilePda: escrowInfo.childProfilePda,
                milestonePda: escrowInfo.milestonePda,
                amountSol: depositAmount,
                lockChoice: lockChoice === "custom" ? customLockDate : lockChoice,
                depositorName: depositorName.trim() || "Parent",
                childDob: childDob || undefined,
              }),
            })

            if (!depositRes.ok) {
              const d = await depositRes.json().catch(() => ({}))
              throw new Error(d.error || "Deposit failed")
            }

            const depositData = await depositRes.json()
            setDepositSuccess(`$${amountUsd} deposited for ${childName}!`)
            if (escrowInfo) {
              redirectToKeepsake(escrowInfo.milestonePda)
            } else {
              setStep("done")
            }
          } catch (err: any) {
            setError(err.message || "Deposit to escrow failed after payment")
            if (escrowInfo) redirectToKeepsake(escrowInfo.milestonePda)
            else setStep("done")
          }
        }

        if (eventName === "onramp_api.cancel") {
          window.removeEventListener("message", handleMessage)
          setAwaitingCardDeposit(false)
        }

        if (eventName === "onramp_api.polling_error" || eventName === "onramp_api.load_error") {
          window.removeEventListener("message", handleMessage)
          setAwaitingCardDeposit(false)
          setError("Payment failed. Please try again.")
        }
      }

      window.addEventListener("message", handleMessage)

      // Also poll for popup close (user might close manually)
      const pollClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(pollClosed)
          if (awaitingCardDeposit) {
            setAwaitingCardDeposit(false)
          }
        }
      }, 1000)
    } catch (err: any) {
      console.error("Card payment error:", err)
      setError(err.message || "Card payment failed")
      setCardPaymentLoading(false)
    }
  }

  const mintAnother = () => {
    clearFlowState()
    setStep("setup"); setPhoto(null); setPreviewImage(null); setMintSignature("")
    setError(null); setMintProgress(""); setDeposits([]); setEscrowInfo(null)
    setDepositSuccess(null)
    setUseEmailMint(false); setRecipientEmail(""); setEmailMintDone(false)
  }

  // ── Render helpers ──
  // Step ordering per mode for the top progress bar. Child mode has no
  // deposit step, so "preview" is the last pre-mint step (4 of 5).
  const stepOrder = isParent
    ? ["setup", "create", "tell", "preview", "deposit"]
    : ["setup", "create", "tell", "preview"]
  const totalSteps = stepOrder.length + 1 // +1 for the terminal minting/done
  const currentStepNum = (() => {
    if (step === "minting" || step === "done") return totalSteps
    const idx = stepOrder.indexOf(step)
    return idx >= 0 ? idx + 1 : 1
  })()
  const stepLabel = (() => {
    switch (step) {
      case "setup": return "Child Details"
      case "create": return "Capture Moment"
      case "tell": return "Tell the Story"
      case "preview": return "Preview & Save"
      case "deposit": return "Fund Wallet"
      case "minting": return "Creating..."
      case "done": return "Complete"
      default: return ""
    }
  })()

  // ── Render ── (unified: both child and parent skins)

  // Theme-aware helpers
  const bg = isParent ? PC.bg : C.bg
  const textColor = isParent ? PC.text : C.text
  const headlineColor = isParent ? PC.text : C.textWarm
  const mutedColor = isParent ? PC.muted : C.muted
  const dimColor = isParent ? PC.dim : C.dim
  const goldAccent = isParent ? PC.goldDark : C.goldDim
  const tealAccent = isParent ? PC.teal : C.teal
  const cardBg = isParent ? "#ffffff" : glass.card
  const cardBorder = isParent ? PC.border : glass.cardBorder
  const cardBlur = isParent ? "none" : `blur(${glass.blur})`
  const ctaGradient = isParent ? parentGradients.stardust : gradients.stardust
  const ctaTextColor = isParent ? PC.onGold : C.onGold
  const ctaShadow = isParent ? parentGlow.ctaFloat : '0 0 30px rgba(240,196,86,0.2), 0 10px 30px rgba(240,196,86,0.2)'
  const ctaRadius = isParent ? "0.75rem" : "9999px"
  const inputBorderDefault = isParent ? PC.border : 'rgba(240,196,86,0.2)'
  const inputBorderActive = isParent ? PC.teal : C.teal

  // Display name for the tooth
  const toothDisplayName = toothName ? `"${toothName}"` : `${childName}'s Tooth`

  return (
    <div className="w-full max-w-md mx-auto min-h-screen relative transition-colors duration-300" style={{ background: bg, color: textColor }}>

      {/* Background decorative glow orbs (child only) */}
      {isChild && (
        <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
          <div className="absolute top-[10%] -left-10 w-64 h-64 rounded-full blur-[80px]" style={{ background: `${C.goldLight}08` }} />
          <div className="absolute bottom-[20%] -right-10 w-80 h-80 rounded-full blur-[100px]" style={{ background: `${C.teal}08` }} />
        </div>
      )}

      {/* ── View Toggle Bar + Header ── */}
      <div className="sticky top-0 w-full z-50 transition-colors duration-300"
        style={{ background: isParent ? PC.bg : '#151a31', borderBottom: `1px solid ${isParent ? PC.border : 'rgba(78,70,54,0.15)'}` }}>
        <div className="flex justify-center py-2">
          <ViewToggle />
        </div>
        <div className="flex justify-between items-center px-6 pb-2">
          <h1 className="text-lg font-bold tracking-tight" style={{ color: isParent ? PC.goldDark : C.gold, fontFamily: ds.fonts.headline, textShadow: isParent ? 'none' : '0 0 8px rgba(240,196,86,0.4)' }}>
            Tooth Fairy Network
          </h1>
          <div className="flex items-center gap-2">
            {/* Wallet UI is parent-mode only. Child mode runs a fully
                custodial flow (server mint + optional deposit later) and
                must never see a Connect Wallet affordance. */}
            {isParent && publicKey && (
              <Link href="/dashboard" className="px-3 py-1.5 rounded-xl text-xs transition-colors"
                style={{ background: cardBg, backdropFilter: cardBlur, border: `1px solid ${cardBorder}`, color: mutedColor }}>
                Wallet
              </Link>
            )}
            {isParent && <WalletButton />}
          </div>
        </div>
      </div>

      {/* ── Content area ── */}
      <div className="pb-24 px-6">

        {/* ── Progress Indicator ── */}
        {step !== "minting" && step !== "done" && (
          <div className="mb-8">
            <div className="flex justify-between items-end mb-2">
              <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: goldAccent, fontFamily: ds.fonts.headline, letterSpacing: "0.15em" }}>
                Step {currentStepNum} of {totalSteps}
              </span>
              <span className="text-[10px] uppercase tracking-widest font-bold" style={{ color: mutedColor, fontFamily: ds.fonts.headline, letterSpacing: "0.15em" }}>
                {stepLabel}
              </span>
            </div>
            <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: isParent ? PC.surfaceContainer : C.surfaceHighest }}>
              <div className="h-full relative transition-all duration-500 ease-out" style={{ width: `${(currentStepNum / totalSteps) * 100}%`, background: isParent ? PC.gold : 'linear-gradient(90deg, #f0c456, #5adace)', borderRadius: '9999px' }}>
                {isChild && <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-white rounded-full" style={{ boxShadow: '0 0 8px #fff' }} />}
              </div>
            </div>
          </div>
        )}

        {/* ── Error display ── */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl text-sm" style={{ background: 'rgba(255,180,171,0.1)', border: '1px solid rgba(255,180,171,0.2)', color: C.error }}>
            {error}
            <button onClick={() => setError(null)} className="ml-2 underline text-xs opacity-70">dismiss</button>
          </div>
        )}

        {/* ── STEP 1: Setup (NO wallet needed) ── */}
        {step === "setup" && (
          <div className="space-y-6">
            {/* Hero text */}
            <div className="text-center py-4">
              <h2 className="text-xl font-bold tracking-tight" style={{ fontFamily: ds.fonts.headline, color: headlineColor }}>
                {isChild ? "Let's make something amazing" : "Set up your child's profile"}
              </h2>
              <p className="text-sm mt-2 leading-relaxed" style={{ color: mutedColor, fontFamily: isChild ? ds.fonts.story : ds.fonts.body, fontStyle: isChild ? 'italic' : 'normal' }}>
                {isChild
                  ? "Your tooth has a story — and now it gets its own spot in the Tooth Fairy Network, forever."
                  : "Your child is about to create something unique. This page gets them started."
                }
              </p>
            </div>

            {/* Photo upload circle */}
            <div className="flex justify-center">
              <input ref={childPhotoRef} type="file" accept="image/*" onChange={handleChildPhoto} className="hidden" />
              {childPhoto ? (
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden" style={{ border: `2px solid ${isParent ? PC.border : 'rgba(240,196,86,0.4)'}`, boxShadow: isParent ? 'none' : glow.goldPhoto }}>
                    <img src={childPhoto} alt="Child" className="w-full h-full object-cover" />
                  </div>
                  <button onClick={() => setChildPhoto(null)} className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: isParent ? PC.errorContainer : C.errorContainer, color: isParent ? PC.error : C.error }}>x</button>
                  <p className="text-[10px] text-center mt-2" style={{ color: mutedColor }}>Appears on their page</p>
                </div>
              ) : (
                <button onClick={() => childPhotoRef.current?.click()} className="w-24 h-24 rounded-full border-2 border-dashed flex flex-col items-center justify-center transition-all hover:border-opacity-60" style={{ borderColor: isParent ? PC.border : 'rgba(240,196,86,0.3)', background: isParent ? PC.surfaceContainerLow : 'transparent' }}>
                  <svg className="w-6 h-6 mb-1" style={{ color: isParent ? PC.muted : C.goldDim }} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" /></svg>
                  <span className="text-[9px]" style={{ color: isParent ? PC.muted : C.goldDim }}>{isChild ? "Add a photo of yourself!" : "Child's photo"}</span>
                </button>
              )}
            </div>

            {/* Form card with inputs */}
            <div className="rounded-2xl p-6 space-y-5" style={{ background: cardBg, backdropFilter: cardBlur, border: `1px solid ${isParent ? PC.border : C.borderGold}`, boxShadow: isParent ? '0 2px 8px rgba(0,0,0,0.04)' : 'none' }}>
              <div>
                <label className="block text-[10px] uppercase tracking-widest mb-2 font-bold" style={{ color: goldAccent, fontFamily: ds.fonts.headline }}>{isChild ? "What's your name?" : "CHILD'S NAME"}</label>
                <input type="text" value={childName} onChange={e => setChildName(e.target.value)} placeholder={isChild ? "e.g. Luna" : "Enter name"}
                  className="bg-transparent border-b py-2 px-1 text-lg transition-colors focus:ring-0 w-full outline-none"
                  style={{ borderColor: childName ? inputBorderActive : inputBorderDefault, color: textColor, fontFamily: ds.fonts.body }} />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest mb-2 font-bold" style={{ color: goldAccent, fontFamily: ds.fonts.headline }}>{isChild ? "When's your birthday?" : "DATE OF BIRTH"}</label>
                <input type="date" value={childDob} onChange={e => setChildDob(e.target.value)}
                  className="bg-transparent border-b py-2 px-1 text-lg transition-colors focus:ring-0 w-full outline-none"
                  style={{ borderColor: childDob ? inputBorderActive : inputBorderDefault, color: textColor, fontFamily: ds.fonts.body }} />
                {childDob && eighteenthDate && (
                  <p className="mt-2 text-xs" style={{ color: tealAccent }}>Turns 18 on {eighteenthDate}</p>
                )}
              </div>

              {/* Tooth naming */}
              <div>
                <label className="block text-[10px] uppercase tracking-widest mb-2 font-bold" style={{ color: goldAccent, fontFamily: ds.fonts.headline }}>{isChild ? "Name your tooth!" : "TOOTH'S NAME (optional)"}</label>
                <input type="text" value={toothName} onChange={e => setToothName(e.target.value)} placeholder={isChild ? "e.g. Sparkle, Chomper, Sir Wobbly" : "Your child can name it"}
                  className="bg-transparent border-b py-2 px-1 text-lg transition-colors focus:ring-0 w-full outline-none"
                  style={{ borderColor: toothName ? inputBorderActive : inputBorderDefault, color: textColor, fontFamily: ds.fonts.body }} />
              </div>
            </div>

            {/* Info cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl p-4" style={{ background: isParent ? PC.surfaceContainerLow : C.surface, border: isParent ? 'none' : `1px solid ${C.border}` }}>
                <h3 className="font-bold text-xs mb-1" style={{ fontFamily: ds.fonts.headline, color: headlineColor }}>
                  {isChild ? "Make it yours" : "Their creation, their way"}
                </h3>
                <p className="text-[11px] leading-relaxed" style={{ color: mutedColor }}>
                  {isChild
                    ? "Name your tooth. Draw it. Color it. Tell its story. Use all the tools — there's no wrong way to do this."
                    : "Your child can draw, photograph, color, and name their tooth. Give them the time to make something they're proud of."
                  }
                </p>
              </div>
              <div className="rounded-2xl p-4" style={{ background: isParent ? PC.surfaceContainerLow : C.surface, border: isParent ? 'none' : `1px solid ${C.border}` }}>
                <h3 className="font-bold text-xs mb-1" style={{ fontFamily: ds.fonts.headline, color: headlineColor }}>
                  {isChild ? "Take your time" : "We'll guide you through"}
                </h3>
                <p className="text-[11px] leading-relaxed" style={{ color: mutedColor }}>
                  {isChild
                    ? "The best ones take a little while. The fairies can wait."
                    : "The whole process takes a few minutes. Everything is free."
                  }
                </p>
              </div>
            </div>

            {/* CTA */}
            <button onClick={() => setStep("create")} disabled={!childName.trim() || !childDob}
              className="w-full py-4 font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-30"
              style={{ background: ctaGradient, color: ctaTextColor, boxShadow: ctaShadow, borderRadius: ctaRadius, fontFamily: ds.fonts.headline, border: 'none', cursor: 'pointer' }}>
              {isChild ? "Let's go!" : "Continue"}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg>
            </button>
          </div>
        )}

        {/* ── STEP 2: Create — Photo + Draw (NO wallet needed) ── */}
        {step === "create" && (
          <div className="space-y-5">
            <div className="text-center">
              <h2 className="text-xl font-bold tracking-tight" style={{ fontFamily: ds.fonts.headline, color: headlineColor }}>
                {isChild ? "Time to make your masterpiece" : "This is their moment"}
              </h2>
              <p className="text-sm mt-2 leading-relaxed" style={{ color: mutedColor, fontFamily: isChild ? ds.fonts.story : ds.fonts.body, fontStyle: isChild ? 'italic' : 'normal' }}>
                {isChild
                  ? "Use the camera, the canvas, the colors — whatever you want. Make something you're really proud of. This is what you're sending to the Tooth Fairy Network."
                  : "Let your child take the lead here. They can photograph their tooth, draw on it, color it in — whatever they want. There's no rush."
                }
              </p>
            </div>

            {/* Photo upload area */}
            {!photo && (
              <button onClick={() => fileRef.current?.click()}
                className="w-full py-6 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all hover:border-opacity-50"
                style={{ borderColor: isParent ? PC.borderGold : C.borderGold, background: isParent ? PC.goldSoft : C.goldGlow }}>
                <svg className="w-8 h-8 mb-2" style={{ color: goldAccent }} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" /><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" /></svg>
                <p className="text-xs" style={{ color: mutedColor, fontFamily: ds.fonts.body }}>{isChild ? "Snap a photo of your tooth!" : "Tap to photograph the tooth"}</p>
              </button>
            )}
            {photo && (
              <div className="flex justify-center">
                <div className="relative">
                  <img src={photo} alt="Preview" className="w-20 h-20 rounded-2xl object-cover" style={{ border: `1px solid ${isParent ? PC.borderGold : C.borderGold}` }} />
                  <button onClick={() => setPhoto(null)} className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: isParent ? PC.errorContainer : C.errorContainer, color: isParent ? PC.error : C.error }}>x</button>
                </div>
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} className="hidden" />

            {/* Use photo as-is CTA */}
            {photo && (
              <button onClick={goToPreview}
                className="w-full py-4 font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
                style={{ background: ctaGradient, color: ctaTextColor, boxShadow: ctaShadow, borderRadius: ctaRadius, fontFamily: ds.fonts.headline, border: 'none', cursor: 'pointer' }}>
                Use this photo
              </button>
            )}

            {/* Drawing canvas (shared component) */}
            <DrawingCanvas ref={drawingCanvasRef} photo={photo} />

            {photo && (
              <p className="text-xs text-center" style={{ color: dimColor, fontFamily: ds.fonts.body }}>Or draw on the photo above, then continue</p>
            )}

            {/* Back button */}
            <div className="flex gap-2">
              <button onClick={() => setStep("setup")}
                className="px-4 py-2.5 rounded-xl text-xs transition-all"
                style={{ background: cardBg, backdropFilter: cardBlur, border: `1px solid ${cardBorder}`, color: mutedColor }}>
                Back
              </button>
            </div>

            {/* Note */}
            <div className="space-y-2">
              <label className="text-xs font-medium" style={{ color: isChild ? C.gold : PC.text, fontFamily: ds.fonts.body }}>
                {isChild ? "What do you want the fairies to know?" : `Add a note for ${childName}'s time capsule`}
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value.slice(0, 500))}
                placeholder={isChild ? "How did your tooth fall out? What should the fairies know about you? What's your favorite thing right now?" : `Write something ${childName} will read when they're older...`}
                maxLength={500}
                spellCheck={false}
                autoCorrect="off"
                className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all resize-none"
                style={{
                  background: isParent ? PC.surfaceContainerLow : C.bgAlt,
                  border: `1px solid ${isParent ? PC.border : C.borderGold}`,
                  color: textColor,
                  fontFamily: ds.fonts.body,
                  minHeight: "80px",
                }}
                rows={3}
              />
              <div className="flex justify-between">
                <p className="text-[10px] leading-relaxed max-w-[70%]" style={{ color: dimColor }}>
                  {isChild
                    ? "This gets saved with your creation — so make it good!"
                    : `This note is saved permanently alongside the artwork. One day, ${childName} will show this to their own children.`
                  }
                </p>
                <p className="text-[10px]" style={{ color: dimColor }}>{note.length}/500</p>
              </div>
            </div>

            {/* "Free" note removed — felt suspicious upstream of the reveal */}

            {/* Continue button */}
            <button onClick={goToPreview}
              className="w-full py-4 font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
              style={{ background: ctaGradient, color: ctaTextColor, boxShadow: ctaShadow, borderRadius: ctaRadius, fontFamily: ds.fonts.headline, border: 'none', cursor: 'pointer' }}>
              {isChild ? "I'm proud of this! →" : "Next →"}
            </button>
          </div>
        )}

        {/* ── STEP: Tell (between Create and Preview) ──
            The child's narrative about this tooth. Captured here so the
            mint payload carries it as `toothStory` and the keepsake page
            renders the "In their words" block. Skippable — empty string
            short-circuits the off-chain tfn_tooth_stories write. */}
        {step === "tell" && (
          <TellStep
            value={tellText}
            onChange={setTellText}
            onSkip={handleTellSkip}
            onContinue={handleTellContinue}
          />
        )}

        {/* ── STEP 3: Preview + Auth + Mint (NO wallet needed) ── */}
        {step === "preview" && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-bold tracking-tight" style={{ fontFamily: ds.fonts.headline, color: headlineColor }}>
                {isChild ? "Look what you made!" : "Ready to save"}
              </h2>
              <p className="text-sm mt-2 leading-relaxed" style={{ color: mutedColor, fontFamily: isChild ? ds.fonts.story : ds.fonts.body, fontStyle: isChild ? 'italic' : 'normal' }}>
                {isChild
                  ? "This is about to go somewhere really special."
                  : `${childName} made something worth keeping. Let's put it somewhere it can't be lost.`
                }
              </p>
            </div>

            {/* Preview card */}
            {previewImage && (
              <div className="rounded-2xl p-6 text-center" style={{ background: cardBg, backdropFilter: cardBlur, border: `1px solid ${isParent ? PC.border : C.borderGold}`, boxShadow: isParent ? '0 2px 8px rgba(0,0,0,0.06)' : glow.gold }}>
                <div className="rounded-2xl overflow-hidden mx-auto w-48 h-48 mb-4" style={{ border: `2px solid ${isParent ? PC.borderGold : C.borderGold}` }}>
                  <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                </div>
                <p className="text-sm font-bold" style={{ fontFamily: ds.fonts.headline, color: isParent ? PC.text : C.goldLight }}>{toothDisplayName}</p>
                {note && (
                  <p className="text-xs mt-2 italic leading-relaxed" style={{ color: mutedColor, fontFamily: ds.fonts.story }}>
                    &ldquo;{note}&rdquo;
                  </p>
                )}
                {isParent && (
                  <p className="text-[10px] mt-3 uppercase tracking-widest" style={{ color: dimColor, opacity: 0.4 }}>SOLANA MAINNET</p>
                )}
              </div>
            )}

            {/* Parent: transparency card */}
            {isParent && (
              <div className="rounded-2xl p-6" style={{ background: PC.surfaceContainerLow }}>
                {[
                  { num: "01", title: "Stored permanently", desc: "Distributed across decentralized nodes. The data can never disappear." },
                  { num: "02", title: "On the blockchain", desc: "A cryptographic hash locks this creation into the public ledger." },
                  { num: "03", title: `${childName} owns it`, desc: `Issued directly to ${childName}'s identity, managed by you. You control the wallet — they get a link to their page.` },
                ].map(({ num, title, desc }, i) => (
                  <div key={num} className="flex gap-4" style={{ paddingTop: i > 0 ? "1.25rem" : 0, marginTop: i > 0 ? "1.25rem" : 0, ...(i > 0 ? { borderTop: `1px solid ${PC.border}` } : {}) }}>
                    <span className="text-2xl font-bold leading-none" style={{ fontFamily: ds.fonts.headline, color: PC.teal }}>{num}</span>
                    <div>
                      <h3 className="font-bold mb-1 text-sm" style={{ fontFamily: ds.fonts.headline, color: PC.text }}>{title}</h3>
                      <p className="text-xs leading-relaxed" style={{ color: PC.muted }}>{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!useEmailMint ? (
              <>
                <div className="rounded-2xl p-6 text-center space-y-4" style={{ background: cardBg, backdropFilter: cardBlur, border: `1px solid ${cardBorder}` }}>
                  {authLoading ? (
                    /* Auth loading skeleton — fixes the flash */
                    <div className="space-y-3 animate-pulse">
                      <div className="h-4 w-32 mx-auto rounded" style={{ background: isParent ? PC.surfaceContainer : C.surfaceHighest }} />
                      <div className="h-3 w-48 mx-auto rounded" style={{ background: isParent ? PC.surfaceContainer : C.surfaceHighest }} />
                      <div className="h-10 w-40 mx-auto rounded-2xl" style={{ background: isParent ? PC.surfaceContainer : C.surfaceHighest }} />
                    </div>
                  ) : !isAuthenticated ? (
                    <>
                      <p className="text-sm font-bold" style={{ fontFamily: ds.fonts.headline, color: headlineColor }}>
                        {isChild ? "A grown-up needs to help with this part!" : "Sign in to continue"}
                      </p>
                      <p className="text-xs" style={{ color: mutedColor, fontFamily: ds.fonts.body }}>
                        {isChild
                          ? "To save your masterpiece, we need a parent to sign in."
                          : "Free. No wallet or crypto knowledge needed."
                        }
                      </p>
                      <button
                        onClick={handleGoogleSignIn}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-medium transition-all hover:opacity-90"
                        style={{ background: "white", color: "#1f2937", boxShadow: isParent ? '0 2px 8px rgba(0,0,0,0.1)' : glow.ambient, border: isParent ? `1px solid ${PC.border}` : 'none' }}
                      >
                        <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                        {isChild ? "Get a grown-up →" : "Continue with Google"}
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-center gap-2 text-xs" style={{ color: tealAccent }}>
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                        {isChild ? "A grown-up said yes!" : `Signed in as ${authEmail || ""}`}
                      </div>
                      <button
                        onClick={handleServerMint}
                        className="w-full py-4 font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
                        style={{ background: ctaGradient, color: ctaTextColor, boxShadow: ctaShadow, borderRadius: ctaRadius, fontFamily: ds.fonts.headline, border: 'none', cursor: 'pointer' }}
                      >
                        {isChild ? "Send it to the fairies! ✦" : `Save ${childName}'s creation`}
                      </button>
                      <p className="text-xs" style={{ color: dimColor, fontFamily: ds.fonts.body }}>
                        {isChild ? "Free. The fairies handle the rest." : "Free. No wallet or crypto knowledge needed."}
                      </p>
                    </>
                  )}
                </div>
              </>
            ) : emailMintDone ? (
              <div className="space-y-6">
                <div className="rounded-2xl p-6 text-center" style={{ background: glass.card, backdropFilter: `blur(${glass.blur})`, border: `1px solid ${C.borderGold}`, boxShadow: glow.gold }}>
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full" style={{ background: gradients.stardust, boxShadow: glow.goldStrong }} />
                  <h2 className="text-xl font-bold" style={{ fontFamily: ds.fonts.headline, color: C.textWarm }}>{childName}&apos;s Milestone Saved</h2>
                  <p className="text-xs mt-1" style={{ color: C.muted, fontFamily: ds.fonts.body }}>{childName} owns this forever &middot; Sent to {recipientEmail}</p>
                </div>

                {previewImage && (
                  <div className="flex justify-center">
                    <img src={previewImage} alt="Tooth art" className="w-40 h-40 rounded-2xl" style={{ border: `1px solid ${C.borderGold}`, boxShadow: glow.gold }} />
                  </div>
                )}

                <div className="rounded-2xl p-4 text-center space-y-2" style={{ background: C.tealGlow, border: `1px solid ${C.borderTeal}` }}>
                  <p className="text-sm font-medium" style={{ color: C.teal }}>Check your email for the NFT link</p>
                  <p className="text-xs" style={{ color: C.muted, fontFamily: ds.fonts.body }}>
                    You&apos;ll receive a link from Crossmint to view {childName}&apos;s page.
                  </p>
                </div>

                {escrowInfo && (
                  <>
                    <button onClick={() => {
                      const url = `${window.location.origin}/gift/${escrowInfo.milestonePda}`
                      navigator.clipboard.writeText(url).then(() => alert("Family link copied!")).catch(() => prompt("Copy:", url))
                    }} className="w-full px-4 py-3 rounded-2xl text-sm font-medium transition-all active:scale-95"
                      style={{ background: glass.card, backdropFilter: `blur(${glass.blur})`, border: `1px solid ${glass.cardBorder}`, color: C.muted }}>
                      Share with family — they can add to {childName}&apos;s savings
                    </button>
                    <p className="text-xs text-center" style={{ color: C.dim, fontFamily: ds.fonts.body }}>
                      Family members with a Solana wallet can deposit SOL to {childName}&apos;s locked savings
                    </p>
                  </>
                )}

                <div className="rounded-2xl p-4 text-center space-y-2" style={{ background: glass.card, backdropFilter: `blur(${glass.blur})`, border: `1px solid ${glass.cardBorder}` }}>
                  <p className="text-xs font-medium" style={{ color: C.gold }}>Want to add savings yourself?</p>
                  <p className="text-xs" style={{ color: C.muted, fontFamily: ds.fonts.body }}>
                    Connect a Solana wallet (like <a href="https://phantom.app/download" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: C.teal }}>Phantom</a>) to deposit SOL into {childName}&apos;s time-locked savings.
                  </p>
                </div>

                <button onClick={mintAnother} className="w-full px-4 py-3 rounded-2xl text-xs font-medium transition-all active:scale-95"
                  style={{ background: glass.card, backdropFilter: `blur(${glass.blur})`, border: `1px solid ${glass.cardBorder}`, color: C.muted }}>
                  Record Another Tooth
                </button>
              </div>
            ) : emailMinting ? (
              <div className="text-center py-16 space-y-4">
                <div className="relative mx-auto w-16 h-16">
                  <div className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ background: C.gold }} />
                  <div className="absolute inset-2 rounded-full animate-pulse" style={{ background: gradients.stardust, boxShadow: glow.goldStrong }} />
                </div>
                <h2 className="text-lg font-bold" style={{ fontFamily: ds.fonts.headline, color: C.textWarm }}>Saving {childName}&apos;s milestone...</h2>
                <p className="text-sm animate-pulse" style={{ color: C.muted, fontFamily: ds.fonts.body }}>{emailMintProgress || "Preparing..."}</p>
                <div className="flex justify-center gap-1.5">
                  {[0, 1, 2, 3, 4].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: C.teal, animationDelay: `${i * 0.15}s` }} />)}
                </div>
              </div>
            ) : (
              <div className="rounded-2xl p-6 space-y-5" style={{ background: glass.card, backdropFilter: `blur(${glass.blur})`, border: `1px solid ${glass.cardBorder}` }}>
                <div className="text-center">
                  <p className="text-sm font-bold" style={{ fontFamily: ds.fonts.headline, color: C.textWarm }}>Save with your email</p>
                  <p className="text-xs mt-1" style={{ color: C.muted, fontFamily: ds.fonts.body }}>
                    No wallet needed — we&apos;ll create {childName}&apos;s page and savings wallet. Free.
                  </p>
                </div>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="bg-transparent border-b py-2 px-1 text-lg transition-colors focus:ring-0 w-full outline-none"
                  style={{ borderColor: 'rgba(78, 70, 54, 0.3)', color: C.text, fontFamily: ds.fonts.body }}
                />
                <button
                  onClick={async () => {
                    if (!recipientEmail || !previewImage) return
                    setEmailMinting(true); setError(null)
                    const imageBase64 = previewImage.split(",")[1]

                    try {
                      // Step 1: Upload to Arweave + mint via Crossmint
                      setEmailMintProgress("Uploading artwork to Arweave...")
                      const mintRes = await fetch("/api/toothfairy/crossmint-mint", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          email: recipientEmail,
                          childName,
                          imageBase64,
                          imageMimeType: "image/png",
                          toothNumber: 1,
                        }),
                      })
                      const mintData = await mintRes.json()
                      if (!mintRes.ok) throw new Error(mintData.error)

                      // Step 2: Create escrow (server-side, server wallet signs)
                      setEmailMintProgress("Creating savings wallet...")
                      const escrowRes = await fetch("/api/toothfairy/email-escrow-setup", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          email: recipientEmail,
                          childName,
                          toothType: "upperRightCentralIncisor",
                          metadataUri: mintData.metadataUri || mintData.imageUrl || "https://toothfairy.network",
                        }),
                      })
                      const escrowData = await escrowRes.json()
                      if (!escrowRes.ok) throw new Error(escrowData.error)

                      setEscrowInfo(escrowData)
                      setEmailMintDone(true)
                    } catch (err: any) {
                      setError(err.message)
                    } finally { setEmailMinting(false) }
                  }}
                  disabled={!recipientEmail}
                  className="w-full py-4 font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-30"
                  style={{ background: gradients.stardust, color: C.onGold, boxShadow: '0 0 30px rgba(240,196,86,0.2), 0 10px 30px rgba(240,196,86,0.2)', borderRadius: '9999px', fontFamily: ds.fonts.headline }}
                >
                  Save Milestone
                </button>
                <button onClick={() => setUseEmailMint(false)} className="w-full text-xs text-center py-1 transition-colors hover:underline" style={{ color: C.dim }}>
                  Back to Google sign-in
                </button>
              </div>
            )}

            <button onClick={() => setStep("create")} className="w-full text-xs text-center py-1 transition-colors hover:underline" style={{ color: C.dim }}>
              Back to drawing
            </button>
          </div>
        )}

        {/* ── STEP 4: Deposit (card payment primary, wallet secondary) ── */}
        {step === "deposit" && (
          <div className="space-y-6">
            {/* Show the preview at top */}
            {previewImage && (
              <div className="flex justify-center">
                <div className="rounded-2xl overflow-hidden w-24 h-24" style={{ border: `1px solid ${C.borderGold}`, boxShadow: glow.gold }}>
                  <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                </div>
              </div>
            )}

            <div className="text-center">
              <h2 className="text-xl font-bold tracking-tight" style={{ fontFamily: ds.fonts.headline, color: headlineColor }}>
                Add savings to {childName}&apos;s creation
              </h2>
              <p className="text-sm mt-2 leading-relaxed" style={{ color: mutedColor, fontFamily: ds.fonts.body }}>
                {childName}&apos;s creation is saved and it&apos;s free. If you&apos;d like, you can also lock real savings into their wallet.
              </p>
            </div>

            {/* Context block — honest business model */}
            <div className="rounded-2xl p-5" style={{ background: isParent ? PC.surfaceContainerLow : C.surface, border: isParent ? 'none' : `1px solid ${C.border}` }}>
              <h3 className="text-sm font-bold mb-3" style={{ fontFamily: ds.fonts.headline, color: headlineColor }}>How the network works</h3>
              <p className="text-xs leading-relaxed mb-3" style={{ color: mutedColor }}>
                Creating {childName}&apos;s keepsake was free. Storing it on the blockchain is real infrastructure with real costs — and we think you should know exactly what those are.
              </p>
              <div className="space-y-2">
                {[
                  { label: "Creating & saving", value: "Free" },
                  { label: "Network maintenance", value: "~$1 / year" },
                  { label: "Deposit fee", value: "2%" },
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between text-xs" style={{ color: mutedColor }}>
                    <span>{label}</span>
                    <span className="font-bold" style={{ color: goldAccent }}>{value}</span>
                  </div>
                ))}
              </div>
              <p className="text-[10px] mt-3" style={{ color: dimColor }}>Everything is on-chain and verifiable. There are no hidden fees.</p>
            </div>

            {/* Lock period selector */}
            <div className="rounded-2xl p-6 space-y-4" style={{ background: glass.card, backdropFilter: `blur(${glass.blur})`, border: `1px solid ${glass.cardBorder}` }}>
              <label className="block text-[10px] uppercase tracking-widest mb-1" style={{ color: C.goldDim, fontFamily: ds.fonts.body }}>When can {childName} access it?</label>

              <div className="space-y-2">
                <button onClick={() => setLockChoice("now")}
                  className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm transition-all"
                  style={{ background: lockChoice === "now" ? C.tealGlow : 'transparent', border: `1.5px solid ${lockChoice === "now" ? C.teal : C.border}`, color: lockChoice === "now" ? C.teal : C.muted }}>
                  <span style={{ fontFamily: ds.fonts.body }}>Gift Now</span>
                  {lockChoice === "now" && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>}
                </button>
                <button onClick={() => setLockChoice("eighteen")}
                  className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm transition-all relative"
                  style={{ background: lockChoice === "eighteen" ? C.goldSoft : 'transparent', border: `1.5px solid ${lockChoice === "eighteen" ? C.gold : C.border}`, color: lockChoice === "eighteen" ? C.gold : C.muted }}>
                  <span style={{ fontFamily: ds.fonts.body }}>Until 18th Birthday</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: C.goldSoft, color: C.goldDim, fontFamily: ds.fonts.body }}>Recommended</span>
                    {lockChoice === "eighteen" && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>}
                  </div>
                </button>
                <button onClick={() => setLockChoice("custom")}
                  className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm transition-all"
                  style={{ background: lockChoice === "custom" ? C.goldSoft : 'transparent', border: `1.5px solid ${lockChoice === "custom" ? C.gold : C.border}`, color: lockChoice === "custom" ? C.gold : C.muted }}>
                  <span style={{ fontFamily: ds.fonts.body }}>Pick a Date</span>
                  {lockChoice === "custom" && <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>}
                </button>
              </div>

              {lockChoice === "eighteen" && eighteenthDate && (
                <p className="text-xs text-center" style={{ color: C.teal }}>Unlocks {eighteenthDate}</p>
              )}
              {lockChoice === "custom" && (
                <div>
                  <input type="date" value={customLockDate} onChange={e => setCustomLockDate(e.target.value)}
                    min={new Date(Date.now() + 86400000).toISOString().split("T")[0]}
                    className="bg-transparent border-0 border-b py-2 px-1 text-base transition-colors focus:ring-0 w-full outline-none"
                    style={{ borderColor: 'rgba(78, 70, 54, 0.3)', color: C.text, fontFamily: ds.fonts.body }} />
                  {customLockDate && (
                    <p className="mt-2 text-xs text-center" style={{ color: C.teal }}>
                      Unlocks {new Date(customLockDate + "T00:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Deposit amount — USD presets for card, SOL shown below */}
            <div className="rounded-2xl p-6 space-y-4" style={{ background: glass.card, backdropFilter: `blur(${glass.blur})`, border: `1px solid ${glass.cardBorder}` }}>
              <label className="block text-[10px] uppercase tracking-widest mb-1" style={{ color: C.goldDim, fontFamily: ds.fonts.body }}>How much to save?</label>
              <div className="grid grid-cols-4 gap-2 mb-3">
                {[
                  { usd: "$5", sol: "0.1" },
                  { usd: "$10", sol: "0.5" },
                  { usd: "$20", sol: "1" },
                  { usd: "$50", sol: "5" },
                ].map(({ usd, sol }) => (
                  <button key={sol} onClick={() => setDepositAmount(sol)}
                    className="px-2 py-3 rounded-xl text-sm font-medium transition-all flex flex-col items-center gap-0.5"
                    style={{ background: depositAmount === sol ? C.goldSoft : 'transparent', border: `1.5px solid ${depositAmount === sol ? C.gold : C.border}`, color: depositAmount === sol ? C.gold : C.muted }}>
                    <span style={{ fontFamily: ds.fonts.body }}>{usd}</span>
                    <span className="text-[10px] font-mono opacity-60">{sol} SOL</span>
                  </button>
                ))}
              </div>
            </div>

            {/* From name + message */}
            <div className="rounded-2xl p-6 space-y-4" style={{ background: cardBg, backdropFilter: cardBlur, border: `1px solid ${cardBorder}` }}>
              <div>
                <label className="block text-[10px] uppercase tracking-widest mb-2 font-bold" style={{ color: goldAccent, fontFamily: ds.fonts.headline }}>FROM (YOUR NAME)</label>
                <input type="text" value={depositorName} onChange={e => setDepositorName(e.target.value)} placeholder="e.g., Dad, Mom"
                  className="bg-transparent border-b py-2 px-1 text-lg transition-colors focus:ring-0 w-full outline-none"
                  style={{ borderColor: depositorName ? inputBorderActive : inputBorderDefault, color: textColor, fontFamily: ds.fonts.body }} />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest mb-2 font-bold" style={{ color: goldAccent, fontFamily: ds.fonts.headline }}>ADD A MESSAGE *(optional)*</label>
                <input type="text" value={depositMessage} onChange={e => setDepositMessage(e.target.value)} placeholder="With love from Dad"
                  className="bg-transparent border-b py-2 px-1 text-base transition-colors focus:ring-0 w-full outline-none"
                  style={{ borderColor: depositMessage ? inputBorderActive : inputBorderDefault, color: textColor, fontFamily: ds.fonts.body }} />
              </div>
            </div>

            {/* Awaiting card payment indicator */}
            {awaitingCardDeposit && (
              <div className="rounded-2xl p-4 text-center animate-pulse" style={{ background: C.goldSoft, border: `1px solid ${C.borderGold}` }}>
                <p className="text-sm font-medium" style={{ color: C.gold, fontFamily: ds.fonts.body }}>Complete payment in the Coinbase window...</p>
                <p className="text-xs mt-1" style={{ color: C.muted }}>Don&apos;t close this page</p>
              </div>
            )}

            {/* Primary CTA: Pay with Card */}
            <div className="space-y-3">
              <button
                onClick={handleCardPayment}
                disabled={cardPaymentLoading || awaitingCardDeposit || !depositorName.trim()}
                className="w-full py-4 font-bold flex items-center justify-center gap-3 active:scale-95 transition-transform disabled:opacity-30"
                style={{ background: gradients.stardust, color: C.onGold, boxShadow: '0 0 30px rgba(240,196,86,0.2), 0 10px 30px rgba(240,196,86,0.2)', borderRadius: '9999px', fontFamily: ds.fonts.headline }}>
                {cardPaymentLoading ? "Opening payment..." : awaitingCardDeposit ? "Waiting for payment..." : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" /></svg>
                    Pay with Card
                  </>
                )}
              </button>

              {/* Secondary: Wallet deposit (for crypto-native users) */}
              {publicKey ? (
                <button onClick={handleDeposit} disabled={!depositorName.trim() || !parseFloat(depositAmount)}
                  className="w-full py-3 rounded-2xl text-sm font-medium flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-30"
                  style={{ background: 'transparent', border: `1.5px solid ${C.border}`, color: C.muted }}>
                  Deposit {depositAmount} SOL from Wallet
                </button>
              ) : (
                <button onClick={() => setVisible(true)}
                  className="w-full py-3 rounded-2xl text-sm font-medium flex items-center justify-center gap-2 transition-all"
                  style={{ background: 'transparent', border: `1.5px solid ${C.border}`, color: C.dim }}>
                  I already have a Solana wallet
                </button>
              )}

              {/* Skip deposit — the mint is done, the keepsake exists; the
                  escrow just doesn't get extra SOL on top. User can deposit
                  later from the keepsake page. */}
              <button
                onClick={() => {
                  if (escrowInfo) redirectToKeepsake(escrowInfo.milestonePda)
                  else setStep("done")
                }}
                className="w-full px-3 py-2 rounded-xl text-xs transition-all hover:underline"
                style={{ color: dimColor }}
                aria-label="Skip deposit for now"
              >
                Skip deposit — add later from the keepsake page
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 5: Minting ── */}
        {step === "minting" && (
          <div className="text-center py-12 space-y-6">
            {/* Gold-to-teal shimmer progress bar */}
            <div className="h-1.5 w-full rounded-full overflow-hidden mb-8" style={{ background: C.surfaceHighest }}>
              <div className="h-full rounded-full animate-pulse" style={{ width: '75%', background: 'linear-gradient(90deg, #f0c456, #5adace)', boxShadow: '0 0 10px rgba(240,196,86,0.3)' }} />
            </div>

            {/* Center stage: pulsing rings + gold core (matches Stitch step 4) */}
            <div className="relative mx-auto flex items-center justify-center" style={{ width: '200px', height: '200px' }}>
              {/* Expansion rings — CSS animation via inline keyframes injected via style tag */}
              <div className="absolute rounded-full border-2" style={{ width: '80px', height: '80px', borderColor: 'rgba(240,196,86,0.25)', animation: 'tfnPulseRing 3s cubic-bezier(0.4,0,0.6,1) infinite' }} />
              <div className="absolute rounded-full border" style={{ width: '130px', height: '130px', borderColor: 'rgba(240,196,86,0.12)', animation: 'tfnPulseRing 3s cubic-bezier(0.4,0,0.6,1) infinite', animationDelay: '1s' }} />
              <div className="absolute rounded-full border" style={{ width: '180px', height: '180px', borderColor: 'rgba(240,196,86,0.06)', animation: 'tfnPulseRing 3s cubic-bezier(0.4,0,0.6,1) infinite', animationDelay: '2s' }} />
              {/* Golden core circle */}
              <div className="relative z-10 rounded-full flex items-center justify-center" style={{ width: '56px', height: '56px', background: gradients.stardust, boxShadow: '0 0 40px rgba(240,196,86,0.6)' }}>
                <svg className="w-7 h-7" style={{ color: C.onGold }} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>
              </div>
            </div>

            {/* Keyframe injection for pulsing rings */}
            <style>{`@keyframes tfnPulseRing { 0%, 100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 0.1; transform: scale(1.15); } }`}</style>

            <h2 className="text-lg font-bold" style={{ fontFamily: ds.fonts.headline, color: headlineColor }}>
              {isChild ? "The fairies are on it..." : `Saving ${childName}'s creation...`}
            </h2>
            <p className="text-sm animate-pulse" style={{ color: mutedColor, fontFamily: isChild ? ds.fonts.story : ds.fonts.body, fontStyle: isChild ? 'italic' : 'normal' }}>{mintProgress || (isChild ? "Hold tight!" : "This takes a few seconds.")}</p>

            {/* Glassmorphic checklist items (matches Stitch step 4 bento style) */}
            <div className="space-y-3 text-left max-w-[300px] mx-auto">
              {[
                { label: isChild ? "Found the perfect spot in the network" : "Artwork stored permanently", done: mintProgress !== "", active: mintProgress === "" },
                { label: isChild ? "The fairies are working..." : `Creating ${childName}'s profile`, done: mintProgress.includes("Almost"), active: mintProgress !== "" && !mintProgress.includes("Almost") },
                { label: isChild ? "Almost there!" : "Finalizing", done: false, active: mintProgress.includes("Almost") },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-xl text-sm transition-all"
                  style={{
                    background: item.done ? 'transparent' : item.active ? glass.card : C.bgAlt,
                    backdropFilter: item.active ? `blur(${glass.blur})` : 'none',
                    border: `1px solid ${item.done ? 'rgba(90,218,206,0.15)' : item.active ? 'rgba(240,196,86,0.15)' : 'transparent'}`,
                    color: item.done ? C.teal : item.active ? C.goldLight : C.dim,
                    fontFamily: ds.fonts.body,
                    opacity: item.done || item.active ? 1 : 0.4,
                  }}>
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: item.done ? 'rgba(90,218,206,0.15)' : item.active ? 'rgba(240,196,86,0.12)' : 'rgba(154,144,124,0.15)' }}>
                    {item.done ? (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                    ) : item.active ? (
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" /></svg>
                    ) : (
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><circle cx="12" cy="12" r="9" /></svg>
                    )}
                  </div>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 6: Done — Wallet Created ── */}
        {step === "done" && (
          <div className="space-y-6">
            {/* Success card — large gold glow circle with sparkles (matches Stitch step 5) */}
            <div className="rounded-2xl p-6 text-center" style={{ background: glass.card, backdropFilter: `blur(${glass.blur})`, border: `1px solid ${C.borderGold}`, boxShadow: glow.gold }}>
              {/* Glow + checkmark cluster */}
              <div className="relative inline-block mb-4">
                {/* Ambient glow behind the circle */}
                <div className="absolute inset-0 rounded-full blur-2xl opacity-30" style={{ background: C.gold, transform: 'scale(1.4)' }} />
                {/* Main circle */}
                <div className="relative w-24 h-24 mx-auto rounded-full flex items-center justify-center border-4 border-white/20"
                  style={{ background: gradients.stardust, boxShadow: '0 0 50px rgba(240,196,86,0.6)' }}>
                  <svg className="w-12 h-12" style={{ color: C.onGold }} fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                </div>
                {/* Sparkle decorations */}
                <div className="absolute -top-3 -right-3" style={{ color: C.teal, fontSize: '20px' }}>✦</div>
                <div className="absolute -bottom-2 -left-4" style={{ color: C.goldLight, fontSize: '14px' }}>★</div>
              </div>
              <h2 className="text-2xl font-bold" style={{ fontFamily: ds.fonts.headline, color: headlineColor }}>
                {isChild ? "Your first digital asset." : `${childName}'s creation is live`}
              </h2>
              <p className="text-sm mt-1 leading-relaxed" style={{ color: mutedColor, fontFamily: isChild ? ds.fonts.story : ds.fonts.body, fontStyle: isChild ? 'italic' : 'normal' }}>
                {isChild
                  ? "You made it, you own it, and nobody can take it away. Not even us. It's on the Tooth Fairy Network forever."
                  : `Permanently stored on the Tooth Fairy Network. When ${childName} is your age, this will still be here.`
                }
              </p>
            </div>

            {previewImage && (
              <div className="flex justify-center">
                <img src={previewImage} alt="Tooth art" className="w-40 h-40 rounded-2xl" style={{ border: `2px solid ${C.borderGold}`, boxShadow: glow.goldStrong }} />
              </div>
            )}

            {depositSuccess && (
              <div className="rounded-2xl p-4 text-center" style={{ background: C.tealGlow, border: `1px solid ${C.borderTeal}` }}>
                <p className="text-sm font-medium" style={{ color: C.teal }}>{depositSuccess}</p>
                {lockChoice === "eighteen" && eighteenthDate && <p className="text-xs mt-1" style={{ color: C.muted }}>Locked until {eighteenthDate}</p>}
                <p className="text-xs mt-1" style={{ color: C.muted }}>{feeInfo.net.toFixed(4)} SOL in wallet (2% fee: {feeInfo.fee.toFixed(4)} SOL)</p>
              </div>
            )}

            {!depositSuccess && (
              <p className="text-[10px] text-center uppercase tracking-widest font-bold" style={{ color: isParent ? PC.teal : C.teal, opacity: 0.5 }}>
                {isChild ? "On the Tooth Fairy Network" : `${childName}'s creation is saved`}
              </p>
            )}

            {escrowInfo && (
              <button onClick={() => {
                const url = `${window.location.origin}/gift/${escrowInfo.milestonePda}`
                const shareText = isChild
                  ? `Check out what I made on the Tooth Fairy Network! 🦷✨`
                  : `${childName} made their first digital asset on the Tooth Fairy Network! See it and add to their savings:`
                if (navigator.share) {
                  navigator.share({ title: `${childName}'s Tooth Fairy Network`, text: shareText, url }).catch(() => {})
                } else {
                  navigator.clipboard.writeText(`${shareText}\n${url}`).then(() => alert("Link copied!")).catch(() => prompt("Copy this link:", url))
                }
              }} className="w-full px-4 py-3 rounded-2xl text-sm font-medium transition-all active:scale-95 flex items-center justify-center gap-2"
                style={{ background: ctaGradient, color: ctaTextColor, boxShadow: ctaShadow, borderRadius: ctaRadius, fontFamily: ds.fonts.headline, border: 'none', cursor: 'pointer' }}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" /></svg>
                {isChild ? "Share with grandma, grandpa, or anyone!" : "Share with family →"}
              </button>
            )}

            <div className="space-y-3">
              <Link href="/dashboard"
                className="w-full py-4 font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
                style={{ background: cardBg, backdropFilter: cardBlur, border: `1px solid ${cardBorder}`, color: headlineColor, borderRadius: ctaRadius, fontFamily: ds.fonts.headline }}>
                {isChild ? "See your collection" : `View ${childName}'s page`}
              </Link>
            </div>

            {isParent && mintSignature && (
              <p className="text-xs text-center" style={{ color: dimColor, fontFamily: ds.fonts.body }}>
                <a href={`https://solscan.io/tx/${mintSignature}`} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: tealAccent }}>View on blockchain →</a>
              </p>
            )}

            {/* Celebration sparkles row */}
            <div className="flex justify-center gap-6 pt-2 opacity-50">
              <span style={{ color: C.goldLight, fontSize: '24px' }}>✦</span>
              <span style={{ color: C.teal, fontSize: '20px' }}>★</span>
              <span style={{ color: C.goldLight, fontSize: '18px' }}>✦</span>
              <span style={{ color: C.teal, fontSize: '24px' }}>✧</span>
              <span style={{ color: C.goldLight, fontSize: '16px' }}>★</span>
            </div>
          </div>
        )}

        {/* Spacer for bottom nav */}
        <div className="h-24" />
      </div>

      {/* ── Fixed Bottom Nav ── */}
      <nav className="sticky bottom-0 w-full z-50 flex justify-around items-center px-4 pb-6 pt-3 rounded-t-[2rem]"
        style={{ background: 'rgba(47, 51, 75, 0.6)', backdropFilter: 'blur(24px)', borderTop: `1px solid ${glass.cardBorder}`, boxShadow: '0 -20px 40px rgba(0,0,0,0.4)' }}>
        <div className="flex flex-col items-center gap-0.5">
          <svg className="w-5 h-5" style={{ color: C.gold }} fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>
          <span className="text-[9px]" style={{ color: C.gold, fontFamily: ds.fonts.body }}>Home</span>
        </div>
        <Link href="/dashboard" className="flex flex-col items-center gap-0.5">
          <svg className="w-5 h-5" style={{ color: C.dim }} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M6 6.878V6a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0118 6v.878m-12 0c.235-.083.487-.128.75-.128h10.5c.263 0 .515.045.75.128m-12 0A2.25 2.25 0 004.5 9v.878m13.5-3A2.25 2.25 0 0119.5 9v.878m-15 0A2.246 2.246 0 003 11.25V15a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 15v-3.75c0-.708-.327-1.34-.838-1.752m-15.324 0h15.324" /></svg>
          <span className="text-[9px]" style={{ color: C.dim, fontFamily: ds.fonts.body }}>Gallery</span>
        </Link>
        <div className="flex flex-col items-center gap-0.5">
          <svg className="w-5 h-5" style={{ color: C.dim }} fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          <span className="text-[9px]" style={{ color: C.dim, fontFamily: ds.fonts.body }}>Settings</span>
        </div>
      </nav>
    </div>
  )
}
