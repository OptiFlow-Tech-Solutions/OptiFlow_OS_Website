# SYS-005: SEO & Metadata Enhancements

## Summary

Fix critical and high-priority SEO issues discovered during audit: absolute `og:image` URL for social sharing, duplicate skip links, LCP regression from lazy-loaded logo, hardcoded newsletter publish date, missing footer image dimensions, and Plausible analytics preconnect.

## Motivation

An automated SEO audit revealed 8 issues across 7 files. The critical issue (broken social share images from relative `og:image` URL) and high-priority issues (duplicate skip links, LCP regression, stale publish date) directly impact Core Web Vitals, social sharing, and search engine indexing quality.

## Scope

### In Scope
1. **C-1:** Fix relative `og:image` — inject absolute URL in `assemble.mjs` SEO block
2. **H-1:** Remove duplicate skip link from `nav.html` partial (pages already have it)
3. **H-2:** Fix `loading="lazy"` on nav logo (above fold → LCP harm)
4. **H-3:** Replace hardcoded newsletter publish date with `{{PUBLISHED_DATE}}` placeholder
5. **M-1:** Add `width`/`height` to footer logo img
6. **M-3:** Add DNS preconnect for Plausible analytics
7. **L-2:** Add `description` to PWA manifest
8. **L-3:** Vary sitemap `changefreq` by page type

### Out of Scope
- Creating 1200x630 social share image (design asset, not code)
- Adding `hreflang` tags (not needed for single-locale site)
- Standardizing void element self-closing tag style (cosmetic)

## Affected Specs

- `seo` — Direct spec compliance fixes
- `build-pipeline` — assemble.mjs changes
- `shared-components` — nav.html, footer.html, analytics.html changes
- `marketing-pages` — newsletter.html changes
- `design-system` — No new design tokens needed
