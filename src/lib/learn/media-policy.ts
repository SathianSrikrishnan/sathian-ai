export function isLessonAvailable(mediaReady: boolean, editorialStatus?: string): boolean {
  return mediaReady && editorialStatus !== 'factual-review-needed'
}
