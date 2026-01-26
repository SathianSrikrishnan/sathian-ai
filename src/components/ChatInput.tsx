'use client'

import { useState, KeyboardEvent } from 'react'

interface ChatInputProps {
  onSend: (message: string) => void
  isLoading: boolean
  mode: 'standard' | 'kids'
}

export function ChatInput({ onSend, isLoading, mode }: ChatInputProps) {
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (input.trim() && !isLoading) {
      onSend(input.trim())
      setInput('')
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex items-end gap-3">
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={mode === 'kids' ? "Ask me anything! 🌟" : "What would you like to know?"}
        className={`flex-1 bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-light placeholder-gray-500 resize-none focus:outline-none focus:border-primary transition-colors ${
          mode === 'kids' ? 'text-lg min-h-[60px]' : 'text-base min-h-[50px]'
        }`}
        rows={1}
        disabled={isLoading}
      />
      <button
        onClick={handleSend}
        disabled={!input.trim() || isLoading}
        className={`bg-primary hover:bg-blue-600 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-xl transition-colors ${
          mode === 'kids' ? 'px-6 py-3 text-lg' : 'px-5 py-3'
        }`}
      >
        {isLoading ? '...' : 'Send'}
      </button>
    </div>
  )
}
