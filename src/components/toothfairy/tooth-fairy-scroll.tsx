"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { gsap, ScrollTrigger } from "@/lib/gsap"

// ─── Colors ──────────────────────────────────────────────────────────────────
const C = {
  bg: "#050510",
  room: "#0a0a20",
  wall: "#12123a",
  nebula: "#7C3AED",
  aurora: "#06B6D4",
  stardust: "#F59E0B",
  plasma: "#EC4899",
  text: "#F1F5F9",
  muted: "#A78BFA",
  green: "#22C55E",
}

// ─── Tooth card data (from V1) ───────────────────────────────────────────────
const TOOTH_CARDS = [
  { name: "Central Incisor", code: "A", region: "Upper", calcium: 96.2, dentin: 1.8, rarity: "RARE", hash: "0x7a2f...4e9c", tokenId: "#1091", color: C.aurora },
  { name: "Lateral Incisor", code: "B", region: "Upper", calcium: 95.8, dentin: 1.6, rarity: "COMMON", hash: "0x3b91...7d2a", tokenId: "#0734", color: C.nebula },
  { name: "Canine", code: "C", region: "Lower", calcium: 97.1, dentin: 2.2, rarity: "LEGENDARY", hash: "0xf4c2...8b1e", tokenId: "#2047", color: C.stardust },
  { name: "First Molar", code: "D", region: "Upper", calcium: 96.5, dentin: 2.4, rarity: "UNCOMMON", hash: "0x9e7d...1a5f", tokenId: "#0412", color: C.plasma },
  { name: "Second Molar", code: "E", region: "Lower", calcium: 96.9, dentin: 2.6, rarity: "RARE", hash: "0x2d8a...6c3b", tokenId: "#0558", color: C.aurora },
]

const RARITY_COLORS: Record<string, string> = {
  COMMON: "#94A3B8",
  UNCOMMON: "#22C55E",
  RARE: "#3B82F6",
  LEGENDARY: "#F59E0B",
}

// ─── SVG: Tooth (realistic molar shape) ──────────────────────────────────────
function ToothSVG({ className = "", size = 48 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 60 72" fill="none" className={className}>
      {/* Crown — wide, rounded, with cusp indentation */}
      <path
        d="M10 30 C10 10, 20 2, 30 2 C40 2, 50 10, 50 30 C50 36, 44 38, 38 37 C34 36, 30 34, 26 36 C22 38, 10 36, 10 30Z"
        fill="currentColor"
      />
      {/* Left root — tapered */}
      <path
        d="M18 36 C17 44, 15 56, 18 66"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
      {/* Right root — tapered */}
      <path
        d="M42 36 C43 44, 45 56, 42 66"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  )
}

// ─── SVG: Full Bedroom Scene ─────────────────────────────────────────────────
function BedroomScene() {
  return (
    <svg viewBox="0 0 800 500" className="w-full max-w-3xl" fill="none">
      {/* Back wall */}
      <rect x="0" y="0" width="800" height="500" fill={C.room} />
      {/* Floor */}
      <rect x="0" y="380" width="800" height="120" fill="#08081a" />
      <line x1="0" y1="380" x2="800" y2="380" stroke="#1a1a4a" strokeWidth="1" />

      {/* Window */}
      <rect x="480" y="60" width="180" height="220" rx="8" fill="#030318" stroke="#2a2a5a" strokeWidth="2" />
      {/* Window frame cross */}
      <line x1="570" y1="60" x2="570" y2="280" stroke="#2a2a5a" strokeWidth="2" />
      <line x1="480" y1="170" x2="660" y2="170" stroke="#2a2a5a" strokeWidth="2" />
      {/* Moon */}
      <circle cx="550" cy="120" r="25" fill="#F5F0D0" opacity="0.8" />
      <circle cx="560" cy="115" r="22" fill="#030318" />
      {/* Stars through window */}
      <circle cx="510" cy="95" r="1.5" fill="white" opacity="0.7" />
      <circle cx="620" cy="100" r="1" fill="white" opacity="0.5" />
      <circle cx="530" cy="150" r="1" fill="white" opacity="0.6" />
      <circle cx="600" cy="200" r="1.5" fill="white" opacity="0.4" />
      <circle cx="640" cy="140" r="1" fill="white" opacity="0.5" />
      {/* Moonlight beam on floor */}
      <path d="M480 280 L400 380 L660 380 L660 280Z" fill={`${C.stardust}05`} />

      {/* Nightstand */}
      <rect x="60" y="280" width="80" height="100" rx="4" fill="#151540" stroke="#2a2a5a" strokeWidth="1" />
      {/* Lamp */}
      <rect x="88" y="240" width="24" height="40" rx="2" fill="#1a1a4a" />
      <ellipse cx="100" cy="238" rx="20" ry="10" fill="#222260" />
      {/* Lamp glow */}
      <circle cx="100" cy="238" r="30" fill={`${C.stardust}08`} />

      {/* Poster/picture on wall */}
      <rect x="300" y="80" width="100" height="70" rx="3" fill="#0e0e30" stroke="#2a2a5a" strokeWidth="1" />

      {/* Bed — headboard */}
      <rect x="140" y="240" width="340" height="15" rx="6" fill="#1e1e50" />
      {/* Bed — mattress */}
      <rect x="140" y="255" width="340" height="80" rx="6" fill="#151540" />
      {/* Bed — footboard */}
      <rect x="140" y="335" width="340" height="60" rx="4" fill="#1a1a4a" stroke="#2a2a5a" strokeWidth="1" />
      {/* Bed legs */}
      <rect x="150" y="390" width="10" height="10" rx="2" fill="#1a1a4a" />
      <rect x="460" y="390" width="10" height="10" rx="2" fill="#1a1a4a" />

      {/* Blanket */}
      <path
        d="M150 280 Q310 240 470 280 L470 335 L150 335 Z"
        fill="#12124a"
        stroke="#2a2a6a"
        strokeWidth="1"
      />
      {/* Blanket fold line */}
      <path d="M170 300 Q310 270 460 300" stroke="#1a1a5a" strokeWidth="1" fill="none" />

      {/* Pillow */}
      <ellipse cx="210" cy="268" rx="60" ry="20" fill="#1e1e5a" stroke="#2a2a6a" strokeWidth="1" />

      {/* Child silhouette */}
      <circle cx="220" cy="256" r="24" fill="#0c0c30" />
      {/* Child body under blanket */}
      <path d="M240 270 Q320 250 420 280" stroke="#0c0c30" strokeWidth="22" strokeLinecap="round" fill="none" />

      {/* Tooth glow under pillow — the key visual */}
      <circle cx="185" cy="278" r="20" fill={`${C.stardust}20`}>
        <animate attributeName="r" values="18;24;18" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="185" cy="278" r="8" fill={`${C.stardust}50`}>
        <animate attributeName="r" values="6;10;6" dur="2s" repeatCount="indefinite" />
      </circle>
      {/* Tiny tooth icon under pillow */}
      <g transform="translate(179, 272) scale(0.15)" fill={C.stardust}>
        <path d="M10 30 C10 10, 20 2, 30 2 C40 2, 50 10, 50 30 C50 36, 44 38, 38 37 C34 36, 30 34, 26 36 C22 38, 10 36, 10 30Z" />
      </g>

      {/* Rug on floor */}
      <ellipse cx="350" cy="410" rx="150" ry="25" fill="#0e0e2a" stroke="#1a1a3a" strokeWidth="1" />
    </svg>
  )
}

// ─── SVG: Fairy with glow ────────────────────────────────────────────────────
function FairyScene() {
  return (
    <svg viewBox="0 0 600 400" className="w-full max-w-2xl" fill="none">
      {/* Room backdrop faded */}
      <rect x="0" y="0" width="600" height="400" fill={C.room} opacity="0.5" />

      {/* Fairy glow aura */}
      <circle cx="300" cy="140" r="100" fill={`${C.nebula}10`} />
      <circle cx="300" cy="140" r="60" fill={`${C.nebula}15`} />

      {/* Sparkle trail from top-right to fairy */}
      <path d="M500 20 Q420 60 350 100 Q320 120 300 150" stroke={`${C.stardust}60`} strokeWidth="2" strokeDasharray="4 6" className="scene2-trail-path" />
      {/* Trail glow */}
      <path d="M500 20 Q420 60 350 100 Q320 120 300 150" stroke={`${C.stardust}20`} strokeWidth="8" className="scene2-trail-glow" />

      {/* Sparkle dots along trail */}
      <circle cx="480" cy="35" r="2" fill={C.stardust} opacity="0.6" />
      <circle cx="430" cy="60" r="3" fill={C.stardust} opacity="0.8" />
      <circle cx="380" cy="85" r="2" fill={C.nebula} opacity="0.7" />
      <circle cx="340" cy="108" r="2.5" fill={C.stardust} opacity="0.5" />

      {/* Fairy — wings + body, brighter */}
      <g transform="translate(260, 100)">
        {/* Left wing — filled with gradient feel */}
        <path d="M40 40 Q5 10 15 50 Q10 70 35 60" fill={`${C.nebula}50`} stroke={C.nebula} strokeWidth="1.5" />
        {/* Right wing */}
        <path d="M40 40 Q75 10 65 50 Q70 70 45 60" fill={`${C.nebula}50`} stroke={C.nebula} strokeWidth="1.5" />
        {/* Body glow */}
        <ellipse cx="40" cy="60" rx="12" ry="22" fill={`${C.nebula}30`} />
        {/* Body */}
        <ellipse cx="40" cy="60" rx="7" ry="18" fill="#1a1050" stroke={C.nebula} strokeWidth="0.5" />
        {/* Head */}
        <circle cx="40" cy="36" r="9" fill="#1a1050" stroke={C.nebula} strokeWidth="0.5" />
        {/* Wand */}
        <line x1="50" y1="52" x2="70" y2="35" stroke={C.stardust} strokeWidth="1.5" />
        <circle cx="72" cy="33" r="4" fill={C.stardust} />
        {/* Wand glow */}
        <circle cx="72" cy="33" r="10" fill={`${C.stardust}20`}>
          <animate attributeName="r" values="8;14;8" dur="1.5s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* Connection beam: fairy → tooth at bottom */}
      <line x1="300" y1="180" x2="300" y2="300" stroke={C.stardust} strokeWidth="2" opacity="0.4" strokeDasharray="4 4" className="scene2-beam" />
      <line x1="300" y1="180" x2="300" y2="300" stroke={C.stardust} strokeWidth="6" opacity="0.1" className="scene2-beam-glow" />

      {/* Tooth being lifted */}
      <g transform="translate(286, 280)" className="scene2-tooth-lift">
        <circle cx="14" cy="14" r="20" fill={`${C.stardust}20`} />
        <g fill={C.stardust} transform="scale(0.4)">
          <path d="M10 30 C10 10, 20 2, 30 2 C40 2, 50 10, 50 30 C50 36, 44 38, 38 37 C34 36, 30 34, 26 36 C22 38, 10 36, 10 30Z" />
          <path d="M18 36 C17 44, 15 56, 18 66" stroke={C.stardust} strokeWidth="6" strokeLinecap="round" />
          <path d="M42 36 C43 44, 45 56, 42 66" stroke={C.stardust} strokeWidth="6" strokeLinecap="round" />
        </g>
      </g>
    </svg>
  )
}

// ─── SVG: Scan Grid ──────────────────────────────────────────────────────────
function ScanGrid() {
  const lines = []
  for (let i = 0; i <= 24; i++) {
    const pos = (i / 24) * 100
    lines.push(
      <line key={`h${i}`} x1="0" y1={pos} x2="100" y2={pos} stroke={`${C.aurora}12`} strokeWidth="0.3" />,
      <line key={`v${i}`} x1={pos} y1="0" x2={pos} y2="100" stroke={`${C.aurora}12`} strokeWidth="0.3" />
    )
  }
  return (
    <svg viewBox="0 0 100 100" className="scene3-grid absolute inset-0 w-full h-full" preserveAspectRatio="none">{lines}</svg>
  )
}

// ─── NFT Tooth Card Component ────────────────────────────────────────────────
function ToothCard({ card, className = "" }: { card: typeof TOOTH_CARDS[0]; className?: string }) {
  return (
    <div
      className={`rounded-2xl p-5 w-64 flex-shrink-0 ${className}`}
      style={{
        background: "linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)",
        border: `1px solid ${card.color}25`,
        boxShadow: `0 0 30px ${card.color}10`,
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color: `${card.color}80` }}>
          {card.region} · {card.code}
        </span>
        <span
          className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full"
          style={{
            color: RARITY_COLORS[card.rarity],
            background: `${RARITY_COLORS[card.rarity]}15`,
            border: `1px solid ${RARITY_COLORS[card.rarity]}30`,
          }}
        >
          {card.rarity}
        </span>
      </div>

      {/* Tooth icon */}
      <div className="flex justify-center my-3">
        <div style={{ color: card.color, filter: `drop-shadow(0 0 12px ${card.color}60)` }}>
          <ToothSVG size={36} />
        </div>
      </div>

      {/* Name */}
      <h4 className="text-sm font-display font-bold mb-3" style={{ color: C.text }}>
        {card.name}
      </h4>

      {/* Data rows */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-[10px] font-mono">
          <span style={{ color: `${C.muted}60` }}>Calcium</span>
          <span style={{ color: C.aurora }}>{card.calcium}%</span>
        </div>
        <div className="flex justify-between text-[10px] font-mono">
          <span style={{ color: `${C.muted}60` }}>Dentin</span>
          <span style={{ color: C.aurora }}>{card.dentin}mm</span>
        </div>
        <div className="flex justify-between text-[10px] font-mono">
          <span style={{ color: `${C.muted}60` }}>Block</span>
          <span style={{ color: `${C.muted}80` }}>{card.hash}</span>
        </div>
        <div className="flex justify-between text-[10px] font-mono">
          <span style={{ color: `${C.muted}60` }}>Token</span>
          <span style={{ color: card.color }}>{card.tokenId}</span>
        </div>
      </div>

      {/* Verified badge */}
      <div
        className="mt-3 text-center py-1.5 rounded-lg text-[10px] font-mono font-bold tracking-wider"
        style={{
          background: `${C.green}10`,
          border: `1px solid ${C.green}25`,
          color: C.green,
        }}
      >
        ✓ VERIFIED
      </div>
    </div>
  )
}

// ─── SVG: Wallet Icon ────────────────────────────────────────────────────────
function WalletIcon({ className = "", lit = false }: { className?: string; lit?: boolean }) {
  const color = lit ? C.green : C.muted
  return (
    <svg viewBox="0 0 100 100" className={`w-24 h-24 ${className}`} fill="none">
      {/* Glow when lit */}
      {lit && <circle cx="50" cy="50" r="48" fill={`${C.green}10`} />}
      {/* Wallet body */}
      <rect x="15" y="25" width="70" height="50" rx="8" fill={`${color}15`} stroke={color} strokeWidth="2" />
      {/* Wallet flap */}
      <path d="M55 25 L55 45 Q55 52 62 52 L85 52 L85 40 Q85 25 70 25 Z" fill={`${color}10`} stroke={color} strokeWidth="2" />
      {/* Clasp circle */}
      <circle cx="75" cy="48" r="5" fill={color} opacity="0.8" />
      {lit && <circle cx="75" cy="48" r="3" fill="white" />}
    </svg>
  )
}

// ─── Network Node SVG ────────────────────────────────────────────────────────
function NetworkNode({ x, y, color, size = 4 }: { x: number; y: number; color: string; size?: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={size * 3} fill={`${color}12`} />
      <circle cx={x} cy={y} r={size} fill={color} opacity="0.85" />
      <circle cx={x} cy={y} r={size * 0.4} fill="white" opacity="0.9" />
    </g>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN SCROLL COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════
export function ToothFairyScroll({ children }: { children?: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const toothRef = useRef<HTMLDivElement>(null)
  const s1 = useRef<HTMLElement>(null)
  const s2 = useRef<HTMLElement>(null)
  const s3 = useRef<HTMLElement>(null)
  const s4 = useRef<HTMLElement>(null)
  const s5 = useRef<HTMLElement>(null)
  const s6 = useRef<HTMLElement>(null)
  const s7 = useRef<HTMLElement>(null)
  const s8 = useRef<HTMLElement>(null)
  const sparkleRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (typeof window === "undefined" || !containerRef.current) return

    const ctx = gsap.context(() => {
      // ─── Throughline Tooth ─────────────────────────────────────
      if (toothRef.current) {
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 3,
          onUpdate: (self) => {
            const p = self.progress
            const t = toothRef.current
            if (!t) return

            let y: number, scale: number, opacity: number
            const isWarm = p < 0.25
            const color = isWarm ? C.stardust : C.aurora

            if (p < 0.125) {
              // Scene 1: under pillow
              y = 62; scale = 0.8; opacity = 0.7
            } else if (p < 0.25) {
              // Scene 2: lifting with fairy
              const f = (p - 0.125) / 0.125
              y = 62 - f * 20; scale = 0.8 + f * 0.5; opacity = 0.9 + f * 0.1
            } else if (p < 0.375) {
              // Scene 3: center, being scanned
              y = 42; scale = 1.5; opacity = 1
            } else if (p < 0.5) {
              // Scene 4: inside NFT card
              y = 42; scale = 1.2; opacity = 0.6
            } else if (p < 0.625) {
              // Scene 5: shrinks to network node
              const f = (p - 0.5) / 0.125
              y = 42 + f * 5; scale = 1.2 - f * 0.9; opacity = 0.6 - f * 0.3
            } else if (p < 0.75) {
              // Scene 6: flies to wallet
              const f = (p - 0.625) / 0.125
              y = 47 - f * 10; scale = 0.3; opacity = 0.3 * (1 - f)
            } else {
              // Scene 7-8: gone
              y = 37; scale = 0.2; opacity = 0
            }

            t.style.top = `${y}%`
            t.style.transform = `translate(-50%, -50%) scale(${scale})`
            t.style.opacity = `${opacity}`
            t.style.color = color
            t.style.filter = `drop-shadow(0 0 ${16 * scale}px ${color}80)`
          },
        })
      }

      // Helper to create pinned scene timelines
      const pin = (ref: React.RefObject<HTMLElement | null>, end: string, scrub = 3) => {
        if (!ref.current) return gsap.timeline()
        return gsap.timeline({
          scrollTrigger: { trigger: ref.current, start: "top top", end: `+=${end}`, pin: true, scrub },
        })
      }

      // ─── Scene 1: The Room ─────────────────────────────────────
      pin(s1, "120%")
        .fromTo(".s1-room", { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.5 })
        .fromTo(".s1-text", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.3 }, 0.4)

      // ─── Scene 2: The Fairy ────────────────────────────────────
      pin(s2, "120%")
        .fromTo(".s2-scene", { opacity: 0 }, { opacity: 1, duration: 0.3 })
        .fromTo(".s2-text", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.3 }, 0.3)
        .fromTo(".s2-flash", { opacity: 0, scale: 0 }, { opacity: 1, scale: 2.5, duration: 0.15 }, 0.7)
        .to(".s2-flash", { opacity: 0, duration: 0.1 })

      // ─── Scene 3: The Scan ─────────────────────────────────────
      pin(s3, "140%")
        .fromTo(".scene3-grid", { opacity: 0 }, { opacity: 1, duration: 0.2 })
        .fromTo(".s3-scanline", { top: "0%" }, { top: "100%", duration: 0.5 }, 0)
        .fromTo(".s3-data", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.2, stagger: 0.08 }, 0.15)
        .fromTo(".s3-verified", { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.25 }, 0.55)
        .fromTo(".s3-text", { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0.7)

      // ─── Scene 4: The NFT ──────────────────────────────────────
      pin(s4, "120%")
        .fromTo(".s4-card", { opacity: 0, scale: 0.8, rotateY: -15 }, { opacity: 1, scale: 1, rotateY: 0, duration: 0.5 })
        .fromTo(".s4-stamp", { opacity: 0, scale: 2 }, { opacity: 1, scale: 1, duration: 0.3 }, 0.4)
        .fromTo(".s4-text", { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0.6)

      // ─── Scene 5: The Network ──────────────────────────────────
      pin(s5, "120%")
        .fromTo(".s5-center", { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.3 })
        .fromTo(".s5-conn", { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1, duration: 0.4 }, 0.1)
        .fromTo(".s5-node", { opacity: 0 }, { opacity: 1, duration: 0.3, stagger: 0.015 }, 0.15)
        .fromTo(".s5-counter", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.3 }, 0.5)
        .fromTo(".s5-text", { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0.6)

      // ─── Scene 6: The Delivery ─────────────────────────────────
      pin(s6, "100%")
        .fromTo(".s6-card-fly", { opacity: 1, x: 0, scale: 1 }, { opacity: 0.8, x: 80, scale: 0.5, duration: 0.3 })
        .fromTo(".s6-wallet", { opacity: 0.3 }, { opacity: 1, duration: 0.3 }, 0.2)
        .fromTo(".s6-glow", { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.3 }, 0.4)
        .fromTo(".s6-text", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.3 }, 0.5)

      // ─── Scene 7: The Globe ────────────────────────────────────
      pin(s7, "100%")
        .fromTo(".s7-globe", { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.5 })
        .fromTo(".s7-carousel", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.4 }, 0.3)

      // ─── Scene 8: The CTA ──────────────────────────────────────
      pin(s8, "80%")
        .fromTo(".s8-card", { opacity: 0, y: 40, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.5 })

    }, containerRef)

    // ─── Sparkle particles ───────────────────────────────────────
    const canvas = sparkleRef.current
    let raf = 0
    if (canvas) {
      const c2d = canvas.getContext("2d")
      if (c2d) {
        const dpr = 2
        const resize = () => { canvas.width = window.innerWidth * dpr; canvas.height = window.innerHeight * dpr; canvas.style.width = `${window.innerWidth}px`; canvas.style.height = `${window.innerHeight}px` }
        resize(); window.addEventListener("resize", resize)
        let seed = 42
        const rand = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646 }
        const sparkles = Array.from({ length: 50 }, () => ({ x: rand() * window.innerWidth * dpr, y: rand() * window.innerHeight * dpr, size: 1 + rand() * 2.5, speed: 0.15 + rand() * 0.4, phase: rand() * Math.PI * 2 }))
        let time = 0
        const draw = () => {
          time += 0.02; c2d.clearRect(0, 0, canvas.width, canvas.height)
          const scrollP = window.scrollY / Math.max(1, document.body.scrollHeight - window.innerHeight)
          const color = scrollP < 0.25 ? C.stardust : C.muted
          for (const s of sparkles) {
            c2d.beginPath(); c2d.arc(s.x, s.y, s.size * dpr, 0, Math.PI * 2)
            c2d.fillStyle = color; c2d.globalAlpha = 0.2 + 0.5 * Math.sin(time * s.speed + s.phase)
            c2d.fill()
          }
          c2d.globalAlpha = 1; raf = requestAnimationFrame(draw)
        }
        raf = requestAnimationFrame(draw)
        return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); ctx.revert() }
      }
    }
    return () => { cancelAnimationFrame(raf); ctx.revert() }
  }, [])

  // ─── Network nodes (bigger, 3 rings) ──────────────────────────────────────
  const netNodes = [
    // Inner ring (7)
    { x: 50, y: 28, c: C.aurora }, { x: 72, y: 38, c: C.nebula }, { x: 78, y: 60, c: C.aurora },
    { x: 64, y: 78, c: C.nebula }, { x: 36, y: 78, c: C.aurora }, { x: 22, y: 60, c: C.nebula },
    { x: 28, y: 38, c: C.aurora },
    // Middle ring (10)
    { x: 50, y: 14, c: C.nebula }, { x: 82, y: 22, c: C.aurora }, { x: 94, y: 48, c: C.nebula },
    { x: 86, y: 72, c: C.aurora }, { x: 65, y: 90, c: C.nebula }, { x: 35, y: 90, c: C.aurora },
    { x: 14, y: 72, c: C.nebula }, { x: 6, y: 48, c: C.aurora }, { x: 18, y: 22, c: C.nebula },
    { x: 50, y: 6, c: C.aurora },
    // Outer scatter (8)
    { x: 96, y: 35, c: C.nebula }, { x: 92, y: 85, c: C.aurora }, { x: 4, y: 35, c: C.nebula },
    { x: 8, y: 85, c: C.aurora }, { x: 50, y: 97, c: C.nebula }, { x: 30, y: 5, c: C.aurora },
    { x: 70, y: 5, c: C.nebula }, { x: 50, y: 50, c: C.aurora },
  ]

  return (
    <div ref={containerRef} className="relative" style={{ background: C.bg }}>
      <canvas ref={sparkleRef} className="fixed inset-0 z-[1] pointer-events-none" />

      {/* Throughline Tooth */}
      <div
        ref={toothRef}
        className="fixed left-1/2 z-30 pointer-events-none"
        style={{ top: "62%", transform: "translate(-50%, -50%)", color: C.stardust, filter: `drop-shadow(0 0 16px ${C.stardust}80)` }}
      >
        <ToothSVG size={48} />
      </div>

      {/* ═══ SCENE 1: THE ROOM ═══════════════════════════════════ */}
      <section ref={s1} className="relative z-10 h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="scene1-glow absolute w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: `radial-gradient(circle, ${C.stardust}10 0%, transparent 70%)`, top: "30%", left: "50%", transform: "translate(-50%, -50%)" }} />
        <div className="s1-room px-4"><BedroomScene /></div>
        <p className="s1-text mt-8 text-xl sm:text-2xl font-display tracking-wide" style={{ color: `${C.text}dd` }}>A tooth falls.</p>
        <div className="absolute bottom-8 flex flex-col items-center gap-2 opacity-40">
          <span className="text-xs font-mono" style={{ color: C.muted }}>scroll</span>
          <div className="w-px h-8" style={{ background: `linear-gradient(to bottom, ${C.muted}40, transparent)`, animation: "scrollPulse 2s ease-in-out infinite" }} />
        </div>
      </section>

      {/* ═══ SCENE 2: THE FAIRY ══════════════════════════════════ */}
      <section ref={s2} className="relative z-10 h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="s2-scene px-4"><FairyScene /></div>
        <div className="s2-flash absolute w-40 h-40 rounded-full pointer-events-none" style={{ background: `radial-gradient(circle, white 0%, ${C.stardust}40 40%, transparent 70%)`, top: "50%", left: "50%", transform: "translate(-50%, -50%) scale(0)" }} />
        <p className="s2-text mt-6 text-xl sm:text-2xl font-display tracking-wide" style={{ color: `${C.text}dd` }}>Collected.</p>
      </section>

      {/* ═══ SCENE 3: THE SCAN ═══════════════════════════════════ */}
      <section ref={s3} className="relative z-10 h-screen flex flex-col items-center justify-center overflow-hidden" style={{ background: C.bg }}>
        <ScanGrid />
        {/* Scan line */}
        <div className="s3-scanline absolute left-0 right-0 h-[2px] z-20 pointer-events-none" style={{ background: `linear-gradient(90deg, transparent 0%, ${C.aurora} 50%, transparent 100%)`, boxShadow: `0 0 20px ${C.aurora}, 0 0 60px ${C.aurora}40`, top: "0%" }} />
        {/* Centered data */}
        <div className="relative z-10 flex flex-col items-center gap-5">
          <div className="h-16" />
          {/* Data row */}
          <div className="flex flex-wrap justify-center gap-8 sm:gap-14">
            {[
              { label: "CALCIUM", value: "96.2%", cls: "s3-data" },
              { label: "DENTIN", value: "1.8mm", cls: "s3-data" },
              { label: "BLOCK", value: "0x7a2f...4e9c", cls: "s3-data" },
              { label: "TOKEN", value: "#1091", cls: "s3-data" },
            ].map((d) => (
              <div key={d.label} className={d.cls}>
                <span className="text-[10px] font-mono uppercase tracking-widest block" style={{ color: `${C.aurora}70` }}>{d.label}</span>
                <span className="text-xl sm:text-2xl font-mono font-bold" style={{ color: C.aurora }}>{d.value}</span>
              </div>
            ))}
          </div>
          {/* Verified */}
          <div className="s3-verified mt-2 px-8 py-2.5 rounded-full border" style={{ borderColor: `${C.aurora}40`, background: `${C.aurora}10`, boxShadow: `0 0 40px ${C.aurora}20` }}>
            <span className="text-base font-mono font-bold tracking-widest" style={{ color: C.aurora }}>✓ VERIFIED ON-CHAIN</span>
          </div>
        </div>
        <p className="s3-text mt-6 text-xl sm:text-2xl font-display tracking-wide" style={{ color: `${C.text}dd` }}>Verified on-chain.</p>
      </section>

      {/* ═══ SCENE 4: THE NFT ════════════════════════════════════ */}
      <section ref={s4} className="relative z-10 h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute w-[400px] h-[400px] rounded-full pointer-events-none" style={{ background: `radial-gradient(circle, ${C.aurora}08 0%, transparent 70%)`, top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
        <div className="s4-card" style={{ perspective: "1000px" }}>
          <ToothCard card={TOOTH_CARDS[0]} />
          {/* Animated stamp overlay */}
          <div className="s4-stamp absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="px-6 py-2 rounded-full rotate-[-8deg]" style={{ border: `2px solid ${C.green}60`, color: C.green }}>
              <span className="text-lg font-mono font-bold tracking-widest">MINTED</span>
            </div>
          </div>
        </div>
        <p className="s4-text mt-6 text-xl sm:text-2xl font-display tracking-wide" style={{ color: `${C.text}dd` }}>Minted.</p>
      </section>

      {/* ═══ SCENE 5: THE NETWORK ════════════════════════════════ */}
      <section ref={s5} className="relative z-10 h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="relative w-full max-w-2xl aspect-square px-4">
          {/* Connections */}
          <svg viewBox="0 0 100 100" className="s5-conn absolute inset-0 w-full h-full" fill="none">
            {netNodes.slice(0, 7).map((n, i) => (
              <line key={`ci${i}`} x1="50" y1="50" x2={n.x} y2={n.y} stroke={n.c} strokeWidth="0.4" opacity="0.35" strokeDasharray="2 3" />
            ))}
            {netNodes.slice(7, 17).map((n, i) => (
              <line key={`mi${i}`} x1={netNodes[i % 7].x} y1={netNodes[i % 7].y} x2={n.x} y2={n.y} stroke={n.c} strokeWidth="0.25" opacity="0.25" strokeDasharray="1 4" />
            ))}
            {netNodes.slice(17).map((n, i) => (
              <line key={`oi${i}`} x1={netNodes[7 + (i % 10)].x} y1={netNodes[7 + (i % 10)].y} x2={n.x} y2={n.y} stroke={n.c} strokeWidth="0.15" opacity="0.2" strokeDasharray="1 5" />
            ))}
          </svg>
          {/* Center */}
          <svg viewBox="0 0 100 100" className="s5-center absolute inset-0 w-full h-full">
            <NetworkNode x={50} y={50} color={C.aurora} size={7} />
          </svg>
          {/* All nodes */}
          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
            {netNodes.map((n, i) => (
              <g key={i} className="s5-node"><NetworkNode x={n.x} y={n.y} color={n.c} size={i < 7 ? 4 : i < 17 ? 3 : 2} /></g>
            ))}
          </svg>
        </div>
        {/* Counter */}
        <div className="s5-counter mt-6 flex items-center gap-6 sm:gap-10 text-center">
          {[{ v: "47,832", l: "teeth" }, { v: "84", l: "countries" }, { v: "1,247", l: "fairies" }].map((m, i) => (
            <div key={i} className="flex flex-col">
              <span className="text-2xl sm:text-4xl font-mono font-bold" style={{ color: C.text }}>{m.v}</span>
              <span className="text-xs font-mono" style={{ color: `${C.muted}70` }}>{m.l}</span>
            </div>
          ))}
        </div>
        <p className="s5-text mt-4 text-xl sm:text-2xl font-display tracking-wide" style={{ color: `${C.text}dd` }}>One network.</p>
      </section>

      {/* ═══ SCENE 6: THE DELIVERY ═══════════════════════════════ */}
      <section ref={s6} className="relative z-10 h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="flex items-center gap-8 sm:gap-16">
          {/* Mini NFT card flying */}
          <div className="s6-card-fly">
            <div className="w-16 h-20 rounded-lg" style={{ background: `linear-gradient(145deg, ${C.aurora}20, ${C.nebula}10)`, border: `1px solid ${C.aurora}30`, boxShadow: `0 0 20px ${C.aurora}20` }}>
              <div className="flex items-center justify-center h-full" style={{ color: C.aurora }}>
                <ToothSVG size={20} />
              </div>
            </div>
          </div>
          {/* Arrow */}
          <svg width="60" height="20" viewBox="0 0 60 20" fill="none">
            <path d="M0 10 L50 10 M40 3 L52 10 L40 17" stroke={C.aurora} strokeWidth="2" strokeDasharray="4 4" opacity="0.4" />
          </svg>
          {/* Wallet */}
          <div className="s6-wallet relative">
            <WalletIcon lit={true} />
            <div className="s6-glow absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-32 h-32 rounded-full" style={{ background: `radial-gradient(circle, ${C.green}20 0%, transparent 70%)` }} />
            </div>
          </div>
        </div>
        <p className="s6-text mt-10 text-xl sm:text-2xl font-display tracking-wide" style={{ color: `${C.text}dd` }}>Delivered to your wallet.</p>
        <p className="mt-2 text-sm font-mono" style={{ color: `${C.muted}80` }}>Ownership starts young.</p>
      </section>

      {/* ═══ SCENE 7: THE GLOBE + CAROUSEL ═══════════════════════ */}
      <section ref={s7} className="relative z-10 min-h-screen flex flex-col items-center justify-center overflow-hidden py-12">
        <div className="s7-globe relative">{children}</div>
        <p className="mt-2 text-sm font-mono" style={{ color: `${C.muted}60` }}>Drag to explore</p>
        {/* Card carousel */}
        <div className="s7-carousel mt-8 w-full overflow-x-auto pb-4">
          <div className="flex gap-4 px-6 w-max mx-auto">
            {TOOTH_CARDS.map((card, i) => (
              <ToothCard key={i} card={card} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SCENE 8: THE CTA ════════════════════════════════════ */}
      <section ref={s8} className="relative z-10 h-screen flex flex-col items-center justify-center overflow-hidden px-6">
        <div className="s8-card w-full max-w-md rounded-3xl p-8 sm:p-12 text-center" style={{ background: "linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(20px)", boxShadow: `0 0 60px ${C.nebula}10, 0 20px 60px rgba(0,0,0,0.5)` }}>
          <p className="text-2xl sm:text-3xl font-display tracking-tight mb-2" style={{ color: C.text }}>Every tooth tells a story.</p>
          <p className="text-sm mb-8" style={{ color: `${C.muted}99` }}>Join the network. Make yours permanent.</p>
          <div className="flex gap-2">
            <input type="email" placeholder="your@email.com" className="flex-1 px-4 py-3 rounded-xl text-sm font-mono outline-none" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: C.text }} />
            <button className="px-6 py-3 rounded-xl text-sm font-mono font-bold transition-all hover:scale-105" style={{ background: `linear-gradient(135deg, ${C.nebula}, ${C.aurora})`, color: "white", boxShadow: `0 0 20px ${C.nebula}40` }}>Join</button>
          </div>
        </div>
      </section>

      <style jsx global>{`
        @keyframes scrollPulse { 0%, 100% { transform: scaleY(1); } 50% { transform: scaleY(0.5); } }
      `}</style>
    </div>
  )
}
