"use client"

import { useState } from "react"
import {
  CrossmintProvider,
  CrossmintAuthProvider,
  CrossmintWalletProvider,
  useAuth,
  useWallet,
} from "@crossmint/client-sdk-react-ui"

const API_KEY = process.env.NEXT_PUBLIC_CROSSMINT_CLIENT_KEY || ""

function WalletUI() {
  const { login, logout, status } = useAuth()
  const { wallet } = useWallet()
  const [info, setInfo] = useState("")
  const [error, setError] = useState("")

  return (
    <div style={{ padding: 40, fontFamily: "monospace", color: "white", background: "#0a0a1a", minHeight: "100vh" }}>
      <h1 style={{ fontSize: 24, marginBottom: 8 }}>Crossmint Wallet Test</h1>
      <p style={{ fontSize: 12, color: "#666", marginBottom: 24 }}>
        Key: {API_KEY.slice(0, 25)}... | Chain: solana
      </p>

      <p>Auth status: <strong style={{ color: "#ab9ff2" }}>{status}</strong></p>

      {error && (
        <div style={{ padding: 12, background: "rgba(239,68,68,0.2)", borderRadius: 8, marginTop: 16, fontSize: 13 }}>
          {error}
        </div>
      )}

      {(status === "logged-out" || (!wallet && status !== "initializing")) && (
        <button
          onClick={() => {
            setError("")
            try { login() } catch (e: any) { setError(e.message) }
          }}
          style={{ padding: "14px 28px", background: "#ab9ff2", color: "white", border: "none", borderRadius: 8, cursor: "pointer", fontSize: 16, marginTop: 16 }}
        >
          Sign in with Google
        </button>
      )}

      {status === "initializing" && (
        <p style={{ color: "#ab9ff2", marginTop: 16 }}>Initializing...</p>
      )}

      {wallet && (
        <div style={{ marginTop: 24, padding: 20, background: "#1a1a2e", borderRadius: 12 }}>
          <p style={{ color: "#10b981", fontSize: 14 }}>Wallet created!</p>
          <p style={{ marginTop: 8 }}>Address: <strong>{wallet.address}</strong></p>
          <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
            <button
              onClick={async () => {
                try {
                  const b = await wallet.balances(["sol"])
                  setInfo(JSON.stringify(b, null, 2))
                } catch (e: any) { setInfo("Error: " + e.message) }
              }}
              style={{ padding: "8px 16px", background: "#10b981", color: "white", border: "none", borderRadius: 8, cursor: "pointer" }}
            >
              Check Balance
            </button>
            <button
              onClick={logout}
              style={{ padding: "8px 16px", background: "#ef4444", color: "white", border: "none", borderRadius: 8, cursor: "pointer" }}
            >
              Logout
            </button>
          </div>
          {info && <pre style={{ marginTop: 16, fontSize: 11, whiteSpace: "pre-wrap", color: "#ccc" }}>{info}</pre>}
        </div>
      )}
    </div>
  )
}

export default function CrossmintTest() {
  if (!API_KEY) {
    return (
      <div style={{ padding: 40, color: "red", background: "#0a0a1a", minHeight: "100vh", fontFamily: "monospace" }}>
        NEXT_PUBLIC_CROSSMINT_CLIENT_KEY is not set
      </div>
    )
  }

  return (
    <CrossmintProvider apiKey={API_KEY}>
      <CrossmintAuthProvider>
        <CrossmintWalletProvider
          createOnLogin={{ chain: "solana", signer: { type: "email" } }}
        >
          <WalletUI />
        </CrossmintWalletProvider>
      </CrossmintAuthProvider>
    </CrossmintProvider>
  )
}
