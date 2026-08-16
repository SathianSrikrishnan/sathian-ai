export const SITE_AGENT_SOUNDS = {
  wake: '/audio/site-agent-wake-sting.mp3',
  noteDelivered: '/audio/site-agent-note-signature.mp3',
} as const

export const SITE_AGENT_WAKE_SESSION_KEY = 'sathian-agent-wake-sound-played'
export const SITE_AGENT_SOUND_PREFERENCE_KEY = 'sathian-agent-sound-enabled'

export type SiteAgentSound = keyof typeof SITE_AGENT_SOUNDS
