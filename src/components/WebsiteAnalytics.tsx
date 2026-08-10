'use client'

import { Analytics } from '@vercel/analytics/react'
import Script from 'next/script'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

export function WebsiteAnalytics() {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID
  const pathname = usePathname()

  useEffect(() => {
    if (!measurementId || typeof window.gtag !== 'function') return

    window.gtag('event', 'page_view', {
      page_location: window.location.href,
      page_path: pathname,
      page_title: document.title,
    })
  }, [measurementId, pathname])

  return (
    <>
      {measurementId ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', ${JSON.stringify(measurementId)}, { anonymize_ip: true, send_page_view: false });`}
          </Script>
        </>
      ) : null}
      <Analytics />
    </>
  )
}
