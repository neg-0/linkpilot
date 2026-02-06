'use client'

import { useState } from 'react'

interface Suggestion {
  source: string
  target: string
  anchor: string
  score: number
  reason?: string
}

interface ProviderInfo {
  provider: string
  model: string
  dimensions: number
  costPer1kTokens: string
}

interface AnalysisResult {
  success: boolean
  provider: ProviderInfo
  suggestions: Suggestion[]
  orphans: string[]
  stats: {
    totalPages: number
    totalSuggestions: number
    totalOrphans: number
  }
}

export default function HomePage() {
  const [sitemapUrl, setSitemapUrl] = useState('')
  const [status, setStatus] = useState<'idle' | 'crawling' | 'analyzing' | 'done' | 'error'>('idle')
  const [results, setResults] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleAnalyze = async () => {
    if (!sitemapUrl) return

    setStatus('crawling')
    setError(null)

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sitemapUrl, maxPages: 50 }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Analysis failed')
      }

      setResults(data)
      setStatus('done')
    } catch (err) {
      console.error('Analysis failed:', err)
      setError(err instanceof Error ? err.message : 'Analysis failed')
      setStatus('error')
    }
  }

  const handleExportCSV = async () => {
    if (!results) return

    try {
      const response = await fetch('/api/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          suggestions: results.suggestions,
          orphans: results.orphans,
          format: 'csv',
        }),
      })

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'linkpilot-report.csv'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Export failed:', err)
    }
  }

  const copyToClipboard = () => {
    if (!results) return

    const text = results.suggestions
      .map(s => `${s.source} → ${s.target} (anchor: "${s.anchor}")`)
      .join('\n')

    navigator.clipboard.writeText(text)
    alert('Copied to clipboard!')
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

        {/* Error */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8">
            <div className="bg-red-900/50 border border-red-700 rounded-lg px-4 py-3 text-red-200">
              ⚠️ {error}
            </div>
          </div>
        )}

        {/* Status */}
        {(status === 'crawling' || status === 'analyzing') && (
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
            {/* Stats Bar */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-4 border border-slate-700 flex justify-between items-center">
              <div className="flex gap-6 text-sm">
                <span className="text-slate-400">
                  📄 <span className="text-white font-medium">{results.stats.totalPages}</span> pages
                </span>
                <span className="text-slate-400">
                  🔗 <span className="text-white font-medium">{results.stats.totalSuggestions}</span> suggestions
                </span>
                <span className="text-slate-400">
                  🏝️ <span className="text-white font-medium">{results.stats.totalOrphans}</span> orphans
                </span>
              </div>
              <div className="text-xs text-slate-500">
                Powered by {results.provider.provider}
              </div>
            </div>

            {/* Link Suggestions */}
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                🔗 Link Suggestions
                <span className="text-sm font-normal text-slate-400">
                  (Top {Math.min(results.suggestions.length, 20)})
                </span>
              </h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {results.suggestions.slice(0, 20).map((s, i) => (
                  <div key={i} className="bg-slate-900/50 rounded-lg p-4 text-sm">
                    <div className="text-slate-300">
                      <span className="text-blue-400 break-all">{s.source}</span>
                      <span className="text-slate-500 mx-2">→</span>
                      <span className="text-green-400 break-all">{s.target}</span>
                    </div>
                    <div className="text-slate-500 mt-1">
                      Anchor: &quot;<span className="text-amber-400">{s.anchor}</span>&quot; • Score: {s.score}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Orphan Pages */}
            {results.orphans.length > 0 && (
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-2xl p-6 border border-slate-700">
                <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                  🏝️ Orphan Pages
                  <span className="text-sm font-normal text-slate-400">
                    ({results.orphans.length} pages need more internal links)
                  </span>
                </h2>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {results.orphans.slice(0, 20).map((url, i) => (
                    <div key={i} className="text-red-400 text-sm bg-slate-900/50 rounded px-3 py-2 break-all">
                      {url}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Export */}
            <div className="flex gap-4 justify-center">
              <button
                onClick={handleExportCSV}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
              >
                📥 Export CSV
              </button>
              <button
                onClick={copyToClipboard}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
              >
                📋 Copy to Clipboard
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
              <p className="text-slate-400 text-sm">Find related content using semantic embeddings (Gemini or OpenAI)</p>
            </div>
            <div className="bg-slate-800/30 rounded-xl p-6 border border-slate-700/50">
              <div className="text-3xl mb-3">📤</div>
              <h3 className="text-lg font-semibold text-white mb-2">Easy Export</h3>
              <p className="text-slate-400 text-sm">CSV export ready to execute in a weekend</p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-16 text-slate-500 text-sm">
          Made with 🚀 by <a href="https://github.com/neg-0" className="text-blue-400 hover:underline">neg-0</a>
        </div>
      </div>
    </main>
  )
}
