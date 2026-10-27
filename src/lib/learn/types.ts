export type Answer = 'yes' | 'no'
export type Part = 'question' | Answer | 'close'
export type Mode = 'watch' | 'try'
export type Caption = [number, number, string]
export interface Clip { captionSrc?: string; embeddedDrawing?: boolean; src: string; transcript: string; duration?: number; sha256?: string; captions?: Caption[] }
export interface Chapter { id: string; title: string; question: string; answer: Answer; art: string; clips: Record<Part, Clip> }
export interface Lesson { availabilityMessage?: string; boardTitle?: string; introduction?: string; sourceNote?: string; id: string; title: string; label: string; description: string; art: string; poster: string; chapters: Chapter[]; watch?: Clip; sources: { title: string; url: string }[] }
