export interface StoryScene {
  id: string
  background: string
  character?: {
    image: string
    position: 'left' | 'center' | 'right'
    enter?: 'left' | 'right' | 'top' | 'bottom' | 'fade'
    exit?: 'left' | 'right' | 'top' | 'bottom' | 'fade'
  }
  dialogue: {
    speaker?: string
    speakerColor?: string
    text: string
  }
  isChoice?: boolean
  choiceText?: string
  choiceHref?: string
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
}
