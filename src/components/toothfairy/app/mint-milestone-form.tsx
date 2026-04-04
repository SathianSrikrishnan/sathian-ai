"use client"

import { useState, useRef } from "react"
import { TOOTH_TYPES, TOOTH_LABELS } from "@/lib/toothfairy/program"
import { C } from "../tokens"

interface MintMilestoneFormProps {
  onSubmit: (toothType: string, depositSol: number, photoFile: File | null) => Promise<void>
  loading: boolean
  usedTeeth: string[]
}

export function MintMilestoneForm({ onSubmit, loading, usedTeeth }: MintMilestoneFormProps) {
  const [toothType, setToothType] = useState("")
  const [depositSol, setDepositSol] = useState("0.1")
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const availableTeeth = TOOTH_TYPES.filter((t) => !usedTeeth.includes(t))

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhotoFile(file)
      const reader = new FileReader()
      reader.onload = () => setPhotoPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!toothType) return
    const sol = parseFloat(depositSol)
    if (isNaN(sol) || sol < 0) return
    await onSubmit(toothType, sol, photoFile)
    setToothType("")
    setDepositSol("0.1")
    setPhotoFile(null)
    setPhotoPreview(null)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      {/* Photo capture */}
      <div>
        <label className="block text-sm mb-1.5" style={{ color: C.muted }}>
          Photo (optional)
        </label>
        <div
          onClick={() => fileRef.current?.click()}
          className="w-full h-40 rounded-lg border-2 border-dashed flex items-center justify-center cursor-pointer hover:border-white/20 transition-colors overflow-hidden"
          style={{ borderColor: C.border }}
        >
          {photoPreview ? (
            <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <span className="text-sm" style={{ color: C.dim }}>
              Click to upload photo
            </span>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handlePhoto}
          className="hidden"
        />
      </div>

      {/* Tooth selector */}
      <div>
        <label className="block text-sm mb-1.5" style={{ color: C.muted }}>
          Which tooth?
        </label>
        <select
          value={toothType}
          onChange={(e) => setToothType(e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg text-sm bg-white/[0.03] border outline-none focus:border-white/20 transition-colors"
          style={{ borderColor: C.border, color: C.text }}
        >
          <option value="" style={{ background: "#030712" }}>Select a tooth...</option>
          {availableTeeth.map((t) => (
            <option key={t} value={t} style={{ background: "#030712" }}>
              {TOOTH_LABELS[t]}
            </option>
          ))}
        </select>
        {availableTeeth.length < 20 && (
          <p className="mt-1 text-xs" style={{ color: C.dim }}>
            {20 - availableTeeth.length} of 20 teeth recorded
          </p>
        )}
      </div>

      {/* Deposit amount */}
      <div>
        <label className="block text-sm mb-1.5" style={{ color: C.muted }}>
          Deposit (SOL)
        </label>
        <input
          type="number"
          value={depositSol}
          onChange={(e) => setDepositSol(e.target.value)}
          min="0"
          step="0.01"
          className="w-full px-4 py-2.5 rounded-lg text-sm bg-white/[0.03] border outline-none focus:border-white/20 transition-colors"
          style={{ borderColor: C.border, color: C.text }}
        />
        <p className="mt-1 text-xs" style={{ color: C.dim }}>
          SOL to escrow for this milestone (0 = keepsake only)
        </p>
      </div>

      <button
        type="submit"
        disabled={loading || !toothType}
        className="w-full px-5 py-2.5 rounded-lg text-sm font-medium text-white transition-all hover:opacity-90 disabled:opacity-50"
        style={{ background: C.rose }}
      >
        {loading ? "Minting..." : "Mint Milestone NFT"}
      </button>
    </form>
  )
}
