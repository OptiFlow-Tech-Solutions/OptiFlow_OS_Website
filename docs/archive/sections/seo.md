# SEO — Implementation Documentation
- **Current Score:** 72/100 | **Target Score:** 90/100 | **Gap:** 18 | **Last Updated:** 2026-07-06

## Overview / Current State
Every page includes a full metadata block: `<title>`, `<meta name="description">`, `<link rel="canonical">`, Open Graph tags (`og:title`, `og:description`, `og:type`, `og:url`), and Twitter Card tags (`twitter:card`, `twitter:title`, `twitter:description`). A `sitemap.xml` is auto-generated at build time (all pages, lastmod, changefreq, priority). `robots.txt` allows full crawling and points to the sitemap.

Structured data (JSON-LD) is injected at build time via `assemble.mjs` and includes:
- **Organization** — name, url, logo, sameAs links
- **BreadcrumbList** — auto-generated per page from nav hierarchy
- **FAQPage** — 5 hardcoded Q&A pairs on the FAQ page
- **WebSite** — with SearchAction linking to site search
- **Article** — on blog/news pages

Validation is handled by `validate.mjs`, which checks meta description length (120–160 characters), canonical URL format, and OG URL consistency.

## Missing Features
| Feature ID | Name | Priority | Est. Hours | Status |
|---|---|---|---|---|
| SEO-001 | Product schema (JSON-LD) | Medium | 2 | Not Started |
| SEO-002 | Dynamic FAQPage generation | Low | 3 | Not Started |
| SEO-003 | Auto-generated OG images | Medium | 4 | Not Started |
| SEO-004 | LocalBusiness schema | Low | 1 | Not Started |

## Implementation Order
1. **SEO-004** — Add LocalBusiness JSON-LD on contact/location pages. Quick win, one template block.
2. **SEO-001** — Add Product schema for service offerings. Requires structured pricing/feature data.
3. **SEO-003** — Generate per-page OG images at build time (text over brand background). Needs design template.
4. **SEO-002** — Replace hardcoded FAQ Q&As with data-driven generation from `site.json`.

## Dependencies
- SEO-003 depends on a design template for OG image backgrounds.
- SEO-002 depends on FAQ data structure in `site.json`.
- SEO-001 and SEO-004 are independent.

## Key Files
| File | Purpose |
|---|---|
| `scripts/assemble.mjs` | Build-time metadata and JSON-LD injection |
| `scripts/generate-sitemap.mjs` | Auto-generates `sitemap.xml` |
| `scripts/validate.mjs` | Meta description length, canonical URL, OG URL validation |
| `site.json` | Source-of-truth for page metadata and structured data values |
| `assets/js/jsonld.js` | JSON-LD schema templates (Organization, BreadcrumbList, etc.) |
| `src/pages/faq.html` | FAQ page with hardcoded FAQPage JSON-LD |

## Acceptance Criteria
- [ ] All 14 pages have valid structured data (Google Rich Results Test passes)
- [ ] Meta descriptions are 120–160 characters on every page
- [ ] Canonical URLs are absolute and self-referencing
- [ ] OG images render correctly for all pages (1200×630, < 300 KB)
- [ ] `sitemap.xml` includes all pages with correct `lastmod`, `changefreq`, `priority`
- [ ] `robots.txt` is present and correctly references the sitemap
- [ ] No duplicate title tags across any pages
- [ ] All JSON-LD blocks validate against schema.org
