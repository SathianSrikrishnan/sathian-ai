"use client"

import { useViewMode } from "../view-mode-context"
import { C, ds } from "../tokens"
import { PC } from "../parent-theme"

type ChecklistStatus = "done" | "active" | "pending"

interface ChecklistItemProps {
  label: string
  status: ChecklistStatus
  className?: string
}

export function ChecklistItem({ label, status, className = "" }: ChecklistItemProps) {
  const { isParent } = useViewMode()

  const iconBg = (() => {
    if (status === "done") return isParent ? PC.tealSoft : C.tealGlow
    if (status === "active") return isParent ? PC.goldSoft : C.goldSoft
    return isParent ? PC.surfaceHigh : C.surfaceHighest
  })()

  const textColor = (() => {
    if (status === "done") return isParent ? PC.teal : C.teal
    if (status === "active") return isParent ? PC.text : C.textWarm
    return isParent ? PC.text : C.text
  })()

  return (
    <div
      className={`flex items-center gap-4 ${className}`}
      style={{ opacity: status === "pending" ? 0.3 : 1 }}
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: iconBg }}
      >
        {status === "done" && (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={isParent ? PC.teal : C.teal} strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
        {status === "active" && (
          <svg
            width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke={isParent ? PC.gold : C.gold} strokeWidth="2"
            style={{ animation: "clSpin 2s linear infinite" }}
          >
            <path d="M21 12a9 9 0 11-6.22-8.56" />
          </svg>
        )}
        {status === "pending" && (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={isParent ? PC.text : C.dim} strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
          </svg>
        )}
      </div>
      <span
        className="text-lg font-semibold"
        style={{ color: textColor, fontFamily: ds.fonts.body }}
      >
        {label}
      </span>
      <style>{`@keyframes clSpin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
