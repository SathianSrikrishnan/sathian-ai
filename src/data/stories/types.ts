export interface StoryScene {
  id: string
  background: string
  character?: {
    image: string
    position: 'left' | 'center' | 'right'
    enter?: 'left' | 'right' | 'top' | 'bottom' | 'fade'
    exit?: 'left' | 'right' | 'top' | 'bottom' | 'fade'
  }
  /** Small circular portrait shown beside speaker name — the "face pops up" pattern */
  characterAvatar?: {
    image: string
    alt?: string
  }
  dialogue: {
    speaker?: string
    speakerColor?: string
    text: string
    subtext?: string
  }
  /** Scene layout type — controls rendering in StoryPlayer */
  layout?: 'narrative' | 'character' | 'dramatic' | 'cover' | 'victory' | 'cta' | 'prose' | 'interactive'
  /** Optional second dialogue for dramatic/victory scenes */
  secondDialogue?: {
    speaker?: string
    speakerColor?: string
    text: string
  }
  /** Optional third dialogue for victory scenes */
  thirdDialogue?: {
    speaker?: string
    speakerColor?: string
    text: string
  }
  /** Interactive input that captures user answer into localStorage for downstream flows */
  interactive?: {
    prompt: string
    placeholder: string
    /** localStorage key to write to on submit */
    storageKey: string
    /** optional second key (e.g. tfn-story-context) — written with { storyId, sceneId } metadata */
    contextKey?: string
    ctaLabel: string
    skipLabel?: string
  }
  isChoice?: boolean
  choiceText?: string
  choiceHref?: string
}

/** Per-story ambient effect config */
export interface StoryEffects {
  /** Falling particles (snowflakes, petals, leaves, dust) */
  particles?: {
    count: number
    color: string
    /** Size range in px */
    sizeMin: number
    sizeMax: number
    /** Fall duration range in seconds */
    durationMin: number
    durationMax: number
    /** Horizontal drift range in px */
    drift: number
    /** Optional glow */
    glow?: boolean
  }
  /** Aurora/shimmer bands across the top */
  aurora?: {
    colors: string[]
    /** Band count (default 3) */
    bands?: number
  }
  /** Sparkle burst on specific layouts (e.g. 'victory') */
  sparkleOn?: string[]
}

export interface StoryConfig {
  id: string
  title: string
  region: string
  emoji: string
  color: string
  description: string
  characterName: string
  scenes: StoryScene[]
  crossReferences: string[]
  available: boolean
  /** Per-story color overrides for the player */
  colors?: {
    accent?: string
    accentGlow?: string
    secondary?: string
    secondaryGlow?: string
  }
  /** Per-story ambient effects */
  effects?: StoryEffects
}
