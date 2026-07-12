# Nginx Serving

**Purpose:** Define nginx configuration requirements for serving the OptiFlow full-stack application. Covers HTTP compression (Brotli + Gzip), security headers, asset caching, URL redirects, health endpoint, SPA fallback, API reverse proxy, and server hardening.

## Requirements

### Requirement: HTTP compression enabled
The nginx configuration SHALL enable Brotli compression (level 6) and Gzip compression (level 6, as fallback) for text-based MIME types including HTML, CSS, JavaScript, JSON, XML, and SVG. Compressed responses SHALL include the `Vary: Accept-Encoding` header.

#### Scenario: Brotli compression on HTML
- **WHEN** a request with `Accept-Encoding: br` is sent to any page
- **THEN** the response includes `Content-Encoding: br`

#### Scenario: Gzip fallback when Brotli unsupported
- **WHEN** a request with `Accept-Encoding: gzip` (but not `br`) is sent to any page
- **THEN** the response includes `Content-Encoding: gzip`

### Requirement: Security headers on all responses
The nginx configuration SHALL include the following security headers on every response: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Strict-Transport-Security: max-age=31536000; includeSubDomains`, and a Content-Security-Policy that allows scripts from self and analytics domains only.

#### Scenario: Security headers present on HTML response
- **WHEN** `GET /` is requested
- **THEN** response headers include `X-Frame-Options: DENY` and `X-Content-Type-Options: nosniff`

#### Scenario: CSP restricts script sources
- **WHEN** `GET /` is requested
- **THEN** response header `Content-Security-Policy` includes `script-src` with `'self'`

### Requirement: Asset caching with appropriate TTLs
The nginx configuration SHALL serve static assets under `/assets/` with `Cache-Control: public, immutable` and a 1-year expiry. HTML pages SHALL be served with `Cache-Control: no-cache, must-revalidate`. SEO artifacts (robots.txt, sitemap.xml, manifest.json) SHALL be cached for 1 day.

#### Scenario: Assets cached for 1 year
- **WHEN** `GET /assets/css/core.css` is requested
- **THEN** response includes `Cache-Control: public, immutable` and `Expires` header ~1 year in the future

#### Scenario: HTML not cached
- **WHEN** `GET /` is requested
- **THEN** response includes `Cache-Control: no-cache, must-revalidate`

### Requirement: Trailing-slash redirect for SEO-friendly URLs
The nginx configuration SHALL redirect path-only requests (without trailing slash, without file extension) to the trailing-slash variant via HTTP 301.

#### Scenario: Path without slash redirects
- **WHEN** `GET /pricing` is requested
- **THEN** response is HTTP 301 with `Location: /pricing/`

#### Scenario: Path with query string redirects correctly
- **WHEN** `GET /pricing?utm_source=test` is requested
- **THEN** response is HTTP 301 with `Location: /pricing/?utm_source=test`

### Requirement: Health endpoint
The nginx configuration SHALL respond to `GET /health` with HTTP 200 and body `ok`, without logging to access log.

#### Scenario: Health check passes
- **WHEN** `GET /health` is requested
- **THEN** response status is 200 with body `ok`

### Requirement: API reverse proxy to Django backend
The nginx configuration SHALL include a `location /api/` block that proxies requests to the Django backend service (internal hostname `api`, port 8000) with appropriate proxy headers for host, protocol, and client IP forwarding.

#### Scenario: API proxy forwards to Django
- **WHEN** `GET /api/health/` is requested through nginx
- **THEN** the request reaches Django and returns the health check JSON response

#### Scenario: Proxy headers are set
- **WHEN** a request to `/api/` is received by Django
- **THEN** `request.META['HTTP_X_FORWARDED_HOST']` and `HTTP_X_FORWARDED_PROTO` are present

#### Scenario: WebSocket upgrade is supported
- **WHEN** a request to `/api/` includes `Upgrade: websocket` header
- **THEN** nginx passes the upgrade headers to Django for WebSocket connections

#### Scenario: Large request bodies are allowed
- **WHEN** a POST to `/api/` contains a 10MB payload
- **THEN** nginx does not reject it with 413

### Requirement: React SPA fallback for /os/ routes
The nginx configuration SHALL include a `location /os/` block that uses `try_files $uri /os/index.html` to support React client-side routing. All `/os/*` paths that do not match a physical file SHALL serve the React `index.html` entry point.

#### Scenario: Direct path serves React entry point
- **WHEN** `GET /os/pricing/` is requested
- **THEN** nginx serves `/os/index.html` from the React build output

#### Scenario: React static assets are served directly
- **WHEN** `GET /os/assets/main-abc123.js` is requested and the file exists
- **THEN** nginx serves the file directly, not the `index.html` fallback

#### Scenario: SPA fallback preserves query strings
- **WHEN** `GET /os/pricing/?plan=growth` is requested
- **THEN** the response is the React `index.html` and the query string is preserved for React Router

### Requirement: SPA-like fallback for directory pages
The nginx configuration SHALL use `try_files` to resolve `/os/*` requests to `$uri` first (for static assets), then fall back to `/os/index.html` for client-side routing. Non-`/os/` requests SHALL continue to use the existing `try_files $uri $uri/ $uri/index.html =404` pattern. API requests under `/api/` SHALL be proxy-passed to Django, not served as static files.

#### Scenario: React SPA route resolves to index.html
- **WHEN** `GET /os/pricing/` is requested
- **THEN** nginx serves `/os/index.html` with status 200

#### Scenario: Non-SPA directory resolves to index.html (legacy)
- **WHEN** a non-`/os/` directory like `/some-legacy-path/` exists and is requested
- **THEN** nginx serves the legacy static `index.html` if it exists, or 404

#### Scenario: API routes bypass try_files
- **WHEN** `GET /api/health/` is requested
- **THEN** nginx proxies to Django backend instead of attempting file resolution

### Requirement: Server tokens disabled
The nginx configuration SHALL set `server_tokens off` to prevent leaking nginx version in error responses.

#### Scenario: No server version in responses
- **WHEN** a 404 response is generated
- **THEN** the `Server` header does not include the nginx version number
