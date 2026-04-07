"use client"

import { ReactNode } from "react"
import { useViewMode } from "../view-mode-context"
import { C } from "../tokens"
import { PC } from "../parent-theme"

interface PulsingRingProps {
  children: ReactNode
  active?: boolean
  color?: string
  className?: string
}

export function PulsingRing({ children, active = true, color, className = "" }: PulsingRingProps) {
  const { isParent } = useViewMode()
  const ringColor = color || (isParent ? PC.teal : C.teal)

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {active && (
        <>
          <div
            className="absolute inset-0 rounded-full animate-ping"
            style={{ background: ringColor, opacity: 0.15 }}
          />
          <div
            className="absolute rounded-full"
            style={{
              inset: -4,
              border: `2px solid ${ringColor}`,
              borderRadius: "50%",
              opacity: 0.3,
              animation: "tfnPulse 2s ease-in-out infinite",
            }}
          />
        </>
      )}
      {children}
      {active && (
        <style>{`
          @keyframes tfnPulse {
            0%, 100% { transform: scale(1); opacity: 0.3; }
            50% { transform: scale(1.08); opacity: 0.15; }
          }
        `}</style>
      )}
    </div>
  )
}
