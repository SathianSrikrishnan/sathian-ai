"use client"

// Locks the /toothfairy/stories route to child theme (dark indigo) so the
// unified nav and page content agree. Render once at the top of the
// stories layout — it's a client-only side effect, zero DOM output.

import { useEffect } from "react"
import { useTheme } from "./theme-context"

export function StoriesThemeLock() {
  const { setMode } = useTheme()
  useEffect(() => {
    setMode("child")
    return () => setMode("parent")
  }, [setMode])
  return null
}
