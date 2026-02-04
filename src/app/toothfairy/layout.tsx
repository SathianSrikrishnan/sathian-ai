'use client';

import { useEffect } from 'react';

export default function ToothFairyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Override CSS variables when this layout mounts
  useEffect(() => {
    const root = document.documentElement;

    // Store originals
    const originalBg = root.style.getPropertyValue('--background');
    const originalFg = root.style.getPropertyValue('--foreground');

    // Override CSS variables
    root.style.setProperty('--background', '#FFFDF7');
    root.style.setProperty('--foreground', '#5D4E37');

    return () => {
      if (originalBg) {
        root.style.setProperty('--background', originalBg);
      } else {
        root.style.removeProperty('--background');
      }
      if (originalFg) {
        root.style.setProperty('--foreground', originalFg);
      } else {
        root.style.removeProperty('--foreground');
      }
    };
  }, []);

  return (
    <div style={{ minHeight: '100vh' }}>
      {children}
    </div>
  );
}
