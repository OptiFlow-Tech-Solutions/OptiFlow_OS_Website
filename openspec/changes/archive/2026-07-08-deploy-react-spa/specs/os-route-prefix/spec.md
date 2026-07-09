## MODIFIED Requirements

### Requirement: Infrastructure redirects preserve /os prefix
Infrastructure redirects (Netlify trailing-slash normalization, SPA fallback) SHALL include the `/os/` prefix.

#### Scenario: Trailing-slash redirect for /os/pricing
- **WHEN** a user navigates to `/os/pricing` (no trailing slash)
- **THEN** they are 301 redirected to `/os/pricing/`

#### Scenario: SPA fallback for /os/* paths
- **WHEN** a request for any `/os/...` path reaches the server
- **THEN** nginx serves `/os/index.html` for client-side routing (unless a static file matches)
