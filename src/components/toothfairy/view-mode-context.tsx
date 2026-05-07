"use client"

// ─── View Mode (DEPRECATED — parent-only lock, Apr 2026) ────────────────
// The child/parent toggle was removed in the Impeccable unification pass.
// This module is intentionally kept as a pass-through so the ~15 call
// sites under components/toothfairy/ui/ keep compiling unchanged — they
// all read `isParent` and render the parent branch, which is now the
// single visual language.
//
// Do not add new consumers. New code should reference CSS vars
// (var(--tfn-*)) or shared primitives directly.

import { createContext, useContext, type ReactNode } from "react"

type ViewMode = "parent"

interface ViewModeContextType {
  mode: ViewMode
  toggle: () => void
  isChild: false
  isParent: true
}

const LOCKED: ViewModeContextType = {
  mode: "parent",
  toggle: () => {},
  isChild: false,
  isParent: true,
}

const ViewModeContext = createContext<ViewModeContextType>(LOCKED)

export function ViewModeProvider({ children }: { children: ReactNode }) {
  return (
    <ViewModeContext.Provider value={LOCKED}>
      {children}
    </ViewModeContext.Provider>
  )
}

export function useViewMode() {
  return useContext(ViewModeContext)
}
