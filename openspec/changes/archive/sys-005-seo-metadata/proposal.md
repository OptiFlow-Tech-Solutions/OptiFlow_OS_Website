## Why

The SEO spec defines metadata requirements but 8 of 12 pages hardcode titles/descriptions instead of using `{{PAGE_TITLE}}`/`{{PAGE_DESCRIPTION}}` placeholders, violating the "canonical page inventory" requirement. Additionally, canonical URLs, `og:url`, `og:site_name`, robots meta, BreadcrumbList structured data, and Article schema for the newsletter are all missing. Validation doesn't check these gaps.

## What Changes

- Replace hardcoded `<title>` and `<meta name="description">` in all 8 source pages with `{{PAGE_TITLE}}` and `{{PAGE_DESCRIPTION}}` placeholders
- Add `<link rel="canonical">` injection at build time for every page
- Add `<meta property="og:url">` and `<meta property="og:site_name">` injection at build time
- Add `<meta name="robots" content="index, follow">` to all pages (public pages)
- Add BreadcrumbList JSON-LD structured data on every page
- Add Article JSON-LD schema on newsletter page
- Add `og:locale` tag to all pages
- Add SEO checks to validate.mjs: canonical tags, description length (120-160), structured data presence, og:url presence
- Add `og:image:width` and `og:image:height` to OG image tags for complete OpenGraph
- Add `twitter:image` and `twitter:image:alt` to Twitter card tags

## Capabilities

### New Capabilities

None — this change enhances existing capabilities.

### Modified Capabilities

- `seo`: New requirements for canonical URLs, robots meta, og:url, og:site_name, og:locale, og:image dimensions, twitter:image, BreadcrumbList structured data, Article schema on newsletter
- `marketing-pages`: All pages SHALL use `{{PAGE_TITLE}}` and `{{PAGE_DESCRIPTION}}` placeholders instead of hardcoded values. OG description SHALL match meta description.
- `build-pipeline`: New build-time injections for canonical URLs, og:url, og:site_name, og:locale, robots meta, og:image dimensions
- `shared-components`: Nav and footer partials already use placeholders — no change needed

## Impact

- **src/pages/**: 8 pages need hardcoded meta replaced with placeholders (home, problems-solutions, product-overview, features, why-optiflow, pricing, newsletter, faq)
- **scripts/assemble.mjs**: New placeholder injections and JSON-LD additions
- **scripts/validate.mjs**: New SEO validation checks
- **openspec/specs/seo/spec.md**: Delta spec with new requirements
- **site.json**: No changes (descriptions already correct)
