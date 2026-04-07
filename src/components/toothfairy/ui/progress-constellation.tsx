"use client"

import { useViewMode } from "../view-mode-context"
import { C, ds } from "../tokens"
import { PC } from "../parent-theme"

interface ProgressConstellationProps {
  current: number
  total: number
  label?: string
}

export function ProgressConstellation({ current, total, label }: ProgressConstellationProps) {
  const { isParent } = useViewMode()
  const pct = Math.min((current / total) * 100, 100)

  if (isParent) {
    return (
      <div>
        <div className="flex justify-between items-end mb-2">
          <span
            className="text-[10px] uppercase tracking-widest"
            style={{ color: PC.goldDark, fontFamily: ds.fonts.headline, fontWeight: 800, letterSpacing: "0.15em" }}
          >
            Step {current} of {total}
          </span>
          {label && (
            <span
              className="text-[10px] uppercase tracking-widest"
              style={{ color: PC.muted, fontFamily: ds.fonts.headline, fontWeight: 800, letterSpacing: "0.15em" }}
            >
              {label}
            </span>
          )}
        </div>
        <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: PC.surfaceContainer }}>
          <div
            className="h-full transition-all duration-500 ease-out"
            style={{ width: `${pct}%`, background: PC.gold, borderRadius: "9999px" }}
          />
        </div>
      </div>
    )
  }

  // Child: constellation-style dots with connecting lines
  return (
    <div>
      {label && (
        <p className="text-[10px] uppercase tracking-widest mb-3 text-center" style={{ color: C.dim, fontFamily: ds.fonts.headline, letterSpacing: "0.15em" }}>
          {label}
        </p>
      )}
      <div className="flex items-center justify-center gap-0">
        {Array.from({ length: total }).map((_, i) => {
          const isActive = i < current
          const isCurrent = i === current - 1
          return (
            <div key={i} className="flex items-center">
              {/* Dot */}
              <div
                className="relative flex items-center justify-center transition-all duration-300"
                style={{
                  width: isCurrent ? 14 : 10,
                  height: isCurrent ? 14 : 10,
                  borderRadius: "50%",
                  background: isActive ? C.gold : C.surfaceHighest,
                  boxShadow: isCurrent ? `0 0 12px rgba(240,196,86,0.4)` : "none",
                }}
              >
                {isCurrent && (
                  <div
                    className="absolute inset-0 rounded-full animate-ping"
                    style={{ background: "rgba(240,196,86,0.2)" }}
                  />
                )}
              </div>
              {/* Connecting line */}
              {i < total - 1 && (
                <div
                  className="transition-all duration-300"
                  style={{
                    width: 24,
                    height: 2,
                    background: i < current - 1
                      ? `linear-gradient(90deg, ${C.gold}, ${C.gold})`
                      : C.surfaceHighest,
                  }}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
