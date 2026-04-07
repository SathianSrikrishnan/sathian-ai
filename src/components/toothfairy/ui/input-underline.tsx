"use client"

import { useState } from "react"
import { useViewMode } from "../view-mode-context"
import { C, ds } from "../tokens"
import { PC } from "../parent-theme"

interface InputUnderlineProps {
  value: string
  onChange: (value: string) => void
  label?: string
  placeholder?: string
  type?: string
  required?: boolean
  className?: string
}

export function InputUnderline({
  value,
  onChange,
  label,
  placeholder,
  type = "text",
  required = false,
  className = "",
}: InputUnderlineProps) {
  const { isParent } = useViewMode()
  const [focused, setFocused] = useState(false)
  const hasValue = value.length > 0

  const borderColor = focused
    ? (isParent ? PC.teal : C.teal)
    : hasValue
      ? (isParent ? PC.teal : C.gold)
      : (isParent ? PC.border : C.border)

  return (
    <div className={className}>
      {label && (
        <label
          className="block text-[10px] uppercase tracking-widest mb-2"
          style={{
            color: isParent ? PC.goldDark : C.dim,
            fontWeight: 700,
            fontFamily: ds.fonts.headline,
          }}
        >
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        required={required}
        className="w-full bg-transparent py-2 px-1 text-base outline-none transition-all"
        style={{
          borderBottom: `2px solid ${borderColor}`,
          borderTop: "none",
          borderLeft: "none",
          borderRight: "none",
          color: isParent ? PC.text : C.text,
          fontFamily: ds.fonts.body,
          boxShadow: focused ? `0 2px 8px ${isParent ? "rgba(0,106,99,0.1)" : "rgba(90,218,206,0.1)"}` : "none",
        }}
      />
    </div>
  )
}
