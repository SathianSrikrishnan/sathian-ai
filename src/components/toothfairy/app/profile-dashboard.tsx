"use client"

import { LAMPORTS_PER_SOL } from "@solana/web3.js"
import { C } from "../tokens"
import type { MilestoneData } from "./milestone-gallery"

interface ChildData {
  name: string
  walletAddress: string
  milestoneCount: number
  totalDeposited: number
  totalClaimed: number
  profilePda: string
}

interface ProfileDashboardProps {
  children: ChildData[]
  milestones: MilestoneData[]
  activeChild: number
  onSwitchChild: (index: number) => void
}

export function ProfileDashboard({ children, milestones, activeChild, onSwitchChild }: ProfileDashboardProps) {
  const child = children[activeChild]
  if (!child) return null

  const totalDeposited = child.totalDeposited / LAMPORTS_PER_SOL
  const totalClaimed = child.totalClaimed / LAMPORTS_PER_SOL
  const pending = totalDeposited - totalClaimed
  const unclaimedCount = milestones.filter((m) => !m.claimed && m.depositLamports > 0).length

  // Combined family view if multiple children
  const familyTotal = children.reduce((sum, c) => sum + c.totalDeposited, 0) / LAMPORTS_PER_SOL
  const familyClaimed = children.reduce((sum, c) => sum + c.totalClaimed, 0) / LAMPORTS_PER_SOL

  return (
    <div className="space-y-4">
      {/* Child switcher */}
      {children.length > 1 && (
        <div className="flex gap-2">
          {children.map((c, i) => (
            <button
              key={c.profilePda}
              onClick={() => onSwitchChild(i)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                i === activeChild ? "text-white bg-white/10" : "hover:bg-white/5"
              }`}
              style={i !== activeChild ? { color: C.muted } : undefined}
            >
              {c.name}
            </button>
          ))}
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard label="Teeth Recorded" value={child.milestoneCount.toString()} sub={`of 20`} />
        <StatCard label="Total Deposited" value={`${totalDeposited.toFixed(2)}`} sub="SOL" color={C.amber} />
        <StatCard label="Pending Release" value={`${pending.toFixed(2)}`} sub={`${unclaimedCount} milestone${unclaimedCount !== 1 ? "s" : ""}`} color={C.cyan} />
        <StatCard label="Total Claimed" value={`${totalClaimed.toFixed(2)}`} sub="SOL" color={C.emerald} />
      </div>

      {/* Family total */}
      {children.length > 1 && (
        <div
          className="p-3 rounded-lg border text-center"
          style={{ background: "rgba(255,255,255,0.02)", borderColor: C.border }}
        >
          <span className="text-xs" style={{ color: C.muted }}>Family Total: </span>
          <span className="text-sm font-mono font-medium" style={{ color: C.amber }}>
            {familyTotal.toFixed(2)} SOL deposited
          </span>
          <span className="text-xs ml-2" style={{ color: C.dim }}>
            ({familyClaimed.toFixed(2)} claimed)
          </span>
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, sub, color }: { label: string; value: string; sub: string; color?: string }) {
  return (
    <div
      className="p-3 rounded-lg border"
      style={{ background: "rgba(255,255,255,0.02)", borderColor: C.border }}
    >
      <p className="text-xs mb-1" style={{ color: C.dim }}>{label}</p>
      <p className="text-xl font-mono font-bold" style={{ color: color || C.text }}>{value}</p>
      <p className="text-xs" style={{ color: C.muted }}>{sub}</p>
    </div>
  )
}

export type { ChildData }
