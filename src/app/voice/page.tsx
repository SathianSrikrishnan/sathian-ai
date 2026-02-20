'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { motion } from 'motion/react'

interface Message {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface Timing {
  transcribe: number
  think: number
  speak: number
  total: number
}

/* ── Waveform bars around mic button while recording ───────────────── */
function WaveformRing() {
  const bars = 24
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {Array.from({ length: bars }).map((_, i) => {
        const angle = (360 / bars) * i
        const delay = (i / bars) * 1.2
        return (
          <div
            key={i}
            className="absolute"
            style={{
              transform: `rotate(${angle}deg) translateY(-52px)`,
            }}
          >
            <div
              className="w-[2px] rounded-full"
              style={{
                height: '14px',
                background: 'linear-gradient(180deg, var(--cosmic-nebula), var(--cosmic-aurora))',
                animation: `waveBar 0.8s ease-in-out ${delay}s infinite alternate`,
                opacity: 0.8,
              }}
            />
          </div>
        )
      })}
    </div>
  )
}

/* ── PIN Gate Overlay ───────────────── */
function PinGate({ onUnlock }: { onUnlock: (pin: string) => void }) {
  const [pin, setPin] = useState('')
  const [error, setError] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!pin.trim() || verifying) return

    setVerifying(true)
    setError(false)

    try {
      // Verify PIN by making a lightweight request to the voice API
      const res = await fetch('/api/voice/speak', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-voice-pin': pin,
        },
        body: JSON.stringify({ text: 'test' }),
      })

      if (res.status === 401) {
        setError(true)
        setPin('')
        inputRef.current?.focus()
      } else {
        // PIN is valid (even if the actual TTS fails, auth passed)
        onUnlock(pin)
      }
    } catch {
      setError(true)
    } finally {
      setVerifying(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ background: 'var(--cosmic-bg, #050510)' }}
    >
      {/* Aurora ambient */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div
          className="absolute -top-[150px] right-[10%] h-[500px] w-[500px] rounded-full opacity-[0.06]"
          style={{ background: 'radial-gradient(circle, var(--cosmic-nebula, #7C3AED), transparent 70%)' }}
        />
        <div
          className="absolute -left-[80px] bottom-[15%] h-[400px] w-[400px] rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, var(--cosmic-aurora, #06B6D4), transparent 70%)' }}
        />
      </div>

      <motion.div
        className="relative z-10 w-full max-w-sm mx-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Card */}
        <div
          className="rounded-2xl p-8 text-center"
          style={{
            background: 'rgba(15,15,45,0.6)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Kai orb */}
          <div
            className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full"
            style={{
              background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.1))',
              border: '1px solid rgba(124,58,237,0.2)',
            }}
          >
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="rgba(167,139,250,0.8)" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </div>

          <h2 className="font-display text-lg font-semibold mb-1" style={{ color: '#F1F5F9' }}>
            Kai Voice
          </h2>
          <p className="text-sm mb-6" style={{ color: 'rgba(167,139,250,0.6)' }}>
            Enter access code to continue
          </p>

          <form onSubmit={handleSubmit}>
            <motion.input
              ref={inputRef}
              type="password"
              value={pin}
              onChange={(e) => { setPin(e.target.value); setError(false) }}
              placeholder="Access code"
              className="w-full px-4 py-3 rounded-xl text-center text-sm font-mono tracking-[0.3em] outline-none transition-all"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: error ? '1px solid rgba(239,68,68,0.5)' : '1px solid rgba(255,255,255,0.1)',
                color: '#F1F5F9',
              }}
              animate={error ? { x: [-8, 8, -6, 6, -4, 4, 0] } : {}}
              transition={{ duration: 0.4 }}
            />

            {error && (
              <p className="mt-2 text-xs" style={{ color: '#FCA5A5' }}>
                Invalid access code
              </p>
            )}

            <button
              type="submit"
              disabled={verifying || !pin.trim()}
              className="mt-4 w-full py-3 rounded-xl text-sm font-medium transition-all"
              style={{
                background: verifying ? 'rgba(255,255,255,0.05)' : 'linear-gradient(135deg, rgba(124,58,237,0.3), rgba(6,182,212,0.2))',
                border: '1px solid rgba(124,58,237,0.3)',
                color: '#F1F5F9',
                cursor: verifying ? 'not-allowed' : 'pointer',
              }}
            >
              {verifying ? 'Verifying...' : 'Unlock'}
            </button>
          </form>

          <div className="flex items-center justify-center gap-4 mt-6">
            <Link
              href="/voice/about"
              className="text-xs font-mono transition-colors hover:text-white/60"
              style={{ color: 'rgba(6,182,212,0.5)' }}
            >
              About Kai Voice
            </Link>
            <span style={{ color: 'rgba(255,255,255,0.1)' }}>|</span>
            <Link
              href="/"
              className="text-xs font-mono transition-colors hover:text-white/60"
              style={{ color: 'rgba(167,139,250,0.4)' }}
            >
              &larr; sathian.ai
            </Link>
          </div>
        </div>
      </motion.div>

    </div>
  )
}

export default function VoicePage() {
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [lastTiming, setLastTiming] = useState<Timing | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [recordMode, setRecordMode] = useState<'hold' | 'tap'>('hold')
  const [playbackSpeed] = useState(1.0)
  const [voicePin, setVoicePin] = useState<string | null>(null)
  const [authChecked, setAuthChecked] = useState(false)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  // Check for stored PIN on mount
  useEffect(() => {
    const stored = sessionStorage.getItem('voice-pin')
    if (stored) setVoicePin(stored)
    setAuthChecked(true)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleUnlock = (pin: string) => {
    sessionStorage.setItem('voice-pin', pin)
    setVoicePin(pin)
  }

  const startRecording = useCallback(async () => {
    if (isProcessing || isRecording) return
    try {
      setError(null)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus',
      })

      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        stream.getTracks().forEach((track) => track.stop())

        if (audioBlob.size < 1000) {
          setError('Recording too short. Try again.')
          setIsProcessing(false)
          return
        }

        await processAudio(audioBlob)
      }

      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start(1000)
      setIsRecording(true)
    } catch {
      setError('Microphone access denied. Please allow microphone access.')
    }
  }, [isProcessing, isRecording])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }, [isRecording])

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }, [isRecording, stopRecording, startRecording])

  const skipAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setIsPlaying(false)
    }
  }, [])

  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('audio', audioBlob, 'recording.webm')
      formData.append('history', JSON.stringify(messages.slice(-10)))
      formData.append('speed', '1.2')

      const response = await fetch('/api/voice/conversation', {
        method: 'POST',
        headers: {
          'x-voice-pin': voicePin || '',
        },
        body: formData,
      })

      if (response.status === 401) {
        // PIN expired or invalid — clear and show gate
        sessionStorage.removeItem('voice-pin')
        setVoicePin(null)
        setIsProcessing(false)
        return
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Conversation failed')
      }

      const data = await response.json()

      setMessages((prev) => [
        ...prev,
        { role: 'user', content: data.userText, timestamp: new Date() },
        { role: 'assistant', content: data.assistantText, timestamp: new Date() },
      ])

      setLastTiming(data.timing)

      if (data.audio && audioRef.current) {
        const audioBuffer = Uint8Array.from(atob(data.audio), (c) => c.charCodeAt(0))
        const blob = new Blob([audioBuffer], { type: 'audio/mpeg' })
        const audioUrl = URL.createObjectURL(blob)

        audioRef.current.src = audioUrl
        audioRef.current.playbackRate = playbackSpeed
        audioRef.current.play()
        setIsPlaying(true)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setIsProcessing(false)
    }
  }

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const handleEnded = () => setIsPlaying(false)
    audio.addEventListener('ended', handleEnded)
    return () => audio.removeEventListener('ended', handleEnded)
  }, [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!voicePin) return // Don't handle keys if not authenticated
      if (e.code === 'Escape' && isPlaying) {
        e.preventDefault()
        skipAudio()
        return
      }
      if (e.code === 'Space' && !isProcessing) {
        e.preventDefault()
        if (recordMode === 'hold') {
          if (!e.repeat && !isRecording) startRecording()
        } else {
          if (!e.repeat) toggleRecording()
        }
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!voicePin) return
      if (e.code === 'Space' && recordMode === 'hold' && isRecording) {
        e.preventDefault()
        stopRecording()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [voicePin, isRecording, isProcessing, isPlaying, recordMode, startRecording, stopRecording, toggleRecording, skipAudio])

  const handleMouseDown = () => {
    if (recordMode === 'hold') startRecording()
  }
  const handleMouseUp = () => {
    if (recordMode === 'hold') stopRecording()
  }
  const handleClick = () => {
    if (recordMode === 'tap') toggleRecording()
  }

  // Show nothing until we check sessionStorage (avoid flash)
  if (!authChecked) return null

  // Show PIN gate if not authenticated
  if (!voicePin) {
    return <PinGate onUnlock={handleUnlock} />
  }

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ background: 'var(--cosmic-bg, #050510)', color: 'var(--cosmic-text, #F1F5F9)' }}
    >
      {/* ── CSS Variables & Animations ── */}
      <style jsx>{`
        :root {
          --cosmic-bg: #050510;
          --cosmic-surface: #0F0F2D;
          --cosmic-nebula: #7C3AED;
          --cosmic-aurora: #06B6D4;
          --cosmic-stardust: #F59E0B;
          --cosmic-plasma: #EC4899;
          --cosmic-text: #F1F5F9;
          --cosmic-muted: #A78BFA;
        }
        @keyframes waveBar {
          0% { transform: scaleY(0.4); opacity: 0.4; }
          100% { transform: scaleY(1.6); opacity: 1; }
        }
        @keyframes orbFloat {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-6px) scale(1.02); }
        }
        @keyframes orbGlow {
          0%, 100% { box-shadow: 0 0 40px rgba(124,58,237,0.2), 0 0 80px rgba(6,182,212,0.1); }
          50% { box-shadow: 0 0 60px rgba(124,58,237,0.35), 0 0 120px rgba(6,182,212,0.2); }
        }
      `}</style>

      {/* ── Aurora ambient glow ── */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div
          className="animate-aurora-drift absolute -top-[150px] right-[10%] h-[500px] w-[500px] rounded-full opacity-[0.04]"
          style={{ background: 'radial-gradient(circle, var(--cosmic-nebula), transparent 70%)' }}
        />
        <div
          className="animate-aurora-drift-reverse absolute -left-[80px] bottom-[15%] h-[400px] w-[400px] rounded-full opacity-[0.03]"
          style={{ background: 'radial-gradient(circle, var(--cosmic-aurora), transparent 70%)' }}
        />
      </div>

      {/* ── Header ── */}
      <header className="glass sticky top-0 z-50 border-b border-white/10">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/40 transition-colors hover:text-white/60"
            >
              sathian.ai
            </Link>
            <span className="text-white/20">/</span>
            <div className="flex items-center gap-2">
              <div
                className="h-2 w-2 rounded-full"
                style={{
                  background: 'linear-gradient(135deg, var(--cosmic-nebula), var(--cosmic-aurora))',
                  boxShadow: '0 0 8px rgba(124,58,237,0.5)',
                  animation: 'orbGlow 3s ease-in-out infinite',
                }}
              />
              <h1 className="font-display text-sm font-semibold tracking-tight">Kai Voice</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {lastTiming && (
              <div className="font-mono text-[10px] tabular-nums text-white/30">
                {(lastTiming.total / 1000).toFixed(1)}s
              </div>
            )}
            {/* Mode toggle */}
            <button
              onClick={() => setRecordMode(recordMode === 'hold' ? 'tap' : 'hold')}
              className="font-mono rounded-lg px-2.5 py-1 text-[10px] font-medium transition-all"
              style={{
                color: 'var(--cosmic-muted)',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {recordMode === 'hold' ? 'Hold' : 'Tap'}
            </button>
          </div>
        </div>
      </header>

      {/* ── Messages ── */}
      <main className="relative z-10 flex-1 overflow-y-auto p-4 pb-52">
        <div className="mx-auto max-w-2xl space-y-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center py-24 text-center">
              {/* Kai orb */}
              <div
                className="relative mb-8 flex h-20 w-20 items-center justify-center rounded-full"
                style={{
                  background: 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(6,182,212,0.1))',
                  border: '1px solid rgba(124,58,237,0.2)',
                  animation: 'orbFloat 4s ease-in-out infinite, orbGlow 3s ease-in-out infinite',
                }}
              >
                <svg
                  className="h-8 w-8"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="url(#mic-gradient)"
                  strokeWidth={1.5}
                >
                  <defs>
                    <linearGradient id="mic-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="var(--cosmic-nebula)" />
                      <stop offset="100%" stopColor="var(--cosmic-aurora)" />
                    </linearGradient>
                  </defs>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                  />
                </svg>
              </div>
              <p className="font-display mb-2 text-lg font-medium text-white/80">
                Ready when you are
              </p>
              <p className="font-mono text-xs text-white/30">
                {recordMode === 'hold'
                  ? 'Hold spacebar or button to talk'
                  : 'Tap spacebar or button to start/stop'}
              </p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`${msg.role === 'user' ? 'ml-12' : 'mr-12'}`}
            >
              <div
                className="rounded-2xl p-4 transition-all"
                style={
                  msg.role === 'user'
                    ? {
                        background: 'rgba(124,58,237,0.08)',
                        border: '1px solid rgba(124,58,237,0.15)',
                      }
                    : {
                        background: 'rgba(6,182,212,0.05)',
                        border: '1px solid rgba(6,182,212,0.1)',
                      }
                }
              >
                <div
                  className="font-mono mb-2 text-[10px] font-medium uppercase tracking-wider"
                  style={{
                    color:
                      msg.role === 'user'
                        ? 'var(--cosmic-muted)'
                        : 'var(--cosmic-aurora)',
                  }}
                >
                  {msg.role === 'user' ? 'You' : 'Kai'}
                </div>
                <div className="text-sm leading-relaxed text-white/90">{msg.content}</div>
              </div>
            </div>
          ))}

          {isProcessing && (
            <div className="mr-12">
              <div
                className="rounded-2xl p-4"
                style={{
                  background: 'rgba(6,182,212,0.05)',
                  border: '1px solid rgba(6,182,212,0.1)',
                }}
              >
                <div
                  className="font-mono mb-2 text-[10px] font-medium uppercase tracking-wider"
                  style={{ color: 'var(--cosmic-aurora)' }}
                >
                  Kai
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map((j) => (
                      <div
                        key={j}
                        className="h-1.5 w-1.5 rounded-full animate-bounce"
                        style={{
                          background: 'var(--cosmic-aurora)',
                          animationDelay: `${j * 150}ms`,
                          opacity: 0.6,
                        }}
                      />
                    ))}
                  </div>
                  <span className="font-mono text-xs text-white/30">Thinking</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* ── Error ── */}
      {error && (
        <div
          className="border-t px-4 py-3 text-center text-sm backdrop-blur-sm"
          style={{
            background: 'rgba(239,68,68,0.08)',
            borderColor: 'rgba(239,68,68,0.2)',
            color: '#FCA5A5',
          }}
        >
          {error}
        </div>
      )}

      {/* ── Recording controls ── */}
      <footer
        className="glass fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 p-6"
      >
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-4">
          {/* Mic button */}
          <div className="relative">
            {isRecording && <WaveformRing />}
            <button
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onTouchStart={handleMouseDown}
              onTouchEnd={handleMouseUp}
              onClick={handleClick}
              disabled={isProcessing}
              className="relative z-10 flex h-[72px] w-[72px] items-center justify-center rounded-full transition-all duration-200"
              style={
                isRecording
                  ? {
                      background: 'linear-gradient(135deg, var(--cosmic-nebula), var(--cosmic-plasma))',
                      boxShadow: '0 0 40px rgba(124,58,237,0.4), 0 0 80px rgba(236,72,153,0.2)',
                      transform: 'scale(1.1)',
                    }
                  : isProcessing
                  ? {
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      cursor: 'not-allowed',
                    }
                  : {
                      background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(6,182,212,0.15))',
                      border: '1px solid rgba(124,58,237,0.3)',
                      boxShadow: '0 0 30px rgba(124,58,237,0.15)',
                    }
              }
            >
              {isRecording ? (
                <div className="h-5 w-5 rounded-sm bg-white" />
              ) : isProcessing ? (
                <div
                  className="h-5 w-5 animate-spin rounded-full border-2"
                  style={{ borderColor: 'rgba(255,255,255,0.15)', borderTopColor: 'var(--cosmic-aurora)' }}
                />
              ) : (
                <svg className="h-7 w-7" fill="var(--cosmic-text)" viewBox="0 0 24 24">
                  <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                  <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
                </svg>
              )}
            </button>
          </div>

          {/* Status */}
          <div className="flex items-center gap-3">
            <div className="font-mono text-xs text-white/40">
              {isRecording
                ? recordMode === 'hold'
                  ? 'Release to send'
                  : 'Tap to stop'
                : isProcessing
                ? 'Processing...'
                : isPlaying
                ? 'Press Esc to skip'
                : recordMode === 'hold'
                ? 'Hold to speak'
                : 'Tap to start'}
            </div>
            {isPlaying && (
              <button
                onClick={skipAudio}
                className="font-mono rounded-lg px-2 py-0.5 text-[10px] text-white/40 transition-colors hover:text-white/60"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                Skip
              </button>
            )}
          </div>

          {/* Timing */}
          {lastTiming && !isRecording && !isProcessing && (
            <div className="font-mono flex gap-4 text-[10px] text-white/20">
              <span>STT {lastTiming.transcribe}ms</span>
              <span>LLM {lastTiming.think}ms</span>
              <span>TTS {lastTiming.speak}ms</span>
            </div>
          )}
        </div>
      </footer>

      <audio ref={audioRef} className="hidden" />

    </div>
  )
}
