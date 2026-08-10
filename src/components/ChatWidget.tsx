'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion } from 'motion/react'
import { trackSiteEvent } from '@/lib/site-analytics'
import { CHAT_SUGGESTIONS } from '@/lib/constants'
import {
  MAX_AGENT_FILE_BYTES,
  validateAgentFileDeclaration,
} from '@/lib/agent/file-policy'
import {
  AGENT_FILE_INTAKE_CONFIGURED,
  AgentFileVerification,
} from '@/components/AgentFileVerification'

const SUGGESTIONS = CHAT_SUGGESTIONS

const AGENT_SESSION_KEY = 'sathian-agent-session-id'

interface AgentMessage {
  role: 'bot' | 'user'
  text: string
  feedbackEligible?: boolean
  sources?: string[]
  nextAction?: {
    label: string
    href: string
  }
}

function sourceLabel(source: string, index: number): string {
  if (source.startsWith('/')) return 'sathian.ai'
  try {
    return new URL(source).hostname.replace(/^www\./, '')
  } catch {
    return `Source ${index + 1}`
  }
}

function isSafePublicHref(href: string): boolean {
  if (href.startsWith('/') && !href.startsWith('//')) return true
  return /^https?:\/\//.test(href)
}

function isExternalHref(href: string): boolean {
  return /^https?:\/\//.test(href)
}

function recordAgentEvent(input: {
  event: 'site_session_started' | 'agent_widget_viewed'
  sessionId: string
  page: string
  source: 'site' | 'inline' | 'floating'
}) {
  void fetch('/api/agent/event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
    keepalive: true,
  }).catch(() => undefined)
}

function fileContentType(file: File): string {
  if (file.type) return file.type
  const extension = file.name.split('.').pop()?.toLowerCase()
  const fallback: Record<string, string> = {
    pdf: 'application/pdf',
    txt: 'text/plain',
    md: 'text/markdown',
    markdown: 'text/markdown',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
  }
  return extension ? fallback[extension] ?? '' : ''
}

function displayFileSize(byteSize: number): string {
  if (byteSize < 1024) return `${byteSize} B`
  if (byteSize < 1024 * 1024) return `${Math.ceil(byteSize / 1024)} KB`
  return `${(byteSize / (1024 * 1024)).toFixed(1)} MB`
}

async function responseError(response: Response, fallback: string): Promise<string> {
  const body = await response.json().catch(() => null)
  return typeof body?.error === 'string' ? body.error : fallback
}

async function uploadAgentFile(input: {
  file: File
  contentType: string
  idempotencyKey: string
  turnstileToken: string
  signal: AbortSignal
}) {
  const reservationResponse = await fetch('/api/agent/upload/reserve', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Idempotency-Key': input.idempotencyKey,
    },
    body: JSON.stringify({
      filename: input.file.name,
      contentType: input.contentType,
      byteSize: input.file.size,
      consent: true,
      turnstileToken: input.turnstileToken,
    }),
    signal: input.signal,
  })
  if (!reservationResponse.ok) {
    throw new Error(await responseError(reservationResponse, 'The secure file slot could not be reserved.'))
  }

  const reservation = await reservationResponse.json()
  if (
    typeof reservation?.upload?.url !== 'string' ||
    typeof reservation?.upload?.attachmentId !== 'string' ||
    typeof reservation?.upload?.completionToken !== 'string'
  ) throw new Error('The secure file slot returned an invalid receipt.')

  const uploadResponse = await fetch(reservation.upload.url, {
    method: 'PUT',
    headers: {
      'cache-control': 'max-age=0',
      'content-type': input.contentType,
      'x-upsert': 'false',
    },
    body: input.file,
    signal: input.signal,
  })
  if (!uploadResponse.ok) throw new Error('The file did not reach private quarantine.')

  const completionResponse = await fetch('/api/agent/upload/complete', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      attachmentId: reservation.upload.attachmentId,
      completionToken: reservation.upload.completionToken,
    }),
    signal: input.signal,
  })
  if (!completionResponse.ok) {
    throw new Error(await responseError(completionResponse, 'The file did not pass the private intake checks.'))
  }
}

export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<AgentMessage[]>([
    { role: 'bot', text: 'Ask about Sathian’s reviewed public projects, writing, or current work. You can also leave him a note.' },
  ])
  const [input, setInput] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const sendRef = useRef<(text: string) => void>(() => {})
  const abortRef = useRef<AbortController | null>(null)
  const pathname = usePathname()
  const isHomepage = pathname === '/'
  const [homeTarget, setHomeTarget] = useState<HTMLElement | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const [verificationKey, setVerificationKey] = useState(0)
  const [showContact, setShowContact] = useState(false)
  const [displayName, setDisplayName] = useState('')
  const [replyEmail, setReplyEmail] = useState('')
  const [composerMode, setComposerMode] = useState<'question' | 'note'>('question')
  const [answerFeedback, setAnswerFeedback] = useState<Record<number, 'helpful' | 'not_helpful'>>({})
  const agentSessionRef = useRef<string | null>(null)
  const widgetViewRecordedRef = useRef(false)

  const clearFile = useCallback(() => {
    setFile(null)
    setFileError(null)
    setTurnstileToken(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }, [])

  const chooseFile = useCallback((selected: File | null) => {
    setFileError(null)
    setTurnstileToken(null)
    if (!selected) {
      clearFile()
      return
    }
    if (selected.size > MAX_AGENT_FILE_BYTES) {
      clearFile()
      setFileError('Files must be 5 MB or smaller.')
      return
    }
    const contentType = fileContentType(selected)
    const declaration = validateAgentFileDeclaration({
      filename: selected.name,
      contentType,
      byteSize: selected.size,
    })
    if (!declaration.ok) {
      clearFile()
      setFileError('Choose one PDF, text, Markdown, JPEG, PNG, or WebP file.')
      return
    }
    setFile(selected)
  }, [clearFile])

  // Cleanup abort controller on unmount
  useEffect(() => {
    return () => { abortRef.current?.abort() }
  }, [])

  const handleSend = useCallback(async (text?: string) => {
    const msg = text || input.trim()
    if (!msg || isLoading) return
    if (file && !turnstileToken) {
      setFileError('Complete the human check before sending the file.')
      return
    }
    setShowSuggestions(false)

    setMessages((previous) => [...previous, { role: 'user' as const, text: msg }])
    setInput('')
    setIsLoading(true)

    // Abort any in-flight request
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller
    const timeout = setTimeout(() => controller.abort(), file ? 45_000 : 15_000)
    const idempotencyKey = crypto.randomUUID()
    const pendingFile = file
    const pendingFileContentType = pendingFile ? fileContentType(pendingFile) : ''
    const pendingTurnstileToken = turnstileToken
    const pendingIntent = composerMode

    trackSiteEvent('agent_question_submitted', {
      page: pathname,
      inputMethod: text ? 'prompt' : 'typed',
      hasContact: Boolean(displayName || replyEmail),
      hasAttachment: Boolean(pendingFile),
    })

    try {
      const res = await fetch('/api/agent/message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': idempotencyKey,
        },
         body: JSON.stringify({
           message: msg,
           intent: composerMode === 'note' ? 'note' : 'question',
           page: pathname,
           consent: true,
           attachmentIntent: Boolean(pendingFile),
           displayName,
           replyEmail,
         }),
        signal: controller.signal,
      })

      if (res.ok) {
        const data = await res.json()
        const responses: AgentMessage[] = []
        if (typeof data.answer === 'string' && data.answer.trim()) {
          const sources = Array.isArray(data.sources)
            ? data.sources.filter((source: unknown): source is string => typeof source === 'string' && /^https?:\/\//.test(source))
            : []
          const nextAction = data.nextAction
            && typeof data.nextAction.label === 'string'
            && typeof data.nextAction.href === 'string'
            && isSafePublicHref(data.nextAction.href)
            ? { label: data.nextAction.label, href: data.nextAction.href }
            : undefined
          responses.push({ role: 'bot', text: data.answer, sources, nextAction, feedbackEligible: true })
          trackSiteEvent('agent_answer_received', {
            page: pathname,
            route: typeof data.route === 'string' ? data.route : 'unknown',
            sourceCount: sources.length,
            hasNextAction: Boolean(nextAction),
          })
        }
        if (data.receipt?.code && data.receipt?.message) {
          responses.push({
            role: 'bot',
            text: `Receipt ${data.receipt.code} · ${data.receipt.message}`,
          })
          trackSiteEvent('agent_note_sent', {
            page: pathname,
            hasContact: Boolean(displayName || replyEmail),
            hasAttachment: Boolean(pendingFile),
          })
          if (pendingIntent === 'note') setComposerMode('question')
        }
        if (pendingFile && pendingTurnstileToken) {
          try {
            await uploadAgentFile({
              file: pendingFile,
              contentType: pendingFileContentType,
              idempotencyKey,
              turnstileToken: pendingTurnstileToken,
              signal: controller.signal,
            })
            responses.push({
              role: 'bot',
              text: `${pendingFile.name} is held privately for Sathian in Studio. Its contents are not analyzed or forwarded.`,
            })
            clearFile()
          } catch (error) {
            setTurnstileToken(null)
            setVerificationKey((value) => value + 1)
            responses.push({
              role: 'bot',
              text: `Your note was stored, but the file was not attached. ${error instanceof Error ? error.message : 'Please try the file again.'}`,
            })
          }
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
      clearTimeout(timeout)
      setIsLoading(false)
    }
   }, [clearFile, composerMode, displayName, file, input, isLoading, pathname, replyEmail, turnstileToken])

  const recordAnswerFeedback = useCallback((messageIndex: number, feedback: 'helpful' | 'not_helpful') => {
    if (answerFeedback[messageIndex]) return
    setAnswerFeedback((current) => ({ ...current, [messageIndex]: feedback }))
    trackSiteEvent('agent_answer_feedback', {
      page: pathname,
      feedback,
    })
  }, [answerFeedback, pathname])

  sendRef.current = (text: string) => handleSend(text)

   useEffect(() => {
     if (open && !isHomepage && inputRef.current) inputRef.current.focus()
   }, [isHomepage, open])

   useEffect(() => {
     let sessionId = sessionStorage.getItem(AGENT_SESSION_KEY)
     if (!sessionId) {
       sessionId = crypto.randomUUID()
       sessionStorage.setItem(AGENT_SESSION_KEY, sessionId)
       recordAgentEvent({
         event: 'site_session_started',
         sessionId,
         page: pathname,
         source: 'site',
       })
     }
     agentSessionRef.current = sessionId
   }, [pathname])

   useEffect(() => {
     const sessionId = agentSessionRef.current
     if (!open || !sessionId || widgetViewRecordedRef.current) return
     widgetViewRecordedRef.current = true
     recordAgentEvent({
       event: 'agent_widget_viewed',
       sessionId,
       page: pathname,
       source: isHomepage ? 'inline' : 'floating',
     })
   }, [isHomepage, open, pathname])

  useEffect(() => {
    if (!isHomepage) {
      setHomeTarget(null)
      return
    }

    const target = document.getElementById('home-agent-slot')
    setHomeTarget(target)
    setOpen(true)
  }, [isHomepage])

  // Listen for custom events from other components (e.g. homepage chat prompts)
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail
      if (detail?.message) {
        trackSiteEvent('agent_prompt_selected', {
          page: pathname,
          promptId: typeof detail.source === 'string' ? detail.source : 'page-prompt',
        })
        setOpen(true)
        setTimeout(() => sendRef.current(detail.message), 300)
      } else {
        setOpen(true)
        setTimeout(() => inputRef.current?.focus(), 50)
      }
    }
    window.addEventListener('open-chat', handler)
    return () => window.removeEventListener('open-chat', handler)
  }, [pathname])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Don't render on any toothfairy pages (TFN is a separate product)
  // Check both internal paths AND the toothfairy.network domain
  const isTfnDomain = typeof window !== 'undefined' && (window.location.hostname === 'toothfairy.network' || window.location.hostname === 'www.toothfairy.network' || window.location.hostname === 'toothfairy.sathian.ai')
  if (
    pathname?.startsWith('/toothfairy') ||
    pathname?.startsWith('/tooth/') ||
    pathname?.startsWith('/studio') ||
    isTfnDomain
  ) return null

  const chatSurface = (
    <AnimatePresence>
      {open && (
        <motion.div
          key="chat-panel"
          data-chat-panel
          role="dialog"
          aria-modal="false"
          aria-labelledby="site-agent-title"
          className={isHomepage
            ? 'site-agent-panel site-agent-panel--workshop site-agent-panel--inline'
            : 'site-agent-panel site-agent-panel--workshop site-agent-panel--floating fixed bottom-20 right-4 z-50 flex max-h-[calc(100vh-104px)] w-full max-w-[calc(100vw-32px)] flex-col overflow-hidden sm:w-[440px]'}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
        >
          {/* Header */}
          <div className="site-agent-header px-6 pt-5 pb-4">
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
                  <h2 id="site-agent-title" className="text-[17px] font-semibold">Sathian’s site agent</h2>
                </div>
              </div>
              <button type="button" onClick={() => setOpen(false)} aria-label="Close chat" className="site-agent-close w-8 h-8 rounded-full flex items-center justify-center cursor-pointer transition-colors focus-visible:outline-none">
                <svg aria-hidden="true" width="14" height="14" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 2L10 10M10 2L2 10" /></svg>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="site-agent-messages min-h-[180px] flex-1 space-y-3 overflow-y-auto px-6 py-5 sm:min-h-[240px] sm:max-h-[440px]">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'bot' ? 'justify-start' : 'justify-end'} gap-2.5`}>
                {msg.role === 'bot' && (
                  <div className="w-7 h-7 rounded-full flex-shrink-0 mt-1 overflow-hidden shadow-sm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/sathian-profile.png" alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className={`site-agent-message site-agent-message--${msg.role} max-w-[82%] px-4 py-3 text-[14px] leading-relaxed`} style={{
                  borderTopLeftRadius: msg.role === 'bot' ? '4px' : undefined,
                  borderTopRightRadius: msg.role === 'user' ? '4px' : undefined,
                }}>
                  <p>{msg.text}</p>
                  {msg.role === 'bot' && msg.sources && msg.sources.length > 0 && (
                    <nav className="site-agent-sources" aria-label="Agent source">
                      {msg.sources.map((source, sourceIndex) => (
                        <a
                          key={source}
                          href={source}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => trackSiteEvent('agent_source_opened', {
                            page: pathname,
                            sourceHost: sourceLabel(source, sourceIndex),
                          })}
                        >
                          {sourceLabel(source, sourceIndex)}
                        </a>
                      ))}
                    </nav>
                  )}
                  {msg.role === 'bot' && msg.nextAction && (
                    <a
                      href={msg.nextAction.href}
                      target={isExternalHref(msg.nextAction.href) ? '_blank' : undefined}
                      rel={isExternalHref(msg.nextAction.href) ? 'noopener noreferrer' : undefined}
                      className="site-agent-next-action"
                      onClick={() => trackSiteEvent('agent_source_opened', {
                        page: pathname,
                        sourceHost: sourceLabel(msg.nextAction!.href, 0),
                      })}
                    >
                      {msg.nextAction.label}
                    </a>
                  )}
                  {msg.role === 'bot' && msg.feedbackEligible && (
                    <div className="site-agent-feedback" aria-label="Was this answer helpful?">
                      <span>{answerFeedback[i] ? 'Feedback recorded' : 'Helpful?'}</span>
                      {!answerFeedback[i] && (
                        <>
                          <button type="button" onClick={() => recordAnswerFeedback(i, 'helpful')}>Yes</button>
                          <button type="button" onClick={() => recordAnswerFeedback(i, 'not_helpful')}>No</button>
                        </>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start gap-2.5">
                <div className="w-7 h-7 rounded-full flex-shrink-0 mt-1 overflow-hidden shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/sathian-profile.png" alt="" className="w-full h-full object-cover" />
                </div>
                <div className="site-agent-message site-agent-message--bot px-4 py-3" style={{ borderTopLeftRadius: '4px' }}>
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
                {SUGGESTIONS.map((suggestion) => (
                  <button key={suggestion.id} type="button" onClick={() => {
                    trackSiteEvent('agent_prompt_selected', {
                      page: pathname,
                      promptId: suggestion.id,
                    })
                    if (suggestion.action === 'compose_note') {
                      setComposerMode('note')
                      setShowSuggestions(false)
                      setInput('')
                      requestAnimationFrame(() => inputRef.current?.focus())
                      return
                    }
                    handleSend(suggestion.message)
                  }}
                    className="site-agent-suggestion px-3 py-1.5 text-[12px] cursor-pointer transition-colors focus-visible:outline-none">
                    {suggestion.label}
                  </button>
                ))}
              </div>
            )}
          </div>

           {/* Input */}
           <div className="site-agent-composer px-5 py-4">
            {composerMode === 'note' && (
              <div className="site-agent-note-mode">
                <span>Write your note to Sathian</span>
                <button type="button" onClick={() => {
                  setComposerMode('question')
                  setInput('')
                  setShowSuggestions(true)
                }}>Cancel</button>
              </div>
            )}
            {file && (
              <div data-file-intake className="mb-3 border-l-2 border-amber-500 bg-amber-50/70 px-3 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-800">Secure intake hatch</p>
                    <p className="mt-1 truncate text-xs font-medium text-gray-900">{file.name}</p>
                    <p className="text-[11px] text-gray-500">{displayFileSize(file.size)} / one private file</p>
                  </div>
                  <button
                    type="button"
                    onClick={clearFile}
                    className="text-[11px] font-medium text-gray-500 underline decoration-gray-300 underline-offset-2 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600/40"
                  >
                    Remove
                  </button>
                </div>
                <AgentFileVerification key={verificationKey} onToken={setTurnstileToken} />
              </div>
            )}
             {fileError && <p className="mb-2 text-[11px] leading-relaxed text-red-700" role="alert">{fileError}</p>}
             <div className="mb-2">
               <button
                 type="button"
                 onClick={() => setShowContact((value) => {
                   if (!value) trackSiteEvent('agent_contact_started', { page: pathname })
                   return !value
                 })}
                 aria-expanded={showContact}
                 className="text-[11px] font-medium text-gray-500 underline decoration-gray-300 underline-offset-2 hover:text-gray-900 focus-visible:outline-none"
               >
                 Want a reply? <span className="font-normal">Add optional contact details</span>
               </button>
               {showContact && (
                 <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <input
                      type="text"
                      name="displayName"
                      aria-label="Your name (optional)"
                     autoComplete="name"
                     value={displayName}
                     onChange={(event) => setDisplayName(event.target.value)}
                     maxLength={120}
                      placeholder="Your name (optional)…"
                     className="site-agent-input px-3 py-2 text-xs focus-visible:outline-none"
                   />
                    <input
                      type="email"
                      name="replyEmail"
                      aria-label="Reply email (optional)"
                     autoComplete="email"
                     value={replyEmail}
                     onChange={(event) => setReplyEmail(event.target.value)}
                     maxLength={320}
                      placeholder="Reply email (optional)…"
                     className="site-agent-input px-3 py-2 text-xs focus-visible:outline-none"
                   />
                 </div>
               )}
             </div>
             <div className="flex gap-2">
              <label
                title={AGENT_FILE_INTAKE_CONFIGURED ? 'Attach one private file' : 'Secure file verification is not active yet'}
                aria-disabled={!AGENT_FILE_INTAKE_CONFIGURED}
                className={`site-agent-attach flex h-11 w-11 flex-shrink-0 items-center justify-center border transition-colors ${
                  AGENT_FILE_INTAKE_CONFIGURED
                    ? 'cursor-pointer border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300 hover:bg-gray-100'
                    : 'cursor-not-allowed border-gray-100 bg-gray-50 text-gray-300'
                }`}
              >
                <span className="sr-only">Attach one private file</span>
                <input
                  ref={fileInputRef}
                  data-agent-file-input
                  type="file"
                  accept=".pdf,.txt,.md,.markdown,.jpg,.jpeg,.png,.webp,application/pdf,text/plain,text/markdown,image/jpeg,image/png,image/webp"
                  disabled={!AGENT_FILE_INTAKE_CONFIGURED || isLoading}
                  onChange={(event) => chooseFile(event.target.files?.[0] ?? null)}
                  className="sr-only"
                />
                <svg aria-hidden="true" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M21.4 11.6 12 21a6 6 0 0 1-8.5-8.5l10-10a4 4 0 0 1 5.7 5.7l-10 10a2 2 0 0 1-2.9-2.8l9.3-9.3" />
                </svg>
              </label>
              <input
                ref={inputRef}
                type="text" name="message" autoComplete="off" value={input}
                aria-label={composerMode === 'note' ? 'Write your note to Sathian' : 'Ask a question'}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSend() }}
                placeholder={composerMode === 'note' ? 'Write your note to Sathian…' : 'Ask a question…'}
                maxLength={2000}
                className="site-agent-input flex-1 px-4 py-3 text-sm focus-visible:outline-none transition-colors"
              />
              <button type="button" onClick={() => handleSend()} aria-label={composerMode === 'note' ? 'Send note' : 'Send question'} className="site-agent-send w-11 h-11 flex items-center justify-center cursor-pointer transition-opacity hover:opacity-80 focus-visible:outline-none">
                <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 2L11 13M22 2L15 22L11 13M11 13L2 9L22 2" /></svg>
              </button>
            </div>
            <p className="site-agent-disclosure mt-2 px-1 text-[10px] leading-relaxed">
              By sending, you agree this message may be stored and forwarded to Sathian. One permitted file can be held privately for 30 days. Please do not send secrets.
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )

  const inlineSurface = open ? chatSurface : (
    <button type="button" className="site-agent-reopen" onClick={() => setOpen(true)}>
      <span className="site-agent-reopen__status"><span /> SITE AGENT</span>
      <strong>Open the site agent</strong>
      <span>Ask about the work or leave Sathian a note.</span>
    </button>
  )

  return (
    <>
      {isHomepage ? (homeTarget ? createPortal(inlineSurface, homeTarget) : null) : chatSurface}

      {/* Floating button */}
      {!isHomepage && (
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
      )}
    </>
  )
}
