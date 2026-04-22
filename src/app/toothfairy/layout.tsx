import type { Metadata, Viewport } from 'next'
import {
  Nunito,
  Plus_Jakarta_Sans,
  Quicksand,
  Playfair_Display,
  Lora,
  Alegreya,
  Alegreya_Sans,
} from 'next/font/google'
import { ThemeProvider } from '@/components/toothfairy/nav/theme-context'
import { ThemeTransition } from '@/components/toothfairy/nav/theme-transition'
import { TFNHeader } from '@/components/toothfairy/nav/tfn-header'
import { TFNFooter } from '@/components/toothfairy/nav/tfn-footer'

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  display: 'swap',
})

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
})

const quicksand = Quicksand({
  subsets: ['latin'],
  variable: '--font-quicksand',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-landing-serif',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
})

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-landing-body',
  display: 'swap',
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
})

// Alegreya pair powers the unified nav + per-page TFN copy.
// Loaded at the /toothfairy/* root so every route — not just /app —
// can reference var(--font-display) and var(--font-body).
const alegreya = Alegreya({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '700', '800'],
  style: ['normal', 'italic'],
  display: 'swap',
})

const alegreyaSans = Alegreya_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['300', '400', '500', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#F0C456',
}

export const metadata: Metadata = {
  title: 'Tooth Fairy Network',
  description: 'Turn your child\'s lost tooth into permanent savings and a digital keepsake.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Tooth Fairy Network',
  },
  openGraph: {
    title: 'Tooth Fairy Network',
    description: 'Turn your child\'s lost tooth into permanent savings and a digital keepsake. A project by sathian.ai.',
  },
}

export default function ToothFairyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className={`${nunito.variable} ${plusJakarta.variable} ${quicksand.variable} ${playfair.variable} ${lora.variable} ${alegreya.variable} ${alegreyaSans.variable}`}
    >
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
