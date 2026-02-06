# LinkPilot API Documentation

Base URL: `https://linkpilot.io/api`

---

## Authentication

Include your API key in the `Authorization` header:

```
Authorization: Bearer YOUR_API_KEY
```

API keys are available on Pro plans. Find yours in Settings → API.

---

## Endpoints

### POST /api/analyze

Analyze a website and get internal link suggestions.

**Request Body:**

```json
{
  "sitemapUrl": "https://yoursite.com/sitemap.xml",
  "maxPages": 50
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `sitemapUrl` | string | Yes | URL to your sitemap.xml |
| `maxPages` | number | No | Maximum pages to crawl (default: 50, max: 2000 based on plan) |

**Response:**

```json
{
  "success": true,
  "provider": {
    "provider": "Google Gemini",
    "model": "text-embedding-004"
  },
  "suggestions": [
    {
      "source": "/blog/coffee-brewing",
      "target": "/blog/espresso-guide",
      "anchor": "espresso brewing techniques",
      "score": 0.87,
      "reason": "Semantically similar content"
    }
  ],
  "orphans": [
    "/blog/old-post-nobody-links-to"
  ],
  "stats": {
    "totalPages": 45,
    "totalSuggestions": 23,
    "totalOrphans": 5
  }
}
```

**Error Responses:**

| Status | Description |
|--------|-------------|
| 400 | Invalid request (missing sitemap, invalid URL) |
| 401 | Invalid or missing API key |
| 429 | Rate limit exceeded |
| 500 | Server error |

---

### POST /api/export

Export analysis results as CSV.

**Request Body:**

```json
{
  "suggestions": [...],
  "orphans": [...],
  "format": "csv"
}
```

**Response:**

Returns a CSV file download.

---

## Rate Limits

| Plan | Requests/day | Pages/request |
|------|-------------|---------------|
| Starter | 10 | 100 |
| Growth | 50 | 500 |
| Pro | 200 | 2000 |

---

## Example: Node.js

```javascript
const response = await fetch('https://linkpilot.io/api/analyze', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    sitemapUrl: 'https://mysite.com/sitemap.xml',
    maxPages: 100
  })
});

const data = await response.json();
console.log(`Found ${data.suggestions.length} link opportunities`);
```

---

## Example: Python

```python
import requests

response = requests.post(
    'https://linkpilot.io/api/analyze',
    headers={
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
    },
    json={
        'sitemapUrl': 'https://mysite.com/sitemap.xml',
        'maxPages': 100
    }
)

data = response.json()
print(f"Found {len(data['suggestions'])} link opportunities")
```

---

## Webhooks (Coming Soon)

Subscribe to analysis completion events for async processing.

---

## Need Help?

Email api-support@linkpilot.io for technical questions.
