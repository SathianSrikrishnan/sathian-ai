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
  calculateUnlockBirthday,
  type DepositData,
} from "@/lib/toothfairy/escrow"
import { PublicKey } from "@solana/web3.js"
import { WalletButton } from "@/components/toothfairy/app/wallet-button"
import Link from "next/link"
import { createBrowserSupabase } from "@/lib/supabase-auth"
import DrawingCanvas, { type DrawingCanvasRef } from "@/components/toothfairy/app/drawing-canvas"
import TellStep from "@/components/toothfairy/app/tell-step"
import { useRouter } from "next/navigation"

// Parent-facing ritual flow.
// Every step should feel like preserving a keepsake first and touching crypto second.
//
// Flow (single path):
//   setup → create → tell → preview → deposit → minting → done
// The deposit step is always skippable — mint creates the keepsake whether
// or not SOL is added.

type Step = "setup" | "create" | "tell" | "preview" | "deposit" | "minting" | "done"
type LockChoice = "now" | "ageTen" | "custom"

// Flow-level localStorage keys — cleared on successful mint.
const TELL_TEXT_KEY = "tfn-tell-text"
const STORY_CONTEXT_KEY = "tfn-story-context"
const LATEST_DRAWING_KEY = "toothfairy-latest-drawing"
const LATEST_ENHANCED_KEY = "toothfairy-latest-enhanced"
const LATEST_TRADITION_KEY = "toothfairy-latest-tradition"

const SPRING = "cubic-bezier(0.16, 1, 0.3, 1)"
const FIAT_ONRAMP_ENABLED = process.env.NEXT_PUBLIC_TFN_ENABLE_FIAT_ONRAMP === "true"
const HAS_SUPABASE_CONFIG = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => { setIsMobile(/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) }, [])
  return isMobile
}

// Shrink + re-encode a data URL so the mint POST stays under Vercel's
// 4.5MB body limit. Pass-through for http(s) URLs. Output is JPEG.
async function compressImageDataUrl(
  dataUrl: string,
  maxDim = 1280,
  quality = 0.85,
): Promise<string> {
  if (!dataUrl.startsWith("data:")) return dataUrl
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const scale = Math.min(1, maxDim / Math.max(img.width, img.height))
      const w = Math.round(img.width * scale)
      const h = Math.round(img.height * scale)
      const canvas = document.createElement("canvas")
      canvas.width = w
      canvas.height = h
      const ctx = canvas.getContext("2d")
      if (!ctx) return reject(new Error("Canvas unavailable"))
      ctx.drawImage(img, 0, 0, w, h)
      resolve(canvas.toDataURL("image/jpeg", quality))
    }
    img.onerror = () => reject(new Error("Image decode failed"))
    img.src = dataUrl
  })
}

/* ─── Shared layout primitives (Impeccable) ─────────────────────────── */

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p
      className="text-[11px] uppercase font-medium"
      style={{
        color: "var(--tfn-gold)",
        letterSpacing: "0.28em",
        fontFamily: "var(--font-body), 'Alegreya Sans', system-ui, sans-serif",
      }}
    >
      {children}
    </p>
  )
}

function StepTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="text-center max-w-[48ch] mx-auto">
      <h2
        className="leading-[1.1] tracking-tight"
        style={{
          fontFamily: "var(--font-display), 'Alegreya', Georgia, serif",
          color: "var(--tfn-ink)",
          fontSize: "clamp(1.85rem, 4vw, 2.6rem)",
          fontWeight: 500,
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className="mt-4 italic leading-[1.55]"
          style={{
            fontFamily: "var(--font-display), 'Alegreya', Georgia, serif",
            color: "var(--tfn-ink-soft)",
            fontSize: "clamp(1rem, 1.8vw, 1.15rem)",
          }}
        >
          {subtitle}
        </p>
      )}
      <div
        className="mx-auto mt-6 h-[2px] w-12 rounded-full"
        style={{ background: "var(--tfn-gold)" }}
        aria-hidden
      />
    </div>
  )
}

function PaperCard({
  children,
  className = "",
  padded = true,
}: {
  children: React.ReactNode
  className?: string
  padded?: boolean
}) {
  return (
    <div
      className={`rounded-lg ${padded ? "p-6 md:p-8" : ""} ${className}`}
      style={{
        background: "var(--tfn-surface-alt)",
        border: "1px solid var(--tfn-border)",
        boxShadow: "0 2px 12px oklch(30% 0.035 65 / 0.06), 0 1px 3px oklch(30% 0.035 65 / 0.04)",
      }}
    >
      {children}
    </div>
  )
}

function ProductPromiseCard() {
  const items = [
    {
      title: "Create the keepsake",
      body: "Save the photo, drawing, and little story while the moment is still fresh.",
    },
    {
      title: "Share with family",
      body: "Send one simple link so grandparents and loved ones can add a gift or note.",
    },
    {
      title: "Start the Smile Fund",
      body: "A parent-controlled account helps the child see how small things can grow by age 10.",
    },
  ]

  return (
    <PaperCard className="grid gap-3 md:grid-cols-3" padded={false}>
      {items.map((item, index) => (
        <div
          key={item.title}
          className="p-4 md:p-5"
          style={{
            borderLeft: index > 0 ? "1px solid var(--tfn-border)" : "none",
          }}
        >
          <p
            className="mb-2 text-[10px] font-bold uppercase"
            style={{
              color: "var(--tfn-gold)",
              letterSpacing: "0.14em",
              fontFamily: "var(--font-body), 'Alegreya Sans', system-ui, sans-serif",
            }}
          >
            0{index + 1}
          </p>
          <h3
            className="text-lg leading-tight"
            style={{
              color: "var(--tfn-ink)",
              fontFamily: "var(--font-display), 'Alegreya', Georgia, serif",
              fontWeight: 700,
            }}
          >
            {item.title}
          </h3>
          <p
            className="mt-2 text-sm leading-relaxed"
            style={{ color: "var(--tfn-ink-soft)" }}
          >
            {item.body}
          </p>
        </div>
      ))}
    </PaperCard>
  )
}

function InputRow({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label
        className="block text-[10px] uppercase mb-3 font-semibold"
        style={{
          color: "var(--tfn-ink-muted)",
          letterSpacing: "0.22em",
          fontFamily: "var(--font-body), 'Alegreya Sans', system-ui, sans-serif",
        }}
      >
        {label}
      </label>
      {children}
    </div>
  )
}

function UnderlineInput(
  props: React.InputHTMLAttributes<HTMLInputElement> & { filled?: boolean }
) {
  const { filled, style, ...rest } = props
  return (
    <input
      {...rest}
      className={`bg-transparent border-b py-2.5 px-0 text-lg w-full outline-none transition-colors ${rest.className ?? ""}`}
      style={{
        borderColor: filled ? "var(--tfn-gold)" : "var(--tfn-border)",
        color: "var(--tfn-ink)",
        fontFamily: "var(--font-body), 'Alegreya Sans', system-ui, sans-serif",
        ...style,
      }}
    />
  )
}

function GoldCTA({
  onClick,
  disabled,
  children,
  ariaLabel,
  type = "button",
}: {
  onClick?: () => void
  disabled?: boolean
  children: React.ReactNode
  ariaLabel?: string
  type?: "button" | "submit"
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className="w-full rounded-full py-4 text-base font-semibold inline-flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-30 disabled:cursor-not-allowed"
      style={{
        background: "var(--tfn-gold)",
        color: "oklch(98% 0.005 80)",
        boxShadow: "0 8px 24px oklch(72% 0.145 75 / 0.28)",
        fontFamily: "var(--font-body), 'Alegreya Sans', system-ui, sans-serif",
        transition: `background 0.2s ${SPRING}, transform 0.15s ${SPRING}`,
      }}
      onMouseEnter={(e) => {
        if (!disabled) e.currentTarget.style.background = "var(--tfn-gold-hover)"
      }}
      onMouseLeave={(e) => {
        if (!disabled) e.currentTarget.style.background = "var(--tfn-gold)"
      }}
    >
      {children}
    </button>
  )
}

function GhostButton({
  onClick,
  children,
  disabled,
}: {
  onClick?: () => void
  children: React.ReactNode
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-full rounded-full py-3 text-sm font-medium transition-opacity hover:opacity-80 disabled:opacity-40"
      style={{
        background: "transparent",
        border: "1px solid var(--tfn-border)",
        color: "var(--tfn-ink-soft)",
        fontFamily: "var(--font-body), 'Alegreya Sans', system-ui, sans-serif",
      }}
    >
      {children}
    </button>
  )
}

/* ─── Page ───────────────────────────────────────────────────────────── */

export default function ToothFairyApp() {
  const { publicKey, signTransaction, signAllTransactions } = useWallet()
  const { connection } = useConnection()
  const { setVisible } = useWalletModal()
  const isMobile = useIsMobile()
  const router = useRouter()

  // Flow state
  const [step, setStep] = useState<Step>("setup")
  const [tellText, setTellText] = useState<string>("")
  const [childName, setChildName] = useState("")
  const [childDob, setChildDob] = useState("")
  const [photo, setPhoto] = useState<string | null>(null)
  const [note, setNote] = useState("")
  const [showNote, setShowNote] = useState(false)
  const [toothName, setToothName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [mintProgress, setMintProgress] = useState("")
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  // Deposit state
  const [lockChoice, setLockChoice] = useState<LockChoice>("ageTen")
  const [customLockDate, setCustomLockDate] = useState("")
  const [depositAmount, setDepositAmount] = useState("0.1")
  const [childPhoto, setChildPhoto] = useState<string | null>(null)
  const childPhotoRef = useRef<HTMLInputElement>(null)
  const [depositorName, setDepositorName] = useState("")
  const [depositMessage, setDepositMessage] = useState("")

  // Auth state
  const isTestMode = process.env.NEXT_PUBLIC_TEST_MODE === "true"
  const [isAuthenticated, setIsAuthenticated] = useState(isTestMode)
  const [authLoading, setAuthLoading] = useState(!isTestMode && HAS_SUPABASE_CONFIG)
  const [authEmail, setAuthEmail] = useState<string | null>(
    isTestMode ? "test@example.com" : null
  )
  const supabase = useMemo(
    () => (HAS_SUPABASE_CONFIG ? createBrowserSupabase() : null),
    []
  )

  useEffect(() => {
    if (isTestMode) return
    if (!supabase) {
      setAuthLoading(false)
      setIsAuthenticated(false)
      return
    }
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
  }, [supabase, isTestMode])

  useEffect(() => {
    if (typeof window === "undefined") return
    const params = new URLSearchParams(window.location.search)
    if (params.get("returning") === "auth") {
      const url = new URL(window.location.href)
      url.searchParams.delete("returning")
      window.history.replaceState({}, "", url.toString())
    }
  }, [])

  // Email mint state
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

  // Card payment state (gated until the MoonPay/card on-ramp is ready)
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
  const suggestedUnlockBirthday = useMemo(() => {
    if (!childDob) return null
    return calculateUnlockBirthday(new Date(childDob + "T00:00:00"), 10)
  }, [childDob])

  const suggestedUnlockDate = useMemo(() => {
    if (!suggestedUnlockBirthday) return ""
    return new Date(suggestedUnlockBirthday * 1000).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
  }, [suggestedUnlockBirthday])

  const feeInfo = useMemo(() => calculateFee(parseFloat(depositAmount) || 0), [depositAmount])

  // ── Persist/restore flow state for mobile Phantom deep link ──
  const FLOW_STORAGE_KEY = "tfn-flow-state"

  useEffect(() => {
    try {
      const saved = localStorage.getItem(FLOW_STORAGE_KEY)
      if (!saved) return
      const state = JSON.parse(saved)
      if (state.childName) setChildName(state.childName)
      if (state.childDob) setChildDob(state.childDob)
      if (state.childPhoto) setChildPhoto(state.childPhoto)
      if (state.previewImage) {
        setPreviewImage(state.previewImage)
      } else {
        const enhanced = localStorage.getItem(LATEST_ENHANCED_KEY)
        const drawing = localStorage.getItem(LATEST_DRAWING_KEY)
        if (enhanced) setPreviewImage(enhanced)
        else if (drawing) setPreviewImage(drawing)
      }
      if (state.photo) setPhoto(state.photo)
      if (state.step === "preview" || state.step === "deposit") setStep("preview")
    } catch { /* ignore corrupt localStorage */ }
  }, [])

  const saveFlowState = useCallback(() => {
    try {
      localStorage.setItem(FLOW_STORAGE_KEY, JSON.stringify({
        childName, childDob, childPhoto, step: "preview",
      }))
    } catch { /* localStorage full or unavailable */ }
  }, [childName, childDob, childPhoto])

  const clearFlowState = useCallback(() => {
    try { localStorage.removeItem(FLOW_STORAGE_KEY) } catch {}
  }, [])

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

  const redirectToKeepsake = useCallback((milestonePda: string) => {
    clearAllFlowKeys()
    router.replace(`/toothfairy/keepsake/${milestonePda}`)
  }, [clearAllFlowKeys, router])

  const handleGoogleSignIn = useCallback(() => {
    if (!HAS_SUPABASE_CONFIG) {
      setError("Parent sign-in is not connected on this domain yet. Check the Supabase and Google OAuth settings, then try again.")
      return
    }
    saveFlowState()
    const hostname = typeof window !== "undefined" ? window.location.hostname : "toothfairy.network"
    const isTfnDomain = hostname === "toothfairy.network" || hostname === "www.toothfairy.network"
    const nextPath = isTfnDomain ? "/app" : "/toothfairy/app"
    window.location.href = `/api/auth/google?next=${encodeURIComponent(nextPath)}`
  }, [saveFlowState])

  // ── Photo handlers ──
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

  const goToPreview = () => {
    const dataUrl = drawingCanvasRef.current?.toDataURL()
    if (dataUrl) {
      setPreviewImage(dataUrl)
      try { localStorage.setItem(LATEST_DRAWING_KEY, dataUrl) } catch {}
    }
    setStep("tell")
  }

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

  useEffect(() => {
    if (step === "preview" && publicKey && mintSignature) {
      setStep("deposit")
    }
  }, [publicKey, step, mintSignature])

  // ── Server-Side Mint ──
  const handleServerMint = async () => {
    if (!isTestMode) {
      if (!supabase) {
        setError("Minting is not connected on this domain yet. Run the health check and confirm the production environment variables before testing.")
        return
      }
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) {
        setError("Your session expired. Please sign in again to continue.")
        setIsAuthenticated(false)
        return
      }
    }

    setError(null); setStep("minting")

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
      setMintProgress("Preparing images...")
      const compressedPreview = previewImage
        ? await compressImageDataUrl(previewImage, 1280, 0.85)
        : null
      const compressedPhoto = childPhoto
        ? await compressImageDataUrl(childPhoto, 1024, 0.85)
        : null
      const imageBase64 = compressedPreview
        ? compressedPreview.split(",")[1]
        : undefined
      const smilePhotoBase64 = compressedPhoto
        ? compressedPhoto.split(",")[1]
        : undefined

      setMintProgress("Saving artwork permanently...")
      const mintRes = await fetch("/api/toothfairy/mint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          childName,
          toothType: "UpperRightCentralIncisor",
          toothNumber: 1,
          imageBase64,
          imageMimeType: "image/jpeg",
          note: note || undefined,
          birthday: childDob || undefined,
          smilePhotoBase64,
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

      const nameKey = childName.toLowerCase().trim()
      if (childDob) localStorage.setItem(`tfn-child-dob-${nameKey}`, childDob)
      if (mintData.imageUri) localStorage.setItem(`tfn-child-art-${nameKey}`, mintData.imageUri)

      clearFlowState()

      await new Promise(r => setTimeout(r, 500))

      setStep("deposit")
    } catch (err: any) {
      console.error("Mint error:", err)
      setError(err.message || "Something went wrong. Please try again.")
      setStep("preview")
    }
  }

  // ── Deposit (REQUIRES wallet) ──
  const handleDeposit = async () => {
    if (!publicKey || !signTransaction || !anchorProvider || !escrowInfo) return
    setError(null)

    try {
      setMintProgress("Depositing SOL...")
      setStep("minting")
      const program = getEscrowProgram(anchorProvider)
      const lockPeriod = lockChoice === "now" ? "immediate" as const : "untilTimestamp" as const
      let lockTimestamp: number | undefined
      if (lockChoice === "ageTen" && suggestedUnlockBirthday) lockTimestamp = suggestedUnlockBirthday
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
      if (escrowInfo) redirectToKeepsake(escrowInfo.milestonePda)
      else setStep("done")
    }
  }

  // ── Card Payment (fiat onramp) ──
  const handleCardPayment = async () => {
    if (!escrowInfo) return
    if (!FIAT_ONRAMP_ENABLED) {
      setError("MoonPay card gifts are being connected next. For this test, open the keepsake or use a Solana wallet gift.")
      return
    }
    setError(null); setCardPaymentLoading(true)

    try {
      const usdPresets: Record<string, number> = { "0.05": 5, "0.1": 10, "0.25": 25, "0.5": 50 }
      const amountUsd = usdPresets[depositAmount] || Math.max(5, Math.round(parseFloat(depositAmount) * 150))

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

      const popup = window.open(onrampUrl, "tfn-onramp", "width=460,height=700,left=200,top=100")
      setOnrampWindow(popup)
      setAwaitingCardDeposit(true)
      setCardPaymentLoading(false)

      const handleMessage = async (event: MessageEvent) => {
        if (event.origin !== "https://pay.coinbase.com") return
        const { eventName } = event.data || {}

        if (eventName === "onramp_api.polling_success" || eventName === "onramp_api.commit_success") {
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

            await depositRes.json()
            setDepositSuccess(`$${amountUsd} deposited for ${childName}!`)
            if (escrowInfo) redirectToKeepsake(escrowInfo.milestonePda)
            else setStep("done")
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

      const pollClosed = setInterval(() => {
        if (popup?.closed) {
          clearInterval(pollClosed)
          if (awaitingCardDeposit) setAwaitingCardDeposit(false)
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
  const toothDisplayName = toothName ? `"${toothName}"` : `${childName}'s Tooth`
  const stageItems = ["Name", "Memory", "Share"]
  const activeStage = (() => {
    if (step === "setup") return 0
    if (step === "deposit" || step === "done") return 2
    return 1
  })()

  return (
    <div
      className="min-h-screen relative"
      style={{
        background: "var(--tfn-surface)",
        color: "var(--tfn-ink)",
      }}
    >
      {/* ── Sticky wallet + progress bar ── */}
      <div
        className="sticky top-0 z-40 w-full backdrop-blur-md"
        style={{
          background: "color-mix(in oklch, var(--tfn-surface) 82%, transparent)",
          borderBottom: "1px solid var(--tfn-border)",
        }}
      >
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4 px-6 py-3">
          {/* Left: three parent-readable stages */}
          {step !== "minting" && step !== "done" ? (
            <div className="flex items-center gap-2">
              {stageItems.map((label, i) => {
                const active = i === activeStage
                const done = i < activeStage
                return (
                  <span
                    key={label}
                    className="rounded-full px-3 py-1 text-[11px] font-semibold"
                    style={{
                      background: active
                        ? "var(--tfn-gold-soft)"
                        : done
                          ? "color-mix(in oklch, var(--tfn-gold) 16%, transparent)"
                          : "transparent",
                      border: `1px solid ${active || done ? "var(--tfn-gold)" : "var(--tfn-border)"}`,
                      color: active || done ? "var(--tfn-gold-hover)" : "var(--tfn-ink-muted)",
                      fontFamily: "var(--font-body), 'Alegreya Sans', system-ui, sans-serif",
                      transition: `background 0.35s ${SPRING}, color 0.35s ${SPRING}, border-color 0.35s ${SPRING}`,
                    }}
                  >
                    {label}
                  </span>
                )
              })}
            </div>
          ) : (
            <span />
          )}

          {/* Right: Wallet */}
          <div className="flex items-center gap-3">
            {publicKey && (
              <Link
                href="/toothfairy/app/dashboard"
                className="text-sm transition-opacity hover:opacity-80 hidden sm:inline"
                style={{
                  color: "var(--tfn-ink-soft)",
                  fontFamily: "var(--font-body), 'Alegreya Sans', system-ui, sans-serif",
                }}
              >
                Wallet
              </Link>
            )}
            <WalletButton />
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <main className="max-w-2xl mx-auto px-6 pb-24 pt-10 md:pt-16">

        {/* Error banner */}
        {error && (
          <div
            className="mb-8 rounded-lg px-5 py-4 text-sm flex items-start justify-between gap-4"
            style={{
              background: "oklch(95% 0.025 30 / 0.6)",
              border: "1px solid oklch(82% 0.08 30 / 0.4)",
              color: "oklch(42% 0.1 30)",
              fontFamily: "var(--font-body), 'Alegreya Sans', system-ui, sans-serif",
            }}
          >
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="underline text-xs opacity-70 shrink-0"
            >
              dismiss
            </button>
          </div>
        )}

        {/* ── STEP 1: Setup ── */}
        {step === "setup" && (
          <div className="space-y-12">
            <div className="space-y-5">
              <div className="text-center">
                <Eyebrow>Begin</Eyebrow>
              </div>
              <StepTitle
                title="Save their tooth story."
                subtitle="One tiny ritual creates a keepsake your family can revisit, share, and grow into a first lesson in ownership."
              />
            </div>

            <ProductPromiseCard />

            {/* Child photo */}
            <div className="flex flex-col items-center gap-3">
              <input ref={childPhotoRef} type="file" accept="image/*" onChange={handleChildPhoto} className="hidden" />
              {childPhoto ? (
                <div className="relative">
                  <div
                    className="w-28 h-28 rounded-full overflow-hidden"
                    style={{
                      border: "2px solid var(--tfn-gold)",
                      boxShadow: "0 4px 18px oklch(72% 0.145 75 / 0.25)",
                    }}
                  >
                    <img src={childPhoto} alt="Child" className="w-full h-full object-cover" />
                  </div>
                  <button
                    type="button"
                    onClick={() => setChildPhoto(null)}
                    aria-label="Remove photo"
                    className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: "var(--tfn-surface-alt)", border: "1px solid var(--tfn-border)", color: "var(--tfn-ink-soft)" }}
                  >
                    ×
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => childPhotoRef.current?.click()}
                  className="w-28 h-28 rounded-full flex flex-col items-center justify-center transition-all hover:scale-[1.02]"
                  style={{
                    border: "1.5px dashed var(--tfn-border)",
                    background: "var(--tfn-accent-soft)",
                    color: "var(--tfn-ink-muted)",
                    fontFamily: "var(--font-body), 'Alegreya Sans', system-ui, sans-serif",
                  }}
                >
                  <svg className="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" strokeWidth={1.4} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                  </svg>
                  <span className="text-[10px] uppercase" style={{ letterSpacing: "0.2em" }}>Add photo</span>
                </button>
              )}
              <p className="text-xs italic" style={{ color: "var(--tfn-ink-muted)", fontFamily: "var(--font-display), 'Alegreya', serif" }}>
                Their smiling face — appears on the keepsake
              </p>
            </div>

            {/* Details card */}
            <PaperCard className="space-y-7">
              <InputRow label="Child's name">
                <UnderlineInput
                  type="text"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  placeholder="e.g. Luna"
                  filled={!!childName}
                />
              </InputRow>

              <InputRow label="Birthday">
                <UnderlineInput
                  type="date"
                  value={childDob}
                  onChange={(e) => setChildDob(e.target.value)}
                  filled={!!childDob}
                />
                {childDob && suggestedUnlockDate && (
                  <p
                    className="mt-3 text-sm italic"
                    style={{ color: "var(--tfn-gold)", fontFamily: "var(--font-display), 'Alegreya', serif" }}
                  >
                    Age-10 default: {suggestedUnlockDate}.
                  </p>
                )}
              </InputRow>

              <InputRow label="Tooth nickname (optional)">
                <UnderlineInput
                  type="text"
                  value={toothName}
                  onChange={(e) => setToothName(e.target.value)}
                  placeholder="e.g. Sparkle, Chomper, Sir Wobbly"
                  filled={!!toothName}
                />
              </InputRow>
            </PaperCard>

            <GoldCTA
              onClick={() => setStep("create")}
              disabled={!childName.trim() || !childDob}
            >
              Continue to the memory
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </GoldCTA>
          </div>
        )}

        {/* ── STEP 2: Create ── */}
        {step === "create" && (
          <div className="space-y-10">
            <div className="space-y-5">
              <div className="text-center">
                <Eyebrow>The portrait</Eyebrow>
              </div>
              <StepTitle
                title="Make the keepsake."
                subtitle="Use the tooth photo, a drawing, and a few words if they help. Rough is fine; the point is that it is theirs."
              />
            </div>

            {/* Photo upload */}
            {!photo && (
              <PaperCard padded={false}>
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="w-full py-10 flex flex-col items-center justify-center transition-opacity hover:opacity-85"
                >
                  <svg className="w-8 h-8 mb-3" style={{ color: "var(--tfn-gold)" }} fill="none" viewBox="0 0 24 24" strokeWidth={1.4} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                  </svg>
                  <p
                    className="text-sm"
                    style={{ color: "var(--tfn-ink-soft)", fontFamily: "var(--font-body), 'Alegreya Sans', serif" }}
                  >
                    Add the tooth photo
                  </p>
                  <p
                    className="text-xs mt-1 italic"
                    style={{ color: "var(--tfn-ink-muted)", fontFamily: "var(--font-display), 'Alegreya', serif" }}
                  >
                    You can also draw from memory.
                  </p>
                </button>
              </PaperCard>
            )}

            {photo && (
              <div className="flex justify-center">
                <div className="relative">
                  <img
                    src={photo}
                    alt="Preview"
                    className="w-24 h-24 rounded-lg object-cover"
                    style={{ border: "1px solid var(--tfn-border)" }}
                  />
                  <button
                    type="button"
                    onClick={() => setPhoto(null)}
                    aria-label="Remove"
                    className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: "var(--tfn-surface-alt)", border: "1px solid var(--tfn-border)", color: "var(--tfn-ink-soft)" }}
                  >
                    ×
                  </button>
                </div>
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/*" onChange={handlePhoto} className="hidden" />

            {/* Drawing canvas */}
            <DrawingCanvas ref={drawingCanvasRef} photo={photo} />

            {photo && (
              <p className="text-xs text-center italic" style={{ color: "var(--tfn-ink-muted)", fontFamily: "var(--font-display), 'Alegreya', serif" }}>
                Draw over the photo, or continue with it as-is.
              </p>
            )}

            {/* Optional note */}
            {showNote || note ? (
              <PaperCard className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <InputRow label={`A note for ${childName || "later"} (optional)`}>
                      <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value.slice(0, 500))}
                        placeholder={childName ? `A sentence ${childName} can read when they're older...` : "A sentence they can read when they're older..."}
                        maxLength={500}
                        spellCheck={false}
                        className="w-full rounded-lg px-4 py-3 text-base outline-none resize-none"
                        style={{
                          background: "var(--tfn-surface)",
                          border: "1px solid var(--tfn-border)",
                          color: "var(--tfn-ink)",
                          fontFamily: "var(--font-body), 'Alegreya Sans', system-ui, sans-serif",
                          minHeight: "96px",
                        }}
                        rows={3}
                      />
                    </InputRow>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setNote("")
                      setShowNote(false)
                    }}
                    className="text-xs underline transition-opacity hover:opacity-80"
                    style={{ color: "var(--tfn-ink-muted)" }}
                  >
                    Skip
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-[11px]" style={{ color: "var(--tfn-ink-muted)" }}>
                    Optional. The keepsake works without it.
                  </p>
                  <p className="text-[11px] font-mono" style={{ color: "var(--tfn-ink-muted)" }}>
                    {note.length}/500
                  </p>
                </div>
              </PaperCard>
            ) : (
              <button
                type="button"
                onClick={() => setShowNote(true)}
                className="w-full rounded-full py-3 text-sm font-medium transition-opacity hover:opacity-85"
                style={{
                  border: "1px solid var(--tfn-border)",
                  color: "var(--tfn-ink-soft)",
                  background: "var(--tfn-surface-alt)",
                  fontFamily: "var(--font-body), 'Alegreya Sans', system-ui, sans-serif",
                }}
              >
                Add a note (optional)
              </button>
            )}

            <div className="space-y-3">
              <GoldCTA onClick={goToPreview}>
                See the family page
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </GoldCTA>
              <GhostButton onClick={() => setStep("setup")}>Back</GhostButton>
            </div>
          </div>
        )}

        {/* ── STEP 2.5: Tell ── */}
        {step === "tell" && (
          <TellStep
            value={tellText}
            onChange={setTellText}
            onSkip={handleTellSkip}
            onContinue={handleTellContinue}
          />
        )}

        {/* ── STEP 3: Preview ── */}
        {step === "preview" && (
          <div className="space-y-10">
            <div className="space-y-5">
              <div className="text-center">
                <Eyebrow>Ready</Eyebrow>
              </div>
              <StepTitle
                title={childName ? `${childName}'s keepsake` : "The keepsake"}
                subtitle="This becomes the shareable family page: memory first, Smile Fund second, blockchain quietly underneath."
              />
            </div>

            {/* Preview storybook cover */}
            {previewImage && (
              <div className="flex justify-center">
                <div
                  className="relative w-full max-w-[280px] aspect-[9/12] rounded-lg overflow-hidden"
                  style={{
                    boxShadow: "0 24px 60px oklch(30% 0.035 65 / 0.18), 0 4px 12px oklch(30% 0.035 65 / 0.10)",
                  }}
                >
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: "linear-gradient(to top, oklch(30% 0.035 65 / 0.78) 0%, oklch(30% 0.035 65 / 0.2) 40%, transparent 60%)",
                    }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p
                      className="text-base font-semibold"
                      style={{
                        fontFamily: "var(--font-display), 'Alegreya', Georgia, serif",
                        color: "oklch(98% 0.005 80)",
                        textShadow: "0 2px 16px rgba(0,0,0,0.45)",
                      }}
                    >
                      {toothDisplayName}
                    </p>
                    {note && (
                      <p
                        className="text-xs italic mt-1 line-clamp-2"
                        style={{
                          fontFamily: "var(--font-display), 'Alegreya', Georgia, serif",
                          color: "oklch(92% 0.02 80)",
                          textShadow: "0 1px 8px rgba(0,0,0,0.6)",
                        }}
                      >
                        &ldquo;{note}&rdquo;
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Transparency */}
            <PaperCard>
              <div className="space-y-5">
                {[
                  { num: "i", title: "The memory stays together", desc: "The tooth photo, drawing, and optional note live on one page your family can revisit." },
                  { num: "ii", title: "Loved ones get one link", desc: "After saving, send the page to grandparents, friends, and your wider family circle." },
                  { num: "iii", title: "You stay in charge", desc: `You manage access, gifting, and unlock timing. ${childName || "Your child"} gets the memory and a first lesson in ownership.` },
                ].map(({ num, title, desc }, i) => (
                  <div
                    key={num}
                    className="flex gap-5"
                    style={{
                      paddingTop: i > 0 ? "1.25rem" : 0,
                      borderTop: i > 0 ? "1px solid var(--tfn-border)" : "none",
                    }}
                  >
                    <span
                      className="text-xl leading-none italic shrink-0"
                      style={{
                        fontFamily: "var(--font-display), 'Alegreya', Georgia, serif",
                        color: "var(--tfn-gold)",
                        minWidth: "1.5rem",
                      }}
                    >
                      {num}.
                    </span>
                    <div>
                      <h3
                        className="font-semibold mb-1 text-base"
                        style={{
                          fontFamily: "var(--font-display), 'Alegreya', Georgia, serif",
                          color: "var(--tfn-ink)",
                        }}
                      >
                        {title}
                      </h3>
                      <p className="text-sm leading-relaxed" style={{ color: "var(--tfn-ink-soft)" }}>
                        {desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </PaperCard>

            {/* Auth + Mint */}
            <PaperCard className="space-y-5 text-center">
              {authLoading ? (
                <div className="space-y-3 animate-pulse py-4">
                  <div className="h-3 w-40 mx-auto rounded" style={{ background: "var(--tfn-border)" }} />
                  <div className="h-10 w-48 mx-auto rounded-full" style={{ background: "var(--tfn-border)" }} />
                </div>
              ) : !HAS_SUPABASE_CONFIG && !isTestMode ? (
                <>
                  <p
                    className="text-lg"
                    style={{ fontFamily: "var(--font-display), 'Alegreya', serif", color: "var(--tfn-ink)" }}
                  >
                    Saving is not connected on this domain yet.
                  </p>
                  <p className="text-sm" style={{ color: "var(--tfn-ink-soft)" }}>
                    Check the production environment variables and health check before testing a real keepsake.
                  </p>
                </>
              ) : !isAuthenticated ? (
                <>
                  <p
                    className="text-lg"
                    style={{ fontFamily: "var(--font-display), 'Alegreya', serif", color: "var(--tfn-ink)" }}
                  >
                    Sign in to save the keepsake.
                  </p>
                  <p className="text-sm" style={{ color: "var(--tfn-ink-soft)" }}>
                    This creates the parent account for this memory. No wallet or crypto knowledge required.
                  </p>
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-opacity hover:opacity-90"
                    style={{
                      background: "white",
                      color: "#1f2937",
                      border: "1px solid var(--tfn-border)",
                      boxShadow: "0 2px 10px oklch(30% 0.035 65 / 0.08)",
                      fontFamily: "var(--font-body), 'Alegreya Sans', system-ui, sans-serif",
                    }}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Continue with Google
                  </button>
                </>
              ) : (
                <>
                  <div
                    className="inline-flex items-center gap-2 text-xs"
                    style={{ color: "var(--tfn-ink-muted)" }}
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    Signed in as {authEmail || ""}
                  </div>
                  <GoldCTA onClick={handleServerMint}>
                    Save the keepsake
                  </GoldCTA>
                  <p className="text-xs" style={{ color: "var(--tfn-ink-muted)" }}>
                    Free to create. You can add savings after it is saved.
                  </p>
                </>
              )}
            </PaperCard>

            <button
              type="button"
              onClick={() => setStep("create")}
              className="w-full text-xs text-center py-2 underline transition-opacity hover:opacity-80"
              style={{ color: "var(--tfn-ink-muted)" }}
            >
              Back to drawing
            </button>
          </div>
        )}

        {/* ── STEP 4: Deposit ── */}
        {step === "deposit" && (
          <div className="space-y-10">
            {previewImage && (
              <div className="flex justify-center">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-24 h-24 rounded-lg object-cover"
                  style={{ border: "1px solid var(--tfn-border)", boxShadow: "0 6px 20px oklch(72% 0.145 75 / 0.20)" }}
                />
              </div>
            )}

            <div className="space-y-5">
              <div className="text-center">
                <Eyebrow>Keepsake saved</Eyebrow>
              </div>
              <StepTitle
                title="Start the Smile Fund, or share now."
                subtitle={`The memory is saved. Add an optional first gift, or open ${childName || "the child"}'s family page and send it to loved ones.`}
              />
            </div>

            {escrowInfo && (
              <GoldCTA onClick={() => redirectToKeepsake(escrowInfo.milestonePda)}>
                Open the family keepsake
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </GoldCTA>
            )}

            {/* What is saved */}
            <PaperCard>
              <h3
                className="text-base font-semibold mb-4"
                style={{ fontFamily: "var(--font-display), 'Alegreya', serif", color: "var(--tfn-ink)" }}
              >
                What just happened
              </h3>
              <div className="space-y-3">
                {[
                  { label: "Memory saved", value: note ? "Photo, drawing, note" : "Photo and drawing" },
                  { label: "Family page created", value: "Ready to share" },
                  { label: "Age-10 default", value: suggestedUnlockDate || "Set from birthday" },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    className="flex justify-between gap-4 text-sm"
                    style={{ color: "var(--tfn-ink-soft)" }}
                  >
                    <span>{label}</span>
                    <span className="font-medium text-right" style={{ color: "var(--tfn-gold)" }}>{value}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs mt-4 italic" style={{ color: "var(--tfn-ink-muted)", fontFamily: "var(--font-display), serif" }}>
                Savings are optional. The keepsake is already created and ready to share.
              </p>
            </PaperCard>

            {/* Lock period */}
            <PaperCard className="space-y-4">
              <InputRow label="When should the first gift unlock?">
                <div className="space-y-2 mt-2">
                  {[
                    { id: "now" as LockChoice, label: "Available now" },
                    { id: "ageTen" as LockChoice, label: "Hold until age 10", badge: "Recommended" },
                    { id: "custom" as LockChoice, label: "Choose another date" },
                  ].map((opt) => {
                    const active = lockChoice === opt.id
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => setLockChoice(opt.id)}
                        className="w-full flex items-center justify-between px-5 py-3.5 rounded-lg text-sm transition-colors"
                        style={{
                          background: active ? "var(--tfn-gold-soft)" : "transparent",
                          border: `1.5px solid ${active ? "var(--tfn-gold)" : "var(--tfn-border)"}`,
                          color: active ? "var(--tfn-gold-hover)" : "var(--tfn-ink-soft)",
                          fontFamily: "var(--font-body), 'Alegreya Sans', serif",
                        }}
                      >
                        <span>{opt.label}</span>
                        <span className="flex items-center gap-2">
                          {opt.badge && (
                            <span
                              className="text-[9px] uppercase px-2 py-0.5 rounded-full"
                              style={{
                                background: "var(--tfn-gold-soft)",
                                color: "var(--tfn-gold-hover)",
                                letterSpacing: "0.12em",
                              }}
                            >
                              {opt.badge}
                            </span>
                          )}
                          {active && (
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                            </svg>
                          )}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </InputRow>

              {lockChoice === "ageTen" && suggestedUnlockDate && (
                <p className="text-sm italic text-center" style={{ color: "var(--tfn-gold)", fontFamily: "var(--font-display), serif" }}>
                  Unlocks {suggestedUnlockDate}
                </p>
              )}
              {lockChoice === "custom" && (
                <div className="mt-2">
                  <UnderlineInput
                    type="date"
                    value={customLockDate}
                    onChange={(e) => setCustomLockDate(e.target.value)}
                    min={new Date(Date.now() + 86400000).toISOString().split("T")[0]}
                    filled={!!customLockDate}
                  />
                  {customLockDate && (
                    <p className="mt-2 text-sm text-center italic" style={{ color: "var(--tfn-gold)", fontFamily: "var(--font-display), serif" }}>
                      Unlocks{" "}
                      {new Date(customLockDate + "T00:00:00").toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  )}
                </div>
              )}
            </PaperCard>

            {/* Amount */}
            <PaperCard>
              <InputRow label="Optional first gift amount">
                <div className="grid grid-cols-4 gap-2 mt-3">
                  {[
                    { usd: "$5", sol: "0.05" },
                    { usd: "$10", sol: "0.1" },
                    { usd: "$25", sol: "0.25" },
                    { usd: "$50", sol: "0.5" },
                  ].map(({ usd, sol }) => {
                    const active = depositAmount === sol
                    return (
                      <button
                        key={sol}
                        type="button"
                        onClick={() => setDepositAmount(sol)}
                        className="py-3 rounded-lg text-sm font-medium flex flex-col items-center transition-colors"
                        style={{
                          background: active ? "var(--tfn-gold-soft)" : "transparent",
                          border: `1.5px solid ${active ? "var(--tfn-gold)" : "var(--tfn-border)"}`,
                          color: active ? "var(--tfn-gold-hover)" : "var(--tfn-ink-soft)",
                          fontFamily: "var(--font-body), 'Alegreya Sans', serif",
                        }}
                      >
                        <span>{usd}</span>
                        <span className="text-[10px] font-mono mt-0.5 opacity-60">{sol} SOL</span>
                      </button>
                    )
                  })}
                </div>
                <p className="mt-3 text-xs leading-relaxed" style={{ color: "var(--tfn-ink-muted)" }}>
                  Current deployed contract fee is 2%. Target public launch fee is 1%. Public card gifts will show final terms before payment.
                </p>
              </InputRow>
            </PaperCard>

            {/* Gifter + message */}
            <PaperCard className="space-y-6">
              <InputRow label="Gift from">
                <UnderlineInput
                  type="text"
                  value={depositorName}
                  onChange={(e) => setDepositorName(e.target.value)}
                  placeholder="e.g. Mom, Dad, Grandma"
                  filled={!!depositorName}
                />
              </InputRow>
              <InputRow label="Gift note (optional)">
                <UnderlineInput
                  type="text"
                  value={depositMessage}
                  onChange={(e) => setDepositMessage(e.target.value)}
                  placeholder="With love, from us"
                  filled={!!depositMessage}
                />
              </InputRow>
            </PaperCard>

            {awaitingCardDeposit && (
              <PaperCard>
                <p
                  className="text-sm font-medium text-center"
                  style={{ color: "var(--tfn-gold)", fontFamily: "var(--font-display), serif" }}
                >
                  Complete payment in the secure checkout...
                </p>
                <p className="text-xs mt-1 text-center" style={{ color: "var(--tfn-ink-muted)" }}>
                  Don&apos;t close this page.
                </p>
              </PaperCard>
            )}

            {/* Actions */}
            <div className="space-y-3">
                <GoldCTA
                 onClick={handleCardPayment}
                 disabled={!FIAT_ONRAMP_ENABLED || cardPaymentLoading || awaitingCardDeposit || !depositorName.trim()}
                >
                 {cardPaymentLoading
                   ? "Opening payment..."
                   : awaitingCardDeposit
                     ? "Waiting for payment..."
                     : !FIAT_ONRAMP_ENABLED
                       ? "MoonPay card gifts are connecting next"
                      : (
                        <>
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                        </svg>
                        Add a card gift
                      </>
                    )}
              </GoldCTA>

              {publicKey ? (
                <GhostButton
                  onClick={handleDeposit}
                  disabled={!depositorName.trim() || !parseFloat(depositAmount)}
                >
                  Add {depositAmount} SOL from wallet
                </GhostButton>
              ) : (
                <GhostButton onClick={() => setVisible(true)}>
                  Use a Solana wallet for a test gift
                </GhostButton>
              )}

              <button
                type="button"
                onClick={() => {
                  if (escrowInfo) redirectToKeepsake(escrowInfo.milestonePda)
                  else setStep("done")
                }}
                className="w-full text-center text-xs py-2 underline transition-opacity hover:opacity-80"
                style={{ color: "var(--tfn-ink-muted)" }}
                aria-label="Skip deposit for now"
              >
                Skip gift and open the keepsake
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 5: Minting ── */}
        {step === "minting" && (
          <div className="text-center py-20 space-y-8">
            <div className="relative mx-auto flex items-center justify-center" style={{ width: 200, height: 200 }}>
              <div
                className="absolute rounded-full border"
                style={{
                  width: 88,
                  height: 88,
                  borderColor: "var(--tfn-gold)",
                  opacity: 0.25,
                  animation: "tfnPulseRing 3s cubic-bezier(0.4,0,0.6,1) infinite",
                }}
              />
              <div
                className="absolute rounded-full border"
                style={{
                  width: 136,
                  height: 136,
                  borderColor: "var(--tfn-gold)",
                  opacity: 0.12,
                  animation: "tfnPulseRing 3s cubic-bezier(0.4,0,0.6,1) infinite",
                  animationDelay: "1s",
                }}
              />
              <div
                className="absolute rounded-full border"
                style={{
                  width: 184,
                  height: 184,
                  borderColor: "var(--tfn-gold)",
                  opacity: 0.06,
                  animation: "tfnPulseRing 3s cubic-bezier(0.4,0,0.6,1) infinite",
                  animationDelay: "2s",
                }}
              />
              <div
                className="relative z-10 rounded-full flex items-center justify-center"
                style={{
                  width: 60,
                  height: 60,
                  background: "var(--tfn-gold)",
                  boxShadow: "0 0 40px oklch(72% 0.145 75 / 0.5)",
                }}
              >
                <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24" style={{ color: "oklch(98% 0.005 80)" }}>
                  <path d="M12 2l2.39 7.36H22l-6.2 4.5 2.38 7.34L12 16.9l-6.18 4.3 2.38-7.34L2 9.36h7.61z" />
                </svg>
              </div>
            </div>

            <style>{`
              @keyframes tfnPulseRing {
                0%, 100% { opacity: var(--o, 0.3); transform: scale(1); }
                50% { opacity: calc(var(--o, 0.3) * 0.5); transform: scale(1.15); }
              }
            `}</style>

            <div>
              <StepTitle
                title={childName ? `Saving ${childName}'s keepsake...` : "Saving the keepsake..."}
                subtitle={mintProgress || "It takes just a few seconds."}
              />
            </div>
          </div>
        )}

        {/* ── STEP 6: Done ── */}
        {step === "done" && (
          <div className="space-y-10">
            <div className="space-y-5">
              <div className="text-center">
                <Eyebrow>Saved forever</Eyebrow>
              </div>
              <StepTitle
                title={childName ? `${childName}'s keepsake is live.` : "The keepsake is live."}
                subtitle={`Saved on the Tooth Fairy Network. When ${childName || "they're"} older, this can become their first lesson in ownership.`}
              />
            </div>

            {previewImage && (
              <div className="flex justify-center">
                <img
                  src={previewImage}
                  alt="Keepsake"
                  className="w-48 h-48 rounded-lg object-cover"
                  style={{
                    border: "1px solid var(--tfn-gold)",
                    boxShadow: "0 24px 60px oklch(72% 0.145 75 / 0.25)",
                  }}
                />
              </div>
            )}

            {depositSuccess && (
              <PaperCard>
                <p
                  className="text-sm font-medium text-center"
                  style={{ color: "var(--tfn-gold)", fontFamily: "var(--font-display), serif" }}
                >
                  {depositSuccess}
                </p>
                {lockChoice === "ageTen" && suggestedUnlockDate && (
                  <p className="text-xs mt-1 text-center italic" style={{ color: "var(--tfn-ink-muted)", fontFamily: "var(--font-display), serif" }}>
                    Locked until {suggestedUnlockDate}
                  </p>
                )}
                <p className="text-xs mt-2 text-center" style={{ color: "var(--tfn-ink-muted)" }}>
                  {feeInfo.net.toFixed(4)} SOL in wallet (current 2% fee: {feeInfo.fee.toFixed(4)} SOL)
                </p>
              </PaperCard>
            )}

            {escrowInfo && (
              <GoldCTA
                onClick={() => {
                  const url = `${window.location.origin}/toothfairy/keepsake/${escrowInfo.milestonePda}`
                  const shareText = `${childName} saved their tooth fairy keepsake. See the memory and add a small gift if you want:`
                  if (navigator.share) {
                    navigator.share({ title: `${childName}'s Tooth Fairy Network`, text: shareText, url }).catch(() => {})
                  } else {
                    navigator.clipboard.writeText(`${shareText}\n${url}`).then(() => alert("Link copied!")).catch(() => prompt("Copy this link:", url))
                  }
                }}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                </svg>
                Share with family
              </GoldCTA>
            )}

            <GhostButton onClick={() => router.push("/toothfairy/app/dashboard")}>
              View {childName ? `${childName}'s` : "the"} page
            </GhostButton>

            {mintSignature && (
              <p className="text-xs text-center" style={{ color: "var(--tfn-ink-muted)" }}>
                <a
                  href={`https://solscan.io/tx/${mintSignature}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                  style={{ color: "var(--tfn-gold)" }}
                >
                  View on blockchain {"->"}
                </a>
              </p>
            )}
          </div>
        )}

      </main>
    </div>
  )
}
