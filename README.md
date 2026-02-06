# LinkWeave 🔗✈️

> AI-powered internal linking and content refresh planner for small publishers

**Live:** Coming soon  
**Repo:** [github.com/neg-0/linkweave](https://github.com/neg-0/linkweave)

## What is LinkWeave?

Upload your sitemap → Get a prioritized internal link plan + content refresh checklist you can execute in a weekend.

**Built for:**
- Niche site operators (50-2000 pages)
- Small agencies managing multiple sites
- Anyone tired of manual internal linking

## Features

- 🕷️ **Smart Crawling** — Fetch and parse your entire site from sitemap.xml
- 🧠 **Semantic Analysis** — Find related content using AI embeddings
- 🔗 **Link Suggestions** — "Add link from /page-a to /page-b with anchor 'keyword'"
- 🏝️ **Orphan Detection** — Find pages with zero internal links pointing to them
- 📤 **Export** — CSV, Google Sheets, Notion-ready markdown

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Crawling:** Cheerio
- **Embeddings:** OpenAI text-embedding-3-small
- **Styling:** Tailwind CSS
- **Deployment:** Vercel

## Quick Start

```bash
git clone https://github.com/neg-0/linkweave.git
cd linkweave
npm install
cp .env.example .env.local
# Add your OpenAI API key
npm run dev
```

## Environment Variables

```
OPENAI_API_KEY=sk-xxx
```

## Pricing (Planned)

| Tier | Pages | Price |
|------|-------|-------|
| Starter | 100 | $19/mo |
| Growth | 500 | $49/mo |
| Pro | 2000 | $99/mo |

## License

MIT
