'use client'

import { useState } from 'react'

const tiers = [
  {
    name: 'Starter',
    price: 19,
    pages: 100,
    features: ['Up to 100 pages', 'AI Semantic Linking', 'CSV Export', 'Email Support'],
    stripePriceId: 'price_starter', // TODO: Replace with real Stripe Price ID
    popular: false,
  },
  {
    name: 'Growth',
    price: 49,
    pages: 500,
    features: ['Up to 500 pages', 'AI Semantic Linking', 'CSV Export', 'Priority Support', 'Weekly Re-scans'],
    stripePriceId: 'price_growth', // TODO: Replace with real Stripe Price ID
    popular: true,
  },
  {
    name: 'Pro',
    price: 99,
    pages: 2000,
    features: ['Up to 2000 pages', 'AI Semantic Linking', 'CSV Export', 'Dedicated Support', 'Daily Re-scans', 'API Access'],
    stripePriceId: 'price_pro', // TODO: Replace with real Stripe Price ID
    popular: false,
  },
]

export default function PricingPage() {
  const [loading, setLoading] = useState<string | null>(null)

  const handleSubscribe = async (priceId: string, tierName: string) => {
    setLoading(tierName)
    
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      })

      const { url, error } = await response.json()

      if (error) {
        throw new Error(error)
      }

      // Redirect to Stripe Checkout
      if (url) {
        window.location.href = url
      }
    } catch (err) {
      console.error('Checkout error:', err)
      alert('Failed to start checkout. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-white mb-4">
            Straightforward Pricing
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Choose the plan that fits your site. No contracts, cancel anytime.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border ${
                tier.popular ? 'border-blue-500' : 'border-slate-700'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-blue-600 text-white text-xs font-medium px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">{tier.name}</h2>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold text-white">${tier.price}</span>
                  <span className="text-slate-400">/month</span>
                </div>
                <p className="text-slate-400 mt-2">Up to {tier.pages} pages</p>
              </div>

              <ul className="space-y-3 mb-8">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2 text-slate-300">
                    <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(tier.stripePriceId, tier.name)}
                disabled={loading !== null}
                className={`w-full py-3 rounded-lg font-medium transition-colors ${
                  tier.popular
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-slate-700 hover:bg-slate-600 text-white'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading === tier.name ? 'Loading...' : 'Get Started'}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ Link */}
        <div className="text-center mt-12">
          <p className="text-slate-400">
            Questions? <a href="/#faq" className="text-blue-400 hover:underline">Check our FAQ</a>
          </p>
        </div>
      </div>
    </main>
  )
}
