import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const componentPath = resolve(root, 'src/components/toothlight/v4/VoiceAssistField.tsx')
const cssPath = resolve(root, 'src/components/toothlight/v4/VoiceAssistField.module.css')
const notePanelPath = resolve(root, 'src/components/toothlight/v4/FutureNotePanel.tsx')
const browserProofPath = resolve(root, 'tests/toothlight-v4-voice-assist.spec.ts')
const docsPath = resolve(root, 'docs/toothlight/v4/08-product-loop-checkpoint.md')
const failures = []

function assert(condition, message) {
  if (!condition) failures.push(message)
}

assert(existsSync(componentPath), 'VoiceAssistField component must exist')
assert(existsSync(cssPath), 'VoiceAssistField styles must exist')
assert(existsSync(browserProofPath), 'Voice Assist must have a browser proof for transcript insertion')

const component = existsSync(componentPath) ? readFileSync(componentPath, 'utf8') : ''
const css = existsSync(cssPath) ? readFileSync(cssPath, 'utf8') : ''
const notePanel = existsSync(notePanelPath) ? readFileSync(notePanelPath, 'utf8') : ''
const browserProof = existsSync(browserProofPath) ? readFileSync(browserProofPath, 'utf8') : ''
const docs = existsSync(docsPath) ? readFileSync(docsPath, 'utf8') : ''

assert(/SpeechRecognition|webkitSpeechRecognition/.test(component), 'voice assist must use browser speech recognition for the first fast path')
assert(/unsupported|speechSupported/i.test(component), 'voice assist must handle unsupported browsers gracefully')
assert(/appendTranscript|joinTranscript|currentText/i.test(component), 'voice assist must append transcript to the approved text field')
assert(/textarea/.test(component), 'voice assist must keep typed fallback visible')
assert(/onChange/.test(component), 'voice assist must keep approved text controlled by the parent')
assert(!/\/api\/voice|transcribe|ElevenLabs|conversation/.test(component), 'voice assist MVP must not call the slower server voice APIs')
assert(/aria-label=.*voice|Mic|Stop/i.test(component + css), 'voice assist must expose clear mic controls')
assert(/VoiceAssistField/.test(notePanel), 'parent future note must use VoiceAssistField')
assert(/Say the note|voicePrompt|Tanda/i.test(notePanel), 'parent future note must include voice-specific prompt copy')
assert(/FakeSpeechRecognition/.test(browserProof), 'browser proof must mock speech recognition deterministically')
assert(/toHaveValue/.test(browserProof), 'browser proof must verify transcript lands in the approved text field')
assert(/Voice Assist layer/.test(docs), 'checkpoint docs must record the voice assist scope')

if (failures.length > 0) {
  console.error(`FAIL toothlight-v4-voice-assist: ${failures.length} issue(s)`)
  for (const failure of failures) {
    console.error(`- ${failure}`)
  }
  process.exit(1)
}

console.log('PASS toothlight-v4-voice-assist')
