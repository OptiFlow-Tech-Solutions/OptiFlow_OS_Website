# article-seo

## ADDED Requirements

### Requirement: Django-rendered article detail page
The system SHALL serve article detail pages via a Django template at `/os/newsletter/<slug>/` (routed through nginx proxy to Django). The template SHALL render the article's title, author, published date, read time, category, HTML content, and view count using server-side data. This ensures search engine crawlers receive fully rendered HTML with all metadata.

#### Scenario: Article page renders with full metadata
- **WHEN** a crawler or browser requests `/os/newsletter/<slug>/`
- **THEN** the response is fully rendered HTML containing the article title in `<h1>`, content, and all meta tags

#### Scenario: Draft article serves 404
- **WHEN** a request is made for an unpublished article's slug
- **THEN** the response is HTTP 404 with the standard 404 page

### Requirement: Dynamic OG meta tags per article
The Django article template SHALL generate unique Open Graph and Twitter Card meta tags for each article, including: `og:title` from article title, `og:description` from article excerpt, `og:type` set to "article", `og:url` as the canonical article URL, `og:article:published_time` from `published_at`, `og:article:author` from author name, `og:article:section` from category name, `twitter:card` as "summary_large_image", and `twitter:label1`/`twitter:data1` for reading time.

#### Scenario: OG tags populated from article data
- **WHEN** an article detail page is rendered
- **THEN** the `<head>` contains `og:title`, `og:description`, `og:type`, `og:url`, and `og:article:published_time` matching the article's data

#### Scenario: Twitter card tags present
- **WHEN** an article detail page is rendered
- **THEN** the `<head>` contains `twitter:card`, `twitter:label1`, and `twitter:data1` tags

### Requirement: JSON-LD structured data for articles
The Django article template SHALL embed JSON-LD structured data of type `Article` in the `<head>`, including: `@type: "Article"`, `headline`, `description`, `author` (as Person), `datePublished`, `dateModified`, `publisher` (as Organization with OptiFlow OS details), and `mainEntityOfPage`.

#### Scenario: Article has JSON-LD structured data
- **WHEN** an article detail page is rendered
- **THEN** a `<script type="application/ld+json">` block is present with valid Article schema

#### Scenario: Publisher details included
- **WHEN** the JSON-LD block is inspected
- **THEN** it contains a `publisher` object with OptiFlow OS name and logo URL

### Requirement: Canonical URL for articles
Each article detail page SHALL include a `<link rel="canonical">` tag pointing to the absolute URL `/os/newsletter/<slug>/`. The canonical URL SHALL NOT include query parameters or trailing slashes beyond the standard format.

#### Scenario: Canonical link present
- **WHEN** an article detail page is rendered
- **THEN** the `<head>` contains `<link rel="canonical" href="https://optiflowos.com/os/newsletter/<slug>">`

### Requirement: Sitemap integration for articles
The system SHALL include published article URLs in `sitemap.xml`. Each article entry SHALL include `<lastmod>` from `updated_at`, `<changefreq>weekly</changefreq>`, and `<priority>0.7</priority>`. The sitemap SHALL be regenerated when articles are published or updated.

#### Scenario: Published articles appear in sitemap
- **WHEN** `sitemap.xml` is requested
- **THEN** all published article URLs appear with their last modified dates

#### Scenario: Draft articles excluded from sitemap
- **WHEN** an article has `is_published=False`
- **THEN** its URL does NOT appear in `sitemap.xml`
