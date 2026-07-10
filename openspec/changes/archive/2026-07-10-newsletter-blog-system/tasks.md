## 1. Backend — Models & Admin

- [x] 1.1 Add `bleach` to Django dependencies and install
- [x] 1.2 Create `ArticleCategory` model in `backend/blog/models.py` (name, slug, description, order)
- [x] 1.3 Create `Article` model in `backend/blog/models.py` (title, slug, excerpt, content, category FK, author, read_time, featured_image, is_featured, is_published, published_at, view_count, timestamps) with `save()` override for bleach sanitization
- [x] 1.4 Create `Resource` model in `backend/blog/models.py` (title, description, file_type, file_url, category, is_active, download_count, timestamps)
- [x] 1.5 Create `NewsletterSubscriber` model in `backend/blog/models.py` (email, is_active, source, subscribed_at, unsubscribed_at)
- [x] 1.6 Register all 4 models in `backend/blog/admin.py` with list_display, search_fields, list_filter, and prepopulated_fields for slugs
- [x] 1.7 Generate and apply migrations (`python manage.py makemigrations blog && python manage.py migrate`)

## 2. Backend — API Endpoints

- [x] 2.1 Create `ArticleListSerializer` and `ArticleDetailSerializer` in `backend/blog/serializers.py`
- [x] 2.2 Create `ResourceSerializer` and `NewsletterSubscriberSerializer` in `backend/blog/serializers.py`
- [x] 2.3 Implement `GET /api/articles/` view (paginated, published only, optional `?category=` filter, ordered by `published_at` desc)
- [x] 2.4 Implement `GET /api/articles/:slug/` view (detail, 404 for drafts, increment view_count via `F()` expression)
- [x] 2.5 Implement `GET /api/articles/popular/` view (top 6 by view_count, last 30 days)
- [x] 2.6 Implement `GET /api/resources/` view (active resources only)
- [x] 2.7 Implement `POST /api/newsletter/subscribe/` view (honeypot, validation, duplicate 409, invalid 400)
- [x] 2.8 Implement `POST /api/newsletter/unsubscribe/` view (active→inactive, 404 for unknown, idempotent)
- [x] 2.9 Create `backend/blog/urls.py` with all API routes and wire into `backend/config/urls.py`

## 3. Backend — Tests

- [x] 3.1 Write model tests for Article (slug auto-gen, publish requires published_at, category PROTECT)
- [x] 3.2 Write model tests for NewsletterSubscriber (unique email, unsubscribe preserves record)
- [x] 3.3 Write API tests for `GET /api/articles/` (paginated, category filter, draft exclusion)
- [x] 3.4 Write API tests for `GET /api/articles/:slug/` (detail, 404 draft, 404 missing, view_count increment)
- [x] 3.5 Write API tests for `GET /api/articles/popular/` (sorted by views, 30-day window)
- [x] 3.6 Write API tests for `POST /api/newsletter/subscribe/` (valid, duplicate 409, invalid email 400, honeypot)
- [x] 3.7 Write API tests for `POST /api/newsletter/unsubscribe/` (success, unknown 404, already unsubscribed)
- [x] 3.8 Run all tests and verify coverage

## 4. Django — Article Detail Template & SEO

- [x] 4.1 Create Django view for article detail page (render template, 404 for unpublished/missing)
- [x] 4.2 Create `backend/blog/templates/blog/article_detail.html` template with article content, metadata, and styling using `core.css`
- [x] 4.3 Implement dynamic OG meta tags in template (`og:title`, `og:description`, `og:type`, `og:url`, `og:article:published_time`, `og:article:author`, `og:article:section`)
- [x] 4.4 Implement Twitter Card meta tags in template (`twitter:card`, `twitter:label1:data1` for read time)
- [x] 4.5 Implement JSON-LD structured data (`Article` schema with author, publisher, datePublished)
- [x] 4.6 Add canonical URL `<link>` tag
- [x] 4.7 Create Django view and URL for `/sitemap-articles.xml`
- [x] 4.8 Add article detail URL route (`/os/newsletter/<slug>/`) in blog URLs, wire into config/urls.py

## 5. Frontend — React Components

- [x] 5.1 Create `frontend/src/components/blog/ArticleCard.tsx` (category badge, title, excerpt truncation, author, read time, date, link to detail)
- [x] 5.2 Create `frontend/src/components/blog/CategoryFilterBar.tsx` (pill buttons, "All" default, active state, onFilter callback)
- [x] 5.3 Create `frontend/src/components/blog/PopularArticles.tsx` (ranked list 01-06, category, title, view count badge)
- [x] 5.4 Create `frontend/src/components/blog/NewsletterSignup.tsx` (email input, honeypot `_hp`, submit, success/error/409 states)
- [x] 5.5 Create `frontend/src/components/blog/ResourceCard.tsx` (file type icon, title, description, download link)
- [x] 5.6 Create `frontend/src/components/blog/EmptyState.tsx` (icon, "No articles found", "View All Articles" reset button)
- [x] 5.7 Create `frontend/src/components/blog/FeaturedArticle.tsx` (large card variant with image placeholder, category, title, excerpt, author, read time, published date)

## 6. Frontend — Newsletter Page Integration

- [x] 6.1 Rewrite `frontend/src/pages/Newsletter.tsx` to fetch articles, categories, popular articles, and resources from API
- [x] 6.2 Add loading skeleton state while data fetches
- [x] 6.3 Add error state with retry button when API is unreachable
- [x] 6.4 Integrate CategoryFilterBar with article filtering logic (client-side filter on fetched data)
- [x] 6.5 Integrate EmptyState when filter produces zero results
- [x] 6.6 Integrate FeaturedArticle (first featured article from API, or first published article)
- [x] 6.7 Integrate category topic cards section (derived from article categories with article counts)
- [x] 6.8 Integrate PopularArticles, NewsletterSignup, and ResourceCard sections
- [x] 6.9 Add reading progress bar component (`frontend/src/components/blog/ReadingProgressBar.tsx`)

## 7. Frontend — Routes & Nginx

- [x] 7.1 Add `ArticleDetail` page component in `frontend/src/pages/ArticleDetail.tsx` (fetches from API, renders content, progress bar)
- [x] 7.2 Add `/newsletter/:slug` route to `frontend/src/routes.ts` (15→16 entries per updated spec)
- [x] 7.3 Update nginx config: add `location /os/newsletter/` proxy rule to Django for slug-based detail pages, keeping SPA fallback for the listing page
- [x] 7.4 Update `backend/templates/blog/article_detail.html` to include Plausible analytics snippet

## 8. Seed Data & Static Page

- [x] 8.1 Create Django fixture `backend/blog/fixtures/seed.json` with 6 categories, 6 articles, and 6 resources from `newsletter.html` content
- [x] 8.2 Verify `python manage.py loaddata seed` loads all seed data without errors
- [x] 8.3 Add source comment in `src/pages/newsletter.html` noting it is superseded by React SPA + Django templates

## 9. Build, Validate & E2E

- [x] 9.1 Run `npm run build` and verify static site builds without errors
- [x] 9.2 Run `npm run validate` and fix any link, color, or SEO validation issues
- [x] 9.3 Run `npm run frontend:build` and verify React SPA builds without errors
- [x] 9.4 Run `python manage.py test blog` and verify all tests pass
- [x] 9.5 Manual test: verify article listing loads via API, category filter works, signup stores email, article detail page renders with OG tags
- [x] 9.6 Run Lighthouse audit on article detail page and verify SEO score ≥ 90
