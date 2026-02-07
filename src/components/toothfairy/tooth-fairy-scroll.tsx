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
  common: "#94A3B8",
  uncommon: "#22C55E",
  rare: "#3B82F6",
  legendary: "#F59E0B",
}

// ─── SVG: Tooth (realistic molar shape) ──────────────────────────────────────
function ToothSVG({ className = "", size = 48 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size * 1.2} viewBox="0 0 60 72" fill="none" className={className}>
      <path
        d="M10 30 C10 10, 20 2, 30 2 C40 2, 50 10, 50 30 C50 36, 44 38, 38 37 C34 36, 30 34, 26 36 C22 38, 10 36, 10 30Z"
        fill="currentColor"
      />
      <path d="M18 36 C17 44, 15 56, 18 66" stroke="currentColor" strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d="M42 36 C43 44, 45 56, 42 66" stroke="currentColor" strokeWidth="6" strokeLinecap="round" fill="none" />
    </svg>
  )
}

// ─── SVG: Full Bedroom Scene (BRIGHTENED) ────────────────────────────────────
function BedroomScene() {
  return (
    <svg viewBox="0 0 800 500" className="w-full max-w-3xl" fill="none">
      {/* Back wall — brighter indigo */}
      <rect x="0" y="0" width="800" height="500" fill={C.wall} />
      {/* Subtle wall texture lines */}
      <line x1="0" y1="190" x2="800" y2="190" stroke="#25258a" strokeWidth="0.5" opacity="0.3" />
      {/* Floor */}
      <rect x="0" y="380" width="800" height="120" fill={C.floor} />
      <line x1="0" y1="380" x2="800" y2="380" stroke={C.stroke} strokeWidth="1.5" />

      {/* Window — higher contrast */}
      <rect x="480" y="60" width="180" height="220" rx="8" fill="#080828" stroke={C.stroke} strokeWidth="2.5" />
      <line x1="570" y1="60" x2="570" y2="280" stroke={C.stroke} strokeWidth="2" />
      <line x1="480" y1="170" x2="660" y2="170" stroke={C.stroke} strokeWidth="2" />
      {/* Night sky through panes */}
      <rect x="483" y="63" width="84" height="104" rx="2" fill="#0c0c30" />
      <rect x="573" y="63" width="84" height="104" rx="2" fill="#0c0c30" />
      <rect x="483" y="173" width="84" height="104" rx="2" fill="#0c0c30" />
      <rect x="573" y="173" width="84" height="104" rx="2" fill="#0c0c30" />
      {/* Moon — bright warm glow */}
      <circle cx="550" cy="118" r="30" fill="#FFF8DC" opacity="0.9" />
      <circle cx="564" cy="110" r="26" fill="#0c0c30" />
      {/* Stars */}
      <circle cx="510" cy="90" r="2" fill="white" opacity="0.9" />
      <circle cx="620" cy="98" r="1.5" fill="white" opacity="0.8" />
      <circle cx="530" cy="148" r="1.5" fill="white" opacity="0.8" />
      <circle cx="605" cy="200" r="2" fill="white" opacity="0.7" />
      <circle cx="640" cy="138" r="1.5" fill="white" opacity="0.7" />
      <circle cx="500" cy="210" r="1" fill="white" opacity="0.6" />
      {/* Moonlight beam — visible warm wash */}
      <path d="M480 280 L360 400 L700 400 L660 280Z" fill={`${C.stardust}15`} />

      {/* Nightstand */}
      <rect x="55" y="278" width="85" height="102" rx="5" fill={C.furniture} stroke={C.stroke} strokeWidth="1.5" />
      <line x1="65" y1="328" x2="130" y2="328" stroke={C.stroke} strokeWidth="1" />
      {/* Drawer knob */}
      <circle cx="97" cy="305" r="3" fill={C.stroke} />
      {/* Lamp base */}
      <rect x="86" y="244" width="28" height="34" rx="3" fill="#2e2e80" stroke={C.stroke} strokeWidth="1" />
      {/* Lamp shade */}
      <path d="M76 244 L80 212 L120 212 L124 244Z" fill="#2e2e7a" stroke={C.stroke} strokeWidth="1" />
      {/* Lamp glow — warm */}
      <circle cx="100" cy="228" r="50" fill={`${C.stardust}12`} />
      <circle cx="100" cy="228" r="30" fill={`${C.stardust}08`} />

      {/* Picture frame on wall */}
      <rect x="300" y="80" width="100" height="70" rx="3" fill="#1a1a55" stroke={C.stroke} strokeWidth="1.5" />
      <rect x="310" y="90" width="80" height="50" rx="1" fill="#1e1e5a" />

      {/* Bed headboard — visible with detail */}
      <rect x="140" y="232" width="340" height="24" rx="10" fill="#2a2a80" stroke={C.stroke} strokeWidth="1.5" />
      {/* Headboard slats */}
      <line x1="220" y1="234" x2="220" y2="254" stroke={C.stroke} strokeWidth="1" opacity="0.4" />
      <line x1="310" y1="234" x2="310" y2="254" stroke={C.stroke} strokeWidth="1" opacity="0.4" />
      <line x1="400" y1="234" x2="400" y2="254" stroke={C.stroke} strokeWidth="1" opacity="0.4" />
      {/* Mattress */}
      <rect x="140" y="256" width="340" height="78" rx="6" fill={C.furniture} stroke={C.stroke} strokeWidth="0.5" />
      {/* Footboard */}
      <rect x="140" y="334" width="340" height="56" rx="5" fill="#282878" stroke={C.stroke} strokeWidth="1.5" />
      {/* Bed legs */}
      <rect x="148" y="388" width="14" height="12" rx="2" fill="#282878" />
      <rect x="456" y="388" width="14" height="12" rx="2" fill="#282878" />

      {/* Blanket — distinct color, visible folds */}
      <path d="M150 278 Q310 248 470 278 L470 334 L150 334 Z" fill="#1e1e70" stroke="#3535a0" strokeWidth="1" />
      <path d="M170 298 Q310 272 455 298" stroke="#2828a0" strokeWidth="1.5" fill="none" opacity="0.6" />
      <path d="M180 314 Q310 290 448 314" stroke="#2828a0" strokeWidth="1" fill="none" opacity="0.4" />

      {/* Pillow */}
      <ellipse cx="210" cy="268" rx="64" ry="22" fill="#2e2e8a" stroke={C.stroke} strokeWidth="1" />

      {/* Child — dark silhouette contrasts against brighter bed */}
      <circle cx="222" cy="254" r="26" fill="#141440" />
      <path d="M245 270 Q320 248 420 278" stroke="#141440" strokeWidth="24" strokeLinecap="round" fill="none" />
      {/* Hair */}
      <path d="M198 242 Q215 228 240 238" stroke="#101030" strokeWidth="4" fill="none" strokeLinecap="round" />

      {/* TOOTH GLOW — the hero element, very bright */}
      <circle cx="185" cy="278" r="28" fill={`${C.stardust}35`}>
        <animate attributeName="r" values="24;32;24" dur="2s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="185" cy="278" r="12" fill={`${C.stardust}70`}>
        <animate attributeName="r" values="10;16;10" dur="2s" repeatCount="indefinite" />
      </circle>
      {/* Tooth icon */}
      <g transform="translate(177, 268) scale(0.22)" fill={C.stardust}>
        <path d="M10 30 C10 10, 20 2, 30 2 C40 2, 50 10, 50 30 C50 36, 44 38, 38 37 C34 36, 30 34, 26 36 C22 38, 10 36, 10 30Z" />
      </g>

      {/* Rug */}
      <ellipse cx="350" cy="412" rx="150" ry="28" fill="#1a1a55" stroke="#2a2a70" strokeWidth="1" />
      {/* Rug pattern */}
      <ellipse cx="350" cy="412" rx="100" ry="16" fill="none" stroke="#24246a" strokeWidth="0.8" />
    </svg>
  )
}

// ─── SVG: Fairy with glow (BRIGHTENED) ───────────────────────────────────────
function FairyScene() {
  return (
    <svg viewBox="0 0 600 400" className="w-full max-w-2xl" fill="none">
      {/* Room backdrop */}
      <rect x="0" y="0" width="600" height="400" fill={C.room} opacity="0.4" />

      {/* Fairy glow aura — much brighter */}
      <circle cx="300" cy="140" r="120" fill={`${C.nebula}18`} />
      <circle cx="300" cy="140" r="70" fill={`${C.nebula}20`} />
      <circle cx="300" cy="140" r="35" fill={`${C.nebula}12`} />

      {/* Sparkle trail from top-right */}
      <path d="M500 20 Q420 60 350 100 Q320 120 300 150" stroke={`${C.stardust}80`} strokeWidth="2.5" strokeDasharray="4 6" className="scene2-trail-path" />
      <path d="M500 20 Q420 60 350 100 Q320 120 300 150" stroke={`${C.stardust}30`} strokeWidth="10" className="scene2-trail-glow" />

      {/* Sparkle dots — brighter */}
      <circle cx="480" cy="35" r="3" fill={C.stardust} opacity="0.8" />
      <circle cx="430" cy="60" r="4" fill={C.stardust} opacity="0.9" />
      <circle cx="380" cy="85" r="3" fill={C.nebula} opacity="0.8" />
      <circle cx="340" cy="108" r="3.5" fill={C.stardust} opacity="0.7" />
      <circle cx="455" cy="48" r="2" fill="white" opacity="0.6" />
      <circle cx="360" cy="95" r="2" fill="white" opacity="0.5" />

      {/* Fairy — bigger, brighter */}
      <g transform="translate(255, 90)">
        {/* Wing glow */}
        <ellipse cx="45" cy="50" rx="50" ry="35" fill={`${C.nebula}15`} />

        {/* Left wing */}
        <path d="M45 45 Q5 5 10 50 Q5 80 38 65" fill={`${C.nebula}60`} stroke={C.nebula} strokeWidth="2" />
        {/* Right wing */}
        <path d="M45 45 Q85 5 80 50 Q85 80 52 65" fill={`${C.nebula}60`} stroke={C.nebula} strokeWidth="2" />
        {/* Inner wing detail */}
        <path d="M45 45 Q15 20 15 50" stroke={`${C.nebula}90`} strokeWidth="0.8" fill="none" />
        <path d="M45 45 Q75 20 75 50" stroke={`${C.nebula}90`} strokeWidth="0.8" fill="none" />

        {/* Body glow */}
        <ellipse cx="45" cy="65" rx="14" ry="24" fill={`${C.nebula}35`} />
        {/* Body */}
        <ellipse cx="45" cy="65" rx="8" ry="20" fill="#2a1a70" stroke={C.nebula} strokeWidth="1" />
        {/* Head */}
        <circle cx="45" cy="38" r="11" fill="#2a1a70" stroke={C.nebula} strokeWidth="1" />
        {/* Eyes */}
        <circle cx="41" cy="36" r="1.5" fill={C.nebula} opacity="0.8" />
        <circle cx="49" cy="36" r="1.5" fill={C.nebula} opacity="0.8" />

        {/* Wand */}
        <line x1="56" y1="55" x2="80" y2="35" stroke={C.stardust} strokeWidth="2" />
        <circle cx="82" cy="33" r="5" fill={C.stardust} />
        {/* Wand glow */}
        <circle cx="82" cy="33" r="14" fill={`${C.stardust}25`}>
          <animate attributeName="r" values="10;18;10" dur="1.5s" repeatCount="indefinite" />
        </circle>
        {/* Wand star */}
        <path d="M82 25 L83 31 L89 32 L84 35 L85 41 L82 37 L79 41 L80 35 L75 32 L81 31Z" fill={C.stardust} opacity="0.5">
          <animate attributeName="opacity" values="0.3;0.8;0.3" dur="1.5s" repeatCount="indefinite" />
        </path>
      </g>

      {/* Connection beam: fairy to tooth */}
      <line x1="300" y1="190" x2="300" y2="310" stroke={C.stardust} strokeWidth="3" opacity="0.5" strokeDasharray="5 5" className="scene2-beam" />
      <line x1="300" y1="190" x2="300" y2="310" stroke={C.stardust} strokeWidth="10" opacity="0.12" className="scene2-beam-glow" />

      {/* Tooth being lifted — brighter */}
      <g transform="translate(284, 285)" className="scene2-tooth-lift">
        <circle cx="16" cy="16" r="24" fill={`${C.stardust}30`} />
        <g fill={C.stardust} transform="scale(0.5)">
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
      <line key={`h${i}`} x1="0" y1={pos} x2="100" y2={pos} stroke={`${C.aurora}18`} strokeWidth="0.3" />,
      <line key={`v${i}`} x1={pos} y1="0" x2={pos} y2="100" stroke={`${C.aurora}18`} strokeWidth="0.3" />
    )
  }
  return (
    <svg viewBox="0 0 100 100" className="scene3-grid absolute inset-0 w-full h-full" preserveAspectRatio="none">{lines}</svg>
  )
}

// ─── Child NFT Card (V1 style — child IS a globe node) ──────────────────────
function ChildCard({ index, compact = false }: { index: number; compact?: boolean }) {
  const card = CARDS[index]
  const bio = CARD_BIOS[index]
  const typeLabels = { child: "Child", animal: "Wildlife", collective: "Collective" }

  return (
    <div
      className={`rounded-2xl overflow-hidden flex-shrink-0 ${compact ? "w-56" : "w-72"}`}
      style={{
        background: `linear-gradient(145deg, ${C.surface}f0, ${C.bg}e0)`,
        border: `1px solid ${card.color}30`,
        boxShadow: `0 8px 40px rgba(0,0,0,0.4), 0 0 30px ${card.color}12`,
      }}
    >
      {/* Top accent bar */}
      <div className="h-[3px]" style={{ background: `linear-gradient(90deg, ${card.color}, ${card.accent})` }} />

      <div className={compact ? "p-3.5" : "p-5"}>
        {/* Header row */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-mono tracking-wider" style={{ color: `${C.muted}70` }}>{card.id}</span>
          <span
            className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-widest"
            style={{
              color: RARITY_COLORS[card.rarity],
              background: `${RARITY_COLORS[card.rarity]}15`,
              border: `1px solid ${RARITY_COLORS[card.rarity]}30`,
            }}
          >
            {card.rarity}
          </span>
        </div>

        {/* Avatar + Name */}
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={{
              background: `linear-gradient(135deg, ${card.color}25, ${card.accent}15)`,
              border: `2px solid ${card.color}40`,
            }}
          >
            <svg viewBox="0 0 64 64" className="w-6 h-6 opacity-60">
              <circle cx="32" cy="24" r="12" fill={`${card.color}50`} />
              <ellipse cx="32" cy="52" rx="18" ry="14" fill={`${card.color}35`} />
            </svg>
          </div>
          <div className="min-w-0">
            <h4 className={`font-display font-bold truncate ${compact ? "text-sm" : "text-base"}`} style={{ color: C.text }}>{card.name}</h4>
            <p className="text-[10px] font-mono" style={{ color: card.color }}>
              Age {bio.age} &middot; {card.location}
            </p>
          </div>
        </div>

        {/* Bio */}
        <p className="text-[11px] leading-relaxed italic mb-3" style={{ color: `${C.muted}90` }}>
          &ldquo;{bio.bio}&rdquo;
        </p>

        {/* Globe node label — this connects card to globe */}
        <div className="flex items-center gap-2 mb-3 px-2.5 py-1.5 rounded-lg" style={{ background: `${card.color}08`, border: `1px solid ${card.color}15` }}>
          <div className="w-2 h-2 rounded-full" style={{ background: card.color, boxShadow: `0 0 6px ${card.color}80` }} />
          <span className="text-[10px] font-mono" style={{ color: card.color }}>{card.label}</span>
          <span className="text-[9px] font-mono ml-auto" style={{ color: `${C.muted}50` }}>{typeLabels[card.type]}</span>
        </div>

        {/* Tooth + chain data */}
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

        {/* On-chain data */}
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

// ─── SVG: Wallet Icon ────────────────────────────────────────────────────────
function WalletIcon({ className = "", lit = false }: { className?: string; lit?: boolean }) {
  const color = lit ? C.green : C.muted
  return (
    <svg viewBox="0 0 100 100" className={`w-24 h-24 ${className}`} fill="none">
      {lit && <circle cx="50" cy="50" r="48" fill={`${C.green}15`} />}
      <rect x="15" y="25" width="70" height="50" rx="8" fill={`${color}20`} stroke={color} strokeWidth="2.5" />
      <path d="M55 25 L55 45 Q55 52 62 52 L85 52 L85 40 Q85 25 70 25 Z" fill={`${color}12`} stroke={color} strokeWidth="2" />
      <circle cx="75" cy="48" r="5" fill={color} opacity="0.9" />
      {lit && <circle cx="75" cy="48" r="3" fill="white" />}
    </svg>
  )
}

// ─── Network Node SVG ────────────────────────────────────────────────────────
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
          },
        })
      }

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
        .fromTo(".s7-label", { opacity: 0 }, { opacity: 1, duration: 0.3 }, 0.3)
        .fromTo(".s7-carousel", { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.4 }, 0.4)

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

  // ─── Network nodes (3 rings) ─────────────────────────────────────────────
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
        <div className="scene1-glow absolute w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: `radial-gradient(circle, ${C.stardust}12 0%, transparent 70%)`, top: "30%", left: "50%", transform: "translate(-50%, -50%)" }} />
        <div className="s1-room px-4"><BedroomScene /></div>
        <p className="s1-text mt-8 text-xl sm:text-2xl font-display tracking-wide" style={{ color: `${C.text}dd` }}>A tooth falls.</p>
        <div className="absolute bottom-8 flex flex-col items-center gap-2 opacity-50">
          <span className="text-xs font-mono" style={{ color: C.muted }}>scroll</span>
          <div className="w-px h-8" style={{ background: `linear-gradient(to bottom, ${C.muted}60, transparent)`, animation: "scrollPulse 2s ease-in-out infinite" }} />
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

      {/* ═══ SCENE 4: THE NFT (shows a real child card) ════════════════ */}
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
        <p className="s4-text mt-6 text-xl sm:text-2xl font-display tracking-wide" style={{ color: `${C.text}dd` }}>Minted.</p>
      </section>

      {/* ═══ SCENE 5: THE NETWORK ════════════════════════════════ */}
      <section ref={s5} className="relative z-10 h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="relative w-full max-w-2xl aspect-square px-4">
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
            <NetworkNode x={50} y={50} color={C.aurora} size={7} />
          </svg>
          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full">
            {netNodes.map((n, i) => (
              <g key={i} className="s5-node"><NetworkNode x={n.x} y={n.y} color={n.c} size={i < 7 ? 5 : i < 17 ? 3.5 : 2.5} /></g>
            ))}
          </svg>
        </div>
        <div className="s5-counter mt-6 flex items-center gap-6 sm:gap-10 text-center">
          {[{ v: "47,832", l: "teeth" }, { v: "84", l: "countries" }, { v: "1,247", l: "fairies" }].map((m, i) => (
            <div key={i} className="flex flex-col">
              <span className="text-2xl sm:text-4xl font-mono font-bold" style={{ color: C.text }}>{m.v}</span>
              <span className="text-xs font-mono" style={{ color: `${C.muted}80` }}>{m.l}</span>
            </div>
          ))}
        </div>
        <p className="s5-text mt-4 text-xl sm:text-2xl font-display tracking-wide" style={{ color: `${C.text}dd` }}>One network.</p>
      </section>

      {/* ═══ SCENE 6: THE DELIVERY ═══════════════════════════════ */}
      <section ref={s6} className="relative z-10 h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="flex items-center gap-8 sm:gap-16">
          <div className="s6-card-fly">
            <div className="w-16 h-20 rounded-lg" style={{ background: `linear-gradient(145deg, ${C.aurora}25, ${C.nebula}15)`, border: `1px solid ${C.aurora}35`, boxShadow: `0 0 20px ${C.aurora}25` }}>
              <div className="flex items-center justify-center h-full" style={{ color: C.aurora }}>
                <ToothSVG size={20} />
              </div>
            </div>
          </div>
          <svg width="60" height="20" viewBox="0 0 60 20" fill="none">
            <path d="M0 10 L50 10 M40 3 L52 10 L40 17" stroke={C.aurora} strokeWidth="2" strokeDasharray="4 4" opacity="0.5" />
          </svg>
          <div className="s6-wallet relative">
            <WalletIcon lit={true} />
            <div className="s6-glow absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-32 h-32 rounded-full" style={{ background: `radial-gradient(circle, ${C.green}25 0%, transparent 70%)` }} />
            </div>
          </div>
        </div>
        <p className="s6-text mt-10 text-xl sm:text-2xl font-display tracking-wide" style={{ color: `${C.text}dd` }}>Delivered to your wallet.</p>
        <p className="mt-2 text-sm font-mono" style={{ color: `${C.muted}90` }}>Digital ownership starts early.</p>
      </section>

      {/* ═══ SCENE 7: THE GLOBE + CHILDREN CARDS ═══════════════ */}
      <section ref={s7} className="relative z-10 min-h-screen flex flex-col items-center justify-center overflow-hidden py-12">
        <div className="s7-globe relative">{children}</div>
        <p className="s7-label mt-2 text-sm font-mono" style={{ color: `${C.muted}70` }}>Each node is a child. Drag to explore.</p>
        {/* Children card carousel — these ARE the globe nodes */}
        <div className="s7-carousel mt-8 w-full overflow-x-auto pb-4" style={{ scrollbarWidth: "thin", scrollbarColor: `${C.muted}30 transparent` }}>
          <div className="flex gap-4 px-6 w-max mx-auto">
            {CARDS.map((_, i) => (
              <ChildCard key={i} index={i} compact />
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
