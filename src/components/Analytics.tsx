'use client'

import Script from 'next/script'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

// Declare Plausible on window
declare global {
  interface Window {
    plausible?: (event: string, options?: { props?: Record<string, string | number> }) => void
  }
}

export default function Analytics() {
  const pathname = usePathname()

  // Track page views on route change
  useEffect(() => {
    if (typeof window !== 'undefined' && window.plausible) {
      window.plausible('pageview')
    }
  }, [pathname])

  // Only load in production
  if (process.env.NODE_ENV !== 'production') {
    return null
  }

  return (
    <>
      {/* Plausible Analytics - Privacy-friendly, no cookies */}
      <Script
        defer
        data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN}
        src="https://plausible.io/js/script.js"
        strategy="afterInteractive"
      />

      {/* Sentry Error Tracking */}
      <Script
        src="https://browser.sentry-cdn.com/7.91.0/bundle.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_SENTRY_DSN) {
            // @ts-expect-error - Sentry global
            window.Sentry?.init({
              dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
              tracesSampleRate: 0.1,
            })
          }
        }}
      />
    </>
  )
}
