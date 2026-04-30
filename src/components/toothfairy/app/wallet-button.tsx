"use client"

import { useEffect, useState } from "react"
import { useWallet } from "@solana/wallet-adapter-react"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"

const SPRING = "cubic-bezier(0.16, 1, 0.3, 1)"

export function WalletButton() {
  const { publicKey, disconnect, connecting } = useWallet()
  const { setVisible } = useWalletModal()

  // Hydration guard: render a stable placeholder on SSR + first client paint,
  // then swap in the real connect/disconnect UI once the wallet adapter is
  // mounted. This stops the "button disappears mid theme transition" race —
  // the component no longer unmounts when wallet state flips during the
  // 400ms theme crossfade.
  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <span
        className="inline-block rounded-full"
        aria-hidden
        style={{
          height: "40px",
          width: "140px",
          background: "var(--tfn-gold-soft)",
        }}
      />
    )
  }

  if (publicKey) {
    const addr = publicKey.toBase58()
    return (
      <div className="flex items-center gap-3">
        <span
          className="text-sm font-mono"
          style={{ color: "var(--tfn-ink-muted)" }}
        >
          {addr.slice(0, 4)}…{addr.slice(-4)}
        </span>
        <button
          type="button"
          onClick={() => disconnect()}
          className="rounded-full px-4 py-1.5 text-sm font-medium transition-opacity hover:opacity-80"
          style={{
            border: "1px solid var(--tfn-border)",
            color: "var(--tfn-ink-soft)",
            background: "transparent",
            fontFamily: "var(--font-body), 'Alegreya Sans', system-ui, sans-serif",
          }}
        >
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setVisible(true)}
      disabled={connecting}
      className="rounded-full px-5 py-2.5 text-sm font-semibold active:scale-[0.98] disabled:opacity-50"
      style={{
        background: "var(--tfn-gold)",
        color: "oklch(98% 0.005 80)",
        fontFamily: "var(--font-body), 'Alegreya Sans', system-ui, sans-serif",
        boxShadow: "0 6px 18px oklch(72% 0.145 75 / 0.28)",
        transition: `background 0.2s ${SPRING}, transform 0.15s ${SPRING}`,
      }}
      onMouseEnter={(e) => {
        if (!connecting) e.currentTarget.style.background = "var(--tfn-gold-hover)"
      }}
      onMouseLeave={(e) => {
        if (!connecting) e.currentTarget.style.background = "var(--tfn-gold)"
      }}
    >
      {connecting ? "Connecting…" : "Connect Wallet"}
    </button>
  )
}
