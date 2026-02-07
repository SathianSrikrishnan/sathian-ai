"use client"

import { useEffect, useRef, useCallback, useState, type ReactNode } from "react"
import { gsap, ScrollTrigger } from "@/lib/gsap"

// ─── Colors ──────────────────────────────────────────────────────────────────
const C = {
  bg: "#050510",
  room: "#161650",
  wall: "#1e1e60",
  floor: "#101038",
  furniture: "#242470",
  stroke: "#3a3a90",
  nebula: "#7C3AED",
  aurora: "#06B6D4",
  stardust: "#F59E0B",
  plasma: "#EC4899",
  text: "#F1F5F9",
  muted: "#A78BFA",
  green: "#22C55E",
  surface: "#0F0F2D",
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
const rng = mulberry32(888)
const genHash = () => "0x" + Array.from({ length: 8 }, () => Math.floor(rng() * 16).toString(16)).join("")

// ─── Tooth Types ─────────────────────────────────────────────────────────────
const TOOTH_TYPES = [
  { name: "Central Incisor", code: "A", calciumPct: 96.2 },
  { name: "Lateral Incisor", code: "B", calciumPct: 95.8 },
  { name: "Canine", code: "C", calciumPct: 97.1 },
  { name: "First Molar", code: "D", calciumPct: 96.5 },
  { name: "Second Molar", code: "E", calciumPct: 96.9 },
  { name: "Central Incisor", code: "F", calciumPct: 95.4 },
]

// ─── NFT Card Data — V1 children (these ARE the globe nodes) ────────────────
interface NFTCard {
  id: string; name: string; type: "child" | "animal" | "collective"
  label: string; toothType: typeof TOOTH_TYPES[number]
  color: string; accent: string; blockHash: string
  tokenId: number; verifications: number
  location: string; rarity: "common" | "uncommon" | "rare" | "legendary"
}

const CARDS: NFTCard[] = [
  { id: "TFN-0001", name: "Zara Ahmed", type: "collective", label: "Persepolis Gate",
    toothType: TOOTH_TYPES[0], color: C.stardust, accent: "#FCD34D",
    blockHash: genHash(), tokenId: 1091, verifications: 1091, location: "Tehran, Iran", rarity: "rare" },
  { id: "TFN-0002", name: "Muhammad Rashid", type: "child", label: "Straitspark Dock",
    toothType: TOOTH_TYPES[1], color: C.plasma, accent: "#F9A8D4",
    blockHash: genHash(), tokenId: 734, verifications: 734, location: "Johor Bahru, Malaysia", rarity: "uncommon" },
  { id: "TFN-0003", name: "Arjun Selvam", type: "child", label: "Tamarind Wisp",
    toothType: TOOTH_TYPES[3], color: C.aurora, accent: "#67E8F9",
    blockHash: genHash(), tokenId: 412, verifications: 412, location: "Usulampatti, Tamil Nadu", rarity: "common" },
  { id: "TFN-0004", name: "Kai Reeves", type: "collective", label: "Launchpad Shimmer",
    toothType: TOOTH_TYPES[2], color: C.nebula, accent: "#A78BFA",
    blockHash: genHash(), tokenId: 2047, verifications: 2047, location: "Starbase, Texas", rarity: "legendary" },
  { id: "TFN-0005", name: "Viola Desmond", type: "collective", label: "Frostbloom Citadel",
    toothType: TOOTH_TYPES[4], color: C.stardust, accent: "#FBBF24",
    blockHash: genHash(), tokenId: 8301, verifications: 8301, location: "Toronto, Canada", rarity: "legendary" },
  { id: "TFN-0006", name: "\u00CDsak Bj\u00F6rnsson", type: "child", label: "Aurorafrost Spire",
    toothType: TOOTH_TYPES[5], color: "#818CF8", accent: "#C4B5FD",
    blockHash: genHash(), tokenId: 523, verifications: 523, location: "Reykjavik, Iceland", rarity: "uncommon" },
  { id: "TFN-0007", name: "Dasha Petrova", type: "child", label: "Frostfire Dome",
    toothType: TOOTH_TYPES[1], color: "#60A5FA", accent: "#93C5FD",
    blockHash: genHash(), tokenId: 891, verifications: 891, location: "Moscow, Russia", rarity: "rare" },
  { id: "TFN-0008", name: "Mateo Silva", type: "child", label: "Sugarloaf Beacon",
    toothType: TOOTH_TYPES[0], color: "#34D399", accent: "#6EE7B7",
    blockHash: genHash(), tokenId: 1456, verifications: 1456, location: "Rio de Janeiro, Brazil", rarity: "rare" },
  { id: "TFN-0009", name: "Priya Narine", type: "child", label: "Demerara Glow",
    toothType: TOOTH_TYPES[3], color: C.aurora, accent: "#22D3EE",
    blockHash: genHash(), tokenId: 267, verifications: 267, location: "Georgetown, Guyana", rarity: "common" },
  { id: "TFN-0010", name: "Thandi Nkosi", type: "child", label: "Stormwing Point",
    toothType: TOOTH_TYPES[5], color: C.plasma, accent: "#FB7185",
    blockHash: genHash(), tokenId: 643, verifications: 643, location: "Cape Town, South Africa", rarity: "uncommon" },
  { id: "TFN-0011", name: "Fatima Al-Rashidi", type: "collective", label: "Oasis Prism Tower",
    toothType: TOOTH_TYPES[2], color: C.stardust, accent: "#F59E0B",
    blockHash: genHash(), tokenId: 1823, verifications: 1823, location: "Abu Dhabi, UAE", rarity: "rare" },
  { id: "TFN-0012", name: "Zofia Kowalska", type: "child", label: "Amber Wing Post",
    toothType: TOOTH_TYPES[4], color: "#F472B6", accent: "#FBCFE8",
    blockHash: genHash(), tokenId: 558, verifications: 558, location: "Warsaw, Poland", rarity: "uncommon" },
]

const CARD_BIOS = [
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
  { age: 7, bio: "Lost it biting into a warm p\u0105czek on Fat Thursday" },
]

const RARITY_COLORS: Record<string, string> = {
  common: "#94A3B8", uncommon: "#22C55E", rare: "#3B82F6", legendary: "#F59E0B",
}

// ─── SVG: Tooth (single filled path — NOT jellyfish) ─────────────────────────
function ToothSVG({ className = "", size = 48 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 40 48" fill="none" className={className}>
      <path
        d="M20 2 C12 2, 4 10, 4 22 C4 29, 7 35, 10 39 C12 43, 14 46, 16 44 C18 42, 19 38, 20 34 C21 38, 22 42, 24 44 C26 46, 28 43, 30 39 C33 35, 36 29, 36 22 C36 10, 28 2, 20 2Z"
        fill="currentColor"
      />
    </svg>
  )
}

// ─── SVG: Bedroom Scene (BIGGER, more detail) ────────────────────────────────
function BedroomScene() {
  return (
    <svg viewBox="0 0 900 550" className="w-full max-w-5xl" fill="none">
      {/* Walls */}
      <rect x="0" y="0" width="900" height="550" fill={C.wall} />
      {/* Ceiling line */}
      <line x1="0" y1="40" x2="900" y2="40" stroke="#25258a" strokeWidth="0.8" opacity="0.3" />
      {/* Floor */}
      <rect x="0" y="420" width="900" height="130" fill={C.floor} />
      <line x1="0" y1="420" x2="900" y2="420" stroke={C.stroke} strokeWidth="1.5" />
      {/* Floor boards */}
      <line x1="200" y1="420" x2="200" y2="550" stroke="#141450" strokeWidth="0.5" opacity="0.3" />
      <line x1="450" y1="420" x2="450" y2="550" stroke="#141450" strokeWidth="0.5" opacity="0.3" />
      <line x1="700" y1="420" x2="700" y2="550" stroke="#141450" strokeWidth="0.5" opacity="0.3" />

      {/* Window — right side */}
      <rect x="560" y="65" width="200" height="240" rx="8" fill="#080828" stroke={C.stroke} strokeWidth="2.5" />
      <line x1="660" y1="65" x2="660" y2="305" stroke={C.stroke} strokeWidth="2" />
      <line x1="560" y1="185" x2="760" y2="185" stroke={C.stroke} strokeWidth="2" />
      {/* Sky panes */}
      <rect x="563" y="68" width="94" height="114" rx="2" fill="#0c0c30" />
      <rect x="663" y="68" width="94" height="114" rx="2" fill="#0c0c30" />
      <rect x="563" y="188" width="94" height="114" rx="2" fill="#0c0c30" />
      <rect x="663" y="188" width="94" height="114" rx="2" fill="#0c0c30" />
      {/* Curtain left */}
      <path d="M545 60 Q540 180 548 310" stroke="#2a2a80" strokeWidth="8" fill="none" opacity="0.4" />
      <path d="M548 60 Q543 180 551 310" stroke="#252578" strokeWidth="4" fill="none" opacity="0.3" />
      {/* Curtain right */}
      <path d="M775 60 Q780 180 772 310" stroke="#2a2a80" strokeWidth="8" fill="none" opacity="0.4" />
      {/* Moon */}
      <circle cx="640" cy="125" r="32" fill="#FFF8DC" opacity="0.9" />
      <circle cx="654" cy="116" r="28" fill="#0c0c30" />
      {/* Stars */}
      <circle cx="590" cy="95" r="2" fill="white" opacity="0.9" />
      <circle cx="720" cy="100" r="1.5" fill="white" opacity="0.8" />
      <circle cx="610" cy="155" r="1.5" fill="white" opacity="0.8" />
      <circle cx="700" cy="215" r="2" fill="white" opacity="0.7" />
      <circle cx="740" cy="145" r="1.5" fill="white" opacity="0.7" />
      <circle cx="580" cy="225" r="1" fill="white" opacity="0.6" />
      {/* Moonlight beam */}
      <path d="M560 305 L440 440 L780 440 L760 305Z" fill={`${C.stardust}12`} />

      {/* Door frame — left side */}
      <rect x="20" y="90" width="80" height="330" rx="3" fill="#1a1a55" stroke={C.stroke} strokeWidth="1.5" />
      <circle cx="88" cy="260" r="4" fill={C.stroke} opacity="0.5" />

      {/* Bookshelf — left wall */}
      <rect x="120" y="100" width="90" height="180" rx="3" fill={C.furniture} stroke={C.stroke} strokeWidth="1.5" />
      {/* Shelves */}
      <line x1="120" y1="160" x2="210" y2="160" stroke={C.stroke} strokeWidth="1" />
      <line x1="120" y1="220" x2="210" y2="220" stroke={C.stroke} strokeWidth="1" />
      {/* Books */}
      <rect x="128" y="105" width="8" height="52" rx="1" fill="#3a3a90" />
      <rect x="138" y="110" width="6" height="47" rx="1" fill="#4a3a80" />
      <rect x="146" y="108" width="10" height="49" rx="1" fill="#2a4a90" />
      <rect x="158" y="112" width="7" height="45" rx="1" fill="#3a3090" />
      <rect x="128" y="165" width="12" height="50" rx="1" fill="#4a2a80" />
      <rect x="142" y="168" width="8" height="47" rx="1" fill="#2a3a90" />
      <rect x="152" y="163" width="9" height="52" rx="1" fill="#3a4a80" />
      {/* Toy on bottom shelf */}
      <circle cx="145" cy="248" r="10" fill="#3535a0" opacity="0.5" />
      <circle cx="175" cy="250" r="8" fill="#4a2a80" opacity="0.4" />

      {/* Picture on wall */}
      <rect x="360" y="85" width="110" height="75" rx="3" fill="#1a1a55" stroke={C.stroke} strokeWidth="1.5" />
      <rect x="370" y="95" width="90" height="55" rx="1" fill="#1e1e5a" />

      {/* Nightstand */}
      <rect x="230" y="300" width="90" height="120" rx="5" fill={C.furniture} stroke={C.stroke} strokeWidth="1.5" />
      <line x1="240" y1="355" x2="310" y2="355" stroke={C.stroke} strokeWidth="1" />
      <circle cx="275" cy="330" r="3.5" fill={C.stroke} />
      <circle cx="275" cy="390" r="3.5" fill={C.stroke} />
      {/* Lamp */}
      <rect x="260" y="265" width="30" height="35" rx="3" fill="#2e2e80" stroke={C.stroke} strokeWidth="1" />
      <path d="M248 265 L252 228 L298 228 L302 265Z" fill="#2e2e7a" stroke={C.stroke} strokeWidth="1" />
      <circle cx="275" cy="245" r="55" fill={`${C.stardust}10`} />
      <circle cx="275" cy="245" r="30" fill={`${C.stardust}06`} />

      {/* Bed headboard */}
      <rect x="340" y="265" width="370" height="25" rx="10" fill="#2a2a80" stroke={C.stroke} strokeWidth="1.5" />
      <line x1="430" y1="267" x2="430" y2="288" stroke={C.stroke} strokeWidth="1" opacity="0.4" />
      <line x1="525" y1="267" x2="525" y2="288" stroke={C.stroke} strokeWidth="1" opacity="0.4" />
      <line x1="620" y1="267" x2="620" y2="288" stroke={C.stroke} strokeWidth="1" opacity="0.4" />
      {/* Mattress */}
      <rect x="340" y="290" width="370" height="85" rx="6" fill={C.furniture} stroke={C.stroke} strokeWidth="0.5" />
      {/* Footboard */}
      <rect x="340" y="375" width="370" height="50" rx="5" fill="#282878" stroke={C.stroke} strokeWidth="1.5" />
      {/* Legs */}
      <rect x="350" y="423" width="14" height="12" rx="2" fill="#282878" />
      <rect x="686" y="423" width="14" height="12" rx="2" fill="#282878" />

      {/* Blanket */}
      <path d="M350 310 Q525 278 700 310 L700 375 L350 375 Z" fill="#1e1e70" stroke="#3535a0" strokeWidth="1" />
      <path d="M370 330 Q525 302 690 330" stroke="#2828a0" strokeWidth="1.5" fill="none" opacity="0.6" />
      <path d="M380 350 Q525 325 680 350" stroke="#2828a0" strokeWidth="1" fill="none" opacity="0.4" />

      {/* Pillow */}
      <ellipse cx="420" cy="302" rx="70" ry="24" fill="#2e2e8a" stroke={C.stroke} strokeWidth="1" />

      {/* Child */}
      <circle cx="430" cy="288" r="28" fill="#141440" />
      <path d="M455 305 Q540 280 660 312" stroke="#141440" strokeWidth="26" strokeLinecap="round" fill="none" />
      <path d="M405 276 Q422 262 450 272" stroke="#101030" strokeWidth="4" fill="none" strokeLinecap="round" />

      {/* TOOTH GLOW — hero element */}
      <circle cx="390" cy="310" r="32" fill={`${C.stardust}30`}>
        <animate attributeName="r" values="28;36;28" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.5;1;0.5" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="390" cy="310" r="14" fill={`${C.stardust}65`}>
        <animate attributeName="r" values="12;18;12" dur="2s" repeatCount="indefinite" />
      </circle>
      {/* Tooth icon */}
      <g transform="translate(380, 298) scale(0.5)" fill={C.stardust}>
        <path d="M20 2 C12 2, 4 10, 4 22 C4 29, 7 35, 10 39 C12 43, 14 46, 16 44 C18 42, 19 38, 20 34 C21 38, 22 42, 24 44 C26 46, 28 43, 30 39 C33 35, 36 29, 36 22 C36 10, 28 2, 20 2Z" />
      </g>

      {/* Slippers on floor */}
      <ellipse cx="480" cy="448" rx="18" ry="8" fill="#1e1e5a" stroke="#2a2a70" strokeWidth="0.8" />
      <ellipse cx="520" cy="450" rx="18" ry="8" fill="#1e1e5a" stroke="#2a2a70" strokeWidth="0.8" />

      {/* Rug */}
      <ellipse cx="550" cy="455" rx="170" ry="30" fill="#1a1a55" stroke="#2a2a70" strokeWidth="1" />
      <ellipse cx="550" cy="455" rx="110" ry="18" fill="none" stroke="#24246a" strokeWidth="0.8" />
    </svg>
  )
}

// ─── SVG: Fairy (BIGGER, more light strands) ─────────────────────────────────
function FairyScene() {
  return (
    <svg viewBox="0 0 700 480" className="w-full max-w-4xl" fill="none">
      <rect x="0" y="0" width="700" height="480" fill={C.room} opacity="0.3" />

      {/* Multiple light strands coming in from top */}
      <path d="M600 0 Q500 80 400 160 Q360 190 350 220" stroke={`${C.stardust}60`} strokeWidth="2" strokeDasharray="6 8" />
      <path d="M600 0 Q500 80 400 160 Q360 190 350 220" stroke={`${C.stardust}18`} strokeWidth="12" />
      <path d="M550 0 Q470 90 380 170 Q350 200 345 230" stroke={`${C.nebula}40`} strokeWidth="1.5" strokeDasharray="4 10" />
      <path d="M650 0 Q530 70 420 150 Q370 185 355 215" stroke={`${C.stardust}30`} strokeWidth="1" strokeDasharray="3 12" />

      {/* Sparkle dots along trails */}
      <circle cx="580" cy="30" r="3" fill={C.stardust} opacity="0.7" />
      <circle cx="520" cy="70" r="4" fill={C.stardust} opacity="0.9" />
      <circle cx="470" cy="110" r="3" fill={C.nebula} opacity="0.8" />
      <circle cx="420" cy="145" r="3.5" fill={C.stardust} opacity="0.7" />
      <circle cx="545" cy="50" r="2" fill="white" opacity="0.6" />
      <circle cx="445" cy="125" r="2" fill="white" opacity="0.5" />
      <circle cx="385" cy="165" r="2.5" fill={C.nebula} opacity="0.6" />

      {/* Fairy glow aura — large */}
      <circle cx="350" cy="200" r="140" fill={`${C.nebula}12`} />
      <circle cx="350" cy="200" r="90" fill={`${C.nebula}18`} />
      <circle cx="350" cy="200" r="50" fill={`${C.nebula}10`} />

      {/* Fairy — larger */}
      <g transform="translate(295, 140)">
        <ellipse cx="55" cy="65" rx="60" ry="42" fill={`${C.nebula}12`} />
        {/* Wings */}
        <path d="M55 55 Q5 5 12 60 Q5 100 45 80" fill={`${C.nebula}55`} stroke={C.nebula} strokeWidth="2" />
        <path d="M55 55 Q105 5 98 60 Q105 100 65 80" fill={`${C.nebula}55`} stroke={C.nebula} strokeWidth="2" />
        <path d="M55 55 Q18 25 18 60" stroke={`${C.nebula}80`} strokeWidth="0.8" fill="none" />
        <path d="M55 55 Q92 25 92 60" stroke={`${C.nebula}80`} strokeWidth="0.8" fill="none" />
        {/* Body */}
        <ellipse cx="55" cy="80" rx="16" ry="28" fill={`${C.nebula}30`} />
        <ellipse cx="55" cy="80" rx="9" ry="23" fill="#2a1a70" stroke={C.nebula} strokeWidth="1" />
        {/* Head */}
        <circle cx="55" cy="46" r="13" fill="#2a1a70" stroke={C.nebula} strokeWidth="1" />
        <circle cx="51" cy="44" r="2" fill={C.nebula} opacity="0.8" />
        <circle cx="59" cy="44" r="2" fill={C.nebula} opacity="0.8" />
        {/* Wand */}
        <line x1="68" y1="68" x2="96" y2="44" stroke={C.stardust} strokeWidth="2.5" />
        <circle cx="99" cy="41" r="6" fill={C.stardust} />
        <circle cx="99" cy="41" r="16" fill={`${C.stardust}20`}>
          <animate attributeName="r" values="12;20;12" dur="1.5s" repeatCount="indefinite" />
        </circle>
        <path d="M99 31 L100 38 L107 39 L101 43 L103 50 L99 45 L95 50 L97 43 L91 39 L98 38Z" fill={C.stardust} opacity="0.5">
          <animate attributeName="opacity" values="0.3;0.8;0.3" dur="1.5s" repeatCount="indefinite" />
        </path>
      </g>

      {/* Connection beam: fairy → tooth */}
      <line x1="350" y1="260" x2="350" y2="400" stroke={C.stardust} strokeWidth="3" opacity="0.5" strokeDasharray="6 6" />
      <line x1="350" y1="260" x2="350" y2="400" stroke={C.stardust} strokeWidth="12" opacity="0.08" />

      {/* Tooth being collected — bright */}
      <g transform="translate(332, 370)">
        <circle cx="18" cy="18" r="28" fill={`${C.stardust}25`} />
        <g fill={C.stardust} transform="scale(0.8)">
          <path d="M20 2 C12 2, 4 10, 4 22 C4 29, 7 35, 10 39 C12 43, 14 46, 16 44 C18 42, 19 38, 20 34 C21 38, 22 42, 24 44 C26 46, 28 43, 30 39 C33 35, 36 29, 36 22 C36 10, 28 2, 20 2Z" />
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
      <line key={`h${i}`} x1="0" y1={pos} x2="100" y2={pos} stroke={`${C.aurora}18`} strokeWidth="0.3" />,
      <line key={`v${i}`} x1={pos} y1="0" x2={pos} y2="100" stroke={`${C.aurora}18`} strokeWidth="0.3" />
    )
  }
  return <svg viewBox="0 0 100 100" className="scene3-grid absolute inset-0 w-full h-full" preserveAspectRatio="none">{lines}</svg>
}

// ─── Child NFT Card ──────────────────────────────────────────────────────────
function ChildCard({ index, compact = false }: { index: number; compact?: boolean }) {
  const card = CARDS[index]
  const bio = CARD_BIOS[index]
  const typeLabels: Record<string, string> = { child: "Child", animal: "Wildlife", collective: "Collective" }

  return (
    <div
      className={`rounded-2xl overflow-hidden flex-shrink-0 ${compact ? "w-56" : "w-72"}`}
      style={{
        background: `linear-gradient(145deg, ${C.surface}f0, ${C.bg}e0)`,
        border: `1px solid ${card.color}30`,
        boxShadow: `0 8px 40px rgba(0,0,0,0.4), 0 0 30px ${card.color}12`,
      }}
    >
      <div className="h-[3px]" style={{ background: `linear-gradient(90deg, ${card.color}, ${card.accent})` }} />
      <div className={compact ? "p-3.5" : "p-5"}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono tracking-wider" style={{ color: `${C.muted}70` }}>{card.id}</span>
          <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-widest" style={{
            color: RARITY_COLORS[card.rarity], background: `${RARITY_COLORS[card.rarity]}15`, border: `1px solid ${RARITY_COLORS[card.rarity]}30`,
          }}>{card.rarity}</span>
        </div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{
            background: `linear-gradient(135deg, ${card.color}25, ${card.accent}15)`, border: `2px solid ${card.color}40`,
          }}>
            <svg viewBox="0 0 64 64" className="w-6 h-6 opacity-60">
              <circle cx="32" cy="24" r="12" fill={`${card.color}50`} />
              <ellipse cx="32" cy="52" rx="18" ry="14" fill={`${card.color}35`} />
            </svg>
          </div>
          <div className="min-w-0">
            <h4 className={`font-display font-bold truncate ${compact ? "text-sm" : "text-base"}`} style={{ color: C.text }}>{card.name}</h4>
            <p className="text-[10px] font-mono" style={{ color: card.color }}>Age {bio.age} &middot; {card.location}</p>
          </div>
        </div>
        <p className="text-[11px] leading-relaxed italic mb-3" style={{ color: `${C.muted}90` }}>&ldquo;{bio.bio}&rdquo;</p>
        <div className="flex items-center gap-2 mb-3 px-2.5 py-1.5 rounded-lg" style={{ background: `${card.color}08`, border: `1px solid ${card.color}15` }}>
          <div className="w-2 h-2 rounded-full" style={{ background: card.color, boxShadow: `0 0 6px ${card.color}80` }} />
          <span className="text-[10px] font-mono" style={{ color: card.color }}>{card.label}</span>
          <span className="text-[9px] font-mono ml-auto" style={{ color: `${C.muted}50` }}>{typeLabels[card.type]}</span>
        </div>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1 mb-2">
          <div className="flex justify-between">
            <span className="text-[10px] font-mono" style={{ color: `${C.muted}60` }}>Tooth</span>
            <span className="text-[10px] font-mono font-bold" style={{ color: `${C.text}cc` }}>{card.toothType.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[10px] font-mono" style={{ color: `${C.muted}60` }}>Ca</span>
            <span className="text-[10px] font-mono font-bold" style={{ color: card.accent }}>{card.toothType.calciumPct}%</span>
          </div>
        </div>
        <div className="flex items-center justify-between pt-2 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: C.green, boxShadow: `0 0 4px ${C.green}` }} />
            <span className="text-[10px] font-mono" style={{ color: C.green }}>Verified</span>
          </div>
          <span className="text-[9px] font-mono" style={{ color: `${C.muted}50` }}>#{card.tokenId}</span>
        </div>
      </div>
    </div>
  )
}

// ─── 3D Card Carousel (Stripe Sessions style) ───────────────────────────────
function CardCarousel() {
  const [active, setActive] = useState(Math.floor(CARDS.length / 2))
  const dragRef = useRef({ startX: 0, dragging: false, startIdx: 0 })
  const touchRef = useRef({ startX: 0, startIdx: 0 })

  const goTo = useCallback((idx: number) => {
    setActive(Math.max(0, Math.min(CARDS.length - 1, idx)))
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goTo(active - 1)
      if (e.key === "ArrowRight") goTo(active + 1)
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [active, goTo])

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    dragRef.current = { startX: e.clientX, dragging: true, startIdx: active }
  }, [active])
  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current.dragging) return
    const offset = Math.round(-(e.clientX - dragRef.current.startX) / 80)
    const idx = Math.max(0, Math.min(CARDS.length - 1, dragRef.current.startIdx + offset))
    if (idx !== active) setActive(idx)
  }, [active])
  const onPointerUp = useCallback(() => { dragRef.current.dragging = false }, [])
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchRef.current = { startX: e.touches[0].clientX, startIdx: active }
  }, [active])
  const onTouchMove = useCallback((e: React.TouchEvent) => {
    const offset = Math.round(-(e.touches[0].clientX - touchRef.current.startX) / 60)
    const idx = Math.max(0, Math.min(CARDS.length - 1, touchRef.current.startIdx + offset))
    if (idx !== active) setActive(idx)
  }, [active])

  return (
    <div className="relative py-8">
      <div
        className="relative h-[480px] overflow-hidden select-none"
        style={{ perspective: "1200px", cursor: "grab" }}
        onPointerDown={onPointerDown} onPointerMove={onPointerMove}
        onPointerUp={onPointerUp} onPointerLeave={onPointerUp}
        onTouchStart={onTouchStart} onTouchMove={onTouchMove}
      >
        <div className="relative h-full" style={{ transformStyle: "preserve-3d" }}>
          {CARDS.map((_, i) => {
            const off = i - active
            if (Math.abs(off) > 3) return null
            const rY = off * 30
            const tX = off * 260 - 140
            const tZ = off === 0 ? 0 : -100 - Math.abs(off) * 40
            const sc = off === 0 ? 1 : 0.85 - Math.abs(off) * 0.05
            const op = Math.abs(off) > 2 ? 0 : 1 - Math.abs(off) * 0.15
            return (
              <div
                key={i}
                className="absolute top-0 left-1/2"
                onClick={() => goTo(i)}
                style={{
                  transform: `translateX(${tX}px) perspective(1200px) rotateY(${rY}deg) translateZ(${tZ}px) scale(${sc})`,
                  transition: "transform 0.5s cubic-bezier(0.22,1,0.36,1), opacity 0.4s",
                  opacity: op, zIndex: 10 - Math.abs(off), transformStyle: "preserve-3d",
                }}
              >
                <ChildCard index={i} />
              </div>
            )
          })}
        </div>
      </div>
      {/* Nav arrows */}
      <div className="flex justify-center items-center gap-4 mt-2">
        <button onClick={() => goTo(active - 1)} disabled={active === 0} className="w-10 h-10 rounded-full flex items-center justify-center disabled:opacity-20 cursor-pointer transition-all" style={{ border: "1px solid rgba(255,255,255,0.1)", color: C.muted }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18L9 12L15 6" /></svg>
        </button>
        <div className="flex items-center gap-1.5">
          {CARDS.map((_, i) => (
            <button key={i} onClick={() => goTo(i)} className="w-2 h-2 rounded-full cursor-pointer transition-all" style={{
              background: i === active ? C.aurora : "rgba(255,255,255,0.15)",
              boxShadow: i === active ? `0 0 8px ${C.aurora}60` : "none",
              transform: i === active ? "scale(1.4)" : "scale(1)",
            }} />
          ))}
        </div>
        <button onClick={() => goTo(active + 1)} disabled={active === CARDS.length - 1} className="w-10 h-10 rounded-full flex items-center justify-center disabled:opacity-20 cursor-pointer transition-all" style={{ border: "1px solid rgba(255,255,255,0.1)", color: C.muted }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18L15 12L9 6" /></svg>
        </button>
      </div>
    </div>
  )
}

// ─── SVG: Wallet Icon ────────────────────────────────────────────────────────
function WalletIcon({ className = "", lit = false }: { className?: string; lit?: boolean }) {
  const color = lit ? C.green : C.muted
  return (
    <svg viewBox="0 0 100 100" className={`w-28 h-28 ${className}`} fill="none">
      {lit && <circle cx="50" cy="50" r="48" fill={`${C.green}15`} />}
      <rect x="15" y="25" width="70" height="50" rx="8" fill={`${color}20`} stroke={color} strokeWidth="2.5" />
      <path d="M55 25 L55 45 Q55 52 62 52 L85 52 L85 40 Q85 25 70 25 Z" fill={`${color}12`} stroke={color} strokeWidth="2" />
      <circle cx="75" cy="48" r="5" fill={color} opacity="0.9" />
      {lit && <circle cx="75" cy="48" r="3" fill="white" />}
    </svg>
  )
}

// ─── Network Node ────────────────────────────────────────────────────────────
function NetworkNode({ x, y, color, size = 4 }: { x: number; y: number; color: string; size?: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={size * 3} fill={`${color}15`} />
      <circle cx={x} cy={y} r={size} fill={color} opacity="0.9" />
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
  const beamRef = useRef<HTMLDivElement>(null)
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
      // ─── Throughline Tooth + Beam ───────────────────────────────
      if (toothRef.current) {
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 3,
          onUpdate: (self) => {
            const p = self.progress
            const t = toothRef.current
            const b = beamRef.current
            if (!t) return

            let y: number, scale: number, opacity: number
            const isWarm = p < 0.25
            const color = isWarm ? C.stardust : C.aurora

            if (p < 0.125) {
              y = 62; scale = 0.8; opacity = 0.7
            } else if (p < 0.25) {
              const f = (p - 0.125) / 0.125
              y = 62 - f * 20; scale = 0.8 + f * 0.5; opacity = 0.9 + f * 0.1
            } else if (p < 0.375) {
              y = 42; scale = 1.5; opacity = 1
            } else if (p < 0.5) {
              y = 42; scale = 1.2; opacity = 0.6
            } else if (p < 0.625) {
              const f = (p - 0.5) / 0.125
              y = 42 + f * 5; scale = 1.2 - f * 0.9; opacity = 0.6 - f * 0.3
            } else if (p < 0.75) {
              const f = (p - 0.625) / 0.125
              y = 47 - f * 10; scale = 0.3; opacity = 0.3 * (1 - f)
            } else {
              y = 37; scale = 0.2; opacity = 0
            }

            t.style.top = `${y}%`
            t.style.transform = `translate(-50%, -50%) scale(${scale})`
            t.style.opacity = `${opacity}`
            t.style.color = color
            t.style.filter = `drop-shadow(0 0 ${16 * scale}px ${color}80)`

            // Light beam
            if (b) {
              const beamOpacity = p < 0.12 ? 0 : p < 0.75 ? 0.4 * Math.min(1, (p - 0.12) * 5) : 0
              b.style.opacity = `${beamOpacity}`
              b.style.top = `${y - 12}%`
              b.style.background = `linear-gradient(to bottom, transparent, ${color}40 30%, ${color}40 70%, transparent)`
            }
          },
        })
      }

      const pin = (ref: React.RefObject<HTMLElement | null>, end: string, scrub = 3) => {
        if (!ref.current) return gsap.timeline()
        return gsap.timeline({
          scrollTrigger: { trigger: ref.current, start: "top top", end: `+=${end}`, pin: true, scrub },
        })
      }

      pin(s1, "120%")
        .fromTo(".s1-room", { opacity: 0, scale: 0.95 }, { opacity: 1, scale: 1, duration: 0.5 })
        .fromTo(".s1-text", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.3 }, 0.4)

      pin(s2, "120%")
        .fromTo(".s2-scene", { opacity: 0 }, { opacity: 1, duration: 0.3 })
        .fromTo(".s2-text", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.3 }, 0.3)
        .fromTo(".s2-flash", { opacity: 0, scale: 0 }, { opacity: 1, scale: 2.5, duration: 0.15 }, 0.7)
        .to(".s2-flash", { opacity: 0, duration: 0.1 })

      pin(s3, "140%")
        .fromTo(".scene3-grid", { opacity: 0 }, { opacity: 1, duration: 0.2 })
        .fromTo(".s3-scanline", { top: "0%" }, { top: "100%", duration: 0.5 }, 0)
        .fromTo(".s3-data", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.2, stagger: 0.08 }, 0.15)
        .fromTo(".s3-verified", { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.25 }, 0.55)
        .fromTo(".s3-text", { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0.7)

      pin(s4, "140%")
        .fromTo(".s4-card", { opacity: 0, scale: 0.8, rotateY: -15 }, { opacity: 1, scale: 1, rotateY: 0, duration: 0.4 })
        .fromTo(".s4-stamp", { opacity: 0, scale: 2 }, { opacity: 1, scale: 1, duration: 0.25 }, 0.35)
        .fromTo(".s4-contract", { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.3 }, 0.55)
        .fromTo(".s4-text", { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0.75)

      pin(s5, "120%")
        .fromTo(".s5-center", { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.3 })
        .fromTo(".s5-conn", { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1, duration: 0.4 }, 0.1)
        .fromTo(".s5-node", { opacity: 0 }, { opacity: 1, duration: 0.3, stagger: 0.015 }, 0.15)
        .fromTo(".s5-counter", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.3 }, 0.5)
        .fromTo(".s5-text", { opacity: 0 }, { opacity: 1, duration: 0.2 }, 0.6)

      pin(s6, "100%")
        .fromTo(".s6-nft", { opacity: 1, x: 0, scale: 1 }, { opacity: 0.7, x: 60, scale: 0.6, duration: 0.25 })
        .fromTo(".s6-eth", { opacity: 0, x: -30 }, { opacity: 1, x: 60, duration: 0.25 }, 0.1)
        .fromTo(".s6-wallet", { opacity: 0.3 }, { opacity: 1, duration: 0.3 }, 0.2)
        .fromTo(".s6-glow", { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.3 }, 0.4)
        .fromTo(".s6-text", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.3 }, 0.5)

      pin(s7, "100%")
        .fromTo(".s7-globe", { opacity: 0, scale: 0.85 }, { opacity: 1, scale: 1, duration: 0.5 })
        .fromTo(".s7-cities", { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.4 }, 0.2)
        .fromTo(".s7-label", { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.4)

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

  const netNodes = [
    { x: 50, y: 28, c: C.aurora }, { x: 72, y: 38, c: C.nebula }, { x: 78, y: 60, c: C.aurora },
    { x: 64, y: 78, c: C.nebula }, { x: 36, y: 78, c: C.aurora }, { x: 22, y: 60, c: C.nebula },
    { x: 28, y: 38, c: C.aurora },
    { x: 50, y: 14, c: C.nebula }, { x: 82, y: 22, c: C.aurora }, { x: 94, y: 48, c: C.nebula },
    { x: 86, y: 72, c: C.aurora }, { x: 65, y: 90, c: C.nebula }, { x: 35, y: 90, c: C.aurora },
    { x: 14, y: 72, c: C.nebula }, { x: 6, y: 48, c: C.aurora }, { x: 18, y: 22, c: C.nebula },
    { x: 50, y: 6, c: C.aurora },
    { x: 96, y: 35, c: C.nebula }, { x: 92, y: 85, c: C.aurora }, { x: 4, y: 35, c: C.nebula },
    { x: 8, y: 85, c: C.aurora }, { x: 50, y: 97, c: C.nebula }, { x: 30, y: 5, c: C.aurora },
    { x: 70, y: 5, c: C.nebula }, { x: 50, y: 50, c: C.aurora },
  ]

  // Hub cities for sidebar
  const hubCities = CARDS.map(c => ({ name: c.location.split(",")[0], color: c.color }))

  return (
    <div ref={containerRef} className="relative" style={{ background: C.bg }}>
      <canvas ref={sparkleRef} className="fixed inset-0 z-[1] pointer-events-none" />

      {/* Throughline Tooth */}
      <div ref={toothRef} className="fixed left-1/2 z-30 pointer-events-none"
        style={{ top: "62%", transform: "translate(-50%, -50%)", color: C.stardust, filter: `drop-shadow(0 0 16px ${C.stardust}80)` }}>
        <ToothSVG size={48} />
      </div>

      {/* Light Beam (connects through all scenes) */}
      <div ref={beamRef} className="fixed left-1/2 z-20 pointer-events-none w-[2px] h-[25vh]" style={{ opacity: 0, transform: "translateX(-50%)" }} />

      {/* ═══ SCENE 1: THE ROOM ═══════════════════════════════════ */}
      <section ref={s1} className="relative z-10 h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: `radial-gradient(circle, ${C.stardust}12 0%, transparent 70%)`, top: "25%", left: "50%", transform: "translate(-50%, -50%)" }} />
        <div className="s1-room px-2 sm:px-4 w-full flex justify-center"><BedroomScene /></div>
        <p className="s1-text mt-6 text-xl sm:text-2xl font-display tracking-wide" style={{ color: `${C.text}dd` }}>A tooth falls.</p>
        <div className="absolute bottom-8 flex flex-col items-center gap-2 opacity-50">
          <span className="text-xs font-mono" style={{ color: C.muted }}>scroll</span>
          <div className="w-px h-8" style={{ background: `linear-gradient(to bottom, ${C.muted}60, transparent)`, animation: "scrollPulse 2s ease-in-out infinite" }} />
        </div>
      </section>

      {/* ═══ SCENE 2: THE FAIRY ══════════════════════════════════ */}
      <section ref={s2} className="relative z-10 h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="s2-scene px-2 sm:px-4 w-full flex justify-center"><FairyScene /></div>
        <div className="s2-flash absolute w-48 h-48 rounded-full pointer-events-none" style={{ background: `radial-gradient(circle, white 0%, ${C.stardust}40 40%, transparent 70%)`, top: "45%", left: "50%", transform: "translate(-50%, -50%) scale(0)" }} />
        <p className="s2-text mt-4 text-xl sm:text-2xl font-display tracking-wide" style={{ color: `${C.text}dd` }}>Collected.</p>
      </section>

      {/* ═══ SCENE 3: THE SCAN ═══════════════════════════════════ */}
      <section ref={s3} className="relative z-10 h-screen flex flex-col items-center justify-center overflow-hidden" style={{ background: C.bg }}>
        <ScanGrid />
        <div className="s3-scanline absolute left-0 right-0 h-[2px] z-20 pointer-events-none" style={{ background: `linear-gradient(90deg, transparent 0%, ${C.aurora} 50%, transparent 100%)`, boxShadow: `0 0 20px ${C.aurora}, 0 0 60px ${C.aurora}40`, top: "0%" }} />
        <div className="relative z-10 flex flex-col items-center gap-5">
          <div className="h-16" />
          <div className="flex flex-wrap justify-center gap-8 sm:gap-14">
            {[
              { label: "CALCIUM", value: "96.2%", cls: "s3-data" },
              { label: "DENTIN", value: "1.8mm", cls: "s3-data" },
              { label: "BLOCK", value: "0x7a2f...4e9c", cls: "s3-data" },
              { label: "TOKEN", value: "#1091", cls: "s3-data" },
            ].map((d) => (
              <div key={d.label} className={d.cls}>
                <span className="text-[10px] font-mono uppercase tracking-widest block" style={{ color: `${C.aurora}80` }}>{d.label}</span>
                <span className="text-xl sm:text-2xl font-mono font-bold" style={{ color: C.aurora }}>{d.value}</span>
              </div>
            ))}
          </div>
          <div className="s3-verified mt-2 px-8 py-2.5 rounded-full border" style={{ borderColor: `${C.aurora}50`, background: `${C.aurora}12`, boxShadow: `0 0 40px ${C.aurora}25` }}>
            <span className="text-base font-mono font-bold tracking-widest" style={{ color: C.aurora }}>&#10003; VERIFIED ON-CHAIN</span>
          </div>
        </div>
        <p className="s3-text mt-6 text-xl sm:text-2xl font-display tracking-wide" style={{ color: `${C.text}dd` }}>Verified on-chain.</p>
      </section>

      {/* ═══ SCENE 4: NFT + SMART CONTRACT + PAYMENT ═════════════ */}
      <section ref={s4} className="relative z-10 h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute w-[400px] h-[400px] rounded-full pointer-events-none" style={{ background: `radial-gradient(circle, ${C.stardust}10 0%, transparent 70%)`, top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
        <div className="s4-card relative" style={{ perspective: "1000px" }}>
          <ChildCard index={0} />
          <div className="s4-stamp absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="px-6 py-2 rounded-full rotate-[-8deg]" style={{ border: `2px solid ${C.green}60`, color: C.green, background: `${C.green}08` }}>
              <span className="text-lg font-mono font-bold tracking-widest">MINTED</span>
            </div>
          </div>
        </div>
        {/* Smart contract + payment */}
        <div className="s4-contract mt-5 flex flex-col items-center gap-2">
          <div className="flex items-center gap-3 px-5 py-2.5 rounded-xl" style={{ background: `${C.aurora}08`, border: `1px solid ${C.aurora}20` }}>
            <div className="w-2 h-2 rounded-full" style={{ background: C.aurora, boxShadow: `0 0 6px ${C.aurora}` }}>
              <animate attributeName="opacity" values="0.5;1;0.5" dur="1s" />
            </div>
            <span className="text-sm font-mono" style={{ color: C.aurora }}>Smart contract executed</span>
          </div>
          <div className="flex items-center gap-3 px-5 py-2 rounded-xl" style={{ background: `${C.green}08`, border: `1px solid ${C.green}20` }}>
            <span className="text-sm font-mono" style={{ color: C.green }}>Payment sent &rarr; 0.05 ETH</span>
          </div>
        </div>
        <p className="s4-text mt-4 text-xl sm:text-2xl font-display tracking-wide" style={{ color: `${C.text}dd` }}>Minted. Paid. Permanent.</p>
      </section>

      {/* ═══ SCENE 5: THE NETWORK (LARGER) ═════════════════════════ */}
      <section ref={s5} className="relative z-10 h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="relative w-full max-w-4xl aspect-square px-4" style={{ maxHeight: "65vh" }}>
          <svg viewBox="0 0 100 100" className="s5-conn absolute inset-0 w-full h-full" fill="none">
            {netNodes.slice(0, 7).map((n, i) => (
              <line key={`ci${i}`} x1="50" y1="50" x2={n.x} y2={n.y} stroke={n.c} strokeWidth="0.5" opacity="0.4" strokeDasharray="2 3" />
            ))}
            {netNodes.slice(7, 17).map((n, i) => (
              <line key={`mi${i}`} x1={netNodes[i % 7].x} y1={netNodes[i % 7].y} x2={n.x} y2={n.y} stroke={n.c} strokeWidth="0.3" opacity="0.3" strokeDasharray="1 4" />
            ))}
            {netNodes.slice(17).map((n, i) => (
              <line key={`oi${i}`} x1={netNodes[7 + (i % 10)].x} y1={netNodes[7 + (i % 10)].y} x2={n.x} y2={n.y} stroke={n.c} strokeWidth="0.2" opacity="0.25" strokeDasharray="1 5" />
            ))}
          </svg>
          <svg viewBox="0 0 100 100" className="s5-center absolute inset-0 w-full h-full">
            <NetworkNode x={50} y={50} color={C.aurora} size={8} />
          </svg>
          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
            {netNodes.map((n, i) => (
              <g key={i} className="s5-node"><NetworkNode x={n.x} y={n.y} color={n.c} size={i < 7 ? 5 : i < 17 ? 4 : 3} /></g>
            ))}
          </svg>
        </div>
        <div className="s5-counter mt-4 flex items-center gap-6 sm:gap-10 text-center">
          {[{ v: "47,832", l: "teeth" }, { v: "84", l: "countries" }, { v: "1,247", l: "fairies" }].map((m, i) => (
            <div key={i} className="flex flex-col">
              <span className="text-2xl sm:text-4xl font-mono font-bold" style={{ color: C.text }}>{m.v}</span>
              <span className="text-xs font-mono" style={{ color: `${C.muted}80` }}>{m.l}</span>
            </div>
          ))}
        </div>
        <p className="s5-text mt-3 text-xl sm:text-2xl font-display tracking-wide" style={{ color: `${C.text}dd` }}>One network.</p>
      </section>

      {/* ═══ SCENE 6: DELIVERY (NFT + ETH → Wallet) ══════════════ */}
      <section ref={s6} className="relative z-10 h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="flex items-center gap-6 sm:gap-12">
          {/* NFT card flying */}
          <div className="flex flex-col items-center gap-3">
            <div className="s6-nft">
              <div className="w-16 h-20 rounded-lg flex items-center justify-center" style={{ background: `linear-gradient(145deg, ${C.aurora}25, ${C.nebula}15)`, border: `1px solid ${C.aurora}35`, boxShadow: `0 0 20px ${C.aurora}25`, color: C.aurora }}>
                <ToothSVG size={20} />
              </div>
              <p className="text-[9px] font-mono mt-1 text-center" style={{ color: `${C.aurora}80` }}>NFT</p>
            </div>
            <div className="s6-eth">
              <div className="px-3 py-1.5 rounded-lg" style={{ background: `${C.green}12`, border: `1px solid ${C.green}25` }}>
                <span className="text-xs font-mono font-bold" style={{ color: C.green }}>0.05 ETH</span>
              </div>
            </div>
          </div>
          {/* Arrow */}
          <svg width="60" height="40" viewBox="0 0 60 40" fill="none">
            <path d="M0 20 L48 20 M38 10 L50 20 L38 30" stroke={C.aurora} strokeWidth="2" strokeDasharray="4 4" opacity="0.5" />
          </svg>
          {/* Wallet */}
          <div className="s6-wallet relative">
            <WalletIcon lit={true} />
            <div className="s6-glow absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-36 h-36 rounded-full" style={{ background: `radial-gradient(circle, ${C.green}20 0%, transparent 70%)` }} />
            </div>
          </div>
        </div>
        <p className="s6-text mt-10 text-xl sm:text-2xl font-display tracking-wide" style={{ color: `${C.text}dd` }}>Delivered to your wallet.</p>
        <p className="mt-2 text-sm font-mono" style={{ color: `${C.muted}90` }}>NFT stored. Payment received. All on-chain.</p>
      </section>

      {/* ═══ SCENE 7: GLOBE + CITY SIDEBAR ═══════════════════════ */}
      <section ref={s7} className="relative z-10 min-h-screen flex flex-col items-center justify-center overflow-hidden py-12">
        <div className="flex items-start gap-6 sm:gap-10">
          <div className="s7-globe relative">{children}</div>
          {/* City names sidebar */}
          <div className="s7-cities hidden sm:flex flex-col gap-2 py-4 pr-4">
            <span className="text-[10px] font-mono uppercase tracking-widest mb-2" style={{ color: `${C.muted}60` }}>Network Nodes</span>
            {hubCities.map((c, i) => (
              <div key={i} className="flex items-center gap-2 cursor-pointer hover:opacity-100 transition-opacity" style={{ opacity: 0.7 }}>
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: c.color, boxShadow: `0 0 4px ${c.color}60` }} />
                <span className="text-[11px] font-mono whitespace-nowrap" style={{ color: C.text }}>{c.name}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="s7-label mt-3 text-sm font-mono" style={{ color: `${C.muted}70` }}>Each node is a child. Drag to explore.</p>
      </section>

      {/* ═══ 3D CARD CAROUSEL (between globe and CTA) ════════════ */}
      <section className="relative z-10 min-h-screen flex flex-col items-center justify-center overflow-hidden">
        <CardCarousel />
      </section>

      {/* ═══ SCENE 8: CTA ════════════════════════════════════════ */}
      <section ref={s8} className="relative z-10 h-screen flex flex-col items-center justify-center overflow-hidden px-6">
        <div className="s8-card w-full max-w-md rounded-3xl p-8 sm:p-12 text-center" style={{ background: "linear-gradient(145deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)", border: "1px solid rgba(255,255,255,0.08)", backdropFilter: "blur(20px)", boxShadow: `0 0 60px ${C.nebula}10, 0 20px 60px rgba(0,0,0,0.5)` }}>
          <p className="text-2xl sm:text-3xl font-display tracking-tight mb-2" style={{ color: C.text }}>Every tooth tells a story.</p>
          <p className="text-sm mb-8" style={{ color: `${C.muted}99` }}>Financial ownership starts young. Join the network.</p>
          <div className="flex gap-2">
            <input type="email" placeholder="your@email.com" className="flex-1 px-4 py-3 rounded-xl text-sm font-mono outline-none" style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", color: C.text }} />
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
