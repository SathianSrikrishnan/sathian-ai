"use client"

import { Buffer } from "buffer"
if (typeof window !== "undefined") {
  window.Buffer = window.Buffer || Buffer
}

import { useMemo } from "react"
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom"

import "@solana/wallet-adapter-react-ui/styles.css"

const RPC_ENDPOINT =
  process.env.NEXT_PUBLIC_SOLANA_RPC || "https://api.mainnet-beta.solana.com"

export default function ToothPageLayout({ children }: { children: React.ReactNode }) {
  const wallets = useMemo(() => [new PhantomWalletAdapter()], [])

  const CP = ConnectionProvider as React.ComponentType<{ endpoint: string; children: React.ReactNode }>
  const WP = WalletProvider as React.ComponentType<{ wallets: ReturnType<typeof useMemo>; autoConnect?: boolean; children: React.ReactNode }>
  const WMP = WalletModalProvider as React.ComponentType<{ children: React.ReactNode }>

  return (
    <CP endpoint={RPC_ENDPOINT}>
      <WP wallets={wallets} autoConnect>
        <WMP>
          {children}
        </WMP>
      </WP>
    </CP>
  )
}
