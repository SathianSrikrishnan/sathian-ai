import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const componentPath = resolve(root, 'src/components/toothlight/v4/VoiceAssistField.tsx')
const cssPath = resolve(root, 'src/components/toothlight/v4/VoiceAssistField.module.css')
const notePanelPath = resolve(root, 'src/components/toothlight/v4/FutureNotePanel.tsx')
const browserProofPath = resolve(root, 'tests/toothlight-v4-voice-assist.spec.ts')
const transcribeRoutePath = resolve(root, 'src/app/api/toothlight/voice-transcribe/route.ts')
const docsPath = resolve(root, 'docs/toothlight/v4/08-product-loop-checkpoint.md')
const failures = []

function assert(condition, message) {
  if (!condition) failures.push(message)
}

assert(existsSync(componentPath), 'VoiceAssistField component must exist')
assert(existsSync(cssPath), 'VoiceAssistField styles must exist')
assert(existsSync(browserProofPath), 'Voice Assist must have a browser proof for transcript insertion')
assert(existsSync(transcribeRoutePath), 'Voice Assist must have a Toothlight transcription fallback route')

const component = existsSync(componentPath) ? readFileSync(componentPath, 'utf8') : ''
const css = existsSync(cssPath) ? readFileSync(cssPath, 'utf8') : ''
const notePanel = existsSync(notePanelPath) ? readFileSync(notePanelPath, 'utf8') : ''
const browserProof = existsSync(browserProofPath) ? readFileSync(browserProofPath, 'utf8') : ''
const transcribeRoute = existsSync(transcribeRoutePath) ? readFileSync(transcribeRoutePath, 'utf8') : ''
const docs = existsSync(docsPath) ? readFileSync(docsPath, 'utf8') : ''

assert(/SpeechRecognition|webkitSpeechRecognition/.test(component), 'voice assist must use browser speech recognition for the first fast path')
assert(/unsupported|speechSupported/i.test(component), 'voice assist must handle unsupported browsers gracefully')
assert(/appendTranscript|joinTranscript|currentText/i.test(component), 'voice assist must append transcript to the approved text field')
assert(/MediaRecorder|getUserMedia/.test(component), 'voice assist must fall back to recording when browser speech fails')
assert(/\/api\/toothlight\/voice-transcribe/.test(component), 'voice assist fallback must call the Toothlight transcription route')
assert(/not-allowed|audio-capture|network|no-speech/.test(component), 'voice assist must show specific speech failure reasons')
assert(/permissions\.query/.test(component), 'voice assist must check whether microphone permission was already denied')
assert(/address bar/.test(component) && /Microphone to Allow/.test(component), 'voice assist must explain how to recover if no permission prompt appears')
assert(/textarea/.test(component), 'voice assist must keep typed fallback visible')
assert(/onChange/.test(component), 'voice assist must keep approved text controlled by the parent')
assert(!/\/api\/voice|ElevenLabs|conversation/.test(component), 'voice assist MVP must not call the generic voice-agent APIs')
assert(/aria-label=.*voice|Mic|Stop/i.test(component + css), 'voice assist must expose clear mic controls')
assert(/VoiceAssistField/.test(notePanel), 'parent future note must use VoiceAssistField')
assert(/Say the note|voicePrompt|Tanda/i.test(notePanel), 'parent future note must include voice-specific prompt copy')
assert(/FakeSpeechRecognition/.test(browserProof), 'browser proof must mock speech recognition deterministically')
assert(/toHaveValue/.test(browserProof), 'browser proof must verify transcript lands in the approved text field')
assert(/OPENAI_API_KEY/.test(transcribeRoute), 'transcription route must use the configured OpenAI key')
assert(/NODE_ENV/.test(transcribeRoute) && /TOOTHLIGHT_ENABLE_VOICE_TRANSCRIBE/.test(transcribeRoute), 'transcription route must be local by default and opt-in for production')
assert(/audioFile\.size/.test(transcribeRoute), 'transcription route must cap audio size')
assert(/whisper-1/.test(transcribeRoute), 'transcription route must transcribe short audio with OpenAI Whisper')
assert(/Voice Assist layer/.test(docs), 'checkpoint docs must record the voice assist scope')

if (failures.length > 0) {
  console.error(`FAIL toothlight-v4-voice-assist: ${failures.length} issue(s)`)
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log('PASS toothlight-v4-voice-assist')
