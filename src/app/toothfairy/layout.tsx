import type { Metadata, Viewport } from 'next'
import { Alegreya, Alegreya_Sans } from 'next/font/google'

const alegreya = Alegreya({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
  weight: ['400', '500', '700', '800'],
  style: ['normal', 'italic'],
})

const alegreyaSans = Alegreya_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
  weight: ['300', '400', '500', '700'],
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
    <div className={`${alegreya.variable} ${alegreyaSans.variable}`}>
      {children}
    </div>
  )
}
