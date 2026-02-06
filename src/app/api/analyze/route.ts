import { NextRequest, NextResponse } from 'next/server'
import { crawlSite } from '../../../lib/crawler'
import { generateEmbeddings, getProviderInfo } from '../../../lib/embeddings'
import { analyzeLinks } from '../../../lib/analyzer'

export async function POST(request: NextRequest) {
  try {
    const { sitemapUrl, maxPages = 50 } = await request.json()

    if (!sitemapUrl) {
      return NextResponse.json(
        { error: 'sitemapUrl is required' },
        { status: 400 }
      )
    }

    // Validate URL
    try {
      new URL(sitemapUrl)
    } catch {
      return NextResponse.json(
        { error: 'Invalid URL format' },
        { status: 400 }
      )
    }

    const providerInfo = getProviderInfo()
    console.log(`Starting analysis for: ${sitemapUrl}`)
    console.log(`Using embedding provider: ${providerInfo.provider} (${providerInfo.model})`)

    // Step 1: Crawl the site
    console.log('Crawling site...')
    const pages = await crawlSite(sitemapUrl, Math.min(maxPages, 100))

    if (pages.length === 0) {
      return NextResponse.json(
        { error: 'No pages found in sitemap' },
        { status: 400 }
      )
    }

    console.log(`Crawled ${pages.length} pages`)

    // Step 2: Generate embeddings
    console.log('Generating embeddings...')
    const embeddings = await generateEmbeddings(
      pages.map(p => ({ url: p.url, title: p.title, content: p.content }))
    )

    console.log(`Generated ${embeddings.length} embeddings`)

    // Step 3: Analyze and generate suggestions
    console.log('Analyzing links...')
    const result = analyzeLinks(pages, embeddings)

    console.log(`Found ${result.suggestions.length} suggestions, ${result.orphans.length} orphans`)

    return NextResponse.json({
      success: true,
      provider: providerInfo,
      suggestions: result.suggestions,
      orphans: result.orphans.map(o => o.url),
      stats: result.stats,
    })

  } catch (error) {
    console.error('Analysis failed:', error)
    return NextResponse.json(
      { error: 'Analysis failed', details: String(error) },
      { status: 500 }
    )
  }
}
