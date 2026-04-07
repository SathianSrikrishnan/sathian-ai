"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

type ViewMode = "child" | "parent"

interface ViewModeContextType {
  mode: ViewMode
  toggle: () => void
  isChild: boolean
  isParent: boolean
}

const ViewModeContext = createContext<ViewModeContextType>({
  mode: "child",
  toggle: () => {},
  isChild: true,
  isParent: false,
})

const STORAGE_KEY = "tfn-view-mode"

export function ViewModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ViewMode>("child")

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === "parent" || saved === "child") setMode(saved)
  }, [])

  const toggle = () => {
    const next: ViewMode = mode === "child" ? "parent" : "child"
    setMode(next)
    localStorage.setItem(STORAGE_KEY, next)
  }

  return (
    <ViewModeContext.Provider value={{ mode, toggle, isChild: mode === "child", isParent: mode === "parent" }}>
      {children}
    </ViewModeContext.Provider>
  )
}

export function useViewMode() {
  return useContext(ViewModeContext)
}
