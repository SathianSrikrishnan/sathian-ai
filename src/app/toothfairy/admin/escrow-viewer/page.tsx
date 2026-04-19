"use client"

import { useEffect, useState, useCallback } from "react"

interface DepositRow {
  pubkey: string
  milestone: string
  depositor: string
  depositorName: string
  amountSol: number
  amountLamports: number
  lockType: string
  lockUntil: string | null
  status: string
  createdAt: string
  claimedAt: string | null
  depositIndex: number
}

interface ProfileRow {
  pubkey: string
  guardian: string
  childWallet: string
  childName: string
  milestoneCount: number
  totalDepositedSol: number
  totalClaimedSol: number
  depositCount: number
  status: number
}

interface Summary {
  totalProfiles: number
  totalDeposits: number
  activeDeposits: number
  totalDepositedSol: number
  totalActiveSOL: number
  feesCollectedSol: number
  contractPaused: boolean
}

interface TreasuryInfo {
  authority: string
  totalCollectedSol: number
  totalCollectedLamports: number
}

interface ConfigInfo {
  authority: string
  paused: boolean
}

interface EscrowData {
  summary: Summary
  profiles: ProfileRow[]
  deposits: DepositRow[]
  treasury: TreasuryInfo | null
  config: ConfigInfo | null
  fetchedAt: string
}

function truncateKey(key: string): string {
  if (key.length <= 11) return key
  return `${key.slice(0, 4)}...${key.slice(-4)}`
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })
}

function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

const STATUS_COLORS: Record<string, string> = {
  active: "#3b82f6",
  refundable: "#f59e0b",
  matured: "#22c55e",
  claimed: "#6b7280",
}

const PROFILE_STATUS_LABELS: Record<number, string> = {
  0: "Active",
  1: "Staking",
  2: "Frozen",
}

export default function EscrowViewerPage() {
  const [data, setData] = useState<EscrowData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<"deposits" | "profiles">("deposits")

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch("/api/toothfairy/escrow-viewer")
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.details || err.error || "Failed to fetch")
      }
      const json = await res.json()
      setData(json)
    } catch (e) {
      setError(String(e))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: "24px", maxWidth: "1400px", margin: "0 auto", color: "#e2e8f0", background: "#0f172a", minHeight: "100vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: 700, margin: 0 }}>TFN Escrow Viewer</h1>
          <p style={{ color: "#94a3b8", fontSize: "13px", margin: "4px 0 0" }}>
            Read-only view of on-chain escrow accounts (mainnet)
          </p>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          style={{
            padding: "8px 16px",
            background: loading ? "#334155" : "#3b82f6",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "13px",
          }}
        >
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      {error && (
        <div style={{ background: "#7f1d1d", border: "1px solid #991b1b", borderRadius: "8px", padding: "16px", marginBottom: "16px" }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {loading && !data && (
        <div style={{ textAlign: "center", padding: "48px", color: "#94a3b8" }}>
          Fetching escrow accounts from Solana mainnet...
        </div>
      )}

      {data && (
        <>
          {/* Summary Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px", marginBottom: "24px" }}>
            <SummaryCard label="Child Profiles" value={data.summary.totalProfiles} />
            <SummaryCard label="Total Deposits" value={data.summary.totalDeposits} />
            <SummaryCard label="Active Deposits" value={data.summary.activeDeposits} />
            <SummaryCard label="Total Deposited" value={`${data.summary.totalDepositedSol.toFixed(6)} SOL`} />
            <SummaryCard label="Active SOL Locked" value={`${data.summary.totalActiveSOL.toFixed(6)} SOL`} />
            <SummaryCard label="Fees Collected" value={`${data.summary.feesCollectedSol.toFixed(6)} SOL`} />
            <SummaryCard
              label="Contract Status"
              value={data.summary.contractPaused ? "PAUSED" : "Active"}
              valueColor={data.summary.contractPaused ? "#ef4444" : "#22c55e"}
            />
          </div>

          {/* Config & Treasury */}
          {(data.config || data.treasury) && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "24px" }}>
              {data.config && (
                <div style={{ background: "#1e293b", borderRadius: "8px", padding: "16px" }}>
                  <h3 style={{ fontSize: "14px", color: "#94a3b8", margin: "0 0 8px" }}>Config</h3>
                  <p style={{ margin: "4px 0", fontSize: "13px" }}>
                    Authority: <code style={{ color: "#60a5fa" }}>{truncateKey(data.config.authority)}</code>
                  </p>
                  <p style={{ margin: "4px 0", fontSize: "13px" }}>
                    Paused: <span style={{ color: data.config.paused ? "#ef4444" : "#22c55e" }}>{data.config.paused ? "Yes" : "No"}</span>
                  </p>
                </div>
              )}
              {data.treasury && (
                <div style={{ background: "#1e293b", borderRadius: "8px", padding: "16px" }}>
                  <h3 style={{ fontSize: "14px", color: "#94a3b8", margin: "0 0 8px" }}>Treasury</h3>
                  <p style={{ margin: "4px 0", fontSize: "13px" }}>
                    Authority: <code style={{ color: "#60a5fa" }}>{truncateKey(data.treasury.authority)}</code>
                  </p>
                  <p style={{ margin: "4px 0", fontSize: "13px" }}>
                    Total Collected: <strong>{data.treasury.totalCollectedSol.toFixed(6)} SOL</strong>
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Tab Switcher */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
            <TabButton active={activeTab === "deposits"} onClick={() => setActiveTab("deposits")}>
              Deposits ({data.deposits.length})
            </TabButton>
            <TabButton active={activeTab === "profiles"} onClick={() => setActiveTab("profiles")}>
              Child Profiles ({data.profiles.length})
            </TabButton>
          </div>

          {/* Deposits Table */}
          {activeTab === "deposits" && (
            <div style={{ overflowX: "auto" }}>
              {data.deposits.length === 0 ? (
                <div style={{ textAlign: "center", padding: "32px", color: "#94a3b8", background: "#1e293b", borderRadius: "8px" }}>
                  No deposit accounts found on-chain.
                </div>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #334155" }}>
                      <Th>#</Th>
                      <Th>Depositor</Th>
                      <Th>Name</Th>
                      <Th>Amount (SOL)</Th>
                      <Th>Lock Type</Th>
                      <Th>Maturity</Th>
                      <Th>Status</Th>
                      <Th>Created</Th>
                      <Th>Account</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.deposits
                      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .map((d, i) => (
                        <tr key={d.pubkey} style={{ borderBottom: "1px solid #1e293b", background: i % 2 === 0 ? "transparent" : "#1e293b22" }}>
                          <Td>{d.depositIndex}</Td>
                          <Td>
                            <a
                              href={`https://explorer.solana.com/address/${d.depositor}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: "#60a5fa", textDecoration: "none" }}
                              title={d.depositor}
                            >
                              {truncateKey(d.depositor)}
                            </a>
                          </Td>
                          <Td>{d.depositorName || "-"}</Td>
                          <Td style={{ fontVariantNumeric: "tabular-nums" }}>{d.amountSol.toFixed(6)}</Td>
                          <Td>{d.lockType}</Td>
                          <Td>{d.lockUntil ? formatDate(d.lockUntil) : "Immediate"}</Td>
                          <Td>
                            <span style={{
                              display: "inline-block",
                              padding: "2px 8px",
                              borderRadius: "9999px",
                              fontSize: "11px",
                              fontWeight: 600,
                              background: `${STATUS_COLORS[d.status] || "#6b7280"}22`,
                              color: STATUS_COLORS[d.status] || "#6b7280",
                              border: `1px solid ${STATUS_COLORS[d.status] || "#6b7280"}44`,
                            }}>
                              {d.status}
                            </span>
                          </Td>
                          <Td>{formatDateTime(d.createdAt)}</Td>
                          <Td>
                            <a
                              href={`https://explorer.solana.com/address/${d.pubkey}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ color: "#60a5fa", textDecoration: "none", fontSize: "11px" }}
                              title={d.pubkey}
                            >
                              {truncateKey(d.pubkey)}
                            </a>
                          </Td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* Profiles Table */}
          {activeTab === "profiles" && (
            <div style={{ overflowX: "auto" }}>
              {data.profiles.length === 0 ? (
                <div style={{ textAlign: "center", padding: "32px", color: "#94a3b8", background: "#1e293b", borderRadius: "8px" }}>
                  No child profiles found on-chain.
                </div>
              ) : (
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid #334155" }}>
                      <Th>Child Name</Th>
                      <Th>Guardian</Th>
                      <Th>Child Wallet</Th>
                      <Th>Milestones</Th>
                      <Th>Total Deposited</Th>
                      <Th>Total Claimed</Th>
                      <Th>Deposits</Th>
                      <Th>Status</Th>
                      <Th>Profile PDA</Th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.profiles.map((p, i) => (
                      <tr key={p.pubkey} style={{ borderBottom: "1px solid #1e293b", background: i % 2 === 0 ? "transparent" : "#1e293b22" }}>
                        <Td style={{ fontWeight: 600 }}>{p.childName || "(unnamed)"}</Td>
                        <Td>
                          <a
                            href={`https://explorer.solana.com/address/${p.guardian}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "#60a5fa", textDecoration: "none" }}
                            title={p.guardian}
                          >
                            {truncateKey(p.guardian)}
                          </a>
                        </Td>
                        <Td>
                          <a
                            href={`https://explorer.solana.com/address/${p.childWallet}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "#60a5fa", textDecoration: "none" }}
                            title={p.childWallet}
                          >
                            {truncateKey(p.childWallet)}
                          </a>
                        </Td>
                        <Td>{p.milestoneCount}</Td>
                        <Td style={{ fontVariantNumeric: "tabular-nums" }}>{p.totalDepositedSol.toFixed(6)} SOL</Td>
                        <Td style={{ fontVariantNumeric: "tabular-nums" }}>{p.totalClaimedSol.toFixed(6)} SOL</Td>
                        <Td>{p.depositCount}</Td>
                        <Td>
                          <span style={{
                            display: "inline-block",
                            padding: "2px 8px",
                            borderRadius: "9999px",
                            fontSize: "11px",
                            fontWeight: 600,
                            background: p.status === 0 ? "#22c55e22" : "#f59e0b22",
                            color: p.status === 0 ? "#22c55e" : "#f59e0b",
                            border: `1px solid ${p.status === 0 ? "#22c55e44" : "#f59e0b44"}`,
                          }}>
                            {PROFILE_STATUS_LABELS[p.status] || `Unknown (${p.status})`}
                          </span>
                        </Td>
                        <Td>
                          <a
                            href={`https://explorer.solana.com/address/${p.pubkey}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ color: "#60a5fa", textDecoration: "none", fontSize: "11px" }}
                            title={p.pubkey}
                          >
                            {truncateKey(p.pubkey)}
                          </a>
                        </Td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {/* Footer */}
          <div style={{ marginTop: "24px", padding: "12px", borderTop: "1px solid #334155", color: "#64748b", fontSize: "12px", display: "flex", justifyContent: "space-between" }}>
            <span>Program: {truncateKey(PROGRAM_ID_STR)}</span>
            <span>Last fetched: {formatDateTime(data.fetchedAt)}</span>
          </div>
        </>
      )}
    </div>
  )
}

const PROGRAM_ID_STR = "FqCSNerRsjdxamLyiyTvqiGKZ4vnfYngLUuTKtSi7RTC"

// Simple sub-components

function SummaryCard({ label, value, valueColor }: { label: string; value: string | number; valueColor?: string }) {
  return (
    <div style={{ background: "#1e293b", borderRadius: "8px", padding: "16px" }}>
      <div style={{ color: "#94a3b8", fontSize: "12px", marginBottom: "4px" }}>{label}</div>
      <div style={{ fontSize: "20px", fontWeight: 700, color: valueColor || "#e2e8f0" }}>{value}</div>
    </div>
  )
}

function TabButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "8px 16px",
        background: active ? "#3b82f6" : "#1e293b",
        color: active ? "#fff" : "#94a3b8",
        border: active ? "1px solid #3b82f6" : "1px solid #334155",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "13px",
        fontWeight: active ? 600 : 400,
      }}
    >
      {children}
    </button>
  )
}

function Th({ children }: { children: React.ReactNode }) {
  return (
    <th style={{ textAlign: "left", padding: "8px 12px", color: "#94a3b8", fontWeight: 600, fontSize: "11px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
      {children}
    </th>
  )
}

function Td({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <td style={{ padding: "8px 12px", ...style }}>
      {children}
    </td>
  )
}
