export const CHAT_SUGGESTIONS = [
  "What's the story behind 808?",
  'Who is Sathian?',
  'I have feedback or an idea',
  'What should I explore here?',
]

export const ALLOWED_ORIGINS = [
  'https://sathian.ai',
  'https://www.sathian.ai',
  'https://btc.sathian.ai',
  'https://toothfairy.sathian.ai',
  'https://toothfairy.network',
  'https://www.toothfairy.network',
  ...(process.env.NODE_ENV === 'development' ? ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'] : []),
]
