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
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? 'bg-primary text-white'
            : 'bg-gray-800 text-light'
        } ${mode === 'kids' ? 'text-lg' : 'text-base'}`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  )
}
