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
        "Read: C.R.E.A.M. 2.0",
        "Collaboration opportunities",
      ]

  return (
    <main className={`flex flex-col h-screen max-w-4xl mx-auto transition-colors duration-300 ${mode === 'kids' ? 'theme-kids' : ''}`}>
      {/* Header */}
      <header className={`flex items-center justify-between px-6 py-4 border-b ${mode === 'kids' ? 'border-orange-200 bg-gradient-to-r from-yellow-50 to-orange-50' : 'border-gray-800'}`}>
        <div>
          <h1 className={`text-xl tracking-tight ${mode === 'kids' ? 'text-orange-600 font-semibold' : 'text-[#F0F6FC] font-mono font-medium'}`}>
            {mode === 'kids' ? "Pixel's Corner" : 'sathian.ai'}
          </h1>
          <p className={`text-xs mt-0.5 ${mode === 'kids' ? 'text-orange-400' : 'text-gray-500 font-mono'}`}>
            {mode === 'kids' ? 'Adventures await!' : 'second brain interface'}
          </p>
        </div>
        <ModeToggle mode={mode} onModeChange={setMode} />
      </header>

      {/* Chat Area */}
      <div className={`flex-1 overflow-y-auto p-4 space-y-4 ${mode === 'kids' ? 'bg-gradient-to-b from-yellow-50 to-orange-50' : ''}`}>
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-8">
            <div className="space-y-3">
              {mode === 'kids' && (
                <div className="text-6xl mb-4">🐉</div>
              )}
              <h2 className={`text-2xl ${mode === 'kids' ? 'text-orange-600 font-semibold' : 'text-[#F0F6FC] font-light tracking-tight'}`}>
                {mode === 'kids' ? "Hi there, young explorer!" : 'Welcome'}
              </h2>
              <p className={`max-w-md text-sm leading-relaxed ${mode === 'kids' ? 'text-orange-500' : 'text-gray-500'}`}>
                {mode === 'kids'
                  ? "I'm Pixel the Digital Dragon! Want to explore some stories, learn about treasure (that's Bitcoin!), or go on an adventure?"
                  : "You're interacting with Sathian's second brain. This site isn't SEO-optimized — if you're here, you've likely met Sathian or someone who knows him."
                }
              </p>
              {mode === 'standard' && (
                <p className="text-xs text-gray-600 max-w-sm mt-2">
                  Entrepreneur. Technologist. 20+ years of building.
                </p>
              )}
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
      <div className={`p-4 border-t ${mode === 'kids' ? 'border-orange-200 bg-gradient-to-r from-yellow-50 to-orange-50' : 'border-gray-800'}`}>
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
        {mode === 'standard' && (
          <p className="text-xs text-gray-600 mt-2 text-center font-mono">
            Human or AI agent — both welcome. <span className="text-gray-700">Data stays local. Model forgets.</span>
          </p>
        )}
      </div>
    </main>
  )
}
