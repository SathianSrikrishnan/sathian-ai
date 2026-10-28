import 'server-only'
import data from './lessons.json'
import { stablecoinLesson } from './stablecoin'
import readiness from './availability.json'
import editorial from './editorial-readiness.json'
import { isLessonAvailable } from './media-policy'
import type { Lesson } from './types'
export const lessons: Lesson[] = [...data as Lesson[], stablecoinLesson]
export const lessonById = (id: string) => lessons.find(l => l.id === id)
export function available(lesson: Lesson): boolean {
  if (lesson.interactive === 'stablecoin') return true
  return isLessonAvailable(readiness[lesson.id as keyof typeof readiness] === true, (editorial as Record<string, { status: string }>)[lesson.id]?.status)
}
