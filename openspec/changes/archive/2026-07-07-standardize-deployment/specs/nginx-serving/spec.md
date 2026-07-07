## ADDED Requirements

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

### Requirement: SPA-like fallback for directory pages
The nginx configuration SHALL use `try_files` to resolve requests to `$uri`, `$uri/`, or `$uri/index.html` before returning 404. This ensures subdirectory pages like `/pricing/` resolve to `/pricing/index.html`.

#### Scenario: Directory resolves to index.html
- **WHEN** `GET /pricing/` is requested
- **THEN** nginx serves `/usr/share/nginx/html/pricing/index.html`

### Requirement: Server tokens disabled
The nginx configuration SHALL set `server_tokens off` to prevent leaking nginx version in error responses.

#### Scenario: No server version in responses
- **WHEN** a 404 response is generated
- **THEN** the `Server` header does not include the nginx version number
