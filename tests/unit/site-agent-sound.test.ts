import { existsSync, readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

const readOptional = (path: string) => {
  const url = new URL(`../../${path}`, import.meta.url)
  return existsSync(url) ? readFileSync(url, 'utf8') : ''
}

describe('site-agent signature sound', () => {
  it('plays the approved short sting only from an intentional agent wake', () => {
    const widget = readOptional('src/components/ChatWidget.tsx')
    const sounds = readOptional('src/lib/agent/sounds.ts')

    expect(sounds).toContain("wake: '/audio/site-agent-wake-sting.mp3'")
    expect(sounds).toContain("const SITE_AGENT_WAKE_SESSION_KEY = 'sathian-agent-wake-sound-played'")
    expect(widget).toContain("playAgentSound('wake')")
    expect(widget).toContain('setOpen(true)')
  })

  it('primes the complete signature on note submission and plays it only after a durable receipt', () => {
    const widget = readOptional('src/components/ChatWidget.tsx')
    const sounds = readOptional('src/lib/agent/sounds.ts')

    expect(sounds).toContain("noteDelivered: '/audio/site-agent-note-signature.mp3'")
    expect(widget).toContain("if (pendingIntent === 'note') primeAgentSound('noteDelivered')")
    const receiptBlock = widget.slice(widget.indexOf('if (data.receipt?.code && data.receipt?.message)'))
    expect(receiptBlock).toContain("if (pendingIntent === 'note') playAgentSound('noteDelivered')")
  })

  it('keeps sound optional with a visible persisted control', () => {
    const widget = readOptional('src/components/ChatWidget.tsx')
    const sounds = readOptional('src/lib/agent/sounds.ts')

    expect(sounds).toContain("SITE_AGENT_SOUND_PREFERENCE_KEY = 'sathian-agent-sound-enabled'")
    expect(widget).toContain('data-agent-sound-toggle')
    expect(widget).toContain("aria-label={soundEnabled ? 'Mute agent sounds' : 'Turn on agent sounds'}")
    expect(widget).toContain('localStorage.setItem(SITE_AGENT_SOUND_PREFERENCE_KEY')
    expect(widget).toContain('if (!soundEnabledRef.current) return')
  })

  it('offers a deliberate measured replay of the complete signature', () => {
    const widget = readOptional('src/components/ChatWidget.tsx')

    expect(widget).toContain('data-agent-signature-replay')
    expect(widget).toContain('aria-label="Replay complete signature"')
    expect(widget).toContain('<span>Replay</span>')
    expect(widget).toContain('disabled={!soundEnabled}')
    expect(widget).toContain("playAgentSound('noteDelivered')")
    expect(widget).toContain("trackSiteEvent('agent_signature_replayed'")
    expect(widget).toContain("placement: 'agent_controls'")
  })
})
