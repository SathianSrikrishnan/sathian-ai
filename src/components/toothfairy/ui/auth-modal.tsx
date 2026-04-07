"use client"

import { ReactNode } from "react"
import { useViewMode } from "../view-mode-context"
import { C, ds, glass } from "../tokens"
import { PC } from "../parent-theme"

interface AuthModalProps {
  open: boolean
  onClose: () => void
  children: ReactNode
  title?: string
}

export function AuthModal({ open, onClose, children, title }: AuthModalProps) {
  const { isParent } = useViewMode()

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(8px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="w-full max-w-sm rounded-2xl p-6 relative"
        style={{
          background: isParent ? "#ffffff" : C.surfaceContainer,
          border: `1px solid ${isParent ? PC.border : C.border}`,
          boxShadow: isParent
            ? "0 20px 60px rgba(0,0,0,0.15)"
            : "0 20px 60px rgba(0,0,0,0.5)",
          backdropFilter: isParent ? "none" : `blur(${glass.blurHeavy})`,
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition-all"
          style={{
            background: isParent ? PC.surfaceContainerLow : C.surfaceHigh,
            color: isParent ? PC.muted : C.dim,
            border: "none",
            cursor: "pointer",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {title && (
          <h3
            className="text-lg font-bold mb-4 pr-8"
            style={{
              fontFamily: ds.fonts.headline,
              color: isParent ? PC.text : C.textWarm,
            }}
          >
            {title}
          </h3>
        )}

        {children}
      </div>
    </div>
  )
}
