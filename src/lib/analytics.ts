// Analytics utility for tracking events
// Uses Plausible Analytics (privacy-friendly)

type EventName = 
  | 'Site Analyzed'
  | 'CSV Exported'
  | 'Pricing Page Viewed'
  | 'Checkout Started'
  | 'Copy to Clipboard'

interface EventProps {
  [key: string]: string | number
}

export function trackEvent(event: EventName, props?: EventProps) {
  if (typeof window === 'undefined') return
  
  // Plausible
  if (window.plausible) {
    window.plausible(event, props ? { props } : undefined)
  }
  
  // Console log in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Analytics] ${event}`, props)
  }
}

// Convenience functions
export const analytics = {
  siteAnalyzed: (url: string, pageCount: number) => 
    trackEvent('Site Analyzed', { url, pageCount }),
  
  csvExported: (suggestionCount: number) => 
    trackEvent('CSV Exported', { suggestionCount }),
  
  pricingViewed: () => 
    trackEvent('Pricing Page Viewed'),
  
  checkoutStarted: (plan: string) => 
    trackEvent('Checkout Started', { plan }),
  
  copyToClipboard: (itemCount: number) => 
    trackEvent('Copy to Clipboard', { itemCount }),
}
