import * as cheerio from 'cheerio'

export interface PageData {
  url: string
  title: string
  headings: string[]
  content: string
  wordCount: number
  internalLinks: { url: string; anchor: string }[]
}

export async function crawlSitemap(sitemapUrl: string): Promise<string[]> {
  const response = await fetch(sitemapUrl)
  const xml = await response.text()
  const $ = cheerio.load(xml, { xmlMode: true })
  
  const urls: string[] = []
  $('loc').each((_, el) => {
    urls.push($(el).text())
  })
  
  return urls
}

export async function crawlPage(url: string, baseUrl: string): Promise<PageData> {
  const response = await fetch(url, {
    headers: { 'User-Agent': 'LinkWeave/1.0 (SEO Analysis Bot)' }
  })
  const html = await response.text()
  const $ = cheerio.load(html)
  
  // Remove scripts, styles, nav, footer
  $('script, style, nav, footer, header, aside').remove()
  
  const title = $('title').text().trim() || $('h1').first().text().trim() || url
  
  const headings: string[] = []
  $('h1, h2, h3').each((_, el) => {
    headings.push($(el).text().trim())
  })
  
  // Get main content
  const content = $('main, article, .content, .post, body')
    .first()
    .text()
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 10000) // Limit content size
  
  const wordCount = content.split(/\s+/).length
  
  // Find internal links
  const internalLinks: { url: string; anchor: string }[] = []
  const baseDomain = new URL(baseUrl).hostname
  
  $('a[href]').each((_, el) => {
    const href = $(el).attr('href') || ''
    const anchor = $(el).text().trim()
    
    try {
      const linkUrl = new URL(href, url)
      if (linkUrl.hostname === baseDomain && anchor) {
        internalLinks.push({
          url: linkUrl.pathname,
          anchor: anchor.slice(0, 100)
        })
      }
    } catch {
      // Invalid URL, skip
    }
  })
  
  return { url, title, headings, content, wordCount, internalLinks }
}

export async function crawlSite(sitemapUrl: string, maxPages = 100): Promise<PageData[]> {
  const urls = await crawlSitemap(sitemapUrl)
  const baseUrl = new URL(sitemapUrl).origin
  
  const pages: PageData[] = []
  const urlsToProcess = urls.slice(0, maxPages)
  
  // Crawl with rate limiting
  for (const url of urlsToProcess) {
    try {
      const pageData = await crawlPage(url, baseUrl)
      pages.push(pageData)
      // Small delay to be polite
      await new Promise(r => setTimeout(r, 200))
    } catch (error) {
      console.error(`Failed to crawl ${url}:`, error)
    }
  }
  
  return pages
}
