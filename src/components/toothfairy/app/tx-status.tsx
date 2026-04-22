"use client"

import { C } from "../tokens"

interface TxStatusProps {
  status: "idle" | "pending" | "success" | "error"
  message: string
  txSignature?: string
}

export function TxStatus({ status, message, txSignature }: TxStatusProps) {
  if (status === "idle") return null

  const colors = {
    pending: C.amber,
    success: C.emerald,
    error: C.rose,
  }

  return (
    <div
      className="p-3 rounded-lg border text-sm"
      style={{
        background: `${colors[status]}10`,
        borderColor: `${colors[status]}30`,
        color: colors[status],
      }}
    >
      <p>{message}</p>
      {txSignature && (
        <a
          href={`https://solscan.io/tx/${txSignature}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs underline mt-1 inline-block opacity-80 hover:opacity-100"
        >
          View on Solana Explorer
        </a>
      )}
    </div>
  )
}
