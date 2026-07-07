# os-route-prefix

## Purpose

Define the routing architecture for the OptiFlow OS product website, serving all pages under the `/os/` prefix to reserve the root domain for a future corporate website and support additional product lines (CRM, Chat, Analytics, API).

## Requirements

### Requirement: Product pages served under /os prefix
All OptiFlow OS product marketing pages SHALL be accessible at URLs beginning with `/os/`.

#### Scenario: Home page accessible at /os
- **WHEN** a user navigates to `/os/`
- **THEN** the OptiFlow OS home page is displayed

#### Scenario: Pricing page accessible at /os/pricing
- **WHEN** a user navigates to `/os/pricing/`
- **THEN** the pricing page is displayed

#### Scenario: All 14 product pages accessible under /os
- **WHEN** a user navigates to any product page URL (`/os/features/`, `/os/contact/`, etc.)
- **THEN** the correct page is displayed with status 200

### Requirement: Root domain redirects to /os
The root path `/` SHALL redirect visitors to `/os/` using a meta-refresh HTML page.

#### Scenario: Root redirect on first visit
- **WHEN** a user navigates to `/`
- **THEN** they are redirected to `/os/` within 1 second

#### Scenario: Redirect is easily removable
- **WHEN** the future corporate homepage is ready
- **THEN** the redirect page can be replaced by a corporate homepage without modifying any other files

### Requirement: Internal navigation uses /os prefix
Every internal link in the header, footer, mobile drawer, CTA buttons, and page content SHALL point to `/os/...` paths.

#### Scenario: Desktop nav links use /os prefix
- **WHEN** the page is rendered
- **THEN** all navigation links in the desktop header start with `/os/`

#### Scenario: Footer links use /os prefix
- **WHEN** the page is rendered
- **THEN** all links in the footer start with `/os/`

#### Scenario: CTA buttons use /os prefix
- **WHEN** a CTA button (Book Demo, View Pricing, Watch Product Tour) is rendered
- **THEN** its href points to a `/os/...` path

### Requirement: SEO metadata uses /os URLs
Canonical URLs, Open Graph URLs, sitemap entries, and JSON-LD structured data SHALL use `/os/` prefixed URLs.

#### Scenario: Canonical URLs include /os prefix
- **WHEN** the pricing page is built
- **THEN** its canonical URL is `https://optiflow.in/os/pricing/`

#### Scenario: Open Graph URLs include /os prefix
- **WHEN** any product page is built
- **THEN** its `og:url` meta tag includes the `/os/` prefix

#### Scenario: Sitemap entries include /os prefix
- **WHEN** the sitemap is generated
- **THEN** every `<loc>` URL for product pages starts with `/os/`

#### Scenario: JSON-LD BreadcrumbList includes /os prefix
- **WHEN** any product page is built
- **THEN** its BreadcrumbList schema has URLs with the `/os/` prefix

### Requirement: Static assets remain at root
Static assets (CSS, JavaScript, images, fonts) SHALL remain at their current root-level paths without the `/os/` prefix.

#### Scenario: CSS loads from /assets/css/core.css
- **WHEN** any page under `/os/` is rendered
- **THEN** the stylesheet reference is `/assets/css/core.css`

#### Scenario: JavaScript loads from /assets/js/core.js
- **WHEN** any page under `/os/` is rendered
- **THEN** the script reference is `/assets/js/core.js`

### Requirement: Error pages serve entire domain
The 404 and 500 error pages SHALL remain at root level and serve errors for all routes including `/os/...` and future product prefixes.

#### Scenario: 404 page served for non-existent /os/ path
- **WHEN** a user navigates to `/os/nonexistent/`
- **THEN** the 404 error page is displayed

### Requirement: Infrastructure redirects preserve /os prefix
Infrastructure redirects (Netlify trailing-slash normalization) SHALL include the `/os/` prefix.

#### Scenario: Trailing-slash redirect for /os/pricing
- **WHEN** a user navigates to `/os/pricing` (no trailing slash)
- **THEN** they are 301 redirected to `/os/pricing/`

### Requirement: Build system supports future product prefixes
The build system's SRC_MAP architecture SHALL support adding additional product prefixes (e.g., `/crm/`, `/chat/`) by adding new entries without structural changes.

#### Scenario: Adding a new product prefix
- **WHEN** a new product prefix like `/crm/` needs to be added
- **THEN** it requires only adding new entries to SRC_MAP with the crm/ prefix

### Requirement: manifest.json references /os paths
The PWA manifest SHALL reference `/os/` as the start_url and scope, and `/os/...` paths in app shortcuts.

#### Scenario: Manifest start_url is /os
- **WHEN** the manifest.json is generated
- **THEN** `start_url` is `/os/` and `scope` is `/os/`

### Requirement: robots.txt references /os sitemap
The robots.txt SHALL point to the sitemap at its `/os/`-aware location.

#### Scenario: robots.txt sitemap URL
- **WHEN** robots.txt is generated
- **THEN** it contains `Sitemap: https://optiflow.in/sitemap.xml`
