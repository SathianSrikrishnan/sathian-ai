export type ModelMessage = {
  role: 'user' | 'assistant'
  content: string
}

export function buildModelMessages(history: unknown, message: string): ModelMessage[] {
  const normalized = (Array.isArray(history) ? history : [])
    .filter((entry): entry is ModelMessage => Boolean(
      entry &&
        typeof entry === 'object' &&
        'role' in entry &&
        'content' in entry &&
        (entry.role === 'user' || entry.role === 'assistant') &&
        typeof entry.content === 'string'
    ))
    .slice(-20)
    .map((entry) => ({
      role: entry.role,
      content: entry.content.slice(0, 2_000),
    }))

  const currentMessage = message.slice(0, 2_000)
  const last = normalized.at(-1)
  if (last?.role === 'user' && last.content === currentMessage) {
    normalized.pop()
  }

  return [...normalized, { role: 'user', content: currentMessage }]
}
