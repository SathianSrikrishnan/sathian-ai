"use client"

import { Buffer } from "buffer"
if (typeof window !== "undefined") {
  window.Buffer = window.Buffer || Buffer
}

import { useEffect, useMemo } from "react"
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom"

import { ViewModeProvider, useViewMode } from "@/components/toothfairy/view-mode-context"
import { useTheme } from "@/components/toothfairy/nav/theme-context"
import "@solana/wallet-adapter-react-ui/styles.css"

// Bridges the flow's view-mode toggle into the shared ThemeProvider so the
// parent→child crossfade fires from the /toothfairy root. Keeps the local
// ViewModeProvider intact so existing /app consumers keep working.
function ThemeSync() {
  const { mode } = useViewMode()
  const { setMode } = useTheme()
  useEffect(() => {
    setMode(mode === "parent" ? "parent" : "child")
  }, [mode, setMode])
  return null
}

function ThemedWrapper({ children }: { children: React.ReactNode }) {
  const { isParent } = useViewMode()
  return (
    <div
      className="font-[var(--font-body)] min-h-screen antialiased transition-colors duration-300"
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
            <ThemeSync />
            <ThemedWrapper>
              {children}
            </ThemedWrapper>
          </ViewModeProvider>
        </WMP>
      </WP>
    </CP>
  )
}
