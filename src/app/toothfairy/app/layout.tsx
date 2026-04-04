"use client"

import { Buffer } from "buffer"
if (typeof window !== "undefined") {
  window.Buffer = window.Buffer || Buffer
}

import { useMemo } from "react"
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom"
import { Plus_Jakarta_Sans, Manrope, Lora } from "next/font/google"

import "@solana/wallet-adapter-react-ui/styles.css"

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-headline",
  weight: ["700", "800"],
})
const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"],
})
const lora = Lora({
  subsets: ["latin"],
  variable: "--font-story",
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
})

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

  return (
    <ConnectionProvider endpoint={RPC_ENDPOINT}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div
            className={`${plusJakarta.variable} ${manrope.variable} ${lora.variable} font-[var(--font-body)] min-h-screen antialiased`}
            style={{ background: "#0d1228", color: "#dde1ff" }}
          >
            {children}
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}
