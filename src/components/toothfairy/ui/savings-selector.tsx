"use client"

import { useViewMode } from "../view-mode-context"
import { C, ds } from "../tokens"
import { PC, parentGlow } from "../parent-theme"

interface SavingsOption {
  label: string
  sub: string
  value: string
}

interface SavingsSelectorProps {
  options: SavingsOption[]
  selected: string
  onSelect: (value: string) => void
  className?: string
}

export function SavingsSelector({ options, selected, onSelect, className = "" }: SavingsSelectorProps) {
  const { isParent } = useViewMode()

  return (
    <div className={`grid gap-2 ${className}`} style={{ gridTemplateColumns: `repeat(${Math.min(options.length, 4)}, 1fr)` }}>
      {options.map(({ label, sub, value }) => {
        const isSelected = selected === value
        return (
          <button
            key={value}
            onClick={() => onSelect(value)}
            className="flex flex-col items-center justify-center py-3 rounded-xl transition-all"
            style={{
              background: isParent ? "#ffffff" : (isSelected ? C.goldSoft : C.surfaceContainer),
              border: isSelected
                ? `2px solid ${isParent ? PC.goldDark : C.gold}`
                : `1px solid ${isParent ? PC.border : C.border}`,
              boxShadow: isSelected && isParent ? parentGlow.gold : "none",
              cursor: "pointer",
            }}
          >
            <span
              className="text-lg font-bold"
              style={{
                fontFamily: ds.fonts.headline,
                color: isSelected
                  ? (isParent ? PC.goldDark : C.gold)
                  : (isParent ? PC.text : C.text),
              }}
            >
              {label}
            </span>
            <span
              className="text-[10px] mt-0.5"
              style={{
                fontFamily: "monospace",
                color: isSelected
                  ? (isParent ? PC.goldDark : C.gold)
                  : (isParent ? PC.muted : C.dim),
                opacity: isSelected ? 0.7 : 0.5,
              }}
            >
              {sub}
            </span>
          </button>
        )
      })}
    </div>
  )
}
