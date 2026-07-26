'use client'

import type { ReactNode } from 'react'

export function OpenAgentButton({
  children,
  prompt,
  className = '',
}: {
  children: ReactNode
  prompt?: string
  className?: string
}) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => {
        window.dispatchEvent(
          new CustomEvent('open-chat', { detail: prompt ? { message: prompt } : undefined }),
        )
      }}
    >
      {children}
    </button>
  )
}
