"use client"

import { ReactNode } from "react"
import { useViewMode } from "../view-mode-context"
import { C, glass, glow } from "../tokens"
import { PC, parentGlass } from "../parent-theme"

interface GlassmorphicCardProps {
  children: ReactNode
  className?: string
  interactive?: boolean
  elevated?: boolean
  style?: React.CSSProperties
}

export function GlassmorphicCard({
  children,
  className = "",
  interactive = false,
  elevated = false,
  style,
}: GlassmorphicCardProps) {
  const { isParent } = useViewMode()

  if (isParent) {
    return (
      <div
        className={`rounded-2xl transition-all ${interactive ? "cursor-pointer" : ""} ${className}`}
        style={{
          background: parentGlass.card,
          border: `1px solid ${parentGlass.cardBorder}`,
          backdropFilter: `blur(${parentGlass.blur})`,
          boxShadow: elevated ? "0 2px 8px rgba(0,0,0,0.06)" : "none",
          ...style,
        }}
      >
        {children}
      </div>
    )
  }

  return (
    <div
      className={`rounded-2xl transition-all ${interactive ? "cursor-pointer hover:border-[rgba(240,196,86,0.3)]" : ""} ${className}`}
      style={{
        background: glass.card,
        border: `1px solid ${glass.cardBorder}`,
        backdropFilter: `blur(${glass.blur})`,
        boxShadow: elevated ? glow.ambient : "none",
        ...style,
      }}
    >
      {children}
    </div>
  )
}
