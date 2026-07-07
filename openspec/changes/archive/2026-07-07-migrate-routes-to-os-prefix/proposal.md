## Why

The OptiFlow OS product website currently occupies the root domain (`/`), leaving no room for a future corporate website or additional products (CRM, Chat, Analytics, API). Migrating all product pages under `/os` reserves the root for the corporate site while keeping product URLs clean, SEO-friendly, and scalable for future product lines.

## What Changes

- **BREAKING**: All product page URLs move from `/page/` to `/os/page/` (e.g., `/pricing/` → `/os/pricing/`)
- A temporary HTML redirect page at `/` → `/os/` is added, easy to remove when the corporate site launches
- All 14 product pages (home, features, pricing, solutions, etc.) are served under `/os`
- Internal navigation (header, footer, mobile drawer, CTAs, breadcrumbs) updated to `/os/...` paths
- SEO artifacts (sitemap.xml, canonical URLs, Open Graph URLs, JSON-LD structured data) updated
- Infrastructure configs (Netlify redirects, Nginx rewrites) updated
- Error pages (404, 500) remain at root level to serve the whole domain
- Static assets (`/assets/`) remain at root — no prefix needed
- No page content, design, or business logic is changed

## Capabilities

### New Capabilities
- `os-route-prefix`: All product marketing pages served under `/os/` parent route with root-level redirect, maintaining clean SEO and scalable architecture for future product lines

### Modified Capabilities
- None — no existing capability requirements change. This is purely a routing/path migration with zero feature or behavioral changes.

## Impact

- **Build system**: `scripts/assemble.mjs` — SRC_MAP keys, page URL generation, sitemap, robots.txt, manifest.json, JSON-LD breadcrumbs
- **Data**: `site.json` — nav links, footer links, dropdown items, CTA routes
- **Partials**: `src/partials/nav.html`, `src/partials/footer.html` — every internal href
- **Pages**: All 16 `src/pages/*.html` files — every internal href
- **JavaScript**: `assets/js/core.js` — hardcoded `/demo-booking/` analytics path, page transition logic
- **Infrastructure**: `netlify.toml` — trailing-slash redirects, `nginx.conf` — rewrite rules
- **Zero impact on**: CSS, design tokens, images, form logic, API endpoints, Plausible analytics config, third-party integrations
