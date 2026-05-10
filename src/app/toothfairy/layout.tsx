import type { Metadata, Viewport } from 'next'
import { ThemeProvider } from '@/components/toothfairy/nav/theme-context'
import { ThemeTransition } from '@/components/toothfairy/nav/theme-transition'
import { TFNHeader } from '@/components/toothfairy/nav/tfn-header'
import { TFNFooter } from '@/components/toothfairy/nav/tfn-footer'

// TFN routes use the local fallback font variables from globals.css.
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#F0C456',
}

export const metadata: Metadata = {
  title: 'Tooth Fairy Network',
  description: 'Turn a child\'s lost tooth into a Toothlight memory, bedtime story, and parent-controlled Smile Fund preview.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Tooth Fairy Network',
  },
  openGraph: {
    title: 'Tooth Fairy Network',
    description: 'Turn a child\'s lost tooth into a Toothlight memory, bedtime story, and parent-controlled Smile Fund preview.',
  },
}

export default function ToothFairyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div>
      <ThemeProvider defaultMode="parent">
        <ThemeTransition>
          <TFNHeader />
          {children}
          <TFNFooter />
        </ThemeTransition>
      </ThemeProvider>
    </div>
  )
}
