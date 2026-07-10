## Why

The newsletter page is the site's content marketing engine — static hardcoded HTML with no CMS backend. Every new article requires a code change and redeploy. This blocks content velocity, prevents SEO-driven article detail pages, and ties newsletter subscriptions to a black-box JS handler instead of a database. The `backend/blog/` app exists as empty stubs explicitly earmarked for `F-MIG-NEWS-001`. It's time to wire the content engine.

## What Changes

- **Backend**: Implement Django models for `Article`, `ArticleCategory`, `Resource`, and `NewsletterSubscriber` with the blog app. Wire blog URLs into `config/urls.py`. Register models in Django admin.
- **API**: Create paginated article listing (filterable by category), article detail by slug (with view count increment), popular articles endpoint, resource listing endpoint, and newsletter subscribe/unsubscribe endpoints.
- **Frontend (React SPA)**: Build a dynamic Newsletter page with category-filtered article grid, featured article section, popular articles ranked list, category topic cards, newsletter signup form, and resource cards — all loading from the API. Add `/newsletter/:slug` route for article detail pages with reading progress bar.
- **Article detail (SEO)**: Serve article detail pages via Django template for server-side rendering, ensuring OG tags, meta descriptions, and structured data are embedded at render time — critical for search visibility.
- **Static HTML migration**: The existing `newsletter.html` static page is superseded by the React SPA page and Django-rendered detail pages. Keep the static page as a fallback until the React page covers all sections.
- **Routing**: Add `/newsletter/:slug` route to `routes.ts`. This is a **BREAKING** change to the `react-router-config` spec which asserts a fixed route count.
- **Seed data**: The 6 hardcoded articles from `newsletter.html` become seed data for the new models.

## Capabilities

### New Capabilities

- `blog-models`: Article, ArticleCategory, Resource, and NewsletterSubscriber Django models with validation, unique constraints, and admin registration
- `blog-api`: REST API endpoints for article listing (paginated, category-filterable), article detail, popular articles, resource listing, newsletter subscribe/unsubscribe
- `blog-frontend`: React components for the newsletter/blog page — ArticleCard, FeaturedArticle, CategoryFilterBar, PopularArticles, NewsletterSignup, ResourceCard, ArticleDetail page with reading progress bar
- `article-seo`: Django template for server-side rendered article detail pages with dynamic OG tags, meta descriptions, JSON-LD structured data, and sitemap integration

### Modified Capabilities

- `react-router-config`: Adding `/newsletter/:slug` route changes the route count and adds a new lazy-loaded component. The route array grows from 15 to 16 entries.

## Impact

- **Backend**: `backend/blog/models.py`, `backend/blog/views.py`, `backend/blog/serializers.py`, `backend/blog/urls.py`, `backend/blog/admin.py`, `backend/config/urls.py`, `backend/config/settings.py` (blog app registration confirmed)
- **API**: New endpoints under `/api/articles/`, `/api/resources/`, `/api/newsletter/`
- **Frontend**: `frontend/src/pages/Newsletter.tsx`, `frontend/src/pages/ArticleDetail.tsx`, `frontend/src/components/blog/*`, `frontend/src/routes.ts`
- **Static site**: `src/pages/newsletter.html` (superseded, preserved as reference), `site.json` (may need article page metadata)
- **Django templates**: New `backend/blog/templates/blog/article_detail.html` for SSR article pages
- **Database**: Migration files for 4 new models, seed data fixture
- **Nginx**: Article detail route must proxy to Django, not serve from static files
