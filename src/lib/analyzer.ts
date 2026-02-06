import { PageData } from './crawler'
import { PageEmbedding, findSimilarPages } from './embeddings'

export interface LinkSuggestion {
  source: string
  target: string
  anchor: string
  score: number
  reason: string
}

export interface OrphanPage {
  url: string
  title: string
  inboundLinkCount: number
}

export interface AnalysisResult {
  suggestions: LinkSuggestion[]
  orphans: OrphanPage[]
  stats: {
    totalPages: number
    totalSuggestions: number
    totalOrphans: number
  }
}

export function analyzeLinks(
  pages: PageData[],
  embeddings: PageEmbedding[]
): AnalysisResult {
  // Build a map of existing internal links
  const existingLinks = new Map<string, Set<string>>()
  const inboundCounts = new Map<string, number>()
  
  // Initialize
  for (const page of pages) {
    existingLinks.set(page.url, new Set())
    inboundCounts.set(page.url, 0)
  }
  
  // Count existing links
  for (const page of pages) {
    for (const link of page.internalLinks) {
      existingLinks.get(page.url)?.add(link.url)
      
      const currentCount = inboundCounts.get(link.url) || 0
      inboundCounts.set(link.url, currentCount + 1)
    }
  }
  
  // Find similar pages that aren't linked
  const similarities = findSimilarPages(embeddings, 0.6)
  
  const suggestions: LinkSuggestion[] = []
  
  for (const sim of similarities) {
    // Check if link already exists (in either direction)
    const sourceLinks = existingLinks.get(sim.source)
    const targetLinks = existingLinks.get(sim.target)
    
    if (!sourceLinks?.has(sim.target)) {
      // Find the target page to get a good anchor
      const targetPage = pages.find(p => p.url === sim.target)
      const anchor = targetPage?.title.split(' ').slice(0, 5).join(' ') || 'related content'
      
      suggestions.push({
        source: sim.source,
        target: sim.target,
        anchor,
        score: sim.score,
        reason: 'Semantically similar content, no existing link'
      })
    }
    
    // Also suggest the reverse link if missing
    if (!targetLinks?.has(sim.source)) {
      const sourcePage = pages.find(p => p.url === sim.source)
      const anchor = sourcePage?.title.split(' ').slice(0, 5).join(' ') || 'related content'
      
      suggestions.push({
        source: sim.target,
        target: sim.source,
        anchor,
        score: sim.score,
        reason: 'Semantically similar content, no existing link'
      })
    }
  }
  
  // Find orphan pages (less than 2 inbound links)
  const orphans: OrphanPage[] = []
  
  for (const page of pages) {
    const count = inboundCounts.get(page.url) || 0
    if (count < 2) {
      orphans.push({
        url: page.url,
        title: page.title,
        inboundLinkCount: count
      })
    }
  }
  
  // Sort suggestions by score, orphans by link count
  suggestions.sort((a, b) => b.score - a.score)
  orphans.sort((a, b) => a.inboundLinkCount - b.inboundLinkCount)
  
  return {
    suggestions: suggestions.slice(0, 100), // Top 100
    orphans,
    stats: {
      totalPages: pages.length,
      totalSuggestions: suggestions.length,
      totalOrphans: orphans.length
    }
  }
}

export function generateCSV(result: AnalysisResult): string {
  const lines = ['Source URL,Target URL,Suggested Anchor,Similarity Score,Reason']
  
  for (const s of result.suggestions) {
    lines.push(`"${s.source}","${s.target}","${s.anchor}",${s.score},"${s.reason}"`)
  }
  
  lines.push('')
  lines.push('Orphan Pages')
  lines.push('URL,Title,Inbound Links')
  
  for (const o of result.orphans) {
    lines.push(`"${o.url}","${o.title}",${o.inboundLinkCount}`)
  }
  
  return lines.join('\n')
}
