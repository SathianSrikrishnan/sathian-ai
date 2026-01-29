'use client'

import { useState, useEffect } from 'react'

interface MigrationStatus {
  status: 'not_ready' | 'ready' | 'error'
  totalRecords?: number
  byCategory?: Record<string, number>
  message?: string
  instructions?: string
}

interface MigrationResult {
  success: boolean
  message?: string
  error?: string
  results?: {
    success: number
    skipped: number
    failed: number
    errors: string[]
  }
}

export default function SetupPage() {
  const [status, setStatus] = useState<MigrationStatus | null>(null)
  const [migrating, setMigrating] = useState(false)
  const [result, setResult] = useState<MigrationResult | null>(null)

  const checkStatus = async () => {
    try {
      const res = await fetch('/api/setup/migrate')
      const data = await res.json()
      setStatus(data)
    } catch {
      setStatus({ status: 'error', message: 'Failed to check status' })
    }
  }

  const runMigration = async () => {
    setMigrating(true)
    setResult(null)
    try {
      const res = await fetch('/api/setup/migrate', { method: 'POST' })
      const data = await res.json()
      setResult(data)
      checkStatus()
    } catch (e) {
      setResult({ success: false, error: String(e) })
    } finally {
      setMigrating(false)
    }
  }

  useEffect(() => {
    checkStatus()
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Kai Database Setup</h1>
        <p className="text-slate-400 mb-8">
          Configure Supabase database for Kai's memory and context
        </p>

        {/* Step 1: Create Tables */}
        <div className="bg-slate-900 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">
              1
            </span>
            Create Database Tables
          </h2>

          <p className="text-slate-300 mb-4">
            Run the SQL schema in Supabase Dashboard to create the required tables.
          </p>

          <div className="bg-slate-800 rounded p-4 mb-4">
            <p className="text-sm text-slate-400 mb-2">SQL File Location:</p>
            <code className="text-green-400 text-sm">
              sathian-ai/scripts/setup-database.sql
            </code>
          </div>

          <a
            href="https://supabase.com/dashboard/project/tvujxgdwgvrunjvhseey/sql"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-green-600 hover:bg-green-500 px-4 py-2 rounded font-medium transition-colors"
          >
            Open Supabase SQL Editor
          </a>

          <div className="mt-4 text-sm text-slate-400">
            <p>Steps:</p>
            <ol className="list-decimal list-inside mt-2 space-y-1">
              <li>Open the SQL Editor link above</li>
              <li>Copy the contents of setup-database.sql</li>
              <li>Paste and click "Run"</li>
              <li>Come back and refresh this page</li>
            </ol>
          </div>
        </div>

        {/* Step 2: Check Status */}
        <div className="bg-slate-900 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">
              2
            </span>
            Database Status
          </h2>

          {!status ? (
            <p className="text-slate-400">Checking...</p>
          ) : status.status === 'not_ready' ? (
            <div className="flex items-center gap-2 text-yellow-400">
              <span className="text-2xl">⚠️</span>
              <span>Tables not yet created. Complete Step 1 first.</span>
            </div>
          ) : status.status === 'ready' ? (
            <div>
              <div className="flex items-center gap-2 text-green-400 mb-4">
                <span className="text-2xl">✓</span>
                <span>Database ready! {status.totalRecords} records loaded.</span>
              </div>
              {status.byCategory && Object.keys(status.byCategory).length > 0 && (
                <div className="bg-slate-800 rounded p-3">
                  <p className="text-sm text-slate-400 mb-2">Records by category:</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {Object.entries(status.byCategory).map(([cat, count]) => (
                      <div key={cat} className="flex justify-between">
                        <span className="text-slate-300">{cat}</span>
                        <span className="text-green-400">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-red-400">Error checking status</div>
          )}

          <button
            onClick={checkStatus}
            className="mt-4 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded text-sm transition-colors"
          >
            Refresh Status
          </button>
        </div>

        {/* Step 3: Run Migration */}
        <div className="bg-slate-900 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">
              3
            </span>
            Migrate Context
          </h2>

          <p className="text-slate-300 mb-4">
            Load context from kai/context folder into the database.
          </p>

          <button
            onClick={runMigration}
            disabled={migrating || status?.status !== 'ready'}
            className={`px-4 py-2 rounded font-medium transition-colors ${
              migrating || status?.status !== 'ready'
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-500 text-white'
            }`}
          >
            {migrating ? 'Migrating...' : 'Run Migration'}
          </button>

          {result && (
            <div className={`mt-4 p-4 rounded ${result.success ? 'bg-green-900/50' : 'bg-red-900/50'}`}>
              {result.success ? (
                <div>
                  <p className="text-green-400 font-medium">{result.message}</p>
                  {result.results && (
                    <div className="mt-2 text-sm text-slate-300">
                      <p>Imported: {result.results.success}</p>
                      <p>Skipped: {result.results.skipped}</p>
                      <p>Failed: {result.results.failed}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-red-400">
                  <p className="font-medium">Migration failed</p>
                  <p className="text-sm mt-1">{result.error}</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Voice Test Link */}
        <div className="bg-slate-900 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <span className="bg-blue-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm">
              4
            </span>
            Test Voice
          </h2>

          <p className="text-slate-300 mb-4">
            Once setup is complete, test the voice assistant with full context.
          </p>

          <a
            href="/voice"
            className="inline-block bg-purple-600 hover:bg-purple-500 px-4 py-2 rounded font-medium transition-colors"
          >
            Open Voice Interface
          </a>
        </div>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <a href="/" className="text-slate-400 hover:text-white transition-colors">
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  )
}
