import ThemeOverride from '@/components/toothfairy/ThemeOverride';

export default function ToothFairyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <ThemeOverride />
      {children}
    </>
  );
}
