'use client';

import { useEffect } from 'react';

export default function ThemeOverride() {
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    const originalHtmlBg = html.style.background;
    const originalBodyBg = body.style.background;
    const originalBodyColor = body.style.color;

    html.style.background = '#FFFDF7';
    body.style.background = '#FFFDF7';
    body.style.color = '#5D4E37';

    return () => {
      html.style.background = originalHtmlBg;
      body.style.background = originalBodyBg;
      body.style.color = originalBodyColor;
    };
  }, []);

  return null;
}
