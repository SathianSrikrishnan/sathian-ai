"use client"

import { useState, useRef } from "react"
import { PC, parentGlow, parentGradients } from "../parent-theme"
import { ViewToggle } from "../view-toggle"
import DrawingCanvas, { type DrawingCanvasRef } from "./drawing-canvas"

// ─── Types ──────────────────────────────────────────────────────────
type ParentStep = "setup" | "create" | "preview" | "minting" | "done"
type LockChoice = "now" | "eighteen" | "custom"

interface ParentFlowProps {
  onComplete?: () => void
  stepIndex?: number
  onStepChange?: (index: number) => void
  sharedChildName?: string
}

// ─── Constants ──────────────────────────────────────────────────────
const PARENT_STEPS: ParentStep[] = ["setup", "create", "preview", "minting", "done"]

// ─── Component ──────────────────────────────────────────────────────
export default function ParentFlow({
  onComplete,
  stepIndex: externalStepIndex,
  onStepChange,
  sharedChildName,
}: ParentFlowProps) {
  // Step management — sync with parent via props, or run standalone
  const internalIndex = externalStepIndex ?? 0
  const step = PARENT_STEPS[Math.min(internalIndex, PARENT_STEPS.length - 1)]
  const setStep = (s: ParentStep) => {
    const idx = PARENT_STEPS.indexOf(s)
    if (onStepChange) onStepChange(idx)
  }

  // Form state
  const [childName, setChildName] = useState("")
  const [birthDate, setBirthDate] = useState("")
  const [photo, setPhoto] = useState<string | null>(null)
  const [toothPhoto, setToothPhoto] = useState<string | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [note, setNote] = useState("")
  const [lockChoice, setLockChoice] = useState<LockChoice>("eighteen")
  const [customLockDate, setCustomLockDate] = useState("")
  const [depositAmount, setDepositAmount] = useState("20")
  const [fromName, setFromName] = useState("")

  const childPhotoRef = useRef<HTMLInputElement>(null)
  const toothPhotoRef = useRef<HTMLInputElement>(null)
  const drawingCanvasRef = useRef<DrawingCanvasRef>(null)

  const name = sharedChildName || childName || "Your child"

  // Photo handlers
  const handleChildPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setPhoto(reader.result as string)
    reader.readAsDataURL(file)
  }

  const handleToothPhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setToothPhoto(reader.result as string)
    reader.readAsDataURL(file)
  }

  // Computed
  const currentStepNum = (() => {
    if (step === "minting" || step === "done") return 5
    const idx = PARENT_STEPS.indexOf(step)
    return idx >= 0 ? idx + 1 : 1
  })()

  const stepLabel = (() => {
    switch (step) {
      case "setup": return "Child Details"
      case "create": return "Capture Moment"
      case "preview": return "Preview & Save"
      case "minting": return "Creating..."
      case "done": return "Complete"
      default: return ""
    }
  })()

  // ─── Render ─────────────────────────────────────────────────────────
  return (
    <div
      className="w-full max-w-md mx-auto min-h-screen relative"
      style={{ background: PC.bg, color: PC.text, fontFamily: "var(--font-body, 'Alegreya Sans'), sans-serif" }}
    >
      {/* ── Sticky Header ── */}
      <div
        className="sticky top-0 w-full z-50 transition-colors duration-300"
        style={{ background: PC.bg, borderBottom: `1px solid ${PC.border}` }}
      >
        <div className="flex justify-center py-2">
          <ViewToggle />
        </div>
        <div
          className="flex justify-between items-center px-6 pb-2"
        >
          <h1
            className="text-lg font-bold tracking-tight"
            style={{
              color: PC.gold,
              fontFamily: "var(--font-display, 'Alegreya'), serif",
            }}
          >
            Tooth Fairy Network
          </h1>
          <button
            style={{
              background: PC.gold,
              color: PC.onGold,
              border: "none",
              borderRadius: "0.75rem",
              padding: "0.5rem 1rem",
              fontSize: "0.8125rem",
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "var(--font-display, 'Alegreya'), serif",
            }}
          >
            Connect Wallet
          </button>
        </div>
      </div>

      {/* ── Content Area ── */}
      <div className="pb-24 px-6">
        {/* ── Progress Indicator ── */}
        {step !== "minting" && step !== "done" && (
          <div className="mb-8">
            <div className="flex justify-between items-end mb-2">
              <span
                className="text-[10px] uppercase tracking-widest"
                style={{
                  color: PC.goldDark,
                  fontFamily: "var(--font-display, 'Alegreya'), serif",
                  fontWeight: 800,
                  letterSpacing: "0.15em",
                }}
              >
                Step {currentStepNum} of 5
              </span>
              <span
                className="text-[10px] uppercase tracking-widest"
                style={{
                  color: PC.muted,
                  fontFamily: "var(--font-display, 'Alegreya'), serif",
                  fontWeight: 800,
                  letterSpacing: "0.15em",
                }}
              >
                {stepLabel}
              </span>
            </div>
            <div
              className="h-1.5 w-full rounded-full overflow-hidden"
              style={{ background: PC.surfaceContainer }}
            >
              <div
                className="h-full transition-all duration-500 ease-out"
                style={{
                  width: `${(currentStepNum / 5) * 100}%`,
                  background: PC.gold,
                  borderRadius: "9999px",
                }}
              />
            </div>
          </div>
        )}

        {/* ── Back Button ── */}
        {currentStepNum > 1 && step !== "minting" && step !== "done" && (
          <button
            onClick={() => {
              const idx = PARENT_STEPS.indexOf(step)
              if (idx > 0) setStep(PARENT_STEPS[idx - 1])
            }}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.375rem",
              color: PC.muted,
              fontSize: "0.875rem",
              fontWeight: 600,
              marginBottom: "1.5rem",
              padding: 0,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back
          </button>
        )}

        {/* ══════════════════════════════════════════════════════════════
            STEP 1: Setup — Name, DOB, Photo
           ══════════════════════════════════════════════════════════════ */}
        {step === "setup" && (
          <div className="space-y-6">
            {/* Hero text */}
            <div className="text-center py-4">
              <h2
                className="text-xl font-bold tracking-tight"
                style={{ fontFamily: "var(--font-display, 'Alegreya'), serif", color: PC.text }}
              >
                Set up your child&apos;s profile
              </h2>
              <p className="text-xs mt-2" style={{ color: PC.muted }}>
                Create a permanent digital keepsake from their lost tooth.
              </p>
            </div>

            {/* Photo upload circle */}
            <div className="flex justify-center">
              <input
                ref={childPhotoRef}
                type="file"
                accept="image/*"
                onChange={handleChildPhoto}
                className="hidden"
              />
              {photo ? (
                <div className="relative">
                  <div
                    className="w-24 h-24 rounded-full overflow-hidden"
                    style={{ border: `2px solid ${PC.border}` }}
                  >
                    <img src={photo} alt="Child" className="w-full h-full object-cover" />
                  </div>
                  <button
                    onClick={() => setPhoto(null)}
                    className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: PC.errorContainer, color: PC.error }}
                  >
                    x
                  </button>
                  <p className="text-[10px] text-center mt-2" style={{ color: PC.muted }}>
                    Appears on their page
                  </p>
                </div>
              ) : (
                <button
                  onClick={() => childPhotoRef.current?.click()}
                  className="w-24 h-24 rounded-full border-2 border-dashed flex flex-col items-center justify-center transition-all"
                  style={{ borderColor: PC.border, background: PC.surfaceContainerLow }}
                >
                  <svg
                    className="w-6 h-6 mb-1"
                    style={{ color: PC.muted }}
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"
                    />
                  </svg>
                  <span className="text-[9px]" style={{ color: PC.muted }}>
                    Add photo
                  </span>
                </button>
              )}
            </div>

            {/* Form card with inputs */}
            <div
              className="rounded-2xl p-6 space-y-5"
              style={{
                background: PC.bgAlt,
                border: `1px solid ${PC.border}`,
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}
            >
              <div>
                <label
                  className="block text-[10px] uppercase tracking-widest mb-2"
                  style={{ color: PC.goldDark, fontWeight: 700 }}
                >
                  Child&apos;s name
                </label>
                <input
                  type="text"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  placeholder="e.g. Luna Star"
                  className="bg-transparent border-b py-2 px-1 text-lg transition-colors focus:ring-0 w-full outline-none"
                  style={{
                    borderColor: childName ? PC.teal : PC.border,
                    color: PC.text,
                    fontFamily: "var(--font-body, 'Alegreya Sans'), sans-serif",
                    borderTop: "none",
                    borderLeft: "none",
                    borderRight: "none",
                  }}
                />
              </div>

              <div>
                <label
                  className="block text-[10px] uppercase tracking-widest mb-2"
                  style={{ color: PC.goldDark, fontWeight: 700 }}
                >
                  Date of birth
                </label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="bg-transparent border-b py-2 px-1 text-lg transition-colors focus:ring-0 w-full outline-none"
                  style={{
                    borderColor: birthDate ? PC.teal : PC.border,
                    color: PC.text,
                    fontFamily: "var(--font-body, 'Alegreya Sans'), sans-serif",
                    borderTop: "none",
                    borderLeft: "none",
                    borderRight: "none",
                  }}
                />
              </div>
            </div>

            {/* Gold CTA */}
            <button
              onClick={() => setStep("create")}
              disabled={!childName.trim() || !birthDate}
              className="w-full py-4 font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-30"
              style={{
                background: parentGradients.stardust,
                color: PC.onGold,
                boxShadow: parentGlow.ctaFloat,
                borderRadius: "9999px",
                fontFamily: "var(--font-display, 'Alegreya'), serif",
                border: "none",
                cursor: "pointer",
                fontSize: "1rem",
              }}
            >
              Continue
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>

            {/* Bento info cards */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              <div
                className="p-5 rounded-2xl"
                style={{ background: PC.surfaceContainerLow }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={PC.teal}
                  strokeWidth="2"
                  className="mb-3"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <h3
                  className="font-bold mb-1"
                  style={{ fontFamily: "var(--font-display, 'Alegreya'), serif", color: PC.text, fontSize: "0.875rem" }}
                >
                  Encrypted Ledger
                </h3>
                <p style={{ fontSize: "0.8125rem", color: PC.muted, opacity: 0.7, lineHeight: 1.5 }}>
                  Your child&apos;s milestones are anchored on the blockchain for permanent preservation.
                </p>
              </div>
              <div
                className="p-5 rounded-2xl"
                style={{ background: PC.surfaceContainerLow }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke={PC.goldDark}
                  strokeWidth="2"
                  className="mb-3"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
                <h3
                  className="font-bold mb-1"
                  style={{ fontFamily: "var(--font-display, 'Alegreya'), serif", color: PC.text, fontSize: "0.875rem" }}
                >
                  Privacy First
                </h3>
                <p style={{ fontSize: "0.8125rem", color: PC.muted, opacity: 0.7, lineHeight: 1.5 }}>
                  Only verified guardians with the unique wallet key can access this profile.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            STEP 2: Create — Photo Upload + Drawing Canvas + Note
           ══════════════════════════════════════════════════════════════ */}
        {step === "create" && (
          <div className="space-y-5">
            <div className="text-center">
              <h2
                className="text-xl font-bold tracking-tight"
                style={{ fontFamily: "var(--font-display, 'Alegreya'), serif", color: PC.text }}
              >
                {toothPhoto ? "Great photo!" : "Take a photo or draw the tooth together"}
              </h2>
              <p className="text-xs mt-2" style={{ color: PC.muted }}>
                This artwork will be stored permanently.
              </p>
            </div>

            {/* Photo upload area */}
            {!toothPhoto && (
              <button
                onClick={() => toothPhotoRef.current?.click()}
                className="w-full py-6 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all"
                style={{
                  borderColor: PC.borderGold,
                  background: PC.goldSoft,
                }}
              >
                <svg
                  className="w-8 h-8 mb-2"
                  style={{ color: PC.goldDark }}
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"
                  />
                </svg>
                <p className="text-xs" style={{ color: PC.muted }}>
                  Tap to photograph the tooth
                </p>
              </button>
            )}
            {toothPhoto && (
              <div className="flex justify-center">
                <div className="relative">
                  <img
                    src={toothPhoto}
                    alt="Preview"
                    className="w-20 h-20 rounded-2xl object-cover"
                    style={{ border: `1px solid ${PC.borderGold}` }}
                  />
                  <button
                    onClick={() => setToothPhoto(null)}
                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: PC.errorContainer, color: PC.error }}
                  >
                    x
                  </button>
                </div>
              </div>
            )}
            <input
              ref={toothPhotoRef}
              type="file"
              accept="image/*"
              onChange={handleToothPhoto}
              className="hidden"
            />

            {/* Use photo as-is CTA */}
            {toothPhoto && (
              <button
                onClick={() => setStep("preview")}
                className="w-full py-4 font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
                style={{
                  background: parentGradients.stardust,
                  color: PC.onGold,
                  boxShadow: parentGlow.ctaFloat,
                  borderRadius: "9999px",
                  fontFamily: "var(--font-display, 'Alegreya'), serif",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "1rem",
                }}
              >
                Use this photo
              </button>
            )}

            {/* Drawing canvas (shared component) */}
            <DrawingCanvas ref={drawingCanvasRef} photo={toothPhoto} />

            {/* Note section */}
            <div
              className="rounded-2xl p-5"
              style={{
                background: PC.bgAlt,
                border: `1px solid ${PC.border}`,
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}
            >
              <label
                className="block text-sm font-bold mb-3"
                style={{ fontFamily: "var(--font-display, 'Alegreya'), serif", color: PC.text }}
              >
                Add a message for {name}&apos;s time capsule
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value.slice(0, 500))}
                placeholder={`Write something ${name} will read when they're older...`}
                maxLength={500}
                rows={4}
                className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all resize-none"
                style={{
                  background: PC.surfaceContainerLow,
                  border: `1px solid ${PC.border}`,
                  color: PC.text,
                  fontFamily: "var(--font-body, 'Alegreya Sans'), sans-serif",
                }}
              />
              <div className="flex justify-end mt-2">
                <span
                  className="text-[10px] font-bold"
                  style={{ color: PC.muted, letterSpacing: "0.05em" }}
                >
                  {note.length}/500
                </span>
              </div>
            </div>

            {/* Privacy info */}
            <div
              className="flex gap-3 items-start rounded-xl p-4"
              style={{
                background: PC.surfaceContainerLow,
                border: `1px solid ${PC.border}`,
              }}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke={PC.teal}
                strokeWidth="2"
                className="flex-shrink-0 mt-0.5"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
              <p style={{ fontSize: "0.8125rem", color: PC.muted, lineHeight: 1.6 }}>
                This note is saved permanently alongside the artwork. It can never be edited or deleted.
              </p>
            </div>

            {/* Continue CTA */}
            <button
              onClick={() => {
                const dataUrl = drawingCanvasRef.current?.toDataURL()
                if (dataUrl) setPreviewImage(dataUrl)
                setStep("preview")
              }}
              className="w-full py-4 font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
              style={{
                background: parentGradients.stardust,
                color: PC.onGold,
                boxShadow: parentGlow.ctaFloat,
                borderRadius: "9999px",
                fontFamily: "var(--font-display, 'Alegreya'), serif",
                border: "none",
                cursor: "pointer",
                fontSize: "1rem",
              }}
            >
              Next
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </button>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            STEP 3: Preview & Save — Preview card, Google auth, Save CTA
           ══════════════════════════════════════════════════════════════ */}
        {step === "preview" && (
          <div className="space-y-6">
            <div className="text-center">
              <h2
                className="text-xl font-bold tracking-tight"
                style={{ fontFamily: "var(--font-display, 'Alegreya'), serif", color: PC.text }}
              >
                This is {name}&apos;s — forever
              </h2>
              <p className="text-xs mt-2" style={{ color: PC.muted }}>
                No one can take it, change it, or delete it.
              </p>
            </div>

            {/* Preview Card */}
            <div
              className="rounded-2xl overflow-hidden"
              style={{
                background: PC.bgAlt,
                border: `1px solid ${PC.border}`,
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                transform: "rotate(1deg)",
              }}
            >
              <div
                className="relative flex items-center justify-center"
                style={{
                  aspectRatio: "3 / 4",
                  background: PC.surfaceContainerLow,
                  borderRadius: "0.75rem",
                  overflow: "hidden",
                  margin: "0.25rem",
                }}
              >
                {(previewImage || toothPhoto) ? (
                  <img src={previewImage || toothPhoto!} alt="Artwork" className="w-full h-full object-cover" />
                ) : (
                  <div style={{ textAlign: "center", opacity: 0.3 }}>
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={PC.text} strokeWidth="1">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                    <p style={{ fontSize: "0.75rem", fontWeight: 600, marginTop: "0.5rem" }}>Artwork Preview</p>
                  </div>
                )}
                {/* Overlay info */}
                <div
                  className="absolute bottom-0 left-0 right-0 p-4"
                  style={{ background: `linear-gradient(to top, oklch(30% 0.035 65 / 0.3), transparent)` }}
                >
                  <div
                    className="rounded-xl p-3"
                    style={{ background: "rgba(255,255,255,0.9)", backdropFilter: "blur(12px)" }}
                  >
                    <p
                      className="font-bold text-lg mb-1"
                      style={{ fontFamily: "var(--font-display, 'Alegreya'), serif", color: PC.text }}
                    >
                      {name}&apos;s First Tooth Drawing
                    </p>
                    <p
                      className="text-sm italic leading-relaxed"
                      style={{ color: `${PC.text}b3` }}
                    >
                      {note || `"I'm keeping this forever so the fairy knows exactly where I left it!"`} — April 2026
                    </p>
                  </div>
                </div>
              </div>
              {/* Card footer */}
              <div
                className="flex items-center justify-between px-4 py-3"
                style={{ borderTop: `1px solid ${PC.border}` }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: PC.gold, color: PC.onGold }}
                  >
                    {name.charAt(0)}
                  </div>
                  <span
                    className="text-xs font-bold"
                    style={{ fontFamily: "var(--font-display, 'Alegreya'), serif" }}
                  >
                    {name}
                  </span>
                </div>
                <div className="flex items-center gap-1.5" style={{ opacity: 0.4 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
                    <polyline points="22 4 12 14.01 9 11.01" />
                  </svg>
                  <span
                    style={{
                      fontSize: "0.625rem",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                    }}
                  >
                    Solana Mainnet
                  </span>
                </div>
              </div>
            </div>

            {/* Transparency Card */}
            <div
              className="rounded-2xl p-6"
              style={{ background: PC.surfaceContainerLow }}
            >
              {[
                {
                  num: "01",
                  title: "Permanent storage",
                  desc: "Distributed across decentralized nodes, ensuring the data never disappears.",
                },
                {
                  num: "02",
                  title: "Solana blockchain creation",
                  desc: "A unique cryptographic hash locks this milestone into the public ledger.",
                },
                {
                  num: "03",
                  title: "Child's ownership",
                  desc: `The digital deed is issued directly to ${name}'s identity, managed by you.`,
                },
              ].map(({ num, title, desc }, i) => (
                <div
                  key={num}
                  className="flex gap-4"
                  style={{
                    paddingTop: i > 0 ? "1.5rem" : 0,
                    marginTop: i > 0 ? "1.5rem" : 0,
                    ...(i > 0 ? { borderTop: `1px solid ${PC.border}` } : {}),
                  }}
                >
                  <span
                    className="text-2xl font-bold leading-none"
                    style={{ fontFamily: "var(--font-display, 'Alegreya'), serif", color: PC.teal }}
                  >
                    {num}
                  </span>
                  <div>
                    <h3
                      className="font-bold mb-1"
                      style={{ fontFamily: "var(--font-display, 'Alegreya'), serif", color: PC.text }}
                    >
                      {title}
                    </h3>
                    <p style={{ fontSize: "0.875rem", color: `${PC.text}99`, lineHeight: 1.5 }}>
                      {desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Auth + Save Actions */}
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setStep("minting")
                  // Simulate minting progress
                  setTimeout(() => setStep("done"), 4000)
                }}
                className="w-full py-4 font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform"
                style={{
                  background: parentGradients.stardust,
                  color: PC.onGold,
                  boxShadow: parentGlow.ctaFloat,
                  borderRadius: "0.75rem",
                  fontFamily: "var(--font-display, 'Alegreya'), serif",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "1.125rem",
                }}
              >
                Save {name}&apos;s Milestone
              </button>
              <button
                className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-base font-bold transition-all"
                style={{
                  background: PC.bgAlt,
                  color: PC.text,
                  border: `1px solid ${PC.border}`,
                  fontFamily: "var(--font-display, 'Alegreya'), serif",
                  cursor: "pointer",
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Sign in with Google
              </button>
              <p className="text-xs text-center" style={{ color: `${PC.text}80` }}>
                Free. No wallet or crypto knowledge needed.
              </p>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            STEP 4: Minting Progress — Checklist Animation
           ══════════════════════════════════════════════════════════════ */}
        {step === "minting" && (
          <div className="text-center py-12 space-y-6">
            {/* Progress bar */}
            <div
              className="h-1.5 w-full rounded-full overflow-hidden mb-8"
              style={{ background: PC.surfaceContainer }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: "65%",
                  background: PC.gold,
                  animation: "parentPulse 2s ease-in-out infinite",
                }}
              />
            </div>

            <h2
              className="text-2xl font-bold"
              style={{ fontFamily: "var(--font-display, 'Alegreya'), serif", color: PC.text }}
            >
              Saving {name}&apos;s keepsake...
            </h2>
            <p className="text-lg" style={{ color: PC.muted }}>
              Securing this milestone permanently on the blockchain.
            </p>

            {/* Checklist */}
            <div className="space-y-4 text-left max-w-sm mx-auto mt-8">
              {/* Done */}
              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: PC.tealSoft }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={PC.teal} strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </div>
                <span className="text-lg font-semibold" style={{ color: PC.teal }}>
                  Storing artwork permanently
                </span>
              </div>
              {/* Active */}
              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: PC.goldSoft }}
                >
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={PC.gold}
                    strokeWidth="2"
                    style={{ animation: "parentSpin 2s linear infinite" }}
                  >
                    <path d="M21 12a9 9 0 11-6.22-8.56" />
                  </svg>
                </div>
                <span className="text-lg font-semibold" style={{ color: PC.text }}>
                  Creating {name}&apos;s profile
                </span>
              </div>
              {/* Pending */}
              <div className="flex items-center gap-4" style={{ opacity: 0.3 }}>
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: PC.surfaceHigh }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={PC.text} strokeWidth="2">
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                </div>
                <span className="text-lg font-semibold" style={{ color: PC.text }}>
                  Finalizing
                </span>
              </div>
            </div>

            {/* Ledger Metadata */}
            <div
              className="rounded-2xl p-5 mt-8"
              style={{
                background: PC.surfaceContainerLow,
                border: `1px solid ${PC.border}`,
              }}
            >
              <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <span
                    style={{
                      fontSize: "0.6875rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      color: PC.muted,
                      fontWeight: 700,
                    }}
                  >
                    Block Identity
                  </span>
                  <span style={{ fontSize: "0.875rem", color: PC.teal, fontFamily: "monospace" }}>
                    0x71C...4f9E
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span
                    style={{
                      fontSize: "0.6875rem",
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                      color: PC.muted,
                      fontWeight: 700,
                    }}
                  >
                    Timestamp
                  </span>
                  <span style={{ fontSize: "0.875rem", color: PC.text }}>
                    Apr 5, 2026 - 14:02:11
                  </span>
                </div>
              </div>
            </div>

            {/* Animations */}
            <style>{`
              @keyframes parentSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
              @keyframes parentPulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
            `}</style>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════════
            STEP 5: Done — The Unveiling
           ══════════════════════════════════════════════════════════════ */}
        {step === "done" && (
          <div className="space-y-8">
            {/* ── The Keepsake Card (the star of the show) ── */}
            <div className="pt-4">
              <div
                className="rounded-3xl overflow-hidden"
                style={{
                  background: PC.bgAlt,
                  border: `2px solid ${PC.borderGold}`,
                  boxShadow: parentGlow.ctaFloat,
                }}
              >
                {/* Child&apos;s creation */}
                <div
                  className="flex items-center justify-center"
                  style={{
                    aspectRatio: "4 / 3",
                    background: PC.surfaceContainerLow,
                    overflow: "hidden",
                  }}
                >
                  {toothPhoto ? (
                    <img src={toothPhoto} alt={`${name}'s creation`} className="w-full h-full object-cover" />
                  ) : (
                    <div style={{ textAlign: "center", opacity: 0.3 }}>
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={PC.text} strokeWidth="1">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                        <circle cx="8.5" cy="8.5" r="1.5" />
                        <polyline points="21 15 16 10 5 21" />
                      </svg>
                      <p style={{ fontSize: "0.75rem", fontWeight: 600, marginTop: "0.5rem" }}>{name}&apos;s artwork</p>
                    </div>
                  )}
                </div>

                {/* The note */}
                <div className="p-5">
                  <p
                    className="text-lg italic leading-relaxed mb-4"
                    style={{
                      fontFamily: "var(--font-display, 'Alegreya'), serif",
                      color: PC.text,
                    }}
                  >
                    {note || `"My first tooth fell out and I drew this for the fairy!"`}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                        style={{ background: PC.gold, color: PC.onGold }}
                      >
                        {photo ? (
                          <img src={photo} alt={name} className="w-full h-full object-cover rounded-full" />
                        ) : name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-bold" style={{ color: PC.text }}>
                          {name}
                        </p>
                        <p className="text-xs" style={{ color: PC.muted }}>
                          April 2026
                        </p>
                      </div>
                    </div>
                    <div
                      className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full"
                      style={{ background: PC.goldSoft, color: PC.goldDark }}
                    >
                      Permanent
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── The message ── */}
            <div className="text-center px-4">
              <h2
                className="text-2xl font-bold mb-2"
                style={{ fontFamily: "var(--font-display, 'Alegreya'), serif", color: PC.text }}
              >
                {name}&apos;s first keepsake is planted
              </h2>
              <p className="text-base leading-relaxed" style={{ color: PC.muted, maxWidth: '45ch', margin: '0 auto' }}>
                This is the beginning. Every person who loves {name} can add to it — a note, a gift, a memory. It grows year after year, and one day, everything in it is theirs.
              </p>
            </div>

            {/* ── Share — the primary action ── */}
            <div className="flex flex-col gap-3">
              <button
                className="w-full py-4 font-bold flex items-center justify-center gap-3 active:scale-95"
                style={{
                  background: PC.gold,
                  color: PC.onGold,
                  boxShadow: parentGlow.ctaFloat,
                  borderRadius: "0.75rem",
                  fontFamily: "var(--font-display, 'Alegreya'), serif",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "1.125rem",
                  transition: "transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
                Share with family
              </button>
              <p className="text-xs text-center" style={{ color: PC.muted }}>
                Grandma, uncle, cousin — anyone can see it and add to it
              </p>
            </div>

            {/* ── Add savings (secondary) ── */}
            <div
              className="rounded-2xl p-5"
              style={{ background: PC.surfaceContainerLow }}
            >
              <h3
                className="text-base font-bold mb-1"
                style={{ fontFamily: "var(--font-display, 'Alegreya'), serif", color: PC.text }}
              >
                Plant a seed — add savings
              </h3>
              <p className="text-sm mb-4" style={{ color: PC.muted }}>
                Start {name}&apos;s savings with a small gift. It&apos;s held safely until they&apos;re ready.
              </p>

              <div className="grid grid-cols-4 gap-2 mb-4">
                {[
                  { label: "$5", val: "5" },
                  { label: "$10", val: "10" },
                  { label: "$20", val: "20" },
                  { label: "$50", val: "50" },
                ].map(({ label, val }) => {
                  const selected = depositAmount === val
                  return (
                    <button
                      key={val}
                      onClick={() => setDepositAmount(val)}
                      className="flex items-center justify-center py-3 rounded-xl"
                      style={{
                        background: selected ? PC.goldSoft : PC.bgAlt,
                        border: selected ? `2px solid ${PC.gold}` : `1px solid ${PC.border}`,
                        cursor: "pointer",
                        transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                      }}
                    >
                      <span
                        className="text-base font-bold"
                        style={{
                          fontFamily: "var(--font-display, 'Alegreya'), serif",
                          color: selected ? PC.goldDark : PC.text,
                        }}
                      >
                        {label}
                      </span>
                    </button>
                  )
                })}
              </div>

              <button
                className="w-full py-3 font-bold flex items-center justify-center gap-2 rounded-xl"
                style={{
                  background: PC.gold,
                  color: PC.onGold,
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "var(--font-display, 'Alegreya'), serif",
                  transition: "transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                Add ${depositAmount} to {name}&apos;s keepsake
              </button>
              <button
                className="w-full text-sm mt-3 text-center"
                style={{ background: "none", border: "none", color: PC.muted, cursor: "pointer" }}
              >
                Not right now
              </button>
            </div>

            {/* ── View page ── */}
            <div className="flex flex-col gap-3 items-center">
              <button
                onClick={() => onComplete?.()}
                className="w-full py-4 font-bold flex items-center justify-center gap-2 rounded-xl"
                style={{
                  background: PC.bgAlt,
                  color: PC.text,
                  border: `1px solid ${PC.border}`,
                  cursor: "pointer",
                  fontFamily: "var(--font-display, 'Alegreya'), serif",
                  fontSize: "1rem",
                  transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              >
                View {name}&apos;s keepsake page
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
