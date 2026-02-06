/**
 * Embedding Provider Abstraction
 * Supports: OpenAI, Gemini (Google AI)
 * Default: Gemini (cheaper, uses GCP credits)
 */

export type EmbeddingProvider = 'openai' | 'gemini'

export interface EmbeddingConfig {
  provider: EmbeddingProvider
  model?: string
  apiKey?: string
}

export interface PageEmbedding {
  url: string
  title: string
  embedding: number[]
}

// Default config - uses Gemini
const defaultConfig: EmbeddingConfig = {
  provider: (process.env.EMBEDDING_PROVIDER as EmbeddingProvider) || 'gemini',
}

/**
 * Generate embedding using OpenAI
 */
async function generateOpenAIEmbedding(text: string): Promise<number[]> {
  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'text-embedding-3-small',
      input: text.slice(0, 8000),
    }),
  })

  if (!response.ok) {
    throw new Error(`OpenAI API error: ${response.status}`)
  }

  const data = await response.json()
  return data.data[0].embedding
}

/**
 * Generate embedding using Gemini (Google AI)
 */
async function generateGeminiEmbedding(text: string): Promise<number[]> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not set')
  }

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'models/text-embedding-004',
        content: {
          parts: [{ text: text.slice(0, 8000) }]
        },
        taskType: 'SEMANTIC_SIMILARITY',
      }),
    }
  )

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Gemini API error: ${response.status} - ${error}`)
  }

  const data = await response.json()
  return data.embedding.values
}

/**
 * Generate embedding using configured provider
 */
export async function generateEmbedding(
  text: string,
  config: EmbeddingConfig = defaultConfig
): Promise<number[]> {
  switch (config.provider) {
    case 'openai':
      return generateOpenAIEmbedding(text)
    case 'gemini':
      return generateGeminiEmbedding(text)
    default:
      throw new Error(`Unknown embedding provider: ${config.provider}`)
  }
}

/**
 * Generate embeddings for multiple pages
 */
export async function generateEmbeddings(
  pages: { url: string; title: string; content: string }[],
  config: EmbeddingConfig = defaultConfig
): Promise<PageEmbedding[]> {
  const embeddings: PageEmbedding[] = []
  
  console.log(`Generating embeddings using ${config.provider}...`)

  for (const page of pages) {
    try {
      // Combine title and content for better semantic representation
      const text = `${page.title}\n\n${page.content}`
      const embedding = await generateEmbedding(text, config)

      embeddings.push({
        url: page.url,
        title: page.title,
        embedding,
      })
      
      // Small delay to avoid rate limits
      await new Promise(r => setTimeout(r, 100))
    } catch (error) {
      console.error(`Failed to embed ${page.url}:`, error)
    }
  }

  return embeddings
}

/**
 * Cosine similarity between two vectors
 */
export function cosineSimilarity(a: number[], b: number[]): number {
  // Handle dimension mismatch (OpenAI: 1536, Gemini: 768)
  if (a.length !== b.length) {
    console.warn(`Dimension mismatch: ${a.length} vs ${b.length}`)
    return 0
  }

  let dotProduct = 0
  let normA = 0
  let normB = 0

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }

  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
}

/**
 * Find similar pages based on embedding similarity
 */
export function findSimilarPages(
  embeddings: PageEmbedding[],
  minSimilarity = 0.7
): { source: string; target: string; score: number }[] {
  const similarities: { source: string; target: string; score: number }[] = []

  for (let i = 0; i < embeddings.length; i++) {
    for (let j = i + 1; j < embeddings.length; j++) {
      const score = cosineSimilarity(
        embeddings[i].embedding,
        embeddings[j].embedding
      )

      if (score >= minSimilarity) {
        similarities.push({
          source: embeddings[i].url,
          target: embeddings[j].url,
          score: Math.round(score * 100) / 100,
        })
      }
    }
  }

  return similarities.sort((a, b) => b.score - a.score)
}

/**
 * Get info about current embedding provider
 */
export function getProviderInfo(config: EmbeddingConfig = defaultConfig): {
  provider: string
  model: string
  dimensions: number
  costPer1kTokens: string
} {
  switch (config.provider) {
    case 'openai':
      return {
        provider: 'OpenAI',
        model: 'text-embedding-3-small',
        dimensions: 1536,
        costPer1kTokens: '$0.00002',
      }
    case 'gemini':
      return {
        provider: 'Google Gemini',
        model: 'text-embedding-004',
        dimensions: 768,
        costPer1kTokens: '$0.000025 (free tier available)',
      }
    default:
      return {
        provider: 'Unknown',
        model: 'unknown',
        dimensions: 0,
        costPer1kTokens: 'unknown',
      }
  }
}
