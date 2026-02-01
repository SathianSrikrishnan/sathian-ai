'use client'

import { useState, useRef, useEffect } from 'react'

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

export default function VoicePage() {
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [lastTiming, setLastTiming] = useState<Timing | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [recordMode, setRecordMode] = useState<'hold' | 'tap'>('hold')

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Start recording
  const startRecording = async () => {
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
        await processAudio(audioBlob)
      }

      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start()
      setIsRecording(true)
    } catch (err) {
      setError('Microphone access denied. Please allow microphone access.')
      console.error('Recording error:', err)
    }
  }

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  // Toggle recording (for tap mode)
  const toggleRecording = () => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  // Skip audio playback
  const skipAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      setIsPlaying(false)
    }
  }

  // Process audio through API
  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('audio', audioBlob, 'recording.webm')
      formData.append('history', JSON.stringify(messages.slice(-10)))
      formData.append('speed', '2.0') // 2x speed - fast talker mode

      const response = await fetch('/api/voice/conversation', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Conversation failed')
      }

      const data = await response.json()

      // Add messages to history
      setMessages((prev) => [
        ...prev,
        { role: 'user', content: data.userText, timestamp: new Date() },
        { role: 'assistant', content: data.assistantText, timestamp: new Date() },
      ])

      // Store timing
      setLastTiming(data.timing)

      // Play audio response
      if (data.audio && audioRef.current) {
        const audioBuffer = Uint8Array.from(atob(data.audio), (c) => c.charCodeAt(0))
        const audioBlob = new Blob([audioBuffer], { type: 'audio/mpeg' })
        const audioUrl = URL.createObjectURL(audioBlob)

        audioRef.current.src = audioUrl
        audioRef.current.play()
        setIsPlaying(true)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      console.error('Processing error:', err)
    } finally {
      setIsProcessing(false)
    }
  }

  // Handle audio ended
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const handleEnded = () => setIsPlaying(false)
    audio.addEventListener('ended', handleEnded)
    return () => audio.removeEventListener('ended', handleEnded)
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape to skip audio
      if (e.code === 'Escape' && isPlaying) {
        e.preventDefault()
        skipAudio()
        return
      }

      // Space for recording
      if (e.code === 'Space' && !isProcessing) {
        e.preventDefault()
        if (recordMode === 'hold') {
          if (!e.repeat && !isRecording) {
            startRecording()
          }
        } else {
          // Tap mode - toggle on keydown (not repeat)
          if (!e.repeat) {
            toggleRecording()
          }
        }
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
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
  }, [isRecording, isProcessing, isPlaying, recordMode])

  // Button handlers based on mode
  const handleMouseDown = () => {
    if (recordMode === 'hold') startRecording()
  }

  const handleMouseUp = () => {
    if (recordMode === 'hold') stopRecording()
  }

  const handleClick = () => {
    if (recordMode === 'tap') toggleRecording()
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-zinc-800/50 p-4 backdrop-blur-sm bg-zinc-950/80 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <h1 className="text-lg font-medium tracking-tight">Kai Voice</h1>
          </div>
          {lastTiming && (
            <div className="text-xs text-zinc-500 font-mono">
              {(lastTiming.total / 1000).toFixed(1)}s
            </div>
          )}
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto p-4 pb-48">
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-zinc-900 border border-zinc-800 mb-6">
                <svg className="w-7 h-7 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
              </div>
              <p className="text-zinc-400 text-lg mb-2">Ready when you are</p>
              <p className="text-zinc-600 text-sm">
                {recordMode === 'hold' ? 'Hold spacebar or button to talk' : 'Tap spacebar or button to start/stop'}
              </p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`group relative ${msg.role === 'user' ? 'ml-12' : 'mr-12'}`}
            >
              <div
                className={`p-4 rounded-2xl transition-all ${
                  msg.role === 'user'
                    ? 'bg-blue-600/20 border border-blue-500/20'
                    : 'bg-zinc-900/80 border border-zinc-800/50'
                }`}
              >
                <div className={`text-xs mb-2 font-medium ${
                  msg.role === 'user' ? 'text-blue-400' : 'text-zinc-500'
                }`}>
                  {msg.role === 'user' ? 'You' : 'Kai'}
                </div>
                <div className="text-zinc-100 leading-relaxed">{msg.content}</div>
              </div>
            </div>
          ))}

          {isProcessing && (
            <div className="mr-12">
              <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800/50">
                <div className="text-xs text-zinc-500 mb-2 font-medium">Kai</div>
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-zinc-600 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-zinc-600 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-zinc-600 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                  <span className="text-zinc-500 text-sm">Thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Error display */}
      {error && (
        <div className="px-4 py-3 bg-red-950/50 border-t border-red-900/50 text-red-300 text-sm text-center backdrop-blur-sm">
          {error}
        </div>
      )}

      {/* Recording controls */}
      <footer className="fixed bottom-0 left-0 right-0 border-t border-zinc-800/50 bg-zinc-950/95 backdrop-blur-xl p-6">
        <div className="max-w-2xl mx-auto flex flex-col items-center gap-4">
          {/* Mode toggle and skip button row */}
          <div className="flex items-center gap-4 w-full justify-center">
            {/* Record mode toggle */}
            <button
              onClick={() => setRecordMode(recordMode === 'hold' ? 'tap' : 'hold')}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                recordMode === 'tap'
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                  : 'bg-zinc-800/50 text-zinc-400 border border-zinc-700/50 hover:bg-zinc-800'
              }`}
            >
              {recordMode === 'hold' ? '🎤 Hold Mode' : '🎙️ Tap Mode'}
            </button>

            {/* Skip button - only visible when playing */}
            {isPlaying && (
              <button
                onClick={skipAudio}
                className="px-4 py-2 rounded-full text-xs font-medium bg-zinc-800/50 text-zinc-400 border border-zinc-700/50 hover:bg-zinc-700 hover:text-zinc-300 transition-all animate-in fade-in duration-200"
              >
                Skip ↵
              </button>
            )}
          </div>

          {/* Main mic button */}
          <button
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
            onClick={handleClick}
            disabled={isProcessing}
            className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200 ${
              isRecording
                ? 'bg-red-500 scale-110 shadow-lg shadow-red-500/30'
                : isProcessing
                ? 'bg-zinc-800 cursor-not-allowed'
                : 'bg-zinc-800 hover:bg-zinc-700 hover:scale-105 active:scale-95 shadow-lg shadow-zinc-900/50'
            }`}
          >
            {/* Glow ring when recording */}
            {isRecording && (
              <div className="absolute inset-0 rounded-full bg-red-500/30 animate-ping" />
            )}

            {isRecording ? (
              <div className="w-6 h-6 bg-white rounded-sm" />
            ) : isProcessing ? (
              <div className="w-6 h-6 border-2 border-zinc-500 border-t-zinc-300 rounded-full animate-spin" />
            ) : (
              <svg className="w-8 h-8 text-zinc-300" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
              </svg>
            )}
          </button>

          {/* Status text */}
          <div className="text-sm text-zinc-500 h-5">
            {isRecording
              ? recordMode === 'hold' ? 'Release to send' : 'Tap to stop'
              : isProcessing
              ? 'Processing...'
              : isPlaying
              ? 'Press Escape to skip'
              : recordMode === 'hold'
              ? 'Hold to speak (or spacebar)'
              : 'Tap to start (or spacebar)'}
          </div>

          {/* Timing breakdown */}
          {lastTiming && !isRecording && !isProcessing && (
            <div className="flex gap-4 text-xs text-zinc-600 font-mono">
              <span>STT {lastTiming.transcribe}ms</span>
              <span>Think {lastTiming.think}ms</span>
              <span>TTS {lastTiming.speak}ms</span>
            </div>
          )}
        </div>
      </footer>

      {/* Hidden audio element for playback */}
      <audio ref={audioRef} className="hidden" />
    </div>
  )
}
