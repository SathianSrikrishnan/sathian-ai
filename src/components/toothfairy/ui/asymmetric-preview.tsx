"use client"

import { ReactNode } from "react"
import { useViewMode } from "../view-mode-context"
import { C, ds, glow } from "../tokens"
import { PC } from "../parent-theme"

interface AsymmetricPreviewProps {
  image?: string | null
  title: string
  subtitle?: string
  children?: ReactNode
  tilt?: number
}

export function AsymmetricPreview({
  image,
  title,
  subtitle,
  children,
  tilt = 1,
}: AsymmetricPreviewProps) {
  const { isParent } = useViewMode()

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: isParent ? "#ffffff" : C.surfaceContainer,
        border: `1px solid ${isParent ? PC.border : C.border}`,
        boxShadow: isParent ? "0 2px 8px rgba(0,0,0,0.06)" : glow.ambient,
        transform: `rotate(${tilt}deg)`,
      }}
    >
      {/* Image area */}
      <div
        className="relative flex items-center justify-center overflow-hidden"
        style={{
          aspectRatio: "3 / 4",
          background: isParent ? PC.surfaceContainerLow : C.surface,
          margin: "0.25rem",
          borderRadius: "0.75rem",
        }}
      >
        {image ? (
          <img src={image} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div style={{ textAlign: "center", opacity: 0.3 }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={isParent ? PC.text : C.dim} strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        )}

        {/* Overlay info */}
        <div
          className="absolute bottom-0 left-0 right-0 p-4"
          style={{ background: isParent ? "linear-gradient(to top, rgba(24,28,32,0.4), transparent)" : "linear-gradient(to top, rgba(13,18,40,0.8), transparent)" }}
        >
          <div
            className="rounded-xl p-3"
            style={{
              background: isParent ? "rgba(255,255,255,0.9)" : "rgba(21,26,49,0.85)",
              backdropFilter: "blur(12px)",
            }}
          >
            <p
              className="font-bold text-lg mb-1"
              style={{ fontFamily: ds.fonts.headline, color: isParent ? PC.text : C.textWarm }}
            >
              {title}
            </p>
            {subtitle && (
              <p
                className="text-sm italic leading-relaxed"
                style={{ color: isParent ? `${PC.text}b3` : C.muted }}
              >
                {subtitle}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Optional extra content (footer, metadata) */}
      {children}
    </div>
  )
}
