import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { suggestions, orphans, format = 'csv' } = await request.json()

    if (format === 'csv') {
      const lines = [
        'Source URL,Target URL,Suggested Anchor,Similarity Score,Reason',
      ]

      for (const s of suggestions || []) {
        lines.push(
          `"${s.source}","${s.target}","${s.anchor}",${s.score},"${s.reason || 'Semantic similarity'}"`
        )
      }

      lines.push('')
      lines.push('ORPHAN PAGES')
      lines.push('URL')

      for (const url of orphans || []) {
        lines.push(`"${url}"`)
      }

      const csv = lines.join('\n')

      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename="linkweave-report.csv"',
        },
      })
    }

    // JSON format (default fallback)
    return NextResponse.json({ suggestions, orphans })

  } catch (error) {
    console.error('Export failed:', error)
    return NextResponse.json(
      { error: 'Export failed', details: String(error) },
      { status: 500 }
    )
  }
}
