"use client"

import { LAMPORTS_PER_SOL } from "@solana/web3.js"
import { TOOTH_LABELS } from "@/lib/toothfairy/program"
import { C } from "../tokens"

interface MilestoneData {
  publicKey: string
  toothType: string
  depositLamports: number
  claimed: boolean
  createdAt: number
  claimedAt: number | null
  milestoneIndex: number
  metadataUri: string
}

interface MilestoneGalleryProps {
  milestones: MilestoneData[]
  onClaim: (milestoneIndex: number) => Promise<void>
  claimLoading: number | null
  childName: string
}

export function MilestoneGallery({ milestones, onClaim, claimLoading, childName }: MilestoneGalleryProps) {
  if (milestones.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-4xl mb-3">🦷</p>
        <p style={{ color: C.muted }}>No milestones yet for {childName}</p>
        <p className="text-sm mt-1" style={{ color: C.dim }}>
          Record a lost tooth to create the first milestone!
        </p>
      </div>
    )
  }

  const sorted = [...milestones].sort((a, b) => b.createdAt - a.createdAt)

  return (
    <div className="grid gap-3">
      {sorted.map((m) => {
        const sol = m.depositLamports / LAMPORTS_PER_SOL
        const date = new Date(m.createdAt * 1000)
        const toothLabel = TOOTH_LABELS[m.toothType] || m.toothType

        return (
          <div
            key={m.publicKey}
            className="p-4 rounded-xl border flex items-center justify-between gap-4"
            style={{
              background: "rgba(255,255,255,0.02)",
              borderColor: m.claimed ? "rgba(16,185,129,0.2)" : C.border,
            }}
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-lg">🦷</span>
                <span className="text-sm font-medium truncate">{toothLabel}</span>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <span className="text-xs" style={{ color: C.muted }}>
                  {date.toLocaleDateString()}
                </span>
                {sol > 0 && (
                  <span className="text-xs font-mono" style={{ color: C.amber }}>
                    {sol} SOL
                  </span>
                )}
                {m.claimed && (
                  <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(16,185,129,0.1)", color: C.emerald }}>
                    Claimed
                  </span>
                )}
              </div>
            </div>
            {!m.claimed && sol > 0 && (
              <button
                onClick={() => onClaim(m.milestoneIndex)}
                disabled={claimLoading === m.milestoneIndex}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-white transition-all hover:opacity-90 disabled:opacity-50 shrink-0"
                style={{ background: C.emerald }}
              >
                {claimLoading === m.milestoneIndex ? "Claiming..." : "Release SOL"}
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}

export type { MilestoneData }
