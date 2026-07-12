## ADDED Requirements

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

## MODIFIED Requirements

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
