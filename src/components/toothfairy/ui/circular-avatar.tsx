"use client"

import { useViewMode } from "../view-mode-context"
import { C, glow } from "../tokens"
import { PC } from "../parent-theme"

interface CircularAvatarProps {
  src?: string | null
  name?: string
  size?: "sm" | "md" | "lg"
  className?: string
}

const sizes = {
  sm: { container: "w-8 h-8", text: "text-xs" },
  md: { container: "w-12 h-12", text: "text-sm" },
  lg: { container: "w-24 h-24", text: "text-2xl" },
}

export function CircularAvatar({ src, name = "", size = "md", className = "" }: CircularAvatarProps) {
  const { isParent } = useViewMode()
  const s = sizes[size]
  const initial = name.charAt(0).toUpperCase()

  if (src) {
    return (
      <div
        className={`${s.container} rounded-full overflow-hidden flex-shrink-0 ${className}`}
        style={{
          border: isParent ? `2px solid ${PC.border}` : `2px solid ${C.borderGold}`,
          boxShadow: isParent ? "none" : glow.goldPhoto,
        }}
      >
        <img src={src} alt={name} className="w-full h-full object-cover" />
      </div>
    )
  }

  return (
    <div
      className={`${s.container} rounded-full flex items-center justify-center flex-shrink-0 font-bold ${s.text} ${className}`}
      style={{
        background: isParent ? PC.gold : C.gold,
        color: isParent ? "#fff" : C.onGold,
      }}
    >
      {initial}
    </div>
  )
}
