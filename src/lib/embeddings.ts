import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface PageEmbedding {
  url: string
  title: string
  embedding: number[]
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: text.slice(0, 8000), // Limit input size
  })
  
  return response.data[0].embedding
}

export async function generateEmbeddings(
  pages: { url: string; title: string; content: string }[]
): Promise<PageEmbedding[]> {
  const embeddings: PageEmbedding[] = []
  
  for (const page of pages) {
    try {
      // Combine title and content for better semantic representation
      const text = `${page.title}\n\n${page.content}`
      const embedding = await generateEmbedding(text)
      
      embeddings.push({
        url: page.url,
        title: page.title,
        embedding,
      })
    } catch (error) {
      console.error(`Failed to embed ${page.url}:`, error)
    }
  }
  
  return embeddings
}

export function cosineSimilarity(a: number[], b: number[]): number {
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
