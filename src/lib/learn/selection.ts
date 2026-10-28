import type { Lesson, Mode } from './types'

export function lessonEntryMode(lesson: Pick<Lesson, 'interactive' | 'chapters'>, requested: Mode): Mode {
  if (lesson.interactive === 'stablecoin') return 'try'
  return lesson.chapters.length > 0 ? requested : 'watch'
}
