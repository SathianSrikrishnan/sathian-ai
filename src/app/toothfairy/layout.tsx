'use client';

import { useEffect } from 'react';

export default function ToothFairyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Override body background when this layout mounts
  useEffect(() => {
    const originalBg = document.body.style.background;
    const originalColor = document.body.style.color;

    document.body.style.background = '#FFFDF7';
    document.body.style.color = '#5D4E37';

    return () => {
      document.body.style.background = originalBg;
      document.body.style.color = originalColor;
    };
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#FFFDF7' }}>
      {children}
    </div>
  );
}
