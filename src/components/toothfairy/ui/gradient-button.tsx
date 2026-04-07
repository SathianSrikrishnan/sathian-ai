"use client"

import { ReactNode } from "react"
import { useViewMode } from "../view-mode-context"
import { C, ds, gradients, glow } from "../tokens"
import { PC, parentGradients, parentGlow } from "../parent-theme"

type ButtonVariant = "primary" | "secondary" | "tertiary"

interface GradientButtonProps {
  children: ReactNode
  onClick?: () => void
  disabled?: boolean
  variant?: ButtonVariant
  className?: string
  fullWidth?: boolean
  style?: React.CSSProperties
}

export function GradientButton({
  children,
  onClick,
  disabled = false,
  variant = "primary",
  className = "",
  fullWidth = false,
  style,
}: GradientButtonProps) {
  const { isParent } = useViewMode()
  const w = fullWidth ? "w-full" : ""

  if (variant === "primary") {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`${w} py-4 font-bold flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-30 ${className}`}
        style={{
          background: isParent ? parentGradients.stardust : gradients.stardust,
          color: isParent ? PC.onGold : C.onGold,
          boxShadow: isParent ? parentGlow.ctaFloat : glow.ctaFloat,
          borderRadius: isParent ? "0.75rem" : "9999px",
          fontFamily: ds.fonts.headline,
          border: "none",
          cursor: disabled ? "not-allowed" : "pointer",
          fontSize: isParent ? "1.125rem" : "1rem",
          ...style,
        }}
      >
        {children}
      </button>
    )
  }

  if (variant === "secondary") {
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`${w} py-3 px-6 font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-30 ${className}`}
        style={{
          background: isParent ? "transparent" : "rgba(47, 51, 75, 0.2)",
          color: isParent ? PC.goldDark : C.goldLight,
          border: `1px solid ${isParent ? PC.borderGold : C.borderGold}`,
          borderRadius: isParent ? "0.75rem" : "9999px",
          fontFamily: ds.fonts.headline,
          cursor: disabled ? "not-allowed" : "pointer",
          backdropFilter: isParent ? "none" : "blur(12px)",
          ...style,
        }}
      >
        {children}
      </button>
    )
  }

  // tertiary — text only
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`font-medium transition-all hover:underline disabled:opacity-30 ${className}`}
      style={{
        background: "none",
        border: "none",
        color: isParent ? PC.goldDark : C.goldDim,
        cursor: disabled ? "not-allowed" : "pointer",
        fontFamily: ds.fonts.headline,
        padding: 0,
        ...style,
      }}
    >
      {children}
    </button>
  )
}
