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
  successMessage?: string
  transcribingMessage?: string
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
  onerror:
    | ((event: {
        error?: string
        message?: string
      }) => void)
    | null
  start: () => void
  stop: () => void
}

type SpeechRecognitionCtor = new () => MinimalSpeechRecognition
type MicrophonePermissionState = PermissionState | null

const MICROPHONE_PERMISSION_HELP =
  'Microphone is blocked. If no prompt appeared, click the site icon in the address bar, set Microphone to Allow, then reload. You can also type the note.'

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

function getSpeechErrorMessage(errorName: string) {
  if (errorName === 'not-allowed' || errorName === 'service-not-allowed') {
    return MICROPHONE_PERMISSION_HELP
  }
  if (errorName === 'audio-capture') {
    return 'No microphone was found. Type instead.'
  }
  if (errorName === 'network') {
    return 'Browser voice failed. Try Record instead.'
  }
  if (errorName === 'no-speech') {
    return 'No speech heard. Try again or use Record.'
  }
  return 'Voice missed that. Try Record or type instead.'
}

async function getMicrophonePermissionState(): Promise<MicrophonePermissionState> {
  if (typeof navigator === 'undefined' || typeof navigator.permissions?.query !== 'function') return null

  try {
    const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName })
    return permission.state
  } catch {
    return null
  }
}

function isMicrophonePermissionError(error: unknown) {
  return (
    error instanceof DOMException &&
    (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError')
  )
}

function getRecorderMimeType() {
  if (typeof MediaRecorder === 'undefined') return ''
  if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) return 'audio/webm;codecs=opus'
  if (MediaRecorder.isTypeSupported('audio/webm')) return 'audio/webm'
  return ''
}

export function VoiceAssistField({
  label,
  value,
  onChange,
  placeholder,
  rows = 5,
  voicePrompt = 'Say it instead.',
  successMessage = 'Added. You can edit it before sealing.',
  transcribingMessage = 'Writing your note...',
}: VoiceAssistFieldProps) {
  const [speechSupported, setSpeechSupported] = useState(false)
  const [recorderSupported, setRecorderSupported] = useState(false)
  const [speechFallbackMode, setSpeechFallbackMode] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [voiceStatus, setVoiceStatus] = useState('')
  const recognitionRef = useRef<MinimalSpeechRecognition | null>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<BlobPart[]>([])
  const valueRef = useRef(value)
  const stopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    valueRef.current = value
  }, [value])

  useEffect(() => {
    setSpeechSupported(getSpeechRecognitionCtor() !== null)
    setRecorderSupported(
      typeof navigator.mediaDevices?.getUserMedia === 'function' && typeof MediaRecorder !== 'undefined',
    )
    return () => {
      if (stopTimerRef.current) clearTimeout(stopTimerRef.current)
      try {
        recognitionRef.current?.stop()
      } catch {
        // Speech recognition can throw if it is already stopped.
      }
      try {
        recorderRef.current?.stop()
      } catch {
        // Recorder can throw if it is already stopped.
      }
      streamRef.current?.getTracks().forEach((track) => track.stop())
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
      setVoiceStatus(successMessage)
    },
    [onChange, successMessage],
  )

  const transcribeRecording = useCallback(
    async (audioBlob: Blob) => {
      setIsTranscribing(true)
      setVoiceStatus(transcribingMessage)
      try {
        const formData = new FormData()
        formData.append('audio', audioBlob, 'toothlight-note.webm')
        const response = await fetch('/api/toothlight/voice-transcribe', {
          method: 'POST',
          body: formData,
        })
        const result = (await response.json()) as { text?: string; error?: string }
        if (!response.ok) throw new Error(result.error || 'Voice transcription failed.')
        if (!result.text?.trim()) {
          setVoiceStatus('No speech heard. Type or try again.')
          return
        }
        appendTranscript(result.text)
      } catch (error) {
        setVoiceStatus(error instanceof Error ? error.message : 'Voice transcription failed. Type instead.')
      } finally {
        setIsTranscribing(false)
      }
    },
    [appendTranscript],
  )

  const stopRecording = useCallback(() => {
    if (stopTimerRef.current) {
      clearTimeout(stopTimerRef.current)
      stopTimerRef.current = null
    }
    try {
      recorderRef.current?.stop()
    } catch {
      setIsRecording(false)
    }
  }, [])

  const startRecording = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setRecorderSupported(false)
      setVoiceStatus('Recording is unavailable here. Type instead.')
      return
    }

    try {
      const permissionState = await getMicrophonePermissionState()
      if (permissionState === 'denied') {
        setVoiceStatus(MICROPHONE_PERMISSION_HELP)
        return
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mimeType = getRecorderMimeType()
      const recorder = mimeType ? new MediaRecorder(stream, { mimeType }) : new MediaRecorder(stream)

      chunksRef.current = []
      streamRef.current = stream
      recorderRef.current = recorder

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data)
      }
      recorder.onstop = () => {
        stream.getTracks().forEach((track) => track.stop())
        setIsRecording(false)
        const audioBlob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' })
        chunksRef.current = []
        if (audioBlob.size < 500) {
          setVoiceStatus('No speech heard. Type or try again.')
          return
        }
        void transcribeRecording(audioBlob)
      }

      recorder.start()
      setIsRecording(true)
      setVoiceStatus('Recording... tap Stop when done.')
      stopTimerRef.current = setTimeout(() => {
        stopRecording()
      }, 12000)
    } catch (error) {
      setIsRecording(false)
      setVoiceStatus(isMicrophonePermissionError(error) ? MICROPHONE_PERMISSION_HELP : 'Microphone failed. Type instead.')
    }
  }, [stopRecording, transcribeRecording])

  const startListening = useCallback(() => {
    const Ctor = getSpeechRecognitionCtor()
    if (!Ctor) {
      setSpeechSupported(false)
      if (recorderSupported) {
        setSpeechFallbackMode(true)
        void startRecording()
      } else {
        setVoiceStatus('Voice is unavailable here. Type instead.')
      }
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
    recognition.onerror = (event) => {
      const errorName = event.error ?? 'unknown'
      setIsListening(false)
      setSpeechFallbackMode(true)
      setVoiceStatus(getSpeechErrorMessage(errorName))
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
  }, [appendTranscript, recorderSupported, startRecording, stopListening])

  const canUseVoice = speechSupported || recorderSupported
  const useRecorder = speechFallbackMode || !speechSupported
  const isBusy = isListening || isRecording || isTranscribing
  const buttonLabel = isTranscribing ? 'Writing' : isListening || isRecording ? 'Stop' : useRecorder ? 'Record' : 'Mic'
  const buttonAriaLabel =
    isListening || isRecording
      ? 'Stop voice input'
      : useRecorder
        ? 'Start recorded voice input'
        : 'Start voice input'

  const handleVoiceButton = useCallback(() => {
    if (isListening) {
      stopListening()
      return
    }
    if (isRecording) {
      stopRecording()
      return
    }
    if (isTranscribing) return
    if (useRecorder) {
      void startRecording()
    } else {
      startListening()
    }
  }, [isListening, isRecording, isTranscribing, startListening, startRecording, stopListening, stopRecording, useRecorder])

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
        {canUseVoice && (
          <button
            type="button"
            className={styles.micButton}
            onClick={handleVoiceButton}
            disabled={isTranscribing}
            aria-label={buttonAriaLabel}
            data-listening={isBusy ? 'true' : 'false'}
          >
            <span aria-hidden="true" className={styles.micIcon} />
            {buttonLabel}
          </button>
        )}
      </div>
      {canUseVoice && <p className={styles.voicePrompt}>{voicePrompt}</p>}
      {voiceStatus && <p className={styles.voiceStatus}>{voiceStatus}</p>}
    </div>
  )
}
