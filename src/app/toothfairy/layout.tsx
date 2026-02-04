'use client';

import { useEffect } from 'react';

export default function ToothFairyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Override html and body background when this layout mounts
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    // Store originals
    const originalHtmlBg = html.style.background;
    const originalBodyBg = body.style.background;
    const originalBodyColor = body.style.color;

    // Apply light backgrounds
    html.style.background = '#FFFDF7';
    body.style.background = '#FFFDF7';
    body.style.color = '#5D4E37';

    return () => {
      html.style.background = originalHtmlBg;
      body.style.background = originalBodyBg;
      body.style.color = originalBodyColor;
    };
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#FFFDF7' }}>
      {children}
    </div>
  );
}
