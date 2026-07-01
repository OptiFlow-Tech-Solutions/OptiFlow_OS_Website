# Design: SYS-005 — SEO & Metadata Enhancements

## Decisions

### 1. Absolute og:image URL (C-1)
- Inject `<meta property="og:image" content="https://optiflow.in/assets/img/OptiFlow.Logo.png">` in assemble.mjs SEO block, alongside existing og:title/og:url injection.
- Remove static `<meta property="og:image" content="/assets/img/OptiFlow.Logo.png">` from page templates since build injects absolute version.
- **Rationale:** Facebook/Twitter require absolute URLs. Single injection point in build script.

### 2. Skip Link Deduplication (H-1)
- Remove skip link from `src/partials/nav.html`. Keep it in each page body (each page owns its own skip target `#content`).
- **Rationale:** Every page already has `<a class="skip-link" href="#content">`. The nav partial duplicating it means every page gets 2 skip links.

### 3. Logo Loading Attribute (H-2)
- Change `loading="lazy"` to `loading="eager"` in nav.html.
- Keep `decoding="async"`.
- **Rationale:** Logo is above fold — lazy loading delays LCP. `eager` is default, but explicit is self-documenting.

### 4. Newsletter Published Date (H-3)
- Add `{{PUBLISHED_DATE}}` placeholder to newsletter.html, replacing hardcoded date.
- Inject `new Date().toISOString()` in assemble.mjs SEO block when processing newsletter page.
- **Rationale:** Build-time date is always current. No manual update needed.

### 5. Footer Logo Dimensions (M-1)
- Add `width="28" height="28"` to footer logo img (matches inline `style="height:28px"`).
- **Rationale:** Explicit dimensions prevent CLS (Cumulative Layout Shift) by letting browser reserve space.

### 6. Plausible Preconnect (M-3)
- Add `<link rel="dns-prefetch" href="https://plausible.io">` before the script tag in analytics.html.
- **Rationale:** DNS-prefetch is lightweight (~0 bytes). preconnect is heavier but saves TLS time. dns-prefetch is the right first step.

### 7. Manifest Description (L-2)
- Add `"description": "Business Execution Operating System for Indian MSMEs"` to manifest generator.
- **Rationale:** Chrome uses this in install prompts. One line.

### 8. Sitemap Changefreq (L-3)
- Home → `daily`, newsletter → `weekly`, static pages (privacy, terms) → `monthly`, rest → `weekly`.
- Page type detection: `index.html` = daily, pages with `file.includes('newsletter')` = weekly, pages with `noindex` = skip, privacy/terms = monthly.
- **Rationale:** More accurate signals to crawlers.
