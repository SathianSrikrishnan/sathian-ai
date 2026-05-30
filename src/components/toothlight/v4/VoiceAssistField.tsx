'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import styles from './VoiceAssistField.module.css'

type VoiceAssistFieldProps = {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder: string
  rows?: number
  voicePrompt?: string
}

type MinimalSpeechRecognition = {
  continuous: boolean
  interimResults: boolean
  lang: string
  onresult:
    | ((event: {
        results: ArrayLike<ArrayLike<{ transcript: string }>>
        resultIndex: number
      }) => void)
    | null
  onend: (() => void) | null
  onerror: (() => void) | null
  start: () => void
  stop: () => void
}

type SpeechRecognitionCtor = new () => MinimalSpeechRecognition

function getSpeechRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === 'undefined') return null
  const speechWindow = window as typeof window & {
    SpeechRecognition?: SpeechRecognitionCtor
    webkitSpeechRecognition?: SpeechRecognitionCtor
  }
  return speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition ?? null
}

function joinTranscript(currentText: string, transcript: string) {
  const cleaned = transcript.trim()
  if (!cleaned) return currentText
  if (!currentText.trim()) return cleaned
  return `${currentText.trimEnd()} ${cleaned}`
}

export function VoiceAssistField({
  label,
  value,
  onChange,
  placeholder,
  rows = 5,
  voicePrompt = 'Say it instead.',
}: VoiceAssistFieldProps) {
  const [speechSupported, setSpeechSupported] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [voiceStatus, setVoiceStatus] = useState('')
  const recognitionRef = useRef<MinimalSpeechRecognition | null>(null)
  const valueRef = useRef(value)
  const stopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    valueRef.current = value
  }, [value])

  useEffect(() => {
    setSpeechSupported(getSpeechRecognitionCtor() !== null)
    return () => {
      if (stopTimerRef.current) clearTimeout(stopTimerRef.current)
      try {
        recognitionRef.current?.stop()
      } catch {
        // Speech recognition can throw if it is already stopped.
      }
    }
  }, [])

  const stopListening = useCallback(() => {
    if (stopTimerRef.current) {
      clearTimeout(stopTimerRef.current)
      stopTimerRef.current = null
    }
    try {
      recognitionRef.current?.stop()
    } catch {
      // Speech recognition can throw if it is already stopped.
    }
    setIsListening(false)
  }, [])

  const appendTranscript = useCallback(
    (transcript: string) => {
      const nextText = joinTranscript(valueRef.current, transcript)
      valueRef.current = nextText
      onChange(nextText)
      setVoiceStatus('Added. You can edit it before sealing.')
    },
    [onChange],
  )

  const startListening = useCallback(() => {
    const Ctor = getSpeechRecognitionCtor()
    if (!Ctor) {
      setSpeechSupported(false)
      setVoiceStatus('Voice is unavailable here. Type instead.')
      return
    }

    const recognition = new Ctor()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = (typeof navigator !== 'undefined' && navigator.language) || 'en-US'
    recognition.onresult = (event) => {
      let transcript = ''
      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        transcript += event.results[index][0].transcript
      }
      appendTranscript(transcript)
      stopListening()
    }
    recognition.onend = () => {
      setIsListening(false)
      if (stopTimerRef.current) {
        clearTimeout(stopTimerRef.current)
        stopTimerRef.current = null
      }
    }
    recognition.onerror = () => {
      setIsListening(false)
      setVoiceStatus('Voice missed that. Type or try again.')
    }

    recognitionRef.current = recognition
    setVoiceStatus('Listening...')
    try {
      recognition.start()
      setIsListening(true)
      stopTimerRef.current = setTimeout(() => {
        stopListening()
      }, 7000)
    } catch {
      setIsListening(false)
      setVoiceStatus('Voice missed that. Type or try again.')
    }
  }, [appendTranscript, stopListening])

  return (
    <div className={styles.field}>
      <div className={styles.labelRow}>
        <label>
          <span>{label}</span>
          <textarea
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            rows={rows}
          />
        </label>
        {speechSupported && (
          <button
            type="button"
            className={styles.micButton}
            onClick={isListening ? stopListening : startListening}
            aria-label={isListening ? 'Stop voice input' : 'Start voice input'}
            data-listening={isListening ? 'true' : 'false'}
          >
            <span aria-hidden="true" className={styles.micIcon} />
            {isListening ? 'Stop' : 'Mic'}
          </button>
        )}
      </div>
      {speechSupported && <p className={styles.voicePrompt}>{voicePrompt}</p>}
      {voiceStatus && <p className={styles.voiceStatus}>{voiceStatus}</p>}
    </div>
  )
}

