"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { gsap, ScrollTrigger } from "@/lib/gsap"

// ─── Colors ──────────────────────────────────────────────────────────────────
const C = {
  bg: "#050510",
  warm: "#1a0f05",
  nebula: "#7C3AED",
  aurora: "#06B6D4",
  stardust: "#F59E0B",
  plasma: "#EC4899",
  text: "#F1F5F9",
  muted: "#A78BFA",
}

// ─── SVG: Tooth ──────────────────────────────────────────────────────────────
function ToothSVG({ className = "", size = 48 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size * 1.3}
      viewBox="0 0 48 62"
      fill="none"
      className={className}
    >
      {/* Crown */}
      <path
        d="M8 28C8 12 16 4 24 4C32 4 40 12 40 28C40 32 36 34 30 35C26 36 22 36 18 35C12 34 8 32 8 28Z"
        fill="currentColor"
      />
      {/* Left root */}
      <path
        d="M16 34Q14 48 17 58"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
      {/* Right root */}
      <path
        d="M32 34Q34 48 31 58"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}

// ─── SVG: Child sleeping (side silhouette) ───────────────────────────────────
function ChildSilhouette() {
  return (
    <svg viewBox="0 0 400 200" className="w-full max-w-md" fill="none">
      {/* Bed frame */}
      <rect x="40" y="130" width="320" height="12" rx="6" fill="#1a1a3a" />
      <rect x="30" y="110" width="12" height="40" rx="4" fill="#1a1a3a" />
      <rect x="358" y="110" width="12" height="40" rx="4" fill="#1a1a3a" />
      {/* Mattress */}
      <rect x="42" y="105" width="316" height="28" rx="8" fill="#12122a" />
      {/* Blanket */}
      <path
        d="M60 108 Q200 70 340 108 L340 130 L60 130 Z"
        fill="#0f0f28"
        stroke="#1a1a3a"
        strokeWidth="1"
      />
      {/* Pillow */}
      <ellipse cx="110" cy="102" rx="55" ry="18" fill="#18183a" stroke="#2a2a5a" strokeWidth="1" />
      {/* Child head */}
      <circle cx="120" cy="90" r="22" fill="#0d0d25" />
      {/* Child body under blanket */}
      <path
        d="M140 100 Q200 85 280 105"
        stroke="#0d0d25"
        strokeWidth="20"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}

// ─── SVG: Fairy silhouette ───────────────────────────────────────────────────
function FairySilhouette({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 140" className={`w-20 ${className}`} fill="none">
      {/* Left wing */}
      <path
        d="M60 50 Q20 20 30 60 Q25 80 55 70"
        fill={`${C.nebula}40`}
        stroke={C.nebula}
        strokeWidth="1"
      />
      {/* Right wing */}
      <path
        d="M60 50 Q100 20 90 60 Q95 80 65 70"
        fill={`${C.nebula}40`}
        stroke={C.nebula}
        strokeWidth="1"
      />
      {/* Body */}
      <ellipse cx="60" cy="75" rx="8" ry="20" fill="#0d0d25" />
      {/* Head */}
      <circle cx="60" cy="48" r="10" fill="#0d0d25" />
      {/* Wand */}
      <line x1="72" y1="65" x2="95" y2="45" stroke={C.stardust} strokeWidth="1.5" />
      <circle cx="97" cy="43" r="3" fill={C.stardust} />
    </svg>
  )
}

// ─── SVG: Scan Grid ──────────────────────────────────────────────────────────
function ScanGrid({ className = "" }: { className?: string }) {
  const lines = []
  for (let i = 0; i <= 20; i++) {
    const pos = i * 5
    lines.push(
      <line key={`h${i}`} x1="0" y1={pos} x2="100" y2={pos} stroke={`${C.aurora}15`} strokeWidth="0.3" />,
      <line key={`v${i}`} x1={pos} y1="0" x2={pos} y2="100" stroke={`${C.aurora}15`} strokeWidth="0.3" />
    )
  }
  return (
    <svg viewBox="0 0 100 100" className={`absolute inset-0 w-full h-full ${className}`} preserveAspectRatio="none">
      {lines}
    </svg>
  )
}

// ─── SVG: Network Node ───────────────────────────────────────────────────────
function NetworkNode({ x, y, color, size = 4, delay = 0 }: { x: number; y: number; color: string; size?: number; delay?: number }) {
  return (
    <g className="network-node" style={{ animationDelay: `${delay}s` }}>
      {/* Glow */}
      <circle cx={x} cy={y} r={size * 3} fill={`${color}15`} />
      {/* Core */}
      <circle cx={x} cy={y} r={size} fill={color} opacity="0.8" />
      {/* Center bright */}
      <circle cx={x} cy={y} r={size * 0.4} fill="white" opacity="0.9" />
    </g>
  )
}

// ─── Main Scroll Component ───────────────────────────────────────────────────
export function ToothFairyScroll({ children }: { children?: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const toothRef = useRef<HTMLDivElement>(null)
  const scene1Ref = useRef<HTMLElement>(null)
  const scene2Ref = useRef<HTMLElement>(null)
  const scene3Ref = useRef<HTMLElement>(null)
  const scene4Ref = useRef<HTMLElement>(null)
  const scene5Ref = useRef<HTMLElement>(null)
  const scene6Ref = useRef<HTMLElement>(null)
  const scanLineRef = useRef<HTMLDivElement>(null)
  const sparkleCanvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (typeof window === "undefined") return
    if (!containerRef.current) return

    const ctx = gsap.context(() => {
      // ─── Throughline Tooth Animation ──────────────────────────────
      if (toothRef.current) {
        // Track overall scroll progress and transform the tooth
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 3,
          onUpdate: (self) => {
            const p = self.progress
            const tooth = toothRef.current
            if (!tooth) return

            // Position: starts center-bottom, moves to center, then shrinks away
            const startY = 65 // vh
            const midY = 45
            const endY = 40
            let y: number, scale: number, opacity: number

            if (p < 0.17) {
              // Scene 1: under pillow, pulsing
              y = startY
              scale = 1
              opacity = 0.9
            } else if (p < 0.33) {
              // Scene 2: lifting to center with fairy
              const t = (p - 0.17) / 0.16
              y = startY + (midY - startY) * t
              scale = 1 + t * 0.3
              opacity = 1
            } else if (p < 0.5) {
              // Scene 3: center, being scanned
              y = midY
              scale = 1.5
              opacity = 1
            } else if (p < 0.67) {
              // Scene 4: shrinking to node
              const t = (p - 0.5) / 0.17
              y = midY + (endY - midY) * t
              scale = 1.5 - t * 1.2
              opacity = 1 - t * 0.3
            } else {
              // Scene 5-6: faded out
              y = endY
              scale = 0.3
              opacity = Math.max(0, 1 - (p - 0.67) * 5)
            }

            // Color shift: warm amber → cold cyan at 33%
            const isWarm = p < 0.3
            const color = isWarm ? C.stardust : C.aurora

            tooth.style.transform = `translate(-50%, -50%) scale(${scale})`
            tooth.style.top = `${y}%`
            tooth.style.opacity = `${opacity}`
            tooth.style.color = color
            tooth.style.filter = `drop-shadow(0 0 ${20 * scale}px ${color}80)`
          },
        })
      }

      // ─── Scene 1: The Pillow ─────────────────────────────────────
      if (scene1Ref.current) {
        const tl1 = gsap.timeline({
          scrollTrigger: {
            trigger: scene1Ref.current,
            start: "top top",
            end: "+=100%",
            pin: true,
            scrub: 3,
          },
        })

        tl1
          .fromTo(
            ".scene1-child",
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 0.4 }
          )
          .fromTo(
            ".scene1-text",
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.3 },
            0.3
          )
          .fromTo(
            ".scene1-glow",
            { opacity: 0, scale: 0.5 },
            { opacity: 1, scale: 1, duration: 0.3 },
            0.2
          )
      }

      // ─── Scene 2: The Fairy ──────────────────────────────────────
      if (scene2Ref.current) {
        const tl2 = gsap.timeline({
          scrollTrigger: {
            trigger: scene2Ref.current,
            start: "top top",
            end: "+=100%",
            pin: true,
            scrub: 3,
          },
        })

        tl2
          .fromTo(
            ".scene2-fairy",
            { opacity: 0, y: -100, x: 100 },
            { opacity: 1, y: 0, x: 0, duration: 0.5 }
          )
          .fromTo(
            ".scene2-trail",
            { opacity: 0, scaleX: 0 },
            { opacity: 0.6, scaleX: 1, duration: 0.4 },
            0.1
          )
          .fromTo(
            ".scene2-text",
            { opacity: 0 },
            { opacity: 1, duration: 0.3 },
            0.4
          )
          .fromTo(
            ".scene2-flash",
            { opacity: 0, scale: 0 },
            { opacity: 1, scale: 2, duration: 0.2 },
            0.7
          )
          .to(".scene2-flash", { opacity: 0, duration: 0.1 })
      }

      // ─── Scene 3: The Scan (HARD CUT — cold aesthetic) ───────────
      if (scene3Ref.current) {
        const tl3 = gsap.timeline({
          scrollTrigger: {
            trigger: scene3Ref.current,
            start: "top top",
            end: "+=120%",
            pin: true,
            scrub: 3,
          },
        })

        tl3
          .fromTo(
            ".scene3-grid",
            { opacity: 0 },
            { opacity: 1, duration: 0.3 }
          )
          .fromTo(
            ".scene3-scanline",
            { top: "0%" },
            { top: "100%", duration: 0.5 },
            0
          )
          .fromTo(
            ".scene3-data-1",
            { opacity: 0, x: -30 },
            { opacity: 1, x: 0, duration: 0.2 },
            0.2
          )
          .fromTo(
            ".scene3-data-2",
            { opacity: 0, x: 30 },
            { opacity: 1, x: 0, duration: 0.2 },
            0.3
          )
          .fromTo(
            ".scene3-data-3",
            { opacity: 0, x: -30 },
            { opacity: 1, x: 0, duration: 0.2 },
            0.4
          )
          .fromTo(
            ".scene3-verified",
            { opacity: 0, scale: 0.5, rotation: -10 },
            { opacity: 1, scale: 1, rotation: 0, duration: 0.3 },
            0.6
          )
          .fromTo(
            ".scene3-text",
            { opacity: 0 },
            { opacity: 1, duration: 0.2 },
            0.7
          )
      }

      // ─── Scene 4: The Network ────────────────────────────────────
      if (scene4Ref.current) {
        const tl4 = gsap.timeline({
          scrollTrigger: {
            trigger: scene4Ref.current,
            start: "top top",
            end: "+=100%",
            pin: true,
            scrub: 3,
          },
        })

        tl4
          .fromTo(
            ".scene4-center-node",
            { opacity: 0, scale: 0 },
            { opacity: 1, scale: 1, duration: 0.2 }
          )
          .fromTo(
            ".scene4-connections",
            { opacity: 0, scale: 0.3 },
            { opacity: 1, scale: 1, duration: 0.4 },
            0.1
          )
          .fromTo(
            ".scene4-outer-nodes",
            { opacity: 0 },
            { opacity: 1, duration: 0.4, stagger: 0.02 },
            0.2
          )
          .fromTo(
            ".scene4-counter",
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.3 },
            0.5
          )
          .fromTo(
            ".scene4-text",
            { opacity: 0 },
            { opacity: 1, duration: 0.2 },
            0.6
          )
      }

      // ─── Scene 5: The Globe ──────────────────────────────────────
      if (scene5Ref.current) {
        const tl5 = gsap.timeline({
          scrollTrigger: {
            trigger: scene5Ref.current,
            start: "top top",
            end: "+=100%",
            pin: true,
            scrub: 3,
          },
        })

        tl5
          .fromTo(
            ".scene5-globe",
            { opacity: 0, scale: 0.8 },
            { opacity: 1, scale: 1, duration: 0.5 }
          )
          .fromTo(
            ".scene5-label",
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.3 },
            0.3
          )
      }

      // ─── Scene 6: The CTA ────────────────────────────────────────
      if (scene6Ref.current) {
        const tl6 = gsap.timeline({
          scrollTrigger: {
            trigger: scene6Ref.current,
            start: "top top",
            end: "+=80%",
            pin: true,
            scrub: 3,
          },
        })

        tl6
          .fromTo(
            ".scene6-card",
            { opacity: 0, y: 40, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 0.5 }
          )
          .fromTo(
            ".scene6-text",
            { opacity: 0 },
            { opacity: 1, duration: 0.3 },
            0.2
          )
      }
    }, containerRef)

    // ─── Sparkle particles (ambient) ─────────────────────────────
    const canvas = sparkleCanvasRef.current
    if (canvas) {
      const ctxCanvas = canvas.getContext("2d")
      if (ctxCanvas) {
        const dpr = 2
        const resize = () => {
          canvas.width = window.innerWidth * dpr
          canvas.height = window.innerHeight * dpr
          canvas.style.width = `${window.innerWidth}px`
          canvas.style.height = `${window.innerHeight}px`
        }
        resize()
        window.addEventListener("resize", resize)

        // Seeded sparkles
        let seed = 42
        const rand = () => {
          seed = (seed * 16807) % 2147483647
          return (seed - 1) / 2147483646
        }

        const sparkles = Array.from({ length: 40 }, () => ({
          x: rand() * window.innerWidth * dpr,
          y: rand() * window.innerHeight * dpr,
          size: 1 + rand() * 2,
          speed: 0.2 + rand() * 0.5,
          phase: rand() * Math.PI * 2,
        }))

        let raf = 0
        let time = 0
        const draw = () => {
          time += 0.02
          ctxCanvas.clearRect(0, 0, canvas.width, canvas.height)

          // Color based on scroll position
          const scrollP = window.scrollY / (document.body.scrollHeight - window.innerHeight)
          const isWarm = scrollP < 0.3
          const color = isWarm ? C.stardust : C.muted

          for (const s of sparkles) {
            const alpha = 0.3 + 0.4 * Math.sin(time * s.speed + s.phase)
            ctxCanvas.beginPath()
            ctxCanvas.arc(s.x, s.y, s.size * dpr, 0, Math.PI * 2)
            ctxCanvas.fillStyle = color
            ctxCanvas.globalAlpha = alpha
            ctxCanvas.fill()
          }
          ctxCanvas.globalAlpha = 1
          raf = requestAnimationFrame(draw)
        }
        raf = requestAnimationFrame(draw)

        return () => {
          cancelAnimationFrame(raf)
          window.removeEventListener("resize", resize)
          ctx.revert()
        }
      }
    }

    return () => ctx.revert()
  }, [])

  // ─── Node positions for Scene 4 ──────────────────────────────────────────
  const nodes = [
    // Inner ring
    { x: 50, y: 30, color: C.aurora, delay: 0 },
    { x: 75, y: 40, color: C.plasma, delay: 0.1 },
    { x: 80, y: 60, color: C.stardust, delay: 0.15 },
    { x: 65, y: 78, color: C.nebula, delay: 0.2 },
    { x: 35, y: 78, color: C.aurora, delay: 0.25 },
    { x: 20, y: 60, color: C.plasma, delay: 0.3 },
    { x: 25, y: 40, color: C.stardust, delay: 0.35 },
    // Outer ring
    { x: 50, y: 15, color: C.nebula, delay: 0.4 },
    { x: 85, y: 25, color: C.aurora, delay: 0.45 },
    { x: 95, y: 50, color: C.stardust, delay: 0.5 },
    { x: 85, y: 75, color: C.plasma, delay: 0.55 },
    { x: 50, y: 90, color: C.aurora, delay: 0.6 },
    { x: 15, y: 75, color: C.nebula, delay: 0.65 },
    { x: 5, y: 50, color: C.stardust, delay: 0.7 },
    { x: 15, y: 25, color: C.plasma, delay: 0.75 },
  ]

  return (
    <div ref={containerRef} className="relative" style={{ background: C.bg }}>
      {/* ─── Fixed sparkle canvas ────────────────────────────────── */}
      <canvas
        ref={sparkleCanvasRef}
        className="fixed inset-0 z-[1] pointer-events-none"
      />

      {/* ─── Throughline Tooth (fixed position) ──────────────────── */}
      <div
        ref={toothRef}
        className="fixed left-1/2 z-30 pointer-events-none transition-colors duration-700"
        style={{
          top: "65%",
          transform: "translate(-50%, -50%)",
          color: C.stardust,
          filter: `drop-shadow(0 0 20px ${C.stardust}80)`,
        }}
      >
        <ToothSVG size={48} />
      </div>

      {/* ─── Background color shift layer ────────────────────────── */}
      <div
        className="fixed inset-0 z-0 transition-all duration-1000"
        id="bg-shift"
      />

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* SCENE 1: THE PILLOW                                       */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section
        ref={scene1Ref}
        className="relative z-10 h-screen flex flex-col items-center justify-center overflow-hidden"
      >
        {/* Warm ambient glow */}
        <div
          className="scene1-glow absolute w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, ${C.stardust}15 0%, transparent 70%)`,
            top: "30%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* Child in bed */}
        <div className="scene1-child relative">
          <ChildSilhouette />
          {/* Tooth glow under pillow */}
          <div
            className="absolute w-8 h-8 rounded-full"
            style={{
              left: "22%",
              top: "58%",
              background: `radial-gradient(circle, ${C.stardust}60 0%, ${C.stardust}00 70%)`,
              animation: "toothPulse 2s ease-in-out infinite",
            }}
          />
        </div>

        {/* Text */}
        <p
          className="scene1-text mt-12 text-lg sm:text-xl font-display tracking-wide"
          style={{ color: `${C.text}cc` }}
        >
          A tooth falls.
        </p>

        {/* Scroll hint */}
        <div className="absolute bottom-8 flex flex-col items-center gap-2 opacity-40">
          <span className="text-xs font-mono" style={{ color: C.muted }}>scroll</span>
          <div
            className="w-px h-8"
            style={{
              background: `linear-gradient(to bottom, ${C.muted}40, transparent)`,
              animation: "scrollPulse 2s ease-in-out infinite",
            }}
          />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* SCENE 2: THE FAIRY                                        */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section
        ref={scene2Ref}
        className="relative z-10 h-screen flex flex-col items-center justify-center overflow-hidden"
      >
        {/* Sparkle trail */}
        <div
          className="scene2-trail absolute origin-right"
          style={{
            width: "200px",
            height: "2px",
            top: "35%",
            right: "50%",
            background: `linear-gradient(90deg, transparent, ${C.nebula}60, ${C.stardust}80)`,
            filter: `blur(2px)`,
          }}
        />

        {/* Fairy */}
        <div className="scene2-fairy relative">
          <FairySilhouette />
        </div>

        {/* Flash effect */}
        <div
          className="scene2-flash absolute w-32 h-32 rounded-full pointer-events-none"
          style={{
            background: `radial-gradient(circle, white 0%, ${C.stardust}40 40%, transparent 70%)`,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%) scale(0)",
          }}
        />

        {/* Text */}
        <p
          className="scene2-text mt-8 text-lg sm:text-xl font-display tracking-wide"
          style={{ color: `${C.text}cc` }}
        >
          Collected.
        </p>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* SCENE 3: THE SCAN (HARD CUT — COLD AESTHETIC)             */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section
        ref={scene3Ref}
        className="relative z-10 h-screen flex flex-col items-center justify-center overflow-hidden"
        style={{ background: C.bg }}
      >
        {/* Grid overlay */}
        <ScanGrid className="scene3-grid" />

        {/* Scan line */}
        <div
          ref={scanLineRef}
          className="scene3-scanline absolute left-0 right-0 h-[2px] z-20 pointer-events-none"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${C.aurora} 50%, transparent 100%)`,
            boxShadow: `0 0 20px ${C.aurora}, 0 0 60px ${C.aurora}40`,
            top: "0%",
          }}
        />

        {/* Data readouts */}
        <div className="relative z-10 flex flex-col items-center gap-6">
          {/* Tooth placeholder space (throughline tooth is here) */}
          <div className="h-20" />

          <div className="flex flex-col sm:flex-row gap-6 sm:gap-12 text-center">
            <div className="scene3-data-1">
              <span className="text-[10px] font-mono uppercase tracking-widest block" style={{ color: `${C.aurora}80` }}>
                Calcium
              </span>
              <span className="text-2xl font-mono font-bold" style={{ color: C.aurora }}>
                96.2%
              </span>
            </div>

            <div className="scene3-data-2">
              <span className="text-[10px] font-mono uppercase tracking-widest block" style={{ color: `${C.aurora}80` }}>
                Block Hash
              </span>
              <span className="text-sm font-mono" style={{ color: C.aurora }}>
                0x7a2f...4e9c
              </span>
            </div>

            <div className="scene3-data-3">
              <span className="text-[10px] font-mono uppercase tracking-widest block" style={{ color: `${C.aurora}80` }}>
                Dentin
              </span>
              <span className="text-2xl font-mono font-bold" style={{ color: C.aurora }}>
                1.8mm
              </span>
            </div>
          </div>

          {/* VERIFIED stamp */}
          <div
            className="scene3-verified mt-4 px-6 py-2 rounded-full border"
            style={{
              borderColor: `${C.aurora}40`,
              background: `${C.aurora}10`,
              boxShadow: `0 0 30px ${C.aurora}20`,
            }}
          >
            <span className="text-sm font-mono font-bold tracking-widest" style={{ color: C.aurora }}>
              ✓ VERIFIED ON-CHAIN
            </span>
          </div>
        </div>

        {/* Text */}
        <p
          className="scene3-text mt-8 text-lg sm:text-xl font-display tracking-wide"
          style={{ color: `${C.text}cc` }}
        >
          Verified on-chain.
        </p>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* SCENE 4: THE NETWORK                                      */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section
        ref={scene4Ref}
        className="relative z-10 h-screen flex flex-col items-center justify-center overflow-hidden"
      >
        {/* Node network visualization */}
        <div className="relative w-full max-w-lg aspect-square">
          {/* Connection lines */}
          <svg
            viewBox="0 0 100 100"
            className="scene4-connections absolute inset-0 w-full h-full"
            fill="none"
          >
            {/* Lines from center to inner ring */}
            {nodes.slice(0, 7).map((n, i) => (
              <line
                key={`c${i}`}
                x1="50" y1="50"
                x2={n.x} y2={n.y}
                stroke={n.color}
                strokeWidth="0.3"
                opacity="0.4"
                strokeDasharray="2 2"
              />
            ))}
            {/* Lines from inner to outer */}
            {nodes.slice(7).map((n, i) => (
              <line
                key={`o${i}`}
                x1={nodes[i % 7].x} y1={nodes[i % 7].y}
                x2={n.x} y2={n.y}
                stroke={n.color}
                strokeWidth="0.2"
                opacity="0.3"
                strokeDasharray="1 3"
              />
            ))}
          </svg>

          {/* Center node (the verified tooth) */}
          <svg viewBox="0 0 100 100" className="scene4-center-node absolute inset-0 w-full h-full">
            <NetworkNode x={50} y={50} color={C.aurora} size={6} />
          </svg>

          {/* Outer nodes */}
          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
            {nodes.map((n, i) => (
              <g key={i} className="scene4-outer-nodes">
                <NetworkNode x={n.x} y={n.y} color={n.color} size={3} delay={n.delay} />
              </g>
            ))}
          </svg>
        </div>

        {/* Counter */}
        <div
          className="scene4-counter mt-8 flex items-center gap-6 text-center"
        >
          <div>
            <span className="text-3xl font-mono font-bold" style={{ color: C.text }}>
              47,832
            </span>
            <span className="text-xs font-mono block mt-1" style={{ color: `${C.muted}80` }}>
              teeth
            </span>
          </div>
          <div className="w-px h-8" style={{ background: `${C.muted}30` }} />
          <div>
            <span className="text-3xl font-mono font-bold" style={{ color: C.text }}>
              84
            </span>
            <span className="text-xs font-mono block mt-1" style={{ color: `${C.muted}80` }}>
              countries
            </span>
          </div>
          <div className="w-px h-8" style={{ background: `${C.muted}30` }} />
          <div>
            <span className="text-3xl font-mono font-bold" style={{ color: C.text }}>
              1,247
            </span>
            <span className="text-xs font-mono block mt-1" style={{ color: `${C.muted}80` }}>
              fairies
            </span>
          </div>
        </div>

        {/* Text */}
        <p
          className="scene4-text mt-6 text-lg sm:text-xl font-display tracking-wide"
          style={{ color: `${C.text}cc` }}
        >
          One network.
        </p>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* SCENE 5: THE GLOBE                                        */}
      {/* Cosmic Globe is rendered by the parent page via children   */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section
        ref={scene5Ref}
        className="relative z-10 h-screen flex flex-col items-center justify-center overflow-hidden"
      >
        <div className="scene5-globe relative">
          {children}
        </div>

        <p
          className="scene5-label mt-4 text-sm font-mono"
          style={{ color: `${C.muted}80` }}
        >
          Explore the network
        </p>
      </section>

      {/* ═══════════════════════════════════════════════════════════ */}
      {/* SCENE 6: THE CTA                                          */}
      {/* ═══════════════════════════════════════════════════════════ */}
      <section
        ref={scene6Ref}
        className="relative z-10 h-screen flex flex-col items-center justify-center overflow-hidden px-6"
      >
        <div
          className="scene6-card w-full max-w-md rounded-3xl p-8 sm:p-12 text-center"
          style={{
            background: "linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(20px)",
            boxShadow: `0 0 60px ${C.nebula}10, 0 20px 60px rgba(0,0,0,0.5)`,
          }}
        >
          <p
            className="scene6-text text-2xl sm:text-3xl font-display tracking-tight mb-2"
            style={{ color: C.text }}
          >
            Ownership starts young.
          </p>
          <p
            className="text-sm mb-8"
            style={{ color: `${C.muted}99` }}
          >
            Every tooth tells a story. Make yours permanent.
          </p>

          {/* Email form */}
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-4 py-3 rounded-xl text-sm font-mono outline-none"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: C.text,
              }}
            />
            <button
              className="px-6 py-3 rounded-xl text-sm font-mono font-bold transition-all hover:scale-105"
              style={{
                background: `linear-gradient(135deg, ${C.nebula}, ${C.aurora})`,
                color: "white",
                boxShadow: `0 0 20px ${C.nebula}40`,
              }}
            >
              Join
            </button>
          </div>
        </div>
      </section>

      {/* ─── Global animation keyframes ──────────────────────────── */}
      <style jsx global>{`
        @keyframes toothPulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.3); opacity: 1; }
        }
        @keyframes scrollPulse {
          0%, 100% { transform: scaleY(1); }
          50% { transform: scaleY(0.5); }
        }
      `}</style>
    </div>
  )
}
