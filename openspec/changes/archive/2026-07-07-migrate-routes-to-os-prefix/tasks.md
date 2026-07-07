## 1. Central Data — site.json

- [x] 1.1 Update all `nav.links[].href` values to include `/os/` prefix
- [x] 1.2 Update `nav.dropdown.items[].href` values to include `/os/` prefix
- [x] 1.3 Update `nav.cta[].href` values to include `/os/` prefix
- [x] 1.4 Update all `footer.columns[].links[].href` values to include `/os/` prefix
- [x] 1.5 Update `pages[].file` values for all product pages to include `os/` prefix (e.g., `"index.html"` → `"os/index.html"`, `"pricing/index.html"` → `"os/pricing/index.html"`)
- [x] 1.6 Keep 404.html and 500.html pages at root level (no `os/` prefix)

## 2. Build System — scripts/assemble.mjs

- [x] 2.1 Update `SRC_MAP` keys: add `os/` prefix to all product page keys, keep 404.html and 500.html at root
- [x] 2.2 Verify page URL generation logic works correctly with new prefixed `page.file` values (homepage URL = `https://optiflow.in/os/`, others = `https://optiflow.in/os/page/`)
- [x] 2.3 Update `generateManifest()`: set `start_url` to `/os/`, `scope` to `/os/`, update shortcut URLs to `/os/demo-booking/` and `/os/pricing/`
- [x] 2.4 Create a root `dist/index.html` redirect page with `<meta http-equiv="refresh" content="0;url=/os/">` + JS fallback
- [x] 2.5 Update `generateSitemap()` to generate correct `/os/...` URLs from prefixed `page.file` values
- [x] 2.6 Update `injectJSONLD()` breadcrumb logic to handle `/os/` prefix in URL segments

## 3. Navigation Partial — src/partials/nav.html

- [x] 3.1 Update logo/brand link `href="/"` → `href="/os/"`
- [x] 3.2 Update all desktop nav `href` attributes to `/os/...` paths
- [x] 3.3 Update all mobile drawer `href` attributes to `/os/...` paths
- [x] 3.4 Update dropdown menu `href` attributes to `/os/...` paths
- [x] 3.5 Update "Book Demo" CTA button `href` to `/os/demo-booking/`

## 4. Footer Partial — src/partials/footer.html

- [x] 4.1 Update brand logo link `href="/"` → `href="/os/"`
- [x] 4.2 Update all footer column links to `/os/...` paths (Product, Solutions, Resources)

## 5. Page Files — src/pages/*.html (16 files)

- [x] 5.1 Update home.html — all internal hrefs to `/os/...`
- [x] 5.2 Update features.html — all internal hrefs to `/os/...`
- [x] 5.3 Update pricing.html — all internal hrefs to `/os/...`
- [x] 5.4 Update problem-solutions.html — all internal hrefs to `/os/...`
- [x] 5.5 Update product-overview.html — all internal hrefs to `/os/...`
- [x] 5.6 Update feature-showcase.html — all internal hrefs to `/os/...`
- [x] 5.7 Update why-optiflow.html — all internal hrefs to `/os/...`
- [x] 5.8 Update contact.html — all internal hrefs to `/os/...`
- [x] 5.9 Update demo-booking.html — all internal hrefs to `/os/...`
- [x] 5.10 Update newsletter.html — all internal hrefs to `/os/...`
- [x] 5.11 Update faq.html — all internal hrefs to `/os/...`
- [x] 5.12 Update privacy-policy.html — all internal hrefs to `/os/...`
- [x] 5.13 Update terms.html — all internal hrefs to `/os/...`
- [x] 5.14 Update competitive-positioning.html — all internal hrefs to `/os/...`
- [x] 5.15 Update 404.html — update navigation links to `/os/...`, keep root-relative asset paths
- [x] 5.16 Update 500.html — update navigation links to `/os/...`, keep root-relative asset paths

## 6. JavaScript — assets/js/core.js

- [x] 6.1 Update hardcoded `/demo-booking/` in pricing CTA click tracking to `/os/demo-booking/`

## 7. Netlify Configuration — netlify.toml

- [x] 7.1 Update all trailing-slash redirects to include `/os/` prefix (e.g., `/os/pricing` → `/os/pricing/`)
- [x] 7.2 Update legacy `/blog` → `/newsletter/` redirect to `/os/blog` → `/os/newsletter/`
- [x] 7.3 Add 301 redirects from old root paths to new `/os/...` paths for SEO preservation (e.g., `/pricing/` → `/os/pricing/`)
- [x] 7.4 Update SPA fallback rewrite to handle `/os/...` paths

## 8. Nginx Configuration — nginx.conf

- [x] 8.1 Update trailing-slash rewrite rule regex to support multi-segment paths under `/os/`
- [x] 8.2 Update legacy `/blog` → `/newsletter/` rewrite to `/os/blog` → `/os/newsletter/`
- [x] 8.3 Add permanent rewrites from old root paths to `/os/...` paths for SEO preservation

## 9. Build, Validate, and Test

- [x] 9.1 Run `npm run build` and verify dist/os/ structure is correct
- [x] 9.2 Verify root `dist/index.html` redirect page exists
- [x] 9.3 Run `npm run validate` and fix any broken link errors
- [x] 9.4 Run `npm run lint:all` and fix any lint issues
- [x] 9.5 Verify sitemap.xml has `/os/...` URLs (no root-level product URLs)
- [x] 9.6 Verify robots.txt sitemap reference is correct
- [x] 9.7 Verify manifest.json start_url and scope are `/os/`
- [x] 9.8 Spot-check canonical URLs, OG URLs, and JSON-LD on 3 pages
- [x] 9.9 Run local dev server (`npm run dev`) and navigate all 14 pages at `/os/...`
