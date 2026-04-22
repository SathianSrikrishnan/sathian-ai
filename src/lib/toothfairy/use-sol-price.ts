"use client"

import { useState, useEffect } from "react"

let globalPrice: number | null = null
let lastFetch = 0

export function useSolPrice(): number {
  const [price, setPrice] = useState(globalPrice ?? 150)

  useEffect(() => {
    // Don't refetch if we have a recent price (5 min)
    if (globalPrice && Date.now() - lastFetch < 5 * 60 * 1000) {
      setPrice(globalPrice)
      return
    }

    fetch("/api/toothfairy/sol-price")
      .then(r => r.json())
      .then(data => {
        if (data?.price && typeof data.price === "number") {
          globalPrice = data.price
          lastFetch = Date.now()
          setPrice(data.price)
        }
      })
      .catch(() => {
        // Keep fallback
      })
  }, [])

  return price
}
