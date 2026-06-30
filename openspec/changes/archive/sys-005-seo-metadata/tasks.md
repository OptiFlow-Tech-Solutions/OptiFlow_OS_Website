## 1. Update Source Pages — Placeholders

- [x] 1.1 Replace hardcoded `<title>` with `{{PAGE_TITLE}}` and `<meta name="description">` + `<meta property="og:description">` with `{{PAGE_DESCRIPTION}}` in home.html
- [x] 1.2 Replace hardcoded `<title>` with `{{PAGE_TITLE}}` and `<meta name="description">` + `<meta property="og:description">` with `{{PAGE_DESCRIPTION}}` in problem-solutions.html
- [x] 1.3 Replace hardcoded `<title>` with `{{PAGE_TITLE}}` and `<meta name="description">` + `<meta property="og:description">` with `{{PAGE_DESCRIPTION}}` in product-overview.html
- [x] 1.4 Replace hardcoded `<title>` with `{{PAGE_TITLE}}` and `<meta name="description">` + `<meta property="og:description">` with `{{PAGE_DESCRIPTION}}` in features.html
- [x] 1.5 Replace hardcoded `<title>` with `{{PAGE_TITLE}}` and `<meta name="description">` + `<meta property="og:description">` with `{{PAGE_DESCRIPTION}}` in why-optiflow.html
- [x] 1.6 Replace hardcoded `<title>` with `{{PAGE_TITLE}}` and `<meta name="description">` + `<meta property="og:description">` with `{{PAGE_DESCRIPTION}}` in pricing.html
- [x] 1.7 Replace hardcoded `<title>` with `{{PAGE_TITLE}}` and `<meta name="description">` + `<meta property="og:description">` with `{{PAGE_DESCRIPTION}}` in newsletter.html
- [x] 1.8 Replace hardcoded `<title>` with `{{PAGE_TITLE}}` and `<meta name="description">` + `<meta property="og:description">` with `{{PAGE_DESCRIPTION}}` in faq.html
- [x] 1.9 Remove hardcoded `og:title` from source pages (now injected at build time from site.json)

## 2. Build Pipeline — New Meta Injections

- [x] 2.1 Add canonical URL injection: derive page URL from `pageInfo.file` and inject `<link rel="canonical" href="...">` after viewport meta in assemble.mjs
- [x] 2.2 Add `og:url`, `og:site_name`, `og:locale` meta tag injection in assemble.mjs
- [x] 2.3 Add `og:image:width` and `og:image:height` meta tag injection in assemble.mjs
- [x] 2.4 Add `twitter:image` and `twitter:image:alt` meta tag injection in assemble.mjs
- [x] 2.5 Add `<meta name="robots" content="index, follow">` injection in assemble.mjs

## 3. Build Pipeline — New JSON-LD Structured Data

- [x] 3.1 Implement BreadcrumbList JSON-LD generation in `injectJSONLD()` based on URL path segments
- [x] 3.2 Implement Article JSON-LD schema injection for newsletter page in `injectJSONLD()`
- [x] 3.3 Newsletter `og:type` override to `article` handled by source file (preserved `article` type in newsletter.html)

## 4. Build Pipeline — OG Description Sync

- [x] 4.1 Add build-time injection of `og:title` and `og:description` sourced from site.json (injected in buildPage with pageInfo.title/description)

## 5. Validation — New SEO Checks

- [x] 5.1 Add canonical link presence check to validate.mjs (error if missing)
- [x] 5.2 Add meta description length check (120-160 chars) to validate.mjs (error if out of range)
- [x] 5.3 Add `og:url` presence check to validate.mjs (error if missing)
- [x] 5.4 Add structured data presence check (BreadcrumbList, Organization) to validate.mjs (warn if missing)
- [x] 5.5 Add `og:site_name` and `og:locale` presence checks to validate.mjs

## 6. Build & Validate

- [x] 6.1 Run `npm run build` and verify all 12 pages assemble without errors
- [x] 6.2 Run `npm run validate` and verify 0 errors (0 errors, 84 pre-existing warnings from hardcoded colors)
- [ ] 6.3 Run `npm run test:e2e` and verify SEO E2E tests pass — BLOCKED: `@playwright/test` not installed in dependencies
