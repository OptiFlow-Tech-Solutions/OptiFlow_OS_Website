## MODIFIED Requirements

### Requirement: Product pages served under /os prefix
All OptiFlow OS product marketing pages SHALL be accessible at URLs beginning with `/os/`, including the React SPA which SHALL use Vite's `base: '/os/'` configuration to serve all routes under the prefix.

#### Scenario: Home page accessible at /os
- **WHEN** a user navigates to `/os/`
- **THEN** the OptiFlow OS home page is displayed

#### Scenario: Pricing page accessible at /os/pricing
- **WHEN** a user navigates to `/os/pricing/`
- **THEN** the pricing page is displayed

#### Scenario: All 14 product pages accessible under /os
- **WHEN** a user navigates to any product page URL (`/os/features/`, `/os/contact/`, etc.)
- **THEN** the correct page is displayed with status 200

#### Scenario: React SPA routes use /os prefix
- **WHEN** the React SPA is built and deployed
- **THEN** all client-side routes resolve under `/os/` (e.g., `/os/pricing`, `/os/features`) with Vite's base config

#### Scenario: SPA handles direct URL access
- **WHEN** user directly navigates to `/os/contact` (not via client-side navigation)
- **THEN** the SPA loads and renders the Contact page without a 404

### Requirement: Infrastructure redirects preserve /os prefix
Infrastructure redirects (Netlify trailing-slash normalization, SPA fallback) SHALL include the `/os/` prefix.

#### Scenario: Trailing-slash redirect for /os/pricing
- **WHEN** a user navigates to `/os/pricing` (no trailing slash)
- **THEN** they are 301 redirected to `/os/pricing/`

#### Scenario: SPA fallback for /os/* paths
- **WHEN** a request for any `/os/...` path reaches the server
- **THEN** the SPA's `index.html` is served for client-side routing (unless a static file matches)
