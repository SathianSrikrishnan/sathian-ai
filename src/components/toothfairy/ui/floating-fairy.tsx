"use client"

import { useEffect, useState } from "react"

interface FloatingFairyProps {
  className?: string
  size?: number
  delay?: number
}

export function FloatingFairy({ className = "", size = 32, delay = 0 }: FloatingFairyProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  if (!mounted) return null

  return (
    <div
      className={`pointer-events-none ${className}`}
      style={{
        width: size,
        height: size,
        animation: `fairyFloat 6s ease-in-out infinite ${delay}s, fairyDrift 8s ease-in-out infinite ${delay + 1}s`,
      }}
    >
      <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
        {/* Body */}
        <ellipse cx="16" cy="18" rx="4" ry="6" fill="rgba(240,196,86,0.6)" />
        {/* Head */}
        <circle cx="16" cy="10" r="4" fill="rgba(255,227,165,0.8)" />
        {/* Wings */}
        <ellipse cx="10" cy="14" rx="5" ry="3" fill="rgba(90,218,206,0.3)" transform="rotate(-20 10 14)" />
        <ellipse cx="22" cy="14" rx="5" ry="3" fill="rgba(90,218,206,0.3)" transform="rotate(20 22 14)" />
        {/* Glow */}
        <circle cx="16" cy="14" r="10" fill="rgba(240,196,86,0.08)" />
      </svg>
      <style>{`
        @keyframes fairyFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @keyframes fairyDrift {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(6px); }
        }
      `}</style>
    </div>
  )
}
