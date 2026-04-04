"use client"

import { useState } from "react"
import { PublicKey } from "@solana/web3.js"
import { C } from "../tokens"

interface ChildProfileFormProps {
  onSubmit: (childName: string, childWallet: PublicKey) => Promise<void>
  loading: boolean
}

export function ChildProfileForm({ onSubmit, loading }: ChildProfileFormProps) {
  const [childName, setChildName] = useState("")
  const [walletAddress, setWalletAddress] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!childName.trim()) {
      setError("Enter your child's name")
      return
    }
    if (childName.length > 32) {
      setError("Name must be 32 characters or fewer")
      return
    }

    let childWallet: PublicKey
    try {
      childWallet = new PublicKey(walletAddress.trim())
    } catch {
      setError("Invalid Solana wallet address")
      return
    }

    await onSubmit(childName.trim(), childWallet)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <div>
        <label className="block text-sm mb-1.5" style={{ color: C.muted }}>
          Child's Name
        </label>
        <input
          type="text"
          value={childName}
          onChange={(e) => setChildName(e.target.value)}
          placeholder="Isa"
          maxLength={32}
          className="w-full px-4 py-2.5 rounded-lg text-sm bg-white/[0.03] border outline-none focus:border-white/20 transition-colors"
          style={{ borderColor: C.border, color: C.text }}
        />
      </div>
      <div>
        <label className="block text-sm mb-1.5" style={{ color: C.muted }}>
          Child's Wallet Address
        </label>
        <input
          type="text"
          value={walletAddress}
          onChange={(e) => setWalletAddress(e.target.value)}
          placeholder="5pipt...EYsXq"
          className="w-full px-4 py-2.5 rounded-lg text-sm font-mono bg-white/[0.03] border outline-none focus:border-white/20 transition-colors"
          style={{ borderColor: C.border, color: C.text }}
        />
        <p className="mt-1 text-xs" style={{ color: C.dim }}>
          Your child's Phantom wallet address (they'll receive SOL here)
        </p>
      </div>
      {error && (
        <p className="text-sm" style={{ color: C.rose }}>{error}</p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="w-full px-5 py-2.5 rounded-lg text-sm font-medium text-white transition-all hover:opacity-90 disabled:opacity-50"
        style={{ background: C.rose }}
      >
        {loading ? "Creating Profile..." : "Create Child Profile"}
      </button>
    </form>
  )
}
