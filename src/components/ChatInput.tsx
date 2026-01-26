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
        placeholder={mode === 'kids' ? "Ask Pixel anything! 🐉" : "What would you like to know?"}
        className={`flex-1 rounded-xl px-4 py-3 resize-none focus:outline-none transition-colors ${
          mode === 'kids'
            ? 'bg-white border-2 border-orange-300 text-orange-700 placeholder-orange-300 focus:border-orange-400 text-lg min-h-[60px]'
            : 'bg-gray-800 border border-gray-700 text-light placeholder-gray-500 focus:border-primary text-base min-h-[50px]'
        }`}
        rows={1}
        disabled={isLoading}
      />
      <button
        onClick={handleSend}
        disabled={!input.trim() || isLoading}
        className={`rounded-xl transition-colors text-white ${
          mode === 'kids'
            ? 'bg-orange-500 hover:bg-orange-600 disabled:bg-orange-200 px-6 py-3 text-lg font-medium'
            : 'bg-primary hover:bg-blue-600 disabled:bg-gray-700 px-5 py-3'
        } disabled:cursor-not-allowed`}
      >
        {isLoading ? '...' : mode === 'kids' ? 'Ask! 🚀' : 'Send'}
      </button>
    </div>
  )
}
