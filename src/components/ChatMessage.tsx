interface ChatMessageProps {
  message: {
    role: 'user' | 'assistant'
    content: string
  }
  mode: 'standard' | 'kids'
}

export function ChatMessage({ message, mode }: ChatMessageProps) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} message-enter`}>
      {!isUser && mode === 'kids' && (
        <span className="text-2xl mr-2 self-end mb-1">🐉</span>
      )}
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          mode === 'kids'
            ? isUser
              ? 'bg-orange-500 text-white'
              : 'bg-white border-2 border-orange-200 text-orange-700 shadow-sm'
            : isUser
              ? 'bg-primary text-white'
              : 'bg-gray-800 text-light'
        } ${mode === 'kids' ? 'text-lg' : 'text-base'}`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  )
}
