import type { Metadata, Viewport } from 'next'
import { Nunito, Plus_Jakarta_Sans, Quicksand, Playfair_Display, Lora } from 'next/font/google'

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
    <div className={`${nunito.variable} ${plusJakarta.variable} ${quicksand.variable} ${playfair.variable} ${lora.variable}`}>
      {children}
    </div>
  )
}
