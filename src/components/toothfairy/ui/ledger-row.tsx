"use client"

import { useViewMode } from "../view-mode-context"
import { C, ds } from "../tokens"
import { PC } from "../parent-theme"

interface LedgerRowProps {
  label: string
  value: string
  mono?: boolean
  accent?: boolean
}

export function LedgerRow({ label, value, mono = false, accent = false }: LedgerRowProps) {
  const { isParent } = useViewMode()

  return (
    <div className="flex justify-between items-center py-3">
      <span
        style={{
          fontSize: "0.6875rem",
          textTransform: "uppercase",
          letterSpacing: "0.1em",
          color: isParent ? PC.muted : C.dim,
          fontWeight: 700,
          fontFamily: ds.fonts.headline,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: "0.875rem",
          color: accent
            ? (isParent ? PC.teal : C.teal)
            : (isParent ? PC.text : C.text),
          fontFamily: mono ? "monospace" : ds.fonts.body,
        }}
      >
        {value}
      </span>
    </div>
  )
}
