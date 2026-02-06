"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { motion, useScroll, useTransform } from "motion/react"
import { FAIRY_NODES, NETWORK_COLORS, KEY_HUB_INDICES } from "@/components/ui/cosmic-globe"
import type { NetworkType } from "@/components/ui/cosmic-globe"
import { AuroraBlob } from "@/components/ui/aurora-background"
import { ScrollReveal } from "@/components/ui/scroll-reveal"
import { ChatWidget } from "@/components/ChatWidget"

const CosmicGlobe = dynamic(
  () => import("@/components/ui/cosmic-globe").then((mod) => mod.CosmicGlobe),
  { ssr: false }
)

// ─── Colors ──────────────────────────────────────────────────────────────────
const C = {
  bg: "#050510",
  surface: "#0F0F2D",
  nebula: "#7C3AED",
  aurora: "#06B6D4",
  stardust: "#F59E0B",
  plasma: "#EC4899",
  text: "#F1F5F9",
  muted: "#A78BFA",
}

// ─── Seeded RNG ──────────────────────────────────────────────────────────────
function mulberry32(seed: number) {
  return () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function hexAlpha(a: number): string {
  return Math.round(Math.max(0, Math.min(1, a)) * 255).toString(16).padStart(2, "0")
}

// ─── Tooth Types ─────────────────────────────────────────────────────────────
const TOOTH_TYPES = [
  { name: "Central Incisor", code: "A", region: "Upper", calciumPct: 96.2, dentinMm: 1.8 },
  { name: "Lateral Incisor", code: "B", region: "Upper", calciumPct: 95.8, dentinMm: 1.6 },
  { name: "Canine", code: "C", region: "Lower", calciumPct: 97.1, dentinMm: 2.2 },
  { name: "First Molar", code: "D", region: "Upper", calciumPct: 96.5, dentinMm: 2.4 },
  { name: "Second Molar", code: "E", region: "Lower", calciumPct: 96.9, dentinMm: 2.6 },
  { name: "Central Incisor", code: "F", region: "Lower", calciumPct: 95.4, dentinMm: 1.5 },
]

// ─── NFT Card Data ───────────────────────────────────────────────────────────
interface NFTCard {
  id: string; name: string; type: "child" | "animal" | "collective"
  label: string; toothType: typeof TOOTH_TYPES[number]
  color: string; accent: string; blockHash: string
  tokenId: number; mintTimestamp: string; verifications: number
  location: string; rarity: "common" | "uncommon" | "rare" | "legendary"
}

const rng = mulberry32(888)
const genHash = () => "0x" + Array.from({ length: 8 }, () => Math.floor(rng() * 16).toString(16)).join("")

const CARDS: NFTCard[] = [
  // ─── The 12 Tooth Fairy Network collectors ───────────────────
  { id: "TFN-0001", name: "Zara Ahmed", type: "collective", label: "Persepolis Gate",
    toothType: TOOTH_TYPES[0], color: C.stardust, accent: "#FCD34D",
    blockHash: genHash(), tokenId: 1091, mintTimestamp: "2026-01-08T06:45:00Z",
    verifications: 1091, location: "Tehran, Iran", rarity: "rare" },
  { id: "TFN-0002", name: "Muhammad Rashid", type: "child", label: "Straitspark Dock",
    toothType: TOOTH_TYPES[1], color: C.plasma, accent: "#F9A8D4",
    blockHash: genHash(), tokenId: 734, mintTimestamp: "2026-01-11T09:12:00Z",
    verifications: 734, location: "Johor Bahru, Malaysia", rarity: "uncommon" },
  { id: "TFN-0003", name: "Arjun Selvam", type: "child", label: "Tamarind Wisp",
    toothType: TOOTH_TYPES[3], color: C.aurora, accent: "#67E8F9",
    blockHash: genHash(), tokenId: 412, mintTimestamp: "2026-01-15T14:28:00Z",
    verifications: 412, location: "Usulampatti, Tamil Nadu", rarity: "common" },
  { id: "TFN-0004", name: "Kai Reeves", type: "collective", label: "Launchpad Shimmer",
    toothType: TOOTH_TYPES[2], color: C.nebula, accent: "#A78BFA",
    blockHash: genHash(), tokenId: 2047, mintTimestamp: "2026-01-05T03:33:00Z",
    verifications: 2047, location: "Starbase, Texas", rarity: "legendary" },
  { id: "TFN-0005", name: "Viola Desmond", type: "collective", label: "Frostbloom Citadel",
    toothType: TOOTH_TYPES[4], color: C.stardust, accent: "#FBBF24",
    blockHash: genHash(), tokenId: 8301, mintTimestamp: "2025-12-25T00:01:00Z",
    verifications: 8301, location: "Toronto, Canada", rarity: "legendary" },
  { id: "TFN-0006", name: "Ísak Björnsson", type: "child", label: "Aurorafrost Spire",
    toothType: TOOTH_TYPES[5], color: "#818CF8", accent: "#C4B5FD",
    blockHash: genHash(), tokenId: 523, mintTimestamp: "2026-01-18T11:45:00Z",
    verifications: 523, location: "Reykjavik, Iceland", rarity: "uncommon" },
  { id: "TFN-0007", name: "Dasha Petrova", type: "child", label: "Frostfire Dome",
    toothType: TOOTH_TYPES[1], color: "#60A5FA", accent: "#93C5FD",
    blockHash: genHash(), tokenId: 891, mintTimestamp: "2026-01-13T07:20:00Z",
    verifications: 891, location: "Moscow, Russia", rarity: "rare" },
  { id: "TFN-0008", name: "Mateo Silva", type: "child", label: "Sugarloaf Beacon",
    toothType: TOOTH_TYPES[0], color: "#34D399", accent: "#6EE7B7",
    blockHash: genHash(), tokenId: 1456, mintTimestamp: "2026-01-09T16:55:00Z",
    verifications: 1456, location: "Rio de Janeiro, Brazil", rarity: "rare" },
  { id: "TFN-0009", name: "Priya Narine", type: "child", label: "Demerara Glow",
    toothType: TOOTH_TYPES[3], color: C.aurora, accent: "#22D3EE",
    blockHash: genHash(), tokenId: 267, mintTimestamp: "2026-01-22T10:08:00Z",
    verifications: 267, location: "Georgetown, Guyana", rarity: "common" },
  { id: "TFN-0010", name: "Thandi Nkosi", type: "child", label: "Stormwing Point",
    toothType: TOOTH_TYPES[5], color: C.plasma, accent: "#FB7185",
    blockHash: genHash(), tokenId: 643, mintTimestamp: "2026-01-19T13:42:00Z",
    verifications: 643, location: "Cape Town, South Africa", rarity: "uncommon" },
  { id: "TFN-0011", name: "Fatima Al-Rashidi", type: "collective", label: "Oasis Prism Tower",
    toothType: TOOTH_TYPES[2], color: C.stardust, accent: "#F59E0B",
    blockHash: genHash(), tokenId: 1823, mintTimestamp: "2026-01-07T04:17:00Z",
    verifications: 1823, location: "Abu Dhabi, UAE", rarity: "rare" },
  { id: "TFN-0012", name: "Zofia Kowalska", type: "child", label: "Amber Wing Post",
    toothType: TOOTH_TYPES[4], color: "#F472B6", accent: "#FBCFE8",
    blockHash: genHash(), tokenId: 558, mintTimestamp: "2026-01-20T08:30:00Z",
    verifications: 558, location: "Warsaw, Poland", rarity: "uncommon" },
]

// Age + bio for card display (matches CARDS order)
const CARD_BIOS: { age: number; bio: string }[] = [
  { age: 7, bio: "Lost her first canine chasing her cat through the bazaar" },
  { age: 6, bio: "Found his tooth in a bowl of laksa at the night market" },
  { age: 9, bio: "Pulled it out himself tying a string to a coconut tree" },
  { age: 5, bio: "Youngest collector in the network. Watched a rocket launch that day" },
  { age: 83, bio: "Civil rights icon. First adult tooth submitted to the network" },
  { age: 8, bio: "Lost it playing in volcanic hot springs near the midnight sun" },
  { age: 10, bio: "Kept it frozen in snow for three days before uploading" },
  { age: 6, bio: "It fell out mid-samba practice on Copacabana Beach" },
  { age: 11, bio: "Last baby tooth. Celebrated with her whole village" },
  { age: 8, bio: "Found it on a hike up Table Mountain at sunrise" },
  { age: 9, bio: "Placed it under her pillow in a gold-trimmed pouch" },
  { age: 7, bio: "Lost it biting into a warm pączek on Fat Thursday" },
]

// Hub index → card index mapping (KEY_HUB_INDICES order maps to CARDS order)
const HUB_TO_CARD: Record<number, number> = {}
KEY_HUB_INDICES.forEach((hubIdx, cardIdx) => { HUB_TO_CARD[hubIdx] = cardIdx })

// ─── Mini Card Popup (shown on globe node click) ────────────────────────────
function MiniCardPopup({ card, bio, onClose }: { card: NFTCard; bio: { age: number; bio: string }; onClose: () => void }) {
  const typeLabels = { child: "Child", animal: "Wildlife", collective: "Collective" }
  return (
    <motion.div
      className="absolute z-40 w-[260px]"
      style={{ top: "15%", left: "50%", transform: "translateX(-50%)" }}
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.25 }}
    >
      <div className="rounded-2xl overflow-hidden relative" style={{
        background: `linear-gradient(145deg, ${C.surface}f8, ${C.bg}f0)`,
        border: `1px solid ${card.color}30`,
        boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 30px ${card.color}15`,
        backdropFilter: "blur(20px)",
      }}>
        {/* Close button */}
        <button onClick={onClose} className="absolute top-2 right-2 z-10 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer transition-all hover:bg-white/10" style={{
          color: C.muted, background: "rgba(255,255,255,0.05)",
        }}>
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 2L10 10M10 2L2 10" /></svg>
        </button>
        {/* Top accent */}
        <div className="h-[3px]" style={{ background: `linear-gradient(90deg, ${card.color}, ${card.accent})` }} />
        <div className="p-4">
          <div className="flex items-center gap-3 mb-3">
            {/* Avatar circle */}
            <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{
              background: `linear-gradient(135deg, ${card.color}25, ${card.accent}15)`,
              border: `1.5px solid ${card.color}40`,
            }}>
              <svg viewBox="0 0 64 64" className="w-6 h-6 opacity-50">
                <circle cx="32" cy="24" r="12" fill={card.color + "40"} />
                <ellipse cx="32" cy="52" rx="18" ry="14" fill={card.color + "30"} />
              </svg>
            </div>
            <div className="min-w-0">
              <h4 className="font-display text-sm font-bold truncate" style={{ color: C.text }}>{card.name}</h4>
              <p className="text-[10px] font-mono" style={{ color: card.color }}>Age {bio.age} &middot; {card.location}</p>
            </div>
          </div>
          <p className="text-[11px] leading-relaxed italic mb-3" style={{ color: C.muted + "90" }}>&ldquo;{bio.bio}&rdquo;</p>
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full" style={{
              color: card.color, background: card.color + "10", border: `1px solid ${card.color}20`,
            }}>{typeLabels[card.type]}</span>
            <span className="text-[9px] font-mono" style={{ color: C.muted + "50" }}>{card.id} &middot; #{card.tokenId}</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ChatWidget is now imported from @/components/ChatWidget

// ─── Star Field Background ───────────────────────────────────────────────────
function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef(0)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener("resize", resize)
    const r = mulberry32(77)
    const stars = Array.from({ length: 200 }, () => ({
      x: r(), y: r(), rad: 0.3 + r() * 1.5,
      speed: 0.3 + r() * 2, phase: r() * Math.PI * 2,
      color: [C.text, C.muted, C.aurora, C.nebula, C.stardust][Math.floor(r() * 5)],
    }))
    let time = 0
    const render = () => {
      const w = window.innerWidth, h = window.innerHeight
      time += 0.016
      ctx.clearRect(0, 0, w, h)
      ctx.globalCompositeOperation = "lighter"
      for (const s of stars) {
        const tw = 0.3 + Math.sin(time * s.speed + s.phase) * 0.35 + 0.35
        ctx.beginPath()
        ctx.arc(s.x * w, s.y * h, s.rad, 0, Math.PI * 2)
        ctx.fillStyle = s.color + hexAlpha(tw * 0.4)
        ctx.fill()
      }
      animRef.current = requestAnimationFrame(render)
    }
    animRef.current = requestAnimationFrame(render)
    return () => { cancelAnimationFrame(animRef.current); window.removeEventListener("resize", resize) }
  }, [])
  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" style={{ opacity: 0.6 }} />
}

// ─── Top Navigation ──────────────────────────────────────────────────────────
function NavBar() {
  const [scrolled, setScrolled] = useState(false)
  const [walletToast, setWalletToast] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])
  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "glass" : ""}`} style={{
        background: scrolled ? undefined : "transparent",
        backdropFilter: scrolled ? undefined : "none",
        borderBottom: scrolled ? undefined : "1px solid transparent",
      }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <Link href="/" className="font-mono text-sm tracking-tight transition-colors hover:text-white" style={{ color: C.muted }}>
            sathian.ai
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/toothfairy/network/about" className="px-4 py-2 rounded-xl text-[12px] font-mono uppercase tracking-wider transition-all hover:bg-white/[0.06] cursor-pointer inline-block" style={{
              color: C.muted, border: "1px solid rgba(255,255,255,0.08)",
            }}>About</Link>
            <button onClick={() => { setWalletToast(true); setTimeout(() => setWalletToast(false), 3000) }} className="px-4 py-2 rounded-xl text-[12px] font-mono uppercase tracking-wider cursor-pointer relative overflow-hidden group" style={{
              color: C.bg, background: `linear-gradient(135deg, ${C.nebula}, ${C.aurora})`,
            }}>
              <span className="relative z-10">Connect Wallet</span>
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{
                background: `linear-gradient(135deg, ${C.aurora}, ${C.nebula})`,
              }} />
            </button>
          </div>
        </div>
      </nav>
      {walletToast && (
        <div className="fixed top-20 right-6 z-[60] px-4 py-3 rounded-xl glass text-sm font-mono animate-fadeIn" style={{ color: C.text }}>
          Wallet connection coming soon.
        </div>
      )}
    </>
  )
}

// ─── Live Metrics ────────────────────────────────────────────────────────────
function MetricTicker({ label, value, color }: { label: string; value: number; color: string }) {
  const [display, setDisplay] = useState(value)
  const targetRef = useRef(value)
  useEffect(() => { targetRef.current = value }, [value])
  useEffect(() => {
    const iv = setInterval(() => {
      setDisplay((prev) => {
        const diff = targetRef.current - prev
        if (Math.abs(diff) < 1) return targetRef.current
        return prev + Math.sign(diff) * Math.max(1, Math.floor(Math.abs(diff) * 0.15))
      })
    }, 30)
    return () => clearInterval(iv)
  }, [])
  return (
    <div className="glass-card rounded-2xl p-5 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-20 h-20 pointer-events-none" style={{
        background: `radial-gradient(circle, ${color}15, transparent 70%)`,
      }} />
      <div className="text-[10px] uppercase tracking-[0.15em] font-mono mb-2" style={{ color: color + "90" }}>{label}</div>
      <div className="font-display text-2xl font-bold" style={{ color: C.text }}>{display.toLocaleString()}</div>
    </div>
  )
}

// ─── Activity Feed (shows child profiles from card data) ────────────────────
function ActivityFeed() {
  // Cycle through the 12 card characters as live collection events
  const [events, setEvents] = useState<{ name: string; age: number; city: string; nftId: string; networkType: string; id: number }[]>([])
  const idRef = useRef(0)
  useEffect(() => {
    // Start with first 5 cards
    const initial = [0, 3, 7, 1, 10].map((i) => ({
      name: CARDS[i].name, age: CARD_BIOS[i].age, city: CARDS[i].location,
      nftId: CARDS[i].id, networkType: CARDS[i].type, id: idRef.current++,
    }))
    setEvents(initial)
    let cardIdx = 5
    const iv = setInterval(() => {
      const i = cardIdx % CARDS.length
      cardIdx++
      setEvents((prev) => [{
        name: CARDS[i].name, age: CARD_BIOS[i].age, city: CARDS[i].location,
        nftId: CARDS[i].id, networkType: CARDS[i].type, id: idRef.current++,
      }, ...prev.slice(0, 4)])
    }, 3500)
    return () => clearInterval(iv)
  }, [])
  return (
    <div className="glass-card-gradient rounded-2xl p-5 overflow-hidden">
      <div className="text-[10px] uppercase tracking-[0.2em] font-mono mb-3" style={{ color: C.muted + "60" }}>Live Collections</div>
      {events.map((e, i) => (
        <motion.div key={e.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}
          className="flex items-center gap-3 py-2.5 border-b border-white/[0.04] last:border-0">
          <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{
            background: `${NETWORK_COLORS[e.networkType as NetworkType]}15`,
            border: `1.5px solid ${NETWORK_COLORS[e.networkType as NetworkType]}30`,
          }}>
            <svg viewBox="0 0 64 64" className="w-3.5 h-3.5 opacity-60">
              <circle cx="32" cy="24" r="12" fill={NETWORK_COLORS[e.networkType as NetworkType] + "60"} />
              <ellipse cx="32" cy="52" rx="18" ry="14" fill={NETWORK_COLORS[e.networkType as NetworkType] + "40"} />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm" style={{ color: C.text + "cc" }}>
              <span className="font-semibold" style={{ color: C.text }}>{e.name}</span>
              <span className="text-[11px] ml-1" style={{ color: C.muted + "60" }}>({e.age})</span>
            </div>
            <div className="text-[10px] font-mono mt-0.5" style={{ color: C.muted + "50" }}>{e.city} &middot; {e.nftId}</div>
          </div>
          <div className="text-[10px] font-mono" style={{ color: C.muted + "50" }}>{i === 0 ? "now" : `${i * 3}s`}</div>
        </motion.div>
      ))}
    </div>
  )
}

// ─── Network Legend ──────────────────────────────────────────────────────────
function NetworkLegend() {
  const types: { type: NetworkType; label: string; count: number }[] = [
    { type: "child", label: "Children", count: FAIRY_NODES.filter((n) => n.networkType === "child").length },
    { type: "animal", label: "Wildlife", count: FAIRY_NODES.filter((n) => n.networkType === "animal").length },
    { type: "collective", label: "Collectives", count: FAIRY_NODES.filter((n) => n.networkType === "collective").length },
  ]
  return (
    <div className="flex items-center gap-6 justify-center mt-4">
      {types.map((t) => (
        <div key={t.type} className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{
            background: NETWORK_COLORS[t.type], boxShadow: `0 0 8px ${NETWORK_COLORS[t.type]}60`,
          }} />
          <span className="text-[11px] font-mono" style={{ color: C.muted + "90" }}>
            {t.label} <span style={{ color: NETWORK_COLORS[t.type] }}>({t.count})</span>
          </span>
        </div>
      ))}
    </div>
  )
}

// ─── Journey Step Icon ──────────────────────────────────────────────────────
function StepNode({ icon, label, color, delay = 0 }: { icon: React.ReactNode; label: string; color: string; delay?: number }) {
  return (
    <motion.div className="flex flex-col items-center gap-2"
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }} transition={{ delay, duration: 0.6 }}>
      <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center relative" style={{
        background: `${color}0a`, border: `1px solid ${color}20`,
      }}>
        {icon}
        <div className="absolute inset-0 rounded-2xl" style={{
          boxShadow: `inset 0 0 20px ${color}08, 0 0 30px ${color}06`,
        }} />
      </div>
      <span className="text-[10px] font-mono uppercase tracking-wider" style={{ color: color + "70" }}>{label}</span>
    </motion.div>
  )
}

function StepConnector({ color, delay = 0 }: { color: string; delay?: number }) {
  return (
    <motion.div className="flex-1 max-w-[80px] md:max-w-[120px] flex items-center"
      initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }}
      viewport={{ once: true }} transition={{ delay, duration: 0.5 }}>
      <div className="w-full h-px relative">
        <div className="absolute inset-0" style={{ background: `linear-gradient(90deg, ${color}50, ${color}20)` }} />
        {/* Traveling dot */}
        <div className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full" style={{
          background: color, boxShadow: `0 0 6px ${color}`,
          animation: "travelDot 2s ease-in-out infinite",
        }} />
      </div>
    </motion.div>
  )
}

// ─── Panel 1: The Pickup (warm ambers, fairy tale) ──────────────────────────
function PickupPanel() {
  return (
    <div className="relative py-16 md:py-24">
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(ellipse at 50% 50%, ${C.stardust}08, transparent 60%)`,
      }} />
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        {/* Step number */}
        <motion.div className="text-center mb-8" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] px-4 py-1.5 rounded-full" style={{
            color: C.stardust, background: C.stardust + "08", border: `1px solid ${C.stardust}15`,
          }}>Step 01</span>
        </motion.div>

        {/* Visual flow: Home → Tooth → Fairy → Upload */}
        <div className="flex items-center justify-center gap-3 md:gap-4 mb-10">
          <StepNode delay={0.1} color={C.stardust} label="Home" icon={
            <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
              <path d="M18 4L32 16V32H4V16L18 4Z" stroke={C.stardust} strokeWidth="1.5" fill={C.stardust + "08"} strokeLinejoin="round" />
              <rect x="14" y="22" width="8" height="10" rx="1" stroke={C.stardust + "50"} strokeWidth="1" />
            </svg>
          } />
          <StepConnector color={C.stardust} delay={0.2} />
          <StepNode delay={0.3} color={C.plasma} label="Fairy" icon={
            <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
              <ellipse cx="12" cy="15" rx="8" ry="12" fill={C.plasma + "08"} stroke={C.plasma + "40"} strokeWidth="1" transform="rotate(-10 12 15)" />
              <ellipse cx="24" cy="15" rx="8" ry="12" fill={C.plasma + "08"} stroke={C.plasma + "40"} strokeWidth="1" transform="rotate(10 24 15)" />
              <ellipse cx="18" cy="20" rx="5" ry="8" fill={C.plasma + "10"} stroke={C.plasma} strokeWidth="1.5" />
              <circle cx="18" cy="11" r="4" fill={C.plasma + "10"} stroke={C.plasma} strokeWidth="1.5" />
            </svg>
          } />
          <StepConnector color={C.aurora} delay={0.5} />
          <StepNode delay={0.6} color={C.aurora} label="Upload" icon={
            <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
              <rect x="6" y="8" width="24" height="20" rx="3" stroke={C.aurora} strokeWidth="1.5" fill={C.aurora + "08"} />
              <path d="M18 14V24M14 18L18 14L22 18" stroke={C.aurora} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          } />
          <StepConnector color="#22C55E" delay={0.7} />
          <StepNode delay={0.8} color="#22C55E" label="Verify" icon={
            <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
              <circle cx="18" cy="18" r="12" stroke="#22C55E" strokeWidth="1.5" fill="#22C55E08" />
              <path d="M12 18L16 22L24 14" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          } />
        </div>

        {/* Central illustration: floating tooth with fairy dust */}
        <motion.div className="flex justify-center mb-8" initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.4, type: "spring" }}>
          <div className="relative">
            <div className="w-32 h-32 rounded-full flex items-center justify-center" style={{
              background: `radial-gradient(circle, ${C.stardust}12, transparent 70%)`,
            }}>
              <svg width="48" height="56" viewBox="0 0 40 48" fill="none" style={{ animation: "float 3s ease-in-out infinite" }}>
                <path d="M20 2C14 2, 4 8, 4 18C4 28, 10 40, 14 44C16 46, 18 46, 20 38C22 46, 24 46, 26 44C30 40, 36 28, 36 18C36 8, 26 2, 20 2Z"
                  fill={C.stardust + "15"} stroke={C.stardust} strokeWidth="1.5" />
              </svg>
            </div>
            {/* Sparkle particles */}
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="absolute w-1 h-1 rounded-full" style={{
                background: [C.stardust, C.plasma, C.aurora][i % 3],
                top: `${20 + Math.sin(i * 1.05) * 45}%`, left: `${20 + Math.cos(i * 1.05) * 45}%`,
                animation: `sparkle ${1.5 + i * 0.3}s ease-in-out infinite ${i * 0.2}s`,
                boxShadow: `0 0 4px ${[C.stardust, C.plasma, C.aurora][i % 3]}`,
              }} />
            ))}
          </div>
        </motion.div>

        <motion.div className="text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: 0.6 }}>
          <h3 className="font-display text-2xl md:text-3xl font-bold mb-2" style={{ color: C.stardust }}>The Pickup</h3>
          <p className="text-sm max-w-lg mx-auto leading-relaxed" style={{ color: C.muted + "80" }}>
            A tooth falls. A fairy arrives. Collected, uploaded, verified on-chain.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

// ─── Panel 2: The Mint (digital, cyber, scan effect) ────────────────────────
function MintPanel() {
  return (
    <div className="relative py-16 md:py-24">
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(ellipse at 50% 50%, ${C.nebula}08, transparent 60%)`,
      }} />
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <motion.div className="text-center mb-8" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] px-4 py-1.5 rounded-full" style={{
            color: C.aurora, background: C.aurora + "08", border: `1px solid ${C.aurora}15`,
          }}>Step 02</span>
        </motion.div>

        {/* Visual flow: Verified → Propagate → Network → Mint */}
        <div className="flex items-center justify-center gap-3 md:gap-4 mb-10">
          <StepNode delay={0.1} color="#22C55E" label="Verified" icon={
            <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
              <rect x="6" y="6" width="24" height="24" rx="4" stroke="#22C55E" strokeWidth="1.5" fill="#22C55E08" />
              <path d="M12 18L16 22L24 14" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" />
            </svg>
          } />
          <StepConnector color={C.nebula} delay={0.2} />
          <StepNode delay={0.3} color={C.nebula} label="Propagate" icon={
            <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
              <circle cx="18" cy="18" r="4" fill={C.nebula + "20"} stroke={C.nebula} strokeWidth="1.5" />
              <circle cx="18" cy="18" r="10" stroke={C.nebula + "30"} strokeWidth="1" strokeDasharray="3 3" />
              <circle cx="18" cy="18" r="15" stroke={C.nebula + "15"} strokeWidth="1" strokeDasharray="2 4" />
            </svg>
          } />
          <StepConnector color={C.aurora} delay={0.5} />
          <StepNode delay={0.6} color={C.aurora} label="Consensus" icon={
            <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
              <path d="M18 4L32 18L18 32L4 18Z" stroke={C.aurora} strokeWidth="1.5" fill={C.aurora + "08"} />
              <circle cx="18" cy="18" r="4" fill={C.aurora + "20"} stroke={C.aurora} strokeWidth="1" />
            </svg>
          } />
          <StepConnector color={C.plasma} delay={0.7} />
          <StepNode delay={0.8} color={C.plasma} label="Mint" icon={
            <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
              <rect x="6" y="8" width="24" height="20" rx="3" stroke={C.plasma} strokeWidth="1.5" fill={C.plasma + "08"} />
              <path d="M6 14H30" stroke={C.plasma + "30"} strokeWidth="1" />
              <circle cx="12" cy="22" r="2" fill={C.plasma + "40"} />
            </svg>
          } />
        </div>

        {/* Central: Scan effect / digital transformation */}
        <motion.div className="flex justify-center mb-8" initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
          <div className="relative w-48 h-48 rounded-2xl overflow-hidden" style={{
            background: `linear-gradient(135deg, ${C.surface}, ${C.bg})`,
            border: `1px solid ${C.aurora}20`,
          }}>
            {/* Grid pattern */}
            <svg className="absolute inset-0 w-full h-full opacity-20">
              {Array.from({ length: 8 }, (_, i) => (
                <line key={`h${i}`} x1="0" y1={`${(i + 1) * 12.5}%`} x2="100%" y2={`${(i + 1) * 12.5}%`} stroke={C.aurora} strokeWidth="0.5" />
              ))}
              {Array.from({ length: 8 }, (_, i) => (
                <line key={`v${i}`} x1={`${(i + 1) * 12.5}%`} y1="0" x2={`${(i + 1) * 12.5}%`} y2="100%" stroke={C.aurora} strokeWidth="0.5" />
              ))}
            </svg>
            {/* Scan line */}
            <div className="absolute left-0 right-0 h-px" style={{
              background: `linear-gradient(90deg, transparent, ${C.aurora}, transparent)`,
              boxShadow: `0 0 10px ${C.aurora}, 0 0 30px ${C.aurora}40`,
              animation: "scanLine 2.5s ease-in-out infinite",
            }} />
            {/* Center tooth transforming to NFT */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg width="60" height="72" viewBox="0 0 40 48" fill="none" style={{ animation: "float 4s ease-in-out infinite" }}>
                <path d="M20 2C14 2, 4 8, 4 18C4 28, 10 40, 14 44C16 46, 18 46, 20 38C22 46, 24 46, 26 44C30 40, 36 28, 36 18C36 8, 26 2, 20 2Z"
                  fill={C.aurora + "15"} stroke={C.aurora} strokeWidth="1.5" />
              </svg>
            </div>
            {/* Corner brackets */}
            <svg className="absolute inset-0 w-full h-full">
              <path d="M4 16V4H16" fill="none" stroke={C.aurora + "40"} strokeWidth="1.5" />
              <path d="M180 16V4H168" fill="none" stroke={C.aurora + "40"} strokeWidth="1.5" transform="translate(-180)" />
              <path d="M4 176V188H16" fill="none" stroke={C.aurora + "40"} strokeWidth="1.5" transform="translate(0,-188)" />
            </svg>
            {/* Status text */}
            <div className="absolute bottom-3 left-0 right-0 text-center">
              <span className="text-[9px] font-mono tracking-wider px-2 py-0.5 rounded" style={{
                color: C.aurora, background: C.aurora + "10",
                animation: "statusBlink 3s steps(3) infinite",
              }}>MINTING ON-CHAIN...</span>
            </div>
          </div>
        </motion.div>

        <motion.div className="text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: 0.6 }}>
          <h3 className="font-display text-2xl md:text-3xl font-bold mb-2">
            <span className="bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">The Mint</span>
          </h3>
          <p className="text-sm max-w-lg mx-auto leading-relaxed" style={{ color: C.muted + "80" }}>
            Propagated across the network. Consensus reached. Permanently minted on-chain.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

// ─── Panel 3: The Reward (celebration, green/gold) ──────────────────────────
function RewardPanel() {
  return (
    <div className="relative py-16 md:py-24">
      <div className="absolute inset-0 pointer-events-none" style={{
        background: `radial-gradient(ellipse at 50% 50%, #22C55E06, transparent 60%)`,
      }} />
      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <motion.div className="text-center mb-8" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] px-4 py-1.5 rounded-full" style={{
            color: "#22C55E", background: "#22C55E08", border: "1px solid #22C55E15",
          }}>Step 03</span>
        </motion.div>

        {/* Visual flow: NFT → Deliver → Wallet → Yours */}
        <div className="flex items-center justify-center gap-3 md:gap-4 mb-10">
          <StepNode delay={0.1} color={C.plasma} label="NFT" icon={
            <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
              <rect x="6" y="8" width="24" height="20" rx="3" stroke={C.plasma} strokeWidth="1.5" fill={C.plasma + "08"} />
              <path d="M6 14H30" stroke={C.plasma + "30"} strokeWidth="1" />
              <circle cx="18" cy="22" r="3" fill={C.plasma + "20"} stroke={C.plasma + "40"} strokeWidth="1" />
            </svg>
          } />
          <StepConnector color={C.stardust} delay={0.2} />
          <StepNode delay={0.3} color={C.stardust} label="Deliver" icon={
            <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
              <path d="M6 18H24L30 12" stroke={C.stardust} strokeWidth="1.5" strokeLinecap="round" fill="none" />
              <path d="M24 18L30 24" stroke={C.stardust} strokeWidth="1.5" strokeLinecap="round" />
              <circle cx="12" cy="18" r="8" stroke={C.stardust + "30"} strokeWidth="1" strokeDasharray="3 3" fill="none" />
            </svg>
          } />
          <StepConnector color="#22C55E" delay={0.5} />
          <StepNode delay={0.6} color="#22C55E" label="Wallet" icon={
            <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
              <rect x="4" y="10" width="28" height="18" rx="3" stroke="#22C55E" strokeWidth="1.5" fill="#22C55E08" />
              <rect x="22" y="16" width="10" height="6" rx="2" stroke="#22C55E" strokeWidth="1" fill="#22C55E15" />
              <circle cx="27" cy="19" r="1.5" fill="#22C55E" />
            </svg>
          } />
          <StepConnector color="#22C55E" delay={0.7} />
          <StepNode delay={0.8} color="#22C55E" label="Yours" icon={
            <svg width="28" height="28" viewBox="0 0 36 36" fill="none">
              <circle cx="18" cy="18" r="12" stroke="#22C55E" strokeWidth="1.5" fill="#22C55E08" />
              <text x="18" y="22" textAnchor="middle" fill="#22C55E" fontSize="14" fontWeight="bold">$</text>
            </svg>
          } />
        </div>

        {/* Central: Celebration / coin burst */}
        <motion.div className="flex justify-center mb-8" initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.4, type: "spring" }}>
          <div className="relative w-48 h-48 flex items-center justify-center">
            {/* Orbiting coins */}
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="absolute w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold" style={{
                background: `linear-gradient(135deg, ${i % 2 === 0 ? C.stardust + "20" : "#22C55E20"}, transparent)`,
                border: `1px solid ${i % 2 === 0 ? C.stardust + "30" : "#22C55E30"}`,
                color: i % 2 === 0 ? C.stardust : "#22C55E",
                animation: `orbit ${6 + i}s linear infinite`,
                animationDelay: `${i * -1}s`,
                transformOrigin: "calc(50% + 60px) 50%",
              }}>$</div>
            ))}
            {/* Center NFT card */}
            <div className="w-20 h-28 rounded-lg relative z-10" style={{
              background: `linear-gradient(145deg, ${C.surface}, ${C.bg})`,
              border: `1px solid ${C.plasma}30`,
              boxShadow: `0 0 30px ${C.plasma}10, 0 0 60px #22C55E08`,
              animation: "float 3s ease-in-out infinite",
            }}>
              <div className="h-[3px] w-full rounded-t-lg" style={{ background: `linear-gradient(90deg, ${C.plasma}, ${C.stardust})` }} />
              <div className="p-2 text-center">
                <svg width="24" height="28" viewBox="0 0 40 48" fill="none" className="mx-auto mb-1">
                  <path d="M20 2C14 2, 4 8, 4 18C4 28, 10 40, 14 44C16 46, 18 46, 20 38C22 46, 24 46, 26 44C30 40, 36 28, 36 18C36 8, 26 2, 20 2Z"
                    fill="#22C55E15" stroke="#22C55E" strokeWidth="1.5" />
                </svg>
                <div className="text-[8px] font-mono" style={{ color: "#22C55E" }}>VERIFIED</div>
                <div className="text-[7px] font-mono mt-0.5" style={{ color: C.muted + "50" }}>TFN-0001</div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div className="text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ delay: 0.6 }}>
          <h3 className="font-display text-2xl md:text-3xl font-bold mb-2" style={{ color: "#22C55E" }}>The Reward</h3>
          <p className="text-sm max-w-lg mx-auto leading-relaxed" style={{ color: C.muted + "80" }}>
            NFT delivered to your wallet. Crypto earned. Sovereign money for you, young soldier.
          </p>
        </motion.div>
      </div>
    </div>
  )
}

// ─── Journey Section Wrapper with scroll-linked thread ──────────────────────
function JourneySection() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] })
  const threadHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"])

  return (
    <section ref={containerRef} className="relative py-12 z-10">
      {/* Vertical connecting thread */}
      <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-px pointer-events-none">
        <motion.div className="w-full origin-top" style={{
          height: threadHeight,
          background: `linear-gradient(to bottom, ${C.stardust}40, ${C.aurora}40, ${C.nebula}40, ${C.plasma}40, #22C55E40)`,
        }} />
      </div>

      <div className="max-w-6xl mx-auto">
        <motion.div className="text-center mb-4" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-3">
            <span className="bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent">The Journey of a Tooth</span>
          </h2>
          <p className="text-sm font-mono" style={{ color: C.muted + "50" }}>Three steps. One sovereign reward.</p>
        </motion.div>
        <PickupPanel />
        {/* Divider */}
        <div className="flex justify-center py-4"><div className="w-px h-16" style={{ background: `linear-gradient(to bottom, ${C.stardust}20, ${C.aurora}40, ${C.aurora}20)` }} /></div>
        <MintPanel />
        <div className="flex justify-center py-4"><div className="w-px h-16" style={{ background: `linear-gradient(to bottom, ${C.aurora}20, #22C55E40, #22C55E20)` }} /></div>
        <RewardPanel />
      </div>
    </section>
  )
}

// ─── 3D Carousel Card ────────────────────────────────────────────────────────
function CarouselCard({ card, bio, offset, isCenter }: { card: NFTCard; bio: { age: number; bio: string }; offset: number; isCenter: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5, active: false })

  const rarityColors = { common: "#94A3B8", uncommon: "#22C55E", rare: "#3B82F6", legendary: "#F59E0B" }
  const typeLabels = { child: "Child", animal: "Wildlife", collective: "Collective" }

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current || !isCenter) return
    const rect = cardRef.current.getBoundingClientRect()
    setMouse({ x: (e.clientX - rect.left) / rect.width, y: (e.clientY - rect.top) / rect.height, active: true })
  }, [isCenter])
  const handleMouseLeave = useCallback(() => { setMouse({ x: 0.5, y: 0.5, active: false }) }, [])

  // 3D carousel transform: center card faces you, side cards angle away
  const rotateY = offset * 35 // degrees per card offset
  const translateZ = isCenter ? 0 : -120 - Math.abs(offset) * 40
  const translateX = offset * 280
  const scale = isCenter ? 1 : 0.85 - Math.abs(offset) * 0.05
  const opacity = Math.abs(offset) > 2 ? 0 : 1 - Math.abs(offset) * 0.15
  const zIndex = 10 - Math.abs(offset)

  // Extra tilt from cursor (only on center card)
  const tiltX = isCenter ? (mouse.y - 0.5) * (mouse.active ? -12 : 0) : 0
  const tiltY = isCenter ? (mouse.x - 0.5) * (mouse.active ? 12 : 0) : 0
  const glareX = mouse.x * 100, glareY = mouse.y * 100
  const glareOpacity = mouse.active && isCenter ? 0.15 : 0

  return (
    <div
      ref={cardRef}
      className="absolute top-0 left-1/2 w-[320px] cursor-pointer"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `translateX(${translateX - 160}px) perspective(1200px) rotateY(${rotateY + tiltY}deg) rotateX(${tiltX}deg) translateZ(${translateZ}px) scale(${scale})`,
        transition: "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s",
        opacity, zIndex,
        transformStyle: "preserve-3d",
      }}
    >
      <div className="rounded-2xl overflow-hidden relative" style={{
        background: `linear-gradient(145deg, ${C.surface}f0, ${C.bg}e0)`,
        border: `1px solid ${isCenter && mouse.active ? card.color + "60" : "rgba(255,255,255,0.08)"}`,
        boxShadow: isCenter
          ? `0 25px 80px rgba(0,0,0,0.6), 0 0 40px ${card.color}15`
          : `0 4px 24px rgba(0,0,0,0.3)`,
      }}>
        {/* Glare */}
        <div className="absolute inset-0 pointer-events-none z-30 rounded-2xl overflow-hidden" style={{
          background: `radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,${glareOpacity}) 0%, transparent 60%)`,
        }} />

        {/* Top accent */}
        <div className="h-[3px] w-full relative" style={{
          background: `linear-gradient(90deg, ${card.color}, ${card.accent}, ${card.color})`,
        }}>
          <div className="absolute inset-0 blur-sm" style={{
            background: `linear-gradient(90deg, ${card.color}80, ${card.accent}80, ${card.color}80)`,
          }} />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <span className="text-[10px] font-mono tracking-wider" style={{ color: C.muted + "70" }}>{card.id}</span>
          <span className="text-[9px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full font-bold" style={{
            color: rarityColors[card.rarity], background: rarityColors[card.rarity] + "15",
            border: `1px solid ${rarityColors[card.rarity]}30`,
          }}>{card.rarity}</span>
        </div>

        {/* Portrait placeholder + tooth art */}
        <div className="mx-5 h-[120px] rounded-xl mb-3 relative overflow-hidden flex items-center justify-center" style={{
          background: `linear-gradient(135deg, ${card.color}12, ${card.accent}08, ${card.color}05)`,
          border: `1px solid ${card.color}15`,
        }}>
          {/* Silhouette avatar circle */}
          <div className="w-16 h-16 rounded-full relative overflow-hidden" style={{
            background: `linear-gradient(135deg, ${card.color}30, ${card.accent}20)`,
            border: `2px solid ${card.color}40`,
            boxShadow: `0 0 20px ${card.color}15`,
          }}>
            {/* Abstract face silhouette */}
            <svg viewBox="0 0 64 64" className="w-full h-full opacity-50">
              <circle cx="32" cy="24" r="12" fill={card.color + "40"} />
              <ellipse cx="32" cy="52" rx="18" ry="14" fill={card.color + "30"} />
            </svg>
          </div>
          {/* Mini tooth icon */}
          <div className="absolute bottom-2 right-2 opacity-40">
            <svg width="24" height="24" viewBox="0 0 80 80" fill="none">
              <path d="M40 10 C30 10, 15 20, 15 35 C15 50, 25 65, 30 70 C33 73, 37 73, 40 65 C43 73, 47 73, 50 70 C55 65, 65 50, 65 35 C65 20, 50 10, 40 10Z"
                stroke={card.accent} strokeWidth="2" fill={card.accent + "10"} />
            </svg>
          </div>
          {/* Type badge */}
          <div className="absolute top-2 left-2 text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full" style={{
            color: card.color, background: card.color + "10", border: `1px solid ${card.color}20`,
          }}>{typeLabels[card.type]}</div>
          {/* Age badge */}
          <div className="absolute top-2 right-2 text-[9px] font-mono px-2 py-0.5 rounded-full font-bold" style={{
            color: C.text, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)",
          }}>Age {bio.age}</div>
        </div>

        {/* Name + bio */}
        <div className="px-5 pb-2">
          <h3 className="font-display text-lg font-bold mb-0.5" style={{ color: C.text }}>{card.name}</h3>
          <p className="text-[11px] font-mono" style={{ color: card.accent + "cc" }}>{card.label}</p>
          <p className="text-[10px] font-mono mt-0.5" style={{ color: C.muted + "60" }}>{card.location}</p>
          <p className="text-[11px] mt-2 leading-relaxed italic" style={{ color: C.muted + "90" }}>&ldquo;{bio.bio}&rdquo;</p>
        </div>

        {/* Bio data */}
        <div className="mx-5 mt-1 mb-2 p-3 rounded-xl" style={{
          background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)",
        }}>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            <div className="flex justify-between">
              <span className="text-[10px] font-mono" style={{ color: C.muted + "60" }}>Type</span>
              <span className="text-[10px] font-mono font-bold" style={{ color: C.text + "cc" }}>{card.toothType.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[10px] font-mono" style={{ color: C.muted + "60" }}>Ca\u00B2\u207A</span>
              <span className="text-[10px] font-mono font-bold" style={{ color: card.accent }}>{card.toothType.calciumPct}%</span>
            </div>
          </div>
        </div>

        {/* On-chain */}
        <div className="mx-5 mb-2 p-3 rounded-xl" style={{
          background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)",
        }}>
          <div className="flex justify-between">
            <span className="text-[10px] font-mono" style={{ color: C.muted + "60" }}>Token</span>
            <span className="text-[10px] font-mono font-bold" style={{ color: C.aurora }}>#{card.tokenId}</span>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[10px] font-mono" style={{ color: C.muted + "60" }}>Verified</span>
            <span className="text-[10px] font-mono font-bold" style={{ color: "#22c55e" }}>{card.verifications.toLocaleString()}\u00D7</span>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex items-center justify-between px-5 py-3 border-t" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#22c55e", boxShadow: "0 0 4px #22c55e" }} />
            <span className="text-[10px] font-mono" style={{ color: "#22c55e" }}>Verified</span>
          </div>
          <span className="text-[9px] font-mono" style={{ color: C.muted + "50" }}>
            {new Date(card.mintTimestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
        </div>
      </div>
    </div>
  )
}

// ─── 3D Card Carousel (Stripe Sessions style + drag/swipe) ──────────────────
function CardCarousel() {
  const [activeIndex, setActiveIndex] = useState(Math.floor(CARDS.length / 2))
  const containerRef = useRef<HTMLDivElement>(null)
  const dragRef = useRef({ startX: 0, dragging: false, startIdx: 0 })

  const goTo = useCallback((idx: number) => {
    setActiveIndex(Math.max(0, Math.min(CARDS.length - 1, idx)))
  }, [])

  // Keyboard nav
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goTo(activeIndex - 1)
      if (e.key === "ArrowRight") goTo(activeIndex + 1)
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [activeIndex, goTo])

  // Drag/swipe handlers
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    dragRef.current = { startX: e.clientX, dragging: true, startIdx: activeIndex }
    if (containerRef.current) containerRef.current.style.cursor = "grabbing"
  }, [activeIndex])

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current.dragging) return
    const dx = e.clientX - dragRef.current.startX
    const threshold = 80 // pixels per card
    const offset = Math.round(-dx / threshold)
    const newIdx = Math.max(0, Math.min(CARDS.length - 1, dragRef.current.startIdx + offset))
    if (newIdx !== activeIndex) setActiveIndex(newIdx)
  }, [activeIndex])

  const handlePointerUp = useCallback(() => {
    dragRef.current.dragging = false
    if (containerRef.current) containerRef.current.style.cursor = "grab"
  }, [])

  // Touch swipe support
  const touchRef = useRef({ startX: 0, startIdx: 0 })
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchRef.current = { startX: e.touches[0].clientX, startIdx: activeIndex }
  }, [activeIndex])
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const dx = e.touches[0].clientX - touchRef.current.startX
    const threshold = 60
    const offset = Math.round(-dx / threshold)
    const newIdx = Math.max(0, Math.min(CARDS.length - 1, touchRef.current.startIdx + offset))
    if (newIdx !== activeIndex) setActiveIndex(newIdx)
  }, [activeIndex])

  // Click on side cards to navigate
  const handleCardClick = useCallback((idx: number) => {
    // Ignore click if it was a drag
    if (Math.abs(dragRef.current.startX) > 0) return
    goTo(idx)
  }, [goTo])

  return (
    <div className="relative">
      {/* Carousel viewport */}
      <div
        ref={containerRef}
        className="relative h-[600px] overflow-hidden select-none"
        style={{ perspective: "1200px", cursor: "grab" }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        <div className="relative h-full" style={{ transformStyle: "preserve-3d" }}>
          {CARDS.map((card, i) => {
            const offset = i - activeIndex
            if (Math.abs(offset) > 3) return null
            return (
              <div key={card.id} onClick={() => handleCardClick(i)}>
                <CarouselCard card={card} bio={CARD_BIOS[i]} offset={offset} isCenter={offset === 0} />
              </div>
            )
          })}
        </div>
      </div>

      {/* Navigation arrows */}
      <div className="flex justify-center gap-4 mt-6">
        <button onClick={() => goTo(activeIndex - 1)} disabled={activeIndex === 0}
          className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all disabled:opacity-20" style={{
            border: "1px solid rgba(255,255,255,0.1)", color: C.muted,
          }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18L9 12L15 6" /></svg>
        </button>
        <div className="flex items-center gap-1.5">
          {CARDS.map((_, i) => (
            <button key={i} onClick={() => goTo(i)}
              className="w-2 h-2 rounded-full cursor-pointer transition-all" style={{
                background: i === activeIndex ? C.aurora : "rgba(255,255,255,0.15)",
                boxShadow: i === activeIndex ? `0 0 8px ${C.aurora}60` : "none",
                transform: i === activeIndex ? "scale(1.3)" : "scale(1)",
              }} />
          ))}
        </div>
        <button onClick={() => goTo(activeIndex + 1)} disabled={activeIndex === CARDS.length - 1}
          className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all disabled:opacity-20" style={{
            border: "1px solid rgba(255,255,255,0.1)", color: C.muted,
          }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18L15 12L9 6" /></svg>
        </button>
      </div>
    </div>
  )
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function FairyNetworkPage() {
  const [teethCount, setTeethCount] = useState(47832)
  const [fairyCount] = useState(1247)
  const [nftCount, setNftCount] = useState(12503)
  const [countryCount, setCountryCount] = useState(84)
  const [selectedCardIdx, setSelectedCardIdx] = useState<number | null>(null)
  const [bottomWalletToast, setBottomWalletToast] = useState(false)
  const [email, setEmail] = useState("")
  const [emailStatus, setEmailStatus] = useState<"idle" | "sending" | "sent">("idle")

  const handleNodeClick = useCallback((nodeIndex: number, _city: string) => {
    const cardIdx = HUB_TO_CARD[nodeIndex]
    if (cardIdx !== undefined) {
      setSelectedCardIdx((prev) => prev === cardIdx ? null : cardIdx)
    }
  }, [])

  useEffect(() => {
    const iv = setInterval(() => {
      setTeethCount((c) => c + 1)
      if (Date.now() % 3 === 0) setNftCount((c) => c + 1)
    }, 3500)
    // Countries increase slowly (one every ~25 seconds)
    const cv = setInterval(() => { setCountryCount((c) => Math.min(c + 1, 196)) }, 25000)
    return () => { clearInterval(iv); clearInterval(cv) }
  }, [])

  useEffect(() => {
    const html = document.documentElement, body = document.body
    const oh = html.style.background, ob = body.style.background
    html.style.background = C.bg; body.style.background = C.bg
    return () => { html.style.background = oh; body.style.background = ob }
  }, [])

  // Journey data removed — now handled by JourneySection component

  return (
    <div className="min-h-screen relative" style={{ background: C.bg, color: C.text }}>
      <StarField />
      <NavBar />
      <ChatWidget />

      {/* ─── HERO: Globe ─── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-24 pb-20 z-10">
        {/* Aurora blob layer — large animated gradient orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <AuroraBlob color={C.nebula} size={800} blur={120} opacity={0.1} className="absolute -top-[200px] left-[10%] animate-aurora-drift" />
          <AuroraBlob color={C.aurora} size={700} blur={100} opacity={0.08} className="absolute top-[30%] -right-[100px] animate-aurora-drift-reverse" />
          <AuroraBlob color={C.plasma} size={600} blur={110} opacity={0.06} className="absolute -bottom-[150px] left-[30%] animate-aurora-drift" />
        </div>

        <div className="max-w-7xl w-full mx-auto relative">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }} className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-[11px] font-mono uppercase tracking-[0.2em] glass" style={{
              color: C.aurora,
            }}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" style={{ boxShadow: "0 0 6px #22c55e" }} />
              Network Live — {FAIRY_NODES.length} Nodes
            </div>
            <h1 className="font-display text-display-lg md:text-display-xl lg:text-display-2xl font-bold mb-4">
              <span className="bg-gradient-to-r from-purple-300 via-cyan-300 to-amber-300 bg-clip-text text-transparent">The Tooth Fairy Network</span>
            </h1>
            <p className="text-base md:text-lg max-w-xl mx-auto font-sans leading-relaxed" style={{ color: C.muted + "aa" }}>
              Every lost tooth. Verified. Minted. Rewarded.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 lg:gap-12 items-start">
            <div className="flex flex-col items-center relative">
              {/* Globe glow wrapper — breathing cosmic aura */}
              <div className="globe-glow-wrapper">
                <CosmicGlobe size={560} rotateSpeed={0.002} simulateArrivals arrivalInterval={3000} showLabels darkness={1} showArcs onNodeClick={handleNodeClick} />
              </div>
              {/* Mini card popup when a globe node is clicked */}
              {selectedCardIdx !== null && CARDS[selectedCardIdx] && (
                <MiniCardPopup
                  card={CARDS[selectedCardIdx]}
                  bio={CARD_BIOS[selectedCardIdx]}
                  onClose={() => setSelectedCardIdx(null)}
                />
              )}
              <NetworkLegend />
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <MetricTicker label="Teeth Collected" value={teethCount} color={C.aurora} />
                <MetricTicker label="Active Fairies" value={fairyCount} color={C.nebula} />
                <MetricTicker label="NFTs Minted" value={nftCount} color={C.plasma} />
                <MetricTicker label="Countries" value={countryCount} color={C.stardust} />
              </div>
              <ActivityFeed />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── BENTO GRID: Navigation Cards ─── */}
      <section className="relative py-20 z-10">
        <div className="max-w-5xl mx-auto px-6">
          <ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Card 1: About — spans 2 cols */}
              <Link href="/toothfairy/network/about" className="md:col-span-2 group">
                <div className="glass-card rounded-3xl p-8 h-full relative overflow-hidden transition-all duration-300 group-hover:scale-[1.01]">
                  <div className="absolute top-0 right-0 w-[300px] h-[300px] pointer-events-none opacity-[0.04]" style={{
                    background: `radial-gradient(circle, ${C.nebula}, transparent 70%)`,
                  }} />
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] mb-3 block" style={{ color: C.nebula + "70" }}>About</span>
                  <h3 className="font-display text-2xl font-bold mb-2" style={{ color: C.text }}>Meet the Architect</h3>
                  <p className="text-sm leading-relaxed max-w-md" style={{ color: C.muted + "80" }}>
                    The story behind the network, the philosophy of sovereign ownership, and why teeth matter.
                  </p>
                </div>
              </Link>
              {/* Card 2: Bitcoin GenZ */}
              <Link href="/toothfairy/network/bitcoin-genz" className="group">
                <div className="glass-card rounded-3xl p-8 h-full relative overflow-hidden transition-all duration-300 group-hover:scale-[1.01]">
                  <div className="absolute bottom-0 left-0 w-[200px] h-[200px] pointer-events-none opacity-[0.04]" style={{
                    background: `radial-gradient(circle, ${C.stardust}, transparent 70%)`,
                  }} />
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] mb-3 block" style={{ color: C.stardust + "70" }}>Article</span>
                  <h3 className="font-display text-xl font-bold mb-2" style={{ color: C.text }}>Bitcoin for Gen Z</h3>
                  <p className="text-sm leading-relaxed" style={{ color: C.muted + "80" }}>
                    The whitepaper, translated.
                  </p>
                </div>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* ─── THE JOURNEY ─── */}
      <JourneySection />

      {/* ─── MINTED MEMORIES: 3D Card Carousel ─── */}
      <section className="relative py-24 z-10">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <AuroraBlob color={C.plasma} size={600} blur={100} opacity={0.06} className="absolute top-[20%] -left-[100px]" />
        </div>
        <div className="max-w-7xl mx-auto px-6 mb-8">
          <ScrollReveal>
            <div className="text-center">
              <h2 className="font-display text-display-sm md:text-display-md font-bold mb-3">
                <span className="bg-gradient-to-r from-amber-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">Minted Memories</span>
              </h2>
            </div>
          </ScrollReveal>
        </div>
        <CardCarousel />
      </section>

      {/* ─── EVERY TOOTH + ACTION (unified bottom) ─── */}
      <section className="relative py-28 px-6 z-10">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <AuroraBlob color={C.nebula} size={700} blur={100} opacity={0.08} className="absolute top-0 right-[10%]" />
          <AuroraBlob color={C.aurora} size={500} blur={90} opacity={0.06} className="absolute bottom-0 left-[20%]" />
        </div>
        <div className="max-w-5xl mx-auto relative">
          <ScrollReveal>
            <h2 className="font-display text-display-md md:text-display-xl font-bold mb-16 text-center">
              <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-amber-300 bg-clip-text text-transparent">
                Every tooth tells a story.
              </span>
            </h2>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-12 items-center">
              {/* Metrics (live) */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: teethCount.toLocaleString(), label: "Teeth Collected", color: C.aurora },
                  { value: nftCount.toLocaleString(), label: "NFTs Minted", color: C.plasma },
                  { value: countryCount.toLocaleString(), label: "Countries", color: C.stardust },
                  { value: fairyCount.toLocaleString(), label: "Active Fairies", color: C.nebula },
                ].map((stat) => (
                  <div key={stat.label} className="glass-card rounded-2xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 pointer-events-none" style={{
                      background: `radial-gradient(circle, ${stat.color}12, transparent 70%)`,
                    }} />
                    <div className="font-display text-3xl md:text-4xl font-bold mb-1" style={{ color: stat.color }}>{stat.value}</div>
                    <div className="text-[10px] font-mono uppercase tracking-wider" style={{ color: C.muted + "70" }}>{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Action panel */}
              <div className="flex flex-col items-center gap-5 md:min-w-[280px] relative">
                <motion.button
                  onClick={() => { setBottomWalletToast(true); setTimeout(() => setBottomWalletToast(false), 3000) }}
                  className="w-full px-10 py-4 rounded-2xl font-display text-base font-semibold relative overflow-hidden cursor-pointer"
                  style={{ color: C.bg, background: `linear-gradient(135deg, ${C.nebula}, ${C.aurora}, ${C.stardust})`, backgroundSize: "200% 200%" }}
                  whileHover={{ scale: 1.03, boxShadow: `0 0 40px ${C.nebula}40, 0 0 80px ${C.aurora}20` }}
                  whileTap={{ scale: 0.98 }}
                  animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}>
                  Connect Wallet
                </motion.button>
                {bottomWalletToast && (
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl glass text-xs font-mono whitespace-nowrap animate-fadeIn" style={{ color: C.text }}>
                    Wallet connection coming soon.
                  </div>
                )}
                <div className="w-full flex items-center gap-2">
                  <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
                  <span className="text-[10px] font-mono" style={{ color: C.muted + "40" }}>or</span>
                  <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.06)" }} />
                </div>
                <form className="w-full flex gap-2" onSubmit={(e) => {
                  e.preventDefault()
                  if (!email.trim() || emailStatus === "sending") return
                  setEmailStatus("sending")
                  // Store locally — backend integration coming soon
                  setTimeout(() => {
                    setEmailStatus("sent")
                    setEmail("")
                  }, 600)
                }}>
                  <input type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className="flex-1 px-4 py-3 rounded-xl text-sm font-mono outline-none" style={{
                    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                    color: C.text,
                  }} />
                  <button type="submit" className="px-5 py-3 rounded-xl text-sm font-mono cursor-pointer transition-all hover:bg-white/[0.08]" style={{
                    color: C.muted, border: "1px solid rgba(255,255,255,0.1)",
                  }}>{emailStatus === "sent" ? "Joined!" : emailStatus === "sending" ? "..." : "Join"}</button>
                </form>
                <Link href="/toothfairy/network/about" className="text-sm font-mono cursor-pointer transition-all hover:underline" style={{ color: C.muted + "60" }}>
                  Learn More
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <footer className="relative py-8 px-6 z-10 border-t" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="text-[11px] font-mono" style={{ color: C.muted + "40" }}>The Tooth Fairy Network &copy; 2026</span>
          <div className="flex items-center gap-4">
            <span className="text-[11px] font-mono cursor-pointer hover:underline" style={{ color: C.muted + "40" }}>Privacy</span>
            <span className="text-[11px] font-mono cursor-pointer hover:underline" style={{ color: C.muted + "40" }}>Terms</span>
          </div>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes pulse { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.7; } }
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        @keyframes sparkle { 0%, 100% { opacity: 0.2; transform: scale(0.8); } 50% { opacity: 1; transform: scale(1.3); } }
        @keyframes scanLine { 0% { top: 0%; } 50% { top: 95%; } 100% { top: 0%; } }
        @keyframes statusBlink { 0% { opacity: 0.4; } 50% { opacity: 1; } 100% { opacity: 0.4; } }
        @keyframes orbit { 0% { transform: rotate(0deg) translateX(60px) rotate(0deg); } 100% { transform: rotate(360deg) translateX(60px) rotate(-360deg); } }
        @keyframes travelDot { 0% { left: 0%; opacity: 0; } 20% { opacity: 1; } 80% { opacity: 1; } 100% { left: 100%; opacity: 0; } }
      `}</style>
    </div>
  )
}
