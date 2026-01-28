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
  const [messages, setMessages] = useState<Message[]>([])
  const [lastTiming, setLastTiming] = useState<Timing | null>(null)
  const [error, setError] = useState<string | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)

  // Start recording
  const startRecording = async () => {
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

  // Process audio through API
  const processAudio = async (audioBlob: Blob) => {
    setIsProcessing(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('audio', audioBlob, 'recording.webm')
      formData.append('history', JSON.stringify(messages.slice(-10))) // Last 10 messages for context

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
      if (data.audio) {
        const audioBuffer = Uint8Array.from(atob(data.audio), (c) => c.charCodeAt(0))
        const audioBlob = new Blob([audioBuffer], { type: 'audio/mpeg' })
        const audioUrl = URL.createObjectURL(audioBlob)

        if (audioRef.current) {
          audioRef.current.src = audioUrl
          audioRef.current.play()
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      console.error('Processing error:', err)
    } finally {
      setIsProcessing(false)
    }
  }

  // Keyboard shortcut - hold space to record
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && !e.repeat && !isRecording && !isProcessing) {
        e.preventDefault()
        startRecording()
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space' && isRecording) {
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
  }, [isRecording, isProcessing])

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      {/* Header */}
      <header className="border-b border-zinc-800 p-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-semibold">Kai Voice</h1>
          {lastTiming && (
            <div className="text-xs text-zinc-500">
              {(lastTiming.total / 1000).toFixed(1)}s total
            </div>
          )}
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto p-4">
        <div className="max-w-2xl mx-auto space-y-4">
          {messages.length === 0 && (
            <div className="text-center text-zinc-500 py-12">
              <p className="text-lg mb-2">Hold spacebar or tap the button to talk</p>
              <p className="text-sm">Kai is listening...</p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`p-4 rounded-lg ${
                msg.role === 'user'
                  ? 'bg-zinc-800 ml-8'
                  : 'bg-zinc-900 border border-zinc-800 mr-8'
              }`}
            >
              <div className="text-xs text-zinc-500 mb-1">
                {msg.role === 'user' ? 'You' : 'Kai'}
              </div>
              <div className="text-zinc-100">{msg.content}</div>
            </div>
          ))}

          {isProcessing && (
            <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800 mr-8 animate-pulse">
              <div className="text-xs text-zinc-500 mb-1">Kai</div>
              <div className="text-zinc-400">Thinking...</div>
            </div>
          )}
        </div>
      </main>

      {/* Error display */}
      {error && (
        <div className="px-4 py-2 bg-red-900/50 border-t border-red-800 text-red-200 text-sm text-center">
          {error}
        </div>
      )}

      {/* Recording controls */}
      <footer className="border-t border-zinc-800 p-6">
        <div className="max-w-2xl mx-auto flex flex-col items-center gap-4">
          <button
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onTouchStart={startRecording}
            onTouchEnd={stopRecording}
            disabled={isProcessing}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
              isRecording
                ? 'bg-red-500 scale-110'
                : isProcessing
                ? 'bg-zinc-700 cursor-not-allowed'
                : 'bg-zinc-700 hover:bg-zinc-600 active:scale-95'
            }`}
          >
            {isRecording ? (
              <div className="w-6 h-6 bg-white rounded-sm" />
            ) : isProcessing ? (
              <div className="w-6 h-6 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
              </svg>
            )}
          </button>

          <div className="text-sm text-zinc-500">
            {isRecording
              ? 'Release to send'
              : isProcessing
              ? 'Processing...'
              : 'Hold to speak (or press spacebar)'}
          </div>

          {lastTiming && (
            <div className="flex gap-4 text-xs text-zinc-600">
              <span>STT: {lastTiming.transcribe}ms</span>
              <span>Think: {lastTiming.think}ms</span>
              <span>TTS: {lastTiming.speak}ms</span>
            </div>
          )}
        </div>
      </footer>

      {/* Hidden audio element for playback */}
      <audio ref={audioRef} className="hidden" />
    </div>
  )
}
