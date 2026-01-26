'use client'

import { useState, useRef, useEffect } from 'react'
import { ChatMessage } from '@/components/ChatMessage'
import { ChatInput } from '@/components/ChatInput'
import { QuickPrompts } from '@/components/QuickPrompts'
import { ModeToggle } from '@/components/ModeToggle'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [mode, setMode] = useState<'standard' | 'kids'>('standard')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return

    const userMessage: Message = { role: 'user', content }
    setMessages(prev => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: content,
          mode,
          history: messages,
        }),
      })

      const data = await response.json()

      if (data.message) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.message }])
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'I apologize, but I encountered an error. Please try again.'
      }])
    } finally {
      setIsLoading(false)
    }
  }

  const quickPrompts = mode === 'kids'
    ? [
        "Tell me a story!",
        "What's Bitcoin?",
        "Show me something cool",
        "Who is Sathian?",
      ]
    : [
        "Who is Sathian?",
        "What are you building?",
        "I met you at dinner",
        "Tell me about sovereignty",
      ]

  return (
    <main className="flex flex-col h-screen max-w-4xl mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-gray-800">
        <div>
          <h1 className="text-xl font-semibold text-light">sathian.ai</h1>
          <p className="text-sm text-gray-400">Second Brain Interface</p>
        </div>
        <ModeToggle mode={mode} onModeChange={setMode} />
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold text-light">
                {mode === 'kids' ? 'Hi there! 👋' : 'Welcome'}
              </h2>
              <p className="text-gray-400 max-w-md">
                {mode === 'kids'
                  ? "I'm Kai, Sathian's helper! Want to explore some stories or learn something cool?"
                  : "You're interacting with Sathian's second brain. This site isn't SEO-optimized — if you're here, you've likely met Sathian or someone who knows him."
                }
              </p>
            </div>

            <QuickPrompts
              prompts={quickPrompts}
              onSelect={sendMessage}
              mode={mode}
            />
          </div>
        ) : (
          <>
            {messages.map((msg, i) => (
              <ChatMessage key={i} message={msg} mode={mode} />
            ))}
            {isLoading && (
              <div className="flex items-center space-x-2 text-gray-400">
                <div className="typing-dot w-2 h-2 bg-primary rounded-full" />
                <div className="typing-dot w-2 h-2 bg-primary rounded-full" />
                <div className="typing-dot w-2 h-2 bg-primary rounded-full" />
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-800">
        {messages.length > 0 && (
          <div className="mb-3">
            <QuickPrompts
              prompts={quickPrompts.slice(0, 3)}
              onSelect={sendMessage}
              mode={mode}
              compact
            />
          </div>
        )}
        <ChatInput onSend={sendMessage} isLoading={isLoading} mode={mode} />
      </div>
    </main>
  )
}
