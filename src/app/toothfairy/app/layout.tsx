"use client"

import { Buffer } from "buffer"
if (typeof window !== "undefined") {
  window.Buffer = window.Buffer || Buffer
}

import { useMemo } from "react"
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom"
import { Alegreya, Alegreya_Sans } from "next/font/google"

import { ViewModeProvider, useViewMode } from "@/components/toothfairy/view-mode-context"
import "@solana/wallet-adapter-react-ui/styles.css"

const alegreya = Alegreya({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "700", "800"],
  style: ["normal", "italic"],
})
const alegreyaSans = Alegreya_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "700"],
  style: ["normal", "italic"],
})

function ThemedWrapper({ children, className }: { children: React.ReactNode; className: string }) {
  const { isParent } = useViewMode()
  return (
    <div
      className={`${className} font-[var(--font-body)] min-h-screen antialiased transition-colors duration-300`}
      style={{
        background: isParent ? 'oklch(97.5% 0.01 80)' : 'oklch(12% 0.04 270)',
        color: isParent ? 'oklch(30% 0.035 65)' : 'oklch(93% 0.01 80)',
      }}
    >
      {children}
    </div>
  )
}

const RPC_ENDPOINT =
  process.env.NEXT_PUBLIC_SOLANA_RPC || "https://api.mainnet-beta.solana.com"

export default function ToothFairyAppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Explicit Phantom adapter enables mobile deep-linking
  // On desktop, Phantom also auto-registers via Wallet Standard
  const wallets = useMemo(() => [new PhantomWalletAdapter()], [])

  const CP = ConnectionProvider as React.ComponentType<{ endpoint: string; children: React.ReactNode }>
  const WP = WalletProvider as React.ComponentType<{ wallets: ReturnType<typeof useMemo>; autoConnect?: boolean; children: React.ReactNode }>
  const WMP = WalletModalProvider as React.ComponentType<{ children: React.ReactNode }>

  return (
    <CP endpoint={RPC_ENDPOINT}>
      <WP wallets={wallets} autoConnect>
        <WMP>
          <ViewModeProvider>
            <ThemedWrapper className={`${alegreya.variable} ${alegreyaSans.variable}`}>
              {children}
            </ThemedWrapper>
          </ViewModeProvider>
        </WMP>
      </WP>
    </CP>
  )
}
