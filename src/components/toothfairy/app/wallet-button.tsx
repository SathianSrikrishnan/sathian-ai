"use client"

import { useWallet } from "@solana/wallet-adapter-react"
import { useWalletModal } from "@solana/wallet-adapter-react-ui"
import { C } from "../tokens"

export function WalletButton() {
  const { publicKey, disconnect, connecting } = useWallet()
  const { setVisible } = useWalletModal()

  if (publicKey) {
    const addr = publicKey.toBase58()
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm font-mono" style={{ color: C.muted }}>
          {addr.slice(0, 4)}...{addr.slice(-4)}
        </span>
        <button
          onClick={() => disconnect()}
          className="px-3 py-1.5 rounded-lg text-sm transition-colors hover:bg-white/10"
          style={{ border: `1px solid ${C.border}`, color: C.muted }}
        >
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setVisible(true)}
      disabled={connecting}
      className="px-5 py-2.5 rounded-lg text-sm font-medium text-white transition-all hover:opacity-90 disabled:opacity-50"
      style={{ background: C.rose }}
    >
      {connecting ? "Connecting..." : "Connect Wallet"}
    </button>
  )
}
