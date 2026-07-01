# api-002

## Summary
Add admin authentication to protect the internal admin dashboard where OptiFlow team members can view form submissions and manage settings.

## Scope
- Admin login page (`/admin/`) with credential-based authentication
- Cloudflare Worker endpoints: `/api/admin/login` and `/api/admin/verify`
- JWT-based session tokens stored in localStorage
- Admin dashboard that displays recent form submissions
- Admin credentials managed via environment variables (ADMIN_USERNAME, ADMIN_PASSWORD, JWT_SECRET)
- Admin CSS components in core.css
- Admin auth JS utilities in core.js

## Affected Specs
- **New**: `admin-authentication` — login flow, JWT issuance, session verification
- **Modified**: `form-processing-api` — add admin login/verify endpoints to Worker
- **Modified**: `shared-components` — add admin auth JS functions
- **Modified**: `build-pipeline` — add admin page to assembly
- **Modified**: `marketing-pages` — add admin page to page inventory
