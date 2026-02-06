import type { Metadata } from 'next'

// SEO Metadata for LinkPilot
export const metadata: Metadata = {
  title: 'LinkPilot: AI Internal Linking & Orphan Page Finder',
  description: 'Boost SEO with LinkPilot, the AI-powered internal linking tool for small publishers. Get smart internal link suggestions & find orphan pages easily.',
  
  // Open Graph
  openGraph: {
    title: 'LinkPilot: AI Internal Linking & Orphan Page Finder',
    description: 'Boost SEO with LinkPilot, the AI-powered internal linking tool for small publishers. Get smart internal link suggestions & find orphan pages easily.',
    url: 'https://linkpilot.io', // TODO: Update with actual domain
    siteName: 'LinkPilot',
    images: [
      {
        url: '/og-image.png', // TODO: Create OG image
        width: 1200,
        height: 630,
        alt: 'LinkPilot: AI-powered internal linking tool dashboard showing link suggestions',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  
  // Twitter Card
  twitter: {
    card: 'summary_large_image',
    title: 'LinkPilot: AI Internal Linking & Orphan Page Finder',
    description: 'Boost SEO with LinkPilot, the AI-powered internal linking tool for small publishers. Get smart internal link suggestions & find orphan pages easily.',
    images: ['/twitter-image.png'], // TODO: Create Twitter image
  },
  
  // Other meta
  keywords: [
    'internal linking tool',
    'internal link suggestions',
    'orphan page finder',
    'SEO internal links',
    'content refresh planner',
    'how to improve internal linking for SEO',
    'best internal linking strategy for publishers',
  ],
  
  robots: {
    index: true,
    follow: true,
  },
}

// JSON-LD Structured Data
export const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'LinkPilot',
  applicationCategory: 'SEO Tool',
  operatingSystem: 'Web',
  description: 'AI-powered internal linking and orphan page finder for small publishers',
  url: 'https://linkpilot.io', // TODO: Update
  offers: {
    '@type': 'AggregateOffer',
    lowPrice: '19',
    highPrice: '99',
    priceCurrency: 'USD',
    offerCount: 3,
  },
  featureList: [
    'AI Semantic Link Matching',
    'Orphan Page Detection',
    'Platform Agnostic',
    'CSV Export',
    'Content Refresh Suggestions',
  ],
}

/*
Long-tail keywords to target:
1. how to improve internal linking for SEO
2. best internal linking strategy for publishers
3. automate internal links wordpress
4. identify orphan pages in website
5. content hub internal linking best practices

Blog post ideas:
1. Master Your Site's SEO: The Ultimate Guide to Internal Linking
2. Stop Losing Traffic: How to Find & Fix Orphan Pages with AI
3. 5 AI-Powered Strategies to Skyrocket Your Internal Link Building
4. Beyond Keywords: Why a Smart Internal Linking Tool is Your SEO Secret Weapon
5. Content Refresh Made Easy: Using Internal Links for Evergreen SEO Success
*/
