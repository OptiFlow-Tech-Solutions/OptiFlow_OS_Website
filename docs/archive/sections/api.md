# API — Implementation Documentation
- **Current Score:** 42/100 | **Target Score:** 75/100 | **Gap:** 33 | **Last Updated:** 2026-07-06

## Overview
The API layer consists of 7 endpoints running on Cloudflare Workers, handling form submissions, email dispatch, and admin operations. The current design uses action-named endpoints rather than RESTful resources, lacks versioning, and has no formal API specification. This section covers the migration to a proper RESTful API design with versioning, documentation, and structured resource endpoints for the future application backend.

## Current State
- **POST /api/form-submit** — public; accepts contact/demo booking form data; validates required fields, sanitizes HTML entities, rate-limits by IP (5 req/10min, KV-backed), CSRF origin check, stores in KV, triggers email notification
- **POST /api/email** — internal only; receives dispatch from form-submit.js; sends email via Resend API; logs to NOTIFICATIONS KV
- **POST /api/admin/login** — admin; accepts username/password; returns JWT token (HS256, 24h expiry) on success
- **POST /api/admin/verify** — admin; validates JWT token from Authorization header
- **GET /api/admin/submissions** — admin (JWT-protected); returns paginated form submissions from KV (query params: page, limit)
- **GET /api/admin/stats** — admin (JWT-protected); returns aggregate counts (total submissions, recent, by type)
- **GET /api/admin/submissions/export** — admin (JWT-protected); returns submissions as CSV or JSON (query param: format)
- Scoring deductions: no API versioning (TD-07), no OpenAPI documentation (TD-08), action-named endpoints (not RESTful), no resource-oriented design

## Missing Features
| Feature ID | Name | Priority | Est. Hours | Status |
|------------|------|----------|------------|--------|
| API-001 | API versioning | MEDIUM | 1.0 | Not Started |
| DOC-001 | OpenAPI 3.1 specification | HIGH | 3.0 | Not Started |
| SEC-007 | Admin login rate limiting | HIGH | 0.5 | Not Started |
| TEST-002 | API integration tests | HIGH | 3.0 | Not Started |

## Implementation Order
1. **API-001 (Versioning)** — add `/api/v1/` prefix to all existing endpoints; configure redirects from old paths; update core.js fetch calls to use v1 paths. This is a prerequisite for any API evolution.
2. **DOC-001 (OpenAPI spec)** — generate OpenAPI 3.1 specification documenting all v1 endpoints with request/response schemas, auth requirements, error codes, and examples. Serves as both documentation and client SDK generation source.
3. **RESTful redesign** — refactor action-named endpoints into resource-oriented paths: `/api/v1/submissions`, `/api/v1/auth/token`, `/api/v1/auth/verify`. Design future endpoints for customer portal and admin dashboard.
4. **SEC-007 (Admin rate limiting)** — add rate limiting to POST /api/v1/auth/token (5 req/5min per IP) to prevent brute-force attacks on admin login.
5. **TEST-002 (Integration tests)** — write Playwright API tests covering: successful form submission, validation errors, rate limit exceeded, JWT auth flow, admin endpoints with and without valid tokens, CSV/JSON export.

## Dependencies
| Depends On | For Feature |
|------------|-------------|
| API-001 | DOC-001 (must document v1 paths), RESTful redesign |
| DOC-001 | TEST-002 (tests validate against documented spec) |
| PostgreSQL migration | RESTful resource endpoints (need DB-backed resources) |
| (none) | SEC-007 |

## Key Files
| File | Purpose |
|------|---------|
| `workers/form-submit.js` | POST /api/form-submit handler; validation, sanitization, KV storage, email trigger |
| `workers/email.js` | POST /api/email internal handler; Resend API integration |
| `workers/form-submit.js` (admin endpoints) | POST /api/admin/login, POST /api/admin/verify, GET /api/admin/submissions, GET /api/admin/stats, GET /api/admin/submissions/export |
| `assets/js/core.js` | Client-side fetch calls to API endpoints (form submission, future portal calls) |
| `wrangler.toml` | Worker route definitions, KV bindings, environment variables |

## Acceptance Criteria
- [ ] All endpoints accessible at `/api/v1/` paths; old paths return 301 redirect or 410 Gone
- [ ] OpenAPI 3.1 spec document exists at `/api/v1/openapi.json` and is served from the Worker
- [ ] OpenAPI spec includes all endpoints with full request/response schemas, auth requirements, error responses
- [ ] Admin login endpoint is rate-limited (max 5 attempts per 5 minutes per IP)
- [ ] All API integration tests pass; coverage includes happy path, validation errors, auth failures, rate limits
- [ ] Resource naming follows REST conventions: plural nouns, consistent HTTP method usage, proper status codes
- [ ] Error responses follow consistent format: `{ "error": { "code": "STRING", "message": "Human-readable" } }`

## References
- MASTER_IMPLEMENTATION.md
- FEATURE_INDEX.md
- TECHNICAL_DEBT.md (TD-07, TD-08)
