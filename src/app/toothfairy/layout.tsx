import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tooth Fairy Network',
  description: 'Turn your child\'s lost tooth into permanent savings and a digital keepsake.',
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
  return <>{children}</>
}
