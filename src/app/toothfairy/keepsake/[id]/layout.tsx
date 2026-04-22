import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Keepsake | Tooth Fairy Network',
  description: 'A permanent tooth fairy keepsake for a family to cherish.',
};

export default function KeepsakeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
