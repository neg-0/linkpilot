'use client'

import { useState } from 'react'

export default function Home() {
  const [sitemapUrl, setSitemapUrl] = useState('')
  const [status, setStatus] = useState<'idle' | 'crawling' | 'analyzing' | 'done'>('idle')
  const [results, setResults] = useState<any>(null)

  const handleAnalyze = async () => {
    if (!sitemapUrl) return
    
    setStatus('crawling')
    
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sitemapUrl }),
      })
      
      const data = await response.json()
      setResults(data)
      setStatus('done')
    } catch (error) {
      console.error('Analysis failed:', error)
      setStatus('idle')
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="container mx-auto px-4 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">
            🔗 LinkPilot
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Upload your sitemap → Get a prioritized internal link plan + content refresh checklist you can execute in a weekend.
          </p>
        </div>

        {/* Input */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-8 border border-slate-700">
            <label className="block text-slate-300 mb-2 font-medium">
              Your Sitemap URL
            </label>
            <div className="flex gap-4">
              <input
                type="url"
                value={sitemapUrl}
                onChange={(e) => setSitemapUrl(e.target.value)}
                placeholder="https://yoursite.com/sitemap.xml"
                className="flex-1 px-4 py-3 bg-slate-900 border border-slate-600 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleAnalyze}
                disabled={status === 'crawling' || status === 'analyzing'}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white font-medium rounded-lg transition-colors"
              >
                {status === 'crawling' ? 'Crawling...' : 
                 status === 'analyzing' ? 'Analyzing...' : 
                 'Analyze Site'}
              </button>
            </div>
          </div>
        </div>

        {/* Status */}
        {status !== 'idle' && status !== 'done' && (
          <div className="max-w-2xl mx-auto mb-12 text-center">
            <div className="inline-flex items-center gap-3 bg-slate-800/50 px-6 py-3 rounded-full">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-slate-300">
                {status === 'crawling' ? 'Crawling your site...' : 'Analyzing content...'}
              </span>
            </div>
          </div>
        )}

        {/* Results */}
        {results && (
          <div className="max-w-4xl mx-auto grid gap-6">
            {/* Link Suggestions */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                🔗 Link Suggestions
                <span className="text-sm font-normal text-slate-400">
                  ({results.suggestions?.length || 0} opportunities)
                </span>
              </h2>
              <div className="space-y-3">
                {results.suggestions?.slice(0, 10).map((s: any, i: number) => (
                  <div key={i} className="bg-slate-900/50 rounded-lg p-4 text-sm">
                    <div className="text-slate-300">
                      <span className="text-blue-400">{s.source}</span>
                      <span className="text-slate-500 mx-2">→</span>
                      <span className="text-green-400">{s.target}</span>
                    </div>
                    <div className="text-slate-500 mt-1">
                      Anchor: "{s.anchor}" • Score: {s.score}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Orphan Pages */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                🏝️ Orphan Pages
                <span className="text-sm font-normal text-slate-400">
                  ({results.orphans?.length || 0} pages with no internal links)
                </span>
              </h2>
              <div className="space-y-2">
                {results.orphans?.slice(0, 10).map((url: string, i: number) => (
                  <div key={i} className="text-red-400 text-sm bg-slate-900/50 rounded px-3 py-2">
                    {url}
                  </div>
                ))}
              </div>
            </div>

            {/* Export */}
            <div className="flex gap-4 justify-center">
              <button className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg">
                📥 Export CSV
              </button>
              <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg">
                📋 Copy to Notion
              </button>
            </div>
          </div>
        )}

        {/* Features */}
        {status === 'idle' && !results && (
          <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-6 mt-16">
            <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50">
              <div className="text-3xl mb-3">🕷️</div>
              <h3 className="text-lg font-semibold text-white mb-2">Smart Crawling</h3>
              <p className="text-slate-400 text-sm">Fetch and parse your entire site from sitemap.xml</p>
            </div>
            <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50">
              <div className="text-3xl mb-3">🧠</div>
              <h3 className="text-lg font-semibold text-white mb-2">AI Analysis</h3>
              <p className="text-slate-400 text-sm">Find related content using semantic embeddings</p>
            </div>
            <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50">
              <div className="text-3xl mb-3">📤</div>
              <h3 className="text-lg font-semibold text-white mb-2">Easy Export</h3>
              <p className="text-slate-400 text-sm">CSV, Google Sheets, Notion-ready markdown</p>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
