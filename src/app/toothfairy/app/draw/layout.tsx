import type { Metadata, Viewport } from 'next';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'Draw | Tooth Fairy Network',
  description: 'A full-screen drawing canvas for little hands.',
};

export default function DrawLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
