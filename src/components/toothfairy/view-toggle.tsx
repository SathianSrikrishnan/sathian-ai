"use client"

import { useViewMode } from "./view-mode-context"
import { SparkleIcon } from "./fairy-icons"

export function ViewToggle() {
  const { mode, toggle } = useViewMode()

  return (
    <div
      className="flex items-center w-full max-w-xs rounded-full p-0.5"
      style={{
        background: mode === "child" ? "rgba(47, 51, 75, 0.5)" : "rgba(0, 0, 0, 0.06)",
        border: `1px solid ${mode === "child" ? "rgba(240, 196, 86, 0.15)" : "rgba(0, 0, 0, 0.08)"}`,
      }}
    >
      <button
        onClick={mode === "child" ? undefined : toggle}
        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-xs font-semibold transition-all"
        style={{
          background: mode === "child" ? "rgba(240, 196, 86, 0.2)" : "transparent",
          color: mode === "child" ? "#f0c456" : "#ADB5BD",
        }}
      >
        <SparkleIcon size={14} /> Child
      </button>
      <button
        onClick={mode === "parent" ? undefined : toggle}
        className="flex-1 flex items-center justify-center gap-2 py-2 rounded-full text-xs font-semibold transition-all"
        style={{
          background: mode === "parent" ? "rgba(42, 171, 160, 0.15)" : "transparent",
          color: mode === "parent" ? "#2AABA0" : (mode === "child" ? "#9a907c" : "#ADB5BD"),
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        Parent
      </button>
    </div>
  )
}
