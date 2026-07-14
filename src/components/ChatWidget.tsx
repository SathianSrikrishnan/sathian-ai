'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'motion/react'
import { CHAT_SUGGESTIONS } from '@/lib/constants'

const SUGGESTIONS = CHAT_SUGGESTIONS

export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<{ role: 'bot' | 'user'; text: string }[]>([
    { role: 'bot', text: 'I can answer from Sathian’s public projects and writing, or pass a note to him.' },
  ])
  const [input, setInput] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const sendRef = useRef<(text: string) => void>(() => {})
  const abortRef = useRef<AbortController | null>(null)
  const pathname = usePathname()

  // Cleanup abort controller on unmount
  useEffect(() => {
    return () => { abortRef.current?.abort() }
  }, [])

  const handleSend = useCallback(async (text?: string) => {
    const msg = text || input.trim()
    if (!msg || isLoading) return
    setShowSuggestions(false)

    setMessages((previous) => [...previous, { role: 'user' as const, text: msg }])
    setInput('')
    setIsLoading(true)

    // Abort any in-flight request
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller
    const timeout = setTimeout(() => controller.abort(), 15000)
    const idempotencyKey = crypto.randomUUID()

    try {
      const res = await fetch('/api/agent/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': idempotencyKey,
        },
        body: JSON.stringify({ message: msg, page: pathname, consent: true }),
        signal: controller.signal,
      })
      clearTimeout(timeout)

      if (res.ok) {
        const data = await res.json()
        const responses: { role: 'bot'; text: string }[] = []
        if (typeof data.answer === 'string' && data.answer.trim()) {
          responses.push({ role: 'bot', text: data.answer })
        }
        if (data.receipt?.code && data.receipt?.message) {
          responses.push({
            role: 'bot',
            text: `Receipt ${data.receipt.code} · ${data.receipt.message}`,
          })
        }
        if (responses.length === 0) {
          responses.push({ role: 'bot', text: data.message || 'I could not answer that safely right now.' })
        }
        setMessages((prev) => [...prev, ...responses])
      } else if (res.status === 429) {
        const data = await res.json().catch(() => null)
        setMessages((prev) => [...prev, { role: 'bot' as const, text: data?.error || "You've been chatting a lot! Give me a moment to catch up." }])
      } else {
        const data = await res.json().catch(() => null)
        setMessages((prev) => [...prev, { role: 'bot' as const, text: data?.message || data?.error || 'Sorry, I couldn\'t process that right now. Try again in a moment.' }])
      }
    } catch (e) {
      clearTimeout(timeout)
      if (e instanceof DOMException && e.name === 'AbortError') {
        setMessages((prev) => [...prev, { role: 'bot' as const, text: 'That took too long. Try again?' }])
      } else {
        setMessages((prev) => [...prev, { role: 'bot' as const, text: 'Connection issue. Please try again.' }])
      }
    } finally {
      setIsLoading(false)
    }
  }, [input, isLoading, pathname])

  sendRef.current = (text: string) => handleSend(text)

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus()
  }, [open])

  // Listen for custom events from other components (e.g. homepage chat prompts)
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail
      if (detail?.message) {
        setOpen(true)
        setTimeout(() => sendRef.current(detail.message), 300)
      } else {
        setOpen(true)
      }
    }
    window.addEventListener('open-chat', handler)
    return () => window.removeEventListener('open-chat', handler)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Don't render on any toothfairy pages (TFN is a separate product)
  // Check both internal paths AND the toothfairy.network domain
  const isTfnDomain = typeof window !== 'undefined' && (window.location.hostname === 'toothfairy.network' || window.location.hostname === 'www.toothfairy.network' || window.location.hostname === 'toothfairy.sathian.ai')
  if (pathname?.startsWith('/toothfairy') || pathname?.startsWith('/tooth/') || isTfnDomain) return null

  return (
    <>
      {/* Chat panel */}
      <AnimatePresence>
      {open && (
        <motion.div
          key="chat-panel"
          data-chat-panel
          className="fixed bottom-20 right-4 z-50 w-full sm:w-[440px] max-w-[calc(100vw-32px)] rounded-2xl overflow-hidden"
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          style={{
            background: '#ffffff',
            boxShadow: '0 25px 80px rgba(0,0,0,0.15), 0 8px 32px rgba(0,0,0,0.08)',
            border: '1px solid rgba(0,0,0,0.06)',
          }}
        >
          {/* Header */}
          <div className="px-6 pt-5 pb-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full relative overflow-hidden flex-shrink-0 shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/sathian-profile.png" alt="Sathian" className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full" style={{
                    background: '#22c55e', border: '2px solid #ffffff',
                    boxShadow: '0 0 4px rgba(34,197,94,0.4)',
                  }} />
                </div>
                <div>
                  <h4 className="text-[15px] font-semibold text-gray-900">Sathian’s site agent</h4>
                  <a href="mailto:hi@sathian.ai" className="text-xs text-gray-500 hover:text-gray-900 transition-colors">
                    hi@sathian.ai
                  </a>
                </div>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close chat" className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/30">
                <svg aria-hidden="true" width="14" height="14" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 2L10 10M10 2L2 10" /></svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="px-6 py-5 space-y-3 max-h-[440px] min-h-[240px] overflow-y-auto bg-gray-50/50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'bot' ? 'justify-start' : 'justify-end'} gap-2.5`}>
                {msg.role === 'bot' && (
                  <div className="w-7 h-7 rounded-full flex-shrink-0 mt-1 overflow-hidden shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/sathian-profile.png" alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className={`max-w-[80%] px-4 py-3 rounded-2xl text-[14px] leading-relaxed ${
                  msg.role === 'bot'
                    ? 'bg-white text-gray-700 border border-gray-100 shadow-sm'
                    : 'bg-gray-900 text-white'
                }`} style={{
                  borderTopLeftRadius: msg.role === 'bot' ? '4px' : undefined,
                  borderTopRightRadius: msg.role === 'user' ? '4px' : undefined,
                }}>{msg.text}</div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start gap-2.5">
                <div className="w-7 h-7 rounded-full flex-shrink-0 mt-1 overflow-hidden shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/sathian-profile.png" alt="" className="w-full h-full object-cover" />
                </div>
                <div className="px-4 py-3 rounded-2xl bg-white border border-gray-100 shadow-sm" style={{ borderTopLeftRadius: '4px' }}>
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />

            {showSuggestions && (
              <div className="flex flex-wrap gap-2 pt-2">
                {SUGGESTIONS.map((s) => (
                  <button key={s} type="button" onClick={() => handleSend(s)}
                    className="px-3 py-1.5 rounded-full text-[12px] bg-white border border-gray-200 text-gray-600 cursor-pointer hover:bg-gray-100 hover:border-gray-300 transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/30">
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <div className="px-5 py-4 border-t border-gray-100 bg-white">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text" name="message" autoComplete="off" value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSend() }}
                placeholder="Ask a question or leave a note…"
                maxLength={2000}
                className="flex-1 px-4 py-3 rounded-xl text-sm bg-gray-50 border border-gray-200 text-gray-800 placeholder-gray-400 focus:border-gray-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/30 transition-colors"
              />
              <button type="button" onClick={() => handleSend()} aria-label="Send message" className="w-11 h-11 rounded-xl flex items-center justify-center cursor-pointer transition-opacity hover:opacity-80 bg-gray-900 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-900/30">
                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2" /></svg>
              </button>
            </div>
            <p className="mt-2 px-1 text-[10px] leading-relaxed text-gray-400">
              By sending, you agree this message may be stored and forwarded to Sathian. Please do not send secrets.
            </p>
          </div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* Floating button */}
      <motion.button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close chat' : 'Open chat'}
        className="fixed bottom-6 right-4 sm:right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center cursor-pointer overflow-hidden"
        style={{
          boxShadow: '0 4px 20px rgba(0,0,0,0.15), 0 0 40px rgba(124,58,237,0.1)',
          border: open ? '2px solid rgba(0,0,0,0.1)' : '2px solid rgba(255,255,255,0.2)',
        }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
      >
        {open ? (
          <div className="w-full h-full bg-gray-900 flex items-center justify-center">
            <svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M18 6L6 18M6 6L18 18" /></svg>
          </div>
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img src="/sathian-profile.png" alt="Open Sathian’s site agent" className="w-full h-full object-cover" />
        )}
      </motion.button>
    </>
  )
}
