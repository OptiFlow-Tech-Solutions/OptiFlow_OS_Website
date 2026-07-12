## Context

The newsletter page (`src/pages/newsletter.html`, 645 lines) is a fully designed static HTML page with 8 sections: hero, trust bar, featured article, category cards, filterable article grid, popular list, signup form, and resources. All content is hardcoded. The `backend/blog/` app exists as empty stubs. The React SPA has a 14-line Newsletter.tsx stub. The feature is designated `F-MIG-NEWS-001` in the feature inventory.

The core architectural tension: article detail pages (`/newsletter/:slug`) must be SEO-visible (OG tags, structured data) but the tech stack has no SSR framework (no Next.js, no Remix). React SPA alone can't serve crawler-friendly article pages.

## Goals / Non-Goals

**Goals:**
- Replace hardcoded newsletter content with dynamic API-driven data
- Enable article creation via Django admin (no code deploys for new content)
- Serve SEO-friendly article detail pages with dynamic OG tags and JSON-LD
- Build newsletter email subscription backed by database
- Preserve all existing visual design from the static page in React components

**Non-Goals:**
- Rich text WYSIWYG editor (use Django admin TextField with HTML; sanitize on save)
- Image upload management (use URLField for featured images; point to existing assets)
- RSS feed generation (add later as separate feature)
- Email sending for newsletter (subscription storage only; email delivery is a separate pipeline)
- Comments or user accounts on articles
- Category CRUD API (categories managed via Django admin)

## Decisions

### Decision 1: Hybrid rendering — React SPA for listing, Django template for detail

**Choice:** The newsletter listing page (`/newsletter`) renders as a React SPA component fetching from the API. Article detail pages (`/newsletter/:slug`) are served by a Django template, not React.

**Why:** Article detail pages need SEO — OG tags, JSON-LD, canonical URLs, sitemap entries. The React SPA is purely client-side and cannot reliably serve these to crawlers (Google renders JS but other crawlers don't; even Google's JS rendering has a delay queue). Django templates render server-side with all metadata in the initial HTML payload.

**Alternatives considered:**
- *All React with react-helmet-async + prerender.io*: Adds a third-party dependency and ongoing cost. Prerender is a band-aid for crawled content, not a first-class rendering path.
- *All Django templates*: Would work but loses the React component ecosystem and would mean maintaining two separate frontend stacks for the listing vs. other pages.
- *Static pre-rendering at build time*: Works for a small number of articles but breaks down with frequent publishing. Requires rebuild webhooks.

**nginx routing:** `/os/newsletter/` serves the React SPA (SPA fallback). `/os/newsletter/<slug>/` is proxied to Django. The React SPA's `<Routes>` must NOT define `/newsletter/:slug` (the SPA never renders it) — only `/newsletter` (the listing). The Django template is the sole renderer for detail pages.

### Decision 2: HTML content sanitization with Bleach

**Choice:** Article `content` field stores sanitized HTML. Sanitization happens in the model's `save()` method using the `bleach` library. Allowed tags: `p, h2, h3, h4, ul, ol, li, strong, em, a, blockquote, code, pre, img, br`. Allowed attributes: `href, src, alt, class`.

**Why:** The feature spec explicitly calls for rich text HTML with sanitization. Cleaning on save (not on read) means the database never contains unsafe HTML.

**Alternative:** Markdown storage with conversion on read. Rejected because the existing content in `newsletter.html` is paragraph-based prose that maps more naturally to HTML, and the marketing team (future users) may use a WYSIWYG editor that outputs HTML.

### Decision 3: View count as atomic increment

**Choice:** Use `F("view_count") + 1` in a queryset `update()` call for the view count increment, avoiding race conditions. Do NOT load the model, increment in Python, and save (that's a read-modify-write race).

```python
Article.objects.filter(slug=slug, is_published=True).update(view_count=F("view_count") + 1)
```

### Decision 4: React component architecture

**Choice:** Folder structure: `frontend/src/components/blog/` containing `ArticleCard.tsx`, `CategoryFilterBar.tsx`, `PopularArticles.tsx`, `NewsletterSignup.tsx`, `ResourceCard.tsx`, and `EmptyState.tsx`. The `Newsletter.tsx` page orchestrates these components. Each component handles its own data fetching (using hooks) or receives data as props.

**Why:** Follows existing convention (`frontend/src/components/` for shared components). Each component is independently testable.

**Data flow:**
```
Newsletter.tsx
├── fetches: /api/articles/, /api/articles/popular/, /api/resources/
├── state: selectedCategory, articles, popular, resources, loading, error
├── <CategoryFilterBar categories={derived} active={selectedCategory} onFilter={setCategory} />
├── <ArticleCard /> (mapped from filtered articles)
├── <PopularArticles articles={popular} />
├── <NewsletterSignup /> (self-contained POST to /api/newsletter/subscribe/)
├── <ResourceCard /> (mapped from resources)
└── <EmptyState /> (shown when filtered articles.length === 0)
```

### Decision 5: Seed data from static page content

**Choice:** The 6 hardcoded articles, 6 categories, and 6 resources from `newsletter.html` become a Django fixture (`backend/blog/fixtures/seed.json`) loaded via `python manage.py loaddata seed`.

**Why:** Preserves the marketing content that already exists. Gives developers and reviewers a populated blog to verify against immediately after setup. The fixture is idempotent (uses natural keys on slug).

### Decision 6: Sitemap generation

**Choice:** Add a Django view at `/sitemap-articles.xml` that queries published articles and returns XML. Nginx merges this with the static sitemap. Alternatively, generate a combined sitemap during the static build step.

**Why:** The existing static sitemap is generated at build time by `assemble.mjs`. Adding article URLs requires either: (a) Django serving a dynamic sitemap segment, or (b) the build script fetching from the API during build. Option (a) is simpler and always up-to-date.

## Architecture Diagram

```
┌────────────────────────────────────────────────────────────┐
│                        NGINX                                │
│  /os/             → static files + SPA fallback             │
│  /os/newsletter/  → React SPA (listing page)               │
│  /os/newsletter/* → Django (article detail, SEO)            │
│  /api/*           → Django (REST API)                       │
│  /assets/*        → static files                            │
└──────────┬──────────────────────────┬──────────────────────┘
           │                          │
           ▼                          ▼
   ┌───────────────┐          ┌───────────────┐
   │  React SPA     │          │  Django        │
   │  (Vite build)  │          │  (Gunicorn)    │
   │               │          │               │
   │  Newsletter    │◄──API───│  /api/articles/│
   │  listing page  │         │  /api/resources│
   │               │         │  /api/newsletter│
   └───────────────┘         │               │
                             │  Template:     │
                             │  article_detail│
                             │  .html (SSR)   │
                             └───────┬───────┘
                                     │
                                     ▼
                             ┌───────────────┐
                             │  PostgreSQL    │
                             │  │            │
                             │  ├─ Article    │
                             │  ├─ Category   │
                             │  ├─ Resource   │
                             │  └─ Subscriber │
                             └───────────────┘
```

## Risks / Trade-offs

- **[Rich text XSS]** → Mitigated by bleach sanitization on model save. Only a whitelist of safe HTML tags and attributes pass through.
- **[SEO: Dual rendering path complexity]** → Article detail pages use Django templates, listing uses React. Two rendering stacks for the same domain. Mitigated by clear nginx routing boundaries and the fact that only ONE page (detail) uses Django templates.
- **[View count race condition]** → Mitigated by using `F()` expressions for atomic increment at the database level.
- **[Nginx route conflict]** → The catch-all `location /os/` SPA fallback must NOT shadow `/os/newsletter/<slug>/`. Solution: add a more specific `location /os/newsletter/` rule that proxies to Django BEFORE the SPA fallback.
- **[Category filter without API endpoint]** → Categories are derived from existing article data (extract unique categories from articles response). No separate `/api/categories/` endpoint needed for MVP. If category metadata (descriptions, icons) is needed, add later.

## Open Questions

1. **Nginx routing for article detail**: The exact nginx config needs testing — `/os/newsletter/<slug>/` must be caught by a Django proxy rule, not by the SPA fallback. The `location` directive ordering in nginx is critical.

2. **Django template styling**: Should the article detail template use the same `core.css` as the static site, or its own minimal CSS? Decision: reuse `core.css` via a `<link>` tag in the template for visual consistency.

3. **Article image handling**: `featured_image` is a URLField — do existing article images live somewhere accessible? For seed data, use gradient placeholders (CSS-only, no actual images needed initially).
