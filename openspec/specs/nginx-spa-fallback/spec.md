# nginx-spa-fallback

## Purpose

nginx location configuration serving the React SPA with client-side routing fallback for all `/os/*` paths.

## Requirements

### Requirement: nginx serves React SPA with client-side routing
The nginx configuration SHALL include a `location /os/` block that serves the React SPA and falls back to `index.html` for client-side routing on unknown paths.

#### Scenario: Home page loads React SPA
- **WHEN** user navigates to `/os/`
- **THEN** nginx serves `/os/index.html` which mounts the React application

#### Scenario: Deep link renders via client-side routing
- **WHEN** user navigates to `/os/pricing` (no trailing slash, no static file)
- **THEN** nginx serves `/os/index.html` and React Router renders the Pricing page

#### Scenario: Static JS asset resolves directly
- **WHEN** browser requests `/os/assets/index-xxx.js`
- **THEN** nginx serves the file directly without falling back to `index.html`

### Requirement: SPA location block does not interfere with other routes
The `/os/` location block SHALL only affect paths beginning with `/os/` and SHALL NOT interfere with `/assets/`, `/health`, `/api/`, root files, or other location blocks.

#### Scenario: /assets/ still served with caching
- **WHEN** browser requests `/assets/img/OptiFlow.Logo.avif`
- **THEN** nginx serves the file with `Cache-Control: public, immutable` from the `/assets/` location block

#### Scenario: /health still returns 200
- **WHEN** health check requests `/health`
- **THEN** nginx returns 200 "ok" from the exact-match location block

### Requirement: Security headers apply to /os/ routes
The `/os/` location block SHALL include the same security headers as the general `location /` block: X-Frame-Options, X-Content-Type-Options, CSP, Referrer-Policy, Permissions-Policy, HSTS.

#### Scenario: CSP header present on /os/ response
- **WHEN** user requests any `/os/` URL
- **THEN** response includes `Content-Security-Policy` header allowing self-src scripts, inline styles, and Google Fonts
