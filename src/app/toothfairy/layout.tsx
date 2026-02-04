import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "The Tooth Fairy's Secret Project",
  description: 'Track your lost teeth and discover animal teeth secrets!',
}

export default function ToothFairyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className="min-h-screen"
      style={{
        background: '#FFFDF7',
        minHeight: '100vh',
        minWidth: '100vw',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'auto'
      }}
    >
      {children}
    </div>
  )
}
