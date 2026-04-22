'use client';

/**
 * TellStep — captures the child's narrative about this specific tooth.
 *
 * The Tell is TFN's most defensible feature: a 5-year-old's voice about a real
 * milestone, preserved. Photo apps save images; TFN saves the story.
 *
 * Behavior:
 * - Text input + Web Speech API (append, don't replace — multi-pass friendly)
 * - localStorage draft persistence (debounced 500ms) so refresh doesn't drop work
 * - Speak button hidden entirely when Web Speech API unavailable (older Safari, Firefox)
 * - No backend transcription (Whisper) — native APIs are free and work on iOS 14.5+/Chrome
 * - No moderation — a child's own words about their own tooth aren't public UGC
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { PC } from '../parent-theme';

// ── Types ─────────────────────────────────────────────────────────────

export interface TellStepProps {
  value: string;
  onChange: (v: string) => void;
  onSkip: () => void;
  onContinue: (v: string) => void;
}

// Minimal typed wrapper over the browser SpeechRecognition APIs.
// Avoids pulling in @types/dom-speech-recognition for a single-file component.
type MinimalSpeechRecognition = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult:
    | ((event: {
        results: ArrayLike<ArrayLike<{ transcript: string }>>;
        resultIndex: number;
      }) => void)
    | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
  start: () => void;
  stop: () => void;
};

type SpeechRecognitionCtor = new () => MinimalSpeechRecognition;

// ── Constants ─────────────────────────────────────────────────────────

const MAX_CHARS = 200;
const DRAFT_STORAGE_KEY = 'toothfairy-tell-draft';
const DEBOUNCE_MS = 500;
const SILENCE_STOP_MS = 3000;

const PLACEHOLDER_EXAMPLES = [
  'This tooth fell out when I bit an apple at grandma\u2019s house',
  'It wiggled for three weeks and I was SO scared',
  'I named it Sparkle because it was shiny',
] as const;

// ── Helpers ───────────────────────────────────────────────────────────

function getSpeechRecognitionCtor(): SpeechRecognitionCtor | null {
  if (typeof window === 'undefined') return null;
  const w = window as unknown as {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition ?? null;
}

// ── Component ─────────────────────────────────────────────────────────

export default function TellStep({
  value,
  onChange,
  onSkip,
  onContinue,
}: TellStepProps) {
  const [recording, setRecording] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const recognitionRef = useRef<MinimalSpeechRecognition | null>(null);
  const draftTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const silenceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hydratedRef = useRef(false);

  // Rotate placeholder on each render — pick one example, stable per mount
  const placeholder = useMemo(
    () =>
      PLACEHOLDER_EXAMPLES[
        Math.floor(Math.random() * PLACEHOLDER_EXAMPLES.length)
      ],
    []
  );

  // ── Hydrate draft from localStorage on mount ────────────────────────
  useEffect(() => {
    if (hydratedRef.current) return;
    hydratedRef.current = true;
    if (typeof window === 'undefined') return;

    // Detect speech API support
    setSpeechSupported(getSpeechRecognitionCtor() !== null);

    // Hydrate draft only if parent value is empty (don't overwrite in-progress text)
    if (value === '') {
      try {
        const draft = window.localStorage.getItem(DRAFT_STORAGE_KEY);
        if (draft && draft.length > 0) {
          onChange(draft.slice(0, MAX_CHARS));
        }
      } catch {
        // localStorage can throw in private browsing / sandboxed iframes — ignore
      }
    }
    // Intentionally only run on mount; subsequent value updates are handled by the debounce effect
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Debounced draft persistence ─────────────────────────────────────
  useEffect(() => {
    if (!hydratedRef.current) return;
    if (typeof window === 'undefined') return;

    if (draftTimerRef.current) clearTimeout(draftTimerRef.current);
    draftTimerRef.current = setTimeout(() => {
      try {
        if (value === '') {
          window.localStorage.removeItem(DRAFT_STORAGE_KEY);
        } else {
          window.localStorage.setItem(DRAFT_STORAGE_KEY, value);
        }
      } catch {
        // ignore
      }
    }, DEBOUNCE_MS);

    return () => {
      if (draftTimerRef.current) clearTimeout(draftTimerRef.current);
    };
  }, [value]);

  // ── Cleanup recognition on unmount ──────────────────────────────────
  useEffect(() => {
    return () => {
      try {
        recognitionRef.current?.stop();
      } catch {
        // ignore
      }
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    };
  }, []);

  // ── Clear draft helper ──────────────────────────────────────────────
  const clearDraft = useCallback(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  // ── Text change handler ─────────────────────────────────────────────
  const handleTextChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const next = e.target.value.slice(0, MAX_CHARS);
      onChange(next);
    },
    [onChange]
  );

  // ── Speak button handler ────────────────────────────────────────────
  const stopRecording = useCallback(() => {
    try {
      recognitionRef.current?.stop();
    } catch {
      // ignore
    }
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    setRecording(false);
  }, []);

  const startRecording = useCallback(() => {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) return;

    const rec = new Ctor();
    rec.continuous = false;
    rec.interimResults = false;
    rec.lang =
      (typeof navigator !== 'undefined' && navigator.language) || 'en-US';

    // Snapshot the value at start so appending is deterministic across async callbacks
    let appended = false;

    rec.onresult = (event) => {
      let transcript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      transcript = transcript.trim();
      if (transcript.length === 0) return;
      appended = true;

      // Append to existing text (don't replace — supports multi-pass)
      // Use functional pattern: read latest via a fresh snapshot from the caller
      // Since onChange is the only way to mutate, we call it with current value + transcript
      // Consumer must pass current value via props; we read it from the closure below.
      // NOTE: we intentionally re-read `value` via a ref pattern to avoid stale closures
      const currentVal = valueRef.current;
      const joined = currentVal
        ? `${currentVal}${currentVal.endsWith(' ') ? '' : ' '}${transcript}`
        : transcript;
      onChange(joined.slice(0, MAX_CHARS));

      // Reset silence timer on any speech result
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = setTimeout(() => {
        stopRecording();
      }, SILENCE_STOP_MS);
    };

    rec.onend = () => {
      setRecording(false);
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
    };

    rec.onerror = () => {
      setRecording(false);
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
    };

    recognitionRef.current = rec;
    try {
      rec.start();
      setRecording(true);
      // Auto-stop after initial silence window if nothing arrives
      silenceTimerRef.current = setTimeout(() => {
        if (!appended) stopRecording();
      }, SILENCE_STOP_MS);
    } catch {
      setRecording(false);
    }
  }, [onChange, stopRecording]);

  // Keep a ref of the latest `value` so the recognition callback can read it
  // without requiring us to re-create the recognition on every keystroke.
  const valueRef = useRef(value);
  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  const handleSpeakToggle = useCallback(() => {
    if (recording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [recording, startRecording, stopRecording]);

  // ── Skip / Continue ─────────────────────────────────────────────────
  const handleSkip = useCallback(() => {
    clearDraft();
    onSkip();
  }, [clearDraft, onSkip]);

  const handleContinue = useCallback(() => {
    clearDraft();
    onContinue(value);
  }, [clearDraft, onContinue, value]);

  // ── Render ──────────────────────────────────────────────────────────
  const charCount = value.length;
  const counterColor =
    charCount >= MAX_CHARS - 10 ? PC.goldDark : PC.dim;

  return (
    <div
      className="w-full min-h-screen flex flex-col items-center"
      style={{
        background: PC.bg,
        color: PC.text,
        fontFamily: "var(--font-body, 'Alegreya Sans'), sans-serif",
        padding: '24px 20px 32px',
      }}
    >
      <div className="w-full max-w-md">
        {/* Heading */}
        <h1
          className="leading-tight"
          style={{
            fontFamily: "var(--font-display), 'Alegreya', serif",
            color: PC.textWarm,
            fontSize: 'clamp(28px, 7vw, 36px)',
            fontWeight: 500,
            letterSpacing: '-0.01em',
            marginBottom: 8,
          }}
        >
          Tell us about this tooth!
        </h1>
        <p
          style={{
            color: PC.muted,
            fontSize: 16,
            lineHeight: 1.5,
            marginBottom: 20,
          }}
        >
          A sentence or two the grown-up can read back in ten years.
        </p>

        {/* Textarea */}
        <div
          className="relative"
          style={{
            background: PC.surface,
            borderRadius: 16,
            border: `1px solid ${PC.border}`,
            boxShadow: '0 2px 8px oklch(30% 0.035 65 / 0.04)',
            marginBottom: 12,
          }}
        >
          <textarea
            value={value}
            onChange={handleTextChange}
            maxLength={MAX_CHARS}
            placeholder={placeholder}
            aria-label="Tooth story"
            rows={5}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              resize: 'none',
              padding: '16px 16px 40px',
              fontFamily: "var(--font-body, 'Alegreya Sans'), sans-serif",
              fontSize: 17,
              lineHeight: 1.5,
              color: PC.text,
              minHeight: 140,
              borderRadius: 16,
            }}
          />
          {/* Char counter (absolute, bottom-right) */}
          <span
            aria-live="polite"
            style={{
              position: 'absolute',
              bottom: 10,
              right: 14,
              fontSize: 12,
              color: counterColor,
              fontVariantNumeric: 'tabular-nums',
              letterSpacing: '0.02em',
            }}
          >
            {charCount} / {MAX_CHARS}
          </span>
        </div>

        {/* Speak button — hidden entirely if API unavailable */}
        {speechSupported && (
          <button
            type="button"
            onClick={handleSpeakToggle}
            aria-pressed={recording}
            aria-label={recording ? 'Stop recording' : 'Speak instead of typing'}
            className="w-full flex items-center justify-center gap-3 active:scale-[0.98]"
            style={{
              height: 56,
              borderRadius: 28,
              background: recording ? PC.gold : PC.surfaceContainer,
              color: recording ? PC.onGold : PC.text,
              border: `2px solid ${recording ? PC.gold : PC.border}`,
              fontFamily: "var(--font-body, 'Alegreya Sans'), sans-serif",
              fontSize: 16,
              fontWeight: 500,
              cursor: 'pointer',
              marginBottom: 20,
              transition: 'background 0.2s, border-color 0.2s, color 0.2s',
            }}
          >
            <MicIcon recording={recording} />
            <span>{recording ? 'Listening\u2026' : 'Speak instead'}</span>
            {recording && (
              <span
                aria-hidden
                style={{
                  display: 'inline-block',
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: PC.onGold,
                  animation: 'tfn-tell-pulse 1.1s ease-in-out infinite',
                }}
              />
            )}
          </button>
        )}

        {/* Action row — Skip (secondary) + Continue (primary) */}
        <div
          className="flex items-center gap-3"
          style={{ marginTop: speechSupported ? 0 : 8 }}
        >
          <button
            type="button"
            onClick={handleSkip}
            aria-label="Skip the tell step for now"
            className="active:scale-[0.98]"
            style={{
              flex: '0 0 auto',
              height: 56,
              padding: '0 18px',
              borderRadius: 28,
              background: 'transparent',
              color: PC.muted,
              border: `1px solid ${PC.border}`,
              fontFamily: "var(--font-body, 'Alegreya Sans'), sans-serif",
              fontSize: 15,
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            Skip for now
          </button>
          <button
            type="button"
            onClick={handleContinue}
            aria-label="Save this story"
            className="flex-1 active:scale-[0.98]"
            style={{
              height: 56,
              borderRadius: 28,
              background: PC.gold,
              color: PC.onGold,
              border: 'none',
              fontFamily: "var(--font-display), 'Alegreya', serif",
              fontSize: 17,
              fontWeight: 500,
              letterSpacing: '-0.01em',
              cursor: 'pointer',
              boxShadow: '0 4px 16px oklch(72% 0.145 75 / 0.22)',
            }}
          >
            Save this story
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes tfn-tell-pulse {
          0%, 100% {
            opacity: 0.4;
            transform: scale(0.85);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
        }
      `}</style>
    </div>
  );
}

// ── Inline icon ───────────────────────────────────────────────────────

function MicIcon({ recording }: { recording: boolean }) {
  const stroke = recording ? 'currentColor' : PC.text;
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <rect
        x="9"
        y="3"
        width="6"
        height="12"
        rx="3"
        stroke={stroke}
        strokeWidth="1.8"
      />
      <path
        d="M5 11v1a7 7 0 0 0 14 0v-1"
        stroke={stroke}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M12 19v3"
        stroke={stroke}
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
